package com.test.serverimpl.service;

import com.test.serverimpl.domain.User;
import com.test.serverimpl.mapper.UserMapper;
import com.test.serverimpl.service.UserService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserServiceImpl(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Override
    public void register(User user) {
        // 비밀번호 해시
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userMapper.insert(user);
    }

    @Override
    public Optional<User> login(String username, String rawPassword) {
        return userMapper.findByUsername(username)
                .filter(u -> passwordEncoder.matches(rawPassword, u.getPassword()));
    }

    @Override
    public Optional<User> findById(Long userId) {
        // MyBatis 인터페이스에 ID 조회 메서드 없으면 findByUsername 활용하거나 새로 정의
        return userMapper.findById(userId);
    }

    @Override
    public void update(User user) {
        // 비밀번호 변경 시 해시 처리 필요
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userMapper.update(user);
    }
    @Override
    public Optional<User> findByUsername(String username) {
        return userMapper.findByUsername(username);
    }
}

