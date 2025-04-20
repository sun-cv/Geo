import { Cluster }      from "../database/cluster/cluster.js"
import { Account }      from "../source/command/mercy/system/account.js";
import { Parser } from "../utility/index.js";
import db               from './database.cjs';

const cluster = new Cluster;



async function migrate() 
{
    const accountRows = await db.all("SELECT * FROM mercy_tracker_accounts");


    for (const accountData of accountRows)
    {

        const registered = new Date(accountData.registered).toISOString();

        if (!cluster.mercy.hasMember({id: accountData.id}))
        {
            cluster.mercy.createMemberTransfer({id: accountData.id, user: { username: accountData.member }}, registered)
        }
        const accountid = cluster.mercy.createAccountTransfer({id: accountData.id, user: { username: accountData.member }}, accountData.name, accountData.main, registered)
    
        const mercyRows = await db.all("SELECT * FROM mercy_tracker_data WHERE id = ? AND name = ?", [accountData.id, accountData.name])

        const mercy = Parser.accountMercyTransfer(mercyRows)
        
        const account = new Account(null, { id: accountid, member: { id: accountData.id, username: accountData.member}, name: accountData.name, main: Number(accountData.main) }, mercy, )
        
        cluster.mercy.updateAccount(account);
        cluster.mercy.updateAccountMercyTransfer(account);
        // cluster.mercy.updateAccountSession(account);
    }

}

migrate();