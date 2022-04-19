---
layout: bidder
title: Outbrain
description: Outbrain Prebid Bidder Adapter
biddercode: outbrain
gdpr_supported: true
gvl_id: 164
usp_supported: true
coppa_supported: true
media_types: banner, native
safeframes_ok: true
pbjs: true
pbs: true
pbs_app_supported: true
prebid_member: true
userIds: id5Id, identityLink
pbjs_version_notes: v4.35 and later
floors_supported: true
---

### Registration

The Outbrain Adapter requires setup before beginning. Please contact us at prebid.org@outbrain.com.

### Configuration

#### Prebid.js

The Outbrain adapter does not work without setting the correct bidder and usersync URLs.
You will receive the URLs when contacting us.
```
pbjs.setConfig({
    outbrain: {
      bidderUrl: 'http://bidder-url.com',
      usersyncUrl: 'http://usersync-url.com'
    }
});
```

#### Prebid server

Similar to the Prebid.js configuration described above, our prebid server adapter requires you to configure the bidder and usersync URLs.
You will receive the URLs when contacting us. 

Please note that you need to replace the `<PREBID_SERVER_EXTERNAL_URL>` part with the actual external URL of the prebid server host.
```
adapters:
  outbrain:
    endpoint: http://bidder-url.com
    syncurl: http://usersync-url.com?gdpr={%raw%}{{.GDPR}}&gdpr_consent={{.GDPRConsent}}&us_privacy={{.USPrivacy}}{%endraw%}&cb=<PREBID_SERVER_EXTERNAL_URL>%2Fsetuid%3Fbidder%3Doutbrain%26uid%3D__ZUID__

```

### Bid Params

{: .table .table-bordered .table-striped }

| Name               | Scope    | Description                                                    | Example            | Type           |
|--------------------|----------|----------------------------------------------------------------|--------------------|----------------|
| `publisher.id`     | required | The publisher account ID                                       | `'2706'`           | `string`       |
| `publisher.name`   | optional | The publisher name                                             | `'Publisher Name'` | `string`       |
| `publisher.domain` | optional | The publisher domain                                           | `'publisher.com'`  | `string`       |
| `tagid`            | optional | Identifier for specific ad placement or ad tag                 | `'tag-id'`         | `string`       |
| `bcat`             | optional | Blocked advertiser categories using the IAB content categories | `['IAB1-1']`       | `string array` |
| `badv`             | optional | Block list of advertisers by their domains                     | `['example.com']`  | `string array` |

#### Native example

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
            tagid: 'tag-id',
            bcat: ['IAB1-1'],
            badv: ['example.com']
        }
    }]
];
```

#### Banner example
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
            bcat: ['IAB1-1'],
            badv: ['example.com']
        }
    }]
];
```
