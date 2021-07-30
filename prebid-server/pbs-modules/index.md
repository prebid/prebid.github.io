---
layout: page_v2
title: Prebid Server Modules
description: Prebid Server Module Documentation
sidebarType: 5
---

# Prebid Server Module Overview
{:.no_toc}

The core of Prebid Server contains the foundational code needed for header bidding. Any functionality that could be considered an add-on or that covers a special case is covered by modules. 

If you're looking for bidder adapter parameters, see [Bidders' Params](/dev-docs/pbs-bidders.html).

* TOC
{:toc}

## Installing a Module

Currently, modules are only offered in PBS-Java. The Prebid Server host company decides which modules they want to use:

1. Build Prebid Server using the ['bundle'](FIXME) approach.
1. Configure each module.

## General Modules

{: .table .table-bordered .table-striped }
| Module              | Description  | PBS-Go | PBS-Java |
|---------------------+--------------+--------+----------|
| [**ORTB2 Blocking**](/prebid-server/pbs-modules/ortb2-blocking.html) | Support bidders that aren't full-service SSPs. | | <img src="/assets/images/icons/icon-check-green.png" width="30"> |

## Further Reading

+ [Developing a Prebid Server Module](/prebid-server/developers/add-a-module.html)
