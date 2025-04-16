import fs       from 'fs';
import path     from 'path';
import { log, Schema }  from '../../../../utility/index.js';

const projectRoot = path.resolve('C:/coding/project/Geo');

function updateTemplateList() 
{
    const templateDir   = path.join(projectRoot, 'assets', 'template', 'mercy');
    const outputPath    = path.join(projectRoot, 'source', 'data', 'mercy', 'template.json');

    const files = fs.readdirSync(templateDir).filter(file => /\.(png|jpg|jpeg)$/i.test(file));

    const template = {};

    for (const file of files) 
    {
        
        const name      = path.parse(file).name;

        log.trace(`Updating template record: ${name}`)

        template[name]  = 
        {
            path: path.join(templateDir, file).replace(/\\/g, '/'),
            relative: `./assets/template/mercy/${file}`
        };
    }

    const finalData = { template };

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



export default data;
