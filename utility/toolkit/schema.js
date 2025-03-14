import lodash                       from 'lodash';



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
                    active:     false,
                    channels:   [],
                    roles:      [],
                },
                exclude:
                {
                    active:     false,
                    channels:   [],
                    roles:      []
                }
            },

            flag: 
            {

                maintenance:    false,
                autocomplete:   true,

                handled:        false,
                ignore:         false,
            },

            execute:            () => {}
        };
    
        return lodash.merge(lodash.cloneDeep(defaultSchema), overrides);
    }


    static command(overrides)
    {
        const defaultSchema = 
        {
            meta: 
            {
                id:             '',
                type:           'Command',
                category:       'Command'
            },

            permission: 
            {
                cooldown:       0,
                access:         [],
                require:
                {
                    active:     false,
                    channels:   [],
                    roles:      [],
                },
                exclude:
                {
                    active:     false,
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
                maintenance:    false,
                autocomplete:   false,
                navigation:     false,
                
                handled:        false,
                ignore:         false,
            },

            roleAssignment:     {},

            data:               null,

            execute:            () => {}
        };
    
        return lodash.merge(lodash.cloneDeep(defaultSchema), overrides);
    }


    static button(overrides)
    {
        const defaultSchema = 
        {
            meta: 
            {
                id:             '',
                type:           'Button',
                description:    'Button'
            },

            permission: 
            {
                cooldown:       0,
                access:         [],
                require:
                {
                    active:     false,
                    channels:   [],
                    roles:      [],
                },
                exclude:
                {
                    active:     false,
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
                maintenance:    false,
                autocomplete:   false,
                navigation:     false,
                
                handled:        false,
                ignore:         false,
            },

            roleAssignment:     {},

            load:               () => {},
            execute:            () => {}
        };
    
        return lodash.merge(lodash.cloneDeep(defaultSchema), overrides);
    }    
    
    static menu(overrides)
    {
        const defaultSchema = 
        {
            meta: 
            {
                id:             '',
                type:           'Menu',
                description:    'Menu'
            },

            permission: 
            {
                cooldown:       0,
                access:         [],
                require:
                {
                    active:     false,
                    channels:   [],
                    roles:      [],
                },
                exclude:
                {
                    active:     false,
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
                maintenance:    false,
                autocomplete:   false,
                navigation:     false,
                
                handled:        false,
                ignore:         false,
            },

            roleAssignment:     {},

            load:               () => {},
            execute:            () => {}
        };
    
        return lodash.merge(lodash.cloneDeep(defaultSchema), overrides);
    }


    static modal(overrides)
    {
        const defaultSchema = 
        {
            meta: 
            {
                id:             '',
                type:           'Modal',
                description:    'Modal'
            },

            permission: 
            {
                cooldown:       0,
                access:         [],
                require:
                {
                    active:     false,
                    channels:   [],
                    roles:      [],
                },
                exclude:
                {
                    active:     false,
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
                maintenance:    false,
                autocomplete:   false,
                navigation:     false,
                
                handled:        false,
                ignore:         false,
            },

            roleAssignment:     {},

            load:               () => {},
            execute:            () => {}
        };
    
        return lodash.merge(lodash.cloneDeep(defaultSchema), overrides);
    }

    static embed(overrides)
    {
        const defaultSchema = 
        {
            meta: 
            {
                id:             '',
                type:           'Embed',
                description:    'Embed'
            },

            permission: 
            {
                cooldown:       0,
                access:         [],
                require:
                {
                    active:     false,
                    channels:   [],
                    roles:      [],
                },
                exclude:
                {
                    active:     false,
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
                maintenance:    false,
                autocomplete:   false,
                navigation:     false,
                
                handled:        false,
                ignore:         false,
            },
            
            roleAssignment:     {},

            load:               () => {},
            execute:            () => {}
        };
    
        return lodash.merge(lodash.cloneDeep(defaultSchema), overrides);
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
                reattempt:      true
            },

            execute:            () => {}
        };
    
        return lodash.merge(lodash.cloneDeep(defaultSchema), overrides);
    }
}


export { Schema }