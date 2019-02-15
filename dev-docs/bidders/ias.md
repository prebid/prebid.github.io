---
layout: bidder
title: Integral Ad Science (IAS)
description: Prebid Integral Ad Science Bidder Adaptor
hide: true
biddercode: ias
biddercode_longer_than_12: false
---

### Note:

This module is an integration with prebid.js with an IAS product, pet.js. It is not a bidder per se but works in a similar way: retrieve data that publishers might be interested in setting keyword targeting, like predicted viewability and brand safety words. Please reach out to your account manager or check out [our publisher solutions](https://integralads.com/solutions/publishers/) for more
information.

### bid params

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description                                | Example             | Type     |
|--------------|----------|--------------------------------------------|---------------------|----------|
| `pubId`      | required | Publisher client ID, provided by IAS       | `'1234'`            | `string` |
| `adUnitPath` | required | Ad unit path. The same one you use for GPT | `'/1234567/sports'` | `string` |
