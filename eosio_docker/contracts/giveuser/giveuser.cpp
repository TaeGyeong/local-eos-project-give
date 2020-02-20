#include "givefunction.cpp"

void giveuser::login(name username) {
    require_auth(username);
    auto user_iterator = _users.find(username.value);
    check(user_iterator != _users.end(), "Login Fail");
    // if (user_iterator == _users.end()) {
    //     user_iterator = _users.emplace(username,  [&](auto& new_user) {
    //         new_user.username = username;
    //     });
    // }
}

void giveuser::registering(name username) {
    require_auth(username);
    auto user_iterator = _users.find(username.value);
    if (user_iterator == _users.end()) {
        user_iterator = _users.emplace(username,  [&](auto& new_user) {
            new_user.username = username;
        });
    }
}

void giveuser::give(name username, uint32_t amount) {
    require_auth(username);
    auto& user = _users.get(username.value, "User doesn't exist");

    _users.modify(user, username, [&](auto& u) {
        u.current_amount -= amount;
    });
}

EOSIO_DISPATCH(giveuser, (login)(registering)(give))