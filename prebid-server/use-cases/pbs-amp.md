---
layout: page_v2
sidebarType: 5
title: Prebid Server | Use Cases | AMP

---

# Use Case: Prebid Server | AMP
{: .no_toc}

* TOC
{:toc}

[Accelerated Mobile Pages (AMP)](https://ampproject.org/) is an alternate web technology that can speed page performance, but
as part of the tradeoff, header bidding wrappers like Prebid.js don't work well. Instead, AMP supports a method of header bidding called Real Time Configuration(RTC), which is implemented by Prebid Server.

## Workflow

Here's a workflow diagramming how this works.

![Prebid AMP Architecture](/assets/images/flowcharts/prebid-server/pbs-amp-flow.png){:class="pb-xlg-img"}

1. A browser processing an Accelerated Mobile Page (AMP) calls Prebid Server using the Real Time Protocol (RTC) and passing in a number of parameters, including a stored request ID. Each ad on the page is a separate request.
1. Prebid Server looks up the stored request to find which bidders and parameters to use.
1. The auction takes place and bid responses are placed in a cache.
1. Prebid Server responds to the AMP page with results and ad server targeting variables.
1. The ad server targeting variables are sent along to the ad server with the ad request.
1. When header bidding wins in the ad server, the ad server responds with a call to the [Prebid Universal Creative](overview/prebid-universal-creative.html).
1. The Prebid Universal Creative pulls the winning bid from the cache.
1. The Prebid Universal Creative displays the winning bid creative from the cache.

## Details

The following sections give additional details of the steps provided in the workflows.

### AMP RTC Tags are Placed in the Page

As described in the [Prebid AMP Implementation Guide](/dev-docs/show-prebid-ads-on-amp-pages.html), `amp-ad` tags are placed in the AMP content.

There are two basic ways of invoking AMP RTC:

- One option is to use one of the pre-defined [vendors listed in the AMP repo](https://github.com/ampproject/amphtml/blob/master/src/service/real-time-config/callout-vendors.js).

```
  <amp-ad width="300" height="50"
    type="doubleclick"
    data-slot="/11111/amp_test"
    data-multi-size-validation="false"
    rtc-config='{"vendors": {"prebidrubicon": {"REQUEST_ID": "14062-amp-AMP_Test-300x250"}, "ACCOUNT_ID": "1001"}}'
    json='{ "targeting": {"attr1": "val1", "attr2": "val2"}}' >
  </amp-ad>
```

{: .alert.alert-info :}
**Note:** the `prebidrubicon` and `prebidappnexuspsp` AMP vendor strings define slightly different parameters; AppNexus uses "PLACEMENT_ID" as the argument to rtc-config while Rubicon uses "REQUEST_ID". They both translate to `tag_id` when passed to Prebid Server.

- The other option is to construct a direct URL from component pieces: w, h, slot, targeting, gdpr_consent, account, page url (purl), etc.

```
  <amp-ad width="300" height="50"
    type="doubleclick"
    data-slot="/000/amp_test"
    data-multi-size-validation="false"
    rtc-config='{"urls": ["https://prebid-server-qa.example.com/openrtb2/amp?tag_id=11111&w=300&h=50&slot=%2F000%2Famp_test&purl=encoded_page_url&account=333&gdpr_consent=encoded_cmp_consent_string"]
  </amp-ad>
```

### Prebid Server Receives the AMP Request

Prebid Server's first job on the [/openrtb2/amp endpoint](/prebid-server/endpoints/openrtb2/pbs-endpoint-amp.html) is to create an OpenRTB block to pass to the adapters.

#### Prebid Server Resolves the Stored Request ID

The `tag_id` in the AMP URL is used to look up the bulk of the request. If the lookup fails, the request can't proceed. If it's successful, the
next step is to parse the AMP query string parameters and place them
in the appropriate OpenRTB locations. See the [AMP endpoint documentation](/prebid-server/endpoints/openrtb2/pbs-endpoint-amp.html)
for details.

So for the /openrtb2/amp URL above, the resulting OpenRTB might be:
```
{
    "id": "11111",
    "imp": [
        {
            "id": "1",
            "banner": {
                "format": [
                    {
                        "w": 300,
                        "h": 50
                    }
                ]
            },
            "tagid": "/000/amp_test",
            "secure": 1,
            "ext": {
                "bidderA": {
                    "param1": "value1"
                }
            }
        }
    ],
    "site": {
        "page": "https://test.example.com/index.html",
        "publisher": {
            "id": "0000"
        },
        "ext": {
            "amp": 1
        }
    },
    "device": {
        "ua": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36",
    },
    "at": 1,
    "tmax": 1000,
    "cur": [
        "USD"
    ],
    "source": {
        "tid": "54af66d6-3008-4e2e-87db-051137aa89a3"
    },
    "ext": {
        "prebid": {
            "targeting": {
                "pricegranularity": {
                    "ranges": [
                        {
                            "max": 20,
                            "min": 0,
                            "increment": 0.1
                        }
                    ],
                    "precision": 2
                },
                "includewinners": true,
                "includebidderkeys": true
            },
            "cache": {
                "bids": {}
            }
        }
    }
}
```
Note that most of the above OpenRTB was prepared offline and stored in the Prebid Server database indexed by the `tag_id`.
Only a few dynamic parameters on the query string are integrated into the results from the database.

#### First Party Data Support

Ad Server targeting data passed in through the [`/openrtb2/amp`](/prebid-server/endpoints/openrtb2/pbs-endpoint-amp.html) endpoint is merged
into the OpenRTB JSON in imp[].ext.data.

#### Auction and Response

From here, the header bidding auction is mostly the same as it is for Prebid.js:

1. Enforce privacy regulations
1. Call the bidders
1. Collect responses
1. Prepare the response

### AMP Gets the Response

AMP RTC endpoints can only respond with targeting, not OpenRTB. The
format looks like this:

```
{
    "targeting": {
        "hb_cache_id": "f4782932-1a2c-4780-8703-cc7b385b093d",
        "hb_pb": "0.40",
        "hb_cache_path": "/cache",
        "hb_size": "300x50",
        "hb_bidder": "bidderA",
        "hb_cache_host": "prebid-server.example.com",
        "hb_bidid": "1a93d46b-7f74-4992-b375-389a6f661cc4"
    }
}
```

### AMP calls the Ad Server

When all the RTC calls have come back, the AMP infrastructure combines the targeting and calls the ad server.

### Display

When a Prebid ad wins in the ad server, a JavaScript creative is returned to the
AMP page. The JavaScript loads the Prebid Universal Creative code, which
determines that it's the AMP environment, so it
loads the creative body from the cache parameters: `hb_cache_id`, `hb_cache_host`, and `hb_cache_path`. (Or `hb_cache_id_bidderA`, `hb_cache_host_bidderA`, and `hb_cache_path_bidderA` when in send-all-bids mode.)

When the response is received from the Prebid Cache server, it's written
into an iframe for display.

## Further Reading

- [Prebid AMP Support](/formats/amp.html)
- [PBS AMP endpoint](/prebid-server/endpoints/openrtb2/pbs-endpoint-amp.html)
