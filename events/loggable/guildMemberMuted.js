const {MessageEmbed}	= require('discord.js');
const moment			= require('moment');

module.exports = (channel, member, expires, moderator) => {
	return channel.send(new MessageEmbed()
		.setColor('GOLD')
		.setTitle('🔇 User muted')
		.setThumbnail(member.user.avatarURL)
		.addField('User', `${member.toString()} \`${member.id}\``, false)
		.addField('Expires', `${expires ? moment(expires).fromNow() : 'Never'}`)
		.addField('Moderator', moderator.toString())
	);
};
