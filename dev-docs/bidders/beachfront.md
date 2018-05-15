---
layout: bidder
title: Beachfront
description: Prebid Beachfront Bidder Adaptor
top_nav_section: dev_docs
nav_section: reference
hide: true
biddercode: beachfront
biddercode_longer_than_12: false
prebid_1_0_supported : true
media_types: video
gdpr_supported: true
---

### bid params

{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example |
| :--- | :---- | :---------- | :------ |
| `appId` | required | Beachfront Exchange ID | `'11bc5dd5-7421-4dd8-c926-40fa653bec76'` |
| `bidfloor` | required | Bid floor | `0.01` |
| `video` | optional | Object with video parameters. See the [video section below](#beachfront-video) for details. | |
| `banner` | optional | Object with banner parameters. See the [banner section below](#beachfront-banner) for details. | |

<a name="beachfront-video"></a>

### video params

{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example |
| :--- | :---- | :---------- | :------ |
| `appId` | optional | Beachfront Exchange ID for video bids. | `'11bc5dd5-7421-4dd8-c926-40fa653bec76'` |
| `bidfloor` | optional | Bid floor for video bids. | `0.01` |
| `mimes` | optional | Array of strings listing supported MIME types. | `["video/mp4", "application/javascript"]` |

<a name="beachfront-banner"></a>

### banner params

{: .table .table-bordered .table-striped }

| Name | Scope | Description | Example |
| :--- | :---- | :---------- | :------ |
| `appId` | optional | Beachfront Exchange ID for banner bids. | `'3b16770b-17af-4d22-daff-9606bdf2c9c3'` |
| `bidfloor` | optional | Bid floor for banner bids. | `0.01` |
