---
layout: userid
title: Kinesso ID
description: Kinesso ID User ID sub-module
useridmodule: kinessoIdSystem
---


Kinesso ID solution is a new approach to persistent cross domain authentication.

## How it works

The Kinesso identity solution creates a persistent cross domain authenticated user id that is then used to link users with their interest signals (commonly known as segments).  The Kinesso user ID (knsso) is never broadcast into the bid stream. Instead it is sent to a server side data store, merged with accompanying data from the Prebid Id Library and shipped to Kinesso. All data is encrypted at rest and in transit so your identifiers are never stored or transmitted in an insecure manner.

The Kinesso ID sub adapter sets two cookies, one as a third party cookie and the other as a first party cookie in the publisher's domain. These cookies are merged with the user's hashed email address (when present) server side and sent to Kinesso. The combined output looks like this:

{: .table .table-bordered .table-striped }
| kpuid | knsso | hid | account_id | created on |
| --- | --- | --- | --- | --- |
| `<my_1pc>` | `<my_3pc>` | `<my_hashed_email>` | `<my_ssp_accountid>` | `<my_birthday>` |

Kinesso will then attach these users to deals ids that they will target in the ORTB bid stream by brands and agencies represented by IPG.

Add it to your Prebid.js package with:

{: .alert.alert-info :}
gulp build --modules=kinessoIdSystem

## Kinesso ID Registration

You can set up Kinesso ID sub adapter by contacting Kinesso at <prebid@kinesso.com>

The Kinesso ID privacy policy is covered under the [Kinesso Privacy Notice](https://kinesso.com/privacy-policy/). Please note, at present the Kinesso ID module is not meant for use inside the EEA.

{: .table .table-bordered .table-striped }
| Param under userSync.userIds[] | Scope | Type | Description | Example |
| --- | --- | --- | --- | --- |
| name | Required | String | The name of this module. | `'kpuid'` |
| params | Required | Object | Details for KinessoId initialization | |
| params.accountid | Required | Int | Your SSP Account Id | 123 |
