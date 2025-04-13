import { text } from "stream/consumers";
import { MercyUtil } from "../../../../../utility/index.js";
import { Style } from "./style.js";
import { count } from "console";
import { loadImage } from "@napi-rs/canvas";


class Overlay
{
    constructor(canvas, account) 
    {
        this.canvas         = canvas;
        this.account        = account;
        this.columns        = [];
        
        this.width          = null;
        this.height         = null;

        this.coordinates    = 
        {
            startX:         null,
            startY:         null,
        };

        this.iconBox        = 
        {   
            width:          70,
            height:         70,
            spacing:        25,
            padding:        15
        };  

        this.style          = new Style();
    }
    
    
    async draw(context)
    {

        console.log(this.account.mercy)

        await this.drawBaseLayer(context);
        await this.drawColumns(context);
        await this.drawIcons(context);
    }

    loadTemplate()
    {
        for (const [header, bool] of Object.entries(this.account.settings.template.display.all()))
        {
            if(bool)
            {
                    this.columns.push(new Column(this.account, header));
            }
        }
        this.width  = this.columns.reduce((value, column) => value + column.width + column.spacing, (this.columns[0].spacing * -1));
        this.height = this.columns[0].height;

        this.coordinates.startX = (this.canvas.width  - this.width)  / 2;
        this.coordinates.startY = (this.canvas.height - this.height) / 2;
    }


    drawBaseLayer(context)
    {
        this.style.drawGlassEffect(context, this.coordinates.startX, this.coordinates.startY, this.width, this.height);
    }

    drawColumns(context)
    {
        let x = this.coordinates.startX;

        for (const column of this.columns)
        {
            column.draw(context, x, this.coordinates.startY)
            x += column.width + column.spacing
        }
    }

    async drawIcons(context) 
    {
        const iconX     = this.coordinates.startX - this.iconBox.width - this.iconBox.padding;
        let currentY    = this.coordinates.startY + this.columns[0].header.height + this.columns[0].header.spacing;
    
        for (const [shard, rarity] of MercyUtil.shardEntries()) 
        {
            const { width, height, spacing } = this.iconBox;
    
            this.style.drawGlassEffect(context, iconX, currentY, width, height);
    
            if (shard === 'primal') {
                const lineColor = rarity === 'legendary' ? 'rgba(243, 134, 38, 1)' 
                               : rarity === 'mythical'  ? 'rgba(255, 68, 43, 1)' 
                               : null;
            
                if (lineColor) {
                    const { width, height } = this.iconBox;
                    const radius = 12;
                    const right = iconX + width;
                    const clipWidth = width * 0.15;
            
                    context.save();
            
                    context.beginPath();
                    context.rect(right - clipWidth, currentY, clipWidth, height);
                    context.clip();
            
                    context.beginPath();
                    context.roundRect(iconX, currentY, width, height, radius);
                    context.strokeStyle = lineColor;
                    context.lineWidth   = 5;
                    context.lineCap     = 'round';
                    context.stroke();
            
                    context.restore();
                }
            }
            
            
            
            
    
            const iconImage = await loadImage(`assets/icons/${shard}.png`);
            
            const padding   = 5;
            const maxW  = width - padding * 2;
            const maxH  = height - padding * 2;
    
            const scale = Math.min(maxW / iconImage.width, maxH / iconImage.height);
            const drawW = iconImage.width * scale;
            const drawH = iconImage.height * scale;
    
            const drawX = iconX + (width - drawW) / 2;
            const drawY = currentY + (height - drawH) / 2;
    
            context.drawImage(iconImage, drawX, drawY, drawW, drawH);
    
            currentY += height + spacing;
        }
    }
    
    

}



class Column
{
    constructor(account ,header)
    {
        this.account    = account;
        this.style      = new Style;

        this.header     =
        {
            title:      header,
            height:     70,
            spacing:    5,
        }

        this.row        =
        {
            count:      6,
            height:     70,
            spacing:    25
        }

        this.width      = 235;
        this.height     = this.header.height + (this.row.count * (this.row.height + this.row.spacing))
        this.spacing    = 5

        this.rows       = [];

        this.output     = null;

    }
    
    draw(context, x, y)
    {
        this.drawHeader(context, x, y);
        this.drawRows(context, x, y);
    }

    drawHeader(context, x, y)
    {
        this.style.set(context, "header.overlay")
        context.fillRect(x, y, this.width, this.header.height);


        this.style.set(context, "header.text");
        const headerTextX = x + this.width / 2;
        const headerTextY = y + this.header.height / 2;
        context.fillText(this.header.title.toUpperCase(), headerTextX, headerTextY);
    }


    drawRows(context, x, y)
    {

        let currentY = y + this.header.height + this.header.spacing;

        MercyUtil.forEachShard((shard, rarity)=>
        {
            this.style.set(context, "row.overlay");
            context.fillRect(x, currentY, this.width, this.row.height);
            
            this.style.set(context, "row.text");
            const rowTextX = x + this.width - 10;
            const rowTextY = currentY + this.row.height / 2;

            this.output = this.account.mercy[shard][rarity][this.header.title] != null? this.account.mercy[shard][rarity][this.header.title] : ' '

            context.fillText(`${this.output}`, rowTextX, rowTextY);
    
            currentY += this.row.height + this.row.spacing;
        })
    }



}

export { Overlay }
