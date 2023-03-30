---
layout: page_v2
sidebarType: 5
title: Prebid Server | Developer | Database
---

# Prebid Server Database
{:.no_toc}

* TOC
{:toc}

## Overview

Companies looking to spin up Prebid Server should consider setting up a database.
It could actually be file-based or no-sql based, but for the purposes of this reference, we'll assume a relational DB.
Here are the kinds of data that PBS needs from a data store:
- **account data:** defaults and settings for things like price granularities, time-to-live, privacy regulations, and modules.
- [stored requests](/prebid-server/features/pbs-storedreqs.html): blocks of JSON that define how PBS responds to mobile and AMP requests.
- **stored responses:** very useful for debugging

**Where does this data come from?** You, the host company need to figure that out. PBS never writes this data, only reads it. The difference between a good PBS host company and an average one will be in details like the managing of this data.

**What's the schema?** Our design
strategy is to avoid a fixed schema, instead allowing each host company the flexibility
to define their schema any way they'd like. The vision is that you already have a database
somewhere attached to a user interface that collects similar data from your users. We want
you to be able to integrate a few tables into that existing database and then replicating them to high-speed read-only copies wherever you have clusters.

So instead of Prebid defining your schema, we just define the fields that need to come
from the query. You can then design the SQL query and put it in PBS configuration.

## Database Queries

Prebid Server queries the database in the following scenarios:

{: .table .table-bordered .table-striped }
| Data | SQL Config | Description |
|------+---------------+-------------|
| Stored Requests | settings.database.stored-requests-query | Retrieve stored request JSON for incoming OpenRTB |
| AMP Stored Requests | settings.database.amp-stored-requests-query | Retrieve stored request JSON for incoming AMP |
| Stored Responses | settings.database.stored-responses-query | Retrieve stored response data |
| Account Data | settings.database.account-query (PBS-Java only) | Retrieve host company-specific account information |

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
    stored-requests-query: SELECT accountId, reqid, requestData, 'request' as dataType FROM stored_requests WHERE reqid IN (%REQUEST_ID_LIST%) UNION ALL SELECT accountId, impid, impData, 'imp' as dataType FROM stored_imps WHERE impid IN (%IMP_ID_LIST%)
```

This example assumes that the schema includes these fields:
- accountId: account ID which is searched by.
- reqid: ID of stored data item which is searched by.
- requestData: value of stored data item.
- 'request': type of stored data item. Can be request for stored requests or imp for stored impressions.

Again, you can name the fields however you'd like in your database, and the query can be arbitrarily complicated as long as it returns the fields in the order and types shown here.

### AMP Stored Requests

AMP Stored Requests are the same as the section above it won't ever have the %IMP_ID_LIST% parameter, so
the query can be simplified.

This query is defined in settings.database.amp-stored-requests-query. Example:
```
settings:
  database:
    type: mysql
    amp-stored-requests-query: SELECT accountId, reqid, requestData, 'request' as dataType FROM stored_requests WHERE reqid IN (%REQUEST_ID_LIST%)
```

This example assumes that the stored_requests schema includes these fields:
- accountId: account ID which is searched by.
- reqid: ID of stored data item which is searched by.
- requestData: value of stored data item.
- 'request': type of stored data item. Can be request for stored requests or imp for stored impressions.

Again, you can name the fields however you'd like in your database, and the query can be arbitrarily complicated as long as it returns the fields in the order and types shown here.

### Stored Responses

The Stored Response query needs to return fields in this order:

{: .table .table-bordered .table-striped }
| Field Num | Name | Type | Meaning | Default |
|-----------+------+------+---------+---------|
| 1 | response ID | string | The Stored Response ID | n/a |
| 2 | response body | JSON | The body of the Stored Response | n/a |

One parameter can be passed into the query, though at this point, the parameter differs between Go and Java:

- %RESPONSE_ID_LIST% (PBS-Java): a comma-separated list of stored response IDs
- %ID_LIST% (PBS-Go): a comma-separated list of stored response IDs

This query is defined in settings.database.stored-requests-query. Example:
```
settings:
  database:
    type: mysql
    stored-responses-query: SELECT resid, responseData FROM stored_responses WHERE resid IN (%ID_LIST%)
```
 
This example assumes that the stored_responses schema includes these fields:
- resid is a string field that contains the stored response ID
- responseData is a JSON field that contains the body of the stored response

### Account Data

{: .alert.alert-info :}
In PBS-Java, many account-configuration options come from the database. In PBS-Go, those options are available in either a YAML configuration or from an HTTP API.

Account data is queried on every request to pull in important data. There is an LRU cache in the server
so the database isn't actually hit on every request.

In both versions the server can optionally validate the account and reject accounts from
unknown sources.

The algorithm the server uses for determining the account ID of the incoming request is:

1. look in site.publisher.id
2. look in app.publisher.id
3. if AMP, look for the 'account' parameter on the query string

One parameter can be passed into the query:

- %ACCOUNT_ID% : selects the right row in the DB

The query is configurable. For example:
```
settings:
  database:
    account-query: JSON_MERGE_PATCH(JSON_OBJECT( 'id', accountId ), COALESCE(config, '{}')) as consolidated_config FROM accounts WHERE accountId = %ACCOUNT_ID% LIMIT 1
```

This example assumes that the accounts schema includes these fields:
- accountId is a string field that contains the account ID
- config is a JSON field that contains all the rest of the account-level fields

Again, you can name the fields however you'd like in your database, and the query can be arbitrarily complicated as long as it returns the fields in the order and types shown here.

See the [PBS-Java configuration docs](https://github.com/prebid/prebid-server-java/blob/master/docs/application-settings.md#configuration-document-json) for detail on the JSON structure expected as the
result of the query. There are many account-level settings detailed there.

## Related Reading
- [Stored Requests](/prebid-server/features/pbs-storedreqs.html)
- [Hosting a PBS cluster](/prebid-server/overview/prebid-server-overview.html)
