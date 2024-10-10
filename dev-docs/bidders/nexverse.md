
---
biddercode: nexverse
gdpr_supported: true
usp_supported: true
coppa_supported: true
maintainer: support@nexverse.ai
media_types:
  - banner
  - video
  - native
test_parameters:
  {
    bidder: "nexverse",
    params: {
      uid: "12345",        # Replace with actual publisher ID
      pub_id: "54321",     # Replace with actual publisher ID
      epid: "epid123"      # Replace with actual publisher unique epid
    }
  }
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

- **uid**: The publisher's unique ID.
- **pub_id**: Publisher ID.
- **epid**: Publisher's unique EPID.

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
