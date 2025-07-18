import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/axios';

const MAIN_PURPLE = '#7C3AED';

export default function PostForm({ edit }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);

  // 수정 모드인 경우 기존 데이터 불러오기
  useEffect(() => {
    if (edit && id) {
      setLoading(true);
      api.get(`/posts/${id}`)
        .then(res => setForm({ title: res.data.title, content: res.data.content }))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [edit, id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      if (edit && id) {
        await api.put(`/posts/${id}`, form);
      } else {
        await api.post('/posts', form);
      }
      navigate('/posts');
    } catch (err) {
      console.error(err);
      alert('게시글 작성/수정에 실패했습니다.');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 700, margin: '60px auto', background: 'white', borderRadius: 16, boxShadow: '0 4px 16px rgba(124,58,237,0.08)', padding: '48px 60px' }}>
      <h2 style={{ color: MAIN_PURPLE, fontWeight: 800, fontSize: 32, marginBottom: 36 }}>{edit ? '게시글 수정' : '새 게시글 작성'}</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontWeight: 700, fontSize: 18, color: MAIN_PURPLE }}>제목</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '16px 18px', fontSize: 20, borderRadius: 8, border: '1.5px solid #ccc', marginTop: 10 }}
            disabled={loading}
          />
        </div>
        <div style={{ marginBottom: 36 }}>
          <label style={{ fontWeight: 700, fontSize: 18, color: MAIN_PURPLE }}>내용</label>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            required
            rows={10}
            style={{ width: '100%', padding: '16px 18px', fontSize: 18, borderRadius: 8, border: '1.5px solid #ccc', marginTop: 10, resize: 'vertical' }}
            disabled={loading}
          />
        </div>
        <div style={{ display: 'flex', gap: 18 }}>
          <button type="submit" style={btnStyle} disabled={loading}>{edit ? '수정' : '작성'}</button>
          <Link to="/posts" style={{...btnStyle, background:'#eee', color:'#555', textDecoration:'none'}}>취소</Link>
        </div>
      </form>
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
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(124,58,237,0.10)',
};