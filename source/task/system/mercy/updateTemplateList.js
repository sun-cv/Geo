import fs       from 'fs';
import path     from 'path';
import envdirectory from '../../../../env/directory/path.json' with { type: 'json' }
import { log, Schema }  from '../../../../utility/index.js';

const root = path.resolve(envdirectory.root);

function updateTemplateList() 
{
    const directory     = path.join(root, 'assets', 'template', 'mercy');
    const outputPath    = path.join(root, 'source', 'data', 'mercy', 'template.json');

    const files = fs.readdirSync(directory).filter(file => /\.(png|jpg|jpeg)$/i.test(file));

    const template = {};

    for (const file of files) 
    {
        
        const name      = path.parse(file).name;

        log.trace(`Updating template record: ${name}`)

        template[name]  = 
        {
            path: path.join(directory, file).replace(/\\/g, '/'),
            relative: `./assets/template/mercy/${file}`
        };
    }

    const finalData = { template, directory };

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(finalData, null, 4));

    log.admin(`Updated template list written to ${outputPath}`);
}


const data = Schema.task
({
    meta: 
    {
        id:             'Update mercy templates',
        category:       'mercy',
        description:    "Updates the available mercy templates from sourced assets.",
    },

    data:
    {
        schedule:       `0 15 0 * * 3,7`,
        attempt:        3
    },
    execute: updateTemplateList,
});

updateTemplateList()

export default data;
