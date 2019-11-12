---
layout: bidder
title: Outcon
description: Prebid Outcon Bidder Adaptor
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
| `demo` 		| optional |require for testing							|"true"						| `boolean`	|
