
import { Api, JsonRpc } from 'eosjs';
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'

// Main action call to blockchain
async function takeAction(action, dataValue) {
    const privateKey = localStorage.getItem("user_key");
    const rpc = new JsonRpc(process.env.REACT_APP_EOS_HTTP_ENDPOINT);
    const signatureProvider = new JsSignatureProvider([privateKey]);
    const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });

    // Main call to blockchain after setting action, account_name and data
    try {
        const resultWithConfig = await api.transact({
            actions: [{
                account: process.env.REACT_APP_EOS_CONTRACT_NAME,
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
        console.log(resultWithConfig)
        return resultWithConfig;
    } catch (err) {
        throw (err)
    }
}
class ApiService {
    static login({ username, key }) {
        return new Promise((resolve, reject) => {
            localStorage.setItem("user_account", username);
            localStorage.setItem("user_key", key);
            takeAction("login", { username: username })
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

    static async getUserByName(username, table) {
        try {
            const rpc = new JsonRpc(process.env.REACT_APP_EOS_HTTP_ENDPOINT);
            const result = await rpc.get_table_rows({
                "json": true,
                "code": process.env.REACT_APP_EOS_CONTRACT_NAME,    // contract who owns the table
                "scope": process.env.REACT_APP_EOS_CONTRACT_NAME,   // scope of the table
                "table": table,    // name of the table as specified by the contract abi
                "limit": 1,
                "lower_bound": username,
            });
            return result.rows[0];
        } catch (err) {
            console.error(err);
        }
    }
}

export default ApiService