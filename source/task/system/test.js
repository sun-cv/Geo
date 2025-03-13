import { log, Schema } from '../../../utility/index.js'

async function test(interaction)
{   

    

};


const data = Schema.task
({
    meta: 
    {
        id:             'Test task',
        category:       'test',
        description:    "Test task.",
    },

    data:
    {
        schedule:       ` 0 30 * * * *`,
        argument:       ['client'],
        attempt:        3
    },

    execute: test,
})


export default data;