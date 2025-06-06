import fs                                       from 'node:fs';
import path                                     from 'node:path';
import directory                                from '#env/directory/path.json' with { type: 'json'}
import { EmbedManager, log, Schema, Timestamp } from '#utils/index.js';
import { template }                             from '#resources/templates/template-promocode.js';


class Promocode
{
    constructor(client, registry)
    {
        this.client     = client;
        this.registry   = registry;

        this.filePath   = path.join(directory.root, 'source', 'resources', 'data', 'promocodes.json');
        this.attachment = path.join(directory.shared, 'assets', 'template', 'banner', 'promocodes-banner.png')

        this.channel    = null;
        this.announce   = null;
        this.role       = null;
        this.banner     = null;
        this.message    = null;

        this.threshold  = 5;

        this.codes      = {};
        this.limited    = [];
        this.player     = [];

        this.data       = {};

        this.setClientContext(client)
    }

    async setClientContext(client)
    {
        client.promocode = this;
        log.admin(`Successfully initialized Promocodes`);
    }

    async registerChannel()
    {
        this.channel        = this.registry.channels.get('promo-codes');
        this.announce       = this.registry.channels.get('colredplays-announcements');

        this.role           = this.registry.roles.get('Promo Codes');

        const messages      = await this.channel.messages.fetch({ limit: 10 });
        const messageArray  = [...messages.values()].reverse();

        this.banner         = messageArray[0];
        this.message        = messageArray[1];

        if (!this.banner)
        {
            log.debug(`Sending promocode banner to promo-codes (not found)`)
            await this.channel.send({ files: [{ attachment: this.attachment, name: path.basename(this.attachment) }] });
        }

        if (!this.message)
        {
            log.debug(`Sending promocode landing to promo-codes (not found)`)
            await this.channel.send(EmbedManager.set({client: this.client}).load('embed-promo-landing').create())
        }
    }

    load()
    {
        this.clear()

        log.debug(`Loading promocodes`)

        const data = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));

        for (const [code, value] of Object.entries(data)) 
        {
            log.trace(`Loading promocode: ${code}`)
            this.codes[code] = Schema.promocode(value);
            this[value.meta.type].push(this.codes[code])
        }
    }

    clear()
    {
        log.trace(`Clearing promocodes`)
        this.limited    = [];
        this.player     = [];
        this.data       = {};
    }

    create(input)
    {
        this.load();

        const { code, type, ...data } = input

        this.codes[code.toLowerCase()] = Schema.promocode(
        {
            meta: 
            {
                id:             code.toLowerCase(),
                type:           type,
                timestamp:      Timestamp.iso()
            },

            data: { code: code.toUpperCase(), ...data },

            condition:
            {
                scopes: [...Object.keys(data)],
            },
        });

        this.data = 
        {
            formattedCode: this.formatCode(this.codes[code.toLowerCase()])
        } 
        this.post()
        this.save();
    }
        
    save()
    {
        log.debug(`Saving promocodes`)
        fs.writeFileSync(this.filePath, JSON.stringify(this.codes, null, 4), 'utf8');
        this.refresh()
    }

    refresh()
    {
        log.trace(`Refreshing promocode landing`)
        this.load();
        this.message.edit(EmbedManager.set({client: this.client}).load('embed-promo-landing').create())
    }

    validateExists(code)
    {
        this.load();
        log.trace(`Validating code exists (${!!this.codes[code]})`)
        return !!this.codes[code];
    }

    validateCode(code)
    {
        this.load();
        log.trace(`Confirming code is valid (${this.codes[code].flag.valid.get()})`)
        return this.codes[code].flag.valid.get();
    }

    validateInput(input)
    {
        const dataFields            = Object.keys(Schema.promocode().data)

        const hasRequiredFields     = input.code && input.type;
        const hasAtLeastOneReward   = dataFields.some(field => field in input);

        return hasRequiredFields && hasAtLeastOneReward;
    }

    post()
    {   
        this.announce.send(EmbedManager.set({client: this.client }).load('embed-promo-announcement').create());
    }

    report(codename, member)
    {
        this.load();
    
        const code = this.codes[codename];

        if (code.status.reportUser.some(user => user.id == member.id))
        {
            log.trace(`Reporting code: ${codename} declined (1 report per user)(count: ${code.status.reportCount} - by: ${member.username})`)
            return;
        }

        code.flag.reported.set();

        code.status.reportCount ++;
        code.status.reportUser.push({username: member.username, id: member.id, timestamp: Timestamp.iso()})

        log.trace(`Reporting code: ${codename} (count: ${code.status.reportCount} - by: ${member.username})`);

        this.takedown(code)
        this.save()
    }

    takedown(code)
    {
        if (code.status.reportCount < this.threshold)
        {
            log.trace(`Taken threshold not reached (count ${code.status.reportCount}) for code: ${code.meta.id}`)
            return;
        }

        code.flag.valid.clear()
        log.event(`Takedown threshold reached for code: ${code.meta.id}`)
    }

    formatCode(code)
    {
        const statusIcon = getStatusIndicator(code);
        const codeName   = `**${code.data.code}**`;

        const items = fields
            .filter(field => code.condition.scopes.includes(field.key))
            .map(field => 
            {
                const value = code.data[field.key];
                if (!value)
                {
                    return null;
                }

                if (field.prefix) 
                {
                    return field.join 
                    ? 
                    `${field.join}${field.prefix}${field.join}${value}`
                    :
                    `${field.prefix} ${value}`;
                }

                return field.label 
                    ?
                    field.join 
                        ?
                        `${value}${field.join}${field.label}`
                        :
                        `${value} ${field.label}`
                    : `${value}`;
            })
            .filter(Boolean);

        return `> \`${statusIcon}\` ${codeName} - ${items.join(', ')}`;
    }



}

const fields = [
    { key: 'champion',        label: '',                prefix: ' Receive' },
    { key: 'silver',          label: 'Silver',                             },
    { key: 'experience_brew', label: 'Brews',                              },
    { key: 'energy_refill',   label: 'Energy Refills',                     },
    { key: 'multi_battle',    label: 'Multi-Battles',                      },
    { key: 'experience_day',  label: 'Days XP Boost',                      },
    { key: 'potion',          label: 'Potions',                            },
    { key: 'chicken',         label: 'Chickens',        join: '* ',        },
    { key: 'book',            label: 'Skill Tomes',                        },
    { key: 'shard',           label: 'Shards',                             },
    { key: 'artifact',        label: 'Artifacts',                          },
    { key: 'energy_flat',     label: 'Energy',                             },
    { key: 'refill_arena',    label: 'Arena Refills',                      },
    { key: 'not_listed',      label: '',                                   },
];


function getStatusIndicator(code)
{
    const count = code.status.reportCount;
    if (count >= 4) return '🔴';
    if (count >= 1) return '🟠';
    return '🟢';
}

export { Promocode }