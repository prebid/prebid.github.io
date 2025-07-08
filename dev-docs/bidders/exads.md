---
layout: bidder
title: EXADS
description: EXADS Bidder Adapter
pbjs: true
multiformat_supported: will-not-bid
biddercode: exads
dsa_supported: true
gvl_id: 1084
tcfeu_supported: true
media_types: banner, video, native
safeframes_ok: false
deals_supported: false
floors_supported: true
ortb_blocking_supported: true
---

### Example

A very minimal RTB Banner example that shows how to use the EXADS adapter.
The most important attributes are: **endpoint**, **fid** and **zoneId**. You can get them after configuring the zones.
For more details about ad formats and parameters, read it in the next sections.

```js

adUnits = [
  {
    code: 'postbid_iframe', // the frame where to render the creative
    mediaTypes: {
      banner: {
        sizes: [300, 250],
      },
    },
    bids: [
      {
        bidder: 'exads',
        params: {
          zoneId: 12345,
          fid: '829a896f011475d50da0d82cfdd1af8d9cdb07ff',
          partner: 'ortb_2_4',
          siteId: '123',
          siteName: 'test.com',
          country: 'IRL,
          userIp: '0.0.0.0',
          userId: '1234',
          impressionId: impression_id.toString(),
          mimes: ['image/jpg'],
          endpoint: 'https://your-ad-network.com/rtb.php',
        },
      },
    ],
  },
];
```

### Configuration

#### Video settings

If you will work with video stream ad formats you could choose to use the prebidJS video module to render the video using  already supported video players as videoJS.
Add the `video` config if you need to render videos using the video module.
For more info navigate to [instructions](/prebid-video/video-module.html).

#### RTB Banner 2.4

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `zoneID`      | required | You can get it from the endpoint created after configuring the zones          | `12345`    | `integer` |
| `fid`      | required | You can get it from the endpoint created after configuring the zones          | `'829a896f011475d50da0d82cfdd1af8d9cdb07ff'`    | `string` |
| `partner`      | required | Currently we support rtb 2.4 (“ortb_2_4”) only           | `'ortb_2_4'`    | `string` |
| `siteId`      | recommended |  Unique Site ID           | `'123'`    | `string` |
| `siteName`      |  |  Site name            | `'test.com'`    | `string` |
| `banner.sizes`      | required |  [width, height]          | `[145,256]`    | `integer array` |
| `userIp`      | required |  IP address of the user, ipv4 or ipv6          | `'0.0.0.0'`    | `string` |
| `userId`      | *required |  Unique user ID (string). *If you cannot generate a user ID, you can leave it empty (""). The request will get a response as long as “user” object is included in the request          | `''`    | `string` |
| `country`      | required |  country ISO3          | `'IRL'`    | `string` |
| `impressionId`      | required |  Unique impression ID within this bid request           | `'abcde'`    | `string` |
| `keywords`      | optional |  Keywords can be used to ensure ad zones get the right type of advertising. Keywords should be a string of comma-separated words           | `'lifestyle, humour'`    | `string` |
| `bidfloor`      | optional |  Minimum bid for this impression (CPM) / click (CPC) and account currency           | `0.00000011`    | `float` |
| `bidfloorcur`      | optional |  Currency for minimum bid value specified using ISO-4217 alpha codes           | `'EUR'`    | `string` |
| `bcat`      | optional |  Blocked advertiser categories using the IAB content categories           | `['IAB25', 'IAB7-39','IAB8-18','IAB8-5','IAB9-9']`    | `string array` |
| `badv`      | optional |  Block list of advertisers by their domains            | `['first.com', 'second.com']`    | `string array` |
| `mimes`      | optional |   List of supported mime types. We support: image/jpeg, image/jpg, image/png, image/png, image/gif, image/webp, video/mp4            | `['image/jpg']`    | `string array` |
| `dsa`      | optional |   DSA transparency information. To see the specific paragraph for more details.            | `{ dsarequired: 3, pubrender: 0, datatopub: 2 }`    | `object` |
| `endpoint`      | required |   EXADS endpoint (URL)            | `https://your-ad-network.com/rtb.php`    | `string` |

