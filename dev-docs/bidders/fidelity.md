---
layout: bidder
title: Fidelity Media
description: Prebid Fidelity Media Bidder Adapter
hide: true
schain_supported: true
biddercode: fidelity
media_types: banner
gdpr_supported: true
usp_supported: true
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name   | Scope    | Description                                      | Example                  | Type     |
|--------|----------|--------------------------------------------------|--------------------------|----------|
| zoneid | required | The ad zone or tag specific ID                   | `'27248'`                | `string` |
| floor  | optional | The floor CPM price for the request              | `0.1234`                 | `float`  |
| server | optional | Bidder domain (default `'x.fidelity-media.com'`) | `'x.fidelity-media.com'` | `string` |