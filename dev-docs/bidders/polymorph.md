---
layout: bidder
title: Polymorph
description: Polymorph Prebid Adaptor
pbjs: true
biddercode: polymorph
media_types: native, video, banner
sidebarType: 1
---

### Note

Polymorph adapter requires setup and approval from the Polymorph team. Please reach out to your account team or <support@getpolymorph.com> for more information.

### Bid Params

{: .table .table-bordered .table-striped }
| Name | Scope | Description | Example | Type |
| :--- | :---- | :---------- | :------ | --- |
| `placementId` | required | The placement id/key provided by Polymorph | `'ENvsYZ6m5DPDk6r7ogYV63DO2sBQoJ5EpckcXSlw'` | String |
| `defaultWidth` | optional | In case multiple ad sizes are supported, it's recommended to specify default height and width for native ad (in case native ad is chose as a winner). In case of banner or outstream ad any one of the above sizes can be chosen depending on the highest bid. | `300` |  Integer     |
| `defaultHeight` | optional |  | `250` |  Integer      |
