---
layout: bidder
title: myTarget
description: Prebid myTarget Bidder Adapter
pbjs: true
biddercode: mytarget
sidebarType: 1
---


### Bid params

{: .table .table-bordered .table-striped }
| Name          | Scope     | Description                                              | Example            | Type             |
|---------------|-----------|----------------------------------------------------------|--------------------|------------------|
| `placementId` | required  | The slot ID from myTarget.                               | `'379783'`         | `string`         |
| `bidfloor`    | optional  | Bid floor                                                | `10000`            | `number`         |
| `position`    | optional  | Ad position on screen. See details below.                | `1`                | `number`         |
| `response`    | optional  | Bid response type. 0 - ad url (default), 1 - ad markup.  | `1`                | `number`         |


### Position

The following values are defined in the [ORTB 2.5 spec](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf).

+ `0` : Unknown
+ `1` : Above the Fold
+ `3` : Below the Fold
+ `4` : Header
+ `5` : Footer
+ `6` : Sidebar
+ `7` : Full Screen

### Configuration

The myTarget 'sitename' could be set globally:

```javascript
pbjs.setConfig({
   mytarget: {
     sitename: 'example.com'
   }
});
 ```
