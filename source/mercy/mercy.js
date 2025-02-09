import { Collection } from "discord.js";


class Mercy
{
    constructor(cluster)
    {
        this.database   = cluster.mercy;

        this.members    = new Collection();

    }
}


class Account 
{
    constructor(account, mercy, history)
    {
        this.id         = account.id;
        this.member     = account.member;
        this.name       = account.account;
        this.main       = account.main;
        this.data       = account.data;
        this.settings   = account.settings

        this.mercy      = mercy;

        this.history    = history;
    }
}