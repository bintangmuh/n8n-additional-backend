import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { Client, GatewayIntentBits } from 'discord.js'
import { setupInteractionHandler } from './discord-interactions.js'
import { registerCommands } from './discord-commands.js'

import "dotenv/config";

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
});

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// Discord bot setup
const token = process.env.DISCORD_BOT_TOKEN

if (!token) {
  console.error('DISCORD_BOT_TOKEN is not set in environment variables')
  process.exit(1)
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.once('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`)
  registerCommands(client, token)
})

setupInteractionHandler(client)

client.login(token)

serve({
  fetch: app.fetch,
  port: 6666
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
