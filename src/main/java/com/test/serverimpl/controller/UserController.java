package com.test.serverimpl.controller;

import com.test.serverimpl.domain.User;
import com.test.serverimpl.security.JwtTokenProvider;
import com.test.serverimpl.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    @Autowired
    public UserController(UserService userService,
                          AuthenticationManager authenticationManager,
                          JwtTokenProvider jwtTokenProvider) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    // 1) 회원가입
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        userService.register(user);
        return ResponseEntity.ok().build();
    }

    // 2) 로그인 → JWT 토큰 발급
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User dto) {
        try {
            // 인증 시도
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(dto.getUsername(), dto.getPassword())
            );

            // 인증 성공 시 토큰 생성
            User u = userService.findByUsername(dto.getUsername())
                    .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));
            String token = jwtTokenProvider.createToken(u.getUserId(), u.getUsername());

            return ResponseEntity.ok(Map.of("token", token));
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "아이디 또는 비밀번호가 올바르지 않습니다."));
        }
    }

    // 3) 내 정보 조회 (본인만)
    @GetMapping("/{id}")
    public ResponseEntity<User> profile(@PathVariable Long id,
                                        Authentication authentication) {
        Long principalId = (Long) authentication.getPrincipal();
        if (!principalId.equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 4) 내 정보 수정 (본인만)
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id,
                                    @RequestBody User user,
                                    Authentication authentication) {
        Long principalId = (Long) authentication.getPrincipal();
        if (!principalId.equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        user.setUserId(id);
        userService.update(user);
        return ResponseEntity.ok().build();
    }
}
