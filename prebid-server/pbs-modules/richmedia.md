---
layout: page_v2
page_type: pbs-module
title: Prebid Server Richmedia Blocking Module
display_name : Richmedia Blocking Module
sidebarType : 5
---

# Richmedia Blocking Module
{:.no_toc}

* TOC
{:toc }

## Overview

This module lets Prebid Server accounts define filtering rules for certain types
of richmedia bid responses.

Currently, it can be configured to block MRAID responses for publishers that
do not want MRAID creatives to run.

## Configuration

The parameters to the module are:

{: .table .table-bordered .table-striped }
| Parameter | Type | Scope | Description | Notes |
| --------- | ---- | ----- | ----------- | ----- |
| enabled | boolean | optional | Enable the module for this account | Defaults to false |
| filter-mraid | boolean | optional | Enable the MRAID filter for this account | Defaults to false |
| mraid-script-pattern | string | optional | Required if filter-mraid is true, defines what pattern is used to identity MRAID creatives. | No default |

Here's an example of the account config used in PBS-Java:
```
{
   "hooks": {
      "modules": {
         "pb-richmedia-filter": {
            "enabled": true,
            "filter-mraid": true,
            "mraid-script-pattern": "mraid.js"
            // future richmedia filtering options go here
         }
     },
      "execution-plan": {
            "endpoints": {
                "/openrtb2/amp": {
                    "stages": {
                        "all-processed-bid-responses": {
                            "groups": [
                                {
                                    "timeout": 5,
                                    "hook-sequence": [
                                        {
                                            "module-code": "pb-richmedia-filter",
                                            "hook-impl-code": "pb-richmedia-filter-all-processed-bid-responses-hook"
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                },
                "/openrtb2/auction": {
                    "stages": {
                        "all-processed-bid-responses": {
                            "groups": [
                                {
                                    "timeout": 5,
                                    "hook-sequence": [
                                        {
                                            "module-code": "pb-richmedia-filter",
                                            "hook-impl-code": "pb-richmedia-filter-all-processed-bid-responses-hook"
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

## Further Reading

- [Prebid Server Module List](/prebid-server/pbs-modules/index.html)
- [Building a Prebid Server Module ](/prebid-server/developers/add-a-module.html)
