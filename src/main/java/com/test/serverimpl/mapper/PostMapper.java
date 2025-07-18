package com.test.serverimpl.mapper;

import com.test.serverimpl.domain.Post;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;
import java.util.Optional;

@Mapper
public interface PostMapper {
    void insert(Post post);                         // 게시글 작성
    List<Post> findAll(int offset, int limit);      // 목록 조회 (페이징)
    Optional<Post> findById(Long postId);           // 상세 조회
    void update(Post post);                         // 수정
    void delete(Long postId);                       // 삭제
    int countAll();                                 // 전체 개수 (페이징 계산용)
}
