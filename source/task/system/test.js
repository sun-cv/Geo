import { log } from '../../../utility/index.js'

async function test(interaction)
{   

    

};

const task = 
{
    meta: 
    {
        id:             "test",
        type:           "task",
        description:    "Test task.",
    },

    data:
    {
        schedule: `10 0 * * * *`,
        argument: ['client'],
        attempt: 3
    },

    flag:
    {
        reattempt: true,
    },

    execute: test,

};


export default task