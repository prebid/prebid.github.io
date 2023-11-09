---
layout: bidder
title: Doceree AdManager
description: Doceree AdManager Prebid Bidder Adapter
pbjs: true
biddercode: docereeadmanager
media_types: banner
gvl_id: 1063
tcf2_supported: true
tcfeu_supported: true
sidebarType: 1
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name                | Scope    | Description    | Example                   | Type     |
|-------------------|----------|----------------|---------------------------|----------|
| `placementId`     | required | Placement Id   | `'DOC_500-1'`  | `string` |
| `publisherUrl`     | optional | Current url    | `https://doceree.com/provider/in/endemic/`     | `string` |  
| `gdpr`             | optional | Flag to check if gdpr applies   | `1`      | `string` |
| `gdprConsent`     | optional | URL-safe base64-encoded Transparency & Consent string   | `CPQfU1jPQfU1jG0AAAENAwCAAAAAAAAAAAAAAAAAAAAA.IGLtV_T9fb2vj-_Z99_tkeYwf95y3p-wzhheMs-8NyZeH_B4Wv2MyvBX4JiQKGRgksjLBAQdtHGlcTQgBwIlViTLMYk2MjzNKJrJEilsbO2dYGD9Pn8HT3ZCY70-vv__7v3ff_3g`      | `string` |
