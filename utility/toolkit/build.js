import { ActionRowBuilder, ButtonBuilder }    from '@discordjs/builders';
import { log }              from '../index.js'

class Build
{
    static button(data)
    {
        log.trace(`Creating ButtonBuilder button: ${data.meta.id}`)
        return new ButtonBuilder().setCustomId(data.meta.id).setLabel(data.button.label).setStyle(data.button.style);
    }

    static menu(data)
    {

    }

    static modal(data)
    {

    }

    static row(registry, data) {
        log.trace(`Creating RowBuilder row: ${data.meta.id}, button: ${data.flag.button}, menu: ${data.flag.menu}`);
    
        const getComponents = (ids, collection) => {
            return ids
                .map((id) => {
                    const component = collection.get(id);
                    if (!component) {
                        log.debug(`ID ${id} was not found in registry for row ${data.meta.id}.`);
                        return null;
                    }
                    return component.builder;
                })
                .filter(Boolean);
        };
    
        if (data.flag.button) {
            return new ActionRowBuilder().addComponents(...getComponents(data.button, registry.button));
        }

        if (data.flag.menu) {
            return new ActionRowBuilder().addComponents(...getComponents(data.menu, registry.menu));
        }
    }
    
    
}


export { Build }