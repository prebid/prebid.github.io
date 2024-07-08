---
layout: page_v2
sidebarType: 5
title: Prebid Server | Hosting

---

# Hosting a Prebid Server Cluster
{:.no_toc}

* TOC
{:toc}

## Overview

Prebid Server is not a turn-key solution. Whoever takes on hosting a Prebid Server is also taking on:

* Setting up production-quality servers, networking, monitors, etc.
* Populating backend data such as stored requests and account-level configuration
* Responsibility for understanding the legal implications of ad tech in your marketplace. PBS has built-in configurable support for [several privacy regulations](/prebid-server/features/pbs-privacy.html), but you need to understand and configure them with help from your lawyers.
* Regular updates. Please don't download Prebid Server and just run the same version forever. You need to commit to checking **at least** quarterly for updates. There are new releases most every week.

You'll need to decide which of the two implementations to utilize:

* [Prebid Server (Go)](/prebid-server/versions/pbs-versions-go.html) - the original Prebid Server is written in the Go language.
* [Prebid Server (Java)](/prebid-server/versions/pbs-versions-java.html) - Prebid Server with a Java language port.

To choose between them, see the [Prebid Server version overview](/prebid-server/versions/pbs-versions-overview.html) and the [FAQ](/faq/prebid-server-faq.html#why-are-there-two-versions-of-prebid-server-are-they-kept-in-sync).

## Components

The components required to support a PBS cluster are highlighted in this hardware
layout diagram:

![Prebid Server Hardware Layout](/assets/images/prebid-server/pbs-hardware-layout.png){:class="pb-xlg-img"}

### Global Load Balancer

Assuming you need to serve more than one geographic region, you'll need to utilize a Global Load Balaning service so your users will hit the
servers in the region closest to them.

### Regional Load Balancers

Once the users have come into their nearest server cluster, a load balancer will direct them in one of two ways:

1. If the URI of the request contains `/cache`, they should be directed to one of the Prebid Cache servers.
2. Otherwise, all other endpoints should be forwarded to one of the Prebid Servers.

### Prebid Servers

These servers will have a mix of network and CPU work. They benefit
from a fair amount of memory so they can cache stored requests
and many versions of the GDPR vendors list.

Other services you may want to run alongside Prebid Server are:

* Geographic lookup (e.g. GDPR scope determination)

Note that neither Prebid Server nor Prebid Cache supports configuring an SSL certificate. It's intended that they run behind a load balancer or proxy server (e.g. nginx) that provides SSL.

### Prebid Cache Servers

The PBC servers consume very little CPU or memory - they just translate
between Prebid protocols and the chosen No-SQL system that implements the storage cluster.

### No-SQL Clusters

This is where Prebid Cache stores its data. You can choose Redis, Aerospike, or Cassandra. How many you need will
depend on the expected traffic, your traffic mix, and the average length of time that objects are cached.

### Replicated Database

Account information and StoredRequests are stored in a [database](/prebid-server/hosting/pbs-database.html)
queried by Prebid Server at runtime.
PBS has an internal LRU cache for this database, so it only queries when there's an account or stored request it hasn't seen recently.

Getting data to each of the regions likely involves setting up a
source database that replicates to each region.

Note that there aren't any open source tools for populating this
database. Each PBS host company establishes their own methods of
populating data from their internal systems.

### Metrics System

You'll want to hook both Prebid Server and Prebid Cache up to an
operational monitoring system.

* PBS-Go currently supports Influx and Prometheus
* PBS-Java currently supports Influx, Graphite, Prometheus, and Console

## Installing the Software

The process for actually installing and configuring the software will differ for
the Go and Java versions of the software. See the relevant section
as a next step.

## Optional Registration

Prebid does not track who downloads Prebid Server, but sometimes we make
announcements (bugs, features) and want to get feedback on proposals. You can get on
this mailing list by emailing <prebid-server@prebid.org>. It's low volume.

Required to get on the list:

* A group email address. No individual addresses please.

Optional:

* Which version of Prebid Server are you running: PBS-Go or PBS-Java?
* A host URL so we can occasionally check what versions people are running.
* Are there any features you'd like to see in Prebid Server?

Even though this is not information about individuals, this information falls under the
[Prebid website privacy policy](/policies/privacy.html). You can remove your company from the
email list at any time just by emailing us again at <prebid-server@prebid.org>.

## Further Reading

* [Prebid Server Database](/prebid-server/hosting/pbs-database.html)
* [PBS-Go](/prebid-server/versions/pbs-versions-go.html)
* [PBS-Java](/prebid-server/versions/pbs-versions-java.html)
* [Bidder-specific setup guidelines](/prebid-server/hosting/bidder-specific-guidelines.html)
