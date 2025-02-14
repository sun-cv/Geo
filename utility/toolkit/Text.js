class Text {
    constructor(content = "") 
    {
        this.content = String(content);
    }

    static set(content) 
    {
        return new Text(content);
    }

    new(text) 
    {
        this.content = String(text);
        return this;
    }

    style(...styles) 
    {
        const formatMap = {
            bold: "**", italic: "*", underline: "__",
            strikethrough: "~~", spoiler: "||",
            block_code: "```", code: "`",
            block_quote: ">>> ", quote: "> "
        };

        styles.forEach(style => 
        {
            if (style === "block_code") 
            {
                this.content = `\`\`\`\n${this.content}\n\`\`\``;
            } 
            else if (formatMap[style])
            {
                this.content = `${formatMap[style]}${this.content}${formatMap[style]}`;
            }
        });

        return this;
    }

    truncate(maxLength, suffix = "..") 
    {
        if (this.content.length > maxLength) 
        {
            this.content = this.content.slice(0, maxLength - suffix.length) + suffix;
        }
        return this;
    }

    pad(length, char = " ", align = "left") 
    {
        const padding = Math.max(length - this.content.length, 0);
        const leftPad = align === "center" ? Math.floor(padding / 2) : (align === "right" ? padding : 0);
        this.content = char.repeat(leftPad) + this.content + char.repeat(padding - leftPad);
        return this;
    }

    constrain(width, { truncateIndicator = "..", paddingChar = " ", align = "left", style = [] } = {}) 
    {
        if (this.content.length > width) 
        {
            this.truncate(width, truncateIndicator);
        } 
        else
        {
            this.pad(width, paddingChar, align);
        }

        return style.length ? this.style(...style) : this;
    }

    center(width, char = " ") 
    {
        return this.pad(width, char, "center");
    }

    toString() 
    {
        return this.content;
    }

    capitalize(string)
    {
        this.content = this.content.charAt(0).toUpperCase() + this.content.slice(1);
        return this;
    }


    formatList(arr) {
        if (arr.length === 0) {
            this.content = "";
        } else if (arr.length === 1) {
            this.content = arr[0];
        } else {
            this.content = arr.slice(0, -1).join(', ') + ' and ' + arr.at(-1);
        }
        return this;
    }

}

export { Text };
