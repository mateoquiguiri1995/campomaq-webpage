# Google Analytics 4 Integration - Campomaq

This document provides a complete guide for the Google Analytics 4 integration implemented for the Campomaq website.

## Overview

The implementation includes:
- **GDPR-compliant cookie consent banner**
- **Comprehensive event tracking** for user interactions
- **Virtual pageviews** for product modal views
- **Conversion tracking** for business-critical actions
- **Development environment detection**
- **TypeScript types** for type safety

## Architecture

### Core Components

1. **Analytics Service** (`src/lib/analytics.ts`)
   - Singleton pattern for consistent tracking
   - Handles GA4 initialization and configuration
   - Manages cookie consent state
   - Provides typed tracking functions

2. **Cookie Consent Banner** (`src/app/components/ui/CookieConsentBanner.tsx`)
   - Styled to match Campomaq's yellow/black theme
   - Granular consent options (Analytics, Functional)
   - Persistent storage with expiration
   - Animated with Framer Motion

3. **Analytics Provider** (`src/app/components/providers/AnalyticsProvider.tsx`)
   - Wraps the entire application
   - Handles automatic page view tracking
   - Manages route-based analytics initialization

4. **TypeScript Types** (`src/types/analytics.ts`)
   - Complete type definitions for all events
   - Ensures consistency across the application

## Configuration

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_GA_TRACKING_ID=G-S40K0SS66Z
```

### GA4 Settings

The analytics service automatically configures:
- **Anonymize IP**: `true`
- **Cookie Flags**: `secure;samesite=none`
- **Consent Mode**: Enabled by default
- **Debug Mode**: Enabled in development

## Tracked Events

### 1. Page Views

**Automatic tracking** for all routes:
- `/` - Homepage
- `/nosotros` - About Us
- `/servicios` - Services
- `/productos` - Products
- `/contacto` - Contact

```typescript
// Automatic via AnalyticsProvider
trackPageView('/productos', 'Productos | Campomaq');
```

### 2. Virtual Page Views

**Product Modal Views** tracked as virtual pages:
- Format: `/product/[product-slug]`
- Includes product context in page title

```typescript
trackProductView({
  product_id: "motocultor-ducati-tkc-450",
  product_name: "Motocultor Ducati TKC 450",
  product_category: "Motocultores",
  product_brand: "Ducati",
  source: "modal"
});
```

### 3. Search Events

**Search queries** from:
- Main search bar
- Quick search tags
- Category searches

```typescript
trackSearch({
  search_term: "motocultor",
  search_results_count: 15,
  search_source: "productos_page"
});
```

### 4. Filter Usage

**Filter interactions**:
- Tab changes (ofertas, nuevos, tendencia)
- Brand filters
- Category selections

```typescript
trackFilter({
  filter_type: "brand",
  filter_value: "Husqvarna",
  previous_filter: "Stihl"
});
```

### 5. Category Clicks

**Homepage category navigation**:
- Product category clicks
- "Ver más" button interactions

```typescript
trackCategoryClick({
  category_name: "MOTOCULTORES",
  click_source: "homepage",
  search_query: "motocultores"
});
```

### 6. WhatsApp Interactions

**Conversion tracking** for WhatsApp clicks:
- Product-specific inquiries
- Contact context included

```typescript
trackWhatsAppClick({
  product_id: "motocultor-ducati-tkc-450",
  product_name: "Motocultor Ducati TKC 450",
  product_category: "Motocultores",
  click_source: "modal",
  page_location: window.location.href
});
```

### 7. Image Navigation

**Product gallery interactions**:
- Next/Previous navigation
- Thumbnail clicks

```typescript
trackImageNavigation({
  product_id: "motocultor-ducati-tkc-450",
  product_name: "Motocultor Ducati TKC 450",
  action: "next",
  image_index: 2,
  total_images: 5
});
```

### 8. File Downloads

**Conversion tracking** for catalog downloads:
- PDF catalog downloads
- Download source context

```typescript
trackFileDownload({
  file_name: "catalogo.pdf",
  file_type: "pdf",
  download_source: "homepage_hero"
});
```

## GA4 Event Structure

### Standard Parameters

All events include:
- `event_category` - General category (Product, Search, Filter, etc.)
- `event_label` - Descriptive label
- `value` - Numeric value (when applicable)

### Custom Parameters

Events include relevant custom parameters:
- `product_id` - Unique product identifier
- `product_name` - Product display name
- `product_category` - Product category
- `product_brand` - Product brand
- `search_term` - Search query
- `filter_type` - Type of filter applied
- `click_source` - Source of the interaction

## Cookie Consent Management

### Consent Categories

1. **Necessary Cookies** (Always Active)
   - Session management
   - Security
   - Basic functionality

2. **Analytics Cookies** (User Choice)
   - Google Analytics 4
   - Usage statistics
   - Performance monitoring

### Storage

Consent preferences stored in `localStorage`:
```javascript
{
  analytics: true,
  marketing: false,
  functional: true,
  timestamp: 1640995200000
}
```

### Expiration

Consent expires after **1 year** and users will see the banner again.

## Development vs Production

### Development Mode
- **No tracking** - Analytics disabled
- **Console logging** - Events logged to console
- **Debug mode** - GA4 debug mode enabled

### Production Mode
- **Full tracking** - All events sent to GA4
- **Consent required** - Analytics only after user consent
- **Optimized** - No debug logging

## Testing & Validation

### GA4 DebugView

1. Enable GA4 Debug Mode in development
2. Open Google Analytics → Configure → DebugView
3. Perform actions on the website
4. View real-time events and parameters

### Real-time Reports

1. Google Analytics → Reports → Realtime
2. Monitor active users and events
3. Validate event parameters and values

### Browser Console

In development, all events are logged:
```
[GA] Product View: {product_name: "Motocultor Ducati", ...}
[GA] WhatsApp Click: {product_id: "...", click_source: "modal"}
```

## Key Business Metrics

### Conversion Events

1. **Catalog Downloads** - Primary conversion goal
2. **WhatsApp Clicks** - Lead generation metric
3. **Product Modal Views** - Product interest indicator

### Engagement Metrics

1. **Search Queries** - User intent analysis
2. **Filter Usage** - Product discovery patterns
3. **Image Navigation** - Product detail engagement

### Navigation Patterns

1. **Category Clicks** - Popular product categories
2. **Page Views** - Site navigation flow
3. **Brand Filters** - Brand preference insights

## Implementation Examples

### Adding New Event Tracking

```typescript
// 1. Define type in src/types/analytics.ts
interface NewEventType {
  event_parameter: string;
  event_value: number;
}

