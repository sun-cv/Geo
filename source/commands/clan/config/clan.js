import { Input }    from '#utils';
import maps         from '#resources/mapping/text.json' with { type: 'json' };


const clanConfig =
{
    grid: 
    [
        [0,  1,  2 ],
        [3,  3,  3,],
        [4,  5,  6 ],
        [7,  8,  9 ],
        [10, 11, 12],
        [13, 14, 15],
        [16, 17, 18],
        [19, 20, 21],
        [22],
        [23]

        

    ],

    element:
    {
        selection:  
        [
            { button:   ['button-clan-update-membercount'       ]},
            { button:   ['button-clan-update-tag'               ]},
            { button:   ['button-clan-update-level'             ]},
            { button:   ['button-clan-update-leader',
                         'button-clan-update-deputy',           ]},
            { menu:     ['menu-clan-update-clanboss-clearing'   ]},
            { menu:     ['menu-clan-update-hydra-clearing'      ]},
            { menu:     ['menu-clan-update-chimera-clearing'    ]},
            { menu:     ['menu-clan-update-clanboss-keys'       ]},
            { menu:     ['menu-clan-update-hydra-keys'          ]},
            { menu:     ['menu-clan-update-chimera-keys'        ]},
            { menu:     ['menu-clan-update-clanboss-difficulty' ]},
            { menu:     ['menu-clan-update-hydra-difficulty'    ]},
            { menu:     ['menu-clan-update-chimera-difficulty'  ]},
            { button:   ['button-clan-update-clanboss-custom'   ]},
            { button:   ['button-clan-update-hydra-custom'      ]},
            { button:   ['button-clan-update-chimera-custom'    ]},
            { menu:     ['menu-clan-update-cvc-requirement'     ]},        
            { menu:     ['menu-clan-update-siege-requirement'   ]},        
            { menu:     ['menu-clan-update-settings-autoaccept' ]},        
            { menu:     ['menu-clan-update-cvc-average'         ]},        
            { button:   ['button-clan-update-siege-custom'      ]},        
            { menu:     ['menu-clan-update-settings-autoclear'  ]},        
            { button:   ['button-clan-update-cvc-custom'        ]},
            { button:   ['button-clan-update-recruitment-message']}        

        ],
    },


    menu:
    {
        placeholder: 
        {

            clanboss:
            {
                clearing:   'Statistics Demon Lord difficulties cleared daily',
                keys:       'Recruitment Demon lord key use requirement',
                difficulty: 'Recruitment Demon lord highest difficulty requirement',
                custom:     'Recruitment Demon Lord custom message'
            },
            hydra:
            {
                clearing:   'Statistics Hydra difficulties cleared daily',
                keys:       'Recruitment Hydra key use requirement',
                difficulty: 'Recruitment Hydra highest difficulty requirement',
                custom:     'Recruitment Hydra custom message'
            },
            chimera:
            {
                clearing:   'Statistics Chimera Lord difficulties cleared daily',
                keys:       'Recruitment Chimera key use requirement',
                difficulty: 'Recruitment Chimera highest difficulty requirement',
                custom:     'Recruitment Chimera custom message'
            },
            cvc:
            {
                requirement:'Recruitment is cvc participation required?',
                average:    'Recruitment average cvc points',
                custom:     'Recruitment cvc custom message'
            },
            siege:
            {
                requirement:'Recruitment is siege participation required?',
                custom:     'Recruitment siege custom message'
            },
            settings:
            {
                autoAccept: 'IN DEVELOPMENT',
                autoClear:  'IN DEVELOPMENT'
            }

        },

        options: 
        {
            difficultyMap:  maps.difficultyMap,
            damageMap:      maps.damageMap,
            keys:           ['1', '2', '3', '4'],
            trueFalse:      {true: true, false: false},
            pointsMap:      maps.pointsMap
        }
    },

    landing()
    {
        return (data) =>
        {
            data.row = 
            [
                { button:   ['button-application-view-application', 'button-application-view-transfer','button-clan-update-edit', 'button-back-small']},
            ]
        }
    },

    application()
    {
        return (data) =>
        {
            data.row = 
            [
                { menu:     ['menu-application-management-application' ]},
            ]
        }
    },    
    
    transfer()
    {
        return (data) =>
        {
            data.row = 
            [
                { menu:     ['menu-application-management-transfer' ]},
            ]
        }
    },

    edit()
    {
        return (data) =>
        {
            data.row = 
            [
                { button: ['button-movement-left-small', 'button-movement-down-small', 'button-movement-up-small', 'button-movement-right-small', 'button-clan-update-update']},
                { button: ['button-clan-update-membercount']}
            ]
        }
    },

    leader()
    {
        return (data) =>
            {
                data.row = 
                [
                    { button: ['button-movement-left-small', 'button-movement-down-small', 'button-movement-up-small', 'button-movement-right-small', 'button-clan-update-update']},
                    { menu:   ['menu-clan-update-leadership-leader']}
                ]
            }
    },

    deputy()
    {
        return (data) =>
            {
                data.row = 
                [
                    { button: ['button-movement-left-small', 'button-movement-down-small', 'button-movement-up-small', 'button-movement-right-small', 'button-clan-update-update']},
                    { menu:   ['menu-clan-update-leadership-deputy']}
                ]
            }
    },


    getModifier(selection)
    {
        return (data) => 
        {
            data.row.pop()
            data.row.push(clanConfig.element.selection[selection]);
        }
    }

}


export { clanConfig }