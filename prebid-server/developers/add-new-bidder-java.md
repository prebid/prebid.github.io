---
layout: page_v2
sidebarType: 5
title: Prebid Server | Developers | Adding a New Bidder

---

# Prebid Server - Adding a New Bidder - Java
{: .no_toc}

* TOC
{:toc }

This document describes how to add a new bid adapter to the Java version of Prebid Server. However, our recommendation is to [build new adapters in Go](/prebid-server/developers/add-new-bidder-go.html) because we port them to Java within a couple of months.

**NOTE**: To make everyone's lives easier, Bidders are expected to make net-price bids (e.g. "If this ad wins, what will the publisher make?"), not gross-price bids.
Publishers can correct for gross-price bids by setting [Bid Adjustments](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#bid-adjustments) to account for fees.

## Choose a Bidder Name

This name must be unique. Existing BidderNames can be found [here](https://github.com/rubicon-project/prebid-server-java/tree/master/src/main/java/org/prebid/server/bidder).

Throughout the rest of this document, substitute `{bidder}` with the name you've chosen.

## Define Your Bidder Params

Bidders may define their own APIs for Publishers to pass custom values subject to these guidelines:

- Don't duplicate values already present in the [OpenRTB 2.5 spec](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf).
- Don't add bidder-specific parameters that already have Prebid conventions: first party data, floors, schain, video params, referrer, COPPA.

Publishers will send values for these parameters in `request.imp[i].ext.{bidder}` of
[the Auction endpoint](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html). Prebid Server will preprocess these so that
your bidder will access them at `request.imp[i].ext.bidder`--regardless of what your `{bidder}` name is.

## Implement Your Bidder

Bidder implementations are scattered throughout several files:
- `src/main/java/org/prebid/server/bidder/{bidder}/{bidder}Bidder.java`: contains an implementation of [the Bidder interface](../../src/main/java/org/prebid/server/bidder/Bidder.java).
- `src/main/java/org/prebid/server/bidder/{bidder}/{bidder}Adapter.java`: contains an implementation of [the Adapter interface](../../src/main/java/org/prebid/server/bidder/Adapter.java).
- `src/main/java/org/prebid/server/bidder/{bidder}/{bidder}Usersyncer.java`: contains an implementation of [the Usersyncer interface](../../src/main/java/org/prebid/server/bidder/Usersyncer.java).
- `src/main/java/org/prebid/server/proto/openrtb/ext/{bidder}`: contract classes for your Bidder's params.
- `src/main/resources/static/bidder-params/{bidder}.json`: A [draft-4 json-schema](https://spacetelescope.github.io/understanding-json-schema/) which [validates your Bidder's params](https://www.jsonschemavalidator.net/).

Bidder implementations may assume that any params have already been validated against the defined json-schema.

{: .alert.alert-warning :}
Prebid Server bid adapters must follow all required conventions defined in the [Module Rules](/dev-docs/module-rules.html). Not doing so could lead to delays in approving your adapter for inclusion in Prebid Server. If you'd like to apply for an exception to one of the rules, make your request in a new [Prebid Server issue](https://github.com/prebid/prebid-server/issues).

### Generic OpenRTB Bidder

There's an option to implement a bidder by using a pre-existing template.
OpenrtbBidder(https://github.com/rubicon-project/prebid-server-java/blob/master/src/main/java/org/prebid/server/bidder/OpenrtbBidder.java) is an abstract class that
implements Bidder<BidRequest> interface and provides a default implementation of its methods.

This class provides a fixed algorithm with number of certain access points(so called hook-methods) that
could be overridden to change the defaults to implement bidder-specific transformations.
You can check what "hooks" are available and their description at the OpenrtbBidder class.

NOTE: this model is not universal "all-in-one" solution as it encapsulates only the simple bidders' behaviour
in order to ease the creation of lightweight bidders and get rid of boilerplate code.
Bidders with a complicated request transformation logic would have to implement a Bidder interface and
define their structure from scratch.

#### Can Your Bidder use the OpenrtbBidder model?

If your bidder is the one that:

1. Send out a single request i.e. ones that just modify an incoming request and pass it on("one-to-one") OR
send out one request per incoming request impression. Other "one-to-many" scenarios are nto supported;
2. Have a constant endpoint url (no additional or optional path parameters or request parameters);
3. Require a basic set of headers, which is "Content-type" : "application/json;charset=utf-8" and "Accept" : "application/json"
4. Apply static changes to the outgoing request, e.g., setting a specific constant value or removing a certain request field;
5. Modify impression or request values in a way that could be expressed by transformation mapping;
6. Returns all bids present in Bid Response;
7. Bid type and currency could by derived from bid itself and its corresponding impression;

#### What Does the OpenRTB Bidder Implement?

Constructing outgoing http request/s from incoming bid request:

1. Validate incoming bid request, request impressions and impression extensions;
2. Apply necessary changes or transformations to request and its impressions;
3. Encode and return the modified outgoing request/s.

Bidder response processing:

1. Extract bids from response;
2. Set each bid type and currency;

### Bid Response Metadata

In addition to the standard OpenRTB2.5 response fields, Prebid encourages bidders to
provide additional metadata in their bid response:

{% highlight js %}
{
  "seatbid": [{
    "bid": [{
      ...
      "ext": {
        "prebid": {
          "meta": {
            "networkId": NETWORK_ID,
            "networkName": NETWORK_NAME
            "agencyId": AGENCY_ID,
            "agencyName": AGENCY_NAME,
            "advertiserId": ADVERTISER_ID,
            "advertiserName": ADVERTISER_NAME,
            "advertiserDomains": [ARRAY_OF_ADVERTISER_DOMAINS]
            "brandId": BRAND_ID,
            "brandName": BRAND_NAME,
            "primaryCatId": IAB_CATEGORY,
            "secondaryCatIds": [ARRAY_OF_IAB_CATEGORIES],
          }
        }
      }
    }]
  }]
}
{% endhighlight %}

Notes:

- `advertiserDomains` is the same as the OpenRTB 2.5 `bid.adomain` field but replicated here for downstream convenience
- See the [Prebid.js Bidder Adapter](/dev-docs/bidder-adaptor.html) page for details about the requested values for each field.

{: .alert.alert-info :}
Please provide as much information as possible in the meta object. Publishers use this data for tracking down bad creatives and ad blocking. The advertiserDomains field is particularly useful. Some of these fields may become required in a future release.

### BidResponse Requirements

**Note**: In order to be part of the auction, all bids must include:

- An ID
- An ImpID which matches one of the `Imp[i].ID`s from the incoming `BidRequest`
- A positive `Bid.Price`
- A `Bid.CrID` which uniquely identifies the Creative in the bid.

Bids which don't satisfy these standards will be filtered out before Prebid Server responds.

## Integration

After implementation you should integrate the Bidder with file:
- `src/main/java/org/prebid/server/spring/config/bidder/{bidder}Configuration.java`

It should be public class with Spring `@Configuration` annotation so that framework could pick it up.

This file consists of three main parts:
- the constant `BIDDER_NAME` with the name of your Bidder.
- injected configuration properties (like `endpoint`, `usersyncUrl`, etc) needed for the Bidder's implementation.
- declaration of `BidderDeps` bean combining _bidder name_, _Usersyncer_, _Adapter_ and _BidderRequester_ in one place as a single point-of-truth for using it in application.

Also, you can add `@ConditionalOnProperty` annotation on configuration if bidder has no default properties.
See `src/main/java/org/prebid/server/spring/config/bidder/FacebookConfiguration.java` as an example.

## Test Your Bidder

### Automated Tests

Assume common rules to write unit tests from [here](unit-tests.md).

Bidder tests live in the next files:
- `src/test/java/org/prebid/server/bidder/{bidder}/{bidder}BidderTest.java`: unit tests for your Bidder implementation.
- `src/test/java/org/prebid/server/bidder/{bidder}/{bidder}AdapterTest.java`: unit tests for your Adapter implementation.
- `src/test/java/org/prebid/server/bidder/{bidder}/{bidder}UsersyncerTest.java`: unit tests for your Usersyncer implementation.

Commonly you should write tests for covering:
- creation of your Adapter/Bidder/Usersyncer implementations.
- correct Bidder's params filling.
- JSON parser errors handling.
- specific cases for composing requests to exchange.
- specific cases for processing responses from exchange.

Do not forget to add your Bidder to `ApplicationTest.java` tests.

We expect to see at least 90% code coverage on each bidder.

### Manual Tests

[Configure](https://github.com/rubicon-project/prebid-server-java/blob/master/docs/config.md), [build](https://github.com/rubicon-project/prebid-server-java/blob/master/docs/build.md) and [start](https://github.com/rubicon-project/prebid-server-java/blob/master/docs/run.md) your server.

Then `POST` an OpenRTB Request to `http://localhost:8000/openrtb2/auction`.

If at least one `request.imp[i].ext.{bidder}` is defined in your Request, then your bidder should be called.

To test user syncs, [call /setuid](/prebid-server/endpoints/pbs-endpoint-setuid.html) using the FamilyName of your Bidder.
The next time you use `/openrtb2/auction`, the OpenRTB request sent to your Bidder should have
`BidRequest.User.BuyerUID` with the value you saved.

## Document your bidder

There are two documents required before we’ll accept your pull request:

1. Repo metadata - create a new file https://github.com/prebid/prebid-server/blob/master/static/bidder-info/BIDDERCODE.yaml based on one of the other ones there. Note that you must provide an email that’s not a single individual – we need robust maintainer contact info read by multiple people like “support@example.com”.
1. User documentation - required to appear in the [Prebid Server adapters page](/dev-docs/pbs-bidders.html). If you already have one of these files from having a PBS-Go adapter, you're done. Otherwise, see [that page](/prebid-server/developers/add-new-bidder-go.html#document-your-adapter) for details.

## Contribute

Finally, [Contribute](https://github.com/rubicon-project/prebid-server-java/blob/master/docs/contributing.md) your Bidder to the project.
