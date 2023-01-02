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
Neuwo Real-Time Data Module allows you to enrich bids using neuwo.ai for content taxonomy.

## Configuration

| Name       | Scope    | Description                            | Example       | Type     |
|------------|----------|----------------------------------------|---------------|----------|
| `name` | required | Handle of the module used in real-time data providers; for this, use 'NeuwoRTDModule' | 'NeuwoRTDModule' | static |
| `params.publicToken` | required | Your neuwo.ai public token | `neu23-te45-idkf-44aa` | `string` |

```javascript

const neuwoDataProvider = {
    name: 'NeuwoRTDModule',
    params: {
        publicToken: '<public token here>'
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