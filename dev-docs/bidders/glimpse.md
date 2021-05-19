---
layout: bidder
title: Glimpse Protocol
description: Glimpse Protocol Bidder Adapter
biddercode: glimpse
pbjs: true
gdpr_supported: true
media_types: banner
---

## Overview

```
Module Name: Glimpse Protocol Adaptor
Module Type: Bidder Adapter
Maintainer: tim@glimpseprotocol.io
```

## Description

This module connects publishers to Glimpse Protocol's demand sources via Prebid.js. Our
innovative marketplace protects consumer privacy while allowing precise targeting. It is
compliant with GDPR, DPA and CCPA.

This module was built and tested against prebid 3.21.0 and so compatibility against
version 2 and earlier is unknown.

## Media Types

| Type     | Support                                                            |
| -------- | ------------------------------------------------------------------ |
| `Banner` | Fully supported for 320x50, 300x250, 300x600, 728x90, and 970x250. |

## Bid Parameters

The only parameter is `placementId` and it is required.

### Banner

| Name          | Scope    | Description                                                                                                      | Example                | Type   |
| ------------- | -------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------- | ------ |
| `placementId` | Required | An identifier associated unique to a publisher and ad unit. Values can be obtained through our publisher portal. | 'glimpse-demo-300x250' | String |

## Setup Guide

Follow these steps to configure and add the glimpse module to your Prebid.js integration.

### 0. Preconditions

- A built prebid module with the glimpse adaptor included
- You've included the built prebid adaptor and GPT script in your websites html code
- You've setup GAM mappings

### 1. Create an account and setup your domain via the Publisher Portal

Coming soon.

### 2. Enable Glimpse as a bidder on your ad units

```javascript
const adUnits = {
  code: 'your-ad-unit-div-id',
  mediaTypes: {
    banner: {
      sizes: [[300, 250]],
    },
  },
  bids: [
    {
      bidder: 'glimpse',
      params: {
        placementId: 'placementId-from-publisher-portal',
      },
    },
    ...
  ],
  ...
}
```

## FAQs

### Can I test my setup without a Publisher Portal Account?

Yep. Use a demo placementId:

- glimpse-demo-320x50
- glimpse-demo-300x250
- glimpse-demo-300x600
- glimpse-demo-728x90
- glimpse-demo-970x250

### How do I get more help?

Reach out to us at [hello@glimpseprotocol.io](mailto:hello@glimpseprotocol.io)
