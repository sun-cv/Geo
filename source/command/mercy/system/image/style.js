import StackBlur  from 'stackblur-canvas'


class Style
{
    
    constructor({ session, header } = {})
    {
        
        this.session    = session
        this.canvas     = session.canvas
        this.context    = session.context
        
        this.column =
        {
            width:              235,
            spacing:            5,
            header:
            {
                title:          header,
                height:         70,
                spacing:        5      
            },
            row:
            {
                count:          6,
                height:         70,
                spacing:        25,
                paddingRight:   10
            }
        }
        
        this.icons              =
        {
            iconBox: 
            {
                width:              70,
                height:             70,
                spacing:            25,
                padding:            15
            },
            
            shard: 
            {
                primal: 
                {
                    lineWidth:      5,
                    clipWidthRatio: 0.15,
                    radius:         12,
                },
                legendary:          'rgba(243, 134, 38, 1)',
                mythical:           'rgba(255, 68, 43, 1)' ,
            },
            
            image: 
            {
                padding:        5
            },
        }

        this.header             =
        {
            overlay:
            {
                fillStyle:      'rgba(15, 15, 15, 0.3)'
            },
            text:
            {
                shadowColor:    'rgba(0, 0, 0, 0.8)',
                shadowBlur:     3,                   
                shadowOffsetX:  3,                 
                shadowOffsetY:  1,    
                textAlign:      'center',         
                textBaseline:   'middle',
                fillStyle:      'rgb(255, 255, 255)',
                font:           'bold 27px impact',
            },
        }

        this.row                =
        {
            overlay:
            {
                fillStyle:      'rgba(255, 255, 255, 0.3)'
            },
            text: 
            {
                shadowColor:    'rgba(0, 0, 0, 0.8)',
                shadowBlur:     3,                   
                shadowOffsetX:  3,                 
                shadowOffsetY:  1,    
                textAlign:      'right',         
                textBaseline:   'middle',     
                fillStyle:      'rgb(255, 255, 255)',
                font:           'bold 30px impact'
            }
        }


    }

    set(entry)
    {
        const [element, type] = entry.split('.')
        for (const [key, value] of Object.entries(this[element][type]))
        {
            this.context[key] = value;
        }
    }
    

    drawGlassEffectBlur(x, y, width, height, borderRadius = 12, blurRadius = 8) 
    {
        const imageData = this.context.getImageData(x, y, width, height);

        StackBlur.imageDataRGBA(imageData, 0, 0, width, height, blurRadius);

        this.context.putImageData(imageData, x, y);

        // 4. Glassy overlay
        this.context.save();
        this.context.beginPath();
        this.context.roundRect(x, y, width, height, borderRadius);
        this.context.clip();

        const gradient = this.context.createLinearGradient(x, y, x, y + height);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0.05)');

        this.context.fillStyle = gradient;
        this.context.fillRect(x, y, width, height);

        this.context.restore();
    }

    drawGlassEffect(x, y, width, height, borderRadius = 12) 
    {
        this.context.save();
    
        this.context.beginPath();
        this.context.roundRect(x, y, width, height, borderRadius);
        this.context.clip();
    
        const gradient = this.context.createLinearGradient(x, y, x, y + height);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
    
        this.context.fillStyle = gradient;
        this.context.fillRect(x, y, width, height);
    
        this.context.restore();
    }
    
    
    

}

export { Style }