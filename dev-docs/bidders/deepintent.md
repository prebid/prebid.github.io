---
layout: bidder
title: Deepintent
description: Prebid Deepintent Bidder Adaptor
hide: true
biddercode: deepintent
media_types: banner
gdpr_supported: false
---

### Bid Params

| Name          | Scope    | Description        | Example                      | Type     |
|---------------|----------|--------------------|------------------------------|----------|
| `tagId`       | mandatory| Ad Tag Id             | `'1399'`                  | `string` |
| `height`      | optional | height of the creative| `350`                     | `string` |
| `width`       | optional | width of the creative | `250`                     | `string` |
| `custom`      | optional | custom key value params| `'{"position":"right-box"}''`| `object` |
| `user`        | optional | user params according to IAB standards | `'{"gender":"F"}''`| `object` |

### Configuration

Deepintent recommends the UserSync configuration below.  Without it, the Deepintent adapter will not able to perform user syncs, which lowers match rate and reduces monetization.


```javascript
pbjs.setConfig({
  userSync: {
    filterSettings: {
      iframe: {
        bidders: '*',      // '*' represents all bidders
        filter: 'include'
      }
    }
  }
});
```
### AdUnit Format for Banner
```javascript
var adUnits = [
            {
                code: 'div-22',
                mediaTypes: {
                    banner: {
                        sizes: [
                            [300, 250],
                            [300, 600]
                         ]
                    }
                },
                bids: [{
                    bidder: 'deepintent',
                    params: {
                        tagId: "1399",
                        height: 300,
                        width: 250,
                        user: {
                            gender: "F",
                            uid: "publisher_uid",
                            buyeruid: "test_buyeruid",
                            yob: 2000  
                        },
                        custom: {
                            "position": "right-box"
                        }
                    }
                }]
            }
        ];
```

