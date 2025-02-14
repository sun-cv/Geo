import { FileManager } from '../../utility/index.js';
import cron from 'node-cron'; 
import parser from 'cron-parser';

import { log, Text } from '../../utility/index.js'


class TaskManager
{
    constructor(client, registry)
    {
        this.client     = client;
        this.registry   = registry;

        this.queue      = []
        this.failed     = []

        this.running    = { task: false };

        this.argument =
        {
            client: this.client,
        }
    }

    async registerTasks()
    {
        let count = 0;
        for (const task of this.registry.task.values())
        {
            this.scheduleTask(task);
            count ++
        }
        log.admin(`Successfully loaded ${count}/${this.registry.task.size} tasks`)
    }

    async pushTask(taskName)
    {
        this.queueTask(this.registry.task.get(taskName));
        this.runTask();
    }


    async queueTask(task)
    {
        if (!task || !task.data || !task.data.schedule) 
        {
            log.error(`Invalid task provided: ${task?.meta?.id || "Unknown"}`);
            return;
        }

        const argument = task.data.argument.map(arg => this.argument[arg]);

        this.queue.push({task, argument, attempt: task.data.attempt});

        log.trace(`Pushed task "${task.meta.id}" into task queue. Place in queue: ${this.queue.length }`);
    }

    async scheduleTask(task)
    {

        cron.schedule(task.data.schedule, async () => 
        {
            this.queueTask(task);
            this.runTask();
        })
        
        log.debug(`Task "${Text.set(`${task.meta.id}`).constrain(11)}" scheduled. Next execution at: ${getNextExecutionTime(task.data.schedule)}`);
     }



    async runTask()
    {
        if (this.running.task || this.queue.length == 0)
        {
            return;
        }
        this.running.task = true;
        
        const { task, argument, attempt } = this.queue.shift();

        try 
        {
            await task.execute(...argument);
            log.admin(`Task "${task.meta.id}" executed. Next run at: ${getNextExecutionTime(task.data.schedule)}`);
        } 
        catch (error)
        {
            log.error(`Task "${task.meta.id}" failed: ${error.message}`);

            if (task.flag.reattempt && attempt > 0) 
            {
                log.debug(`Requeueing task "${task.meta.id}" (${attempt} attempts left).`);
                this.queue.push({ task, argument, attempt: attempt - 1 });
            } 
            else 
            {
                log.error(`Unable to queue task "${task.meta.id}" pushing to failed queue. ${task.flag.reattempt ? "No attempts left." : "Reattempts disabled."} Position in queue: ${this.failed.length}`);
                this.failed.push({ task, argument, attempt})
            }
        }
    
        this.running.task = false;

        if (this.queue.length > 0)
        {
            await this.runTask()
        }
    }


    async clearFailed()
    {
        this.failed = [];
    }


}

export { TaskManager }


function formatAMPM(date) {
    return date.toLocaleString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
    });
}

function getNextExecutionTime(schedule, timezone = 'America/New_York') 
{
        const interval = parser.parseExpression(schedule, { currentDate: new Date(), tz: timezone });
        return formatAMPM(interval.next().toDate());
}

