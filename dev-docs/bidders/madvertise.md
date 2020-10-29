---
layout: bidder
title: Madvertise
description: Prebid Madvertise Bidder Adaptor
pbjs: true
biddercode: madvertise
gdpr_supported: true
---

### Bid Params

{: .table .table-bordered .table-striped }
| Name         | Scope    | Description                                                                                             | Example                                 | Type      |
|--------------|----------|---------------------------------------------------------------------------------------------------------|-----------------------------------------|-----------|
| `s`          | required | Zone code. This parameter should be the unique Publisher ID of your mobile application or website.      | `'/4543756/prebidadaptor/madvertiseHB'` | `string`  |
| `donottrack` | optional | Possible values are `0` or `1`. If the of value is `1`, the user does not want to be tracked (opt out). | `1`                                     | `integer` |
| `lat`        | optional | Latitude                                                                                                | `48.866667`                             | `float`   |
| `long`       | optional | Longitude                                                                                               | `2.333333`                              | `float`   |
| `age`        | optional | Age                                                                                                     | `19`                                    | `integer` |
| `gender`     | optional | Gender m or f                                                                                           | `'f'`                                   | `string`  |
| `locale`     | optional | Locale                                                                                                  | `'fr'`                                  | `string`  |
| `floor`      | optional | Bid floor                                                                                               | `1.0`                                   | `float`   |
