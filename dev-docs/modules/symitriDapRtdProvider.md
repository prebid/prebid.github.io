---
layout: page_v2
title: Symitri DAP Real Time Data Provider Module
display_name: Symitri DAP Real Time Data Provider Module
description: Symitri DAP Real Time Data Provider Module
page_type: module
module_type: rtd
module_code : symitriDapRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# Symitri DAP Real Time Data Provider Module

{:.no_toc}

* TOC
{:toc}

The Symitri Data Activation Platform (DAP) is a privacy-first system that protects end-user privacy by only allowing them to be targeted as part of a larger cohort. Symitri DAP Real time data Provider automatically invokes the DAP APIs and submit audience segments and the Secure Ad ID(SAID) to the bid-stream.  SAID is a JWT/JWE which carries with it the cohorts and only a side-car or trusted server in the demand-side platform is allowed to see its contents.

## Publisher Usage

1. Build the symitriDapRTD module into the Prebid.js package with:

    ```bash
    gulp build --modules=symitriDapRtdProvider,...
    ```

2. Use `setConfig` to instruct Prebid.js to initilaize the symitriDapRtdProvider module, as specified below.

### Configuration

```javascript
pbjs.setConfig({
  realTimeData: {
    auctionDelay: 2000,
    dataProviders: [
      {
        name: "symitriDap",
        waitForIt: true,
        params: {
          apiHostname: '<see your Symitri account rep>',
          apiVersion: 'x1'|'x2',
          domain: 'your-domain.com',
          identityType: 'simpleid'|'compositeid'|'hashedid',
          identityValue: '<user identifier>',
          segtax: 708,
          pixelUrl: '<see your Symitri account rep>',
        }
      }
    ]
  }
});
```

Please reach out to your Symitri account representative(<Prebid@symitri.com>) to get provisioned on the DAP platform.

**Config Syntax details:**

{: .table .table-bordered .table-striped }
| Name  |Type | Description   | Notes  |
| :------------ | :------------ | :------------ |:------------ |
| name | String | Symitri Dap Rtd module name | 'symitriDap' always|
| waitForIt | Boolean | Required to ensure that the auction is delayed until prefetch is complete | Optional. Defaults to false |
| apiHostname | String | Hostname provided by Symitri | Please reach out to your Symitri account representative(<Prebid@symitri.com>) for this value|
| apiVersion | String | This holds the API version | Please reach out to your Symitri account representative(<Prebid@symitri.com>) for this value |
| domain | String | The domain name of your webpage | |
| identityType | String | 'simpleid' or 'compositeid' or 'hashedid' | See the section below labelled "identityType" for more details. |
| identityValue | String | This is a required field to pass HEM and/or EIDs | See the "identity" section below for more details. |
| segtax | Integer | The taxonomy for Symitri | The value should be 708 |
| pixelUrl | String | Pixel URL provided by Symitri which will be triggered when bid matching with Symitri dealid wins and creative gets rendered | |

### identityType
Use 'simpleid' to pass email or other plain text ids and SymitriRTD Module will hash it.

Use 'hashedid' to pass in single already hashed id. 

Use 'compositeid' to pass in multiple identifiers as key-value pairs as shown below, can also be used for single already hashed identifiers:

```bash
{
  "identityType": "compositeid",
  "identityValue": "HEM:<hem>,ID5:<id5>,RampId:<RampId>",
  ...
} 
  "identityType": "hashedid",
  "identityValue": "<hem>",
```

### Identity

In the event there is no identity, the ""identityType" and "identityValue" can be set to:

```javascript
pbjs.setConfig({
  ...
    identityType: 'compositeid',
    identityValue: 'HEM:',
  ...
});
```

### Testing

To view an example of available segments returned by dap:

```bash
gulp serve --modules=rtdModule,symitriDapRtdProvider,appnexusBidAdapter,sovrnBidAdapter
```

and then point your browser at:
"<http://localhost:9999/integrationExamples/gpt/symitridap_segments_example.html>"
