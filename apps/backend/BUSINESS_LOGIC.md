# Campomaq API — Business Logic Guide

This document explains what the API data means and how the frontend should use
it. Request parameters and complete JSON examples are documented separately in
[API_ENDPOINTS.md](API_ENDPOINTS.md).

Spanish version: [BUSINESS_LOGIC_ES.md](BUSINESS_LOGIC_ES.md) ·
[BUSINESS_LOGIC_ES.pdf](BUSINESS_LOGIC_ES.pdf)

## Data-source overview

The API currently reads from two data platforms:

| Domain | Source | Important behavior |
| --- | --- | --- |
| Product catalog and search | MongoDB | Contains frontend catalog enrichment and search-ranking fields. |
| Stock | Supabase `silver.stock` | Contains stock for the `Matriz` branch only. |
| Product commercial data | Supabase `silver.products` + `silver.stock` | Bulk current prices, IVA, costs, and Matriz stock. |
| Clients | Supabase `gold.clients` | Contains prepared six-month client metrics and three-month invoice summaries. |
| Seller dashboard | Supabase `gold.sellers` | Contains month-to-date goal data and current-year seller metrics. |
| Invoice details | Supabase `silver.sales_detail` | Contains the product lines belonging to an invoice. |
| Authentication | Supabase Auth | Access tokens are validated before protected endpoints are executed. |

Catalog and commercial data are intentionally returned separately. The
authenticated frontend matches them by `product_id` or `product_code`.

## Time windows and freshness

All relative periods are calculated by PostgreSQL using `CURRENT_DATE` when the
materialized view is refreshed:

- Six-month values are rolling values from `CURRENT_DATE - INTERVAL '6 months'`.
- Three-month invoice summaries start at
  `CURRENT_DATE - INTERVAL '3 months'`.
- Seller month-to-date values start on the first day of the current calendar
  month. Seller year-to-date values start on January 1 of the current calendar
  year.
- Days since the last purchase are the difference between `CURRENT_DATE` and
  the client's most recent purchase date.

Data does not have the same refresh frequency in every endpoint:

| Data | Refresh behavior |
| --- | --- |
| Stock Bronze data | Ingested approximately every 10 minutes. |
| Product, sales, sales-detail, and credit-note Bronze data | Ingested approximately every 30 minutes. |
| Normal Silver views | Reflect committed Bronze data immediately. |
| `silver.clients` | Refreshed daily at 02:01 UTC. |
| `gold.clients` | Refreshed hourly at minute 03. |
| `gold.sellers` | Refreshed hourly at minute 04. |
| Unparameterized `/products` cache | Can remain cached for up to 24 hours. |
| `/search` cache | Between 5 minutes and 24 hours, depending on query usage. |

Consequently, stock is not warehouse-real-time, client totals can lag the most
recent sales ingestion by roughly one Gold refresh, and a client's historical
profile fields or last-purchase date depend on the daily Silver refresh.

## Product catalog — `GET /products`

### Inclusion rule

Only products where `show_in_app` is `true` are returned. A product present in
the source catalog but marked otherwise must not appear in the app.

### Default ranking

Products are sorted using a multiplicative ranking value:

```text
popularity
× 9.0 when the product is not a spare part
× 1.2 when it has a discount greater than zero
× 1.2 when it is marked as new
```

Missing popularity is treated as `1`. This ranking intentionally favors main
machines over spare parts, then promotes discounted and new products. The
calculated ranking is used for sorting but removed from `/products` responses.

The frontend should preserve the API order unless a screen explicitly offers a
user-selected sort.

### Pagination parameters

- `limit` controls how many products are returned. `limit=all` requests the
  complete visible catalog.
- `page` selects a page only when an integer limit is active.
- Supplying `page` without `limit` activates the default 20-product page size.
- Calling `/products` without either parameter uses the complete visible-catalog
  cache when Redis is configured.

### Cache behavior

Only the request without `limit` and `page` uses the 24-hour product cache.
Parameterized product requests go directly through the MongoDB aggregation.

## Product search — `GET /search`

### Meaning of `q`

`q` is free-text product search. Leading and trailing whitespace is removed. An
empty query returns an empty array without running a database search.

The search matches at least one of these signals:

- Product name with the configured synonym mapping, boosted by `2`.
- Product name with up to one fuzzy edit, boosted by `2`.
- Brand name with up to two fuzzy edits, boosted by `1.25`.

