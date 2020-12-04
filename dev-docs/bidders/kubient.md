---
layout: bidder
title: Kubient
description: Prebid Kubient Bidder Adapter
pbjs: true
pbs: true
schain_supported: true
biddercode: kubient
aliasCode: fidelity
media_types: banner
gdpr_supported: true
usp_supported: true
---

### Note:

The Kubient Bidder Adapter requires setup and approval before beginning. Please reach out to <prebid@kubient.com> for more details.

### Bid Params

{: .table .table-bordered .table-striped }
| Name   | Scope    | Description                                      | Example                  | Type     |
|--------|----------|--------------------------------------------------|--------------------------|----------|
| zoneid | required | The ad zone or tag specific ID                   | `'27248'`                | `string` |
| floor  | optional | The floor CPM price for the request              | `0.1234`                 | `float`  |
| server | optional | Bidder domain (default `'x.fidelity-media.com'`) | `'kssp.kbntx.ch'`        | `string` |
