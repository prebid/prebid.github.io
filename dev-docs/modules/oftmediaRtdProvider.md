---
layout: page_v2
title: 152media RTD Module
display_name: 152media

description: Real-time data enrichment from 152media
page_type: module
module_type: rtd
module_code : oftmediaRtdProvider
enable_download : true
sidebarType : 1
---

# 152media (Oftmedia) Real-time Data Submodule

{:.no_toc}

* TOC
{:toc}

## Overview

The 152media Real-time Data (RTD) module enhances programmatic advertising performance by providing contextual and audience-based data at runtime. Integrated into Prebid.js, it enables publishers to:

- Improve bid relevance with enriched targeting data
- Filter unqualified or low-value bid requests
- Leverage AI-based deal optimization

This module is maintained by [152media](mailto:hello@152media.com) and requires the global `rtdModule` to function.

## Usage

### Build

To include the 152media RTD module in your Prebid.js build:

```bash
gulp build --modules="rtdModule,oftmediaRtdProvider"
````

> **Note:** `rtdModule` is required as a dependency.

## Configuration

Use `pbjs.setConfig` to initialize the 152media RTD module with the following syntax:

```javascript
pbjs.setConfig({
  realTimeData: {
    auctionDelay: 500, // Recommended setting
    dataProviders: [
      {
        name: "oftmedia",
        waitForIt: true, // Ensures data is available before auction starts
        params: {
          publisherId: "0653b3fc-a645-4bcc-bfee-b8982974dd53", // Required: Get this ID from 152media
          keywords: ["red", "blue", "white"], // Optional: Contextual keywords
          bidderCode: "appnexus", // Required: Targeted bidder
          enrichRequest: true // Optional: Adds additional targeting fields
        }
      }
    ]
  }
});
```

## Parameters

| Parameter              | Type             | Description                                                  | Default      |
| ---------------------- | ---------------- | ------------------------------------------------------------ | ------------ |
| `name`                 | String           | Always `"oftmedia"`                                          |              |
| `waitForIt`            | Boolean          | Ensures auction is delayed until data is ready               | `false`      |
| `params.publisherId`   | String           | Your unique Publisher ID provided by 152media                | **Required** |
| `params.keywords`      | Array of Strings | Contextual keywords for enhancing relevance                  | `[]`         |
| `params.bidderCode`    | String           | Bidder code that should receive the enriched data            | **Required** |
| `params.enrichRequest` | Boolean          | Enriches the request object with extra targeting information | `false`      |
| `params.timeout`       | Integer (ms)     | Timeout for data retrieval (optional)                        | `1000`       |

## Output

When active, the module appends targeting and/or deal data into the ad unit targeting objects and/or modifies the request payload, depending on the configuration and support by the selected bidder.

## Support

For questions, help, or to obtain a publisher ID, please contact [hello@152media.com](mailto:hello@152media.com).

