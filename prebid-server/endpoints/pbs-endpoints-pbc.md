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

`api.module-storage-path` - path of module storage POST/GET endpoints.
`api.api-key` - api key to secure module storage POST endpoint.

Module storage supports different `applications` and storage providers are configured per `application`.
For now, only redis is supported. To configure redis storage for particular application, configure `module.storage.redis.{application-name}` property.
If no `applications` are needed, set `module.storage.redis` to `{}` like so:

```yaml
module:
  storage:
    redis: {}
```

Utilizing all the properties above, sample module storage configuration:

```yaml
api.module-storage-path: /module-storage
api.api-key: API_KEY
module:
  storage:
    redis:
      application:
        port: 6379
        host: localhost
        password: password
        timeout: 99999
```

### POST /module-storage

This endpoint is used to storage module data. 

Endpoint usage is authorized only for usage with configured api key. Api key should be provided as `x-pbc-api-key` header.

Endpoint uses json body as input.

Here is an explanation of the fields in json body:

{: .table .table-bordered .table-striped }
| Parameter | Description |
| --- | --- |
|	key | A name that will be used to reference the stored value. |
|	value | String representation of the data you need to store. |
|	type | Represents the format stored inside the value. Can be one of `JSON`, `XML`, `TEXT`. |
|	ttlseconds | How long (in seconds) the data will be available in the module store. |
|	application | Configured name of your module storage. Check the configuration section of [Module Storage endpoints](/prebid-server/endpoints/pbs-endpoints-pbc.html#configuration). |

Sample json payload:

```json
{
  "key": "test",
  "type": "text",
  "value": "test",
  "application": "application",
  "ttlseconds": 9999
}
```

### GET /module-storage

Endpoint to retrieve previously stored module data.

This endpoint utilizes query parameters to get desired stored data. Here are their explanations:

{: .table .table-bordered .table-striped }
| Parameter | Description |
| --- | --- |
|	key | A name that will be used to reference the stored value. |
|	application | Configured name of your module storage. Check the configuration section of [Module Storage endpoints](/prebid-server/endpoints/pbs-endpoints-pbc.html#configuration). |

