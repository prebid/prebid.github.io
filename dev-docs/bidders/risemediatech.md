---
layout: bidder
title: RiseMediaTech
description: Prebid.js bidder adapter for RiseMediaTech
biddercode: risemediatech
media_types:
  - banner
  - video
gdpr_supported: true
usp_supported: true
gpp_supported: true
user_sync:
  iframe: false
  image: false
schain_supported: true
pbjs: true
pbs: true
---

# Overview

RiseMediaTech is a digital advertising platform that supports banner and video ads through its Prebid.js adapter. The adapter uses OpenRTB standards for request and response formatting.

# Bid Params

| Name         | Scope              | Type             | Description                                | Example                 |
|--------------|--------------------|------------------|--------------------------------------------|-------------------------|     
| `bidFloor`   | optional           | string           | Bid Floor                                  | `'0.01'`
| `testMode`   | optional           | string           | Parameter to indicate prebid test mode                                  | `'0'`

