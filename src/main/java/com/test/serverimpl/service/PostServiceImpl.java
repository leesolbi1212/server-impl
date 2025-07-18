package com.test.serverimpl.service;
import org.springframework.stereotype.Service;

import com.test.serverimpl.domain.Post;
import com.test.serverimpl.mapper.PostMapper;
import com.test.serverimpl.service.PostService;
import java.util.List;
import java.util.Optional;

@Service
public class PostServiceImpl implements PostService {

    private final PostMapper postMapper;

    public PostServiceImpl(PostMapper postMapper) {
        this.postMapper = postMapper;
    }

    @Override
    public Post write(Post post) {
        postMapper.insert(post);
        return post;
    }

    @Override
    public List<Post> list(int page, int size) {
        int offset = (page - 1) * size;
        return postMapper.findAll(offset, size);
    }

    @Override
    public Optional<Post> detail(Long postId) {
        return postMapper.findById(postId);
    }

    @Override
    public void edit(Post post, Long loginUserId) {
        Post existing = postMapper.findById(post.getPostId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 글입니다."));
        if (!existing.getUserId().equals(loginUserId)) {
            throw new SecurityException("본인만 수정할 수 있습니다.");
        }
        postMapper.update(post);
    }

    @Override
    public void delete(Long postId, Long loginUserId) {
        Post existing = postMapper.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 글입니다."));
        if (!existing.getUserId().equals(loginUserId)) {
            throw new SecurityException("본인만 삭제할 수 있습니다.");
        }
        postMapper.delete(postId);
    }

    @Override
    public int countAll() {
        return postMapper.countAll();
    }
}