import { log, Text } from '#utils'


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
        const roleAssignment = interaction.data?.roleAssignment;

        if (!roleAssignment || !Object.keys(roleAssignment).length)
        {
            return;
        }
            
        await this.validate(roleAssignment);
        
        await this.remove(roleAssignment);
        await this.add(roleAssignment);
    }

    async validate(roleAssignment)
    {
        for (const memberID in roleAssignment)
        {
            const member = await this.registry.guild.members.fetch(memberID);
            
            roleAssignment[memberID].add = roleAssignment[memberID].add.filter(roleName => 
            {
                const role      = this.registry.role.get(roleName);

                if (!role)
                {
                    log.error(`Role assignment attempted to add role that does not exist: ${roleName}`)
                    return false;
                }

                const hasRole   = member.roles.cache.has(role.id);

                if (hasRole) log.trace(`${member.user.username} already has role ${roleName}, removing from add list`);
                return !hasRole;
            });
   
            roleAssignment[memberID].remove = roleAssignment[memberID].remove.filter(roleName => 
            {
                const role      = this.registry.role.get(roleName);

                if (!role)
                {
                    log.error(`Role assignment attempted to remove role that does not exist: ${roleName}`)
                    return false;
                }
                const hasRole   = member.roles.cache.has(role.id);

                if (!hasRole) log.trace(`${member.user.username} does not have role ${roleName}, removing from remove list`);
                return hasRole;
            });
        }
    }

    async remove(roleAssignment)
    {
        for (const memberID in roleAssignment)
        {
            const tracker   = []
            const roles     = await roleAssignment[memberID].remove;

            if (roles.length == 0)
            {
                continue;
            }

            const member    = await this.registry.guild.members.fetch(memberID);
            
            log.debug(`RoleHandler is attempting to remove ${roles.length} ${roles.length > 1 ? 'roles' : "role"} from ${member.user.username}`)

            for (const roleID of roles)
            {
                const role  = this.registry.role.get(roleID);
                
                member.roles.remove(role);
                
                tracker.push(roleID);
                log.trace(`Removed role ${roleID}`);
            }
            if (tracker.length > 0) log.admin(`Successfully removed ${Text.set().formatList(tracker)} role${tracker.length > 1 ? 's' : ''} from ${member.user.username}`);
        }
    }

    
    async add(roleAssignment)
    {
        for (const memberID in roleAssignment)
        {
            const tracker   = []
            const roles     = await roleAssignment[memberID].add;

            if (roles.length == 0)
            {
                continue
            }
            
            const member    = await this.registry.guild.members.fetch(memberID);
            
            log.debug(`RoleHandler is attempting to assign ${roles.length} ${roles.length > 1 ? 'roles' : "role"} to ${member.user.username}`)

            for (const roleID of roles)
            {
                const role  = this.registry.role.get(roleID);

                member.roles.add(role);
                
                tracker.push(roleID);
                log.trace(`Assigned role ${roleID}`);
            }
            if (tracker.length > 0) log.admin(`Successfully assigned ${Text.set().formatList(tracker)} role${tracker.length > 1 ? 's' : ''} to ${member.user.username}`);
        }
    }
}



class RoleAssignment
{
    constructor(interaction)
    {
        this.require        = [];
        this.remove         = [];
        this.add            = [];

        this.initialize(interaction)
    }

    initialize(interaction)
    {

        interaction.data.roleAssignment ??= {};
        interaction.data.roleAssignment[interaction.member.id] = this;
    }

    static set(interaction)
    {
        return new RoleAssignment(interaction);
    }

    requireRole(...args)
    {
        this.require.push(...args);
        return this;
    }

    removeRole(...args)
    {
        this.remove.push(...args);
        return this;
    }

    addRole(...args)
    {
        this.add.push(...args);
        return this;
    }
}




export { RoleHandler, RoleAssignment }