Only products with `show_in_app = true` remain eligible.

### Search-result ranking

MongoDB's relevance score is multiplied by the following business signals:

```text
text relevance score
× popularity
× 1.9 when the product is not a spare part
× 1.15 when it has a discount greater than zero
× 1.1 when it is marked as new
```

Results are returned from highest to lowest final score. The frontend should
normally display them in that order.

### Meaning of `limit`

`limit` is the maximum number of ranked results returned. It does not represent
a page size because `/search` currently has no `page` parameter.

### Cache behavior

Search cache keys use the lowercased query and requested limit. Cache duration
depends on query activity:

| Query category | Cache lifetime |
| --- | ---: |
| Configured popular keyword | 24 hours |
| At least 10 uncached searches in the counter window | 12 hours |
| 3–9 uncached searches | 1 hour |
| 0–2 uncached searches | 5 minutes |

Search counters expire after seven days.

## Current seller — `GET /auth/me`

The Supabase access token determines the current user. If a matching row exists
in `public.seller_profiles`, the endpoint uses its `full_name` and `role`.
Otherwise:

- `name` falls back to the Supabase user's email.
- `role` falls back to `seller`.

The current implementation validates the token but does not reject a profile
whose `active` field is false. The frontend should not independently treat the
profile response as an authorization rule; authorization decisions belong in
the backend.

## Seller dashboard — `GET /sellers`

Gold contains one row for each actual seller plus a synthetic General row. The
endpoint does not return the complete table: it joins the authenticated
Supabase user to `public.seller_profiles.user_id`, then matches
`seller_profiles.seller_id` to `gold.sellers.seller_id`. Only active profiles
are eligible.

For normal sellers, `seller_id` is the seller cédula from
`raw_sales_detail.feempl_cedu`. The admin profile uses the reserved numeric
string `9999999999`, which matches the General row. A missing or inactive
mapping produces an empty response array.

### Seller identity reconciliation

The source fields do not mean the same thing in both sales datasets:

| Source | Actual seller name | Seller identifier |
| --- | --- | --- |
| `bronze.raw_sales` | `emple_vfac` | `emple_cod`, `emple_vcod` |
| `bronze.raw_sales_detail` | `feempl_nome` | `feempl_cedu` |

`raw_sales.feempl_nome` is intentionally not used as the invoice seller. Silver
normalizes the actual names, and Gold matches header and detail identities by
the uppercased, trimmed seller name. The canonical Gold identity columns are
`feempl_nome`, `feempl_cedu`, `emple_cod`, and `emple_vcod`.

### Time windows

- `currentMonthSales` covers the current calendar month through today.
- `yearTotalSales`, `yearSalesCount`, and `yearAverageTicket` cover the current
  calendar year through today.
- Category, brand, client, and product rankings use the same current-year
  window.
- The General row calculates every metric across all current-year sellers. Its
  monthly goal remains fixed at `$80,000`.
- The boundaries are recalculated with PostgreSQL `CURRENT_DATE` each time the
  materialized view refreshes.

### Invoice metrics

Invoice-level metrics use `silver.sales`:

```text
net invoice sales = invoice total - credit-note total
```

Missing invoice and credit-note totals are treated as zero.

| Response field | Meaning |
| --- | --- |
| `sellerId` | Link to `public.seller_profiles.seller_id`; normally the cédula or `9999999999` for General. |
| `sellerType` | `seller` for an individual or `general` for company-wide metrics. |
| `sellerName` | Actual seller name from `feempl_nome`, or `General`. |
| `sellerDocumentId` | `feempl_cedu`; `9999999999` for General. |
| `employeeCode` | Header field `emple_cod`; `null` for General. |
| `invoiceSellerCode` | Header field `emple_vcod`; `null` for General. |
| `monthlyGoal` | Fixed goal of `$80,000` for every seller. |
| `currentMonthSales` | Sum of net invoice sales in the current calendar month. |
| `yearTotalSales` | Sum of net invoice sales in the current calendar year. |
| `yearSalesCount` | Count of invoice rows in the current calendar year. |
| `yearAverageTicket` | Average net value of those current-year invoice rows. |

### Breakdown and ranking metrics

`salesByCategory`, `salesByBrand`, and `topProducts` use the tax-inclusive,
credit-note-adjusted `sale_with_iva` line value from `silver.sales_detail`.
`topClients` uses net invoice sales from `silver.sales`, avoiding duplicated
invoice totals when an invoice has multiple product lines.

