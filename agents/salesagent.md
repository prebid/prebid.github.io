---
layout: page_v2
title: Salesagent
description: A media sales agent that implements the AdCP Media Buy protocol
sidebarType: 10
---

# Prebid Sales Agent

The Prebid Sales Agent is a server that exposes advertising inventory to AI agents via the Model Context Protocol (MCP) and Agent-to-Agent (A2A) protocol. It is designed to integrate with ad servers like Google Ad Manager and provides tools for managing inventory and campaigns throughout their lifecycle.

<div class="alert alert-info" role="alert">
  For the full source code and latest updates, visit the <a href="https://github.com/prebid/salesagent">prebid/salesagent repository</a>.
</div>

## Key Features

### For AI Agents

- **Product Discovery**: Natural language search for advertising products.
- **Campaign Creation**: Automated media buying with targeting capabilities.
- **Creative Management**: Streamlined upload and approval workflows.
- **Performance Monitoring**: Real-time access to campaign metrics.

### For Publishers

- **Multi-Tenant System**: Isolates data per publisher for security and organization.
- **Adapter Pattern**: Supports multiple ad servers (e.g., Google Ad Manager).
- **Real-time Dashboard**: Live activity feed powered by Server-Sent Events (SSE).
- **Workflow Management**: Unified system for human-in-the-loop approvals.
- **Admin Interface**: Web UI with Google OAuth for easy management.

### For Developers

- **MCP Protocol**: Standard interface for AI agents.
- **A2A Protocol**: Agent-to-Agent communication via JSON-RPC 2.0.
- **REST API**: Programmatic tenant management.
- **Docker Deployment**: Easy setup for both local and production environments.

## Getting Started

### Quick Start (Evaluation)

You can try the sales agent locally using Docker:

```bash
# Clone and start
git clone https://github.com/prebid/salesagent.git
cd salesagent
docker compose up -d

# Test the MCP interface
uvx adcp http://localhost:8000/mcp/ --auth test-token list_tools
```

Access services at [http://localhost:8000](http://localhost:8000):

- **Admin UI**: `/admin` (Test credentials: `test123`)
- **MCP Server**: `/mcp/`
- **A2A Server**: `/a2a`

### Production Deployment

For production, publishers can deploy their own sales agent instance. The repository provides guides for various deployment methods, including Docker and cloud platforms.

## The AdContext Protocol (AdCP)

The Sales Agent is built on the **AdContext Protocol (AdCP)**, an open standard designed to standardize how AI agents interact with advertising platforms.

<div class="alert alert-info" role="alert">
  For comprehensive documentation, visit <a href="https://docs.adcontextprotocol.org/docs/intro">docs.adcontextprotocol.org</a>.
</div>

### Protocol Architecture

AdCP operates as a layer on top of standard AI interaction protocols:

- **MCP (Model Context Protocol)**: Facilitates direct integration with AI assistants (e.g., Claude Desktop).
- **A2A (Agent-to-Agent Protocol)**: Enables complex, autonomous workflows and collaboration between agents using JSON-RPC 2.0.

### Core Concepts

AdCP abstracts complex advertising operations into standardized domains:

1. **Inventory Discovery** (`get_products`): Agents can search for ad products using natural language criteria (e.g., "video ads in North America") rather than specific line item IDs.
2. **Media Buying** (`create_media_buy`): A normalized workflow for proposal, negotiation, and booking that works consistently across different ad servers.
3. **Creative Management** (`build_creative`): Standardized handling of creative assets, allowing agents to generate or upload assets that match publisher specifications.
4. **Signal Activation** (`get_signals`, `activate_signal`): Mechanisms for passing context and identity signals to improve targeting and campaign performance.

### Workflow Example

A typical AI-driven campaign flow using AdCP might look like this:

1. **Discovery**: Expected outcome is a list of available "Products" matching the agent's intent.
2. **Planning**: The agent uses `create_media_buy` to submit a proposal.
3. **Review**: The Sales Agent (and potentially a human publisher) reviews the proposal.
4. **Execution**: Once approved, the Sales Agent pushes the orders to the underlying ad server (e.g., GAM).

## Architecture

The project follows a clean structure isolating core MCP components, business logic services, and ad server adapters.

```text
salesagent/
├── src/
│   ├── core/           # Core MCP server components
│   ├── services/       # Business logic services
│   ├── adapters/       # Ad server integrations (e.g., GAM)
│   └── admin/          # Admin UI (Flask)
├── scripts/            # Utility and deployment scripts
└── tests/              # Comprehensive test suite
```

## Contributing

Contributions are welcome! Please refer to the [Development Guide](https://github.com/prebid/salesagent/blob/main/docs/development/README.md) in the repository for details on setting up your environment and creating pull requests.
