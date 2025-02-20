---
layout: bidder
title: Equativ
description: Prebid Equativ Bidder Adapter
biddercode: equativ
tcfeu_supported: true
dsa_supported: true
gvl_id: 45
usp_supported: true
coppa_supported: true
gpp_sids: tcfeu, usp
schain_supported: true
dchain_support: false
userIds: all
media_types: banner
safeframes_ok: true
deals_supported: false
floors_supported: true
fpd_supported: false
pbjs: true
pbs: true
prebid_member: false
multiformat_supported: will-bid-on-one
ortb_blocking_supported: true
privacy_sandbox: no
sidebarType: 1
---

### Registration

The Equativ bidder adapter requires setup and approval from the Equativ service team. Please reach out to your account manager for more information to start using it.

### Bid Params

#### Fields

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|------|-------|-------------|---------|------|
| `networkId` | required | The network identifier you have been provided with. Normally required, but there are certain conditions under which this may be omitted. _See **Bid Parameter Usage** notes below for more information_. | `1234` | `integer` |
| `siteId` | optional | The placement site ID. _See **Bid Parameter Usage** notes below for more information_. |`1234` | `integer` |
| `pageId` | optional | The placement page ID. _See **Bid Parameter Usage** notes below for more information_. | `1234` | `integer` |
| `formatId` | optional | The placement format ID. _See **Bid Parameter Usage** notes below for more information_. | `1234` | `integer` |

#### Usage

Different combinations of parameters are required depending upon which ones you choose to use.

There are two options for passing Equativ-specific bidder parameters: through bidder params, or through ortb2.

##### Through bidder params Object

Publishers can specify required and/or optional parameters through the bidder params object hierarchy like this:

```javascript
var adUnits = [
  {
    /// ... mediaType and other stuff here
    bids: [
      {
        bidder: 'equativ',
        params: {
          networkId: 42, // REQUIRED
          siteId: 142, // optional
          pageId: 242, // optional
          formatId: 342, // optional
        },
      },
    ],
  },
];
```

##### Through ortb2

A second way to specify Equativ-specific bidder parameters is through the `ortb2` object. The example below references a `ortb2.site.publisher.id` hierarchy, but publishers can also use `ortb2.app.publisher.id` or `ortb2.dooh.publisher.id` as their needs dictate.

```javascript
pbjs.setBidderConfig({
  bidders: ['equativ'],
  config: {
    ortb2: {
      site: {
        publisher: {
          id: 42,
        },
      },
    },
  },
});
```

### Supported Media Types

{: .table .table-bordered .table-striped }
| Type | Support |
|---|---|
| `banner` | Supported |
| `video` | Supported |
| `native` | Supported |

### User Syncing

To enable cookie syncing, make sure the configuration setup is properly invoked.

This involves adding an entry for `setConfig()` that allows user syncing for iframes with `'equativ'` included as a bidder:

```js
pbjs.setConfig({
  userSync: {
    filterSettings: {
      iframe: {
        bidders: ['equativ'],
      },
    },
  },
});
```

And also making sure that storage is enabled for `equativ`.

{% include dev-docs/storageAllowed.md %}

```js
pbjs.bidderSettings = {
  equativ: {
    storageAllowed: true,
  },
};
```

### Ad Unit Setup

#### Banner

As mentioned in the **Bid Params > Usage** section, when including `'equativ'` as one of the available bidders in an adunit setup, there are two approaches to how publishers can specify parameters. The below example uses the approach using the `params` object.

```javascript
var bannerAdUnits = [
  {
    code: 'div-123',
    mediaTypes: {
      banner: {
        sizes: [
          [600, 500],
          [300, 600],
        ],
      },
    },
    bids: [
      {
        bidder: 'equativ',
        params: {
          networkId: 42, // REQUIRED
          siteId: 142, // optional
          pageId: 242, // optional
          formatId: 342, // optional
        },
      },
    ],
  },
];

pbjs.que.push(function () {
  pbjs.addAdUnits(bannerAdUnits);
});
```

#### Video

As mentioned in the **Bid Params > Usage** section, when including `'equativ'` as one of the available bidders in an adunit setup, there are two approaches to how publishers can specify parameters. The below example uses the approach using the `params` object.

Note that the `optional`, `recommended` and `REQUIRED` comments apply to the property itself, and not necessarily the values used in this example (_i.e._ `skip` _is a recommended property to include, but it is up to publishers to decide what particular value it should have_).

