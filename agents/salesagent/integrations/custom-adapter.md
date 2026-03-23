---
layout: page_v2
title: Prebid Sales Agent - Building a Custom Adapter
description: How to implement a custom ad server adapter for the Prebid Sales Agent
sidebarType: 10
---

# Prebid Sales Agent - Building a Custom Adapter
{: .no_toc}

- TOC
{:toc}

## Overview

The Prebid Sales Agent uses an abstract adapter pattern to integrate with ad servers. If your ad server is not one of the built-in options (Google Ad Manager, Kevel, Triton Digital, Broadstreet), you can build a custom adapter by implementing the `AdServerAdapter` interface.

This guide walks through the full process of creating, testing, and registering a custom adapter.

## The AdServerAdapter Interface

All adapters extend the abstract base class `AdServerAdapter` defined in `src/adapters/base.py`. The interface consists of required abstract methods, class variables, and optional configuration hooks.

### Required Abstract Methods

Every adapter must implement these five methods:

```python
from src.adapters.base import AdServerAdapter

class MyAdapter(AdServerAdapter):

    async def create_media_buy(self, media_buy, products, creatives=None):
        """Push a new media buy to the ad server.

        Creates the corresponding campaign/order/flight in the ad server
        and returns a result with the external IDs.

        Args:
            media_buy: The MediaBuy object to create.
            products: List of Product objects referenced by the media buy.
            creatives: Optional list of Creative objects to attach.

        Returns:
            MediaBuyResult with ad server IDs and status.
        """
        ...

    async def update_media_buy(self, media_buy, products, creatives=None):
        """Modify an existing media buy in the ad server.

        Updates the campaign/order/flight with changed fields
        (budget, dates, targeting, etc.).

        Args:
            media_buy: The updated MediaBuy object.
            products: List of Product objects referenced by the media buy.
            creatives: Optional list of Creative objects to attach.

        Returns:
            MediaBuyResult with updated status.
        """
        ...

    async def get_media_buy_delivery(self, media_buy):
        """Fetch delivery metrics for a media buy.

        Pulls impressions, clicks, spend, and other delivery data
        from the ad server.

        Args:
            media_buy: The MediaBuy to get delivery for.

        Returns:
            DeliveryResult with current metrics.
        """
        ...

    async def check_media_buy_status(self, media_buy):
        """Check the current status of a media buy in the ad server.

        Returns whether the campaign is active, paused, completed, etc.

        Args:
            media_buy: The MediaBuy to check.

        Returns:
            StatusResult with current ad server status.
        """
        ...

    async def upload_creatives(self, media_buy, creatives):
        """Upload creative assets to the ad server.

        Uploads files, creates creative entities, and associates
        them with the campaign.

        Args:
            media_buy: The MediaBuy to associate creatives with.
            creatives: List of Creative objects to upload.

        Returns:
            CreativeUploadResult with ad server creative IDs.
        """
        ...
```

### Required Class Variables

Every adapter must declare the following class-level variables:

{: .table .table-bordered .table-striped }
| Variable | Type | Description |
|----------|------|-------------|
| `adapter_name` | `ClassVar[str]` | Unique identifier string (e.g., `"my_ad_server"`). Used in the `adapter_config` table and Admin UI. |
| `default_channels` | `list[str]` | Default media channels this adapter supports (e.g., `["display", "video"]`). |
| `default_delivery_measurement` | `dict` | Default delivery measurement configuration for reporting. |

### Optional Configuration

{: .table .table-bordered .table-striped }
| Property | Type | Description |
|----------|------|-------------|
| `connection_config_class` | Pydantic `BaseModel` subclass | Validates adapter-specific connection settings from the JSONB config. |
| `product_config_class` | Pydantic `BaseModel` subclass | Validates product-level adapter configuration. |
| `capabilities` | `AdapterCapabilities` | Declares what the adapter supports (targeting, sync, pricing models, etc.). |

### Instance Properties

The base class provides these properties to all adapter instances:

{: .table .table-bordered .table-striped }
| Property | Type | Description |
|----------|------|-------------|
| `config` | `dict` | Adapter configuration from the `adapter_config` table |
| `principal` | `Principal` | The authenticated advertiser making the request |
| `dry_run` | `bool` | Whether the adapter should execute in dry-run mode |
| `creative_engine` | `CreativeEngineAdapter \| None` | Optional creative processing engine |
| `tenant_id` | `str \| None` | The current tenant's ID |

