import { log, Text } from '../../../utility/index.js'


class RoleHandler
{
    constructor(client, registry)
    {
        this.client     = client;
        this.registry   = registry;

        this.role       = null;
    }    


    async handle(interaction)
    {
        this.roleAssignment   = interaction.data?.roleAssignment

        if (!this.roleAssignment)
        {
            return;
        }

        log.trace(`Role assignment detected`);
        
        this.remove();
        this.add();
    }

    async remove()
    {
        for (const memberID in this.roleAssignment)
        {
            const tracker   = []
            const roles     = await this.roleAssignment[memberID].remove;

            if (roles.length == 0)
            {
                continue;
            }
            const member    = await this.registry.guild.members.fetch(memberID);
            
            log.debug(`RoleHandler is attempting to remove ${roles.length} ${roles.length > 1 ? 'roles' : "role"} from ${member.user.username}`)

            for (const roleID of roles)
            {
                const role  = this.registry.role.get(roleID);

                if (!member.roles.cache.has(role.id))
                {
                    log.trace(`${member.user.username} does not have role ${roleID}`)
                    continue;
                }

                tracker.push(roleID);
                member.roles.remove(role);
                log.trace(`Removed role ${roleID}`);
            }
            if (tracker.length > 0) log.admin(`Successfully removed ${Text.set().formatList(tracker)} role${tracker.length > 1 ? 's' : ''} from ${member.user.username}`);
        }
    }

    async add()
    {
        for (const memberID in this.roleAssignment)
        {
            const tracker   = []
            const roles     = await this.roleAssignment[memberID].add;

            if (roles.length == 0)
            {
                continue
            }
            const member    = await this.registry.guild.members.fetch(memberID);
            
            log.debug(`RoleHandler is attempting to assign ${roles.length} ${roles.length > 1 ? 'roles' : "role"} to ${member.user.username}`)

            for (const roleID of roles)
            {
                const role  = this.registry.role.get(roleID);
                
                if (member.roles.cache.has(role.id))
                {
                    log.trace(`${member.user.username} already has role ${roleID}`)
                    continue;
                }
                tracker.push(roleID);
                member.roles.add(role);
                log.trace(`Assigned role ${roleID}`);
            }
            if (tracker.length > 0) log.admin(`Successfully assigned ${Text.set().formatList(tracker)} role${tracker.length > 1 ? 's' : ''} to ${member.user.username}`);
        }
    }
}




class RoleAssignment
{
    constructor()
    {
        this.require    = [];
        this.remove     = [];
        this.add        = [];
    }
}




export { RoleHandler, RoleAssignment }