##### RTB Banner 2.4 (Image)

```js
adUnits = [
  {
    code: 'postbid_iframe', // the frame where to render the creative
    mediaTypes: {
      banner: {
        sizes: [300, 250],
      },
    },
    bids: [
      {
        bidder: 'exads',
        params: {
          zoneId: 12345,
          fid: '829a896f011475d50da0d82cfdd1af8d9cdb07ff',
          partner: 'ortb_2_4',
          siteId: '123',
          siteName: 'test.com',
          userIp: '0.0.0.0',
          userId: '1234',
          country: 'IRL', // optional
          impressionId: impression_id.toString(),
          keywords: 'lifestyle, humour', // optional
          bidfloor: 0.00000011, // optional
          bidfloorcur: 'EUR', // optional
          bcat: ['IAB25', 'IAB7-39', 'IAB8-18', 'IAB8-5', 'IAB9-9'], // optional
          badv: ['first.com', 'second.com'], // optional
          mimes: ['image/jpg'],
          dsa: {
            // optional
            dsarequired: 3,
            pubrender: 0,
            datatopub: 2,
          },
          endpoint: 'https://your-ad-network.com/rtb.php',
        },
      },
    ],
  },
];
```

##### RTB Banner 2.4 (Video)

```js
adUnits = [
  {
    code: 'postbid_iframe', // the frame where to render the creative
    mediaTypes: {
      banner: {
        sizes: [900, 250],
      },
    },
    bids: [
      {
        bidder: 'exads',
        params: {
          zoneId: 12345,
          fid: '829a896f011475d50da0d82cfdd1af8d9cdb07ff',
          partner: 'ortb_2_4',
          siteId: '123',
          siteName: 'test.com',
          userIp: '0.0.0.0',
          userId: '1234',
          country: 'IRL', // optional
          impressionId: '1234', // optional
          keywords: 'lifestyle, humour', // optional
          bidfloor: 0.00000011, // optional
          bidfloorcur: 'EUR', // optional
          bcat: ['IAB25', 'IAB7-39', 'IAB8-18', 'IAB8-5', 'IAB9-9'], // optional
          badv: ['first.com', 'second.com'], // optional
          mimes: ['image/jpg'],
          dsa: {
            // optional
            dsarequired: 3,
            pubrender: 0,
            datatopub: 2,
          },
          endpoint: 'https://your-ad-network.com/rtb.php',
        },
      },
    ],
  },
];
```

#### RTB 2.4 Video (Instream/OutStream/Video Slider) - VAST XML or VAST TAG (url)

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `zoneID`      | required | You can get it from the endpoint created after configuring the zones          | `12345`    | `integer` |
| `fid`      | required | You can get it from the endpoint created after configuring the zones          | `'829a896f011475d50da0d82cfdd1af8d9cdb07ff'`    | `string` |
| `partner`      | required | Currently we support rtb 2.4 (“ortb_2_4”) only           | `'ortb_2_4'`    | `string` |
| `siteId`      | recommended |  Unique Site ID           | `'123'`    | `string` |
| `siteName`      |  |  Site name            | `'test.com'`    | `string` |
| `userIp`      | required |  IP address of the user, ipv4 or ipv6          | `'0.0.0.0'`    | `string` |
| `userId`      | *required |  Unique user ID (string). *If you cannot generate a user ID, you can leave it empty (""). The request will get a response as long as “user” object is included in the request          | `''`    | `string` |
| `country`      | required |  country ISO3          | `'IRL'`    | `string` |
| `impressionId`      | required |  Unique impression ID within this bid request           | `'abcde'`    | `string` |
| `keywords`      | optional |  Keywords can be used to ensure ad zones get the right type of advertising. Keywords should be a string of comma-separated words           | `'lifestyle, humour'`    | `string` |
| `bidfloor`      | optional |  Minimum bid for this impression (CPM) / click (CPC) and account currency           | `0.00000011`    | `float` |
| `bidfloorcur`      | optional |  Currency for minimum bid value specified using ISO-4217 alpha codes           | `'EUR'`    | `string` |
| `bcat`      | optional |  Blocked advertiser categories using the IAB content categories           | `['IAB25', 'IAB7-39','IAB8-18','IAB8-5','IAB9-9']`    | `string array` |
| `badv`      | optional |  Block list of advertisers by their domains            | `['first.com', 'second.com']`    | `string array` |
| `mediaTypes`      | required |   To see the specific paragraph for details            | `{ video: { mimes: ['video/mp4'], context: 'instream', protocols: [3, 6] }}`    | `object` |
| `dsa`      | optional |   DSA transparency information. To see paragraph for more info           | `{ dsarequired: 3, pubrender: 0, datatopub: 2 }`    | `object` |
| `endpoint`      | required |   EXADS endpoint (URL)            | `https://your-ad-network.com/rtb.php`    | `string` |

