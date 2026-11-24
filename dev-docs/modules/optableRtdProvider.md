---
layout: page_v2
title: Optable RTD Provider Module
display_name: Optable RTD Module
description: Optable Real Time Data Module
page_type: module
module_type: rtd
module_code : optableRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

{: .alert.alert-warning :}
This module may load a publisher-specific JavaScript bundle. The external resource provides flexibility in ID handling without the need to modify the RTD submodule source code.

# Optable RTD Submodule
{:.no_toc}

* TOC
{:toc}

## Description

Optable RTD submodule enriches the OpenRTB request by populating `user.ext.eids` and `user.data` using an identity graph and audience segmentation service hosted by Optable on behalf of the publisher. This RTD submodule primarily relies on the Optable bundle loaded on the page, which leverages the Optable-specific Visitor ID and other PPIDs to interact with the identity graph, enriching the bid request with additional user IDs and audience data.

## Usage

### Integration

Compile the Optable RTD Module with other modules and adapters into your Prebid.js build:

```bash
gulp build --modules="rtdModule,optableRtdProvider,msftBidAdapter,..."
```

> Note that Optable RTD module is dependent on the global real-time data module, `rtdModule`.

### Preloading Optable SDK bundle

In order to use the module you first need to register with Optable and obtain a bundle URL. The bundle URL may be specified as a `bundleUrl` parameter to the script, or otherwise it can be added directly to the page source as:

```html
<script async src="<bundleURL>"></script>
```

In this case the `bundleUrl` parameter is not needed. Either way, if targeting data is cached from a previous page, auctions don't wait for the bundle to load (see [Default handler](#default-handler)).

### Configuration

This module is configured as part of the `realTimeData.dataProviders`. We recommend setting `auctionDelay` to 1000 ms and make sure `waitForIt` is set to `true` for the `Optable` RTD provider. The delay only applies to auctions that start before the bundle has loaded with nothing cached from a previous page.

```javascript
pbjs.setConfig({
  debug: true, // we recommend turning this on for testing as it adds more logging
  realTimeData: {
    auctionDelay: 1000,
    dataProviders: [
      {
        name: 'optable',
        waitForIt: true, // should be true, otherwise the auctionDelay will be ignored
        params: {
          bundleUrl: '<optional, your bundle url>',
          adserverTargeting: '<optional, true by default, set to true to also set GAM targeting keywords to ad slots>',
          instance: '<optional, name of the SDK instance on window.optable, defaults to "instance">',
        },
      },
    ],
  },
});
```

### Additional input to the module

Optable bundle may use PPIDs (publisher provided IDs) from the `user.ext.eids` as input.
In addition, other arbitrary keys can be used as input, f.e. the following:

