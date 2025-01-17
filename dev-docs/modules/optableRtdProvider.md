---
layout: page_v2
title: Optable RTD Provider Module
display_name: Optable RTD Module
description: Optable Real Time Data Module
page_type: module
module_type: rtd
module_code : optable
enable_download : true
vendor_specific: true
sidebarType : 1
---

{: .alert.alert-warning :}
This module may load a publisher-specific JavaScript bundle.  The external resource provides flexibility in ID handling without the need to modify the RTD submodule source code.

# Optable RTD Submodule
{:.no_toc}

* TOC
{:toc}

## Description

Optable module enriches an OpenRTB request by setting `user.ext.eids` and `user.ext.data` using an identity graph and audience segments service hosted by Optable on behalf of the publisher. As input the module may consume user's sha256-hashed email, phone, post_code or (non-hashed) publisher provided identifiers (PPIDs).

## Usage

### Integration

Compile the Optable RTD Module with other modules and adapters into your Prebid.js build:

```bash
gulp build --modules="rtdModule,optableRtdProvider,appnexusBidAdapter,..."  
```

> Note that Optable RTD module is dependent on the global real-time data module, `rtdModule`.

### Preloading Optable SDK bundle

In order to use the module you first need to register with Optable and obtain a bundle URL.  The bundle URL may be specified as a `bundleUrl` parameter to the script, or otherwise it can be added directly to the page source as:

```
<script async src="<bundleURL>" />
```

In this case bundleUrl parameter is not needed and the script will await bundle loading before delegating to it.

### Configuration

This module is configured as part of the `realTimeData.dataProviders`.  We recommend setting `auctionDelay` to 1000 ms and make sure `waitForIt` is set to `true` for the `Optable` RTD provider.

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
                    bundleUrl: '<optional your bundle url>',
                    gamTargeting: '<optional, false by default, set to true to also set GAM targeting keywords to ad slots>',
                    ppidMapping: { 
                        // optional mapping between eids sources and optable custom identifier names
                        "example.com": "c0",
                        "source-id.com": "c1", //...
                    }
                },
            },
        ],
    },
});
```

### Additional input to the module

Besides PPID (publisher provided IDs) in the `user.ext.eids` the module will pick up the following keys: 
- `user.ext.optable.email` - a SHA256-hashed user email
- `user.ext.optable.phone` - a SHA256-hashed [E.164 normalized phone]() (meaning a phone number consisting of digits only without spaces or any additional characters, f.e. a US number would be: `12345678999`)
- `user.ext.optable.postal_code` - a ZIP postal code string

Each of these identifiers is completely optional and can be provided through `pbjs.mergeConfig` like so: 

```
pbjs.mergeConfig({
    ortb2: {
        user: {
            ext: {
                optable: {
                    email: await sha256("test@example.com"),
                    phone: await sha256("12345678999"),
                    postal_code: "61054"
                }
            }
        }
    }
})
```

Where `sha256` function can be defined as: 

```
async function sha256(input) {
  return [...new Uint8Array(
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input))
  )].map(b => b.toString(16).padStart(2, "0")).join("");
}
```

### Parameters 

{: .table .table-bordered .table-striped }
| Name                  | Type    | Description                                                                                      | Default            |
|:----------------------|:--------|:-------------------------------------------------------------------------------------------------|:-------------------|
| name                  | String  | Real time data module name                                                                       | Always 'optable' |
| waitForIt             | Boolean | Should be set `true` together with auctionDelay: 1000                   | `false` |
| params                | Object  |                                                                                                  |                    |
| params.bundleUrl    | String  | Optable bundle URL                                                        | '' |
| params.gamTargeting | boolean  | If set to `true` targeting keywords will be passed to GAM ad units | false |
| params.ppidMapping | map  | Optional mapping between PPID sources and custom identifier names  | null |

## Example 

If you want to see an example of how the optable RTD module works, run the following command:

`gulp serve --modules=rtdModule,optableRtdProvider,appnexusBidAdapter`

and then open the following URL in your browser:

`http://localhost:9999/integrationExamples/gpt/optableRtdProvider_example.html`

Open the browser console to see the logs.
