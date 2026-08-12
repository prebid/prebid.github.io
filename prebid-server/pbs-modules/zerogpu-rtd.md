---
layout: page_v2
page_type: pbs-module
title: Prebid Server ZeroGPU Real Time Data Module
display_name: ZeroGPU Real Time Data Module
description: Enriches OpenRTB requests with IAB content categories classified from the publisher's domain.
sidebarType: 5
---

# ZeroGPU Real Time Data Module
{:.no_toc}

* TOC
{:toc}

## Overview

The ZeroGPU Real Time Data module enriches an incoming OpenRTB request with IAB
content categories derived from the publisher's domain.

On each auction the module resolves the domain from the bid request, classifies
it with ZeroGPU's `zlm-v1-iab-domain-classifier` model, and appends the
resulting categories to `{site,app,dooh}.content.data` as Seller-Defined
contextual segments under `ext.segtax: 6` (IAB Content Taxonomy 2.2).

Because the segments are written to standard
[First Party Data](/prebid-server/features/pbs-fpd.html) fields, every bidder in
the auction can read them. No bidder-specific integration is required.

**The auction never waits on ZeroGPU.** The hook reads an in-process cache and
nothing else. When a domain is not yet cached, the auction proceeds unenriched
and the classification is fetched in the background, so subsequent auctions on
that domain are enriched from memory. Measured against the live API, the hook
costs ~15µs whether the domain is cached or not, while the classification call
it avoids takes ~0.9s.

Every failure mode is fail-open: if the ZeroGPU API is slow, unreachable, or
returns an error, auctions simply go unenriched. The module never rejects a
request, never delays one, and never creates bids.

This module is available in PBS-Go.

## Prerequisites

