---
layout: page_v2
page_type: pbs-module
title: Prebid Server Optable Targeting Module
display_name : Optable Targeting Module
sidebarType : 5
---

{: .alert.alert-warning :}
Optable module operates using a DCN backend API. Please contact your account manager to get started.

# Optable Targeting Module
{:.no_toc}

* TOC
{:toc}

## Overview

The optable-targeting module enriches an incoming OpenRTB request by adding to the `user.eids` and `user.data`
objects. Under the hood the module extracts PPIDs (publisher provided IDs) from the incoming request's `user.ext.eids`,
and also if present sha256-hashed email, sha256-hashed phone, zip or Optable Visitor ID provided correspondingly in the
`user.ext.optable.email`, `.phone`, `.zip`, `.vid` fields (a full list of IDs is given in a table below). These IDs are
sent as input to the Targeting API. The received response data is used to enrich the OpenRTB request and response.
Targeting API endpoint is configurable per publisher.

## Setup

### Execution Plan

This module runs at three stages:

* Raw Auction Request: initiates a non-blocking Optable API call early in the auction lifecycle.
* Bidder Request: awaits the API response and enriches individual bidder requests with `user.eids` and `user.data`.
* Auction Response: injects ad server targeting.

We recommend defining the execution plan in the account config so the module is only invoked for specific accounts. See
below for an example.

### Global Config

In the host-level config you need to specify the regional endpoint that would be closest to the host:

```yaml
hooks:
  optable-targeting:
    enabled: true
  modules:
    optable-targeting:
      api-endpoint: https://na.edge.optable.co/v2/targeting?t={{TENANT}}&o={ORIGIN}
```

To obtain the endpoints for your regions - please contact [prebid@optable.co](mailto:prebid@optable.co).

Note the endpoint contains 2 macros: {{TENANT}} and {ORIGIN} - the values for which are provided in the account-level config as `tenant` and `origin` parameters correspondingly.

### Account-Level Config

To start using the module in PBS-Java you have to enable it and add the hooks into the execution plan in your config
file. Here's the recommended account config:

```yaml
hooks:
  optable-targeting:
    api-key: key
    tenant: optable
    origin: web-sdk-demo
    enrichment-percentage: 100
    bidder-enrichment-percentages:
      appnexus: 75
      rubicon: 75
      pubmatic: 100
      criteo: 0
    enrich-web: true
    enrich-app: true
    ppid-mapping: { "pubcid.org": "c" }
    adserver-targeting: true
    cache:
      enabled: false
      ttlseconds: 86400
  host-execution-plan: >
    {
      "endpoints": {
        "/openrtb2/auction": {
          "stages": {
            "raw-auction-request": {
              "groups": [
                {
                  "timeout": 50,
                  "hook-sequence": [
                    {
                      "module-code": "optable-targeting",
                      "hook-impl-code": "optable-targeting-raw-auction-request-hook"
                    }
                  ]
                }
              ]
            },
            "bidder-request": {
              "groups": [
                {
                  "timeout": 50,
                  "hook-sequence": [
                    {
                      "module-code": "optable-targeting",
                      "hook-impl-code": "optable-targeting-bidder-request-hook"
                    }
                  ]
                }
              ]
            },
            "auction-response": {
              "groups": [
                {
                  "timeout": 10,
                  "hook-sequence": [
                    {
                      "module-code": "optable-targeting",
                      "hook-impl-code": "optable-targeting-auction-response-hook"
                    }
                  ]
                }
              ]
            }
          }
        }
      }
    }
```

### Migrating from legacy configuration

Previous versions of the module used a `processed-auction-request` hook (alongside the `auction-response` hook) that both
made the API call and enriched the request synchronously in one step, blocking the auction pipeline. The new
configuration replaces it with two hooks: `raw-auction-request` (initiates the API call early) and `bidder-request`
(awaits the result and enriches per-bidder), while the `auction-response` hook remains unchanged.

If your execution plan contains the following fragment, it should be replaced with the `raw-auction-request` and
`bidder-request` hooks shown above:

