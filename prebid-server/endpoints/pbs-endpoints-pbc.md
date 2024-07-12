---
layout: page_v2
sidebarType: 5
title: Prebid Cache Endpoints

---

# Prebid Cache Endpoints
{: .no_toc}

The Prebid Cache server has a fairly simple API structure: one endpoint to write
to cache, and one endpoint to read from cache.

* TOC
{:toc}

## POST /cache

Adds one or more values to the cache. Values can be given as either JSON or XML. A sample request is below.

```json
{
  "puts": [
    {
      "type": "xml",
      "ttlseconds": 60,
      "value": "<tag>Your XML content goes here.</tag>"
    },
    {
      "type": "json",
      "ttlseconds": 300,
      "value": [1, true, "JSON value of any type can go here."]
    }
  ]
}
```

If any of the `puts` are invalid, then it responds with a **400** none of the values will be retrievable.
Assuming that all of the values are well-formed, then the server will respond with IDs which can be used to
fetch the values later.

**Note**: `ttlseconds` is optional, and will only be honored on a _best effort_ basis.
Callers should never _assume_ that the data will stay in the cache for that long.

```json
{
  "responses": [
    {"uuid": "279971e4-70f0-4b18-bd65-5c6e7aa75d40"},
    {"uuid": "147c9934-894b-4c1f-9a32-e7bb9cd15376"}
  ]
}
```

In order to support cross-datacenter caching, an optional parameter `key` has been added that a particular install of prebid cache may or may not support (as a config option).
If the server does not support specifying `key`s, then any supplied keys will be ignored and requests will be processed as
above. If the server supports key, then the put can optionally use it as:

```json
{
  "puts": [
    {
      "type": "xml",
      "ttlseconds": 60,
      "value": "<tag>Your XML content goes here.</tag>",
      "key": "ArbitraryKeyValueHere"
    },
    {
      "type": "json",
      "ttlseconds": 300,
      "value": [1, true, "JSON value of any type can go here."]
    }
  ]
}

This will result in the response

```json
{
  "responses": [
    {"uuid": "ArbitraryKeyValueHere"},
    {"uuid": "147c9934-894b-4c1f-9a32-e7bb9cd15376"}
  ]
}
```

If an entry already exists for "ArbitraryKeyValueHere", it will not be overwitten,
and "" will be returned for the `uuid` value of that entry. This is to prevent bad actors from trying to overwrite legitimate caches with
malicious content, or a poorly coded app overwriting its own cache with new values, generating uncertainty what is actually stored under a
particular key. Note that this is the only case where only a subset of caches will be stored, as this is the only case where a put will fail
due to no fault of the requester yet the other puts are not called into question. (A failure can happen if the backend datastore errors on the
storage of one entry, but this then calls into question how successfully the other caches were saved.)

## GET /cache

Retrieves a single value from the cache. If the `id` isn't recognized, then it will return a 404.

Assuming the above POST calls have been made, here are some sample GET responses.

---

**GET** */cache?uuid=279971e4-70f0-4b18-bd65-5c6e7aa75d40*

```
HTTP/1.1 200 OK
Content-Type: application/xml

<tag>Your XML content goes here.</tag>
```

---

**GET** */cache?uuid=147c9934-894b-4c1f-9a32-e7bb9cd15376*

```
HTTP/1.1 200 OK
Content-Type: application/json

[1, true, "JSON value of any type can go here."]
```

### Limitations

- This application does *not* validate XML. If users `POST` malformed XML, they'll `GET` a bad response too.
- The host company can set a max length on payload size limits in the application config. This limit will vary from host company to host company.

## Module Storage

### Configuration

[//]: # (TODO: Add description and examples of configuration)

### POST /module-storage

[//]: # (TODO: Add description)

### GET /module-storage

[//]: # (TODO: Add description)
