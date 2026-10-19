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
  PlusCircle,
  Sparkles,
  CheckCircle,
  CheckCircle2,
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
  FileText,
  FileQuestion,
  Camera,
  Eye,
  Play,
  Headphones,
  Mic,
  Send,
  UploadCloud,
  ArrowLeft,
  Video,
  FileCheck,
  Check,
  HelpCircle,
  FileAudio,
  X,
  Clock,
  Phone,
  Mail,
  RefreshCw,
  AlertCircle,
  XCircle
} from 'lucide-react';
import punyoLogo from '../assets/punyo_logo.png';
import emptyAdsImage from '../assets/empty_ads.png';

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

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

  // Kurs ichki bo'limi State
  const [selectedInternalCourse, setSelectedInternalCourse] = useState(null);
  const [internalTab, setInternalTab] = useState('modules'); // 'modules', 'lessons', 'certificates'
  const [courseModules, setCourseModules] = useState([]);
  const [courseLessons, setCourseLessons] = useState([]);
  const [courseTests, setCourseTests] = useState([]);
  const [courseCertificate, setCourseCertificate] = useState(null);
  const [isLoadingInternal, setIsLoadingInternal] = useState(false);

  const [internalModuleFilter, setInternalModuleFilter] = useState('all');
  const [internalLessonTypeFilter, setInternalLessonTypeFilter] = useState('all'); // 'all', 'video', 'test'

  // Module Modal State
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [isModuleSubmitting, setIsModuleSubmitting] = useState(false);
  const initialModuleForm = {
    title: '',
    lessons_count: 0,
    tests_count: 0,
    duration: '0 soat',
    order_index: 1,
  };
  const [moduleForm, setModuleForm] = useState(initialModuleForm);

  // Dedicated Page & Sub-view State
  const [internalSubView, setInternalSubView] = useState(null); // null, 'create-video', 'edit-video', 'create-test', 'edit-test'
  const [internalSearchQuery, setInternalSearchQuery] = useState('');

  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  };

  // Video Lessons State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [isVideoSubmitting, setIsVideoSubmitting] = useState(false);
  const [videoModuleId, setVideoModuleId] = useState('');
  const [videoList, setVideoList] = useState([
    { title: '', duration: '15 daqiqa', youtube_url: '', description: '', order_index: 1 }
  ]);

  // Test State
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [isTestSubmitting, setIsTestSubmitting] = useState(false);
  const initialTestForm = {
    module_id: '',
    title: '',
    test_type: 'abcd', // 'listening', 'reading', 'writing', 'abcd', 'speaking'
    duration_minutes: 15,
    passing_percentage: 60,
    order_index: 1,
    tg_bot_link: '',
    tg_channel: '',
    testBlocks: [
      {
        id: 1,
        question: '',
        audio_file: null,
        audio_preview_url: null,
        reading_text: '',
        options: ['', '', '', ''],
        correct_answer: 'A',
        tg_bot_link: '',
        tg_channel: '',
      }
    ],
  };
  const [testForm, setTestForm] = useState(initialTestForm);

  // Certificate Modal State
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certFile, setCertFile] = useState(null);
  const [certTitle, setCertTitle] = useState('Kurs bitiruv sertifikati');
  const [isCertSubmitting, setIsCertSubmitting] = useState(false);

  // Applications State
  const [applicationsList, setApplicationsList] = useState([]);
  const [applicationsStats, setApplicationsStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [applicationsFilter, setApplicationsFilter] = useState('all'); // 'all', 'pending', 'approved', 'rejected'
  const [applicationsSearch, setApplicationsSearch] = useState('');
  const [isApplicationsLoading, setIsApplicationsLoading] = useState(false);
  const [processingAppId, setProcessingAppId] = useState(null);

  // Enrolled Students State
  const [enrolledStudentsList, setEnrolledStudentsList] = useState([]);
  const [enrolledStudentsStats, setEnrolledStudentsStats] = useState({ total_enrolled: 0, unique_students: 0, courses_count: 0 });
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  const [enrolledStudentsSearch, setEnrolledStudentsSearch] = useState('');
  const [isEnrolledStudentsLoading, setIsEnrolledStudentsLoading] = useState(false);



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

  const fetchApplications = () => {
    setIsApplicationsLoading(true);
    const tryUrls = [
      'http://192.168.0.107:8000/api/course-applications/',
      'http://127.0.0.1:8000/api/course-applications/'
    ];

    const doFetch = (index = 0) => {
      if (index >= tryUrls.length) {
        setIsApplicationsLoading(false);
        return;
      }
      fetch(tryUrls[index])
        .then(res => res.json())
        .then(data => {
          if (data.success && data.applications) {
            setApplicationsList(data.applications);
            if (data.stats) {
              setApplicationsStats(data.stats);
            }
          }
          setIsApplicationsLoading(false);
        })
        .catch(() => {
          doFetch(index + 1);
        });
    };

    doFetch(0);
  };

  const handleUpdateApplicationStatus = async (appId, newStatus) => {
    setProcessingAppId(appId);
    const tryUrls = [
      `http://192.168.0.107:8000/api/course-applications/${appId}/`,
      `http://127.0.0.1:8000/api/course-applications/${appId}/`
    ];

    let success = false;
    let message = '';

    for (const url of tryUrls) {
      try {
        const res = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
        const data = await res.json();
        if (data.success) {
          success = true;
          message = data.message;
          break;
        } else {
          message = data.message || 'Xatolik yuz berdi';
        }
      } catch (err) {
        // try next fallback
      }
    }

    setProcessingAppId(null);
    if (success) {
      if (newStatus === 'approved') {
        alert("Ariza muvaffaqiyatli tasdiqlandi va kurs o'quvchiga biriktirildi!");
      } else if (newStatus === 'rejected') {
        alert("Ariza rad etildi!");
      }
      fetchApplications();
      fetchCourses();
      fetchEnrolledStudents();
    } else {
      alert(message || "Xatolik yuz berdi!");
    }
  };

  const handleDeleteApplication = async (appId) => {
    if (!window.confirm("Arizani ro'yxatdan o'chirishni istaysizmi?")) return;
    setProcessingAppId(appId);
    const tryUrls = [
      `http://192.168.0.107:8000/api/course-applications/${appId}/`,
      `http://127.0.0.1:8000/api/course-applications/${appId}/`
    ];

    for (const url of tryUrls) {
      try {
        const res = await fetch(url, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          alert("Ariza muvaffaqiyatli o'chirildi!");
          fetchApplications();
          break;
        }
      } catch (e) {}
    }
    setProcessingAppId(null);
  };

  const fetchEnrolledStudents = () => {
    setIsEnrolledStudentsLoading(true);
    const tryUrls = [
      'http://192.168.0.107:8000/api/course-students/',
      'http://127.0.0.1:8000/api/course-students/'
    ];

    const doFetch = (index = 0) => {
      if (index >= tryUrls.length) {
        setIsEnrolledStudentsLoading(false);
        return;
      }
      fetch(tryUrls[index])
        .then(res => res.json())
        .then(data => {
          if (data.success && data.students) {
            setEnrolledStudentsList(data.students);
            if (data.stats) {
              setEnrolledStudentsStats(data.stats);
            }
          }
          setIsEnrolledStudentsLoading(false);
        })
        .catch(() => {
          doFetch(index + 1);
        });
    };

    doFetch(0);
  };

  const handleUnenrollStudent = async (enrollmentId, studentName, courseTitle) => {
    if (!window.confirm(`${studentName}ni "${courseTitle}" kursidan chiqarmoqchimisiz?`)) return;

    const tryUrls = [
      `http://192.168.0.107:8000/api/course-students/${enrollmentId}/`,
      `http://127.0.0.1:8000/api/course-students/${enrollmentId}/`
    ];

    for (const url of tryUrls) {
      try {
        const res = await fetch(url, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          alert("O'quvchi kursdan muvaffaqiyatli chiqarildi!");
          fetchEnrolledStudents();
          fetchCourses();
          fetchApplications();
          break;
        }
      } catch (e) {}
    }
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
        { name: '', role: '', avatar_file: null, preview_url: null }
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
            name: t.name || '',
            role: t.role || '',
            avatar_file: null,
            preview_url: null,
            current_avatar: t.avatar_url || t.avatar || null
          }))
        : [{ name: '', role: '', avatar_file: null, preview_url: null }]
    });
    setIsCourseModalOpen(true);
  };

  const handleAddTeacherField = () => {
    setCourseForm(prev => ({
      ...prev,
      teachers: [...prev.teachers, { name: '', role: '', avatar_file: null, preview_url: null }]
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
      if (field === 'avatar_file' && value) {
        try {
          const previewUrl = URL.createObjectURL(value);
          updated[index] = { ...updated[index], avatar_file: value, preview_url: previewUrl };
        } catch (e) {
          updated[index] = { ...updated[index], avatar_file: value };
        }
      } else {
        updated[index] = { ...updated[index], [field]: value };
      }
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

  // Kurs Ichki Bo'limi Handlers
  const fetchInternalData = async (courseId) => {
    if (!courseId) return;
    setIsLoadingInternal(true);
    try {
      const [modsRes, lessonsRes, testsRes, certRes] = await Promise.all([
        fetch(`http://192.168.0.107:8000/api/course-modules/?course_id=${courseId}`),
        fetch(`http://192.168.0.107:8000/api/course-lessons/?course_id=${courseId}`),
        fetch(`http://192.168.0.107:8000/api/course-tests/?course_id=${courseId}`),
        fetch(`http://192.168.0.107:8000/api/course-certificates/?course_id=${courseId}`),
      ]);

      const [modsData, lessonsData, testsData, certData] = await Promise.all([
        modsRes.json(),
        lessonsRes.json(),
        testsRes.json(),
        certRes.json(),
      ]);

      if (modsData.modules) setCourseModules(modsData.modules);
      if (lessonsData.lessons) setCourseLessons(lessonsData.lessons);
      if (testsData.tests) setCourseTests(testsData.tests);
      if (certData.certificate !== undefined) setCourseCertificate(certData.certificate);
    } catch (err) {
      console.error("Error loading internal course data:", err);
    } finally {
      setIsLoadingInternal(false);
    }
  };

  const handleOpenCourseInternal = (course) => {
    setSelectedInternalCourse(course);
    setInternalSubView(null);
    setInternalTab('modules');
    setInternalModuleFilter('all');
    setInternalLessonTypeFilter('all');
    fetchInternalData(course.id);
  };

  // Module Actions
  const handleOpenCreateModule = () => {
    setEditingModule(null);
    setModuleForm({
      title: '',
      lessons_count: 0,
      tests_count: 0,
      duration: '0 soat',
      order_index: courseModules.length + 1,
    });
    setIsModuleModalOpen(true);
  };

  const handleOpenEditModule = (mod) => {
    setEditingModule(mod);
    setModuleForm({
      title: mod.title,
      lessons_count: mod.lessons_count || 0,
      tests_count: mod.tests_count || 0,
      duration: mod.duration || '0 soat',
      order_index: mod.order_index || 1,
    });
    setIsModuleModalOpen(true);
  };

  const handleSubmitModule = async (e) => {
    e.preventDefault();
    if (!moduleForm.title.trim()) {
      alert("Modul nomini kiriting!");
      return;
    }
    setIsModuleSubmitting(true);
    try {
      const url = 'http://192.168.0.107:8000/api/course-modules/';
      const method = editingModule ? 'PUT' : 'POST';
      const body = editingModule
        ? { id: editingModule.id, ...moduleForm }
        : { course_id: selectedInternalCourse.id, ...moduleForm };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        setIsModuleModalOpen(false);
        fetchInternalData(selectedInternalCourse.id);
        fetchCourses();
      } else {
        alert(data.message || "Xatolik yuz berdi");
      }
    } catch (err) {
      alert("Tarmoq xatosi!");
    } finally {
      setIsModuleSubmitting(false);
    }
  };

  const handleDeleteModule = async (modId) => {
    if (!window.confirm("Rostdan ham bu modulni va unga tegishli barcha darsliklarni o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`http://192.168.0.107:8000/api/course-modules/?id=${modId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchInternalData(selectedInternalCourse.id);
        fetchCourses();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Xatolik yuz berdi");
    }
  };

  // Video Lessons Actions
  const handleOpenCreateVideo = () => {
    setEditingLesson(null);
    const defaultModId = internalModuleFilter !== 'all' ? internalModuleFilter : (courseModules[0]?.id || '');
    setVideoModuleId(defaultModId);
    setVideoList([
      { title: '', duration: '15 daqiqa', youtube_url: '', description: '', order_index: courseLessons.length + 1 }
    ]);
    setInternalSubView('create-video');
  };

  const handleOpenEditVideo = (lesson) => {
    setEditingLesson(lesson);
    setVideoModuleId(lesson.module_id);
    setVideoList([
      {
        title: lesson.title,
        duration: lesson.duration,
        youtube_url: lesson.youtube_url,
        description: lesson.description,
        order_index: lesson.order_index
      }
    ]);
    setInternalSubView('edit-video');
  };

  const handleAddVideoField = () => {
    setVideoList(prev => [
      ...prev,
      {
        title: '',
        duration: '15 daqiqa',
        youtube_url: '',
        description: '',
        order_index: prev.length + 1 + courseLessons.length
      }
    ]);
  };

  const handleRemoveVideoField = (index) => {
    if (videoList.length === 1) return;
    setVideoList(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateVideoField = (index, field, value) => {
    setVideoList(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmitVideos = async (e) => {
    e.preventDefault();
    if (!videoModuleId) {
      alert("Iltimos, avval modulni tanlang!");
      return;
    }
    const emptyTitle = videoList.some(v => !v.title.trim());
    if (emptyTitle) {
      alert("Barcha videolarning nomlarini to'ldiring!");
      return;
    }

    setIsVideoSubmitting(true);
    try {
      if (editingLesson) {
        const res = await fetch('http://192.168.0.107:8000/api/course-lessons/', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingLesson.id,
            module_id: videoModuleId,
            ...videoList[0]
          })
        });
        const data = await res.json();
        if (data.success) {
          setInternalSubView(null);
          setIsVideoModalOpen(false);
          fetchInternalData(selectedInternalCourse.id);
          fetchCourses();
        } else {
          alert(data.message);
        }
      } else {
        const res = await fetch('http://192.168.0.107:8000/api/course-lessons/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            module_id: videoModuleId,
            lessons: videoList
          })
        });
        const data = await res.json();
        if (data.success) {
          setInternalSubView(null);
          setIsVideoModalOpen(false);
          fetchInternalData(selectedInternalCourse.id);
          fetchCourses();
        } else {
          alert(data.message);
        }
      }
    } catch (err) {
      alert("Tarmoq xatosi!");
    } finally {
      setIsVideoSubmitting(false);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Rostdan ham ushbu video darslikni o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`http://192.168.0.107:8000/api/course-lessons/?id=${lessonId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchInternalData(selectedInternalCourse.id);
        fetchCourses();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Xatolik yuz berdi");
    }
  };

  // Test Actions
  const handleOpenCreateTest = (defaultType = 'abcd') => {
    setEditingTest(null);
    const defaultModId = internalModuleFilter !== 'all' ? internalModuleFilter : (courseModules[0]?.id || '');
    const chosenType = typeof defaultType === 'string' && defaultType ? defaultType : 'abcd';
    setTestForm({
      module_id: defaultModId,
      title: '',
      test_type: chosenType,
      duration_minutes: 15,
      passing_percentage: 60,
      order_index: courseTests.length + 1,
      tg_bot_link: '',
      tg_channel: '',
      testBlocks: [
        {
          id: 1,
          question: '',
          audio_file: null,
          audio_preview_url: null,
          reading_text: '',
          options: ['', '', '', ''],
          correct_answer: 'A',
          tg_bot_link: '',
          tg_channel: '',
        }
      ],
    });
    setInternalSubView('create-test');
  };

  const handleOpenEditTest = (test) => {
    setEditingTest(test);
    const opts = Array.isArray(test.options) && test.options.length >= 4 
      ? test.options 
      : (Array.isArray(test.options) && test.options.length > 0 ? [...test.options, ...Array(Math.max(0, 4 - test.options.length)).fill('')] : ['', '', '', '']);

    setTestForm({
      module_id: test.module_id,
      title: test.title,
      test_type: test.test_type,
      duration_minutes: test.duration_minutes || 15,
      passing_percentage: test.passing_percentage || 60,
      order_index: test.order_index || 1,
      tg_bot_link: test.tg_bot_link || '',
      tg_channel: test.tg_channel || '',
      testBlocks: [
        {
          id: test.id,
          question: test.question || '',
          audio_file: null,
          audio_preview_url: test.audio_url || null,
          reading_text: test.reading_text || '',
          options: opts,
          correct_answer: test.correct_answer || 'A',
          tg_bot_link: test.tg_bot_link || '',
          tg_channel: test.tg_channel || '',
        }
      ],
    });
    setInternalSubView('edit-test');
  };

  const handleAddTestBlock = () => {
    setTestForm(prev => ({
      ...prev,
      testBlocks: [
        ...(prev.testBlocks || []),
        {
          id: Date.now() + Math.random(),
          question: '',
          audio_file: null,
          audio_preview_url: null,
          reading_text: '',
          options: ['', '', '', ''],
          correct_answer: 'A',
          tg_bot_link: '',
          tg_channel: '',
        }
      ]
    }));
  };

  const handleRemoveTestBlock = (bIdx) => {
    setTestForm(prev => {
      const curBlocks = prev.testBlocks || [];
      if (curBlocks.length <= 1) {
        alert("Kamida bitta test bo'lishi kerak!");
        return prev;
      }
      return {
        ...prev,
        testBlocks: curBlocks.filter((_, idx) => idx !== bIdx)
      };
    });
  };

  const handleUpdateBlockField = (bIdx, field, value) => {
    setTestForm(prev => {
      const curBlocks = [...(prev.testBlocks || [])];
      curBlocks[bIdx] = { ...curBlocks[bIdx], [field]: value };
      return { ...prev, testBlocks: curBlocks };
    });
  };

  const handleBlockAudioFile = (bIdx, file) => {
    setTestForm(prev => {
      const curBlocks = [...(prev.testBlocks || [])];
      curBlocks[bIdx] = {
        ...curBlocks[bIdx],
        audio_file: file,
        audio_preview_url: file ? URL.createObjectURL(file) : null
      };
      return { ...prev, testBlocks: curBlocks };
    });
  };

  const handleUpdateBlockOption = (bIdx, optIdx, val) => {
    setTestForm(prev => {
      const curBlocks = [...(prev.testBlocks || [])];
      const curOpts = [...(curBlocks[bIdx]?.options || ['', '', '', ''])];
      curOpts[optIdx] = val;
      curBlocks[bIdx] = { ...curBlocks[bIdx], options: curOpts };
      return { ...prev, testBlocks: curBlocks };
    });
  };

  const handleUpdateBlockCorrect = (bIdx, correctKey) => {
    setTestForm(prev => {
      const curBlocks = [...(prev.testBlocks || [])];
      curBlocks[bIdx] = { ...curBlocks[bIdx], correct_answer: correctKey };
      return { ...prev, testBlocks: curBlocks };
    });
  };

  const handleAddBlockOption = (bIdx) => {
    setTestForm(prev => {
      const curBlocks = [...(prev.testBlocks || [])];
      const curOpts = curBlocks[bIdx]?.options || ['', '', '', ''];
      if (curOpts.length >= OPTION_LETTERS.length) {
        alert("Maksimal 8 ta variant qo'shish mumkin!");
        return prev;
      }
      curBlocks[bIdx] = { ...curBlocks[bIdx], options: [...curOpts, ''] };
      return { ...prev, testBlocks: curBlocks };
    });
  };

  const handleRemoveBlockOption = (bIdx, optIdx) => {
    setTestForm(prev => {
      const curBlocks = [...(prev.testBlocks || [])];
      const curOpts = curBlocks[bIdx]?.options || [];
      if (curOpts.length <= 2) {
        alert("Kamida 2 ta variant bo'lishi kerak!");
        return prev;
      }
      const newOpts = curOpts.filter((_, i) => i !== optIdx);
      let curCorrect = curBlocks[bIdx]?.correct_answer;
      if (curCorrect === OPTION_LETTERS[optIdx]) {
        curCorrect = 'A';
      }
      curBlocks[bIdx] = { ...curBlocks[bIdx], options: newOpts, correct_answer: curCorrect };
      return { ...prev, testBlocks: curBlocks };
    });
  };

  const handleSubmitTest = async (e) => {
    e.preventDefault();
    if (!testForm.module_id) {
      alert("Iltimos, avval modulni tanlang!");
      return;
    }
    const baseTitle = (testForm.title || '').trim();
    if (!baseTitle) {
      alert("Test nomini kiriting!");
      return;
    }

    const blocks = testForm.testBlocks && testForm.testBlocks.length > 0 
      ? testForm.testBlocks 
      : [{ question: '', options: ['', '', '', ''], correct_answer: 'A' }];

    // Validate blocks
    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      const num = i + 1;
      if (testForm.test_type === 'listening') {
        if (!b.audio_file && !b.audio_preview_url) {
          alert(`${num}-test uchun audio faylni yuklang!`);
          return;
        }
        if (!b.question.trim()) {
          alert(`${num}-test uchun savol matnini kiriting!`);
          return;
        }
      } else if (testForm.test_type === 'reading') {
        if (!b.reading_text || !b.reading_text.trim()) {
          alert(`${num}-test uchun o'qish matnini kiriting!`);
          return;
        }
        if (!b.question.trim()) {
          alert(`${num}-test uchun savol matnini kiriting!`);
          return;
        }
      } else if (testForm.test_type === 'writing') {
        if (!b.question.trim()) {
          alert(`${num}-topshiriq uchun yozish mavzusini kiriting!`);
          return;
        }
      } else if (testForm.test_type === 'abcd') {
        if (!b.question.trim()) {
          alert(`${num}-test uchun savol matnini kiriting!`);
          return;
        }
      } else if (testForm.test_type === 'speaking') {
        if (!b.question.trim()) {
          alert(`${num}-mavzu uchun gapirish topshirig'ini kiriting!`);
          return;
        }
      }
    }

    setIsTestSubmitting(true);
    const baseOrder = parseInt(testForm.order_index, 10) || (courseTests.length + 1);

    try {
      if (editingTest) {
        const b = blocks[0];
        const formData = new FormData();
        formData.append('id', editingTest.id);
        formData.append('module_id', testForm.module_id);
        formData.append('title', baseTitle);
        formData.append('test_type', testForm.test_type);
        formData.append('duration_minutes', testForm.duration_minutes || 15);
        formData.append('passing_percentage', testForm.passing_percentage || 60);
        formData.append('order_index', testForm.order_index);
        formData.append('question', b.question || '');
        formData.append('reading_text', b.reading_text || '');
        formData.append('options', JSON.stringify((b.options || []).filter(o => o.trim() !== '')));
        formData.append('correct_answer', b.correct_answer || 'A');
        formData.append('tg_bot_link', b.tg_bot_link || testForm.tg_bot_link || '');
        formData.append('tg_channel', b.tg_channel || testForm.tg_channel || '');
        if (b.audio_file) {
          formData.append('audio', b.audio_file);
        }

        const res = await fetch('http://192.168.0.107:8000/api/course-tests/', {
          method: 'PUT',
          body: formData,
        });
        const data = await res.json();
        if (!data.success) {
          alert(data.message || "Tahrirlashda xatolik yuz berdi");
          return;
        }
      } else {
        // Save each block as an independent CourseTest record
        for (let i = 0; i < blocks.length; i++) {
          const b = blocks[i];
          const formData = new FormData();
          formData.append('module_id', testForm.module_id);
          const blockTitle = blocks.length === 1 ? baseTitle : `${baseTitle} (${i + 1}-test)`;
          formData.append('title', blockTitle);
          formData.append('test_type', testForm.test_type);
          formData.append('duration_minutes', testForm.duration_minutes || 15);
          formData.append('passing_percentage', testForm.passing_percentage || 60);
          formData.append('order_index', baseOrder + i);
          formData.append('question', b.question || '');
          formData.append('reading_text', b.reading_text || '');
          formData.append('options', JSON.stringify((b.options || []).filter(o => o.trim() !== '')));
          formData.append('correct_answer', b.correct_answer || 'A');
          formData.append('tg_bot_link', b.tg_bot_link || testForm.tg_bot_link || '');
          formData.append('tg_channel', b.tg_channel || testForm.tg_channel || '');
          if (b.audio_file) {
            formData.append('audio', b.audio_file);
          }

          const res = await fetch('http://192.168.0.107:8000/api/course-tests/', {
            method: 'POST',
            body: formData,
          });
          const data = await res.json();
          if (!data.success) {
            alert(data.message || `${i + 1}-testni saqlashda xatolik yuz berdi`);
            return;
          }
        }
      }

      setInternalSubView(null);
      setIsTestModalOpen(false);
      fetchInternalData(selectedInternalCourse.id);
      fetchCourses();
    } catch (err) {
      alert("Tarmoq xatosi!");
    } finally {
      setIsTestSubmitting(false);
    }
  };

  const handleDeleteTest = async (testId) => {
    if (!window.confirm("Rostdan ham ushbu testni o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`http://192.168.0.107:8000/api/course-tests/?id=${testId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchInternalData(selectedInternalCourse.id);
        fetchCourses();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Xatolik yuz berdi");
    }
  };

  // Certificate Actions
  const handleOpenCertificateModal = () => {
    setCertFile(null);
    setCertTitle(courseCertificate?.title || 'Kurs bitiruv sertifikati');
    setIsCertModalOpen(true);
  };

  const handleSubmitCertificate = async (e) => {
    e.preventDefault();
    if (!certFile) {
      alert("Iltimos, PDF formatidagi sertifikat faylini tanlang!");
      return;
    }
    setIsCertSubmitting(true);
    const formData = new FormData();
    formData.append('course_id', selectedInternalCourse.id);
    formData.append('title', certTitle);
    formData.append('pdf', certFile);

    try {
      const res = await fetch('http://192.168.0.107:8000/api/course-certificates/', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        alert("Sertifikat muvaffaqiyatli saqlandi!");
        setIsCertModalOpen(false);
        fetchInternalData(selectedInternalCourse.id);
        fetchCourses();
      } else {
        alert(data.message || "Xatolik yuz berdi");
      }
    } catch (err) {
      alert("Tarmoq xatosi!");
    } finally {
      setIsCertSubmitting(false);
    }
  };

  const handleDeleteCertificate = async () => {
    if (!window.confirm("Rostdan ham ushbu kurs sertifikat shablonini o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`http://192.168.0.107:8000/api/course-certificates/?course_id=${selectedInternalCourse.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchInternalData(selectedInternalCourse.id);
        fetchCourses();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Xatolik yuz berdi");
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

    // Fetch categories and courses
    fetchCategories();
    fetchCourses();
    fetchApplications();
    fetchEnrolledStudents();

    // Auto-refresh applications and enrolled students every 5 seconds
    const appInterval = setInterval(() => {
      fetchApplications();
      fetchEnrolledStudents();
    }, 5000);

    return () => clearInterval(appInterval);
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
                onClick={() => {
                  setIsCoursesMenuOpen(true);
                  setActiveTab('courses');
                  fetchCourses();
                  fetchCategories();
                }}
                style={{ justifyContent: 'space-between', userSelect: 'none', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <BookOpen size={18} /> Kurslar Boshqaruvi
                </div>
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCoursesMenuOpen(!isCoursesMenuOpen);
                  }}
                  style={{ padding: '2px 6px', display: 'flex', alignItems: 'center' }}
                  title="Menyuni ochish/yopish"
                >
                  {isCoursesMenuOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                </div>
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
                <button 
                  className="btn-action-outline"
                  onClick={() => {
                    if (courses.length > 0) {
                      handleOpenCourseInternal(courses[0]);
                      handleOpenCreateTest();
                    } else {
                      setActiveTab('courses');
                    }
                  }}
                >
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
              </button>
              <button 
                className={`course-subtab-btn ${coursesTab === 'applications' ? 'active' : ''}`}
                onClick={() => setCoursesTab('applications')}
              >
                <FileText size={16} /> Arizalar bo'limi
                {applicationsStats.pending > 0 && (
                  <span style={{ marginLeft: 6, padding: '2px 7px', borderRadius: 10, fontSize: 11, fontWeight: 700, background: '#F59E0B', color: '#FFF' }}>
                    {applicationsStats.pending}
                  </span>
                )}
              </button>

              <button 
                className={`course-subtab-btn ${coursesTab === 'students' ? 'active' : ''}`}
                onClick={() => {
                  setCoursesTab('students');
                  fetchEnrolledStudents();
                }}
              >
                <Users size={16} /> O'quvchilar bo'limi
                {enrolledStudentsList.length > 0 && (
                  <span style={{ marginLeft: 6, padding: '2px 7px', borderRadius: 10, fontSize: 11, fontWeight: 700, background: '#10B981', color: '#FFF' }}>
                    {enrolledStudentsList.length}
                  </span>
                )}
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
            ) : coursesTab === 'internal' ? (
              <div>
                {!selectedInternalCourse ? (
                  <div className="internal-table-container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 14 }}>
                      <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 8, background: '#F3E8FF', color: '#7C3AED', fontWeight: 800, fontSize: 12, marginBottom: 8 }}>
                          <Sparkles size={14} /> KURSLAR ICHKI BOSHQARUVI
                        </div>
                        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
                          Kurslar Ichki Bo'limi
                        </h2>
                        <p style={{ color: '#64748B', fontSize: 13, maxWidth: 650, margin: 0, lineHeight: 1.5 }}>
                          Mavjud kurslarning modullari, video darsliklari, testlari va sertifikatlarini boshqarish markazi. Kerakli kurs tarkibini boshqarish uchun <strong>"Ko'rish"</strong> tugmasini bosing.
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <button 
                          className="btn-outline" 
                          style={{ fontSize: 13, padding: '8px 16px', borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                          onClick={fetchCourses}
                          title="Qayta yuklash"
                        >
                          Yangilash
                        </button>
                      </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 22 }}>
                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: '#EDE9FE', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <BookOpen size={22} />
                        </div>
                        <div>
                          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Jami Kurslar</div>
                          <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>{coursesList.length} ta</div>
                        </div>
                      </div>

                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: '#F3E8FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Layers size={22} />
                        </div>
                        <div>
                          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Jami Modullar</div>
                          <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>
                            {coursesList.reduce((acc, c) => acc + (c.modules_count || 0), 0)} ta
                          </div>
                        </div>
                      </div>

                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Video size={22} />
                        </div>
                        <div>
                          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Video Darsliklar</div>
                          <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>
                            {coursesList.reduce((acc, c) => acc + (c.lessons_count || 0), 0)} ta
                          </div>
                        </div>
                      </div>

                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 16, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileQuestion size={22} />
                        </div>
                        <div>
                          <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Jami Testlar</div>
                          <div style={{ fontSize: 20, fontWeight: 800, color: '#0F172A' }}>
                            {coursesList.reduce((acc, c) => acc + (c.tests_count || 0), 0)} ta
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Table Top Bar with Search */}
                    <div className="internal-table-top-bar">
                      <div>
                        <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', marginBottom: 2 }}>Kurslar Ro'yxati</h3>
                        <span style={{ fontSize: 12, color: '#64748B' }}>
                          Quyidagi jadvaldan kerakli kursni tanlab, uning ichki tuzilmasiga kiring.
                        </span>
                      </div>
                      <div className="internal-search-input-box">
                        <Search size={16} color="#94A3B8" />
                        <input 
                          type="text" 
                          placeholder="Kurs nomi yoki kategoriya bo'yicha qidirish..." 
                          value={internalSearchQuery}
                          onChange={(e) => setInternalSearchQuery(e.target.value)}
                        />
                        {internalSearchQuery && (
                          <button 
                            type="button" 
                            onClick={() => setInternalSearchQuery('')}
                            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8', fontSize: 16, padding: '0 4px', lineHeight: 1 }}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>

                    {coursesList.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8' }}>
                        <BookOpen size={48} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                        <p style={{ fontSize: 15, fontWeight: 600 }}>Hozircha sotuv bo'limida kurslar mavjud emas.</p>
                        <p style={{ fontSize: 13 }}>Avval "Kurslar" bo'limida yangi kurs yarating.</p>
                      </div>
                    ) : (() => {
                      const filteredCourses = coursesList.filter(c => {
                        if (!internalSearchQuery.trim()) return true;
                        const q = internalSearchQuery.toLowerCase();
                        return (
                          (c.title && c.title.toLowerCase().includes(q)) ||
                          (c.category_name && c.category_name.toLowerCase().includes(q)) ||
                          (c.hint && c.hint.toLowerCase().includes(q))
                        );
                      });

                      if (filteredCourses.length === 0) {
                        return (
                          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94A3B8' }}>
                            <Search size={36} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                            <p style={{ fontSize: 14, fontWeight: 600 }}>"{internalSearchQuery}" bo'yicha kurs topilmadi.</p>
                            <button 
                              className="btn-outline" 
                              style={{ marginTop: 8, fontSize: 12, padding: '6px 14px' }}
                              onClick={() => setInternalSearchQuery('')}
                            >
                              Filtrni tozalash
                            </button>
                          </div>
                        );
                      }

                      return (
                        <div className="table-responsive">
                          <table className="users-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                            <thead>
                              <tr style={{ background: '#F8FAFC' }}>
                                <th style={{ width: 60, padding: '14px 16px', borderRadius: '12px 0 0 12px' }}>#</th>
                                <th style={{ padding: '14px 16px' }}>Kurs Nomi va Darajasi</th>
                                <th style={{ padding: '14px 16px' }}>Kategoriya</th>
                                <th style={{ padding: '14px 16px' }}>Modullar</th>
                                <th style={{ padding: '14px 16px' }}>Darsliklar</th>
                                <th style={{ padding: '14px 16px' }}>Testlar</th>
                                <th style={{ padding: '14px 16px' }}>Sertifikat</th>
                                <th style={{ textAlign: 'right', padding: '14px 16px', borderRadius: '0 12px 12px 0' }}>Amallar</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredCourses.map((c, index) => (
                                <tr key={c.id} className="table-modern-row" style={{ background: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                                  <td style={{ padding: '16px', fontWeight: 800, color: '#7C3AED', borderRadius: '12px 0 0 12px' }}>
                                    #{index + 1}
                                  </td>
                                  <td style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                      <div className="course-table-icon-wrap">
                                        {c.icon_url ? (
                                          <img src={c.icon_url} alt={c.title} />
                                        ) : (
                                          <GraduationCap size={24} color="#7C3AED" />
                                        )}
                                      </div>
                                      <div>
                                        <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 15, marginBottom: 3 }}>
                                          {c.title}
                                        </div>
                                        <div style={{ fontSize: 12, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
                                          <span>{c.hint || "Barcha darajalar uchun"}</span>
                                          {c.price ? <span>• <strong style={{ color: '#059669' }}>{Number(c.price).toLocaleString()} so'm</strong></span> : null}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td style={{ padding: '16px' }}>
                                    <span style={{ padding: '6px 12px', borderRadius: 10, background: '#F1F5F9', color: '#334155', fontWeight: 700, fontSize: 12, border: '1px solid #E2E8F0', display: 'inline-block' }}>
                                      {c.category_name}
                                    </span>
                                  </td>
                                  <td style={{ padding: '16px' }}>
                                    <span className="badge-count-pill modules">
                                      <Layers size={14} /> {c.modules_count || 0} ta modul
                                    </span>
                                  </td>
                                  <td style={{ padding: '16px' }}>
                                    <span className="badge-count-pill lessons">
                                      <Video size={14} /> {c.lessons_count || 0} ta video
                                    </span>
                                  </td>
                                  <td style={{ padding: '16px' }}>
                                    <span className="badge-count-pill tests">
                                      <FileQuestion size={14} /> {c.tests_count || 0} ta test
                                    </span>
                                  </td>
                                  <td style={{ padding: '16px' }}>
                                    {c.has_certificate_file ? (
                                      <span className="badge-count-pill cert-active">
                                        <Check size={13} /> Yuklangan (PDF)
                                      </span>
                                    ) : (
                                      <span className="badge-count-pill cert-none">
                                        Yuklanmagan
                                      </span>
                                    )}
                                  </td>
                                  <td style={{ textAlign: 'right', padding: '16px', borderRadius: '0 12px 12px 0' }}>
                                    <button 
                                      className="btn-view-course-modern"
                                      onClick={() => handleOpenCourseInternal(c)}
                                      title="Kurs tarkibini ko'rish"
                                    >
                                      <Eye size={15} /> Ko'rish
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div>
                    {(internalSubView === 'create-video' || internalSubView === 'edit-video') ? (
                      /* DEDICATED FULL-PAGE VIDEO LESSON CREATOR */
                      <div className="dedicated-page-container">
                        {/* Top Nav */}
                        <div className="dedicated-page-top-nav">
                          <button 
                            type="button" 
                            className="btn-back-link" 
                            onClick={() => setInternalSubView(null)}
                          >
                            <ArrowLeft size={16} /> Kurs ichki bo'limiga qaytish
                          </button>
                          <div style={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>
                            Kurs: <strong style={{ color: '#0F172A' }}>{selectedInternalCourse.title}</strong>
                          </div>
                        </div>

                        {/* Header Card */}
                        <div className="dedicated-page-header-card">
                          <div className="dedicated-card-icon-badge purple">
                            <Video size={28} />
                          </div>
                          <div>
                            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
                              {editingLesson ? "Video Darslikni Tahrirlash" : "Yangi Video Darslik(lar) Qo'shish"}
                            </h2>
                            <p style={{ color: '#64748B', fontSize: 13, lineHeight: 1.5, margin: 0 }}>
                              {editingLesson 
                                ? "Tanlangan video darslik ma'lumotlarini o'zgartiring va saqlang." 
                                : "Ushbu sahifada kerakli modulni tanlab, unga bir yoki bir nechta video darsliklarni ketma-ketlikda kiriting va YouTube havolasini biriktiring."}
                            </p>
                          </div>
                        </div>

                        <form onSubmit={handleSubmitVideos}>
                          {/* Card 1: Modul Tanlash */}
                          <div className="dedicated-section-card">
                            <div className="dedicated-section-title">
                              <Layers size={18} color="#7C3AED" />
                              <span>1. Qaysi Modulga Qo'shiladi?</span>
                            </div>
                            <div className="form-group" style={{ maxWidth: 480, marginBottom: 0 }}>
                              <label style={{ fontWeight: 700, fontSize: 13, color: '#334155', display: 'block', marginBottom: 6 }}>Modulni tanlang *</label>
                              <select 
                                className="modern-select"
                                style={{ width: '100%', height: 44, fontSize: 14, borderRadius: 12, padding: '0 14px' }}
                                value={videoModuleId}
                                onChange={(e) => setVideoModuleId(e.target.value)}
                                required
                              >
                                <option value="">-- Modulni tanlang --</option>
                                {courseModules.map((m) => (
                                  <option key={m.id} value={m.id}>
                                    #{m.order_index} {m.title}
                                  </option>
                                ))}
                              </select>
                              <span style={{ fontSize: 12, color: '#64748B', marginTop: 6, display: 'block' }}>
                                Yangi modul kerak bo'lsa, "Modullar" bo'limida yangi modul yarating.
                              </span>
                            </div>
                          </div>

                          {/* Card 2: Video Darsliklar */}
                          <div className="dedicated-section-card">
                            <div className="dedicated-section-title">
                              <Video size={18} color="#2563EB" />
                              <span>2. Video Darslik(lar) Tafsilotlari</span>
                              <span style={{ marginLeft: 'auto', fontSize: 12, color: '#64748B', fontWeight: 600 }}>
                                Jami: <strong>{videoList.length} ta video</strong>
                              </span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                              {videoList.map((vid, idx) => {
                                const ytId = getYouTubeId(vid.youtube_url);
                                return (
                                  <div key={idx} className="page-video-card">
                                    <div className="page-video-card-top">
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <span style={{ 
                                          background: '#7C3AED', 
                                          color: '#FFFFFF', 
                                          padding: '4px 12px', 
                                          borderRadius: 8, 
                                          fontSize: 12, 
                                          fontWeight: 800 
                                        }}>
                                          #{vid.order_index || (idx + 1)}
                                        </span>
                                        <span style={{ fontSize: 14, fontWeight: 800, color: '#1E293B' }}>
                                          {vid.title ? vid.title : `Video Darslik #${idx + 1}`}
                                        </span>
                                      </div>

                                      {!editingLesson && videoList.length > 1 && (
                                        <button 
                                          type="button" 
                                          className="btn-delete-ad"
                                          style={{ padding: '6px 12px', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}
                                          onClick={() => handleRemoveVideoField(idx)}
                                        >
                                          <Trash2 size={14} /> Videoni olib tashlash
                                        </button>
                                      )}
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                                      <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>Video Nomi *</label>
                                        <input 
                                          type="text" 
                                          className="modern-input"
                                          placeholder="Masalan: 1-Dars. Ingliz tili grammatika asoslari"
                                          value={vid.title}
                                          onChange={(e) => handleUpdateVideoField(idx, 'title', e.target.value)}
                                          required
                                        />
                                      </div>

                                      <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>Davomiyligi (Video soati/daqiqa)</label>
                                        <input 
                                          type="text" 
                                          className="modern-input"
                                          placeholder="Masalan: 18 daqiqa"
                                          value={vid.duration}
                                          onChange={(e) => handleUpdateVideoField(idx, 'duration', e.target.value)}
                                        />
                                      </div>

                                      <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>Navbat Raqami (Tartibi)</label>
                                        <input 
                                          type="number" 
                                          className="modern-input"
                                          value={vid.order_index}
                                          onChange={(e) => handleUpdateVideoField(idx, 'order_index', e.target.value)}
                                        />
                                      </div>
                                    </div>

                                    <div className="form-group" style={{ marginTop: 16, marginBottom: 0 }}>
                                      <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>YouTube Video Havolasi (Link)</label>
                                      <input 
                                        type="url" 
                                        className="modern-input"
                                        placeholder="Masalan: https://www.youtube.com/watch?v=dQw4w9WgXcQ yoki https://youtu.be/..."
                                        value={vid.youtube_url}
                                        onChange={(e) => handleUpdateVideoField(idx, 'youtube_url', e.target.value)}
                                      />

                                      {ytId && (
                                        <div className="youtube-preview-container">
                                          <img 
                                            src={`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`} 
                                            alt="YouTube Thumbnail" 
                                            className="youtube-thumbnail-img"
                                          />
                                          <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 6 }}>
                                              <span style={{ color: '#DC2626' }}>▶ YouTube Video aniqlandi</span>
                                              <span style={{ fontSize: 11, background: '#F1F5F9', padding: '2px 8px', borderRadius: 6, color: '#475569' }}>
                                                ID: {ytId}
                                              </span>
                                            </div>
                                            <a 
                                              href={vid.youtube_url} 
                                              target="_blank" 
                                              rel="noreferrer"
                                              style={{ fontSize: 12, color: '#2563EB', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4, fontWeight: 600 }}
                                            >
                                              <ExternalLink size={12} /> Videoni YouTube'da ko'rish
                                            </a>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    <div className="form-group" style={{ marginTop: 16, marginBottom: 0 }}>
                                      <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>Darslik Tavsifi / Izoh (Ixtiyoriy)</label>
                                      <textarea 
                                        className="modern-textarea"
                                        rows={2}
                                        placeholder="Ushbu darslik haqida qisqacha ma'lumot yoki talabalarga ko'rsatmalar..."
                                        value={vid.description}
                                        onChange={(e) => handleUpdateVideoField(idx, 'description', e.target.value)}
                                      />
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            {!editingLesson && (
                              <button 
                                type="button" 
                                className="btn-add-more-video-page"
                                onClick={handleAddVideoField}
                                style={{ marginTop: 16 }}
                              >
                                <PlusCircle size={20} /> + Yana Boshqa Video Qo'shish
                              </button>
                            )}
                          </div>

                          {/* Action Footer */}
                          <div className="dedicated-action-footer">
                            <button 
                              type="button" 
                              className="btn-cancel"
                              style={{ padding: '12px 24px', fontSize: 14 }}
                              onClick={() => setInternalSubView(null)}
                            >
                              Bekor qilish
                            </button>
                            <button 
                              type="submit" 
                              className="btn-action-purple"
                              style={{ padding: '12px 28px', fontSize: 14 }}
                              disabled={isVideoSubmitting}
                            >
                              {isVideoSubmitting ? "Saqlanmoqda..." : (editingLesson ? "O'zgarishlarni Saqlash" : `${videoList.length} ta Videoni Saqlash`)}
                            </button>
                          </div>
                        </form>
                      </div>
                    ) : (internalSubView === 'create-test' || internalSubView === 'edit-test') ? (
                      <div className="dedicated-page-container">
                        {/* Top Nav */}
                        <div className="dedicated-page-top-nav">
                          <button 
                            type="button" 
                            className="btn-back-link" 
                            onClick={() => setInternalSubView(null)}
                          >
                            <ArrowLeft size={16} /> Kurs ichki bo'limiga qaytish
                          </button>
                          <div style={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>
                            Kurs: <strong style={{ color: '#0F172A' }}>{selectedInternalCourse.title}</strong>
                          </div>
                        </div>

                        {/* Header Card */}
                        <div className="dedicated-page-header-card">
                          <div className="dedicated-card-icon-badge green">
                            <FileQuestion size={28} />
                          </div>
                          <div>
                            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
                              {editingTest ? "Testni Tahrirlash" : "Yangi Test Yaratish"}
                            </h2>
                            <p style={{ color: '#64748B', fontSize: 13, lineHeight: 1.5, margin: 0 }}>
                              Modul uchun 5 xil formatdagi (Eshitish, O'qish, Yozish, ABCD va Gapirish) testlarni yaratish va sozlash markazi.
                            </p>
                          </div>
                        </div>

                        <form onSubmit={handleSubmitTest}>
                          {/* Section 1: Modul va Tartib */}
                          <div className="dedicated-section-card">
                            <div className="dedicated-section-title">
                              <Layers size={18} color="#7C3AED" />
                              <span>1. Asosiy Ma'lumotlar</span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
                              <div className="form-group" style={{ marginBottom: 0 }}>
                                <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>Modulni tanlang *</label>
                                <select 
                                  className="modern-select"
                                  style={{ width: '100%', height: 44, fontSize: 14, borderRadius: 12, padding: '0 14px' }}
                                  value={testForm.module_id}
                                  onChange={(e) => setTestForm({ ...testForm, module_id: e.target.value })}
                                  required
                                >
                                  <option value="">-- Modulni tanlang --</option>
                                  {courseModules.map((m) => (
                                    <option key={m.id} value={m.id}>
                                      #{m.order_index} {m.title}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="form-group" style={{ marginBottom: 0 }}>
                                <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>Test Nomi / Sarlavhasi *</label>
                                <input 
                                  type="text" 
                                  className="modern-input"
                                  placeholder="Masalan: Unit 1. Listening Comprehension Test"
                                  value={testForm.title}
                                  onChange={(e) => setTestForm({ ...testForm, title: e.target.value })}
                                  required
                                />
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                  <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                                    <Clock size={14} color="#7C3AED" /> Test Vaqti (Daqiqa) *
                                  </label>
                                  <input 
                                    type="number" 
                                    min="1"
                                    max="300"
                                    className="modern-input"
                                    placeholder="Masalan: 15"
                                    value={testForm.duration_minutes}
                                    onChange={(e) => setTestForm({ ...testForm, duration_minutes: e.target.value })}
                                    required
                                  />
                                </div>

                                <div className="form-group" style={{ marginBottom: 0 }}>
                                  <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                                    <Award size={14} color="#D97706" /> O'tish Bali (%) *
                                  </label>
                                  <input 
                                    type="number" 
                                    min="1"
                                    max="100"
                                    className="modern-input"
                                    placeholder="Masalan: 60"
                                    value={testForm.passing_percentage}
                                    onChange={(e) => setTestForm({ ...testForm, passing_percentage: e.target.value })}
                                    required
                                  />
                                </div>

                                <div className="form-group" style={{ marginBottom: 0 }}>
                                  <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>Navbat Raqami (Ketma-ketlik)</label>
                                  <input 
                                    type="number" 
                                    className="modern-input"
                                    value={testForm.order_index}
                                    onChange={(e) => setTestForm({ ...testForm, order_index: e.target.value })}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Section 2: Test Turini Tanlash (5 Zamonaviy Card) */}
                          <div className="dedicated-section-card">
                            <div className="dedicated-section-title">
                              <Sparkles size={18} color="#D97706" />
                              <span>2. Test Turini Tanlang (5 xil format)</span>
                            </div>

                            <div className="page-test-types-grid">
                              {/* Card 1: Listening */}
                              <div 
                                className={`page-test-type-card ${testForm.test_type === 'listening' ? 'active' : ''}`}
                                onClick={() => setTestForm({ ...testForm, test_type: 'listening' })}
                              >
                                {testForm.test_type === 'listening' && (
                                  <div className="page-test-type-check-badge"><Check size={12} /></div>
                                )}
                                <div className="page-test-type-icon-wrap" style={{ background: '#FFF7ED', color: '#EA580C' }}>
                                  <Headphones size={24} />
                                </div>
                                <div className="page-test-type-title">Eshitish</div>
                                <div className="page-test-type-desc">Audio fayl, savol va A/B/C/D variantlar</div>
                              </div>

                              {/* Card 2: Reading */}
                              <div 
                                className={`page-test-type-card ${testForm.test_type === 'reading' ? 'active' : ''}`}
                                onClick={() => setTestForm({ ...testForm, test_type: 'reading' })}
                              >
                                {testForm.test_type === 'reading' && (
                                  <div className="page-test-type-check-badge"><Check size={12} /></div>
                                )}
                                <div className="page-test-type-icon-wrap" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                                  <BookOpen size={24} />
                                </div>
                                <div className="page-test-type-title">O'qish</div>
                                <div className="page-test-type-desc">Katta matn, savol va A/B/C/D variantlar</div>
                              </div>

                              {/* Card 3: Writing */}
                              <div 
                                className={`page-test-type-card ${testForm.test_type === 'writing' ? 'active' : ''}`}
                                onClick={() => setTestForm({ ...testForm, test_type: 'writing' })}
                              >
                                {testForm.test_type === 'writing' && (
                                  <div className="page-test-type-check-badge"><Check size={12} /></div>
                                )}
                                <div className="page-test-type-icon-wrap" style={{ background: '#F5F3FF', color: '#7C3AED' }}>
                                  <FileText size={24} />
                                </div>
                                <div className="page-test-type-title">Yozish</div>
                                <div className="page-test-type-desc">Insho yoki yozma topshiriq mavzusi</div>
                              </div>

                              {/* Card 4: ABCD */}
                              <div 
                                className={`page-test-type-card ${testForm.test_type === 'abcd' ? 'active' : ''}`}
                                onClick={() => setTestForm({ ...testForm, test_type: 'abcd' })}
                              >
                                {testForm.test_type === 'abcd' && (
                                  <div className="page-test-type-check-badge"><Check size={12} /></div>
                                )}
                                <div className="page-test-type-icon-wrap" style={{ background: '#ECFDF5', color: '#059669' }}>
                                  <CheckCircle2 size={24} />
                                </div>
                                <div className="page-test-type-title">ABCD Test</div>
                                <div className="page-test-type-desc">Klassik savol va 4 ta javob varianti</div>
                              </div>

                              {/* Card 5: Speaking */}
                              <div 
                                className={`page-test-type-card ${testForm.test_type === 'speaking' ? 'active' : ''}`}
                                onClick={() => setTestForm({ ...testForm, test_type: 'speaking' })}
                              >
                                {testForm.test_type === 'speaking' && (
                                  <div className="page-test-type-check-badge"><Check size={12} /></div>
                                )}
                                <div className="page-test-type-icon-wrap" style={{ background: '#FFF1F2', color: '#E11D48' }}>
                                  <Mic size={24} />
                                </div>
                                <div className="page-test-type-title">Gapirish</div>
                                <div className="page-test-type-desc">Ovozli javob (Telegram bot orqali)</div>
                              </div>
                            </div>
                          </div>

                          {/* Section 3: Dynamic Test Content */}
                          <div className="dedicated-section-card">
                            <div className="dedicated-section-title">
                              <FileCheck size={18} color="#059669" />
                              <span>3. Test Tarkibi va Savollari</span>
                            </div>

                            {/* 1. LISTENING */}
                            {testForm.test_type === 'listening' && (
                              <div>
                                {(testForm.testBlocks || []).map((bItem, bIdx) => {
                                  const audioInputId = `listening_audio_file_${bIdx}`;
                                  return (
                                    <div key={bItem.id || bIdx} className="question-item-card">
                                      <div className="question-item-header">
                                        <div className="question-item-badge" style={{ background: '#FFF7ED', color: '#EA580C' }}>
                                          <Headphones size={15} /> Test #{bIdx + 1} (Eshitish)
                                        </div>
                                        {(testForm.testBlocks || []).length > 1 && (
                                          <button 
                                            type="button" 
                                            className="btn-remove-question"
                                            onClick={() => handleRemoveTestBlock(bIdx)}
                                            title="Ushbu testni o'chirish"
                                          >
                                            <Trash2 size={13} /> Testni o'chirish
                                          </button>
                                        )}
                                      </div>

                                      {/* Audio Upload for this specific test */}
                                      <div className="audio-uploader-card" style={{ marginBottom: 16 }}>
                                        <UploadCloud size={32} color="#EA580C" style={{ margin: '0 auto 8px' }} />
                                        <div style={{ fontSize: 14, fontWeight: 700, color: '#9A3412', marginBottom: 4 }}>
                                          #{bIdx + 1}-Test uchun Audio Faylni Yuklang (.mp3, .wav, .m4a) *
                                        </div>
                                        <p style={{ fontSize: 12, color: '#C2410C', marginBottom: 12 }}>
                                          Ushbu testga tegishli audio suhbat yoki topshiriq faylini tanlang.
                                        </p>
                                        <input 
                                          type="file" 
                                          accept="audio/*"
                                          id={audioInputId}
                                          style={{ display: 'none' }}
                                          onChange={(e) => handleBlockAudioFile(bIdx, e.target.files[0])}
                                        />
                                        <label 
                                          htmlFor={audioInputId}
                                          className="btn-outline" 
                                          style={{ cursor: 'pointer', background: '#FFFFFF', padding: '8px 18px', borderRadius: 10, display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700 }}
                                        >
                                          <FileAudio size={16} /> Fayl tanlash
                                        </label>

                                        {bItem.audio_file && (
                                          <div style={{ marginTop: 10, fontSize: 13, color: '#059669', fontWeight: 700 }}>
                                            ✓ Tanlandi: {bItem.audio_file.name} ({(bItem.audio_file.size / (1024 * 1024)).toFixed(2)} MB)
                                          </div>
                                        )}
                                        {!bItem.audio_file && bItem.audio_preview_url && (
                                          <div style={{ marginTop: 10, fontSize: 13, color: '#2563EB', fontWeight: 600 }}>
                                            🎵 Joriy audio: <audio controls src={bItem.audio_preview_url} style={{ height: 32, verticalAlign: 'middle', marginLeft: 8 }} />
                                          </div>
                                        )}
                                      </div>

                                      {/* Savol matni */}
                                      <div className="form-group">
                                        <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                                          #{bIdx + 1}-Savol Matni *
                                        </label>
                                        <input 
                                          type="text" 
                                          className="modern-input"
                                          placeholder="Masalan: Suhbatdoshlar dam olish kunlari qayerga borishmoqchi?"
                                          value={bItem.question || ''}
                                          onChange={(e) => handleUpdateBlockField(bIdx, 'question', e.target.value)}
                                          required
                                        />
                                      </div>

                                      {/* Variantlar va to'g'ri javob */}
                                      <div className="form-group" style={{ marginBottom: 4 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                          <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 0 }}>
                                            Variantlar va To'g'ri Javobni belgilash *
                                          </label>
                                          <button 
                                            type="button" 
                                            className="btn-add-option"
                                            onClick={() => handleAddBlockOption(bIdx)}
                                          >
                                            <Plus size={13} /> + Variant qo'shish
                                          </button>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                          {(bItem.options || ['', '', '', '']).map((optVal, optIdx) => {
                                            const optKey = OPTION_LETTERS[optIdx] || String(optIdx + 1);
                                            const isCorrect = (bItem.correct_answer || 'A') === optKey;
                                            return (
                                              <div key={optIdx} className={`page-option-card ${isCorrect ? 'is-correct' : ''}`}>
                                                <input 
                                                  type="radio" 
                                                  id={`opt-listening-${bIdx}-${optKey}`}
                                                  name={`correct_radio_listening_${bIdx}`}
                                                  checked={isCorrect}
                                                  onChange={() => handleUpdateBlockCorrect(bIdx, optKey)}
                                                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#10B981' }}
                                                />
                                                <label htmlFor={`opt-listening-${bIdx}-${optKey}`} style={{ fontWeight: 800, fontSize: 14, color: isCorrect ? '#059669' : '#475569', minWidth: 24, cursor: 'pointer' }}>
                                                  {optKey})
                                                </label>
                                                <input 
                                                  type="text" 
                                                  className="modern-input"
                                                  style={{ border: 'none', background: 'transparent', padding: '4px 8px', fontSize: 14, flex: 1 }}
                                                  placeholder={`${optKey} varianti matni...`}
                                                  value={optVal || ''}
                                                  onChange={(e) => handleUpdateBlockOption(bIdx, optIdx, e.target.value)}
                                                  required
                                                />
                                                {isCorrect && (
                                                  <span style={{ fontSize: 12, fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: 6, whiteSpace: 'nowrap' }}>
                                                    To'g'ri javob ✓
                                                  </span>
                                                )}
                                                {(bItem.options || []).length > 2 && (
                                                  <button 
                                                    type="button"
                                                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '2px 6px', fontSize: 14 }}
                                                    onClick={() => handleRemoveBlockOption(bIdx, optIdx)}
                                                    title="Variantni o'chirish"
                                                  >
                                                    ✕
                                                  </button>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}

                                <button 
                                  type="button" 
                                  className="btn-add-test-question"
                                  onClick={handleAddTestBlock}
                                >
                                  <Plus size={18} /> + Yangi Eshitish Testi Qo'shish ({(testForm.testBlocks || []).length + 1}-test)
                                </button>
                              </div>
                            )}

                            {/* 2. READING */}
                            {testForm.test_type === 'reading' && (
                              <div>
                                {(testForm.testBlocks || []).map((bItem, bIdx) => (
                                  <div key={bItem.id || bIdx} className="question-item-card">
                                    <div className="question-item-header">
                                      <div className="question-item-badge" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                                        <BookOpen size={15} /> Test #{bIdx + 1} (O'qish)
                                      </div>
                                      {(testForm.testBlocks || []).length > 1 && (
                                        <button 
                                          type="button" 
                                          className="btn-remove-question"
                                          onClick={() => handleRemoveTestBlock(bIdx)}
                                          title="Ushbu testni o'chirish"
                                        >
                                          <Trash2 size={13} /> Testni o'chirish
                                        </button>
                                      )}
                                    </div>

                                    {/* O'qish matni for this specific test */}
                                    <div className="form-group">
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                        <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 0 }}>
                                          #{bIdx + 1}-O'qish uchun matn (Reading Passage) *
                                        </label>
                                        <span style={{ fontSize: 12, color: '#64748B' }}>
                                          {bItem.reading_text ? `${bItem.reading_text.length} ta belgi | ${bItem.reading_text.split(/\s+/).filter(Boolean).length} ta so'z` : "0 ta so'z"}
                                        </span>
                                      </div>
                                      <textarea 
                                        className="modern-textarea"
                                        rows={7}
                                        placeholder="O'quvchi ushbu testda o'qib tushunishi kerak bo'lgan matn yoki hikoyani shu yerga kiriting..."
                                        value={bItem.reading_text || ''}
                                        onChange={(e) => handleUpdateBlockField(bIdx, 'reading_text', e.target.value)}
                                        style={{ lineHeight: 1.6, fontSize: 14 }}
                                        required
                                      />
                                    </div>

                                    {/* Savol matni */}
                                    <div className="form-group">
                                      <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                                        #{bIdx + 1}-Savol Matni *
                                      </label>
                                      <input 
                                        type="text" 
                                        className="modern-input"
                                        placeholder="Masalan: Matnga ko'ra, asosiy qahramon nima sababdan sayohatga chiqdi?"
                                        value={bItem.question || ''}
                                        onChange={(e) => handleUpdateBlockField(bIdx, 'question', e.target.value)}
                                        required
                                      />
                                    </div>

                                    {/* Variantlar va to'g'ri javob */}
                                    <div className="form-group" style={{ marginBottom: 4 }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                        <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 0 }}>
                                          Variantlar va To'g'ri Javobni belgilash *
                                        </label>
                                        <button 
                                          type="button" 
                                          className="btn-add-option"
                                          onClick={() => handleAddBlockOption(bIdx)}
                                        >
                                          <Plus size={13} /> + Variant qo'shish
                                        </button>
                                      </div>

                                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        {(bItem.options || ['', '', '', '']).map((optVal, optIdx) => {
                                          const optKey = OPTION_LETTERS[optIdx] || String(optIdx + 1);
                                          const isCorrect = (bItem.correct_answer || 'A') === optKey;
                                          return (
                                            <div key={optIdx} className={`page-option-card ${isCorrect ? 'is-correct' : ''}`}>
                                              <input 
                                                type="radio" 
                                                id={`opt-reading-${bIdx}-${optKey}`}
                                                name={`correct_radio_reading_${bIdx}`}
                                                checked={isCorrect}
                                                onChange={() => handleUpdateBlockCorrect(bIdx, optKey)}
                                                style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#10B981' }}
                                              />
                                              <label htmlFor={`opt-reading-${bIdx}-${optKey}`} style={{ fontWeight: 800, fontSize: 14, color: isCorrect ? '#059669' : '#475569', minWidth: 24, cursor: 'pointer' }}>
                                                {optKey})
                                              </label>
                                              <input 
                                                type="text" 
                                                className="modern-input"
                                                style={{ border: 'none', background: 'transparent', padding: '4px 8px', fontSize: 14, flex: 1 }}
                                                placeholder={`${optKey} varianti matni...`}
                                                value={optVal || ''}
                                                onChange={(e) => handleUpdateBlockOption(bIdx, optIdx, e.target.value)}
                                                required
                                              />
                                              {isCorrect && (
                                                <span style={{ fontSize: 12, fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: 6, whiteSpace: 'nowrap' }}>
                                                  To'g'ri javob ✓
                                                </span>
                                              )}
                                              {(bItem.options || []).length > 2 && (
                                                <button 
                                                  type="button"
                                                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '2px 6px', fontSize: 14 }}
                                                  onClick={() => handleRemoveBlockOption(bIdx, optIdx)}
                                                  title="Variantni o'chirish"
                                                >
                                                  ✕
                                                </button>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                <button 
                                  type="button" 
                                  className="btn-add-test-question"
                                  onClick={handleAddTestBlock}
                                >
                                  <Plus size={18} /> + Yangi O'qish Testi Qo'shish ({(testForm.testBlocks || []).length + 1}-test)
                                </button>
                              </div>
                            )}

                            {/* 3. WRITING */}
                            {testForm.test_type === 'writing' && (
                              <div>
                                {(testForm.testBlocks || []).map((bItem, bIdx) => (
                                  <div key={bItem.id || bIdx} className="question-item-card">
                                    <div className="question-item-header">
                                      <div className="question-item-badge" style={{ background: '#F5F3FF', color: '#7C3AED' }}>
                                        <FileText size={15} /> Topshiriq #{bIdx + 1} (Yozish)
                                      </div>
                                      {(testForm.testBlocks || []).length > 1 && (
                                        <button 
                                          type="button" 
                                          className="btn-remove-question"
                                          onClick={() => handleRemoveTestBlock(bIdx)}
                                          title="Ushbu topshiriqni o'chirish"
                                        >
                                          <Trash2 size={13} /> Topshiriqni o'chirish
                                        </button>
                                      )}
                                    </div>

                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                      <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                                        #{bIdx + 1}-Yozish Mavzusi / Insho Topshirig'i *
                                      </label>
                                      <textarea 
                                        className="modern-textarea"
                                        rows={5}
                                        placeholder="Masalan: 'Texnologiyaning yoshlar hayotiga ta'siri' mavzusida kamida 150 ta so'zdan iborat insho yozing..."
                                        value={bItem.question || ''}
                                        onChange={(e) => handleUpdateBlockField(bIdx, 'question', e.target.value)}
                                        required
                                      />
                                    </div>
                                  </div>
                                ))}

                                <button 
                                  type="button" 
                                  className="btn-add-test-question"
                                  onClick={handleAddTestBlock}
                                >
                                  <Plus size={18} /> + Yangi Yozish Topshirig'i Qo'shish ({(testForm.testBlocks || []).length + 1}-topshiriq)
                                </button>

                                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: 16, borderRadius: 14, color: '#475569', fontSize: 13, lineHeight: 1.5, marginTop: 14 }}>
                                  <div style={{ fontWeight: 800, color: '#0F172A', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <HelpCircle size={16} color="#7C3AED" /> Yozish topshirig'i haqida:
                                  </div>
                                  O'quvchi ushbu topshiriqni mobil ilovada alohida ko'radi va ilova ichidagi maxsus matn maydonida yozma insho yozib topshiradi.
                                </div>
                              </div>
                            )}

                            {/* 4. ABCD */}
                            {testForm.test_type === 'abcd' && (
                              <div>
                                {(testForm.testBlocks || []).map((bItem, bIdx) => (
                                  <div key={bItem.id || bIdx} className="question-item-card">
                                    <div className="question-item-header">
                                      <div className="question-item-badge" style={{ background: '#ECFDF5', color: '#059669' }}>
                                        <CheckCircle2 size={15} /> Test #{bIdx + 1} (ABCD)
                                      </div>
                                      {(testForm.testBlocks || []).length > 1 && (
                                        <button 
                                          type="button" 
                                          className="btn-remove-question"
                                          onClick={() => handleRemoveTestBlock(bIdx)}
                                          title="Ushbu testni o'chirish"
                                        >
                                          <Trash2 size={13} /> Testni o'chirish
                                        </button>
                                      )}
                                    </div>

                                    <div className="form-group">
                                      <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                                        #{bIdx + 1}-Savol Matni *
                                      </label>
                                      <input 
                                        type="text" 
                                        className="modern-input"
                                        placeholder="Masalan: Quyidagi so'zlardan qaysi biri fe'l turkumiga kiradi?"
                                        value={bItem.question || ''}
                                        onChange={(e) => handleUpdateBlockField(bIdx, 'question', e.target.value)}
                                        required
                                      />
                                    </div>

                                    <div className="form-group" style={{ marginBottom: 4 }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                        <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 0 }}>
                                          Variantlar va To'g'ri Javobni belgilash *
                                        </label>
                                        <button 
                                          type="button" 
                                          className="btn-add-option"
                                          onClick={() => handleAddBlockOption(bIdx)}
                                        >
                                          <Plus size={13} /> + Variant qo'shish
                                        </button>
                                      </div>

                                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                        {(bItem.options || ['', '', '', '']).map((optVal, optIdx) => {
                                          const optKey = OPTION_LETTERS[optIdx] || String(optIdx + 1);
                                          const isCorrect = (bItem.correct_answer || 'A') === optKey;
                                          return (
                                            <div key={optIdx} className={`page-option-card ${isCorrect ? 'is-correct' : ''}`}>
                                              <input 
                                                type="radio" 
                                                id={`opt-abcd-${bIdx}-${optKey}`}
                                                name={`correct_radio_abcd_${bIdx}`}
                                                checked={isCorrect}
                                                onChange={() => handleUpdateBlockCorrect(bIdx, optKey)}
                                                style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#10B981' }}
                                              />
                                              <label htmlFor={`opt-abcd-${bIdx}-${optKey}`} style={{ fontWeight: 800, fontSize: 14, color: isCorrect ? '#059669' : '#475569', minWidth: 24, cursor: 'pointer' }}>
                                                {optKey})
                                              </label>
                                              <input 
                                                type="text" 
                                                className="modern-input"
                                                style={{ border: 'none', background: 'transparent', padding: '4px 8px', fontSize: 14, flex: 1 }}
                                                placeholder={`${optKey} varianti matni...`}
                                                value={optVal || ''}
                                                onChange={(e) => handleUpdateBlockOption(bIdx, optIdx, e.target.value)}
                                                required
                                              />
                                              {isCorrect && (
                                                <span style={{ fontSize: 12, fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: 6, whiteSpace: 'nowrap' }}>
                                                  To'g'ri javob ✓
                                                </span>
                                              )}
                                              {(bItem.options || []).length > 2 && (
                                                <button 
                                                  type="button"
                                                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '2px 6px', fontSize: 14 }}
                                                  onClick={() => handleRemoveBlockOption(bIdx, optIdx)}
                                                  title="Variantni o'chirish"
                                                >
                                                  ✕
                                                </button>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                <button 
                                  type="button" 
                                  className="btn-add-test-question"
                                  onClick={handleAddTestBlock}
                                >
                                  <Plus size={18} /> + Yangi ABCD Test Qo'shish ({(testForm.testBlocks || []).length + 1}-test)
                                </button>
                              </div>
                            )}

                            {/* 5. SPEAKING */}
                            {testForm.test_type === 'speaking' && (
                              <div>
                                {(testForm.testBlocks || []).map((bItem, bIdx) => (
                                  <div key={bItem.id || bIdx} className="question-item-card">
                                    <div className="question-item-header">
                                      <div className="question-item-badge" style={{ background: '#FFF1F2', color: '#E11D48' }}>
                                        <Mic size={15} /> Topshiriq #{bIdx + 1} (Gapirish)
                                      </div>
                                      {(testForm.testBlocks || []).length > 1 && (
                                        <button 
                                          type="button" 
                                          className="btn-remove-question"
                                          onClick={() => handleRemoveTestBlock(bIdx)}
                                          title="Ushbu topshiriqni o'chirish"
                                        >
                                          <Trash2 size={13} /> Topshiriqni o'chirish
                                        </button>
                                      )}
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, marginBottom: 14 }}>
                                      <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>Telegram Bot Havolasi *</label>
                                        <input 
                                          type="text" 
                                          className="modern-input"
                                          placeholder="Masalan: https://t.me/punyo_speaking_bot yoki @punyo_speaking_bot"
                                          value={bItem.tg_bot_link || testForm.tg_bot_link || ''}
                                          onChange={(e) => handleUpdateBlockField(bIdx, 'tg_bot_link', e.target.value)}
                                          required
                                        />
                                      </div>

                                      <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>Telegram Kanal / Guruh (Username yoki ID)</label>
                                        <input 
                                          type="text" 
                                          className="modern-input"
                                          placeholder="Masalan: @punyo_submissions yoki -100123456789"
                                          value={bItem.tg_channel || testForm.tg_channel || ''}
                                          onChange={(e) => handleUpdateBlockField(bIdx, 'tg_channel', e.target.value)}
                                        />
                                      </div>
                                    </div>

                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                      <label style={{ fontSize: 13, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                                        #{bIdx + 1}-Gapirish Mavzusi / Savol *
                                      </label>
                                      <textarea 
                                        className="modern-textarea"
                                        rows={3}
                                        placeholder="Masalan: O'zingiz yoqtirgan kasb haqida 2 daqiqa davomida ingliz tilida gapirib bering..."
                                        value={bItem.question || ''}
                                        onChange={(e) => handleUpdateBlockField(bIdx, 'question', e.target.value)}
                                        required
                                      />
                                    </div>
                                  </div>
                                ))}

                                <button 
                                  type="button" 
                                  className="btn-add-test-question"
                                  onClick={handleAddTestBlock}
                                >
                                  <Plus size={18} /> + Yangi Gapirish Mavzusi Qo'shish ({(testForm.testBlocks || []).length + 1}-mavzu)
                                </button>

                                <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', padding: 16, borderRadius: 14, color: '#9F1239', fontSize: 13, lineHeight: 1.5, marginTop: 14 }}>
                                  <div style={{ fontWeight: 800, color: '#881337', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <Mic size={16} color="#E11D48" /> Gapirish testi ishlash tartibi:
                                  </div>
                                  O'quvchi ushbu topshiriqni o'qib, "Javobni yuborish" tugmasini bosganda ko'rsatilgan Telegram botga yo'naltiriladi va o'z ovozli xabarini yozib botga jo'natadi.
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Action Footer */}
                          <div className="dedicated-action-footer">
                            <button 
                              type="button" 
                              className="btn-cancel"
                              style={{ padding: '12px 24px', fontSize: 14 }}
                              onClick={() => setInternalSubView(null)}
                            >
                              Bekor qilish
                            </button>
                            <button 
                              type="submit" 
                              className="btn-action-green"
                              style={{ padding: '12px 28px', fontSize: 14 }}
                              disabled={isTestSubmitting}
                            >
                              {isTestSubmitting ? "Saqlanmoqda..." : (editingTest ? "O'zgarishlarni Saqlash" : "Testni Saqlash")}
                            </button>
                          </div>
                        </form>
                      </div>
                    ) : (
                      <div>
                        {/* Internal Course Top Header */}
                    <div className="internal-course-header-box">
                      <div className="internal-course-header-top">
                        <button 
                          className="btn-back-link"
                          onClick={() => { setSelectedInternalCourse(null); fetchCourses(); }}
                        >
                          <ArrowLeft size={16} /> Barcha kurslarga qaytish
                        </button>

                        <div style={{ display: 'flex', gap: 8 }}>
                          <button 
                            className="btn-outline" 
                            style={{ fontSize: 12, padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 10 }}
                            onClick={() => fetchInternalData(selectedInternalCourse.id)}
                            title="Ma'lumotlarni qayta yuklash"
                          >
                            Yangilash
                          </button>
                        </div>
                      </div>

                      <div className="internal-course-info-banner">
                        {selectedInternalCourse.icon_url ? (
                          <img 
                            src={selectedInternalCourse.icon_url} 
                            alt={selectedInternalCourse.title} 
                            className="internal-course-avatar"
                          />
                        ) : (
                          <div className="internal-course-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C3AED' }}>
                            <GraduationCap size={36} />
                          </div>
                        )}
                        <div className="internal-course-title-meta">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                            <span className="course-badge-category">{selectedInternalCourse.category_name}</span>
                            {selectedInternalCourse.hint && (
                              <span style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>• {selectedInternalCourse.hint}</span>
                            )}
                          </div>
                          <h2>{selectedInternalCourse.title}</h2>
                          <div className="internal-badges-strip">
                            <span className="internal-stat-badge purple">
                              <Layers size={13} /> {courseModules.length} ta Modul
                            </span>
                            <span className="internal-stat-badge blue">
                              <Video size={13} /> {courseLessons.length} ta Video darslik
                            </span>
                            <span className="internal-stat-badge green">
                              <FileText size={13} /> {courseTests.length} ta Test
                            </span>
                            <span className="internal-stat-badge">
                              <Award size={13} /> {courseCertificate ? "Sertifikat yuklangan 📜" : "Sertifikat yuklanmagan"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3 Nav Tabs */}
                    <div className="internal-nav-tabs-bar">
                      <button 
                        className={`internal-nav-tab ${internalTab === 'modules' ? 'active' : ''}`}
                        onClick={() => setInternalTab('modules')}
                      >
                        <Layers size={18} />
                        Modullar
                        <span className="internal-tab-badge">{courseModules.length}</span>
                      </button>

                      <button 
                        className={`internal-nav-tab ${internalTab === 'lessons' ? 'active' : ''}`}
                        onClick={() => setInternalTab('lessons')}
                      >
                        <BookOpen size={18} />
                        Darsliklar
                        <span className="internal-tab-badge">{courseLessons.length + courseTests.length}</span>
                      </button>

                      <button 
                        className={`internal-nav-tab ${internalTab === 'certificates' ? 'active' : ''}`}
                        onClick={() => setInternalTab('certificates')}
                      >
                        <Award size={18} />
                        Sertifikatlar
                        <span className="internal-tab-badge">{courseCertificate ? '1' : '0'}</span>
                      </button>
                    </div>

                    {/* TAB CONTENT 1: MODULLAR */}
                    {internalTab === 'modules' && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                          <div>
                            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>Kurs Modullari</h3>
                            <p style={{ color: '#64748B', fontSize: 13 }}>
                              Modul nomi, video darslar va testlar soni hamda davomiyligi bilan yangi modul yarating.
                            </p>
                          </div>
                          <button 
                            className="btn-action-purple"
                            onClick={handleOpenCreateModule}
                          >
                            <Plus size={16} /> Modul Yaratish
                          </button>
                        </div>

                        {courseModules.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: 20, border: '1px solid #E2E8F0' }}>
                            <div style={{ width: 60, height: 60, borderRadius: 30, background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#7C3AED' }}>
                              <Layers size={28} />
                            </div>
                            <h4 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>Hozircha modullar yaratilmagan</h4>
                            <p style={{ color: '#64748B', fontSize: 13, marginBottom: 18 }}>
                              Ushbu kurs uchun birinchi modulni yarating. Keyin unga darsliklar va testlar biriktirasiz.
                            </p>
                            <button className="btn-action-purple" onClick={handleOpenCreateModule}>
                              <Plus size={15} /> Birinchi Modulni Yaratish
                            </button>
                          </div>
                        ) : (
                          <div className="modules-grid">
                            {courseModules.map((mod, idx) => (
                              <div key={mod.id} className="module-card">
                                <div className="module-card-header">
                                  <div className="module-order-badge">#{mod.order_index || (idx + 1)}</div>
                                  <div className="module-card-title">{mod.title}</div>
                                </div>

                                <div className="module-stats-row">
                                  <div className="module-stat-pill" title="Rejalashtirilgan video darslar soni">
                                    <Video size={14} color="#2563EB" /> 
                                    <span>{mod.lessons_count} ta video</span>
                                  </div>
                                  <div className="module-stat-pill" title="Rejalashtirilgan testlar soni">
                                    <FileQuestion size={14} color="#059669" /> 
                                    <span>{mod.tests_count} ta test</span>
                                  </div>
                                  <div className="module-stat-pill" title="Video soati">
                                    <Play size={14} color="#7C3AED" /> 
                                    <span>{mod.duration}</span>
                                  </div>
                                </div>

                                <div className="module-card-actions">
                                  <button 
                                    className="btn-module-lessons"
                                    onClick={() => {
                                      setInternalTab('lessons');
                                      setInternalModuleFilter(String(mod.id));
                                    }}
                                  >
                                    <BookOpen size={13} /> Darsliklar ({mod.actual_lessons_count + mod.actual_tests_count})
                                  </button>

                                  <div style={{ display: 'flex', gap: 6 }}>
                                    <button 
                                      className="btn-edit-user"
                                      style={{ padding: '6px 10px', background: '#F1F5F9', color: '#475569', borderRadius: 8, border: 'none', cursor: 'pointer' }}
                                      title="Tahrirlash"
                                      onClick={() => handleOpenEditModule(mod)}
                                    >
                                      <Edit size={14} />
                                    </button>
                                    <button 
                                      className="btn-delete-ad"
                                      style={{ padding: '6px 10px' }}
                                      title="O'chirish"
                                      onClick={() => handleDeleteModule(mod.id)}
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB CONTENT 2: DARSLIKLAR */}
                    {internalTab === 'lessons' && (
                      <div>
                        <div className="lessons-toolbar">
                          <div className="lessons-toolbar-left">
                            <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Modul:</label>
                            <select 
                              className="modern-select"
                              style={{ minWidth: 200, padding: '7px 12px', fontSize: 13 }}
                              value={internalModuleFilter}
                              onChange={(e) => setInternalModuleFilter(e.target.value)}
                            >
                              <option value="all">Barcha modullar ({courseModules.length})</option>
                              {courseModules.map(m => (
                                <option key={m.id} value={String(m.id)}>
                                  #{m.order_index} {m.title}
                                </option>
                              ))}
                            </select>

                            <div style={{ display: 'flex', gap: 6, marginLeft: 8 }}>
                              <button 
                                className={`filter-btn ${internalLessonTypeFilter === 'all' ? 'active' : ''}`}
                                style={{ padding: '6px 12px', fontSize: 12 }}
                                onClick={() => setInternalLessonTypeFilter('all')}
                              >
                                Barchasi ({courseLessons.length + courseTests.length})
                              </button>
                              <button 
                                className={`filter-btn ${internalLessonTypeFilter === 'video' ? 'active' : ''}`}
                                style={{ padding: '6px 12px', fontSize: 12 }}
                                onClick={() => setInternalLessonTypeFilter('video')}
                              >
                                🎬 Videolar ({courseLessons.length})
                              </button>
                              <button 
                                className={`filter-btn ${internalLessonTypeFilter === 'test' ? 'active' : ''}`}
                                style={{ padding: '6px 12px', fontSize: 12 }}
                                onClick={() => setInternalLessonTypeFilter('test')}
                              >
                                📝 Testlar ({courseTests.length})
                              </button>
                            </div>
                          </div>

                          <div className="lessons-toolbar-right">
                            <button 
                              className="btn-action-purple"
                              style={{ fontSize: 13, padding: '9px 16px' }}
                              onClick={handleOpenCreateVideo}
                              disabled={courseModules.length === 0}
                            >
                              <Video size={16} /> + Video Darslik
                            </button>
                            <button 
                              className="btn-action-green"
                              style={{ fontSize: 13, padding: '9px 16px' }}
                              onClick={handleOpenCreateTest}
                              disabled={courseModules.length === 0}
                            >
                              <FileQuestion size={16} /> + Test Qo'shish
                            </button>
                          </div>
                        </div>

                        {courseModules.length === 0 && (
                          <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', padding: '16px 20px', borderRadius: 12, marginBottom: 20, color: '#92400E', fontSize: 13, display: 'flex', alignItems: 'center', gap: 10 }}>
                            <HelpCircle size={18} />
                            <span>Video darslik yoki test qo'shish uchun avval <strong>"Modullar"</strong> bo'limida kamida bitta modul yaratishingiz kerak.</span>
                          </div>
                        )}

                        {/* Combined List of Videos and Tests */}
                        {(() => {
                          let filteredLessons = courseLessons.filter(l => 
                            internalModuleFilter === 'all' || String(l.module_id) === String(internalModuleFilter)
                          );
                          let filteredTests = courseTests.filter(t => 
                            internalModuleFilter === 'all' || String(t.module_id) === String(internalModuleFilter)
                          );

                          let combinedItems = [];
                          if (internalLessonTypeFilter === 'all' || internalLessonTypeFilter === 'video') {
                            combinedItems.push(...filteredLessons.map(l => ({ ...l, item_kind: 'video' })));
                          }
                          if (internalLessonTypeFilter === 'all' || internalLessonTypeFilter === 'test') {
                            combinedItems.push(...filteredTests.map(t => ({ ...t, item_kind: 'test' })));
                          }

                          combinedItems.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));

                          if (combinedItems.length === 0) {
                            return (
                              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: 20, border: '1px solid #E2E8F0' }}>
                                <BookOpen size={48} style={{ color: '#CBD5E1', margin: '0 auto 14px' }} />
                                <h4 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>Darsliklar yoki testlar topilmadi</h4>
                                <p style={{ color: '#64748B', fontSize: 13, marginBottom: 18 }}>
                                  Yuqoridagi <strong>"+ Video Darslik"</strong> yoki <strong>"+ Test Qo'shish"</strong> tugmalari orqali ushbu modulga kontent qo'shing.
                                </p>
                              </div>
                            );
                          }

                          return (
                            <div>
                              {combinedItems.map((item) => {
                                if (item.item_kind === 'video') {
                                  return (
                                    <div key={`vid-${item.id}`} className="lesson-card">
                                      <div className="lesson-card-left">
                                        <div className="lesson-type-icon-box video">
                                          <Video size={20} />
                                        </div>
                                        <div>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ fontWeight: 800, color: '#2563EB', fontSize: 13 }}>#{item.order_index}</span>
                                            <span className="type-pill video">🎬 Video</span>
                                            <span style={{ fontSize: 12, color: '#64748B' }}>Modul: {item.module_title}</span>
                                          </div>
                                          <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', marginTop: 4 }}>
                                            {item.title}
                                          </div>
                                          <div className="lesson-meta-info">
                                            <span style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>⏱️ {item.duration}</span>
                                            {item.youtube_url && (
                                              <a 
                                                href={item.youtube_url} 
                                                target="_blank" 
                                                rel="noreferrer" 
                                                style={{ fontSize: 12, color: '#DC2626', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, fontWeight: 600 }}
                                              >
                                                <ExternalLink size={12} /> YouTube Havolasi
                                              </a>
                                            )}
                                            {item.description && (
                                              <span style={{ fontSize: 12, color: '#64748B', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                • {item.description}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <button 
                                          className="btn-edit-user"
                                          style={{ padding: '6px 10px', background: '#EFF6FF', color: '#2563EB', borderRadius: 8, border: 'none', cursor: 'pointer' }}
                                          title="Tahrirlash"
                                          onClick={() => handleOpenEditVideo(item)}
                                        >
                                          <Edit size={14} />
                                        </button>
                                        <button 
                                          className="btn-delete-ad"
                                          style={{ padding: '6px 10px' }}
                                          title="O'chirish"
                                          onClick={() => handleDeleteLesson(item.id)}
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                } else {
                                  const typeLabelMap = {
                                    listening: "🎧 Eshitish",
                                    reading: "📖 O'qish",
                                    writing: "✍️ Yozish",
                                    abcd: "🔘 ABCD Test",
                                    speaking: "🗣️ Gapirish",
                                  };

                                  return (
                                    <div key={`test-${item.id}`} className="lesson-card">
                                      <div className="lesson-card-left">
                                        <div className={`lesson-type-icon-box ${item.test_type}`}>
                                          {item.test_type === 'listening' && <Headphones size={20} />}
                                          {item.test_type === 'reading' && <BookOpen size={20} />}
                                          {item.test_type === 'writing' && <FileText size={20} />}
                                          {item.test_type === 'abcd' && <FileQuestion size={20} />}
                                          {item.test_type === 'speaking' && <Mic size={20} />}
                                        </div>
                                        <div>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ fontWeight: 800, color: '#7C3AED', fontSize: 13 }}>#{item.order_index}</span>
                                            <span className={`type-pill ${item.test_type}`}>
                                              {typeLabelMap[item.test_type] || item.test_type}
                                            </span>
                                            <span style={{ fontSize: 12, color: '#64748B' }}>Modul: {item.module_title}</span>
                                            <span style={{ fontSize: 11, background: '#EDE9FE', color: '#6D28D9', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>
                                              ⏱ {item.duration_minutes || 15} daqiqa
                                            </span>
                                            <span style={{ fontSize: 11, background: '#FEF3C7', color: '#B45309', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>
                                              🎯 O'tish: {item.passing_percentage || 60}%
                                            </span>
                                          </div>
                                          <div style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', marginTop: 4 }}>
                                            {item.title}
                                          </div>
                                          <div className="lesson-meta-info">
                                            {item.question && (
                                              <span style={{ fontSize: 12, color: '#334155' }}>
                                                <strong>Savol:</strong> {item.question}
                                              </span>
                                            )}
                                            {item.audio_url && (
                                              <span style={{ fontSize: 11, background: '#FFF7ED', color: '#EA580C', padding: '2px 7px', borderRadius: 6, fontWeight: 600 }}>
                                                🎵 Audio yuklangan
                                              </span>
                                            )}
                                            {item.reading_text && (
                                              <span style={{ fontSize: 11, background: '#ECFDF5', color: '#059669', padding: '2px 7px', borderRadius: 6, fontWeight: 600 }}>
                                                📄 Matn mavjud ({item.reading_text.length} belgi)
                                              </span>
                                            )}
                                            {item.correct_answer && (
                                              <span style={{ fontSize: 11, background: '#F3E8FF', color: '#7C3AED', padding: '2px 7px', borderRadius: 6, fontWeight: 700 }}>
                                                To'g'ri: {item.correct_answer}
                                              </span>
                                            )}
                                            {item.tg_bot_link && (
                                              <span style={{ fontSize: 11, background: '#FFE4E6', color: '#E11D48', padding: '2px 7px', borderRadius: 6, fontWeight: 600 }}>
                                                🤖 TG: {item.tg_bot_link}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <button 
                                          className="btn-edit-user"
                                          style={{ padding: '6px 10px', background: '#F3E8FF', color: '#7C3AED', borderRadius: 8, border: 'none', cursor: 'pointer' }}
                                          title="Tahrirlash"
                                          onClick={() => handleOpenEditTest(item)}
                                        >
                                          <Edit size={14} />
                                        </button>
                                        <button 
                                          className="btn-delete-ad"
                                          style={{ padding: '6px 10px' }}
                                          title="O'chirish"
                                          onClick={() => handleDeleteTest(item.id)}
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                      </div>
                                    </div>
                                  );
                                }
                              })}
                            </div>
                          );
                        })()}
                      </div>
                    )}

                    {/* TAB CONTENT 3: SERTIFIKATLAR */}
                    {internalTab === 'certificates' && (
                      <div>
                        <div style={{ marginBottom: 20 }}>
                          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>Kurs Bitiruv Sertifikati</h3>
                          <p style={{ color: '#64748B', fontSize: 13 }}>
                            Ushbu kursni to'liq tamomlagan o'quvchilarga avtomatik beriladigan rasmiy PDF sertifikat shablonini yuklang yoki almashtiring.
                          </p>
                        </div>

                        {courseCertificate && courseCertificate.pdf_url ? (
                          <div className="certificate-view-card">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                              <div className="certificate-pdf-icon-wrap">
                                <FileText size={40} />
                              </div>
                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                  <span style={{ fontSize: 11, fontWeight: 800, background: '#ECFDF5', color: '#059669', padding: '3px 8px', borderRadius: 6 }}>
                                    Faol Sertifikat Shablon
                                  </span>
                                  <span style={{ fontSize: 12, color: '#64748B' }}>Yuklangan: {courseCertificate.created_at}</span>
                                </div>
                                <h4 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
                                  {courseCertificate.title || "Kurs bitiruv sertifikati"}
                                </h4>
                                <div style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>
                                  Fayl nomi: <strong>{courseCertificate.pdf_name || "sertifikat.pdf"}</strong>
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                              <a 
                                href={courseCertificate.pdf_url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="btn-action-purple"
                                style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
                              >
                                <ExternalLink size={15} /> PDF ni Ko'rish
                              </a>
                              <button 
                                className="btn-outline"
                                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700 }}
                                onClick={handleOpenCertificateModal}
                              >
                                <UploadCloud size={15} /> Yangi PDF Yuklash
                              </button>
                              <button 
                                className="btn-delete-ad"
                                style={{ padding: '9px 14px', borderRadius: 12 }}
                                onClick={handleDeleteCertificate}
                                title="Sertifikatni o'chirish"
                              >
                                <Trash2 size={16} /> O'chirish
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div 
                            className="certificate-upload-dropzone"
                            onClick={handleOpenCertificateModal}
                          >
                            <div style={{ width: 64, height: 64, borderRadius: 32, background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#7C3AED' }}>
                              <UploadCloud size={32} />
                            </div>
                            <h4 style={{ fontSize: 17, fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
                              Sertifikat Shablonini (PDF) Yuklash
                            </h4>
                            <p style={{ color: '#64748B', fontSize: 13, maxWidth: 440, margin: '0 auto 20px' }}>
                              Ushbu kurs uchun sertifikat hali yuklanmagan. Kursni bitirganlarga taqdim etiladigan rasmiy PDF faylini yuklash uchun bosing.
                            </p>
                            <button className="btn-action-purple" onClick={(e) => { e.stopPropagation(); handleOpenCertificateModal(); }}>
                              <Plus size={16} /> PDF Fayl Yuklash
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : coursesTab === 'applications' ? (
          <div className="applications-management-container" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Header & Stats Banner */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
                  Kurslar Bo'yicha Arizalar
                </h3>
                <p style={{ color: '#64748B', fontSize: 13, margin: 0 }}>
                  Mobil ilovadan o'quvchilar tomonidan kurslarga yuborilgan barcha arizalar va ularni tasdiqlash
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button 
                  onClick={fetchApplications}
                  disabled={isApplicationsLoading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 16px',
                    borderRadius: 10,
                    border: '1px solid #E2E8F0',
                    background: '#FFFFFF',
                    color: '#475569',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <RefreshCw size={15} className={isApplicationsLoading ? 'spin-anim' : ''} />
                  Yangilash
                </button>
              </div>
            </div>

            {/* 4 Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 16 }}>
              <div style={{ background: '#FFFFFF', padding: '18px 20px', borderRadius: 16, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Layers size={24} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Jami Arizalar</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#0F172A' }}>{applicationsStats.total}</div>
                </div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '18px 20px', borderRadius: 16, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Clock size={24} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Kutilayotgan</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#D97706' }}>{applicationsStats.pending}</div>
                </div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '18px 20px', borderRadius: 16, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Tasdiqlangan</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#16A34A' }}>{applicationsStats.approved}</div>
                </div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '18px 20px', borderRadius: 16, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <XCircle size={24} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Rad Etilgan</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#DC2626' }}>{applicationsStats.rejected}</div>
                </div>
              </div>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, background: '#FFFFFF', padding: '12px 16px', borderRadius: 14, border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  onClick={() => setApplicationsFilter('all')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    background: applicationsFilter === 'all' ? '#7C3AED' : '#F1F5F9',
                    color: applicationsFilter === 'all' ? '#FFFFFF' : '#475569',
                    transition: 'all 0.2s'
                  }}
                >
                  Barchasi ({applicationsStats.total})
                </button>
                <button
                  onClick={() => setApplicationsFilter('pending')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    background: applicationsFilter === 'pending' ? '#D97706' : '#F1F5F9',
                    color: applicationsFilter === 'pending' ? '#FFFFFF' : '#475569',
                    transition: 'all 0.2s'
                  }}
                >
                  Kutilmoqda ({applicationsStats.pending})
                </button>
                <button
                  onClick={() => setApplicationsFilter('approved')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    background: applicationsFilter === 'approved' ? '#16A34A' : '#F1F5F9',
                    color: applicationsFilter === 'approved' ? '#FFFFFF' : '#475569',
                    transition: 'all 0.2s'
                  }}
                >
                  Tasdiqlangan ({applicationsStats.approved})
                </button>
                <button
                  onClick={() => setApplicationsFilter('rejected')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    background: applicationsFilter === 'rejected' ? '#DC2626' : '#F1F5F9',
                    color: applicationsFilter === 'rejected' ? '#FFFFFF' : '#475569',
                    transition: 'all 0.2s'
                  }}
                >
                  Rad etilgan ({applicationsStats.rejected})
                </button>
              </div>

              {/* Search Box */}
              <div style={{ position: 'relative', minWidth: 280 }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input 
                  type="text"
                  placeholder="O'quvchi, telefon yoki kurs..."
                  value={applicationsSearch}
                  onChange={(e) => setApplicationsSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    borderRadius: 8,
                    border: '1px solid #E2E8F0',
                    fontSize: 13,
                    outline: 'none',
                    background: '#F8FAFC'
                  }}
                />
              </div>
            </div>

            {/* Applications Table Card */}
            <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
              {(() => {
                const filtered = applicationsList.filter(app => {
                  const matchesFilter = applicationsFilter === 'all' || app.status === applicationsFilter;
                  const q = applicationsSearch.toLowerCase();
                  const matchesSearch = !q || 
                    (app.user_name && app.user_name.toLowerCase().includes(q)) ||
                    (app.user_phone && app.user_phone.toLowerCase().includes(q)) ||
                    (app.user_email && app.user_email.toLowerCase().includes(q)) ||
                    (app.course_title && app.course_title.toLowerCase().includes(q));
                  return matchesFilter && matchesSearch;
                });

                if (filtered.length === 0) {
                  return (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                      <div style={{ width: 56, height: 56, borderRadius: 28, background: '#F1F5F9', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                        <ClipboardCheck size={28} />
                      </div>
                      <h4 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', marginBottom: 4 }}>
                        Arizalar topilmadi
                      </h4>
                      <p style={{ color: '#64748B', fontSize: 13, margin: 0 }}>
                        {applicationsList.length === 0 
                          ? "Hozircha hech qanday ariza kelib tushmagan. Mobil ilovadan o'quvchilar kursga yozilganda bu yerda paydo bo'ladi."
                          : "Tanlangan filtr yoki qidiruv so'rovi bo'yicha hech qanday ariza topilmadi."}
                      </p>
                    </div>
                  );
                }

                return (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                          <th style={{ padding: '14px 16px', fontSize: 12, fontWeight: 700, color: '#475569', width: 60 }}>#</th>
                          <th style={{ padding: '14px 16px', fontSize: 12, fontWeight: 700, color: '#475569' }}>O'quvchi ma'lumotlari</th>
                          <th style={{ padding: '14px 16px', fontSize: 12, fontWeight: 700, color: '#475569' }}>Telefon raqami</th>
                          <th style={{ padding: '14px 16px', fontSize: 12, fontWeight: 700, color: '#475569' }}>Ariza berilgan kurs</th>
                          <th style={{ padding: '14px 16px', fontSize: 12, fontWeight: 700, color: '#475569' }}>Ariza vaqti</th>
                          <th style={{ padding: '14px 16px', fontSize: 12, fontWeight: 700, color: '#475569' }}>Holati</th>
                          <th style={{ padding: '14px 16px', fontSize: 12, fontWeight: 700, color: '#475569', textAlign: 'center' }}>Amallar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((app) => (
                          <tr key={app.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s' }}>
                            <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, color: '#64748B' }}>
                              #{app.id}
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: 20,
                                  background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                                  color: '#FFFFFF',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 700,
                                  fontSize: 15,
                                  flexShrink: 0
                                }}>
                                  {app.user_name ? app.user_name.charAt(0).toUpperCase() : 'U'}
                                </div>
                                <div>
                                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                                    {app.user_name}
                                  </div>
                                  <div style={{ fontSize: 12, color: '#64748B' }}>
                                    {app.user_email || (app.user_id ? `ID: ${app.user_id}` : 'Mobil foydalanuvchi')}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                padding: '4px 10px',
                                background: '#F0F9FF',
                                borderRadius: 8,
                                border: '1px solid #BAE6FD',
                                color: '#0369A1',
                                fontSize: 13,
                                fontWeight: 600
                              }}>
                                <Phone size={13} />
                                {app.user_phone}
                              </div>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ fontSize: 14, fontWeight: 700, color: '#1E293B', marginBottom: 2 }}>
                                {app.course_title}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                {app.course_category && (
                                  <span style={{ fontSize: 11, background: '#EDE9FE', color: '#6D28D9', padding: '2px 8px', borderRadius: 6, fontWeight: 600 }}>
                                    {app.course_category}
                                  </span>
                                )}
                                {app.course_price && (
                                  <span style={{ fontSize: 11, color: '#16A34A', fontWeight: 700 }}>
                                    {app.course_price}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#475569' }}>
                                <Clock size={13} style={{ color: '#94A3B8' }} />
                                {app.created_at}
                              </div>
                            </td>
                            <td style={{ padding: '14px 16px' }}>
                              {app.status === 'pending' && (
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 6,
                                  background: '#FEF3C7',
                                  color: '#B45309',
                                  padding: '4px 10px',
                                  borderRadius: 20,
                                  fontSize: 12,
                                  fontWeight: 700,
                                  border: '1px solid #FDE68A'
                                }}>
                                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#F59E0B' }} />
                                  Kutilmoqda
                                </span>
                              )}
                              {app.status === 'approved' && (
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 6,
                                  background: '#DCFCE7',
                                  color: '#15803D',
                                  padding: '4px 10px',
                                  borderRadius: 20,
                                  fontSize: 12,
                                  fontWeight: 700,
                                  border: '1px solid #BBF7D0'
                                }}>
                                  <CheckCircle2 size={13} />
                                  Tasdiqlangan
                                </span>
                              )}
                              {app.status === 'rejected' && (
                                <span style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: 6,
                                  background: '#FEE2E2',
                                  color: '#B91C1C',
                                  padding: '4px 10px',
                                  borderRadius: 20,
                                  fontSize: 12,
                                  fontWeight: 700,
                                  border: '1px solid #FECACA'
                                }}>
                                  <XCircle size={13} />
                                  Rad etilgan
                                </span>
                              )}
                            </td>
                            <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                                {/* Tasdiqlash Button (Check Icon) */}
                                <button
                                  title="Arizani tasdiqlash va kursni o'quvchiga ochish"
                                  onClick={() => handleUpdateApplicationStatus(app.id, 'approved')}
                                  disabled={processingAppId === app.id || app.status === 'approved'}
                                  style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 10,
                                    border: '1px solid #86EFAC',
                                    background: app.status === 'approved' ? '#F0FDF4' : '#DCFCE7',
                                    color: '#16A34A',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: app.status === 'approved' ? 'default' : 'pointer',
                                    opacity: app.status === 'approved' ? 0.5 : 1,
                                    transition: 'all 0.2s',
                                  }}
                                >
                                  <Check size={18} strokeWidth={2.5} />
                                </button>

                                {/* Rad Etish Button (X Icon) */}
                                <button
                                  title="Arizani rad etish"
                                  onClick={() => handleUpdateApplicationStatus(app.id, 'rejected')}
                                  disabled={processingAppId === app.id || app.status === 'rejected'}
                                  style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 10,
                                    border: '1px solid #FCA5A5',
                                    background: app.status === 'rejected' ? '#FEF2F2' : '#FEE2E2',
                                    color: '#DC2626',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: app.status === 'rejected' ? 'default' : 'pointer',
                                    opacity: app.status === 'rejected' ? 0.5 : 1,
                                    transition: 'all 0.2s',
                                  }}
                                >
                                  <X size={18} strokeWidth={2.5} />
                                </button>

                                {/* O'chirish Button (Trash) */}
                                <button
                                  title="Arizani o'chirish"
                                  onClick={() => handleDeleteApplication(app.id)}
                                  disabled={processingAppId === app.id}
                                  style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: 10,
                                    border: '1px solid #E2E8F0',
                                    background: '#FFFFFF',
                                    color: '#94A3B8',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                  }}
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
                );
              })()}
            </div>
          </div>
        ) : (
          <div className="enrolled-students-management-container" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Header & Stats Banner */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>
                  O'quvchilar Bo'limi
                </h3>
                <p style={{ color: '#64748B', fontSize: 13, margin: 0 }}>
                  Arizasi tasdiqlanib, kurslarga qabul qilingan o'quvchilar ro'yxati va ularning o'quv ko'rsatkichlari
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button 
                  onClick={fetchEnrolledStudents}
                  disabled={isEnrolledStudentsLoading}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 16px',
                    borderRadius: 10,
                    border: '1px solid #E2E8F0',
                    background: '#FFFFFF',
                    color: '#475569',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <RefreshCw size={15} className={isEnrolledStudentsLoading ? 'spin-anim' : ''} />
                  Yangilash
                </button>
              </div>
            </div>

            {/* 4 Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 16 }}>
              <div style={{ background: '#FFFFFF', padding: '18px 20px', borderRadius: 16, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={24} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Jami Biriktirilgan</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#0F172A' }}>{enrolledStudentsStats.total_enrolled || enrolledStudentsList.length}</div>
                </div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '18px 20px', borderRadius: 16, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserCheck size={24} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Noyob Talabalar</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#7C3AED' }}>{enrolledStudentsStats.unique_students || (new Set(enrolledStudentsList.map(s => s.user_id || s.email))).size}</div>
                </div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '18px 20px', borderRadius: 16, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={24} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Kurslar Soni</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#16A34A' }}>{enrolledStudentsStats.courses_count || (new Set(enrolledStudentsList.map(s => s.course_id))).size}</div>
                </div>
              </div>

              <div style={{ background: '#FFFFFF', padding: '18px 20px', borderRadius: 16, border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>O'quvchi Holati</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#D97706' }}>100% Faol</div>
                </div>
              </div>
            </div>

            {/* Filter Bar & Search */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, background: '#FFFFFF', padding: '12px 16px', borderRadius: 14, border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#64748B' }}>Kurs bo'yicha:</span>
                  <select
                    value={selectedCourseFilter}
                    onChange={(e) => setSelectedCourseFilter(e.target.value)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      border: '1px solid #CBD5E1',
                      background: '#F8FAFC',
                      color: '#1E293B',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="all">Barcha kurslar ({enrolledStudentsList.length})</option>
                    {coursesList.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Box */}
              <div style={{ position: 'relative', minWidth: 260 }}>
                <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input 
                  type="text"
                  placeholder="Ism, telefon yoki kurs bo'yicha..."
                  value={enrolledStudentsSearch}
                  onChange={(e) => setEnrolledStudentsSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    borderRadius: 8,
                    border: '1px solid #CBD5E1',
                    fontSize: 13,
                    background: '#F8FAFC',
                    outline: 'none',
                    color: '#0F172A',
                  }}
                />
              </div>
            </div>

            {/* Table or Empty State */}
            {(() => {
              const filteredStudents = enrolledStudentsList.filter(student => {
                const matchesCourse = selectedCourseFilter === 'all' || String(student.course_id) === String(selectedCourseFilter);
                const q = enrolledStudentsSearch.toLowerCase();
                const matchesSearch = !q || 
                  (student.name && student.name.toLowerCase().includes(q)) ||
                  (student.email && student.email.toLowerCase().includes(q)) ||
                  (student.phone && student.phone.toLowerCase().includes(q)) ||
                  (student.course_title && student.course_title.toLowerCase().includes(q)) ||
                  (student.user_id && student.user_id.toLowerCase().includes(q));
                return matchesCourse && matchesSearch;
              });

              if (filteredStudents.length === 0) {
                return (
                  <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: 20, border: '1px solid #E2E8F0' }}>
                    <div style={{ width: 64, height: 64, borderRadius: 32, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#2563EB' }}>
                      <Users size={32} />
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: '#0F172A', marginBottom: 6 }}>
                      {enrolledStudentsList.length === 0 ? "Hozircha biriktirilgan o'quvchilar mavjud emas" : "Qidiruv bo'yicha o'quvchilar topilmadi"}
                    </h3>
                    <p style={{ color: '#64748B', fontSize: 13, maxWidth: 440, margin: '0 auto' }}>
                      {enrolledStudentsList.length === 0 
                        ? "Arizalar bo'limidan o'quvchilar arizasini tasdiqlaganingizda, ular avtomatik tarzda ushbu jadvalga qo'shiladi va ilovadagi Mening kurslarim bo'limida ko'rinadi."
                        : "Qidiruv so'zini yoki kurs filtrini o'zgartirib ko'ring."}
                    </p>
                  </div>
                );
              }

              return (
                <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E2E8F0', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 600 }}>
                        <th style={{ padding: '14px 16px', width: 50 }}>#</th>
                        <th style={{ padding: '14px 16px' }}>O'quvchi ma'lumotlari</th>
                        <th style={{ padding: '14px 16px' }}>Telefon raqami</th>
                        <th style={{ padding: '14px 16px' }}>Biriktirilgan kurs</th>
                        <th style={{ padding: '14px 16px' }}>Qabul qilingan sana</th>
                        <th style={{ padding: '14px 16px' }}>O'zlashtirish</th>
                        <th style={{ padding: '14px 16px' }}>Holat</th>
                        <th style={{ padding: '14px 16px', textAlign: 'right' }}>Amallar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((st, idx) => (
                        <tr key={st.id || idx} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s' }}>
                          <td style={{ padding: '14px 16px', color: '#64748B', fontWeight: 600 }}>
                            {idx + 1}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{
                                width: 38,
                                height: 38,
                                borderRadius: 19,
                                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                                color: '#FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 700,
                                fontSize: 15,
                                flexShrink: 0
                              }}>
                                {st.name ? st.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div>
                                <div style={{ fontWeight: 700, color: '#0F172A', fontSize: 14 }}>
                                  {st.name || 'Noma\'lum o\'quvchi'}
                                </div>
                                <div style={{ color: '#64748B', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                                  <span style={{ background: '#F1F5F9', padding: '1px 6px', borderRadius: 4, fontWeight: 600, fontSize: 11 }}>
                                    {st.user_id || `ID: ${st.user_pk}`}
                                  </span>
                                  {st.email && <span>{st.email}</span>}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 8, background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#334155', fontWeight: 600, fontSize: 12 }}>
                              <Phone size={13} style={{ color: '#64748B' }} />
                              {st.phone || 'Kiritilmagan'}
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div>
                              <div style={{ fontWeight: 700, color: '#1E293B', fontSize: 13 }}>
                                {st.course_title}
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                                {st.course_category && (
                                  <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 6, background: '#EDE9FE', color: '#6D28D9', fontWeight: 600 }}>
                                    {st.course_category}
                                  </span>
                                )}
                                {st.course_price && (
                                  <span style={{ fontSize: 11, color: '#64748B', fontWeight: 600 }}>
                                    {typeof st.course_price === 'number' ? st.course_price.toLocaleString() : st.course_price} so'm
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#475569', fontSize: 12 }}>
                              <Clock size={13} style={{ color: '#94A3B8' }} />
                              {st.enrolled_at || 'Yaqinda'}
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px', minWidth: 140 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <div style={{ flex: 1, height: 6, borderRadius: 3, background: '#E2E8F0', overflow: 'hidden' }}>
                                <div style={{ width: `${st.progress_percent || 0}%`, height: '100%', background: '#10B981', borderRadius: 3 }} />
                              </div>
                              <span style={{ fontSize: 12, fontWeight: 700, color: '#0F172A', minWidth: 32 }}>
                                {st.progress_percent || 0}%
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 5,
                              padding: '4px 10px',
                              borderRadius: 20,
                              fontSize: 11,
                              fontWeight: 700,
                              background: '#DCFCE7',
                              color: '#15803D',
                            }}>
                              <span style={{ width: 6, height: 6, borderRadius: 3, background: '#16A34A' }} />
                              Faol o'quvchi
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            <button
                              onClick={() => handleUnenrollStudent(st.id, st.name, st.course_title)}
                              title="Kursdan chiqarish"
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: 8,
                                border: '1px solid #FECACA',
                                background: '#FEF2F2',
                                color: '#DC2626',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                              }}
                              onMouseOver={(e) => { e.currentTarget.style.background = '#FEE2E2'; }}
                              onMouseOut={(e) => { e.currentTarget.style.background = '#FEF2F2'; }}
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              );
            })()}
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
              <div className="teachers-section-container">
                <div className="teachers-section-header">
                  <div className="teachers-title-wrap">
                    <div className="section-number-icon">10</div>
                    <div>
                      <h4 className="teachers-section-title">O'qituvchilar Ro'yxati</h4>
                      <p className="teachers-section-sub">Kursni o'tadigan murabbiylar va mutaxassislar</p>
                    </div>
                    <span className="teachers-count-pill">
                      {courseForm.teachers.length} ta o'qituvchi
                    </span>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleAddTeacherField}
                    className="btn-add-teacher"
                  >
                    <Plus size={16} />
                    <span>O'qituvchi qo'shish</span>
                  </button>
                </div>

                <div className="teacher-cards-list">
                  {courseForm.teachers.map((t, idx) => {
                    const avatarSrc = t.preview_url || t.current_avatar;
                    return (
                      <div key={idx} className="teacher-card-premium">
                        <div className="teacher-card-topbar">
                          <div className="teacher-badge">
                            <GraduationCap size={15} color="#7C3AED" />
                            <span>O'qituvchi #{idx + 1}</span>
                          </div>
                          {courseForm.teachers.length > 1 && (
                            <button 
                              type="button" 
                              onClick={() => handleRemoveTeacherField(idx)}
                              className="teacher-delete-btn"
                              title="O'qituvchini o'chirish"
                            >
                              <Trash2 size={13} />
                              <span>O'chirish</span>
                            </button>
                          )}
                        </div>

                        <div className="teacher-card-body">
                          {/* Avatar Uploader */}
                          <div className="teacher-avatar-uploader">
                            <input 
                              type="file" 
                              id={`teacher-avatar-file-${idx}`}
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) => handleTeacherChange(idx, 'avatar_file', e.target.files[0])}
                            />
                            <label htmlFor={`teacher-avatar-file-${idx}`} className="teacher-avatar-label" title="Rasmni o'zgartirish uchun bosing">
                              {avatarSrc ? (
                                <div className="teacher-avatar-img-container">
                                  <img src={avatarSrc} alt={t.name || "Teacher"} className="teacher-avatar-img" />
                                  <div className="teacher-avatar-hover-overlay">
                                    <Camera size={18} color="#FFFFFF" />
                                    <span>O'zgartirish</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="teacher-avatar-placeholder">
                                  <div className="teacher-avatar-icon-circle">
                                    <Camera size={17} color="#7C3AED" />
                                  </div>
                                  <span>Rasm tanlash</span>
                                </div>
                              )}
                            </label>
                          </div>

                          {/* Inputs and Meta */}
                          <div className="teacher-inputs-wrap">
                            <div className="teacher-input-row">
                              <div className="teacher-field-group">
                                <label className="teacher-field-label">Ism Familiya *</label>
                                <input 
                                  type="text" 
                                  className="modern-input teacher-input" 
                                  placeholder="Masalan: Ali Valiyev"
                                  value={t.name}
                                  onChange={(e) => handleTeacherChange(idx, 'name', e.target.value)}
                                  required
                                />
                              </div>
                              <div className="teacher-field-group">
                                <label className="teacher-field-label">Yo'nalishi / Mutaxassisligi *</label>
                                <input 
                                  type="text" 
                                  className="modern-input teacher-input" 
                                  placeholder="Masalan: Senior IELTS Instructor"
                                  value={t.role}
                                  onChange={(e) => handleTeacherChange(idx, 'role', e.target.value)}
                                  required
                                />
                              </div>
                            </div>

                            <div className="teacher-avatar-meta-bar">
                              {t.avatar_file ? (
                                <span className="teacher-meta-tag tag-new">
                                  <CheckCircle size={12} /> Yangi rasm: {t.avatar_file.name}
                                </span>
                              ) : t.current_avatar ? (
                                <span className="teacher-meta-tag tag-saved">
                                  <CheckCircle size={12} /> Mavjud rasm saqlanadi (o'zgartirish uchun bosing)
                                </span>
                              ) : (
                                <span className="teacher-meta-tag tag-optional">
                                  📷 Rasm yuklash (ixtiyoriy, kvadrat tavsiya etiladi)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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

      {/* 1. Module Creation / Edit Modal */}
      {isModuleModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: 540 }}>
            <div className="modal-header">
              <h3>{editingModule ? "Modulni Tahrirlash" : "Yangi Modul Yaratish"}</h3>
              <button className="modal-close" onClick={() => setIsModuleModalOpen(false)}>×</button>
            </div>
            <form onSubmit={handleSubmitModule} className="modal-body">
              <div className="form-group">
                <label>Modul Nomi *</label>
                <input 
                  type="text" 
                  className="modern-input"
                  placeholder="Masalan: 1-Modul: Kirish va Asoslar"
                  value={moduleForm.title}
                  onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Video Darslar Soni *</label>
                  <input 
                    type="number" 
                    min="0"
                    className="modern-input"
                    placeholder="Masalan: 10"
                    value={moduleForm.lessons_count}
                    onChange={(e) => setModuleForm({ ...moduleForm, lessons_count: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Testlar Soni *</label>
                  <input 
                    type="number" 
                    min="0"
                    className="modern-input"
                    placeholder="Masalan: 4"
                    value={moduleForm.tests_count}
                    onChange={(e) => setModuleForm({ ...moduleForm, tests_count: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Video Soati (Davomiyligi) *</label>
                  <input 
                    type="text" 
                    className="modern-input"
                    placeholder="Masalan: 4 soat yoki 2.5 soat"
                    value={moduleForm.duration}
                    onChange={(e) => setModuleForm({ ...moduleForm, duration: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tartib Raqami (Navbati) *</label>
                  <input 
                    type="number" 
                    min="1"
                    className="modern-input"
                    placeholder="1"
                    value={moduleForm.order_index}
                    onChange={(e) => setModuleForm({ ...moduleForm, order_index: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer" style={{ marginTop: 16 }}>
                <button type="button" className="btn-cancel" onClick={() => setIsModuleModalOpen(false)}>Bekor qilish</button>
                <button type="submit" className="btn-action-purple" disabled={isModuleSubmitting}>
                  {isModuleSubmitting ? "Saqlanmoqda..." : (editingModule ? "O'zgarishlarni Saqlash" : "Modulni Saqlash")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}





      {/* 4. Certificate Upload Modal */}
      {isCertModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: 520 }}>
            <div className="modal-header">
              <div>
                <h3>Sertifikat Shablonini (PDF) Yuklash</h3>
                <p style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>
                  Ushbu kursni tamomlagan talabalar uchun rasmiy PDF faylini yuklang.
                </p>
              </div>
              <button className="modal-close" onClick={() => setIsCertModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleSubmitCertificate} className="modal-body">
              <div className="form-group">
                <label>Sertifikat Nomi</label>
                <input 
                  type="text" 
                  className="modern-input"
                  placeholder="Masalan: Kurs bitiruv sertifikati"
                  value={certTitle}
                  onChange={(e) => setCertTitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>PDF Fayl Yuklash * (faqat .pdf formatida)</label>
                <input 
                  type="file" 
                  accept="application/pdf"
                  className="modern-input"
                  onChange={(e) => setCertFile(e.target.files[0])}
                  required
                />
                {certFile && (
                  <div style={{ marginTop: 8, fontSize: 13, color: '#059669', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600 }}>
                    <Check size={14} /> Tanlangan fayl: {certFile.name} ({(certFile.size / 1024).toFixed(1)} KB)
                  </div>
                )}
              </div>

              <div className="modal-footer" style={{ marginTop: 18 }}>
                <button type="button" className="btn-cancel" onClick={() => setIsCertModalOpen(false)}>Bekor qilish</button>
                <button type="submit" className="btn-action-purple" disabled={isCertSubmitting || !certFile}>
                  {isCertSubmitting ? "Yuklanmoqda..." : "PDF Faylni Saqlash"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
