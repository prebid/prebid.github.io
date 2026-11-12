---
layout: bidder
title: Growzee
description: Prebid Growzee Bidder Adapter
biddercode: growzee
media_types: banner, video, native
pbjs: false
pbs: true
pbs_app_supported: true
floors_supported: true
prebid_member: false
multiformat_supported: will-bid-on-one
sidebarType: 1
---

## Registration

The Growzee bid adapter requires setup before use. Growzee is an in-app exchange.

Please contact <prebid-server@growzee.io> to receive your Publisher ID (`publisherId`).

## Bid Params

{: .table .table-bordered .table-striped }

| Name          | Scope    | Description                           | Example                                  | Type     |
|---------------|----------|---------------------------------------|------------------------------------------|----------|
| `publisherId` | required | Publisher ID (UUID) issued by Growzee | `'1d5c3b2a-0f4e-4a6b-9c8d-7e6f5a4b3c2d'` | `string` |
