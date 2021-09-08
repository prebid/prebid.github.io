---
layout: page_v2
sidebarType: 5
title: Becoming a PG Host Company
---

# Becoming a PG Host Company
{: .no_toc}

* TOC
{:toc}

## Overview

Prebid PG is open source, so anyone can spin up the 4 different types of servers 
needed to offer a PG service.

1. Prebid Servers handle the real-time mix of open market and PG auctions.
1. The General Planner collects PG line items from one or more PG Bidders.
1. The Delivery Stats Service provides pacing and reporting information.
1. The Dimension Value API provides the user interface the details required to build targets.

See [Adding a PG Bidder](/prebid-server/features/pg/pbs-pg-bidder.html) for the
high level view of the components.

As a PG Host Company, you will have expenses in running and maintaining a global high-performance cluster of servers and databases. You'll need at least one PG Bidder, 
which might be one you build on your own or partner with someone else. You're under
no obligation to support other PG Bidders, but your publishers may request it.

## Installing the Servers

For now, the only information about building and running the servers is in
the relevant GitHub repos:

- [Prebid Server Java](https://github.com/prebid/prebid-server-java). Note that Prebid Server Go doesn't currently support Programmatic Guaranteed.
- [General Planner](https://github.com/prebid/pg-general-planner)
- [Delivery Stats Service](https://github.com/prebid/pg-del-stats)
- [Dimension Value API](https://github.com/prebid/pg-dim-val-api)

Prebid does not offer specific guidance about fault-tolerant architectures.
It's left up to each Host Company to determine what will happen if one of the servers goes down. i.e. Will there be load-balancing, automatic failover, a warm stand-by, or no fault tolerance?

## General notes on testing the service

There are a fair number of moving parts in a Prebid PG installation. Prebid.org
does not run a test cluster. Changes are made by Prebid member companies, which do
have test clusters, but they may not test every possible configuration. e.g. different databases, geographic lookup vendors, 

We recommend that PG Host Companies commit to regular testing of software updates
against their specific configuration.

The testing of PG Bidders and their pacing algorithms may be important to you,
as publishers and advertisers care about the delivery patterns of their ad campaigns
in a variety of challenging scenarios. Prebid.org may have extended recommendations
about PG Bidder testing in the future, but in the meantime, you should consider
joining Prebid.org and chatting with the development teams involved.

## Announcing your service

When ready to open their doors for business, Prebid.org members can ask to
have their contact info added to the list of [PG Managed Services](/prebid-server/features/pg/pbs-pg-idx.html#list-of-pg-managed-services).

## Related Topics

- [PG Home Page](/prebid-server/features/pg/pbs-pg-idx.html)
- [PG White Paper](https://files.prebid.org/pg/Prebid_Programmatic_Guaranteed_White_Paper.pdf)
- [PG Glossary](/prebid-server/features/pg/pbs-pg-glossary.html)
