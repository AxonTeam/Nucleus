# Nucleus
Internal Bot for everything related to AxonTeam. Private bot.

# Commands

COMMAND FORMAT: `command - Description`
SUBCOMMAND FORMAT: ` ===> subcommand - Description`

- token - Manage your private token. ROOT users can purge your token.
-  ==> purge - Purges your token. Root can purge others token
- haveToken - Checks if you have a token. Root can check if others have a token.
- eval - Standard JS eval command. Restricted to bot owners.
- help - Standard dm help command.
- exec - Execute a command. Restricted to bot owners

# Setup/Config (config.json)

FORMAT: `value [JSON/JS Type] - Description. Defaults`

- hasRoot [Array] - Users that have root permissions (IDs).
- owners [Array] - Users that own the bot (IDs).
- prefix [String] - The prefix for the bot. Default: Nuke
- status [String] - Custom status for the bot. Default: AxonTeam Manager
- token [String] - This is the bot token to sign in with
- url [String] - URL to request images/screenshots be uploaded to. Default: cdn.axonteam.org
