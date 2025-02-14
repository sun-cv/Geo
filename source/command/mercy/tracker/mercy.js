import { log, Text }        from '../../../../utility/index.js'
import { ProfileManager }   from './profile.js';
import { welcome }          from './definitions.js';

class Mercy
{
    constructor(client, cluster, registry)
    {
        this.registry       = registry;
        this.database       = cluster.mercy;

        this.profile        = new ProfileManager(this);

        this.setClientContext(client);
    }


    async setClientContext(client)
    {
        client.mercy = this;
        log.admin(`Successfully initialized Mercy Tracker`);
    }

    initialize(interaction)
    {
        const member = this.profile.get(interaction.member);
        if (member.new)
        {
            this.welcomeMessage(interaction);
        }
        return member
    }


    welcomeMessage(interaction)
    {
        const { id } = interaction.member
        interaction.followUp({ content: welcome.message(id) });
    }

}




export { Mercy }