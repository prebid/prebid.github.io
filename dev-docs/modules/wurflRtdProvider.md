---
layout: page_v2
title: WURFL RTD Provider Module
display_name: WURFL RTD Module
description: WURFL Real Time Data Module
page_type: module
module_type: rtd
module_code : wurflRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

{: .alert.alert-warning :}
This module loads a dynamically generated JavaScript from prebid.wurflcloud.com

# WURFL RTD Submodule
{:.no_toc}

* TOC
{:toc}

## Description

The WURFL RTD module enriches Prebid.js bid requests with comprehensive device detection data, helping publishers maximize ad revenue through better device targeting. Publishers typically see improved CPM performance, particularly for mobile traffic where device signals provide valuable bidding context.

The WURFL RTD module relies on localStorage caching and local client-side detection, providing instant device enrichment on every page load.

The module enriches `ortb2.device` with complete device information and adds extended WURFL capabilities to `device.ext.wurfl`, ensuring all bidder adapters have immediate access to enriched device data.

### Key Features

* **Instant Device Enrichment**: Device data is available immediately without auction delays
  * First-time visitors: Instant basic device detection using Local Client-side Enrichment (LCE)
  * Returning visitors: Full WURFL data from localStorage cache
  * WURFL.js loads asynchronously in the background to refresh cache for future page loads

* **Comprehensive Device Detection**: Enriches `ortb2.device` with complete device information including:
  * Standard OpenRTB 2.0 device fields: `make`, `model`, `devicetype`, `os`, `osv`, `ppi`, `pxratio`
  * Full iPhone and iPad model recognition in `ortb2.device.hwv` (e.g., "iPhone 16 Pro", "iPad Pro 12.9-inch")

* **Bot Detection**: Provides `is_robot` capability in `device.ext.wurfl` for easy bot filtering
  * Additional `robot_family` capability available in paid tiers to identify specific bot types (Googlebot, Bingbot, etc.)

* **Free Tier Available**: Full WURFL device enrichment for publishers. High-traffic sites and SSPs should contact ScientiaMobile to enable more properties and unlock volume.

### Extended Capability Set

At a minimum, all adapters receive these WURFL capabilities:

* `brand_name`
* `model_name`
* `is_ott`
* `physical_form_factor`
* `is_console`
* `resolution_height`
* `resolution_width`
* `density_class`
* `is_full_desktop`
* `device_os`
* `device_os_version`
* `form_factor`
* `advertised_device_os`
* `advertised_device_os_version`
* `pixel_density`
* `is_robot`
* `complete_device_name`
* `is_mobile`
* `advertised_browser`
* `advertised_browser_version`

