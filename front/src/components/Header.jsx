import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const MAIN_PURPLE = '#7C3AED';

export default function Header() {
  const [isLogin, setIsLogin] = useState(false);
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setIsLogin(!!token);
    if (user) {
      try {
        setNickname(JSON.parse(user).nickname);
      } catch {
        setNickname('');
      }
    } else {
      setNickname('');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLogin(false);
    setNickname('');
    navigate('/login');
  };

  return (
    <header style={{
      background: MAIN_PURPLE,
      color: 'white',
      padding: '0 32px',
      height: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 8px rgba(124,58,237,0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <span style={{ fontWeight: 700, fontSize: 22, letterSpacing: 1, cursor: 'pointer' }} onClick={() => navigate(isLogin ? '/posts' : '/login')}>
          Board Service
        </span>
        {isLogin && (
          <>
            <Link to="/posts" style={navStyle}>게시판</Link>
            <Link to="/posts/new" style={navStyle}>글쓰기</Link>
            <Link to="/profile" style={navStyle}>내 정보</Link>
          </>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {isLogin ? (
          <>
            <span style={{ fontWeight: 500, fontSize: 16 }}>{nickname && `안녕하세요, ${nickname}님!`}</span>
            <button onClick={handleLogout} style={btnStyle}>로그아웃</button>
          </>
        ) : (
          <>
            <button onClick={() => navigate('/login')} style={btnStyle}>로그인</button>
            <button onClick={() => navigate('/register')} style={btnStyle}>회원가입</button>
          </>
        )}
      </div>
    </header>
  );
}

const navStyle = {
  color: 'white',
  textDecoration: 'none',
  fontWeight: 500,
  fontSize: 16,
  padding: '6px 12px',
  borderRadius: 6,
  transition: 'background 0.2s',
  marginLeft: 4,
};

const btnStyle = {
  background: 'white',
  color: MAIN_PURPLE,
  border: 'none',
  borderRadius: 6,
  padding: '6px 16px',
  fontWeight: 600,
  fontSize: 15,
  cursor: 'pointer',
  boxShadow: '0 1px 4px rgba(124,58,237,0.08)',
  transition: 'background 0.2s, color 0.2s',
};
