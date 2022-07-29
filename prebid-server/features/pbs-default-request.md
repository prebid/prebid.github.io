---
layout: page_v2
sidebarType: 5
title: Prebid Server | Developers | Default Request
---

# Server Based Global Default Request

This allows a defaut stored request to be defined that allows the server to set up some defaults for all incoming requests. A request specified stored request will override these defaults, and of course any options specified directly in the stored request override both. The default stored request is only read on server startup, it is meant as an installation static default rather than a dynamic tuning option.

A common use case is to "hard code" aliases into the server. This saves having to specify them on all incoming requests, and/or on all stored requests. To help support automation and alias discovery we can flag that any aliases found in the file be added to the bidder info endpoints.

## Config Options

In PBS-Go, there are several config options are exposed to support this feature.
```
default_request:
    type: "file"
    file:
        name: "/path/to/default.json"
    alias_info: false
```

The `file.name` option is the path/filename of a JSON file containing default request JSON. See the [stored request doc](/prebid-server/features/pbs-storedreqs.html) and the [openrtb2/auction endpoint doc](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html) for details about the syntax.

PBS-Java has a slightly different configuration in application.yaml:
```
default-request:
    file:
        path: "/path/to/default.json"
```


For both PBS-Go and PBS-Java, here's an example default request file:
```
{
    "tmax": "500",
    "regs": {
        "ext": {
            "gdpr": 1
        }
    },
    "ext": {
        "prebid": {
            "aliases": {
                "districtm": "appnexus"
            }
        }
    }
}
```
This JSON is merged into the incoming requests at the top level. The values can be overridden by both Stored Requests _and_ the incoming HTTP request payload.

The `info` option (PBS-Go only) determines if the aliased bidders will be exposed on the `/info` endpoints. If true the alias name will be added to the list returned by
`/info/bidders` and the info JSON for the core bidder will be coppied into `/info/bidder/{biddername}` with the addition of the field
`"alias_of": "{coreBidder}"` to indicate that it is an aliases, and of which core bidder. Turning the info support on may be useful for hosts
that want to support automation around the `/info` endpoints that will include the predefined aliases.  This config option may be deprecated in a future
version to promote a consistency in the endpoint functionality, depending on the perceived need for the option.

## Related Topics

- [Stored Requests](/prebid-server/features/pbs-storedreqs.html)
