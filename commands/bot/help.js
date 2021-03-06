const { MessageEmbed }        = require('discord.js');
const { ArgConsts, ECommand } = require('../../lib');
const { capitalize }          = require('../../lib/util/StringDoctor');
const pjson                   = require('../../package.json');

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:     ['help', 'h'],
			description: {
				content:  'Lists available commands.',
				usage:    '[command/module]',
				examples: ['help', 'help ping'],
			},
			args:        [
				{
					id:       'command',
					type:     ArgConsts.TEXT,
					optional: true,
					default:  () => null
				},
			],
			guildOnly:   false,
			ownerOnly:   false,
			cached:      true
		});
	}

	async run(message, { command }) {
		if (!command) {
			return null;
		}

		const c = this.client.commandHandler.commands.get(command);

		if (!c) {
			throw `Command ${command} not found`;
		}

		return c;
	}

	async ship(message, result) {
		const embed = new MessageEmbed()
			.setColor(this.client.defaultColor)
			.setThumbnail(message.client.user.displayAvatarURL());

		if (!result) {
			embed
				.addField('\u200B', '\u200B')
				.setFooter(`♥ Made with love by ${pjson.author}`)
				.setTitle(`${message.client.user.username} commands`)
				.setThumbnail(message.client.user.displayAvatarURL())
				.setColor(this.client.defaultColor)
				.addField('\u200B', '\u200B')
				.setFooter(`♥ Made with love by ${pjson.author}`);

			this.client.commandHandler.modules.forEach((module, name) => {
				embed.addField(`${capitalize(name)} commands:`, module.map(command => `**${command.aliases[0]}**: ${command.description.content}`).join('\n'));
				embed.addField('\u200B', '\u200B');
			});

			return message.channel.send(embed);
		}

		embed.setTitle(`Command name: ${result.aliases.join('/')}`);
		embed.setDescription(result.description.content);

		if (result.description.usage.length) {
			embed.addField('Arguments', '```' + result.description.usage + '```');
		}

		embed.addField('Usage', '```' + result.description.examples.join('\n') + '```');

		return message.channel.send(embed);
	}
};
