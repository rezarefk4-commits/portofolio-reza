import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js'; // BUKA KOMENTAR INI DI VS CODE

import { 
  Home, User, MessageSquare, Folder, Mic, Users, FileText, 
  Briefcase, GraduationCap, Lightbulb, Link as LinkIcon,
  Download, Sun, Moon, Menu, X, ChevronRight, ArrowLeft, Plus, Edit, Trash2, Settings,
  PlayCircle, Calendar, MapPin, Code, Palette, Terminal, Lock, Send,
  ExternalLink, Share2, Clock, Target, CheckCircle, Search, Video,
  Mail, Phone, Save, UploadCloud, Check, Image as ImageIcon,
  Database, Monitor, Smartphone, Server, Zap, TrendingUp, BarChart3
} from 'lucide-react';

import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Helmet, HelmetProvider } from 'react-helmet-async';

// ============================================================================
// INISIALISASI SUPABASE (VITE ENV)
// ============================================================================
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- IKON MEREK KUSTOM (SVG MURNI) ---
const BrandIcon = ({ name, size = 20, className = "" }) => {
  if (name === 'instagram') return <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
  if (name === 'threads') return <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 12.5C14.5 13.8807 13.3807 15 12 15C10.6193 15 9.5 13.8807 9.5 12.5C9.5 11.1193 10.6193 10 12 10C13.3807 10 14.5 11.1193 14.5 12.5Z" /><path d="M14.5 12.5V11.5C14.5 9.84315 13.1569 8.5 11.5 8.5H11C9.34315 8.5 8 9.84315 8 11.5V12.5C8 14.1569 9.34315 15.5 11 15.5H11.5C12.3284 15.5 13 14.8284 13 14" /><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.238 2.22416 14.4239 2.63214 15.5218C3.04013 16.6197 3.61439 17.6253 4.33157 18.5" /></svg>;
  if (name === 'tiktok') return <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>;
  if (name === 'linkedin') return <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>;
  return <LinkIcon size={size} className={className} />;
};

// --- ANIMASI ANGKA ---
const CountUp = ({ end, duration = 2000, suffix = "" }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0; const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); } 
      else { setCount(Math.floor(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);
  return <span>{count}{suffix}</span>;
};

// --- EFEK TYPING (LOOPING TEXT) ---
const TypingText = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout;
    if (!text) return;

    if (!isDeleting && displayText === text) {
      timeout = setTimeout(() => setIsDeleting(true), 2500); // Tunggu 2.5 dtk sebelum menghapus
    } else if (isDeleting && displayText === '') {
      timeout = setTimeout(() => setIsDeleting(false), 500); // Tunggu 0.5 dtk sebelum mengetik ulang
    } else {
      timeout = setTimeout(() => {
        setDisplayText(text.substring(0, displayText.length + (isDeleting ? -1 : 1)));
      }, isDeleting ? 40 : 100); // Kecepatan ngetik: 100ms, hapus: 40ms
    }
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, text]);

 return (
    <span className="border-r-[3px] border-blue-500 pr-1 animate-[blink_1s_step-end_infinite] inline-block">
      {displayText || '\u200B'}
    </span>
  );
};

// ============================================================================
// DATA FALLBACK AWAL
// ============================================================================
const initialProfile = {
  name: 'REZA REFKA KURNIAWAN',
  role: 'AI-Driven Web Developer',
  bio: 'Saya membangun aplikasi web dan seluler modern dengan fokus pada performa dan pengalaman pengguna. Aktif berbagi wawasan teknologi dan membimbing talenta digital.',
  email: 'rezarefka@gmail.com',
  whatsapp: '+62 821 5402 5446',
  location: 'Makassar, Indonesia',
  profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  heroImage: '', 
  cvUrl: '',
  socials: { instagram: 'https://instagram.com/', threads: 'https://threads.net/', tiktok: 'https://tiktok.com/', linkedin: 'https://linkedin.com/' }
};

const initialStats = { visits24h: 1240, activeNow: 14, projectEngagement: 85, totalViews: 45200 };
const initialProjects = [];
const initialBlogs = [];

const translations = {
  id: {
    main: 'Utama', home: 'Beranda', about: 'Tentang', contact: 'Kontak', portfolio: 'Portofolio', technical: 'Technical', creative: 'Creative', thoughts: 'Thoughts', professional: 'Profesional', experience: 'Pengalaman', education: 'Pendidikan', skills: 'Keahlian', links: 'Tautan', downloadCv: 'Unduh CV', darkMode: 'Mode Gelap', lightMode: 'Mode Terang', dashboard: 'Dasbor', btnContact: 'Hubungi Saya', btnPortfolio: 'Lihat Portofolio',
    whatIDo: 'Keahlian Utama', featuredProjects: 'Proyek Unggulan', featuredProjectsDesc: 'Karya teknikal utama yang menunjukkan keahlian.', viewAllPortfolio: 'Lihat Semua', latestBlogs: 'Thoughts Terbaru', readAllBlogs: 'Lihat Semua Tulisan', readMore: 'Baca Selengkapnya', back: 'Kembali', share: 'Bagikan', backToProjects: 'Kembali ke Karya',
    contactTitle: 'Kontak', contactSubtitle: 'Hubungi saya untuk kolaborasi atau pertanyaan', email: 'Email', whatsapp: 'WhatsApp', location: 'Lokasi', workingHours: 'Jam Kerja', response: 'Respon', responseDesc: 'Saya biasanya membalas pesan dalam waktu 1 jam.', workingHoursMonFri: 'Senin - Jumat', workingHoursSatSun: 'Sabtu - Minggu',
    formName: 'Nama Lengkap', formEmail: 'Email', formSubject: 'Subjek', formMessage: 'Pesan', formSend: 'Kirim Pesan', plName: 'Nama Anda', plEmail: 'email@contoh.com', plSubject: 'Perihal', plMessage: 'Tulis pesan...',
    technicalTitle: 'Proyek Teknikal', creativeTitle: 'Karya Kreatif', portfolioSub: 'Koleksi proyek teknis dan pengembangan sistem', creativeSub: 'Eksplorasi visual, branding, dan desain', overview: 'Ikhtisar', techUsed: 'Teknologi Digunakan', client: 'Klien', duration: 'Durasi', year: 'Tahun', role: 'Peran', status: 'Status', viewLive: 'Lihat Langsung', sourceCode: 'Kode Sumber', tags: 'Tag', projectLinks: 'Tautan Proyek', notAvailable: 'Tidak tersedia', featured: 'Unggulan', noProjects: 'Karya tidak ditemukan.', projectGoals: 'Tujuan Proyek', keyFeatures: 'Fitur Utama', challenges: 'Tantangan & Solusi', outcomes: 'Hasil', projectInfo: 'Informasi Proyek', organizedBy: 'Klien / Organizer', creativeStory: 'Cerita di Balik Karya', gallery: 'Galeri Visual', viewGallery: 'Lihat Galeri', creativeCTA: 'Punya Ide Kreatif?', creativeCTADesc: 'Mari ciptakan mahakarya visual bersama.', btnStartDiscuss: 'Mulai Diskusi',
    thoughtsTitle: 'Blog & Tulisan', thoughtsSub: 'Artikel dan tutorial teknologi', searchPlaceholder: 'Cari artikel...', searchBtn: 'Cari', all: 'Semua', readText: 'baca', noArticles: 'Artikel tidak ditemukan.', blogKnowledgeSession: 'Sesi Pengetahuan', blogWhyImportant: 'Mengapa Ini Penting?', blogAdaptation: 'Adaptasi sangat penting untuk terus berkembang.',
    aboutTitle: 'Tentang Saya', aboutSubtitle: 'Mengenal lebih dekat', aboutP1: 'Memiliki passion dalam membangun solusi digital berdampak.', aboutP2: 'Selain mengembangkan aplikasi, saya juga aktif berbagi pengetahuan.', aboutP3: 'Selalu terbuka untuk berkolaborasi!', philosophy: 'Filosofi', values: 'Nilai-Nilai', hobbies: 'Hobi & Minat', mySkills: 'Alat & Teknologi', mySkillsDesc: 'Teknologi yang saya gunakan.', linkDesc: 'Tautan penting.',
    val1Title: 'Inovasi', val1Desc: 'Mencari cara baru dan lebih baik.', val2Title: 'Kualitas', val2Desc: 'Standar tertinggi.', val3Title: 'Kolaborasi', val3Desc: 'Kerja sama tim.', val4Title: 'Keberlanjutan', val4Desc: 'Solusi jangka panjang.', hob1Title: 'Membaca', hob1Desc: 'Buku teknologi.', hob2Title: 'Olahraga', hob2Desc: 'Futsal & Lari.', hob3Title: 'Gaming', hob3Desc: 'Game Strategi.',
    yearsExp: 'Tahun Pengalaman', totalWorks: 'Total Karya', articles: 'Tulisan / Artikel', happyClients: 'Klien Puas', collabTitle: 'Mari Berkolaborasi', collabDesc: 'Punya ide proyek atau ingin berdiskusi? Hubungi saya kapan saja.', sendEmail: 'Kirim Email',
    expTitle: 'Pengalaman', expDesc: 'Rekam jejak karir profesional saya.', noExp: 'Belum ada data pengalaman.', eduTitle: 'Pendidikan', eduDesc: 'Latar belakang pendidikan saya.', noEdu: 'Belum ada data pendidikan.',
    notFound: 'Data tidak ditemukan.', shareSuccess: 'Tautan disalin!', shareError: 'Gagal membagikan.'
  },
  en: {
    main: 'Main', home: 'Home', about: 'About', contact: 'Contact', portfolio: 'Portfolio', technical: 'Technical', creative: 'Creative', thoughts: 'Thoughts', professional: 'Professional', experience: 'Experience', education: 'Education', skills: 'Skills', links: 'Links', downloadCv: 'Download CV', darkMode: 'Dark Mode', lightMode: 'Light Mode', dashboard: 'Dashboard', btnContact: 'Contact Me', btnPortfolio: 'View Portfolio',
    whatIDo: 'Core Skills', featuredProjects: 'Featured Projects', featuredProjectsDesc: 'Main technical works showcasing my skills.', viewAllPortfolio: 'View All', latestBlogs: 'Latest Thoughts', readAllBlogs: 'View All Writings', readMore: 'Read More', back: 'Back', share: 'Share', backToProjects: 'Back to Works',
    contactTitle: 'Contact', contactSubtitle: 'Reach out for collaboration', email: 'Email', whatsapp: 'WhatsApp', location: 'Location', workingHours: 'Working Hours', response: 'Response Time', responseDesc: 'I usually reply within 1 hour.', workingHoursMonFri: 'Monday - Friday', workingHoursSatSun: 'Saturday - Sunday',
    formName: 'Full Name', formEmail: 'Email', formSubject: 'Subject', formMessage: 'Message', formSend: 'Send Message', plName: 'Your Name', plEmail: 'email@example.com', plSubject: 'Subject', plMessage: 'Write message...',
    technicalTitle: 'Technical Projects', creativeTitle: 'Creative Works', portfolioSub: 'System development and technical projects', creativeSub: 'Visual explorations, branding, and design', overview: 'Overview', techUsed: 'Technologies Used', client: 'Client', duration: 'Duration', year: 'Year', role: 'Role', status: 'Status', viewLive: 'View Live', sourceCode: 'Source Code', tags: 'Tags', projectLinks: 'Project Links', notAvailable: 'Not available', featured: 'Featured', noProjects: 'No works found.', projectGoals: 'Project Goals', keyFeatures: 'Key Features', challenges: 'Challenges', outcomes: 'Outcomes', projectInfo: 'Project Info', organizedBy: 'Client / Organizer', creativeStory: 'The Story Behind', gallery: 'Visual Gallery', viewGallery: 'View Gallery', creativeCTA: 'Have a Creative Idea?', creativeCTADesc: 'Let\'s create a visual masterpiece together.', btnStartDiscuss: 'Start Discussing',
    thoughtsTitle: 'Blog & Writings', thoughtsSub: 'Articles and tech tutorials', searchPlaceholder: 'Search articles...', searchBtn: 'Search', all: 'All', readText: 'read', noArticles: 'No articles found.', blogKnowledgeSession: 'Knowledge Session', blogWhyImportant: 'Why Is This Important?', blogAdaptation: 'Adaptation is crucial for growth.',
    aboutTitle: 'About Me', aboutSubtitle: 'Getting to know closer', aboutP1: 'Passionate about building impactful digital solutions.', aboutP2: 'Active in sharing tech knowledge.', aboutP3: 'Always open to collaborate!', philosophy: 'Philosophy', values: 'Values', hobbies: 'Hobbies', mySkills: 'Tools & Technologies', mySkillsDesc: 'Technologies I use.', linkDesc: 'My important links.',
    yearsExp: 'Years Experience', totalWorks: 'Total Projects', articles: 'Articles', happyClients: 'Happy Clients', collabTitle: 'Let\'s Collaborate', collabDesc: 'Have a project idea or want to discuss? Reach out.', sendEmail: 'Send Email',
    expTitle: 'Experience', expDesc: 'My professional career track.', noExp: 'No experience data yet.', eduTitle: 'Education', eduDesc: 'My educational background.', noEdu: 'No education data yet.',
    notFound: 'Data not found.', shareSuccess: 'Link copied!', shareError: 'Failed to share link.'
  }
};

const getIcon = (name) => {
  switch(name) { case 'Code': return Code; case 'Terminal': return Terminal; case 'Lightbulb': return Lightbulb; case 'Mic': return Mic; case 'Palette': return Palette; case 'Database': return Database; case 'Monitor': return Monitor; case 'Smartphone': return Smartphone; case 'Server': return Server; default: return Code; }
};

