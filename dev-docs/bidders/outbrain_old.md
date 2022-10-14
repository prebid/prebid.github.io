---
layout: bidder
title: Outbrain - Old
description: Outbrain Prebid Bidder Adapter
biddercode: outbrain
aliasCode: zemanta
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
enable_download : false
ortb_blocking_supported: partial
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

### First Party Data
Publishers can use the `ortb2` configuration parameter to provide First Party Data.

#### OpenRTB Parameters
The following table contains currently supported parameters.

{: .table .table-bordered .table-striped }

| Name               | Scope    | Description                                                                                               | Example            | Type           |
|--------------------|----------|-----------------------------------------------------------------------------------------------------------|--------------------|----------------|
| `bcat`             | optional | Blocked advertiser categories using the IAB content categories                                            | `['IAB1-1']`       | `string array` |
| `badv`             | optional | Block list of advertisers by their domains                                                                | `['example.com']`  | `string array` |
| `wlang`            | optional | Allow list of languages for creatives using ISO-639-1-alpha-2. Omission implies no specific restrictions. | `['en', 'de']`     | `string array` |


Example configuration:
```
pbjs.setConfig({
    ortb2: {
      bcat: ['IAB1-1'],
      badv: ['example.com'],
      wlang: ['en', 'de']
    }
});
```

### Bid Params

{: .table .table-bordered .table-striped }

| Name               | Scope    | Description                                    | Example            | Type           |
|--------------------|----------|------------------------------------------------|--------------------|----------------|
| `publisher.id`     | required | The publisher account ID                       | `'2706'`           | `string`       |
| `publisher.name`   | optional | The publisher name                             | `'Publisher Name'` | `string`       |
| `publisher.domain` | optional | The publisher domain                           | `'publisher.com'`  | `string`       |
| `tagid`            | optional | Identifier for specific ad placement or ad tag | `'tag-id'`         | `string`       |
| `bcat`             | optional | (Deprecated)                                   | `['IAB1-1']`       | `string array` |
| `badv`             | optional | (Deprecated)                                   | `['example.com']`  | `string array` |

Note: Providing `bcat` and `badv` via Bid Params is deprecated, the First Party Data method should be preferred (see above). When both methods are provided, first party data values will be used and bid param values will be ignored.

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
