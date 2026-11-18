---
layout: api_prebidjs
title: pbjs.adServers.freewheel.getTargeting(options) <span style="color:red" markdown="1">[Removed in 11.0]</span>
head_title: "pbjs.adServers.freewheel.getTargeting(options) [Removed in 11.0] for Header Bidding"
description: adServers.freewheel.getTargeting API
sidebarType: 1
---

{: .alert.alert-warning :}
This function was removed in Prebid.js 11.0 along with the `freeWheelAdserverVideo` module and ad pod (long-form) video support.

{: .alert.alert-info :}
The FreeWheel implementation of this function requires including the `freeWheelAdserverVideo` module in your Prebid.js build.

Use this method to get targeting key-value pairs to be sent to the ad server.

+ `pbjs.adServers.freewheel.getTargeting(options)`: returns key-value pair from the ad server.

```javascript
pbjs.adServers.freewheel.getTargeting({
    codes: [adUnitCode1],
    callback: function(err, targeting) {
        //pass targeting to player api
    }
});
```

## Argument Reference

### The `options` object

{: .table .table-bordered .table-striped }
| Param | Scope | Type | Description |
| --- | --- | --- | --- |
| codes | Optional | `Array` | [`adUnitCode1`] |
| callback | Required | `Function` | Callback function to execute when targeting data is back. |
