const {RichEmbed}	= require('discord.js');
const moment		= require('moment');

module.exports = message => {

    const entry = message.client.provider.get(message.guild, 'messageDelete', false);
    if (entry && entry.log) {

        if (message.content) {
            
            if (message.content.length >= 1020) {
                message.content = message.content.substring(0, 1020) + '...';
            }
		if (!message.content) {
			return;
		}
	const channel = message.guild.channels.get(entry.log);

                .setColor('DARK_PURPLE')
                .setTitle(`🗑 Message deleted in #${message.channel.name}`)
                .setDescription(`${message.member? message.member.toString() : message.author.tag} \`${message.author.id}\``)
                .addField('Content', message.content, false)
                .addField('ID', message.id, false)
                .setTimestamp(moment().toISOString())
        }
    }
		const channel = message.guild.channels.get(entry.log);
	if (!channel) {
		return;
	}

		}
