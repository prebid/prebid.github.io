--- 
layout: analytics
title: YuktaMedia
description: YuktaMedia Analytics Adapter
modulecode: yuktamedia
prebid_member: false
enable_download: false
--- 

#### Registration

Please visit www.yuktamedia.com or contact us on info@yuktamedia.com for more information.
The YuktaMedia Analytics adapter requires setup and approval from the YuktaMedia team. 
Please reach out at info@yuktamedia.com for more information.

#### Analytics Options

{: .table .table-bordered .table-striped }
| Name   |   Scope  |    Description           |   Example   | Type   |
|--------|----------|--------------------------|-------------|--------|
| pubId  | required |  YuktaMedia Publisher ID |    1001     |  int   |
| pubKey | required | YuktaMedia Publisher Key | bsbbksbkbJB | string |


### Configuration Example

```
    pbjs.enableAnalytics({
        provider: 'yuktamedia',
        options: {
          pubId: 1234, // pubId and pubKey be given by YuktaMedia. 
          pubKey: 'some string', // Please contact us to get pubId and pubKey.
          enableUTMCollection: true,
          enableSession: true,
          enableUserIdCollection: true
        }
    });

```
