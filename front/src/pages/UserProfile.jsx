import { useEffect, useState } from 'react';
import api from '../api/axios';

const MAIN_PURPLE = '#7C3AED';

export default function UserProfile() {
  const userId = localStorage.getItem('userId');
  const [form, setForm] = useState({ username: '', email: '', nickname: '' });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // 비밀번호 변경 관련 상태
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordCheck, setNewPasswordCheck] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/users/${userId}`);
        setForm({ username: res.data.username, email: res.data.email, nickname: res.data.nickname });
      } catch (err) {
        setError('회원정보를 불러오지 못했습니다.');
      }
      setLoading(false);
    }
    fetchProfile();
  }, [userId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    // 비밀번호 변경 시 검증
    if (editMode && (newPassword || newPasswordCheck)) {
      if (!newPassword || !newPasswordCheck) {
        setError('새 비밀번호와 확인을 모두 입력하세요.');
        return;
      }
      if (newPassword !== newPasswordCheck) {
        setError('새 비밀번호가 일치하지 않습니다.');
        return;
      }
    }
    if (!currentPassword) {
      setError('현재 비밀번호를 입력해야 합니다.');
      return;
    }
    try {
      const updateData = { ...form, currentPassword };
      if (newPassword) updateData.password = newPassword;
      await api.put(`/users/${userId}`, updateData);
      setSuccess('회원정보가 성공적으로 수정되었습니다.');
      setEditMode(false);
      setNewPassword('');
      setNewPasswordCheck('');
      setCurrentPassword('');
    } catch (err) {
      setError('회원정보 수정에 실패했습니다.');
    }
  };

  if (loading) return <div style={{textAlign:'center',marginTop:60, fontSize:22}}>로딩 중...</div>;

  return (
    <div style={{ maxWidth: 500, margin: '80px auto', padding: 48, background: 'white', borderRadius: 16, boxShadow: '0 4px 16px rgba(124,58,237,0.10)' }}>
      <h2 style={{ color: MAIN_PURPLE, fontWeight: 800, fontSize: 32, marginBottom: 36, textAlign: 'center' }}>내 정보</h2>
      {error && <div style={{ color: 'red', marginBottom: 18, textAlign: 'center' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: 18, textAlign: 'center' }}>{success}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontWeight: 700, color: MAIN_PURPLE, fontSize: 18 }}>아이디</label>
          <input name="username" value={form.username} disabled style={{ width: '100%', padding: 14, fontSize: 18, borderRadius: 8, border: '1.5px solid #ccc', marginTop: 10, background: '#f5f5f5', color: '#222' }} />
        </div>
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontWeight: 700, color: MAIN_PURPLE, fontSize: 18 }}>이메일</label>
          <input name="email" value={form.email} onChange={handleChange} disabled={!editMode} style={{ width: '100%', padding: 14, fontSize: 18, borderRadius: 8, border: '1.5px solid #ccc', marginTop: 10, background: editMode ? '#fff' : '#f5f5f5', color: '#222' }} />
        </div>
        <div style={{ marginBottom: 28 }}>
          <label style={{ fontWeight: 700, color: MAIN_PURPLE, fontSize: 18 }}>닉네임</label>
          <input name="nickname" value={form.nickname} onChange={handleChange} disabled={!editMode} style={{ width: '100%', padding: 14, fontSize: 18, borderRadius: 8, border: '1.5px solid #ccc', marginTop: 10, background: editMode ? '#fff' : '#f5f5f5', color: '#222' }} />
        </div>
        {editMode && (
          <>
            <div style={{ marginBottom: 28 }}>
              <label style={{ fontWeight: 700, color: MAIN_PURPLE, fontSize: 18 }}>새 비밀번호</label>
              <input type="password" name="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={{ width: '100%', padding: 14, fontSize: 18, borderRadius: 8, border: '1.5px solid #ccc', marginTop: 10, color: '#222' }} autoComplete="new-password" />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={{ fontWeight: 700, color: MAIN_PURPLE, fontSize: 18 }}>새 비밀번호 확인</label>
              <input type="password" name="newPasswordCheck" value={newPasswordCheck} onChange={e => setNewPasswordCheck(e.target.value)} style={{ width: '100%', padding: 14, fontSize: 18, borderRadius: 8, border: '1.5px solid #ccc', marginTop: 10, color: '#222' }} autoComplete="new-password" />
            </div>
          </>
        )}
        {editMode && (
          <div style={{ marginBottom: 28 }}>
            <label style={{ fontWeight: 700, color: MAIN_PURPLE, fontSize: 18 }}>현재 비밀번호 확인 <span style={{ color: 'red', fontSize: 15 }}>*</span></label>
            <input type="password" name="currentPassword" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} style={{ width: '100%', padding: 14, fontSize: 18, borderRadius: 8, border: '1.5px solid #ccc', marginTop: 10, color: '#222' }} autoComplete="current-password" />
          </div>
        )}
        <div style={{ display: 'flex', gap: 18, justifyContent: 'center', marginTop: 32 }}>
          {editMode ? (
            <>
              <button type="submit" style={btnStyle}>저장</button>
              <button type="button" onClick={() => { setEditMode(false); setError(''); setSuccess(''); setNewPassword(''); setNewPasswordCheck(''); setCurrentPassword(''); }} style={{...btnStyle, background:'#eee', color:'#555'}}>취소</button>
            </>
          ) : (
            <button type="button" onClick={() => setEditMode(true)} style={btnStyle}>수정</button>
          )}
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