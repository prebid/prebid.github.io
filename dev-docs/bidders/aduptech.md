---
layout: bidder
title: AdUp Technology
description: Prebid Bidder Adapter for AdUp Technology
biddercode: aduptech
tcfeu_supported: true
floors_supported: true
gvl_id: 647
media_types: banner, native
pbjs: true
pbs: true
sidebarType: 1
---

### Registration

To use, our bidding adapter requires proper setup, including an existing publisher account, as well as approval from AdUp Technology.<br/>For more information visit [www.adup-tech.com](https://www.adup-tech.com/en) or contact [info@adup-tech.com](mailto:info@adup-tech.com).

### Bid params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| :--- | :---- | :---------- | :------ | :------ |
| `publisher` | required | Unique publisher identifier. | `'prebid'` | `string` |
| `placement` | required | Unique placement identifier per publisher. | `'1234'` | `string` |
| `query` | optional | Semicolon separated list of keywords. | `'urlaub;ibiza;mallorca'` | `string` |
| `adtest` | optional | Deactivates tracking of impressions and clicks.<br/>**Should only be used for testing purposes!** | `true` | `boolean` |
| `debug` | optional | Enables debug mode.<br/>**Should only be used for testing purposes!** | `true` | `boolean` |
| `ext` | optional | Additional parameters to be included in the request. | `{"foo": "bar"}` | `object` |