##### MediaTypes.video

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `mimes`      | required | list of supported mime types          | `['video/mp4']`    | `string array` |
| `protocols`      | required | list of supported video bid response protocols          | `[3, 6]`    | `integer array` |
| `context`      | recommended | the video context, either ‘instream’, ‘outstream’. Defaults to ‘instream’          | `'instream'`    | `string` |

```js
adUnits = [
  {
    code: 'postbid_iframe',
    mediaTypes: {
      video: {
        mimes: ['video/mp4'],
        context: 'instream',
        protocols: [3, 6],
      },
    },
    bids: [
      {
        bidder: 'exads',
        params: {
          zoneId: 12345,
          fid: '829a896f011475d50da0d82cfdd1af8d9cdb07ff',
          partner: 'ortb_2_4',
          siteId: '123',
          siteName: 'test.com',
          userIp: '0.0.0.0',
          userId: '1234',
          impressionId: '1234',
          imp: {
            ext: {
              video_cta: 0,
            },
          },
          dsa: {
            // optional
            dsarequired: 3,
            pubrender: 0,
            datatopub: 2,
          },
          country: 'IRL', // optional
          keywords: 'lifestyle, humour', // optional
          bidfloor: 0.00000011, // optional
          bidfloorcur: 'EUR', // optional
          bcat: ['IAB25', 'IAB7-39', 'IAB8-18', 'IAB8-5', 'IAB9-9'], // optional
          badv: ['first.com', 'second.com'], // optional
          endpoint: 'https://your-ad-network.com/rtb.php',
        },
      },
    ],
  },
];
```

#### RTB 2.4 Native

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description           | Example   | Type      |
|---------------|----------|-----------------------|-----------|-----------|
| `zoneID`      | required | You can get it from the endpoint created after configuring the zones          | `12345`    | `integer` |
| `fid`      | required | You can get it from the endpoint created after configuring the zones          | `'829a896f011475d50da0d82cfdd1af8d9cdb07ff'`    | `string` |
| `partner`      | required | Currently we support rtb 2.4 (“ortb_2_4”) only           | `'ortb_2_4'`    | `string` |
| `siteId`      | recommended |  Unique Site ID           | `'123'`    | `string` |
| `siteName`      |  |  Site name            | `'test.com'`    | `string` |
| `userIp`      | required |  IP address of the user, ipv4 or ipv6          | `'0.0.0.0'`    | `string` |
| `userId`      | *required |  Unique user ID (string). *If you cannot generate a user ID, you can leave it empty (""). The request will get a response as long as “user” object is included in the request          | `''`    | `string` |
| `country`      | required |  country ISO3          | `'IRL'`    | `string` |
| `impressionId`      | required |  Unique impression ID within this bid request           | `'abcde'`    | `string` |
| `keywords`      | optional |  Keywords can be used to ensure ad zones get the right type of advertising. Keywords should be a string of comma-separated words           | `'lifestyle, humour'`    | `string` |
| `bidfloor`      | optional |  Minimum bid for this impression (CPM) / click (CPC) and account currency           | `0.00000011`    | `float` |
| `bidfloorcur`      | optional |  Currency for minimum bid value specified using ISO-4217 alpha codes           | `'EUR'`    | `string` |
| `bcat`      | optional |  Blocked advertiser categories using the IAB content categories           | `['IAB25', 'IAB7-39','IAB8-18','IAB8-5','IAB9-9']`    | `string array` |
| `badv`      | optional |  Block list of advertisers by their domains            | `['first.com', 'second.com']`    | `string array` |
| `native.plcmtcnt`      | optional |   the number of identical placements in this Layout             | `4`    | `integer` |
| `assets`      | required |   To see the specific paragraph for more info             | `{}`    | `object` |
| `dsa`      | optional |   DSA transparency information. To see paragraph for more info           | `{ dsarequired: 3, pubrender: 0, datatopub: 2 }`    | `object` |
| `endpoint`      | required |   EXADS endpoint (URL)            | `https://your-ad-network.com/rtb.php`    | `string` |

