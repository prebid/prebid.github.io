---
layout: page_v2
sidebarType: 5
title: Prebid Server | Endpoints | Status

---

# Get Status Endpoint

 `GET /status`

This endpoint will return a 2xx response whenever Prebid Server is ready to serve requests.
Its exact response can be [configured](https://github.com/prebid/prebid-server/blob/master/docs/developers/configuration.md) with the `status_response`
config option. For eample, in `pbs.yaml`:

```yaml
status_response: "ok"
```
