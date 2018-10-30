---
layout: bidder
title: AerServ
description: Prebid AerServ Bidder Adaptor

top_nav_section: dev_docs
nav_section: reference

hide: true

biddercode: aerserv

biddercode_longer_than_12: false
media_types: video

---

### Note:
Banner sizes will be derived from placement's configuration in the [AerServ UI](https://platform.aerserv.com/), and will ignore the values within the bid request.

### bid params

{: .table .table-bordered .table-striped }
| Name    | Scope    | Description                                                                                                                                                                                                | Example | Type      |
|---------|----------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|-----------|
| `plc`   | required | The AerServ Placement ID.                                                                                                                                                                                  | `480`   | `integer` |
| `coppa` | optional | COPPA override. Send `1` if the request's source falls under [COPPA regulations](https://www.ftc.gov/enforcement/rules/rulemaking-regulatory-reform-proceedings/childrens-online-privacy-protection-rule). | `1`     | `integer` |

<a name="aerserv-video"></a>

### Video
Video requests will use the first size passed in the Prebid request, but it can be overridden with the parameters below.

### video params

{: .table .table-bordered .table-striped }
| Name  | Scope    | Description           | Example | Type      |
|-------|----------|-----------------------|---------|-----------|
| `vpw` | optional | video width override  | `480`   | `integer` |
| `vph` | optional | video height override | `360`   | `integer` |
