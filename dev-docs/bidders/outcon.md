---
layout: bidder
title: Outcon
description: Prebid Outcon Bidder Adaptor

top_nav_section: dev_docs
nav_section: reference

hide: true

biddercode: outcon




---

### Bid Params

{: .table .table-bordered .table-striped }
| Name          | Scope    | Description 								| Example 					| Type    |
|---------------|----------|--------------------------------------------|---------------------------|---------|
| `pod` 		| optional |require if not send internalId and publisher|"5beeb24a306ea47660632043"	| `string`|
| `internalId`	| optional |require if not send pod						|"563643562"				| `string`|
| `publisher` 	| optional |require if not send pod						|"5beeb24a306ea47660632043"	| `string`|
