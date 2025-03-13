

const applicationData = (application) => 
{
    return {
    
        questions: 
        [
            "Which clan are you interested in joining?            ",
            "Are you interested in participating in Siege?        ",
            "What is the average number of PR CVC points you can contribute",

            "What is the maximum difficulty of Clan Boss that you are able to secure the top chest?",
            `How many total keys does it take to clear ${application?.clanBoss?.difficulty}?`,

            "What is the maximum difficulty of hydra that you are able to secure the top chest?",
            `What is your highest total damage on ${application?.hydra?.difficulty ? application?.hydra?.difficulty : ""} before multipliers?`,
            
            "What is the maximum difficulty of Chimera that you are able to secure the top chest?",
            `What is your highest total damage on ${application?.chimera?.difficulty ? application?.chimera?.difficulty: ""}?`,
            
            'Select "Response" below if you\'d like to leave a message\n\nOtherwise press > to proceed',
            'Please click "submit" to finalize your application',
        ],

        menu: 
        [
            'menu-application-clan-select',
            'menu-application-siege-active',
            'menu-application-cvc-points',
            
            'menu-application-clanboss-difficulty',
            'menu-application-clanboss-keys',

            'menu-application-hydra-difficulty',
            'menu-application-hydra-damage',

            'menu-application-chimera-difficulty',
            'menu-application-chimera-damage',
        ],
    }
}


export { applicationData }