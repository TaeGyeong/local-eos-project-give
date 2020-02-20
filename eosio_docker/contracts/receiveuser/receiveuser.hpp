#include <eosio/eosio.hpp>

using namespace std;
using namespace eosio;
class [[eosio::contract]] receiveuser : public eosio::contract {
  private:
    struct [[eosio::table]] receive_user {
      name        username;
      uint32_t    target_amount = 2000000;
      uint32_t    current_amount = 0;

      auto primary_key() const { return username.value; }
    };

    typedef eosio::multi_index<name("receive"), receive_user> receive_users_table;

    receive_users_table _users;

  public:
    receiveuser( name receiver, name code, datastream<const char*> ds ):contract(receiver, code, ds),
      _users(receiver, receiver.value) {}

    [[eosio::action]]
    void login(name username);

    [[eosio::action]]
    void registering(name username);

    [[eosio::action]]
    void modifyamount(name username, uint32_t target_amount);

    [[eosio::action]]
    void receive(name username, uint32_t amount);
};
