---
layout: page_v2
title: Prebid Sales Agent - Integrations - Building a Custom Adapter
description: Guide to implementing a custom ad server adapter for the Prebid Sales Agent
sidebarType: 10
---

# Building a Custom Adapter
{: .no_toc}

The Sales Agent uses an adapter pattern to integrate with ad servers. This page documents the `AdServerAdapter` abstract base class and walks through the process of building a custom adapter for an ad server not already supported.

- TOC
{:toc}

## Adapter Pattern Overview

Every ad server integration is a subclass of `AdServerAdapter`, located in `src/adapters/base.py`. The base class defines a set of abstract methods that the Sales Agent core calls to create campaigns, upload creatives, check delivery, and manage media buys. Your adapter translates these calls into the API operations of your ad server.

```text
┌─────────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│  Sales Agent Core   │────▶│  AdServerAdapter      │────▶│  Your Ad Server │
│  (business logic)   │     │  (abstract interface)  │     │  (external API)  │
└─────────────────────┘     └──────────────────────┘     └─────────────────┘
                                     ▲
                                     │
                            ┌────────┴────────┐
                            │  YourAdapter()   │
                            │  (your impl)     │
                            └─────────────────┘
```

The adapter is instantiated with the following constructor signature:

```python
def __init__(self, config, principal, dry_run=False, creative_engine=None, tenant_id=None):
```

{: .table .table-bordered .table-striped }
| Parameter | Type | Description |
|-----------|------|-------------|
| `config` | `dict` | Adapter-specific configuration loaded from the database |
| `principal` | `Principal` | The authenticated principal (advertiser) making the request |
| `dry_run` | `bool` | When `True`, the adapter should simulate operations without making real API calls |
| `creative_engine` | `CreativeEngine` or `None` | Optional creative processing engine for format conversions |
| `tenant_id` | `str` or `None` | The tenant identifier for multi-tenant deployments |

## Required Abstract Methods

Your adapter must implement all seven of the following methods. The Sales Agent core calls these methods during the media buy lifecycle.

### create_media_buy

Creates a new media buy (campaign/order) in the ad server.

```python
def create_media_buy(self, request, packages, start_time, end_time, package_pricing_info=None):
```

{: .table .table-bordered .table-striped }
| Parameter | Type | Description |
|-----------|------|-------------|
| `request` | `CreateMediaBuyRequest` | The media buy specification including advertiser, budget, and targeting |
| `packages` | `list` | Product packages to include in the media buy |
| `start_time` | `datetime` | Campaign start time |
| `end_time` | `datetime` | Campaign end time |
| `package_pricing_info` | `dict` or `None` | Optional pricing overrides per package |

**Returns:** `CreateMediaBuyResponse` -- contains the media buy ID, line item IDs, and status.

### add_creative_assets

Uploads creative assets to the ad server and associates them with a media buy.

```python
def add_creative_assets(self, media_buy_id, assets, today):
```

{: .table .table-bordered .table-striped }
| Parameter | Type | Description |
|-----------|------|-------------|
| `media_buy_id` | `str` | The media buy to associate creatives with |
| `assets` | `list` | Creative asset objects containing file data, dimensions, and format metadata |
| `today` | `date` | Current date for time-based logic |

**Returns:** `list[AssetStatus]` -- status of each uploaded asset (success, pending review, or error).

### associate_creatives

Associates previously uploaded platform creatives with specific line items.

```python
def associate_creatives(self, line_item_ids, platform_creative_ids):
```

{: .table .table-bordered .table-striped }
| Parameter | Type | Description |
|-----------|------|-------------|
| `line_item_ids` | `list` | Line item identifiers in the ad server |
| `platform_creative_ids` | `list` | Creative identifiers in the ad server |

**Returns:** `list[dict]` -- association results for each line item / creative pair.

### check_media_buy_status

Retrieves the current status of a media buy from the ad server.

```python
def check_media_buy_status(self, media_buy_id, today):
```

{: .table .table-bordered .table-striped }
| Parameter | Type | Description |
|-----------|------|-------------|
| `media_buy_id` | `str` | The media buy to check |
| `today` | `date` | Current date for time-based status calculations |

**Returns:** `CheckMediaBuyStatusResponse` -- contains the overall status, per-line-item statuses, and any error messages.

### get_media_buy_delivery

Fetches delivery metrics (impressions, clicks, spend) for a media buy over a date range.

```python
def get_media_buy_delivery(self, media_buy_id, date_range, today):
```

{: .table .table-bordered .table-striped }
| Parameter | Type | Description |
|-----------|------|-------------|
| `media_buy_id` | `str` | The media buy to query |
| `date_range` | `DateRange` | Start and end dates for the delivery report |
| `today` | `date` | Current date for relative calculations |

**Returns:** `AdapterGetMediaBuyDeliveryResponse` -- delivery metrics including impressions, clicks, spend, and pacing data.

