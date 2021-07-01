const { Collection, MessageEmbed, Permissions } = require('discord.js');
const EmbedLimits = require('./EmbedLimits');

const ArgumentParser = require('./Argument/ArgumentParser');
const ArgumentParserInteraction = require('./Argument/Interaction/ArgumentParser');

class ECommand {
	constructor(client, {
		aliases = [],
		slash = false,
		description = {
			content: 'No info provided',
			usage: 'No info provided',
			examples: []
		},
		userPermissions = [],
		clientPermissions=  [Permissions.FLAGS.EMBED_LINKS],
		args = [],
		interactionArgs = [],
		guildOnly = true,
		nsfw = false,
		ownerOnly = true,
		rateLimited = false,
		rateLimit = {
			every: 1
		},
		fetchMembers = false,
		typing = false,
		cached = false,
		deleteAfter = null
	}) {
		this.client = client;
		this.aliases = aliases;
		this.slash = slash;
		this.description = description;
		this.userPermissions = new Permissions(userPermissions);
		this.clientPermissions = new Permissions(clientPermissions);
		this.args = args;
		this.interactionArgs = interactionArgs;
		this.guildOnly = guildOnly;
		this.nsfw = nsfw;
		this.ownerOnly = ownerOnly;
		this.rateLimited = rateLimited;
		this.rateLimit = rateLimit;
		this.typing = typing;

		if (fetchMembers && !this.guildOnly) {
			throw new Error('Cannot have fetchUsers and !guildOnly');
		}

		this.fetchMembers = fetchMembers;

		this.cached = cached;
		this._cache = this.cached ? new Collection() : null;

		this.hooks = [];

		if (deleteAfter) {
			// TS when
			if (isNaN(deleteAfter)) {
				throw 'Please provide a number for deleteAfter';
			}

			this.hooks.push(async m => {
				const _m = await m;
				_m.client.setTimeout(() => {
					_m.delete();
				}, deleteAfter);
			});
		}

		this.parser = new ArgumentParser(this.args);

		if (this.slash) {
			// this.interactionParser = new ArgumentParserInteraction(this.interactionArgs);
			this.interactionParser = new ArgumentParserInteraction(this.args);
		}
	}

	// Returns a string or an array or something
	async run() {}

	// Override this
	async ship(message, result) {
		return message.channel.send(
			new MessageEmbed()
				.setColor('GREEN')
				.setDescription(result)
		);
	}

	makeError(string) {
		if (string.length <= EmbedLimits.TITLE) {
			return new MessageEmbed().setColor('RED').setTitle(string);
		}

		return new MessageEmbed().setColor('RED').setDescription(string);
	}

	async sendNotice(message, string) {
		return message.channel.send(new MessageEmbed().setColor('GREEN').setDescription(string));
	}

	// ship() should be returning an unsent message, not a Promise
	// so we can apply inhibitors on it
	async execute(message, args) {
		const parsedArgs = await this.parser.parse(message, args);
		const result = await this.run(message, parsedArgs);
		const reply = await this.ship(message, result);
		this.hooks.forEach(h => h(reply));
		return reply;
	}
}

module.exports = ECommand;