##### Assets

* **assets (title)**
  * **id** - unique asset ID, assigned by exchange. Typically a counter for the array (integer):
        *1 - image asset ID
        * 2 - title asset ID
        * 3 - description asset ID
  * **required** - set to 1 if asset is required or 0 if asset is optional (integer)
  * **title**
        * len (required) - maximum length of the text in the title element (integer)
* **assets (data)**
  * **id** - unique asset ID, assigned by exchange. Typically a counter for the array (integer):
        *1 - image asset ID
        * 2 - title asset ID
        * 3 - description asset ID
    * **data**
      * **type** - type ID of the element supported by the publisher (integer). We support:
            *1 - sponsored - sponsored By message where response should contain the brand name of the sponsor
            * 2 - desc - descriptive text associated with the product or service being advertised
        * **len** - maximum length of the text in the element’s response (integer)
* **assets (img)**
  * **id** - unique asset ID, assigned by exchange. Typically a counter for the array (integer):
        *1 - image asset ID
        * 2 - title asset ID
        * 3 - description asset ID
    * **required** - set to 1 if asset is required or 0 if asset is optional (integer)
    * **img**
      * **type** - type ID of the image element supported by the publisher. We support:
            *1 - icon image (integer)
            * 3 - large image preview for the ad (integer)
        * **w** - width of the image in pixels, optional (integer)
        * **h** - height of the image in pixels, optional (integer)

```js
adUnits = [
  {
    code: 'postbid_iframe',
    mediaTypes: {
      native: {
        ortb: {
          assets: [
            {
              id: 2,
              required: 1,
              title: {
                len: 124,
              },
            },
            {
              id: 3,
              data: {
                type: 1,
                len: 50,
              },
            },
            {
              id: 1,
              required: 1,
              img: {
                type: 3,
                w: 300,
                h: 300,
              },
            },
          ],
        },
      },
    },
    bids: [
      {
        bidder: 'exads',
        params: {
          zoneId: 12345,
          fid: '829a896f011475d50da0d82cfdd1af8d9cdb07ff',
          partner: 'ortb_2_4',
          siteId: '123',
          siteName: 'test.com',
          userIp: '0.0.0.0',
          userId: '1234',
          impressionId: '1234',
          native: {
            // optional
            plcmtcnt: 4,
          },
          dsa: {
            dsarequired: 3,
            pubrender: 0,
            datatopub: 2,
          },
          country: 'IRL', // optional
          keywords: 'lifestyle, humour', // optional
          bidfloor: 0.00000011, // optional
          bidfloorcur: 'EUR', // optional
          bcat: ['IAB25', 'IAB7-39', 'IAB8-18', 'IAB8-5', 'IAB9-9'], // optional
          badv: ['first.com', 'second.com'], // optional
          endpoint: 'https://your-ad-network.com/rtb.php',
        },
      },
    ],
  },
];
```

### DSA Transparency

All DSA information, returned by the ad server, can be found into the **meta** tag of the response. As:

```js
"meta": {
    "dsa": {
        "behalf": "...",
        "paid": "...",
        "transparency": [
            {
                "params": [
                    ...
                ]
            }
        ],
        "adrender": ...
    }
}
```

For more information navigate to the [page](/dev-docs/bidder-adaptor.html).
