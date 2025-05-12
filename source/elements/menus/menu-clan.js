import { UserSelectMenuBuilder }                    from 'discord.js';
import config                                       from '#env/secret/credentials.json' with { type: 'json' }
import { Component, EmbedManager, Schema, Input, Flags }   from '#utils'
import { clanConfig }                               from '#commands/clan/config/clan.js'
import { RoleAssignment }                           from '#events/interaction/handler/role.js';

const flag = Flags.from({ autoload: true })

const data = 
{

    'clan-info': Schema.menu
    ({
        meta: { id: 'menu-clan-info-select' },
    
        load: function(interaction)
        {
            const { clanManagement: { clan } } = interaction.client  
        
            const clans = Object.values(clan).sort((a, b) => a.tier - b.tier);

            return Component
                .menu(this.meta.id)
                .placeholder('Select clan for more info')
                .values(1, 1)
                .arrayOptions(clans.map((clan) => {return clan.clan}))
        },
    
        execute: function(interaction) 
        {
            const { client: { clanManagement, clanManagement: { cache: { active, clones, selection }} }, member } = interaction
            const [value] = Input.menu(interaction)

            const clonedClan = clanManagement.cloneClan(value)

            active.set(member.id, value);
            clones.set(member.id, clonedClan)

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-info').create());
        }
    }),

    'clan-home-select': Schema.menu
    ({
        meta: { id: 'menu-clan-home-select' },
    
        load: function(interaction)
        {
            const { clanManagement: { clan } } = interaction.client  
        
            const clans = Object.values(clan).sort((a, b) => a.tier - b.tier);

            return Component
                .menu(this.meta.id)
                .placeholder('Select clan to manage')
                .values(1, 1)
                .arrayOptions(clans.map((clan) => {return clan.clan}))
        },
    
        execute: function(interaction) 
        {
            const { client: { clanManagement, clanManagement: { cache: { active, clones, selection }} }, member } = interaction
            const [value] = Input.menu(interaction)

            const clonedClan = clanManagement.cloneClan(value)

            active.set(member.id, value);
            clones.set(member.id, clonedClan)
            selection.set(member.id, 0);

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(clanConfig.landing()).create());
        }
    }),


    'clan-update-leadership-leader': Schema.menu
    ({
        meta: { id: 'menu-clan-update-leadership-leader' },

        flag:
        {
            navigation: false,
        },

        load: function(interaction)
        {

            const menu = new UserSelectMenuBuilder()
                .setCustomId('menu-clan-update-leadership-leader')
                .setPlaceholder('Select new leader')
                .setMinValues(1)
                .setMaxValues(1)

            return menu;
        },

        execute: function(interaction) 
        {

            const { member, client: { guilds, clanManagement: { cache: { active, selection, clones }}}} = interaction;
            const [value]   = Input.menu(interaction)

            clones.get(member.id).leadership.leader = value
            RoleAssignment.set(interaction, value).removeRole('Deputy').addRole('Officer')

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(clanConfig.getModifier(selection.get(member.id))).create());
        }
    }),

    'clan-update-leadership-deputy': Schema.menu
    ({
        meta: { id: 'menu-clan-update-leadership-deputy' },

        flag:
        {
            navigation: false,
        },
        
        load: function(interaction)
        {

            const menu = new UserSelectMenuBuilder()
                .setCustomId('menu-clan-update-leadership-deputy')
                .setPlaceholder('Select new deputies')
                .setMinValues(1)
                .setMaxValues(15)

            return menu;
        },

        execute: async function(interaction) 
        {
            const { member, client: { guilds, clanManagement: { cache: { active, selection, clones }}}} = interaction;
            const value     = Input.menu(interaction)
            
            const guild     = guilds.cache.get(config.guildID);
            await guild.members.fetch();
            
            const officerRole   = 'Officer';
            const clanRole      = active.get(member.id).role;

            const roles         = [officerRole, clanRole];

            const clanOfficers  = guild.members.cache.filter(member =>
                roles.every(role => member.roles.cache.has(role))
            );

            const officerIds    = clanOfficers.map(m => m.id);

            clones.get(member.id).leadership.deputies = value;

            for (const userId of value) 
            {
                if (officerIds.includes(userId)) 
                {
                    RoleAssignment.set(interaction, userId).removeRole('Officer').addRole('Deputy');
                }
            } 

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(clanConfig.getModifier(selection.get(member.id))).create());
        }
    }),    
    

    'clan-update-clanboss-clearing': Schema.menu
    ({
        meta: { id: 'menu-clan-update-clanboss-clearing' },

        flag:
        {
            navigation: false,
        },
        
        load: function(interaction)
        {

            return Component
                .menu(this.meta.id)
                .placeholder(clanConfig.menu.placeholder.clanboss.clearing)
                .values(1, 4)
                .objectOptions(clanConfig.menu.options.difficultyMap)
        },

        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { cache: { clones, selection }}}} = interaction;
            const value     = Input.menu(interaction);
            const clan      = clones.get(member.id)

            clan.statistics.clanboss.clearing = value

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(clanConfig.getModifier(selection.get(member.id))).create());
        }

    }),

    'clan-update-clanboss-keys': Schema.menu
    ({
        meta: { id: 'menu-clan-update-clanboss-keys' },

        flag:
        {
            navigation: false,
        },
        
        load: function(interaction)
        {
            return Component
                .menu(this.meta.id)
                .placeholder(clanConfig.menu.placeholder.clanboss.keys)
                .values(1, 1)
                .arrayOptions(clanConfig.menu.options.keys)
        },

        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { cache: { clones, selection }}}} = interaction;
            const [ value ] = Input.menu(interaction);
            const clan      = clones.get(member.id)

            clan.recruitment.clanboss.keys = value

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(clanConfig.getModifier(selection.get(member.id))).create());
        }
    }),

    'clan-update-clanboss-difficulty': Schema.menu
    ({
        meta: { id: 'menu-clan-update-clanboss-difficulty' },

        flag:
        {
            navigation: false,
        },
        
        load: function(interaction)
        {
            return Component
                .menu(this.meta.id)
                .placeholder(clanConfig.menu.placeholder.clanboss.difficulty)
                .values(1, 1)
                .objectOptions(clanConfig.menu.options.difficultyMap)
        },

        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { cache: { clones, selection }}}} = interaction;
            const [ value ] = Input.menu(interaction);
            const clan      = clones.get(member.id)

            clan.recruitment.clanboss.difficulty = value

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(clanConfig.getModifier(selection.get(member.id))).create());
        }
    }),

    'clan-update-hydra-clearing': Schema.menu
    ({
        meta: { id: 'menu-clan-update-hydra-clearing' },

        flag:
        {
            navigation: false,
        },
        
        load: function(interaction)
        {
            return Component
                .menu(this.meta.id)
                .placeholder(clanConfig.menu.placeholder.hydra.clearing)
                .values(1, 4)
                .objectOptions(clanConfig.menu.options.difficultyMap)
        },

        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { cache: { clones, selection }}}} = interaction;
            const value     = Input.menu(interaction);
            const clan      = clones.get(member.id)

            clan.statistics.hydra.clearing = value

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(clanConfig.getModifier(selection.get(member.id))).create());
        }

    }),

    'clan-update-hydra-keys': Schema.menu
    ({
        meta: { id: 'menu-clan-update-hydra-keys' },

        flag:
        {
            navigation: false,
        },
        
        load: function(interaction)
        {
            return Component
                .menu(this.meta.id)
                .placeholder(clanConfig.menu.placeholder.hydra.keys)
                .values(1, 1)
                .arrayOptions(clanConfig.menu.options.keys)
        },

        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { cache: { clones, selection }}}} = interaction;
            const [ value ] = Input.menu(interaction);
            const clan      = clones.get(member.id)

            clan.recruitment.hydra.keys = value

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(clanConfig.getModifier(selection.get(member.id))).create());
        }
    }),

    'clan-update-hydra-difficulty': Schema.menu
    ({
        meta: { id: 'menu-clan-update-hydra-difficulty' },

        flag:
        {
            navigation: false,
        },
        
        load: function(interaction)
        {
            return Component
                .menu(this.meta.id)
                .placeholder(clanConfig.menu.placeholder.hydra.difficulty)
                .values(1, 1)
                .objectOptions(clanConfig.menu.options.difficultyMap)
        },

        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { cache: { clones, selection }}}} = interaction;
            const [ value ] = Input.menu(interaction);
            const clan      = clones.get(member.id)

            clan.recruitment.hydra.difficulty = value

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(clanConfig.getModifier(selection.get(member.id))).create());
        }
    }),

        'clan-update-chimera-clearing': Schema.menu
    ({
        meta: { id: 'menu-clan-update-chimera-clearing' },

        flag:
        {
            navigation: false,
        },
        
        load: function(interaction)
        {
            return Component
                .menu(this.meta.id)
                .placeholder(clanConfig.menu.placeholder.chimera.clearing)
                .values(1, 4)
                .objectOptions(clanConfig.menu.options.difficultyMap)
        },

        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { cache: { clones, selection }}}} = interaction;
            const value     = Input.menu(interaction);
            const clan      = clones.get(member.id)

            clan.statistics.chimera.clearing = value

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(clanConfig.getModifier(selection.get(member.id))).create());
        }

    }),

    'clan-update-chimera-keys': Schema.menu
    ({
        meta: { id: 'menu-clan-update-chimera-keys' },

        flag:
        {
            navigation: false,
        },
        
        load: function(interaction)
        {
            return Component
                .menu(this.meta.id)
                .placeholder(clanConfig.menu.placeholder.chimera.keys)
                .values(1, 1)
                .arrayOptions(clanConfig.menu.options.keys)
        },

        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { cache: { clones, selection }}}} = interaction;
            const [ value ] = Input.menu(interaction);
            const clan      = clones.get(member.id)

            clan.recruitment.chimera.keys = value

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(clanConfig.getModifier(selection.get(member.id))).create());
        }
    }),

    'clan-update-chimera-difficulty': Schema.menu
    ({
        meta: { id: 'menu-clan-update-chimera-difficulty' },

        flag:
        {
            navigation: false,
        },
        
        load: function(interaction)
        {
            return Component
                .menu(this.meta.id)
                .placeholder(clanConfig.menu.placeholder.chimera.difficulty)
                .values(1, 1)
                .objectOptions(clanConfig.menu.options.difficultyMap)
        },

        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { cache: { clones, selection }}}} = interaction;
            const [ value ] = Input.menu(interaction);
            const clan      = clones.get(member.id)

            clan.recruitment.chimera.difficulty = value;

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(clanConfig.getModifier(selection.get(member.id))).create());
        }
    }),

    
    'clan-update-cvc-requirement': Schema.menu
    ({
        meta: { id: 'menu-clan-update-cvc-requirement' },

        flag:
        {
            navigation: false,
        },
        
        load: function(interaction)
        {
            return Component
                .menu(this.meta.id)
                .placeholder(clanConfig.menu.placeholder.cvc.requirement)
                .values(1, 1)
                .objectOptions(clanConfig.menu.options.trueFalse)
        },

        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { cache: { clones, selection }}}} = interaction;
            const [ value ] = Input.menu(interaction);
            const clan      = clones.get(member.id)

            clan.recruitment.cvc.required   = value;
            clan.statistics.cvc.average     = value;

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(clanConfig.getModifier(selection.get(member.id))).create());
        }
    }),

    'clan-update-cvc-average': Schema.menu
    ({
        meta: { id: 'menu-clan-update-cvc-average' },

        flag:
        {
            navigation: false,
        },
        
        load: function(interaction)
        {
            return Component
                .menu(this.meta.id)
                .placeholder(clanConfig.menu.placeholder.cvc.average)
                .values(1, 1)
                .objectOptions(clanConfig.menu.options.pointsMap)
        },

        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { cache: { clones, selection }}}} = interaction;
            const [ value ] = Input.menu(interaction);
            const clan      = clones.get(member.id)

            clan.recruitment.cvc.average = value;

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(clanConfig.getModifier(selection.get(member.id))).create());
        }
    }),

    'clan-update-siege-requirement': Schema.menu
    ({
        meta: { id: 'menu-clan-update-siege-requirement' },

        flag:
        {
            navigation: false,
        },
        
        load: function(interaction)
        {
            return Component
                .menu(this.meta.id)
                .placeholder(clanConfig.menu.placeholder.siege.requirement)
                .values(1, 1)
                .objectOptions(clanConfig.menu.options.trueFalse)
        },

        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { cache: { clones, selection }}}} = interaction;
            const [ value ] = Input.menu(interaction);
            const clan      = clones.get(member.id)

            clan.recruitment.siege.required = value

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(clanConfig.getModifier(selection.get(member.id))).create());
        }
    }),


    'clan-update-settings-autoaccept': Schema.menu
    ({
        meta: { id: 'menu-clan-update-settings-autoaccept' },

        flag:
        {
            navigation: false,
        },
        
        load: function(interaction)
        {
            return Component
                .menu(this.meta.id)
                .placeholder(clanConfig.menu.placeholder.settings.autoAccept)
                .values(1, 1)
                .objectOptions(clanConfig.menu.options.trueFalse)
        },

        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { cache: { clones, selection }}}} = interaction;
            const [ value ] = Input.menu(interaction);
            const clan      = clones.get(member.id)

            clan.settings.autoAccept = value

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(clanConfig.getModifier(selection.get(member.id))).create());
        }
    }),

    'clan-update-settings-autoclear': Schema.menu
    ({
        meta: { id: 'menu-clan-update-settings-autoclear' },

        flag:
        {
            navigation: false,
        },
        
        load: function(interaction)
        {
            return Component
                .menu(this.meta.id)
                .placeholder(clanConfig.menu.placeholder.settings.autoClear)
                .values(1, 1)
                .objectOptions(clanConfig.menu.options.trueFalse)
        },

        execute: function(interaction) 
        {
            const { member, client: { clanManagement: { cache: { clones, selection }}}} = interaction;
            const [ value ] = Input.menu(interaction);
            const clan      = clones.get(member.id)

            clan.settings.autoClear = value

            interaction.editReply(EmbedManager.set(interaction).load('embed-clan-management-home').modify(clanConfig.getModifier(selection.get(member.id))).create());
        }
    }),
}

export { flag }
export default data;