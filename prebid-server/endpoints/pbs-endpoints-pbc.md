---
layout: page_v2
sidebarType: 5
title: Prebid Cache Endpoints

---

# Prebid Cache Endpoints
{: .no_toc}

The Prebid Cache server has a fairly simple API structure: one endpoint to write
to cache, and one endpoint to read from cache.

- TOC
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

**GET** /cache?uuid=279971e4-70f0-4b18-bd65-5c6e7aa75d40

```text
HTTP/1.1 200 OK
Content-Type: application/xml

<tag>Your XML content goes here.</tag>
```

---

**GET** /cache?uuid=147c9934-894b-4c1f-9a32-e7bb9cd15376

```text
HTTP/1.1 200 OK
Content-Type: application/json

[1, true, "JSON value of any type can go here."]
```

### Limitations

- This application does *not* validate XML. If users `POST` malformed XML, they'll `GET` a bad response too.
- The host company can set a max length on payload size limits in the application config. This limit will vary from host company to host company.

## Module Storage

Host companies may want to set up Prebid Cache to be able to store [module](/prebid-server/pbs-modules/) data separately from the main bids/VAST data store. Having a separate data store for each module or a group of modules allows the host company to:

- limit how much data space a given module (or group of modules) can consume
- establish different retention policies for different types of data

### Use Cases

Prebid Server modules may want to utilize storage local to the host company:

- to cache user-specific data
- to cache the output of expensive calculations
- to avoid wide area network calls that cost everyone money

#### Not In-Scope

This feature does not support thread-safe updates of data. The intended use is write-once, read-many. e.g. a module that counted user session depth should not use this feature because that would require many PBS threads to read and atomically update the stored data.

### PBC Configuration

These entries in the PBC application.yaml file define module-related params:

- `api.module-storage-path` - path of module storage POST/GET endpoints. Defaults to '/module-storage'.
- `api.api-key` - api key to secure module storage POST endpoint. Host companies may not want everyone on the internet to be able to store stuff in their cache. The value of this key is set by the PBS host company in the PBC config and in the PBS config. (See [???](TBD] for details about where to set this.)

Module storage supports different `applications` and storage providers are configured per `application`. For now, only [Redis](https://redis.io/) is supported for module storage. To configure Redis storage for particular application, configure the `module.storage.redis.{application-name}` property.
If no `applications` are needed, set `module.storage.redis` to `{}` in application.yaml like so:

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

A big difference between module data storage and regular bid/VAST storage is that for module storage, PBC expects the key to be provided in the POST body. This is because the module will need to generate the key from data in the request in order for it to use that same lookup key in future requests.

### POST /module-storage

This endpoint is used to storage module data. 

Endpoint usage is authorized only for the configured api key. PBS or another caller should provide a `x-pbc-api-key` header.

The POST body is JSON. Here is an explanation of the fields:

{: .table .table-bordered .table-striped }
| Parameter | Scope | Description |
| --- | --- | --- |
|	key | required | A name that will be used to reference the stored value. |
|	value | required | String representation of the data you need to store. |
|	type | required | Represents the format stored inside the value. Can be one of `JSON`, `XML`, `TEXT`. |
|	application | required | Configured name of your module storage. Check the configuration section of [Module Storage endpoints](/prebid-server/endpoints/pbs-endpoints-pbc.html#configuration). |
|	ttlseconds | optional? | How long (in seconds) the data will be available in the module store. Default TBD. |

Sample json payload:

```json
{
  "key": "hashedaddress",
  "type": "text",
  "value": "lots of data to store",
  "application": "moduleA",
  "ttlseconds": 9999
}
```

### GET /module-storage

Endpoint to retrieve previously stored module data.

This endpoint utilizes query parameters to get desired stored data:

{: .table .table-bordered .table-striped }
| Parameter | Scope | Description |
| --- | --- | --- |
|	key | required | A name that will be used to reference the stored value. |
|	application | required | Configured name of your module storage. Check the configuration section of [Module Storage endpoints](/prebid-server/endpoints/pbs-endpoints-pbc.html#configuration). |

For example:

```text
GET /module-storage?application=moduleA&key=hashedaddress
```

## Further Reading

- [PBS endpoint overview](/prebid-server/endpoints/pbs-endpoint-overview.html)
- [PBS module storage](/prebid-server/features/pbs-module-storage.html)
