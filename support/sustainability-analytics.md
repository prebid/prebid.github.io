---
layout: page_v2
title: Analytics Sustainability Best Practices
description: Analytics Sustainability Best Practices
sidebarType: 7
---

# Analytics Sustainability Best Practices
{:.no_toc}

- TOC
{:toc}

## Overview

This page collects recommendations for analytics providers interested in exploring ways to save carbon emissions while preserving revenue. See the [Susta
inability Portal](/support/sustainability-portal.html) for more background.

## Tip 1: Connection reuse

Much like bidders, analytics adapters should reuse connections as much as possible. Enabling HTTP2/3 and bundling of events can be impactful.

More importantly, analytics events should be buffered and sent as a group where possible. For example, don't send separate payloads for the auction event, the bid response event, the bid won event, etc. Combine them into one payload.

## Tip 2: Reduce sent payloads

Send only the data that you need and can process. Avoid sending long data fields that are potentially duplicate or not needed.

Specific examples:

- Don't send the TCF or GPP strings if you're not parsing them. Consider sending just the privacy flags needed.
- Don't send User Agent strings in the payload when they can be obtained from the HTTP header.

## Tip: 3 Reduce response payloads

Do not send unnecessarily verbose responses. An empty 204 response is all that is usually necessary. If you have a need for more verbose responses then consider compression.

## Further Reading

- [Prebid Statement on Sustainability](/overview/statement-on-sustainability.html)
- [Prebid Sustainability Portal](/support/sustainability-portal.html)