```javascript
var videoAdUnits = [
  {
    code: 'div-123',
    mediaTypes: {
      video: {
        context: 'instream',
        mimes: ['video/mp4'], // REQUIRED
        linearity: 1, // optional
        minduration: 10, // recommended
        maxduration: 30, // recommended
        placement: 1, // REQUIRED
        skip: 1, // recommended
        startdelay: 1, // recommended
        pos: 1, // optional
        playbackmethod: 1, // optional
        battr: [10, 11], // optional
        api: [1, 2], // optional
        playerSize: [640, 480], // recommended
      },
    },
    bids: [
      {
        bidder: 'equativ',
        params: {
          networkId: 42, // REQUIRED
          siteId: 142, // optional
          pageId: 242, // optional
          formatId: 342, // optional
        },
      },
    ],
  },
];

pbjs.que.push(function () {
  pbjs.addAdUnits(videoAdUnits);
});
```

#### Native

As mentioned in the **Bid Params > Usage** section, when including `'equativ'` as one of the available bidders in an adunit setup, there are two approaches to how publishers can specify parameters. The below example uses the approach using the `params` object.

```javascript
var nativeAdUnits = [
  {
    code: 'native-div',
    mediaTypes: {
      native: {
        adTemplate: `<div class="sponsored-post">
                  <div class="thumbnail" style="background-image: url(##hb_native_asset_id_2##);"></div>
                  <div class="content">
                      <h1>
                          <a href="%%CLICK_URL_UNESC%%##hb_native_linkurl##" target="_blank" class="pb-click" hb_native_asset_id="1">##hb_native_asset_id_1##</a>
                      </h1>
                      <p>##hb_native_asset_id_9##</p>
                      <div class="attribution">##hb_native_asset_id_6##</div>
                  </div>
                </div>`,
        ortb: {
          context: 1,
          plcmttype: 1,
          assets: [
            {
              id: 1,
              required: 1,
              title: {
                len: 80, // Title  (corresponds with id 1 from ad markup)
              },
            },
            {
              id: 2,
              required: 1,
              img: {
                type: 3, // Main Image (corresponds with id 2 from  ad markup)
                w: 300,
                h: 180,
              },
            },
            {
              id: 6,
              required: 1,
              img: {
                type: 1, // Additional image (corresponds with id 6 from  ad markup)
                w: 100,
                h: 100,
              },
            },
            {
              id: 9,
              required: 1,
              data: {
                type: 2, // Additional text (description) (dodatkowy )corresponds with id 9 from  ad markup)
              },
            },
          ],
          eventtrackers: [
            {
              event: 1,
              methods: [1],
            },
          ],
          ver: '1.2',
          privacy: 1,
        },
      },
    },
    bids: [
      {
        bidder: 'equativ',
        params: {
          networkId: 73,
          formatId: 142,
          pageId: 242,
          siteId: 342,
        },
      },
    ],
  },
];

pbjs.que.push(function () {
  pbjs.addAdUnits(nativeAdUnits);
});
```

#### Audio

It is possible to specify audio inventory through the Equativ adapter. To do so, publishers can define a video-formatted ad unit and specify audio information through the `ortb2Imp` property, like the example shown below.

Note that the `optional`, `recommended` and `REQUIRED` comments apply to the property itself, and not necessarily the values used in this example (_i.e._ `minduration` _is a recommended property to include, but it is up to publishers to decide what particular value it should have_).

```javascript
var audioAdUnits = [
  {
    code: '/19968336/header-bid-tag-1',
    mediaTypes: {
      video: {
        context: 'instream',
        playerSize: [640, 480],
      },
    },
    ortb2Imp: {
      audio: {
        mimes: ['audio/mpeg', 'audio/mp4'], // REQUIRED
        api: [7], // optional
        delivery: [2, 4], // optional
        minbitrate: 128, // optional
        maxbitrate: 192, // optional
        minduration: 10, // recommended
        maxduration: 30, // recommended
        maxextended: -1, // optional
        protocols: [1, 3, 4, 7], // recommended
        startdelay: 5, // recommended
      },
    },
    bids: [
      {
        bidder: 'equativ',
        params: {
          networkId: 1234,
        },
      },
    ],
  },
];

pbjs.que.push(function () {
  pbjs.addAdUnits(audioAdUnits);
});
```

{: .alert.alert-warning :}
**Note**: If a demand partner of Equativ is not capable of reading an audio object, the audio object will be converted into a video object with audio mime types. There is, as of this writing, no built-in/default support for serving audio assets in Prebid, so publishers that wish to do so will need to ensure their ad server setups can process whatever hand-offs are necessary.

### Additional Resources

Information about how Equativ supports the oRTB specification, along with additional examples, can be found [on our OpenRTB API support site](https://help.smartadserver.com/s/article/OpenRTB-API-for-suppliers-Bid-request-specification-Part-1).
