---
layout: bidder
title: Nano Interactive
description: Prebid Nano Interactive Bidder Adapter
top_nav_section: dev_docs
nav_section: reference
biddercode: nanointeractive
biddercode_longer_than_12: false
hide: true
prebid_1_0_supported : true
media_types: banner
gdpr_supported: true
---


### bid params: basic call

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                         | Example |
| :------------- | :------- | :---------------------------------- | :------ |
| `pid`        | required | Identification key, always '58bfec94eb0a1916fa380163' | `'58bfec94eb0a1916fa380163'` |

#### Example
    var adUnits = [{
        code: 'basic-div',
        sizes: [[300, 250], [300,600]],
        bids: [{
            bidder: 'nanointeractive',
            params: {
                pid: '58bfec94eb0a1916fa380163'
            }
        }]
    }];

### bid params: hardcoded user search

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                         | Example |
| :------------- | :------- | :---------------------------------- | :------ |
| `pid`        | required | Identification key, always '58bfec94eb0a1916fa380163' | `'58bfec94eb0a1916fa380163'` |
| `nq`   | optional | User search query | `some search query` |

#### Example
    var adUnits = [{
        code: 'nq-div',
        sizes: [[300, 250], [300,600]],
        bids: [{
            bidder: 'nanointeractive',
            params: {
                pid: '58bfec94eb0a1916fa380163',
                // User searched "some search query" (extracted from search text field) 
                nq: 'some search query'
            }
        }]
    }];
    
### bid params: URL user search

{: .table .table-bordered .table-striped }
| Name           | Scope    | Description                         | Example |
| :------------- | :------- | :---------------------------------- | :------ |
| `pid`        | required | Identification key, always '58bfec94eb0a1916fa380163' | `'58bfec94eb0a1916fa380163'` |
| `name`   | optional | Search query param name of the current URL | `search_param` |

#### Example
    var adUnits = [{
        code: 'url-div',
        sizes: [[300, 250], [300,600]],
        bids: [{
            bidder: 'nanointeractive',
            params: {
                pid: '58bfec94eb0a1916fa380163',
                // User searched "some search query" and it is in the URL like:
                // https://www....?search_param=some%20search%20query&...
                name: 'search_param'
            }
        }]
    }];
