import { EmbedManager, log }    from '../../../../utility/index.js'
import { RoleAssignment }       from '../../../interaction/handler/role.js';
import { MemberManager }        from './member.js';
import { MessageFlags }         from 'discord.js';

class MercyTracker
{
    constructor(client, cluster, registry)
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
            delete member.new;
            setTimeout(() =>{ this.greetMember(interaction, member)}, 2000)
        }
        return member;
    }

    greetMember(interaction, member)
    {
        RoleAssignment.set(interaction).addRole('Mercy')
        interaction.followUp(EmbedManager.set(interaction).load('embed-mercy-greeting').create());
    }
}




export { MercyTracker }