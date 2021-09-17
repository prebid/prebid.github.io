---
layout: page_v2
sidebarType: 5
title: Prebid Server | Developer | Database

---

# Prebid Server Database

Companies looking to spin up Prebid Server will need to connect a database. Our design
strategy was to avoid a fixed schema, instead allowing each host company the flexibility
to define their schema any way they'd like.

So instead of Prebid defining your schema, we just define the fields that need to come
from the query. You can then design the SQL query and put it in PBS configuration.

## Database Queries

Prebid Server queries the database in the following scenarios:

{: .table .table-bordered .table-striped }
| Data | SQL Config | Description |
|------+---------------+-------------|
| Stored Requests | settings.database.stored-requests-query | Retrieve stored request JSON for incoming OpenRTB |
| AMP Stored Requests | settings.database.amp-stored-requests-query | Retrieve stored request JSON for incoming AMP |
| Stored Responses (PBS-Java only) | settings.database.stored-responses-query | (PBS-Java only) Retrieve stored response data |
| Account Data | (none) | Retrieve host company-specific account information |

## Expected Response Fields

### Stored Requests

The Stored Request query needs to return fields in this order:

{: .table .table-bordered .table-striped }
| Field Num | Name | Type | Meaning | Default |
|-----------+------+------+---------+---------|
| 1 | request ID | string | The Stored Request ID | n/a |
| 2 | request body | JSON | The body of the Stored Request | n/a |
| 3 | label | string | This is always just the static value 'request' | n/a |

There are two parameters that can be passed into the query:

- %REQUEST_ID_LIST% : a comma-separated list of "top-level" stored request IDs
- %IMP_ID_LIST% : a comma-separated list of "impression-level" stored request IDs

This query is defined in settings.database.stored-requests-query. Example:
```
settings:
  database:
    type: mysql
    stored-requests-query: SELECT uuid, config, 'request' as dataType FROM stored_requests WHERE uuid IN (%REQUEST_ID_LIST%) UNION ALL SELECT uuid, config, 'imp' as dataType FROM stored_requests WHERE uuid IN (%IMP_ID_LIST%)
```

Again, you can name the fields however you'd like in your database, and the query can be arbitrarily complicated as long as it returns the fields in the order and types shown here.

### AMP Stored Requests

AMP Stored Requests are the same as the section above it won't ever have the %IMP_ID_LIST% parameter, so
the query can be simplified.

This query is defined in settings.database.amp-stored-requests-query. Example:
```
settings:
  database:
    type: mysql
    stored-requests-query: SELECT uuid, config, 'request' as dataType FROM stored_requests WHERE uuid IN (%REQUEST_ID_LIST%)
```

### Stored Responses

(PBS-Java only) The Stored Response query needs to return fields in this order:

{: .table .table-bordered .table-striped }
| Field Num | Name | Type | Meaning | Default |
|-----------+------+------+---------+---------|
| 1 | response ID | string | The Stored Response ID | n/a |
| 2 | response body | JSON | The body of the Stored Response | n/a |

One parameter can be passed into the query:

- %RESPONSE_ID_LIST% : a comma-separated list of stored response IDs

This query is defined in settings.database.stored-requests-query. Example:
```
settings:
  database:
    type: mysql
    stored-responses-query: SELECT resid, responseData FROM stored_responses WHERE resid IN (%RESPONSE_ID_LIST%)
```

### Account Data

{: .alert.alert-info :}
Despite what we said about Prebid not defining your schema, it's not true for account data.
Currently the account query is hard-coded in both versions of Prebid-Server. You could
create a view as desired. We'll fix this someday.

Account data is queried on every request to pull in important data. There is an LRU cache in the server
so the database isn't actually hit on every request.

In PBS-Java, many account-configuration options come from the database, while in PBS-Go, those options are available in YAML configuration.

In both versions the server can optionally validate the account against this database and reject accounts from
unknown sources.

The algorithm the server uses for determining the account ID of the incoming request is:

1. look in site.publisher.id
2. look in app.publisher.id
3. if AMP, look for the 'account' parameter on the query string (PBS-Java only)

Here are the fields the server can recognize in the database response:

{: .table .table-bordered .table-striped }
| Field Num | Name | Type | Meaning | Default |
|-----------+------+-----+---------+---------|
| 1 | uuid | string | Host-company specific account ID | n/a |
| 2 | price_granularity | enum | Deprecated. Granularity should be part of stored requests or the incoming OpenRTB. | n/a |
| 3 | banner_cache_ttl | integer | (PBS-Java only) How long (seconds) banner bids should be cached for this account. | Config |
| 4 | video_cache_ttl | integer | (PBS-Java only) How long (seconds) VAST should be cached for this account. | Config |
| 5 | events_enabled | 0 or 1 | (PBS-Java only) Whether to emit event URLs for this account. | 0 |
| 6 | enforce_ccpa | 0 or 1 | (PBS-Java only) Whether to enforce US-Privacy rules for this account. | Config |
| 7 | enforce_gdpr | 0 or 1 | (PBS-Java only) Whether to enforce TCF1 GDPR rules for this account. Deprecated. Use tcf_config for TCF2. | Config |
| 8 | tcf_config | JSON | (PBS-Java only) TCF2 override settings for this account. | Config |
| 9 | analytics_sampling_factor | tiny int | (PBS-Java only) Turns on analytics sampling for this account. Sampling mechanism is 1-in-N. e.g. if this value is a 2, it's a 1-in-2 (50%) sample. If 5, then 1-in-5 (20%). Max value is 100 (1%) | 1 |
| 10 | truncate_target_attr | tiny int | (PBS-Java only) Number of bytes allowed for targeting attributes for this account. 0=unlimited. | Config |

Currently this query is hard-coded in both versions of Prebid-Server:

PBS-Go:
```
SELECT uuid, price_granularity FROM accounts_account where uuid = ? LIMIT 1
```

PBS-Java
```
SELECT uuid, price_granularity, banner_cache_ttl, video_cache_ttl, events_enabled, enforce_ccpa, tcf_config, analytics_sampling_factor, truncate_target_attr FROM accounts_account where uuid = ? LIMIT 1
```