* `optableRtdConfig.email` - a SHA256-hashed user email
* `optableRtdConfig.phone` - a SHA256-hashed [E.164 normalized phone](https://unifiedid.com/docs/getting-started/gs-normalization-encoding#phone-number-normalization) (meaning a phone number consisting of digits and leading plus sign without spaces or any additional characters, f.e. a US number would be: `+12345678999`)
* `optableRtdConfig.postal_code` - a ZIP postal code string

Each of these identifiers is completely optional and can be provided through `pbjs.mergeConfig(...)` like so:

```javascript
pbjs.mergeConfig({
  optableRtdConfig: {
    email: await sha256("test@example.com"),
    phone: await sha256("12345678999"),
    postal_code: "61054"
  }
})
```

Where `sha256` function can be defined as:

```javascript
async function sha256(input) {
  return [...new Uint8Array(
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input))
  )].map(b => b.toString(16).padStart(2, "0")).join("");
}
```

To handle PPIDs and the above input - a custom `handleRtd` function may need to be provided.

### Parameters

{: .table .table-bordered .table-striped }

| Name                     | Type     | Description                                                                                                                                                                                                                                                     | Default          | Notes    |
|--------------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------|----------|
| name                     | String   | Real time data module name                                                                                                                                                                                                                                      | Always `optable` |          |
| waitForIt                | Boolean  | Should be set `true` together with `auctionDelay: 1000`                                                                                                                                                                                                         | `false`          |          |
| params                   | Object   |                                                                                                                                                                                                                                                                 |                  |          |
| params.bundleUrl         | String   | Optable bundle URL                                                                                                                                                                                                                                              | `null`           | Optional |
| params.adserverTargeting | Boolean  | If set to `true`, targeting keywords will be passed to the ad server upon auction completion                                                                                                                                                                    | `true`           | Optional |
| params.instance          | String   | Name of the Optable SDK instance on `window.optable`. The module uses `window.optable[instance]` to tell whether the bundle has loaded and to read targeting data. Set it when the page names its SDK instance something other than `instance`.                 | `'instance'`     | Optional |
| params.handleRtd         | Function | Custom function that enriches `reqBidsConfigObj` with Optable data, called as soon as the auction starts. Signature: `[async] (reqBidsConfigObj, optableExtraData, mergeFn, instance) => {}`. If not set, the [default handler](#default-handler) is used       | `null`           | Optional |

## Default handler

When `handleRtd` is not provided, the module enriches each auction as soon as it starts:

1. If the Optable bundle has loaded and exposes `window.optable.rtd.handleRtd`, the module calls it. Bundles can
   override that function to change how data is merged. The bundle also counts as loaded when the SDK instance named
   by `params.instance` exists on `window.optable`. If it exposes no `rtd.handleRtd`, the module merges the instance's
   targeting data instead: the data the SDK already holds, or else the data from its next `optable-targeting:change`
   event.
2. If the bundle has not loaded yet, the module merges the targeting data the bundle cached on a previous page
   (`localStorage` key `OPTABLE_RESOLVED`, read through Prebid's storage manager, so `deviceAccess` and activity
   controls apply), without waiting. The whole cached ORTB2 object is merged. Cache-only fields whose names start
   with `_` (such as `_ref`) are removed from EIDs first.
3. If nothing is cached, or the cache holds no EIDs, the module waits for the bundle to load (up to `auctionDelay`
   when `waitForIt` is `true`), then continues as in step 1.

On both paths, EIDs are placed in `user.ext.eids`, where Prebid's User ID module puts them, rather than in
`user.eids`.

Most publishers should not need a custom `handleRtd`.

## Publisher Customized RTD Handler Function

When there is more pre-processing or post-processing needed prior/post calling Optable bundle - a custom `handleRtd`
function can be supplied to do that.
This function will also be responsible for the `reqBidsConfigObj` enrichment.
Its 4th argument, `instance`, is `params.instance`, or `null` when that is not set.
It will also receive the `optableExtraData` object, which can contain the extra data required for the enrichment and
shouldn't be shared with other RTD providers/bidders.
`mergeFn` parameter taken by `handleRtd` is a standard Prebid.js utility function that take an object to be enriched and
an object to enrich with: the second object's fields will be merged into the first one (also see the code of an example
mentioned below):

```javascript
mergeFn(
  reqBidsConfigObj.ortb2Fragments.global, // or other nested object as needed
  rtdData,
);
```

The module calls it as soon as the auction starts, so the Optable bundle may not have loaded yet. A handler that needs
the bundle should wait for it first:

> Before Prebid.js 11.52.0, the module called a custom `handleRtd` only after the Optable bundle had loaded. Handlers
> written for older versions that use the bundle right away need the wait below.

```javascript
await new Promise((resolve) => {
  window.optable = window.optable || { cmd: [] };
  window.optable.cmd.push(resolve);
});
```

The module waits for the handler to finish: if it returns a promise (for example an `async` function), the auction
waits for that promise to settle, within the RTD `auctionDelay`. If the handler throws or its promise rejects, the
module logs the error and the auction continues without Optable data.

A `handleRtd` function implementation has access to its surrounding context including capturing a `pbjs` object, calling `pbjs.getConfig()` and f.e. reading off the `consentManagement` config to make the appropriate decision based on it.

## Direct targeting mode

Available from Prebid.js 11.52.0. With `params.enableTargeting: true`, the module fetches targeting itself instead of
handing off to the Optable bundle:

1. If the Optable SDK instance (`window.optable[instance]`) is on the page, the module uses its targeting data, waiting
   for its `optable-targeting:change` event when needed.
2. If an Optable bundle is still loading (`window.optable` exists), the module uses the targeting cached under
   `params.optableCacheTargeting` (`OPTABLE_RESOLVED` by default) when it holds EIDs or a split test assignment, and
   otherwise waits for the SDK. The [default handler](#default-handler) uses the cache only when it holds EIDs.
3. Otherwise, if `host`, `node` and `site` are set, it calls the DCN targeting API (`https://<host>/v2/targeting`)
   directly. Use this on pages without the Optable bundle. Responses are cached in `localStorage` under the same key:
   a cached response, even an empty one, is used right away and refreshed in the background.

Waits are bounded by `auctionDelay`; with no `auctionDelay` the module does not wait. `bundleUrl` and
`optableRtdConfig` are ignored in this mode.

```javascript
pbjs.setConfig({
  realTimeData: {
    auctionDelay: 200,
    dataProviders: [
      {
        name: 'optable',
        waitForIt: true,
        params: {
          enableTargeting: true,
          host: 'dcn.customer.com',
          node: 'prod-us',
          site: 'my-site',
        },
      },
    ],
  },
});
```

{: .table .table-bordered .table-striped }

| Name | Type | Description | Default |
| :--- | :--- | :--- | :--- |
| params.enableTargeting | Boolean | Turns on direct targeting mode | `false` |
| params.host | String | DCN hostname. Required for direct API calls | None |
| params.node | String | DCN node. Required for direct API calls | None |
| params.site | String | Site slug configured on the DCN. Required for direct API calls | None |
| params.ids | Array | Optable identifiers, f.e. `"e:<sha256>"`, `"c:<ppid>"`. Prebid User ID EIDs are not used | `["__passport__"]` |
| params.hids | Array | Hint identifiers | `[]` |
| params.cookies | Boolean | When `false`, the request is sent without cookies and the visitor passport goes in the query string | `true` |
| params.timeout | String/Number | Targeting API timeout, f.e. `"500ms"` or a number of ms | `auctionDelay` minus 100 ms |
| params.skipMergeIfUid2Exists | Boolean | Skip Optable's UID2 EIDs when the request already has one | `false` |
| params.optableCacheTargeting | String | `localStorage` key of the targeting cache | `'OPTABLE_RESOLVED'` |
| params.handleRtd | Function | Custom handler: `[async] (reqBidsConfigObj, targetingData, mergeFn, options) => {}` | `null` |

EIDs are merged into `user.ext.eids`, and each ad unit gets `ortb2Imp.ext.optable.variant` (plus
`splitTestAssignment` when the DCN returns one). `adserverTargeting` still requires the Optable SDK on the page.

## GDPR and TCF

The module has no GVL ID. When the `tcfControl` module enforces GDPR, add `optable` to the `softVendorExceptions` of
the `storage` rule, or Prebid blocks its storage, cookies and EID enrichment. This applies to every mode, including the
default handler's cache read. TCF Purpose 1 consent is still required.

## Example

If you want to see an example of how the optable RTD module works, run the following command:

```bash
gulp serve --modules=optableRtdProvider,consentManagementGpp,consentManagementTcf,msftBidAdapter
```

and then open the following URL in your browser:

[`http://localhost:9999/integrationExamples/gpt/optableRtdProvider_example.html`](http://localhost:9999/integrationExamples/gpt/optableRtdProvider_example.html)

Open the browser console to see the logs.

## Maintainer contacts

Any suggestions or questions can be directed to [prebid@optable.co](mailto:prebid@optable.co).

Alternatively please open a new [issue](https://github.com/prebid/Prebid.js/issues/new) or [pull request](https://github.com/prebid/Prebid.js/pulls) in the Prebid.js repository.
