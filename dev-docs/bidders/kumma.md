---
layout: bidder
title: Kumma
description: Prebid Kumma Bidder Adapter
pbjs: true
biddercode: kumma
media_types: banner, native, video
gdpr_supported: true
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description                      | Example        | Type     |
|---------------|----------|----------------------------------|----------------|----------|
| `pubId`       | required | The publisher account ID         | `'28082'`      | `string` |
| `siteId`      | required | The publisher site ID            | `'26047'`      | `string` |
| `placementId` | required | Identifies specific ad placement | `'17394'`      | `string` |
| `bidFloor`    | optional | The bid floor                    | `'0.001'`      | `string` |
| `ifa`         | optional | IFA ID                           | `'XXX-XXX'`    | `string` |
| `latitude`    | optional | Latitude                         | `'40.712775'`  | `string` |
| `longitude`   | optional | Longitude                        | `'-74.005973'` | `string` |

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
