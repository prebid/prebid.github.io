---
layout: bidder
title: Sonobi
description: Prebid Sonobi Bidder Adaptor
biddercode: sonobi
media_types: banner, video
gdpr_supported: true
userIds: britepoolId, criteo, id5Id, identityLink, liveIntentId, netId, parrableId, pubCommonId, unifiedId, lotamePanoramaID
pbjs: true
pbs: true
usp_supported: true
coppa_supported: true
schain_supported: true
pbs_app_supported: true
---

### Note:
The Sonobi Bidder adapter requires setup and approval from your Sonobi Account Manager. If you require assistance
implementing our adapter please don't hesitate to contact us at apex.prebid@sonobi.com.

### Bid Params

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                                                    | Example                          | Type           |
|----------------|----------|----------------------------------------------------------------|----------------------------------|----------------|
| `placement_id` | required* | The placement ID                                               | `'1a2b3c4d5e6f1a2b3c4d'`         | `string`       |
| `ad_unit`      | required* | The adunit ID                                                  | `'/1234567/example/adUnit/code'` | `string`       |
| `floor`        | optional | Bid floor for this placement in USD                            | `0.50`                           | `float`        |
| `sizes`        | optional | Adunit sizes that will override global sizes                   | `[[300, 250], [300, 600]]`       | `Array<Array>` |
| `hfa`          | optional | Publisher Unique Identifier                                    | `'123985'`                       | `string`       |
| `referrer`     | optional | Overrides the default value for the ref param in a bid request | `'prebid.org'`                   | `string`       |
| `keywords`     | optional | Comma separated list of keywords about the site                | `'sports,news,food'`             | `string`       |
| `bid_request_url`| optional | String representing the url the Sonobi adapter should make to request bids | `'https://iad-2-apex.go.sonobi.com/trinity.json'`             | `string`       |

### Configuration
*You *must* only include one ID field - either `placement_id` or `ad_unit`, not both. If you have questions on which parameter to use, please reach out to your Account Manager.

The `ad_unit` and `placement_id` are **mutually exclusive** but at least one is required. If you pass both, `ad_unit` takes precedence.

If you pass the optional `sizes` Array in your bid params it will override the global config sizes for the Sonobi Adapter only.

The `hfa` parameter requires your Sonobi Account Manager to enable this feature for you. Please contact them for further information.
