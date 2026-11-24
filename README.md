# Caribooks plugin for DeepSeek Harness

Use your QuickBooks Online books in DeepSeek Harness conversations through
[Caribooks](https://caribooks.com). Ask about invoices, bills, reports and
receipts, and have the agent record changes, within the access you set for
each company in Caribooks.

## What you need

- DeepSeek Harness 0.2.3 or later. Earlier versions cannot sign in to an MCP
  server.
- A Caribooks account with at least one QuickBooks Online company connected.
  Signing in for the first time creates the account.

## Install

1. In DeepSeek Harness, open **Plugins**, click the arrow beside
   **Add plugin**, then **Install a third-party plugin**.
2. Paste `https://github.com/peich-technologies/dsh-caribooks` and click
   **Install**, then **Enable now**.
3. Click **Connect Caribooks**. Your browser opens Caribooks: sign in, check
   that the page names DeepSeek Harness, and click **Allow**.
4. Back in DeepSeek Harness, the Caribooks account shows **Connected**. Ask
   the agent a question about your books.

Authorization has to happen in a browser on the computer that runs DeepSeek
Harness. To update the plugin, uninstall it and install it again.

## What it does

The plugin registers `https://caribooks.com/api/mcp` with the Harness's MCP
manager, using OAuth with dynamic client registration. The Harness keeps the
grant; Caribooks never sees a DeepSeek key. Tools appear as
`mcp__caribooks__*` and load on demand.

Help: [caribooks.com/en/help](https://caribooks.com/en/help) or
support@caribooks.com.

## License

MIT, Peich Technologies Inc.
