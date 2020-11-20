---
layout: page_v2
sidebarType: 5
title: Prebid Server | Features | Programmatic Guaranteed
---

# Prebid Server | Features | Programmatic Guaranteed (PBS-Java only)
{: .no_toc}

* TOC
{:toc}

## Programmatic Guaranteed

Programmatic Guaranteed (PG) has existed for several years as an ad server-based function.
While anchoring PG in the Ad Server was helpful from a deployment expediency perspective,
the lack of transparency and configurability in the ad server slowed down product momentum
and made it harder for buyers and sellers to flexibly adjust their strategy and
configurations for PG deals. The introduction of open-source, standards-based
Programmatic Guaranteed, anchored in Prebid Sever, helps both buyers and sellers in
several key ways:

- It allows publishers to utilize preferred partners and data in the Programmatic infrastructure.
- It streamlines the traditional RFP and I/O process between buyers and sellers
- It separates the pacing, capping and forecasting functions from the ad server so publishers can more easily control and modify deals
- Enables a seamless, software-based negotiation process between buyers and sellers
- Ensures easier interoperability with a wider universe of buy-side platforms

At a high level, the system allows any **host company** running Prebid Server (only PBS-Java for now) to integrate open source components into their existing UIs and data delivery systems.

In addition, the host company can support other **PG bidders** connecting into their system to make their environment richer for publishers.

![PG High Level Framework](/assets/images/prebid-server/pg/pg-arch-1.png){: .pb-md-img :}

We want to encourage an ecosystem where programmatic vendors can compete on their strengths: some companies may be excellent at hosting the technical infrastructure, while others may excel at usability, reporting, or delivery algorithms.


## PG For Publishers

Publishers interested in trying Programmatic Guaranteed through Prebid should
contact one of the [companies hosting a PG cluster](/prebid-server/features/pg/pbs-pg-idx.html#list-of-pg-managed-services).

They'll explain how it all works and walk you through the setup process.

## PG for Bidders

If you're a demand source ready to implement a Guaranteed delivery algorithm, check out these references:

- [Prebid PG White Paper](https://files.prebid.org/pg/Prebid_Programmatic_Guaranteed_White_Paper.pdf)
- [Becoming a PG Bidder](/prebid-server/features/pg/pbs-pg-bidder.html)

## Hosting your own PG Cluster

If you're ready to host a global high-performance cluster, check out these references:

- [Prebid PG White Paper](https://files.prebid.org/pg/Prebid_Programmatic_Guaranteed_White_Paper.pdf)
- [Becoming a PG Host Company](/prebid-server/features/pg/pbs-pg-host.html)


## List of PG Managed Services

If you're a publisher looking to try Programmatic Guaranteed or a PG bidder that wants to integrate into an existing cluster, here's a list:

- Magnite - contact your account representative or globalsupport@magnite.com

## Resources

- Intro Presentation: [video](https://files.prebid.org/pg/PG_in_Prebid.mp4), [pdf](https://files.prebid.org/pg/PG_in_Prebid_Overview.pdf)
- [Prebid PG White Paper](https://files.prebid.org/pg/Prebid_Programmatic_Guaranteed_White_Paper.pdf)
- [PG Glossary](/prebid-server/features/pg/pbs-pg-glossary.html)
