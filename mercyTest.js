import { writeFile }    from "fs/promises";
import { Image }        from "./source/command/mercy/system/image/image.js";
import { Account } from "./source/command/mercy/system/account.js";
import { Cluster } from "./database/cluster/cluster.js";



const cluster   = new Cluster;
const database  = cluster.mercy;

const profile   = database.loadAccountProfile({id: '271841393725407242'}, 'Main');
const data      = database.loadAccountData   ({id: '271841393725407242'}, 'Main');
const session   = database.loadAccountSession({id: '271841393725407242'}, 'Main');



const account = new Account(null, profile, data, session)



const image = new Image(account);

await image.generate();

await writeFile('mercy-test.png', image.canvas.toBuffer('image/png'));
