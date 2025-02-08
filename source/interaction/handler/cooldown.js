import { Collection, MessageFlags } from 'discord.js';
import { log, Text } from '../../../utility/index.js';

class CooldownHandler 
{
    constructor() 
    {
        this.cooldowns = new Collection();
    }

    async handle(interaction) 
    {
        const { member, data: { meta: { id }, flag = {} } } = interaction;

        if (!flag.cooldown || flag.handled)
        {
            return;
        }

        this.initializeUserCooldowns(interaction);

        const messages = [];
        const now = Date.now();
        const cooldowns = await this.getCooldowns(interaction);

        for (const { name, time: seconds } of cooldowns) 
        {
            const key       = this.getCooldownKey(name, id, member.id);
            const timestamps= this.cooldowns.get(member.id);
            const timeout   = seconds * 1000;
            const expiration= timestamps.get(key) + timeout;
            const timeLeft  = (expiration - now) / 1000;

            if (now < expiration) 
            {
                messages.push(this.formatCooldownMessage(name, seconds, timeLeft));
                this.logCooldown(interaction, name, timeLeft);
                flag.handled = true;
            } 
            else 
            {
                timestamps.set(key, now);
                setTimeout(() => timestamps.delete(key), timeout);
            }
        }

        if (flag.handled) 
        {
            await this.sendCooldownMessage(interaction, messages);
        }
    }

    async getCooldowns(interaction) 
    {
        const { cooldown }  = interaction.data.permission;
        const options       = interaction.options._hoistedOptions.map(opt => opt.name);

        return [interaction.data.meta.type, ...options]
            .filter(name => cooldown.hasOwnProperty(name))
            .map(name => ({ name, time: cooldown[name] }));
    }

    initializeUserCooldowns(interaction) 
    {
        if (!this.cooldowns.has(interaction.member.id)) 
        {
            this.cooldowns.set(interaction.member.id, new Collection());
        }
    }

    getCooldownKey(name, commandId, userId) 
    {
        return `${name}-${commandId}-${userId}`;
    }

    formatCooldownMessage(name, seconds, timeLeft) 
    {
        const minutes       = seconds / 60;
        const label         = name === "command" ? "This (/)" : "The";
        const description   = name === "command" ? "has a" : "option has a";
        const cooldownTime  = minutes < 1 ? `${seconds} second cooldown` : `${minutes.toFixed(0)} minute cooldown`;
        const remainingTime = Text.set(timeLeft.toFixed(0)).constrain(3);

        return `${label} ${name} ${description} ${cooldownTime}. Remaining time: ${remainingTime} seconds\n`;
    }

    logCooldown(interaction, name, timeLeft) 
    {
        log.push( interaction, `${interaction.member.user.username} was cooled down: ${Text.set(name).constrain(7)} in ${interaction.channel.name} channel. Remaining time: ${Text.set(timeLeft.toFixed(0)).constrain(3)} seconds`);
    }

    async sendCooldownMessage(interaction, messages) 
    {
        await interaction.editReply({ content: Text.set(messages), flags: MessageFlags.Ephemeral });
    }
}

export { CooldownHandler };
