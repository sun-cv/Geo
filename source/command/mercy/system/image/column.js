import { MercyUtil, Text, Timestamp }      from "../../../../../utility/index.js";
import { Style }                from "./style.js";


class Column
{
    constructor(session, account, header)
    {
        this.session    = session
        this.canvas     = session.canvas
        this.context    = session.context

        this.account    = account;
        this.style      = new Style({ session, header });
    
        this.layout     = this.style.column;
    
        this.header     = this.layout.header;
        this.row        = this.layout.row;
    
        this.width      = this.layout.width;
        this.spacing    = this.layout.spacing;
    
        this.height     = this.header.height + (this.row.count * (this.row.height + this.row.spacing));
        
        this.rows       = [];
        this.output     = null;
    }
    
    
    draw(x, y)
    {
        this.drawHeader(x, y);
        this.drawRows(x, y);
    }

    drawHeader(x, y)
    {
        this.context.save()

        this.style.set("header.overlay")
        this.context.fillRect(x, y, this.width, this.header.height);


        this.style.set("header.text");
        const headerTextX = x + this.width / 2;
        const headerTextY = y + this.header.height / 2;
        this.context.fillText(this.header.title.toUpperCase(), headerTextX, headerTextY);

        this.context.restore()
    }


    drawRows(x, y)
    {
        let currentY = y + this.header.height + this.header.spacing;
    
        MercyUtil.forEachShard((shard, rarity) => 
        {
            this.context.save();
    
            this.style.drawGlassEffectBlur(x, currentY, this.width, this.row.height, 12, 10)

            this.style.set("row.overlay");
            this.context.fillRect(x, currentY, this.width, this.row.height);
    
            const rowTextX = x + this.width - this.row.paddingRight;
            const rowTextY = currentY + this.row.height / 2;
   
            const value = (this.header.title != 'session') ? this.account.mercy[shard]?.[rarity]?.[this.header.title] ?? ' ' : Timestamp.shortSession(this.account.mercy[shard]?.[rarity]?.[this.header.title])

            this.style.set("row.text");
            this.context.fillText(`${Text.set(`${value}`).constrain(17, { align: 'right' })}`, rowTextX, rowTextY);
    
            currentY += this.row.height + this.row.spacing;
    
            this.context.restore();
        }, { prism: this.account.settings.template.display.prism.get() });
    }
}

export { Column }