import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const MAIN_PURPLE = '#7C3AED';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', password: '', email: '', nickname: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/users/register', form);
      navigate('/login'); // 회원가입 후 로그인 페이지로
    } catch (err) {
      setError('회원가입에 실패했습니다.');
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '80px auto', padding: 48, background: 'white', borderRadius: 16, boxShadow: '0 4px 16px rgba(124,58,237,0.10)' }}>
      <h2 style={{ color: MAIN_PURPLE, fontWeight: 800, fontSize: 34, marginBottom: 36, textAlign: 'center' }}>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontWeight: 700, color: MAIN_PURPLE, fontSize: 18 }}>아이디</label>
          <input name="username" value={form.username} onChange={handleChange} required style={{ width: '100%', padding: 14, fontSize: 18, borderRadius: 8, border: '1.5px solid #ccc', marginTop: 10 }} />
        </div>
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontWeight: 700, color: MAIN_PURPLE, fontSize: 18 }}>비밀번호</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required style={{ width: '100%', padding: 14, fontSize: 18, borderRadius: 8, border: '1.5px solid #ccc', marginTop: 10 }} />
        </div>
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontWeight: 700, color: MAIN_PURPLE, fontSize: 18 }}>이메일</label>
          <input name="email" value={form.email} onChange={handleChange} required style={{ width: '100%', padding: 14, fontSize: 18, borderRadius: 8, border: '1.5px solid #ccc', marginTop: 10 }} />
        </div>
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontWeight: 700, color: MAIN_PURPLE, fontSize: 18 }}>닉네임</label>
          <input name="nickname" value={form.nickname} onChange={handleChange} required style={{ width: '100%', padding: 14, fontSize: 18, borderRadius: 8, border: '1.5px solid #ccc', marginTop: 10 }} />
        </div>
        {error && <p style={{ color: 'red', marginBottom: 24, textAlign: 'center', fontSize: 16 }}>{error}</p>}
        <button type="submit" style={{ width: '100%', padding: '16px 0', background: MAIN_PURPLE, color: 'white', border: 'none', borderRadius: 8, fontWeight: 800, fontSize: 20, marginTop: 12, cursor: 'pointer', boxShadow: '0 2px 8px rgba(124,58,237,0.10)' }}>
          가입하기
        </button>
      </form>
      <p style={{ marginTop: 32, textAlign: 'center', fontSize: 17 }}>
        이미 계정이 있나요?{' '}
        <span onClick={() => navigate('/login')} style={{ color: MAIN_PURPLE, cursor: 'pointer', fontWeight: 700 }}>
          로그인
        </span>
      </p>
    </div>
  );
}
