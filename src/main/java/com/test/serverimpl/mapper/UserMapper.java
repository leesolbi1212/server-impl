package com.test.serverimpl.mapper;

import com.test.serverimpl.domain.User;
import org.apache.ibatis.annotations.Mapper;
import java.util.Optional;

@Mapper
public interface UserMapper {
    void insert(User user);                       // 회원가입
    Optional<User> findByUsername(String username); // 로그인/조회
    void update(User user);                       // 회원정보 수정
    Optional<User> findById(Long userId);

}