### update_media_buy_performance_index

Updates the performance index for packages within a media buy. The performance index is used by the Sales Agent to adjust pacing and optimization.

```python
def update_media_buy_performance_index(self, media_buy_id, package_performance):
```

{: .table .table-bordered .table-striped }
| Parameter | Type | Description |
|-----------|------|-------------|
| `media_buy_id` | `str` | The media buy to update |
| `package_performance` | `dict` | Performance index values keyed by package ID |

**Returns:** `bool` -- `True` if the update succeeded.

### update_media_buy

Modifies an existing media buy (pause, resume, cancel, adjust budget, etc.).

```python
def update_media_buy(self, media_buy_id, buyer_ref, action, package_id, budget, today):
```

{: .table .table-bordered .table-striped }
| Parameter | Type | Description |
|-----------|------|-------------|
| `media_buy_id` | `str` | The media buy to modify |
| `buyer_ref` | `str` | Buyer reference identifier |
| `action` | `str` | The action to perform (e.g., `pause`, `resume`, `cancel`, `adjust_budget`) |
| `package_id` | `str` | The specific package/line item to target, if applicable |
| `budget` | `int` or `None` | New budget value in cents, if adjusting budget |
| `today` | `date` | Current date for time-based logic |

**Returns:** `UpdateMediaBuyResponse` -- updated status and confirmation details.

## Optional Override Methods

The base class provides default implementations for these methods. Override them to expose additional capabilities.

### get_supported_pricing_models

Returns the set of pricing models your ad server supports.

```python
def get_supported_pricing_models(self) -> set[str]:
    # Default: {"cpm"}
```

Return a set of strings from the supported values: `cpm`, `vcpm`, `cpcv`, `cpp`, `cpc`, `cpv`, `flat_rate`.

### get_targeting_capabilities

Returns the targeting dimensions your ad server supports.

```python
def get_targeting_capabilities(self) -> TargetingCapabilities:
    # Default: geo countries only
```

The default implementation advertises country-level geographic targeting only. Override this to declare support for regions, DMAs, postal codes, or custom targeting dimensions.

### get_packages_snapshot

Returns near-real-time delivery snapshots for active packages.

```python
def get_packages_snapshot(self):
```

Override this to provide live pacing data that the Sales Agent uses for in-flight optimization.

### get_available_inventory

Returns available inventory data for AI-driven product configuration.

```python
def get_available_inventory(self):
```

Override this to allow the Sales Agent to query your ad server for available inventory when configuring products.

### get_creative_formats

Returns the creative formats your ad server accepts.

```python
def get_creative_formats(self):
```

Override this to declare custom creative format support beyond the defaults.

### validate_product_config

Validates a product configuration against your ad server's constraints.

```python
def validate_product_config(self):
```

Override this to add ad-server-specific validation when products are created or updated in the Admin UI.

### get_config_ui_endpoint

Returns a URL path for a custom configuration UI.

```python
def get_config_ui_endpoint(self):
```

Override this if your adapter provides its own web-based configuration interface.

### register_ui_routes

Registers Flask routes for a custom adapter configuration UI.

```python
def register_ui_routes(self, app):
```

Override this to mount custom Flask endpoints for adapter-specific settings pages.

## Key Dataclasses

### TargetingCapabilities

Declares which targeting dimensions your adapter supports.

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `geo_countries` | `bool` | Country-level geographic targeting |
| `geo_regions` | `bool` | Region/state-level geographic targeting |
| `nielsen_dma` | `bool` | Nielsen DMA (Designated Market Area) targeting |
| `postal_codes_us` | `bool` | US postal code targeting |
| `postal_codes_ca` | `bool` | Canadian postal code targeting |
| `postal_codes_gb` | `bool` | UK postal code targeting |
| `postal_codes_de` | `bool` | German postal code targeting |
| `postal_codes_fr` | `bool` | French postal code targeting |
| `postal_codes_au` | `bool` | Australian postal code targeting |

The `validate_geo_systems()` method on `TargetingCapabilities` checks that the declared targeting dimensions are internally consistent.

### AdapterCapabilities

Declares the overall feature set of your adapter.

{: .table .table-bordered .table-striped }
| Field | Type | Description |
|-------|------|-------------|
| `supports_inventory_sync` | `bool` | Whether the adapter can sync inventory data from the ad server |
| `supports_custom_targeting` | `bool` | Whether the adapter supports key-value or custom targeting |
| `supports_geo_targeting` | `bool` | Whether the adapter supports geographic targeting |
| `supported_pricing_models` | `set[str]` | Set of supported pricing model strings |
| `supports_webhooks` | `bool` | Whether the adapter can receive webhook callbacks |
| `supports_realtime_reporting` | `bool` | Whether the adapter can provide real-time delivery data |

