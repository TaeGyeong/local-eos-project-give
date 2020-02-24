
import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'

async function giveCurrency(from, to, amount) {
    const privateKey = "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3";
    const rpc = new JsonRpc(process.env.REACT_APP_EOS_HTTP_ENDPOINT);
    const signatureProvider = new JsSignatureProvider([privateKey]);
    const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
    // Main call to blockchain after setting action, account_name and data
    try {
        const resultWithConfig = await api.transact({
            actions: [{
                account: 'eosio.token',
                name: 'transfer',
                authorization: [{
                    actor: `${from}tok`,
                    permission: 'active',
                }],
                data: {
                    from: `${from}tok`,
                    to: `${to}tok`,
                    quantity: `${amount} SYS`,
                    memo: 'm'
                }
            }]
        }, {
            blocksBehind: 3,
            expireSeconds: 30,
        });
        return resultWithConfig;
    } catch (err) {
        throw (err)
    }
}


async function issueCurrency(username, amount) {
    const privateKey = "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3";
    const rpc = new JsonRpc(process.env.REACT_APP_EOS_HTTP_ENDPOINT);
    const signatureProvider = new JsSignatureProvider([privateKey]);
    const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
    // Main call to blockchain after setting action, account_name and data
    try {
        await api.transact({
            actions: [{
                account: 'eosio.token',
                name: 'issue',
                authorization: [{
                    actor: `manager`,
                    permission: 'active',
                }],
                data: {
                    to: `manager`,
                    quantity: `${amount} SYS`,
                    memo: 'm'
                }
            }]
        }, {
            blocksBehind: 3,
            expireSeconds: 30,
        });
        const resultWithConfig = await api.transact({
            actions: [{
                account: 'eosio.token',
                name: 'transfer',
                authorization: [{
                    actor: `manager`,
                    permission: 'active',
                }],
                data: {
                    from: `manager`,
                    to: `${username}tok`,
                    quantity: `${amount} SYS`,
                    memo: 'm'
                }
            }]
        }, {
            blocksBehind: 3,
            expireSeconds: 30,
        });
        return resultWithConfig
    } catch (err) {
        throw (err)
    }
}

async function register(dataValue) {
    const privateKey = "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3";
    const rpc = new JsonRpc(process.env.REACT_APP_EOS_HTTP_ENDPOINT);
    const signatureProvider = new JsSignatureProvider([privateKey]);
    const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
    
    // Main call to blockchain after setting action, account_name and data
    try {
        const resultWithConfig = await api.transact({
            actions: [{
                account: 'eosio',
                name: 'newaccount',
                authorization: [{
                    actor: 'eosio',
                    permission: 'active',
                }],
                data: {
                    creator: 'eosio',
                    name: dataValue.username,
                    owner: {
                        threshold: 1,
                        keys: [{
                            key: dataValue.publickey,
                            weight: 1
                        }],
                        accounts: [],
                        waits: []
                    },
                    active: {
                        threshold: 1,
                        keys: [{
                            key: dataValue.publickey,
                            weight: 1
                        }],
                        accounts: [],
                        waits: []
                    }
                }
            }]
        }, {
            blocksBehind: 3,
            expireSeconds: 30,
        });
        return resultWithConfig;
    } catch (err) {
        throw (err)
    }
}

// Main action call to blockchain
async function takeAction(action, dataValue, type) {
    const privateKey = localStorage.getItem("user_key");
    const rpc = new JsonRpc(process.env.REACT_APP_EOS_HTTP_ENDPOINT);
    const signatureProvider = new JsSignatureProvider([privateKey]);
    const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
    let contractname = '';
    if (type === 'give') contractname = process.env.REACT_APP_EOS_CONTRACT_NAME;
    else if (type === 'receive') contractname = process.env.REACT_APP_EOS_CONTRACT_NAME_RE;

    // Main call to blockchain after setting action, account_name and data
    try {
        const resultWithConfig = await api.transact({
            actions: [{
                account: contractname,
                name: action,
                authorization: [{
                    actor: localStorage.getItem("user_account"),
                    permission: 'active',
                }],
                data: dataValue,
            }]
        }, {
            blocksBehind: 3,
            expireSeconds: 30,
        });
        return resultWithConfig;
    } catch (err) {
        throw (err)
    }
}


