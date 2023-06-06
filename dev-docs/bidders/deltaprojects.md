---
layout: bidder
title: Delta Projects
description: Prebid Delta Projects Bidder Adapter
biddercode: deltaprojects
gdpr_supported: true
gvl_id: 209
media_types: banner
safeframes_ok: false
floors_supported: true
pbjs: true
sidebarType: 1
---

### Note
Contact publishers@deltaprojects.com to get a publisher id and to agree on a currency. Delta Projects
will always bid and log values in the agreed upon currency, utilizing the currency module if necessary and available.

### Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                                              | Example         | Type     |
|----------------|----------|--------------------------------------------------------------------------|-----------------|----------|
| `publisherId`  | required | Publisher ID from Delta Projects. Contact publishers@deltaprojects.com   | `'4'`           | `string` |
| `currency`     | optional | The bid currency agreed with Delta Projects.                             | `'SEK'`         | `string` |
| `siteId`       | optional | Site ID from Delta Projects.                                             | `'example.com'` | `string` |
| `tagId`        | optional | Identifier for specific ad placement or ad tag.                          | `'1234'`        | `string` |
| `test`         | optional | Indicate test model. Don't set anything if it is not in test mode.       | `'true'`        | `string` |

### Example
#### Banner
```
var adUnits = [
  {
    code: 'adunit-code',
    mediaTypes: {
      banner: {
        sizes: [[300, 250]]
      }
    },
    bids: [
      {
          bidder: 'deltaprojects',
          params: {
              publisherId: '4',             // publisherId from Delta Projects.
              currency: 'SEK',              // the currency agreed with Delta Projects.
              siteId: 'example.com',        // siteId from Delta Projects.
              tagId: 'tagId123',            // id for ad placement or ad tag. 
              test: 'true',                 // disable test mode by remove this parameter.
          }
      }
    ]
  }
];
```
