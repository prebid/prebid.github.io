---
title: BidWatch
description: BidWatch Prebid Analytics Adapter
modulecode: bidwatch
tcfeu_supported: true
usp_supported: false
coppa_supported: false
prebid_member: false
gvl_id: 791
enable_download: true
---

#### Registration

The BidWatch Analytics Adapter requires setup and approval from the
BidWatch team. Please reach out to [contact@bidwatch.io](mailto:contact@bidwatch.io) for more information.

#### Analytics Options


| Name         | Scope              | Description                                                                                                                 | Example                                                                             | Type             |
|-------------|---------|--------------------|-----------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|------------------|
| domain | required | The bidwatch subdomain where analytics data is sent   | `'test.endpoint'`  | string |

### Example Configuration

```
  pbjs.enableAnalytics({
    provider: 'bidwatch',
    options: {
        domain: "CONTACT-BIDWATCH-TEAMS-FIRST"
    }
  });
```
