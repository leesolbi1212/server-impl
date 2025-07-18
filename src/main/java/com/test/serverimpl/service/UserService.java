package com.test.serverimpl.service;

import java.util.Optional;
import com.test.serverimpl.domain.User;

public interface UserService {
    void register(User user);
    Optional<User> login(String username, String rawPassword);
    Optional<User> findById(Long userId);
    void update(User user);
    Optional<User> findByUsername(String username);
};
