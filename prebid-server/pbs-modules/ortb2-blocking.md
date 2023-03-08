---
layout: page_v2
page_type: pbs-module
title: Prebid Server ORTB2 Blocking Module
display_name : ORTB2 Blocking Module
sidebarType : 5
---

# ORTB2 Blocking Module
{:.no_toc}

* TOC
{:toc }

## Overview

This module helps support bidders that aren't full-service SSPs by allowing
PBS host companies to configure per-account OpenRTB blocking details. 
[OpenRTB 2.5](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) defines the following 6 attributes available for some kind
of bid exclusion logic:

1. badv: blocked advertiser domains
1. bcat: blocked advertiser categories
1. bapp: blocked advertiser mobile app bundles
1. btype: blocked creative types (e.g. XHTML)
1. battr: blocked creative attributes (e.g. audio)
1. bseat: blocked bidder seat (e.g. agency)

The module supports all of these blocking scenarios except the last: bseat. Prebid uses the 'seat' field in OpenRTB to indicate the biddercode, losing any agency
information that might have been passed to the bid adapter.

### Features

For each of the supported attributes, there are a range of behaviors that
can be configured:

- **Configure Blocks**: allows host companies to define blocks globally, per-account, or per-account/bidder combination. This blocking config is sent in the OpenRTB requests to all or specific bidders for consideration in bid determination.
- **Enforce Blocks**: PBS can reject bids from bidders that don't conform to the blocking lists sent in the request.
- **Enforce Unknown Values**: for some attributes it may makes sense to reject requests that don't contain a required value. For instance, the publisher may want to drop any bid that doesn't report the advertiser domain.
- **Deal Overrides**: Private Marketplace deals may have exceptions to standard blocked attributes.

Here's a summary of the features the module supports:

{: .table .table-bordered .table-striped }
| Scenario | Configure Blocks | Enforce Blocks | Enforce Unknown Values | Deal Overrides |
|---+---+---+---+---|
| Advertiser Domains | <img src="/assets/images/icons/icon-check-green.png" width="30"> | <img src="/assets/images/icons/icon-check-green.png" width="30"> | <img src="/assets/images/icons/icon-check-green.png" width="30"> | <img src="/assets/images/icons/icon-check-green.png" width="30"> |
| Advertiser Categories | <img src="/assets/images/icons/icon-check-green.png" width="30"> | <img src="/assets/images/icons/icon-check-green.png" width="30"> | <img src="/assets/images/icons/icon-check-green.png" width="30"> | <img src="/assets/images/icons/icon-check-green.png" width="30"> |
| Apps | <img src="/assets/images/icons/icon-check-green.png" width="30"> | <img src="/assets/images/icons/icon-check-green.png" width="30"> | | <img src="/assets/images/icons/icon-check-green.png" width="30"> |
| Banner Types | <img src="/assets/images/icons/icon-check-green.png" width="30"> | | | |
| Banner Attributes | <img src="/assets/images/icons/icon-check-green.png" width="30"> | <img src="/assets/images/icons/icon-check-green.png" width="30"> | | <img src="/assets/images/icons/icon-check-green.png" width="30"> |

## Configuration

### Execution Plan

This module supports running at two stages:

- bidder-request: this is where outgoing auction requests to each bidder are enriched with the account-specific blocks.
- raw-bidder-response: this is where incoming bid responses are verified and enforced. If a host-company or account don't want to do any enforcement activities, this part of the module doesn't need to be configured.

We recommend defining the execution plan right in the account config
so the module is only invoked for specific accounts. See below for an example.

### Global Config

There is no host-company level config for this module.

### Account-Level Config

Here's a general template for the account config used in PBS-Java:
```
{
    "hooks": {
      "modules": {
        "ortb2-blocking": {   // start of this module's config
          "attributes": {
            "ATTRIBUTE": {    // badv, bcat, bapp, btype, battr
              DEFAULT_SETTINGS, 
              "action-overrides": {
                OVERRIDE_SETTING: [{
                  "conditions": { ... },
		  // the value below will be the datatype of the SETTING
                  "override": VALUE
                }]
              }
            }
          }
        }
      },
      "execution-plan": {
        ...
      }
    }
}
```

