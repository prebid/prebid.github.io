---
layout: page_v2
sidebarType: 5
title: Prebid Server | Features | Stored Requests

---

# Prebid Server | Features | Stored Requests

'Stored Requests' are blocks of OpenRTB stored on the server-side that are merged into 
OpenRTB requests in a couple of scenarios.

The data source can be local files on Prebid Server, but more commonly it would be a relational
database distributed across all the Prebid Servers in the host company's installation.

## Mobile App

Hardcoding bidders and parameters in a mobile app isn't ideal. Prebid Server allows Stored Request IDs to be
used in two ways:

1. Define cross-adunit parameters like currency and price granularity
1. Define adunit-specific details: bidders and their parameters

See the [Mobile SDK Use Case reference](/prebid-server/use-cases/pbs-sdk.html) for specific examples.

## AMP

The AMP protocol is converted to OpenRTB primarily using Stored Requests: the `tag_id` is used to look up
the base OpenRTB from the data source. After getting the bulk of the OpenRTB, AMP query string parameters
are used to inject and adjust parameters like size, url, etc. See the [AMP endpoint documentation](/prebid-server/endpoints/openrtb2/pbs-endpoint-amp.html) for more details.

See the [AMP Use Case reference](/prebid-server/use-cases/pbs-amp.html) for specific examples.

## Creating Stored Requests

Details for setting up:
- [PBS-Go Stored Requests](/prebid-server/features/pbs-storedreqs-go.html)
- [PBS-Java Stored Requests](https://github.com/prebid/prebid-server-java/blob/master/docs/developers/stored-requests.md)
