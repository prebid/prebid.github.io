---
layout: bidder
title: DiscoveryDsp
description: DiscoveryDsp Prebid Bidder Adapter
biddercode: discovery
media_types: banner,native
pbjs: true
enable_download: true
sidebarType: 1
---
### Note:

The DiscoveryDSP Bidding adapter requires setup before beginning. Please contact us at <media-support@popin.cc>

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `token`      | required | publisher token        | `'1e100887dd614b7f69fdd1360437'`    | `string` |
| `test` | recommend | 0(default): production env mode. <br> 1: dev env mode and no charge.we will bid Higher frequency to make debug easier.  | `1/0` | `Number` |
| `tagid`      | required | tagid        | `'abcdefg'`    | `string` |
| `publisher`      | required | publisher id         | `'abcdefg'`    | `string` |

#### Prebid Server Test Request

banner
```
var adUnits = [
      {
        code: "test-div-1",
        mediaTypes: {
          banner: {
            sizes: [[300, 250]],
          },
        },
        bids: [
          {
            bidder: "discovery",
            params: {
              token: "a4e66b955e3b19b88a357b4ace01ac31",
              tagid: 'test_tagid',
              publisher: 'test_publisher'
            },
          },
        ],
      },
    ];
```

native
```
var adUnits = [
      {
        code: "test-div-2",
        mediaTypes: {
          native: {
            title: {
              required: true
            },
            image: {
              required: true
            }
          }
        },
        bids: [
          {
            bidder: "discovery",
            params: {
              token: "03d467db07075683b0c373b6b3d3113c",
              tagid: 'test_tagid',
              publisher: 'test_publisher'
            },
          },
        ],
      },
    ];
```

`If the bid interface status code is 200, the bid is successful, if the status code is 204, there is no bid, please send the request parameters to media-support@popin.cc, we will be the first time to feedback`
