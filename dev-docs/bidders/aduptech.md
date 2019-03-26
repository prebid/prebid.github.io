---
layout: bidder
title: Ad Up Technology
description: Prebid Bidder Adapter for Ad Up Technology
hide: true
biddercode: aduptech
biddercode_longer_than_12: false
media_types: banner
gdpr_supported: true
---

### Note:

The Ad Up Technology Bidding adapter requires setup and approval before beginning.   
For more information visit [www.adup-tech.com](http://www.adup-tech.com/en).

### Bid params

{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example |
| :--- | :---- | :---------- | :------ |
| `publisher` | required | Unique publisher id | `'1234'` |
| `placement` | required | Unique placement id per publisher | `'5678'` |
| `query` | optional | Semicolon separated list of keywords | `'urlaub;ibiza;mallorca'` |
| `adtest` | optional | Impressions and clicks will not be tracked if enabled | `true` |
