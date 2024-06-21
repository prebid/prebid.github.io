---
layout: page_v2
title: AAX Blockmeter Realtime Data Module
display_name: AAX Blockmeter
description: Measure the adblock traffic.
page_type: module
module_type: rtd
module_code : aaxBlockmeterRtdProvider
enable_download : true
vendor_specific: true
sidebarType : 1
---

# AAX Blockmeter Realtime Data Module

{:.no_toc}

* TOC
{:toc}

## Overview

The module enables publishers with an AAX relationship to measure traffic coming from visitors using adblockers.

AAX can also help publishers monetize this traffic by allowing them to serve [acceptable ads](https://acceptableads.com/about/) to these adblock visitors and recover their lost revenue. [Reach out to us](https://www.aax.media/try-blockmeter/) to know more.

{% include dev-docs/loads-external-javascript.md %}

## Configuration

This module is configured as part of the `realTimeData.dataProviders` object.

{: .table .table-bordered .table-striped }
| Name       | Scope    | Description                            | Example       | Type     |
|------------|----------|----------------------------------------|---------------|----------|
| `name`     | required | Real time data module name | `'aaxBlockmeter'`   | `string` |
| `params`      | required |  | | `Object` |
| `params.pub`      | required | AAX to share pub ID, [Reach out to us](https://www.aax.media/try-blockmeter/) to know more! | `'AAX000000'` | `string` |
| `params.url`     | optional | AAX Blockmeter Script Url. Defaults to `'c.aaxads.com/aax.js?ver=1.2'` | `'c.aaxads.com/aax.js?ver=1.2'`   | `string` |

### Basic Example

```javascript
pbjs.setConfig({
    realTimeData: {
        dataProviders: [{
            name: 'aaxBlockmeter',
            params: {
                pub: 'AAX000000',
                url: 'c.aaxads.com/aax.js?ver=1.2',
            }
        }]
    }
});
```

## Targeting sent to GAM

For each prebid adUnit we pass the following key value to GAM by default

| Google Slot Id | Prebid Adunit Code    | Targeting Key | Targeting Value |
|:----------:|:--------------:|:---------------:|:---------------:|
|slotA| code-1 | `atk` | `code-1` |

## Integration

To install the module, follow these instructions:

### Step 1: Prepare the base Prebid file

* **Option 1:** Use Prebid [Download](/download.html) page to build the prebid package. Ensure that you do check *AAX Blockmeter Realtime Module* module

* **Option 2:** From the command line, run `gulp build --modules=aaxBlockmeterRtdProvider,rtdModule,...`

### Step 2: Set configuration

Enable AAX Blockmeter Real Time Module using `pbjs.setConfig`

```javascript
pbjs.setConfig({
    realTimeData: {
        dataProviders: [{
            name: 'aaxBlockmeter',
            params: {
                pub: 'AAX000000'
            }
        }]
    }
});
```
