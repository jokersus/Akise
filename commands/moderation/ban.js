const {MessageEmbed, Permissions} = require('discord.js');

const {ArgConsts} = require('../../lib');
const {ArgConstsInt} = require('../../lib');
const {ModerationCommand, ModerationCommandResult} = require('../../modules/moderation');

module.exports = class extends ModerationCommand {
	constructor(client) {
		super(client, {
			actionName: 'ban',
			aliases: ['ban', 'b'],
			description: {
				content: 'Bans a user.',
				usage: '<user> [user2...] [reason]',
				examples: ['ban @user', 'ban @user1 @user2', 'ban 275331662865367040'],
			},
			userPermissions: [Permissions.FLAGS.BAN_MEMBERS],
			clientPermissions: [Permissions.FLAGS.BAN_MEMBERS],
			args: [
				{
					id: 'ids',
					type: ArgConsts.IDS,
					message: 'Please mention users to ban'
				},
				{
					id: 'reason',
					type: ArgConsts.TEXT,
					optional: true,
					default: () => null,
				},
			],
			interactionArgs: [
				{
					id: 'ids',
					type: ArgConstsInt.MEMBER,
					optional: true,
				}
			],
			guildOnly: true,
			nsfw: false,
			ownerOnly: false,
			rateLimited: false,
			fetchMembers: false,
			cached: false
		});
	}

	async run(message, args) {
		const result = new ModerationCommandResult(args.reason);

		await Promise.all(args.ids.map(async id => {
			const member = await message.guild.members.fetch(id);

			if (member && !member.bannable) {
				return result.addFailed(id, 'Member too high in the hierarchy');
			}

			try {
				await message.guild.members.ban(id, {
					days: 0,
					reason: args.reason
				});
			} catch (err) {
				return result.addFailed(id, err.message || 'Unknown error');
			}

			result.addPassed(id);
		}));

		return result;
	}
};
