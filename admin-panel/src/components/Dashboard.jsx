import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  ClipboardCheck, 
  Users, 
  Award, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  TrendingUp, 
  Plus, 
  CheckCircle,
  ExternalLink,
  Edit,
  Lock,
  Trash2,
  UserCheck,
  Image as ImageIcon
} from 'lucide-react';
import punyoLogo from '../assets/punyo_logo.png';
import emptyAdsImage from '../assets/empty_ads.png';

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('Barchasi');

  // Ad Modal State
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [adFile, setAdFile] = useState(null);
  const [adOrder, setAdOrder] = useState('1');
  const [isUploading, setIsUploading] = useState(false);

  const [stats, setStats] = useState({
    total_students: 12450,
    active_courses: 28,
    completed_tests: 48320,
    certificates_issued: 1280,
    total_revenue: "128,450,000 UZS",
    recent_users: [
      { id: 1, name: 'Azizbek Mirzayev', email: 'azizbek@example.com', course: 'Python Basics', progress: 85, score: '94/100', status: 'Faol', date: 'Bugun, 14:20' },
      { id: 2, name: 'Malika Shodiyeva', email: 'malika@example.com', course: 'English A1', progress: 60, score: '88/100', status: 'Faol', date: 'Bugun, 13:05' },
      { id: 3, name: 'Sardor Karimov', email: 'sardor@example.com', course: 'IELTS 8.0+', progress: 100, score: '8.5 Band', status: 'Yakunlangan', date: 'Kecha, 18:40' },
      { id: 4, name: 'Jasur Bekmurodov', email: 'jasur@example.com', course: 'Korean A1', progress: 45, score: '76/100', status: 'Faol', date: 'Kecha, 11:15' },
    ]
  });

  const [usersList, setUsersList] = useState([]);
  const [adsList, setAdsList] = useState([]);

  const [editingUser, setEditingUser] = useState(null);
  const [editUserForm, setEditUserForm] = useState({ name: '', email: '', role: '', status: '', coins: '' });

  const fetchAds = () => {
    fetch('http://192.168.0.107:8000/api/admin/ads/')
      .then(res => res.json())
      .then(data => {
        if (data.ads !== undefined) {
          setAdsList(data.ads);
        }
      })
      .catch(err => console.log("Failed to fetch ads", err));
  };

  const handleAddAd = () => {
    setIsAdModalOpen(true);
    setAdFile(null);
    setAdOrder('1');
  };

  const submitNewAd = async (e) => {
    e.preventDefault();
    if (!adFile) {
      alert("Iltimos, rasm yuklang!");
      return;
    }
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', adFile);
    formData.append('order_index', adOrder);

    try {
      const response = await fetch('http://192.168.0.107:8000/api/admin/ads/', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      if (data.success) {
        alert("Reklama muvaffaqiyatli qo'shildi!");
        fetchAds();
        setIsAdModalOpen(false);
      } else {
        alert(data.message || "Xatolik yuz berdi");
      }
    } catch (err) {
      alert("Tarmoq xatosi!");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteUser = (id) => {
    if (!window.confirm("Rostdan ham bu foydalanuvchini o'chirmoqchimisiz?")) return;
    
    fetch(`http://192.168.0.107:8000/api/admin/users/${id}/`, {
      method: 'DELETE',
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        fetchUsers();
      } else {
        alert(data.message);
      }
    })
    .catch(err => console.error("Error deleting user:", err));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    fetch(`http://192.168.0.107:8000/api/admin/users/${editingUser.id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editUserForm)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setEditingUser(null);
        fetchUsers();
      } else {
        alert(data.message);
      }
    })
    .catch(err => console.error("Error updating user:", err));
  };

  useEffect(() => {
    // Fetch stats
    fetch('http://192.168.0.107:8000/api/admin/stats/')
      .then(res => res.json())
      .then(data => {
        if (data.total_students) {
          setStats(prev => ({ ...prev, ...data }));
        }
      })
      .catch(err => console.log("Using default stats", err));

    // Fetch users list from Python Django REST API
    fetch('http://192.168.0.107:8000/api/admin/users/')
      .then(res => res.json())
      .then(data => {
        if (data.users !== undefined) {
          setUsersList(data.users);
        }
      })
      .catch(err => console.log("Using default users list", err));

    // Fetch ads
    fetchAds();
  }, []);

  const filteredUsers = usersList.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                          u.id.toLowerCase().includes(userSearchQuery.toLowerCase());
    const matchesRole = selectedRoleFilter === 'Barchasi' || u.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div>
          <div className="sidebar-brand">
            <img src={punyoLogo} alt="PUNYO Logo" className="sidebar-logo-img" />
            <div>
              <div className="brand-name">PUNYO</div>
              <div className="brand-sub">EDUCATION ADMIN</div>
            </div>
          </div>

          <ul className="nav-list">
            <li 
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={18} /> Dashboard
            </li>

            {/* Foydalanuvchilar section right below Dashboard */}
            <li 
              className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <Users size={18} /> Foydalanuvchilar
            </li>
            <li 
              className={`nav-item ${activeTab === 'ads' ? 'active' : ''}`}
              onClick={() => setActiveTab('ads')}
            >
              <ImageIcon size={18} /> Reklama
            </li>

            <li 
              className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`}
              onClick={() => setActiveTab('courses')}
            >
              <BookOpen size={18} /> Kurslar Boshqaruvi
            </li>
            <li 
              className={`nav-item ${activeTab === 'tests' ? 'active' : ''}`}
              onClick={() => setActiveTab('tests')}
            >
              <ClipboardCheck size={18} /> Test va Imtihonlar
            </li>
            <li 
              className={`nav-item ${activeTab === 'students' ? 'active' : ''}`}
              onClick={() => setActiveTab('students')}
            >
              <UserCheck size={18} /> O'quvchilar Bazasi
            </li>
            <li 
              className={`nav-item ${activeTab === 'certificates' ? 'active' : ''}`}
              onClick={() => setActiveTab('certificates')}
            >
              <Award size={18} /> Sertifikatlar
            </li>
            <li 
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={18} /> Tizim Sozlamalari
            </li>
          </ul>
        </div>

        <div className="sidebar-user">
          <div className="user-info">
            <div className="avatar-circle">
              {user?.user?.username ? user.user.username.charAt(0).toUpperCase() : 'P'}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>
                {user?.user?.first_name || 'Punyo'} {user?.user?.last_name || 'Admin'}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>
                @{user?.user?.username || 'punyo'} (Superuser)
              </div>
            </div>
          </div>
          <button className="logout-icon-btn" title="Chiqish" onClick={onLogout}>
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-search">
            <Search size={16} style={{ position: 'absolute', left: 14, top: 13, color: '#94A3B8' }} />
            <input 
              type="text" 
              placeholder="Qidirish..." 
              value={userSearchQuery}
              onChange={(e) => setUserSearchQuery(e.target.value)}
            />
          </div>

          <div className="header-actions">
            <div className="status-badge">
              <span className="status-dot"></span>
              <span>Python Backend (REST API 8000 Active)</span>
            </div>

            <div style={{ position: 'relative', cursor: 'pointer', padding: 10, background: '#F8FAFC', borderRadius: 12, border: '1px solid #E2E8F0' }}>
              <Bell size={18} color="#475569" />
              <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: 4, background: '#EF4444' }}></span>
            </div>
          </div>
        </header>

        {/* Dashboard Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-body">
            {/* Welcome Banner */}
            <div className="welcome-banner">
              <div>
                <h2 className="welcome-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  Xush kelibsiz, {user?.user?.first_name || 'Punyo Education Admin'}!
                  <img src={punyoLogo} alt="PUNYO Logo" style={{ width: 30, height: 30, objectFit: 'contain' }} />
                </h2>
                <p className="welcome-sub">Bugungi o'quv jarayoni, kurslar faolligi va talabalar ko'rsatkichlari boshqaruvi.</p>
              </div>

              <div className="action-buttons-group">
                <button className="btn-action-purple">
                  <Plus size={16} /> Yangi Kurs Yaratish
                </button>
                <button className="btn-action-outline">
                  <ClipboardCheck size={16} /> Yangi Test Qo'shish
                </button>
              </div>
            </div>

            {/* Educational Stats Cards Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon-wrapper" style={{ background: '#F3E8FF', color: '#7C3AED' }}>
                  <Users size={24} />
                </div>
                <div className="stat-info">
                  <h4>Jami O'quvchilar</h4>
                  <div className="value">{stats.total_students.toLocaleString()} nafar</div>
                  <div className="growth"><TrendingUp size={12} style={{ display: 'inline', marginRight: 3 }} /> +18% talabalar o'sishi</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrapper" style={{ background: '#ECFDF5', color: '#059669' }}>
                  <BookOpen size={24} />
                </div>
                <div className="stat-info">
                  <h4>Faol Kurslar</h4>
                  <div className="value">{stats.active_courses} ta kurs</div>
                  <div className="growth"><CheckCircle size={12} style={{ display: 'inline', marginRight: 3 }} /> 3 ta yangi modul</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrapper" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                  <ClipboardCheck size={24} />
                </div>
                <div className="stat-info">
                  <h4>Bajarilgan Imtihonlar</h4>
                  <div className="value">{stats.completed_tests.toLocaleString()} ta</div>
                  <div className="growth"><TrendingUp size={12} style={{ display: 'inline', marginRight: 3 }} /> O'rtacha ball: 84%</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrapper" style={{ background: '#FFFBEB', color: '#D97706' }}>
                  <Award size={24} />
                </div>
                <div className="stat-info">
                  <h4>Berilgan Sertifikatlar</h4>
                  <div className="value">{stats.certificates_issued.toLocaleString()} ta</div>
                  <div className="growth"><CheckCircle size={12} style={{ display: 'inline', marginRight: 3 }} /> Bitiruvchilar 📜</div>
                </div>
              </div>
            </div>

            {/* Education Sections Grid */}
            <div className="edu-sections-grid">
              {/* Table */}
              <div className="data-table-container">
                <div className="table-header">
                  <h3 className="table-title">Oxirgi O'quvchilar Faolligi va Natijalari</h3>
                  <button onClick={() => setActiveTab('users')} style={{ background: 'none', border: 'none', color: '#7C3AED', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                    Barcha foydalanuvchilar <ExternalLink size={14} />
                  </button>
                </div>

                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>O'quvchi Ismi</th>
                      <th>Kurs Nomi</th>
                      <th>O'zlashtirish</th>
                      <th>Imtihon Balli</th>
                      <th>Holat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recent_users.map((row) => (
                      <tr key={row.id}>
                        <td style={{ fontWeight: 700, color: '#0F172A' }}>
                          <div>{row.name}</div>
                          <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 500 }}>{row.email}</div>
                        </td>
                        <td style={{ fontWeight: 600 }}>{row.course}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, height: 6, background: '#F1F5F9', borderRadius: 3 }}>
                              <div style={{ height: '100%', width: `${row.progress}%`, background: '#7C3AED', borderRadius: 3 }}></div>
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#475569' }}>{row.progress}%</span>
                          </div>
                        </td>
                        <td style={{ fontWeight: 700, color: '#059669' }}>{row.score}</td>
                        <td>
                          <span className={`status-tag status-${row.status.toLowerCase()}`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Courses Progress Overview Widget */}
              <div className="courses-progress-card">
                <h3 className="table-title" style={{ marginBottom: 20 }}>Top Kurslar Reytingi 📚</h3>

                <div className="course-progress-item">
                  <div className="course-progress-header">
                    <span>English A1 Beginner</span>
                    <span>340 o'quvchi (85%)</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: '85%' }}></div>
                  </div>
                </div>

                <div className="course-progress-item">
                  <div className="course-progress-header">
                    <span>IELTS 8.0+ Intensive</span>
                    <span>185 o'quvchi (92%)</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: '92%', background: '#059669' }}></div>
                  </div>
                </div>

                <div className="course-progress-item">
                  <div className="course-progress-header">
                    <span>Python & AI Dasturlash</span>
                    <span>210 o'quvchi (78%)</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: '78%', background: '#2563EB' }}></div>
                  </div>
                </div>

                <div className="course-progress-item">
                  <div className="course-progress-header">
                    <span>Korean A1 – Beginner</span>
                    <span>150 o'quvchi (64%)</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: '64%', background: '#D97706' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Foydalanuvchilar Tab Content */}
        {activeTab === 'users' && (
          <div className="dashboard-body">
            {/* Header banner for Foydalanuvchilar */}
            <div className="welcome-banner">
              <div>
                <h2 className="welcome-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  Foydalanuvchilar Boshqaruvi 👥
                </h2>
                <p className="welcome-sub">Platformada ro'yxatdan o'tgan barcha foydalanuvchilar, o'qituvchilar va o'quvchilar bazasi.</p>
              </div>

              <div className="action-buttons-group">
                <button className="btn-action-purple" onClick={() => alert("Yangi foydalanuvchi qo'shish formasi")}>
                  <Plus size={16} /> Yangi Foydalanuvchi Qo'shish
                </button>
              </div>
            </div>

            {/* Users Table Container */}
            <div className="data-table-container">
              <div className="table-header" style={{ flexWrap: 'wrap', gap: 16 }}>
                <h3 className="table-title">Barcha Foydalanuvchilar Ro'yxati ({filteredUsers.length} nafar)</h3>

                {/* Filter Controls */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div className="header-search" style={{ width: 300 }}>
                    <Search size={16} style={{ position: 'absolute', left: 14, top: 12, color: '#94A3B8' }} />
                    <input 
                      type="text" 
                      placeholder="Ism yoki email bo'yicha..." 
                      value={userSearchQuery} 
                      onChange={(e) => setUserSearchQuery(e.target.value)} 
                    />
                  </div>
                </div>
              </div>

              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Foydalanuvchi</th>
                    <th>Roli</th>
                    <th>Kurslar Soni</th>
                    <th>Coin Balansi</th>
                    <th>Holati</th>
                    <th>Ro'yxatdan o'tgan sana</th>
                    <th>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 700, color: '#64748B', fontSize: 12 }}>{u.id}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="avatar-circle" style={{ width: 34, height: 34, fontSize: 13 }}>
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#0F172A' }}>{u.name}</div>
                            <div style={{ fontSize: 11, color: '#94A3B8' }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 700,
                          backgroundColor: u.role === 'Talaba' ? '#F3E8FF' : u.role === "O'qituvchi" ? '#EFF6FF' : '#FFFBEB',
                          color: u.role === 'Talaba' ? '#7C3AED' : u.role === "O'qituvchi" ? '#2563EB' : '#D97706',
                        }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700, color: '#0F172A' }}>{u.courses_count} ta kurs</td>
                      <td style={{ fontWeight: 800, color: '#D97706' }}>{u.coins.toLocaleString()} 🪙</td>
                      <td>
                        <span className={`status-tag status-${u.status.toLowerCase()}`}>
                          {u.status}
                        </span>
                      </td>
                      <td style={{ color: '#64748B', fontSize: 13 }}>{u.joined_date}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button title="Tahrirlash" onClick={() => { setEditingUser(u); setEditUserForm({ name: u.name, email: u.email, role: u.role, status: u.status, coins: u.coins }); }} style={{ padding: '6px 10px', borderRadius: 10, border: '1px solid #E2E8F0', background: '#FFFFFF', cursor: 'pointer', color: '#7C3AED' }}>
                            <Edit size={14} />
                          </button>
                          <button title="Bloklash" onClick={() => alert(`${u.name} bloklandi`)} style={{ padding: '6px 10px', borderRadius: 10, border: '1px solid #E2E8F0', background: '#FFFFFF', cursor: 'pointer', color: '#D97706' }}>
                            <Lock size={14} />
                          </button>
                          <button title="O'chirish" onClick={() => handleDeleteUser(u.id)} style={{ padding: '6px 10px', borderRadius: 10, border: '1px solid #FFEFEF', background: '#FFEFEF', cursor: 'pointer', color: '#EF4444' }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Ads Management Tab Content */}
        {activeTab === 'ads' && (
          <div className="users-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid #E2E8F0' }}>
              <div>
                <h2 style={{ fontSize: '26px', fontWeight: '800', color: '#0F172A', margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  Reklamalar Boshqaruvi <ImageIcon size={24} color="#7C3AED" />
                </h2>
                <p style={{ color: '#64748B', fontSize: '15px', margin: 0 }}>
                  Ilovadagi Bosh sahifa uchun swiper rasmlarini (bannerlarni) boshqarish.
                </p>
              </div>
              <button 
                className="btn-action-purple" 
                onClick={handleAddAd} 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '12px', fontSize: '15px', fontWeight: '600', boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)', transition: 'all 0.2s ease', cursor: 'pointer' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <Plus size={18} /> Yangi Reklama Qo'shish
              </button>
            </div>

            <div className="ads-grid">
              {adsList.length === 0 ? (
                <div className="ads-empty-state">
                  <div style={{ position: 'relative', width: '240px', height: '240px', marginBottom: '20px' }}>
                    <img src={emptyAdsImage} alt="Empty Ads" style={{ width: '100%', height: '100%', objectFit: 'contain', animation: 'float 6s ease-in-out infinite' }} />
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#1E293B' }}>Hozircha reklamalar yo'q</h3>
                  <p style={{ color: '#64748B', fontSize: '16px', marginTop: '8px', marginBottom: '24px' }}>
                    Ilovangizning bosh sahifasi bo'sh qolmasligi uchun zudlik bilan yangi reklama yoki banner qo'shing.
                  </p>
                  <button 
                    className="btn-action-purple" 
                    onClick={handleAddAd} 
                    style={{ padding: '14px 28px', fontSize: '16px', borderRadius: '14px', boxShadow: '0 8px 20px rgba(124, 58, 237, 0.4)', display: 'flex', alignItems: 'center', gap: '8px', animation: 'pulse-glow 2s infinite' }}
                  >
                    <Plus size={20} /> Birinchi rasmni qo'shish
                  </button>
                </div>
              ) : (
                adsList.map(ad => (
                  <div key={ad.id} className="ad-card">
                    <div className="ad-image-wrapper">
                      <img src={ad.image_url} alt="ad" className="ad-image" />
                      <div className="ad-badge-id">ID: {ad.id}</div>
                      <div className="ad-badge-order">Navbat: {ad.order_index}</div>
                    </div>
                    <div className="ad-card-footer">
                      <div className="ad-url-text">
                        <ImageIcon size={14} color="#64748B" />
                        {ad.image_url}
                      </div>
                      <button 
                        className="btn-delete-ad" 
                        title="O'chirish" 
                        onClick={() => {
                          if (window.confirm("Rostdan ham ushbu reklamani o'chirmoqchimisiz?")) {
                            fetch(`http://192.168.0.107:8000/api/admin/ads/?id=${ad.id}`, { method: 'DELETE' })
                              .then(res => res.json())
                              .then(data => {
                                if (data.success) {
                                  setAdsList(prev => prev.filter(a => a.id !== ad.id));
                                } else {
                                  alert(data.message);
                                }
                              })
                              .catch(err => alert("Xatolik yuz berdi"));
                          }
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Foydalanuvchini Tahrirlash</h3>
              <button className="modal-close" onClick={() => setEditingUser(null)}>×</button>
            </div>
            <form onSubmit={handleEditSubmit} className="modal-body">
              <div className="form-group">
                <label>F.I.SH</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editUserForm.name}
                  onChange={(e) => setEditUserForm({...editUserForm, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email / Telefon</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editUserForm.email}
                  onChange={(e) => setEditUserForm({...editUserForm, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Rol</label>
                <select 
                  className="form-input"
                  value={editUserForm.role}
                  onChange={(e) => setEditUserForm({...editUserForm, role: e.target.value})}
                >
                  <option value="Talaba">Talaba</option>
                  <option value="O'qituvchi">O'qituvchi</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select 
                  className="form-input"
                  value={editUserForm.status}
                  onChange={(e) => setEditUserForm({...editUserForm, status: e.target.value})}
                >
                  <option value="Faol">Faol</option>
                  <option value="Bloklangan">Bloklangan</option>
                  <option value="Kutilmoqda">Kutilmoqda</option>
                </select>
              </div>
              <div className="form-group">
                <label>Coinlar</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={editUserForm.coins}
                  onChange={(e) => setEditUserForm({...editUserForm, coins: e.target.value})}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setEditingUser(null)}>Bekor qilish</button>
                <button type="submit" className="btn-save">Saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modern Ad Upload Modal */}
      {isAdModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Yangi Reklama Qo'shish</h3>
              <button className="modal-close" onClick={() => setIsAdModalOpen(false)}>×</button>
            </div>
            <form onSubmit={submitNewAd} className="modal-body">
              <div className="form-group">
                <label>Reklama Rasmi (Fayl yuklash)</label>
                <div className="file-upload-box">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setAdFile(e.target.files[0])} 
                    id="ad-image-upload" 
                  />
                  <label htmlFor="ad-image-upload" className="upload-label">
                    <ImageIcon size={32} color="#7C3AED" />
                    <span>{adFile ? adFile.name : "Rasmni tanlash uchun bosing"}</span>
                  </label>
                </div>
              </div>
              
              <div className="form-group" style={{ marginTop: '20px' }}>
                <label>Navbat raqami (Tartibi)</label>
                <input 
                  type="number" 
                  className="modern-input"
                  value={adOrder} 
                  onChange={(e) => setAdOrder(e.target.value)} 
                  min="1"
                />
              </div>

              <div className="modal-footer" style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" className="btn-cancel" onClick={() => setIsAdModalOpen(false)}>Bekor qilish</button>
                <button type="submit" className="btn-action-purple" disabled={isUploading}>
                  {isUploading ? "Yuklanmoqda..." : "Saqlash"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
