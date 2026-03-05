---
layout: page_v2
title: Prebid Sales Agent - Reference - Error Code Reference
description: Catalog of error codes, error response formats, and troubleshooting guidance for the Prebid Sales Agent
sidebarType: 10
---

# Error Code Reference
{: .no_toc}

This page documents all error codes returned by the Prebid Sales Agent, their meanings, and how to resolve them. Errors follow a consistent structure across both MCP and A2A protocols, making it straightforward for buying agents to handle failures programmatically.

- TOC
{:toc}

## Error Response Structure

All tool errors are returned as structured objects with a machine-readable `error_code` and a human-readable `message`. The exact format depends on the protocol being used.

### MCP Error Format

When a tool call fails over the MCP protocol, the error is returned as a `ToolError` within the MCP tool result. The response includes `isError: true` to distinguish it from a successful result:

```json
{
  "isError": true,
  "content": [
    {
      "type": "text",
      "text": "{\"error_code\": \"PRODUCT_NOT_FOUND\", \"message\": \"Product 'prod_invalid' does not exist in this publisher's catalog.\", \"details\": {}}"
    }
  ]
}
```

The `text` field contains a JSON-encoded error object with the following fields:

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `error_code` | `str` | Machine-readable error identifier (e.g., `PRODUCT_NOT_FOUND`) |
| `message` | `str` | Human-readable description of what went wrong |
| `details` | `object` | Optional additional context (validation errors, conflicting values, etc.) |

### A2A Error Format

When a request fails over the A2A protocol, the error follows the JSON-RPC 2.0 error format:

```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32000,
    "message": "PRODUCT_NOT_FOUND: Product 'prod_invalid' does not exist in this publisher's catalog.",
    "data": {
      "error_code": "PRODUCT_NOT_FOUND",
      "details": {}
    }
  },
  "id": 1
}
```

{: .table .table-bordered .table-striped }
| JSON-RPC Field | Description |
|----------------|-------------|
| `error.code` | JSON-RPC error code. Application errors use `-32000` through `-32099`. |
| `error.message` | Combined error code and message string |
| `error.data.error_code` | The AdCP error code, identical to the MCP `error_code` field |
| `error.data.details` | Optional additional context |

### Parsing Errors in Python

Use the following pattern to handle errors consistently in your MCP client code:

```python
from fastmcp import Client

async with Client(transport) as client:
    result = await client.call_tool("create_media_buy", params)

    # Check if the result is an error
    if isinstance(result, dict) and result.get("isError"):
        import json
        error = json.loads(result["content"][0]["text"])
        error_code = error["error_code"]
        message = error["message"]

        if error_code == "PRODUCT_NOT_FOUND":
            # Re-fetch products and retry
            pass
        elif error_code == "VALIDATION_ERROR":
            # Fix parameters and retry
            print(f"Validation failed: {error.get('details', {})}")
        else:
            print(f"Error [{error_code}]: {message}")
    else:
        # Success - process the result
        print(f"Media buy created: {result['media_buy_id']}")
```

## Error Code Catalog

The following table lists all error codes that the Sales Agent may return. Error codes are consistent across MCP and A2A protocols.

