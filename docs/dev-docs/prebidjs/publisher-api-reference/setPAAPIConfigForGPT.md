---
title: pbjs.setPAAPIConfigForGPT(options)
description: setPAAPIConfigForGPT API
---

Configure GPT slots to use PAAPI. 

**Kind**: static method of pbjs API. Only available when the [paapiForGpt module](/dev-docs/modules/paapiForGpt) is installed.

**Parameters**:


| Param | Scope | Type | Description |
| --- | --- | --- | --- |
| options | Optional | `Object` |  |
| options.adUnitCode | Optional | `String` | Ad unit filter; if provided, only configure the GPT slot that matches this ad unit |
| options.auctionId | Optional | `String` | Auction filter; if provided, only configure GPT slots with PAAPI configs from this auction |
| customSlotMatching | Optional | `Function` | Custom slot matching function - of the same type used by [setTargetingForGPTAsync](/dev-docs/publisher-api-reference/setTargetingForGPTAsync) |

**Example**:

```js
pbjs.setPAAPIConfigForGPT({adUnitCode: 'test-slot'})
```
