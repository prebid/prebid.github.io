---
layout: page_v2
page_type: module
title: Module - Server-to-Server Testing
description: Adds A/B test support to ease analysis of server-side header bidding
module_code : s2sTesting
display_name : Server-to-Server Testing
enable_download : true
sidebarType : 1
---



# Prebid JS Module: Server-to-Server Testing

This module allows publishers the chance to ramp-up on [Prebid Server](/prebid-server/overview/prebid-server-overview.html),
testing the impact of server-side header bidding before fully switching.
Without this module, the s2sConfig settings direct all requests to
Prebid Server. By including this module in the PrebidJS build, there are
additional options for controlling how requests are sent:

* Global A/B control - defines what percent of requests should be satisfied via the server and which by the traditional client-based method. This is cross AdUnit-configuration.
* AdUnit A/B control - the ratio of server-to-client requests can be overridden at the AdUnit level.

The package is built by specifying the `s2sTesting` module on the build command. For example:

```
gulp build --modules=rubiconBidAdapter,appnexusAstBidAdapter,prebidServerBidAdapter,s2sTesting
```

The expectation is the Server-to-Server Testing module will used for a limited period.
During the test period, the publisher analyzes metrics from various places
to gauge the impact of moving header bidding to the server. After the test
period is complete, regardless of outcome, A/B testing would be turned off
and this module no longer included in the PrebidJS build.

## Features
With the Server-to-Server Testing module, the following enhancements are provided:

New 'bidderControl' options in s2sConfig. E.g.

```
pbjs.setConfig(
  s2sConfig: {
     bidders: [ "rubicon", "appnexus" ],
     enabled: true,
     testing: true,
     testServerOnly: false,
     bidderControl: {
         "rubicon": {
             bidSource: {server:10, client:90},
             includeSourceKvp: true
         },
         "appnexus": {
             bidSource: {server: 25, client:75},
             includeSourceKvp: true
         }
     }
});
```

The values in the bidSource object are weights. These examples show them as
percentages that add to 100, but they could also be "{server:1, client:9}" and "{server:1, client:3}" respectively.

The `testing: true` attribute is required to enable the bidderControl and
bidSource features. This shouldn't be confused with the `enabled: true` flag
which enables the entire server-to-server feature.

When 'includeSourceKvp' is specified in s2sConfig, the system will log an
additional Key Value Pair (KVP) to the ad server. This will allow reporting
to confirm the ratio of client-vs-server administered requests, as well as
more advanced reporting.

```
hb_source_BIDDER=client
```
OR

```
hb_source_BIDDER=s2s
```

There's also a new `bidSource` option in AdUnits that overrides the global bidSource. E.g.

```
AdUnit={
    [...]
    bids=[{
        bidder: "rubicon",
        bidSource: {client:50, server:50} // precedence over s2sConfig.bidderControl
        [...]
    }]
}
```

## Analysis

Determining the success of the test is up to each publisher, but 
keep in mind the various data sources you may have access to:

* Ad Server reports - the additional `hb_source` key value pair can be used to confirm some elements on the performance.
* Prebid Analytics Adapter - if you're already monitoring header bidding, those reports should be monitored for impacts in key metrics from the A/B test.
* Bidder data - SSPs should be able to provide data about cookie match rates and general performance during the test period.


## Usage Examples

### 1. Global A/B Test

*As a Publisher, I want to ramp up server traffic across my site to
monitor revenue impact before going entirely to server-side header bidding.
I don't want to modify AdUnits because that's time consuming in the CMS.*

Example S2S Config defining that 10% of Rubicon requests and 100% of AppNexus requests go through the server:

```
pbjs.setConfig(
  s2sConfig: {
     account: "PREBID-SERVER-ACCOUNT",
     bidders: [ "rubicon", "appnexus" ],
     enabled: true,
     testing: true,
     bidderControl: {
         "rubicon": {
            bidSource: {client:90, server:10},
            includeSourceKvp: true
         }
     }
});
```
The additional hb_source_rubicon KVP will be sent to the ad server for additional reporting.

