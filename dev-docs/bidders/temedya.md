---
layout: bidder
title: TE Medya
description: Prebid TE Medya Bidder Adapter.
pbjs: true
biddercode: temedya
media_types: banner,native
---

### Table of Contents

- [Description](#bid-desc)
- [Bid Params](#bid-params)
- [Test Params](#test-params)

<a name="bid-desc" />

### Description

One of the easiest way to gain access to TE Medya demand sources  - TE Medya header bidding adapter.

TE Medya header bidding adapter connects with TE Medya demand sources to fetch bids for display placements. Please reach out to your account manager or <prebid@temedya.com> for more information.

<a name="bid-params" />

### Bid params

| Name         | Scope    | Description                        | Example    | Type     |
|--------------|----------|------------------------------------|------------|----------|
| `widgetId`  | required | The widget ID from Vidyome           | `753497`    | `number` |
| `count`| optional | Ad Count         | `1` | `number` |


<a name="test-params" />

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
