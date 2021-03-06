const { MessageEmbed, Permissions }               = require('discord.js');
const { ArgConsts, ArgumentType, ECommand }       = require('../../../lib');
const { CircularListGenerator, PaginatedMessage } = require('../../paginatedmessage');
const db                                          = require('../db');

module.exports = class extends ECommand {
	constructor(client) {
		super(client, {
			aliases:         ['actions'],
			description:     {
				content:  'Lists moderation actions in the server',
				usage:    '[from @moderator] [to @member]',
				examples: ['actions', 'actions from=@moderator', 'actions from @moderator to @user']
			},
			userPermissions: [Permissions.FLAGS.MANAGE_GUILD],
			args:            [
				{
					id:       'moderator',
					type:     new ArgumentType(
						new RegExp(/from[=\s]?/.source + ArgConsts.userIdRegex.source),
						ArgConsts.idExtractFlatten
					),
					optional: true,
					default:  () => undefined
				},
				{
					id:       'target',
					type:     new ArgumentType(
						new RegExp(/to[=\s]?/.source + ArgConsts.userIdRegex.source),
						ArgConsts.idExtractFlatten
					),
					optional: true,
					default:  () => undefined
				},
			],
			guildOnly:       true,
			nsfw:            false,
			ownerOnly:       false,
		});
	}

	async run(message, args) {
		const perPage = 20;

		const { length } = await db.getIdMax(message.guild.id);

		if (!length) {
			throw 'No entries found';
		}

		const [next, prev] = (() => {
			let lastId = length + 1;

			return [
				async () => {
					const results = await db.getModeratorTargetPage({
						guild:     message.guild.id,
						moderator: args.moderator,
						target:    args.target,
						perPage,
						lastId
					});

					// Failsafe
					if (!results.length) {
						return '```[ empty ]```';
					}

					lastId = results[results.length - 1].id;

					return results;
				},
				async () => {
					lastId += perPage * 2;

					const results = await db.getModeratorTargetPage({
						guild:     message.guild.id,
						moderator: args.moderator,
						target:    args.target,
						perPage,
						lastId
					});

					// Failsafe
					if (!results.length) {
						return '```[ empty ]```';
					}

					lastId = results[results.length - 1].id;

					return results;
				}
			];
		})();

		return new CircularListGenerator([], Math.ceil(length / perPage), next, prev);
	}

	async ship(message, result) {
		const generator = s => {
			const embed = new MessageEmbed()
				.setColor('GREEN')
				.setTitle(`Latest mod actions in ${message.guild}`);

			const body = typeof s === 'string' ? s : s.map(({
				id,
				passed,
				action,
				moderator: moderatorID,
				target:    targetID
			}) => {
				const prefix    = passed ? '✅' : '❌';	// Fix those later;
				const moderator = `<@${moderatorID}>`;
				const target    = `<@${targetID}>`;

				return `${prefix} \`[${id}]\` ${action.toLowerCase()} ${moderator} -> ${target}`;
			}).join('\n');

			embed.setDescription(`__Run \`action <number>\` to get details__\n\n${body}`);
			return embed;
		};

		return PaginatedMessage.register(message, generator, result);
	}
};