### 2. A/B Test for one AdUnit

*As a Publisher, I want to get metrics on the difference between the server
approach and the client approach so we can gauge the impact of Prebid Server,
but we want to do this on a small number of AdUnits.*

Example S2S Config defining that the client route is the default path for the rubicon adapter:

```
pbjs.setConfig(
  s2sConfig: {
     account: "PREBID-SERVER-ACCOUNT",
     bidders: [ "rubicon", "appnexus" ],
     enabled: true,
     testing: true,
     bidderControl: {
         rubicon: {
            bidSource: {client:100},
            includeSourceKvp: true
         }
     }
});
```
And then changes to override one particular AdUnit for server testing:

```
AdUnit={
    [...]
    bids=[{
        bidder: "rubicon",
        bidSource: {server:25, client:75}
        [...]
    }]
}
```
Requests will go to the Rubicon Exchange on the server path 25% of the time
and the client path the rest of the time.  The additional hb_source_rubicon
KVP will be sent to the ad server for additional reporting.

### 3. A/B Test isolating the server 

*As a Publisher, I want to get metrics on the difference between a 'pure server'
approach and a mixed client-server approach so we can gauge the impact of Prebid Server running alone, without any client requests. I'll use the `testServerOnly: true` flag to suppress all client requests whenever the 'A/B test group' results in a server request.*

Using the `testServerOnly` flag means that all client requests will be suppressed (those requests will not be made) whenever any bid requests from the 'A/B test group' result in a 'server' bid request.  The 'A/B test group' includes any requests whose source is controled by 's2sConfig.bidderControl' or 'bidSource' at the adUnit level.  This may give a clearer picture of how s2s performs without interference from client bid requests.

For best results, all bidders/bids in the 'A/B test group' should be configured with the same client/server allocation.  Because use of this flag will result in turning off client bids a certain percentage of the time, it could negatively affect revenue, and should be used with caution.  Thus it should only be used when 'server' is allocated a small percentage (i.e. <= 5%) of bid requests.

Example S2S Config defining that 5% of the time all bid requests will go 'server' and 95% of the time a mix of 'server' and 'client':

```
pbjs.setConfig(
  s2sConfig: {
     account: "PREBID-SERVER-ACCOUNT",
     bidders: [ "rubicon", "criteo" ],
     enabled: true,
     testing: true,
     testServerOnly: true,
     bidderControl: {
         rubicon: {
            bidSource: {client:95, server 5},
            includeSourceKvp: true
         },
         criteo: {
            bidSource: {client:95, server 5},
            includeSourceKvp: true
         }
     }
});

AdUnit={
    [...]
    bids=[{
        bidder: "index",
        [...]
    },{
        bidder: "rubicon",
        [...]
    },{
        bidder: "criteo",
        [...]
    }]
}
```
5% of the time rubicon, and criteo will use s2s bid requests while index does not bid, and the other 95% of the time rubicon, criteo, and index use client bid requests.

Addtional details:
- If a bidder is always 100% server-side -- i.e. doesn't have either `s2sConfig.bidderControl` or `AdUnit.bids[].bidSource`, then it will not affect `testServerOnly`. i.e. It's going on the server path will not exclude client side adapters.

### 4. Turn on Test KVP, but no server requests

*As a Publisher, I'd like to run tests on one part or my site per one of the
other use cases above. I'll use the test KVP to confirm relative responses,
so would like to have the `hb_source` test KVP coming in even on pages where
the server test isn't running.*

Example S2S Config defining that client is the default path for the rubicon adapter:

```
pbjs.setConfig(
  s2sConfig: {
     ...
     enabled: false,
     testing: true,
     bidderControl: {
         "rubicon": {
            "bidSource": {client:100},
            includeSourceKvp: true
         }
     }
});
```
The test KVP hb_source_rubicon on this page will always sent with the value "client".

## Further Reading

+ [Prebid Server](/prebid-server/overview/prebid-server-overview.html)


