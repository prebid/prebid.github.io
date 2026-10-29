---
layout: bidder
title: Magnite
description: Prebid Magnite Bidder Adapter
biddercode: magnite
tcfeu_supported: true
dsa_supported: true
gpp_sids: tcfeu, usnat, usstate_all, usp
usp_supported: true
coppa_supported: true
schain_supported: true
floors_supported: true
media_types: banner, video, native
userIds: all
prebid_member: true
safeframes_ok: true
deals_supported: true
pbjs: true
pbs: false
fpd_supported: true
ortb_blocking_supported: true
gvl_id: 52
multiformat_supported: will-bid-on-any
sidebarType: 1
---

## Registration

For existing DV+ Accounts transitioning from the Rubicon adapter to the Magnite adapter, you can use your existing Account, Site, Zone ids, with new line items and orders. Please reach out to your account manager if you have additional questions

### Bid Params

{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example | Type |
| --- | --- | --- | --- | --- |
| `accountId` | required | The publisher account ID | `14062` | `integer` |
| `siteId` | required | A unique ID for your site | `70608` | `integer` |
| `zoneId` | required | A unique ID for your site's ad placements | `498816` | `integer` |

#### First Party Data

Publishers should use the `ortb2` method of setting First Party Data. The following fields are supported:

- ortb2.site.ext.data.*
- ortb2.site.keywords
- ortb2.site.content.data[]
- ortb2.user.ext.data.*
- ortb2.user.data[]

The Magnite exchange supports IAB standard taxonomies for contextual and audience segments.

Example first party data available to all bidders and all ad units:

```javascript
pbjs.setConfig({
  ortb2: {
    site: {
      keywords: "kw1,kw2",
      ext: {
        data: {
          prodtype: ["tech","mobile"]
        }
      }
    },
    user: {
      ext: {
        data: {
          ucat: ["new"]
        }
      }
    }
  }
});
```

Example of first party data available only to the Magnite bidder across all ad units:

```javascript
pbjs.setBidderConfig({
  bidders: ["magnite"],
  config: {
    ortb2: {
      site: {
        keywords: "kw1,kw2",
        ext: {
          data: {
            prodtype: ["tech","mobile"]
          }
        }
      },
      user: {
        ext: {
          data: {
            ucat: ["new"]
          }
        }
      }
    }
  }
});
```

### Media Types

#### Banner

Banner ads are supported with standard IAB sizes.

```javascript
var bannerAdUnit = {
    code: 'test-div',
    mediaTypes: {
        banner: {
            sizes: [[300, 250], [728, 90]]
        }
    },
    bids: [{
        bidder: 'magnite',
        params: {
            accountId: 14062,
            siteId: 70608,
            zoneId: 498816
        }
    }]
};
```

#### Video

The Magnite adapter supports standard OpenRTB video parameters for both instream and outstream contexts.

```javascript
var videoAdUnit = {
    code: 'myVideoAdUnit',
    mediaTypes: {
        video: {
            context: 'instream',
            playerSize: [640, 480],
            mimes: ['video/mp4', 'video/x-ms-wmv'],
            protocols: [2, 5],
            maxduration: 30,
            linearity: 1,
            api: [2]
        }
    },
    bids: [{
        bidder: 'magnite',
        params: {
            accountId: 14062,
            siteId: 70608,
            zoneId: 498816
        }
    }]
};
```

Outstream video is also supported. We recommend discussing video demand with your Magnite account representative.

#### Native

The Magnite adapter supports native ads using the ORTB Native spec. We recommend version 1.2, but versions 1.0 and 1.1 are also supported.

{: .table .table-bordered .table-striped }

| Native Version | Required Fields |
| --- | --- |
| 1.0 and 1.1 | layout, adunit, assets |
| 1.2 | context, plcmttype, assets, eventtrackers. privacy is a recommended field. |

Here's an example using ORTB Native 1.2:

```javascript
var nativeAdUnit = {
    code: 'myNativeAdUnit',
    mediaTypes: {
        native: {
            ortb: {
                ver: "1.2",
                context: 2,
                plcmttype: 11,
                privacy: 1,
                assets: [{
                    id: 1,
                    required: 1,
                    img: {
                        type: 3,
                        w: 150,
                        h: 50
                    }
                }],
                eventtrackers: [{
                    event: 1,
                    methods: [1, 2]
                }]
            }
        }
    },
    bids: [{
        bidder: 'magnite',
        params: {
            accountId: 14062,
            siteId: 70608,
            zoneId: 498816
        }
    }]
};
```

### Configuration

#### User Sync

Add the following code to enable user syncing. By default, Prebid.js turns off user syncing through iframes. Magnite recommends enabling iframe-based user syncing to improve match rates and bid performance.

```javascript
pbjs.setConfig({
    userSync: {
        iframeEnabled: true
    }
});
```

### Migration from Rubicon

The Magnite adapter (`bidder: "magnite"`) is designed as the next-generation replacement for the Rubicon adapter (`bidder: "rubicon"`). It uses a modern OpenRTB integration that is simpler and easier to maintain.

Key points for migrating:

- The bid params (`accountId`, `siteId`, `zoneId`) remain the same.
- The adapter accepts configuration from both `magnite` and `rubicon` config namespaces during the transition.
- Update `bidder: "rubicon"` to `bidder: "magnite"` in your ad unit configurations.

#### Preserving Existing GAM Line Items

If you are migrating from the Rubicon adapter and your Google Ad Manager (GAM) line items rely on bidder-specific key-value targeting (e.g., `hb_bidder=rubicon` or `hb_pb_rubicon`), you can avoid updating your ad server setup by aliasing the Magnite adapter as `rubicon`. This causes bids from the Magnite adapter to be reported under the `rubicon` bidder code, preserving compatibility with your existing line items.

```javascript
pbjs.aliasBidder('magnite', 'rubicon');
```

Then use the alias in your ad unit configuration:

```javascript
var adUnit = {
    code: 'test-div',
    mediaTypes: {
        banner: {
            sizes: [[300, 250]]
        }
    },
    bids: [{
        bidder: 'rubicon',
        params: {
            accountId: 14062,
            siteId: 70608,
            zoneId: 498816
        }
    }]
};
```

With this approach, Prebid.js will use the Magnite adapter under the hood but send targeting keys as `hb_bidder=rubicon`, `hb_pb_rubicon`, etc., so your existing GAM line items continue to work without changes.

{: .alert.alert-info :}
The `rubicon` alias is **not** included as a default alias of the Magnite adapter by design. This allows publishers to include both the Magnite and Rubicon adapters in the same Prebid.js build for A/B testing during migration. However, for production use after migration, the recommended approach is to build Prebid.js with only the Magnite adapter (without the Rubicon adapter) and use `pbjs.aliasBidder('magnite', 'rubicon')` as shown above. This avoids potential conflicts between the two adapters.
