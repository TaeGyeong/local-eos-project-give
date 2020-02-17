#include "givefunction.cpp"

void giveuser::login(name username) {
    require_auth(username);
    auto user_iterator = _users.find(username.value);
    if (user_iterator == _users.end()) {
        user_iterator = _users.emplace(username,  [&](auto& new_user) {
            new_user.username = username;
        });
    }
}

EOSIO_DISPATCH(giveuser, (login))