---
layout: bidder
title: RevContent
description: RevContent Bidder Adaptor
biddercode: revcontent
media_types: native
gdpr_supported: true
coppa_supported: true
usp_supported: true
pbjs: true
---

### Note

To use RevContent bidder, you need to have an existing RevContent account. To create a new account visit https://www.RevContent.com. If you are an existing user, contact the account rep for api access and information.

### Bid Params


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

