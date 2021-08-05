---
layout: bidder
title: Adnuntius
description: Prebid Adnuntius Bidder Adaptor
pbjs: true
biddercode: adnuntius
media_types: banner
gdpr_supported: true
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|-------------|----------|----------------------------------------------------------------------|----------|----------|
| `auId` | required | The ad unit ID `'0000000000072345'` leading zeros can be omitted. | `'0000000000072345'` | `string` |
| `network` | optional | Used if you want to make requests to multiple networks in adnuntius. | `'adnuntius'` | `string`|
| `targeting` | optional | Targeting to be sent through to adnuntius with the request. | `{ c: ['prebids'] }` | `string`|

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

### Sending segments to the ad server

There's an option to send segment id in the bidder config that will be picked up and sent to the ad server. Below is an example on how to do this:

```

			pbjs.setBidderConfig({
				bidders: ['adnuntius', 'bidderB'],
				config: {
					ortb2: {
						user: {
							data: [{
								name: "adnuntius",
								segment: [
									{ id: "1" },
									{ id: "2" }
								]
							}]
						}
					}
				}
			});

´´´
```
