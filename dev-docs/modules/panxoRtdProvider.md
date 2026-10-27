---
layout: page_v2
title: Panxo RTD Provider
display_name: Panxo RTD Provider
description: Panxo real-time coarse AI visit classification
page_type: module
module_type: rtd
module_code: panxoRtdProvider
enable_download: true
vendor_specific: true
sidebarType: 1
---

# Panxo RTD Provider

Maintainer: [prebid@panxo.ai](mailto:prebid@panxo.ai)

## Description

The Panxo RTD provider reads the external runtime's AI visit classification
and exposes only its coarse `{ai: true}` signal through `site.ext.data.panxo`.
This describes the visit, not whether the page is public or about AI. The
candidate discards legacy device/user payloads and all other site fields,
including `src`, `conf`, `seg`, `co`, `topics` and arbitrary `context`.

`panxoRtdProvider` first shipped in Prebid.js 10.25. This proposal updates
the existing provider. The Prebid core `rtdModule` remains an unchanged
dependency.

The provider registers GVL ID `1527` with Prebid and checks the standard
`accessDevice` and `enrichUfpd` activities before loading or connecting the
runtime, accepting callback signals or enriching an auction. Prebid's loader also
enforces `loadExternalScript`. A valid configuration remains initialized
after a blocked load, allowing a later auction to retry when permitted.
If the script finished loading while blocked, it can connect later without
another download.

Configuration validation and the provider's `init` result remain synchronous.
Initial preloading starts in a later browser task, after synchronous listeners
for the same `pbjs.setConfig` call have registered consent and publisher activity
controls. Configure those controls together with or before RTD. An auction can
start loading immediately and still checks the current activities. The deferred
preload is cancelled by deletion or replacement of the connection. Loading
exceptions release waiting auctions without enrichment and permit a later retry.

An observed denial clears the provider's cached signal, invalidates its bridge
and releases waiting auctions without enrichment. These checks use Prebid's
current activity rules; they do not add a geographic policy or independently
interpret GDPR, GPP, USP or COPPA. With no configured consent or publisher
activity controls, Prebid's default behavior can allow the activity. These
checks cannot stop independent storage or network operations of a runtime
that has already executed.

The update retains the default script URL and signal/error messages. Its `connect`
bridge receives a frozen empty object as its first argument and the guarded
signal callback as its second. The provider supplies no Prebid methods, event
subscriptions or auction payloads through this argument. This intentionally
removes the historical event interface; the coarse classification runtime does
not use it. The empty argument does not sandbox the separately loaded script.
The RTD core reads `realTimeData.dataProviders` once and caches
the provider's `init` result. Configure it before starting auctions; subsequent
`pbjs.setConfig` calls do not reinitialize the provider. Local data deletion
retires the current connection and its callback. The provider also retires
the previous connection if its `init` is called again; late callbacks cannot
enrich a later connection's auctions.
The default bridge still uses the historical script URL and message interface, but
now discards its device/user payloads and narrows site data to the coarse AI
visit flag. This is an intentional change to
enrichment behavior. The loaded script can make independent identity and sync
requests; filtering its messages does not prevent that behavior. Local deletion
does not establish deletion or retention behavior in that runtime.

This documentation covers a proposed update; it is not yet a released version.

