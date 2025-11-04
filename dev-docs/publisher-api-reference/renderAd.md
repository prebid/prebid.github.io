---
layout: api_prebidjs
title: pbjs.renderAd(doc, id, options)
description: renderAd API
sidebarType: 1
---


This function will render the ad (based on params) in the given iframe document passed through. Note that doc SHOULD NOT be the parent document page as we can't doc.write() asynchronously. This function is usually used in the ad server's creative.

**Kind**: static method of pbjs API

`options.clickThrough` optionally enables publishers to count clicks on prebid inventory in their distributing adserver.
The publisher may call renderAd with a third param accepting an object where the value of clickThrough will be checked.
If this property is set the value of clickThrough will replace any occurrence of ${CLICKTHROUGH} inside of the properties ad and adUrl. If no match is found nothing will be replaced.

{: .alert.alert-info :}
Note: In regards to `options.clickThrough`:

- To make use of this feature, bid adapters would be required to respond with ad tags including the ${CLICKTHROUGH} macro.
- The renderAd function must be invoked with the options argument. Ex: `renderAd(doc, bidId, {clickThrough: 'https://someadserverclickurl.com'});`
- Not compatible with safeframes (since the logic around rendering safeframe's does not invoke the renderAd function).
- Not supported with Prebid Universal Creative at this time, only the standard pbjs.renderAd method.

{: .table .table-bordered .table-striped }
| Param | Scope | Type | Description |
| --- | --- | --- | --- |
| doc | Required | `object` | document |
| id | Required | `string` | bid id to locate the ad |
| options | Optional | `object` | object containing other additional params to be used (listed below) |
| options.clickThrough | Optional | `string` | a url used to keep track of clicks on the ad to be rendered (used to resolve the ${CLICKTHROUGH} macro) |
