---
title: pbjs.setTargetingForAst(adUnitCode)
description: setTargetingForAst API
---


Set query string targeting for AST ([Seller Tag](https://docs.xandr.com/bundle/seller-tag/page/seller-tag.html)) ad unit(s).  Note that this function has to be called after all ad units on page are defined.  For working example code, see [Using Prebid.js with AppNexus Publisher Ad Server](/dev-docs/examples/use-prebid-with-appnexus-ad-server). If the function is invoked without arguments it will set targeting for all adUnits defined.

**Kind**: static method of pbjs API


| Param | Scope | Type | Description |
| --- | --- | --- | -- |
| adUnitCode | Optional | `String or Array of strings` | Code(s) of the adUnit(s) for which targeting is being set. Omitting this parameter will set targeting on all adUnits. |
