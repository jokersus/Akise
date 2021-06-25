// const { Command } = require('discord.js-commando');
// const { RichEmbed } = require('discord.js');
// const _ = require('lodash');
// const EuphemiaPaginatedMessage = require('../../util/EuphemiaPaginatedMessage.js');
//
// module.exports = class extends Command {
// 	constructor(client) {
// 		super(client, {
// 			name: 'mytags',
// 			group: 'subscription',
// 			memberName: 'mytags',
// 			description: 'Lists all tags a user is subscribed to',
// 			examples: [`${client.commandPrefix}mytags`],
// 			guildOnly: true
// 		});
// 	}
//
// 	async run(message) {
//
// 		const collection = this.client.database.collection('subscriptions');
// 		const entry = await collection.findOne({_id: message.guild.id}, {projection: {_id: false}});
//
// 		if (!entry) {
// 			return message.channel.send(new RichEmbed()
// 				.setColor('ORANGE')
// 				.setTitle('You are not subscribed to any tags.')
// 			);
// 		}
//
// 		const tags = [];
// 		for (const tag in entry) {
// 			if (entry[tag].indexOf(message.author.id) > -1) {
// 				tags.push(tag);
// 			}
// 		}
//
// 		if (!tags.length) {
// 			return message.channel.send(new RichEmbed()
// 				.setColor('RED')
// 				.setTitle('This server does not have any registered tags.')
// 			);
// 		}
//
// 		const messages = _.chunk(tags, 20);
//
// 		return EuphemiaPaginatedMessage(messages.map(chunk => new RichEmbed()
// 			.setAuthor(`${message.author.tag} List of tags you are subscribed to`, message.author.displayAvatarURL)
// 			.setColor(global.BOT_DEFAULT_COLOR)
// 			.setDescription(chunk
// 				.sort((a, b) => entry[b].length - entry[a].length)
// 				.map(tag => `**${tag}** members: ${entry[tag].length}`)
// 				.join('\n'))
// 		), message);
//
// 	}
// };