- Category and brand arrays include all current-year groups, highest value
  first. Missing group names are returned as `Uncategorized`.
- `topClients` contains at most ten seller/client-code groups, highest value
  first. Invoice rows without a client code are excluded from this ranking.
- `topProducts` contains at most ten seller/product-code groups, highest value
  first, and includes summed quantity. Lines without a product code are
  excluded from this ranking.
- A breakdown total can differ slightly from the invoice-level total because
  one comes from invoice headers and the other from product lines.

## Clients — `GET /clients`

### Inclusion and recency filter

The endpoint always applies this filter before search and pagination:

```text
daysSinceLastPurchase < 365
```

This is a strict comparison:

- `0–364` days are included.
- Exactly `365` days and older are excluded.
- Clients without a last-purchase date are excluded because their value is
  `null`.

The purpose is to keep the seller-facing list focused on clients with activity
within roughly the last year and reduce the number of Gold rows that must be
counted, sorted, and returned.

### Meaning of query parameters

| Parameter | Business meaning |
| --- | --- |
| `q` | Finds a recent client by partial name, client code, primary telephone, secondary telephone, or email. Search is case-insensitive. It does not search clients excluded by the 365-day rule. |
| `page` | Selects a page after filtering and popularity ordering. Page numbering begins at 1. |
| `page_size` | Controls how many clients appear on one page, up to 100. |

`total` in the response is the number of clients remaining after the recency
rule and optional `q` search, before `LIMIT` and `OFFSET` are applied.

### Client ordering

The list uses a simple priority order rather than a combined or weighted score:

1. `totalSalesLast6Months`, highest first — value.
2. `salesCountLast6Months`, highest first — frequency.
3. `daysSinceLastPurchase`, lowest first — recency.
4. Client name and code — stable tie-breakers.

This means value has priority over frequency, and frequency has priority over
recency. Recency changes the position only when the earlier values tie.

### Client fields and calculations

| Response field | Meaning |
| --- | --- |
| `id` | Stable client code used to join client sales records. |
| `name` | Name from the client's most recent sales-detail record. |
| `address` | Address from the most recent client record. Can be `null`. |
| `phonePrimary` | Primary telephone from the most recent client record. Can be `null`. |
| `phoneSecondary` | Secondary telephone from the most recent client record. Can be `null`. |
| `email` | Lowercased email from the most recent client record. Can be `null`. |
| `totalSalesLast6Months` | Sum of invoice totals minus their associated credit-note totals during the rolling six-month window. |
| `salesCountLast6Months` | Number of invoice records for the client during the rolling six-month window. |
| `purchaseMonthsLast6Months` | Number of distinct calendar months containing at least one purchase inside the rolling six-month window. Multiple invoices in one month count as one purchasing month. |
| `frequencyClassification` | Human-readable band derived from `purchaseMonthsLast6Months`. |
| `lastPurchaseDate` | Most recent invoice date found across the client's full sales-detail history. |
| `daysSinceLastPurchase` | Database current date minus `lastPurchaseDate`. Lower means more recent. |
| `recencyStatus` | Human-readable band derived from `daysSinceLastPurchase`. |
| `recentInvoices` | Invoice summaries from the rolling three-month window, newest first. |

### Net sales

For the six-month totals and recent invoice totals:

```text
net sales = invoice total - credit-note total
```

Missing invoice or credit-note amounts are treated as zero. Therefore,
`totalSalesLast6Months` is a net amount, not the original gross invoice value.

### Frequency classification

Frequency measures purchasing continuity, not the raw number of invoices:

| Classification | Distinct purchasing months in the last six months |
| --- | ---: |
| `Highly recurrent` | 6 or more |
| `Recurrent` | 4–5 |
| `Occasional` | 2–3 |
| `One-time` | 1 |
| `Inactive` | 0 |

A client can have many invoices in one month and still count as one purchasing
month for this classification.

### Recency status

| Status | Days since last purchase |
| --- | ---: |
| `Active` | 0–45 |
| `At risk` | 46–90 |
| `Inactive` | More than 90, or no purchase date in Gold |

An `Inactive` classification and an `Inactive` recency status mean different
things: classification measures purchasing months in the six-month window,
while recency status measures elapsed days since the latest purchase.

### Recent invoice summaries

