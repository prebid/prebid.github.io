---
layout: page_v2
title: Neuwo Real-Time Data Module
display_name: Neuwo Real-Time Data Module 
description: Enrich bids using neuwo.ai
page_type: module
module_type: rtd
module_code : neuwoRtdProvider
enable_download : true
sidebarType : 1
---

# Neuwo Real-Time Data Module

## Overview

The Neuwo AI RTD module is an advanced AI solution for real-time data processing in the field of contextual targeting and advertising. With its cutting-edge algorithms, it allows advertisers to target their audiences with the highest level of precision based on context, while also delivering a seamless user experience.

The module provides advertisers with valuable insights and real-time contextual bidding capabilities. Whether you're a seasoned advertising professional or just starting out, Neuwo AI RTD module is the ultimate tool for contextual targeting and advertising.

The benefit of Neuwo AI RTD module is that it provides an alternative solution for advertisers to target their audiences and deliver relevant advertisements, as the widespread use of cookies for tracking and targeting is becoming increasingly limited.

The RTD module uses cutting-edge algorithms to process real-time data, allowing advertisers to target their audiences based on contextual information, such as segments, IAB Tiers and brand safety. The RTD module is designed to be flexible and scalable, making it an ideal solution for advertisers looking to stay ahead of the curve in the post-cookie era.

Generate your token at: [neuwo.ai/generatetoken/]

## Configuration

| Name       | Scope    | Description                            | Example       | Type     |
|------------|----------|----------------------------------------|---------------|----------|
| `name` | required | Handle of the module used in real-time data providers; for this, use 'NeuwoRTDModule' | 'NeuwoRTDModule' | static |
| `params.publicToken` | required | Your neuwo.ai public token | `neu23-te45-idkf-44aa` (format example) | `string` |
| `params.apiUrl` | required | Your neuwo.ai API url | `https://some-api-url.neuwo.ai/a/b/c` (format example) | `string` |

```javascript
const neuwoDataProvider = {
    name: 'NeuwoRTDModule',
    params: {
        publicToken: '<public token here>',
        apiUrl: '<api url here>'
    }
}
pbjs.setConfig({realTimeData: { dataProviders: [ neuwoDataProvider ]}})
```

## Installation

### Step 1: Install Prebid.js

- Option 1: Use Prebid [Download](/download.html) page to build the Prebid.js package
  - Include Neuwo Real-Time Data Module

- Option 2: Include `neuwoRtdProvider` in build: `gulp build --modules=rtdModule,neuwoRtdProvider,...`

### Step 2: Set configuration

Enable Neuwo Real-Time Data Module using `pbjs.setConfig` in a related Javascript context. Command example is provided in Configuration section.
