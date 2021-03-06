const { MessageEmbed, Permissions } = require('discord.js');
const { ArgConsts, ECommand }       = require('../../lib');

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:         ['say'],
			description:     {
				content:  'Says something. Supports embeds',
				usage:    '[channel or current channel] <text>',
				examples: ['say something', 'say #general {JSON}']
			},
			userPermissions: [Permissions.FLAGS.MANAGE_MESSAGES],
			args:            [
				{
					id:       'channel',
					type:     ArgConsts.CHANNEL,
					optional: true,
					default:  m => m.channel
				},
				{
					id:      'text',
					type:    ArgConsts.TEXT,
					message: 'Please provide text'
				}
			],
			guildOnly:       true,
			ownerOnly:       false,
		});
	}

	async run(message, { channel, text }) {
		return [channel, text];
	}

	async ship(message, [channel, text]) {
		try {
			const json = JSON.parse(text);
			return channel.send(json.content, new MessageEmbed(json));
		} catch (err) {
			return channel.send(text);
		}
	}
};
