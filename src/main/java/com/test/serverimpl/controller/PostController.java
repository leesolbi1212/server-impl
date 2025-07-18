package com.test.serverimpl.controller;

import com.test.serverimpl.domain.Post;
import com.test.serverimpl.service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    /**
     * 게시글 작성 (인증된 사용자)
     */
    @PostMapping
    public ResponseEntity<Post> write(@RequestBody Post post,
                                      Authentication authentication) {
        // JWT 필터에서 principal에 userId를 담아 놓았음
        Long userId = (Long) authentication.getPrincipal();
        post.setUserId(userId);
        Post saved = postService.write(post);
        return ResponseEntity.ok(saved);
    }

    /**
     * 게시글 목록 조회 (페이징)
     */
    @GetMapping
    public ResponseEntity<List<Post>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<Post> posts = postService.list(page, size);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/count")
    public ResponseEntity<Integer> countAll() {
        int count = postService.countAll();
        return ResponseEntity.ok(count);
    }

    /**
     * 게시글 상세 조회
     */
    @GetMapping("/{id}")
    public ResponseEntity<Post> detail(@PathVariable Long id) {
        return postService.detail(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * 게시글 수정 (작성자 본인)
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> edit(@PathVariable Long id,
                                  @RequestBody Post post,
                                  Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        post.setPostId(id);
        try {
            postService.edit(post, userId);
            return ResponseEntity.ok().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        }
    }

    /**
     * 게시글 삭제 (작성자 본인)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id,
                                    Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        try {
            postService.delete(id, userId);
            return ResponseEntity.ok().build();
        } catch (SecurityException e) {
            return ResponseEntity.status(403).build();
        }
    }
}
