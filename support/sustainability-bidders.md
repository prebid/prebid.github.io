---
layout: page_v2
title: Bidder Sustainability Best Practices
description: Bidder Sustainability Best Practices
sidebarType: 7
---

# Bidder Sustainability Best Practices
{:.no_toc}

- TOC
{:toc}

## Overview

This page collects recommendations for Prebid bidders (SSPs, DSPs, etc.) interested in exploring ways to save carbon emissions while preserving revenue. See the [Sustainability Portal](/support/sustainability-portal.html) for more background.

## Tip 1: Use HTTP2/3

Update your endpoints to support HTTP 2 and HTTP 3. This helps because optimizing connection reuse is beneficial. The later protocols limit client side and transport resource usage and are expected to generally improve performance.

## Tip 2: Reduce payloads

Determine if extraneous JSON or other payload is being delivered to your endpoint.

## Tip 3: Enable compression

Once the required payload is determined, make sure compression is enabled on your endpoint to make the response smaller over the wire.

## Tip 4: Reduce your adapter size

Remove or consolidate duplicate code and consider using [the ORTB library](https://github.com/prebid/Prebid.js/blob/master/libraries/ortbConverter/README.md) if your bidder endpoint is oRTB compatible. The [Rix Bidder](https://github.com/prebid/Prebid.js/blob/master/modules/rixengineBidAdapter.js) is an example of using library and shared functions to reduce code size.

## Tip 5: Combine requests

Whenever possible send as many bid requests in the same network request as possible. Prebid.js supports this by default with multiple impression and multiple mediatype support.

For example, if your endpoint currently requires separate requests for each adunit or for each mediatype, you should plan to upgrade to be able to handle richer scenarios.

## Tip 6: Reduce response payloads

Do not send unnecessarily verbose responses. For a 'no bid', many analytics adapters would like to receive a "no bid reason", but other than that, the response should be small. If you have a need for more verbose responses then consider compression.

## Further Reading

- [Prebid Statement on Sustainability](/overview/statement-on-sustainability.html)
- [Prebid Sustainability Portal](/support/sustainability-portal.html)