// --- REUSABLE COMPONENTS ---
const NavItem = ({ icon: Icon, label, path, isActive, delayClass, onNavigate }) => (
  <button onClick={() => onNavigate(path)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 text-[14px] font-bold reveal-on-scroll ${delayClass} ${isActive ? 'bg-blue-600/10 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-700/50 shadow-[inset_0_0_15px_rgba(59,130,246,0.1)] transform scale-[1.02]' : 'text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-100 active:scale-95'}`}>
    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'} />{label}
  </button>
);

const DetailCard = ({ title, content, children, icon: Icon, delay, t }) => (
  <div className={`glass-panel rounded-[2rem] p-6 md:p-8 mb-6 w-full reveal-on-scroll border border-white/60 dark:border-white/10 shadow-sm delay-${delay}`}>
    <h3 className="text-[16px] font-extrabold text-gray-900 dark:text-white mb-4 flex items-center gap-3">{Icon && <Icon size={22} className="text-blue-500" />} {title}</h3>
    {content ? (<div className="text-gray-600 dark:text-gray-300 text-[14.5px] leading-relaxed whitespace-pre-wrap font-medium">{(content === 'Not available' || content === 'Tidak tersedia' || content === 'Not available') ? <span className="text-gray-400 italic">{t.notAvailable}</span> : content}</div>) : children}
  </div>
);

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean']
  ],
  clipboard: { matchVisual: false }
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================
export default function App() {
  const [theme, setTheme] = useState('dark');
  const [lang, setLang] = useState('id'); 
  const [currentPath, setCurrentPath] = useState('/home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [blogContent, setBlogContent] = useState('');

  // DATABASE STATES
  const [profile, setProfile] = useState(initialProfile);
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [links, setLinks] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);

  // CMS STATES & UPLOAD
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [cmsTab, setCmsTab] = useState('overview'); 
  const [modalType, setModalType] = useState(null); 
  const [editingItem, setEditingItem] = useState(null); 
  const [defaultProjType, setDefaultProjType] = useState('technical');
  
  const [previewImage, setPreviewImage] = useState(''); 
  const [profileTempImg, setProfileTempImg] = useState(''); 
  const [heroTempImg, setHeroTempImg] = useState(''); 
  const [cvFileObj, setCvFileObj] = useState(''); 
  const [cvFileName, setCvFileName] = useState('');
  
  const [toastMessage, setToastMessage] = useState(null);
  const [secretClickCount, setSecretClickCount] = useState(0);
  const [requiredClicks, setRequiredClicks] = useState(5);
  const [adminPassword, setAdminPassword] = useState('admin');
  const [isUploading, setIsUploading] = useState(false); 

  const [thoughtsSearch, setThoughtsSearch] = useState('');
  const [thoughtsFilter, setThoughtsFilter] = useState('All');
  const [localStats, setLocalStats] = useState(initialStats);

  const isModalOpen = modalType !== null;
  const t = translations[lang] || translations['id'];

  // --- KOMPONEN DYNAMIC SEO ---
  const SEO = ({ title, desc, img }) => {
    const pageTitle = title ? `${title} | ${profile.name}` : profile.name;
    const pageDesc = desc || profile.bio;
    const pageImg = img || profile.profileImage;
    return (
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={pageImg} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
    );
  };

  // ============================================================================
  // FETCH DATA DARI SUPABASE
  // ============================================================================
  useEffect(() => {
    const fetchSupabaseData = async () => {
      if (!supabase) { setProjects(initialProjects); setBlogs(initialBlogs); return; }
      try {
        console.log("Mengambil data dari Supabase...");
        const [ 
          { data: projData }, { data: blogData }, { data: expData }, 
          { data: eduData }, { data: skillData }, { data: linkData }, 
          { data: servData }, { data: profData } 
        ] = await Promise.all([
          supabase.from('projects').select('*').order('year', { ascending: false }),
          supabase.from('blogs').select('*').order('date', { ascending: false }),
          supabase.from('experiences').select('*'),
          supabase.from('educations').select('*'),
          supabase.from('skills').select('*'),
          supabase.from('links').select('*'),
          supabase.from('services').select('*'),
          supabase.from('profile').select('*').single()
        ]);

        if (projData && projData.length > 0) setProjects(projData); else setProjects(initialProjects);
        if (blogData && blogData.length > 0) setBlogs(blogData); else setBlogs(initialBlogs);
        if (expData && expData.length > 0) setExperiences(expData);
        if (eduData && eduData.length > 0) setEducations(eduData);
        if (skillData && skillData.length > 0) setSkills(skillData);
        if (linkData && linkData.length > 0) setLinks(linkData);
        if (servData && servData.length > 0) setServices(servData);
        
        if (profData) {
          setProfile({ 
            ...initialProfile, ...profData,
            whatsapp: profData.whatsapp || initialProfile.whatsapp, email: profData.email || initialProfile.email,
            name: profData.name || initialProfile.name, role: profData.role || initialProfile.role,
            location: profData.location || initialProfile.location, bio: profData.bio || initialProfile.bio,
            heroImage: profData.heroImage || initialProfile.heroImage,
            socials: { ...initialProfile.socials, ...(profData.socials || {}) } 
          });
        }
      } catch (error) { console.error("Gagal menarik data:", error); setProjects(initialProjects); setBlogs(initialBlogs); }
    };
    fetchSupabaseData();
  }, []);

  // UI Effects
  useEffect(() => { if (theme === 'dark') document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); }, [theme]);
  useEffect(() => { if (secretClickCount > 0) { const timer = setTimeout(() => setSecretClickCount(0), 1500); return () => clearTimeout(timer); } }, [secretClickCount]);
  useEffect(() => { if (toastMessage) { const timer = setTimeout(() => setToastMessage(null), 3000); return () => clearTimeout(timer); } }, [toastMessage]);

  // Handlers
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  const navigate = (path) => { setCurrentPath(path); setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const showToast = (message) => setToastMessage(message);

  const handleShare = async (title, text) => {
    const shareData = { title, text, url: window.location.href };
    if (navigator.share) { try { await navigator.share(shareData); showToast(t.shareSuccess); } catch (err) { }
    } else { navigator.clipboard.writeText(window.location.href); showToast(t.shareSuccess); }
  };

  const handleSecretClick = () => {
    const newCount = secretClickCount + 1; setSecretClickCount(newCount);
    if (newCount === requiredClicks) { navigate('/dashboard'); setSecretClickCount(0); showToast('🔓 Halaman CMS Terbuka'); } 
    else { showToast(`Akses CMS: Tap ${newCount}/${requiredClicks}`); }
  };

  const handleLogin = (e) => { e.preventDefault(); if (loginPassword === adminPassword) { setIsAuthenticated(true); setLoginPassword(''); showToast('Berhasil Masuk CMS'); } else { showToast('Kata Sandi Salah!'); } };

  const openModal = (type, item = null, projType = 'technical') => { 
    setModalType(type); setEditingItem(item); setDefaultProjType(projType); 
    setPreviewImage(item ? (item.image || item.thumbnail || item.img || '') : ''); 
    if (type === 'blog') setBlogContent(item ? (item.content || '') : '');
  };
  
  const closeModal = () => { setModalType(null); setEditingItem(null); setPreviewImage(''); setBlogContent(''); };
  
  // File Input Handlers
  const handleImageUpload = (e) => { const file = e.target.files[0]; if (file) setPreviewImage(file); };
  const handleProfileImageUpload = (e) => { const file = e.target.files[0]; if (file) setProfileTempImg(file); };
  const handleHeroImageUpload = (e) => { const file = e.target.files[0]; if (file) setHeroTempImg(file); }; 
  const handleCvUpload = (e) => { const file = e.target.files[0]; if (file) { setCvFileObj(file); setCvFileName(file.name); } };
  
  const handleDownloadCV = () => {
    if (profile.cvUrl) { const a = document.createElement('a'); a.href = profile.cvUrl; a.target = "_blank"; a.download = "CV.pdf"; document.body.appendChild(a); a.click(); document.body.removeChild(a); showToast('Mengunduh CV...'); } 
    else { showToast('CV belum diunggah.'); }
  };

  // ============================================================================
  // FUNGSI UPLOAD FILE KE SUPABASE STORAGE
  // ============================================================================
  const uploadFileToSupabase = async (file, bucketName = 'portfolio') => {
    if (!supabase) return URL.createObjectURL(file); 
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data, error } = await supabase.storage.from(bucketName).upload(filePath, file, { cacheControl: '3600', upsert: false });
      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(filePath);
      return publicUrl;
    } catch (error) {
      console.error("Gagal mengunggah file:", error);
      throw error;
    }
  };

  // ============================================================================
  // SUPABASE: SIMPAN DATA CMS (TEXT + FILES)
  // ============================================================================
  const handleSaveData = async (e) => {
    e.preventDefault(); 
    setIsUploading(true);
    const formData = new FormData(e.target); 
    const id = editingItem ? editingItem.id : `item-${Date.now()}`; 
    const defaultImage = 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?auto=format&fit=crop&q=80&w=800';
    
    let tableName = '';
    let newItem = { id };
    let finalImageUrl = editingItem?.image || editingItem?.thumbnail || editingItem?.img || defaultImage;

    try {
      if (previewImage) { showToast('Mengunggah media...'); finalImageUrl = await uploadFileToSupabase(previewImage); }

      if (modalType === 'project') { 
        tableName = 'projects';
        newItem = { ...newItem, title: formData.get('title'), shortDesc: formData.get('shortDesc'), type: formData.get('type'), category: formData.get('category'), image: finalImageUrl, tech: (formData.get('tech') || '').split(',').map(text => text.trim()).filter(Boolean), client: formData.get('client'), year: formData.get('year'), featured: formData.get('featured') === 'on' }; 
      }
      else if (modalType === 'blog') { 
        tableName = 'blogs';
        newItem = { ...newItem, title: formData.get('title'), summary: formData.get('summary'), date: formData.get('date'), readTime: formData.get('readTime'), tag: formData.get('tag'), thumbnail: previewImage || (editingItem?.thumbnail || defaultImage), content: blogContent }; 
      }
      else if (modalType === 'skill') { 
        tableName = 'skills';
        newItem = { ...newItem, name: formData.get('name'), img: previewImage ? finalImageUrl : (formData.get('imgUrlFallback') || finalImageUrl), invert: formData.get('invert') === 'on' }; 
      }
      else if (modalType === 'link') { 
        tableName = 'links';
        newItem = { ...newItem, label: formData.get('label'), url: formData.get('url'), desc: formData.get('desc') }; 
      }
      else if (modalType === 'experience') { 
        tableName = 'experiences';
        newItem = { ...newItem, role: formData.get('role'), company: formData.get('company'), period: formData.get('period'), desc: formData.get('desc') }; 
      }
      else if (modalType === 'education') { 
        tableName = 'educations';
        newItem = { ...newItem, degree: formData.get('degree'), institution: formData.get('institution'), period: formData.get('period'), desc: formData.get('desc') }; 
      }
      else if (modalType === 'service') { 
        tableName = 'services';
        newItem = { ...newItem, title: formData.get('title'), desc: formData.get('desc'), icon: formData.get('icon') }; 
      }
      
      if (supabase) { showToast('Menyimpan ke database...'); await supabase.from(tableName).upsert(newItem); }
      
      if (tableName === 'projects') setProjects(editingItem ? projects.map(p => p.id === id ? newItem : p) : [newItem, ...projects]); 
      if (tableName === 'blogs') setBlogs(editingItem ? blogs.map(b => b.id === id ? newItem : b) : [newItem, ...blogs]); 
      if (tableName === 'skills') setSkills(editingItem ? skills.map(s => s.id === id ? newItem : s) : [...skills, newItem]); 
      if (tableName === 'links') setLinks(editingItem ? links.map(l => l.id === id ? newItem : l) : [...links, newItem]); 
      if (tableName === 'experiences') setExperiences(editingItem ? experiences.map(e => e.id === id ? newItem : e) : [newItem, ...experiences]); 
      if (tableName === 'educations') setEducations(editingItem ? educations.map(e => e.id === id ? newItem : e) : [newItem, ...educations]); 
      if (tableName === 'services') setServices(editingItem ? services.map(s => s.id === id ? newItem : s) : [newItem, ...services]); 

      showToast('Selesai!');
      closeModal();
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

 const handleProfileSave = async (e) => {
    e.preventDefault(); 
    setIsUploading(true);
    const formData = new FormData(e.target);
    
    let finalProfileImgUrl = profile.profileImage;
    let finalHeroImgUrl = profile.heroImage;
    let finalCvUrl = profile.cvUrl;

    try {
      // 1. Upload Media
      if (profileTempImg) { showToast('Mengunggah foto profil...'); finalProfileImgUrl = await uploadFileToSupabase(profileTempImg); }
      if (heroTempImg) { showToast('Mengunggah foto beranda...'); finalHeroImgUrl = await uploadFileToSupabase(heroTempImg); } 
      if (cvFileObj) { showToast('Mengunggah dokumen CV...'); finalCvUrl = await uploadFileToSupabase(cvFileObj); }

      // 2. Susun data Profile
      const newProfile = { 
        id: 1, 
        name: formData.get('name'), role: formData.get('role'), bio: formData.get('bio'), 
        email: formData.get('email'), whatsapp: formData.get('whatsapp'), location: formData.get('location'), 
        profileImage: finalProfileImgUrl, 
        heroImage: finalHeroImgUrl, 
        cvUrl: finalCvUrl, 
        socials: { instagram: formData.get('instagram') || '', threads: formData.get('threads') || '', tiktok: formData.get('tiktok') || '', linkedin: formData.get('linkedin') || '' } 
      };

      // 3. Simpan ke Supabase
      if (supabase) {
        showToast('Menyimpan ke database...');
        await supabase.from('profile').upsert(newProfile);
      }
      
      setProfile(newProfile);
      setProfileTempImg(''); setHeroTempImg(''); setCvFileObj(''); setCvFileName('');
      showToast('Profil & Media tersinkronisasi!');
    } catch (err) { 
      showToast(`Error: ${err.message}`); 
    } finally {
      setIsUploading(false);
    }
  };

  const handleAdminSave = (e) => { e.preventDefault(); setAdminPassword(new FormData(e.target).get('password')); setRequiredClicks(Number(new FormData(e.target).get('clicks'))); showToast('Keamanan diperbarui!'); };

  // ==========================================================================
  // RENDER SIDEBAR
  // ==========================================================================
  const renderSidebar = () => (
    <aside className={`fixed inset-y-0 left-0 z-40 w-[280px] max-w-[85vw] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0 glass-panel border-r-0 lg:border-r border-white/40 dark:border-white/5 shadow-[20px_0_40px_-15px_rgba(0,0,0,0.05)] lg:shadow-none ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col items-center pt-10 pb-6 border-b border-black/5 dark:border-white/5 shrink-0 px-4 relative group w-full overflow-hidden">
        <div className="relative">
          <img src={profile.profileImage} alt="Profile" onClick={handleSecretClick} className="w-24 h-24 rounded-full object-cover mb-4 ring-[4px] ring-white/60 dark:ring-slate-700/50 shadow-2xl cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 bg-white" />
        </div>
        <h2 className="text-[19px] font-extrabold text-gray-800 dark:text-white text-center leading-snug tracking-tight drop-shadow-sm break-words w-full px-2">{profile.name}</h2>
        <p className="text-[12px] text-blue-600 dark:text-blue-400 mt-2 font-black text-center tracking-widest uppercase bg-blue-50/50 dark:bg-blue-900/20 px-3 py-1.5 rounded-xl shadow-[inset_0_0_10px_rgba(59,130,246,0.1)] w-fit max-w-[95%] break-words leading-tight">{profile.role}</p>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-6 space-y-7">
        <div>
          <h3 className="text-[11px] font-black text-gray-400 dark:text-gray-500 mb-3 px-2 uppercase tracking-widest">{t.main}</h3>
          <div className="space-y-1.5">
            <NavItem icon={Home} label={t.home} path="/home" onNavigate={navigate} isActive={currentPath === '/home'} delayClass="delay-100" />
            <NavItem icon={User} label={t.about} path="/about" onNavigate={navigate} isActive={currentPath === '/about'} delayClass="delay-100" />
            <NavItem icon={MessageSquare} label={t.contact} path="/contact" onNavigate={navigate} isActive={currentPath === '/contact'} delayClass="delay-200" />
          </div>
        </div>
        <div>
          <h3 className="text-[11px] font-black text-gray-400 dark:text-gray-500 mb-3 px-2 uppercase tracking-widest">{t.portfolio}</h3>
          <div className="space-y-1.5">
            <NavItem icon={Code} label={t.technical} path="/technical" onNavigate={navigate} isActive={currentPath.startsWith('/technical')} delayClass="delay-200" />
            <NavItem icon={Palette} label={t.creative} path="/creative" onNavigate={navigate} isActive={currentPath.startsWith('/creative')} delayClass="delay-300" />
            <NavItem icon={FileText} label={t.thoughts} path="/thoughts" onNavigate={navigate} isActive={currentPath.startsWith('/thoughts')} delayClass="delay-300" />
          </div>
        </div>
        <div>
          <h3 className="text-[11px] font-black text-gray-400 dark:text-gray-500 mb-3 px-2 uppercase tracking-widest">{t.professional}</h3>
          <div className="space-y-1.5">
            <NavItem icon={Briefcase} label={t.experience} path="/experience" onNavigate={navigate} isActive={currentPath === '/experience'} delayClass="delay-400" />
            <NavItem icon={GraduationCap} label={t.education} path="/education" onNavigate={navigate} isActive={currentPath === '/education'} delayClass="delay-500" />
            <NavItem icon={Lightbulb} label={t.skills} path="/skills" onNavigate={navigate} isActive={currentPath === '/skills'} delayClass="delay-500" />
            <NavItem icon={LinkIcon} label={t.links} path="/links" onNavigate={navigate} isActive={currentPath === '/links'} delayClass="delay-600" />
          </div>
        </div>
      </div>

      <div className="px-5 py-6 border-t border-black/5 dark:border-white/5 flex flex-col items-center gap-4 shrink-0 bg-white/5 dark:bg-black/20 backdrop-blur-md">
        <div className="flex rounded-xl p-1 bg-gray-100/50 dark:bg-slate-800/50 border border-black/5 dark:border-white/5 shadow-inner w-full justify-center">
          <button onClick={() => setLang('id')} className={`px-6 py-2 text-xs font-bold rounded-lg transition-all flex-1 ${lang === 'id' ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>ID</button>
          <button onClick={() => setLang('en')} className={`px-6 py-2 text-xs font-bold rounded-lg transition-all flex-1 ${lang === 'en' ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>EN</button>
        </div>
        <div className="w-full space-y-3 flex flex-col items-center">
          <div className="flex justify-center gap-3 w-full pb-2">
              {profile.socials?.instagram && <a href={profile.socials.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 hover:scale-110 transition-all shadow-sm"><BrandIcon name="instagram" size={18}/></a>}
              {profile.socials?.threads && <a href={profile.socials.threads} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:scale-110 transition-all shadow-sm"><BrandIcon name="threads" size={18}/></a>}
              {profile.socials?.tiktok && <a href={profile.socials.tiktok} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:scale-110 transition-all shadow-sm"><BrandIcon name="tiktok" size={18}/></a>}
              {profile.socials?.linkedin && <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110 transition-all shadow-sm"><BrandIcon name="linkedin" size={18}/></a>}
          </div>
          <button onClick={handleDownloadCV} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-gray-900 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95"><Download size={18} /> {t.downloadCv}</button>
          <button onClick={toggleTheme} className="w-full py-3.5 rounded-xl glass-panel hover:bg-white/90 dark:hover:bg-slate-800/90 text-gray-800 dark:text-gray-200 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 border-white/60 dark:border-white/10">{theme === 'light' ? <Sun size={18} className="text-orange-500"/> : <Moon size={18} className="text-blue-400"/>} {theme === 'light' ? t.darkMode : t.lightMode}</button>
        </div>
      </div>
    </aside>
  );

  // ==========================================================================
  // RENDER MAIN CONTENT
  // ==========================================================================
  const renderContent = () => {
// --- HOME ---
    if (currentPath === '/home') return (
      <div className="max-w-5xl mx-auto space-y-24 pb-24 w-full animate-page-enter overflow-hidden">
        <SEO title="Beranda" />
        
        {/* --- HERO SECTION: SPLIT LAYOUT (FOTO PERSEGI PANJANG) --- */}
        <div className="relative flex flex-col-reverse lg:flex-row items-center justify-between min-h-[75vh] w-full pt-10 lg:pt-0 gap-12 lg:gap-10 z-10">
          
          {/* KONTEN TEKS (Kiri) - Muncul Bertahap */}
          <div className="relative w-full lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left z-20">
            
            {/* Deretan Ikon Sosial Media */}
            <div className="flex gap-5 mb-6 reveal-on-scroll" style={{ animationDelay: '0.1s' }}>
               {profile.socials?.instagram && <a href={profile.socials.instagram} target="_blank" rel="noreferrer" className="text-gray-400 dark:text-gray-500 hover:text-blue-500 transition-colors"><BrandIcon name="instagram" size={18}/></a>}
               {profile.socials?.threads && <a href={profile.socials.threads} target="_blank" rel="noreferrer" className="text-gray-400 dark:text-gray-500 hover:text-blue-500 transition-colors"><BrandIcon name="threads" size={18}/></a>}
               {profile.socials?.tiktok && <a href={profile.socials.tiktok} target="_blank" rel="noreferrer" className="text-gray-400 dark:text-gray-500 hover:text-blue-500 transition-colors"><BrandIcon name="tiktok" size={18}/></a>}
               {profile.socials?.linkedin && <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="text-gray-400 dark:text-gray-500 hover:text-blue-500 transition-colors"><BrandIcon name="linkedin" size={18}/></a>}
            </div>
            
            {/* Judul dengan Efek Typing */}
            <h1 className="font-black text-gray-900 dark:text-white leading-[1.2] mb-6 tracking-tighter w-full reveal-on-scroll" style={{ animationDelay: '0.2s' }}>
              <span className="block mb-1 text-[clamp(2rem,4vw,3.5rem)] capitalize">
                {lang === 'id' ? 'Saya ' : "I'm "} {profile.name},
              </span>
              <span className="text-blue-500 drop-shadow-sm block min-h-[50px] md:min-h-[60px] text-[clamp(1.5rem,2.5vw,2.2rem)] w-full">
                <TypingText text={profile.role} />
              </span>
            </h1>
            
            {/* Deskripsi Bio */}
            <p className="text-[14px] md:text-[15px] text-gray-600 dark:text-gray-400 font-medium mb-10 max-w-md leading-relaxed z-20 relative reveal-on-scroll" style={{ animationDelay: '0.3s' }}>
              {profile.bio}
            </p>
            
            {/* Tombol Membulat */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto z-20 relative reveal-on-scroll" style={{ animationDelay: '0.4s' }}>
               <button onClick={() => { const el = document.getElementById('portfolio-categories'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="px-8 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-black transition-all shadow-[0_8px_20px_rgba(59,130,246,0.3)] hover:-translate-y-1 active:scale-95 flex items-center justify-center text-[12px] uppercase tracking-widest">
                 MY WORK
               </button>
               <button onClick={() => navigate('/contact')} className="px-8 py-3.5 rounded-full bg-white dark:bg-white text-gray-900 font-black transition-all shadow-md hover:shadow-xl hover:-translate-y-1 active:scale-95 text-[12px] uppercase tracking-widest border border-gray-200">
                 HIRE ME
               </button>
            </div>
          </div>

          {/* FOTO KANAN (Kartu Persegi Panjang Elegan) */}
          <div className="w-full lg:w-[45%] h-[400px] lg:h-[500px] relative group rounded-[2rem] overflow-hidden shadow-2xl border border-white/60 dark:border-white/10 reveal-on-scroll z-20" style={{ animationDelay: '0.5s' }}>
             <img 
               src={profile.heroImage || profile.profileImage} 
               alt="Hero Portrait" 
               className="w-full h-full object-cover object-center transition-all duration-700 ease-in-out grayscale group-hover:grayscale-0 scale-100 group-hover:scale-105" 
             />
             {/* Overlay gradasi tipis di bawah foto agar tidak kaku */}
             <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
          </div>
          
          {/* Elemen Dekorasi Bias Cahaya di Latar */}
          <div className="absolute top-[10%] right-[10%] w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -z-10 reveal-on-scroll" style={{ animationDelay: '0.6s' }}></div>
        </div>

        {/* --- KOTAK STATISTIK --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full">
           <div className="glass-panel p-6 rounded-[2rem] flex flex-col items-center justify-center text-center group hover:border-blue-400 transition-all hover:-translate-y-1 border border-white/60 dark:border-white/10 reveal-on-scroll" style={{ animationDelay: '0.1s' }}><Briefcase className="text-blue-500 mb-3 group-hover:scale-110 transition-transform" size={28} /><p className="text-[26px] font-black text-gray-900 dark:text-white drop-shadow-sm"><CountUp end={4} suffix="+" /></p><p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-1">{t.yearsExp}</p></div>
           <div className="glass-panel p-6 rounded-[2rem] flex flex-col items-center justify-center text-center group hover:border-blue-400 transition-all hover:-translate-y-1 border border-white/60 dark:border-white/10 reveal-on-scroll" style={{ animationDelay: '0.2s' }}><Code className="text-green-500 mb-3 group-hover:scale-110 transition-transform" size={28} /><p className="text-[26px] font-black text-gray-900 dark:text-white drop-shadow-sm"><CountUp end={projects.length} /></p><p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-1">{t.totalWorks}</p></div>
           <div className="glass-panel p-6 rounded-[2rem] flex flex-col items-center justify-center text-center group hover:border-purple-400 transition-all hover:-translate-y-1 border border-white/60 dark:border-white/10 reveal-on-scroll" style={{ animationDelay: '0.3s' }}><FileText className="text-purple-500 mb-3 group-hover:scale-110 transition-transform" size={28} /><p className="text-[26px] font-black text-gray-900 dark:text-white drop-shadow-sm"><CountUp end={blogs.length} /></p><p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-1">{t.articles}</p></div>
           <div className="glass-panel p-6 rounded-[2rem] flex flex-col items-center justify-center text-center group hover:border-orange-400 transition-all hover:-translate-y-1 border border-white/60 dark:border-white/10 reveal-on-scroll" style={{ animationDelay: '0.4s' }}><Users className="text-orange-500 mb-3 group-hover:scale-110 transition-transform" size={28} /><p className="text-[26px] font-black text-gray-900 dark:text-white drop-shadow-sm"><CountUp end={10} suffix="+" /></p><p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-1">{t.happyClients}</p></div>
        </div>

        {/* SECTION BARU: KETIGA KATEGORI KARYA */}
        <div id="portfolio-categories" className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full scroll-mt-24 pt-4">
           <div onClick={() => navigate('/technical')} className="glass-panel p-8 rounded-[2rem] flex flex-col items-center justify-center text-center group hover:border-blue-400 hover:-translate-y-2 transition-all cursor-pointer border border-white/60 dark:border-white/10 shadow-sm hover:shadow-2xl hover:shadow-blue-500/20 reveal-on-scroll" style={{ animationDelay: '0.1s' }}>
              <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Code size={36} /></div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Technical</h3>
              <p className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">{projects.filter(p=>p.type==='technical').length} Karya Kode</p>
           </div>
           <div onClick={() => navigate('/creative')} className="glass-panel p-8 rounded-[2rem] flex flex-col items-center justify-center text-center group hover:border-purple-400 hover:-translate-y-2 transition-all cursor-pointer border border-white/60 dark:border-white/10 shadow-sm hover:shadow-2xl hover:shadow-purple-500/20 reveal-on-scroll" style={{ animationDelay: '0.2s' }}>
              <div className="w-20 h-20 bg-purple-50 dark:bg-purple-900/30 text-purple-500 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Palette size={36} /></div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Creative</h3>
              <p className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">{projects.filter(p=>p.type==='creative').length} Karya Visual</p>
           </div>
           <div onClick={() => navigate('/thoughts')} className="glass-panel p-8 rounded-[2rem] flex flex-col items-center justify-center text-center group hover:border-orange-400 hover:-translate-y-2 transition-all cursor-pointer border border-white/60 dark:border-white/10 shadow-sm hover:shadow-2xl hover:shadow-orange-500/20 reveal-on-scroll" style={{ animationDelay: '0.3s' }}>
              <div className="w-20 h-20 bg-orange-50 dark:bg-orange-900/30 text-orange-500 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><FileText size={36} /></div>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Thoughts</h3>
              <p className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">{blogs.length} Tulisan</p>
           </div>
        </div>

        <div className="glass-panel p-8 md:p-12 rounded-[2rem] w-full reveal-on-scroll shadow-sm border border-white/60 dark:border-white/10" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8 text-center tracking-tight">{t.whatIDo}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((srv, idx) => { const IconComp = getIcon(srv.icon); return (<div key={srv.id} className="p-5 border border-black/10 dark:border-white/10 rounded-xl bg-white/40 dark:bg-slate-800/40 flex gap-4 hover:shadow-md transition-all items-start group reveal-on-scroll" style={{ animationDelay: `${0.2 + (idx * 0.1)}s` }}><div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-slate-700/50 flex items-center justify-center shrink-0 shadow-sm"><IconComp size={18} className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" /></div><div><h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-1">{srv.title}</h3><p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium">{srv.desc}</p></div></div>)})}
            {services.length === 0 && <p className="col-span-2 text-center text-gray-500">Belum ada layanan ditambahkan.</p>}
          </div>
        </div>

        <div className="glass-panel p-8 md:p-12 rounded-[2rem] w-full reveal-on-scroll shadow-sm border border-white/60 dark:border-white/10" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8 text-center tracking-tight">{t.featuredProjects}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.filter(p => p.type === 'technical' && p.featured).slice(0, 4).map((proj, idx) => (
               <div key={proj.id} onClick={() => navigate(`/technical/${proj.id}`)} className="p-6 border border-black/10 dark:border-white/10 rounded-xl bg-white/40 dark:bg-slate-800/40 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col group reveal-on-scroll" style={{ animationDelay: `${0.2 + (idx * 0.1)}s` }}><h3 className="text-[18px] font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">{proj.title}</h3><p className="text-[13.5px] text-gray-500 dark:text-gray-400 line-clamp-2 flex-grow mb-5 font-medium">{proj.shortDesc}</p><div className="flex flex-wrap gap-2 mt-auto">{(proj.tech || []).slice(0, 4).map(tItem => <span key={tItem} className="text-[11px] font-bold bg-gray-100 dark:bg-slate-700/50 text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-md border border-black/5 dark:border-white/5">{tItem}</span>)}</div></div>
            ))}
            {projects.filter(p => p.type === 'technical' && p.featured).length === 0 && <p className="col-span-2 text-center text-gray-500 text-sm py-4">Belum ada karya unggulan.</p>}
          </div>
          <div className="mt-8 flex justify-center reveal-on-scroll" style={{ animationDelay: '0.6s' }}><button onClick={() => navigate('/technical')} className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 text-gray-800 dark:text-gray-200 rounded-xl text-sm font-bold shadow-sm hover:scale-105 active:scale-95 transition-transform">{t.viewAllPortfolio} <ExternalLink size={16} className="ml-1" /></button></div>
        </div>

        <div className="glass-panel p-8 md:p-12 rounded-[2rem] w-full reveal-on-scroll shadow-sm border border-white/60 dark:border-white/10" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8 text-center tracking-tight">{t.latestBlogs}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {blogs.slice(0, 4).map((blog, idx) => (
               <div key={blog.id} onClick={() => navigate(`/thoughts/${blog.id}`)} className="p-5 border border-black/10 dark:border-white/10 rounded-2xl bg-white/40 dark:bg-slate-800/40 hover:shadow-md transition-all duration-300 cursor-pointer flex gap-5 group items-center reveal-on-scroll" style={{ animationDelay: `${0.2 + (idx * 0.1)}s` }}>
                 <img src={blog.thumbnail} className="w-24 h-24 rounded-xl object-cover border border-white/50 dark:border-white/10 shrink-0" alt="" />
                 <div className="flex-1 min-w-0">
                   <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 block">{blog.tag}</span>
                   <h3 className="text-[16px] font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 leading-snug">{blog.title}</h3>
                   <p className="text-[12px] font-bold text-gray-500 flex items-center gap-1.5"><Calendar size={12}/>{blog.date}</p>
                 </div>
               </div>
            ))}
            {blogs.length === 0 && <p className="col-span-2 text-center text-gray-500 text-sm py-4">Belum ada tulisan terbaru.</p>}
          </div>
          <div className="mt-8 flex justify-center reveal-on-scroll" style={{ animationDelay: '0.6s' }}><button onClick={() => navigate('/thoughts')} className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 text-gray-800 dark:text-gray-200 rounded-xl text-sm font-bold shadow-sm hover:scale-105 active:scale-95 transition-transform">{t.readAllBlogs} <ExternalLink size={16} className="ml-1" /></button></div>
        </div>

        <footer className="w-full pt-12 reveal-on-scroll" style={{ animationDelay: '0.2s' }}>
          <div className="glass-panel p-10 md:p-16 rounded-[3rem] text-center w-full relative overflow-hidden bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-white/60 dark:border-white/10 shadow-lg">
             <div className="relative z-10">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">{t.collabTitle}</h2>
                <p className="text-[15px] text-gray-600 dark:text-gray-400 max-w-lg mx-auto mb-10 font-medium">{t.collabDesc}</p>
                <div className="flex flex-wrap justify-center gap-5 mb-12">
                   <a href={`mailto:${profile.email || ''}`} className="flex items-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-md"><Mail size={18}/> {t.sendEmail}</a>
                   <a href={`https://wa.me/${(profile.whatsapp || '').replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-8 py-4 glass-panel text-gray-900 dark:text-white rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-sm border border-black/10 dark:border-white/10"><Phone size={18}/> WhatsApp</a>
                </div>
                <div className="flex justify-center gap-6 border-t border-black/5 dark:border-white/10 pt-10">
                   {profile.socials?.instagram && <a href={profile.socials.instagram} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl glass-panel flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110 transition-all border border-white/60 dark:border-white/10 shadow-sm"><BrandIcon name="instagram" size={20}/></a>}
                   {profile.socials?.threads && <a href={profile.socials.threads} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl glass-panel flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:scale-110 transition-all border border-white/60 dark:border-white/10 shadow-sm"><BrandIcon name="threads" size={20}/></a>}
                   {profile.socials?.tiktok && <a href={profile.socials.tiktok} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl glass-panel flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:scale-110 transition-all border border-white/60 dark:border-white/10 shadow-sm"><BrandIcon name="tiktok" size={20}/></a>}
                   {profile.socials?.linkedin && <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="w-12 h-12 rounded-xl glass-panel flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-110 transition-all border border-white/60 dark:border-white/10 shadow-sm"><BrandIcon name="linkedin" size={20}/></a>}
                </div>
             </div>
          </div>
          <div className="mt-8 mb-4 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest px-4 reveal-on-scroll" style={{ animationDelay: '0.4s' }}><p>© {new Date().getFullYear()} {profile.name}.</p><p className="flex items-center gap-1.5">Powered by <Code size={14} className="text-blue-500"/> & Coffee</p></div>
        </footer>
      </div>
    );

    // --- ABOUT ---
    if (currentPath === '/about') return (
      <div className="max-w-4xl mx-auto pt-6 w-full pb-20 animate-page-enter">
        <SEO title={t.aboutTitle} />
        <div className="mb-10 reveal-on-scroll delay-0"><h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">{t.aboutTitle}</h1><p className="text-[16px] text-gray-600 dark:text-gray-400 font-medium">{t.aboutSubtitle} {profile.name}</p></div>
        <div className="space-y-6">
          <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] w-full reveal-on-scroll delay-100 space-y-6 text-[15px] text-gray-700 dark:text-gray-300 font-medium border border-white/60 dark:border-white/10"><p>{t.aboutP1}</p><p>{t.aboutP2}</p><p>{t.aboutP3}</p></div>
          <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] w-full reveal-on-scroll delay-200 border border-white/60 dark:border-white/10"><h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{t.philosophy}</h3><ul className="list-disc pl-5 md:pl-8 text-[15px] font-medium text-gray-700 dark:text-gray-300 space-y-3"><li>Teknologi harus mempermudah, bukan mempersulit</li><li>Kode yang baik adalah kode yang dapat dipahami</li><li>Pembelajaran adalah proses seumur hidup</li></ul></div>
          <div className="glass-panel p-8 md:p-10 rounded-[2.5rem] w-full reveal-on-scroll delay-300 border border-white/60 dark:border-white/10"><h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">{t.values}</h3><div className="grid grid-cols-1 md:grid-cols-2 gap-5"><div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-[2rem] p-6 hover:shadow-md transition-all"><h4 className="font-bold text-gray-900 dark:text-white text-[15px] mb-2">{t.val1Title}</h4><p className="text-[14px] font-medium text-gray-600 dark:text-gray-400 leading-relaxed">{t.val1Desc}</p></div><div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-[2rem] p-6 hover:shadow-md transition-all"><h4 className="font-bold text-gray-900 dark:text-white text-[15px] mb-2">{t.val2Title}</h4><p className="text-[14px] font-medium text-gray-600 dark:text-gray-400 leading-relaxed">{t.val2Desc}</p></div><div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-[2rem] p-6 hover:shadow-md transition-all"><h4 className="font-bold text-gray-900 dark:text-white text-[15px] mb-2">{t.val3Title}</h4><p className="text-[14px] font-medium text-gray-600 dark:text-gray-400 leading-relaxed">{t.val3Desc}</p></div><div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/60 dark:border-white/10 rounded-[2rem] p-6 hover:shadow-md transition-all"><h4 className="font-bold text-gray-900 dark:text-white text-[14px] mb-2">{t.val4Title}</h4><p className="text-[14px] font-medium text-gray-600 dark:text-gray-400 leading-relaxed">{t.val4Desc}</p></div></div></div>
        </div>
      </div>
    );

    // --- CONTACT ---
    if (currentPath === '/contact') return (
      <div className="max-w-5xl mx-auto pt-6 w-full pb-20 animate-page-enter">
        <SEO title={t.contactTitle} />
        <div className="mb-10 reveal-on-scroll delay-0"><h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">{t.contactTitle}</h1><p className="text-[16px] text-gray-600 dark:text-gray-400 font-medium">{t.contactSubtitle}</p></div>
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          <div className="w-full lg:w-2/3 glass-panel p-8 md:p-10 rounded-[3rem] border border-white/60 dark:border-white/10 reveal-on-scroll delay-100">
            <form className="space-y-6 w-full" onSubmit={(e) => { e.preventDefault(); showToast('Pesan Terkirim!'); e.target.reset(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-2">{t.formName}</label><input required className="w-full px-5 py-3.5 rounded-2xl glass-panel outline-none focus:ring-2 focus:ring-blue-500 border-white/60 dark:border-white/10" /></div><div><label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-2">{t.formEmail}</label><input type="email" required className="w-full px-5 py-3.5 rounded-2xl glass-panel outline-none focus:ring-2 focus:ring-blue-500 border-white/60 dark:border-white/10" /></div></div>
              <div><label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-2">{t.formSubject}</label><input required className="w-full px-5 py-3.5 rounded-2xl glass-panel outline-none focus:ring-2 focus:ring-blue-500 border-white/60 dark:border-white/10" /></div>
              <div><label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-2">{t.formMessage}</label><textarea required rows="5" className="w-full px-5 py-3.5 rounded-2xl glass-panel outline-none resize-none focus:ring-2 focus:ring-blue-500 border-white/60 dark:border-white/10"></textarea></div>
              <button type="submit" className="py-4 px-8 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform"><Send size={18}/> {t.formSend}</button>
            </form>
          </div>
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <div className="glass-panel p-8 md:p-10 rounded-[3rem] border border-white/60 dark:border-white/10 space-y-6 reveal-on-scroll delay-200">
               <div className="flex gap-4 items-start"><div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center"><Mail size={18}/></div><div className="flex-1 min-w-0"><h4 className="text-[15px] font-bold dark:text-white">{t.email}</h4><p className="text-[14px] text-gray-500 break-all">{profile.email}</p></div></div>
               <div className="flex gap-4 items-start"><div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center"><Phone size={18}/></div><div className="flex-1 min-w-0"><h4 className="text-[15px] font-bold dark:text-white">{t.whatsapp}</h4><p className="text-[14px] text-gray-500 break-all">{profile.whatsapp}</p></div></div>
               <div className="pt-4 border-t border-black/5 dark:border-white/10 flex justify-start gap-4">
                  {profile.socials?.instagram && <a href={profile.socials.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-pink-600 hover:scale-110 transition-all shadow-sm"><BrandIcon name="instagram" size={18}/></a>}
                  {profile.socials?.threads && <a href={profile.socials.threads} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:scale-110 transition-all shadow-sm"><BrandIcon name="threads" size={18}/></a>}
                  {profile.socials?.tiktok && <a href={profile.socials.tiktok} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:scale-110 transition-all shadow-sm"><BrandIcon name="tiktok" size={18}/></a>}
                  {profile.socials?.linkedin && <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:scale-110 transition-all shadow-sm"><BrandIcon name="linkedin" size={18}/></a>}
               </div>
            </div>
          </div>
        </div>
      </div>
    );

    // --- EXPERIENCE & EDUCATION ---
    if (currentPath === '/experience') return (
      <div className="max-w-4xl mx-auto pt-6 w-full pb-20 animate-page-enter">
        <SEO title={t.expTitle} />
        <h1 className="text-4xl font-black dark:text-white mb-2 tracking-tight flex items-center gap-4"><Briefcase className="text-blue-500" size={32}/> {t.expTitle}</h1>
        <p className="text-[16px] text-gray-600 dark:text-gray-400 font-medium mb-12 border-b border-black/5 dark:border-white/10 pb-6">{t.expDesc}</p>
        <div className="border-l-[3px] border-blue-200 dark:border-blue-900/50 ml-4 md:ml-8 space-y-12">
          {experiences.map(exp => (
            <div key={exp.id} className="relative pl-8 md:pl-12"><div className="absolute w-6 h-6 bg-blue-500 rounded-full -left-[13.5px] top-1.5 ring-[6px] ring-[#F8FAFC] dark:ring-[#05050A]"></div><div className="glass-panel p-8 rounded-[2.5rem] border border-white/60 dark:border-white/10 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"><span className="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3.5 py-1.5 rounded-lg text-[13px] font-bold mb-4 inline-block">{exp.period}</span><h3 className="text-2xl font-black dark:text-white mb-2">{exp.role}</h3><h4 className="font-bold text-gray-600 dark:text-gray-400 mb-5">{exp.company}</h4><p className="text-[15px] font-medium text-gray-700 dark:text-gray-300">{exp.desc}</p></div></div>
          ))}
          {experiences.length === 0 && <div className="pl-8 text-gray-500">{t.noExp}</div>}
        </div>
      </div>
    );

    if (currentPath === '/education') return (
      <div className="max-w-5xl mx-auto pt-6 w-full pb-20 animate-page-enter">
        <SEO title={t.eduTitle} />
        <h1 className="text-4xl font-black dark:text-white mb-2 tracking-tight flex items-center gap-4"><GraduationCap className="text-blue-500" size={32}/> {t.eduTitle}</h1>
        <p className="text-[16px] text-gray-600 dark:text-gray-400 font-medium mb-12 border-b border-black/5 dark:border-white/10 pb-6">{t.eduDesc}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {educations.map(edu => (
             <div key={edu.id} className="glass-panel p-8 md:p-10 rounded-[3rem] hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 border border-white/60 dark:border-white/10"><div className="w-16 h-16 bg-white/60 dark:bg-slate-800/60 text-blue-600 dark:text-blue-400 rounded-[1.2rem] flex items-center justify-center mb-6 shadow-sm"><GraduationCap size={32}/></div><span className="text-[12px] font-bold text-gray-600 dark:text-gray-300 bg-white/50 dark:bg-black/20 px-3.5 py-1.5 rounded-lg mb-4 inline-block shadow-sm">{edu.period}</span><h3 className="text-2xl font-black dark:text-white mb-2 leading-snug">{edu.degree}</h3><h4 className="font-bold text-gray-600 dark:text-gray-400 mb-5">{edu.institution}</h4><p className="text-[14.5px] font-medium text-gray-700 dark:text-gray-300">{edu.desc}</p></div>
          ))}
          {educations.length === 0 && <div className="col-span-2 text-center py-10 text-gray-500">{t.noEdu}</div>}
        </div>
      </div>
    );

    if (currentPath === '/skills') return (
      <div className="max-w-5xl mx-auto pt-6 w-full pb-20 animate-page-enter">
        <SEO title={t.skillsTitle || t.mySkills} />
        <h1 className="text-4xl font-black dark:text-white mb-2">{t.skillsTitle || t.mySkills}</h1>
        <p className="text-[16px] text-gray-600 dark:text-gray-400 font-medium mb-12 border-b border-black/5 dark:border-white/10 pb-6">{t.skillsDesc || t.mySkillsDesc}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
          {skills.map(s => (<div key={s.id} className="glass-panel p-6 rounded-[2rem] flex flex-col items-center gap-5 hover:-translate-y-2 hover:shadow-xl transition-all border border-white/60 dark:border-white/10"><div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/50 dark:bg-slate-800/50 p-3 rounded-2xl shadow-sm"><img src={s.img} className={`w-full h-full object-contain ${s.invert ? 'dark:invert' : ''}`} alt=""/></div><h3 className="font-bold dark:text-white">{s.name}</h3></div>))}
        </div>
      </div>
    );

    if (currentPath === '/links') return (
      <div className="max-w-2xl mx-auto pt-12 w-full pb-20 animate-page-enter text-center">
        <SEO title={t.links} />
        <img src={profile.profileImage} alt="Profile" className="w-28 h-28 rounded-full border-[6px] border-white/60 dark:border-slate-700 shadow-2xl object-cover mx-auto mb-5 animate-float" />
        <h1 className="text-3xl font-black dark:text-white mb-2 tracking-tight">{profile.name}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 font-bold uppercase tracking-widest text-[11px] mb-12">{t.linkDesc}</p>
        <div className="space-y-5 w-full">{links.map(l => (<a key={l.id} href={l.url} target="_blank" rel="noreferrer" className="block w-full p-6 glass-panel rounded-[2rem] text-left hover:-translate-y-1 hover:shadow-2xl transition-all border border-white/60 dark:border-white/10 flex justify-between items-center group"><div className="min-w-0 flex-1"><h3 className="font-black dark:text-white text-lg group-hover:text-blue-500 transition-colors">{l.label}</h3><p className="text-gray-500 font-bold mt-1">{l.desc}</p></div><div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-400 group-hover:text-blue-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-all shadow-sm"><ExternalLink size={18} /></div></a>))}</div>
      </div>
    );

    // --- TECHNICAL LIST ---
    if (currentPath === '/technical') {
      const filtered = projects.filter(p => p.type === 'technical');
      return (
        <div className="max-w-5xl mx-auto pt-6 w-full animate-page-enter">
          <SEO title={t.technicalTitle} />
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 reveal-on-scroll delay-0">{t.technicalTitle}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-12 text-[16px] font-medium reveal-on-scroll delay-100">{t.portfolioSub}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full reveal-on-scroll delay-200">
              {filtered.map(proj => (
                <div key={proj.id} onClick={() => navigate(`/technical/${proj.id}`)} className="glass-panel rounded-[2.5rem] overflow-hidden cursor-pointer group hover:-translate-y-2 transition-all flex flex-col w-full shadow-sm border border-white/60 dark:border-white/10 hover:shadow-2xl hover:border-blue-300 dark:hover:border-blue-700/50">
                  <div className="w-full h-56 overflow-hidden relative"><img src={proj.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /></div>
                  <div className="p-8 flex-1 flex flex-col w-full"><div className="flex justify-between items-start mb-4"><h3 className="text-xl font-black dark:text-white group-hover:text-blue-500">{proj.title}</h3>{proj.featured && <span className="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">{t.featured}</span>}</div><p className="text-[14.5px] text-gray-600 dark:text-gray-400 mb-6 flex-1 line-clamp-2">{proj.shortDesc}</p><div className="flex flex-wrap gap-2 mt-auto">{(proj.tech || []).slice(0, 4).map((tItem, i) => <span key={i} className="text-[11px] font-bold bg-white/60 dark:bg-slate-700/60 border border-white/50 dark:border-white/5 px-3 py-1.5 rounded-lg shadow-sm">{tItem}</span>)}</div></div>
                </div>
              ))}
          </div>
          {filtered.length === 0 && <div className="py-16 text-center text-gray-500 font-medium">{t.noProjects}</div>}
        </div>
      );
    }

    // --- TECHNICAL DETAIL ---
    if (currentPath.startsWith('/technical/')) {
      const id = currentPath.split('/')[2]; const proj = projects.find(p => p.id === id);
      if (!proj) return <div className="text-center pt-20 text-gray-500 font-bold">{t.notFound}</div>;
      return (
        <div className="max-w-5xl mx-auto pt-6 w-full animate-page-enter">
          <SEO title={proj.title} desc={proj.shortDesc} img={proj.image} />
          <div className="flex justify-between items-center mb-8 reveal-on-scroll delay-0">
            <button onClick={() => navigate(`/technical`)} className="flex items-center gap-2 px-5 py-2.5 glass-panel rounded-xl font-bold hover:scale-105 transition-all w-fit border border-white/60 dark:border-white/10 shadow-sm"><ArrowLeft size={16}/> {t.backToProjects}</button>
            <button onClick={() => handleShare(proj.title, proj.shortDesc)} className="flex items-center gap-2 px-5 py-2.5 glass-panel rounded-xl font-bold text-blue-600 dark:text-blue-400 hover:scale-105 transition-all w-fit border border-white/60 dark:border-white/10 shadow-sm"><Share2 size={16}/> {t.share}</button>
          </div>
          <div className="mb-12">
            <span className="bg-blue-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm mb-4 inline-block tracking-wider uppercase">{proj.category || 'Web Application'}</span>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-4 leading-tight">{proj.title}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-bold">{proj.subtitle || proj.shortDesc}</p>
          </div>
          <div className="w-full rounded-[3rem] overflow-hidden shadow-2xl mb-12 border border-white/50 dark:border-white/10"><img src={proj.image} className="w-full h-auto max-h-[600px] object-cover" alt=""/></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="md:col-span-2 flex flex-col gap-4">
                <DetailCard title={t.overview} content={proj.overview || t.notAvailable} t={t}/>
                <DetailCard title={t.projectGoals} content={proj.goals || t.notAvailable} icon={Target} t={t}/>
                <DetailCard title={t.keyFeatures} content={proj.features || t.notAvailable} icon={CheckCircle} t={t}/>
                <DetailCard title={t.challenges} content={proj.challenges || t.notAvailable} icon={Lightbulb} t={t}/>
             </div>
             <div className="md:col-span-1">
                <DetailCard title={t.projectInfo} t={t}>
                   <div className="space-y-4 text-[14.5px]"><div><p className="text-gray-500 font-bold text-[12px] uppercase tracking-wider">{t.client}</p><p className="font-bold dark:text-white">{proj.client || t.notAvailable}</p></div><div><p className="text-gray-500 font-bold text-[12px] uppercase tracking-wider">{t.duration}</p><p className="font-bold dark:text-white">{proj.duration || t.notAvailable}</p></div><div><p className="text-gray-500 font-bold text-[12px] uppercase tracking-wider">{t.year}</p><p className="font-bold dark:text-white">{proj.year || '2024'}</p></div></div>
                </DetailCard>
                <DetailCard title={t.techUsed} t={t}>
                   <div className="flex flex-wrap gap-2">{(proj.tech || []).map((tItem, i) => <span key={i} className="px-3 py-1.5 bg-white/60 dark:bg-slate-800/60 shadow-sm rounded-lg text-[13px] font-bold text-gray-700 dark:text-gray-300 border border-white/50 dark:border-white/10">{tItem}</span>)}</div>
                </DetailCard>
             </div>
          </div>
        </div>
      );
    }

    // --- CREATIVE LIST ---
    if (currentPath === '/creative') {
      const filtered = projects.filter(p => p.type === 'creative');
      return (
        <div className="max-w-5xl mx-auto pt-6 w-full animate-page-enter">
          <SEO title={t.creativeTitle} />
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 reveal-on-scroll delay-0">{t.creativeTitle}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-12 text-[16px] font-medium reveal-on-scroll delay-100">{t.creativeSub}</p>
          <div className="flex flex-col gap-8 w-full max-w-full reveal-on-scroll delay-200">
              {filtered.map(proj => (
                <div key={proj.id} onClick={() => navigate(`/creative/${proj.id}`)} className="glass-panel rounded-[2.5rem] overflow-hidden cursor-pointer group hover:-translate-y-2 transition-all flex flex-col md:flex-row w-full shadow-sm border border-white/60 dark:border-white/10 hover:shadow-2xl hover:border-purple-300 dark:hover:border-purple-700/50">
                  <div className="w-full md:w-[40%] h-64 md:h-auto shrink-0 overflow-hidden relative">
                    <img src={proj.image} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 absolute inset-0" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500 flex items-center justify-center">
                       <span className="bg-white/95 text-gray-900 text-xs font-bold px-5 py-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0">{t.viewGallery} <ChevronRight size={14}/></span>
                    </div>
                  </div>
                  <div className="p-8 md:p-10 flex-1 min-w-0 flex flex-col w-full">
                    <div className="flex flex-wrap gap-2 mb-5"><span className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-sm border border-purple-200 dark:border-purple-800/30 uppercase tracking-wider">{proj.category || 'Creative'}</span>{(proj.tech || []).slice(0,2).map((tItem, i) => <span key={i} className="glass-panel text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-lg text-[11px] font-bold border border-white/60 dark:border-white/10 shadow-sm">{tItem}</span>)}</div>
                    <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-3 group-hover:text-purple-500 transition-colors line-clamp-2 leading-snug">{proj.title}</h3>
                    <p className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed mb-6 line-clamp-3 font-medium">{proj.overview || proj.shortDesc}</p>
                    <div className="mt-auto pt-6 border-t border-black/5 dark:border-white/10 flex items-center justify-between"><p className="text-[13px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{t.organizedBy} <span className="text-gray-800 dark:text-gray-200">{proj.organizer || proj.client || t.notAvailable}</span></p></div>
                  </div>
                </div>
              ))}
          </div>
          {filtered.length === 0 && <div className="py-16 text-center text-gray-500 font-medium">{t.noProjects}</div>}
        </div>
      );
    }

    // --- CREATIVE DETAIL ---
    if (currentPath.startsWith('/creative/')) {
      const id = currentPath.split('/')[2]; const proj = projects.find(p => p.id === id);
      if (!proj) return <div className="text-center pt-20 text-gray-500 font-bold">{t.notFound}</div>;
      const galleryItems = proj.gallery || [{ type: 'image', url: proj.image, caption: proj.shortDesc }];

      return (
        <div className="max-w-6xl mx-auto pt-6 w-full animate-page-enter">
          <SEO title={proj.title} desc={proj.shortDesc} img={proj.image} />
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start w-full relative">
            <div className="w-full lg:w-1/3 flex flex-col gap-6 lg:sticky lg:top-24 z-10 reveal-on-scroll delay-0">
               <div className="flex justify-between items-center w-full">
                  <button onClick={() => navigate('/creative')} className="mb-2 flex items-center gap-2 px-5 py-2.5 glass-panel rounded-xl text-gray-700 dark:text-gray-300 text-sm font-bold shadow-sm w-fit hover:scale-105 active:scale-95 transition-all border border-white/60 dark:border-white/10"><ArrowLeft size={16} /> {t.back}</button>
                  <button onClick={() => handleShare(proj.title, proj.shortDesc)} className="mb-2 flex items-center gap-2 px-5 py-2.5 glass-panel rounded-xl text-purple-600 dark:text-purple-400 text-sm font-bold shadow-sm w-fit hover:scale-105 active:scale-95 transition-all border border-white/60 dark:border-white/10"><Share2 size={16} /> {t.share}</button>
               </div>
               <div className="flex flex-wrap gap-2"><span className="bg-purple-600 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wider shadow-sm uppercase">{proj.category || 'Creative Work'}</span></div>
               <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-[1.1]">{proj.title}</h1>
               <div className="flex flex-wrap items-center gap-4 text-[14px] font-bold text-gray-600 dark:text-gray-400 border-y border-black/5 dark:border-white/10 py-5 mt-2">
                 {proj.date && <div className="flex items-center gap-2"><Calendar size={16} className="text-purple-500"/> {proj.date}</div>}
                 {proj.location && <div className="flex items-center gap-2"><MapPin size={16} className="text-purple-500"/> {proj.location}</div>}
               </div>
               <div className="prose prose-sm dark:prose-invert text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                 <h4 className="text-[16px] font-black text-gray-900 dark:text-white mb-2">{t.creativeStory}</h4>
                 <p>{proj.overview || proj.shortDesc}</p>
                 {(proj.bullets || []).length > 0 && (<ul className="list-disc pl-4 space-y-1">{proj.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>)}
               </div>
               <div className="mt-4"><h4 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">{t.techUsed}</h4><div className="flex flex-wrap gap-2">{(proj.tech || []).map((tItem, i) => <span key={i} className="text-[11px] font-semibold glass-panel text-gray-700 dark:text-gray-300 px-3.5 py-1.5 rounded-full border border-white/60 dark:border-white/10 shadow-sm">{tItem}</span>)}</div></div>
               <div className="glass-panel rounded-2xl p-6 mt-6 border-l-4 border-l-purple-500 shadow-sm"><p className="text-[11px] text-gray-400 uppercase tracking-widest font-black mb-1.5">{t.organizedBy}</p><p className="text-[15px] font-black text-gray-900 dark:text-white">{proj.client || proj.organizer || t.notAvailable}</p></div>
            </div>
            <div className="w-full lg:w-2/3 flex flex-col gap-12 pb-16">
               <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{t.gallery}</h3>
               {galleryItems.map((media, idx) => (
                  <div key={idx} className={`w-full flex flex-col gap-5 reveal-on-scroll delay-${(idx % 4) * 100}`}>
                     <div className="w-full rounded-[2.5rem] overflow-hidden glass-panel group relative border border-white/60 dark:border-white/10 shadow-lg">
                        {media.url.match(/\.(mp4|webm|ogg)$/i) ? (
                          <div className="aspect-[4/3] md:aspect-video w-full relative flex items-center justify-center bg-black">
                            <video src={media.url} controls className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000" />
                          </div>
                        ) : (<img src={media.url} alt={`Gallery ${idx}`} className="w-full h-auto object-cover max-h-[80vh]" />)}
                     </div>
                     {media.caption && (<div className="px-6 flex items-start gap-4"><div className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center shrink-0 mt-0.5 border border-white/60 dark:border-white/10 shadow-sm">{media.url.match(/\.(mp4|webm|ogg)$/i) ? <Video size={18} className="text-purple-500"/> : <Palette size={18} className="text-purple-500"/>}</div><p className="text-[15px] font-medium text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl pt-2">{media.caption}</p></div>)}
                  </div>
               ))}
            </div>
          </div>
        </div>
      );
    }

    // --- THOUGHTS LIST ---
    if (currentPath === '/thoughts') {
      const allTags = [t.all, ...new Set(blogs.map(b => b.tag).filter(Boolean))];
      const filtered = blogs.filter(b => {
        const matchesSearch = (b.title || '').toLowerCase().includes(thoughtsSearch.toLowerCase()) || (b.summary || '').toLowerCase().includes(thoughtsSearch.toLowerCase());
        const matchesFilter = thoughtsFilter === 'All' || thoughtsFilter === t.all || b.tag === thoughtsFilter;
        return matchesSearch && matchesFilter;
      });
      return (
        <div className="max-w-5xl mx-auto pt-6 w-full animate-page-enter">
          <SEO title={t.thoughtsTitle} />
          <h1 className="text-4xl font-black dark:text-white mb-2">{t.thoughtsTitle}</h1><p className="text-gray-600 dark:text-gray-400 mb-12 font-medium">{t.thoughtsSub}</p>
          <div className="mb-12 w-full reveal-on-scroll delay-200">
            <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full"><div className="relative flex-1"><Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="text" placeholder={t.searchPlaceholder} value={thoughtsSearch} onChange={(e) => setThoughtsSearch(e.target.value)} className="w-full pl-14 pr-5 py-4 rounded-2xl glass-panel outline-none focus:ring-2 focus:ring-blue-500 font-bold border border-white/60 dark:border-white/10 shadow-sm" /></div><button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95 text-[15px]">{t.searchBtn}</button></div>
            <div className="flex flex-wrap gap-2.5">{allTags.map(tag => (<button key={tag} onClick={() => setThoughtsFilter(tag)} className={`px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all border border-white/60 dark:border-white/10 ${thoughtsFilter === tag || (thoughtsFilter === 'All' && tag === 'Semua') ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-md transform scale-105' : 'glass-panel text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-slate-700/80'}`}>{tag}</button>))}</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filtered.map((blog, idx) => (
              <div key={blog.id} onClick={() => navigate(`/thoughts/${blog.id}`)} className={`glass-panel rounded-[2.5rem] overflow-hidden cursor-pointer group hover:-translate-y-2 transition-all flex flex-col border border-white/60 dark:border-white/10 shadow-sm hover:shadow-2xl delay-${(idx % 4) * 100}`}>
                <div className="h-64 overflow-hidden relative"><img src={blog.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="" /></div>
                <div className="p-8 flex-1 flex flex-col"><span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30 px-3.5 py-1.5 rounded-lg text-[11px] font-black uppercase mb-5 w-fit shadow-sm">{blog.tag}</span><h3 className="text-2xl font-black dark:text-white mb-3 group-hover:text-blue-500 leading-snug">{blog.title}</h3><p className="text-[15px] text-gray-600 dark:text-gray-400 mb-8 flex-1 line-clamp-2 font-medium">{blog.summary}</p><div className="mt-auto flex items-center gap-6 text-[13px] font-bold text-gray-500 border-t border-black/5 dark:border-white/10 pt-5"><div className="flex items-center gap-2"><Calendar size={16}/> {blog.date}</div><div className="flex items-center gap-2"><Clock size={16}/> {blog.readTime} {t.readText}</div></div></div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && <div className="py-16 text-center text-gray-500 font-medium">{t.noArticles}</div>}
        </div>
      );
    }

    // --- THOUGHTS DETAIL ---
    if (currentPath.startsWith('/thoughts/')) {
      const id = currentPath.split('/')[2]; const blog = blogs.find(b => b.id === id);
      if (!blog) return <div className="text-center pt-20 text-gray-500 font-bold">{t.notFound}</div>;
      return (
        <div className="max-w-4xl mx-auto pt-6 w-full animate-page-enter glass-panel p-8 md:p-16 rounded-[3rem] border border-white/60 dark:border-white/10 shadow-xl">
          <SEO title={blog.title} desc={blog.summary} img={blog.thumbnail} />
          <div className="flex justify-between items-center mb-8 border-b border-black/5 dark:border-white/10 pb-6">
            <button onClick={() => navigate('/thoughts')} className="flex items-center gap-2 px-5 py-2.5 bg-white/50 dark:bg-slate-800/50 rounded-xl font-bold shadow-sm hover:text-blue-500 transition-colors border border-white/60 dark:border-white/10"><ArrowLeft size={16}/> {t.back}</button>
            <button onClick={() => handleShare(blog.title, blog.summary)} className="flex items-center gap-2 px-5 py-2.5 bg-white/50 dark:bg-slate-800/50 rounded-xl font-bold shadow-sm hover:text-blue-500 transition-colors border border-white/60 dark:border-white/10"><Share2 size={16}/> {t.share}</button>
          </div>
          <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30 px-4 py-1.5 rounded-lg text-xs font-black uppercase mb-6 inline-block shadow-sm">{blog.tag}</span>
          <h1 className="text-4xl md:text-6xl font-black dark:text-white mb-8 leading-[1.15]">{blog.title}</h1>
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-[14px] text-gray-500 dark:text-gray-400 mb-10 font-bold border-b border-black/5 dark:border-white/10 pb-8"><div className="flex items-center gap-2.5"><User size={18} className="text-blue-500"/> {profile.name}</div><div className="flex items-center gap-2.5"><Calendar size={18} className="text-blue-500"/> {blog.date}</div><div className="flex items-center gap-2.5"><Clock size={18} className="text-blue-500"/> {blog.readTime} {t.readText}</div></div>
          <div className="w-full rounded-[2rem] overflow-hidden mb-12 shadow-xl border border-white/50 dark:border-white/10"><img src={blog.thumbnail} className="w-full h-auto object-cover max-h-[500px]" alt=""/></div>
          <div className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-loose font-medium">
             <div className="bg-blue-50/50 dark:bg-slate-800/50 backdrop-blur-md p-8 md:p-10 rounded-[2rem] border border-blue-100/50 dark:border-white/5 mb-10 shadow-inner">
               <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 mt-0 tracking-tight">{t.blogKnowledgeSession}</h3>
               <p className="mb-0 text-gray-700 dark:text-gray-300 leading-relaxed text-[16px]">{blog.summary}</p>
             </div>
             <div className="article-content leading-relaxed" dangerouslySetInnerHTML={{ __html: blog.content || "<p>Konten artikel akan tampil di sini...</p>" }} />
             <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-12 mb-6 tracking-tight">{t.blogWhyImportant}</h2>
             <p className="mb-6 text-[17px]">{t.blogAdaptation}</p>
          </div>
        </div>
      );
    }

    // --- DASHBOARD CMS ---
    if (currentPath === '/dashboard') {
      if (!isAuthenticated) return (
        <div className="flex items-center justify-center min-h-[80vh] w-full px-4"><form onSubmit={handleLogin} className="glass-panel p-12 rounded-[3rem] w-full max-w-md text-center shadow-2xl border border-white/60 dark:border-white/10"><div className="w-24 h-24 bg-white dark:bg-slate-800 text-blue-600 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl border border-black/5 dark:border-white/5 transform rotate-3"><Lock size={40} strokeWidth={2.5}/></div><h1 className="text-3xl font-black dark:text-white mb-8 tracking-tight">CMS Access</h1><input type="password" value={loginPassword} onChange={e=>setLoginPassword(e.target.value)} placeholder="••••••••" className="w-full px-6 py-4 rounded-2xl glass-panel text-center tracking-[0.5em] font-black mb-6 border border-white/60 dark:border-white/10 outline-none focus:ring-4 focus:ring-blue-500/30 dark:text-white shadow-inner" /><button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center justify-center gap-2">Buka Workspace <ChevronRight size={18}/></button></form></div>
      );

      return (
        <div className="max-w-6xl mx-auto pb-24 w-full animate-dashboard-enter">
          <SEO title="Admin Dashboard" />
          {isModalOpen && (
             <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[60] flex items-center justify-center p-4">
                <form onSubmit={handleSaveData} className="glass-panel w-full max-w-3xl rounded-[3rem] p-8 md:p-10 shadow-2xl bg-white/95 dark:bg-slate-900/95 max-h-[90vh] overflow-y-auto border border-white/60 dark:border-white/10 animate-fade-in relative">
                   
                   {isUploading && (
                     <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-[3rem]">
                       <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                       <p className="font-bold text-gray-800 dark:text-white animate-pulse">Menyimpan data dan mengunggah media...</p>
                     </div>
                   )}

                   <div className="flex justify-between items-center mb-8 border-b border-black/5 dark:border-white/10 pb-5"><h2 className="text-2xl font-black dark:text-white flex items-center gap-3"><Settings size={24} className="text-blue-500"/> Form {modalType.toUpperCase()}</h2><button type="button" onClick={closeModal} className="p-2.5 bg-gray-100 dark:bg-slate-800 rounded-full text-gray-500 hover:text-white hover:bg-red-500 transition-all"><X size={20}/></button></div>
                   <div className="space-y-6">
                      {(modalType === 'project' || modalType === 'blog' || modalType === 'skill') && (
                        <div className="bg-white/50 dark:bg-slate-800/50 p-6 rounded-[2rem] border-dashed border border-white/60 dark:border-white/10 shadow-inner">
                          <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-4">Upload Media Pendukung</label>
                          <div className="flex flex-col sm:flex-row items-center gap-6">
                             <div className="w-32 h-24 bg-gray-200 dark:bg-slate-800 rounded-2xl overflow-hidden flex items-center justify-center border-4 border-white dark:border-slate-700 shadow-inner">
                                {previewImage ? (
                                  <img src={URL.createObjectURL(previewImage)} className="w-full h-full object-cover"/>
                                ) : (
                                  (editingItem?.image || editingItem?.thumbnail) ? <img src={editingItem.image || editingItem.thumbnail} className="w-full h-full object-cover"/> : <ImageIcon size={32} className="text-gray-400"/>
                                )}
                             </div>
                             <div className="flex flex-col gap-2 w-full sm:w-auto">
                                <label className="px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer shadow-lg active:scale-95 text-sm transition-all flex items-center justify-center">
                                   <UploadCloud size={18} className="inline mr-2"/> Pilih File (JPG/PNG/MP4)
                                   <input type="file" accept="image/*,video/mp4" onChange={handleImageUpload} className="hidden"/>
                                </label>
                                <p className="text-[11px] text-gray-500 font-bold text-center">Akan diunggah ke Supabase Storage</p>
                             </div>
                          </div>
                        </div>
                      )}
                      
                      {modalType === 'project' && (<><input name="title" defaultValue={editingItem?.title} placeholder="Judul Karya" required className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white border-white/60 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"/><textarea name="shortDesc" defaultValue={editingItem?.shortDesc} placeholder="Deskripsi Singkat" required rows="3" className="w-full p-4 glass-panel rounded-xl font-medium dark:text-white resize-none border-white/60 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"/><select name="type" defaultValue={editingItem?.type || defaultProjType} className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white dark:bg-slate-800 border-white/60 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"><option value="technical">Technical</option><option value="creative">Creative</option></select><input name="tech" defaultValue={(editingItem?.tech||[]).join(',')} placeholder="Teknologi (pisahkan koma: React, Node)" className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white border-white/60 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"/><div className="flex items-center gap-3 bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-800/30"><input type="checkbox" name="featured" defaultChecked={editingItem?.featured} id="fCheck" className="w-5 h-5 cursor-pointer rounded border-gray-300 text-orange-600 focus:ring-orange-500"/><label htmlFor="fCheck" className="text-[14px] font-black text-orange-700 dark:text-orange-400 cursor-pointer select-none">Tampilkan di Beranda (Featured)</label></div></>)}
                      {modalType === 'blog' && (
                        <>
                          <input name="title" defaultValue={editingItem?.title} placeholder="Judul Artikel" required className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white border-white/60 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"/>
                          <textarea name="summary" defaultValue={editingItem?.summary} placeholder="Ringkasan Pendek (Tampil di Card Beranda)" required rows="2" className="w-full p-4 glass-panel rounded-xl font-medium dark:text-white resize-none border-white/60 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"/>
                          <div className="grid grid-cols-2 gap-4">
                             <input name="tag" defaultValue={editingItem?.tag} placeholder="Tag/Kategori" required className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white border-white/60 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"/>
                             <input name="readTime" defaultValue={editingItem?.readTime} placeholder="Waktu Baca (misal: 5 min)" className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white border-white/60 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"/>
                          </div>
                          <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-white/60 dark:border-white/10 shadow-sm mb-4">
                             <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 p-4 border-b border-black/5 dark:border-white/10 uppercase tracking-wider">Konten Artikel Lengkap</label>
                             <ReactQuill theme="snow" value={blogContent} onChange={setBlogContent} modules={quillModules} className="text-gray-900 dark:text-white" />
                          </div>
                        </>
                      )}
                      {modalType === 'experience' && (<><input name="role" defaultValue={editingItem?.role} placeholder="Jabatan" required className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white border-white/60 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"/><input name="company" defaultValue={editingItem?.company} placeholder="Perusahaan" required className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white border-white/60 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"/><input name="period" defaultValue={editingItem?.period} placeholder="Periode (Jan 2023 - Sek)" required className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white border-white/60 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"/><textarea name="desc" defaultValue={editingItem?.desc} placeholder="Deskripsi" required rows="3" className="w-full p-4 glass-panel rounded-xl font-medium dark:text-white resize-none border-white/60 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"/></>)}
                      {modalType === 'education' && (<><input name="degree" defaultValue={editingItem?.degree} placeholder="Gelar" required className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white border-white/60 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"/><input name="institution" defaultValue={editingItem?.institution} placeholder="Institusi" required className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white border-white/60 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"/><input name="period" defaultValue={editingItem?.period} placeholder="Periode" required className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white border-white/60 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"/><textarea name="desc" defaultValue={editingItem?.desc} placeholder="Deskripsi" required rows="3" className="w-full p-4 glass-panel rounded-xl font-medium dark:text-white resize-none border-white/60 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"/></>)}
                      {modalType === 'skill' && (<><input name="name" defaultValue={editingItem?.name} placeholder="Nama Skill" required className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white border-white/60 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"/><input name="imgUrlFallback" defaultValue={editingItem?.img} placeholder="Atau paste URL Icon (opsional)" className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white border-white/60 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"/><div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30"><input type="checkbox" name="invert" defaultChecked={editingItem?.invert} id="invCheck" className="w-5 h-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"/><label htmlFor="invCheck" className="text-[14px] font-black text-blue-900 dark:text-blue-300 cursor-pointer select-none">Invert warna di Dark Mode</label></div></>)}
                      {modalType === 'link' && (<><input name="label" defaultValue={editingItem?.label} placeholder="Label Link" required className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white border-white/60 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"/><input name="url" defaultValue={editingItem?.url} placeholder="URL (https://...)" required className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white border-white/60 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"/><input name="desc" defaultValue={editingItem?.desc} placeholder="Deskripsi (Opsional)" className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white border-white/60 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"/></>)}
                      {modalType === 'service' && (<><input name="title" defaultValue={editingItem?.title} placeholder="Judul Layanan" required className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white border-white/60 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"/><textarea name="desc" defaultValue={editingItem?.desc} placeholder="Deskripsi" required rows="3" className="w-full p-4 glass-panel rounded-xl font-medium dark:text-white resize-none border-white/60 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"/><input name="icon" defaultValue={editingItem?.icon} placeholder="Nama Icon (Misal: Code)" required className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white border-white/60 dark:border-white/10 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"/></>)}
                   </div>
                   <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-black/5 dark:border-white/10"><button type="button" onClick={closeModal} disabled={isUploading} className="px-6 py-3 rounded-xl bg-gray-200 dark:bg-slate-800 text-gray-800 dark:text-gray-200 font-bold active:scale-95 text-sm transition-colors hover:bg-gray-300 dark:hover:bg-slate-700 disabled:opacity-50">Batal</button><button type="submit" disabled={isUploading} className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-lg shadow-blue-500/30 flex items-center gap-2 active:scale-95 text-sm transition-all disabled:opacity-50"><Save size={18}/> {isUploading ? 'Menyimpan...' : 'Simpan Data'}</button></div>
                </form>
             </div>
          )}

          <div className="flex flex-col gap-6 mb-12 w-full">
             <div><h1 className="text-4xl font-black dark:text-white flex items-center gap-4 tracking-tighter"><Settings className="text-blue-500" size={36}/> <span className="truncate">Workspace Admin</span></h1><p className="text-[16px] font-medium text-gray-500 mt-2 max-w-2xl">Kelola seluruh konten, identitas, media sosial, dan unggahan file Anda.</p></div>
             <div className="flex items-center justify-between w-full bg-white/40 dark:bg-slate-800/40 p-3 rounded-[2.5rem] border border-white/60 dark:border-white/10 backdrop-blur-2xl shadow-lg mt-2 overflow-hidden">
               <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-3 sm:pb-0 w-full px-2 flex-nowrap">
                 {[{id:'overview', label:'Overview', icon: Home}, {id:'profile', label:'Profil & CV', icon: User}, {id:'technical', label:'Technical', icon: Code}, {id:'creative', label:'Creative', icon: Palette}, {id:'blogs', label:'Thoughts', icon: FileText}, {id:'experience', label:'Exp & Edu', icon: Briefcase}, {id:'skills', label:'Skills & Links', icon: Lightbulb}].map(tb => (<button key={tb.id} onClick={()=>setCmsTab(tb.id)} className={`px-6 py-3.5 rounded-[1.2rem] text-[13px] font-black shrink-0 transition-all flex items-center gap-2 ${cmsTab === tb.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 transform scale-[1.03]' : 'text-gray-600 dark:text-gray-400 hover:bg-white/80 dark:hover:bg-slate-700/80 hover:text-gray-900 dark:hover:text-white'}`}><tb.icon size={16}/> {tb.label}</button>))}
               </div>
               <button onClick={()=>{setIsAuthenticated(false); showToast('Keluar Sesi');}} className="hidden md:flex items-center gap-2 px-6 py-3.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-[1.2rem] font-black shrink-0 border border-red-100 dark:border-red-900/50 hover:scale-105 active:scale-95 text-[13px] ml-4"><Lock size={16}/> Keluar</button>
             </div>
          </div>

          <div className="w-full animate-dashboard-enter">
            {cmsTab === 'overview' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                <div className="glass-panel p-8 rounded-[2.5rem] border-l-8 border-blue-500 shadow-xl border border-white/60 dark:border-white/10 hover:-translate-y-2 transition-all"><p className="text-[12px] font-black text-gray-500 uppercase tracking-widest mb-2">Technical</p><h4 className="text-5xl font-black dark:text-white">{projects.filter(p=>p.type==='technical').length} <span className="text-xl text-gray-400 font-bold">Karya</span></h4></div>
                <div className="glass-panel p-8 rounded-[2.5rem] border-l-8 border-purple-500 shadow-xl border border-white/60 dark:border-white/10 hover:-translate-y-2 transition-all"><p className="text-[12px] font-black text-gray-500 uppercase tracking-widest mb-2">Creative</p><h4 className="text-5xl font-black dark:text-white">{projects.filter(p=>p.type==='creative').length} <span className="text-xl text-gray-400 font-bold">Karya</span></h4></div>
                <div className="glass-panel p-8 rounded-[2.5rem] border-l-8 border-orange-500 shadow-xl border border-white/60 dark:border-white/10 hover:-translate-y-2 transition-all"><p className="text-[12px] font-black text-gray-500 uppercase tracking-widest mb-2">Thoughts</p><h4 className="text-5xl font-black dark:text-white">{blogs.length} <span className="text-xl text-gray-400 font-bold">Blog</span></h4></div>
                <div className="glass-panel p-8 rounded-[2.5rem] border-l-8 border-green-500 shadow-xl border border-white/60 dark:border-white/10 hover:-translate-y-2 transition-all"><p className="text-[12px] font-black text-gray-500 uppercase tracking-widest mb-2">Pengalaman</p><h4 className="text-5xl font-black dark:text-white">{experiences.length} <span className="text-xl text-gray-400 font-bold">Data</span></h4></div>
              </div>
            )}

            {cmsTab === 'profile' && (
              <div className="glass-panel p-8 md:p-12 rounded-[3.5rem] shadow-2xl border border-white/60 dark:border-white/10 relative">
                
                {isUploading && (
                  <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-[3.5rem]">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="font-bold text-gray-800 dark:text-white animate-pulse">Mengunggah file ke server...</p>
                  </div>
                )}

                <h2 className="text-3xl font-black mb-8 border-b pb-6 border-black/5 dark:border-white/10 flex items-center gap-3 tracking-tight"><User className="text-blue-500"/> Personal Identity Setup</h2>
                <form onSubmit={handleProfileSave} className="space-y-10">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8 border-b border-black/5 dark:border-white/10">
                      
                      <div className="bg-white/40 dark:bg-slate-800/40 p-6 rounded-[2rem] border-dashed border border-white/60 dark:border-white/10 flex flex-col items-center text-center">
                        <label className="block text-[12px] font-black text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-widest">Foto Sidebar</label>
                        <div className="w-20 h-20 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden mb-4 border-2 border-white dark:border-slate-800 shadow-md">{profileTempImg ? <img src={URL.createObjectURL(profileTempImg)} className="w-full h-full object-cover"/> : (profile.profileImage ? <img src={profile.profileImage} className="w-full h-full object-cover" /> : <ImageIcon size={30} className="text-gray-400 mt-5 mx-auto"/>)}</div>
                        <label className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs cursor-pointer shadow-md active:scale-95 transition-all w-full"><UploadCloud size={16}/> Pilih Profil<input type="file" accept="image/*" onChange={handleProfileImageUpload} className="hidden" /></label>
                      </div>
                      
                      
                      <div className="bg-white/40 dark:bg-slate-800/40 p-6 rounded-[2rem] border-dashed border border-white/60 dark:border-white/10 flex flex-col items-center text-center">
                        <label className="block text-[12px] font-black text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-widest">Foto Beranda (Tanpa BG)</label>
                        <div className="w-20 h-20 bg-gray-200 dark:bg-slate-700 rounded-xl overflow-hidden mb-4 border-2 border-white dark:border-slate-800 shadow-md">{heroTempImg ? <img src={URL.createObjectURL(heroTempImg)} className="w-full h-full object-cover"/> : (profile.heroImage ? <img src={profile.heroImage} className="w-full h-full object-cover" /> : <ImageIcon size={30} className="text-gray-400 mt-5 mx-auto"/>)}</div>
                        <label className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold text-xs cursor-pointer shadow-md active:scale-95 transition-all w-full"><UploadCloud size={16}/> Pilih Hero PNG<input type="file" accept="image/*" onChange={handleHeroImageUpload} className="hidden" /></label>
                      </div>

                      
                      <div className="bg-white/40 dark:bg-slate-800/40 p-6 rounded-[2rem] border-dashed border border-white/60 dark:border-white/10 flex flex-col items-center text-center justify-center">
                        <label className="block text-[12px] font-black text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-widest">Dokumen CV (PDF)</label>
                        <div className="flex flex-col gap-3 w-full"><label className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-xs cursor-pointer shadow-md active:scale-95 transition-all w-full"><FileText size={16}/> {cvFileName ? 'Ganti File' : 'Upload PDF'}<input type="file" accept=".pdf" onChange={handleCvUpload} className="hidden" /></label>{cvFileName && <p className="text-[11px] text-blue-600 font-bold flex items-center gap-1 justify-center truncate"><Check size={12}/> {cvFileName}</p>}{profile.cvUrl && !cvFileName && <p className="text-[11px] text-gray-500 font-bold flex items-center gap-1 justify-center"><CheckCircle size={12} className="text-blue-500"/> CV Publik Aktif</p>}</div>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div><label className="block text-[12px] font-black text-gray-500 uppercase tracking-widest mb-3">Nama Lengkap</label><input name="name" defaultValue={profile.name} required className="w-full px-6 py-4 rounded-2xl glass-panel font-bold text-[15px] outline-none dark:text-white border-white/60 dark:border-white/10 focus:ring-2 focus:ring-blue-500 shadow-sm" /></div>
                       <div><label className="block text-[12px] font-black text-gray-500 uppercase tracking-widest mb-3">Role Profesi</label><input name="role" defaultValue={profile.role} required className="w-full px-6 py-4 rounded-2xl glass-panel font-bold text-[15px] outline-none dark:text-white border-white/60 dark:border-white/10 focus:ring-2 focus:ring-blue-500 shadow-sm" /></div>
                   </div>
                   <div><label className="block text-[12px] font-black text-gray-500 uppercase tracking-widest mb-3">Bio Singkat</label><textarea name="bio" defaultValue={profile.bio} required rows="3" className="w-full px-6 py-4 rounded-2xl glass-panel font-medium text-[15px] outline-none dark:text-white resize-none border-white/60 dark:border-white/10 focus:ring-2 focus:ring-blue-500 shadow-sm" /></div>
                   <div className="pt-6 border-t border-black/5 dark:border-white/10">
                      <h3 className="block text-[14px] font-black text-gray-700 dark:text-gray-300 mb-6 uppercase tracking-widest">Tautan Sosial Media Publik</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div><label className="block text-[12px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><BrandIcon name="instagram"/> Instagram URL</label><input name="instagram" defaultValue={profile.socials?.instagram} className="w-full px-6 py-4 rounded-2xl glass-panel font-medium text-[14.5px] outline-none dark:text-white border-white/60 dark:border-white/10 focus:ring-2 focus:ring-pink-500 shadow-sm" placeholder="https://instagram.com/..." /></div>
                         <div><label className="block text-[12px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><BrandIcon name="threads"/> Threads URL</label><input name="threads" defaultValue={profile.socials?.threads} className="w-full px-6 py-4 rounded-2xl glass-panel font-medium text-[14.5px] outline-none dark:text-white border-white/60 dark:border-white/10 focus:ring-2 focus:ring-gray-400 shadow-sm" placeholder="https://threads.net/..." /></div>
                         <div><label className="block text-[12px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><BrandIcon name="tiktok"/> TikTok URL</label><input name="tiktok" defaultValue={profile.socials?.tiktok} className="w-full px-6 py-4 rounded-2xl glass-panel font-medium text-[14.5px] outline-none dark:text-white border-white/60 dark:border-white/10 focus:ring-2 focus:ring-gray-400 shadow-sm" placeholder="https://tiktok.com/..." /></div>
                         <div><label className="block text-[12px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><BrandIcon name="linkedin"/> LinkedIn URL</label><input name="linkedin" defaultValue={profile.socials?.linkedin} className="w-full px-6 py-4 rounded-2xl glass-panel font-medium text-[14.5px] outline-none dark:text-white border-white/60 dark:border-white/10 focus:ring-2 focus:ring-blue-600 shadow-sm" placeholder="https://linkedin.com/..." /></div>
                      </div>
                   </div>
                   <div className="flex justify-end pt-8 mt-6 border-t border-black/5 dark:border-white/10"><button type="submit" disabled={isUploading} className="px-10 py-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[16px] shadow-2xl shadow-blue-500/40 flex items-center gap-3 active:scale-95 transition-all hover:scale-105 disabled:opacity-50"><Save size={22}/> Publish & Simpan ke Database</button></div>
                </form>
              </div>
            )}

            {(cmsTab === 'technical' || cmsTab === 'creative') && (
              <div className="glass-panel p-8 md:p-12 rounded-[3rem] shadow-2xl border border-white/60 dark:border-white/10">
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4"><h2 className="text-3xl font-black uppercase text-gray-900 dark:text-white flex items-center gap-3 tracking-tighter">{cmsTab === 'technical' ? <Code size={30} className="text-blue-500"/> : <Palette size={30} className="text-purple-500"/>} Koleksi {cmsTab}</h2><button onClick={() => openModal('project', null, cmsTab)} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-500/30 flex items-center gap-2 active:scale-95 transition-all hover:scale-105"><Plus size={18}/> Tambah Baru</button></div>
                 <div className="grid grid-cols-1 gap-5">
                    {projects.filter(p => p.type === cmsTab).map(p => (
                       <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white/40 dark:bg-slate-800/40 rounded-[2rem] border border-white/60 dark:border-white/10 hover:shadow-xl transition-all duration-300 group gap-5 hover:-translate-y-1">
                          <div className="flex items-center gap-6">
                            {p.image?.match(/\.(mp4|webm|ogg)$/i) ? (
                              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-black flex items-center justify-center shrink-0 shadow-md border border-white/50"><Video className="text-white opacity-50"/></div>
                            ) : (
                              <img src={p.image} className="w-20 h-20 rounded-2xl object-cover shadow-md grayscale group-hover:grayscale-0 transition-all border border-white/50 dark:border-white/10 shrink-0" alt="" />
                            )}
                            <div><h4 className="font-black text-gray-900 dark:text-white text-[18px] mb-1 group-hover:text-blue-500 transition-colors">{p.title}</h4><p className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">{p.category}</p></div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0"><button onClick={() => openModal('project', p, cmsTab)} className="p-4 bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 rounded-2xl shadow-sm border border-black/5 hover:scale-110 active:scale-95 transition-transform"><Edit size={20}/></button><button onClick={async () => { if(supabase) await supabase.from('projects').delete().eq('id', p.id); setProjects(projects.filter(x => x.id !== p.id)); showToast('Dihapus');}} className="p-4 bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 rounded-2xl shadow-sm border border-black/5 hover:scale-110 active:scale-95 transition-transform"><Trash2 size={20}/></button></div>
                       </div>
                    ))}
                    {projects.filter(p => p.type === cmsTab).length === 0 && <div className="p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-[2.5rem] font-bold text-gray-500">Belum ada karya.</div>}
                 </div>
              </div>
            )}

            {cmsTab === 'blogs' && (
              <div className="glass-panel p-8 md:p-12 rounded-[3rem] shadow-2xl border border-white/60 dark:border-white/10">
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4"><h2 className="text-3xl font-black uppercase text-gray-900 dark:text-white flex items-center gap-3 tracking-tighter"><FileText size={30} className="text-blue-500"/> Artikel Blog (Rich Text)</h2><button onClick={() => openModal('blog', null)} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-500/30 flex items-center gap-2 active:scale-95 transition-all hover:scale-105"><Plus size={18}/> Tulis Artikel</button></div>
                 <div className="grid grid-cols-1 gap-5">
                    {blogs.map(b => (
                       <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white/40 dark:bg-slate-800/40 rounded-[2rem] border border-white/60 dark:border-white/10 hover:shadow-xl transition-all duration-300 group gap-5 hover:-translate-y-1">
                          <div className="flex items-center gap-6"><img src={b.thumbnail} className="w-24 h-24 rounded-2xl object-cover shadow-md border border-white/50 dark:border-white/10 shrink-0" alt="" /><div><h4 className="font-black text-gray-900 dark:text-white text-[18px] mb-2 line-clamp-1 group-hover:text-blue-500 transition-colors">{b.title}</h4><p className="text-[12px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest bg-blue-100/50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg inline-block border border-blue-200/50 dark:border-blue-800/30 shadow-sm">{b.tag} • {b.date}</p></div></div>
                          <div className="flex items-center gap-3 shrink-0"><button onClick={() => openModal('blog', b)} className="p-4 bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 rounded-2xl shadow-sm border border-black/5 hover:scale-110 active:scale-95 transition-transform"><Edit size={20}/></button><button onClick={async () => { if(supabase) await supabase.from('blogs').delete().eq('id', b.id); setBlogs(blogs.filter(x => x.id !== b.id)); showToast('Dihapus');}} className="p-4 bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 rounded-2xl shadow-sm border border-black/5 hover:scale-110 active:scale-95 transition-transform"><Trash2 size={20}/></button></div>
                       </div>
                    ))}
                 </div>
              </div>
            )}

            {cmsTab === 'experience' && (
              <div className="glass-panel p-8 md:p-12 rounded-[3rem] shadow-2xl border border-white/60 dark:border-white/10">
                 {/* BAGIAN PENGALAMAN */}
                 <div className="flex justify-between items-center mb-10 border-b border-black/5 dark:border-white/10 pb-6"><h2 className="text-3xl font-black uppercase text-gray-900 dark:text-white flex items-center gap-3 tracking-tighter"><Briefcase size={30} className="text-blue-500"/> Pengalaman</h2><button onClick={() => openModal('experience', null)} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-500/30 flex items-center gap-2 active:scale-95 transition-all hover:scale-105"><Plus size={18}/> Tambah Pengalaman</button></div>
                 <div className="grid grid-cols-1 gap-5 mb-16">
                    {experiences.map(e => (
                       <div key={e.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white/40 dark:bg-slate-800/40 rounded-[2rem] border border-white/60 dark:border-white/10 hover:shadow-xl transition-all duration-300 group gap-5 hover:-translate-y-1">
                          <div><h4 className="font-black text-gray-900 dark:text-white text-[18px] mb-1">{e.role}</h4><p className="text-[13px] font-bold text-gray-500 bg-white/50 dark:bg-black/20 px-3 py-1.5 rounded-lg inline-block border border-black/5 dark:border-white/5 mt-2">{e.company} • {e.period}</p></div>
                          <div className="flex items-center gap-3 shrink-0"><button onClick={() => openModal('experience', e)} className="p-4 bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 rounded-2xl shadow-sm border border-black/5 hover:scale-110 active:scale-95 transition-transform"><Edit size={20}/></button><button onClick={async () => { if(supabase) await supabase.from('experiences').delete().eq('id', e.id); setExperiences(experiences.filter(x => x.id !== e.id)); showToast('Dihapus');}} className="p-4 bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 rounded-2xl shadow-sm border border-black/5 hover:scale-110 active:scale-95 transition-transform"><Trash2 size={20}/></button></div>
                       </div>
                    ))}
                    {experiences.length === 0 && <p className="text-gray-500 font-bold p-6 text-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl">Belum ada data pengalaman.</p>}
                 </div>

                 {/* BAGIAN PENDIDIKAN */}
                 <div className="flex justify-between items-center mb-10 border-b border-black/5 dark:border-white/10 pb-6"><h2 className="text-3xl font-black uppercase text-gray-900 dark:text-white flex items-center gap-3 tracking-tighter"><GraduationCap size={30} className="text-blue-500"/> Pendidikan</h2><button onClick={() => openModal('education', null)} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-500/30 flex items-center gap-2 active:scale-95 transition-all hover:scale-105"><Plus size={18}/> Tambah Pendidikan</button></div>
                 <div className="grid grid-cols-1 gap-5">
                    {educations.map(e => (
                       <div key={e.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white/40 dark:bg-slate-800/40 rounded-[2rem] border border-white/60 dark:border-white/10 hover:shadow-xl transition-all duration-300 group gap-5 hover:-translate-y-1">
                          <div><h4 className="font-black text-gray-900 dark:text-white text-[18px] mb-1">{e.degree}</h4><p className="text-[13px] font-bold text-gray-500 bg-white/50 dark:bg-black/20 px-3 py-1.5 rounded-lg inline-block border border-black/5 dark:border-white/5 mt-2">{e.institution} • {e.period}</p></div>
                          <div className="flex items-center gap-3 shrink-0"><button onClick={() => openModal('education', e)} className="p-4 bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 rounded-2xl shadow-sm border border-black/5 hover:scale-110 active:scale-95 transition-transform"><Edit size={20}/></button><button onClick={async () => { if(supabase) await supabase.from('educations').delete().eq('id', e.id); setEducations(educations.filter(x => x.id !== e.id)); showToast('Dihapus');}} className="p-4 bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 rounded-2xl shadow-sm border border-black/5 hover:scale-110 active:scale-95 transition-transform"><Trash2 size={20}/></button></div>
                       </div>
                    ))}
                    {educations.length === 0 && <p className="text-gray-500 font-bold p-6 text-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl">Belum ada data pendidikan.</p>}
                 </div>
              </div>
            )}
            
            {cmsTab === 'skills' && (
              <div className="glass-panel p-8 md:p-12 rounded-[3rem] shadow-2xl border border-white/60 dark:border-white/10">
                 {/* BAGIAN KEAHLIAN (SKILLS) */}
                 <div className="flex justify-between items-center mb-10 border-b border-black/5 dark:border-white/10 pb-6"><h2 className="text-3xl font-black uppercase text-gray-900 dark:text-white flex items-center gap-3 tracking-tighter"><Lightbulb size={30} className="text-blue-500"/> Keahlian (Skills)</h2><button onClick={() => openModal('skill', null)} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-500/30 flex items-center gap-2 active:scale-95 transition-all hover:scale-105"><Plus size={18}/> Tambah Skill</button></div>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-16">
                    {skills.map(s => (
                       <div key={s.id} className="flex flex-col items-center justify-between p-6 bg-white/40 dark:bg-slate-800/40 rounded-[2rem] border border-white/60 dark:border-white/10 hover:shadow-xl transition-all duration-300 group gap-5 hover:-translate-y-1">
                          <img src={s.img} className={`w-16 h-16 object-contain ${s.invert ? 'dark:invert' : ''}`}/>
                          <h4 className="font-black text-gray-900 dark:text-white text-[16px]">{s.name}</h4>
                          <div className="flex items-center gap-3 shrink-0"><button onClick={() => openModal('skill', s)} className="p-3 bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 rounded-xl shadow-sm border border-black/5 hover:scale-110 active:scale-95 transition-transform"><Edit size={16}/></button><button onClick={async () => { if(supabase) await supabase.from('skills').delete().eq('id', s.id); setSkills(skills.filter(x => x.id !== s.id)); showToast('Dihapus');}} className="p-3 bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 rounded-xl shadow-sm border border-black/5 hover:scale-110 active:scale-95 transition-transform"><Trash2 size={16}/></button></div>
                       </div>
                    ))}
                    {skills.length === 0 && <p className="text-gray-500 font-bold p-6 text-center col-span-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl">Belum ada skill ditambahkan.</p>}
                 </div>

                 {/* BAGIAN TAUTAN (LINKS) */}
                 <div className="flex justify-between items-center mb-10 border-b border-black/5 dark:border-white/10 pb-6"><h2 className="text-3xl font-black uppercase text-gray-900 dark:text-white flex items-center gap-3 tracking-tighter"><LinkIcon size={30} className="text-blue-500"/> Tautan Penting (Links)</h2><button onClick={() => openModal('link', null)} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-500/30 flex items-center gap-2 active:scale-95 transition-all hover:scale-105"><Plus size={18}/> Tambah Tautan</button></div>
                 <div className="grid grid-cols-1 gap-5">
                    {links.map(l => (
                       <div key={l.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white/40 dark:bg-slate-800/40 rounded-[2rem] border border-white/60 dark:border-white/10 hover:shadow-xl transition-all duration-300 group gap-5 hover:-translate-y-1">
                          <div className="flex-1 min-w-0">
                             <h4 className="font-black text-gray-900 dark:text-white text-[18px] mb-1">{l.label}</h4>
                             <p className="text-[13px] font-bold text-gray-500">{l.desc}</p>
                             <p className="text-[12px] mt-2 text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg inline-block shadow-sm truncate max-w-full border border-blue-100 dark:border-blue-800/30">{l.url}</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                             <button onClick={() => openModal('link', l)} className="p-4 bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 rounded-2xl shadow-sm border border-black/5 hover:scale-110 active:scale-95 transition-transform"><Edit size={20}/></button>
                             <button onClick={async () => { if(supabase) await supabase.from('links').delete().eq('id', l.id); setLinks(links.filter(x => x.id !== l.id)); showToast('Dihapus');}} className="p-4 bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 rounded-2xl shadow-sm border border-black/5 hover:scale-110 active:scale-95 transition-transform"><Trash2 size={20}/></button>
                          </div>
                       </div>
                    ))}
                    {links.length === 0 && <p className="text-gray-500 font-bold p-6 text-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl">Belum ada tautan ditambahkan.</p>}
                 </div>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <HelmetProvider>
      <div className="flex relative bg-[#F8FAFC] dark:bg-[#05050A] text-gray-900 dark:text-gray-100 min-h-screen font-sans overflow-x-hidden selection:bg-blue-500/30 selection:text-white">
       {toastMessage && (
          <div className="fixed bottom-8 right-8 z-[100] animate-dashboard-enter">
             <div className="glass-panel bg-white/95 dark:bg-slate-800/95 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-blue-200/50 dark:border-blue-900/50 backdrop-blur-2xl">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/30"><Check size={20} strokeWidth={4} /></div>
                <p className="text-[14px] font-black text-gray-800 dark:text-white uppercase tracking-wider">{toastMessage}</p>
             </div>
          </div>
       )}

       <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#F8FAFC] dark:bg-[#05050A]">
          <div className="absolute top-[-10%] left-[-10%] w-[50rem] h-[50rem] bg-indigo-400/20 dark:bg-indigo-900/40 rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite_alternate]"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[60rem] h-[60rem] bg-violet-400/20 dark:bg-violet-900/40 rounded-full blur-[150px] animate-[pulse_10s_ease-in-out_infinite_alternate-reverse]"></div>
          <div className="absolute top-[20%] left-[20%] w-[30rem] h-[30rem] bg-cyan-400/10 dark:bg-cyan-900/20 rounded-full blur-[100px] animate-[pulse_12s_ease-in-out_infinite_alternate]"></div>
       </div>

       <style dangerouslySetInnerHTML={{__html: `
        /* --- GAYA "BENTO BOX / SOLID MATTE" SUPER RINGAN --- */
        /* Light Mode: Putih solid dengan bayangan elegan */
        .glass-panel { 
          background: #ffffff; 
          border: 1px solid rgba(0, 0, 0, 0.08); 
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0,0,0,0.02); 
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }
        
        /* Dark Mode: Abu-abu gelap kebiruan (Slate) dengan border tipis bercahaya */
        html.dark .glass-panel { 
          background: #0f172a; /* Warna Slate-900 yang elegan */
          border: 1px solid rgba(255, 255, 255, 0.06); 
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.02); 
        }

        /* Efek Hover untuk interaksi (Opsional tapi membuat UI terasa hidup) */
        .glass-panel:hover {
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          border-color: rgba(59, 130, 246, 0.3); /* Warna biru menyala tipis saat disentuh */
        }
        html.dark .glass-panel:hover {
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
          border-color: rgba(59, 130, 246, 0.4); /* Warna biru */
        }

        /* Mematikan Animasi Latar Belakang Lingkaran Blur di Mobile (Agar hemat baterai & RAM) */
        @media (max-width: 768px) {
           .animate-\\[pulse_8s_ease-in-out_infinite_alternate\\],
           .animate-\\[pulse_10s_ease-in-out_infinite_alternate-reverse\\],
           .animate-\\[pulse_12s_ease-in-out_infinite_alternate\\] {
              animation: none !important;
              opacity: 0.3; /* Lingkaran tetap ada tapi diam */
           }
           .glass-panel:hover, html.dark .glass-panel:hover {
              transform: none;
           }
        }

        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.4); border-radius: 20px; border: 2px solid transparent; background-clip: padding-box; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(156, 163, 175, 0.6); border: 2px solid transparent; background-clip: padding-box;}
        
        .reveal-on-scroll { opacity: 0; animation: revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes revealUp { 0% { opacity: 0; transform: translateY(40px) scale(0.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        
        .animate-dashboard-enter { animation: dashboardEnter 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes dashboardEnter { 0% { opacity: 0; transform: scale(0.96) translateY(20px); filter: blur(8px); } 100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); } }
        
        .animate-page-enter { animation: pageEnter 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes pageEnter { 0% { opacity: 0; transform: translateX(15px); } 100% { opacity: 1; transform: translateX(0); } }
        
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } } .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        /* CSS UNTUK TYPING EFFECT (KEDIP KURSOR) */
        @keyframes blink { 0%, 100% { border-color: transparent; } 50% { border-color: #3b82f6; } }

        /* CSS UNTUK RICH TEXT EDITOR & TABEL */
        .article-content table { width: 100%; border-collapse: collapse; margin: 2rem 0; border: 1px solid rgba(156, 163, 175, 0.3); border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .article-content th, .article-content td { border: 1px solid rgba(156, 163, 175, 0.3); padding: 12px 16px; text-align: left; }
        .article-content th { background: rgba(59, 130, 246, 0.1); font-weight: 900; }
        .article-content tr:nth-child(even) { background: rgba(156, 163, 175, 0.05); }
        .article-content img { max-width: 100%; border-radius: 1rem; margin: 1.5rem 0; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .article-content a { color: #3b82f6; text-decoration: underline; font-weight: bold; }
        .article-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem; }
        .article-content ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1rem; }
        
        /* CSS UNTUK REACT QUILL DARK MODE */
        .ql-toolbar.ql-snow { border-color: rgba(255,255,255,0.1) !important; border-top-left-radius: 0.75rem; border-top-right-radius: 0.75rem; background: rgba(255,255,255,0.05); }
        .ql-container.ql-snow { border-color: rgba(255,255,255,0.1) !important; min-height: 250px; border-bottom-left-radius: 0.75rem; border-bottom-right-radius: 0.75rem; font-family: inherit; font-size: 15px; }
        html.dark .ql-picker-label, html.dark .ql-picker-item { color: white !important; }
        html.dark .ql-stroke { stroke: white !important; }
        html.dark .ql-fill { fill: white !important; }
       `}} />

       <div className="lg:hidden fixed top-0 left-0 right-0 h-16 glass-panel z-50 px-5 flex items-center justify-between !border-x-0 !border-t-0 !rounded-none">
          <div className="font-black text-[clamp(14px,4vw,18px)] text-blue-600 dark:text-blue-400 tracking-tighter uppercase truncate pr-4">{profile.name}</div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2.5 rounded-xl bg-white/40 dark:bg-slate-800/40 text-gray-900 dark:text-white shrink-0 shadow-sm border border-white/60 dark:border-white/10">{isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
        
        {isMobileMenuOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-fade-in" onClick={() => setIsMobileMenuOpen(false)} />}
        {renderSidebar()}
        
        <main className="flex-1 lg:pl-[280px] pt-16 lg:pt-0 min-h-screen transition-all duration-300 w-full max-w-[100vw] overflow-x-hidden relative z-10">
          <div key={currentPath} className="p-5 sm:p-8 md:p-12 lg:p-16 min-h-screen max-w-[1400px] mx-auto w-full overflow-x-hidden">
            {renderContent()}
          </div>
       </main>
      </div>
    </HelmetProvider>
  );
}