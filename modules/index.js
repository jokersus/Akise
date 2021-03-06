const mute             = require('./mute');
const moderation       = require('./moderation');
const paginatedmessage = require('./paginatedmessage');

const init = async (client, _db) => {
	await mute.init(client, _db);
	await moderation.init(client, _db);
	await paginatedmessage.init(client);
};

module.exports = {
	init,
	mute,
	moderation,
	CircularList:     paginatedmessage.CircularList,
	PaginatedMessage: paginatedmessage.PaginatedMessage
};