---
layout: page_v2
title: Scope3 RTD Provider
display_name: Scope3 RTD Provider
description: Scope3 Real-Time Data Provider for Prebid.js
page_type: module
module_type: rtd
module_code: scope3RtdProvider
enable_download: true
vendor_specific: true
sidebarType: 1
---

# Scope3 RTD Provider

The Scope3 RTD (Real-Time Data) Provider enables publishers to leverage Scope3's Agentic Execution Engine (AEE) for real-time media buying optimization. This module sends complete OpenRTB requests to Scope3 and receives contextual signals that enhance auction targeting.

{:.no_toc}

* TOC
{:toc}

## Overview

The Scope3 RTD Provider:

* Sends complete OpenRTB 2.x requests including extended UIDs, geo data, and device information
* Receives AEE signals for include/exclude targeting and macros
* Supports bidder-specific segments and deal IDs
* Enables configurable GAM targeting keys
* Works client-side without API keys

## Usage

### Basic Configuration

```javascript
pbjs.setConfig({
    realTimeData: {
        auctionDelay: 100,
        dataProviders: [{
            name: "scope3",
            waitForIt: true,
            params: {
                orgId: "your-org-id"
            }
        }]
    }
});
```

### Full Configuration

```javascript
pbjs.setConfig({
    realTimeData: {
        auctionDelay: 200,
        dataProviders: [{
            name: "scope3",
            waitForIt: true,
            params: {
                orgId: "your-org-id",
                endpoint: "<https://prebid.scope3.com/prebid>",
                timeout: 1500,
                bidders: ["appnexus", "rubicon", "pubmatic"],
                includeKey: "scope3_include",
                excludeKey: "scope3_exclude",
                macroKey: "scope3_macro",
                publisherTargeting: true,
                advertiserTargeting: true,
                cacheEnabled: true,
                cacheTtl: 300000
            }
        }]
    }
});
```

## Configuration Parameters

{: .table .table-bordered .table-striped }

| Name | Type | Required | Description |
|------|------|----------|-------------|
| orgId | String | Yes | Your Scope3 organization ID |
| endpoint | String | No | API endpoint (default: `https://prebid.scope3.com/prebid`) |
| timeout | Number | No | Request timeout in milliseconds (default: 1000) |
| bidders | Array | No | List of bidders to target (default: all auction bidders) |
| includeKey | String | No | GAM targeting key for include signals (default: "scope3_include") |
| excludeKey | String | No | GAM targeting key for exclude signals (default: "scope3_exclude") |
| macroKey | String | No | GAM targeting key for macro data (default: "scope3_macro") |
| publisherTargeting | Boolean | No | Enable publisher-level targeting (default: true) |
| advertiserTargeting | Boolean | No | Enable advertiser-level targeting (default: true) |
| cacheEnabled | Boolean | No | Enable response caching (default: true) |
| cacheTtl | Number | No | Cache TTL in milliseconds (default: 300000) |

## Response Format

The Scope3 AEE returns signals in this format:

```json
{
  "aee_signals": {
    "include": ["sports_fan", "auto_intender"],
    "exclude": ["competitor_exposed"],
    "macro": "eyJjb250ZXh0IjogImhpZ2hfdmFsdWUifQ==",
    "bidders": {
      "appnexus": {
        "segments": ["seg1", "seg2"],
        "deals": ["DEAL123"]
      },
      "rubicon": {
        "segments": ["seg3"],
        "deals": []
      }
    }
  }
}
```

## GAM Integration

### Line Item Setup

Create GAM line items with key-value targeting using the configured keys:

**Include Targeting:**

* Key: `scope3_include` (or your configured includeKey)
* Values: `sports_fan`, `auto_intender`, etc.
* Operator: "is any of"

**Exclude Targeting:**

* Key: `scope3_exclude` (or your configured excludeKey)
* Values: `competitor_exposed`, etc.
* Operator: "is none of"

**Macro Targeting:**

* Key: `scope3_macro` (or your configured macroKey)
* Values: Base64-encoded contextual data

### Example Line Item Configuration

```text
Creative: 300x250 Banner
Targeting:
  * scope3_include is any of "sports_fan", "auto_intender"
  * scope3_exclude is none of "competitor_exposed"
  * scope3_macro is "eyJjb250ZXh0IjogImhpZ2hfdmFsdWUifQ=="
```

## Data Flow

1. **Request**: Module sends complete OpenRTB request to Scope3 including:
   * All extended user IDs
   * Geo and device data
   * Ad unit configurations
   * Bidder list

2. **Processing**: Scope3's AEE analyzes the request context

3. **Response**: AEE returns targeting signals:
   * Global include/exclude segments
   * Bidder-specific segments and deals
   * Contextual macro data

4. **Application**: Module applies signals to bid request:
   * Global targeting in `ortb2Fragments.global.site.ext.data`
   * Bidder segments in `ortb2Fragments.bidder[].user.data`
   * Deal IDs in ad unit `ortb2Imp.ext`

## Testing

### Integration Testing

Use the Hello World example to verify integration:

1. Configure the module with your orgId
2. Monitor network requests to confirm data is sent
3. Check that targeting data appears in bid requests
4. Verify GAM line items receive the targeting keys

### Debug Mode

Enable Prebid debug mode to see targeting data:

```javascript
pbjs.debug = true;
```

Check the browser console for RTD provider logs and bid request modifications.

## Privacy Considerations

The Scope3 RTD Provider:

* Respects user consent choices
* Only processes data necessary for contextual targeting
* Does not store personal information
* Complies with privacy regulations when properly configured

## Support

For questions about the Scope3 RTD Provider:

* Technical issues: Open a GitHub issue in the Prebid.js repository
* Integration support: Contact your Scope3 representative
* Documentation: Submit PRs to improve this documentation

## Related Modules

* [Real-Time Data Module]({{site.baseurl}}/dev-docs/modules/realTimeData.html)
* [RTD Sub-Module Development]({{site.baseurl}}/dev-docs/add-rtd-submodule.html)
