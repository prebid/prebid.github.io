---
layout: bidder
title: Platform.io
description: Prebid Platform.io Bidder Adapter
pbjs: true
biddercode: platformio
media_types: native, video
gdpr_supported: true
---

### Disclosure

This bidder sets `adId` on the bid response and hasn't responded to the Prebid.js team to confirm uniqueness
of this value. See [Issue 6381](https://github.com/prebid/Prebid.js/issues/6381).

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
              bidder: 'platformio',
              params: {
                  pubId: '29521', 
                  siteId: '26048',
                  placementId: '123',
                  bidFloor: '0.001', // optional
                  ifa: 'XXX-XXX', // optional
                  latitude: '40.712775', // optional
                  longitude: '-74.005973', // optional
              }
          }]
      },
      {
          code: 'dfp-banner-div',
          mediaTypes: {
              banner: {
                  sizes: [
                      [300, 250],[300,600]
                  ],
              }
          },
          bids: [{
              bidder: 'platformio',
              params: {
                  pubId: '29521',
                  siteId: '26049',
                  placementId: '123',
              }
          }]
      },
      {
          code: 'dfp-video-div',
          mediaTypes: {
              video: {
                  playerSize: [[640, 480]],
                  context: "instream"
              }
          },
          bids: [{
              bidder: 'platformio',
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
