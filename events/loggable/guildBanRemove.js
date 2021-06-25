const { RichEmbed } = require('discord.js');

module.exports = (guild, user) => {
	const entry = guild.client.provider.get(guild, 'guildBanRemove', false);
	
	if (!entry || !entry.log) {
		return;
	}

	const channel = guild.channels.get(entry.log);

	if (!channel) {
		return;
	}

	channel.send(new RichEmbed()
		.setColor('GREEN')
		.setTitle('♻ User unbanned')
		.setThumbnail(user.avatarURL)
		.setDescription(user.tag)
		.addField('ID', user.id, false)
	);
};