```json
"processed-auction-request": {
  "groups": [
    {
      "timeout": 600,
      "hook-sequence": [
        {
          "module-code": "optable-targeting",
          "hook-impl-code": "optable-targeting-processed-auction-request-hook"
        }
      ]
    }
  ]
}
```

The `processed-auction-request` hook is still supported for backwards compatibility. It detects whether the new hooks
(`raw-auction-request` and `bidder-request`) are present in the execution plan. If both are active, it passes through
immediately without blocking the pipeline. If the new hooks are absent, it falls back to the legacy synchronous
behavior. This means the legacy fragment can be kept during migration without negating the latency benefit of the new
configuration.

### Timeout considerations

The `bidder-request` hook timeout is used as the timeout budget for the Optable Targeting API call Future that is
initiated in the `raw-auction-request` stage. The API call runs in parallel with other auction processing, so the
effective wait time at the `bidder-request` stage is typically much shorter than the full API roundtrip. The
`raw-auction-request` hook timeout only needs to cover its own lightweight setup (validation, sampling) and can be kept
short.

**Note:** Do not confuse hook timeout value with the module timeout parameter which is optional. The hook timeout value
would depend on the cloud/region where the PBS instance is hosted and the latency to reach the Optable's servers. This
will need to be verified experimentally upon deployment.

The timeout value for the `auction-response` can be set to 10 ms - usually it will be sub-millisecond time as there are
no HTTP calls made in this hook - Optable-specific keywords are cached on earlier stages and retrieved from the module
invocation context later.

### Caching

