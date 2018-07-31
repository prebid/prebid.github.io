---
layout: bidder
title: DistrictmDMX
description: Prebid DistrictmDMX Bidder Adaptor

top_nav_section: dev_docs
nav_section: reference

hide: true

biddercode: districtmDMX

biddercode_longer_than_12: false


---



### bid params
##### Setting for Prebid version 1.0 and above  

{: .table .table-bordered .table-striped }


| Name       | Scope    | Description         | Example          |
|------------|----------|---------------------|------------------|
| `dmxid`    | required | Placement Id        |                  |
| `memberid` | required | Account id          |                  |

=======

##### Prebid 0.34~ legacy

{: .table .table-bordered .table-striped }

| Name       | Scope    | Description | Example | Type     |
|------------|----------|-------------|---------|----------|
| `id`       | required |             |         | `string` |
| `floor`    | optional |             |         | `string` |
| `revShare` | optional |             |         | `string` |
| `currency` | optional |             |         | `string` |