### Helper Methods

The base class provides helper methods available to all adapters:

- **`log()`** — Structured logging with adapter context
- **`get_supported_pricing_models()`** — Returns the list of pricing models from capabilities
- **`get_targeting_capabilities()`** — Returns the `TargetingCapabilities` for this adapter
- **`validate_media_buy_request()`** — Validates a media buy request against adapter capabilities

## Step-by-Step Guide

### Step 1: Create the Adapter File

Create a new file in `src/adapters/`. For simple adapters, a single file is sufficient. For complex integrations, create a package directory (like `src/adapters/gam/` or `src/adapters/broadstreet/`).

```bash
# Simple adapter
touch src/adapters/my_ad_server.py

# Complex adapter with managers
mkdir -p src/adapters/my_ad_server
touch src/adapters/my_ad_server/__init__.py
touch src/adapters/my_ad_server/adapter.py
touch src/adapters/my_ad_server/client.py
```

### Step 2: Implement the Abstract Interface

Start with the class declaration and required abstract methods:

```python
from typing import ClassVar
from src.adapters.base import (
    AdServerAdapter,
    AdapterCapabilities,
    TargetingCapabilities,
)


class MyAdServer(AdServerAdapter):
    adapter_name: ClassVar[str] = "my_ad_server"
    default_channels: list[str] = ["display"]
    default_delivery_measurement: dict = {
        "impressions": True,
        "clicks": True,
        "spend": True,
    }

    async def create_media_buy(self, media_buy, products, creatives=None):
        # Your implementation here
        ...

    async def update_media_buy(self, media_buy, products, creatives=None):
        ...

    async def get_media_buy_delivery(self, media_buy):
        ...

    async def check_media_buy_status(self, media_buy):
        ...

    async def upload_creatives(self, media_buy, creatives):
        ...
```

### Step 3: Define a Connection Config Class

Create a Pydantic model that validates the adapter-specific settings stored in the `adapter_config` table's JSONB `config` column:

```python
from pydantic import BaseModel, Field
from src.adapters.base import BaseConnectionConfig


class MyAdServerConnectionConfig(BaseConnectionConfig):
    api_url: str = Field(..., description="Base URL for the ad server API")
    api_key: str = Field(..., description="API authentication key")
    network_id: int = Field(..., description="Ad server network identifier")
    timeout_seconds: int = Field(default=30, description="API request timeout")


class MyAdServer(AdServerAdapter):
    adapter_name: ClassVar[str] = "my_ad_server"
    connection_config_class = MyAdServerConnectionConfig
    ...
```

When the adapter is instantiated, the JSONB config is validated against this model. Invalid configurations raise a validation error at startup rather than at request time.

### Step 4: Define Capabilities

Declare what your adapter supports by creating an `AdapterCapabilities` instance:

```python
class MyAdServer(AdServerAdapter):
    adapter_name: ClassVar[str] = "my_ad_server"

    capabilities = AdapterCapabilities(
        supports_inventory_sync=False,
        supports_inventory_profiles=False,
        inventory_entity_label="placement",
        supports_custom_targeting=True,
        supports_geo_targeting=True,
        supports_dynamic_products=False,
        supported_pricing_models=["cpm", "cpc"],
        supports_webhooks=False,
        supports_realtime_reporting=False,
    )
```

### Step 5: Implement Targeting

If your adapter supports targeting, define a `TargetingCapabilities` and implement the targeting methods:

```python
class MyAdServer(AdServerAdapter):
    ...

    def get_targeting_capabilities(self) -> TargetingCapabilities:
        return TargetingCapabilities(
            geo_countries=True,
            geo_regions=True,
            geo_nielsen_dma=False,
            geo_eurostat_nuts2=False,
            geo_uk_itl1=False,
            geo_uk_itl2=False,
            postal_us_zip=True,
            postal_us_zip4=False,
            postal_canadian=False,
            postal_uk=False,
            postal_german=False,
            postal_french=False,
            postal_australian=False,
        )

    def validate_media_buy_request(self, media_buy, products):
        """Validate targeting rules against adapter capabilities."""
        capabilities = self.get_targeting_capabilities()
        # Check that requested targeting dimensions are supported
        # Raise AdCPAdapterError if validation fails
        ...
```

