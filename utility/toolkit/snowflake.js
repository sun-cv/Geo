import { Snowflake }    from '@sapphire/snowflake';
import config           from '../../configuration/secret/credentials.json' with { type: 'json' };


const snowflake = new Snowflake(config.snowflake);

class SnowflakeGenerator 
{
    static generate() 
    {
        return snowflake.generate().toString();
    }
}

export { SnowflakeGenerator as Snowflake };
