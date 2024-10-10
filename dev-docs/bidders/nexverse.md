
---
biddercode: nexverse
gdpr_supported: true
usp_supported: true
coppa_supported: true
maintainer: support@nexverse.ai
media_types: banner, native, video
---

# Nexverse Adapter

The Nexverse adapter requires some initial setup. For assistance or setup instructions, please contact us at [support@nexverse.ai](mailto:support@nexverse.ai).

## Supported Media Types

The Nexverse adapter supports the following media types:

- Banner
- Video
- Native

## Configuration

To configure the Nexverse adapter, you will need the following parameters:

| Name   | Scope    | Description              | Example    | Type   |
|--------|----------|--------------------------|------------|--------|
| uid    | required | Publisher's unique ID     | "12345"    | string |
| pub_id | required | Publisher ID              | "54321"    | string |
| epid   | optional | Publisher's unique EPID   | "epid123"  | string |

## Test Parameters

You can test the Nexverse adapter with the following test parameters:

```javascript
var adUnits = [
  {
    code: 'div-ad-1',
    mediaTypes: {
      banner: {
        sizes: [[300, 250], [320, 50]],
      },
    },
    bids: [
      {
        bidder: 'nexverse',
        params: {
          uid: '12345',
          pub_id: '54321',
          epid: 'epid123',
        },
      },
    ],
  },
];
```

## GDPR, CCPA, COPPA Support

Nexverse complies with GDPR, CCPA, and COPPA regulations. If you have further questions regarding compliance, feel free to reach out to us.