### Step 6: Register the Adapter

Add your adapter to the `AVAILABLE_ADAPTERS` registry in `src/core/main.py`:

```python
from src.adapters.my_ad_server import MyAdServer

AVAILABLE_ADAPTERS = {
    "google_ad_manager": GoogleAdManager,
    "kevel": Kevel,
    "triton_digital": TritonDigital,
    "broadstreet": Broadstreet,
    "mock": MockAdServer,
    "my_ad_server": MyAdServer,  # Add your adapter here
}
```

After registration, the adapter appears as an option in the Admin UI under **Settings > Ad Server**.

## AdapterCapabilities Fields

The `AdapterCapabilities` dataclass declares what features an adapter supports. The Sales Agent uses these declarations to validate requests and expose accurate capability information to AI buying agents.

{: .table .table-bordered .table-striped }
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `supports_inventory_sync` | `bool` | `False` | Whether the adapter can synchronize inventory (ad units, placements) from the ad server |
| `supports_inventory_profiles` | `bool` | `False` | Whether the adapter supports reusable inventory profile configurations |
| `inventory_entity_label` | `str` | `"ad_unit"` | Human-readable label for the ad server's inventory entity (e.g., "ad unit", "placement", "zone") |
| `supports_custom_targeting` | `bool` | `False` | Whether the adapter supports custom key-value targeting |
| `supports_geo_targeting` | `bool` | `False` | Whether the adapter supports geographic targeting |
| `supports_dynamic_products` | `bool` | `False` | Whether products can dynamically reference ad server inventory |
| `supported_pricing_models` | `list[str]` | `[]` | List of supported pricing models (e.g., `["cpm", "cpc", "cpd"]`) |
| `supports_webhooks` | `bool` | `False` | Whether the adapter can send webhook notifications for status changes |
| `supports_realtime_reporting` | `bool` | `False` | Whether the adapter provides real-time (vs. delayed) delivery reporting |

## TargetingCapabilities Fields

The `TargetingCapabilities` dataclass describes the geographic and postal targeting dimensions an adapter supports:

{: .table .table-bordered .table-striped }
| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `geo_countries` | `bool` | `False` | Country-level geographic targeting |
| `geo_regions` | `bool` | `False` | Region/state-level geographic targeting |
| `geo_nielsen_dma` | `bool` | `False` | Nielsen DMA (Designated Market Area) targeting — US broadcast markets |
| `geo_eurostat_nuts2` | `bool` | `False` | EUROSTAT NUTS2 region targeting — European statistical regions |
| `geo_uk_itl1` | `bool` | `False` | UK ITL1 (International Territorial Level 1) targeting — UK nations/regions |
| `geo_uk_itl2` | `bool` | `False` | UK ITL2 targeting — UK sub-regions |
| `postal_us_zip` | `bool` | `False` | US ZIP code targeting |
| `postal_us_zip4` | `bool` | `False` | US ZIP+4 (9-digit) targeting |
| `postal_canadian` | `bool` | `False` | Canadian postal code targeting |
| `postal_uk` | `bool` | `False` | UK postcode targeting |
| `postal_german` | `bool` | `False` | German PLZ (Postleitzahl) targeting |
| `postal_french` | `bool` | `False` | French Code Postal targeting |
| `postal_australian` | `bool` | `False` | Australian postcode targeting |

## Optional Base Mixins

Beyond the core `AdServerAdapter` interface, the Sales Agent provides two optional mixin classes for adapters that need inventory discovery or workflow management capabilities. These are not required -- a minimal adapter only needs `AdServerAdapter`.

### Inventory Discovery Mixin

`BaseInventoryManager` (`src/adapters/base_inventory.py`) provides inventory discovery capabilities for adapters that can browse their ad server's available inventory.

**Abstract methods to implement:**

{: .table .table-bordered .table-striped }
| Method | Description |
|--------|-------------|
| `discover_inventory()` | Fetch available inventory (ad units, placements) from the ad server |
| `validate_inventory_ids(ids: list[str])` | Verify that inventory IDs exist and are accessible |
| `build_inventory_response()` | Format inventory data for API responses |
| `suggest_products()` | Generate product suggestions based on available inventory |

