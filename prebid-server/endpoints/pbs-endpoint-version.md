---
layout: page_v2
sidebarType: 5
title: Prebid Server | Endpoints | /version

---

# Prebid Server | Endpoints | /version

## GET /version

Returns a HTTP 200 response with version information in the following JSON structure:

```json
{
    "revision": "61062d5d9e2b26ba704056c9cf7ffdd1f24f41c2",
    "version": "0.239.1"
}
```

{: .table .table-bordered .table-striped }
| Field | Description |
| - | - |
| revision | Git commit id from the head of the branch used to build this instance of Prebid Server. |
| version | Product version number. |