import { log, Text }        from '../../../../utility/index.js'
import { ProfileManager }   from './profile.js';
import { welcome }          from './message.js';
import { RoleAssignment }   from '../../../interaction/handler/role.js';

class Mercy
{
    constructor(client, cluster, registry)
    {
        this.registry       = registry;
        this.database       = cluster.mercy;

        this.profileManager = new ProfileManager(this);

        this.setClientContext(client);
    }


    async setClientContext(client)
    {
        client.mercy = this;
        log.admin(`Successfully initialized Mercy Tracker`);
    }

    initialize(interaction)
    {
        const member = this.profileManager.get(interaction.member);
        if (member.new)
        {
            this.greetNewMember(interaction, member);
        }
        return member
    }

    greetNewMember(interaction, member)
    {
        RoleAssignment.set(interaction).addRole('Mercy')
        interaction.followUp({ content: welcome(member.id) });
    }

    update(member)
    {
        this.profileManager.update(member);
    }

}




export { Mercy }