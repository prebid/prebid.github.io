---
layout: page
title: Running Your Own Prebid Server
description: Running Your Own Prebid Server
pid: 28
top_nav_section: dev_docs
nav_section: prebid-server
---

<div class="bs-docs-section" markdown="1">

# Running Your Own Prebid Server
{:.no_toc}

Prebid.org offers Prebid Server and Prebid Cache in two different languages at this time: GoLang and Java.
The existence of these versions of the functionality is a representation of the variety of companies and
their associated infrastructures that participate in the Prebid.org ecosystem. Prebid.org espouses no
specific language or framework, but rather lives by the rules outlined in the Code of Conduct.
As a result, any implementation of any system that follows these rules is welcome into the community,
as long as there is a path to long-term maintenance and upgrades.

The choice to run your own production instance of a Prebid Server and Prebid Cache cluster should not be
taken lightly. In addition to the challenge of managing and upgrading a globally distributed revenue-critical production system, this section outlines additional considerations.

* TOC
{:toc}

## Source

Source for the different implementations:

* Prebid Server
  * GoLang - [https://github.com/prebid/prebid-server](https://github.com/prebid/prebid-server)
  * Java - [https://github.com/prebid/prebid-server-java](https://github.com/prebid/prebid-server-java)
* Prebid Cache
  * GoLang - [https://github.com/prebid/prebid-cache](https://github.com/prebid/prebid-cache)
  * Java - [https://github.com/prebid/prebid-cache-java](https://github.com/prebid/prebid-cache-java)

Note that all of the above repositories contain developer documentation that may be more up-to-date than what's presented below.

## Endpoint Change In Progress

While not critical for most aspects of operation, there are some configuration differences driven by a change we're making in the main Prebid Server endpoint.

The original endpoint was `/auction` -- it supported a custom block of JSON arguments that
fit the prototype well.

As the scope of server-side header-bidding grew, it became obvious that the types of parameters needed
fit neatly into OpenRTB. As a result, the open source project is in the midst of migrating all functionality to the new endpoint `/openrtb2/auction`. See the [developer documentation](https://github.com/prebid/prebid-server/blob/master/docs/endpoints/openrtb2/auction.md) for details on the protocol.

No new server-bid-adapters will be accepted with the legacy `/auction` endpoint and at some point in the coming year, `/auction` will be removed. This obviously depends on clients migrating to a version of Prebid.js that supports the OpenRTB2-compatible prebidServerBidAdapter.

## Cookie Sync Rate

Prebid Server operates like any other server-to-server ad request system in that it is responsible for
managing user match tables between itself and downstream demand integrations. In order to remain
lightweight and efficient, Prebid Server leverages the cookie space of its host domain to synchronize
users with the bidders with which it integrates. For example, if Publisher A hosts a Prebid Server
cluster at prebid-server.publisher-a.com, and leverages a bidder Exchange A, the user ID for Exchange A
is pushed into the uuids cookie on the prebid-server.publisher-a.com domain. As a result, operating a
Prebid Server cluster on a publisher's primary domain has the benefit of increasing cookie persistence.
This is different than if Exchange A is hosting Prebid Server on its domain, since it is able to build
its user sync pool across all of the domains on which it serves. The primary benefit of a publisher
hosting their own Prebid Server is therefore cookie persistence, which may be a worthwhile tradeoff for
sites that have heavy Safari traffic.

It is worth noting that as the prevalence and penetration of "universal user ID" systems like
Digitru.st take off, the value of leveraging the broad base of user synchronization enjoyed by
exchanges is diminished.

We highly recommend you reach out to Prebid.org to discuss these tradeoffs and determine the best path
forward. Email us at info@prebid.org.

## Exchange Integrations

Prebid Server requires server-to-server connections from Prebid Server to the various demand sources
that are plugged in. Please note that some of the bidders require separate authentication parameters
and contracts in order to integrate, as server-to-server integrations pose a greater risk of
accidentally or purposefully misrepresenting the inventory and audience being sold. Please consult the
bidders with whom you would like to integrate on this matter to ensure that the appropriate agreements
are in place to proceed forward.

See [https://github.com/prebid/prebid-server/blob/master/docs/bidders](https://github.com/prebid/prebid-server/blob/master/docs/bidders) for information about each adapter.

Note that the open source team has ported all of the adapters that were implemented in Go, but 
it may take some time for all of the owning exchanges to review, test, and approve the port. See the
[adapter status page](https://github.com/rubicon-project/prebid-server-java/tree/master/src/main/java/org/prebid/server/adapter) for the current status.

## Prebid Cache Server

If you plan to run mobile or video ads in your Prebid Server environment, you'll need a cache server. The `cache_markup` flag in the request to Prebid Server indicates that it should do the following:

- Cache all bid responses using a configured URL and wait for the response
- If caching succeeds, add values to the client response: cache_id, cache_url
- Remove the bid's creative body before responding to the client

Eventually the ad server will make a decision which ad to display, and if one of the bids wins, cache_id and/or cache_url are used to retrieve the creative body for display.

Follow the instructions in the [GoLang](https://github.com/prebid/prebid-cache) or [Java](https://github.rp-core.com/Mobile/prebid_cache_webflux/blob/master/README.md) repository to set up the cache server, and then configure it in pbs.json:

```
...
"cache": {
        "scheme": "http",
        "host": "prebid-cache.example.com",
        "query": "uuid=%PBS_CACHE_UUID%"
},
...
```

If you're going to run Prebid Server in multiple geographic regions, you'll need to make sure that Prebid Servers
and Prebid Cache servers are bound together in the same region.

## Choose a Data Store

The Prebid Server data store is a way to configure account and request data. Specifically:

- Specified account is valid (currently `/auction` endpoint only)
- Price granularity for the specified account (used for the "sort_bids" option)
- Bidders and bidder parameters

With the legacy `/auction` endpoint, there are two options: YAML or relational tables. MySql is supported for Java, Postgres for both Go and Java.

### YAML file

YAML file example
{% highlight bash %}
accounts:
  - 1111
  - 2222
  - 3333
configs:
  - id: 1111-1
    config: "[ { \"bidder\": \"rubicon\", \"params\": { \"zoneId\": 535510, \"siteId\": 113932, \"accountId\": 1001 }}, { \"bidder\": \"appnexus\", \"params\": { \"placementId\": 9848285 }} ]"
  - id: 2222-1
    config: "[ { \"bidder\": \"rubicon\", \"params\": { \"zoneId\": 535510, \"siteId\": 113932, \"accountId\": 1001 }}, { \"bidder\": \"appnexus\", \"params\": { \"placementId\": 9848285 }} ]"
{% endhighlight %}

### Legacy endpoint relational tables

The `/auction` endpoint has the ability to query a relational database to get 3 types of data:

1. Account validation
1. Account price granuarity
1. "Config" ID - the original implementation of stored_requests, this is a table that defines bidders and bid parameters for a given "config_id".

Example schemas:

```
CREATE TABLE accounts_account (
    id          SERIAL PRIMARY KEY,
    uuid        varchar(40) NOT NULL,
    price_granularity   varchar(6),
    granularityMultiplier  numeric(9,3)
);
 
Sample insert:
   insert into accounts_account (uuid, price_granularity) values ('1001','med');
 
CREATE TABLE s2sconfig_config (
    id          SERIAL PRIMARY KEY,
    uuid        varchar(40) NOT NULL,
    config      varchar(512)
);
 
Sample insert:
  insert into s2sconfig_config (uuid, config) values ('1111-1','[ { "bidder": "rubicon", "params": { "zoneId": 535510, "siteId": 113932, "accountId": 1001 }}, { "bidder": "appnexus", "params": { "placementId": 9848285 }} ]"');
```

### OpenRTB configuration

The `/openrtb2/auction` endpoint has a more generalized approach to configuration:

- A query may be defined in the config file that returns a single override column.
- The output of the query must be JSON OpenRTB2
- In place of queries, flat files may be placed in `stored_requests/data/by_id/{id}.json`
- The query or file is merged with the incoming OpenRTB2 request, with the query or file taking precedence.

```
    "stored_requests": {
        "filesystem": false,
        "postgres": {
            "dbname": "DB_NAME",
            "host": "DB_HOST",
            "port": 5432,
            "user": "",
            "password": "",
            "query": "SELECT id, config FROM myTable WHERE id IN %ID_LIST%"
            "amp-query": "SELECT id, config FROM myAmpTable WHERE id IN %ID_LIST%"
        }
    },
```

Note that the query for AMP-RTC support may be different than for standard `/openrtb2` requsts.

The implication of this approach is that the either the database has to store fully-formed JSON or
a sophisticated query is needed to construct the JSON output as part of the query. Here's an example illustrating the possible use of the Postgres jsonb_build_object function:

```
SELECT uuid AS id, jsonb_build_object('ext', jsonb_object_agg(value->>'bidder', value->'params'))
   as config 
FROM (SELECT uuid, jsonb_array_elements(cast(config AS jsonb))
   as value FROM s2sconfig_config WHERE uuid IN %ID_LIST%) sub GROUP BY uuid 
UNION ALL 
SELECT uuid, jsonb_build_object('ext', jsonb_build_object('prebid',
   jsonb_build_object('targeting', jsonb_build_object('pricegranularity', price_granularity,
   'lengthmax', 20)))) FROM accounts_account WHERE uuid IN %ID_LIST% GROUP BY uuid;
```


## Metrics

Prebid Server can aggregate basic operational metrics.

The GoLang version of the server supports Influx Meters, which measure various rates at which events occur.

```
  "metrics": {
     "type": "influxdb",
     "host": INFLUX_URL,
     "interval": 60
  }
```

The Java version supports some additional options:

- metrics.type can be graphite or influxdb
- metrics.metricType can be:
    - counter: ever-increasing integer of event counts
    - flushingCounter: integer of event counts that resets to 0 at each reporting interval
    - meter: measures events and event rates

See graphite and influxdb options in the [Java config](https://github.com/rubicon-project/prebid-server-java/blob/master/docs/config-app.md) reference.

There are quite a few metrics produced at the granularity of the account and adapter. Some examples:

- app_requests
- account.1001.requests.count
- account.1001.rubicon.requests.count
- adapter.appnexus.no_cookie_requests.count

A brief description of some of the metrics produced:

{: .table .table-bordered .table-striped }
Metric | Description
------ | -----------
app_requests| Mobile app requests at a global server level
cookie_sync_requests| /cookie_sync requests at a global server level.
error_requests | Malformed requests at a global server level. (currently only used for bad accounts)
no_cookie_requests |Requests that came in without a uids cookie
request_time |Latency of the entire request at a global level
requests |Number of `/auction` requests
safari_no_cookie_requests |Number of requests from a Safari browser without a uids cookie.
safari_requests |Number of requests from a Safari browser.
usersync |Number of /setuid calls made to the server - broken out into success, failure, and opt-out.


## Cache Proxy For Video Render

Server-side header-bidding for Video requires caching the VAST documents. When the video ad wins,
it needs to define the cached asset URL in the ad server. e.g.

```
    VAST URL: https://prebid-server.example.com/cache?uuid=%%pattern:hb_cache_id%%
```

This URL needs to refer back to the same cache server where the original ad request stored the results.
For a single-region installation, this is easy enough. But when there's a global footprint of prebid-servers, care must be taken to bring the user back to the right one.

For both versions, we recommend implementing a proxy server in front of Prebid Server, directing requests to `/openrtb2`, `/auction`, `/cache`, etc. as appropriate.

## Performance

Performance testing has been done comparing the Java version of Prebid Server with the Go version. Results:
{% highlight bash %}
1000 requests per second
CPU % Java: 51
CPU % GO:   74

2000 requests per second

CPU % Java: 79
CPU % GO:   100

Go server became unstable at 1200 rps
{% endhighlight %}


Test details

{: .table .table-bordered .table-striped }
| Architecture |          x86_64 |
| CPU op-mode(s)|      32-bit, 64-bit |
| CPU(s)|                4|
| Vendor ID|             GenuineIntel|
| CPU MHz|               2000.000|
| Mem|                   8061208|

These tests were run with two mock bidders configured via nginx.

## Go-vs-Java Comparison Matrix

For the most part, the Go and Java versions of the server are at feature parity. Here are
the known differences:

{: .table .table-bordered .table-striped } 
| Feature Area | Go           | Java  |
| ------------ | ---------- | ----- |
| Metrics | influx meters| influx and graphite, meters, counters, flushed counters|
| Data Store Options | yaml, postgres | yaml, postgres, mysql |
| Bidder Adapters | *certified adapters*: adform, appnexus, audienceNetwork, conversant, indexExchange, lifestreet, pubmatic, pulsepoint, rubicon | *certified adapters*: rubicon<br>*ported adapters*: adform, appnexus, audienceNetwork, conversant, indexExchange, lifestreet, pubmatic, pulsepoint |

## Links to Detailed Documentation

Both repositories contain up-to-date and relevant developer documentation:

Go Prebid Server

- [Configuration](https://github.com/prebid/prebid-server/blob/master/docs/developers/configuration.md)
- [Contributing to the project](https://github.com/prebid/prebid-server/blob/master/docs/developers/contributing.md)
- [Deployment](https://github.com/prebid/prebid-server/blob/master/docs/developers/deployment.md)
- [Stored requests](https://github.com/prebid/prebid-server/blob/master/docs/developers/stored-requests.md)
- [Adding a new bid adapter](https://github.com/prebid/prebid-server/blob/master/docs/developers/add-new-bidder.md)

Java Prebid Server

- [Basic Configuration](https://github.com/rubicon-project/prebid-server-java/blob/master/docs/config.md)
- [All config options](https://github.com/rubicon-project/prebid-server-java/blob/master/docs/config-app.md)
- [Contributing to the project](https://github.com/rubicon-project/prebid-server-java/blob/master/docs/contributing.md)
- [Building for AWS ElasticBeanstalk](https://github.com/rubicon-project/prebid-server-java/blob/master/docs/build-aws.md)
- [Adding a new bid adapter](https://github.com/rubicon-project/prebid-server-java/blob/master/docs/developers/add-new-bidder.md)

Java Prebid Cache

- [Prebid Cache details](https://github.rp-core.com/Mobile/prebid_cache_webflux/blob/master/README.md)


# Related Topics

+ [Getting started with Prebid Server]({{site.baseurl}}/dev-docs/get-started-with-prebid-server.html)
+ [Add a Bidder Adapter to Prebid Server]({{site.baseurl}}/dev-docs/add-a-prebid-server-adapter.html)
+ [Prebid Server Configuration]({{site.baseurl}}/dev-docs/prebid-server-config-examples.html)

</div>
