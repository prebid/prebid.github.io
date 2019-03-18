---
layout: bidder
title: Ozone Project
description: Prebid Ozone Project Bidder Adaptor
biddercode: ozone 
biddercode_longer_than_12: false
hide: true
media_types: banner
gdpr_supported: true
---

#### Bid Params

{: .table .table-bordered .table-striped }

| Name      | Scope    | Description               | Example    | Type     |
|-----------|----------|---------------------------|------------|----------|
| `siteId`    | required | The site ID from ozone.  | `"OZONENUK0001"` | `string` |
| `publisherId`    | required | The publisher ID.  | `"4204204201"` | `string` |
| `placementId`    | required | The placement ID.  | `"0420420421"` | `string` |
| `customData`     | optional | publisher key-values used for targeting | `{"key1": "value1", "key2": "value2"}` | `string` |
| `ozoneData`      | optional | ozone key-values used for targeting | `{"key1": "value1", "key2": "value2"}` | `string` |
| `lotameData`     | optional | lotame key-values used for targeting | `{"key1": "value1", "key2": "value2"}` | `string` |
