# x402-tools-plugin

Local OpenCode plugin that provides payment-gated tools via X402.

## Tools

- `x_searcher` - AI-powered X/Twitter search agent for real-time trends and social insights.
- `find_people` - OSINT agent for researching individuals and professional entities.

## Local Installation

1. Ensure Bun is installed.
2. Install dependencies for local plugins:

```bash
cd /Users/itzannet/Documents/GitHub/x402-tools-plugin/.opencode
bun install
```

3. Create `.opencode/x402-tools.json` with your key:

```json
{
  "private_key": "0x..."
}
```

4. Or set it in `.env` at the project root:

```
X402_PRIVATE_KEY=0x...
```

5. Restart OpenCode so the plugin is loaded.

## Usage

In OpenCode, invoke the tools by name:

```
Use the x_searcher tool to search for "AI breakthroughs in 2026".
```

```
Use the find_people tool to research "Jane Doe, head of AI at ExampleCorp".
```

## Local Plugin Location

The plugin is loaded automatically from:

```
.opencode/plugins/x402-tools.ts
```

## Publishing and Updates

- Publish to npm and reference the package in `opencode.json` using a version range, for example: `"@your-scope/x402-tools": "^1.0.0"`.
- OpenCode installs npm plugins at startup; with a semver range it will pick up compatible updates automatically.
- Pin an exact version if you want to control upgrades manually.

## Notes

- The plugin reads `.opencode/x402-tools.json` first, then falls back to `X402_PRIVATE_KEY` in `.env`.
- No account address or metadata is printed; only the markdown response is returned.
