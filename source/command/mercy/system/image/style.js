

class Style
{

    constructor()
    {

        this.glass              =
        {

        }

        this.header             =
        {
            
            overlay:
            {
                fillStyle:      'rgba(0, 0, 0, 0.31)'
            },
            text:
            {
                textAlign:      'center',         
                textBaseline:   'middle',
                fillStyle:      'white',
                font:           'bold 20px sans-serif',
            },
        }

        this.row                =
        {
            overlay:
            {
                fillStyle:      'rgba(255, 255, 255, 0.2)'
            },
            text: {
                textAlign:      'right',         
                textBaseline:   'middle',     
                fillStyle:      'white',
                font:           'bold 25px impact'
            }
        }


        this.lineWidth          = null
        this.strokeStyle        = null
        this.fillStyle          = null
    }

    set(context, entry)
    {
        const [element, type] = entry.split('.')
        for (const [key, value] of Object.entries(this[element][type]))
        {
            context[key] = value;
        }
    }
    
    drawGlassEffect(context, x, y, width, height, borderRadius = 12) {
        context.save();
    
        context.beginPath();
        context.roundRect(x, y, width, height, borderRadius);
        context.clip();
    
        const gradient = context.createLinearGradient(x, y, x, y + height);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.10)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.02)');
    
        context.fillStyle = gradient;
        context.fillRect(x, y, width, height);
    
        context.restore();
    }
    
    
    

}

export { Style }