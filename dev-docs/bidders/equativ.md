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

### Bid params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
|------|-------|-------------|---------|------|
| `networkId` | required | The network identifier you have been provided with. _See **Bid Parameter Usage** notes below for more information_. | `1234` | `integer` |
| `siteId` | required | The placement site ID. _See **Bid Parameter Usage** notes below for more information_. |`1234` | `integer` |
| `pageId` | required | The placement page ID. _See **Bid Parameter Usage** notes below for more information_. | `1234` | `integer` |
| `formatId` | required | The placement format ID. _See **Bid Parameter Usage** notes below for more information_. | `1234` | `integer` |

#### Bid Parameter Usage

Different combinations of parameters are required depending upon which ones you choose to use.

There are three options for passing bidder parameters:

- **Option 1**. Specify `networkId` by itself (_without_ `siteId`, `pageId` and `formatId`), or
- **Option 2**. Specify `siteId` _and_ `pageId` _and_ `formatId` (all together) _without_ `networkId`, or
- **Option 3**. Specify _none_ of the above parameters, and instead use either `ortb2.site.publisher.id`, `ortb2.app.publisher.id` or `ortb2.dooh.publisher.id`

See **Sample Banner Setup** for examples of these parameter options.

### Supported Media Types

{: .table .table-bordered .table-striped }
| Type | Support |
|---|---|
| `banner` | Supported |
| `video` | Not currently supported |
| `native` | Not currently supported |

### User Syncing

To enable cookie syncing, make sure their configuration setup is properly invoked.

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

And also making sure that storage is enabled for `equativ`:

```js
pbjs.bidderSettings = {
  equativ: {
    storageAllowed: true,
  },
};
```

### Configuration Example

#### Sample Banner Setup

As mentioned in the **Bid Parameter Usage** section, when including `'equativ'` as one of your available bidders your adunit setup, there are three general approaches to how you can specify parameters. Below are examples that illustrate them.

#### Option 1 -- Using networkId as the only bid param

```html
<script>
  var adUnits = [
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
          // siteId, pageId and formatId are NOT
          // required if networkId is provided instead
          params: {
            networkId: 42,
          },
        },
      ],
    },
  ];

  pbjs.que.push(function () {
    pbjs.addAdUnits(adUnits);
  });
</script>
```

#### Option 2 - Using siteId, pageId and formatId as bid params

```html
<script>
  var adUnits = [
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
          // all 3 of the below params are required
          // when used together in place of networkId
          params: {
            siteId: 1,
            pageId: 2,
            formatId: 3,
          },
        },
      ],
    },
  ];

  pbjs.que.push(function () {
    pbjs.addAdUnits(adUnits);
  });
</script>
```

#### Option 3 - Using ortb2 for parameter info

You can also, as an alternative to using bidder params, specify a value for `publisher.id` that may be nested under an `app`, `site` or `dooh` object. The Equativ adapter will, in turn, look for these property paths under the `ortb2` property of the request:

- `ortb2.app.publisher.id`
- `ortb2.site.publisher.id`
- `ortb2.dooh.publisher.id`

### Additional Resources

Information about how Equativ supports the oRTB specification, along with additional examples, can be found [on our OpenRTB API support site](https://help.smartadserver.com/s/article/OpenRTB-API-for-suppliers-Bid-request-specification-Part-1).
