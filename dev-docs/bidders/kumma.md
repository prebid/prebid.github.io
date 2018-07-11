---
layout: bidder
title: Kumma
description: Prebid Kumma Bidder Adapter
top_nav_section: dev_docs
nav_section: reference
hide: true
biddercode: kumma
biddercode_longer_than_12: false
prebid_1_0_supported : true
media_types: banner, native, video
gdpr_supported: true
---

### bid params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                         | Example |
| :------------- | :------- | :---------------------------------- | :------ |
| `pubId`        | required | The publisher account ID            | `'28082'` |
| `siteId`       | required | The publisher site ID               | `'26047'` |
| `placementId`  | required | Identifies specific ad placement    | `'17394'` |
| `bidFloor`     | optional | The bid floor                       | `'0.001'` |
| `ifa`          | optional | IFA ID                              | `'XXX-XXX'` |
| `latitude`     | optional | Latitude                            | `'40.712775'` |
| `longitude`    | optional | Longitude                           | `'-74.005973'` |

### test params

```
  var adUnits = [{
          code: 'dfp-native-div',
          mediaType: 'native',
          mediaTypes: {
              native: {
                  title: {
                      required: true,
                      len: 75
                  },
                  image: {
                      required: true
                  },
                  body: {
                      len: 200
                  },
                  icon: {
                      required: false
                  }
              }
          },
          bids: [{
              bidder: 'kumma',
              params: {
                  pubId: '29521',
                  siteId: '26048',
                  placementId: '123',
              }
          }]
      },
      {
          code: 'dfp-banner-div',
          mediaTypes: {
              banner: {
                  sizes: [
                      [300, 250]
                  ],
              }
          },
          bids: [{
              bidder: 'kumma',
              params: {
                  pubId: '29521',
                  siteId: '26049',
                  placementId: '123',
              }
          }]
      },
      {
          code: 'dfp-video-div',
          sizes: [640, 480],
          mediaTypes: {
              video: {
                  context: "instream"
              }
          },
          bids: [{
              bidder: 'kumma',
              params: {
                  pubId: '29521',
                  siteId: '26049',
                  placementId: '123',
                  video: {
                      skippable: true,
                  }
              }
          }]
      }
  ];
```
