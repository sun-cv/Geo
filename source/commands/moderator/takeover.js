import { CommandInteraction,  SlashCommandBuilder } from 'discord.js';
import { EmbedManager, Schema }                     from '#utils'

const channel = 
{
    landing:    "account-takeover",
    moderator:  "takeover-mod",
}

async function takeoverManagement(interaction = new CommandInteraction())
{
    const { client: { registry: { channels }}} = interaction;

    channels.get(channel.landing)  .send(EmbedManager.set(interaction).load('embed-takeover-landing').create())
    channels.get(channel.moderator).send(EmbedManager.set(interaction).load('embed-takeover-moderator').create())
}

const command = Schema.command
({
    meta: 
    {
        id:             "takeover-management",
        type:           "command",
        description:    "Creates Clan Takeover home and moderator embeds",
    },

    permission: 
    {
        cooldown:       0,
        access:         [],
        require:
        {
            channels:   ['account-takeover', 'takeover-mod'],
            roles:      ['Moderator'],
        },
        exclude:
        {
            channels:   [],
            roles:      []
        }
    },

    flag: 
    {

        defer:          false,
        update:         false,
        ephemeral:      false,

        permission:     true,
        require:        true,
        exclude:        false,

        maintenance:    false,
        autocomplete:   false,
        navigation:     false,
        
        handled:        false,
        autoload:       true,

    },

    data: new SlashCommandBuilder()
    	.setName('takeover-management')
    	.setDescription('Creates Clan Takeover home and moderator embeds'),
        
    execute: takeoverManagement
});

export default command;
export { channel }
