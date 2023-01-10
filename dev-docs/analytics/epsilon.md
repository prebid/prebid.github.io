---
layout: analytics
title: Epsilon
description: Epsilon Prebid Analytics Adapter (formerly Conversant)
modulecode: conversant
gdpr_supported: true
usp_supported: true
coppa_supported: false
prebid_member: true
gvl_id: 24
enable_download: true
---

#### Registration

Epsilon (formerly Conversant) analytics adapter requires approval from the
Epsilon team, even for existing accounts. Please reach out to
publishersupport@epsilon.com for more information.

#### Analytics Options

{: .table .table-bordered .table-striped }
| Name         | Scope              | Description                                                                                                                 | Example                                                                             | Type             |
|-------------|---------|--------------------|-----------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|------------------|
| site_id | required  | Epsilon site id for the site that will track prebid usage. | 1234  | integer |
| cnvr_sampling | optional | Sample rate for analytics data. Value should be between 0 and 1 (inclusive), 0 == never sample,  1 == always sample, 0.5 == send analytics 50% of the time.   | 0.5  | float |

### Example Configuration

```
            <!-- should be called before requestBids() -->
            pbjs.que.push(function(){
                pbjs.enableAnalytics(
                    {
                        provider: 'conversant',
                        options: {
                            site_id: 108060,
                            cnvr_sampling: 0.5
                        }
                    }
                );
            });
```
