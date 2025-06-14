import lodash           from 'lodash';
import { Condition }    from '#events/message/handler/filter.js';
import { Flags }        from './flag.js';


class Schema
{
    static autocomplete(overrides)
    {
        const defaultSchema = 
        {
            meta: 
            {
                id:             '',
                type:           'autocomplete',
                category:       'autocomplete'
            },

            permission: 
            {
                cooldown:       0,
                access:         [],
                require:
                {
                    channels:   [],
                    roles:      [],
                },
                exclude:
                {
                    channels:   [],
                    roles:      []
                }
            },

            flag: 
            {
                maintenance:    false,
                autocomplete:   true,

                handled:        false,
                autoload:       true,
            },

            execute:            function() {}
        };
    
        const schema    = lodash.merge(lodash.cloneDeep(defaultSchema), overrides);
        schema.flag     = Flags.from(schema.flag, defaultSchema.flag)
        return schema;    
    }


    static command(overrides)
    {
        const defaultSchema = 
        {
            meta: 
            {
                id:             '',
                type:           'command',
                category:       'command'
            },

            permission: 
            {
                cooldown:       0,
                access:         [],
                require:
                {
                    message:    '',
                    channels:   [],
                    roles:      [],
                },
                exclude:
                {
                    message:    '',
                    channels:   [],
                    roles:      []
                }
            },

            flag: 
            {
                defer:          true,
                update:         false,
                ephemeral:      true,

                permission:     false,
                require:        false,
                exclude:        false,
                cooldown:       false,

                maintenance:    false,
                autocomplete:   false,
                navigation:     false,
                
                handled:        false,
                autoload:       true,
            },

            data:               null,

            execute:            function() {}
        };
    
        const schema    = lodash.merge(lodash.cloneDeep(defaultSchema), overrides);
        schema.flag     = Flags.from(schema.flag, defaultSchema.flag)

        return schema;    
    }


    static button(overrides)
    {
        const defaultSchema = 
        {
            meta: 
            {
                id:             '',
                type:           'button',
                description:    'button'
            },

            permission: 
            {
                cooldown:       0,
                access:         [],
                require:
                {
                    message:    '',
                    channels:   [],
                    roles:      [],
                },
                exclude:
                {
                    message:    '',
                    channels:   [],
                    roles:      []
                }
            },

            flag: 
            {
                defer:          true,
                update:         false,
                ephemeral:      true,

                permission:     false,
                require:        false,
                exclude:        false,
                cooldown:       false,

                maintenance:    false,
                autocomplete:   false,
                navigation:     false,
                
                handled:        false,
                autoload:       true,
            },

            load:               function() {},
            execute:            function() {}
        };
    
        const schema    = lodash.merge(lodash.cloneDeep(defaultSchema), overrides);
        schema.flag     = Flags.from(schema.flag, defaultSchema.flag)
        return schema;    
    }    
    
    static menu(overrides)
    {
        const defaultSchema = 
        {
            meta: 
            {
                id:             '',
                type:           'menu',
                description:    'Menu'
            },

            permission: 
            {
                cooldown:       0,
                access:         [],
                require:
                {
                    message:    '',
                    channels:   [],
                    roles:      [],
                },
                exclude:
                {
                    message:    '',
                    channels:   [],
                    roles:      []
                }
            },

            flag: 
            {
                defer:          false,
                update:         true,
                ephemeral:      true,

                permission:     false,
                require:        false,
                exclude:        false,
                cooldown:       false,

                maintenance:    false,
                autocomplete:   false,
                navigation:     false,
                
                handled:        false,
                autoload:       true,
            },

            load:               function() {},
            execute:            function() {}
        };
    
        const schema    = lodash.merge(lodash.cloneDeep(defaultSchema), overrides);
        schema.flag     = Flags.from(schema.flag, defaultSchema.flag)
        return schema;    
    }


    static modal(overrides)
    {
        const defaultSchema = 
        {
            meta: 
            {
                id:             '',
                type:           'modal',
                description:    'modal'
            },

            permission: 
            {
                cooldown:       0,
                access:         [],
                require:
                {
                    message:    '',
                    channels:   [],
                    roles:      [],
                },
                exclude:
                {
                    message:    '',
                    channels:   [],
                    roles:      []
                }
            },

            flag: 
            {
                defer:          true,
                update:         false,
                ephemeral:      true,

                permission:     false,
                require:        false,
                exclude:        false,
                cooldown:       false,

                maintenance:    false,
                autocomplete:   false,
                navigation:     false,
                
                handled:        false,
                autoload:       true,
            },

            load:               function() {},
            execute:            function() {}
        };
    
        const schema    = lodash.merge(lodash.cloneDeep(defaultSchema), overrides);
        schema.flag     = Flags.from(schema.flag, defaultSchema.flag)
        return schema;    
    }

