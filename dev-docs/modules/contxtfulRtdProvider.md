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
gulp build --modules=contxtfulRtdProvider,<other modules...>
```

### Configuration

Configure the `contxtfulRtdProvider` by passing the required settings through the `setConfig` function in `prebid.js`.

```js
import pbjs from 'prebid.js';

pbjs.setConfig({
  "realTimeData": {
    "auctionDelay": 1000,
    "dataProviders": [
      {
        "name": "contxtful",
        "waitForIt": true,
        "params": {
          "version": "<API Version>",
          "customer": "<Contxtful Customer ID>"
        }
      }
    ]
  }
});
```

#### Parameters

{: .table .table-bordered .table-striped }
| Name       | Type     | Scope    | Description                               |
|------------|----------|----------|-------------------------------------------|
| `version`  | `string` | Required | Specifies the API version of Contxtful.   |
| `customer` | `string` | Required | Your unique customer identifier.          |

## Usage

The `contxtfulRtdProvider` module loads an external JavaScript file and authenticates with Contxtful APIs. The `getTargetingData` function then adds a `ReceptivityState` to each ad slot, which can have one of two values: `Receptive` or `NonReceptive`.

```json
{
  "adUnitCode1": { "ReceptivityState": "Receptive" },
  "adUnitCode2": { "ReceptivityState": "NonReceptive" }
}
```

This module also integrates seamlessly with Google Ad Manager, ensuring that the `ReceptivityState` is available as early as possible in the ad serving process.

### Example

To view an integration example:

1. In your CLI run:

    ```bash
    gulp serve --modules=appnexusBidAdapter,contxtfulRtdProvider
    ```

2. In your browser, navigate to:

    ```text
    http://localhost:9999/integrationExamples/gpt/contxtfulRtdProvider_example.html
    ```

## Support

To utilize this module, you need to register for an account with [Contxtful](https://contxtful.com). For inquiries, please contact [prebid@contxtful.com](mailto:prebid@contxtful.com).
