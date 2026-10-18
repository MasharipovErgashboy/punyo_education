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
  Image as ImageIcon,
  FolderTree,
  GraduationCap,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Layers,
  FileText
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

  // Courses & Categories State
  const [isCoursesMenuOpen, setIsCoursesMenuOpen] = useState(true);
  const [categoriesList, setCategoriesList] = useState([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryNameInput, setCategoryNameInput] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [isCategorySubmitting, setIsCategorySubmitting] = useState(false);

  const [coursesTab, setCoursesTab] = useState('sales'); // 'sales', 'internal', 'applications', 'students'
  const [coursesList, setCoursesList] = useState([]);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [isCourseSubmitting, setIsCourseSubmitting] = useState(false);

  const initialCourseForm = {
    category_id: '',
    title: '',
    hint: '',
    intro_video_url: '',
    description: '',
    students_count: "12k O'quvchi",
    duration: "24 Soat video",
    has_certificate: true,
    price: "250,000 UZS/oy",
    icon_file: null,
    current_icon_url: null,
    teachers: [
      { name: '', role: '', avatar_file: null }
    ]
  };
  const [courseForm, setCourseForm] = useState(initialCourseForm);

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

  const fetchCategories = () => {
    fetch('http://192.168.0.107:8000/api/categories/')
      .then(res => res.json())
      .then(data => {
        if (data.categories) {
          setCategoriesList(data.categories);
        }
      })
      .catch(err => console.log("Failed to fetch categories", err));
  };

  const fetchCourses = () => {
    fetch('http://192.168.0.107:8000/api/courses/')
      .then(res => res.json())
      .then(data => {
        if (data.courses) {
          setCoursesList(data.courses);
        }
      })
      .catch(err => console.log("Failed to fetch courses", err));
  };

  const handleOpenCreateCategory = () => {
    setEditingCategory(null);
    setCategoryNameInput('');
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryNameInput(cat.name);
    setIsCategoryModalOpen(true);
  };

  const submitNewCategory = async (e) => {
    e.preventDefault();
    if (!categoryNameInput.trim()) {
      alert("Iltimos, kategoriya nomini kiriting!");
      return;
    }
    setIsCategorySubmitting(true);
    try {
      const payload = { name: categoryNameInput.trim() };
      if (editingCategory) {
        payload.id = editingCategory.id;
      }
      const res = await fetch('http://192.168.0.107:8000/api/categories/', {
        method: editingCategory ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        alert(editingCategory ? "Kategoriya muvaffaqiyatli tahrirlandi!" : "Kategoriya muvaffaqiyatli yaratildi!");
        setCategoryNameInput('');
        setEditingCategory(null);
        setIsCategoryModalOpen(false);
        fetchCategories();
        fetchCourses();
      } else {
        alert(data.message || "Xatolik yuz berdi");
      }
    } catch (err) {
      alert("Tarmoq xatosi!");
    } finally {
      setIsCategorySubmitting(false);
    }
  };

  const handleDeleteCategory = (id) => {
    if (!window.confirm("Rostdan ham ushbu kategoriyani o'chirmoqchimisiz? Undagi barcha kurslar ham o'chib ketadi!")) return;
    fetch(`http://192.168.0.107:8000/api/categories/?id=${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          fetchCategories();
          fetchCourses();
        } else {
          alert(data.message);
        }
      })
      .catch(err => alert("Xatolik yuz berdi"));
  };

  const handleOpenCreateCourse = () => {
    if (categoriesList.length === 0) {
      alert("Kurs yaratishdan oldin kamida bitta kategoriya yaratishingiz kerak!");
      setActiveTab('categories');
      return;
    }
    setEditingCourse(null);
    setCourseForm({
      category_id: categoriesList[0]?.id || '',
      title: '',
      hint: '',
      intro_video_url: '',
      description: '',
      students_count: "12k O'quvchi",
      duration: "24 Soat video",
      has_certificate: true,
      price: "250,000 UZS/oy",
      icon_file: null,
      current_icon_url: null,
      teachers: [
        { name: '', role: '', avatar_file: null }
      ]
    });
    setIsCourseModalOpen(true);
  };

  const handleOpenEditCourse = (c) => {
    setEditingCourse(c);
    setCourseForm({
      category_id: c.category_id || '',
      title: c.title || c.name || '',
      hint: c.hint || '',
      intro_video_url: c.intro_video_url || '',
      description: c.description || '',
      students_count: c.students_count || '',
      duration: c.duration || '',
      has_certificate: !!c.has_certificate,
      price: c.price || '',
      icon_file: null,
      current_icon_url: c.icon_url || c.icon || null,
      teachers: (c.teachers && c.teachers.length > 0)
        ? c.teachers.map(t => ({
            name: t.name,
            role: t.role,
            avatar_file: null,
            current_avatar: t.avatar_url || t.avatar || null
          }))
        : [{ name: '', role: '', avatar_file: null }]
    });
    setIsCourseModalOpen(true);
  };

  const handleAddTeacherField = () => {
    setCourseForm(prev => ({
      ...prev,
      teachers: [...prev.teachers, { name: '', role: '', avatar_file: null }]
    }));
  };

  const handleRemoveTeacherField = (index) => {
    setCourseForm(prev => ({
      ...prev,
      teachers: prev.teachers.filter((_, idx) => idx !== index)
    }));
  };

  const handleTeacherChange = (index, field, value) => {
    setCourseForm(prev => {
      const updated = [...prev.teachers];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, teachers: updated };
    });
  };

  const submitNewCourse = async (e) => {
    e.preventDefault();
    if (!courseForm.category_id) {
      alert("Iltimos, kategoriya tanlang!");
      return;
    }
    if (!courseForm.title.trim()) {
      alert("Iltimos, kurs nomini kiriting!");
      return;
    }
    if (!editingCourse && !courseForm.icon_file) {
      alert("Iltimos, kurs ikonkasi rasmini tanlang!");
      return;
    }

    setIsCourseSubmitting(true);
    const formData = new FormData();
    if (editingCourse) {
      formData.append('id', editingCourse.id);
    }
    formData.append('category_id', courseForm.category_id);
    formData.append('title', courseForm.title.trim());
    formData.append('hint', courseForm.hint.trim());
    formData.append('intro_video_url', courseForm.intro_video_url.trim());
    formData.append('description', courseForm.description.trim());
    formData.append('students_count', courseForm.students_count.trim());
    formData.append('duration', courseForm.duration.trim());
    formData.append('has_certificate', courseForm.has_certificate);
    formData.append('price', courseForm.price.trim());

    if (courseForm.icon_file) {
      formData.append('icon', courseForm.icon_file);
    }

    // Teachers
    const validTeachers = [];
    courseForm.teachers.forEach((t) => {
      if (t.name.trim()) {
        validTeachers.push({ name: t.name.trim(), role: t.role.trim() });
        if (t.avatar_file) {
          formData.append(`teacher_avatar_${validTeachers.length - 1}`, t.avatar_file);
        }
      }
    });
    formData.append('teachers', JSON.stringify(validTeachers));

    try {
      const res = await fetch('http://192.168.0.107:8000/api/courses/', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        alert(editingCourse ? "Kurs muvaffaqiyatli tahrirlandi!" : "Kurs muvaffaqiyatli yaratildi!");
        setIsCourseModalOpen(false);
        setEditingCourse(null);
        setCourseForm(initialCourseForm);
        fetchCourses();
      } else {
        alert(data.message || "Xatolik yuz berdi");
      }
    } catch (err) {
      alert("Tarmoq xatosi!");
    } finally {
      setIsCourseSubmitting(false);
    }
  };

  const handleDeleteCourse = (id) => {
    if (!window.confirm("Rostdan ham ushbu kursni o'chirmoqchimisiz?")) return;
    fetch(`http://192.168.0.107:8000/api/courses/?id=${id}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          fetchCourses();
        } else {
          alert(data.message);
        }
      })
      .catch(err => alert("Xatolik yuz berdi"));
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

    // Fetch categories and courses
    fetchCategories();
    fetchCourses();
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

            {/* Kurslar Boshqaruvi with sub-buttons */}
            <div className="nav-group">
              <li 
                className={`nav-item ${activeTab === 'categories' || activeTab === 'courses' ? 'active-parent' : ''}`}
                onClick={() => setIsCoursesMenuOpen(!isCoursesMenuOpen)}
                style={{ justifyContent: 'space-between', userSelect: 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <BookOpen size={18} /> Kurslar Boshqaruvi
                </div>
                {isCoursesMenuOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
              </li>
              {isCoursesMenuOpen && (
                <div className="nav-sub-menu">
                  <div 
                    className={`nav-sub-item ${activeTab === 'categories' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('categories');
                      fetchCategories();
                    }}
                  >
                    <FolderTree size={15} /> Kategoriya
                  </div>
                  <div 
                    className={`nav-sub-item ${activeTab === 'courses' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('courses');
                      fetchCourses();
                      fetchCategories();
                    }}
                  >
                    <GraduationCap size={15} /> Kurslar
                  </div>
                </div>
              )}
            </div>
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

        {/* Categories Tab Content */}
        {activeTab === 'categories' && (
          <div className="dashboard-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FolderTree size={24} color="#7C3AED" /> Kategoriyalar Boshqaruvi
                </h2>
                <p style={{ color: '#64748B', fontSize: 13, marginTop: 4 }}>
                  Kurslar uchun yo'nalish va fan kategoriyalarini yaratish va boshqarish.
                </p>
              </div>
              <button 
                className="btn-action-purple"
                onClick={handleOpenCreateCategory}
              >
                <Plus size={18} /> Kategoriya yaratish
              </button>
            </div>

            <div className="data-table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Kategoriya Nomi</th>
                    <th>Kurslar Soni</th>
                    <th>Yaratilgan Sana</th>
                    <th style={{ textAlign: 'right' }}>Amallar</th>
                  </tr>
                </thead>
                <tbody>
                  {categoriesList.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
                        Hozircha kategoriyalar yo'q. "Kategoriya yaratish" tugmasini bosing.
                      </td>
                    </tr>
                  ) : (
                    categoriesList.map(cat => (
                      <tr key={cat.id}>
                        <td style={{ fontWeight: 700, color: '#7C3AED' }}>#{cat.id}</td>
                        <td style={{ fontWeight: 700, color: '#0F172A', fontSize: 15 }}>{cat.name}</td>
                        <td>
                          <span style={{ padding: '4px 10px', borderRadius: 8, background: '#F3E8FF', color: '#7C3AED', fontWeight: 700, fontSize: 12 }}>
                            {cat.courses_count} ta kurs
                          </span>
                        </td>
                        <td style={{ color: '#64748B', fontSize: 13 }}>{cat.created_at}</td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                            <button 
                              className="btn-edit-user"
                              title="Tahrirlash"
                              style={{ background: '#EDE9FE', color: '#7C3AED', border: 'none', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600 }}
                              onClick={() => handleOpenEditCategory(cat)}
                            >
                              <Edit size={14} /> Tahrirlash
                            </button>
                            <button 
                              className="btn-delete-ad"
                              title="O'chirish"
                              onClick={() => handleDeleteCategory(cat.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Courses Tab Content */}
        {activeTab === 'courses' && (
          <div className="dashboard-body">
            {/* Top Sub-tabs Bar */}
            <div className="course-subtabs-bar">
              <button 
                className={`course-subtab-btn ${coursesTab === 'sales' ? 'active' : ''}`}
                onClick={() => setCoursesTab('sales')}
              >
                <DollarSign size={16} /> Kurs sotuv bo'limi
              </button>
              <button 
                className={`course-subtab-btn ${coursesTab === 'internal' ? 'active' : ''}`}
                onClick={() => setCoursesTab('internal')}
              >
                <Layers size={16} /> Kurs ichki bo'limi
                <span className="course-subtab-badge">Tez kunda</span>
              </button>
              <button 
                className={`course-subtab-btn ${coursesTab === 'applications' ? 'active' : ''}`}
                onClick={() => setCoursesTab('applications')}
              >
                <FileText size={16} /> Arizalar
                <span className="course-subtab-badge">Tez kunda</span>
              </button>
              <button 
                className={`course-subtab-btn ${coursesTab === 'students' ? 'active' : ''}`}
                onClick={() => setCoursesTab('students')}
              >
                <Users size={16} /> O'quvchilar
                <span className="course-subtab-badge">Tez kunda</span>
              </button>
            </div>

            {coursesTab === 'sales' ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>
                      Kurslar (Sotuv Bo'limi)
                    </h2>
                    <p style={{ color: '#64748B', fontSize: 13 }}>
                      Mobil ilovadagi Kurslar sahifasida ko'rinadigan barcha kurslar jadvali.
                    </p>
                  </div>
                  <button 
                    className="btn-action-purple"
                    onClick={handleOpenCreateCourse}
                  >
                    <Plus size={18} /> Kurs yaratish
                  </button>
                </div>

                {coursesList.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: 20, border: '1px solid #E2E8F0' }}>
                    <div style={{ width: 64, height: 64, borderRadius: 32, background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#7C3AED' }}>
                      <GraduationCap size={32} />
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>Hozircha kurslar mavjud emas</h3>
                    <p style={{ color: '#64748B', fontSize: 14, maxWidth: 450, margin: '0 auto 20px' }}>
                      Yangi kurs qo'shish uchun "Kurs yaratish" tugmasini bosing. Kategoriya, intro video va o'qituvchilarni belgilang.
                    </p>
                    <button 
                      className="btn-action-purple"
                      onClick={handleOpenCreateCourse}
                    >
                      <Plus size={18} /> Birinchi Kursni Yaratish
                    </button>
                  </div>
                ) : (
                  <div className="data-table-container">
                    <table className="custom-table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Kurs</th>
                          <th>Kategoriya</th>
                          <th>Narxi</th>
                          <th>O'quvchilar</th>
                          <th>Davomiyligi</th>
                          <th>Sertifikat</th>
                          <th>O'qituvchilar</th>
                          <th>Sana</th>
                          <th style={{ textAlign: 'right' }}>Amallar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {coursesList.map((c, index) => (
                          <tr key={c.id}>
                            <td style={{ fontWeight: 700, color: '#7C3AED' }}>#{index + 1}</td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                {c.icon_url ? (
                                  <img 
                                    src={c.icon_url} 
                                    alt={c.title} 
                                    style={{ width: 42, height: 42, borderRadius: 10, objectFit: 'cover', background: '#F8FAFC', border: '1px solid #E2E8F0' }} 
                                  />
                                ) : (
                                  <div style={{ width: 42, height: 42, borderRadius: 10, background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C3AED' }}>
                                    <GraduationCap size={22} />
                                  </div>
                                )}
                                <div>
                                  <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 14 }}>{c.title}</div>
                                  <div style={{ fontSize: 12, color: '#64748B' }}>{c.hint || 'Darajasiz'}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span style={{ padding: '4px 10px', borderRadius: 8, background: '#F1F5F9', color: '#475569', fontWeight: 600, fontSize: 12 }}>
                                {c.category_name}
                              </span>
                            </td>
                            <td style={{ fontWeight: 800, color: '#059669', fontSize: 14 }}>
                              {c.price}
                            </td>
                            <td style={{ color: '#475569', fontSize: 13, fontWeight: 600 }}>
                              {c.students_count}
                            </td>
                            <td style={{ color: '#64748B', fontSize: 13 }}>
                              {c.duration}
                            </td>
                            <td>
                              {c.has_certificate ? (
                                <span style={{ padding: '4px 10px', borderRadius: 8, background: '#ECFDF5', color: '#059669', fontWeight: 700, fontSize: 12 }}>
                                  Mavjud 📜
                                </span>
                              ) : (
                                <span style={{ padding: '4px 10px', borderRadius: 8, background: '#F1F5F9', color: '#94A3B8', fontWeight: 600, fontSize: 12 }}>
                                  Yo'q
                                </span>
                              )}
                            </td>
                            <td>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxWidth: 220 }}>
                                {c.teachers && c.teachers.length > 0 ? (
                                  c.teachers.map((t, idx) => (
                                    <span key={idx} style={{ fontSize: 11, color: '#1E293B', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '3px 8px', borderRadius: 6, fontWeight: 500 }}>
                                      {t.name}
                                    </span>
                                  ))
                                ) : (
                                  <span style={{ color: '#94A3B8', fontSize: 12 }}>Biriktirilmagan</span>
                                )}
                              </div>
                            </td>
                            <td style={{ color: '#64748B', fontSize: 12 }}>
                              {c.created_at}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                <button 
                                  className="btn-edit-user"
                                  title="Tahrirlash"
                                  style={{ background: '#EDE9FE', color: '#7C3AED', border: 'none', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600 }}
                                  onClick={() => handleOpenEditCourse(c)}
                                >
                                  <Edit size={14} /> Tahrirlash
                                </button>
                                <button 
                                  className="btn-delete-ad" 
                                  title="O'chirish"
                                  onClick={() => handleDeleteCourse(c.id)}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '80px 20px', background: '#FFFFFF', borderRadius: 20, border: '1px solid #E2E8F0' }}>
                <div style={{ width: 64, height: 64, borderRadius: 32, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#2563EB' }}>
                  <Layers size={32} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
                  {coursesTab === 'internal' && "Kurs ichki bo'limi"}
                  {coursesTab === 'applications' && "Arizalar bo'limi"}
                  {coursesTab === 'students' && "O'quvchilar bo'limi"}
                </h3>
                <p style={{ color: '#64748B', fontSize: 14 }}>
                  Ushbu bo'lim keyingi bosqichda to'liq integratsiya qilinadi.
                </p>
              </div>
            )}
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

      {/* Category Creation / Edit Modal */}
      {isCategoryModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: 460 }}>
            <div className="modal-header">
              <h3>{editingCategory ? "Kategoriyani Tahrirlash" : "Yangi Kategoriya Yaratish"}</h3>
              <button className="modal-close" onClick={() => { setIsCategoryModalOpen(false); setEditingCategory(null); }}>×</button>
            </div>
            <form onSubmit={submitNewCategory} className="modal-body">
              <div className="form-group">
                <label>Kategoriya Nomi</label>
                <input 
                  type="text" 
                  className="modern-input"
                  placeholder="Masalan: Chet tillari, IT kurslari, Biznes..."
                  value={categoryNameInput}
                  onChange={(e) => setCategoryNameInput(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="modal-footer" style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button type="button" className="btn-cancel" onClick={() => { setIsCategoryModalOpen(false); setEditingCategory(null); }}>Bekor qilish</button>
                <button type="submit" className="btn-action-purple">
                  {editingCategory ? "Saqlash" : "Yaratish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Course Creation / Edit Modal (Sotuv Bo'limi) */}
      {isCourseModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container course-modal-container">
            <div className="modal-header">
              <div>
                <h3 style={{ margin: 0 }}>{editingCourse ? "Kursni Tahrirlash" : "Yangi Kurs Yaratish"}</h3>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748B' }}>
                  {editingCourse ? "Kurs ma'lumotlarini o'zgartiring va saqlang" : "Kurs sotuv bo'limi uchun barcha parametrlarni to'ldiring"}
                </p>
              </div>
              <button className="modal-close" onClick={() => { setIsCourseModalOpen(false); setEditingCourse(null); }}>×</button>
            </div>

            <form onSubmit={submitNewCourse} className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* 1. Kategoriya */}
              <div className="form-group">
                <label>1. Kategoriya Tanlang *</label>
                <select 
                  className="modern-input"
                  value={courseForm.category_id}
                  onChange={(e) => setCourseForm({ ...courseForm, category_id: e.target.value })}
                  required
                >
                  <option value="">-- Kategoriyani tanlang --</option>
                  {categoriesList.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* 2. Kurs icon rasmi */}
              <div className="form-group">
                <label>2. Kurs Ikonkasi (Rasm yuklash) {editingCourse ? "(Ixtiyoriy)" : "*"}</label>
                <div className="file-upload-box" style={{ padding: '20px' }}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => setCourseForm({ ...courseForm, icon_file: e.target.files[0] })} 
                    id="course-icon-upload"
                    required={!editingCourse}
                  />
                  <label htmlFor="course-icon-upload" className="upload-label" style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                    {courseForm.icon_file ? (
                      <ImageIcon size={28} color="#7C3AED" />
                    ) : courseForm.current_icon_url ? (
                      <img src={courseForm.current_icon_url} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} />
                    ) : (
                      <ImageIcon size={28} color="#7C3AED" />
                    )}
                    <span style={{ fontSize: 13, fontWeight: 600 }}>
                      {courseForm.icon_file 
                        ? courseForm.icon_file.name 
                        : (editingCourse && courseForm.current_icon_url 
                            ? "Mavjud rasm saqlanadi (o'zgartirish uchun bosing)" 
                            : "Kurs ikonkasi rasmini tanlash")}
                    </span>
                  </label>
                </div>
              </div>

              {/* 3 & 4. Kurs nomi va Hind */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label>3. Kurs Nomi *</label>
                  <input 
                    type="text" 
                    className="modern-input"
                    placeholder="Masalan: English A1"
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>4. Hind (Daraja / Izoh) *</label>
                  <input 
                    type="text" 
                    className="modern-input"
                    placeholder="Masalan: Beginner, Intermediate..."
                    value={courseForm.hint}
                    onChange={(e) => setCourseForm({ ...courseForm, hint: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* 5. Intro video link */}
              <div className="form-group">
                <label>5. Kurs Intro Videosi (YouTube Embed / Link)</label>
                <input 
                  type="text" 
                  className="modern-input"
                  placeholder="Masalan: https://www.youtube.com/embed/dQw4w9WgXcQ yoki youtube havolasi"
                  value={courseForm.intro_video_url}
                  onChange={(e) => setCourseForm({ ...courseForm, intro_video_url: e.target.value })}
                />
              </div>

              {/* 6. Tavsif */}
              <div className="form-group">
                <label>6. Kurs Haqida (Description) *</label>
                <textarea 
                  className="modern-input"
                  rows={4}
                  placeholder="Kurs haqida to'liq tavsif, nimalar o'rgatilishi va afzalliklari..."
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  style={{ resize: 'vertical' }}
                  required
                />
              </div>

              {/* 7 & 8. O'quvchilar soni & Video davomiyligi */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label>7. O'quvchilar Soni *</label>
                  <input 
                    type="text" 
                    className="modern-input"
                    placeholder="Masalan: 12k O'quvchi"
                    value={courseForm.students_count}
                    onChange={(e) => setCourseForm({ ...courseForm, students_count: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>8. Video Davomiyligi *</label>
                  <input 
                    type="text" 
                    className="modern-input"
                    placeholder="Masalan: 24 Soat video"
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* 9. Sertifikat */}
              <div className="checkbox-toggle-container">
                <input 
                  type="checkbox" 
                  id="has_certificate_check"
                  checked={courseForm.has_certificate}
                  onChange={(e) => setCourseForm({ ...courseForm, has_certificate: e.target.checked })}
                  style={{ width: 18, height: 18, accentColor: '#7C3AED', cursor: 'pointer' }}
                />
                <label htmlFor="has_certificate_check" style={{ fontSize: 14, fontWeight: 600, color: '#1E293B', cursor: 'pointer' }}>
                  9. Kurs yakunida Sertifikat beriladi 📜
                </label>
              </div>

              {/* 10. O'qituvchilar */}
              <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 12, border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <label style={{ fontSize: 14, fontWeight: 700, color: '#1E293B' }}>10. O'qituvchilar Ro'yxati</label>
                  <button 
                    type="button" 
                    onClick={handleAddTeacherField}
                    style={{ background: '#EDE9FE', color: '#7C3AED', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    <Plus size={14} /> O'qituvchi qo'shish
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {courseForm.teachers.map((t, idx) => (
                    <div key={idx} className="teacher-item-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>O'qituvchi #{idx + 1}</span>
                        {courseForm.teachers.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => handleRemoveTeacherField(idx)}
                            style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}
                          >
                            <Trash2 size={13} /> O'chirish
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <input 
                          type="text" 
                          className="modern-input" 
                          placeholder="Ism Familiya (masalan: John Doe)"
                          value={t.name}
                          onChange={(e) => handleTeacherChange(idx, 'name', e.target.value)}
                          required
                        />
                        <input 
                          type="text" 
                          className="modern-input" 
                          placeholder="Yo'nalishi (masalan: Senior IELTS Tutor)"
                          value={t.role}
                          onChange={(e) => handleTeacherChange(idx, 'role', e.target.value)}
                          required
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {t.current_avatar && !t.avatar_file && (
                          <img src={t.current_avatar} alt="" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
                        )}
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: 11, color: '#64748B', display: 'block', marginBottom: 4 }}>
                            O'qituvchi rasmi {t.current_avatar ? "(Mavjud rasm saqlanadi)" : ""}
                          </label>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleTeacherChange(idx, 'avatar_file', e.target.files[0])}
                            style={{ fontSize: 12 }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 11. Kurs narxi */}
              <div className="form-group">
                <label>11. Kurs Narxi *</label>
                <input 
                  type="text" 
                  className="modern-input"
                  placeholder="Masalan: 250,000 UZS/oy yoki Bepul"
                  value={courseForm.price}
                  onChange={(e) => setCourseForm({ ...courseForm, price: e.target.value })}
                  required
                />
              </div>

              {/* Footer */}
              <div className="modal-footer" style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button type="button" className="btn-cancel" onClick={() => { setIsCourseModalOpen(false); setEditingCourse(null); }}>Bekor qilish</button>
                <button type="submit" className="btn-action-purple" disabled={isCourseSubmitting}>
                  {isCourseSubmitting ? "Saqlanmoqda..." : (editingCourse ? "O'zgarishlarni Saqlash" : "Kursni Saqlash")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
