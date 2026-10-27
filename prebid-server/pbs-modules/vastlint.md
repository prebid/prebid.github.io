---
layout: page_v2
title: Prebid Server VASTlint Video Markup Validation Module
display_name: VASTlint Video Markup Validation Module
description: Validate the VAST inside video bids as they return from bidders, annotate or drop them
sidebarType: 5
---

# VASTlint Video Markup Validation Module
{:.no_toc}

* TOC
{:toc}

## Overview

The VASTlint module validates the VAST, VMAP or DAAST markup of every video bid at the `raw_bidder_response` stage, inside the Prebid Server process, using the [vastlint](https://vastlint.org) rule set (246 rules covering IAB VAST 2.0 through 4.3 and the 4.4 draft, VMAP 1.0, DAAST 1.0, SIMID, Open Measurement and the CTV Addendum 2024). It can validate off the bid path (async mode, recommended), report findings on the bid path (monitor mode), or drop bids that trip chosen rules (reject mode). Findings are delivered through analytics tags and, in monitor and reject modes, through `bid.ext.vastlint`.

No external service is involved and no network call is made. Only bids with `BidType` video or `bid.mtype` 2 whose markup is UTF-8 XML within a configured size reach the engine; URL markup, oversized, non-XML and non-UTF-8 markup are counted and kept. An engine failure or a hook timeout never removes a bid.

Maintainer contact: [dev@vastlint.org](mailto:dev@vastlint.org). Source and issues: [aleksUIX vastlint GitHub repo](https://github.com/aleksUIX/vastlint).

## Prerequisites

None. The module is built into Prebid Server (PBS-Go) and runs the vastlint engine compiled to WebAssembly through wazero, a pure Go runtime, on amd64 and arm64. `CGO_ENABLED=0` builds work.

Hosts that want native speed can build with the native library instead:

```bash
go build -tags vastlint_cgo
```

This needs `libvastlint` and its header on the build host, found with `pkg-config vastlint`; both are published with every [vastlint release](https://github.com/aleksUIX/vastlint/releases). Findings are identical on both engines.

## Setup

Enable the module and place its hook in the execution plan:

```yaml
hooks:
  enabled: true
  modules:
    vastlint:
      validation:
        enabled: true
        mode: async
        cache_size: 33554432
  host_execution_plan:
    endpoints:
      /openrtb2/auction:
        stages:
          raw_bidder_response:
            groups:
              - timeout: 20
                hook_sequence:
                  - module_code: vastlint.validation
                    hook_impl_code: vastlint-raw-bidder-response
```

In JSON:

```json
{
  "hooks": {
    "enabled": true,
    "modules": {"vastlint": {"validation": {"enabled": true, "mode": "async", "cache_size": 33554432}}},
    "host_execution_plan": {
      "endpoints": {
        "/openrtb2/auction": {
          "stages": {
            "raw_bidder_response": {
              "groups": [
                {
                  "timeout": 20,
                  "hook_sequence": [
                    {"module_code": "vastlint.validation", "hook_impl_code": "vastlint-raw-bidder-response"}
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

The hook group timeout is the budget for validating all video bids of one bidder response in monitor and reject modes. When it is exceeded the framework discards the whole hook result for that bidder response (annotations, drops and analytics tags), so reject mode is best effort under timeout; the cost of one creative grows with its size and element count, about 0.1 ms per KB of dense markup on the default engine, which `max_document_bytes` bounds. Async mode returns in microseconds and is not affected.

Give the module its own group, after any module that also replaces the bid list (`prebid.ortb2blocking` does): hooks in one group run concurrently on the same payload and the later change set replaces the earlier one's bids.

## Configuration

{: .table .table-bordered .table-striped }
| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `enabled` | boolean | false | Turns the module on. |
| `mode` | string | `monitor` | `async`, `monitor` or `reject`. See Modes. |
| `reject_on` | list of strings | empty | Rule ids that drop a bid in reject mode. Empty drops nothing. Matched case-insensitively. |
| `rules` | list or object | empty | Rule level overrides to `error`, `warning`, `info` or `off`. In YAML or environment configuration use the list form `["VAST-2.0-adsystem-no-version=off"]`, since those loaders lowercase keys and split them on dots; in JSON and account configuration an object keyed by rule id also works. |
| `max_document_bytes` | integer | 262144 | Larger creatives are skipped and kept. |
| `sample_percent` | integer | 100 | Share of eligible bids validated in monitor and async modes. Reject mode checks every bid. |
| `annotate_bids` | boolean | true | Write the summary to `bid.ext.vastlint` (monitor and reject modes). |
| `annotate_rules` | boolean | true | Include the rule ids in that summary. |
| `cache_size` | integer | 0 | Verdict cache size in bytes. 32 MiB (33554432) holds about 100k verdicts; set it in production. |
| `cache_ttl_seconds` | integer | 600 | How long a cached verdict stays valid. |
| `async_queue` | integer | 4096 | Async mode: creatives waiting for off-path validation. |
| `async_queue_bytes` | integer | 67108864 | Async mode: markup held by that queue, in bytes. Must be at least `max_document_bytes`. |
| `pool_size` | integer | GOMAXPROCS | Engine instances; off-path workers use at most half of them. |
| `report_interval_seconds` | integer | 0 | How often the module logs its counters (off-path totals, cache hit rate) when they changed. 0 is off. |

Unknown rule ids in `rules` or `reject_on` fail startup. Rule ids and their default levels are listed at [vastlint.org/docs/rules](https://vastlint.org/docs/rules).

### Account-level configuration

An account may override `mode`, `reject_on`, `rules`, `sample_percent`, `annotate_bids` and `annotate_rules`:

```json
{
  "hooks": {
    "modules": {
      "vastlint": {
        "validation": {
          "mode": "reject",
          "reject_on": ["VAST-2.0-parse-error", "VAST-2.0-inline-impression"]
        }
      }
    }
  }
}
```

Account `rules` are merged over the host's per rule id; the other fields replace the host value. An invalid account override, or one naming a rule the engine does not have, is reported as a hook warning and the host configuration applies to that request.

## Modes

* **async** (recommended): the hook queues each eligible creative and returns at once; workers validate after the auction has moved on. Nothing on the bid changes and the hook never waits for the engine. With the cache on, the next sighting of the same creative is reported with its verdict in the analytics tags.
* **monitor**: validate on the bid path, annotate each checked bid with `bid.ext.vastlint`, report through analytics tags. Nothing is removed.
* **reject**: as monitor, and a bid whose findings include any rule in `reject_on` is removed from the bidder response. Only listed rules drop bids; an invalid document with no listed rule is kept and annotated. The module never rejects a whole response.

## Analytics tags

Each hook result carries one activity named `vast_validation` with one result per video bid:

{: .table .table-bordered .table-striped }
| Field | Values |
| --- | --- |
| activity `status` | `success`; `error` when no eligible bid could be validated |
| result `status` | `success-modify` when the bid was annotated, `success-allow` when it was checked, queued or skipped, `success-block` when it was dropped, `error` when the engine failed on it |
| `values.action` | `checked`, `dropped`, `skipped_url`, `skipped_size`, `skipped_not_xml`, `skipped_not_utf8`, `sampled_out`, `engine_error`, `queued`, `queue_full` |
| `values.valid` | true when the creative has no error-level finding (checked and dropped bids) |
| `values.input_status` | `supported`, `unsupported` or `malformed` |
| `values.document_type`, `values.document_version` | `VAST`, `VMAP` or `DAAST` and the declared version |
| `values.errors`, `values.warnings`, `values.infos` | finding counts by severity |
| `values.rules` | the distinct rule ids that fired |
| `values.cache` | `hit` or `miss`, when the cache is on |
| `appliedto` | `bidder`, `bidids`, `impids` |

Every analytics adapter the host runs receives these tags.

## Bid extension

Kept bids in monitor and reject modes carry the same summary on the bid:

```json
"ext": {
  "vastlint": {
    "valid": false,
    "input_status": "supported",
    "document_type": "VAST",
    "document_version": "4.2",
    "errors": 1,
    "warnings": 3,
    "infos": 0,
    "rules": ["VAST-2.0-inline-impression", "VAST-2.0-adsystem-no-version"],
    "engine_version": "0.16.2"
  }
}
```

`engine_version` is the engine whose rule catalog produced the verdict. A `vastlint` key that a bidder put in `ext` itself is removed in every mode, so a verdict in the response can only come from this module.

## Metrics and logs

The framework's module metrics (`modules_vastlint_validation_*` under the host's metrics namespace: calls, duration, update, no-op and reject outcomes, errors, timeouts) need no extra wiring. The module logs one line at startup with the engine kind, version and effective configuration, and, when `report_interval_seconds` is set, the off-path totals and the cache hit rate at that interval. Dropped bids appear in the debug trace when the request runs with debug enabled.

## Verdict cache

Production creatives repeat heavily, so the verdict cache serves most bids without engine time. The key is a hash of the creative, the effective rule overrides and the engine version; the value is the summary only, never markup. Cached verdicts behave exactly like fresh ones: they annotate bids and, in reject mode, drop them.

## Privacy

The module reads only the creative markup of video bids and the bidder code. It does not read the request, user, device or geo objects, carries no identifiers, makes no network calls, and stores nothing but verdict summaries keyed by a hash of the markup. Markup is never logged. The activity controls for user data do not apply.

## Maintainer

[vastlint](https://vastlint.org) maintainers, [dev@vastlint.org](mailto:dev@vastlint.org). Module source: [modules/vastlint/validation](https://github.com/prebid/prebid-server/tree/master/modules/vastlint/validation).