### BaseConnectionConfig and BaseProductConfig

Pydantic `BaseModel` subclasses for adapter configuration validation. Both are configured with `extra="forbid"` to reject unknown fields.

- **`BaseConnectionConfig`** -- Extend this to define the connection parameters your adapter needs (API keys, network IDs, endpoint URLs).
- **`BaseProductConfig`** -- Extend this to define product-level configuration fields specific to your ad server.

```python
from pydantic import BaseModel

class MyConnectionConfig(BaseConnectionConfig):
    api_key: str
    endpoint_url: str
    network_id: str

class MyProductConfig(BaseProductConfig):
    line_item_type: str = "standard"
    priority: int = 8
```

## Class Attributes

Set these class-level attributes on your adapter subclass.

{: .table .table-bordered .table-striped }
| Attribute | Type | Description |
|-----------|------|-------------|
| `adapter_name` | `str` | Unique identifier for the adapter (e.g., `"my_ad_server"`) |
| `default_channels` | `list` | Default advertising channels (e.g., `["display", "video"]`) |
| `capabilities` | `AdapterCapabilities` | Feature declaration for the adapter |
| `connection_config_class` | `type` | Pydantic model class for connection settings |
| `product_config_class` | `type` | Pydantic model class for product settings |

## Helper Methods

The base class provides utility methods available to all adapters.

{: .table .table-bordered .table-striped }
| Method | Description |
|--------|-------------|
| `log()` | Returns a logger scoped to the adapter for structured logging |
| `get_adapter_id(principal)` | Resolves the adapter configuration ID for a given principal |
| `audit_logger` | Property that returns the `AuditLogger` instance for recording operations |

## Skeleton Adapter Example

The following skeleton shows the minimum structure for a custom adapter:

```python
from src.adapters.base import (
    AdServerAdapter,
    AdapterCapabilities,
    BaseConnectionConfig,
    BaseProductConfig,
    TargetingCapabilities,
)


class MyConnectionConfig(BaseConnectionConfig):
    api_key: str
    endpoint_url: str


class MyProductConfig(BaseProductConfig):
    line_item_type: str = "standard"


class MyAdServerAdapter(AdServerAdapter):
    adapter_name = "my_ad_server"
    default_channels = ["display", "video"]
    capabilities = AdapterCapabilities(
        supports_inventory_sync=False,
        supports_custom_targeting=True,
        supports_geo_targeting=True,
        supported_pricing_models={"cpm", "cpc"},
        supports_webhooks=False,
        supports_realtime_reporting=False,
    )
    connection_config_class = MyConnectionConfig
    product_config_class = MyProductConfig

    def create_media_buy(self, request, packages, start_time, end_time, package_pricing_info=None):
        # Translate to your ad server's campaign/order creation API
        order_id = self._call_api("POST", "/orders", {
            "name": request.name,
            "budget": request.budget_cents,
            "start": start_time.isoformat(),
            "end": end_time.isoformat(),
        })
        self.audit_logger.log_operation(
            operation="create_media_buy",
            principal_name=self._principal.name,
            principal_id=str(self._principal.id),
            adapter_id=self.get_adapter_id(self._principal),
            success=True,
            details={"order_id": order_id},
        )
        return CreateMediaBuyResponse(media_buy_id=order_id, status="created")

    def add_creative_assets(self, media_buy_id, assets, today):
        # Upload each asset to your ad server
        ...

    def associate_creatives(self, line_item_ids, platform_creative_ids):
        # Link creatives to line items in your ad server
        ...

    def check_media_buy_status(self, media_buy_id, today):
        # Query your ad server for campaign status
        ...

    def get_media_buy_delivery(self, media_buy_id, date_range, today):
        # Fetch delivery metrics from your ad server's reporting API
        ...

    def update_media_buy_performance_index(self, media_buy_id, package_performance):
        # Update performance indices on your ad server
        ...

    def update_media_buy(self, media_buy_id, buyer_ref, action, package_id, budget, today):
        # Modify campaign state (pause, resume, cancel, adjust budget)
        ...

    def _call_api(self, method, path, payload):
        """Internal helper to make authenticated API calls."""
        ...
```

{: .alert.alert-info :}
For a complete, working adapter implementation, see the [Mock Adapter Reference](/agents/salesagent/integrations/mock-adapter.html). The mock adapter implements every abstract and optional method and is a good starting point for a new integration.

## Further Reading

- [Google Ad Manager Integration](/agents/salesagent/integrations/gam.html) -- Production GAM adapter setup and configuration
- [Mock Adapter Reference](/agents/salesagent/integrations/mock-adapter.html) -- Complete reference adapter for testing
- [Source Architecture](/agents/salesagent/developers/source-architecture.html) -- Adapter source code organization and module layout
- [Architecture & Protocols](/agents/salesagent/architecture.html) -- System design and adapter pattern context
