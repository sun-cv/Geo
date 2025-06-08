import { MessageFlags }         from 'discord.js';
import { EmbedManager, log }    from '#utils'
import { RoleAssignment }       from '#events/interaction/handler/role.js';
import { MemberManager }        from './member.js';

class MercyTracker
{
    constructor(client, registry, cluster)
    {
        this.registry       = registry;
        this.database       = cluster.mercy;

        this.memberManager  = new MemberManager(this)

        this.setClientContext(client);
    }


    async setClientContext(client)
    {
        client.mercy = this;
        log.admin(`Successfully initialized Mercy Tracker`);
    }

    initialize(interaction)
    {
        const member = this.memberManager.get(interaction.member);
       
        if (member.new)
        {            
            log.event(`Greeting new Mercy member ${member.username}`);
            RoleAssignment.member(member.id).addRole('Mercy');
            delete member.new;
            setTimeout(() =>{ this.greetMember(interaction, member)}, 2000)
        }
        return member;
    }

    autofill(interacion)
    {
        const member = this.memberManager.get(interaction.member);
        return member;
    }

    greetMember(interaction, member)
    {
        interaction.followUp(EmbedManager.set(interaction).load('embed-mercy-greeting').create());
    }
}




export { MercyTracker }