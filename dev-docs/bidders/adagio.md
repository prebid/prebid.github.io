---
layout: bidder
title: Adagio
description: Prebid Adagio Bidder Adaptor
pbs: true
pbs_app_supported: true
pbjs: true
biddercode: adagio
media_types: banner, native, video
userIds: all
multiformat_supported: will-bid-on-any
floors_supported: true
tcfeu_supported: true
dsa_supported: true
usp_supported: true
coppa_supported: true
gpp_supported: true
gpp_sids: all
schain_supported: true
gvl_id: 617
prebid_member: true
fpd_supported: false
safeframes_ok: true
dchain_supported: false
deals_supported: false
ortb_blocking_supported: false
endpoint_compression: true
privacy_sandbox: 'no'
sidebarType: 1
---

### Table of contents

* [Table of contents](#table-of-contents)
* [Introduction](#introduction)
* [Bid params](#bid-params)
  * [Setting params: AdUnit Level vs First Party Data](#setting-params-adunit-level-vs-first-party-data)
* [Prebid Server](#prebid-server-adapter)
* [Additional informations](#additional-informations)
  * [User Sync](#user-sync)
  * [Recommended placement param values](#recommended-placement-param-values)
  * [Video outstream](#video-outstream)

### Introduction

The Adagio bidder adapter requires setup and approval from the Adagio team. Please reach out to [contact@adagio.io](mailto:contact@adagio.io) for more information.

We strongly recommend using it alongside the [Adagio RTD Provider](/dev-docs/modules/adagioRtdProvider.md), which leverages viewability and attention predictions to enhance inventory quality and maximize performance.

We also strongly suggest enabling the gptPreAuction module, which automatically populates the GPID (Global Placement ID) values. The GPID helps improve monetization by providing more accurate identification of each ad placement. For setup details, see the [gptPreAuction module documentation](/dev-docs/modules/gpt-pre-auction.md).

### Bid params

{: .table .table-bordered .table-striped .table-responsive }

| Name              | Scope              | Description                                                                                                                                                                                                                                          | Example                                                      | Type     |
| ----------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | -------- |
| `organizationId`  | required           | Id of the Organization. Handed out by Adagio.                                                                                                                                                                                                        | `'1010'`                                                     | `string` |
| `site`            | required / optional (in-app)            | Name of the site. Handed out by Adagio.<br><span style="display:inline-block; margin-top: 0.6em; line-height:1.5; font-size:14px; font-style:italic;">- max length: 50</span>                                                                                                                                                                                   | `'mysite-com'`                                               | `string` |
| `placement`     | required           | Refers to the placement of an adunit in a page. See [recommended values](#recommended-placement-param-values).<br><span style="display:inline-block; margin-top: 0.6em; line-height:1.5; font-size:14px; font-style:italic;">- max length: 50<br>- max distinctives values: 10</span>                                                                     | `'banner_top'`                                                  | `string` |
| `pagetype`      | highly recommended | Describes what kind of content will be present in the page.<br><span style="display:inline-block; margin-top: 0.6em; line-height:1.5; font-size:14px; font-style:italic;">- max length: 30<br>- max distinctives values: 50</span><br><span style="display:inline-block; line-height:1.5; font-size:14px;">Can be set at adUnit level or via FPD ([see below](#setting-params-adunit-level-vs-first-party-data))</span>                                    | `'article'`                                                  | `string` |
| `category`      | recommended        | Category of the content displayed in the page.<br><span style="display:inline-block; margin-top: 0.6em; line-height:1.5; font-size:14px; font-style:italic;">- max length: 30<br>- max distinctives values: 50</span><br><span style="display:inline-block; line-height:1.5; font-size:14px;">Can be set at adUnit level or via FPD ([see below](#setting-params-adunit-level-vs-first-party-data))</span>                                               | `'sport'`                                                    | `string` |

#### Setting params: AdUnit Level vs First Party Data

You can set `pagetype` and `category` parameters in two ways:

**1. At the adUnit level** (individual ad slots):

```js
{
  code: 'div-gpt-ad-1234567890',
  mediaTypes: {
    banner: {
      sizes: [[300, 250]]
    }
  },
  bids: [{
    bidder: 'adagio',
    params: {
      organizationId: '1010',
      site: 'mysite-com',
      placement: 'banner_top',
      pagetype: 'article',
      category: 'sport'
    }
  }]
}
```

**2. Globally via First Party Data** (applies to all adUnits on the page):

```js
pbjs.setConfig({
  ortb2: {
    site: {
      ext: {
        data: {
          pagetype: 'article',
          category: 'sport'
        }
      }
    }
  }
});
```

* First Party Data takes precedence over AdUnit-level parameters.
* If the FPD value is an array, the first value will be used.

<a id="prebid-server-adapter"></a>
### Prebid Server

If you are hosting a Prebid Server, you must configure the Adagio Prebid Server adapter by changing the [`static/bidder-info/adagio.yaml` file](https://github.com/prebid/prebid-server/blob/master/static/bidder-info/adagio.yaml) in order to:

1. enable the adapter by deleting the `disabled: true` entry _(or set it to `false`)_
2. replace the endpoints containing the `REGION` by one of the value below:
    * **AMER:**
      * Auction: `https://mp-las.4dex.io/pbserver`
      * Usersync: `https://u-las.4dex.io/pbserver/usync.html`
    * **EMEA:**
      * Auction: `https://mp-ams.4dex.io/pbserver`
      * Usersync: `https://u-ams.4dex.io/pbserver/usync.html`
    * **APAC:**
      * Auction: `https://mp-tyo.4dex.io/pbserver`
      * Usersync: `https://u-tyo.4dex.io/pbserver/usync.html`

**Example for EMEA**

{% raw %}

```yaml
endpoint: "https://mp-ams.4dex.io/pbserver"
userSync:
  iframe:
    url: "https://u-ams.4dex.io/pbserver/usync.html?gdpr={{.GDPR}}&gdpr_consent={{.GDPRConsent}}&us_privacy={{.USPrivacy}}&gpp={{.GPP}}&&gpp_sid={{.GPPSID}}&r={{.RedirectURL}}"
    userMacro: "{UID}"
disabled: false
# …
```

{% endraw %}

### Additional informations

#### User Sync

Enable user sync via iframe to improve DSP user match rates, leading to higher bid rates and bid prices. While this configuration is optional in Prebid, it is required by Adagio. Ensure that `pbjs.setConfig()` is called only once.

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

#### Recommended placement param values

Setting a meaningful value for the `placement` parameter is essential for our adapter to optimize ad delivery and performance, as it defines the specific location and context of your ad unit within the page. To streamline your implementation and ensure consistent naming conventions across your inventory, we provide these standardized values that eliminate guesswork and ensure your ad units are properly categorized for maximum yield.

{: .table .table-bordered :}

| Format              | recommended values    |
| --------------------| --------------------- |
| Banner              | `banner_top`,<br>`banner_middle`,<br>`banner_bottom`,<br>`banner_left`,<br>`banner_right`,<br>`banner_sticky_top`,<br>`banner_sticky_bottom` |
| Interstitial        | `interstitial_page_load`,<br>`interstitial_exit`,<br>`interstitial_pause` |
| Video               | `video_instream`,<br>`video_outstream`,<br>`video_rewarded`,<br>`video_midroll` |
| Native              | `native_feed`,<br>`native_article`,<br>`native_recommendation` |
| Special             | `sticky_footer`,<br>`sticky_header`,<br>`companion_banner`,<br>`overlay_ad` |

#### Video outstream

The Adagio bidder adapter (Prebid.js only) includes a default video player powered by [Blue Billywig](https://www.bluebillywig.com). This default player is used when no renderer is configured for the adUnit.

---
