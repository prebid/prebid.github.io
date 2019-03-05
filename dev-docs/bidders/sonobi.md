---
layout: bidder
title: Sonobi
description: Prebid Sonobi Bidder Adaptor
hide: true
biddercode: sonobi
biddercode_longer_than_12: false
media_types: video
gdpr_supported: true
userIds: pubCommon
---

### Note:
The Sonobi Bidder adapter requires setup and approval from your Sonobi Account Manager. If you require assistance
implementing our adapter please don't hesitate to contact us at apex.prebid@sonobi.com.

### bid params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                                    | Example                          | Type           |
|----------------|----------|----------------------------------------------------------------|----------------------------------|----------------|
| `placement_id` | required | The placement ID                                               | `'1a2b3c4d5e6f1a2b3c4d'`         | `string`       |
| `ad_unit`      | required | The adunit ID                                                  | `'/1234567/example/adUnit/code'` | `string`       |
| `floor`        | optional | Bid floor for this placement in USD                            | `0.50`                           | `float`        |
| `sizes`        | optional | Adunit sizes that will override global sizes                   | `[[300, 250], [300, 600]]`       | `Array<Array>` |
| `hfa`          | optional | Publisher Unique Identifier                                    | `'123985'`                       | `string`       |
| `referrer`     | optional | Overrides the default value for the ref param in a bid request | `'prebid.org'`                   | `string`       |

### Configuration

The `ad_unit` and `placement_id` are **mutually exclusive** but at least one is required. If you pass both, `ad_unit` takes precedence.

If you pass the optional `sizes` Array in your bid params it will override the global config sizes for the Sonobi Adapter only.

The `hfa` parameter requires your Sonobi Account Manager to enable this feature for you. Please contact them for further information.

### Video Example
[Sonobi Video](http://prebid.org/examples/bidders/sonobi-video-example.html)