{: .table .table-bordered .table-striped }
| Error Code | HTTP Status | Description | Resolution |
|------------|-------------|-------------|------------|
| `AUTHENTICATION_REQUIRED` | 401 | Missing or invalid authentication token. The request did not include an `x-adcp-auth` header (MCP) or `Authorization: Bearer` header (A2A), or the provided token does not match any principal. | Provide a valid authentication token. In test mode, use `test-token`. In production, use a token generated via the Admin UI. |
| `TENANT_NOT_FOUND` | 404 | The tenant context could not be resolved from the authentication token. This typically means the token is valid but the associated tenant has been deleted or deactivated. | Verify the deployment configuration and ensure the tenant exists in the database. Contact the publisher administrator. |
| `PRODUCT_NOT_FOUND` | 404 | The referenced `product_id` does not exist in the publisher's catalog, or has been deactivated. | Call [`get_products`](/agents/salesagent/tools/get-products.html) to retrieve valid product IDs before creating a media buy. |
| `MEDIA_BUY_NOT_FOUND` | 404 | The referenced `media_buy_id` does not exist, or belongs to a different tenant or principal. | Call `get_media_buys` to list your active media buys and verify the ID. |
| `FORMAT_INCOMPATIBLE` | 400 | The creative format does not match the requirements of the target product. For example, uploading a display banner to a video-only product. | Call [`list_creative_formats`](/agents/salesagent/tools/list-creative-formats.html) to check which formats the product supports, and ensure your creative's `format_id` matches. |
| `BUDGET_INSUFFICIENT` | 400 | The specified budget is too low for the requested inventory. The budget does not meet the product's minimum spend requirement or cannot deliver meaningful volume at the selected pricing. | Increase the `budget_cents` value in the package, or select a different pricing option with a lower rate. |
| `TARGETING_TOO_NARROW` | 400 | The combination of targeting constraints (countries, devices, audience segments) excludes all available inventory for the selected product. | Broaden the targeting parameters. Remove restrictive filters or expand geographic and device targeting. |
| `POLICY_VIOLATION` | 403 | The request violates content policies or brand safety rules. This may be triggered by the brand category, creative content, or advertiser classification. | Review the publisher's content standards and brand safety requirements. Contact the publisher to understand which policies apply. |
| `INVALID_PRICING_OPTION` | 400 | The `pricing_option_id` specified in a package does not exist for the selected product, or has been discontinued. | Call [`get_products`](/agents/salesagent/tools/get-products.html) to retrieve current `pricing_options` for the product and use a valid `pricing_option_id`. |
| `VALIDATION_ERROR` | 400 | The request failed schema validation. One or more parameters have incorrect types, missing required fields, or invalid values. | Check the `details` field in the error response for specific validation failures. Correct the parameter types and required fields, then retry. See [Validation Errors](#validation-errors) below. |
| `CONFLICT` | 409 | The operation conflicts with the current state of the resource. For example, attempting to update a media buy that has already been cancelled or completed. | Check the current status of the resource with `get_media_buys` before attempting modifications. |
| `RATE_LIMITED` | 429 | Too many requests in a short time period. The server is rate-limiting your client. | Implement exponential backoff and retry after the duration specified in the `Retry-After` header or error details. |
| `INTERNAL_ERROR` | 500 | An unexpected server error occurred. This indicates a bug or infrastructure issue rather than a client error. | Retry the request. If the error persists, check the server logs and report the issue on the [GitHub Issues](https://github.com/prebid/salesagent/issues) page. |

## Validation Errors

When a request fails Pydantic schema validation, the error code is `VALIDATION_ERROR` and the `details` field contains structured information about each validation failure.

### Validation Error Structure

```json
{
  "error_code": "VALIDATION_ERROR",
  "message": "Request validation failed: 2 errors",
  "details": {
    "errors": [
      {
        "field": "packages.0.budget_cents",
        "message": "value is not a valid integer",
        "type": "int_parsing",
        "input": "not-a-number"
      },
      {
        "field": "start_date",
        "message": "invalid date format",
        "type": "date_parsing",
        "input": "July 1st"
      }
    ]
  }
}
```

### Common Validation Failures

{: .table .table-bordered .table-striped }
| Field | Common Issue | Expected Format |
|-------|-------------|-----------------|
| `budget_cents` | String instead of integer, or negative value | Positive integer (e.g., `500000` for $5,000.00) |
| `start_date` / `end_date` | Non-ISO date format | ISO 8601 date string (e.g., `"2025-07-01"`) |
| `product_id` | Empty string or missing field | Non-empty string matching a valid product |
| `packages` | Empty array | At least one package is required |
| `pricing_option_id` | Missing from package | Required string referencing a valid pricing option |
| `format_id` | Incorrect format identifier | String matching a format from `list_creative_formats` |
| `brief` | Empty string | Non-empty natural language description |
| `media_buy_id` | Missing or null | Non-empty string referencing an existing media buy |

### How Pydantic Validation Works

The Sales Agent uses [Pydantic v2](https://docs.pydantic.dev/) for request validation. When a tool receives parameters, Pydantic validates them against the tool's schema before any business logic executes. This means:

1. **Type coercion is limited** -- Pydantic will attempt reasonable coercions (e.g., `"123"` to `123` for integer fields) but will reject clearly invalid types.
2. **Required fields are enforced** -- Missing required fields produce a `VALIDATION_ERROR` before the tool logic runs.
3. **Nested validation** -- Objects like `packages`, `brand_manifest`, and `targeting` are validated recursively. An error in a nested field reports the full dotted path (e.g., `packages.0.budget_cents`).

## Troubleshooting Tips

### "AUTHENTICATION_REQUIRED" on every request

Verify that your transport is sending the correct header:

```python
# Correct - lowercase header name
transport = StreamableHttpTransport(
    "http://localhost:8000/mcp/",
    headers={"x-adcp-auth": "test-token"}  # MCP auth header
)
```

Common mistakes:

- Using `Authorization: Bearer` instead of `x-adcp-auth` for MCP connections (Bearer is for A2A)
- Forgetting to include the header in the transport constructor
- Using an expired or revoked token

### "PRODUCT_NOT_FOUND" when creating a media buy

Products are tenant-scoped. If you received a `product_id` from a different tenant or from documentation examples, it will not work. Always call `get_products` first to discover valid IDs for your authenticated tenant:

```python
products = await client.call_tool("get_products", {"brief": "all products"})
valid_ids = [p["product_id"] for p in products["products"]]
```

### "FORMAT_INCOMPATIBLE" when uploading creatives

This error means the `format_id` on your creative does not match any format supported by the product in the media buy. Debug by checking both sides:

```python
# Check what formats the product supports
product = products["products"][0]
print(f"Product formats: {product['format_ids']}")

# Check format specifications
formats = await client.call_tool(
    "list_creative_formats",
    {"format_ids": product["format_ids"]}
)
for fmt in formats["formats"]:
    print(f"  {fmt['format_id']}: {fmt['media_type']} "
          f"{fmt['width']}x{fmt['height']}")
```

### "VALIDATION_ERROR" with no obvious cause

Check the `details.errors` array for the specific field and type. Common issues include:

- **Date formats** -- Use ISO 8601 (`"2025-07-01"`), not locale-specific formats
- **Budget as float** -- `budget_cents` must be an integer, not a float (use `500000`, not `5000.00`)
- **Missing packages** -- `create_media_buy` requires at least one entry in the `packages` array
- **Nested objects** -- `brand_manifest`, `targeting`, and `metadata` must be objects, not strings

### "TARGETING_TOO_NARROW" for valid-looking targeting

The intersection of all targeting constraints must match available inventory. Try removing constraints one at a time to identify which filter is too restrictive:

```python
# Start broad, then narrow
targeting_tests = [
    {},  # No targeting - should always work
    {"countries": ["US"]},
    {"countries": ["US"], "devices": ["desktop"]},
    {"countries": ["US"], "devices": ["desktop"], "audiences": ["sports_fans"]},
]

for targeting in targeting_tests:
    try:
        result = await client.call_tool("create_media_buy", {
            # ... other params ...
            "packages": [{"targeting": targeting, ...}]
        })
        print(f"OK with targeting: {targeting}")
        break
    except Exception as e:
        print(f"Failed with targeting: {targeting}")
```

### "INTERNAL_ERROR" responses

Internal errors indicate server-side issues rather than client mistakes. Steps to diagnose:

1. Check the server logs: `docker compose logs salesagent`
2. Verify the database is accessible: `curl http://localhost:8000/health`
3. Retry the request -- transient errors (database timeouts, adapter failures) may resolve on retry
4. If using the mock adapter, ensure no test session state has become corrupted

{: .alert.alert-info :}
If you encounter persistent `INTERNAL_ERROR` responses, file an issue on the [prebid/salesagent GitHub repository](https://github.com/prebid/salesagent/issues) with the full error response and server logs.

## Further Reading

- [Tool Reference](/agents/salesagent/tools/tool-reference.html) -- Complete catalog of MCP tools and their parameters
- [get_products](/agents/salesagent/tools/get-products.html) -- Product discovery tool reference
- [create_media_buy](/agents/salesagent/tools/create-media-buy.html) -- Media buy creation tool reference
- [update_media_buy](/agents/salesagent/tools/update-media-buy.html) -- Media buy modification tool reference
- [sync_creatives](/agents/salesagent/tools/sync-creatives.html) -- Creative management tool reference
- [Campaign Lifecycle Tutorial](/agents/salesagent/tutorials/campaign-lifecycle.html) -- End-to-end walkthrough with working code
- [Architecture & Protocols](/agents/salesagent/architecture.html) -- MCP vs A2A protocol details
- [AdCP Error Specification](https://docs.adcontextprotocol.org/docs/intro) -- Protocol-level error handling standards
