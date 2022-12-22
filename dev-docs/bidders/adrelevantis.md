---
layout: bidder
title: Adrelevantis
description: Prebid Adrelevantis (adrelevantis.xyz) Bidder Adaptor
biddercode: adrelevantis
media_types: banner, video, native
fpd_supported: true
pbjs: true
sidebarType: 1
---

### Note:
This adapter is for displaying ads relevant to page content. Page content is analyzed dynamically in realtime to get its IAB Categories and keywords. The IAB Categories and keywords are sent as First Party Data of the bidder. DSP can, then, bid on the IAB Categories and keywords. You can find more info at (https://adrelevantis.xyz/2020/06/28/content-driven-header-bidding-with-prebid-js/).

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description | Example | Type     |
|---------------|----------|-------------|---------|----------|
| `placementId` | required |  Placement id          | `234234`   | `integer` |
| `cpm`         | optional | forces bidder to insert custom cpm bid            |   0.50      | `decimal`  |

#### First Party Data
Page content is analyzed at DOMContentLoaded event. The results (keywords and categories) are set as fpd of the bidder prior to requesting bids.

```
pbjs.setBidderConfig({
	bidders: ['adrelevantis'],
	config: {
		ortb2: {
			site: {
				keywords: keywords,
				ext: {
					data: {
						category: categories
					}
				}
			}
		}
	}
});
```
