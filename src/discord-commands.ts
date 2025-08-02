import { REST, Routes, SlashCommandBuilder, Client } from 'discord.js'
import type { RESTPostAPIApplicationCommandsJSONBody } from 'discord.js'

export const commands: RESTPostAPIApplicationCommandsJSONBody[] = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!')
    .toJSON(),
  new SlashCommandBuilder()
    .setName('hello-start')
    .setDescription('Greetings!')
    .toJSON(),
  new SlashCommandBuilder()
    .setName('all-options')
    .setDescription('Command with all available option types')
    .addStringOption((option) =>
      option
        .setName('string')
        .setDescription('A string option')
        .setRequired(true),
    )
    .addIntegerOption((option) =>
      option.setName('integer').setDescription('An integer option'),
    )
    .addBooleanOption((option) =>
      option.setName('boolean').setDescription('A boolean option'),
    )
    .addUserOption((option) =>
      option.setName('user').setDescription('A user option'),
    )
    .addChannelOption((option) =>
      option.setName('channel').setDescription('A channel option'),
    )
    .addRoleOption((option) =>
      option.setName('role').setDescription('A role option'),
    )
    .addMentionableOption((option) =>
      option.setName('mentionable').setDescription('A mentionable option'),
    )
    .addNumberOption((option) =>
      option.setName('number').setDescription('A number option'),
    )
    .addAttachmentOption((option) =>
      option.setName('attachment').setDescription('An attachment option'),
    )
    .toJSON(),
  new SlashCommandBuilder()
    .setName('todo')
    .setDescription('Manage your todo list')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('add')
        .setDescription('Add a todo item')
        .addStringOption((option) =>
          option.setName('item').setDescription('Item to add').setRequired(true),
        )
        .addStringOption((option) =>
          option.setName('project').setDescription('Project name').setRequired(true),
        )
        .addStringOption((option) =>
          option.setName('type').setDescription('Type of todo').setRequired(false),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('remove')
        .setDescription('Remove a todo item by id')
        .addIntegerOption((option) =>
          option.setName('id').setDescription('ID of item to remove').setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('summary')
        .setDescription('Summary with AI')
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('done')
        .setDescription('Mark a todo item as done by id')
        .addIntegerOption((option) =>
          option.setName('id').setDescription('ID of item to mark done').setRequired(true),
        ),
    )
    .toJSON(),
]

export async function registerCommands(client: Client, token: string) {
  const rest = new REST({ version: '10' }).setToken(token)
  try {
    console.log('Started refreshing application (/) commands.')
    await rest.put(
      Routes.applicationCommands(client.user?.id || 'your-client-id'),
      { body: commands },
    )
    console.log('Successfully reloaded application (/) commands.')
  } catch (error) {
    console.error(error)
  }
}
