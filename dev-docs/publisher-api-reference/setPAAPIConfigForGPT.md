---
layout: api_prebidjs
title: pbjs.setPAAPIConfigForGPT(options) <span style="color:red" markdown="1">[Removed in 11.0]</span>
head_title: "pbjs.setPAAPIConfigForGPT(options) [Removed in 11.0] for Header Bidding"
description: setPAAPIConfigForGPT API
sidebarType: 1
---

{: .alert.alert-warning :}
This function was removed in Prebid.js 11.0 along with the paapiForGpt module.

Configure GPT slots to use PAAPI. 

**Kind**: static method of pbjs API. Only available when the [paapiForGpt module](/dev-docs/modules/paapiForGpt.html) is installed.

**Parameters**:

{: .table .table-bordered .table-striped }
| Param | Scope | Type | Description |
| --- | --- | --- | --- |
| options | Optional | `Object` | |
| options.adUnitCode | Optional | `String` | Ad unit filter; if provided, only configure the GPT slot that matches this ad unit |
| options.auctionId | Optional | `String` | Auction filter; if provided, only configure GPT slots with PAAPI configs from this auction |
| customSlotMatching | Optional | `Function` | Custom slot matching function - of the same type used by [setTargetingForGPTAsync](/dev-docs/publisher-api-reference/setTargetingForGPTAsync.html) |

**Example**:

```js
pbjs.setPAAPIConfigForGPT({adUnitCode: 'test-slot'})
```
