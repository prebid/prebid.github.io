---
layout: page_v2
sidebarType: 5
title: Prebid Server | Endpoints | /status

---

# Prebid Server | Endpoints | /status

## GET /status

This endpoint will return a 2xx response whenever Prebid Server is ready to serve requests.
Its exact response can be configured with the `status_response`
config option. For eample, in `pbs.yaml`:

```yaml
status_response: "ok"
```
