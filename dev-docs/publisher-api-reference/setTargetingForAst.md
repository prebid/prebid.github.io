---
layout: api_prebidjs
title: pbjs.setTargetingForAst(adUnitCode)
description:
sidebarType: 1
---


Set query string targeting for AST ([Seller Tag](https://docs.xandr.com/bundle/seller-tag/page/seller-tag.html)) ad unit(s).  Note that this function has to be called after all ad units on page are defined.  For working example code, see [Using Prebid.js with AppNexus Publisher Ad Server]({{site.github.url}}/dev-docs/examples/use-prebid-with-appnexus-ad-server.html). If the function is invoked without arguments it will set targeting for all adUnits defined.

**Kind**: static method of pbjs API

{: .table .table-bordered .table-striped }
| Param | Scope | Type | Description |
| --- | --- | --- | -- |
| adUnitCode | Optional | `String or Array of strings` | Code(s) of the adUnit(s) for which targeting is being set. Omitting this parameter will set targeting on all adUnits. |
