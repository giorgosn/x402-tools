# X402 Tools Plugin

Developed and managed by [402box.io](https://402box.io) | Contact: george@402box.io

An OpenCode AI plugin that provides payment-gated AI tools via the X402 payment protocol. This plugin enables real-time access to specialized AI agents for Twitter/X search and OSINT (Open Source Intelligence) research, with payments handled automatically through blockchain microtransactions.

## Overview

X402 Tools integrates premium AI capabilities into OpenCode through a pay-per-use model. Each tool invocation triggers a micropayment on the Base blockchain, enabling access to advanced AI services without requiring subscriptions or API keys for the underlying services.

### What is X402?

X402 is a payment protocol that enables micropayments for API calls using blockchain technology. When you use this plugin, each API request is automatically paid for using your Ethereum wallet on the Base network. This allows service providers to monetize their AI tools on a per-request basis.

## Available Tools

### 🔍 `x_searcher`

**Price: 0.05 USDC per request**

AI-powered X/Twitter search agent that provides real-time trends, news, and social media insights.

**Use cases:**
- Monitor trending topics and conversations
- Research public sentiment on specific topics
- Track breaking news and viral content
- Analyze social media discussions
- Discover influencer opinions and threads

**Example queries:**
- "Latest discussions about AI regulation"
- "Trending topics in cryptocurrency today"
- "What are people saying about the new iPhone?"

### 👤 `find_people`

**Price: 0.15 USDC per request**

Real-time Open Source Intelligence (OSINT) agent specialized in researching individuals and professional entities.

**What it does:**
- Identifies people by name, role, or company affiliation
- Retrieves verified career timelines and professional backgrounds
- Finds similar professionals in any industry or domain
- Synthesizes biographical information with source citations
- Validates identities across LinkedIn, company sites, and public records

**Best for:**
- Due diligence research on potential hires or partners
- Competitive intelligence on industry leaders
- Journalist & researcher background verification
- Sales prospecting and lead enrichment
- Investor research on startup founders and executives

**Powered by:**
Neural and deep search capabilities that go beyond standard search engines to find hard-to-reach biographical details, executive profiles, and professional networks.

**Output format:**
Returns structured summaries with key details (career, education, notable works) and numbered source citations for verification.

## Prerequisites

Before installing this plugin, ensure you have:

1. **OpenCode** - The AI coding assistant (https://opencode.ai)
2. **Bun** - JavaScript runtime (https://bun.sh) - Required for local plugin development
3. **Ethereum Wallet** - A private key with funds on the Base network
4. **Base Network ETH** - Small amount of USDC on Base for payment transactions (NO gas needed)

## Installation

### Option 1: Install from npm (Recommended)

1. Add the plugin to your `opencode.json` configuration file:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["@itzannetos/x402-tools"]
}
```

2. Create a configuration file at `.opencode/x402-tools.json` with your private key:

```json
{
  "private_key": "0x..."
}
```

**OR** set it in `.env` at the project root works for WINDOWS systems:

```env
X402_PRIVATE_KEY=0x...
```

3. Restart OpenCode to load the plugin.

### Option 2: Local Development Installation

1. Clone or download this repository

2. Install dependencies for local plugins:

```bash
cd .opencode
bun install
```

3. Create `.opencode/x402-tools.json` with your private key:

```json
{
  "private_key": "0x..."
}
```

**OR** set it in `.env` at the project root:

```env
X402_PRIVATE_KEY=0x...
```

4. Restart OpenCode so the plugin is loaded from `.opencode/plugins/x402-tools.ts`

## Configuration

### Private Key Setup

The plugin needs your Ethereum private key to sign payment transactions. The key is read in this order:

1. **First**: `.opencode/x402-tools.json` file (preferred, keeps config local)
2. **Fallback**: `X402_PRIVATE_KEY` environment variable in `.env` file

**Security Notes:**
- Never commit your private key to version control
- The `.gitignore` is configured to exclude `.opencode/x402-tools.json` and `.env`
- Only use wallets with small amounts of ETH for testing
- The private key must be for the Base network

### Configuration File Format

`.opencode/x402-tools.json`:
```json
{
  "private_key": "0x1234567890abcdef..."
}
```

The `0x` prefix is optional - the plugin will add it automatically if missing.

## Usage

Once installed, you can invoke the tools directly in OpenCode conversations:

### Using X Searcher

```
Use the x_searcher tool to search for "AI breakthroughs in 2026"
```

```
Search X for discussions about "climate change policy"
```

### Using Find People

```
Use the find_people tool to research "Jane Doe, head of AI at ExampleCorp"
```

```
Find information about "Elon Musk, CEO of Tesla"
```

The AI will automatically use the appropriate tool, handle the payment, and return the results.

## How It Works

### Architecture

```
OpenCode → Plugin → X402 Payment Client → AI Service API
                ↓
         Wallet (Base Chain)
```

1. **Plugin Registration**: When OpenCode starts, it loads the plugin and registers the tools
2. **Tool Invocation**: When you request a tool, OpenCode calls the plugin's execute function
3. **Private Key Loading**: The plugin reads your private key from config or environment
4. **Payment Client Setup**: Creates a wallet client using viem on the Base blockchain
5. **Payment Interceptor**: x402-axios wraps Axios to handle payment headers automatically
6. **API Request**: Makes HTTP POST to the AI service endpoint with your query
7. **Payment Processing**: The interceptor signs the payment transaction and includes it in the request
8. **Response**: The service validates payment and returns the AI-generated response

### Technical Details

- **Base URL**: `https://agents.402box.io`
- **Endpoints**:
  - `/x_searcher` - X/Twitter search agent
  - `/find_people` - OSINT research agent
- **Timeout**: 300 seconds (5 minutes) per request
- **Blockchain**: Base (Ethereum L2)
- **Payment Protocol**: X402 (blockchain-based micropayments)

### Dependencies

- `@opencode-ai/plugin` - OpenCode plugin SDK
- `axios` - HTTP client
- `x402-axios` - X402 payment interceptor for Axios
- `viem` - Ethereum library for wallet and transaction signing
- `dotenv` - Environment variable management

## Publishing and Updates

### Publishing to npm

The package is published as `@itzannetos/x402-tools` on npm. To publish updates:

```bash
npm version patch  # or minor, or major
npm publish
```

### Version Management

- Use semantic versioning (semver) for releases
- Reference the package in `opencode.json` using a version range: `"@itzannetos/x402-tools": "^1.0.0"`
- OpenCode installs npm plugins at startup and picks up compatible updates automatically
- Pin an exact version if you want to control upgrades manually

## Troubleshooting

### "X402 private key missing" Error

**Problem**: The plugin can't find your private key.

**Solution**:
- Ensure either `.opencode/x402-tools.json` exists with a valid `private_key` field
- OR set `X402_PRIVATE_KEY` in your `.env` file
- Verify the private key starts with `0x` or let the plugin add it automatically

### Payment Failures

**Problem**: Transactions are failing or timing out.

**Solution**:
- Ensure your wallet has sufficient USDC on the Base network
- Check Base network status (https://status.base.org)
- Verify your private key is valid
- Try with a smaller query first to test connectivity

### "Unexpected response" Errors

**Problem**: API returns unexpected data format.

**Solution**:
- Check your internet connection
- Verify the API service is operational
- Ensure you're using the latest plugin version
- Check if the query format is valid

### Plugin Not Loading

**Problem**: Tools don't appear in OpenCode.

**Solution**:
- Restart OpenCode after installation
- Check `opencode.json` syntax is valid JSON
- For local development, verify `.opencode/plugins/x402-tools.ts` exists
- Check OpenCode logs for error messages

## Development

### Project Structure

```
x402-tools/
├── .opencode/
│   ├── plugins/
│   │   └── x402-tools.ts       # Main plugin implementation
│   ├── package.json             # Local plugin dependencies
│   └── x402-tools.json          # Config file (gitignored)
├── index.ts                     # Package entry point
├── package.json                 # npm package metadata
├── README.md                    # This file
└── .gitignore                   # Git ignore rules
```

### Local Development Workflow

1. Make changes to `.opencode/plugins/x402-tools.ts`
2. Restart OpenCode to reload the plugin
3. Test the tools in OpenCode conversations
4. Commit changes (config files are gitignored automatically)



## Security Considerations

- **Private Keys**: Never commit private keys to version control
- **Wallet Security**: Use a dedicated wallet with limited funds for API payments
- **Network**: Transactions occur on Base mainnet - be aware of gas costs
- **API Trust**: You're trusting the API provider (402box.io) to deliver services
- **Code Review**: Review the plugin code before using to understand what it does with your private key

## License

Check the package repository for license information.

## Coming Soon

We are actively adding more agents and tools in the coming days. Stay tuned for updates!

## Add Your Own Agent

Want to add your own x402 agent to this package? Contact us at george@402box.io to discuss integration.

## Support

For issues, questions, or contributions:
- GitHub Issues: [Report an issue](https://github.com/itzannetos/x402-tools/issues)
- Package: [@itzannetos/x402-tools](https://www.npmjs.com/package/@itzannetos/x402-tools)

## Changelog

### v1.0.0
- Initial release
- X Searcher tool for X/Twitter search
- Find People tool for OSINT research
- X402 payment integration
- Base network support
I want to add that this repo is developed and managed by 402box.io , email of contact is george@402box.io. also add pricing for each. x-search is 0.05 and find_people 0.15 USDC 