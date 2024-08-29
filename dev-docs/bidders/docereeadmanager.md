---
layout: bidder
title: Doceree AdManager
description: Doceree AdManager Prebid Bidder Adapter
pbjs: true
biddercode: docereeadmanager
media_types: banner
gvl_id: 1063
tcfeu_supported: true
userIds: all (with commercial activation)
sidebarType: 1
schain_supported: true
safeframes_ok: true
deals_supported: true
floors_supported: true
fpd_supported: false
privacy_sandbox: no

---

### Bid Params

{: .table .table-bordered .table-striped }
| Name                | Scope    | Description    | Example                   | Type     |
|-------------------|----------|----------------|---------------------------|----------|
| `placementId`     | required | Placement Id   | `'DOC-19-1'`  | `string` |
| `publisherUrl`     | optional | Current url    | `https://doceree.com`     | `string` |  
| `gdpr`             | optional | Flag to check if gdpr applies   | `1`      | `string` |
| `gdprConsent`     | optional | URL-safe base64-encoded Transparency & Consent string   | `CPQfU1jPQfU1jG0AAAENAwCAAAAAAAAAAAAAAAAAAAAA.IGLtV_T9fb2vj-_Z99_tkeYwf95y3p-wzhheMs-8NyZeH_B4Wv2MyvBX4JiQKGRgksjLBAQdtHGlcTQgBwIlViTLMYk2MjzNKJrJEilsbO2dYGD9Pn8HT3ZCY70-vv__7v3ff_3g`      | `string` |
