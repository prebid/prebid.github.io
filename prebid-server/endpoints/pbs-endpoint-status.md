---
layout: page_v2
sidebarType: 5
title: Prebid Server | Endpoints | /status

---

# Prebid Server | Endpoints | /status

## GET /status

This endpoint will return an HTTP 200 response whenever Prebid Server is ready to serve requests.
Its exact response can be configured with the `status_response`
config option. For eample, in `pbs.yaml`:

```yaml
status_response: "ok"
```

NOTE: this endpoint cannot be relied upon to return the same results for different PBS host companies. The results are configurable so that host companies can integrate their servers into their existing monitoring services.
If you're building a system that verifies arbitrary Prebid Servers, you should check the HTTP return code.
