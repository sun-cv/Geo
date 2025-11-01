import { Text, Timestamp }  from '#utils/index.js'



const template = 
{
    landing: 
    {
        landing: (interaction) =>
        {
            const message = 
`${Text.set(`Colred Plays Account takeovers`).constrain(58, { style: ['block_code'], align: 'center'})}`
            return message;    
        },

        message: (interaction) =>
        {
            const message = 
`
This is where messaging goes regarding the takeovers. In it we can add stuff including, but not limited to things like:

- the price
- the timeframe
- the discussion

And anything else that needs to be added.
`
            return message;    
        },

        queue: (interaction) =>
        {
            const message = 
`${Text.set(`Current takeover queue:`).constrain(58, { style: ['block_code'], align: 'center'})}`
            return message;    
        },


        pending: (interaction, values) => 
        {
            const message = 
`${Text.set(`Pending: ${values.pending}`).constrain(17, { style: ['block_code'], align: 'center'})}`
            return message;    
        },

        accepted: (interaction, values) =>
        {
            const message = 
`${Text.set(`Accepted: ${values.accepted}`).constrain(17, { style: ['block_code'], align: 'center'})}`
            return message;    
        },

        completed: (interaction, values) =>
        {
            const message = 
`${Text.set(`Completed: ${values.completed}`).constrain(17, { style: ['block_code'], align: 'center'})}`
            return message;    
        },
    },

    moderator:
    {
        landing: (interaction) =>
        {
            const message = 
`${Text.set(`Colred Plays Account takeovers`).constrain(58, { style: ['block_code'], align: 'center'})}`
            return message;    
        },
        pending: (interaction, values) => 
        {
            let names = '';
        
            values.pending.forEach(id => {
                names += `<@${id}>\n`;
            });
        
            const message = 
`${Text.set(`Pending:`).constrain(17, { style: ['block_code'], align: 'center'})}\n${names}`
        
            return message;
        },

        accepted: (interaction, values) =>
        {
            let names = '';
        
            values.accepted.forEach(id => {
                names += `<@${id}>\n`;
            });
        
            const message = 
`${Text.set(`Accepted:`).constrain(17, { style: ['block_code'], align: 'center'})}\n${names}`
        
            return message;
        },

        completed: (interaction, values) =>
        {
            let names = '';
        
            values.completed.forEach(id => {
                names += `<@${id}>\n`;
            });
        
            const message = 
`${Text.set(`Completed:`).constrain(17, { style: ['block_code'], align: 'center'})}\n${names}`
        
            return message;
        },
    }


}


export { template }