To use the provider, contact
[publishers@panxo.ai](mailto:publishers@panxo.ai) or sign up at
[app.panxo.ai](https://app.panxo.ai) to receive a site identifier.

## Build

Include the bidder adapter, the unchanged core RTD module and this provider in
the same publisher build:

```bash
gulp build --modules=panxoBidAdapter,rtdModule,panxoRtdProvider
```

**Disclosure:** This module loads external code that is not open source and
has not been reviewed by Prebid.org. The runtime is downloaded from
`https://api.idsequoia.ai/rtd.js` to obtain the Panxo signals. Publisher
registration is required to use the commercial service. The isolated test mode
below instead selects its disclosed static reviewer URL and reserved fixtures.

The initial script request sends the property `siteId` and a per-connection
`session` value. It does not include the publisher's referrer domain as a query
parameter. Before inserting the script, the loader sets `crossorigin="anonymous"`
and `referrerpolicy="no-referrer"`. These suppress cross-origin credentials and
the HTTP Referer header for this request; anonymous CORS still permits same-origin
credentials. The script download remains a network request; its CORS `Origin`
header can expose the publisher origin along with other transport metadata.
These attributes do not control subsequent runtime requests.

## Configuration

```javascript
pbjs.setConfig({
  realTimeData: {
    auctionDelay: 1500,
    dataProviders: [{
      name: 'panxo',
      waitForIt: true,
      params: {
        siteId: 'YOUR_SITE_ID'
      }
    }]
  }
});
```

Use `waitForIt: true` with a bounded `auctionDelay` when Panxo signals must be
available to the first auction. The provider still permits the auction to
continue when the remote classification does not complete within that bound.

## Parameters

{: .table .table-bordered .table-striped }
| Name | Type | Description | Required |
| --- | --- | --- | --- |
| `siteId` | `string` | 16 lowercase hexadecimal characters identifying the publisher property | Yes |
| `verbose` | `boolean` | Enable additional diagnostic messages; defaults to `false` | No |
| `test` | `boolean` | Use the fixed synthetic reviewer with a reserved site identifier; defaults to `false` | No |

Replace `YOUR_SITE_ID` with the value issued by Panxo; the placeholder is not a
valid property identifier. For syntax illustration, `a1b2c3d4e5f67890` has the
required format but is not a reviewer account.

The provider implementation is loaded through Prebid's module loader and
activity controls. Prebid publishers should not install a second Panxo signal
script directly on the page.

## Isolated reviewer mode

The optional boolean `params.test: true` selects the fixed synthetic reviewer
script `https://panxo-prebid-reviewer-external.okpbidgx.workers.dev/rtd.js`.
It requires one of the six reserved site identifiers `0000000000000001`
through `0000000000000006`, corresponding to banner, instream video, native,
CTV video, in-app banner and in-app native. Those identifiers are rejected
without `test: true`; ordinary site identifiers are rejected in test mode.
Non-boolean values are rejected. The provider never falls back from the
reviewer to the commercial script endpoint.

```javascript
pbjs.setConfig({
    realTimeData: {
        auctionDelay: 1500,
        dataProviders: [{
            name: 'panxo', waitForIt: true,
            params: { siteId: '0000000000000001', test: true }
        }]
    }
});
```

Use a clean test page and configure the provider before its first auction.
The core still initializes it once. If the provider is explicitly initialized
again, its endpoint, site and signal state belong to a new connection generation;
late callbacks from the previous mode cannot enrich it. A rejected initialization
retires the old connection and releases its pending auctions without enrichment.
Activity controls, anonymous CORS and the no-referrer policy apply to both modes.

This RTD option does not change bidder routing. Prebid.js bidder review also
requires numeric `ortb2.test: 1` and the matching reserved property key described
in the bidder documentation. The reviewer is synthetic and has no live demand
or billing. It does not verify serving at the default commercial endpoint.

## Data added to the auction

Only an own data property `ai` with the boolean value `true` produces
`site.ext.data.panxo = {ai: true}`. False, absent or invalid values produce an
empty internal projection `{}`; values are not coerced. That empty projection
adds no new Panxo site fragment and does not clear existing publisher
first-party data. Inherited properties and accessors are not accepted, and
arbitrary site properties are not read or copied. The flag classifies the
visit; it says nothing about the page being public or about AI.

This deliberately removes `src`, `conf`, `seg`, `co`, `topics` and free-form
`context`: no source, confidence, segment, country or richer context is
forwarded. It reuses the runtime's documented coarse mode, without creating a
new decision schema, expiry or policy. Device identity and user audience data
received through the bridge are also discarded. Other providers' auction
fragments are untouched; the bidder filters its own outbound data separately.

Descriptor checks avoid executing getters; they do not authenticate the
signal's provenance or sandbox the external runtime. The separately loaded
runtime can still create identifiers.
