import { Client, GuildChannel } from 'discord.js'
import type { Interaction } from 'discord.js'
import { sendToTodoWebhooks } from './actions/todo-api.js'

export async function handleTodoCommand(interaction: any) {
  const subcommand = interaction.options.getSubcommand()
  const channel = interaction.channel
  const channelName = 'name' in (channel ?? {}) ? channel.name : null
  const channelId = 'id' in (channel ?? {}) ? channel.id : null
  try {
    let result
    if (subcommand === 'add') {
      const item = interaction.options.getString('item', true)
      const project = interaction.options.getString('project', true)
      const type = interaction.options.getString('type', true) || null
      result = await sendToTodoWebhooks({ action: 'add', item, project, type, channel: channelName })
      await interaction.reply(`Added todo item: ${item}`)
    } else if (subcommand === 'remove') {
      const id = interaction.options.getInteger('id', true)
      result = await sendToTodoWebhooks({ action: 'remove', id, channel: channelName })
      await interaction.reply(`Removed todo item with id: ${id}`)
    } else if (subcommand === 'summary') {
      result = await sendToTodoWebhooks({ action: 'summary', channel: channelId })
      await interaction.reply('Processing ...')
    } else if (subcommand === 'done') {
      const id = interaction.options.getInteger('id', true)
      result = await sendToTodoWebhooks({ action: 'done', id, channel: channelName })
      await interaction.reply(`Marked todo item as done with id: ${id}`)
    } else if (subcommand === 'update') {
      const id = interaction.options.getInteger('id', true)
      const item = interaction.options.getString('item', false)
      const project = interaction.options.getString('project', false)
      const type = interaction.options.getString('type', false)
      const status = interaction.options.getString('status', false)
      result = await sendToTodoWebhooks({ action: 'update', id, item, project, type, status, channel: channelName })
      await interaction.reply(`Updated todo item with id: ${id}`)
    } else {
      await interaction.reply('Unknown subcommand')
    }
  } catch (error) {
    if (error instanceof Error) {
      await interaction.reply(`Error: ${error.message}`)
    } else {
      await interaction.reply('An unknown error occurred')
    }
  }
}

export function setupInteractionHandler(client: Client) {
  client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return

    switch (interaction.commandName) {
      case 'ping':
        await interaction.reply('Pong!')
        break
      case 'hello-start':
        await interaction.reply('Hello!')
        break
      case 'all-options': {
        const string = interaction.options.getString('string')
        const integer = interaction.options.getInteger('integer')
        const boolean = interaction.options.getBoolean('boolean')
        const user = interaction.options.getUser('user')
        const member = interaction.options.getMember('user')
        const channel = interaction.channel
        const role = interaction.options.getRole('role')
        const mentionable = interaction.options.getMentionable('mentionable')
        const number = interaction.options.getNumber('number')
        const attachment = interaction.options.getAttachment('attachment')

        let channelName = 'unknown channel'
        if (channel && channel instanceof GuildChannel) {
          channelName = channel.name
        }

        await interaction.reply({
          content: `
String: ${string}
Integer: ${integer}
Boolean: ${boolean}
User: ${user}
Member: ${member}
Channel: ${channelName}
Role: ${role}
Mentionable: ${mentionable}
Number: ${number}
Attachment: ${attachment?.url}
          `,
          ephemeral: true,
        })
        break
      }
      case 'todo':
        await handleTodoCommand(interaction)
        break
    }
  })
}
