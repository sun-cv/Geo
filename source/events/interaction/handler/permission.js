import { MessageFlags } from 'discord.js';
import { log }          from '#utils'

class PermissionHandler
{
    constructor(client, registry)
    {
        this.client     = client;
        this.registry   = registry;
    }

    async handle(interaction)
    {
        const { flag } = interaction.data;

        if (flag.handled.get() || !flag.permission.get() && !flag.maintenance.get())
        {
            return;
        }
        if (flag?.require.get())
        {
            this.require(interaction);
        }
        if (flag?.exclude.get())
        {
            this.exclude(interaction);
        }

        if (flag?.maintenance.get())
        {
            this.maintenance(interaction);
        }
        if (flag?.handled.get())
        {
            this.log(interaction)
        }
    }

    async require(interaction)
    {
        const { member, data: { meta, flag, permission: { require: { channels = [], roles = [], message}}}} = interaction

        if (channels.length)
        {
            const content = message ? message : `You do not have permissions to use this ${meta.type} here`

            if (!channels.includes(interaction.channel.name))
            {
                flag.handled.set()
                
                if (!flag.defer.get())
                {
                    return interaction.reply({content: content, flags: MessageFlags.Ephemeral}) 
                }
                return interaction.editReply({content: content, flags: MessageFlags.Ephemeral});
            }
        }

        if (roles.length)
        {
            const content = message ? message : `You do not have permissions to use this ${meta.type}`

            const memberRoles   = member.roles.cache.map((role) => role.name);
            const permissions   = roles.some(requiredRole => memberRoles.includes(requiredRole))

            if (!permissions)
            {
                flag.handled.set()

                if (!flag.defer.get())
                {
                    return interaction.reply({content: content, flags: MessageFlags.Ephemeral}) 
                }
                return interaction.editReply({content: content, flags: MessageFlags.Ephemeral});
            }
        }
    }

    async exclude(interaction)
    {
        const { member, data: { meta, flag, permission: { exclude: { channels, roles, message}}}} = interaction

        if (channels.length)
        {
            const content = message ? message: `You do not have permissions to use this ${meta.type} here`

            if (channels.includes(interaction.channel.name))
            {
                flag.handled.set()

                if (!flag.defer.get())
                {
                    return interaction.reply({content: content, flags: MessageFlags.Ephemeral}) 
                }
                return interaction.editReply({content: content, flags: MessageFlags.Ephemeral});
            }
        }

        if (roles.length)
        {
            const content = message ? message: `You do not have permissions to use this ${meta.type}`

            const memberRoles   = member.roles.cache.map((role) => role.name);
            const restriction   = roles.some(requiredRole => memberRoles.includes(requiredRole))

            if (restriction)
            {
                flag.handled.set()

                if (!flag.defer.get())
                {
                    return interaction.reply({content: content, flags: MessageFlags.Ephemeral}) 
                }
                return interaction.editReply({content: content, flags: MessageFlags.Ephemeral});
            }
        }
    }

    async maintenance(interaction)
    {
        const { data: { flag }} = interaction;

        flag.handled.set()
        if (!flag.defer.get())
        {
            await interaction.reply({content: "This command is currently under maintenance. Please try again later", flags: MessageFlags.Ephemeral});
        }
        await interaction.editReply({content: "This command is currently under maintenance. Please try again later", flags: MessageFlags.Ephemeral});
    }

    async log(interaction)
    {
        log.push(interaction, `${interaction.member.user.username} was denied access to ${interaction.data.meta.id} in ${interaction.channel.name}`)
    }

}


export { PermissionHandler }