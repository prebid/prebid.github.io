---
layout: analytics
title: Greenbids
description: Greenbids Analytics Adapter
modulecode: greenbids
prebid_member: false
enable_download: true
---

#### Registration

The Greenbids Analytics adapter requires setup and approval from the
Greenbids team. Please reach out to our team for more information [greenbids.ai](https://greenbids.ai).

#### Analytics Options

{: .table .table-bordered .table-striped }
| Name         | Scope              | Description                                                                                                                 | Example                                                                             | Type             |
|-------------|---------|--------------------|-----------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------|------------------|
| pbuid | required  | The Greenbids Publisher ID | greenbids-publisher-1  | string |
| sampling | optional  | sampling factor [0-1] (a value of 0.1 will filter 90% of the traffic) | 0.5  | float |

### Example Configuration

```
    pbjs.enableAnalytics({
        provider: 'greenbids',
        options: {
            pbuid: "greenbids-publisher-1" // please contact Greenbids to get a pbuid for yourself
            sampling: 1.0
        }
    });
```
