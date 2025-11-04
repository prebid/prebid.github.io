---
layout: page_v2
title: Neuwo RTD Module
display_name: Neuwo RTD Module 
description: Enrich bids with contextual data from the Neuwo API.
page_type: module
module_type: rtd
module_code : neuwoRtdProvider
enable_download : true
sidebarType : 1
---

# Neuwo RTD Module

## Overview

The Neuwo RTD provider fetches real-time contextual data from the Neuwo API. When installed, the module retrieves IAB content and audience categories relevant to the current page's content.

This data is then added to the bid request by populating the OpenRTB 2.x objects `ortb2.site.content.data` (for IAB Content Taxonomy) and `ortb2.user.data` (for IAB Audience Taxonomy). This enrichment allows bidders to leverage Neuwo's contextual analysis for more precise targeting and decision-making.

Here is an example scheme of the data injected into the `ortb2` object by our module:

```javascript
ortb2: {
  site: {
    content: {
      // IAB Content Taxonomy data is injected here
      data: [{
        name: "www.neuwo.ai",
        segment: [{
            id: "274",
            name: "Home & Garden",
          },
          {
            id: "42",
            name: "Books and Literature",
          },
          {
            id: "210",
            name: "Food & Drink",
          },
        ],
        ext: {
          segtax: 7,
        },
      }, ],
    },
  },
  user: {
    // IAB Audience Taxonomy data is injected here
    data: [{
      name: "www.neuwo.ai",
      segment: [{
          id: "49",
          name: "Demographic | Gender | Female |",
        },
        {
          id: "161",
          name: "Demographic | Marital Status | Married |",
        },
        {
          id: "6",
          name: "Demographic | Age Range | 30-34 |",
        },
      ],
      ext: {
        segtax: 4,
      },
    }, ],
  },
}
```

To get started, you can generate your API token at [https://neuwo.ai/generatetoken/](https://neuwo.ai/generatetoken/) or [contact us here](https://neuwo.ai/contact-us/).

## Configuration

> **Important:** You must add the domain (origin) where Prebid.js is running to the list of allowed origins in Neuwo Edge API configuration. If you have problems, [contact us here](https://neuwo.ai/contact-us/).

This module is configured as part of the `realTimeData.dataProviders` object.

```javascript
pbjs.setConfig({
  realTimeData: {
    dataProviders: [{
      name: 'NeuwoRTDModule',
      params: {
        neuwoApiUrl: '<Your Neuwo Edge API Endpoint URL>',
        neuwoApiToken: '<Your Neuwo API Token>',
        iabContentTaxonomyVersion: '3.0',
      }
    }]
  }
});
```

**Parameters**

| Name                               | Type   | Required | Default | Description                                                                                       |
| :--------------------------------- | :----- | :------- | :------ | :------------------------------------------------------------------------------------------------ |
| `name`                             | String | Yes      |         | The name of the module, which is `NeuwoRTDModule`.                                                |
| `params`                           | Object | Yes      |         | Container for module-specific parameters.                                                         |
| `params.neuwoApiUrl`               | String | Yes      |         | The endpoint URL for the Neuwo Edge API.                                                               |
| `params.neuwoApiToken`             | String | Yes      |         | Your unique API token provided by Neuwo.                                                          |
| `params.iabContentTaxonomyVersion` | String | No       | `'3.0'` | Specifies the version of the IAB Content Taxonomy to be used. Supported values: `'2.2'`, `'3.0'`. |

## Installation

### Step 1: Install Prebid.js

#### Option 1

Use Prebid [Download](https://docs.prebid.org/download.html) page to build the Prebid.js package and include Neuwo RTD Module

#### Option 2

Include `neuwoRtdProvider` in build: `gulp build --modules=rtdModule,neuwoRtdProvider,...`

### Step 2: Set configuration

Enable Neuwo Real-Time Data Module using `pbjs.setConfig` in a related Javascript context. Command example is provided in [Configuration](#configuration) section.
