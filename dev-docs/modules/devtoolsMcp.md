---
layout: page_v2
page_type: module
title: Module - DevTools MCP
description: Exposes live Prebid.js runtime state as Chrome DevTools third-party developer tools, so an AI agent can inspect auctions, bids, events, modules and config
module_code : devtoolsMcp
display_name : DevTools MCP
enable_download : true
min_js_version: 11.29.0
sidebarType : 1
---

# DevTools MCP Module
{: .no_toc}

- TOC
{:toc }

## Overview

This module exposes Prebid.js runtime state as Chrome DevTools [third-party developer tools](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/third-party-developer-tools.md). An agent driving Chrome, for example through [chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp), can then inspect a page's live Prebid state: auctions, bid eligibility, TTL and cache expiry, floors, event timing, installed modules and configuration.

The tools are registered in a group named **Prebid.js DevTools**. They are read-only: they report on Prebid state and never modify it.

## How it is loaded

Publishers usually do not need to build or install anything.

- **On demand (default):** Prebid.js core watches for debug mode, turned on with `?pbjs_debug=true` in the page URL or with `pbjs.setConfig({debug: true})`. The first time debug mode is on, if the module is not compiled into the build, Prebid loads `devtoolsMcp-standalone.js` from the dist URL base. This works the same way as the on-demand loading of the [Debugging module](/dev-docs/modules/debugging.html).
- **Compiled in:** if the module is included in the build, the tools are registered as soon as Prebid loads, regardless of the debug setting.

```bash
gulp build --modules=devtoolsMcp
```

The dist URL base defaults to `https://cdn.jsdelivr.net/npm/prebid.js@<version>/dist/chunks/`. It can be changed at build time with `--distUrlBase`. If your site uses a Content Security Policy and you want the on-demand path to work in debug mode, allow scripts from that location.

## Using it with an agent

Chrome third-party developer tools are experimental. While that remains the case:

1. Start the Chrome DevTools MCP server with `--categoryExperimentalThirdParty=true`. Without it, the server does not expose the `list_3p_developer_tools` and `execute_3p_developer_tool` tools, and page-provided tools are invisible.
2. Tell your agent the feature exists, for example by including a link to the [third-party developer tools guide](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/third-party-developer-tools.md) in your prompt. Agents generally will not look for page-provided tools on their own.

Example MCP client configuration:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": [
        "-y",
        "chrome-devtools-mcp@latest",
        "--categoryExperimentalThirdParty=true"
      ]
    }
  }
}
```

Then open a page running Prebid with debug mode on and ask questions such as:

- "Which bidders won the last auction, and at what CPM?"
- "Were any bids rejected? If so, why?"
- "List the Prebid events for auction `<auctionId>`, in order."
- "Which Prebid modules are installed, and what does the current config look like?"

If the agent cannot find the Prebid tools, check that debug mode is on, that the MCP server was started with `--categoryExperimentalThirdParty=true`, and that the request for `devtoolsMcp-standalone.js` did not fail in the network panel.

### Agent skills

The Prebid.js repository includes agent skills that build on these tools:

- [prebid-chrome-devtools](https://github.com/prebid/Prebid.js/tree/master/.agents/skills/prebid-chrome-devtools): installing and configuring chrome-devtools-mcp for Prebid, discovering the tools, and diagnosing auctions with them.
- [prebid-best-practices](https://github.com/prebid/Prebid.js/tree/master/.agents/skills/prebid-best-practices) (added in Prebid.js 11.42.0): audits a live page for GPID on bid requests, relevant consent management modules and positive bid floors, using the tools together with network evidence.

## Tools

Every tool accepts an optional `instance` parameter that restricts results to one Prebid instance, and every result is tagged with an `instance` field.

{: .table .table-bordered .table-striped }

| Tool | Parameters | Returns |
| --- | --- | --- |
| `summary` | `instance` | One summary per Prebid instance: version, installed modules, config snapshot, counts (auctions, events, ad units, bid requests, bids received, no-bids, winning bids), per-bidder bid/no-bid/win counts, and the latest auction. |
| `auctions` | `instance`, `auctionId` | Auction-level detail: status and timing, ad unit codes, eligible bid requests, received bids (CPM, currency, media type, TTL and cache expiry, floors, targeting usability, rejection reason, metrics), no-bids, rejected bids, winning bids and seat non-bids. All tracked auctions are returned unless `auctionId` is given. |
| `events` | `instance`, `auctionId`, `eventType`, `limit` | Prebid event history in chronological order, with event type, timing and arguments. `eventType` filters by event name, such as `auctionInit`, `bidResponse` or `bidWon`. `limit` (default 100) returns the most recent records across all selected instances; `0` returns no records. |

Results are sanitized before they are returned, so function values and non-serializable objects do not break tool execution. Returned config, bid and event data may still be sensitive.

## Multiple Prebid instances

One set of tools is registered no matter how many Prebid instances are on the page. The `instance` value is the instance's global variable name, or `unnamed-<n>` when the build defines no global. Results are combined across all instances unless an `instance` filter is passed.

## Further Reading

- [Troubleshooting Guide](/troubleshooting/troubleshooting-guide.html)
- [Debugging module](/dev-docs/modules/debugging.html)
- [Module readme in Prebid.js](https://github.com/prebid/Prebid.js/blob/master/modules/devtoolsMcp.md)
