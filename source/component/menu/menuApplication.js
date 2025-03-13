import { Component, EmbedManager, Schema }  from "../../../utility/index.js";
import { Text, Input }                      from "../../../utility/index.js";
import { applicationData }                  from "../../data/application/data.js";

const data = 
{
    'application-clan': Schema.menu
    ({
        meta: { id: 'menu-application-clan-select' },

        flag: { update:true },
    
        load: function(interaction)
        {
            const { clanCluster: { clan } } = interaction.client  
        
            const clans = Object.values(clan).sort((a, b) => a.tier - b.tier);

            return Component
                .menu(this.meta.id)
                .placeholder('Select clan you\'d like to join')
                .values(1, 1)
                .arrayOptions(clans.map((clan) => {return clan.clan}))
        },
    
        execute: function(interaction) 
        {
            const { member, client: { clanCluster: { applications }} } = interaction;

            const application       = applications.getApplication(member);
            const [value]           = Input.menu(interaction)
            
            application.selection       = value;
            application.clan.selection  = value;
            
            application.meta.location = (application.meta.location + 1) % 9;

            const modifier = (data) => 
                {
                    data.row.pop()
                    data.row.push({menu: applicationData(interaction).menu[application.meta.location]});
                }
            interaction.editReply(EmbedManager.set(interaction).load('embed-application-apply-home').modify(modifier).create());
        }
    }),

    'application-siege': Schema.menu
    ({
        meta: { id: 'menu-application-siege-active' },

        flag: { update:true },

        load: function(interaction)
        {
            const { clanCluster: { clan } } = interaction.client  
        
            const clans = Object.values(clan).sort((a, b) => a.tier - b.tier);

            return Component
                .menu(this.meta.id)
                .placeholder('2')
                .values(1, 1)
                .arrayOptions(clans.map((clan) => {return clan.clan}))
        },
    
        execute: function(interaction) 
        {
            const { member, client: { clanCluster: { applications }} } = interaction;

            const application       = applications.getApplication(member);
            const [value]           = Input.menu(interaction)
            
            application.selection       = value;
            application.clan.selection  = value;
            
            application.meta.location = (application.meta.location + 1) % 9;

            const modifier = (data) => 
                {
                    data.row.pop()
                    data.row.push({menu: applicationData(interaction).menu[application.meta.location]});
                }
            interaction.editReply(EmbedManager.set(interaction).load('embed-application-apply-home').modify(modifier).create());
        }
    }),

    'application-cvc': Schema.menu
    ({
        meta: { id: 'menu-application-cvc-points' },

        flag: { update:true },

        load: function(interaction)
        {
            const { clanCluster: { clan } } = interaction.client  
        
            const clans = Object.values(clan).sort((a, b) => a.tier - b.tier);

            return Component
                .menu(this.meta.id)
                .placeholder('3')
                .values(1, 1)
                .arrayOptions(clans.map((clan) => {return clan.clan}))
        },
    
        execute: function(interaction) 
        {
            const { member, client: { clanCluster: { applications }} } = interaction;

            const application       = applications.getApplication(member);
            const [value]           = Input.menu(interaction)
            
            application.selection       = value;
            application.clan.selection  = value;
            
            application.meta.location = (application.meta.location + 1) % 9;

            const modifier = (data) => 
                {
                    data.row.pop()
                    data.row.push({menu: applicationData(interaction).menu[application.meta.location]});
                }
            interaction.editReply(EmbedManager.set(interaction).load('embed-application-apply-home').modify(modifier).create());
        }
    }),

    'clanboss-difficulty': Schema.menu
    ({
        meta: { id: 'menu-application-clanboss-difficulty' },

        flag: { update:true },

        load: function(interaction)
        {
            const { clanCluster: { clan } } = interaction.client  
        
            const clans = Object.values(clan).sort((a, b) => a.tier - b.tier);

            return Component
                .menu(this.meta.id)
                .placeholder('4')
                .values(1, 1)
                .arrayOptions(clans.map((clan) => {return clan.clan}))
        },
    
        execute: function(interaction) 
        {
            const { member, client: { clanCluster: { applications }} } = interaction;

            const application       = applications.getApplication(member);
            const [value]           = Input.menu(interaction)
            
            application.selection       = value;
            application.clan.selection  = value;
            
            application.meta.location = (application.meta.location + 1) % 9;

            const modifier = (data) => 
                {
                    data.row.pop()
                    data.row.push({menu: applicationData(interaction).menu[application.meta.location]});
                }
            interaction.editReply(EmbedManager.set(interaction).load('embed-application-apply-home').modify(modifier).create());
        }
    }),

    'clanboss-keys': Schema.menu
    ({
        meta: { id: 'menu-application-clanboss-keys' },

        flag: { update:true },

        load: function(interaction)
        {
            const { clanCluster: { clan } } = interaction.client  
        
            const clans = Object.values(clan).sort((a, b) => a.tier - b.tier);

            return Component
                .menu(this.meta.id)
                .placeholder('5')
                .values(1, 1)
                .arrayOptions(clans.map((clan) => {return clan.clan}))
        },
    
        execute: function(interaction) 
        {
            const { member, client: { clanCluster: { applications }} } = interaction;

            const application       = applications.getApplication(member);
            const [value]           = Input.menu(interaction)
            
            application.selection       = value;
            application.clan.selection  = value;
            
            application.meta.location = (application.meta.location + 1) % 9;

            const modifier = (data) => 
                {
                    data.row.pop()
                    data.row.push({menu: applicationData(interaction).menu[application.meta.location]});
                }
            interaction.editReply(EmbedManager.set(interaction).load('embed-application-apply-home').modify(modifier).create());
        }    }),

    'hydra-difficulty': Schema.menu
    ({
        meta: { id: 'menu-application-hydra-difficulty' },

        flag: { update:true },

        load: function(interaction)
        {
            const { clanCluster: { clan } } = interaction.client  
        
            const clans = Object.values(clan).sort((a, b) => a.tier - b.tier);

            return Component
                .menu(this.meta.id)
                .placeholder('6')
                .values(1, 1)
                .arrayOptions(clans.map((clan) => {return clan.clan}))
        },
    
        execute: function(interaction) 
        {
            const { member, client: { clanCluster: { applications }} } = interaction;

            const application       = applications.getApplication(member);
            const [value]           = Input.menu(interaction)
            
            application.selection       = value;
            application.clan.selection  = value;
            
            application.meta.location = (application.meta.location + 1) % 9;

            const modifier = (data) => 
                {
                    data.row.pop()
                    data.row.push({menu: applicationData(interaction).menu[application.meta.location]});
                }
            interaction.editReply(EmbedManager.set(interaction).load('embed-application-apply-home').modify(modifier).create());
        }    }),

    'hydra-damage': Schema.menu
    ({
        meta: { id: 'menu-application-hydra-damage' },

        flag: { update:true },

        load: function(interaction)
        {
            const { clanCluster: { clan } } = interaction.client  
        
            const clans = Object.values(clan).sort((a, b) => a.tier - b.tier);

            return Component
                .menu(this.meta.id)
                .placeholder('7')
                .values(1, 1)
                .arrayOptions(clans.map((clan) => {return clan.clan}))
        },
    
        execute: function(interaction) 
        {
            const { member, client: { clanCluster: { applications }} } = interaction;

            const application       = applications.getApplication(member);
            const [value]           = Input.menu(interaction)
            
            application.selection       = value;
            application.clan.selection  = value;
            
            application.meta.location = (application.meta.location + 1) % 9;

            const modifier = (data) => 
                {
                    data.row.pop()
                    data.row.push({menu: applicationData(interaction).menu[application.meta.location]});
                }
            interaction.editReply(EmbedManager.set(interaction).load('embed-application-apply-home').modify(modifier).create());
        }    }),

    'chimera-difficulty': Schema.menu
    ({
        meta: { id: 'menu-application-chimera-difficulty' },

        flag: { update:true },

        load: function(interaction)
        {
            const { clanCluster: { clan } } = interaction.client  
        
            const clans = Object.values(clan).sort((a, b) => a.tier - b.tier);

            return Component
                .menu(this.meta.id)
                .placeholder('8')
                .values(1, 1)
                .arrayOptions(clans.map((clan) => {return clan.clan}))
        },
    
        execute: function(interaction) 
        {
            const { member, client: { clanCluster: { applications }} } = interaction;

            const application       = applications.getApplication(member);
            const [value]           = Input.menu(interaction)
            
            application.selection       = value;
            application.clan.selection  = value;
            
            application.meta.location = (application.meta.location + 1) % 9;

            const modifier = (data) => 
                {
                    data.row.pop()
                    data.row.push({menu: applicationData(interaction).menu[application.meta.location]});
                }
            interaction.editReply(EmbedManager.set(interaction).load('embed-application-apply-home').modify(modifier).create());
        }    }),

    'chimera-damage': Schema.menu
    ({
        meta: { id: 'menu-application-chimera-damage' },

        flag: { update:true },

        load: function(interaction)
        {
            const { clanCluster: { clan } } = interaction.client  
        
            const clans = Object.values(clan).sort((a, b) => a.tier - b.tier);

            return Component
                .menu(this.meta.id)
                .placeholder('9')
                .values(1, 1)
                .arrayOptions(clans.map((clan) => {return clan.clan}))
        },
    
        execute: function(interaction) 
        {
            const { member, client: { clanCluster: { applications }} } = interaction;

            const application       = applications.getApplication(member);
            const [value]           = Input.menu(interaction)
            
            application.selection       = value;
            application.clan.selection  = value;
            
            application.meta.location = (application.meta.location + 1) % 9;

            const modifier = (data) => 
                {
                    data.row.pop()
                    data.row.push({menu: applicationData(interaction).menu[application.meta.location]});
                }
            interaction.editReply(EmbedManager.set(interaction).load('embed-application-apply-home').modify(modifier).create());
        }    
    }),
}


export default data;