---
layout: page_v2
sidebarType: 5
title: Prebid Server | Features | Setting Up Stored Requests for Java

---

# Prebid Server | Features | Setting Up Stored Requests for Java
{: .no_toc}

* TOC
{:toc }

## Overview

There are two different kinds of stored requests:
- **impression-level stored requests**: these are scoped to the contents of a single OpenRTB `imp` object. Prebid Server defines these in imp[].ext.prebid.storedrequest.
- **top-level stored requests**: these are scoped to the entire OpenRTB package, and is where you can place details in ext.prebid, tmax, site, etc. It is not recommended to place imp objects in this type of stored request. Prebid Server defines these in ext.prebid.storedrequest.

## PBS-Java Stored Request Quickstart

Stored requests can be placed in the database or files. See below for how to set up the database. This guide assumes that new Prebid Server host companies will start with files.

Configure your server to read stored requests from the filesystem:

```yaml
settings:
  filesystem:
    settings-filename: sample-app-settings.yaml
    stored-requests-dir: stored_requests
    stored-imps-dir: stored_imps
```

Choose an ID to reference your stored request data. Throughout this doc, replace {id} with the ID you've chosen.

Add the file `stored_imps/{id}.json` and populate it with some [imp](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf#page=17) data. This will create an impression-level stored request.

```json
{
  "id": "test-imp-id",
  "banner": {
    "format": [
      {
        "w": 300,
        "h": 250
      },
      {
        "w": 300,
        "h": 600
      }
    ]
  },
  "ext": {
    "prebid": {
      "bidder": {
        "appnexus": {
          "placement_id": 10433394
        }
      }
    }
  }
}
```

Start your server and then `POST` to [`/openrtb2/auction`](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html) with your chosen ID.

```json
{
  "id": "test-request-id",
  "imp": [
    {
      "ext": {
        "prebid": {
          "storedrequest": {
            "id": "{id}"
          }
        }
      }
    }
  ]
}
```

The auction will occur as if the HTTP request had included the content from `stored_requests/{id}.json` instead.

## Partial Stored Impression-level Requests

You can also store _part_ of the `imp` on the server. For example:

```json
{
  "banner": {
    "format": [
      {
        "w": 300,
        "h": 250
      },
      {
        "w": 300,
        "h": 600
      }
    ]
  },
  "ext": {
    "prebid": {
      "bidder": {
        "appnexus": {
          "placement_id": 10433394
        }
      }
    }
  }
}
```

This is not _fully_ legal OpenRTB `imp` data, since it lacks an `id`.

However, incoming HTTP requests can fill in the missing data to complete the OpenRTB request:

```json
{
  "id": "test-request-id",
  "imp": [
    {
      "id": "test-imp-id",
      "ext": {
        "prebid": {
          "storedrequest": {
            "id": "{id}"
          }
        }
      }
    }
  ]
}
```

If the Stored Request and the HTTP request have conflicting properties,
they will be resolved with a [JSON Merge Patch](https://tools.ietf.org/html/rfc7386).
HTTP request properties will overwrite the Stored Request ones.

## Top-Level Stored Requests

So far, our examples have only used impression-level data. However, Stored Requests
are also allowed at the top level at ext.prebid.storedrequest.
These work exactly the same way, but support storing properties like timeouts and price granularity.

For example, assume the following `stored-requests/{id}.json`:

```json
{
    "tmax": 1000,
    "ext": {
      "prebid": {
        "targeting": {
          "pricegranularity": "low"
        }
      }
    }
  }
```

Then HTTP request like:

```json
{
  "id": "test-request-id",
  "imp": [
    "Any valid Imp data in here"
  ],
  "ext": {
    "prebid": {
      "storedrequest": {
        "id": "{id}"
      }
    }
  }
}
```

will produce the same auction as if the HTTP request had been:

```json
{
  "id": "test-request-id",
  "tmax": 1000,
  "imp": [
    "Any valid Imp data in here"
  ],
  "ext": {
    "prebid": {
      "targeting": {
        "pricegranularity": "low"
      }
    }
  }
}
```

Prebid Server does allow both top-level and impression-level stored requests in the same HTTP Request.
The top-level stored request will be applied first, and then the impression-level stored request.

**Beware**: Stored Request data will not be applied recursively.
If a Stored BidRequest includes Imps with their own Stored Request IDs, then the data for the contained Stored Imps will not be resolved.

**Note**: However, stored requests may contain [storedresponses](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#stored-responses).

## Alternate backends

Stored Requests do not need to be saved to files. Other backends are supported with different
[configuration options](https://github.com/prebid/prebid-server-java/blob/master/docs/config.md).

### Database backend

For PostgreSQL:
```yaml
settings:
  database:
    type: postgres
```

For MySQL:
```yaml
settings:
  database:
    type: mysql
```

The select query columns of `stored-requests-query` and `amp-stored-requests-query` properties should correspond to the specific format:
- first column: account ID, which is used to make sure that storedrequests are unique to the account
- second column: ID of stored data item
- third column: value of stored data item.
- forth column: type of stored data item. Can be `request` for stored requests or `imp` for stored impressions.

### HTTP backend

```yaml
settings:
  http:
    endpoint: http://stored-requests.prebid.com
    amp_endpoint: http://stored-requests.prebid.com?amp=true
```

Note: HTTP backend implementation always gives an empty result (with "Not supported" error inside)
for obtaining the `Account` or `AdUnitConfig` by ID for the legacy [auction](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html) endpoint.

Full list of application configuration options can be found [here](https://github.com/prebid/prebid-server-java/blob/master/docs/config-app.md).

If you need support for a backend that you don't see, please [contribute it](https://github.com/prebid/prebid-server-java/blob/master/docs/developers/contributing.md).

## Caches and updates

Stored Request data can also be cached or updated while PBS is running.
Conceptually, Stored Request data is managed by the following components in the code:

**ApplicationSettings**: Implementations of this interface pull data directly from a backend.
**SettingsCache**: Duplicates data which the ApplicationSettings _could_ find so that it can be accessed more quickly.
**CacheNotificationListener**: Provides interface apply changes to Stored Request data.

ApplicationSettings and methods of updating Stored Request data at runtime can also be chosen
in the the app config.
At least one ApplicationSettings is _required_ to make use of Stored Requests.

If more than one ApplicationSettings is defined, they will be ordered and used as fallback data sources.
This isn't a great idea for Prod in the long-term, but may be useful temporarily if you're trying
to transition from one backend to another.

CacheNotificationListener is used to Save or Invalidate values from the cache.

Here is an example configuration file which looks for Stored Requests first from Postgres, and then from an HTTP endpoint.
It will use an in-memory LRU cache to store data locally, and poll another HTTP endpoint to listen for updates.

```yaml
settings:
  database:
    type: postgres
    host: localhost
    port: 5432
    dbname: database-name
    user: username
    password: password
    stored-requests-query: SELECT accountId, reqid, requestData, 'request' as dataType FROM stored_requests WHERE reqid IN (%REQUEST_ID_LIST%) UNION ALL SELECT accountId, impid, impData, 'imp' as dataType FROM stored_requests WHERE impid IN (%IMP_ID_LIST%)
    amp-stored-requests-query: SELECT accountId, reqid, requestData, 'request' as dataType FROM stored_requests WHERE reqid IN (%REQUEST_ID_LIST%)
  http:
    endpoint: http://stored-requests.prebid.com
    amp-endpoint: http://stored-requests.prebid.com?amp=true
  in-memory-cache:
    cache-size: 10000
    ttl-seconds: 360
    http-update:
      endpoint: http://stored-requests.prebid.com
      amp-endpoint: http://stored-requests.prebid.com?amp=true
      refresh-rate: 60000
      timeout: 2000
```

Refresh rate can be negative or zero - in such case the data will be fetched once and never updated.

## Related Reading
- [Stored Responses](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html#stored-responses)
- [Hosting a PBS database](/prebid-server/hosting/pbs-database.html)
