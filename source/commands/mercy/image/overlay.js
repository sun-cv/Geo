import { Style }    from './style.js';
import { Column }   from './column.js';
import { Icons }    from './icons.js';


class Overlay
{
    constructor(session, account) 
    {
        this.session        = session
        this.canvas         = session.canvas
        this.context        = session.context

        this.account        = account;
        this.columns        = [];
        
        this.width          = null;
        this.height         = null;

        this.coordinates    = 
        {
            startX:         null,
            startY:         null,
        };

        this.style          = new Style({ session });
        this.icons          = new Icons(this.session, this.account, this.columns, this.coordinates)
    }
    
    
    async draw()
    {
        // await this.drawBaseLayer();
        await this.drawColumns();
        await this.icons.draw();
    }

    async loadTemplate()
    {
        for (const [header, bool] of Object.entries(this.account.settings.template.display.all()))
        {
            if(bool && header != 'prism')
            {
                    this.columns.push(new Column(this.session, this.account, header));
            }
        }
        
        this.width  = this.columns.reduce((value, column) => value + column.width + column.spacing, (this.columns[0].spacing * -1));
        this.height = this.columns[0].height;

        this.coordinates.startX = (this.canvas.width  - this.width)  / 2;
        this.coordinates.startY = (this.canvas.height - this.height) / 2;
    }


    drawBaseLayer()
    {
        this.style.drawGlassEffect(this.coordinates.startX, this.coordinates.startY, this.width, (this.height ), 12, 1);
    }

    drawColumns()
    {
        let x = this.coordinates.startX;

        for (const column of this.columns)
        {
            column.draw(x, this.coordinates.startY)
            x += column.width + column.spacing
        }
    }
    
}

export { Overlay }
