---
layout: bidder
title: Brightcom SSP
description: Prebid Brightcom SSP Bidder Adaptor
top_nav_section: dev_docs
nav_section: reference
pbjs: true
biddercode: bcmssp
aliasCode: brightcomSSP 
gdpr_supported: true
usp_supported: true
coppa_supported: true
schain_supported: true
sidebarType: 1
gvl_id: 883
---

### Note:

The Brightcom SSP bidder adapter requires setup and approval from the Brightcom team. Please reach out to your account manager for more information and to start using it.

### Bid params

{: .table .table-bordered .table-striped } 

| Name | Scope | Description | Example | Type |
| ---- | ----- | ----------- | ------- | ---- |
| `publisherId`       | required | The publisher ID from Brightcom | `2141020` | `integer` |
| `bidFloor`    | optional | The minimum bid value desired      | `1.23`  | `float` |
