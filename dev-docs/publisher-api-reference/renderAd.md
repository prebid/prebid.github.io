---
layout: api_prebidjs
title: pbjs.renderAd(doc, id)
description:
---


This function will render the ad (based on params) in the given iframe document passed through. Note that doc SHOULD NOT be the parent document page as we can't doc.write() asynchronously. This function is usually used in the ad server's creative.

**Kind**: static method of pbjs API


{: .table .table-bordered .table-striped }
| Param | Scope | Type | Description |
| --- | --- | --- | --- |
| doc | Required | `object` | document |
| id | Required | `string` | bid id to locate the ad |
