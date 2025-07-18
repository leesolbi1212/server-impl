// src/pages/BoardDetail.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const MAIN_PURPLE = '#7C3AED';

export default function BoardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nickname, setNickname] = useState('');
  const [isMine, setIsMine] = useState(false);

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      try {
        const res = await api.get(`/posts/${id}`);
        setPost(res.data);
        // 닉네임이 없으면 user_id로 추가 조회
        if (res.data.nickname) {
          setNickname(res.data.nickname);
        } else if (res.data.userId) {
          try {
            const userRes = await api.get(`/users/${res.data.userId}`);
            setNickname(userRes.data.nickname);
          } catch {
            setNickname('알 수 없음');
          }
        } else {
          setNickname('알 수 없음');
        }
        // 본인 글인지 확인 (userId는 문자열로 저장됨)
        const myId = localStorage.getItem('userId');
        setIsMine(myId && String(res.data.userId) === String(myId));
      } catch (err) {
        setError('존재하지 않는 게시글입니다.');
      }
      setLoading(false);
    }
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await api.delete(`/posts/${id}`);
      alert('삭제되었습니다.');
      navigate('/posts');
    } catch (err) {
      alert('삭제 권한이 없거나 오류가 발생했습니다.');
    }
  };

  if (loading) return <div style={{textAlign:'center',marginTop:40}}>로딩 중...</div>;
  if (error) return <div style={{color:'red',textAlign:'center',marginTop:40}}>{error}</div>;
  if (!post) return null;

  return (
    <div style={{ maxWidth: 900, margin: '60px auto', background: 'white', borderRadius: 16, boxShadow: '0 4px 16px rgba(124,58,237,0.08)', padding: '48px 60px' }}>
      <div style={{ color: MAIN_PURPLE, fontWeight: 800, fontSize: 34, marginBottom: 18 }}>{post.title}</div>
      <div style={{ color: '#555', fontSize: 20, marginBottom: 6 }}>{nickname}</div>
      <div style={{ color: '#aaa', fontSize: 16, marginBottom: 28 }}>{formatDate(post.createdAt)}</div>
      <div style={{ fontSize: 22, marginBottom: 48, whiteSpace: 'pre-line', lineHeight: 1.7, color: '#222' }}>{post.content || '내용이 없습니다.'}</div>
      <div style={{ display: 'flex', gap: 18 }}>
        <Link to="/posts" style={btnStyle}>목록</Link>
        {isMine && (
          <>
            <Link to={`/posts/${post.postId}/edit`} style={btnStyle}>수정</Link>
            <button onClick={handleDelete} style={{...btnStyle, background:'#eee', color:'#d00'}}>삭제</button>
          </>
        )}
      </div>
    </div>
  );
}

const btnStyle = {
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
  marginRight: 4,
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }) +
    ' ' + d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
}
