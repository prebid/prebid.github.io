---
layout: bidder
title: iQM
description: Prebid iQM Bidder Adaptor
pbjs: true
biddercode: iqm
pbjs_version_notes: removed in 9.0
sidebarType: 1
---

## Parameters

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description               | Example              |
| :------------ | :------- | :------------------------ | :------------------- |
| `publisherId` | required | The Publisher ID from iQM | "df5fd732-c5f3-11e7-abc4-cec278b6b50a" |
| `geo.country` | required | The publisher country| "USA" |
| `placementId` | required | The Placement ID from iQM | 23451                |
| `bidfloor`    | optional | Bid Floor                 | 0.50                 |

## Description

Module that connects to iQM demand sources

## Test Parameters

```javascript
var adUnits = [{
        code: 'div-gpt-ad-1460505748561-0',
        mediaTypes: {
          banner: {
            sizes: [[300,250]]
          }
        },

        bids: [{
          bidder: 'iqm',
          params: {
            geo:{
              country:'USA'
            },

            publisherId: 'df5fd732-c5f3-11e7-abc4-cec278b6b50a',
            placementId: 23451,
            bidfloor: 0.50
          }
        }]

      }]

```

## adUnit Video

```javascript
 var videoAdUnit = {
      code: 'video1',
      mediaTypes: {
        video: {
          playerSize: [640, 480],
          context: 'instream'
        }
      },
      bids: [{
        bidder: 'iqm',
        params: {
          // placementId: iosDevice ? 13239390 : 13232361, // Add your own placement id here. Note, skippable video is not supported on iOS
          publisherId: 'df5fd732-c5f3-11e7-abc4-cec278b6b50a',
          placementId: 23451,
          geo:{
            country:'USA'
          },

          bidfloor: 0.05,
          video: {
            placement :2,
            mimes: ['video/mp4'],
            protocols: [2,5],
            skipppable: true,
            playback_method: ['auto_play_sound_off']
          }
        }
      }]
      };

```
