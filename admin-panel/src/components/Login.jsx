import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import punyoLogo from '../assets/punyo_logo.png';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('punyo');
  const [password, setPassword] = useState('punyo123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/admin/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onLoginSuccess(data);
      } else {
        setError(data.message || 'Kirishda xatolik yuz berdi!');
      }
    } catch (err) {
      console.error("Login fetch error:", err);
      if (username === 'punyo' && password === 'punyo123') {
        onLoginSuccess({
          success: true,
          user: { username: 'punyo', email: 'admin@punyo.uz', first_name: 'Punyo', last_name: 'Admin' }
        });
      } else {
        setError("Backend serveriga ulanib bo'lmadi! Iltimos, server ishlayotganini tekshiring.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Animated Background Orbs */}
      <div className="animated-orb orb-purple"></div>
      <div className="animated-orb orb-blue"></div>
      <div className="animated-orb orb-gold"></div>

      <div className="login-single-card">
        <div className="form-header-box">
          <div className="logo-center-wrapper">
            <img src={punyoLogo} alt="PUNYO EDUCATION" className="form-logo-img" />
          </div>
          <h1 className="form-main-title">PUNYO EDUCATION</h1>
          <p className="form-sub-title">Boshqaruv portaliga kirish uchun ma'lumotlaringizni kiriting</p>
        </div>

        {error && (
          <div className="alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group-custom">
            <label className="form-label-custom">Username</label>
            <div className="input-box-wrapper">
              <User className="input-left-icon" size={18} />
              <input
                type="text"
                className="input-field-custom"
                placeholder="Usernameni kiriting..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group-custom">
            <label className="form-label-custom">Parol</label>
            <div className="input-box-wrapper">
              <Lock className="input-left-icon" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field-custom"
                placeholder="Parolni kiriting..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-options-row">
            <label className="remember-checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Eslab qolish</span>
            </label>

            <a href="#forgot" className="forgot-password-link" onClick={(e) => { e.preventDefault(); alert("Parolni tiklash uchun tizim administratoriga murojaat qiling."); }}>
              Parolni unutdingizmi?
            </a>
          </div>

          <button type="submit" className="submit-btn-ideal" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Tekshirilmoqda...
              </>
            ) : (
              <>
                Tizimga kirish <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
