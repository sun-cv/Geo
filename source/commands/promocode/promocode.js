import fs                                           from 'node:fs';
import path                                         from 'node:path';
import directory                                    from '#env/directory/path.json' with { type: 'json'}
import { CommandInteraction, SlashCommandBuilder }  from "discord.js";
import { EmbedManager, Input, Schema, Timestamp }              from "#utils/index.js";
import { template }                                 from '#resources/templates/template-promocode.js';


async function promocode(interaction = new CommandInteraction())
{
    const input                             = Input.command(interaction);

    const filePath                          = path.join(directory.root, 'source', 'resources', 'data', 'promocodes.json');
    const codes                             = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const code                              = input.code.toLowerCase()

    if (codes[code])
    {
        return interaction.editReply('Code already exists');
    }

    codes[code] = {};

    for (const [key, value] of Object.entries(input))
    {
        codes[code][key] = value;
    }

    codes[code].code = input.code.toUpperCase();
    codes[code].timestamp = Timestamp.iso();

    await fs.writeFileSync(filePath, JSON.stringify(
        codes
    , null, 4), 'utf8');

    const channel                           = await interaction.client.registry.channels.get('promo-codes')
    const messages                          = await channel.messages.fetch({ limit: 10 });
    const messageArray                      = [...messages.values()].reverse();

    const banner                            = messageArray[0];
    const message                           = messageArray[1];

    if (!banner)
    {
        const attachmentPath = path.join(directory.shared, 'assets', 'template', 'banner', 'promocodes-banner.png');
        await channel.send({ files: [{ attachment: attachmentPath, name: path.basename(attachmentPath) }] });
    }
    if (!message)
    {
        await channel.send(EmbedManager.set(interaction).load('embed-promo-landing').create())
    }
    else
    {
        await message.edit(EmbedManager.set(interaction).load('embed-promo-landing').create())
    }

    return interaction.editReply(`Code submitted successfully`)
}


const command = Schema.command
({
    meta: 
    {
        id:             "promocode",
        type:           "command",
        description:    "code management - submit new codes",
    },

    permission: 
    {
        cooldown:       0,
        access:         [],
        require:
        {
            channels:   [],
            roles:      ['Officer', 'Deputy', "Moderator"],
        },
        exclude:
        {
            channels:   [],
            roles:      []
        }
    },

    flag: 
    {
        defer:          true,
        update:         false,
        ephemeral:      true,

        permission:     true,
        require:        true,
        exclude:        false,

        maintenance:    false,
        autocomplete:   false,
        navigation:     false,
        
        handled:        false,
        autoload:       true,

    },

    roleAssignment:     {},

    data: new SlashCommandBuilder()
    	.setName('promocode')
    	.setDescription('Submit a new promo code')
    .addStringOption(option =>
        option.setName('code')
            .setDescription('e.g: (promo code in caps): YEARLYGIFT')
            .setRequired(true))
    .addStringOption(option =>
        option.setName('type')
            .setDescription('e.g: (type of promo code): New Player, Time-Limited')
            .setRequired(true)
            .addChoices(
                { name: 'New Player',  value: 'player'},
                { name: 'Time-Limited', value: 'limited'},
            ))
    .addStringOption(option =>
        option.setName('champion')
            .setDescription('e.g: (champion name): Arbiter')
            .setRequired(false)
            .setAutocomplete(true))
    .addStringOption(option =>
        option.setName('silver')
            .setDescription('e.g: (amount): 300k; 1.5m')
            .setRequired(false))
    .addStringOption(option =>
        option.setName('experience_brew')
            .setDescription('e.g: (count x type): 20 x Void; 10 x Magic')
            .setRequired(false))
    .addIntegerOption(option =>
        option.setName('energy_refill')
            .setDescription('e.g: (count of refills): 1')
            .setRequired(false)
            .setMinValue(0)
            .setMaxValue(100))
    .addIntegerOption(option =>
        option.setName('multi_battle')
            .setDescription('e.g: (number of battles): 50')
            .setRequired(false)
            .setMinValue(0)
            .setMaxValue(1000))
    .addIntegerOption(option =>
        option.setName('experience_day')
            .setDescription('e.g: (count of days XP boost): 3')
            .setRequired(false)
            .setMinValue(0)
            .setMaxValue(10000))

    .addStringOption(option =>
        option.setName('potion')
            .setDescription('e.g: (count x type): 1 x Greater Arcane')
            .setRequired(false))
    .addStringOption(option =>
        option.setName('chicken')
            .setDescription('e.g: (count x rank): 1 x Rank 4')
            .setRequired(false))
    .addStringOption(option =>
        option.setName('book')
            .setDescription('e.g: (count x type): 1 x Legendary; 2 x Rare')
            .setRequired(false))

    .addStringOption(option =>
        option.setName('shard')
            .setDescription('e.g: (count x type): 10 x Ancient')
            .setRequired(false))
    .addStringOption(option =>
        option.setName('artifact')
            .setDescription('e.g: (count x type): 6 x Merciless')
            .setRequired(false))
    .addIntegerOption(option =>
        option.setName('energy_flat')
            .setDescription('e.g: (flat amount): 400')
            .setRequired(false)
            .setMinValue(0)
            .setMaxValue(10000))
    .addIntegerOption(option =>
        option.setName('refill_arena')
            .setDescription('e.g: (count of arena refills): 1')
            .setRequired(false)
            .setMinValue(0)
            .setMaxValue(100))
    .addStringOption(option =>
        option.setName('not_listed')
            .setDescription('e.g: (custom reward description): 25 Primal Fragments')
            .setRequired(false)
            .setAutocomplete(true)),

    execute: promocode
});

export default command;
