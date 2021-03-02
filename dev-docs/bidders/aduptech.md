---
layout: bidder
title: AdUp Technology
description: Prebid Bidder Adapter for AdUp Technology
pbjs: true
biddercode: aduptech
media_types: banner
gdpr_supported: true
---

### Note:

The AdUp Technology bidding adapter requires setup and approval before beginning.
For more information visit [www.adup-tech.com](https://www.adup-tech.com/) or contact [info@adup-tech.com](mailto:info@adup-tech.com).

### Bid params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example |
| :--- | :---- | :---------- | :------ |
| `publisher` | required | Unique publisher id | `'1234'` |
| `placement` | required | Unique placement id per publisher | `'5678'` |
| `query` | optional | Semicolon separated list of keywords | `'urlaub;ibiza;mallorca'` |
| `adtest` | optional | Impressions and clicks will not be tracked if enabled | `true` |
