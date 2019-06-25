# Prebid Server Bidders

## `GET /info/bidders/all`

This endpoint return details about all the bidders supported by prebid-server. The response is similar to `/info/biders/{bidderName}` but for all bidders rather than the one specified.

### Sample Response

This endpoint returns JSON like:

```
{
    "33across": {
        "capabilities": {
            "app": {
                "mediaTypes": [
                    "banner"
                ]
            },
            "site": {
                "mediaTypes": [
                    "banner"
                ]
            }
        },
        "maintainer": {
            "email": "dev@33across.com"
        }
    },
    "adform": {
        "capabilities": {
            "app": {
                "mediaTypes": [
                    "banner"
                ]
            },
            "site": {
                "mediaTypes": [
                    "banner"
                ]
            }
        },
        "maintainer": {
            "email": "scope.sspp@adform.com"
        }
    },
    .
    .
    .
    .
    "yieldmo": {
        "capabilities": {
            "app": null,
            "site": {
                "mediaTypes": [
                    "banner"
                ]
            }
        },
        "maintainer": {
            "email": "progsupport@yieldmo.com"
        }
    }
}
```

The fields hold the following information:

- `maintainer.email`: A contact email for the Bidder's maintainer. In general, Bidder bugs should be logged as [issues](https://github.com/prebid/prebid-server/issues)... but this contact email may be useful in case of emergency.
- `capabilities.app.mediaTypes`: A list of media types this Bidder supports from Mobile Apps.
- `capabilities.site.mediaTypes`: A list of media types this Bidder supports from Web pages.

If `capabilities.app` or `capabilities.site` do not exist, then that Bidder does not support that platform.
OpenRTB Requests which define a `request.app` or `request.site` property will fail if a
`request.imp[i].ext.{bidderName}` exists for a Bidder which doesn't support them.
