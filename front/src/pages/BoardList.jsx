// src/pages/BoardList.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const MAIN_PURPLE = '#7C3AED';

export default function BoardList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const size = 10;

  useEffect(() => {
    async function fetchList() {
      setLoading(true);
      const res = await api.get(`/posts?page=${page}&size=${size}`);
      // 닉네임이 없는 경우 user_id로 추가 조회
      const postsWithNick = await Promise.all(res.data.map(async p => {
        if (p.nickname) return p;
        if (p.userId != null && p.userId !== '' && p.userId !== 0 && p.userId !== 'undefined') {
          try {
            const userRes = await api.get(`/users/${p.userId}`);
            return { ...p, nickname: userRes.data.nickname };
          } catch {
            return { ...p, nickname: '알 수 없음' };
          }
        } else {
          return { ...p, nickname: '알 수 없음' };
        }
      }));
      setPosts(postsWithNick);
      // 전체 게시글 수 가져오기
      try {
        const countRes = await api.get('/posts/count');
        setTotal(countRes.data);
      } catch {
        setTotal(0);
      }
      setLoading(false);
    }
    fetchList();
  }, [page]);

  const totalPages = Math.ceil(total / size);

  if (loading) return <div style={{textAlign:'center',marginTop:60, fontSize:22}}>로딩 중...</div>;

  return (
    <div style={{ maxWidth: 1100, margin: '60px auto', padding: '0 32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
        <h2 style={{ color: MAIN_PURPLE, fontWeight: 800, fontSize: 36, margin: 0, letterSpacing: 1 }}>게시판</h2>
        <Link to="/posts/new" style={writeBtnStyle}>글쓰기</Link>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        {posts.map(p => (
          <Link to={`/posts/${p.postId}`} key={p.postId || Math.random()} style={cardStyle}>
            <div style={{ fontWeight: 700, fontSize: 26, color: MAIN_PURPLE, marginBottom: 10 }}>{p.title}</div>
            <div style={{ color: '#555', fontSize: 18, marginBottom: 4 }}>{p.nickname || '알 수 없음'}</div>
            <div style={{ color: '#aaa', fontSize: 15 }}>{formatDate(p.createdAt)}</div>
          </Link>
        ))}
      </div>
      {/* 페이징 UI */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 40 }}>
        <button onClick={() => setPage(page-1)} disabled={page===1} style={pageBtnStyle}>이전</button>
        <span style={{ fontSize: 18, fontWeight: 700 }}>{page} / {totalPages || 1}</span>
        <button onClick={() => setPage(page+1)} disabled={page===totalPages || totalPages===0} style={pageBtnStyle}>다음</button>
      </div>
    </div>
  );
}

const writeBtnStyle = {
  background: '#7C3AED',
  color: 'white',
  border: 'none',
  borderRadius: 8,
  padding: '12px 36px',
  fontWeight: 700,
  fontSize: 20,
  textDecoration: 'none',
  boxShadow: '0 2px 8px rgba(124,58,237,0.10)',
  cursor: 'pointer',
};

const cardStyle = {
  background: 'white',
  border: '1.5px solid #e5e5e5',
  borderRadius: 14,
  padding: '32px 40px',
  boxShadow: '0 4px 16px rgba(124,58,237,0.06)',
  textDecoration: 'none',
  marginBottom: 0,
  transition: 'box-shadow 0.2s',
  display: 'block',
};

const pageBtnStyle = {
  background: '#fff',
  color: MAIN_PURPLE,
  border: '1.5px solid #7C3AED',
  borderRadius: 8,
  padding: '8px 24px',
  fontWeight: 700,
  fontSize: 18,
  cursor: 'pointer',
  minWidth: 80,
  transition: 'background 0.2s, color 0.2s',
  boxShadow: '0 1px 4px rgba(124,58,237,0.06)',
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }) +
    ' ' + d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
}