class ApiService {
    static issueToken(username, amount) {
        return new Promise((resolve, reject) => {
            issueCurrency(username, amount)
                .then(() => {
                    resolve()
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
    static giveToken(from, to, amount) {
        return new Promise((resolve, reject) => {
            giveCurrency(from, to, amount)
                .then(() => {
                    resolve()
                })
                .catch(err => {
                    reject(err)
                })
        });
    }
    static getCurrency(username) {
        const rpc = new JsonRpc(process.env.REACT_APP_EOS_HTTP_ENDPOINT);
        return new Promise((resolve, reject) => {
            rpc.get_currency_balance('eosio.token', `${username}tok`, 'SYS')
                .then(balance => {
                    resolve(balance)  
                })
                .catch(err => {
                    reject(err)
                })
        });
    }
    
    static regist({username, publickey}) {
        return new Promise((resolve, reject) => {
            register({username, publickey})
                .then(() => {
                    register({username:`${username}tok`, publickey:'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV'})
                        .then(() => {
                            resolve()
                        })
                        .catch(err => {
                            reject(err)
                        })
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    static initialRegister({username, type, key}) {
        return new Promise((resolve, reject) => {
            localStorage.setItem("user_account", username);
            localStorage.setItem("user_key", key);
            takeAction("registering", { username: username }, type)
                .then(() => {
                    localStorage.removeItem("user_account", username);
                    localStorage.removeItem("user_key", key);
                    resolve();
                })
                .catch(err => {
                    localStorage.removeItem("user_account");
                    localStorage.removeItem("user_key");
                    reject(err);
                });
        });
    }
    static login({ username, key, type }) {
        return new Promise((resolve, reject) => {
            localStorage.setItem("user_account", username);
            localStorage.setItem("user_key", key);
            takeAction("login", { username: username }, type)
                .then(() => {
                    resolve();
                })
                .catch(err => {
                    localStorage.removeItem("user_account");
                    localStorage.removeItem("user_key");
                    reject(err);
                });
        });
    }

    static giveToReceive({ username, targetname, amount }) {
        return new Promise((resolve, reject) => {
            takeAction("give", {username:username, amount}, "give")
                .then(()=> {
                    takeAction("receive", {username:targetname, amount}, "receive")
                        .then(() => {
                            resolve()
                        })
                        .catch(err => {
                            reject(err)
                        })
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    static async getAllGiveUser() {
        try {
            const rpc = new JsonRpc(process.env.REACT_APP_EOS_HTTP_ENDPOINT);
            const result = await rpc.get_table_rows({
                json: true,
                code: process.env.REACT_APP_EOS_CONTRACT_NAME,      // contract who owns the table
                scope: process.env.REACT_APP_EOS_CONTRACT_NAME,     // scope of the table
                table: "give",         // name of the table as specified by the contract abi
                limit: 10,
            });
            return result.rows;
        } catch (err) {
            console.error(err);
        }
    }

    static async getAllReceiveUser() {
        try {
            const rpc = new JsonRpc(process.env.REACT_APP_EOS_HTTP_ENDPOINT);
            const result = await rpc.get_table_rows({
                json: true,
                code: process.env.REACT_APP_EOS_CONTRACT_NAME_RE,      // contract who owns the table
                scope: process.env.REACT_APP_EOS_CONTRACT_NAME_RE,     // scope of the table
                table: "receive",         // name of the table as specified by the contract abi
                limit: 10,
            });
            return result.rows;
        } catch (err) {
            console.error(err);
        }
    }

    static async getUserByName(username, table) {
        let contractname = ''
        if (table === 'give') contractname = process.env.REACT_APP_EOS_CONTRACT_NAME;
        else if (table === 'receive') contractname = process.env.REACT_APP_EOS_CONTRACT_NAME_RE;

        try {
            const rpc = new JsonRpc(process.env.REACT_APP_EOS_HTTP_ENDPOINT);
            const result = await rpc.get_table_rows({
                "json": true,
                "code": contractname,    // contract who owns the table
                "scope": contractname,   // scope of the table
                "table": table,    // name of the table as specified by the contract abi
                // "limit": 1,
                "lower_bound": username,
            });
            return result.rows[0];
        } catch (err) {
            console.error(err);
        }
    }

    static modifyTargetAmount(username, type, amount) {
        return new Promise((resolve, reject) => {
            takeAction("modifyamount", { username: username, target_amount: Number(amount) }, type)
                .then(() => {
                    resolve();
                })
                .catch(err => {
                    reject(err);
                });
        });
    }
}

export default ApiService