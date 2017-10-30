---
layout: bidder
title: Adomik
description: Prebid Adomik Bidder Adaptor

top_nav_section: dev_docs
nav_section: reference

hide: true

biddercode: adomik

biddercode_longer_than_12: false

---



### bid params

| Name | Scope | Description | Example |
| :--- | :---- | :---------- | :------ |
| `id` | required | The seller id from Adomik | `"123456"` |
| `url` | required | Seller url provided by Adomik | `"seller-123456.adomik.com"` |
| `timeout` | optional (default is 1000) | Timeout for bid won event | `2000` |
