---
layout: bidder
title: Onomagic
description: Prebid Onomagic Bidder Adaptor
top_nav_section: dev_docs
nav_section: reference
pbjs: true
biddercode: onomagic
sidebarType: 1
---

### Note

The Onomagic bidder adapter requires setup and approval from the Onomagic team. Please reach out to your account manager for more information and to start using it.

### Bid Params

{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example | Type |
| ---- | ----- | ----------- | ------- | ---- |
| `publisherId`       | required | The publisher ID from Onomagic | `20167` | `integer` |
| `bidFloor`    | optional | The minimum bid value desired      | `0.01`  | `float` |
