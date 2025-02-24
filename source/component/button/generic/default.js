
const data = 
{
    meta: 
    {
        id:             "Generic button collection",
        type:           "button",
        description:    "Generic button collection currently used for testing",
    },

    flag: 
    {
        ignore: false
    },


    button:
    {
        "generic-test-1": 
        {
            meta: 
            {
                id:                 'generic-test-1',
                type:               'button',
                description:        'Test button'
            },  

            access: 
            {   
                cooldown:           0,
                permissions:        [],
                channels:           [],
                roles:              [],
                exclude:    
                {       
                    permissions:    [],
                    channels:       [],
                    roles:          []
                }   
            },  

            flag:   
            {   
                ignore:             false,
                defer:              false,
                maintenance:        false 
            },  

            execute:                () =>
            {

            }
        },  

        'generic-test-2':     
        {   
            meta:   
            {   
                id:                 'generic-test-2',
                type:               'button',
                description:        'Test button'
            },  

            access: 
            {   
                cooldown:           0,
                permissions:        [],
                channels:           [],
                roles:              [],
                exclude:    
                {       
                    permissions:    [],
                    channels:       [],
                    roles:          []
                }   
            },  

            flag:   
            {   
                ignore:             false,
                defer:              false,
                maintenance:        false 
            },  

            execute:                () => 
            {

            }
        }
    }
}

export default data