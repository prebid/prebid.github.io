---
layout: bidder
title: OCM Media
description: OCM Media bidder adapter
biddercode: orangeclickmedia
pbjs: false
pbs: true
enable_download: false
pbjs_version_notes: The orangeclickmedia Prebid.js bid adapter is deprecated. Publishers should migrate to the OCM bid adapter (biddercode `ocm`), documented on the ocm.md page.
media_types: video, banner
userIds: all
fpd_supported: false
tcfeu_supported: true
gvl_id: 1148
usp_supported: true
coppa_supported: true
schain_supported: true
prebid_member: false
ortb_blocking_supported: true
multiformat_supported: will-bid-on-one
floors_supported: false
aliasCode: limelightDigital
sidebarType: 1
---

## Deprecation Notice

The `orangeclickmedia` **Prebid.js** bid adapter is deprecated and is no longer supported.
Publishers using it client-side should migrate to the [OCM bid adapter](/dev-docs/bidders/ocm.html) (`biddercode: ocm`).

The `orangeclickmedia` **Prebid Server** adapter remains available; its bid params are documented below.

## Bid Params

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description           | Example                         | Type      |
|:--------------|:---------|:----------------------|:--------------------------------|:----------|
| `host`        | required | Ad network's RTB host | `'scotty.orangeclickmedia.com'` | `string`  |
| `publisherId` | required | Publisher ID          | `'12345'`                       | `string`  |
