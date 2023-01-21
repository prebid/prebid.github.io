---
layout: page_v2
sidebarType: 5
title: Prebid Server | Features | Stored Requests

---

# Prebid Server | Features | Stored Requests

'Stored Requests' are blocks of OpenRTB stored on the server-side that are merged into 
OpenRTB requests for Mobile App and AMP scenarios.

The data source can be local files on Prebid Server, but more commonly it would be a relational
database distributed across all the Prebid Servers in the host company's installation.

## Mobile App

We want to avoid hardcoding parameters into a mobile app like bidders and parameters. Because of this, Prebid Server allows host companies to store two types of JSON that are retrieved with a key called a 'Stored Request ID':

- "top-level" requests, also called "wrapper-level" requests. This block is merged into the root level of the incoming ORTB request. It's not expected to have an imp object.
- "impression-level" requests are merged into a particular ORTB imp element.

![App stored request model](/assets/images/prebid-server/stored-requests-app.png){: .pb-lg-img :}

1. The SDK creates a 'skeleton' framework of the OpenRTB JSON that doesn't
contain the bidders or any other parameter that might be changed by AdOps.
2. Prebid Server merges all the stored requests into this template.
3. Creating the final OpenRTB JSON just like Prebid.js would have sent using the PBS Bid Adapter.

See the [Mobile SDK Use Case reference](/prebid-server/use-cases/pbs-sdk.html) for specific examples.

## AMP

The AMP protocol is converted to OpenRTB primarily using Stored Requests: the `tag_id` is used to look up
a single base OpenRTB from the data source. After getting the bulk of the OpenRTB, AMP query string parameters
are used to inject and adjust parameters like size, url, etc. See the [AMP endpoint documentation](/prebid-server/endpoints/openrtb2/pbs-endpoint-amp.html) for more details.

![AMP stored request model](/assets/images/prebid-server/stored-requests-amp.png){: .pb-lg-img :}

See the [AMP Use Case reference](/prebid-server/use-cases/pbs-amp.html) for specific examples.

## Creating Stored Requests

Details for setting up:
- [PBS-Go Stored Requests](/prebid-server/features/pbs-storedreqs-go.html)
- [PBS-Java Stored Requests](/prebid-server/features/pbs-storedreqs-java.html)
