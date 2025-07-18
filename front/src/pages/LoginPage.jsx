// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { jwtDecode } from 'jwt-decode';

const MAIN_PURPLE = '#7C3AED';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]     = useState('');
  const navigate              = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      // 백엔드에 { username, password } 로 로그인 요청
      const res = await api.post('/users/login', { username, password });
      const { token } = res.data;
      localStorage.setItem('token', token); // 토큰 저장
      // 토큰에서 userId 추출 및 저장
      try {
        const payload = jwtDecode(token);
        console.log('JWT payload:', payload); // payload 구조 확인
        if (payload && payload.userId) {
          localStorage.setItem('userId', payload.userId);
        }
      } catch {}
      navigate('/posts'); // 로그인 후 /posts 로 이동
    } catch (err) {
      // 백엔드 에러 메시지 활용
      const msg = err.response?.data?.error || '로그인 실패';
      setError(msg);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '80px auto', padding: 48, background: 'white', borderRadius: 16, boxShadow: '0 4px 16px rgba(124,58,237,0.10)' }}>
      <h1 style={{ color: MAIN_PURPLE, fontWeight: 800, fontSize: 34, marginBottom: 36, textAlign: 'center' }}>로그인</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontWeight: 700, color: MAIN_PURPLE, fontSize: 18 }}>아이디</label><br />
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: 14, fontSize: 18, borderRadius: 8, border: '1.5px solid #ccc', marginTop: 10 }}
          />
        </div>
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontWeight: 700, color: MAIN_PURPLE, fontSize: 18 }}>비밀번호</label><br />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: 14, fontSize: 18, borderRadius: 8, border: '1.5px solid #ccc', marginTop: 10 }}
          />
        </div>
        {error && (
          <div style={{ color: 'red', marginBottom: 24, textAlign: 'center', fontSize: 16 }}>
            {error}
          </div>
        )}
        <button type="submit" style={{ width: '100%', padding: '16px 0', background: MAIN_PURPLE, color: 'white', border: 'none', borderRadius: 8, fontWeight: 800, fontSize: 20, marginTop: 12, cursor: 'pointer', boxShadow: '0 2px 8px rgba(124,58,237,0.10)' }}>
          로그인
        </button>
      </form>
      <p style={{ marginTop: 32, textAlign: 'center', fontSize: 17 }}>
        아직 계정이 없나요?{' '}
        <span
          onClick={() => navigate('/register')}
          style={{ color: MAIN_PURPLE, cursor: 'pointer', fontWeight: 700 }}
        >
          회원가입
        </span>
      </p>
    </div>
  );
}