PBS-Go version of the same config:
```
{
    "hooks": {
      "modules": {
        "prebid": {
            "ortb2blocking": {   // start of this module's config
              "attributes": {
                "ATTRIBUTE": {    // badv, bcat, bapp, btype, battr
                  DEFAULT_SETTINGS, 
                  "action_overrides": {
                    OVERRIDE_SETTING: [{
                      "conditions": { ... },
              // the value below will be the datatype of the SETTING
                      "override": VALUE
                    }]
                  }
                }
              }
            }
          }
      },
      "execution_plan": {
        ...
      }
    }
}
```

The 'ATTRIBUTE' above is one of the 5 blockable entities defined in OpenRTB. A 'SETTING' is a feature this module supports.
The following sections detail each of the 5 blockable entities.

Here's a detailed example for PBS-Java:
```
{
    "hooks": {
        "modules": {
            "ortb2-blocking": {
                "attributes": {
                    "badv": {
                        "enforce-blocks": false,
                        "blocked-adomain": [],
                        "action-overrides": {
                            "blocked-adomain": [
                                {
                                    "override": [ "example.com" ],
                                    "conditions": {
                                        "bidders": [ "bidderA" ]
                                    }
                                }
                            ]
                        }
                    },
                    "bcat": {
                        "enforce-blocks": false,
                        "blocked-adv-cat": [],
                        "action-overrides": {
                            "blocked-adv-cat": [
                                {
                                    "override": [ "IAB7" ],
                                    "conditions": {
                                        "bidders": [ "bidderA" ]
                                    }
                                }
                            ]
                        }
                    },
                    "battr": {
                        "enforce-blocks": false,
                        "action-overrides": {
                            "blocked-banner-attr": [
                                {
                                    "override": [1,3,8,9,10,13,14,17],
                                    "conditions": {
                                        "bidders": [
                                            "bidderA"
                                        ]
                                    }
                                }
                            ]
                        },
                        "blocked-banner-attr": []
                    }
                }
            }
        },
        "execution-plan": {
            "endpoints": {
                "/openrtb2/amp": {
                    "stages": {
                        "bidder-request": {
                            "groups": [
                                {
                                    "timeout": 5,
                                    "hook-sequence": [
                                        {
                                            "module-code": "ortb2-blocking",
                                            "hook-impl-code": "ortb2-blocking-bidder-request"
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                },
                "/openrtb2/auction": {
                    "stages": {
                        "bidder-request": {
                            "groups": [
                                {
                                    "timeout": 5,
                                    "hook-sequence": [
                                        {
                                            "module-code": "ortb2-blocking",
                                            "hook-impl-code": "ortb2-blocking-bidder-request"
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                }
            }
        }
    }
}
```

For PBS-Go:
```
{
    "hooks": {
        "modules": {
            "prebid": {
                "ortb2blocking": {
                    "attributes": {
                        "badv": {
                            "enforce_blocks": false,
                            "blocked_adomain": [],
                            "action_overrides": {
                                "blocked_adomain": [
                                    {
                                        "override": [ "example.com" ],
                                        "conditions": {
                                            "bidders": [ "bidderA" ]
                                        }
                                    }
                                ]
                            }
                        },
                        "bcat": {
                            "enforce_blocks": false,
                            "blocked_adv_cat": [],
                            "action_overrides": {
                                "blocked_adv_cat": [
                                    {
                                        "override": [ "IAB7" ],
                                        "conditions": {
                                            "bidders": [ "bidderA" ]
                                        }
                                    }
                                ]
                            }
                        },
                        "battr": {
                            "enforce_blocks": false,
                            "action_overrides": {
                                "blocked_banner_attr": [
                                    {
                                        "override": [1,3,8,9,10,13,14,17],
                                        "conditions": {
                                            "bidders": [ "bidderA" ]
                                        }
                                    }
                                ]
                            },
                            "blocked_banner_attr": []
                        }
                    }
                }
            }
        },
        "execution_plan": {
            "endpoints": {
                "/openrtb2/amp": {
                    "stages": {
                        "bidder_request": {
                            "groups": [
                                {
                                    "timeout": 5,
                                    "hook_sequence": [
                                        {
                                            "module_code": "prebid.ortb2blocking",
                                            "hook_impl_code": "ortb2-blocking-bidder-request"
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                },
                "/openrtb2/auction": {
                    "stages": {
                        "bidder_request": {
                            "groups": [
                                {
                                    "timeout": 5,
                                    "hook_sequence": [
                                        {
                                            "module_code": "prebid.ortb2blocking",
                                            "hook_impl_code": "ortb2-blocking-bidder-request"
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                }
            }
        }
    }
}
```

