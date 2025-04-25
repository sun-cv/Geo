import { Component, EmbedManager, Schema }  from "../../../utility/index.js";
import { Input }                            from "../../../utility/index.js";
import { applicationConfig }                from "../../data/config/application.js";
import { template }                         from "../../data/template/templateApplication.js";
import { clanConfig }                       from "../../data/config/clan.js";

const data = 
{

    'management-application': Schema.menu
    ({
        meta: { id: 'menu-application-management-application' },

        flag:
        {
            navigation: true,
        },
    
        load: function(interaction)
        {
            const { client: { clanManagement: { applications, cache: { active }}}, member} = interaction
            
            const applicationList = applications.getApplicationsByClan(active.get(member.id)).sort((a, b) => a.timestamp - b.timestamp).reduce((obj, application) => { obj[template.menu(application)] = application.id; return obj }, {})
            
            return Component
                .menu(this.meta.id)
                .placeholder('View application')
                .values(1, 1)
                .objectOptions(applicationList)
        },
    
        execute: function(interaction) 
        {
            const { client: { clanManagement: { applications: { cache: { selection, active }}} }, member } = interaction
            const [value] = Input.menu(interaction)

            if (value)
            {
                active.set(member.id, value)

                interaction.editReply(EmbedManager.set(interaction).load('embed-application-management-home').create());
            }
        }
    }),

    'management-transfer': Schema.menu
    ({
        meta: { id: 'menu-application-management-transfer' },

        flag:
        {
            navigation: true,
        },
    
        load: function(interaction)
        {
            const { client: { clanManagement: { applications, cache: { active }}}, member} = interaction
            
            const transfers = applications.getTransfersByClan(active.get(member.id)).sort((a, b) => a.timestamp - b.timestamp).reduce((obj, application) => { obj[template.menu(application)] = application.id; return obj }, {})
            
            return Component
                .menu(this.meta.id)
                .placeholder('View transfers')
                .values(1, 1)
                .objectOptions(transfers)
        },
    
        execute: function(interaction) 
        {
            const { client: { clanManagement: { applications: { cache: { active }}} }, member } = interaction
            const [value] = Input.menu(interaction)

            if (value)
            {
                active.set(member.id, value)

                interaction.editReply(EmbedManager.set(interaction).load('embed-application-management-home').create());
            }
        }
    }),



    'management-clan-select': Schema.menu
    ({
        meta: { id: 'menu-application-management-clan-select' },

        flag:
        {
            navigation: true,
        },
    
        load: function(interaction)
        {
            const { clanManagement: { clan } } = interaction.client  
            const clans = Object.values(clan).sort((a, b) => a.tier - b.tier);

            return Component
                .menu(this.meta.id)
                .placeholder(`Reassign | Care - submits instantly`)
                .values(1, 1)
                .arrayOptions(clans.map((clan) => {return clan.clan}))
        },
    
        execute: function(interaction) 
        {
            const { member, client: { registry: { channels }, clanManagement: { officersTable, applications, applications: {cache: { active}} }} } = interaction;

            const [value] = Input.menu(interaction)
            const application = applications.getApplication({id: active.get(member.id)})

            console.log(application)

            application.admin.admin         = member.id;
            application.admin.transfer.from = application.clan;
            application.admin.transfer.to   = value
            application.selection.alternate = value
            application.clan                = value;

            application.statu               = 'pending'

            applications.updateApplication(application);
            applications.resetCache();

            console.log(application)

            channels.get(officersTable).send(`📢 Attention @here!`);
            channels.get(officersTable).send(EmbedManager.set(interaction).load('embed-application-officer-notification-transfer').create());

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-home').create());
        }
    }),




    'application-clan': Schema.menu
    ({
        meta: { id: 'menu-application-clan-select' },

        flag: { update:true },
    
        load: function(interaction)
        {
            const { clanManagement: { clan } } = interaction.client  
            const clans = Object.values(clan).sort((a, b) => a.tier - b.tier);

            return Component
                .menu(this.meta.id)
                .placeholder(applicationConfig.menu.clan.placeholder)
                .values(1, 1)
                .arrayOptions(clans.map((clan) => {return clan.clan}))
        },
    
        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { applications }} } = interaction;

            const application       = applications.getApplication(member);
            const [value]           = Input.menu(interaction)
            
            application.clan                    = value;
            application.selection.preferred     = value;
            
            application.meta.location = (application.meta.location + 1) % applicationConfig.selection.count;

            interaction.editReply(EmbedManager.set(interaction).load('embed-application-apply-home').modify(applicationConfig.getModifier(application)).create());
        }
    }),

    'application-siege': Schema.menu
    ({
        meta: { id: 'menu-application-siege-active' },

        flag: { update:true },

        load: function()
        {
            return Component
                .menu(this.meta.id)
                .placeholder(applicationConfig.menu.siege.placeholder)
                .values(1, 1)
                .objectOptions(applicationConfig.menu.siege.options)

        },
    
        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { applications }} } = interaction;

            const application       = applications.getApplication(member);
            const [value]           = Input.menu(interaction)
            
            const booleanMap        = { "true": true, "false": false, "null": null };

            application.siege.active    = booleanMap[value]
            application.meta.location   = (application.meta.location + 1) % applicationConfig.selection.count;

            interaction.editReply(EmbedManager.set(interaction).load('embed-application-apply-home').modify(applicationConfig.getModifier(application)).create());
        }
    }),

    'application-cvc': Schema.menu
    ({
        meta: { id: 'menu-application-cvc-points' },

        flag: { update:true },

        load: function()
        {
            return Component
                .menu(this.meta.id)
                .placeholder(applicationConfig.menu.cvc.placeholder)
                .values(1, 1)
                .arrayOptions(applicationConfig.menu.cvc.options)
        },
    
        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { applications }} } = interaction;

            const application       = applications.getApplication(member);
            const [value]           = Input.menu(interaction)
            
            application.cvc.points      = value;            
            application.meta.location   = (application.meta.location + 1) % applicationConfig.selection.count;

            interaction.editReply(EmbedManager.set(interaction).load('embed-application-apply-home').modify(applicationConfig.getModifier(application)).create());
        }
    }),

    'clanboss-difficulty': Schema.menu
    ({
        meta: { id: 'menu-application-clanboss-difficulty' },

        flag: { update:true },

        load: function()
        {        
            return Component
                .menu(this.meta.id)
                .placeholder(applicationConfig.menu.clanboss.difficulty.placeholder)
                .values(1, 1)
                .arrayOptions(applicationConfig.menu.clanboss.difficulty.options)
        },
    
        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { applications }} } = interaction;

            const application       = applications.getApplication(member);
            const [value]           = Input.menu(interaction)
            
            application.clanboss.difficulty = value;            
            application.meta.location       = (application.meta.location + 1) % applicationConfig.selection.count;

            interaction.editReply(EmbedManager.set(interaction).load('embed-application-apply-home').modify(applicationConfig.getModifier(application)).create());
        }
    }),

    'clanboss-keys': Schema.menu
    ({
        meta: { id: 'menu-application-clanboss-keys' },

        flag: { update:true },

        load: function()
        {
            return Component
                .menu(this.meta.id)
                .placeholder(applicationConfig.menu.clanboss.keys.placeholder)
                .values(1, 1)
                .arrayOptions(applicationConfig.menu.clanboss.keys.options)
        },
    
        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { applications }} } = interaction;

            const application       = applications.getApplication(member);
            const [value]           = Input.menu(interaction)
            
            application.clanboss.keys = value;
            application.meta.location = (application.meta.location + 1) % applicationConfig.selection.count;

            interaction.editReply(EmbedManager.set(interaction).load('embed-application-apply-home').modify(applicationConfig.getModifier(application)).create());
        }    
    }),

    'hydra-difficulty': Schema.menu
    ({
        meta: { id: 'menu-application-hydra-difficulty' },

        flag: { update:true },

        load: function()
        {
            return Component
                .menu(this.meta.id)
                .placeholder(applicationConfig.menu.hydra.difficulty.placeholder)
                .values(1, 1)
                .arrayOptions(applicationConfig.menu.hydra.difficulty.options)
        },
    
        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { applications }} } = interaction;

            const application       = applications.getApplication(member);
            const [value]           = Input.menu(interaction)
            
            application.hydra.difficulty    = value;           
            application.meta.location       = (application.meta.location + 1) % applicationConfig.selection.count;

            interaction.editReply(EmbedManager.set(interaction).load('embed-application-apply-home').modify(applicationConfig.getModifier(application)).create());
        }    
    }),

    'hydra-damage': Schema.menu
    ({
        meta: { id: 'menu-application-hydra-damage' },

        flag: { update:true },

        load: function()
        {
            return Component
                .menu(this.meta.id)
                .placeholder(applicationConfig.menu.hydra.damage.placeholder)
                .values(1, 1)
                .arrayOptions(applicationConfig.menu.hydra.damage.options)
        },
    
        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { applications }} } = interaction;

            const application       = applications.getApplication(member);
            const [value]           = Input.menu(interaction)
            
            application.hydra.damage    = value;            
            application.meta.location   = (application.meta.location + 1) % applicationConfig.selection.count;

            interaction.editReply(EmbedManager.set(interaction).load('embed-application-apply-home').modify(applicationConfig.getModifier(application)).create());
        }    
    }),

    'chimera-difficulty': Schema.menu
    ({
        meta: { id: 'menu-application-chimera-difficulty' },

        flag: { update:true },

        load: function()
        {
            return Component
                .menu(this.meta.id)
                .placeholder(applicationConfig.menu.chimera.difficulty.placeholder)
                .values(1, 1)
                .arrayOptions(applicationConfig.menu.chimera.difficulty.options)
        },
    
        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { applications }} } = interaction;

            const application       = applications.getApplication(member);
            const [value]           = Input.menu(interaction)
            
            application.chimera.difficulty  = value;            
            application.meta.location       = (application.meta.location + 1) % applicationConfig.selection.count;

            interaction.editReply(EmbedManager.set(interaction).load('embed-application-apply-home').modify(applicationConfig.getModifier(application)).create());
        }    }),

    'chimera-damage': Schema.menu
    ({
        meta: { id: 'menu-application-chimera-damage' },

        flag: { update:true },

        load: function()
        {
            return Component
                .menu(this.meta.id)
                .placeholder(applicationConfig.menu.chimera.damage.placeholder)
                .values(1, 1)
                .arrayOptions(applicationConfig.menu.chimera.damage.options)
        },
    
        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { applications }} } = interaction;

            const application       = applications.getApplication(member);
            const [value]           = Input.menu(interaction)
            
            application.chimera.damage  = value;            
            application.meta.location   = (application.meta.location + 1) % applicationConfig.selection.count;

            interaction.editReply(EmbedManager.set(interaction).load('embed-application-apply-home').modify(applicationConfig.getModifier(application)).create());
        }    
    }),
}


export default data