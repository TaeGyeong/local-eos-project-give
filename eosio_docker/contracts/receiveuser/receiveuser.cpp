#include "receiveuser.hpp"
#include <eosio/system.hpp>

void receiveuser::login(name username) {
    require_auth(username);
    auto user_iterator = _users.find(username.value);
    check(user_iterator != _users.end(), "Login Fail");
}

void receiveuser::registering(name username) {
    require_auth(username);
    auto user_iterator = _users.find(username.value);
    if (user_iterator == _users.end()) {
        user_iterator = _users.emplace(username,  [&](auto& new_user) {
            new_user.username = username;
        });
    }
}

void receiveuser::modifyamount(name username, uint32_t target_amount) {
    require_auth(username);
    check(target_amount > 0, "cannot edit this value");
    auto& user = _users.get(username.value, "User doesn't exist");

    _users.modify(user, username, [&](auto& u) {
        u.target_amount = target_amount;
    });
}


void receiveuser::receive(name username, uint32_t amount) {
    // require_auth(username);
    auto& user = _users.get(username.value, "User doesn't exist");

    _users.modify(user, username, [&](auto& u) {
        u.current_amount += amount;
    });
}
EOSIO_DISPATCH(receiveuser, (login)(modifyamount)(registering)(receive))