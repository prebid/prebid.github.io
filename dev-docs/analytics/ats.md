---
layout: analytics
title: ATS Analytics
description: ATS Prebid Analytics Adapter
modulecode: atsAnalyticsAdapter
gdpr_supported: true
usp_supported: true
prebid_member: true
gvl_id: 97
enable_download: false
pbjs: true
pbjs_version_notes: v5.20.0 and later
---

#### Registration

LiveRamp's ATS Analytics is free of charge and only requires a simple registration with Liveramp. Please sign up through our [Console](https://launch.liveramp.com) platform and create the analytics adapter to get started.

The LiveRamp privacy policy is at [https://liveramp.com/privacy/service-privacy-policy/](https://liveramp.com/privacy/service-privacy-policy/).

#### Analytics Options

{: .table .table-bordered .table-striped }
| Name         | Scope              | Description                                                                                                                 | Example                                                                             | Type             |
|-------------|---------|--------------------|-----------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|------------------|
| pid | required  | This is the Placement ID, a unique identifier that is used to identify each publisher, obtained from registering with LiveRamp. | `"999"`  | `int` |

#### Example Configuration

    pbjs.que.push(function () {
      pbjs.enableAnalytics([{
        provider: "atsAnalytics",
        options: {
          pid: "999"              // Set your valid Placement ID here
        }
      }])
    });
