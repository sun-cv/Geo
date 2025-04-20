import { createCanvas } from '@napi-rs/canvas'
import { Background }   from './background.js';
import { Overlay }      from './overlay.js';
import { log }          from '../../../../../utility/index.js';

class Image
{
    constructor(account)
    {
        this.account            = account;

        this.canvas             = this.getCanvas();
        this.context            = this.getContext();
        this.session            = this.getSession();

        this.background         = new Background(this.session, this.account);
        this.overlay            = new Overlay   (this.session, this.account);

    }

    getCanvas()
    {
        log.trace(`Generated Mercy image canvas`);
        return createCanvas(1920, 1080);
    }

    getContext()
    {
        log.trace(`Generated Mercy image context`);
        return this.canvas.getContext('2d')
    }

    getSession()
    {
        return { canvas: this.canvas, context: this.context }
    }

    async generate()
    {

        await this.background.loadImage()
        await this.overlay   .loadTemplate();

        await this.draw();
    }

    async draw()
    {
        await this.background.draw();
        await this.overlay   .draw();

        log.debug(`Successfully generated Mercy image for ${this.account.member.username}`)
    }


}

export { Image }