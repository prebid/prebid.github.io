---
layout: bidder
title: Justpremium
description: Prebid Justpremium Bidder Adaptor
hide: true
biddercode: justpremium
gdpr_supported: true
---



### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| :--- | :---- | :---------- | :------ | :---- |
| `zone` | required | The zone ID provided by Justpremium | `'34604'` | `string` |
| `allow` | optional | Permits publisher to decide which products can be run from specific ad unit | `['lb', 'wp']` | `Array<string>` |
| `exclude` | optional | Permits publisher to decide which products should be excluded from running in specific ad unit | `['is']` | `Array<string>` |
