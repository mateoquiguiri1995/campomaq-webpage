# Campomaq API — Frontend Reference

This document describes the HTTP endpoints currently exposed by the Flask
backend. Replace `{API_BASE_URL}` in the examples with the URL for the current
environment.

For metric definitions, ranking rules, data freshness, and frontend
interpretation, see [BUSINESS_LOGIC.md](BUSINESS_LOGIC.md).

Spanish version: [API_ENDPOINTS_ES.md](API_ENDPOINTS_ES.md) ·
[API_ENDPOINTS_ES.pdf](API_ENDPOINTS_ES.pdf)

## Authentication

Public endpoints do not require an access token. Protected endpoints require a
Supabase access token in the `Authorization` header:

```http
Authorization: Bearer <supabase_access_token>
```

The frontend should obtain this token from the authenticated Supabase session.

```ts
const headers = {
  Authorization: `Bearer ${session.access_token}`,
};
```

Missing, malformed, invalid, or expired tokens return HTTP `401`:

```json
{
  "error": "A valid Bearer access token is required"
}
```

## Endpoint summary

| Method | Path | Authentication | Purpose |
| --- | --- | --- | --- |
| `GET` | `/` | Public | Basic service status |
| `GET` | `/health/live` | Public | Liveness check |
| `GET` | `/health` | Public | Dependency readiness check |
| `GET` | `/health/ready` | Public | Alias of `/health` |
| `GET` | `/products` | Public | Product catalog |
| `GET` | `/search` | Public | Product search |
| `POST` | `/chat` | Public | Complete chat response |
| `POST` | `/chat/stream` | Public | Streaming chat response |
| `GET` | `/auth/me` | Bearer token | Current seller profile |
| `GET` | `/sellers` | Bearer token | Seller dashboard metrics |
| `GET` | `/clients` | Bearer token | Filtered and paginated clients |
| `GET` | `/stock` | Bearer token | Stock for every product |
| `GET` | `/stock/{productCode}` | Bearer token | Stock for one product |
| `GET` | `/product-commercial-data` | Bearer token | Bulk stock, prices, IVA, and costs |
| `GET` | `/invoices/{invoiceNumber}` | Bearer token | Product lines for one invoice |

## Products

### `GET /products`

Returns visible products ordered by the backend's product ranking. The response
is a JSON array, not a pagination envelope.

Query parameters:

| Parameter | Type | Default | Behavior |
| --- | --- | --- | --- |
| `limit` | integer or `all` | all products | Integer values are constrained to `1–200`. `all` returns every visible product. |
| `page` | positive integer | `1` | Applies only when an integer limit is active. Supplying `page` without `limit` uses the default limit of 20. |

Examples:

```http
GET {API_BASE_URL}/products
GET {API_BASE_URL}/products?limit=20&page=2
GET {API_BASE_URL}/products?limit=all
```

Typical response:

```json
[
  {
    "product_id": 123,
    "product_code": "P001",
    "product_name": "Motocultor",
    "brand_name": "Example Brand",
    "price_cash": 1250.0,
    "description": "Product description",
    "category_name": "Agricultural machinery",
    "link": "/products/motocultor",
    "show_in_app": true,
    "is_spare_part": false,
    "new_product": false,
    "discount": 0
  }
]
```

Product objects originate from the MongoDB catalog and can contain additional
catalog fields. Do not rely on every optional field being present.

### `GET /search`

Searches visible products by product name and brand.

Query parameters:

| Parameter | Type | Default | Behavior |
| --- | --- | --- | --- |
| `q` | string | empty | Search text. An empty value returns `[]`. |
| `limit` | integer | 20 | Constrained to `1–20` by the current default configuration. |

Example:

```http
GET {API_BASE_URL}/search?q=tractor&limit=10
```

The response is an array of product objects. Search results can additionally
include ranking fields such as `score` and `final_score`.

## Authentication profile

### `GET /auth/me`

Returns the profile associated with the authenticated Supabase user.

```http
GET {API_BASE_URL}/auth/me
Authorization: Bearer <token>
```

Response:

```json
{
  "id": "11111111-2222-3333-4444-555555555555",
  "name": "Seller Name",
  "email": "seller@example.com",
  "role": "seller"
}
```

If no seller profile exists, `name` falls back to the Supabase email and `role`
falls back to `seller`.

## Seller dashboard

### `GET /sellers`

Returns the `gold.sellers` row linked to the authenticated user through
`public.seller_profiles.seller_id`. The response remains a JSON array for API
compatibility, but contains at most one item:

