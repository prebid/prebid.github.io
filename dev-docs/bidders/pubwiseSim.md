---
layout: bidder
title: PubWise Bid Simulator
description: Allows configurable bids, latency and sizes to be generated for testing.

top_nav_section: dev_docs
nav_section: reference

hide: true

biddercode: pubwiseSim

biddercode_longer_than_12: false

---

### description

PubWise Sim is an 'echo' bidder for testing and troubleshooting. Sample uses:
* verify the interaction of the ad server line items by forcing a response with a particular bid value
* introduce latency in the bidding process to test page timeouts
* test the display of mismatched sizes

On an organizational basis, PubWise Sim lets a team integrate, test and verify a Prebid site integration without ever running demand partner tags. Reducing confusion, improper serving and providing more accuracy.

### bid params

{: .table .table-bordered .table-striped }
| Param Name | Valid Types | Description |
| :--- | :--- | :--- |
| site_id | string | GUID from PubWise.io backend, unique to each site. |
| width | integer | Width for the requested ad unit. |
| height | integer | Height for the requested ad unit. |
| cpm | float | CPM float in dollars that you would like returned. |
| delay | integer | Millseconds to add to call return. Useful for simulating timeouts or other longer response scenarios. |
