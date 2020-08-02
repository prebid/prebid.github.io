---
layout: page_v2
sidebarType: 5
title: Prebid Server | Hosting

---

# Hosting a Prebid Server Cluster

Spinning up a self-hosted cluster of Prebid Servers requires some up-front-planning.
The components that will be needed are highlighted in this hardware
layout diagram:

![Prebid Server Hardware Layout](/assets/images/prebid-server/pbs-hardware-layout.png){:class="pb-xlg-img"}

## Global Load Balancer

Assuming you need to serve more than one geographic region, you'll need to utilize a Global Load Balaning service so your users will hit the
servers in the region closest to them.

## Regional Load Balancers

Once the users have come into their nearest server cluster, a load balancer will direct them in one of two ways:

1. If the URI of the request contains `/cache`, they should be directed to one of the Prebid Cache servers.
2. Otherwise, all other endpoints should be forwarded to one of the Prebid Servers.

## Prebid Servers

These servers will have a mix of network and CPU work. They benefit
from a fair amount of memory so they can cache stored requests
and many versions of the GDPR vendors list.

Other services you may want to run alongside Prebid Server are:

- Geographic lookup (for GDPR scope determination)
- Device lookup service (future: for Programmatic Guaranteed targeting)

## Prebid Cache Servers

The PBC servers consume very little CPU or memory - they just translate
between Prebid protocols and the chosen No-SQL system that implements the storage cluster.

## Storage Clusters

You can setup Redis, Aerospike, or Cassandra. How many you need will
depend on the expected traffic, your traffic mix, and the average length of time that objects are cached.

## Replicated Database

Account information and StoredRequests are stored in a [database](/prebid-server/hosting/pbs-database.html)
queried by Prebid Server at runtime.
PBS has an internal LRU cache for this database, so it only queries when there's an account or stored request it hasn't seen recently.

Getting data to each of the regions likely involves setting up a
source database that replicates to each region.

Note that there aren't any open source tools for populating this
database. Each PBS host company establishes their own methods of
populating data from their internal systems.

## Metrics System

You'll want to hook both Prebid Server and Prebid Cache up to an
operational monitoring system.

- PBS-Go currently supports Influx and Promotheus
- PBS-Java currently supports Influx and Graphite

## Installing the Software

The process for actually installing and configuring the software will differ for
the Go and Java versions of the software. See the relevant section
as a next step.

## Further Reading

- [Prebid Server Database](/prebid-server/hosting/pbs-database.html)
- [PBS-Go](/prebid-server/versions/pbs-versions-go.html)
- [PBS-Java](/prebid-server/versions/pbs-versions-java.html)