- A normal user receives the row whose `sellerId` matches their cédula.
- The admin profile mapped to `9999999999` receives the company-wide General
  row.
- A missing mapping, inactive profile, or mapping without a Gold row returns
  an empty array.

```http
GET {API_BASE_URL}/sellers
Authorization: Bearer <token>
```

Response:

```json
[
  {
    "sellerId": "1717171717",
    "sellerType": "seller",
    "sellerName": "Ana Vendedora",
    "sellerDocumentId": "1717171717",
    "employeeCode": 12.0,
    "invoiceSellerCode": 34.0,
    "monthlyGoal": 80000.0,
    "currentMonthSales": 21500.5,
    "yearTotalSales": 182000.75,
    "yearSalesCount": 40,
    "yearAverageTicket": 4550.02,
    "salesByCategory": [
      {
        "categoryName": "Maquinaria",
        "totalValue": 90000.0
      }
    ],
    "salesByBrand": [
      {
        "brandName": "STIHL",
        "totalValue": 80000.0
      }
    ],
    "topClients": [
      {
        "clientCode": "C001",
        "clientName": "Agricola Uno",
        "totalValue": 50000.0
      }
    ],
    "topProducts": [
      {
        "productCode": "P001",
        "productName": "Motocultor",
        "quantity": 12.0,
        "totalValue": 30000.0
      }
    ]
  }
]
```

`monthlyGoal` is currently fixed at `$80,000` for every seller.
`currentMonthSales` is calendar month-to-date. All `year...` fields and all
four JSON arrays use current-calendar-year data through today. Category and
brand arrays contain every group; client and product arrays contain at most ten
entries each.

The General response uses this identity:

```json
{
  "sellerId": "9999999999",
  "sellerType": "general",
  "sellerName": "General",
  "sellerDocumentId": "9999999999",
  "employeeCode": null,
  "invoiceSellerCode": null,
  "monthlyGoal": 80000.0
}
```

Its goal remains `$80,000`; its sales, counts, average ticket, breakdowns, and
top-ten lists are recalculated across all sellers.

## Clients

### `GET /clients`

Returns a paginated list of clients. Only clients with
`daysSinceLastPurchase < 365` are included.

Clients are ordered by:

1. `totalSalesLast6Months`, descending.
2. `salesCountLast6Months`, descending.
3. `daysSinceLastPurchase`, ascending.
4. Name and client code as deterministic tie-breakers.

Query parameters:

| Parameter | Type | Default | Validation |
| --- | --- | --- | --- |
| `q` | string | empty | Maximum 100 characters. Searches name, client code, both telephone fields, and email. |
| `page` | positive integer | `1` | Must be at least 1. |
| `page_size` | positive integer | `20` | Must be between 1 and 100. |

Example:

```http
GET {API_BASE_URL}/clients?q=agricola&page=1&page_size=20
Authorization: Bearer <token>
```

Response:

```json
{
  "items": [
    {
      "id": "C001",
      "name": "Agricola Uno",
      "address": "Quito",
      "phonePrimary": "022222222",
      "phoneSecondary": null,
      "email": "cliente@example.com",
      "totalSalesLast6Months": 1250.75,
      "salesCountLast6Months": 4,
      "purchaseMonthsLast6Months": 3,
      "frequencyClassification": "Occasional",
      "lastPurchaseDate": "2026-07-15",
      "daysSinceLastPurchase": 18,
      "recencyStatus": "Active",
      "recentInvoices": [
        {
          "invoiceNumber": 123,
          "invoiceDate": "2026-07-15",
          "paymentType": "EFECTIVO",
          "itemCount": 2,
          "total": 500.25
        }
      ]
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 1
}
```

`total` is the number of clients matching both the 365-day filter and the
optional search, before pagination. `recentInvoices` contains invoices from the
last three months. Its `invoiceNumber` can be passed to the invoice endpoint.

Possible classifications:

| Field | Possible values |
| --- | --- |
| `frequencyClassification` | `Highly recurrent`, `Recurrent`, `Occasional`, `One-time`, `Inactive` |
| `recencyStatus` | `Active`, `At risk`, `Inactive` |

## Stock

Stock is intentionally separate from product catalog responses. The frontend
matches stock to products using `product_code`.

### `GET /stock`

Returns stock for all products. The intended frontend flow is to request this
once in parallel with the product catalog and merge the arrays by product code.

