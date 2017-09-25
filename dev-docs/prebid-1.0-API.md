---
layout: page
title: Prebid 1.0 Publisher API changes
description: Describes the changes for the publisher facing API
top_nav_section: dev_docs
nav_section: reference
hide: false
---

<div class="bs-docs-section" markdown="1">


# Publisher API change summary
{:.no_toc}

## Summary
{:.no_toc}

* TOC
{:toc}


## setConfig - new API

Deprecate the following APIs in favor of a generic "options" param object:

- `$$PREBID_GLOBAL$$.bidderTimeout`
- `$$PREBID_GLOBAL$$.logging` *1*
- `$$PREBID_GLOBAL$$.publisherDomain`
- `$$PREBID_GLOBAL$$.cookieSyncDelay`
- `$$PREBID_GLOBAL$$.setPriceGranularity`
- `$$PREBID_GLOBAL$$.enableSendAllBids` *2*
- `$$PREBID_GLOBAL$$.setBidderSequence`
- `$$PREBID_GLOBAL$$.setS2SConfig`

Mapping will be straigthfoward with the name of the param being the same except dropping `set` where appropriate. 

*1:* Renamed to `debug`. 
*2:* `$$PREBID_GLOBAL$$.enableSendAllBids` will default to true in 1.0. 

### `setConfig` example 
Note: input must be JSON (no JS functions allowed). 

```javascript
pbjs.setConfig({
    "currency": {
        "adServerCurrency": "JPY", // enables currency feature to be enabled -- loads the rate file
        "conversionRateFile": "url" // allows the publisher to override the default rate file
    },
    "debug" : true, // previously `logging`
    "s2sConfig : {...},
    "priceGranularity": "medium",
    "enableSendAllBids": false, // default will be `true` as of 1.0
    "bidderSequence": "random",
    "bidderTimeout" : 700,      // default for all requests. 
    "publisherDomain" : "abc.com", // used for SafeFrame creative. 
    "pageOptions" : {...},
    "sizeConfig" : {...}
});
```

## `sizeConfig` Size Mapping changes 

The previous `sizeMapping` functionality will be deprecated in favor of a more powerful way to describe types of devices and screens.

**Rules if `sizeConfig` is present**

- Before `requestBids` sends bids requests to adapters, it will evaluate and pick the appropriate `label(s)` based on the `sizeConfig.mediaQuery` and device properties and then filter the `adUnit.bids` based on the `labels` defined (by dropping those adUnits that don't match the label definition).
 - The `sizeConfig.mediaQuery` property allows media queries in the form described [here](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries).  They are tested using the [`window.matchMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) API.
- If a label doesn't exist on an adUnit, it is automtatically included in all requests for bids
- If multiple rules match, the sizes will be filtered to the intersection of all matching rules' `sizeConfig.sizesSupported` arrays.  
- The `adUnit.sizes` selected will be filtered based on the selected `label`. So the `adUnit.sizes` is a subset of the sizes defined from the resulting intersection of `label` sizes and `adUnit.sizes`. 

### `sizeConfig` example

To set size configuration rules, you can use `pbjs.setConfig` as follows

```Javascript
pbjs.setConfig({
  sizeConfig: [{
    'mediaQuery': '(min-width: 1200px)',
    'sizesSupported': [
      [970, 90],
      [728, 90],
      [300, 250]
    ],
    'labels': ['desktop']
  }, {
    'mediaQuery': '(min-width: 768px) and (max-width: 1199px)',
    'sizesSupported': [
      [728, 90],
      [300, 250]
    ],
    'labels': ['tablet', 'phone']
  }, {
    'mediaQuery': '(min-width: 0px)',
    'sizesSupported': [
      [300, 250],
      [300, 100]
    ],
    'labels': ['phone']
  }]
});
```

### Labels

Labels can now be specified as a property on either an `adUnit` or on `adUnit.bids[]`.  The presence of a label will disable the adUnit or bidder unless a sizeConfig rule has matched and enabled the label or the label has been enabled manually through `pbjs.setConfig({labels:[]})`.  Defining labels on the adUnit look like the following:

```Javascript
pbjs.addAdUnits([{
  "code": "ad-slot-1",
  "sizes": [ [ 970,90 ], [ 728,90 ], [ 300,250 ], [ 300,100 ] ],
  "labels": ["visitor-uk"] 
  "bids": [  // the full set of bids, not all of which are relevant on all devices
    {
      "bidder": "pulsepoint",
      "labels": [ "desktop", "tablet" ], // flags this bid as relevant only on these screen sizes
      "params": {
        "cf": "728X90",
        "cp": 123456,
        "ct": 123456
      }
    },
    {
      "bidder": "pulsepoint",
      "labels": [ "desktop", "phone" ],
      "params": {
        "cf": "300x250",
        "cp": 123456,
        "ct": 123456
      }
    },
    {
      "bidder": "sovrn",
      "labels": [ "desktop", "tablet" ],
      "params": {
        "tagid": "123456"
      }
    },
    {
      "bidder": "sovrn",
      "labels": [ "phone" ],
      "params": {
        "tagid": "111111"
      }
    }
  ]
}];
```

### Manual Label Configuration

If an adUnit and/or adUnit.bids[] bidder has labels defined they will be disabled by default.  Manually setting active labels using `pbjs.setConfig` will re-enable the selected adUnits and/or bidders.

You can manually turn on labels using the following `setConfig`

```Javascript
pbjs.setConfig({
  labels: ['visitor-uk']
});

```

## AdUnit changes

The `mediaType` attribute is deprecated in favor of a `mediaTypes` object. This will accept multiple times (i.e. `video`, `banner`, `native` etc) wtih a optional key value pair object nested inside. 

### AdUnit example

```
adUnit =
{
  "code" : "unique_code_for_placement"        //optional/required onf of ['code', 'slotName', 'divId'] 
  "sizes" : [[300,250]],                      //optional - supports DFP style array of arrays for size. 
   "mediaTypes": {                            //optional. Complext type for attributes. Open ending for expansion. Will default to banner if not specified. 
    video: { context: 'outstream' },
    banner: {...options},
    native: {...options}
   },
  labels : ['desktop', 'mobile']
  bids : {...}  //same as existing defination with additional of `label` attribute
}
```