### Configuration Details

The module supports flexibile definition of behavior surrounding the 5 blocked attributes. Here are the details.

#### Blocked Advertiser Config

This attribute is related to the 'badv' of the request, and the 'adomain' of the response.

{: .table .table-bordered .table-striped }
| Setting | Description | Data Type | Override Conditions Supported |
|---+---+---+---|
| blocked-adomain | List of adomains not allowed to display on this inventory | array of strings | bidders (array of strings), media-types (array of strings). |
| enforce-blocks | Whether to enforce adomains in responses | boolean | bidders (array of strings), media-types (array of strings) |
| block-unknown-adomain | Whether to block responses not specifying adomain. Only active if enforce-blocks is true. | boolean | bidders (array of strings), media-types (array of strings) |
| allowed-adomain-for-deals | List of adomains allowed for deals in general or a specific dealid. | array of strings | deal-ids (array of strings). This isn't a true override - values are added to the global. |

Here's an example account config for PBS-Java with several scenarios:
```
{
    "hooks": {
      "modules": {
        "ortb2-blocking": {   // start of this module's config
          "attributes": {
            "badv": {
              // enforce domain blocks by default
              "enforce-blocks": true,
              "block-unknown-adomain": true,
              // these are the default undesirable domains
              "blocked-adomain": [ "a.com", "b.com", "c.com" ],
              // but deals can return this one
              "allowed-adomain-for-deals": [ "a.com" ],
              "action-overrides": {
                  "blocked-adomain": [{
                      // c.com allowed on these bidders for video
                      "conditions": {
                        "bidders": [ "bidderA", "bidderB" ],
                        "media-type": [ "video" ]
                      },
                      "override": [ "a.com", "b.com" ]
                    },
                    {
                      // more domains blocked for this bidder 
                      "conditions": {
                        "bidders": [ "bidderc" ]
                      },
                      "override": [ "a.com", "b.com", "c.com", "d.com", "e.com" ]
                    }
                  ],
                  "block-unknown-adomain": [
                    {
                      // don't block unnknown for video bids from this bidder
                      "conditions": {
                        "bidders": [ "bidderA" ],
                        "media-type": [ "video" ]
                      },
                      "override": false
                    }
                  ],
                  "allowed-adomain-for-deals": [
                    {
                      // this deal is for normally blocked domain b.com
                      "conditions": {
                        "deal-ids": [ "12345678" ]
                      },
                      "override": [ "b.com" ]
                    }
                  ]
              }
            }
          }
        }
      }
    }
}
```

For PBS-Go:
```
{
    "hooks": {
      "modules": {
        "prebid": {
            "ortb2blocking": {   // start of this module's config
              "attributes": {
                "badv": {
                  // enforce domain blocks by default
                  "enforce_blocks": true,
                  "block_unknown_adomain": true,
                  // these are the default undesirable domains
                  "blocked_adomain": [ "a.com", "b.com", "c.com" ],
                  // but deals can return this one
                  "allowed_adomain_for_deals": [ "a.com" ],
                  "action_overrides": {
                      "blocked_adomain": [{
                          // c.com allowed on these bidders for video
                          "conditions": {
                            "bidders": [ "bidderA", "bidderB" ],
                            "media_types": [ "video" ]
                          },
                          "override": [ "a.com", "b.com" ]
                        },
                        {
                          // more domains blocked for this bidder 
                          "conditions": {
                            "bidders": [ "bidderc" ]
                          },
                          "override": [ "a.com", "b.com", "c.com", "d.com", "e.com" ]
                        }
                      ],
                      "block_unknown_adomain": [
                        {
                          // don't block unnknown for video bids from this bidder
                          "conditions": {
                            "bidders": [ "bidderA" ],
                            "media_types": [ "video" ]
                          },
                          "override": false
                        }
                      ],
                      "allowed_adomain_for_deals": [
                        {
                          // this deal is for normally blocked domain b.com
                          "conditions": {
                            "deal_ids": [ "12345678" ]
                          },
                          "override": [ "b.com" ]
                        }
                      ]
                  }                  
                }
              }
            }
        }
      }
    }
}
```