**Example usage:**

```python
from src.adapters.base import AdServerAdapter
from src.adapters.base_inventory import BaseInventoryManager


class MyAdServer(AdServerAdapter, BaseInventoryManager):
    adapter_name: ClassVar[str] = "my_ad_server"

    async def discover_inventory(self):
        # Fetch ad units from your ad server API
        return await self._client.list_ad_units()

    async def validate_inventory_ids(self, ids: list[str]):
        # Verify each ID exists in the ad server
        ...

    async def build_inventory_response(self):
        # Format for the Sales Agent API
        ...

    async def suggest_products(self):
        # Generate product suggestions from inventory
        ...
```

Used by: The GAM adapter (for syncing ad units and placements from Google Ad Manager).

### Workflow Management Mixin

`BaseWorkflowManager` (`src/adapters/base_workflow.py`) provides human-in-the-loop workflow support for adapters that require manual approval steps before executing operations.

**Methods provided:**

{: .table .table-bordered .table-striped }
| Method | Description |
|--------|-------------|
| `create_workflow_step(step_type, owner, request_data)` | Create a new approval task with the given type, owner, and request data |
| `_create_context()` | Initialize a workflow context for grouping related steps |
| `_generate_step_id()` | Generate unique step identifiers |

**Example usage:**

```python
from src.adapters.base import AdServerAdapter
from src.adapters.base_workflow import BaseWorkflowManager


class MyAdServer(AdServerAdapter, BaseWorkflowManager):
    adapter_name: ClassVar[str] = "my_ad_server"

    async def create_media_buy(self, media_buy, products, creatives=None):
        # Require approval before pushing to ad server
        step = await self.create_workflow_step(
            step_type="media_buy_approval",
            owner="ops_team",
            request_data={"media_buy_id": media_buy.id, "budget": media_buy.budget},
        )
        return {"status": "pending_approval", "workflow_step_id": step.id}
```

Used by: Adapters that need manual approval workflows before executing ad server operations.

<div class="alert alert-info" role="alert">
These mixins are optional. A minimal adapter only needs to extend <code>AdServerAdapter</code>. Add <code>BaseInventoryManager</code> if your ad server supports inventory browsing, or <code>BaseWorkflowManager</code> if your integration requires approval workflows.
</div>

## Error Handling

Adapters should raise `AdCPAdapterError` (or its subclasses) for all error conditions. The Sales Agent's error handling infrastructure uses the error's **recovery classification** to determine whether to retry the operation or return an error to the AI buying agent.

```python
from src.adapters.base import AdCPAdapterError

class MyAdServer(AdServerAdapter):
    async def create_media_buy(self, media_buy, products, creatives=None):
        try:
            response = await self._call_api(...)
        except TimeoutError:
            raise AdCPAdapterError(
                "Ad server API timed out",
                recovery="retry",  # Transient error, safe to retry
            )
        except AuthError:
            raise AdCPAdapterError(
                "Invalid API credentials",
                recovery="permanent",  # Not retryable
            )
```

### Recovery Classifications

{: .table .table-bordered .table-striped }
| Classification | Meaning | Behavior |
|----------------|---------|----------|
| `retry` | Transient error (timeout, rate limit, temporary unavailability) | The Sales Agent may retry with exponential backoff |
| `permanent` | Non-recoverable error (invalid credentials, missing permissions, bad input) | The error is returned immediately to the caller |

## Testing Your Adapter

### Unit Tests

Write unit tests that exercise your adapter methods without making real API calls. Use mocking to simulate ad server responses:

```python
import pytest
from unittest.mock import AsyncMock, patch
from src.adapters.my_ad_server import MyAdServer


@pytest.fixture
def adapter():
    config = {
        "api_url": "https://api.example.com",
        "api_key": "test-key",
        "network_id": 12345,
    }
    return MyAdServer(config=config, dry_run=True)


async def test_create_media_buy(adapter, sample_media_buy, sample_products):
    with patch.object(adapter, "_call_api", new_callable=AsyncMock) as mock_api:
        mock_api.return_value = {"order_id": "ext-001", "status": "created"}
        result = await adapter.create_media_buy(sample_media_buy, sample_products)
        assert result.external_id == "ext-001"
        mock_api.assert_called_once()
```

