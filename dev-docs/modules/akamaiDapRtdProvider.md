---
layout: page_v2
title: Akamai DAP Real Time Data Provider Module
display_name: Akamai DAP Real Time Data Provider Module
description: Akamai DAP Real Time Data Provider Module
page_type: module
module_type: rtd
module_code : akamaiDapRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# Akamai DAP Real Time Data Provider Module

{:.no_toc}

* TOC
{:toc}

The Akamai Data Activation Platform (DAP) is a privacy-first system that protects end-user privacy by only allowing them to be targeted as part of a larger cohort. Akamai DAP Real time data Provider automatically invokes the DAP APIs and submit audience segments and the Secure Ad ID(SAID) to the bid-stream.  SAID is a JWT/JWE which carries with it the cohorts and only a side-car or trusted server in the demand-side platform is allowed to see its contents.

## Publisher Usage

1) Build the akamaiDapRTD module into the Prebid.js package with:

```
gulp build --modules=akamaiDapRtdProvider,...
```

2) Use `setConfig` to instruct Prebid.js to initilaize the akamaiDapRtdProvider module, as specified below.

### Configuration

```
pbjs.setConfig({
  realTimeData: {
    auctionDelay: 2000,
    dataProviders: [
      {
        name: "dap",
        waitForIt: true,
        params: {
          apiHostname: '<see your Akamai account rep>',
          apiVersion: "x1",
          domain: 'your-domain.com',
          identityType: 'email' | 'mobile' | ... | 'dap-signature:1.3.0',
          segtax: 504,
          dapEntropyUrl: 'https://dap-dist.akamaized.net/dapentropy.js',
          dapEntropyTimeout: 1500
        }
      }
    ]
  }
});
```

Please reach out to your Akamai account representative(<Prebid@akamai.com>) to get provisioned on the DAP platform.

**Config Syntax details:**

{: .table .table-bordered .table-striped }
| Name  |Type | Description   | Notes  |
| :------------ | :------------ | :------------ |:------------ |
| name | String | Akamai Dap Rtd module name | 'dap' always|
| waitForIt | Boolean | Required to ensure that the auction is delayed until prefetch is complete | Optional. Defaults to false |
| apiHostname | String | Hostname provided by Akamai | Please reach out to your Akamai account representative(<Prebid@akamai.com>) for this value|
| apiVersion | String | This holds the API version | It should be "x1" always |
| domain | String | The domain name of your webpage | |
| identityType | String | Something like this 'email', 'mobile',  ... 'dap-signature:1.3.0' | |
| segtax | Integer | The taxonomy for Akamai | The value should be 504 |
| dapEntropyUrl | String | URL to dap entropy script | Optional if the script is directly included on the webpage. Contact your Akamai account rep for more details |
| dapEntropyTimeout | Integer | Maximum time allotted for the entropy calculation to happen | |

### Testing

To view an example of available segments returned by dap:

```
‘gulp serve --modules=rtdModule,akamaiDapRtdProvider,appnexusBidAdapter,sovrnBidAdapter’
```

and then point your browser at:
"<http://localhost:9999/integrationExamples/gpt/akamaidap_segments_example.html>"
