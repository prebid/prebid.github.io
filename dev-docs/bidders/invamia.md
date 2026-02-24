---
layout: bidder
title: Invamia
description: Prebid Invamia Bidder Adapter
pbjs: true
biddercode: invamia
safeframes_ok: false
sidebarType: 1
---

### Note

Here is what you need for Prebid integration with Invamia:

1. Register with Invamia.
2. Once registered and approved, you will receive a Zone ID.
3. Use the Zone ID as parameters in params.

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description  | Example                                        | Type     |
|---------------|----------|--------------|------------------------------------------------|----------|
| `zoneId` | required | Zone ID | `379783` | `number` |
