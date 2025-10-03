---
layout: page_v2
page_type: pbs-module
title: WURFL Device Detection Module
display_name : WURFL Device Detection
sidebarType : 5
---

# WURFL Device Detection Module
{: .no_toc}

* TOC
{:toc}

## Overview

The WURFL Device Detection Module for Prebid Server enriches an incoming OpenRTB request with comprehensive device detection data powered by [ScientiaMobile's WURFL device detection framework](https://www.scientiamobile.com/wurfl-overview/). The module provides accurate and comprehensive device-related information, enabling bidders to make better-informed targeting and optimization decisions.

The module operates using WURFL's on-premise device detection. For PBS-Java, it uses the WURFL OnSite Java API, while PBS-Go uses the WURFL Infuze API. The module operates fully autonomously and does not make any requests to any cloud services in real time to do device detection.

## Key Features

### Device Field Enrichment

The WURFL module populates **missing or empty fields** in `ortb2.device` with the following data:

* `make`: Manufacturer of the device (e.g., "Apple", "Samsung")
* `model`: Device model (e.g., "iPhone 14", "Galaxy S22")
* `os`: Operating system (e.g., "iOS", "Android")
* `osv`: Operating system version (e.g., "16.0", "12.0")
* `h`: Screen height in pixels
* `w`: Screen width in pixels
* `ppi`: Screen pixels per inch (PPI)
* `pxratio`: Screen pixel density ratio
* `devicetype`: Device type (e.g., mobile, tablet, desktop)
* `js`: Support for JavaScript (0 = no, 1 = yes)

{: .alert.alert-info :}
**Note**: If these fields are already populated in the bid request, the module will not overwrite them.

### Publisher-Specific Enrichment

Device enrichment is selectively enabled for publishers based on their account ID. The module identifies publishers through the following fields:

* `site.publisher.id` (for web environments)
* `app.publisher.id` (for mobile app environments)  
* `dooh.publisher.id` (for digital out-of-home environments)

### Extended Capabilities

When `ext_caps` is enabled, the module adds the WURFL device ID and all licensed capabilities to `device.ext.wurfl`.

## Planning

This module supports running at two stages:

1. **entrypoint**: Called for all requests before they're validated
2. **raw_auction_request**: Called for all valid requests before they're sent to bid adapters

We recommend defining the execution plan right in the account config so the module is only invoked for specific accounts.

## Setup

### Prerequisites

#### PBS-Java Prerequisites

In order to compile the WURFL module in the PBS Java server bundle using a licensed WURFL API, you must follow these steps:

1. Change the URL in the `<repository>` tag in the module's `pom.xml` file to the ScientiaMobile Maven repository URL:
   `https://maven.scientiamobile.com/repository/wurfl-onsite/`
   
   The repository is private and requires authentication: to set it up please check the paragraph "Configuring your Builds to work with ScientiaMobile's Private Maven Repository" [on this page](https://docs.scientiamobile.com/documentation/onsite/onsite-java-api).

1. Change the `artifactId` value in the module's `pom.xml` from `wurfl-mock` to `wurfl`

1. Update the `wurfl.version` property value to the latest WURFL Onsite Java API version available.

When the `pom.xml` references the mock API artifact, the module will compile a demo version that returns sample data, allowing basic testing without a WURFL Onsite Java API license.

1. Build the Prebid Server Java bundle with the WURFL module:

   ```bash
   mvn clean package --file extra/pom.xml
   ```

#### PBS-Go Prerequisites

To build the WURFL module for PBS-Go, you need to install the WURFL Infuze from ScientiaMobile.
For more details, visit: [ScientiaMobile WURFL Infuze](https://docs.scientiamobile.com/documentation/infuze/infuze-c-api-user-guide).

{: .alert.alert-warning :}
**Note**: The WURFL module requires CGO at compile time to link against the WURFL Infuze library.

To enable the WURFL module, the `wurfl` build tag must be specified:

```bash
go build -tags wurfl .
```

### WURFL Data File

A valid WURFL license must include all the required capabilities for device enrichment.

The WURFL module requires a WURFL data file. Commercial licensees of WURFL are granted access to "The Customer Vault", a personal virtual space containing purchased software licenses and weekly updated versions of the WURFL repository.

For evaluation purposes, you can use the sample `wurfl.zip` file included with the WURFL Infuze package (for PBS-Go) or the WURFL OnSite Java API package (for PBS-Java).

For more details, visit: [ScientiaMobile WURFL](https://docs.scientiamobile.com/documentation/).

## Configuration

### Host Company

There is no host-company level config for this module except the execution plan may optionally be at the host level.

### Account

#### PBS-Java Configuration

Here's a general template for the account config:

```yaml
hooks:
  wurfl-devicedetection:
    enabled: true
  host-execution-plan: >
    {
      "endpoints": {
        "/openrtb2/auction": {
          "stages": {
            "entrypoint": {
              "groups": [
                {
                  "timeout": 10,
                  "hook-sequence": [
                    {
                      "module-code": "wurfl-devicedetection",
                      "hook-impl-code": "wurfl-devicedetection-entrypoint-hook"
                    }
                  ]
                }
              ]
            },
            "raw-auction-request": {
              "groups": [
                {
                  "timeout": 10,
                  "hook-sequence": [
                    {
                      "module-code": "wurfl-devicedetection",
                      "hook-impl-code": "wurfl-devicedetection-raw-auction-request"
                    }
                  ]
                }
              ]
            }
          }
        }
      }
    }
  modules:
    wurfl-devicedetection:
      file-dir-path: /path/to/wurfl_snapshot_dir
      file-snapshot-url: https://data.scientiamobile.com/<your_wurfl_snapshot_url>/wurfl.zip
      cache-size: 200000
      update-frequency-in-hours: 24
      allowed-publisher-ids: ["1", "3"]
      ext-caps: false
```

#### PBS-Go Configuration

Here's the Go version in YAML format:

```yaml
hooks:
  enabled: true
  modules:
    scientiamobile:
      wurfl_devicedetection:
        enabled: true
        wurfl_file_path: "/path/to/wurfl.zip"
        wurfl_snapshot_url: "<wurfl_snapshot_url>"
        wurfl_cache_size: 200000
        allowed_publisher_ids:
          - "1"
          - "3"
        ext_caps: true
  host_execution_plan:
    endpoints:
      /openrtb2/auction:
        stages:
          entrypoint:
            groups:
              - timeout: 10
                hook_sequence:
                  - module_code: "scientiamobile.wurfl_devicedetection"
                    hook_impl_code: "scientiamobile-wurfl_devicedetection-entrypoint-hook"
          raw_auction_request:
            groups:
              - timeout: 10
                hook_sequence:
                  - module_code: "scientiamobile.wurfl_devicedetection"
                    hook_impl_code: "scientiamobile-wurfl_devicedetection-raw-auction-request-hook"
```

### Configuration Parameters

#### PBS-Java Parameters

{: .table .table-bordered .table-striped }

| Parameter | Required | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `file-dir-path` | Yes | string | - | Path to the directory where the WURFL file is downloaded. Directory must exist and be writable. |
| `file-snapshot-url` | Yes | string | - | URL of the licensed WURFL snapshot file to be downloaded when PBS starts. |
| `cache-size` | No | integer | WURFL default | Maximum number of devices stored in the WURFL cache. |
| `ext-caps` | No | boolean | false | If `true`, adds all licensed capabilities to `device.ext`. |
| `update-frequency-in-hours` | No | integer | 24 | Check interval (hours) for downloading updated WURFL file if modified. |
| `allowed-publisher-ids` | No | array | All publishers | List of publisher IDs permitted to use the module. |

#### PBS-Go Parameters

{: .table .table-bordered .table-striped }

| Parameter | Required | Type | Default | Description |
|-----------|----------|------|---------|-------------|
| `wurfl_file_path` | Yes | string | - | Path to the WURFL file (e.g. /path/to/wurfl.zip). |
| `wurfl_snapshot_url` | No | string | - | URL of the licensed WURFL snapshot. If set, periodically updates the WURFL file. |
| `wurfl_cache_size` | No | integer | WURFL default | Maximum number of devices stored in the WURFL cache. |
| `ext_caps` | No | boolean | false | If `true`, adds all licensed capabilities to `device.ext`. |
| `allowed_publisher_ids` | No | array | All publishers | List of publisher IDs permitted to use the module. |

## Running Prebid Server

### PBS-Java

After configuring the module and successfully building the Prebid Server bundle:

```bash
java -jar target/prebid-server-bundle.jar --spring.config.additional-location=sample/configs/prebid-config-with-wurfl.yaml
```

When the server starts, it downloads the WURFL file from the `file-snapshot-url` and loads it into the module.

### PBS-Go

1. Download dependencies:

   ```bash
   go mod download
   ```

2. Copy the WURFL file to the configured `wurfl_file_path` location

3. Start the server:

   ```bash
   go run -tags wurfl .
   ```

When the server starts, it loads the WURFL file from `wurfl_file_path` into the module. To enable automatic updates, ensure that `wurfl_snapshot_url` is correctly configured.

#### Demo Mode (PBS-Go)

To test the WURFL module without an Infuze license:

```bash
go run .
```

## Sample Response

Using sample request data when the module is configured with `ext_caps` set to `false`:

```json
"device": {
  "ua": "Mozilla/5.0 (Linux; Android 15; Pixel 9 Pro XL Build/AP3A.241005.015;) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36 EdgA/124.0.2478.64",
  "devicetype": 1,
  "make": "Google",
  "model": "Pixel 9 Pro XL",
  "os": "Android",
  "osv": "15",
  "h": 2992,
  "w": 1344,
  "ppi": 481,
  "pxratio": 2.55,
  "js": 1,
  "ext": {
    "wurfl": {
      "wurfl_id": "google_pixel_9_pro_xl_ver1_suban150"
    }
  }
}
```

When `ext_caps` is set to `true`, the response will include all licensed capabilities in `device.ext.wurfl`, such as:

* Device form factor information
* Browser details  
* Hardware specifications
* OS and app version details
* Network capabilities
* And many more device properties

## Analytics Tags

This module does not currently produce any analytics tags.

## Maintainer

For questions or support regarding the WURFL Device Detection module, please contact:
[prebid@scientiamobile.com](mailto:prebid@scientiamobile.com)

## Further Reading

* [WURFL by ScientiaMobile](https://www.scientiamobile.com/)
* [Prebid Server Module List](/prebid-server/pbs-modules/index.html)