#### Blocked Advertiser Category

This attribute is related to the 'bcat' of the request and 'cat' of the response.

{: .table .table-bordered .table-striped }
| Setting | Description | Data Type | Override Conditions Supported |
|---+---+---+---|
| blocked-adv-cat | List of IAB categories not allowed to display on this inventory | array of strings | bidders (array of strings), media-types (array of strings) |
| enforce-blocks | Whether to enforce cat in responses | boolean | bidders (array of strings), media-types (array of strings) |
| block-unknown-adv-cat | Whether to block responses not specifying cat. Only active if enforce-blocks is true. | boolean | bidders (array of strings), media-types (array of strings) |
| allowed-adv-cat-for-deals | List of adomains allowed for deals in general or a specific dealid. | array of strings | deal-ids (array of strings). This isn't a true override - values are added to the global.|

Here's an example account config for PBS-Java with several scenarios:
```
{
    "hooks": {
      "modules": {
        "ortb2-blocking": {   // start of this module's config
          "attributes": {
            "bcat": {
              // don't enforce blocks
              "enforce-blocks": false,
              // block these categories by default
              "blocked-adv-cat": [ "IAB-1", "IAB-2" ],
              // deals can return this cat
              "allowed-adv-cat-for-deals": [ "IAB-1" ],
              "action-overrides": {
                  "blocked-adv-cat": [
                    {
                      // block additional categories for video
                      "conditions": {
                        "media-types": [ "video" ]
                      },
                      "override": [ "IAB-1", "IAB-2", "IAB-3", "IAB-4" ]
                    }
                  ],
                  "enforce-blocks": [
                    {
                      // enforce bcat blocks for this bidder
                      "conditions": {
                        "bidders": [ "bidderA" ]
                      },
                      "override": true
                    }
                  ],
                  "block-unknown-adv-cat": [
                    {
                      // enforce unknown cat for this bidder
                      "conditions": {
                        "bidders": [ "bidderA" ]
                      },
                      "override": true
                    }
                  ],
                  "allowed-adv-cat-for-deals": [
                    {
                      // this deal ID allowed to be this category
                      "conditions": {
                        "deal-ids": [ "1111111" ]
                      },
                      "override": [ "IAB-2" ]
                    }
                  ]
              }
            }
          }
        }
      }
    }
}
```

For PBS-Go
```
{
    "hooks": {
      "modules": {
        "prebid": {
            "ortb2blocking": {   // start of this module's config
              "attributes": {
                "bcat": {
                  // don't enforce blocks
                  "enforce_blocks": false,
                  // block these categories by default
                  "blocked_adv_cat": [ "IAB-1", "IAB-2" ],
                  // deals can return this cat
                  "allowed_adv_cat_for_deals": [ "IAB-1" ],
                  "action_overrides": {
                      "blocked_adv_cat": [
                        {
                          // block additional categories for video
                          "conditions": {
                            "media_types": [ "video" ]
                          },
                          "override": [ "IAB-1", "IAB-2", "IAB-3", "IAB-4" ]
                        }
                      ],
                      "enforce_blocks": [
                        {
                          // enforce bcat blocks for this bidder
                          "conditions": {
                            "bidders": [ "bidderA" ]
                          },
                          "override": true
                        }
                      ],
                      "block_unknown_adv_cat": [
                        {
                          // enforce unknown cat for this bidder
                          "conditions": {
                            "bidders": [ "bidderA" ]
                          },
                          "override": true
                        }
                      ],
                      "allowed_adv_cat_for_deals": [
                        {
                          // this deal ID allowed to be this category
                          "conditions": {
                            "deal_ids": [ "1111111" ]
                          },
                          "override": [ "IAB-2" ]
                        }
                      ]
                  }
                }
              }
            }
        }
      }
    }
}
```

#### Blocked App

This attribute is related to the 'bapp' of the request and 'bundle' of the response.

