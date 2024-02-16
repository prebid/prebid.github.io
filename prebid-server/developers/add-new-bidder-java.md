---
layout: page_v2
sidebarType: 5
title: Prebid Server | Developers | Adding a New Bidder

---

# Prebid Server - Adding a New Bidder - Java
{: .no_toc}

- TOC
{:toc }

Thank you for your valuable contribution of a bid adapter to the open source Prebid Server project. Each new adapter expands the monetization possibilities for publishers and provides greater options to maximize their inventory's potential. We truly appreciate your support in making this ecosystem thrive!

This document guides you through the process of developing a new bid adapter for your bidding server. We encourage you to look at [existing bid adapters](https://github.com/prebid/prebid-server-java/tree/master/src/main/java/org/prebid/server/bidder) for working examples and practical guidance. You can ask us questions by [submitting a GitHub issue](https://github.com/prebid/prebid-server-java/issues/new).

{: .alert.alert-info :}
**NOTE:** There are two implementations of Prebid Server: [PBS-Go](https://github.com/prebid/prebid-server) and [PBS-Java](https://github.com/prebid/prebid-server-java). We recommend you build new adapters for PBS-Go first, and then PBS-Java if you'd like. We port adapters from Go-to-Java, but not the other way around.

## Introduction

Bid adapters are responsible for translating a 'Prebid-flavored' OpenRTB Bid Request to your bidding server's protocol and mapping your server's response to a Prebid-flavored reponse.

"Prebid-flavored OpenRTB" means:

1. [OpenRTB 2.6](https://github.com/InteractiveAdvertisingBureau/openrtb2.x) as defined by the IAB.
1. Certain Prebid extensions as defined in the [/auction endpoint documentation](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html).

OpenRTB Bid Requests contain one or more impression objects, each representing a single ad placement. An impression may define multiple sizes and/or multiple ad formats. If your bidding server limits requests to a single ad placement, size, or format, then your adapter will need to split the impression into multiple calls and merge the responses.

## Plan Your Bid Adapter

### Choose A Name

You will need to choose a unique name for your bid adapter. Names should be written in lower case and may not contain special characters or emoji. If you already have a Prebid.js bid adapter, we encourage you to use the same name with the same bidder parameters. You may not name your adapter `all`, `context`, `data`, `general`, `prebid`, `skadn` or `tid` as those have special meaning in various contexts. Existing bid adapter names are [maintained here](https://github.com/prebid/prebid-server-java/tree/master/src/main/java/org/prebid/server/bidder).

We ask that the first 6 letters of the name you choose be unique among the existing bid adapters. This consideration helps with generating targeting keys for use by some ad exchanges, such as Google Ad Manager.

Throughout the rest of this document, substitute `{bidder}` with the name you've chosen.

### Consider Your Geography

Most bidders run their auction endpoints in multiple datacenters because their
business is continental or global.

Prebid Server is open source software that is run by many host companies that may be calling
your bid adapter from various places. It may be useful to consider how you want to
communicate your geographic preferences to these companies.

{: .alert.alert-info :}
Please don't bother publishers by asking them to enter a geographic location 'host' parameter. Most publishers do not have the tech to choose which of your regional endpoints to hit.

These are the recommended technical solutions:

1. Use a "Global Services Load Balancing" vendor so there's just one smart hostname that figures out where to send each user. Just do an internet search for "gslb services".
1. In your bidder yaml file, let the host companies know which regional endpoints you support. They can take care of mapping their regions to your regions. See the YAML file below for an example of how to communicate this.

You should also consider entering geographic scoping information into your YAML file so
host companies can disable your bidder in regions where you're not going to bid. e.g.
bidders that are not GDPR-compliant probably won't bid much in Europe. It costs both you and the host company networking fees to send bid requests, so it's in
your interest to declare your scope of business. See below for syntax details.

### Respect The Rules

We are proud to run the Prebid Server project as a transparent and trustworthy header bidding solution. You are expected to follow our community's [code of conduct](https://prebid.org/code-of-conduct/) and [module rules](/dev-docs/module-rules.html) when creating your adapter and when interacting with others through issues, code reviews, and discussions.

**Please take the time to read the rules in full.** Below is a summary of some of the rules which apply to your Prebid Server bid adapter:

- Adapters must include maintainer information with a group email address for Prebid.org to contact for ongoing support and maintenance.
- Your bidder's endpoint domain name cannot be fully variable. We will accept endpoint domains that include account IDs, but we do not like them, and Prebid Server host companies may disable adapters using this approach if there are technical issues with it. We will not accept hostnames that have a required dynamic element for the purpose of sending traffic to different geographic regions.
- If you have a client-side adapter, all parameters (including biddercodes and aliases) must be consistent between your client- and server-side adapters. This allows publishers to utilize the PBJS [s2sTesting module](/dev-docs/modules/s2sTesting.html).
- Adapters must not modify bids from demand partners, except to either change the bid from gross to net or from one currency to another.
- Adapters must use the functions provided by the core framework for all external communication. Initiation of any form of network connection outside of what is provided by the core framework is strictly prohibited. No exceptions will be made for this rule.
- Adapters must support the creation of multiple concurrent instances. This means adapters may not mutate global or package scoped variables.
- Bidding server endpoints should prefer secure HTTPS to protect user privacy and should allow keep alive connections (preferably with HTTP/2 support) to increase host performance.
- Adapters must annotate the bid response with the proper media type, ideally based on the response from the bidding server.
- Bid adapters must not create their own transaction IDs or overwrite the tids supplied by Prebid.

{: .alert.alert-warning :}
Failure to follow the rules will lead to delays in approving your adapter for inclusion in Prebid Server. If you'd like to discuss an exception to a rule, please make your request by [submitting a GitHub issue](https://github.com/prebid/prebid-server-java/issues/new).

### Multiformat

Publishers are utilizing multiformat ad units more frequently, e.g. an impression object that contains both banner and video. It is important that your
adapter handle this scenario. Here are your options:

1. Set `ortb.multiformat-supported: false` in your bidder YAML file. This will cause PBS to choose a format for you based on publisher configuration or discard any requests that are multiformat.
1. Or code your adapter to choose one of the available formats. e.g. "if both banner and video are present, always choose video".
1. Or code your adapter to make multiple requests to your auction endpoint. e.g. "if both banner and video are present, make two calls to the endpoint".

### Ongoing Support and Maintenance

**You are expected to provide support and maintenance for the code you contribute to Prebid Server as part of your bid adapter.** We ask that you proactively update your adapter when your bidding server introduces new features or breaking changes.

Occasionally, we'll introduce changes to the core framework as part of our ongoing maintenance and enhancement of the project. If this causes a compilation error or a performance impact to your adapter, we will update the affected portion of your bid adapter code and provide full unit test coverage of our changes. We will notify you via email if this happens and give you at least one week to review the PR and provide comments. Please understand that we will not wait for your explicit approval for these kinds of changes unless you respond to our email or comment on the PR.

Please be attentive in reading and responding to emails and [GitHub issues](https://github.com/prebid/prebid-server-java/issues) from publishers, hosts, and Prebid.org project maintainers. If we receive complaints about your bid adapter and you do not respond to our communications, we may disable your adapter by default or remove it from the project entirely.

## Generic Adapter

Before creating your own bid adapter, consider looking into [generic adapter implementation](https://github.com/prebid/prebid-server-java/blob/master/src/main/java/org/prebid/server/bidder/GenericBidder.java). Its main purpose is to simplify testing of PBS. As this adapter just passes requests through without any additional manipulations with data, it can be used to test behaviour of PBS core logic. But, it can be also used as template for simple bid adapters or even for aliasing the very basic ones.

## Create Your Adapter

Prebid Server bid adapters consist of several components: bidder config yaml, bidder parameters, bid adapter code, configuration for framework and default configuration(.yaml) values. This chapter will guide you though each component.

Please refer to [existing bid adapters](https://github.com/prebid/prebid-server-java/tree/master/src/main/java/org/prebid/server/bidder) for working examples and practical guidance, but understand that our adapter interfaces and coding style evolve over time. Please prefer the examples in this document over differences you may find in  code.

Our project is written in the [Java programming language](https://www.java.com/). Please try your best and we'll respectfully steer you in the right direction during the review process.

{: .alert.alert-info :}
Please do not ignore errors from method calls made in your bid adapter code. Even if it's seemingly impossible for an error to occur, it's still possible under the high throughput multi-threaded nature of Prebid Server.

### Bidder Config YAML

Let's begin with your adapter's bidder information YAML file. This file is required and contains your maintainer email address, specifies the ad formats your adapter will accept, and other params.

Create a file with the path `static/bidder-info/{bidder}.yaml` and begin with the following template:

```yaml
adapters:
  yourBidderCode:
    # We have the following regional endpoint domains: us-east and us-west
    # Please deploy this config in each of your datacenters with the appropriate regional subdomain
    endpoint: http://REGION.example.com/openrtb2
    endpoint-compression: gzip (or none)
    geoscope:
      - USA
      - CAN
    meta-info:
      maintainer-email: maintainer@email.com
      app-media-types:
        - banner
        - video
        - audio
        - native
      site-media-types:
        - banner
        - video
        - audio
        - native
      dooh-media-types:
        - banner
        - video
        - audio
        - native
      supported-vendors:
      vendor-id: your_vendor_id
    usersync:
      cookie-family-name: yourBidderCode
      iframe:
        url: https://some-bidder-domain.com/usersync-url?gdpr={{gdpr}}&consent={{gdpr_consent}}&us_privacy={{us_privacy}}&redirect={{redirect_url}}
        uid-macro: 'YOURMACRO'
        support-cors: false
      redirect:
        url: https://some-bidder-domain.com/usersync-url?gdpr={{gdpr}}&consent={{gdpr_consent}}&us_privacy={{us_privacy}}&redirect={{redirect_url}}
        uid-macro: 'YOURMACRO'
        support-cors: false
```

Modify this template for your bid adapter:

- The endpoint can be static if you only have one datacenter or use a Global Load Balancer as described in 'Planning Your Adapter' above.
- The `geoscope` parameter is not currently read programmatically. Instead, it's intended to be used by PBS host companies to disable your adapter in geographic regions where you don't do business. However, we may make a module for this someday, so we ask that you follow this syntax for `geoscope`:
  - YAML array
  - Values can be either a 3-letter country code, "EEA", or "global". (EEA means European Economic Area)
  - Values can be negated. e.g. "!EEA"
- Change the maintainer email address to a group distribution list on your ad server's domain. A distribution list is preferred over an individual mailbox to allow for robustness, as roles and team members naturally change.
- If absolutely necessary, change the `modifying-vast-xml-allowed` value to `false` to opt-out of [video impression tracking](https://github.com/prebid/prebid-server/issues/1015). However, please note that Prebid Server host companies depend on this feature being enabled to track video analytics. This feature has been live for many years with no known problems.
- Change the `pbs-enforces-ccpa` to `false` if you'd like to disable ccpa enforcement. Defaults to `true`.
- Change the `vendor-id` value to id of your bidding server as registered with the [GDPR Global Vendor List (GVL)](https://iabeurope.eu/tcf-for-vendors/). Leave this as `0` if you are not registered with IAB Europe.
- Choose the `supported-vendors` constants: These constants should be unique. The list of existing vendor constants can be found [here](https://github.com/prebid/prebid-server-java/blob/master/src/main/java/org/prebid/server/bidder/ViewabilityVendors.java).
- Remove the `capabilities` (app/site/dooh) and `mediaTypes` (banner/video/audio/native) combinations which your adapter does not support. (Note: 'dooh' is [Digital Out Of Home](/prebid-server/use-cases/pbs-dooh.html))
- If your auction endpoint supports gzip compression, setting 'endpoint-compression' to 'gzip' will save on network fees.

If you does not support user syncing, you can remove `usersync` section of configuration.

- Change the `cookie-family-name` to the name which will be used for storing your user sync id within the federated cookie. Please keep this the same as your bidder name.
- Choose appropriate section for your usersync type(iframe/redirect). If both iframe and redirect endpoints are provided, the iframe endpoint will be used by default.

In appropriate usersync section:

- Change the `url` to url of your usersync endpoint
- Change the `uid-macro` to macro that will be placed in callback endpoint, to be resolved by your usersyncer. Defaults to empty string.
- Change the `support-cors` to true if your endpoint supports cors.

The url of your user syncer can make use of the following macros which will be resolved by Prebid Server before sending the url to your server:

- `{%raw%}{{us_privacy}}{%endraw%}`: Client's CCPA consent string.
- `{%raw%}{{gdpr}}{%endraw%}`: Client's GDPR TCF enforcement flag.
- `{%raw%}{{gdpr_consent}}{%endraw%}`: Client's GDPR TCF consent string.
- `{%raw%}{{redirect_url}}{%endraw%}`: Url to redirect back to Prebid Server.

### Default bidder configuration

Prebid Server has default configuration for common bidder properties, which can be overriden by bidders in their
configurations.

Default configuration:

```yaml
adapter-defaults:
  enabled: false
  pbs-enforces-ccpa: true
  modifying-vast-xml-allowed: true
```

There are also some default properties which can't be overridden in adapter-defaults, but rather in particular adapter's config:

- `aliases`: Defaults to empty
- `deprecated-names`: Defaults to empty
- `extra-info`: Defaults to empty

### Create bidder alias
If you want to add bidder that is an alias of existing bidder, you need just to update configuration of parent bidder:

Example of adding bidder alias:

```yaml
adapters:
  yourBidderCode:
    ...
    aliases: 
      yourBidderAlias:
        endpoint: http://possible.alias/endpoint
        app-media-types:
          - banner
          - video
        site-media-types:
          - banner
          - video
        usersync:
          cookie-family-name: yourBidderCode
```

Aliases are configured by adding child configuration object at `adapters.yourBidderCode.aliases.yourBidderAlias`

Aliases support the same configuration options that their bidder counterparts support except `aliases` (i.e. it's not possible
to declare alias of an alias).

{: .alert.alert-warning :}
**Aliases cannot declare support for media types not supported by their parent bidders**<br />
However aliases could narrow down media types they support.<br />
For example: if the bidder is written to not support native site requests, then an alias cannot magically decide to change that;
However, if a bidder supports native site requests, and the alias does not want to for some reason, it has the ability to remove that support.

{: .alert.alert-info :}
Note on aliases and TCF Global Vendor List IDs: if an alias entry does not have its own GVLID but wishes to claim GDPR support,
the documentation entry (The file in [github.com/prebid/prebid.github.io/tree/master/dev-docs/bidders](https://github.com/prebid/prebid.github.io/tree/master/dev-docs/bidders)) must list the GVLID of the main adapter with that company's name in parentheses.
Look for other doc entries containing an `aliasCode` metadata entry.

### Bidder Parameters

Your bid adapter might require extra information from the publisher to form a request to your bidding server. The bidder parameters JSON Schema codifies this information to allow Prebid Server to verify requests and to provide an API for third party configuration systems.

Publishers will provide extra information using an OpenRTB 2.5 Bid Request Extension, preferably at `request.imp[].ext.prebid.bidder.{bidder}` but also supported at `request.imp[].ext.{bidder}`. Prebid Server will validate the publisher information based on your schema and relocate the data to `request.imp[].ext.bidder`, regardless of your bidder name or the publisher's chosen location.

We request that you do not duplicate information that is already present in the [OpenRTB 2.5 Bid Request specification](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf#page=13) or is already part of an established Prebid convention. For example, your bidder parameters should not include first party data, bid floors, schain, video parameters, referrer information, or privacy consent including COPPA, CCPA, and GDPR TCF. For video parameters in particular, you must prefer the OpenRTB 2.5 Bid Request standard of `request.imp[].video`.

{: .alert.alert-warning :}
**ENDPOINT NOTE:** You may not try so set the full endpoint domain from a publisher-specified bidder parameter. Prebid Server is not an open proxy. If absolutely necessary, you may specify a *portion* of the domain as a parameter to support geo regions or account specific servers. However, this is discouraged and may degrade the performance of your adapter since the server needs to maintain more outgoing connections. Host companies may choose to disable your adapter if it uses a dynamically configured domain.

Create a file with the path `static/bidder-params/{bidder}.json` using [JSON Schema](https://json-schema.org/understanding-json-schema/) to define your bidder parameters. Prebid Server requires this file for every adapter, even if yours doesn't require bidder parameters (see the 'no parameters' example at the end of this section).

Let's start with this example which defines one required `placementId` string parameter:

```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "Foo Adapter Params",
  "description": "A schema which validates params accepted by the Foo adapter",
  "type": "object",

  "properties": {
    "placementId": {
      "type": "string",
      "description": "Placement ID"
    }
  },

  "required": ["placementId"]
}
```

We encourage you to utilize the full features of [JSON Schema](https://spacetelescope.github.io/understanding-json-schema/) to narrowly define your bidder parameter data types. If you copy and paste these examples, please remember to change the  `title` and `description` to refer to your bidder name instead of our fictional Foo example.

When choosing your parameter names, please consider aligning with the OpenRTB 2.5 standard by using lower case letters without camel casing or special characters.

In addition to the examples listed below, please refer to [existing bidder parameter files](https://github.com/prebid/prebid-server-java/tree/master/src/main/resources/static/bidder-params) for guidance.

<details markdown="1">
  <summary>Example: No parameters.</summary>

```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "Foo Adapter Params",
  "description": "A schema which validates params accepted by the Foo adapter",
  "type": "object",

  "properties": {}
}
```

</details>

<details markdown="1">
  <summary>Example: Required integer placement id.</summary>

```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "Foo Adapter Params",
  "description": "A schema which validates params accepted by the Foo adapter",
  "type": "object",

  "properties": {
    "placementId": {
      "type": "integer",
      "minimum": 1,
      "description": "Placement ID"
    }
  },

  "required": ["placementId"]
}
```

</details>

<details markdown="1">
  <summary>Example: Required access token and an optional hexadecimal account.</summary>

```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "Foo Adapter Params",
  "description": "A schema which validates params accepted by the Foo adapter",
  "type": "object",
  
  "properties": {
    "token": {
      "type": "string",
      "description": "Token"
    },
    "account": {
      "type": "string",
      "description": "Account",
      "pattern": "^([a-fA-F\\d]+)$"
    }
  },

  "required": ["token"]
}
```

</details>

<details markdown="1">
  <summary>Example: Required access token or secret.</summary>

```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "Foo Adapter Params",
  "description": "A schema which validates params accepted by the Foo adapter",
  "type": "object",

  "properties": {
    "token": {
      "type": "string",
      "description": "Token"
    },
    "secret": {
      "secret": "string",
      "description": "Secret"
    }
  },

  "oneOf": [
    { "required": ["token"] },
    { "required": ["secret"] }
  ]
}
```

</details>
<p></p>

### Bidder Parameters Code

{: .alert.alert-info :}
You can skip this step if your adapter has no bidder parameters.

If you've defined bidder parameters for your adapter, you also need to represent your bidder parameters in code. The core framework uses the JSON Schema file for validation, but your adapter code needs a data structure to support JSON serialization / deserialization. These data structures are organized in a shared path using a standard naming convention, which also serves as documentation of all adapter parameters.

Create a file with the path `org.prebid.server.proto.openrtb.ext.request.{bidder}.ExtImp{bidder}.java` containing an exported (must start with an upper case letter) data structure named `ImpExt{Bidder}`. All required and optional bidder parameters from the JSON Schema should be represented as fields.

For example, this is what the bidder parameter code looks like for the example we used in the previous section:

```java
/**
 * Defines the contract for bidrequest.imp[i].ext.{bidder}
 */
@AllArgsConstructor(staticName = "of")
@Value
public class ExtImp{bidder}{

    @JsonProperty("jsonName")
    Double property;

    String secondProperty;
}
```

Please follow [Java standard naming convention](https://www.oracle.com/java/technologies/javase/codeconventions-namingconventions.html) for the field names (particularly for acronyms) and use `` `@JsonProperty` `` attributes to specify the JSON name, matching exactly what you defined in the bidder parameters JSON Schema. Please keep in mind that JSON is case sensitive.

### Adapter Code

Now it's time to write the bulk of your bid adapter code.

Each adapter has its own directory (a 'package' in java parlance) for all code and tests associated with translating an OpenRTB 2.5 Bid Request to your bidding server's protocol and mapping your server's response to an OpenRTB 2.5 Bid Response. The use of separate packages provide each adapter with its own naming scope to avoid conflicts and gives the freedom to organize files as you best see fit (although we make suggestions in this guide).

Create a file with the path `org.prebid.server.bidder.{bidder}/{bidder}Bidder.java`. Your bid adapter code will need to implement Bidder<T> interface where `T` is a model which will represent HttpRequest body.

- The `Bidder<T>` interface consisting of the `MakeHttpRequests` method to create outgoing requests to your bidding server and the `MakeBids` method to create bid responses.

Here is a reference implementation for a bidding server which uses the OpenRTB 2.5 protocol:

```java
package org.prebid.server.bidder.{bidder};

import com.iab.openrtb.request.BidRequest;
import com.iab.openrtb.request.Imp;
import com.iab.openrtb.response.BidResponse;
import com.iab.openrtb.response.SeatBid;
import io.vertx.core.http.HttpMethod;
import org.apache.commons.collections4.CollectionUtils;
import org.prebid.server.bidder.Bidder;
import org.prebid.server.bidder.model.BidderBid;
import org.prebid.server.bidder.model.BidderError;
import org.prebid.server.bidder.model.HttpCall;
import org.prebid.server.bidder.model.HttpRequest;
import org.prebid.server.bidder.model.Result;
import org.prebid.server.exception.PreBidException;
import org.prebid.server.json.DecodeException;
import org.prebid.server.json.JacksonMapper;
import org.prebid.server.proto.openrtb.ext.response.BidType;
import org.prebid.server.util.HttpUtil;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * {bidder} {@link Bidder} implementation.
 */
public class {bidder}Bidder implements Bidder<BidRequest> {

    private final String endpointUrl;
    private final JacksonMapper mapper;

    public {bidder}Bidder(String endpointUrl, JacksonMapper mapper) {
        this.endpointUrl = HttpUtil.validateUrl(Objects.requireNonNull(endpointUrl));
        this.mapper = Objects.requireNonNull(mapper);
    }

    @Override
    public Result<List<HttpRequest<BidRequest>>> makeHttpRequests(BidRequest request) {

        return Result.withValue(HttpRequest.<BidRequest>builder()
                .method(HttpMethod.POST)
                .uri(endpointUrl)
                .headers(HttpUtil.headers())
                .payload(request)
                .body(mapper.encode(request))
                .build()));
    }

    @Override
    public final Result<List<BidderBid>> makeBids(HttpCall<BidRequest> httpCall, BidRequest bidRequest) {
        try {
            final BidResponse bidResponse = mapper.decodeValue(httpCall.getResponse().getBody(), BidResponse.class);
            return Result.withValues(extractBids(httpCall.getRequest().getPayload(), bidResponse));
        } catch (DecodeException | PreBidException e) {
            return Result.withError(BidderError.badServerResponse(e.getMessage()));
        }
    }

    private static List<BidderBid> extractBids(BidRequest bidRequest, BidResponse bidResponse) {
        if (bidResponse == null || CollectionUtils.isEmpty(bidResponse.getSeatbid())) {
            return Collections.emptyList();
        }
        return bidsFromResponse(bidRequest, bidResponse);
    }

    private static List<BidderBid> bidsFromResponse(BidRequest bidRequest, BidResponse bidResponse) {
        return bidResponse.getSeatbid().stream()
                .filter(Objects::nonNull)
                .map(SeatBid::getBid)
                .filter(Objects::nonNull)
                .flatMap(Collection::stream)
                .map(bid -> BidderBid.of(bid, getBidType(bid.getImpid(), bidRequest.getImp()), bidResponse.getCur()))
                .collect(Collectors.toList());
    }

    private static BidType getBidType(String impId, List<Imp> imps) {
        BidType bidType = BidType.banner;
        for (Imp imp : imps) {
            if (imp.getId().equals(impId)) {
                if (imp.getBanner() != null) {
                    return bidType;
                } else if (imp.getVideo() != null) {
                    bidType = BidType.video;
                } else if (imp.getXNative() != null) {
                    bidType = BidType.xNative;
                } else if (imp.getAudio() != null) {
                    bidType = BidType.audio;
                }
            }
        }
        return bidType;
    }
}

```

#### MakeHttpRequests

The `MakeHttpRequests` method is responsible for returning zero or more HTTP requests to be sent to your bidding server. Bid adapters are forbidden from directly initiating any form of network communication and must entirely rely upon the core framework. This allows the core framework to optimize outgoing connections using a managed pool and record networking metrics. The return type `adapters.RequestData` allows your adapter to specify the HTTP method, url, body, and headers.

This method is called once by the core framework for bid requests which have at least one valid Impression for your adapter. Impressions not configured for your adapter will be removed and are not accessible.

The argument, `request`, is the OpenRTB 2.5 Bid Request object. Extension information is stored as `com.fasterxml.jackson.databind.node.ObjectNode` byte arrays and must be converted from node to be read and/or mutated. It is *critical* to understand that the `request` object contains pointers to shared memory. If your adapter needs to alter any data referenced by a pointer then you *must* first make a shallow copy(you can do it by using toBuilder() method on model you want to change, but remember about objects like Lists and always create copy's of this data types). The exact same instance of the `request` object is also passed to the `MakeBids` method, so please be careful when mutating. It's safe to assume that `request.Imp[]` always contains at least one element and that the `request.Imp[].ext.bidder` was successfully validated by your bidder parameter JSON Schema.

<details markdown="1">
  <summary>Example: Mutating banner shared memory (make a copy).</summary>

```java
// Populate the top level width and height of a banner request if it's not set by the publisher.

  final List<Format> format = banner.getFormat();
            if (banner.getW() == null && banner.getH() == null && CollectionUtils.isNotEmpty(format)) {
                final Format firstFormat = format.get(0);
                final Banner modifiedBanner = banner.toBuilder().w(firstFormat.getW()).h(firstFormat.getH()).build();
                return imp.toBuilder().banner(modifiedBanner).build();
            }
```

</details>
<p></p>

The `MakeHttpRequests` method is expected to return a  `List<HttpRequest<BidRequest>` object representing the HTTP calls to be sent to your bidding server and a `List<BidderError> errors` for any issues encountered creating them. If there are no HTTP calls or if there are no errors, please use different methods in `Result` class specific to your case.

An Impression may define multiple sizes and/or multiple ad formats. If your bidding server limits requests to a single ad placement, size, or format, then your adapter will need to split the Impression into multiple calls and merge the responses.

<details markdown="1">
  <summary>Example: Impression splitting.</summary>

```java
@Override
    public Result<List<HttpRequest<BidRequest>>> makeHttpRequests(BidRequest request) {
        final List<HttpRequest<BidRequest>> httpRequests = new ArrayList<>();
        for (Imp imp : request.getImp()) {
            final BidRequest outgoingRequest = request.toBuilder().imp(Collections.singletonList(imp)).build();
            httpRequests.add(HttpRequest.<BidRequest>builder()
                    .method(HttpMethod.POST)
                    .uri(endpointUrl)
                    .headers(HttpUtil.headers())
                    .payload(outgoingRequest)
                    .body(mapper.encode(outgoingRequest))
                    .build());
        }

        return Result.withValues(httpRequests);
    }
```

</details>
<p></p>

If your bidding server supports multiple currencies, please be sure to pass through the `request.cur` field. If your bidding server only bids in a single currency, such as USD or EUR, that's fine. Prebid Server will convert your bid to the request currency if you include it in the bid response, otherwise we assume USD and conversion will not occur.

Please ensure you forward the bid floor (`request.imp[].bidfloor`) and bid floor currency (`request.imp[].bidfloorcur`) values to your bidding server for enforcement.

There are a several values of a bid request that publishers may supply that your adapter and endpoint should be aware of. Some are defined by the OpenRTB 2.5 specification and some are defined by Prebid conventions:

{: .table .table-bordered .table-striped }
| Parameter | Definer | Path & Description
| - | - | - | -
| CCPA | OpenRTB | `request.regs.ext.us_privacy` <br/> The publisher is specifying the California Consumer Privacy Act consent string.
| COPPA | OpenRTB | `request.regs.ext.us_privacy`<br/> The publisher is specifying the Children's Online Privacy Protection flag.
| ATTS | OpenRTB | `request.device.ext.atts`<br/> The [App Tracking Transparency Status](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/master/extensions/community_extensions/skadnetwork.md#object-bidrequestdeviceext) set on the device (iOS only).
| SKAdNetwork | OpenRTB | `request.imp[].ext.skadn` <br/> The [SKAdNetwork](https://github.com/prebid/prebid-mobile-ios/issues/342) signaling to support mobile attribution when a user's IDFA is unavailable for iOS traffic.
| Currency | OpenRTB |`request.cur` <br/> The publisher is specifying the desired bid currency. The Prebid Server default is USD.
| [Debug](https://github.com/prebid/prebid-server/issues/745) | Prebid | `request.ext.prebid.debug` <br/> The publisher is requesting verbose debugging information from Prebid Server.
| [First Party Data (FPD)](https://docs.prebid.org/prebid-server/features/pbs-fpd.html)| Prebid | `request.imp[].ext.context.data.*`, `request.app.ext.data.*`, `request.site.ext.data.*`, `request.user.ext.data.*` <br/> The publisher may provide first party data (e.g. keywords).
| GDPR | OpenRTB |  `request.regs.ext.gdpr`, `request.user.ext.consent` <br/> The publisher is specifying the European General Data Protection Regulation flag and TCF consent string.
| Site or App | OpenRTB | `request.site`, `request.app` <br/> The publisher will provide either the site or app, but not both, representing the client's device.
| Supply Chain | OpenRTB | `request.source.ext.schain` <br/> The publisher's declaration of all parties who are selling or reselling the bid request.
| Test | OpenRTB | `request.test` <br/> The publisher is sending non-production traffic which also enables verbose debugging information from Prebid Server.
| Video | OpenRTB | `request.imp[].video` <br/> The publisher is specifying video ad requirements or preferences.
| Rewarded inventory | OpenRTB | `request.imp[].ext.prebid.is_rewarded_inventory` <br/> Signal to indicate the inventory is rewarded.
| Digital Services Act (DSA) | OpenRTB | `request.regs.ext.dsa` <br/> The publisher will indicate that a transaction is subject to DSA and whether they will render the required transparency information themselves.

##### Request compression

If you want your request body to be GZIP compressed, you should add `Content-Encoding` header with `gzip` value.
<details markdown="1">
  <summary>Example: Creating headers for gzip compressed request.</summary>
```java
private static MultiMap resolveHeaders() {
        return HttpUtil.headers()
                .add(HttpUtil.CONTENT_ENCODING_HEADER, HttpHeaderValues.GZIP);
    }
```
</details>

#### Response

The `MakeBids` method in your adapter is responsible for parsing the bidding server's response and mapping it to the [OpenRTB 2.5 Bid Response object model](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf#page=32).

This method is called for each response received from your bidding server within the bidding window (`request.tmax`). If there are no requests or if all requests time out, the `MakeBids` method will not be called.

{: .alert.alert-info :}
It's *imperative* to include all required information in the response for your bid to be accepted. Please avoid common mistakes, such as not specifying the bid currency and not properly detecting the media type from the bidding server response.

The first argument, `HttpCall`, is the HTTP response received from your bidding(contains the status code, body, and headers) and also specific to your bid `HttpRequest<T>` request. If your bidding server replies with a GZIP encoded body, it will be automatically decompressed.

The second argument, `request`, is the exact same OpenRTB 2.5 Bid Request object provided to (and potentially mutated by) the `MakeRequests` method. The information in the `request` may be useful when detecting the media type.

The `MakeBids` method is expected to return an `Result` object with one or more bids mapped from your bidding server's response. This may be as simple as decorating an OpenRTB 2.5 Bid Response with a some Prebid Server metadata (such as the media type) or more complicated mapping logic depending on your server's response format.

Please review the entire [OpenRTB 2.5 Bid Response](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf#page=32) documentation to fully understand the response object model and expectations. We've summarized some common fields below. Data which is listed as required is enforced by the core framework and cannot be omitted.

{: .table .table-bordered .table-striped }
| BidderResponse Path | Scope | Description
| - | - | -
| `.Currency` | Required | [3-letter ISO 4217 code](https://www.iso.org/iso-4217-currency-codes.html) defining the currency of the bid. The Prebid Server default is USD.
| `.Bids[].BidType` | Required | Prebid Server defined value identifying the media type as `banner`, `video`, `audio`, or `native`. Should be mapped from the bidding server response.
| `.Bids[].Bid.ADomain` | Optional | Advertiser domain for block list checking.
| `.Bids[].Bid.AdM` | Optional | Ad markup to serve if the bid wins. May be HTML, Native, or VAST/VMAP formats. You should resolve any AUCTION_PRICE macros.
| `.Bids[].Bid.CrID` | Required | Unique id of the creative.
| `.Bids[].Bid.ID` | Required | Bidder generated id to assist with logging and tracking.
| `.Bids[].Bid.ImpID` | Required | ID of the corresponding bid request Impression. Prebid Server validates the id is actually found in the bid request.
| `.Bids[].Bid.Price` | Required | Net price CPM of the bid, not gross price. Publishers can correct for gross price bids by setting Bid Adjustments to account for fees. We recommend the most granular price a bidder can provide.
| `.Bids[].Bid.W` | Optional | Width of the creative in pixels.
| `.Bids[].Bid.H` | Optional | Height of the creative in pixels.
| `.Bids[].Bid.Ext.Prebid.Meta` | Optional | Embedded JSON containing Prebid metadata (see below) or custom information.
| `.Bids[].Bid.Ext.Dsa` | Optional | Embedded JSON containing DSA Transparency information (see below).

{: .alert.alert-info :}
We recommend resolving creative OpenRTB macros in your adapter. Otherwise, AUCTION_PRICE will eventually get resolved by the [Prebid Universal Creative](https://github.com/prebid/prebid-universal-creative), but by then the bid price will be in the ad server currency and quantized by the price granularity.

If you'd like to support Long Form Video Ad Pods, then you'll need to provide the followings information:

{: .table .table-bordered .table-striped }
| BidderResponse Path | Description
| - | -
| `.Bids[].BidVideo.PrimaryCategory` | Category for the bid. Should be able to be translated to the primary ad server format.
| `.Bids[].Bid.Cat` | Category for the bid. Should be able to be translated to the primary ad server format.
| `.Bids[].BidVideo.Duration` | Length of the video in integer seconds.
| `.Bids[].DealPriority` | Deal tier integer value. Defaults to 0.

{: .alert.alert-info :}
Either `.Bids[].BidVideo.PrimaryCategory` or `.Bids[].Bid.Cat` should be provided.

##### Metadata

In order to share granular bid response data with publishers, analytics, and reporting systems, we've introduced a standard object model. We encourage adapters to provide as much information as possible in the bid response.

{: .alert.alert-danger :}
Bid metadata may be required in a future Prebid.js release. The AdvertiserDomains field and the DChain object are particularly useful. We recommend ensuring your adapter sets these fields or Prebid.js may reject your bid.

{: .table .table-bordered .table-striped }
| Path | Description |
| - | - |
| `.AdvertiserDomains` | Domains for the landing page(s) aligning with the OpenRTB `adomain` field. |
| `.AdvertiserID` | Bidder-specific advertiser id. |
| `.AdvertiserName` | Bidder-specific advertiser name. |
| `.AgencyID` | Bidder-specific agency id. |
| `.AgencyName` | Bidder-specific agency name. |
| `.BrandID` | Bidder-specific brand id for advertisers with multiple brands. |
| `.BrandName` | Bidder-specific brand name. |
| `.DChain` | Demand chain object. |
| `.DemandSource` | Bidder-specific demand source. Some adapters may functionally serve multiple SSPs or exchanges, and this specifies which. |
| `.MediaType` | Either `banner`, `audio`, `video`, or `native`. This is used in the scenario where a bidder responds with a mediatype different than the stated type. e.g. native when the impression is for a banner. One use case is to help publishers determine whether the creative should be wrapped in a safeframe. |
| `.NetworkID` | Bidder-specific network/DSP id. |
| `.NetworkName` | Bidder-specific network/DSP name. |
| `.RendererName` | Name of the desired renderer for the creative. |
| `.RendererVersion` | Version of the desired renderer for the creative. |
| `.RendererUrl` | Url of the desired renderer for the creative. |
| `.PrimaryCategoryID` | Primary IAB category id. |
| `.SecondaryCategoryIDs` | Secondary IAB category ids. |

##### DSA

See the [IAB's DSA protocol](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/main/extensions/community_extensions/dsa_transparency.md) for background information.

This response object allows DSPs to provide publishers with requested transparency and render information. Your bid adapter should place it in the standard ORTB location. The Java object is .Bids[].Bid.Ext.Dsa. Fields within this object:

{: .table .table-bordered .table-striped }
| Path | Description |
| - | - |
| `.Behalf` | A name of whose behalf the ad is displayed. |
| `.Paid` | A name of who paid for the ad. |
| `.Adrender` | Flag to indicate that buyer/advertiser will render their own DSA transparency information inside the creative. |
| `.Transparency` | The domains of the entities that applied user parameters and the parameters they applied. |

<p></p>

#### Better Analytics

The [seatnonbid](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#seat-non-bid) feature allows analytics adapters to piece together what happened in the auction when there's not a bid. This can be helpful to everyone involved: the publisher can get insight into why a bidder might not be bidding, which might lead them to update bid parameters or otherwise fix a setup problem.

To implement this enhanced analytics, bidders just need to link errors and non-bids to a specific impression id:

1. Provide impression ids that are covered by particular http request to bidder endpoint:
   When bidder creates http requests in `makeHttpRequests` method of bidder adapter class, utilize `.impIds(Set<String>)` method of `HttpRequest<T>` class. (hint, if bidder uses ortb as its main protocol it can utilize `impIds` method of `BidderUtil` class), for example:</br>

   ```java
   HttpRequest.<BidRequest>builder()
       .method(HttpMethod.POST)
       .uri(uri)
       .body(mapper.encodeToBytes(bidRequest))
       .headers(headers)
       .payload(bidRequest)
       .impIds(BidderUtil.impIds(bidRequest))
       .build();
   ```

   or more generic case:</br>

    ```java
    HttpRequest.<YourModel>builder()
        .method(HttpMethod.POST)
        .uri(uri)
        .body(mapper.encodeToBytes(bidRequest))
        .headers(headers)
        .payload(bidRequest)
        .impIds(Set.of(impId1, impId2))
        .build();
    ```

2. When bidder drops impression in `makeHttpRequests` or bid in `makeBids` methods in bidder adapter class, and emits error, it should provide ids of impressions that particular error covers. Bidder adapter can do this by utilizing `BidderError.of(String message, Type type, Set<String> impIds)` method of `BidderError` class, or by creating/using specialized methods of this class, for example:

   ```java
   BidderError.rejectedIpf(
       "Bid with id '%s' was rejected by floor enforcement: price %s is below the floor %s"
       .formatted(bid.getId(), price, floor), impId);
   ```

   (Note: list of specialized methods like this will increase as needed, but bidders can contribute by extending this list.)</br></br>or more generic case:</br>

    ```java
    BidderError.of(
        "Impression with id '%s' was dropped due to ...".formatted(impId),
        BidderError.Type.bad_input,
        Collections.sinleton(impId));
    ```

Note: If bidder provides PBS with impression id that was not present in provided `BidRequest`, PBS will just ignore it.

### Create Config Class

Go to `org.prebid.server.spring.config.bidder` and create new class `Configuration{bidder}`
with the following content

```java
package org.prebid.server.spring.config.bidder;

import org.prebid.server.bidder.BidderDeps;
import org.prebid.server.bidder.{bidder}.{bidder}Bidder;
import org.prebid.server.json.JacksonMapper;
import org.prebid.server.spring.config.bidder.model.BidderConfigurationProperties;
import org.prebid.server.spring.config.bidder.util.BidderDepsAssembler;
import org.prebid.server.spring.config.bidder.util.UsersyncerCreator;
import org.prebid.server.spring.env.YamlPropertySourceFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import javax.validation.constraints.NotBlank;

@Configuration
@PropertySource(value = "classpath:/bidder-config/{bidder}.yaml", factory = YamlPropertySourceFactory.class)
public class {bidder}Configuration {

    private static final String BIDDER_NAME = "{bidder}";
    
    @Bean("{bidder}ConfigurationProperties")
    @ConfigurationProperties("adapters.{bidder}")
    BidderConfigurationProperties configurationProperties() {
        return new BidderConfigurationProperties();
    }

    @Bean
    BidderDeps{bidder}BidderDeps(BidderConfigurationProperties {bidder}ConfigurationProperties,
                                  @NotBlank @Value("${external-url}") String externalUrl,
                                  JacksonMapper mapper) {
        
        return BidderDepsAssembler.forBidder(BIDDER_NAME)
                .withConfig({bidder}ConfigurationProperties)
                .usersyncerCreator(UsersyncerCreator.create(externalUrl))
                .bidderCreator(config -> new {bidder}Bidder(config.getEndpoint(), mapper))
                .assemble();
    }
}
```

### Currency

Prebid Server is a global product that is currency agnostic. Publishers may ask for bids in any currency. It's totally fine if your bidding endpoint only supports a single currency, but your adapter needs to deal with it. This section will describe how to do so.

Here are 3 key points to consider:

1. If your endpoint only bids in a particular currency, then your adapter must not blindly forward the openrtb to your endpoint. You should instead set $.cur to your server's required currency.
2. Your adapter must label bid responses properly with the response currency. i.e. if you only bid in USD, then your adapter must set USD as the response currency. PBS will convert to the publisher's requested currency as needed. See the [currency feature](/prebid-server/features/pbs-currency.html) for more info.
3. You should be aware that floors can be defined in any currency. If your bidding service supports floors, but only in a particular currency, then you must read use the CurrencyConversionService before sending $.imp[].bidfloor and $.imp[].bidfloorcur to your endpoint.

If you need to convert floor prices from one currency into something your endpoint expects, you can use the convertCurrency function from CurrencyConversionService component.

1. Inject CurrencyConversionService to your {bidder}Configuration class and pass it to your bidder constructor.

    ```java
    @Autowired
    private CurrencyConversionService currencyConversionService;

    ... 

    .bidderCreator(() -> new {bidder}Bidder(configProperties.getEndpoint(), currencyConversionService, mapper))
    ```

2. Create additional class variable `private final CurrencyConversionService currencyConversionService;` and update constructor in your {bidder}Bidder class to set this variable.

    ```java
    private final CurrencyConversionService currencyConversionService;
    private final String endpointUrl;
    private final JacksonMapper mapper;

    public {bidder}Bidder(String endpointUrl,  CurrencyConversionService currencyConversionService, JacksonMapper mapper) {
            this.endpointUrl = HttpUtil.validateUrl(Objects.requireNonNull(endpointUrl));
            this.currencyConversionService = Objects.requireNonNull(currencyConversionService);
            this.mapper = Objects.requireNonNull(mapper);
        }
    ```

3. Use `currencyConversionService.convertCurrency(BigDecimal price, BidRequest bidRequest, String fromCurrency, String toCurrency)` for currency converting in {bidder}Bidder class.

    <details markdown="1">
      <summary>Example: Updating bidFloor currency.</summary>

    ```java
      private Imp makeImp(Imp imp, BidRequest bidRequest) {
            return imp.toBuilder().bidfloor(resolveBidFloor(imp, bidRequest)).build();
        }

      private BigDecimal resolveBidFloor(Imp imp, BidRequest bidRequest) {
            final String bidFloorCurrency = resolveBidFloorCurrency(imp);
            final BigDecimal bidFloor = imp.getBidfloor();
            return convertBidFloorCurrency(imp, bidRequest, bidFloor, bidFloorCurrency);
        }
        
      private BigDecimal convertBidFloorCurrency(Imp imp, BidRequest bidRequest, BigDecimal bidFloor, String bidFloorCurrency) {
          try {
                return currencyConversionService.convertCurrency(bidFloor, bidRequest,
                        bidFloorCurrency, "NEEDED_CURRENCY");
          } catch (PreBidException ex) {
                throw new PreBidException(String.format("Failed to convert bidfloor with a reason: %s", ex.getMessage()));
          }
      }
    ```

    </details>
    <p></p>

### Price Floors

Prebid server manages the OpenRTB floors values (imp.bidfloor and imp.bidfloorcur) at the core level using the [Price Floors feature](/prebid-server/features/pbs-floors.html). Minimally, bid adapters are expected to read these values and pass them to the endpoint.

However, as described in the feature documentation, some adapters may benefit from access to more granular values. The primary use case is for multi-format as [detailed in the document](/prebid-server/features/pbs-floors.html#bid-adapter-floor-interface). To implement this, you may use the overloaded `getFloor()` function which can use more specific values for certain fields.

Here are the instructions:

1. Inject `PriceFloorResolver` to your {bidder}Configuration class and pass it to your bidder constructor.

    ```java
    BidderDeps {bidder}BidderDeps(BidderConfigurationProperties {bidder}ConfigurationProperties,
                                  @NotBlank @Value("${external-url}") String externalUrl,
                                  PriceFloorResolver floorResolver,
                                  JacksonMapper mapper) {

    ...

    .bidderCreator(() -> new {bidder}Bidder(configProperties.getEndpoint(), floorResolver, mapper))
    ```

2. Create an additional class variable `private final PriceFloorResolver floorResolver` and update constructor in your {bidder}Bidder class to set this variable.

    ```java
    private final PriceFloorResolver floorResolver;
    private final String endpointUrl;
    private final JacksonMapper mapper;

    public {bidder}Bidder(String endpointUrl, PriceFloorResolver floorResolver, JacksonMapper mapper) {
            this.endpointUrl = HttpUtil.validateUrl(Objects.requireNonNull(endpointUrl));
            this.floorResolver = Objects.requireNonNull(floorResolver);
            this.mapper = Objects.requireNonNull(mapper);
        }
    ```

3. Use `floorResolver.resolve(BidRequest bidRequest,
   PriceFloorRules floorRules,
   Imp imp,
   ImpMediaType mediaType,
   Format format,
   List<String> warnings)` for resolving specific floor values in your {bidder}Bidder class.

    <details markdown="1">
      <summary>Example: Updating bidFloor values.</summary>

    ```java
      private Imp makeImp(Imp imp, BidRequest bidRequest) {
            final PriceFloorResult priceFloorResult = resolvePriceFloors(
                    bidRequest, 
                    imp,                        // com.iab.openrtb.request.Imp
                    specificMediatype,          // org.prebid.server.proto.openrtb.ext.request.ImpMediaType
                    specificFormat,             // com.iab.openrtb.request.Format (size)
                    priceFloorsWarnings);
                    
            return imp.toBuilder()
                    .bidfloor(ObjectUtil.getIfNotNull(priceFloorResult, PriceFloorResult::getFloorValue))
                    .bidfloorcur(ObjectUtil.getIfNotNull(priceFloorResult, PriceFloorResult::getCurrency))
                    .build();
        }
        
      private PriceFloorResult resolvePriceFloors(BidRequest bidRequest,
                                                    Imp imp,
                                                    ImpMediaType mediaType,
                                                    Format format,
                                                    List<String> warnings) {

            return floorResolver.resolve(
                    bidRequest,
                    extractFloorRules(bidRequest),
                    imp,
                    mediaType,
                    format,
                    warnings);
        }
    ```

    </details>

4. Let the Price Floors feature know about the floors you're using. To do that, enrich BidderBid with `priceFloorInfo`

    ```java
    private static BidderBid createBidderBid(Bid bid, Imp imp, BidType bidType, String currency) {

            return BidderBid.builder()
                    .bid(bid)
                    .type(bidType)
                    .bidCurrency(currency)
                    .priceFloorInfo(imp != null ? PriceFloorInfo.of(imp.getBidfloor(), imp.getBidfloorcur()) : null)
                    .build();
        }
    ```

    <p></p>

5. Test:

## Test Your Adapter

This chapter will guide you through the creation of automated unit and integration tests to cover your bid adapter code. We use GitHub Action Workflows to ensure the code you submit passes validation. You can run the same validation locally with this command:

```bash
mvn clean package
```

This command will prepare code style checks, compile, run test and create jar file from your code

### Bidder Unit Tests

Create class `{bidder}BidderTest` in the same package as your `{bidder}Bidder` class, but in test directory. Here you should add unit tests to your bid code.
Try to create models by using following methods specified to your case in your test class

```java
private static BidRequest givenBidRequest(
            UnaryOperator<BidRequest.BidRequestBuilder> bidRequestCustomizer,
            UnaryOperator<Imp.ImpBuilder> impCustomizer) {

        return bidRequestCustomizer.apply(BidRequest.builder()
                .imp(singletonList(givenImp(impCustomizer))))
                .build();
    }

    private static BidRequest givenBidRequest(UnaryOperator<Imp.ImpBuilder> impCustomizer) {
        return givenBidRequest(identity(), impCustomizer);
    }

    private static Imp givenImp(UnaryOperator<Imp.ImpBuilder> impCustomizer) {
        return impCustomizer.apply(Imp.builder()
                .ext(mapper.valueToTree(ExtPrebid.of(null, ExtImp{bidder}.of(param, secondParam)))))
                .build();
    }

    private static BidResponse givenBidResponse(UnaryOperator<Bid.BidBuilder> bidCustomizer) {
        return BidResponse.builder()
                .seatbid(singletonList(SeatBid.builder().bid(singletonList(bidCustomizer.apply(Bid.builder()).build()))
                        .build()))
                .build();
    }

    private static HttpCall<BidRequest> givenHttpCall(BidRequest bidRequest, String body) {
        return HttpCall.success(
                HttpRequest.<BidRequest>builder().payload(bidRequest).build(),
                HttpResponse.of(200, null, body),
                null);
    }
```

### Bidder Integration Tests
Go to `test-application.properties` file and add folowing properties

```yaml
adapters.{bidder}.enabled=true
adapters.{bidder}.endpoint=http://localhost:8090/{bidder}-exchange
adapters.{bidder}.usersync.url=//{bidder}-usersync
```

Go to test resources `org.prebid.server.it.openrtb2` and create directory with `{bidder}` name.
Add files with content specific to your case:

1. `test-auction-{bidder}-request.json`

    ```json
    {
      "id": "tid",
      "imp": [
        {
          "id": "impId001",
          "banner": {
            "format": [
              {
                "w": 300,
                "h": 250
              }
            ]
          },
          "ext": {
            "{bidder}": {
              "param": "paramValue"
            }
          }
        }
      ],
      "device": {
        "pxratio": 4.2,
        "dnt": 2,
        "language": "en",
        "ifa": "ifaId"
      },
      "site": {
        "publisher": {
          "id": "publisherId"
        }
      },
      "at": 1,
      "tmax": 5000,
      "cur": [
        "USD"
      ],
      "source": {
        "fd": 1,
        "tid": "tid"
      },
      "ext": {
        "prebid": {
          "targeting": {
            "pricegranularity": {
              "precision": 2,
              "ranges": [
                {
                  "max": 20,
                  "increment": 0.1
                }
              ]
            }
          },
          "cache": {
            "bids": {}
          },
          "auctiontimestamp": 1000
        }
      },
      "regs": {
        "ext": {
          "gdpr": 0
        }
      }
    }
    ```

2. `test-auction-{bidder}-response.json`

    ```json
    {
      "id": "tid",
      "seatbid": [
        {
          "bid": [
            {
              "id": "bid001",
              "impid": "impId001",
              "price": 3.33,
              "adm": "adm001",
              "adid": "adid001",
              "cid": "cid001",
              "crid": "crid001",
              "w": 300,
              "h": 250,
              "ext": {
                "prebid": {
                  "type": "banner",
                  "targeting": {
                    "hb_pb": "3.30",
                    "hb_size_{bidder}": "300x250",
                    "hb_bidder_{bidder}": "{bidder}",
                    "hb_cache_path": "{{ cache.path }}",
                    "hb_size": "300x250",
                    "hb_cache_host_{bidder}": "{{ cache.host }}",
                    "hb_cache_path_{bidder}": "{{ cache.path }}",
                    "hb_cache_id_{bidder}": "f0ab9105-cb21-4e59-b433-70f5ad6671cb",
                    "hb_bidder": "{bidder}",
                    "hb_cache_id": "f0ab9105-cb21-4e59-b433-70f5ad6671cb",
                    "hb_pb_{bidder}": "3.30",
                    "hb_cache_host": "{{ cache.host }}"
                  },
                  "cache": {
                    "bids": {
                      "url": "{{ cache.resource_url }}f0ab9105-cb21-4e59-b433-70f5ad6671cb",
                      "cacheId": "f0ab9105-cb21-4e59-b433-70f5ad6671cb"
                    }
                  }
                }
              }
            }
          ],
          "seat": "{bidder}",
          "group": 0
        }
      ],
      "cur": "USD",
      "ext": {
        "responsetimemillis": {
          "{bidder}": " {bidder}.response_time_ms }}",
          "cache": "{{ cache.response_time_ms }}"
        },
        "prebid": {
          "auctiontimestamp": 1000
        },
        "tmaxrequest": 5000
      }
    }
    ```

3. `test-{bidder}-bid-request.json`

    ```json
    {
      "id": "tid",
      "imp": [
        {
          "id": "impId001",
          "banner": {
            "format": [
              {
                "w": 300,
                "h": 250
              }
            ]
          },
          "ext": {
            "bidder": {
              "param": "paramValue"
            }
          }
        }
      ],
      "site": {
        "domain": "example.com",
        "page": "http://www.example.com",
        "publisher": {
          "id": "publisherId"
        },
        "ext": {
          "amp": 0
        }
      },
      "device": {
        "ua": "userAgent",
        "dnt": 2,
        "ip": "193.168.244.1",
        "pxratio": 4.2,
        "language": "en",
        "ifa": "ifaId"
      },
      "user": {
        "buyeruid" : "BTW-UID"
      },
      "at": 1,
      "tmax": 5000,
      "cur": [
        "USD"
      ],
      "source": {
        "fd": 1,
        "tid": "tid"
      },
      "regs": {
        "ext": {
          "gdpr": 0
        }
      },
      "ext": {
        "prebid": {
          "targeting": {
            "pricegranularity": {
              "precision": 2,
              "ranges": [
                {
                  "max": 20,
                  "increment": 0.1
                }
              ]
            },
            "includewinners": true,
            "includebidderkeys": true
          },
          "cache": {
            "bids": {}
          },
          "auctiontimestamp": 1000,
          "channel" : {
            "name" : "web"
          }
        }
      }
    }
    ```

4. `test-{bidder}-bid-response.json`

    ```json
    {
      "id": "tid",
      "seatbid": [
        {
          "bid": [
            {
              "id": "bid001",
              "impid": "impId001",
              "price": 3.33,
              "adid": "adid001",
              "crid": "crid001",
              "cid": "cid001",
              "adm": "adm001",
              "h": 250,
              "w": 300
            }
          ]
        }
      ]
    }
    ```

5. `test-cache-{bidder}-request.json`

    ```json
    {
      "puts": [
        {
          "type": "json",
          "value": {
            "id": "bid001",
            "impid": "impId001",
            "price": 3.33,
            "adm": "adm001",
            "adid": "adid001",
            "cid": "cid001",
            "crid": "crid001",
            "w": 300,
            "h": 250
          }
        }
      ]
    }
    ```

6. `test-cache-{bidder}-response.json`

    ```json
    {
      "responses": [
        {
          "uuid": "f0ab9105-cb21-4e59-b433-70f5ad6671cb"
        }
      ]
    }
    ```

Create class `{bidder}Test`in test directory in package `org.prebid.server.it`. Extend `IntegrationTest` class with following content

```java
package org.prebid.server.it;

import io.restassured.response.Response;
import org.json.JSONException;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.equalTo;
import static com.github.tomakehurst.wiremock.client.WireMock.equalToJson;
import static com.github.tomakehurst.wiremock.client.WireMock.post;
import static com.github.tomakehurst.wiremock.client.WireMock.urlPathEqualTo;
import static java.util.Collections.singletonList;

@RunWith(SpringRunner.class)
public class {bidder}Test extends IntegrationTest {

    @Test
    public void openrtb2AuctionShouldRespondWithBidsFrom{bidder}() throws IOException, JSONException {
        // given
        WIRE_MOCK_RULE.stubFor(post(urlPathEqualTo("/{bidder}-exchange"))
                .withRequestBody(equalToJson(jsonFrom("openrtb2/{bidder}/test-{bidder}-bid-request.json")))
                .willReturn(aResponse().withBody(jsonFrom("openrtb2/{bidder}/test-{bidder}-bid-response.json"))));

        // pre-bid cache
        WIRE_MOCK_RULE.stubFor(post(urlPathEqualTo("/cache"))
                .withRequestBody(equalToJson(jsonFrom("openrtb2/{bidder}/test-cache-{bidder}-request.json")))
                .willReturn(aResponse().withBody(jsonFrom("openrtb2/{bidder}/test-cache-{bidder}-response.json"))));

        // when
        final Response response = responseFor("openrtb2/{bidder}/test-auction-{bidder}-request.json",
                Endpoint.OPENRTB2_AUCTION);

        // then
        assertJsonEquals("openrtb2/{bidder}/test-auction-{bidder}-response.json", response, singletonList("{bidder}"));
    }
}
```

Uids for cookie you can create using [this link](https://www.base64encode.org/)

### Manual Tests

[Configure](https://github.com/prebid/prebid-server-java/blob/master/docs/config.md), [build](https://github.com/prebid/prebid-server-java/blob/master/docs/build.md) and [start](https://github.com/prebid/prebid-server-java/blob/master/docs/run.md) your server.

Then `POST` an OpenRTB Request to `http://localhost:8000/openrtb2/auction`.

If at least one `request.imp[i].ext.{bidder}` is defined in your Request, then your bidder should be called.

To test user syncs, [call /setuid](/prebid-server/endpoints/pbs-endpoint-setuid.html) using the FamilyName of your Bidder.
The next time you use `/openrtb2/auction`, the OpenRTB request sent to your Bidder should have
`BidRequest.User.BuyerUID` with the value you saved.

## User Documentation

Human readable documentation for bid adapters is required in the separate [prebid.github.io](https://github.com/prebid/prebid.github.io) repository. We will not merge your bid adapter until you've at least opened a documentation PR and comment with a link to it.

1. If you already have a Prebid.js bid adapter, update your existing bidder file in [github.com/prebid/prebid.github.io/tree/master/dev-docs/bidders](https://github.com/prebid/prebid.github.io/tree/master/dev-docs/bidders) to add the `pbs: true` variable in the header section. If your Prebid Server bidding parameters are different from your Prebid.js parameters, please include the differences in this document for publishers to be aware.
1. If you don't have a Prebid.js bid adapter, create a new file in [github.com/prebid/prebid.github.io/tree/master/dev-docs/bidders](https://github.com/prebid/prebid.github.io/tree/master/dev-docs/bidders) using this template:

```markdown
---
layout: bidder
title: {bidder}
description: Prebid {Bidder} Bidder Adapter
biddercode: {bidder}
tcfeu_supported: true/false
gvl_id: 111
usp_supported: true/false
coppa_supported: true/false
gpp_sids: tcfeu, tcfca, usnat, usstate_all, usp
schain_supported: true/false
dchain_supported: true/false
userId: <list of supported vendors>
media_types: banner, video, audio, native
safeframes_ok: true/false
deals_supported: true/false
floors_supported: true/false
fpd_supported: true/false
pbjs: true/false
pbs: true/false
pbs_app_supported: true/false
prebid_member: true/false
multiformat_supported: will-bid-on-any, will-bid-on-one, will-not-bid
ortb_blocking_supported: true/partial/false
privacy_sandbox: no or comma separated list of `paapi`, `topics`
---

### Registration

The Example Bidding adapter requires setup before beginning. Please contact us at setup@example.com

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description  | Example   | Type     |
|---------------|----------|--------------|-----------|----------|
| `placementId` | required | Placement ID | `'11111'` | `string` |
```

Notes on the metadata fields:

- Add `pbs: true`. If you also have a [Prebid.js bid adapter](/dev-docs/bidder-adaptor.html), add `pbjs: true`. Default is false for both.
- If you're on the IAB's Global Vendor List, place your ID in `gvl_id`. No default.
- If you support the IAB's TCF-EU consent string format and have a GVL ID, you may add `tcfeu_supported: true`. Default is false.
- If you support the IAB's US Privacy consent string format, add `usp_supported: true`. Default is false.
- If you support one or more userId modules, add `userId: (list of supported vendors)`. Default is none.
- If you support video, native, or audio mediaTypes add `media_types: video, native, audio`. Note that display is added by default. If you don't support display, add "no-display" as the first entry, e.g. `media_types: no-display, native`. No defaults.
- If you support the COPPA flag, add `coppa_supported: true`. Default is false.
- If you support the IAB's GPP consent string, add `gpp_supported: true`. Default is false.
- If you support the [supply chain](/dev-docs/modules/schain.html) feature, add `schain_supported: true`. Default is false.
- If you support adding a demand chain on the bid response, add `dchain_supported: true`. Default is false.
- If your bidder doesn't work well with safeframed creatives, add `safeframes_ok: false`. This will alert publishers to not use safeframed creatives when creating the ad server entries for your bidder. No default.
- If your bidder supports mobile apps, set `pbs_app_supported`: true. No default value.
- If your bidder supports deals, set `deals_supported: true`. No default value.
- If your bidder supports floors, set `floors_supported: true`. No default value.
- If you support first party data, you must document what exactly is supported and then you may set `fpd_supported: true`. No default value.
- If you support any OpenRTB blocking parameters, you must document what exactly is supported and then you may set `ortb_blocking_supported` to ‘true’,’partial’, or ‘false’. No default value. In order to set ‘true’, you must support: bcat, badv, battr, and bapp.
- Let publishers know how you support multiformat requests -- those with more than one mediatype (e.g. both banner and video). Here are the options: will-bid-on-any, will-bid-on-one, will-not-bid
- If you're a member of Prebid.org, add `prebid_member: true`. Default is false.

## File Checklist

- Bidder Configs
  - `resources/bidder-config/{bidder}.yaml`
  - `resources/org/prebid/server/it/test-application.properties` (test directory)
- Bidder Parameters
  - `resources/static/bidder-params/{bidder}.json`
  - `org/prebid/server/proto/openrtb/ext/request/{bidder}/ExtImp{bidder}.java`
- Adapter Code
  - `org/prebid/server/bidder/{bidder}/{bidder}Bidder.java`
  - `org/prebid/server/bidder/{bidder}/{bidder}BidderTest.java` (test directory)
- Integration test files
  - `org/prebid/server/it/{bidder}Test.java` (test directory)
  - `resources/org/prebid/server/it/openrtb2/{bidder}/test-auction-{bidder}-request.json` (test directory)
  - `resources/org/prebid/server/it/openrtb2/{bidder}/test-auction-{bidder}-response.json` (test directory)
  - `resources/org/prebid/server/it/openrtb2/{bidder}/test-{bidder}-bid-request.json` (test directory)
  - `resources/org/prebid/server/it/openrtb2/{bidder}/test-{bidder}-bid-response.json` (test directory)
  - `resources/org/prebid/server/it/openrtb2/{bidder}/test-cache-{bidder}-request.json` (test directory)
  - `resources/org/prebid/server/it/openrtb2/{bidder}/test-cache-{bidder}-response.json` (test directory)
- Register With The Core
  - `org/prebid/server/spring/config/bidder/{bidder}Configuration.java`

## Contribute

Whew! You're almost done. Thank you for taking the time to develop a Prebid Server bid adapter. When you're ready, [contribute](https://github.com/prebid/prebid-server-java/blob/master/docs/developers/contributing.md) your new bid adapter by opening a PR to the [PBS-Java GitHub repository](https://github.com/prebid/prebid-server-java) with the name "New Adapter: {Bidder}".

{: .alert.alert-warning :}
You don't need to ask permission or open a GitHub issue before submitting an adapter.
