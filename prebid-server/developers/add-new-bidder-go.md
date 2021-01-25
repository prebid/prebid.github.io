---
layout: page_v2
sidebarType: 5
title: Prebid Server | Developers | Building a Bid Adapter (Go)

---

# Prebid Server - New Bid Adapter (Go)
{: .no_toc}

Thank you for contributing a bid adapter to the open source Prebid Server project. Each new adapter gives publishers more options for monetizing their inventory and strengthens the header bidding community.

This document guides you through the process of developing a new bid adapter for your bidding server. We encourage you to look at [existing bid adapters](https://github.com/prebid/prebid-server/tree/master/adapters) for working examples and practical guidance. You can also ask us questions by [submitting a GitHub issue](https://github.com/prebid/prebid-server/issues/new).

{: .alert.alert-info :}
**NOTE:** There are two implementations of Prebid Server, [PBS-Go](https://github.com/prebid/prebid-server) and [PBS-Java](https://github.com/prebid/prebid-server-java). We recommend you build new adapters for PBS-Go and allow us to port it to PBS-Java within a couple of months. If you'd like to build both yourself, please also follow these [instructions for building an adapter in PBS-Java](/prebid-server/developers/add-new-bidder-java.html).


* TOC
{:toc }

## Overview

Bid adapters are responsible for translating an [OpenRTB 2.5 Bid Request](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf#page=13) to your bidding server's protocol and mapping your server's response to an [OpenRTB 2.5 Bid Response](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf#page=32).

An OpenRTB 2.5 Bid Request contains one or more Impressions, each representing a single ad placement. An Impression may define multiple sizes and/or multiple ad formats. If your bidding server limits requests to a single ad placement, size, or format, then your adapter will need to split the Impression into multiple calls and merge the responses.

## Plan Your Bid Adapter

### Choose A Name

You will need to choose a unique name for your bid adapter. Names should be written in lower case and may not contain special characters or emoji. If you already have a Prebid.js bid adapter, we encourage you to use the same name with the same bidder parameters. You may not name your adapter `all`, `context`, `general`, `prebid`, or `skadn` as those have special meaning in various contexts. Existing bid adapter names are [maintained here](https://github.com/prebid/prebid-server/blob/master/openrtb_ext/bidders.go#L37).

We ask that the first 6 letters of the name you choose be unique among the existing bid adapters. This consideration helps with generating targeting keys for use by some ad exchanges, such as Google Ad Manager. There's no need to manually check, as this constraint is enforced by the [`TestBidderUniquenessGatekeeping`](https://github.com/prebid/prebid-server/blob/master/openrtb_ext/bidders_test.go#L61) test. 

Throughout the rest of this document, substitute `{bidder}` with the name you've chosen.

### Respect The Rules

We are proud to run the Prebid Server project as a transparent and trustworthy header bidding solution. You are expected to follow our community's [code of conduct](https://docs.prebid.org/wrapper_code_of_conduct.html) and [module rules](https://docs.prebid.org/dev-docs/module-rules.html) when creating your adapter and when interacting with others through issues, code reviews, and discussions.

**Please take the time to read our rules in full.** Below is a summary of some of the rules which apply to your Prebid Server bid adapter:
  - Adapters must not modify bids from demand partners, except to either change the bid from gross to net or from one currency to another.
  - Adapters must use the functions provided by the core framework for all external communication. Initiation of any form of network connection outside of what is provided by the core framework is strictly prohibited. No exceptions will be made for this rule.
  - Adapters must support the creation of multiple concurrent instances. This means adapters may not mutate global or package scoped variables.
  - Bidding server endpoints should prefer secure HTTPS to protect user privacy and should allow keep alive connections (preferably with HTTP/2 support) to increase host performance.
  - Adapters must include maintainer information with a group email address for Prebid.org to contact for ongoing support and maintenance.
  - Adapters must annotate the bid response with the proper media type, ideally based on the response from the bidding server.

{: .alert.alert-warning :}
Failure to follow the rules will lead to delays in approving your adapter for inclusion in Prebid Server. If you'd like to discuss an exception to a rule, please make your request by [submitting a GitHub issue](https://github.com/prebid/prebid-server/issues/new).

### Ongoing Support and Maintenance

You are expected to provide support and maintenance for the code you contribute to Prebid Server as part of your bid adapter. We ask that you proactively update your adapter when your bidding server introduces new features or breaking changes.

Occasionally, we'll introduce changes to the core framework as part of our ongoing maintenance and enhancement of the project. If this causes a compilation error or a performance impact to your adapter, we will update the affected portion of your bid adapter code and provide full unit test coverage of our changes. We will notify you via email if this happens and give you at least one week to review the PR and provide comments. Please understand that we will not wait for your explicit approval for these kinds of changes unless you respond to our email or comment on the PR.

Please be attentive in reading and responding to emails and [GitHub issues](https://github.com/prebid/prebid-server/issues) from publishers, hosts, and Prebid.org project maintainers. If we receive complaints about your bid adapter and you do not respond to our communications, we may disable your adapter by default or remove it from the project entirely.

## Create Your Adapter

Prebid Server bid adapters consist of several components: bidder info, bidder parameters, adapter code, user sync code, registration with the core framework, and default configuration values. This chapter will guide you though each component.

Please refer to [existing bid adapters](https://github.com/prebid/prebid-server/tree/master/adapters) for working examples and practical guidance, but understand that our adapter interfaces and coding style evolve over time. Please prefer the examples in this document over differences you may find in  code.

Our project is written in the [Go programming language](https://golang.org/). We understand not everyone has prior experience writing Go code. Please try your best and we'll respectfully steer you in the right direction during the review process.

{: .alert.alert-info :}
Please do not ignore errors from method calls made in your bid adapter code. Even if it's seemingly impossible for an error to occur, such as from `json.Marshal`, it's still possible under the high throughput multi-threaded nature of Prebid Server.

### Bidder Info

Let's begin with your adapter's bidder information YAML file. This file is required and contains your maintainer email address, specifies the ad formats your adapter will accept, and allows you to opt-in to video impression tracking.

Create a file with the path `static/bidder-info/{bidder}.yaml` and begin with the following template:

```yaml
maintainer:
  email: prebid-maintainer@example.com
modifyingVastXmlAllowed: false
capabilities:
  app:
    mediaTypes:
      - banner
      - video
      - audio
      - native
  site:
    mediaTypes:
      - banner
      - video
      - audio
      - native
```

Modify this template for your bid adapter:
- Change the maintainer email address to a group distribution list on your ad server's domain. A distribution list is preferred over an individual mailbox to allow for robustness, as roles and team members naturally change.
- Change the `modifyingVastXmlAllowed` value to `true` if you'd like to opt-in for [video impression tracking](https://github.com/prebid/prebid-server/issues/1015), or remove this line entirely if your adapter doesn't support VAST video ads.
- Remove the `capabilities` (app/site) and `mediaTypes` (banner/video/audio/native) combinations which your adapter does not support.

<details markdown="1">
  <summary>Example: Website with banner ads only.</summary>

```yaml
maintainer:
  email: foo@foo.com
capabilities:
  site:
    mediaTypes:
      - banner
```
</details>

<details markdown="1">
  <summary>Example: Website or app with banner or video ads and video impression tracking.</summary>

```yaml
maintainer:
  email: foo@foo.com
modifyingVastXmlAllowed: true
capabilities:
  app:
    mediaTypes:
      - banner
      - video
  site:
    mediaTypes:
      - banner
      - video
```
</details>
<p></p>

### Bidder Parameters

Your bid adapter might require extra information from the publisher to form a request to your bidding server. The bidder parameters JSON Schema codifies this information to allow Prebid Server to verify requests and to provide an API for third party configuration systems.

Publishers will provide extra information using an OpenRTB 2.5 Bid Request Extension, preferably at `request.imp[].ext.prebid.bidder.{bidder}` but also supported at `request.imp[].ext.{bidder}`. Prebid Server will validate the publisher information based on your schema and relocate the data to `request.imp[].ext.bidder`, regardless of your bidder name or the publisher's chosen location.

We request that you do not duplicate information that is already present in the [OpenRTB 2.5 Bid Request specification](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf#page=13) or is already part of an established Prebid convention. For example, your bidder parameters should not include first party data, bid floors, schain, video parameters, referrer information, or privacy consent including COPPA, CCPA, and GDPR TCF. For video parameters in particular, you must prefer the OpenRTB 2.5 Bid Request standard of `request.imp[].video`.

{: .alert.alert-warning :}
**ENDPOINT NOTE:** You may not use an endpoint domain as a bidder parameter. Prebid Server is not an open proxy. If absolutely necessary, you may specify a portion of the domain as a parameter to support geo regions or account specific servers. However, this is discouraged and may degrade the performance of your adapter since the server needs to maintain more outgoing connections. Host companies may choose to disable your adapter if it uses a dynamically configured domain.

Create a file with the path `static/bidder-params/{bidder}.json` using [JSON Schema](https://spacetelescope.github.io/understanding-json-schema/) to define your bidder parameters. Prebid Server requires this file for every adapter, even if yours doesn't require bidder parameters (see the 'no parameters' example at the end of this section).

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

In addition to the examples listed below, please refer to [existing bidder parameter files](https://github.com/prebid/prebid-server/tree/master/static/bidder-params) for guidance.

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

If you've defined bidder parameters for your adapter, you also need to represent your bidder parameters in code. The core framework uses the JSON Schema file for validation, but your adapter code needs a data structure to support JSON unmarshalling / deserialization. These data structures are organized in a shared path using a standard naming convention, which also serves as documentation of all adapter parameters.

Create a file with the path `openrtb_ext/imp_{bidder}.go` containing an exported (must start with an upper case letter) data structure named `ImpExt{Bidder}`. All required and optional bidder parameters from the JSON Schema should be represented as fields.

For example, this is what the bidder parameter code looks like for the example we used in the previous section:

```go
package openrtb_ext

type ImpExtFoo struct {
  PlacementID string `json:"placementId"`
}
```

Please follow [Go's standard naming convention](https://golang.org/doc/effective_go.html) for the field names (particularly for acronyms) and use `` `json:...` `` attributes to specify the JSON name, matching exactly what you defined in the bidder parameters JSON Schema. Please keep in mind that JSON is case sensitive.

### Adapter Code

Now it's time to write the bulk of your bid adapter code.

Each adapter has its own directory (a 'package' in Go parlance) for all code and tests associated with translating an OpenRTB 2.5 Bid Request to your bidding server's protocol and mapping your server's response to an OpenRTB 2.5 Bid Response. The use of separate packages provide each adapter with its own naming scope to avoid conflicts and gives the freedom to organize files as you best see fit (although we make suggestions in this guide).

Create a file with the path `adapters/{bidder}/{bidder}.go`. Your bid adapter code will need to implement and export:
- The `adapters.Builder` method to create a new instance of the adapter based on the host configuration.
- The `adapters.Bidder` interface consisting of the `MakeRequests` method to create outgoing requests to your bidding server and the `MakeBids` method to create bid responses.

{: .alert.alert-info :}
**ACCESS MODIFIERS:** Go has only two kinds of access modifiers, exported and private, which are scoped at the package level. The access modifier is encoded into the name of the type or method. Names starting with an upper case letter are exported whereas names starting with a lower case letter are private. Please only export the three required methods and keep everything else private.

Here is a reference implementation for a bidding server which uses the OpenRTB 2.5 protocol:

```go
package foo

import (
  "encoding/json"
  "fmt"
  "net/http"

  "github.com/mxmCherry/openrtb"
  "github.com/prebid/prebid-server/adapters"
  "github.com/prebid/prebid-server/config"
  "github.com/prebid/prebid-server/errortypes"
  "github.com/prebid/prebid-server/openrtb_ext"
)

type adapter struct {
  endpoint string
}

// Builder builds a new instance of the Foo adapter for the given bidder with the given config.
func Builder(bidderName openrtb_ext.BidderName, config config.Adapter) (adapters.Bidder, error) {
  bidder := &adapter{
    endpoint: config.Endpoint,
  }
  return bidder, nil
}

func (a *adapter) MakeRequests(request *openrtb.BidRequest, requestInfo *adapters.ExtraRequestInfo) ([]*adapters.RequestData, []error) {
  requestJSON, err := json.Marshal(request)
  if err != nil {
    return nil, []error{err}
  }

  requestData := &adapters.RequestData{
    Method:  "POST",
    Uri:     a.endpoint,
    Body:    requestJSON,
  }
  
  return []*adapters.RequestData{requestData}, nil
}

func (a *adapter) MakeBids(request *openrtb.BidRequest, requestData *adapters.RequestData, responseData *adapters.ResponseData) (*adapters.BidderResponse, []error) {
  if responseData.StatusCode == http.StatusNoContent {
    return nil, nil
  }
  
  if responseData.StatusCode == http.StatusBadRequest {
    err := &errortypes.BadInput{
      Message: "Unexpected status code: 400. Bad request from publisher. Run with request.debug = 1 for more info.",
    }
    return nil, []error{err}
  }

  if responseData.StatusCode != http.StatusOK {
    err := &errortypes.BadServerResponse{
      Message: fmt.Sprintf("Unexpected status code: %d. Run with request.debug = 1 for more info.", responseData.StatusCode),
    }
    return nil, []error{err}
  }

  var response openrtb.BidResponse
  if err := json.Unmarshal(responseData.Body, &response); err != nil {
    return nil, []error{err}
  }
  
  bidResponse := adapters.NewBidderResponseWithBidsCapacity(len(request.Imp))
  bidResponse.Currency = response.Cur
  for _, seatBid := range response.SeatBid {
    for _, bid := range seatBid.Bid {
      b := &adapters.TypedBid{
        Bid:     &bid,
        BidType: getMediaTypeForBid(bid),
      }
      bidResponse.Bids = append(bidResponse.Bids, b)
  }
  return bidResponse, nil
}
```

#### Builder

The `Builder` method is responsible for validating the adapter configuration, performing any necessary pre-processing steps (such as macro parsing), and storing the configuration values in a new instance of the `adapter` struct.

This method may be called multiple times if the host has configured aliases of your adapter. On the other hand, it will never be called if your bid adapter is disabled by the host. Please be aware the same instance of the adapter will be used to process all bid requests for each bidder or alias. To ensure thread safety, all runtime state must be stored in the `adapter` instance and the adapter may not mutate any global or package scoped variables.

The first argument, `bidderName`, is the name of the bidder being built. This may be the bidder name you've chosen or it may be an alias. Most adapters don't make use of the `bidderName`, but its provided by the core framework for situations where the adapter might need to do something special for aliases.

The second argument, `config`, is all the configuration values set for your adapter. However, not all of this information is intended for use by the `Builder` method. The only two fields relevant here are `config.Endpoint` and `config.ExtraAdapterInfo`:
- `config.Endpoint` is the base url of your bidding server and may be interpreted as either a literal address or as a templated macro to support dynamic domains or dynamic paths.
- `config.ExtraAdapterInfo` may be used for any other values your adapter may need, such as an application token or publisher allow/deny list. You may interpret this string however you like, although JSON is a common choice.

The `Builder` method is expected to return an error if either the `config.Endpoint` or the `config.ExtraAdapterInfo` values are invalid or cannot be parsed. Errors will be surfaced to the host during application startup as a fatal error. 

<details markdown="1">
  <summary>Example: Builder using endpoint macros.</summary>

```go
type adapter struct {
  endpointTemplate template.Template
}

// Builder builds a new instance of the Foo adapter for the given bidder with the given config.
func Builder(bidderName openrtb_ext.BidderName, config config.Adapter) (adapters.Bidder, error) {
  template, err := template.New("endpointTemplate").Parse(config.Endpoint)
  if err != nil {
    return nil, fmt.Errorf("unable to parse endpoint url template: %v", err)
  }
  
  bidder := &adapter{
    endpointTemplate: *template,
  }
  return bidder, nil
}
```
</details>

<details markdown="1">
  <summary>Example: Builder using extra adapter info.</summary>

```go
type extraInfo struct {
  token string
}

// Builder builds a new instance of the Foo adapter for the given bidder with the given config.
func Builder(bidderName openrtb_ext.BidderName, config config.Adapter) (adapters.Bidder, error) {
  info, err := parseExtraInfo(config.ExtraAdapterInfo)
  if err != nil {
    return nil, err
  }
  
  bidder := &adapter{
    endpoint: config.Endpoint,
    token:    info.token,
  }
  return bidder, nil
}

func parseExtraInfo(v string) (extraInfo, error) {
  if len(v) == 0 {
    return buildDefaultExtraInfo(), nil
  }

  var info extraInfo
  if err := json.Unmarshal([]byte(v), &info); err != nil {
    return nil, fmt.Errorf("invalid extra info: %v", err)
  }

  return info, nil
}

func buildDefaultExtraInfo() extraInfo {
  return extraInfo{
    token: "all your base are belong to us",
  }
}
```
</details>
<p></p>

#### MakeRequests

The `MakeRequests` method is responsible for returning none, one, or many HTTP requests to be sent to your bidding server. Bid adapters are forbidden from directly initiating any form of network communication and must entirely rely upon the core framework. This allows the core framework to optimize outgoing connections using a managed pool and record networking metrics. The return type `adapters.RequestData` allows your adapter to specify the HTTP method, url, body, and headers.

This method is called once by the core framework for bid requests which have at least one valid Impression for your adapter. Impressions not configured for your adapter will be removed and are not accessible. 

The first argument, `request`, is the OpenRTB 2.5 Bid Request object. Extension information is stored as `json.RawMessage` byte arrays and must be unmarshalled and/or marshalled to be read and/or mutated. It is *critical* to understand that the `request` object contains pointers to shared memory. If your adapter needs to alter any data referenced by a pointer then you *must* first make a shallow copy. The only exception is for `request.Imp` and its elements, as these are already shallow copies. The exact same instance of the `request` object is also passed to the `MakeBids` method, so please be careful when mutating. It's safe to assume that `request.Imp[]` always contains at least one element and that the `request.Imp[].ext.bidder` was successfully validated by your bidder parameter JSON Schema.

<details markdown="1">
  <summary>Example: Mutating banner shared memory (make a copy).</summary>

```go
// Populate the top level width and height of a banner request if it's not set by the publisher.

if request.Imp[i].W == nil && request.Imp[i].H == nil && len(request.Imp[i].Format) > 0 {
  bannerCopy := *request.Imp[i].Banner
  bannerCopy.W = &(request.Imp[i].Banner.Format[0].W)
  bannerCopy.H = &(request.Imp[i].Banner.Format[0].H)
  request.Imp[i].Banner = &bannerCopy
}
```
</details>
<p></p>

The second argument, `requestInfo`, is for extra information and helper methods provided by the core framework. For now, this just includes `requestInfo.PbsEntryPoint` which is commonly used to determine if the request is for AMP or Long Form Video Ad Pods. This object will be expanded in the future to also include currency conversion and extension unmarshalling helper methods.

The `MakeRequests` method is expected to return a slice (similar to a C# `List` or a Java `ArrayList`) of `adapters.RequestData` objects representing the HTTP calls to be sent to your bidding server and a slice of type `error` for any issues encountered creating them. If there are no HTTP calls or if there are no errors, please return `nil` for both return values. Neither slices may contain `nil` elements.

{: .alert.alert-info :}
HTTP calls to your bidding server will automatically prefer GZIP compression. You should not specify it yourself using headers. You don't have to worry about decompressing the response in `MakeBids` either, as that will be taken care of automatically.

An Impression may define multiple sizes and/or multiple ad formats. If your bidding server limits requests to a single ad placement, size, or format, then your adapter will need to split the Impression into multiple calls and merge the responses.

<details markdown="1">
  <summary>Example: Impression splitting.</summary>

```go
func (a *adapter) MakeRequests(request *openrtb.BidRequest, requestInfo *adapters.ExtraRequestInfo) (*adapters.RequestData, []error) {
  var requests []*adapters.RequestData
  var errors []error
  
  requestCopy := *request
  for _, imp := range request.Imp {
    requestCopy.Imp = []openrtb.Imp{imp}

    requestJSON, err := json.Marshal(request)
    if err != nil {
      errors = append(errors, err)
      continue
    }
  
    requestData := &adapters.RequestData{
      Method: "POST",
      Uri:    a.endpoint,
      Body:   requestJSON,
    }
    requests = append(requests, requestData)
  }
  return requests, errors
}
```
</details>
<p></p>

If your bidding server supports multiple currencies, please be sure to pass through the `request.cur` field. If your bidding server only bids in a single currency, such as USD or EUR, that's fine. Prebid Server will convert your bid to the request currency if you include it in the bid response, otherwise we assume USD and conversion will not occur.

Please ensure you forward the bid floor (`request.imp[].bidfloor`) and bid floor currency (`request.imp[].bidfloorcur`) values to your bidding server for enforcement. You'll soon have access to currency conversion helper methods if your endpoint only supports floors in a single currency.

There are a several values of a bid that publishers expect to be populated. Some are defined by the OpenRTB 2.5 specification and some are defined by Prebid conventions.

{: .table .table-bordered .table-striped }
| Parameter | Definer | Path & Description
| - | - | - | -
| CCPA | OpenRTB | `request.regs.ext.us_privacy` <br/> The publisher is specifying the California Consumer Privacy Act consent string.
| COPPA | OpenRTB | `request.regs.ext.us_privacy`<br/> The publisher is specifying the Children's Online Privacy Protection flag.
| Currency | OpenRTB |`request.cur` <br/> The publisher is specifying the desired bid currency. The Prebid Server default is USD.
| [Debug](https://github.com/prebid/prebid-server/issues/745) | Prebid | `request.ext.prebid.debug` <br/> The publisher is requesting verbose debugging information from Prebid Server.
| [First Party Data (FPD)](https://docs.prebid.org/prebid-server/features/pbs-fpd.html)| Prebid | `request.imp[].ext.context.data.*`, `request.app.ext.data.*`, `request.site.ext.data.*`, `request.user.ext.data.*` <br/> The publisher may provide first party data (e.g. keywords).
| GDPR | OpenRTB |  `request.regs.ext.gdpr`, `request.user.ext.consent` <br/> The publisher is specifying the European General Data Protection Regulation flag and TCF consent string.
| Site or App | OpenRTB | `request.site`, `request.app` <br/> The publisher will provide either the site or app, but not both, representing the client's device. 
| Supply Chain | OpenRTB | `request.source.ext.schain` <br/> The publisher's declaration of all parties who are selling or reselling the bid request.
| Test | OpenRTB | `request.test` <br/> The publisher is sending non-production traffic which also enables verbose debugging information from Prebid Server.
| Video | OpenRTB | `request.imp[].video` <br/> The publisher is specifying video ad requirements or preferences.

{: .alert.alert-warning :}
For simplicity, adapters are expected to make net-price bids (e.g. "If this ad wins, what will the publisher make?"), not gross-price bids. Publishers can correct for gross-price bids by setting [Bid Adjustments](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#bid-adjustments) to account for fees.

#### Response

The `MakeBids` method is responsible for parsing the bidding server's response and mapping it to the [OpenRTB 2.5 Bid Response object model](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf#page=32).

This method is called for each response received from your bidding server within the bidding window (`request.tmax`). If there are no requests or if all requests time out, the `MakeBids` method will not be called.

{: .alert.alert-info :}
It's *imperative* to include all required information in the response for your bid to be accepted. Please avoid common mistakes, such as not specifying the bid currency and not properly detecting the media type from the bidding server response.

The first argument, `request`, is the exact same OpenRTB 2.5 Bid Request object provided to (and potentially mutated by) the `MakeRequests` method. The information in the `request` may be useful when detecting the media type.

The second argument, `requestData`, is the exact same `adapters.RequestData` object returned by the `MakeRequests` method. It's rare for adapters to make use of this information, but it's provided for potential edge cases.

The third argument, `responseData`, is the HTTP response received from your bidding server and contains the status code, body, and headers. If your bidding server replies with a GZIP encoded body, it will be automatically decompressed. 

The `MakeBids` method is expected to return an `adapters.BidderResponse` object with one or more bids mapped from your bidding server's response. This may be as simple as decorating an OpenRTB 2.5 Bid Response with a some Prebid Server metadata (such as the media type) or more complicated mapping logic depending on your server's response format.

Please review the entire [OpenRTB 2.5 Bid Response](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf#page=32) documentation to fully understand the response object model and expectations. We've summarized some common fields below. Data which is listed as required is enforced by the core framework and cannot be omitted.

{: .table .table-bordered .table-striped }
| BidderResponse Path | Scope | Description
| - | - | -
| `.Currency` | Required | [3-letter ISO 4217 code](https://www.iso.org/iso-4217-currency-codes.html) defining the currency of the bid. The Prebid Server default is USD.
| `.Bids[].BidType` | Required | Prebid Server defined value identifying the media type as `banner`, `video`, `audio`, or `native`. Should be mapped from the bidding server response.
| `.Bids[].Bid.ADomain` | Optional | Advertiser domain for block list checking.
| `.Bids[].Bid.AdM` | Optional | Ad markup to serve the creative if the bid wins. May be HTML, Native, or VAST/VMAP formats.
| `.Bids[].Bid.CrID` | Required | Unique id of the creative.
| `.Bids[].Bid.ID` | Required | Bidder generated id to assist with logging and tracking.
| `.Bids[].Bid.ImpID` | Required | ID of the corresponding bid request Impression. Prebid Server validates the id is actually found in the bid request.
| `.Bids[].Bid.Price` | Required | Net price CPM of the bid, not gross price. Publishers can correct for gross price bids by setting Bid Adjustments to account for fees. We recommend the most granular price a bidder can provide.
| `.Bids[].Bid.W` | Optional | Width of the creative in pixels.
| `.Bids[].Bid.H` | Optional | Height of the creative in pixels.
| `.Bids[].Bid.Ext` | Optional | Embedded JSON containing Prebid metadata (see below) or custom information.

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

Prebid has historically struggled with sharing granular bid response data with publishers, analytics, and reporting systems. To address this, we've introduced a standard object model. We encourage adapters to provide as much information as possible in the bid response. 

{: .alert.alert-danger :}
Bid metadata will be *required* in a coming Prebid.js release, specifically for AdvertiserDomains and MediaType. We recommend making sure your adapter sets these values or Prebid.js may throw out the bid.

{: .table .table-bordered .table-striped }
| Path | Description
| - | -
| `.NetworkID` | Bidder-specific network/DSP id.
| `.NetworkName` | Bidder-specific network/DSP name.
| `.AgencyID` | Bidder-specific agency id.
| `.AgencyName` | Bidder-specific agency name.
| `.AdvertiserID` | Bidder-specific advertiser id.
| `.AdvertiserName` | Bidder-specific advertiser name.
| `.AdvertiserDomains` | Advertiser domains for the landing page(s). Should match `.Bids[].Bid.ADomain`. 
| `.BrandID` | Bidder-specific brand id for advertisers with multiple brands.
| `.BrandName` | Bidder-specific brand name.
| `.PrimaryCategoryID` | Primary IAB category id.
| `.SecondaryCategoryIDs` | Secondary IAB category ids.
| `.MediaType` | Either `banner`, `audio`, `video`, or `native`. Should match `.Bids[].BidType`.

<p></p>

<details markdown="1">
  <summary>Example: Setting metadata.</summary>

```go
func (a *adapter) MakeBids(request *openrtb.BidRequest, requestData *adapters.RequestData, responseData *adapters.ResponseData) (*adapters.BidderResponse, []error) {
  ...
  for _, seatBid := range response.SeatBid {
    for _, bid := range seatBid.Bid {
      b := &adapters.TypedBid{
        Bid:     &bid,
        BidType: getMediaTypeForBid(bid),
      }

      if meta, err := buildMeta(b); err != nil {
        errs = append(errs, metaErr)
      } else {
        b.Bid.Ext = meta
        bidResponse.Bids = append(bidResponse.Bids, b)
      }
  }
  ...
}

func buildMeta(bid *adapters.TypedBid) (json.RawMessage, error) {
  metaExt := openrtb_ext.ExtBidPrebid {
    Meta: &openrtb_ext.ExtBidPrebidMeta {
      NetworkID:            1,
      NetworkName:          "Some Network Name",
      AgencyID:             2,
      AgencyName:           "Some Agency Name",
      AdvertiserID:         3,
      AdvertiserName:       "Some Advertiser Name",
      AdvertiserDomains:    bid.ADomain,
      BrandID:              4,
      BrandName:            "Some Brand Name",
      PrimaryCategoryID:    "IAB-1",
      SecondaryCategoryIDs: []string{"IAB-2", "IAB-3"},
      MediaType:            b.BidType,
    }
  }
  return json.Marshal(meta)
}
```
</details>
<p></p>

### Create A User Syncer (Optional)

Prebid Server offers a federated [user sync solution](https://docs.prebid.org/prebid-server/developers/pbs-cookie-sync.html) to store user ids in a single cookie under the host's domain. You may add support with a relatively small amount of code if your bidding server supports this protocol.

Create a file with the path `adatpers/{bidder}/usersync.go` using the following template:

```go
package {bidder}

import (
  "text/template"
  
  "github.com/prebid/prebid-server/adapters"
  "github.com/prebid/prebid-server/usersync"
)

func NewSyncer(template *template.Template) usersync.Usersyncer {
  return adapters.NewSyncer("{bidder}", 0, template, adapters.SyncTypeRedirect)
}
```

The heavy lifting is handled by the `adapters.NewSyncer` method. You just need to provide a few arguments:

{: .table .table-bordered .table-striped }
| Argument | Description
| - | -
| `familyName` | Name used for storing your user sync id within the federated cookie. Please keep this the same as your bidder name.
| `vendorID` | Id for your bidding server as registered with the [GDPR Global Vendor List (GVL)](https://iabeurope.eu/vendor-list-tcf-v2-0/). Leave this as `0` if you are not registered with IAB Europe.
| `urlTemplate` | Pass through the `template` argument.
| `syncType` | Type of user sync supported by your bidding server. The valid options are `SyncTypeRedirect` and `SyncTypeIframe`.

### Register With The Core

Prebid Server does not use reflection or any other automagic technology to recognize your new bid adapter. You must manually register it with the core framework.

{: .alert.alert-info :}
You will need to add an `import` statement for your bid adapter package in these files. Modern code editors such as Visual Studio Code and JetBrain's GoLand will automatically do that for you.

Edit the file `openrtb_ext/bidders.go` to add your bidder name constant and include it alphabetically in the `CoreBidderNames` list:

```go
// Names of core bidders. These names *must* match the bidder code in Prebid.js if an adapter also exists in that
// project. You may *not* use the name 'general' as that is reserved for general error messages nor 'context' as
// that is reserved for first party data.
//
// Please keep this list alphabetized to minimize merge conflicts.
const (
  ...
  Bidder{Bidder} BidderName = "{bidder}"
  ...
)
```

```go
// CoreBidderNames returns a slice of all core bidders.
func CoreBidderNames() []BidderName {
  return []BidderName{
    ...
     Bidder{Bidder},
    ...
  }
}
```

Edit the file `exchange/adapter_builders.go` to register your builder method:

```go
func newAdapterBuilders() map[openrtb_ext.BidderName]adapters.Builder {
  return map[openrtb_ext.BidderName]adapters.Builder{
    ...
    openrtb_ext.Bidder{Bidder}: {bidder}.Builder,
    ...
  }
}
```

If you have a user syncer, edit the file `usersync/usersyncers/syncer.go` to include it in the syncer map.

```go
func NewSyncerMap(cfg *config.Configuration) map[openrtb_ext.BidderName]usersync.Usersyncer {
  syncers := make(map[openrtb_ext.BidderName]usersync.Usersyncer, len(cfg.Adapters))
  ...
  insertIntoMap(cfg, syncers, openrtb_ext.Bidder{Bidder}, {bidder}.NewSyncer)
  ...
}
```

### Set Adapter Defaults

Lastly, you need to provide default settings for your bid adapter. You can decide if you'd like your bid adapter to be enabled out of the box, and if so, you'll need to provide a default endpoint and default extra adapter info if applicable. If your bid adapter requires host specific information to function properly, such as a security token or host account, then it's best to leave the adapter disabled.

{: .alert.alert-warning :}
**HOST SPECIFIC INFO:** The default endpoint must not be specific to any particular host, such as Xandr/AppNexus. We may ask you about suspicious looking ids during the review process. Please reach out to individual hosts if you need to set specialized configuration.

#### Enabled By Default

Edit the file `config/config.go` to register your default endpoint within the `SetupViper` method. If your bid adapter makes use of extra adapter info and you'd like to provide a good default value, you can do that here too.

```go
func SetupViper(v *viper.Viper, filename string) {
  ...
  v.SetDefault("adapters.{bidder}.endpoint", "https://your.url/any/path")
  v.SetDefault("adapters.{bidder}.extra_info", `{"your": "extra info"}`) 
  ...
}
```

#### Disabled By Default

Edit the file `config/config.go` to register your default endpoint within the `SetupViper` method. You may still provide a default endpoint or extra adapter info.

```go
func SetupViper(v *viper.Viper, filename string) {
  ...
  v.SetDefault("adapters.{bidder}.disabled", "true")
  ...
}
```

### Set User Syncer Defaults

If you implemented a user syncer, you'll need to provide a default endpoint. Edit the file `config/config.go` to alphabetically register your user syncer in the `setDerivedDefaults` method:

```go
func (cfg *Configuration) setDerivedDefaults() {
  ...
  setDefaultUsersync(cfg.Adapters, openrtb_ext.Bidder{Bidder}, "https://your.url/sync?r="+url.QueryEscape(externalURL)+"%2Fsetuid%3Fbidder%3D{bidder}%26gdpr%3D{%raw%}{{.GDPR}}%26gdpr_consent%3D{{.GDPRConsent}}{%endraw%}%26uid%3D%5BUUID%5D")
  ...
}
```

If you don't have a good default, please add a comment instead.

```go
func (cfg *Configuration) setDerivedDefaults() {
  ...
  // openrtb_ext.Bidder{Bidder} doesn't have a good default.
  ...
}
```


Yes, you're right. That url value is quite complicated. You can find further details in our [user sync documentation](https://docs.prebid.org/prebid-server/developers/pbs-cookie-sync.html).

The user sync endpoint is composed of two main parts, the url of your user syncer and a redirect back to Prebid Server. The url of your user syncer is responsible for reading the user id from the client's cookie and redirecting to Prebid Server with a user id macro resolved.

The url of your user syncer can make use of the following privacy policy macros which will be resolved by Prebid Server before sending the url to your server:
- `{%raw%}{{.USPrivacy}}{%endraw%}`: Client's CCPA consent string.
- `{%raw%}{{.GDPR}}{%endraw%}`: Client's GDPR TCF enforcement flag.
- `{%raw%}{{.GDPRConsent}}{%endraw%}`: Client's GDPR TCF consent string.

<details markdown="1">
  <summary>Example: Bidding server url with no macros.</summary>

```go
"https://your.url/sync?r="
```
</details>

<details markdown="1">
  <summary>Example: Bidding server url with CCPA privacy consent.</summary>

```go
"https://your.url/sync?usp={%raw%}{{.USPrivacy}}{%endraw%}&r="
```
</details>
<p></p>

The redirect url for Prebid Server must follow this format:
```
{host}/setuid?bidder={bidder}&gdpr={%raw%}{{.GDPR}}&gdpr_consent={{.GDPRConsent}}{%endraw%}&uid=[UUID]
```

{: .table .table-bordered .table-striped }
| Token | Description
| - | -
| `{host}` | Placeholder for the Prebid Server host url. In code, you would substitute it with `url.QueryEscape(externalURL)`. 
| `{bidder}` | Placeholder for the name of your bid adapter.
| `[UUID]` | Macro defined by your user sync server which will be replaced with the user's id.

The final value of the redirect url is encoded for safe use within a query string:

```
{host}%2Fsetuid%3Fbidder%3D{bidder}%26gdpr%3D{%raw%}{{.GDPR}}%26gdpr_consent%3D{{.GDPRConsent}}{%endraw%}%26uid%3D%5BUUID%5D
```

## Test Your Adapter

This chapter will guide you through the creation of automated unit tests to cover your bid adapter code, bidder parameters JSON Schema, and user sync code. We use GitHub Action Workflows to ensure the code you submit passes validation. You can run the same validation locally with this command:

```bash
./validate.sh --nofmt --cov --race 10
```

### Adapter Code Tests

Bid requests and server responses can be quite verbose. To avoid large blobs of text embedded within test code, we've created a framework for bid adapters which use a JSON body and/or a url. If your bidding server uses another payload format, such as XML, you're on your own.

We strive for as much test coverage as possible, but recognize that some code paths are impractical to simulate and rarely occur. You do not need to test the error conditions for `json.Marshal` calls, for template parse errors within `MakeRequests` or `MakeBids`, or for `url.Parse` calls. Following this guidance usually results in a coverage rate of around 90% - 95%, although we don't enforce a specific threshold.

To use the test framework, create a file with the path `adapters/{bidder}/{bidder}_test.go` with the following template:

```go
package {bidder}

import (
  "testing"
  
  "github.com/prebid/prebid-server/adapters/adapterstest"
  "github.com/prebid/prebid-server/config"
  "github.com/prebid/prebid-server/openrtb_ext"
)

func TestJsonSamples(t *testing.T) {
  bidder, buildErr := Builder(openrtb_ext.Bidder{Bidder}, config.Adapter{
    Endpoint: "http://whatever.url"})
  
  if buildErr != nil {
    t.Fatalf("Builder returned unexpected error %v", buildErr)
  }
  
  adapterstest.RunJSONBidderTest(t, "{bidder}test", bidder)
}
```

You should use an obviously fake endpoint for your tests. There's no reason to use a real endpoint value. Please also note the `_test.go` file suffix is a required Go idiom. The Go test runner will look in these files for tests and the Go compiler will exclude test code from production binaries.

Each test case should be written in its own JSON file with a succinct, yet descriptive, name of what's being tested. The files should be located in either:
* `adapters/{bidder}/{bidder}test/exemplary/` for straight forward "happy path" tests. We expect to see tests here for each supported media type.
* `adapters/{bidder}/{bidder}test/supplemental` for tests which produce errors or cover more complicated scenarios.

The format of a JSON test is as follows:
```json
{
  "mockBidRequest": {
    «OpenRTB 2.5 Bid Request»
  },
  "httpCalls": [{
    "expectedRequest": {
      "uri": "«Bidding Server Endpoint»",
      "headers": {
        "«Name»": ["«Value»"],
      },
      "body": {
         «Bidding Server Request Body»
      }
    },
    "mockResponse": {
      "status": «Mock HTTP Status Code (e.g. 200)»,
      "headers": {
        "«Name»": ["«Value»"],
      },
      "body": {
         «Bidding Server Response Body»
      },
    },
  }],
  "expectedBidResponses": [{
    "bids": [{
       «Prebid Server Bid Response»
    }]
  }],
  "expectedMakeRequestsErrors": [{
    "value": "«Value»",
    "comparison": "«literal or regex»"
  }],
  "expectedMakeBidsErrors": [{
    "value": "«Value»",
    "comparison": "«literal or regex»"
  }]
}
```

The `mockBidRequest`, `httpCalls`, and `expectedBidResponses` fields are required. The `expectedMakeRequestsErrors` and `expectedMakeBidsErrors` may be omitted if there are no expected errors. We provide a `literal` and `regex` mode for testing error values. We often use the `regex` mode to handle error messages produced by the core Go framework which changed between recent releases.

To make everyone's life easier, please use a JSON 'prettifier' to apply standard formatting to your test files. We recommend the use of Visual Studio Code's [Beautify](https://marketplace.visualstudio.com/items?itemName=HookyQR.beautify) extension.

### Builder Tests

The `TestJsonSamples` tests provide adequate test coverage of your bid adapter's `Builder` method if it remains simple. If you've added custom logic, macro support, or make use of extra adapter info, you'll need additional tests.

If your adapter supports template parsing, we recommend adding this failure test to the  `adapters/{bidder}/{bidder}_test.go` file:

```go
func TestEndpointTemplateMalformed(t *testing.T) {
  _, buildErr := Builder(openrtb_ext.Bidder{Bidder}, config.Adapter{
    Endpoint: "{%raw%}{{Malformed}}{%endraw%}"})
    
  assert.Error(t, buildErr)
}
```

If your adapter supports extra adapter info, we recommend adding these tests to the  `adapters/{bidder}/{bidder}_test.go` file. You should customize the `TestEmptyConfig` test to assert your adapter's default extra info values.

```go
func TestBadConfig(t *testing.T) {
  _, buildErr := Builder(openrtb_ext.Bidder{Bidder}, config.Adapter{
    Endpoint:         `http://it.doesnt.matter/bid`,
    ExtraAdapterInfo: `{foo:42}`,
  })
  
  assert.Error(t, buildErr)
}

func TestEmptyConfig(t *testing.T) {
  bidder, buildErr := Builder(openrtb_ext.Bidder{Bidder}, config.Adapter{
    Endpoint:         `http://it.doesnt.matter/bid`,
    ExtraAdapterInfo: ``,
  })
  
  bidder{Bidder} := bidder.(*adapter)
  
  assert.NoError(t, buildErr)
  assert.Empty(t, bidder{Bidder}.extraInfo.SomeInfo)
}
```

### Adapter Race Condition Tests

You must define race condition tests for each media type supported by your bid adapter. We don't expect bid adapters to run concurrent code. Rather, these tests attempt to verify your bid adapter doesn't modify shared memory. We use Go's [race detector](https://golang.org/doc/articles/race_detector.html) which is a great line of defense, but it may produce false negatives. It will not produce false positives, so please investigate further if these tests ever fail.

Create a file with the path `adapters/{bidder}/{bidder}test/params/race/{mediaType}.json` for each `banner`, `video`, `audio`, and `native` media type supported by your adapter. Include all required and optional bidder parameters defined by your JSON Schema.

Here's an example file using the same example JSON Schema from other chapters:
```json
{
  "placementId": "Some Placement"
}
```

### Bidder Parameter Tests

The bidder parameter JSON Schema files are considered a form of code and must be tested. Create a file with the path `adapters/{bidder}/params_test.go` using the following template:

```go
package {bidder}

import (
  "encoding/json"
  "testing"
  
  "github.com/prebid/prebid-server/openrtb_ext"
)

func TestValidParams(t *testing.T) {
  validator, err := openrtb_ext.NewBidderParamsValidator("../../static/bidder-params")
  if err != nil {
    t.Fatalf("Failed to fetch the json schema. %v", err)
  }
  
  for _, p := range validParams {
    if err := validator.Validate(openrtb_ext.Bidder{Bidder}, json.RawMessage(p)); err != nil {
      t.Errorf("Schema rejected valid params: %s", p)
    }
  }
}

func TestInvalidParams(t *testing.T) {
  validator, err := openrtb_ext.NewBidderParamsValidator("../../static/bidder-params")
  if err != nil {
    t.Fatalf("Failed to fetch the json schema. %v", err)
  }
  
  for _, p := range invalidParams {
    if err := validator.Validate(openrtb_ext.Bidder{Bidder}, json.RawMessage(p)); err == nil {
      t.Errorf("Schema allowed invalid params: %s", p)
    }
  }
}

var validParams = []string{
  `{"placementId": ""}`,
  `{"placementId": "Some Placement ID}`,
}

var invalidParams = []string{
  `{"placementId": 42}`,
}
```
Please include tests for required fields, optional fields, conditional fields such as `oneOf`, regex filters, and data type mismatches. For example, if the field is defined as a string please include one invalid case for the wrong data type such as an integer in this example.

You don't have to go crazy with combinatorials. We're looking for just enough test cases to build confidence.

### User Syncer Tests

{: .alert.alert-info :}
Please skip to the end of this section if your adapter doesn't define a user syncer.

We ask that you include a user syncer test to verify the basic mechanics of macro substitution. The `syncURL` should be the same value used in the `setDefaultUsersync` call with the `url.QueryEscape(externalURL)` code replaced with a simple hardcoded value such as `"host"`. Please keep the privacy policy values simple, as we're only testing substitution.

Create a file with the path `adapters/{bidder}/usersync_test.go` using the following template:

```go
package {bidder}

import (
  "testing"
  "text/template"
  
  "github.com/prebid/prebid-server/privacy"
  "github.com/prebid/prebid-server/privacy/ccpa"
  "github.com/prebid/prebid-server/privacy/gdpr"
  "github.com/stretchr/testify/assert"
)

func TestSyncer(t *testing.T) {
  syncURL := "<Copy From Default Config>"
  syncURLTemplate := template.Must(
    template.New("sync-template").Parse(syncURL),
  )
  
  syncer := NewSyncer(syncURLTemplate)
  syncInfo, err := syncer.GetUsersyncInfo(privacy.Policies{
    GDPR: gdpr.Policy{
      Signal:  "A",
      Consent: "B",
    },
    CCPA: ccpa.Policy{
      Consent: "C",
    },
  })
  
  assert.NoError(t, err)
  assert.Equal(t, "<syncURL With Macros Resolved>", syncInfo.URL)
  assert.Equal(t, "redirect", syncInfo.Type)
  assert.Equal(t, 0, syncer.GDPRVendorID())
}
```

If you *DON'T* have a user syncer, edit the file `usersync/usersyncers/syncer_test.go` to exclude your bid adapter from user sync tests:

```go
adaptersWithoutSyncers := map[openrtb_ext.BidderName]bool{
  ...
  openrtb_ext.Bidder{Bidder}: true,
  ...
}
```

### Manual End To End Tests

We'll verify your adapter works correctly on a technical level during the code review, but you'll need to perform separate end-to-end testing:

1. Build the project and start your server:
   ```bash
   go build .
   ./prebid-server
   ```

1. POST an OpenRTB 2.5 Bid Request with at least one Impression defined for your bid adapter with a supported media type. This is an example template for a banner ad.
   ```bash
   curl --request POST \
    --url 'https://localhost:8000/openrtb2/auction' \
    --header 'Content-Type: application/json' \
    --data '{
      "id": "some-request-id",
      "test": 1,
      "site": {
        "page": "prebid.org"
      },
      "imp": [{
        "id": "some-impression-id",
        "banner": {
          "format": [{
            "w": 600,
            "h": 500
          }, {
            "w": 300,
            "h": 600
          }]
        },
        "ext": {
          "prebid": {
            "bidder": {
              "{bidder}": {
                <Your Bid Adapter Parameters>
              }
            }
          }
        }
      }],
      "tmax": 1000
    }'
   ```

If your bid adapters defines a user syncer, please perform end-to-end testing of the user sync process:

1.  [Save a User ID](https://docs.prebid.org/prebid-server/endpoints/pbs-endpoint-setuid.html) using the `familyName` of your user syncer. This is likely the same as your bidder name.

1. Run a test auction (see the curl example above) and verify in the debug response that the outgoing `request.ext.debug.httpcalls` calls includes the User ID you saved in step 1.

It may be a bit tricky to track down the root cause of user sync errors. If you get stuck, please [submit a GitHub issue](https://github.com/prebid/prebid-server/issues/new) and we'll provide guidance.

## User Documentation

Human readable documentation for bid adapters is required in the separate [prebid.github.io](https://github.com/prebid/prebid.github.io) repository. We will not merge your bid adapter until you've at least opened a documentation PR and comment with a link to it.

1. If you already have a Prebid.js bid adapter, update your existing bidder file in https://github.com/prebid/prebid.github.io/tree/master/dev-docs/modules to add the `pbs: true` variable in the header section. If your Prebid Server bidding parameters are different from your Prebid.js parameters, please include the differences in this document for publishers to be aware.
1. If you don't have a Prebid.js bid adapter, create a new file in https://github.com/prebid/prebid.github.io/tree/master/dev-docs/modules using this template:

```
---
layout: bidder
title: {bidder}
description: Prebid {Bidder} Bidder Adapter
biddercode: {bidder}
gdpr_supported: true/false
tcf2_supported: true/false
gvl_id: 111
usp_supported: true/false
coppa_supported: true/false
schain_supported: true/false
userId: <list of supported vendors>
media_types: banner, video, audio, native
safeframes_ok: true/false
bidder_supports_deals: true/false
pbjs: true/false
pbs: true/false
pbs_app_supported: true/false
prebid_member: true/false
---

### Note:

The Example Bidding adapter requires setup before beginning. Please contact us at setup@example.com

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description  | Example   | Type     |
|---------------|----------|--------------|-----------|----------|
| `placementId` | required | Placement ID | `'11111'` | `string` |
```
Notes on the metadata fields:
- Add `pbs: true`. If you also have a [Prebid.js bid adapter](/dev-docs/bidder-adaptor.html), add `pbjs: true`. Default is false for both.
- If you support the GDPR consentManagement module and TCF1, add `gdpr_supported: true`. Default is false.
- If you support the GDPR consentManagement module and TCF2, add `tcf2_supported: true`. Default is false.
- If you're on the IAB's Global Vendor List, place your ID in `gvl_id`. No default.
- If you support the US Privacy consentManagementUsp module, add `usp_supported: true`. Default is false.
- If you support one or more userId modules, add `userId: (list of supported vendors)`. Default is none.
- If you support video and/or native mediaTypes add `media_types: video, native`. Note that display is added by default. If you don't support display, add "no-display" as the first entry, e.g. `media_types: no-display, native`. No defaults.
- If you support COPPA, add `coppa_supported: true`. Default is false.
- If you support the [supply chain](/dev-docs/modules/schain.html) feature, add `schain_supported: true`. Default is false.
- If your bidder doesn't work well with safeframed creatives, add `safeframes_ok: false`. This will alert publishers to not use safeframed creatives when creating the ad server entries for your bidder. No default.
- If your bidder supports mobile apps, set `pbs_app_supported: true`. No default value.
- If your bidder supports deals, set `bidder_supports_deals: true`. No default value.
- If you're a member of Prebid.org, add `prebid_member: true`. Default is false.


## File Checklist

- Bidder Info
  - `static/bidder-info/{bidder}.yaml`
- Bidder Parameters
  - `static/bidder-params/{bidder}.json`
  - `openrtb_ext/imp_{bidder}.go`
  - `adapters/{bidder}/params_test.go`
- Adapter Code
  - `adapters/{bidder}/{bidder}.go`
  - `adapters/{bidder}/{bidder}_test.go`
  - `adapters/{bidder}/{bidder}test/exemplary/*.json`
  - `adapters/{bidder}/{bidder}test/supplemental/*.json`
  - `adapters/{bidder}/{bidder}test/params/race/{mediaType}.json` 
- User Syncer - If You Have One
  - `adapters/{bidder}/usersync.go`
  - `adapters/{bidder}/usersync_test.go`
  - `usersync/usersyncers/syncer.go`
- User Syncer - If You Don't
  - `usersync/usersyncers/syncer_test.go`
- Register With The Core
  - `openrtb_ext/bidders.go`
  - `exchange/adapter_builders.go`
- Defaults
  - `config/config.go`

## Contribute

Whew! You're almost done. Thank you for taking the time to develop a Prebid Server bid adapter. When you're ready, [contribute](https://github.com/prebid/prebid-server/blob/master/docs/developers/contributing.md) your new bid adapter by opening a PR to the [PBS-Go GitHub repository](https://github.com/prebid/prebid-server) with the name "New Adapter: {Bidder}".

{: .alert.alert-warning :}
You don't need to ask permission or open a GitHub issue before submitting an adapter.
