---
layout: bidder
title: Adnuntius
description: Prebid Adnuntius Bidder Adaptor
pbjs: true
biddercode: adnuntius
media_types: banner
gdpr_supported: false
---


### Bid Params

{: .table .table-bordered .table-striped }
| Name        | Scope    | Description                                                          | Example  | Type     |
|-------------|----------|----------------------------------------------------------------------|----------|----------|
| `auId`      | required | The ad unit ID `'0000000000072345'` leading zeros can be omitted.    | `string` |          |
| `network`   | optional | Used if you want to make requests to multiple networks in adnuntius. | `string` |          |
| `targeting` | optional | Targeting to be sent through to adnuntius with the request.          | `string` |          |



#### Targeting

The [Adnuntius Documentation](https://docs.adnuntius.com/adnuntius-advertising/requesting-ads/intro) provides detailed information on sending targeting data to the Adnuntius adserver.


#### Example

Here's an example of sending targeting information about categories to adnuntius via the bid request:
```
{
    code: "0000000000072345",
    mediaTypes: {
        banner: {
            sizes: [[980, 360], [980, 300], [980, 240], [980, 120]]
        }
    },
    bids: [
        {
            bidder: "adnuntius",
            params: {
                auId: "8b6bc",
                network: "adnuntius",
                targeting: {
                    c: ['prebids']
                }
            }
        }
    ]
}
```
