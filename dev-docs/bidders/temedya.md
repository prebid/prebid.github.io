---
layout: bidder
title: TE Medya
description: Prebid TE Medya Bidder Adapter.
pbjs: true
biddercode: temedya
media_types: banner,native
sidebarType: 1
---

### Description

One of the easiest way to gain access to TE Medya demand sources  - TE Medya header bidding adapter.

TE Medya header bidding adapter connects with TE Medya demand sources to fetch bids for display placements. Please reach out to your account manager or <prebid@temedya.com> for more information.

### Bid params

| Name         | Scope    | Description                        | Example    | Type     |
|--------------|----------|------------------------------------|------------|----------|
| `widgetId`  | required | The widget ID from Vidyome           | `753497`    | `number` |
| `count`| optional | Ad Count         | `1` | `number` |

### Test Parameters

300x250 banner test
```
var adUnits = [{
  code: 'div-prebid',
  mediaTypes: {
    banner: {
      sizes: [[300, 250]]
    }
  },
  // Replace this object to test a new Adapter!
  bids: [{
    bidder: 'temedya',
    params : {
      widgetId : 753497 //test widgetId, please replace after test
    }
  }]
}];
```

native test
```
var adUnits = [{
  code: 'div-prebid',
  mediaTypes: {
    native: {
        image: {
            required: true,
            sizes: [320, 240]
        },
        clickUrl: {
            required: false
        },
        title: {
            required: true,
            len: 80
        },
        sponsored: {
            required: false
        }
    }
  },
  // Replace this object to test a new Adapter!
  bids: [{
    bidder: 'temedya',
    params : {
        widgetId : 753497 //test widgetId, please replace after test
    }
  }]
}];
```
