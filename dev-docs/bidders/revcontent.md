---
layout: bidder
title: RevContent
description: RevContent Bidder Adaptor
biddercode: revcontent
media_types: native
gdpr_supported: false
coppa_supported: false
usp_supported: false
pbjs: true
pbs: true
gvl_id: 203
sidebarType: 1
---

### Note

To use RevContent bidder, you need to have an existing RevContent account. To create a new account visit https://www.RevContent.com. If you are an existing user, contact the account rep for api access and information. 

For prebid server, Revcontent only uses basic OpenRTB requests, so only the endpoint will need to be customized. Your request must contain either `app.name` or `site.domain` to be considered valid. Revcontent will provide you with a custom endpoint that will contain your account details that you will specify in your adapater configuration, and you must manually enable the adapter. For example, your pbs.yaml would contain the following:
```
adapters:
  revcontent:
    disabled: false
    endpoint: https://trends.revcontent.com/rtb?apiKey=<api key here>&userId=<account user id here>
```

### Prebid.js Bid Params


{: .table .table-bordered .table-striped }

| Name               | Scope              | Description                                                                                                          | Example         | Type      |
|--------------------|--------------------|----------------------------------------------------------------------------------------------------------------------|-----------------|-----------|
| `apiKey`           | required           | API key.                                       | `'8a33sdfsdfdsfsdfssss544f8sdfsdfsdfd3b1c'`  | `string`  |
| `userId`           | required           | Account User ID                                | `69565`                                      | `number`  |
| `widgetId`         | recommended        | Widget ID.                                     | `599995`                                     | `number`  |
| `domain`           | recommended        | Domain Name - Default referral hostname        | `'test.com'`                                 | `string`  |
| `endpoint`         | optional           | Api Endpoint - Used for testing                | `'trends.revcontent.com'`                    | `string`  |
| `bidfloor`         | optional           | Bid Floor                                      | `0.1`                                        | `float`   |
| `template`         | optional           | Format of the display ad                       | `'<a href="{clickUrl}">{title}</a>'`         | `string`  |