The module uses [Prebid Cache Storage](https://docs.prebid.org/prebid-server/features/pbs-pbc-storage.html) feature that relies on the existing Prebid Cache Server. By default it is disabled, but if enabled it caches Targeting API responses for ttlseconds (24 hours by default) which reduces the module processing time to milliseconds, rather than hundreds of milliseconds, for the cached Targeting API responses. 

## Module Configuration Parameters for PBS-Java

The parameter names are specified with full path using dot-notation. F.e. `section-name` .`sub-section` .`param-name`
would result in this nesting in the JSON configuration:

```json
{
  "section-name": {
    "sub-section": {
      "param-name": "param-value"
    }
  }
}
```

{: .table .table-bordered .table-striped }

| Param Name                     | Required | Type             | Default value | Description                                                                                                                                                                                                                                                                                                                                                                                                                |
|:-------------------------------|:---------|:-----------------|:--------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| api-endpoint                   | yes      | string           | none          | Host-Level. Optable Targeting Edge API endpoint URL. Note it must include &#123;&#123;TENANT&#125;&#125; and &#123;ORIGIN&#125; macros that are substituted from account-level config values |
| tenant                         | yes      | string           | none          | Account-Level. Your Optable tenant aka account ID. |
| origin                         | yes      | string           | none          | Account-Level. Optable data `origin` aka `source`. |
| api-key                        | no       | string           | none          | Account-Level. If the API is protected with a key - this param needs to be specified to be sent in the auth header |
| ppid-mapping                   | no       | map              | none          | Account-Level. This specifies PPID source (`user.ext.eids[].source`) to a custom identifier prefix mapping, f.e. `{"example.com" : "c"}`. See the section on ID Mapping below for more detail. |
| adserver-targeting             | no       | boolean          | false         | Account-Level. If set to true - will add the Optable-specific adserver targeting keywords into the PBS response for every `seatbid[].bid[].ext.prebid.targeting` |
| timeout                        | no       | integer          | none          | Account-Level. A soft timeout (in ms) sent as a hint to the Targeting API endpoint to limit the request times to Optable's external tokenizer services |
| id-prefix-order                | no       | string           | none          | Account-Level. An optional string of comma separated id prefixes that prioritizes and specifies the order in which ids are provided to Targeting API in a query string. F.e. "c,c1,id5" will guarantee that Targeting API will see id=c:...,c1:...,id5:... if these ids are provided. Id-prefixes not mentioned in this list will be added in arbitrary order after the priority prefix ids. This affects Targeting API processing logic  |
| hid-prefixes                   | no       | string           | none          | Account-Level. An optional string of comma separated id prefixes that should additionally be sent to the Targeting API as resolver hints in `hid=prefix:value` query parameters. See the section on Resolver Hints below for more detail. |
| enrichment-percentage          | no       | integer          | 100           | Account-Level. Default percentage (0-100) of bid requests per bidder that will receive enrichment data. Set to 100 to enrich all requests, 0 to disable enrichment by default. |
| bidder-enrichment-percentages  | no       | map              | none          | Account-Level. Per-bidder overrides for `enrichment-percentage`. Keys are bidder names, values are percentages (0-100). F.e. `{"appnexus": 75, "criteo": 0}` enriches 75% of appnexus requests and none for criteo. Bidders not listed in this map fall back to the default `enrichment-percentage` (100% unless overridden). |
| enrich-web                     | no       | boolean          | true          | Account-Level. Whether to enrich web traffic (requests with a `site` object). |
| enrich-app                     | no       | boolean          | true          | Account-Level. Whether to enrich app traffic (requests with an `app` object). |
| cache.enabled                  | no       | string           | false         | Account-Level. Optionally use [Prebid Cache Storage](https://docs.prebid.org/prebid-server/features/pbs-pbc-storage.html) feature - this significantly reduces the processing time when the Targeting API response has been cached |
| cache.ttlseconds               | no       | int              | 86400         | Account-Level. The TTL in seconds for the Targeting API response to live in cache - by default is equal to 24 hours |
| optable-inserter-eids-merge    | no       | array of strings | none          | Account-Level. List of EID source names for which the module should **merge** the incoming server-side EIDs with those returned by the Targeting API. |
| optable-inserter-eids-replace  | no       | array of strings | none          | Account-Level. List of EID source names for which the module should **replace** the incoming EID entirely with the one from the Targeting API. |
| optable-inserter-eids-ignore   | no       | array of strings | none          | Account-Level. List of EID source names for which the module should **remove** the EID entirely. |

## ID Mapping

Internally the module sends requests to Optable Targeting API. The output of Targeting API is used to enrich the request
and response. The below table describes the parameters that the module automatically fetches from OpenRTB request and
then sends to the Targeting API. The module will use a prefix as specified in the table to prepend the corresponding ID
value when sending it to the Targeting API in the form `id=prefix:value`.

See [Optable documentation](https://docs.optable.co/optable-documentation/dmp/reference/identifier-types#type-prefixes)
on identifier types. Targeting API accepts multiple id parameters - and their order may affect the results, thus
`id-prefix-order` specifies the order of the ids.

{: .table .table-bordered .table-striped }

| Identifier Type                                                                | OpenRTB field                                                         | ID Type Prefix                           |
|--------------------------------------------------------------------------------|-----------------------------------------------------------------------|------------------------------------------|
| Email Address                                                                  | `user.ext.optable.email`                                              | `e:`                                     |
| Phone Number                                                                   | `user.ext.optable.phone`                                              | `p:`                                     |
| Postal Code                                                                    | `user.ext.optable.zip`                                                | `z:`                                     |
| IPv4 Address                                                                   | `device.ip`                                                           | ~~i4:~~ Sent as `X-Forwarded-For` header |
| IPv6 Address                                                                   | `device.ipv6`                                                         | ~~i6:~~ Sent as `X-Forwarded-For` header |
| Apple IDFA                                                                     | `device.ifa if lcase(device.os) contains 'ios' and device.lmt!=1`     | `a:`                                     |
| Google GAID                                                                    | `device.ifa if lcase(device.os) contains 'android' and device.lmt!=1` | `g:`                                     |
| Roku RIDA                                                                      | `device.ifa if lcase(device.os) contains 'roku' and device.lmt!=1`    | `r:`                                     |
| Samsung TV TIFA                                                                | `device.ifa if lcase(device.os) contains 'tizen' and device.lmt!=1`   | `s:`                                     |
| Amazon Fire AFAI                                                               | `device.ifa if lcase(device.os) contains 'fire' and device.lmt!=1`    | `f:`                                     |
| [NetID](https://docs.prebid.org/dev-docs/modules/userid-submodules/netid.html) | `user.ext.eids[].uids[0] when user.ext.eids[].source="netid.de"`      | `n:`                                     |
| [ID5](https://docs.prebid.org/dev-docs/modules/userid-submodules/id5.html)     | `user.ext.eids[].uids[0] when user.ext.eids[].source="id5-sync.com"`  | `id5:`                                   |
| [Utiq](https://docs.prebid.org/dev-docs/modules/userid-submodules/utiq.html)   | `user.ext.eids[].uids[0] when user.ext.eids[].source="utiq.com"`      | `utiq:`                                  |
| Optable VID                                                                    | `user.ext.optable.vid`                                                | `v:`                                     |

### Optable input erasure

**Note**: `user.ext.optable.email`, `.phone`, `.zip`, `.vid` and `.id5_signature` fields will be removed by the module
from the original OpenRTB request before being sent to bidders.

### Publisher Provided IDs (PPID) Mapping

Custom user IDs are sent in the OpenRTB request in the
[`user.ext.eids[]`](https://github.com/InteractiveAdvertisingBureau/openrtb2.x/blob/main/2.6.md#3227---object-eid-).
The `ppid-mapping` allows to specify the mapping of a source to one of the custom identifier type prefixes `c`-`c19` -
see [documentation](https://docs.optable.co/optable-documentation/dmp/reference/identifier-types#type-prefixes), f.e.:

```yaml
ppid-mapping: {"example.com": "c2", "test.com": "c3"}
```

It is also possible to override any of the automatically retrieved `user.ext.eids[]` mentioned in the table above (s.a.
id5, utiq) so they are mapped to a different prefix. f.e. `id5-sync.com` can be mapped to a prefix other than `id5:`,
like:

```yaml
ppid-mapping: {"id5-sync.com": "c1"}
```

This will lead to id5 ID supplied as `id=c1:...` to the Targeting API.

### Resolver Hints (`hid`)

In addition to the regular `id=prefix:value` parameters, the module can forward selected identifiers to the Targeting
API as hint identifiers, using the `hid=prefix:value` query parameter form.

The two parameters serve different purposes. `id=` values are used for the Optable identity graph lookup, while `hid=`
values are passed on to the external resolvers, such as ID5, that the Targeting API calls on your behalf. An identifier
that a resolver needs therefore has to be listed in `hid-prefixes` even when it is already being sent as an `id=`
parameter; sending it only as `id=` will not make it available to the resolvers.

The set of prefixes to send as hints is configured with `hid-prefixes`, a comma-separated list of prefix names from the
ID Mapping table above. Whitespace around the entries is ignored, and prefixes that are not present on the request are
skipped:

```yaml
hid-prefixes: "c, i6"
```

Each hint is sent as its own repeated `hid=` parameter rather than as a single comma-separated value, so the
configuration above produces `&hid=c:...&hid=i6:...`. The IPv6 address is a special case: it is never sent as an `id=`
parameter, as noted in the table above, so `i6` appears only as a hint.

## Targeting API Query Attributes

In addition to the identifier parameters, the module forwards the following attributes as query string parameters to
the Targeting API:

{: .table .table-bordered .table-striped }

| Attribute       | Source                                                                                                                |
|:----------------|:---------------------------------------------------------------------------------------------------------------------|
| `gdpr`          | `1` if GDPR applies to the request, `0` otherwise. |
| `gdpr_consent`  | TCF consent string, sent when available and the consent is valid. |
| `gpp`           | GPP string, sent when available in the resolved GPP context. |
| `gpp_sid`       | Comma-separated list of active GPP section IDs, limited to the first two, sent when the set is non-empty. |
| `timeout`       | Soft timeout hint in ms, suffixed with `ms`, sent when the account-level `timeout` parameter is configured. |
| `osdk`          | Always set to `prebid-server`, identifying the caller. |
| `bundle`        | App bundle identifier, URL-encoded. Sent when the incoming request has an `app` object and `app.bundle` is non-empty. |
| `ver`           | App version, URL-encoded. Sent only when `bundle` is non-empty and `app.ver` is present and non-empty. |
| `id5_signature` | ID5 signature, URL-encoded. Sent when `user.ext.optable.id5_signature` is present in the incoming request. |

### App bundle and version

For app traffic, requests carrying an `app` object, the module forwards the application's bundle identifier as the
`bundle=` query parameter and, when available, its version as `ver=`. Both values are URL-encoded. The `ver` parameter
is only sent alongside a non-empty `bundle`, so a request with a version but no bundle produces neither parameter.

### ID5 signature

The ID5 signature is propagated in two directions:

1. **Request-side.** When the incoming OpenRTB request carries `user.ext.optable.id5_signature`, that value is sent to
   the Targeting API as the `id5_signature=` query parameter. Blank values are not sent.
2. **Response-side.** When the Targeting API response carries an ID5 signature, the module resolves it through the
   matching Optable-inserted EID and writes it into the bid response at
   `ext.prebid.passthrough.optable.id5_signature`, where the client can read it and send it back up on the next
   request.

The response-side signature is written whenever the module enriched the request, and is independent of
`adserver-targeting`: that parameter controls the ad server targeting keywords, while the signature is a separate
value that is only stored on the client for the next Targeting API call. Conversely, if nothing was enriched there is
no signature to return and the module leaves the bid response untouched.

The `id5_signature` field is also part of the Optable input erasure described above.

## Analytics Tags

The following 2 activities are recorded by the module in the corresponding ATags on the corresponding stages: 

* `optable-enrich-request`
* `optable-enrich-response`

The `status` is either `success` or `failure`.  Where it is `failure` a `results[0].value.reason` is provided.  
For the `optable-enrich-request` activity the `execution-time` value is logged. 
Example:

```json
{
    "analytics":
    {
        "tags":
        [
            {
                "stage": "processed-auction-request",
                "module": "optable-targeting",
                "analyticstags":
                {
                    "activities":
                    [
                        {
                            "name": "optable-enrich-request",
                            "status": "success",
                            "results":
                            [
                                {
                                    "values":
                                    {
                                        "execution-time": "42"
                                    }
                                }
                            ]
                        }
                    ]
                }
            },
            {
                "stage": "auction-response",
                "module": "optable-targeting",
                "analyticstags":
                {
                    "activities":
                    [
                        {
                            "name": "optable-enrich-response",
                            "status": "success",
                            "results":
                            [
                                {
                                    "values":
                                    {
                                        "reason": "none"
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        ]
    }
}
```

If `adserver-targeting` was set to `false` in the config `optable-enrich-response` analytics tag is not written.

## Running the demo (PBS-Java)

{:start="1"}

1. Build the server bundle JAR as described in [Build Project](https://github.com/prebid/prebid-server-java/blob/master/docs/build.md#build-project), e.g.

```bash
mvn clean package --file extra/pom.xml
```

{:start="2"}
2. Start server bundle JAR as described in [Running project](https://github.com/prebid/prebid-server-java/blob/master/docs/run.md#running-project), e.g.

```bash
java -jar target/prebid-server-bundle.jar --spring.config.additional-location=sample/configs/prebid-config-with-optable.yaml
```

{:start="3"}
3. Run sample request against the server as described in [the sample directory](https://github.com/prebid/prebid-server-java/tree/master/sample), e.g.

```bash
curl http://localhost:8080/openrtb2/auction --data @extra/modules/optable-targeting/sample-requests/data.json
```

{:start="4"}
4. Observe the `user.eids` and `user.data` objects enriched.

## Maintainer contacts

Any suggestions or questions can be directed to [prebid@optable.co](mailto:prebid@optable.co).

Alternatively please open a new [issue](https://github.com/prebid/prebid-server-java/issues/new) or [pull request](https://github.com/prebid/prebid-server-java/pulls) in this repository.
