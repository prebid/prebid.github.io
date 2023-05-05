---
layout: bidder
title: Adagio
description: Prebid Adagio Bidder Adaptor
pbjs: true
biddercode: adagio
media_types: banner, native, video
userIds: all
floors_supported: true
gdpr_supported: true
usp_supported: true
coppa_supported: true
schain_supported: true
gvl_id: 617
prebid_member: true
fpd_supported: false
sidebarType: 1
---

### Note

The Adagio bidder adapter requires setup and approval from the Adagio team. Please reach out to [contact@adagio.io](mailto:contact@adagio.io) for more information.

### Configuration

#### User Sync

Adagio strongly recommends enabling user syncing through iFrames. This functionality improves DSP user match rates and increases the bid rate and bid price. Make sure to call `pbjs.setConfig()` only once. This configuration is optional in Prebid, but required by Adagio.

```js
// https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig.html#setConfig-Configure-User-Syncing
pbjs.setConfig({
  userSync: {
    filterSettings: {
      iframe: {
        bidders: ['adagio'],
        filter: 'include'
      }
    }
  }
});
```

#### Bidder Settings

The Adagio bid adapter uses browser local storage. Since Prebid.js 7.x, the access to it must be explicitly set.

```js
// https://docs.prebid.org/dev-docs/publisher-api-reference/bidderSettings.html
pbjs.bidderSettings = {
  adagio: {
    storageAllowed: true
  }
}
```

### Bid Params

**Important**: Adagio needs to collect attention data about the ads displayed on a page and must listen to some specifics ad-server events. Please refer to the [Adagio user guide](https://adagioio.notion.site/Adagio-Account-Setup-Guide-fbcd940649224cdfa10393d2f008792e) for details.

{: .table .table-bordered .table-striped }
| Name              | Scope              | Description                                                                                                                                                                                                                                          | Example                                                      | Type     |
| ----------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | -------- |
| `organizationId`  | required           | Id of the Organization. Handed out by Adagio.                                                                                                                                                                                                        | `'1010'`                                                     | `string` |
| `site`            | required           | Name of the site. Handed out by Adagio.<br><i>- max length: 50</i>                                                                                                                                                                                   | `'mysite-com'`                                               | `string` |
| `placement`*      | required           | Refers to the placement of an adunit in a page.<br>Must not contain any information about the type of device.<br><i>- max length: 30</i><br><i>- max distinctives values: 10</i>                                                                     | `'ban_atf'`                                                  | `string` |
| `adUnitElementId` | required           | Refers to the adunit html attribute id in a page.                                                                                                                                                                                                    | `'gpt-ban-atf'`                                              | `string` |
| `pagetype`*       | highly recommended | Describes what kind of content will be present in the page.<br><i>- max length: 30</i><br><i>- max distinctives values: 50</i>                                                                                                                       | `'article'`                                                  | `string` |
| `category`*       | recommended        | Category of the content displayed in the page.<br><i>- max length: 30</i><br><i>- max distinctives values: 50</i>                                                                                                                                    | `'sport'`                                                    | `string` |
| `video`           | optional           | OpenRTB video options object. All options will override ones defined in mediaTypes video.<br>Mandatory: <br>- api <small><i>(your video player must at least support the value 2 and/or 7)</i></small><br> Highly recommended: <br> - playbackmethod | `{api: [2, 7], playbackmethod: [6], skip: 1, startdelay: 0}` |
| `native`          | optional           | Partial OpenRTB Native 1.2 request object. Supported fields are:<br>- context<br>- plcmttype                                                                                                                                                         | `{context: 1, plcmttype: 2}`                                 | `object` |
| `splitKeyword`     | optional           | Keyword that can later be used in a split rule targeting to trigger the rule (especially for Direct Seats AB testing) |  `'splitrule-one'` | `string` |
| `dataLayer`        | optional           | A set of arbitrary key-value pairs. This can be used to configure mappings. The keys and values must be strings. | `{placement: 'my-placement', siteid: 'my-siteid'}` | `object` |

<i>*These parameters will have its accentuated characters converted to their non-accentuated version:&nbsp;`é`&nbsp;=>&nbsp;`e`</i>

### Native Custom assets

| Name         | description                  |
| ------------ | ---------------------------- |
| `adagio_bvw` | Url to handle Measure beacon |

### First Party Data

Adagio will use FPD data as fallback for the params below:
- pagetype
- category

If the FPD value is an array, the 1st value of this array will be used.
