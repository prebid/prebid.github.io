# Overtone Real-time Data Submodule

## Overview

    Module Name: Overtone Rtd Provider
    Module Type: Rtd Provider
    Maintainer: tech@overtone.ai

## Description

The Overtone RTD module appends Contextual segments to the bidding object based on the Overtone taxonomy and custom metrics added by the publisher. Please contact <tech@overtone.ai> in order to be whitelisted for use of our API and to explore dozens of contextual signals.

## Usage
To install and enable the Overtone RTD module, follow these steps:

### Step 1: Prepare the base Prebid file

* **Option 1**: Use Prebid [Download](https://docs.prebid.org/download.html) page to build the Prebid package. Ensure that you check the **Overtone Real-Time Data Module** checkbox.
* **Option 2**: From the command line, run `gulp build --modules=overtoneRtdProvider,...`.

### Step 2: Configure the module

### Configuration

Use `setConfig` to instruct Prebid.js to initilize the Overtone RTD module, as specified below. 

This module is configured as part of the `realTimeData.dataProviders`

javascript
pbjs.setConfig({
  realTimeData: {
    dataProviders: [{
      name: 'overtone',
      params: {
        apiKey: 'YOUR_API_KEY',
        domains: ['example.com'],
        timeout: 500
      }
    }]
  }
});

| Name                      | Type          | Description                                                      | Default           |
| :------------------------ | :------------ | :--------------------------------------------------------------- |:----------------- |
| name                      | String        | Real time data module name                                       | Always 'overtone'   |
| params                    | Object        |                                                                  |                   |
| params.apiKey         | String        | Your unique API key provided by Overtone                                          | YOUR_API_KEY                    |
| params.domains            | Array<string> | Array of whitelisted domains for contextual analysis           |                   |
| params.timeout            | Integer       | timeout (ms)                                                     | 500ms            |

## Validation and Testing

Validation of the Overtone RTD module is essential to ensure proper configuration. Use the provided test suite in the Prebid.js repository:

File: `test/spec/modules/overtoneRtdProvider_spec.mjs`

### Test Scenarios

#### Successful Response

**Input**: Valid domain with contextual data.

**Expected Output**: Populated `categories` array with status `1`.

#### Failed Request

**Input**: Invalid domain or missing API key.

**Expected Output**: Empty `categories` array with status `3`.

#### Ignored URL

**Input**: Domain not whitelisted by Overtone.

**Expected Output**: Empty `categories` array with status `4`.

---

## Support and Contact

For questions, issues, or support, contact the Overtone technical team at <tech@overtone.ai>.
