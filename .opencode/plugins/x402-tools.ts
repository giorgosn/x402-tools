import type { Plugin } from "@opencode-ai/plugin"
import { tool } from "@opencode-ai/plugin"
import axios from "axios"
import { withPaymentInterceptor } from "x402-axios"
import { config as loadEnv } from "dotenv"
import { createWalletClient, http } from "viem"
import { privateKeyToAccount } from "viem/accounts"
import { base } from "viem/chains"
import { readFile } from "fs/promises"

const BASE_URL = "https://agents.402box.io"
const X_SEARCHER_PATH = "/x_searcher"
const FIND_PEOPLE_PATH = "/find_people"
const TIMEOUT_MS = 300000

const getPrivateKey = async (): Promise<`0x${string}`> => {
  const configPath = new URL("../x402-tools.json", import.meta.url)
  try {
    const contents = await readFile(configPath, "utf-8")
    const parsed = JSON.parse(contents) as { private_key?: string }
    if (parsed.private_key) {
      const key = parsed.private_key
      return (key.startsWith("0x") ? key : `0x${key}`) as `0x${string}`
    }
  } catch (error) {
    if (error instanceof Error && (error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error
    }
  }

  loadEnv({ path: new URL("../../.env", import.meta.url) })
  const key = process.env.X402_PRIVATE_KEY
  if (!key) {
    throw new Error(
      "X402 private key missing. Set .opencode/x402-tools.json or X402_PRIVATE_KEY in .env."
    )
  }
  return (key.startsWith("0x") ? key : `0x${key}`) as `0x${string}`
}

const createPaymentClient = (privateKey: `0x${string}`) => {
  const account = privateKeyToAccount(privateKey)
  const walletClient = createWalletClient({
    account,
    chain: base,
    transport: http(),
  })

  return withPaymentInterceptor(
    axios.create({
      baseURL: BASE_URL,
      timeout: TIMEOUT_MS,
    }),
    walletClient
  )
}

export const X402ToolsPlugin: Plugin = async () => {
  return {
    tool: {
      x_searcher: tool({
        description:
          "AI-powered X/Twitter search agent - Get real-time trends, news, and social media insights",
        args: {
          query: tool.schema.string(),
        },
        async execute(args) {
          const privateKey = await getPrivateKey()
          const client = createPaymentClient(privateKey)

          const response = await client.post(X_SEARCHER_PATH, {
            message: args.query,
          })

          if (!response.data?.data?.response) {
            throw new Error("Unexpected response from X Searcher")
          }

          return response.data.data.response
        },
      }),
      find_people: tool({
        description:
          "Find People is a real-time Open Source Intelligence (OSINT) agent specialized in researching individuals and professional entities.\n\n**What it does:**\n• Identifies people by name, role, or company affiliation\n• Retrieves verified career timelines and professional backgrounds\n• Finds similar professionals in any industry or domain\n• Synthesizes biographical information with source citations\n• Validates identities across LinkedIn, company sites, and public records\n\n**Best for:**\n→ Due diligence research on potential hires or partners\n→ Competitive intelligence on industry leaders\n→ Journalist & researcher background verification\n→ Sales prospecting and lead enrichment\n→ Investor research on startup founders and executives\n\n**Powered by:**\nNeural and deep search capabilities that go beyond standard search engines to find hard-to-reach biographical details, executive profiles, and professional networks.\n\n**Output format:**\nReturns structured summaries with key details (career, education, notable works) and numbered source citations for verification.",
        args: {
          query: tool.schema.string(),
        },
        async execute(args) {
          const privateKey = await getPrivateKey()
          const client = createPaymentClient(privateKey)

          const response = await client.post(FIND_PEOPLE_PATH, {
            message: args.query,
          })

          if (!response.data?.data?.response) {
            throw new Error("Unexpected response from Find People")
          }

          return response.data.data.response
        },
      }),
    },
  }
}
