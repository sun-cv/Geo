import { log } from "../../../utility/index.js"
import { MessageFlags } from "discord.js";

class PermissionHandler
{
    constructor(client, registry)
    {
        this.client     = client;
        this.registry   = registry;
    }

    async handle(interaction)
    {
        const {flag, permission: { require = {}, exclude = {} } = {}} = interaction.data;

        if (!flag.permission)
        {
            return;    
        }        
        if (require.active)
        {
            this.require(interaction);
        }
        if (exclude.active)
        {
            this.exclude(interaction);
        }
        if (flag.maintenance)
        {
            this.maintenance(interaction);
        }
        if (flag.handled)
        {
            this.log(interaction)
        }
    }

    async require(interaction)
    {
        const { member, data: { meta, flag, permission: { require: { channels = {}, roles = {}}}}} = interaction

        if (channels.length)
        {
            if (!channels.includes(interaction.channel.name))
            {
                flag.handled = true;
                await interaction.editReply({content: `You do not have permissions to use this ${meta.type} here.`, flags: MessageFlags.Ephemeral});
            }
        }

        if (roles.length)
        {
            const memberRoles   = member.roles.cache.map((role) => role.name);
            const permissions   = roles.some(requiredRole => memberRoles.includes(requiredRole))

            if (!permissions)
            {
                flag.handled = true;
                await interaction.editReply({content: `You do not have permissions to use this ${meta.type}.`, flags: MessageFlags.Ephemeral});
            }
        }
    }

    async exclude(interaction)
    {
        const { member, data: { meta, flag, permission: { exclude: { channels, roles}}}} = interaction

        if (channels.length)
        {
            if (channels.includes(interaction.channel.name))
            {
                flag.handled = true;
                await interaction.editReply({content: `You do not have permissions to use this ${meta.type} here.`, flags: MessageFlags.Ephemeral});
                return;
            }
        }

        if (roles.length)
        {
            const memberRoles   = member.roles.cache.map((role) => role.name);
            const restriction   = roles.some(requiredRole => memberRoles.includes(requiredRole))

            if (restriction)
            {
                flag.handled = true;
                await interaction.editReply({content: `You do not have permissions to use this ${meta.type} here.`, flags: MessageFlags.Ephemeral});
                return;
            }
        }
    }

    async maintenance(interaction)
    {
        interaction.data.flag.handled = true;
        await interaction.editReply({content: "This command is currently under maintenance. Please try again later", flags: MessageFlags.Ephemeral});
    }

    async log(interaction)
    {
        log.push(interaction, `${interaction.member.user.username} was denied access to ${interaction.data.meta.type} ${interaction.data.meta.id} in ${interaction.channel.name}`)
    }

}


export { PermissionHandler }