A ZeroGPU API key is required. Sign in at
[platform.zerogpu.ai/dashboard](https://platform.zerogpu.ai/dashboard), or start
from [zerogpu.ai](https://zerogpu.ai/) and click **Start Building**.

The classification model is documented at:

* [API reference](https://docs.zerogpu.ai/api-reference/models/zlm-v1-iab-domain-classifier)
* [Text classification guide](https://docs.zerogpu.ai/docs/text-classification#zlm-v1-iab-domain-classifier)

## Configuration

The module runs at the `processed_auction_request` stage. `api_key` is the only
required parameter.

### Host configuration

```yaml
hooks:
  enabled: true
  modules:
    zerogpu:
      rtd:
        enabled: true
        api_key: ${ZEROGPU_API_KEY}
  host_execution_plan: >
    {
      "endpoints": {
        "/openrtb2/auction": {
          "stages": {
            "processed_auction_request": {
              "groups": [{
                "timeout": 10,
                "hook_sequence": [{
                  "module_code": "zerogpu.rtd",
                  "hook_impl_code": "zerogpu-rtd-processed-auction-request"
                }]
              }]
            }
          }
        }
      }
    }
```

The equivalent JSON configuration:

```json
{
  "hooks": {
    "enabled": true,
    "modules": {
      "zerogpu": {
        "rtd": {
          "enabled": true,
          "api_key": "<your ZeroGPU API key>",
          "timeout_ms": 2000,
          "cache_ttl_seconds": 86400,
          "min_score": 0.5
        }
      }
    },
    "host_execution_plan": {
      "endpoints": {
        "/openrtb2/auction": {
          "stages": {
            "processed_auction_request": {
              "groups": [
                {
                  "timeout": 10,
                  "hook_sequence": [
                    {
                      "module_code": "zerogpu.rtd",
                      "hook_impl_code": "zerogpu-rtd-processed-auction-request"
                    }
                  ]
                }
              ]
            }
          }
        }
      }
    }
  }
}
```

{: .alert.alert-info :}
The group `timeout` only has to cover an in-memory cache read, so a small value
is correct. It is unrelated to `timeout_ms`, which bounds the background
warm-up and never applies to the auction path.

### Account-level activation

To run the module only for specific accounts, either place the execution plan in
the account config, or keep it host-level and restrict it with
`account_filter.allow_list`:

```yaml
hooks:
  modules:
    zerogpu:
      rtd:
        enabled: true
        api_key: ${ZEROGPU_API_KEY}
        account_filter:
          allow_list: ["1001", "1002"]
```

### Configuration parameters

{: .table .table-bordered .table-striped }

| Parameter | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | yes | `false` | Enables the module. |
| `api_key` | string | yes | - | ZeroGPU API key, sent as the `x-api-key` header. |
| `endpoint` | string | no | `https://api.zerogpu.ai/v1/responses` | Classification endpoint. Overridable for a different region or a proxy; the Responses API request and response shape is assumed. |
| `model` | string | no | `zlm-v1-iab-domain-classifier` | Model to classify with. |
| `timeout_ms` | int | no | `2000` | HTTP timeout for a background classification call. Never applies to the auction path. |
| `cache_ttl_seconds` | int | no | `86400` | How long a successful classification is cached. |
| `negative_cache_ttl_seconds` | int | no | `300` | How long an empty result or a stable failure (400/401/403/420) is cached. |
| `retry_cache_ttl_seconds` | int | no | `30` | How long a transient failure (timeout, 5xx) is cached before retrying. |
| `cache_size` | int | no | `10485760` | Cache size in bytes. Minimum 524288. |
| `min_score` | float | no | `0.5` | Minimum confidence a category must have to be emitted. |
| `max_segments` | int | no | `0` | Maximum segments per taxonomy. `0` means unlimited. |
| `data_provider_name` | string | no | `zerogpu.ai` | Value written to the `name` field of each injected data object. |
| `enrich_content_1_0` | boolean | no | `false` | Also emit IAB Content Taxonomy 1.0 codes under `ext.segtax: 1`. |
| `enrich_user_audience` | boolean | no | `false` | Also emit IAB Audience Taxonomy 1.1 segments to `user.data` under `ext.segtax: 4`. See [Privacy](#privacy). |
| `account_filter.allow_list` | list of strings | no | `[]` | Account IDs permitted to use the module. Empty means all accounts. |

## How the request is enriched

### Cache warming

On each auction the module looks the domain up in its local cache:

* **Hit** - the segments are attached. No I/O.
* **Miss** - the auction returns unenriched, and a background warm-up fetches
  the classification and caches it for `cache_ttl_seconds` (24h by default).

Concurrent auctions for the same uncached domain collapse onto a single
outbound request, so a burst of traffic on a new domain does not produce a
burst of API calls.

The practical cost of this design is that the first impressions on a
newly-seen domain go unenriched - roughly the duration of one classification
call. After that the domain is cached for 24 hours.

### Domain resolution

The domain is taken from the first usable value of:

1. `site.domain`
2. `site.page` (the hostname is parsed out of the URL)
3. `site.publisher.domain`
4. `app.domain`
5. `app.bundle`
6. `app.publisher.domain`
7. `dooh.domain`
8. `dooh.publisher.domain`

Values carrying no domain signal - `localhost`, bare IP addresses, numeric iOS
store IDs - are skipped. If nothing resolves, the module does nothing.

The value is then normalized so that every spelling of a site shares one cache
entry: the scheme, path, query, port and any trailing dot are dropped, case is
folded, and a leading `www.`, `m.` or `amp.` is removed. So
`https://AMP.Example.com/article?x=1` and `example.com` are one entry, not two.

Other subdomains are preserved - `blog.example.com` is classified separately
from `example.com`, because they host different content. A variant prefix is
only stripped when at least two labels remain, so `amp.dev` stays `amp.dev`.

### Injected data

Given a classification of `coursera.com`, the module appends:

```json
{
  "site": {
    "content": {
      "data": [{
        "name": "zerogpu.ai",
        "ext": { "segtax": 6 },
        "segment": [{ "id": "132" }, { "id": "148" }]
      }]
    }
  }
}
```

Existing `content.data` entries are preserved. Enrichment is idempotent: if a
data object from the same provider already exists for a taxonomy, nothing is
appended.

Taxonomy identifiers follow the
[IAB segtax registry](https://github.com/InteractiveAdvertisingBureau/openrtb/blob/main/extensions/community_extensions/segtax.md)
and Prebid's [Segments and Taxonomy](/features/firstPartyData.html#segments-and-taxonomy)
table:

{: .table .table-bordered .table-striped }

| segtax | Taxonomy | ORTB location | Enabled by |
| --- | --- | --- | --- |
| 6 | IAB Content Taxonomy 2.2 | `{site,app,dooh}.content.data` | on by default |
| 1 | IAB Content Taxonomy 1.0 (deprecated) | `{site,app,dooh}.content.data` | `enrich_content_1_0` |
| 4 | IAB Audience Taxonomy 1.1 | `user.data` | `enrich_user_audience` |

{: .alert.alert-info :}
If the publisher sets `ext.prebid.data.bidders`, Prebid Server's First Party
Data processing removes `site.content.data` and `user.data` from the global
request and redistributes them to the listed bidders only. This is core
behaviour, not module behaviour, but it determines which bidders see the
injected segments.

## Privacy

The default configuration sends only a domain to ZeroGPU and writes only
contextual data. No user identifiers, device data, or geographic information
leave Prebid Server, and nothing is written to user-scoped ORTB fields. Under
the default configuration the module has no user privacy implications, so no
TCF-EU, CCPA, USNat, or TCF-CA handling is required.

`enrich_user_audience` is off by default and should stay off unless the host has
made a deliberate decision. When enabled, IAB Audience Taxonomy segments are
written to `user.data`. Two caveats:

1. The segments are inferred from the domain, not observed from the user.
   Publishing them under `user.data` presents contextual inference as audience
   data.
2. Prebid requires a module supplying user-level data to check the `enrichUfpd`
   [Activity Control](/prebid-server/features/pbs-activitycontrols.html). PBS-Go
   does not currently expose activity controls to modules, so the module cannot
   perform that check on the host's behalf.

The module does not create bids and does not add pixels to creatives.

## Analytics Tags

Each invocation emits one activity named `zerogpu-rtd-domain-classification`:

{: .table .table-bordered .table-striped }

| Outcome | Activity status | Result status | Values |
| --- | --- | --- | --- |
| Segments injected | `success` | `modify` | `domain`, `content_2_2_count`, `content_1_0_count`, `audience_count` |
| Nothing to inject | `success` | `allow` | `reason` |

Because classification happens off the auction path, a failed warm-up is not
attributable to any one auction. Warm-up failures are logged instead: `warn` for
a rejected domain, `error` for an authentication or quota problem, and `info`
for transient failures.

## Troubleshooting

Send an auction request with `"test": 1` and `ext.prebid.trace: "verbose"` and
inspect `ext.prebid.modules` in the response.

{: .table .table-bordered .table-striped }

| Symptom | Likely cause |
| --- | --- |
| Analytics `reason` is `no domain available on the request` | Neither `site`, `app`, nor `dooh` carried a usable domain. |
| Analytics `reason` is `domain not yet cached; warming in the background` | Expected on the first auctions for a domain. If it persists, the warm-up is failing - check the server log. |
| Analytics `reason` is `no categories available for this domain` | Either the classifier returned nothing above `min_score`, or a warm-up failure is being suppressed by the negative cache. |
| Log reports status 401 or 403 | The `api_key` is invalid or lacks access to the model. |
| Log reports status 420 | The ZeroGPU quota is exhausted. |
| A domain never becomes enriched | Warm-ups are failing. Failures are negative-cached, so check the log rather than the auction trace. |

## Support

<prebid@zerogpu.ai>

## Further Reading

* [Prebid Server Module List](/prebid-server/pbs-modules/index.html)
* [Building a Prebid Server Module](/prebid-server/developers/add-a-module.html)
* [Prebid Server First Party Data](/prebid-server/features/pbs-fpd.html)
* [Segments and Taxonomy](/features/firstPartyData.html#segments-and-taxonomy)
