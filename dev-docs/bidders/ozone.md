---
layout: bidder
title: Ozone Project
description: Prebid Ozone Project Bidder Adaptor
biddercode: ozone 
pbjs: true
media_types: banner, video
tcfeu_supported: true
userIds: criteo, id5Id, tdid, identityLink, liveIntentId, parrableId, pubCommonId, lotamePanoramaId, sharedId, fabrickId
gvl_id: 524
deals_supported: true
schain_supported: true
coppa_supported: true
usp_supported: true
floors_supported: true
prebid_member: true
sidebarType: 1
supported Aliases: lmc, venatus

---

#### Bid Params

{: .table .table-bordered .table-striped }

| Name      | Scope    | Description               | Example    | Type     |
|-----------|----------|---------------------------|------------|----------|
| `siteId`    | required | The site ID from ozone.  | `"OZONENUK0001"` | `string` |
| `publisherId`    | required | The publisher ID.  | `"4204204201"` | `string` |
| `placementId`    | required | The placement ID.  | `"0420420421"` | `string` |
| `customData`     | optional | publisher key-values used for targeting | `[{"settings":{},"targeting":{"key1": "value1", "key2": "value2"}}],` | `array` |

### Test Parameters

A test ad unit that will consistently return test creatives:

```javascript
//Banner adUnit

const adUnits = [{
                    code: 'id-of-your-banner-div',
                    mediaTypes: {
                      banner: {
                        sizes: [[300, 250], [300,600]]
                      }
                    },
                    bids: [{
                        bidder: 'ozone',
                        params: {
                            publisherId: 'OZONETST0001', /* an ID to identify the publisher account  - required */
                            siteId: '4204204201', /* An ID used to identify a site within a publisher account - required */
                            placementId: '8000000125', /* an ID used to identify the piece of inventory - required - for appnexus test use 13144370. */
                            customData: [{"settings": {}, "targeting": {"key": "value", "key2": ["value1", "value2"]}}],/* optional array with 'targeting' placeholder for passing publisher specific key-values for targeting. */                            
                        }
                    }]
                }];
                
                
//Outstream adUnit

adUnits = [{
                    code: 'id-of-your-banner-div',
                    mediaTypes: {
                            video: {
                            playerSize: [640, 360],
                            mimes: ['video/mp4'],
                            context: 'outstream'
                      }
                    },
                    bids: [{
                        bidder: 'ozone',
                        params: {
                            publisherId: 'OZONETST0001', /* an ID to identify the publisher account  - required */
                            siteId: '4204204201', /* An ID used to identify a site within a publisher account - required */
                            placementId: '8000000328', /* an ID used to identify the piece of inventory - required. */
                            customData: [{"settings": {}, "targeting": {"key": "value", "key2": ["value1", "value2"]}}],/* optional array with 'targeting' placeholder for passing publisher specific key-values for targeting. */                            
                        }
                    }]
                }];
                
//Instream adUnit

adUnits = [{
                    code: 'id-of-your-banner-div',
                    mediaTypes: {
                            video: {
                            playerSize: [640, 480],
                            mimes: ['video/mp4'],
                            context: 'instream'
                      }
                    },
                    bids: [{
                        bidder: 'ozone',
                        params: {
                            publisherId: 'OZONETST0001', /* an ID to identify the publisher account  - required */
                            siteId: '4204204201', /* An ID used to identify a site within a publisher account - required */
                            placementId: '8000000327', /* an ID used to identify the piece of inventory - required. */
                            customData: [{"settings": {}, "targeting": {"key": "value", "key2": ["value1", "value2"]}}],/* optional array with 'targeting' placeholder for passing publisher specific key-values for targeting. */                            
                        }
                    }]
                }];
```
