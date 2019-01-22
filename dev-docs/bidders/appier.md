---
layout: bidder
title: Appier
description: Prebid Appier Bidder Adaptor
top_nav_section: dev_docs
nav_section: reference
biddercode: appier
biddercode_longer_than_12: false
hide: true
prebid_1_0_supported : true
media_types: banner
gdpr_supported: true
---

### Table of Contents

- [Bid Params](#appier-bid-params)
- [Custom Settings](#appier-custom-settings)


<a name="appier-bid-params" />

#### Bid Params

{: .table .table-bordered .table-striped }

| Name      | Scope    | Description               | Example    | Type     |
|-----------|----------|---------------------------|------------|----------|
| `hzid`    | required | The zone ID from Appier.  | `"WhM5WIOp"` | `string` |


<a name="appier-custom-settings" />

#### Custom Settings (Optional)

Set the "farm" to use region-specific server
```
pbjs.que.push(function() {
  // use the bid server in Taiwan (country code: tw)
  pbjs.setConfig({
    appier: {
      'farm': 'tw'
    }
  });
});
```

Explicitly override the bid server used for bidding
```
pbjs.que.push(function() {
  pbjs.setConfig({
    appier: {
      'server': '${HOST_NAME_OF_THE_SERVER}'
    }
  });
});
```
