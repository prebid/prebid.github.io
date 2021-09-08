---
layout: bidder
title: RtbAnalytica
description: RtbAnalytica Bidder Adaptor
pbjs: true
pbs: true
biddercode: rtbanalytica
aliasCode : adkernel
media_types: banner, native, video
gdpr_supported: true
usp_supported: true
coppa_supported: true
pbs_app_supported: true
schain_supported: true
---

### Note:

The RtbAnalytica bidding adapter requires setup and approval before implementation. Please reach out to <vivek@rtbanalytica.com> for more details.

### Bid Params

{: .table .table-bordered .table-striped }
| Name     | Scope    | Description           | Example                   | Type     |
|----------|----------|-----------------------|---------------------------|----------|
| `host`   | required | RtbAnalytica RTB host | `'cpm.rtbanalytica.com'` | `string` |
| `zoneId` | required | Zone Id           | `30164`                 | `integer` |
