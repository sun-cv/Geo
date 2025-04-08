

const applicationConfig =
{

    

    questions: (application) => 
    {
        return [
            "Which clan are you interested in joining?              ",
            "Are you interested in participating in Siege?          ",
            "What is the average number of PR CVC points you can contribute ",
            "What is the maximum difficulty of Clan Boss that you are able to secure the top chest? ",
            `How many total keys does it take to clear ${application.clanboss.difficulty ? application.clanboss.difficult : "your selected difficulty"}? `,
            "What is the maximum difficulty of hydra that you are able to secure the top chest? ",
            `What is your highest total damage on ${application.hydra.difficulty ? application.hydra.difficulty : "your selected difficulty"} before multipliers?   `,
            "What is the maximum difficulty of Chimera that you are able to secure the top chest? ",
            `What is your highest total damage on ${application.chimera.difficulty ? application.chimera.difficulty: "your selected difficulty"}?   `,
            'Click below if you\'d like to leave a message or > to continue ',
            'Please click submit to finalize your application ',
        ]
    },

    menu: 
    {
        load:
        [
            ['menu-application-clan-select'],
            ['menu-application-siege-active'],
            ['menu-application-cvc-points'],
            ['menu-application-clanboss-difficulty'],
            ['menu-application-clanboss-keys'],
            ['menu-application-hydra-difficulty'],
            ['menu-application-hydra-damage'],
            ['menu-application-chimera-difficulty'],
            ['menu-application-chimera-damage'],
        ],

        clan:   { placeholder: 'Select your preferred clan'},
        siege:  { placeholder: 'Select your preference',        options: { yes: true , maybe: null, no: false }},
        cvc:    { placeholder: 'select your CvC point total',   options: ['10k', '20k', '30k', '40k', '50k', '60k', '70k', '80k', '90k', '100k', '150k', '200k', '250k', '300k', '350k', '400k', '450k', '500k', '1m', '2m', '3m', '4m', '5m', '10m' ]},
        
        clanboss:
        {
            difficulty: { placeholder: 'Click here to select your answer',  options: ['Easy', 'Hard', 'Brutal', 'Nightmare', 'Ultra-Nightmare'] },
            keys:       { placeholder: 'Select your keys',                  options: ['1-Key', '2-Key', '3-Key', '4-Key'] }
        },
    
        hydra:
        {
            difficulty: { placeholder: 'Select your difficulty',            options: ['N/A', 'Normal', 'Hard', 'Brutal', 'Nightmare'] },
            damage:     { placeholder: 'Select your damage',                options: ['N/A', '1-100K', '100K-500K', '500K-1M', '1-2M', '2-5M', '5-10M', '10-20M', '20-30M', '30-40M', '40-50M', '50-60M', '60-70M', '70-80M', '80-90M', '90M-100M', '100M-200M', '200M-300M', '300M-400M', '400M-500M', '500M-750M', '750M-1B', '1-2B', '2-5B', '5B+'] }
        },
        
        chimera:
        {
            difficulty: { placeholder: 'Select your difficulty',            options: ['N/A', 'Normal', 'Hard', 'Brutal', 'Nightmare'] },
            damage:     { placeholder: 'Select your damage',                options: ['N/A', '1-100K', '100K-500K', '500K-1M', '1-2M', '2-5M', '5-10M', '10-20M', '20-30M', '30-40M', '40-50M', '50-60M', '60-70M', '70-80M', '80-90M', '90M-100M', '100M-200M', '200M-300M', '300M-400M', '400M-500M', '500M-750M', '750M-1B', '1-2B', '2-5B', '5B+'] }
        },
    },

    selection:
    {
        count: 11
    },

    getModifier: (application) =>
    {

        if (application.meta.location == 9)
            {                
                return (data) => 
                {    
                    data.row.pop()
                    data.row[0].button[1] = 'button-application-message';
                }
            }

        if (application.meta.location == 10)
        {
             return (data) => 
            {    
                data.row.pop()
                data.row[0].button[1] = 'button-application-submit';
            }
        }

        return (data) => 
        {
            data.row.pop()
            data.row.push({menu: applicationConfig.menu.load[application.meta.location]});
        }
    },

    roles:  ['Red Wardens', 'UltimateSunKnights', 'Cold Red Sun', 'Deep Dwarf Squats', 'Bald is Bootyful', 'The Silent']
}


export { applicationConfig }