---
layout: page_v2
sidebarType: 5
title: Prebid Server | Endpoints | OpenRTB2 | Auction Example
---

# Prebid Server | Endpoints | /openrtb2/auction -- Example

This is an example of a Prebid Server-flavored OpenRTB auction request with most fields present.
It serves 2 purposes:

- Give context about what custom server-to-server integrations could implement. i.e. if you're building a server that will sit in front of Prebid Server, these are many of the fields that can be provided.
- Provide an example for bid adapter developers to understand what their code will see for each auction. Prebid Server does modify the auction request before giving it to a bid adapter because individual bidders are not allowed to see details from other adapters. The example is annotated with differences between the incoming auction request and what adapters see.

## POST /openrtb2/auction

```json
{
    "id": "123456789",
    "source": {
        "tid": "a64e6b91-7bfd-4f0b-9861-99307e41f971"
    },
    "tmax": 1000,
    "imp": [
        {
            "ext": {
                "ae": 1,
                "gpid": "/1111/adslot#2",
                "data": {
                    "adserver": {
                        "name": "gam",
                        "adslot": "/1111/adslot"
                    }
                },
                "tid": "4f8f2e78-94b0-431b-b735-6da38a6f3ef0",
                "prebid": {                    // bid adapters don't see this object
                    "bidder": {
                        "bidderAlias": {       // bid adapters don't see this object
                            "placement": 1001  // The contents of this object are seen by adapters at imp[].ext.bidder
                        }
                    },
                    "passthrough": {           // bid adapters don't see this object
                        "attr": "val"
                    }
                }
            },
            "id": "test-div",
            "banner": {
                "format": [
                    {
                        "w": 300,
                        "h": 250
                    },
                    {
                        "w": 300,
                        "h": 600
                    },
                    {
                        "w": 728,
                        "h": 90
                    }
                ]
            },
            "bidfloor": 0.98,
            "bidfloorcur": "USD"
        }
    ],
    "test": 1,
    "ext": {
        "prebid": {
            "trace": "verbose",
            "returnallbidstatus": true, // bid adapters don't see this object
            "auctiontimestamp": 1664308667064,
            "cache": {                  // bid adapters don't see this object
                "vastXml": {}
            },
            "targeting": {              // bid adapters don't see this object
                "includewinners": true,
                "includebidderkeys": false
            },
            "floors": {                 // bid adapters don't see this object
                "enabled": false
            },
            "channel": {
                "name": "pbjs",
                "version": "v7.17.0"
            },
            "createtid": false,         // bid adapters don't see this object
            "integration": "mbjs",
            "currency": {
                "rates": {
                  "USD": { "UAH": 24.47, "ETB": 32.04 }
                },
                "usepbsrates": true
            },
            "debug": true,
            "aliases": {                // bid adapters don't see this object
                "bidderAlias": "bidderA"
            },
            "aliasgvlids": {            // bid adapters don't see this object
                "bidderAlias": 999999
            },
            "bidadjustmentfactors": {   // bid adapters don't see this object
                "bidderA": 0.9
            },
            "bidderparams": {           // bid adapters don't see this object
                "bidderA": {
                    "globalparam": "value" // bid adapter will see this added to the imp.ext.bidder object
                }
            },
            "schains": [{
                "bidders": ["bidderA"],
                "schain": { SCHAIN OBJECT 1} // bid adapters will see their schain on source.[ext.]schain.
            }],
            "server": {
	        "externalurl": "https://prebid-server.example.com",
	        "gvlid": 9999999,
	        "datacenter": "us-east-1"
            },
            "data": {
                "eidpermissions": [       // bid adapters don't see this object
                    {"source": "sharedid.org", "bidders": ["*"]},  // * is the default
        ]
            },
            "biddercontrols": {           // bid adapters don't see this object
                "bidderB": { "prefmtype": "video" }
            },
            "bidderconfig": [             // bid adapters don't see this object
                {
                    "bidders": [
                        "bidderAlias"
                    ],
                    "config": {
                        "ortb2": {
                            "site": {
                                "ext": {
                                    "data": {
                                        "customsite": "customsite1"
                                    }
                                }
                            },
                            "user": {
                                "ext": {
                                    "data": {
                                        "customuser": "customuser1"
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        }
    },
    "cur": [
        "CAD"
    ],
    "site": {
        "publisher": {
            "id": "1001",
            "domain": "example.com"
        },
        "page": "http://lh.example.com/prebid_server_kitchen_sink.html?pbjs_debug=true",
        "domain": "site-domain",
        "keywords": "skw1,skw2",
        "name": "site-name",
        "cat": [
            "site-cat"
        ],
        "sectioncat": [
            "site-scat"
        ],
        "pagecat": [
            "site-pcat"
        ],
        "ref": "site-ref",
        "search": "site-search",
        "content": {
            "userrating": "4",
            "data": [
                {
                    "name": "www.dataprovider1.com",
                    "ext": {
                        "segtax": 6
                    },
                    "segment": [
                        {
                            "id": "123"
                        },
                        {
                            "id": "456"
                        }
                    ]
                }
            ]
        },
        "ext": {
            "data": {
                "siteextdata": "site-ext-data",
                "siteextdata2": "site-ext-data2"
            }
        }
    },
    "device": {
        "w": 1434,
        "h": 686
    },
    "regs": {
        "gdpr": 1,
        "coppa": 0,
        "gpp": "DBABBg~BVpAAEBY.QA",
        "gpp_sid": [7]
    },
    "user": {
        "ext": {
            "consent": "CO_d4kAPPVBUAADABCENB0CoAP_AAE7AAAAAF5wAwAQAA0AXmBecAMAEAANAF5gAAA.YAAAAAAAA4AA",
            "data": {
                "userextdata": "user-ext-data",
                "userextdata2": "user-ext-data2"
            }
        },
        "keywords": "ukw1,ukw2",
        "data": [
            {
                "name": "www.dataprovider1.com",
                "ext": {
                    "segtax": 4
                },
                "segment": [
                    {
                        "id": "123"
                    },
                    {
                        "id": "456"
                    }
                ]
            }
        ]
    }
}
```

### Further Reading

- [PBS auction endpoint](/prebid-server/endpoints/openrtb2/pbs-endpoint-auction.html)
