---
layout: bidder
title: Outbrain
description: Outbrain Prebid Bidder Adapter
biddercode: outbrain
aliasCode : zemanta
gdpr_supported: true
gvl_id: 164
tcf2_supported: true
usp_supported: true
coppa_supported: true
media_types: banner, native
safeframes_ok: true
pbjs: true
---

### Registration

The Outbrain Adapter requires setup before beginning. Please contact us at prebid.org@outbrain.com.

### Configuration

#### Bidder and usersync URLs

The Outbrain adapter does not work without setting the correct bidder and usersync URLs.
You will receive the URLs when contacting us.

```
pbjs.setConfig({
    outbrain: {
      bidderUrl: 'https://bidder-url.com',
      usersyncUrl: 'https://usersync-url.com'
    }
});
```

### Bid Params

{: .table .table-bordered .table-striped }

| Name               | Scope    | Description                                       | Example                | Type     |
|--------------------|----------|---------------------------------------------------|------------------------|----------|
| `publisher.id`     | required | The publisher account ID                          | `'2706'`               | `string` |
| `publisher.name`   | optional | The publisher name                                | `'Publisher Name'`     | `string` |
| `publisher.domain` | optional | The publisher domain                              | `'publisher.com'`      | `string` |
| `tagid`            | optional | Identifier for specific ad placement or ad tag    | `'tag-id'`             | `string` |

### Native example

```
var adUnits = [
    code: '/19968336/prebid_native_example_1',
    mediaTypes: {
        native: {
            image: {
                required: false,
                sizes: [100, 50]
            },
            title: {
                required: false,
                len: 140
            },
            sponsoredBy: {
                required: false
            },
            clickUrl: {
                required: false
            },
            body: {
                required: false
            },
            icon: {
                required: false,
                sizes: [50, 50]
            }
        }
    },
    bids: [{
        bidder: 'outbrain',
        params: {
            publisher: {
              id: '2706',
              name: 'Publishers Name',
              domain: 'publisher.com'
            },
            tagid: 'tag-id'
        }
    }]
];
```

### Banner example
```
var adUnits = [
    code: '/19968336/prebid_display_example_1',
    mediaTypes: {
      banner: {
        sizes: [[300, 250]]
      } 
    },
    bids: [{
        bidder: 'outbrain',
        params: {
            publisher: {
              id: '2706',
              name: 'Publishers Name',
              domain: 'publisher.com'
            },
            tagid: 'tag-id',
        }
    }]
];
```
