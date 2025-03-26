---
layout: bidder
title: NewsPassID
description: Local Media Consortium's NewsPassID Prebid JS Bidder Adapter
biddercode: newspassid
media_types: banner, video, native
gvl_id: 1317
tcfeu_supported: true
usp_supported: true
coppa_supported: true
schain_supported: true
userIds: all
safeframes_ok: true
deals_supported: true
floors_supported: true
fpd_supported: true
pbjs: true
pbs: false
prebid_member: false
multiformat_supported: will-bid-on-any
sidebarType: 1
---

### Description

LMC NewsPassID Prebid JS Bidder Adapter that connects to the NewsPassID demand source(s). Learn more about the NewsPassID initiative [here](https://www.newspassid.com).

This requires setup on the NewsPassID provider's end before beginning. Don't hesitate to reach out at <techsupport@newspassid.com>.

### Bid Params

{: .table .table-bordered .table-striped }

| Name      | Scope    | Description               | Example    | Type     |
|-----------|----------|---------------------------|------------|----------|
| `groupId`    | required | The ad placement group ID.             | `"test-group1"` | `string` |
| `accountId`    | optional | The NPID provided account ID.  | `"123456"` | `string` |

### Integration

#### Step 1: Add your NewsPassID accountId to the Prebid.js bidder config before users syncs and initial ads are requested (Recommended)

```javascript
window.pbjs = window.pbjs || { que: [] };
window.pbjs.que.push(function() {
  window.pbjs.setBidderConfig({
    bidders: ['newspassid'],
    config: {
      accountId: 'YOUR_ACCOUNT_ID_GOES_HERE',
    }
  });
});
```

#### Step 2: Add the `newspassid` bidder and params to your ad unit(s)

```javascript
const adUnits = [
  {
    code: 'id-of-your-banner-div',
    mediaTypes: {
      banner: {
        sizes: [[300, 250]]
      }
    },
    bids: [
      {
        bidder: 'newspassid',
        params: {
            accountId: '123456', /* an ID to identify the publisher account  - required if you skip step 1 */
            groupId: 'test-group1', /* An ID used to identify the ad placement configuration within a publisher account - required */                          
        }
      }
    ]
  }
];
```

The `accountId` and `groupId` are the only params needed for all media types we support. These values are setup by the LMC partnership before you begin.
