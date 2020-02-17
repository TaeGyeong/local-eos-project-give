#include <eosio/eosio.hpp>

using namespace std;
using namespace eosio;
class [[eosio::contract]] cardgame : public eosio::contract {
  private:
    struct [[eosio::table]] give_user {
      name        username;
      uint32_t   current_amount=1000000;

      auto primary_key() const { return username.value; }
    };

    typedef eosio::multi_index<name("users"), give_user> give_users_table;

    give_users_table _users;

  public:

    cardgame( name receiver, name code, datastream<const char*> ds ):contract(receiver, code, ds),
      _users(receiver, receiver.value) {}

    [[eosio::action]]
    void login(name username);
};