{: .table .table-bordered .table-striped }
| Setting | Description | Data Type | Override Conditions Supported |
|---+---+---+---|
| blocked-app | List of bundles not allowed to display on this inventory | array of strings | bidders (array of strings), media-types (array of strings) |
| enforce-blocks | Whether to enforce bundles in responses | boolean | bidders (array of strings), media-types (array of strings) |
| allowed-bapp-for-deals | List of bundles allowed for deals in general or a specific dealid. | array of strings | deal-ids (array of strings). This isn't a true override - values are added to the global. |

Here's an example account config for PBS-Java:
```
{
    "hooks": {
      "modules": {
        "ortb2-blocking": {   // start of this module's config
          "attributes": {
            "bapp": {
              // don't enforce
              "enforce-blocks": false,
              // these bundles blocked by default
              "blocked-app": [ "app1", "app2" ],
              "action-overrides": {
                  "blocked-app": [
                    {
                      // this bidder also blocked for an additional app
                      "conditions": {
                        "bidders": [ "bidderA" ]
                      },
                      "override": [ "app1", "app2", "app3" ]
                    }
                  ]
              }
            }
          }
        }
      }
    }
}
```

For PBS-Go
```
{
    "hooks": {
      "modules": {
        "prebid": {
            "ortb2blocking": {   // start of this module's config
              "attributes": {
                "bapp": {
                  // don't enforce
                  "enforce_blocks": false,
                  // these bundles blocked by default
                  "blocked_app": [ "app1", "app2" ],
                  "action_overrides": {
                      "blocked_app": [
                        {
                          // this bidder also blocked for an additional app
                          "conditions": {
                            "bidders": [ "bidderA" ]
                          },
                          "override": [ "app1", "app2", "app3" ]
                        }
                      ]
                  }
                }
              }
            }
        }
      }
    }
}
```

#### Blocked Banner Type

This attribute is related to the 'btype' of the request.

{: .table .table-bordered .table-striped }
| Setting | Description | Data Type | Override Conditions Supported |
|---+---+---+---|
| blocked-banner-type | List of IAB banner types not allowed to display on this inventory | array of int | bidders (array of strings), media-types (array of strings) |

See Table 5.2 in the [OpenRTB 2.5 spec](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) for the possible values.

Note: no enforcement is possible because the creative type is not explictly
part of the response and Prebid Server does not currently contain logic to
parse creatives to derive the type.

Here's an example account config for PBS-Java:
```
{
    "hooks": {
      "modules": {
        "ortb2-blocking": {   // start of this module's config
          "attributes": {
            "btype": {
              // block these types for all bidders
              "blocked-banner-type": [ 3, 4 ],
              "action-overrides": {
                  "blocked-banner-type": [
                    {
                      // block an additional type for this bidder
                      "conditions": {
                        "bidders": [ "bidderA" ]
                      },
                      "override": [ 3, 4, 5 ]
                    }
                  ]
              }
            }
          }
        }
      }
    }
}
```

For PBS-Go
```
{
    "hooks": {
      "modules": {
        "prebid": {
            "ortb2blocking": {   // start of this module's config
              "attributes": {
                "btype": {
                  // block these types for all bidders
                  "blocked_banner_type": [ 3, 4 ],
                  "action_overrides": {
                      "blocked_banner_type": [
                        {
                          // block an additional type for this bidder
                          "conditions": {
                            "bidders": [ "bidderA" ]
                          },
                          "override": [ 3, 4, 5 ]
                        }
                      ]
                  }
                }
              }
            }
        }
      }
    }
}
```

#### Blocked Banner Attributes

This attribute is related to the 'battr' of the request and 'attr' of the response.

{: .table .table-bordered .table-striped }
| Setting | Description | Data Type | Override Conditions Supported |
|---+---+---+---|
| blocked-banner-attr | List of IAB banner attributes not allowed to display on this inventory | array of int | bidders (array of strings), media-types (array of strings) |
| enforce-blocks | Whether to enforce attr in responses | boolean | bidders (array of strings), media-types (array of strings) |
| allowed-banner-attr-for-deals | List of IAB attributes allowed for deals in general or a specific dealid. | array of strings | deal-ids (array of strings). This isn't a true override - values are added to the global. |

