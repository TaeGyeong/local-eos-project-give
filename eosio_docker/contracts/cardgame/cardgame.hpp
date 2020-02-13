#include <eosio/eosio.hpp>

using namespace std;
using namespace eosio;
class [[eosio::contract]] cardgame : public eosio::contract {
  private:
    struct [[eosio::table]] receive_user {
      name        username;
      uinit16_t   target_amount=1000;
      uinit16_t   current_amount=0;

      auto primary_key() const { return username.value; }
    };

    typedef eosio::multi_index<name("users"), receive_user> users_table;

    users_table _users;

  public:

    cardgame( name receiver, name code, datastream<const char*> ds ):contract(receiver, code, ds),
      _users(receiver, receiver.value) {}

    [[eosio::action]]
    void login(name username);
};