// 2. Add tracking function to src/lib/analytics.ts
export const trackNewEvent = (data: NewEventType) => {
  analytics.event('new_event', {
    event_parameter: data.event_parameter,
    event_value: data.event_value,
    category: 'Custom',
    label: data.event_parameter
  });
};

// 3. Use in component
import { trackNewEvent } from '@/lib/analytics';

const handleAction = () => {
  trackNewEvent({
    event_parameter: 'example',
    event_value: 1
  });
};
```

### Custom Product Tracking

```typescript
// Track product interactions
const handleProductInteraction = (product: Product, action: string) => {
  trackEvent('product_interaction', {
    product_id: product.id,
    product_name: product.name,
    product_category: product.category,
    interaction_type: action,
    category: 'Product',
    label: `${product.name} - ${action}`
  });
};
```

## Troubleshooting

### Common Issues

1. **Events not appearing in GA4**
   - Check consent has been granted
   - Verify tracking ID is correct
   - Ensure not in development mode

2. **Consent banner not showing**
   - Clear localStorage
   - Check component is included in layout

3. **TypeScript errors**
   - Ensure all required parameters are provided
   - Import types from `@/types/analytics`

### Debug Steps

1. Check browser console for analytics logs
2. Verify environment variables are set
3. Use GA4 DebugView for real-time validation
4. Check Network tab for gtag requests

## Performance Considerations

### Optimization Features

1. **Lazy Loading** - GA4 script loads conditionally
2. **Consent-Based Loading** - No tracking without consent
3. **Development Bypass** - No external requests in dev mode
4. **Error Handling** - Graceful failures don't break site functionality

### Bundle Impact

- **Types only** - No runtime impact
- **Conditional loading** - Script only loads with consent
- **Tree shaking** - Unused functions removed in build

## GDPR Compliance

### Features

1. **Explicit Consent** - User must actively accept
2. **Granular Controls** - Separate categories
3. **Easy Withdrawal** - Can change preferences
4. **Data Minimization** - Only necessary data collected
5. **Anonymized IP** - IP addresses anonymized

### Legal Considerations

- Consent banner meets GDPR requirements
- Analytics data is anonymized
- Users can withdraw consent
- Clear information about cookie usage provided

---

**Created**: 2024-09-24  
**Version**: 1.0  
**Tracking ID**: G-S40K0SS66Z  
**Environment**: Production Ready