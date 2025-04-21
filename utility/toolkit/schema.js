import lodash from 'lodash';


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

            execute:            function() {}
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
                    active:     false,
                    channels:   [],
                    roles:      [],
                },
                exclude:
                {
                    message:    '',
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

            execute:            function() {}
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
                    active:     false,
                    channels:   [],
                    roles:      [],
                },
                exclude:
                {
                    message:    '',
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

            load:               function() {},
            execute:            function() {}
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
                    active:     false,
                    channels:   [],
                    roles:      [],
                },
                exclude:
                {
                    message:    '',
                    active:     false,
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
                maintenance:    false,
                autocomplete:   false,
                navigation:     false,
                
                handled:        false,
                ignore:         false,
            },

            roleAssignment:     {},

            load:               function() {},
            execute:            function() {}
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
                    active:     false,
                    channels:   [],
                    roles:      [],
                },
                exclude:
                {
                    message:    '',
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

            load:               function() {},
            execute:            function() {}
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
                    active:     false,
                    channels:   [],
                    roles:      [],
                },
                exclude:
                {
                    message:    '',
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

            config:
            {
                scope:          [],
                channel:        [],
                member:         [],
                word:           [],
            },

            check:              function() {},
            execute:            function() {}
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

            execute:            function() {}
        };
    
        return lodash.merge(lodash.cloneDeep(defaultSchema), overrides);
    }
}


export { Schema }