```http
GET {API_BASE_URL}/stock
Authorization: Bearer <token>
```

Response:

```json
[
  {
    "product_code": "P001",
    "stock": 12.0
  },
  {
    "product_code": "P002",
    "stock": 0.0
  }
]
```

### `GET /stock/{productCode}`

Returns current stock for one product. Use this to refresh a product card
without downloading the complete stock list again. URL-encode the product code
before placing it in the path.

```http
GET {API_BASE_URL}/stock/P001
Authorization: Bearer <token>
```

Response:

```json
{
  "product_code": "P001",
  "stock": 7.0
}
```

Returns HTTP `404` when the product code is not present:

```json
{
  "error": "Product stock not found"
}
```

## Product commercial data

### `GET /product-commercial-data`

Returns commercial data directly from Supabase for products whose
`show_in_app` flag is true. Request it once and merge it with `/products` using
`product_id` or `product_code`.

```http
GET {API_BASE_URL}/product-commercial-data
Authorization: Bearer <token>
```

```json
[
  {
    "product_id": 1155,
    "product_code": "P001",
    "stock": 3.0,
    "price_cash": 100.0,
    "price_credit": 110.0,
    "price_card": 120.0,
    "iva": true,
    "last_cost": 70.0,
    "average_cost": 65.0
  }
]
```

## Invoice details

### `GET /invoices/{invoiceNumber}`

Returns every product line for one invoice. `invoiceNumber` must contain only
integer digits.

```http
GET {API_BASE_URL}/invoices/123
Authorization: Bearer <token>
```

Response:

```json
{
  "invoiceNumber": 123,
  "date": "2026-07-15",
  "items": [
    {
      "productCode": "P001",
      "productName": "Motocultor",
      "quantity": 2.0,
      "saleWithIva": 500.25,
      "creditNoteValue": 25.5
    }
  ]
}
```

`creditNoteValue` can be `null`. Returns HTTP `404` when no invoice exists:

```json
{
  "error": "Invoice not found"
}
```

## Chat

### `POST /chat`

Request body:

```json
{
  "message": "Which machine is suitable for a small farm?"
}
```

Response:

```json
{
  "reply": "Chat response",
  "model": "gpt-4o-mini"
}
```

An empty or missing `message` returns HTTP `400`.

### `POST /chat/stream`

Accepts the same JSON body as `/chat` and returns
`Content-Type: text/event-stream`.

Text chunks:

```text
data: {"delta":"partial response"}
```

Completion event:

```text
event: done
data: {"reply":"complete response"}
```

Error event after streaming has started:

```text
event: error
data: {"error":"error description"}
```

Because this is a `POST` endpoint, use a streaming `fetch` implementation rather
than the browser's native `EventSource`, which only performs `GET` requests.

## Health endpoints

### `GET /`

```json
{
  "service": "campomaq-api",
  "status": "ok"
}
```

### `GET /health/live`

Returns HTTP `200` while the application process is running:

```json
{
  "status": "alive"
}
```

### `GET /health` and `GET /health/ready`

Checks MongoDB, PostgreSQL, Redis, OpenAI configuration, and Supabase Auth
configuration. Returns HTTP `200` when ready or `503` when degraded.

```json
{
  "status": "ready",
  "service": "campomaq-api",
  "checks": {
    "mongo": "ok",
    "postgres": "ok",
    "openai": "configured",
    "redis": "ok",
    "supabase_auth": "configured"
  }
}
```

## Error responses

JSON errors use this general shape:

```json
{
  "error": "Human-readable message"
}
```

Server and dependency failures can also contain `details`:

```json
{
  "error": "Database unavailable",
  "details": "RuntimeError"
}
```

Common status codes:

| Status | Meaning |
| --- | --- |
| `200` | Successful request |
| `400` | Invalid query parameter or request body |
| `401` | Missing or invalid Supabase access token |
| `404` | Product stock, invoice, or route not found |
| `500` | Product search or chat request failed |
| `503` | Authentication, database, or readiness dependency unavailable |

## Recommended seller-app loading flow

After Supabase authentication:

1. Call `/auth/me` to load the seller profile.
2. Load `/products` and `/product-commercial-data` in parallel.
3. Merge the arrays using `product_id` (preferred) or `product_code`.
4. Load `/clients` only on screens that need client data.
5. When a seller opens a product card, refresh it through
   `/stock/{productCode}` if necessary.
6. When a seller selects an item from `recentInvoices`, request
   `/invoices/{invoiceNumber}` for its product lines.
