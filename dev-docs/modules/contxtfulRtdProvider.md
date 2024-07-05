---
layout: page_v2
title: Contxtful RTD Provider  
display_name: Contxtful RTD Provider  
description: Activates Receptivity to evaluate ad success in real-time by focusing on attention and context.
page_type: module
module_type: rtd
module_code : contxtfulRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# Contxtful Real Time Data Module

## Overview

The Contxtful RTD module enhances ad units by adding a Receptivity score to the meta-data. This score quantifies user attention in real time and can be used to guide bidding decisions.

{% include dev-docs/loads-external-javascript.md %}

## Integration

To incorporate this module into your `prebid.js`, compile the module using the following command:

```sh
gulp build --modules=rtdModule,contxtfulRtdProvider,<other modules...>
```

## Configuration

Configure the `contxtfulRtdProvider` by passing the required settings through the `setConfig` function in `prebid.js`.

```javascript
import pbjs from 'prebid.js';

pbjs.setConfig({
  "realTimeData": {
    "auctionDelay": 1000,
    "dataProviders": [
      {
        "name": "contxtful",
        "waitForIt": true,
        "params": {
          "version": "Contact contact@contxtful.com for the API version",
          "customer": "Contact contact@contxtful.com for the customer ID",
          "hostname": "api.receptivity.io", // Optional, default: "api.receptivity.io"
          "bidders": ["bidderCode1", "bidderCode", "..."], // list of bidders
          "adServerTargeting": true, // Optional, default: true
        }
      }
    ]
  }
});
```

## Parameters

{: .table .table-bordered .table-striped }
| Name                | Type     | Scope    | Description                                |
|---------------------|----------|----------|--------------------------------------------|
| `version`           | `String` | Required | Specifies the version of the Contxtful Receptivity API. |
| `customer`          | `String` | Required | Your unique customer identifier.           |
| `hostname`          | `String` | Optional | Target URL for CONTXTFUL external JavaScript file. Default is "api.receptivity.io". Changing default behaviour is not recommended. Please reach out to [contact@contxtful.com](mailto:contact@contxtful.com) if you experience issues. |
| `adServerTargeting` | `Boolean`| Optional | Enables the `getTargetingData` to inject targeting value in ad units. Setting to true enables the feature, false disables the feature. Default is true      |
| `bidders`           | `Array`  | Optional | Setting this array enables Receptivity in the `ortb2` object through `getBidRequestData` for all the listed `bidders`. Default is `[]` (an empty array). RECOMMENDED : Add all the bidders active like this `["bidderCode1", "bidderCode", "..."]` |

## Usage: Injection in Ad Servers

The `contxtfulRtdProvider` module loads an external JavaScript file and authenticates with Contxtful APIs. The `getTargetingData` function then adds a `ReceptivityState` to each ad slot, which can have one of two values: `Receptive` or `NonReceptive`.

```json
{
  "adUnitCode1": { "ReceptivityState": "Receptive" },
  "adUnitCode2": { "ReceptivityState": "Receptive" }
}
```

This module also integrates seamlessly with Google Ad Manager, ensuring that the `ReceptivityState` is available as early as possible in the ad serving process.

## Usage: Injection in ortb2 for bidders

Setting the `bidders` field in the configuration parameters enables Receptivity in the `ortb2` object through `getBidRequestData` for all the listed bidders.
On a Bid Request Event, all bidders in the configuration will inherit the Receptivity data through `ortb2`
Default is `[]` (an empty array)

RECOMMENDED : Add all the bidders active like this `["bidderCode1", "bidderCode", "..."]`

## Example

To view an integration example:

1. In your CLI run:

    ```bash
    gulp serve --modules=rtdModule,appnexusBidAdapter,rubiconBidAdapter,sharethroughBidAdapter,contxtfulRtdProvider
    ```

2. In your browser, navigate to:

    ```text
    http://localhost:9999/integrationExamples/gpt/contxtfulRtdProvider_example.html
    ```

## Support

To utilize this module, you need to register for an account with [Contxtful](https://contxtful.com). For inquiries, please contact [contact@contxtful.com](mailto:contact@contxtful.com).

## Links

- [Basic Prebid.js Example](https://docs.prebid.org/dev-docs/examples/basic-example.html)
- [How Bid Adapters Should Read First Party Data](https://docs.prebid.org/features/firstPartyData.html#how-bid-adapters-should-read-first-party-data)
- [getBidRequestData](https://docs.prebid.org/dev-docs/add-rtd-submodule.html#getbidrequestdata)
- [getTargetingData](https://docs.prebid.org/dev-docs/add-rtd-submodule.html#gettargetingdata)
- [Contxtful Documentation](https://documentation.contxtful.com/)