`recentInvoices` contains only invoices dated within the rolling three-month
window and is ordered by invoice date and invoice number, newest first.

| Invoice field | Meaning |
| --- | --- |
| `invoiceNumber` | Unique invoice number and key for `/invoices/{invoiceNumber}`. |
| `invoiceDate` | Invoice date. |
| `paymentType` | Payment description stored on the invoice, such as cash or credit. |
| `itemCount` | Number of non-null invoice-item IDs belonging to the invoice. This represents line count, not the sum of product quantities. |
| `total` | Net invoice amount after subtracting its associated credit-note total. |

## Stock — `GET /stock` and `GET /stock/{productCode}`

### Stock scope

Stock comes from the Silver stock view and includes only source rows whose
branch name is `Matriz`. It is not a sum across every branch or warehouse.

The numeric value is returned as stored by the source system. The API does not
clamp negative values to zero and does not translate the number into labels
such as "available" or "out of stock." Any presentation rule belongs in the
frontend product UI.

### Complete stock list

`GET /stock` returns all rows with a non-null product code, ordered by product
code. The intended app-bootstrap behavior is:

1. Load `/products` and `/stock` in parallel.
2. Build a lookup from stock `product_code`.
3. Merge stock into catalog products with the same `product_code`.

Stock is not embedded in `/products` or `/search` so PostgreSQL availability and
latency do not affect the public MongoDB product endpoints.

### Single-product stock

`GET /stock/{productCode}` performs an exact product-code match. It is intended
for refreshing one product card without reloading the complete stock table.

- Matching is exact; the API does not normalize case or whitespace.
- A missing code returns `404`; it does not return a synthetic stock value of
  zero.
- The frontend should URL-encode the product code before using it in the path.

## Product commercial data — `GET /product-commercial-data`

This authenticated bulk endpoint filters products through
`catalog.product_enrichment.show_in_app = true`, then joins `silver.products`
to `silver.stock` by `product_code`. It returns each visible product with its
Matriz stock, cash/credit/card prices, IVA flag, last cost, and average cost.
The endpoint is intended to be loaded once alongside `/products`; it does not
require one HTTP request per product. Cost and price calculations remain
frontend concerns.

## Invoice details — `GET /invoices/{invoiceNumber}`

Invoice numbers are unique, so the path identifies one invoice without an
additional client or date parameter.

The endpoint returns its product lines ordered by the internal invoice-item ID.
It intentionally returns line-level detail rather than repeating the complete
invoice header.

| Response field | Meaning |
| --- | --- |
| `invoiceNumber` | Unique invoice number. |
| `date` | Invoice date copied from its sales-detail records. |
| `items` | Product lines associated with the invoice. |
| `items[].productCode` | Product business code. Can be `null` if absent in the source. |
| `items[].productName` | Product description recorded on the sale. |
| `items[].quantity` | Quantity on that invoice line. |
| `items[].saleWithIva` | Tax-inclusive line amount after line discount and the available credit-note adjustment. |
| `items[].creditNoteValue` | Credit-note value stored for the line; can be `null`. |

The frontend flow is to take `invoiceNumber` from a client's `recentInvoices`
array and call this endpoint when the seller opens that invoice. A `404` means
the invoice has no corresponding Silver sales-detail rows.

## Chat — `POST /chat` and `POST /chat/stream`

Both chat endpoints apply the same assistant behavior:

- Respond in concise, clear Spanish.
- Focus on agricultural machinery, spare parts, implements, maintenance, usage,
  and initial commercial guidance.
- Ask one clarification question when essential information is missing.
- Do not invent stock, prices, warranties, delivery times, or policies.
- Recommend contacting Campomaq when the answer is not known.

The only input field is `message`. The non-streaming endpoint returns the full
answer, while the streaming endpoint emits partial text and a final completion
event. The two endpoints do not currently carry conversation history; each
request is treated as a new exchange containing one user message.

## Health — `GET /`, `/health/live`, `/health`, `/health/ready`

- `/` identifies the service and confirms that routing works.
- `/health/live` only confirms that the Flask process can respond. It does not
  validate databases or external services.
- `/health` and `/health/ready` are equivalent readiness checks.

Readiness becomes degraded when MongoDB or PostgreSQL cannot be reached, or
when Supabase Auth is not configured. Redis and OpenAI configuration/status are
reported in `checks`, but their current result does not independently change
the overall readiness status.
