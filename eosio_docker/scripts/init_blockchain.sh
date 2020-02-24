#!/usr/bin/env bash
set -o errexit

echo "=== setup blockchain accounts and smart contract ==="

# set PATH
PATH="$PATH:/opt/eosio/bin:/opt/eosio/bin/scripts"

set -m

# start nodeos ( local node of blockchain )
# run it in a background job such that docker run could continue
nodeos -e -p eosio -d /mnt/dev/data \
  --config-dir /mnt/dev/config \
  --http-validate-host=false \
  --plugin eosio::producer_plugin \
  --plugin eosio::history_plugin \
  --plugin eosio::chain_api_plugin \
  --plugin eosio::history_api_plugin \
  --plugin eosio::http_plugin \
  --http-server-address=0.0.0.0:8888 \
  --access-control-allow-origin=* \
  --contracts-console \
  --verbose-http-errors &
sleep 1s
until curl localhost:8888/v1/chain/get_info
do
  sleep 1s
done

# Sleep for 2 to allow time 4 blocks to be created so we have blocks to reference when sending transactions
sleep 2s
echo "=== setup wallet: eosiomain ==="
# First key import is for eosio system account
# EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV = eosio public key
cleos wallet create -n eosiomain --to-console | tail -1 | sed -e 's/^"//' -e 's/"$//' > eosiomain_wallet_password.txt
cleos wallet import -n eosiomain --private-key 5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3 

echo "=== setup wallet: givewal ==="
# key for eosio account and export the generated password to a file for unlocking wallet later
cleos wallet create -n givewal --to-console | tail -1 | sed -e 's/^"//' -e 's/"$//' > cardgame_wallet_password.txt
# Owner key for givewal wallet
cleos wallet import -n givewal --private-key 5JpWT4ehouB2FF9aCfdfnZ5AwbQbTtHBAwebRXt94FmjyhXwL4K
# Active key for givewal wallet
cleos wallet import -n givewal --private-key 5JD9AGTuTeD5BXZwGQ5AtwBqHK21aHmYnTetHgk1B3pjj7krT8N

cleos create account eosio giveacc EOS6PUh9rs7eddJNzqgqDx1QrspSHLRxLMcRdwHZZRL4tpbtvia5B EOS8BCgapgYA2L4LJfCzekzeSr3rzgSTUXRXwNi8bNRoz31D14en9

deploy_contract.sh giveuser giveacc givewal $(cat cardgame_wallet_password.txt)


###############################################################################################
echo "=== setup wallet: receivewal ==="
cleos wallet create -n receivewal --to-console | tail -1 | sed -e 's/^"//' -e 's/"$//' > receive_wallet_password.txt
# Owner key for givewal wallet
cleos wallet import -n receivewal --private-key 5KfCDwGt5SP1ZEy5DiX3kJXyURsgho6KVF53Y35vKgDZRq1LZFC
# Active key for givewal wallet
cleos wallet import -n receivewal --private-key 5KbozgWeHwab7MsVM8MgT6Bk3R5eBiGEFmy9s4C7pkNcPWyQFkY
# create account for cardgameacc with above wallet's public keys
cleos create account eosio receiveacc EOS5PrXCN2L4wQbRoCVFMEbfAwbzStDVB8Z5TrjPqEnx5pbMKmiYt EOS5svmj2BX8o6yQkUHbGze9vJVoLDpndPoGfb5k9we5F9bisMADZ
echo "=== create user accounts ==="
# script for create data into blockchain
# create_accounts.sh
deploy_contract.sh receiveuser receiveacc receivewal $(cat receive_wallet_password.txt)

###############################################################################################
create_accounts.sh accounts.json
create_accounts.sh accounts2.json
###############################################################################################
###############################################################################################
#   issuer 인 maanger 가 give1 에게 'SYS' 심볼의 토큰 1000.0000 만큼 ISSUE.
echo "=== setup wallet: eosio.token ==="
cleos create account eosio eosio.token EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
deploy_contract.sh eosio.token eosio.token eosio.token $(cat eosio_token_password.txt)

echo "=== create manager account ==="
# create account using eosio.token key
cleos create account eosio manager EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
cleos create account eosio give1tok EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
cleos create account eosio receive1tok EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV
cleos create account eosio receive2tok EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV

echo "=== token create ==="
cleos push action eosio.token create '{"issuer":"manager", "maximum_supply":"1000000000.0000 SYS"}' -p eosio.token@active
echo "=== token issue ==="
cleos push action eosio.token issue '["manager", "1000.0000 SYS", "m"]' -p manager@active
echo "=== token transfer : manager -> give1 ==="
cleos push action eosio.token transfer '["manager", "give1tok", "100.0000 SYS", "m"]' -p manager@active

##############################################################################################################################################################################################
# test
cleos push action eosio.token transfer '["manager", "receive1tok", "100.0000 SYS", "m"]' -p manager@active
cleos push action eosio.token transfer '["give1tok", "receive1tok", "50.0000 SYS", "m"]' -p give1tok@active
##############################################################################################################################################################################################
echo "=== end of setup blockchain accounts and smart contract ==="
# create a file to indicate the blockchain has been initialized
touch "/mnt/dev/data/initialized"

# put the background nodeos job to foreground for docker run
fg %1
