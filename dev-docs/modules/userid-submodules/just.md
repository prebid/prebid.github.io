---
layout: userid
title: Just ID
description: Just ID User ID sub-module
useridmodule: justIdSystem
---


[Justtag Group](https://www.justtag.com/en) is a European, privacy focused DMP and segment provider. Having a leading position in Poland and growing presence in the CEE region, we created Just ID - an alternative ID solution, designed to respect users’ privacy choices which doesn’t rely on 3rd party cookies. Our aim is to help Publishers and Advertisers to recognize users across various environments and enable ad-tech market players with a smooth transition into post 3rd party cookie era.

## Just ID Modes

- **BASIC** - In this mode we rely on Justtag library that already exists on publisher page. Typicaly that library expose global variable called `__atm`

- **COMBINED** - Just ID generation process may differ between various cases depends on publishers. This mode combines our js library with prebid for ease of integration

If you have any questions about Just ID, please reach out by emailing [prebid@justtag.com](mailto:prebid@justtag.com).

## Just ID Configuration

{: .table .table-bordered .table-striped }
| Param under usersync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | ID of the module - `'justId'` | `'justId'` |
| params | Optional | Object | Details for Just ID syncing. | |
| params.mode | Optional | String | Mode in which the module works. Available Modes: `'COMBINED'`, `'BASIC'`(default)   | `'COMBINED'` |
| params.atmVarName | Optional | String | Name of global object property that point to Justtag ATM Library. Defaults to `'__atm'` | `'__atm'` |
| params.url | Optional | String | API Url, **required** in `COMBINED` mode | `'https://id.nsaudience.pl/getId.js'` |
| params.partner | Optional | String | This is the Justtag Partner Id which may be required in some custom integrations with Justtag | `'some-publisher'` |

## Just ID Example

ex. 1. Mode `COMBINED`

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'justId',
            params: {
                mode: 'COMBINED',
                url: 'https://id.nsaudience.pl/getId.js'
            }
        }]
    }
});
```

ex. 2. Mode `BASIC`

```javascript
pbjs.setConfig({
    userSync: {
        userIds: [{
            name: 'justId'
        }]
    }
});
```

## Just ID  Disclosure

This module in `COMBINED` mode loads external JavaScript to generate optimal quality user ID. It is possible to retrieve user ID, without loading additional script by this module in `BASIC` mode.
