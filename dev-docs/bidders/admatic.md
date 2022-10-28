---
layout: bidder
title: AdMatic
description: Prebid AdMatica Bidder Adapter.
pbjs: true
biddercode: admatic
media_types: banner,video
---

### Description

One of the easiest way to gain access to AdMatic demand sources  - AdMatic header bidding adapter.

AdMatic header bidding adapter connects with AdMatic demand sources to fetch bids for banner network ID. Please reach out to your account manager or <prebid@admatic.com.tr> for more information.

### Bid params

| Name         | Scope    | Description                        | Example    | Type     |
|--------------|----------|------------------------------------|------------|----------|
| `networkId`  | required | The network ID from AdMatic           | `12345`    | `number` |
| `floor`| optional | Bid floor         | `0.5` | `float` |

### Test Parameters

300x250 banner test
```
var adUnits = [{
  code: 'your-slot_1-div', //use exactly the same code as your slot div id.
  sizes: [[300, 250]],
  bids: [{
      bidder: 'admatic',
      params: { 
          networkId: 12345,
          floor: 0.5
      }
  }]
},{
  code: 'your-slot_2-div', //use exactly the same code as your slot div id.
  sizes: [[600, 800]],
  bids: [{
      bidder: 'admatic',
      params: { 
          networkId: 12345,
          floor: 0.5
      }
  }]
}];
```

## UserSync example

```
pbjs.setConfig({
  userSync: {
    iframeEnabled: true,
    syncEnabled: true,
    syncDelay: 1
  }
});
```