Publishers, SSPs and demand partners with a commercial license can receive up to 500+ additional [WURFL device capabilities](https://www.scientiamobile.com/capabilities/?products%5B%5D=wurfl-js) based on their licensing agreement, including:

* Detailed iOS device models (specific iPhone/iPad variants)
* Physical device dimensions and screen properties
* Device pricing and release information
* Browser and OS version details
* Bot family identification (paid tier)

### User-Agent Client Hints Support

WURFL.js is fully compatible with Chromium's User-Agent Client Hints (UA-CH). If the User-Agent string is generic and Client Hints are not available, the service automatically requests and obtains [high entropy client hint values](https://wicg.github.io/ua-client-hints/#getHighEntropyValues) from the client.

For optimal performance, publishers should explicitly opt-in and declare User-Agent Client Hints support on their website. See the [UA-CH implementation documentation](https://docs.scientiamobile.com/guides/implementing-useragent-clienthints) for details.

## SSP/DSP Integration (IMPORTANT)

While the WURFL RTD module enriches the OpenRTB 2.0 payload, SSP adapters must access and pass this information to their auction endpoints. The endpoint must then utilize the enriched device data in its bidding logic.

### Integration Scenarios

| SSP Adapter Status | Required Adapter Changes | Required Server Changes |
|-------------------|--------------------------|-------------------------|
| Already passing ORTB2 device to server | No changes required | Update backend logic to utilize device data |
| Not currently passing device data | Update adapter to read `device` and/or `device.ext.wurfl` and pass to endpoint | Update backend logic to utilize device data |
| No Bidder Adapter exists | Implement Prebid.js adapter to read and pass `device` and/or `device.ext.wurfl` | Implement endpoint logic to read and utilize data |

## Building the Module

To build the WURFL RTD module with Prebid.js:

```bash
gulp build --modules="wurflRtdProvider,appnexusBidAdapter,..."
```

## Configuration

The module is configured within `realTimeData.dataProviders`.

### Basic Configuration

```javascript
pbjs.setConfig({
  realTimeData: {
    dataProviders: [{
      name: 'wurfl'
    }]
  }
});
```

### Configuration Parameters

{: .table .table-bordered .table-striped }

| Name | Type | Description | Default |
|------|------|-------------|---------|
| `name` | String | Real time data module name | Always 'wurfl' |
| `params` | Object | Configuration parameters | |
| `params.altHost` | String | Alternate host to connect to WURFL.js | |
| `params.abTest` | Boolean | Enable A/B testing mode | `false` |
| `params.abName` | String | A/B test name identifier | `'unknown'` |
| `params.abSplit` | Number | Fraction of users in treatment group (0-1) | `0.8` |

## Testing

To test the WURFL RTD module locally:

```bash
gulp serve --modules=wurflRtdProvider,appnexusBidAdapter
```

Then navigate to:

```sh
http://localhost:9999/integrationExamples/gpt/wurflRtdProvider_example.html
```

## Example Enriched Bid Request

WURFL RTD adds comprehensive device information to the bid request. The `ortb2.device` object is enriched with standard OpenRTB fields, and `device.ext.wurfl` contains extended WURFL capabilities:

```json
{
  "id": "1edd88d3-12c6-40b2-a80b-138e276b4553",
  "at": 1,
  "site": {...},
  "device": {
    "w": 1170,
    "h": 2532,
    "dnt": 0,
    "ua": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3 Mobile/15E148 Safari/604.1",
    "language": "it",
    "make": "Apple",
    "model": "iPhone 16e",
    "devicetype": 1,
    "os": "iOS",
    "osv": "18.3",
    "hwv": "iPhone 16e",
    "ppi": 456,
    "pxratio": 3.0,
    "js": 1,
    "ext": {
      "vpw": 980,
      "vph": 1429,
      "wurfl": {
        "wurfl_id": "apple_iphone_ver18_3_subhw16e",
        "advertised_browser": "Mobile Safari",
        "advertised_browser_version": "18.3",
        "advertised_device_os": "iOS",
        "advertised_device_os_version": "18.3",
        "ajax_support_javascript": true,
        "brand_name": "Apple",
        "complete_device_name": "Apple iPhone 16e",
        "density_class": "3.0",
        "form_factor": "Smartphone",
        "is_app_webview": false,
        "is_connected_tv": false,
        "is_full_desktop": false,
        "is_mobile": true,
        "is_ott": false,
        "is_phone": true,
        "is_robot": false,
        "is_smartphone": true,
        "is_smarttv": false,
        "is_tablet": false,
        "manufacturer_name": "",
        "marketing_name": "",
        "max_image_height": 568,
        "max_image_width": 320,
        "model_name": "iPhone 16e",
        "physical_screen_height": 141,
        "physical_screen_width": 65,
        "pixel_density": 456,
        "pointing_method": "touchscreen",
        "resolution_height": 2532,
        "resolution_width": 1170
      }
    }
  }
}
```

### Extended Capabilities in `device.ext.wurfl`

Licensed SSPs can receive up to 500+ additional capabilities based on their subscription, including:

**Device Identification:**

* `wurfl_id`: Unique WURFL device identifier
* `complete_device_name`: Full commercial device name
* `brand_name`: Device brand
* `model_name`: Device model
* `marketing_name`: Commercial marketing name

**Form Factor Detection:**

* `form_factor`: Device category (Smartphone, Tablet, Desktop, etc.)
* `is_mobile`, `is_smartphone`, `is_tablet`: Boolean form factor flags
* `is_full_desktop`, `is_connected_tv`, `is_smarttv`: Additional form factors

**Bot Detection:**

* `is_robot` (Boolean): Available to all publishers - simple true/false bot identification
* `robot_family` (Categorical): Paid tier feature - identifies specific bot types (Spider, Previewer, Fetcher, Health-Checker, Adbot, Headless Browser) for granular filtering and analytics

**Browser & OS:**

* `advertised_browser`, `advertised_browser_version`
* `advertised_device_os`, `advertised_device_os_version`

**Physical Properties:**

* `physical_screen_height`, `physical_screen_width`: Physical dimensions in mm
* `resolution_height`, `resolution_width`: Screen resolution in pixels
* `pixel_density`: Pixels per inch
* `pointing_method`: Input method (touchscreen, stylus, mouse, etc.)

For a complete list of available capabilities, see [WURFL Capabilities Documentation](https://www.scientiamobile.com/capabilities/?products%5B%5D=wurfl-js).

## A/B Testing with ScientiaMobile

The WURFL RTD module includes built-in A/B testing capabilities to help publishers measure the impact of device enrichment on their revenue. When enabled, the module randomly assigns users to treatment (enriched) or control (not enriched) groups.

ScientiaMobile can assist with setting up and analyzing A/B tests to quantify the value of WURFL enrichment for your specific inventory. Contact [ScientiaMobile](https://www.scientiamobile.com/contact/) to discuss A/B testing collaboration.

## Getting Started

1. **Build** Prebid.js with the WURFL RTD module
2. **Configure** the module in your Prebid.js setup
3. **Test** locally to verify enrichment

## Privacy & Compliance

The WURFL RTD module processes minimal personal data under legitimate interest for technical service delivery:

* Device detection uses only HTTP headers (User-Agent, Client Hints)
* No user tracking or cross-site identification
* IP addresses processed transiently for service delivery only

For questions or support, visit [ScientiaMobile Support](https://support.scientiamobile.com).
