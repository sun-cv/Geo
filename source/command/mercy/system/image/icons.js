import { loadImage }    from "@napi-rs/canvas";
import { MercyUtil }    from "../../../../../utility/index.js";
import { Style }        from "./style.js";

class Icons
{
    constructor(session, account, columns, coordinates)
    {
        this.session        = session
        this.canvas         = session.canvas
        this.context        = session.context

        this.account        = account;
        this.columns        = columns;
        this.coordinates    = coordinates;

        this.style = new Style({ session });
    }

    async draw() 
    {
        const { width, height, padding, spacing } = this.style.icons.iconBox;
        const iconX     = this.coordinates.startX - width - padding;
        let currentY    = this.coordinates.startY + this.columns[0].header.height + this.columns[0].header.spacing;
    
        const prism = this.account.settings.template.display.prism.get();
    
        for (const [shard, rarity] of MercyUtil.shardEntries(prism)) 
        {
            this.style.drawGlassEffectBlur(iconX, currentY, width, height, 12, 10);
    
            if (shard === 'primal') 
            {
                const lineColor = this.style.icons.shard[rarity];
                if (lineColor) 
                {
                    const { radius, lineWidth, clipWidthRatio } = this.style.icons.shard.primal;
                    const right     = iconX + width;
                    const clipWidth = width * clipWidthRatio;
    
                    this.context.save();
                    this.context.beginPath();
                    this.context.rect(right - clipWidth, currentY, clipWidth, height);
                    this.context.clip();
    
                    this.context.beginPath();
                    this.context.roundRect(iconX, currentY, width, height, radius);
                    this.context.strokeStyle = lineColor;
                    this.context.lineWidth   = lineWidth;
                    this.context.lineCap     = 'round';
                    this.context.stroke();
                    this.context.restore();
                }
            }
    
            const iconImage = await loadImage(`assets/icons/${shard}.png`);
            const { padding: imagePadding } = this.style.icons.image;
            const maxW      = width  - imagePadding * 2;
            const maxH      = height - imagePadding * 2;
            const scale     = Math.min(maxW / iconImage.width, maxH / iconImage.height);
            const drawW     = iconImage.width  * scale;
            const drawH     = iconImage.height * scale;
            const drawX     = iconX + (width - drawW) / 2;
            const drawY     = currentY + (height - drawH) / 2;
    
            this.context.drawImage(iconImage, drawX, drawY, drawW, drawH);
    
            currentY += height + spacing;
        }
    }
}


export { Icons }