---
layout: api_prebidjs
title: pbjs.setPAAPIConfigForGPT(options)
description: setPAAPIConfigForGPT API
sidebarType: 1
---

Configure GPT slots to use PAAPI. 

**Kind**: static method of pbjs API. Only available when the [fledgeForGpt module](/dev-docs/modules/fledgeForGpt.html) is installed.

**Parameters**:

{: .table .table-bordered .table-striped }
| Param | Scope | Type | Description |
| --- | --- | --- | --- |
| options | Optional | `Object` |  |
| options.adUnitCode | Optional | `String` | Ad unit filter; if provided, only configure the GPT slot that matches this ad unit |
| options.auctionId | Optional | `String` | Auction filter; if provided, only configure GPT slots with PAAPI configs from this auction |

**Example**:

```js
pbjs.setPAAPIConfigForGPT({adUnitCode: 'test-slot'})
```
