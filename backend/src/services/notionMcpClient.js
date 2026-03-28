import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

export async function createNotionMcpClient() {
  const client = new Client(
    {
      name: "merch-os-mcp-client",
      version: "1.0.0",
    },
    {
      capabilities: {},
    }
  );

  const transport = new StreamableHTTPClientTransport(
    new URL(`${process.env.MCP_SERVER_URL}/mcp`),
    {
      requestInit: {
        headers: {
          Authorization: `Bearer ${process.env.MCP_AUTH_TOKEN}`,
        },
      },
    }
  );

  await client.connect(transport);

  return client;
}