See Table 5.3 in the [OpenRTB 2.5 spec](https://www.iab.com/wp-content/uploads/2016/03/OpenRTB-API-Specification-Version-2-5-FINAL.pdf) for the possible values.

Here's an example account config for PBS-Java:
```
{
    "hooks": {
      "modules": {
        "ortb2-blocking": {   // start of this module's config
          "attributes": {
            "battr": {
              // don't enforce
              "enforce-blocks": false,
              // block these attributes for all bidders
              "blocked-banner-attr": [ 1, 8, 9, 10 ],
              "action-overrides": {
                  "enforce-blocks": [
                    {
                      // enforce the attr block for this bidder
                      "conditions": {
                        "bidders": [ "bidderA" ]
                      },
                      "override": true
                    }
                  ]
              }
            }
          }
        }
      }
    }
}
```

For PBS-Go
```
{
    "hooks": {
      "modules": {
        "prebid": {
            "ortb2blocking": {   // start of this module's config
              "attributes": {
                "battr": {
                  // don't enforce
                  "enforce_blocks": false,
                  // block these attributes for all bidders
                  "blocked_banner_attr": [ 1, 8, 9, 10 ],
                  "action_overrides": {
                      "enforce_blocks": [
                        {
                          // enforce the attr block for this bidder
                          "conditions": {
                            "bidders": [ "bidderA" ]
                          },
                          "override": true
                        }
                      ]
                  }
                }
              }
            }
        }
      }
    }
}
```
## Analytics Tags

There's only one analytics activity defined by this module: "enforce-blocking".
It's only applied to attributes where `enforce-blocks` is true, which means 'btype' never shows up here. ATag values:

1. for activities[].results[].status **success-block**
    1. Attributes in the `values` block:
        1. **bidder**: which bidder triggered the response analysis
        1. **attributes**: string array indicating 1 or more of the 4 blockable attributes (badv, bcat, battr, bapp) triggered the enforcement action
        1. **adomain**: array-of-strings. if badv enforcement fired, which domain(s) triggered the action. Could include the empty string for unknown domain.
        1. **bcat**: array-of-strings. if bcat enforcement fired, which IAB category(s) triggered the action. Could include the empty string for unknown category.
        1. **bundle**: string. If bapp enforcement fired, which bundle triggered the action.
        1. **attr**: array-of-ints. If battr enforcement fired, which IAB creative attribute(s) triggered the action.
    1. Attributes in the `appliedto` block:
        1. **imp**: the seatbid.bid.impid of the blocked response 
        1. **bidder**: the biddercode of the blocked response
1. for activities[].results[].status **success-allow**
    1. No `values` block
    1. Attributes in the `appliedto` block:
        1. **imp**: the seatbid.bid.impid of the blocked response 
        1. **bidder**: the biddercode of the blocked response

Here's an example analytics tag that might be produced for use in an analytics adapter:
```
[{
   activities: [{
    name: "enforce-blocking",
    status: "success",
    results: [{
        // bidderA was blocked for both badv and bcat for imp=1
        status: "success-block",
        values: { 
          "attributes": ["badv", "bcat"],
          "adomain": ["bad.com"],
          "bcat": ["IAB-7"]
        },
        appliedto: {
          "bidder": "bidderA",
           imp: ["1"]
        }
     },{
        // the other 3 bids from bidderA were ok
        status: "success-allow",
        appliedto: {
          "bidder": "bidderA",
          "imp": ["2","3","4"]
        }
     },{
        // scenario: bidderB not blocked at all
        status: "success-allow",
        appliedto: {
          "bidder": "bidderB",
          "imp": ["1","2","3","4"] }
     },{
       // scenario: bidderC blocked on battr and bapp for imp=3
        status: "success-block",
        values: { 
          "app": "com.test",
          "attr": [2]
          "attributes": ["bapp", "battr"]
        },
        appliedto: {
          "bidder": "bidderC",
          "imp": ["3"]
        }
     },{
        // otherwise bidderC's bids were fine
        status: "success-allow",
        appliedto: {
          "bidder": "bidderC",
          "imp": ["1","2","4"]
        }
     }]
  }]
}]
```

## Further Reading

- [Prebid Server Module List](/prebid-server/pbs-modules/index.html)
- [Building a Prebid Server Module ](/prebid-server/developers/add-a-module.html)
