import { createCanvas}  from '@napi-rs/canvas'
import { Background }   from './background.js';
import { Overlay } from './overlay.js';

class Image
{
    constructor(account)
    {
        this.account            = account;

        this.canvas             = createCanvas(1920, 1080);
        this.context            = this.canvas.getContext('2d');

        this.background         = new Background(this.canvas, account);
        this.overlay            = new Overlay(this.canvas, account);

    }

    async generate()
    {

        await this.background.loadImage()
        await this.overlay   .loadTemplate();

        await this.draw();
    }



    async draw()
    {
        await this.background.draw(this.context);
        await this.overlay.draw(this.context)
    }


}

export { Image }