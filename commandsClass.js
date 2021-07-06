const commandData = {};

function format(reply, message, cmd) {
	if (!message.mentions.members.first() && !message.mentions.users.first()) {
		message.channel.send(cmd.noMention || "You did not mention a member");
	} else {
		repl = reply
			.toString()
			.replace("{firstMention}", message.mentions.members.first());
		repl1 = repl
			.toString()
			.replace("{firstMention.tag}", message.mentions.users.first().tag);
		repl2 = repl1
			.toString()
			.replace(
				"{firstMention.username}",
				message.mentions.users.first().username
			);
		return repl2;
	}
}

function kick(cmd, message) {
	if (!message.mentions.members.first() && !message.mentions.users.first())
		return message.channel.send(
			cmd.noMention || "You did not mention a member"
		);

	if (!message.member.permissions.has("KICK_MEMBERS"))
		return message.channel.send(
			cmd.noPerms || "You do not have permission to use this command"
		);
	switch (cmd.action.kick.toString()) {
		case "firstMention":
			if (message.mentions.members.first().kickable === false)
				return message.channel.send("I cannot kick that user");
			message.mentions.members.first().kick();
			if (cmd.reply) {
				message.channel.send(format(cmd.reply, message, cmd));
			}
			break;
		default:
			throw "Who should be kicked\n\nOptions:\nfirstMention";
	}
}

function ban(cmd, message) {
	if (!message.mentions.members.first() && !message.mentions.users.first())
		return message.channel.send(
			cmd.noMention || "You did not mention a member"
		);
	if (!message.member.permissions.has("BAN_MEMBERS"))
		return message.channel.send(
			cmd.noPerms || "You do not have permission to use this command"
		);
	switch (cmd.action.ban.toString()) {
		case "firstMention":
			if (message.mentions.members.first().bannable === false)
				return message.channel.send("I cannot ban that user");
			message.mentions.members.first().ban();
			if (cmd.reply) {
				message.channel.send(format(cmd.reply, message, cmd));
			}
			break;
		default:
			throw "Who should be banned\n\nOptions\nfirstMention";
	}
}

class CommandsClass {
	create(cmdname, data) {
		commandData[cmdname] = data;
		console.log("Loaded Command " + cmdname)
	}
	exists(cmdName) {
		return commandData[cmdName] != null;
	}
	get(cmdName) {
		return commandData[cmdName];
	}
	execute(cmdName, message) {
		let cmd = commandData[cmdName];
		if (!cmd.action) {
			message.channel.send(format(cmd.reply, message, cmd));
		} else {
			switch (Object.keys(cmd.action)[0].toString()) {
				case "kick":
					kick(cmd, message);
					break;
				case "ban":
					ban(cmd, message);
					break;
				default:
					throw "What action should happen\n\nOptions:\nkick\nban";
			}
		}
	}
}

module.exports = CommandsClass;