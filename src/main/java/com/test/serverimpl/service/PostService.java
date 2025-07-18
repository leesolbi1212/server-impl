package com.test.serverimpl.service;

import com.test.serverimpl.domain.Post;
import java.util.List;
import java.util.Optional;

public interface PostService {
    Post write(Post post);
    List<Post> list(int page, int size);
    Optional<Post> detail(Long postId);
    void edit(Post post, Long loginUserId);
    void delete(Long postId, Long loginUserId);
    int countAll();

}
