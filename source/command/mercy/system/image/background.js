
import { loadImage }    from '@napi-rs/canvas'
import source           from '../../../../data/mercy/template.json' with { type: 'json' };
import { log }          from '../../../../../utility/index.js';

class Background
{
    constructor(session, account)
    {
        this.session    = session
        this.canvas     = session.canvas
        this.context    = session.context

        this.account    = account;
        this.selection  = account.data.template.selection;
        this.option     = account.settings.template.options;
        
        this.source     = null;
        this.image      = null;

        this.width      = null;
        this.height     = null;
    }
    
    async loadImage()
    {
        if (this.option.static.get())
        {
            await this.handleStatic(this.account)
        };
        if (this.option.rotate.get())
        {
            await this.handleRotate(this.account)
        }
        if (this.option.random.get())
        {
            await this.handleRandom(this.account)
        }
        if (this.option.custom.get())
        {
            await this.handleCustom(this.account)
        }
    }

    async handleStatic()
    {
        const selection = this.selection.static[0];
        this.source     = source.template[selection]

        log.trace(`Mercy static image selection: ${selection}`)

        await this.loadBackground()
    }

    async handleRotate()
    {
        const selection = this.selection.rotate.shift();
        this.source     = source.template[selection]

        log.trace(`Mercy rotate image selection: ${selection}`)

        this.selection.rotate.push(selection);
        this.account.update();
        
        await this.loadBackground()
    }

    async handleRandom()
    {

        const options   = Object.keys(source.template);
        const selection = options[Math.floor(Math.random() * options.length)];
        this.source     = source.template[selection]

        log.trace(`Mercy random image selection: ${selection}`);

        await this.loadBackground()
    }

    async handleCustom()
    {
        const selection = this.selection.custom[Math.floor(Math.random() * this.selection.custom.length)]
        this.source     = source.template[selection]

        log.trace(`Mercy custom image selection: ${selection}`);

        await this.loadBackground()
    }

    async loadBackground()
    {
        log.trace(`Loading image source: ${this.source.relative}`)

        this.image  = await loadImage(this.source.relative)
        
        this.width  = this.image.width;
        this.height = this.image.height;
    }

    async draw()
    {
        await this.context.drawImage(this.image, 0, 0, this.width, this.height)
        
    }
}

export { Background }