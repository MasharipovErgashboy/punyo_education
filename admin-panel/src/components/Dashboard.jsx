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
  FileAudio
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

  // Video Lessons Modal State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [isVideoSubmitting, setIsVideoSubmitting] = useState(false);
  const [videoModuleId, setVideoModuleId] = useState('');
  const [videoList, setVideoList] = useState([
    { title: '', duration: '15 daqiqa', youtube_url: '', description: '', order_index: 1 }
  ]);

  // Test Modal State
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [isTestSubmitting, setIsTestSubmitting] = useState(false);
  const initialTestForm = {
    module_id: '',
    title: '',
    test_type: 'abcd', // 'listening', 'reading', 'writing', 'abcd', 'speaking'
    question: '',
    audio_file: null,
    reading_text: '',
    options: ['', '', '', ''],
    correct_answer: 'A',
    tg_bot_link: '',
    tg_channel: '',
    order_index: 1,
  };
  const [testForm, setTestForm] = useState(initialTestForm);

  // Certificate Modal State
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certFile, setCertFile] = useState(null);
  const [certTitle, setCertTitle] = useState('Kurs bitiruv sertifikati');
  const [isCertSubmitting, setIsCertSubmitting] = useState(false);

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
    setIsVideoModalOpen(true);
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
    setIsVideoModalOpen(true);
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
  const handleOpenCreateTest = () => {
    setEditingTest(null);
    const defaultModId = internalModuleFilter !== 'all' ? internalModuleFilter : (courseModules[0]?.id || '');
    setTestForm({
      module_id: defaultModId,
      title: '',
      test_type: 'abcd',
      question: '',
      audio_file: null,
      reading_text: '',
      options: ['', '', '', ''],
      correct_answer: 'A',
      tg_bot_link: '',
      tg_channel: '',
      order_index: courseTests.length + 1,
    });
    setIsTestModalOpen(true);
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
      question: test.question || '',
      audio_file: null,
      reading_text: test.reading_text || '',
      options: opts,
      correct_answer: test.correct_answer || 'A',
      tg_bot_link: test.tg_bot_link || '',
      tg_channel: test.tg_channel || '',
      order_index: test.order_index || 1,
    });
    setIsTestModalOpen(true);
  };

  const handleSubmitTest = async (e) => {
    e.preventDefault();
    if (!testForm.module_id) {
      alert("Iltimos, avval modulni tanlang!");
      return;
    }
    if (!testForm.title.trim()) {
      alert("Test nomini kiriting!");
      return;
    }

    setIsTestSubmitting(true);
    const formData = new FormData();
    if (editingTest) {
      formData.append('id', editingTest.id);
    }
    formData.append('module_id', testForm.module_id);
    formData.append('title', testForm.title);
    formData.append('test_type', testForm.test_type);
    formData.append('question', testForm.question);
    formData.append('reading_text', testForm.reading_text);
    formData.append('options', JSON.stringify(testForm.options.filter(o => o.trim() !== '')));
    formData.append('correct_answer', testForm.correct_answer);
    formData.append('tg_bot_link', testForm.tg_bot_link);
    formData.append('tg_channel', testForm.tg_channel);
    formData.append('order_index', testForm.order_index);

    if (testForm.audio_file) {
      formData.append('audio', testForm.audio_file);
    }

    try {
      const url = 'http://192.168.0.107:8000/api/course-tests/';
      const method = editingTest ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setIsTestModalOpen(false);
        fetchInternalData(selectedInternalCourse.id);
        fetchCourses();
      } else {
        alert(data.message || "Xatolik yuz berdi");
      }
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
                    className={`nav-sub-item ${activeTab === 'courses' && coursesTab === 'sales' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('courses');
                      setCoursesTab('sales');
                      fetchCourses();
                      fetchCategories();
                    }}
                  >
                    <GraduationCap size={15} /> Kurslar (Sotuv)
                  </div>
                  <div 
                    className={`nav-sub-item ${activeTab === 'courses' && coursesTab === 'internal' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('courses');
                      setCoursesTab('internal');
                      fetchCourses();
                    }}
                  >
                    <Layers size={15} /> Kurs ichki bo'limi
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
            ) : coursesTab === 'internal' ? (
              <div>
                {!selectedInternalCourse ? (
                  <div style={{ background: '#FFFFFF', borderRadius: 20, border: '1px solid #E2E8F0', padding: 24, boxShadow: '0 4px 18px rgba(0,0,0,0.03)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                      <div>
                        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0F172A', marginBottom: 4 }}>Kurslar Ichki Bo'limi</h2>
                        <p style={{ color: '#64748B', fontSize: 13 }}>
                          Mavjud kurslarning modullari, video darsliklari, testlari va sertifikatlarini boshqarish uchun kerakli kurs yonidagi <strong>"Ko'rish"</strong> tugmasini bosing.
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <span className="internal-stat-badge purple">
                          <Layers size={14} /> Jami: {coursesList.length} ta kurs
                        </span>
                      </div>
                    </div>

                    {coursesList.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8' }}>
                        <BookOpen size={48} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                        <p style={{ fontSize: 15, fontWeight: 600 }}>Hozircha sotuv bo'limida kurslar mavjud emas.</p>
                        <p style={{ fontSize: 13 }}>Avval "Kurs sotuv bo'limi"da kurs yarating.</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="users-table">
                          <thead>
                            <tr>
                              <th style={{ width: 50 }}>#</th>
                              <th>Kurs Nomi</th>
                              <th>Kategoriya</th>
                              <th>Modullar</th>
                              <th>Darsliklar</th>
                              <th>Testlar</th>
                              <th>Sertifikat</th>
                              <th style={{ textAlign: 'right' }}>Amal</th>
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
                                        style={{ width: 44, height: 44, borderRadius: 12, objectFit: 'contain', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: 4 }} 
                                      />
                                    ) : (
                                      <div style={{ width: 44, height: 44, borderRadius: 12, background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C3AED' }}>
                                        <GraduationCap size={22} />
                                      </div>
                                    )}
                                    <div>
                                      <div style={{ fontWeight: 800, color: '#0F172A', fontSize: 14 }}>{c.title}</div>
                                      <div style={{ fontSize: 12, color: '#64748B' }}>{c.hint || "Daraja ko'rsatilmagan"}</div>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <span style={{ padding: '4px 10px', borderRadius: 8, background: '#F1F5F9', color: '#475569', fontWeight: 600, fontSize: 12 }}>
                                    {c.category_name}
                                  </span>
                                </td>
                                <td>
                                  <span className="internal-stat-badge purple">
                                    <Layers size={13} /> {c.modules_count || 0} ta modul
                                  </span>
                                </td>
                                <td>
                                  <span className="internal-stat-badge blue">
                                    <Video size={13} /> {c.lessons_count || 0} ta video
                                  </span>
                                </td>
                                <td>
                                  <span className="internal-stat-badge green">
                                    <FileQuestion size={13} /> {c.tests_count || 0} ta test
                                  </span>
                                </td>
                                <td>
                                  {c.has_certificate_file ? (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 9px', borderRadius: 8, background: '#ECFDF5', color: '#059669', fontWeight: 700, fontSize: 11 }}>
                                      <Check size={12} /> Yuklangan (PDF)
                                    </span>
                                  ) : (
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 9px', borderRadius: 8, background: '#F1F5F9', color: '#94A3B8', fontWeight: 600, fontSize: 11 }}>
                                      Yuklanmagan
                                    </span>
                                  )}
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                  <button 
                                    className="btn-view-course"
                                    onClick={() => handleOpenCourseInternal(c)}
                                    title="Kurs tarkibiga kirish"
                                  >
                                    <Eye size={15} /> Ko'rish
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
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
            ) : (
              <div style={{ textAlign: 'center', padding: '80px 20px', background: '#FFFFFF', borderRadius: 20, border: '1px solid #E2E8F0' }}>
                <div style={{ width: 64, height: 64, borderRadius: 32, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#2563EB' }}>
                  <Layers size={32} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', marginBottom: 6 }}>
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

      {/* 2. Video Lessons Modal */}
      {isVideoModalOpen && (
        <div className="modal-overlay">
          <div className="course-modal-container" style={{ maxWidth: 740 }}>
            <div className="modal-header">
              <div>
                <h3>{editingLesson ? "Video Darslikni Tahrirlash" : "Yangi Video Darslik(lar) Qo'shish"}</h3>
                <p style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>
                  Videoni YouTube havolasini kiritib, ketma-ketlik tartibi bilan yarating.
                </p>
              </div>
              <button className="modal-close" onClick={() => setIsVideoModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleSubmitVideos} className="modal-body">
              <div className="form-group">
                <label>Modulni Tanlang *</label>
                <select 
                  className="modern-select"
                  value={videoModuleId}
                  onChange={(e) => setVideoModuleId(e.target.value)}
                  required
                >
                  <option value="">-- Modulni tanlang --</option>
                  {courseModules.map(m => (
                    <option key={m.id} value={m.id}>
                      #{m.order_index} {m.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dynamic Video Forms */}
              <div style={{ marginTop: 12 }}>
                {videoList.map((videoItem, idx) => (
                  <div key={idx} className="multi-video-card">
                    <div className="multi-video-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="lesson-type-icon-box video" style={{ width: 32, height: 32, borderRadius: 8 }}>
                          <Video size={16} />
                        </div>
                        <strong style={{ fontSize: 14, color: '#1E293B' }}>
                          Video #{idx + 1}
                        </strong>
                      </div>
                      {videoList.length > 1 && !editingLesson && (
                        <button 
                          type="button" 
                          className="btn-delete-ad" 
                          style={{ padding: '4px 8px' }}
                          onClick={() => handleRemoveVideoField(idx)}
                          title="Videoni o'chirish"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>Video Nomi *</label>
                        <input 
                          type="text" 
                          className="modern-input"
                          placeholder="Masalan: 1-Dars: Alphabet & Phonics"
                          value={videoItem.title}
                          onChange={(e) => handleUpdateVideoField(idx, 'title', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Davomiyligi *</label>
                        <input 
                          type="text" 
                          className="modern-input"
                          placeholder="Masalan: 15:30 yoki 20 daqiqa"
                          value={videoItem.duration}
                          onChange={(e) => handleUpdateVideoField(idx, 'duration', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label>YouTube Video Linki *</label>
                        <input 
                          type="text" 
                          className="modern-input"
                          placeholder="https://www.youtube.com/watch?v=..."
                          value={videoItem.youtube_url}
                          onChange={(e) => handleUpdateVideoField(idx, 'youtube_url', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Video Navbati (Ketma-ketlik soni) *</label>
                        <input 
                          type="number" 
                          min="1"
                          className="modern-input"
                          placeholder="1"
                          value={videoItem.order_index}
                          onChange={(e) => handleUpdateVideoField(idx, 'order_index', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label>Description (Dars haqida qisqacha izoh)</label>
                      <textarea 
                        className="modern-input"
                        rows="2"
                        placeholder="Ushbu darsda o'rganiladigan asosiy mavzular haqida qisqacha ma'lumot..."
                        value={videoItem.description}
                        onChange={(e) => handleUpdateVideoField(idx, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* + Button to add more video in succession as requested by user */}
              {!editingLesson && (
                <button 
                  type="button" 
                  className="btn-add-more-video"
                  onClick={handleAddVideoField}
                >
                  <Plus size={16} /> + Yana Boshqa Video Qo'shish
                </button>
              )}

              <div className="modal-footer" style={{ marginTop: 14 }}>
                <button type="button" className="btn-cancel" onClick={() => setIsVideoModalOpen(false)}>Bekor qilish</button>
                <button type="submit" className="btn-action-purple" disabled={isVideoSubmitting}>
                  {isVideoSubmitting ? "Saqlanmoqda..." : (editingLesson ? "O'zgarishlarni Saqlash" : `${videoList.length} ta Videoni Saqlash`)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Test Creation / Edit Modal */}
      {isTestModalOpen && (
        <div className="modal-overlay">
          <div className="course-modal-container" style={{ maxWidth: 780 }}>
            <div className="modal-header">
              <div>
                <h3>{editingTest ? "Testni Tahrirlash" : "Yangi Test Yaratish"}</h3>
                <p style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>
                  Test turini tanlang (Eshitish, O'qish, Yozish, ABCD, Gapirish) va tegishli maydonlarni to'ldiring.
                </p>
              </div>
              <button className="modal-close" onClick={() => setIsTestModalOpen(false)}>×</button>
            </div>

            <form onSubmit={handleSubmitTest} className="modal-body">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Modulni Tanlang *</label>
                  <select 
                    className="modern-select"
                    value={testForm.module_id}
                    onChange={(e) => setTestForm({ ...testForm, module_id: e.target.value })}
                    required
                  >
                    <option value="">-- Modulni tanlang --</option>
                    {courseModules.map(m => (
                      <option key={m.id} value={m.id}>
                        #{m.order_index} {m.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Test Nomi *</label>
                  <input 
                    type="text" 
                    className="modern-input"
                    placeholder="Masalan: Listening Section 1 yoki Grammar Test"
                    value={testForm.title}
                    onChange={(e) => setTestForm({ ...testForm, title: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* 5 Test Types Selector */}
              <div className="form-group">
                <label>Test Turi (5 xil turdan birini tanlang) *</label>
                <div className="test-type-selector-grid">
                  <button 
                    type="button" 
                    className={`test-type-btn ${testForm.test_type === 'listening' ? 'active' : ''}`}
                    onClick={() => setTestForm({ ...testForm, test_type: 'listening' })}
                  >
                    <Headphones size={20} color="#EA580C" />
                    <span>Eshitish</span>
                  </button>

                  <button 
                    type="button" 
                    className={`test-type-btn ${testForm.test_type === 'reading' ? 'active' : ''}`}
                    onClick={() => setTestForm({ ...testForm, test_type: 'reading' })}
                  >
                    <BookOpen size={20} color="#059669" />
                    <span>O'qish</span>
                  </button>

                  <button 
                    type="button" 
                    className={`test-type-btn ${testForm.test_type === 'writing' ? 'active' : ''}`}
                    onClick={() => setTestForm({ ...testForm, test_type: 'writing' })}
                  >
                    <FileText size={20} color="#D97706" />
                    <span>Yozish</span>
                  </button>

                  <button 
                    type="button" 
                    className={`test-type-btn ${testForm.test_type === 'abcd' ? 'active' : ''}`}
                    onClick={() => setTestForm({ ...testForm, test_type: 'abcd' })}
                  >
                    <FileQuestion size={20} color="#7C3AED" />
                    <span>ABCD</span>
                  </button>

                  <button 
                    type="button" 
                    className={`test-type-btn ${testForm.test_type === 'speaking' ? 'active' : ''}`}
                    onClick={() => setTestForm({ ...testForm, test_type: 'speaking' })}
                  >
                    <Mic size={20} color="#E11D48" />
                    <span>Gapirish</span>
                  </button>
                </div>
              </div>

              {/* DYNAMIC FIELDS PER TEST TYPE */}
              {/* 1. Eshitish (Listening) */}
              {testForm.test_type === 'listening' && (
                <div style={{ background: '#FFF7ED', border: '1px solid #FFEDD5', borderRadius: 16, padding: 20, marginBottom: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <Headphones size={18} color="#EA580C" />
                    <strong style={{ color: '#9A3412', fontSize: 14 }}>Eshitish (Listening) Test Maydonlari</strong>
                  </div>

                  <div className="form-group">
                    <label>Audio Fayl Yuklash (MP3, WAV, M4A) *</label>
                    <input 
                      type="file" 
                      accept="audio/*" 
                      className="modern-input"
                      onChange={(e) => setTestForm({ ...testForm, audio_file: e.target.files[0] })}
                      required={!editingTest}
                    />
                    {editingTest && editingTest.audio_url && !testForm.audio_file && (
                      <span style={{ fontSize: 12, color: '#EA580C', marginTop: 4, display: 'block' }}>
                        🎵 Mavjud audio saqlanadi (o'zgartirish uchun yangi fayl tanlang)
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Savol / Topshiriq Matni *</label>
                    <input 
                      type="text" 
                      className="modern-input"
                      placeholder="Masalan: What is the speaker's main purpose?"
                      value={testForm.question}
                      onChange={(e) => setTestForm({ ...testForm, question: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Variantlar va To'g'ri Javobni Belgilang *</label>
                    <div className="options-editor-grid">
                      {['A', 'B', 'C', 'D'].map((letter, idx) => (
                        <div key={letter} className="option-edit-row">
                          <div className="option-letter-badge">{letter}</div>
                          <input 
                            type="text" 
                            className="modern-input"
                            style={{ flex: 1 }}
                            placeholder={`${letter} varianti matni`}
                            value={testForm.options[idx] || ''}
                            onChange={(e) => {
                              const newOpts = [...testForm.options];
                              newOpts[idx] = e.target.value;
                              setTestForm({ ...testForm, options: newOpts });
                            }}
                            required
                          />
                          <label className="correct-option-radio">
                            <input 
                              type="radio" 
                              name="listening_correct_answer" 
                              checked={testForm.correct_answer === letter}
                              onChange={() => setTestForm({ ...testForm, correct_answer: letter })}
                            />
                            To'g'ri javob
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. O'qish (Reading) */}
              {testForm.test_type === 'reading' && (
                <div style={{ background: '#ECFDF5', border: '1px solid #D1FAE5', borderRadius: 16, padding: 20, marginBottom: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <BookOpen size={18} color="#059669" />
                    <strong style={{ color: '#065F46', fontSize: 14 }}>O'qish (Reading) Test Maydonlari</strong>
                  </div>

                  <div className="form-group">
                    <label>Uzun Matn (Reading Passage) *</label>
                    <textarea 
                      className="modern-input"
                      rows="6"
                      placeholder="Talaba o'qishi kerak bo'lgan to'liq matn (passage)ni bu yerga kiriting..."
                      value={testForm.reading_text}
                      onChange={(e) => setTestForm({ ...testForm, reading_text: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Savol *</label>
                    <input 
                      type="text" 
                      className="modern-input"
                      placeholder="Masalan: According to the passage, why did the author..."
                      value={testForm.question}
                      onChange={(e) => setTestForm({ ...testForm, question: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Variantlar va To'g'ri Javob *</label>
                    <div className="options-editor-grid">
                      {['A', 'B', 'C', 'D'].map((letter, idx) => (
                        <div key={letter} className="option-edit-row">
                          <div className="option-letter-badge">{letter}</div>
                          <input 
                            type="text" 
                            className="modern-input"
                            style={{ flex: 1 }}
                            placeholder={`${letter} varianti matni`}
                            value={testForm.options[idx] || ''}
                            onChange={(e) => {
                              const newOpts = [...testForm.options];
                              newOpts[idx] = e.target.value;
                              setTestForm({ ...testForm, options: newOpts });
                            }}
                            required
                          />
                          <label className="correct-option-radio">
                            <input 
                              type="radio" 
                              name="reading_correct_answer" 
                              checked={testForm.correct_answer === letter}
                              onChange={() => setTestForm({ ...testForm, correct_answer: letter })}
                            />
                            To'g'ri javob
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Yozish (Writing) */}
              {testForm.test_type === 'writing' && (
                <div style={{ background: '#FFFBEB', border: '1px solid #FEF3C7', borderRadius: 16, padding: 20, marginBottom: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <FileText size={18} color="#D97706" />
                    <strong style={{ color: '#92400E', fontSize: 14 }}>Yozish (Writing) Test Maydonlari</strong>
                  </div>

                  <div className="form-group">
                    <label>Savol / Esse Mavzusi (Writing Prompt) *</label>
                    <textarea 
                      className="modern-input"
                      rows="3"
                      placeholder="Masalan: Some people think that universities should provide graduates with the knowledge and skills needed in the workplace. To what extent do you agree or disagree?"
                      value={testForm.question}
                      onChange={(e) => setTestForm({ ...testForm, question: e.target.value })}
                      required
                    />
                  </div>

                  <div style={{ background: '#FEF3C7', padding: '10px 14px', borderRadius: 10, fontSize: 13, color: '#92400E' }}>
                    💡 <strong>Izoh:</strong> Yozish turida faqat savol/topshiriq kiritiladi. Mobil ilovada talaba ushbu topshiriqqa o'z matnini yozish uchun maxsus input ko'rinadi.
                  </div>
                </div>
              )}

              {/* 4. ABCD (Multiple Choice) */}
              {testForm.test_type === 'abcd' && (
                <div style={{ background: '#FAF5FF', border: '1px solid #EDE9FE', borderRadius: 16, padding: 20, marginBottom: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <FileQuestion size={18} color="#7C3AED" />
                    <strong style={{ color: '#6D28D9', fontSize: 14 }}>ABCD Belgilaydigan Test Maydonlari</strong>
                  </div>

                  <div className="form-group">
                    <label>Savol *</label>
                    <input 
                      type="text" 
                      className="modern-input"
                      placeholder="Masalan: She ____ to school every day."
                      value={testForm.question}
                      onChange={(e) => setTestForm({ ...testForm, question: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Variantlar va To'g'ri Javob *</label>
                    <div className="options-editor-grid">
                      {['A', 'B', 'C', 'D'].map((letter, idx) => (
                        <div key={letter} className="option-edit-row">
                          <div className="option-letter-badge">{letter}</div>
                          <input 
                            type="text" 
                            className="modern-input"
                            style={{ flex: 1 }}
                            placeholder={`${letter} varianti (masalan: goes)`}
                            value={testForm.options[idx] || ''}
                            onChange={(e) => {
                              const newOpts = [...testForm.options];
                              newOpts[idx] = e.target.value;
                              setTestForm({ ...testForm, options: newOpts });
                            }}
                            required
                          />
                          <label className="correct-option-radio">
                            <input 
                              type="radio" 
                              name="abcd_correct_answer" 
                              checked={testForm.correct_answer === letter}
                              onChange={() => setTestForm({ ...testForm, correct_answer: letter })}
                            />
                            To'g'ri javob
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Gapirish (Speaking) */}
              {testForm.test_type === 'speaking' && (
                <div style={{ background: '#FFF1F2', border: '1px solid #FFE4E6', borderRadius: 16, padding: 20, marginBottom: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <Mic size={18} color="#E11D48" />
                    <strong style={{ color: '#9F1239', fontSize: 14 }}>Gapirish (Speaking) Test Maydonlari</strong>
                  </div>

                  <div className="form-group">
                    <label>Savol / Gapirish Mavzusi *</label>
                    <textarea 
                      className="modern-input"
                      rows="2"
                      placeholder="Masalan: Describe a memorable journey you took. You should say where you went, who with, and why it was memorable."
                      value={testForm.question}
                      onChange={(e) => setTestForm({ ...testForm, question: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label>Telegram Bot Linki *</label>
                      <input 
                        type="text" 
                        className="modern-input"
                        placeholder="https://t.me/punyo_speaking_bot"
                        value={testForm.tg_bot_link}
                        onChange={(e) => setTestForm({ ...testForm, tg_bot_link: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Telegram Kanal ID / Username *</label>
                      <input 
                        type="text" 
                        className="modern-input"
                        placeholder="@punyo_speaking yoki kanal ID"
                        value={testForm.tg_channel}
                        onChange={(e) => setTestForm({ ...testForm, tg_channel: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div style={{ background: '#FFE4E6', padding: '10px 14px', borderRadius: 10, fontSize: 13, color: '#9F1239' }}>
                    🎙️ <strong>Izoh:</strong> Talaba mobil ilovada ushbu savolni o'qiydi va "Topshiriqni topshirish" tugmasini bosganda ko'rsatilgan Telegram botga o'tib audio xabar orqali javob yuboradi.
                  </div>
                </div>
              )}

              {/* Order index */}
              <div className="form-group">
                <label>Tartib Raqami (Navbati) *</label>
                <input 
                  type="number" 
                  min="1"
                  className="modern-input"
                  placeholder="1"
                  value={testForm.order_index}
                  onChange={(e) => setTestForm({ ...testForm, order_index: e.target.value })}
                  required
                />
              </div>

              <div className="modal-footer" style={{ marginTop: 16 }}>
                <button type="button" className="btn-cancel" onClick={() => setIsTestModalOpen(false)}>Bekor qilish</button>
                <button type="submit" className="btn-action-purple" disabled={isTestSubmitting}>
                  {isTestSubmitting ? "Saqlanmoqda..." : (editingTest ? "O'zgarishlarni Saqlash" : "Testni Saqlash")}
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
