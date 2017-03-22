---
layout: bidder
title: Smart AdServer
description: Prebid Smart AdServer Bidder Adaptor

top_nav_section: dev_docs
nav_section: reference

hide: true

biddercode: smartadserver

biddercode_longer_than_12: false

---

### Note:
The Smart AdServer bidder adaptor requires setup and approval from the Smart AdServer Service team. Please reach out to your account manager for more information and start using it.

### bid params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example |
| :--- | :---- | :---------- | :------ |
| `domain` | required | The network domain | `'http://prg.smartadserver.com', 'https://prg.smartadserver.com'` |
| `siteId` | required | The placement site ID | `1234` |
| `pageId` | required | The placement page ID | `1234` |
| `formatId` | required | The placement format ID | `1234` |
| `target` | optional | The keyword targeting (not yet supported) | `"sport=tennis"` |
| `currency` | optional | Override the default currency code (ISO 4217) of the ad request. (Default: `"USD"`) | `"EUR"` |