    static embed(overrides)
    {
        const defaultSchema = 
        {
            meta: 
            {
                id:             '',
                type:           'embed',
                description:    'embed'
            },

            permission: 
            {
                cooldown:       0,
                access:         [],
                require:
                {
                    message:    '',
                    channels:   [],
                    roles:      [],
                },
                exclude:
                {
                    message:    '',
                    channels:   [],
                    roles:      []
                }
            },

            row:                [],

            flag: 
            {
                defer:          true,
                update:         false,
                ephemeral:      true,
                
                permission:     false,
                require:        false,
                exclude:        false,

                maintenance:    false,
                autocomplete:   false,
                navigation:     false,
                
                handled:        false,
                autoload:       true,
            },
            
            load:               () => {},
            execute:            () => {}
        };
    
        const schema    = lodash.merge(lodash.cloneDeep(defaultSchema), overrides);
        schema.flag     = Flags.from(schema.flag, defaultSchema.flag)
        return schema;    
    }


    static message(overrides)
    {
        const defaultSchema = 
        {
            meta: 
            {
                id:             '',
                type:           'message',
                category:       'message',
                description:    'message'
            },

            condition:
            {
                scopes:         new Set(),
                member:         new Set(),
                content:        new Set(),
                channel:        new Set(),

                filters:        new Set(),
                exclude:        new Set(),
            },

            flag:
            {
                match:          false,
                filtered:       false,
            },


        };
    
        const schema    = lodash.merge(lodash.cloneDeep(defaultSchema), overrides);
        schema.flag     = Flags.from(schema.flag, defaultSchema.flag)
        return schema;
    }



    static filter(overrides)
    {
        const defaultSchema = 
        {
            meta: 
            {
                id:             '',
                type:           'filter',
                category:       'filter',
                description:    'filter'
            },

            condition:
            {
                scopes:         [],
                include:
                {
                    member:     [],
                    content:    [],
                    channel:    [],
                },
                exclude:
                {
                    member:     [],
                    content:    [],
                    channel:    [],        
                }
            },

            flag:
            {
                bot:            false,

                maintenance:    false,
                autoload:       true,
            },

            evaluate:           function() {},
            execute:            function() {}
        };
    
        const schema        = lodash.merge(lodash.cloneDeep(defaultSchema), overrides);
        schema.flag         = Flags.from(schema.flag, defaultSchema.flag)
        schema.condition    = new Condition(schema.condition, schema.flag)
        return schema
    }

    static task(overrides)
    {
        const defaultSchema = 
        {
            meta: 
            {
                id:             '',
                type:           'task',
                category:       'task',
                description:    'task'
            },

            data:
            {
                schedule:       '',
                argument:       [],
                attempt:        0      
            },

            flag: 
            {
                autoload:       true,
                reattempt:      true,
            },

            execute:            function() {}
        };
    
        const schema    = lodash.merge(lodash.cloneDeep(defaultSchema), overrides);
        schema.flag     = Flags.from(schema.flag, defaultSchema.flag)
        return schema;    
    }

    static promocode(overrides) 
    {
        const defaultSchema = 
        {
            meta: 
            {
                id:             '',
                type:           '',
                category:       'promocode',
                description:    'Raid promocode',
                timestamp:      ''
            },

            data: 
            {
                code:               '',
                type:               '',
                champion:           '',
                silver:             '',
                experience_brew:    '',
                experience_day:     0,
                energy_refill:      0,
                energy_flat:        0,
                multi_battle:       0,
                potion:             '',
                chicken:            '',
                book:               '',
                shard:              '',
                artifact:           '',
                refill_arena:       0,
                not_listed:         '',
            },

            condition:
            {
                scopes: [],
            },

            status:
            {
                reportCount:        0,
                reportUser:         [],
            },

            flag: 
            {
                valid:              true,
                reported:           false
            },

        };

        const schema    = lodash.merge(lodash.cloneDeep(defaultSchema), overrides);
        schema.flag     = Flags.from(schema.flag, defaultSchema.flag);
        return schema;
    }



}


export { Schema }