### Integration Tests

If your ad server provides a sandbox or test environment, write integration tests that make real API calls:

```python
@pytest.mark.integration
async def test_end_to_end_flow(live_adapter, sample_media_buy, sample_products):
    # Create
    create_result = await live_adapter.create_media_buy(
        sample_media_buy, sample_products
    )
    assert create_result.external_id is not None

    # Check status
    status = await live_adapter.check_media_buy_status(sample_media_buy)
    assert status.state in ("draft", "pending")

    # Get delivery (may be zero for new campaigns)
    delivery = await live_adapter.get_media_buy_delivery(sample_media_buy)
    assert delivery.impressions >= 0
```

### Structural Tests

The Sales Agent includes structural tests that verify all registered adapters conform to the interface contract. Once you register your adapter in `AVAILABLE_ADAPTERS`, these tests will automatically validate it.

## Example: Minimal Adapter Implementation

Below is a complete minimal adapter that implements all required methods. Use this as a starting point for your own adapter:

```python
from typing import ClassVar
from src.adapters.base import (
    AdServerAdapter,
    AdapterCapabilities,
    AdCPAdapterError,
)


class MinimalAdapter(AdServerAdapter):
    """A minimal adapter implementation for reference."""

    adapter_name: ClassVar[str] = "minimal"
    default_channels: list[str] = ["display"]
    default_delivery_measurement: dict = {
        "impressions": True,
        "clicks": True,
        "spend": True,
    }

    capabilities = AdapterCapabilities(
        supports_inventory_sync=False,
        supports_inventory_profiles=False,
        inventory_entity_label="placement",
        supports_custom_targeting=False,
        supports_geo_targeting=False,
        supports_dynamic_products=False,
        supported_pricing_models=["cpm"],
        supports_webhooks=False,
        supports_realtime_reporting=False,
    )

    async def create_media_buy(self, media_buy, products, creatives=None):
        self.log(f"Creating media buy {media_buy.id}")
        try:
            # Call your ad server API to create the campaign
            external_id = await self._create_campaign(media_buy, products)
            return {"external_id": external_id, "status": "created"}
        except Exception as e:
            raise AdCPAdapterError(
                f"Failed to create campaign: {e}",
                recovery="retry",
            )

    async def update_media_buy(self, media_buy, products, creatives=None):
        self.log(f"Updating media buy {media_buy.id}")
        # Update the campaign in your ad server
        return {"status": "updated"}

    async def get_media_buy_delivery(self, media_buy):
        self.log(f"Fetching delivery for {media_buy.id}")
        # Pull delivery metrics from your ad server
        return {
            "impressions": 0,
            "clicks": 0,
            "spend": 0.0,
        }

    async def check_media_buy_status(self, media_buy):
        self.log(f"Checking status for {media_buy.id}")
        # Check campaign status in your ad server
        return {"state": "active"}

    async def upload_creatives(self, media_buy, creatives):
        self.log(f"Uploading {len(creatives)} creatives for {media_buy.id}")
        # Upload creative assets to your ad server
        return {"uploaded": len(creatives)}

    async def _create_campaign(self, media_buy, products):
        """Private helper to call the ad server API."""
        # Your API integration logic here
        raise NotImplementedError("Replace with real API call")
```

## Registering with the Admin UI

Once your adapter is registered in `AVAILABLE_ADAPTERS`, it automatically appears in the Admin UI:

1. Navigate to **Settings > Ad Server**.
2. Your adapter's `adapter_name` value appears in the adapter type dropdown.
3. When selected, the Admin UI presents a JSONB configuration field where publishers enter your adapter's connection settings.
4. The configuration is validated against your `connection_config_class` when saved.

If you want to provide a richer Admin UI experience (custom form fields, validation messages, or help text), you can extend the adapters blueprint in `src/admin/blueprints/adapters/`.

## Further Reading

- [Architecture & Protocols](/agents/salesagent/architecture.html) — Adapter pattern and system design
- [Google Ad Manager Integration](/agents/salesagent/integrations/gam.html) — Reference implementation for a full-featured adapter
- [Mock Adapter](/agents/salesagent/integrations/mock-adapter.html) — Reference implementation for a simple adapter
- [Kevel Integration](/agents/salesagent/integrations/kevel.html) — Single-file adapter example
