import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

import { 
  Home, User, MessageSquare, Folder, Mic, Users, FileText, 
  Briefcase, GraduationCap, Lightbulb, Link as LinkIcon,
  Download, Sun, Moon, Menu, X, ChevronRight, ArrowLeft, Plus, Edit, Trash2, Settings,
  PlayCircle, Calendar, MapPin, Code, Palette, Terminal, Lock, Send,
  ExternalLink, Share2, Clock, Target, CheckCircle, Search, Video,
  Mail, Phone, Save, UploadCloud, Check, Image as ImageIcon,
  Database, Monitor, Smartphone, Server, Zap, TrendingUp, BarChart3, Crop
} from 'lucide-react';

import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Cropper from 'react-easy-crop'; 

// ============================================================================
// INISIALISASI SUPABASE
// ============================================================================
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- IKON MEREK KUSTOM ---
const BrandIcon = ({ name, size = 20, className = "" }) => {
  if (name === 'instagram') return <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
  if (name === 'threads') return <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 12.5C14.5 13.8807 13.3807 15 12 15C10.6193 15 9.5 13.8807 9.5 12.5C9.5 11.1193 10.6193 10 12 10C13.3807 10 14.5 11.1193 14.5 12.5Z" /><path d="M14.5 12.5V11.5C14.5 9.84315 13.1569 8.5 11.5 8.5H11C9.34315 8.5 8 9.84315 8 11.5V12.5C8 14.1569 9.34315 15.5 11 15.5H11.5C12.3284 15.5 13 14.8284 13 14" /><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.238 2.22416 14.4239 2.63214 15.5218C3.04013 16.6197 3.61439 17.6253 4.33157 18.5" /></svg>;
  if (name === 'tiktok') return <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>;
  if (name === 'linkedin') return <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>;
  return <LinkIcon size={size} className={className} />;
};

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

const TypingText = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout;
    if (!text) return;
    if (!isDeleting && displayText === text) {
      timeout = setTimeout(() => setIsDeleting(true), 2500); 
    } else if (isDeleting && displayText === '') {
      timeout = setTimeout(() => setIsDeleting(false), 500); 
    } else {
      timeout = setTimeout(() => {
        setDisplayText(text.substring(0, displayText.length + (isDeleting ? -1 : 1)));
      }, isDeleting ? 40 : 100); 
    }
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, text]);

  return (
    <span className="border-r-[3px] border-gray-900 dark:border-white pr-1 animate-[blink_1s_step-end_infinite] inline-block">
      {displayText || '\u200B'}
    </span>
  );
};

const splitText = (text) => {
  if (!text) return { id: '', en: '' };
  const parts = String(text).split('|~|');
  return { id: parts[0].trim(), en: parts.length > 1 ? parts[1].trim() : parts[0].trim() };
};

const tText = (text, lang) => {
  const { id, en } = splitText(text);
  return lang === 'id' ? id : en;
};

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });

async function getCroppedImg(imageSrc, pixelCrop, fileName = 'cropped-image.jpg') {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.drawImage(
    image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
    0, 0, pixelCrop.width, pixelCrop.height
  );
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return;
      blob.name = fileName;
      const file = new File([blob], fileName, { type: 'image/jpeg' });
      resolve(file);
    }, 'image/jpeg', 0.9);
  });
}

const initialProfile = {
  name: '', role: '', bio: '', about: '', email: '', whatsapp: '', location: '',
  profileImage: '', heroImage: '', cvUrl: '', socials: {}
};

const translations = {
  id: {
    main: 'Utama', home: 'Beranda', about: 'Tentang', contact: 'Kontak', portfolio: 'Portofolio', technical: 'Technical', creative: 'Creative', thoughts: 'Thoughts', professional: 'Profesional', experience: 'Pengalaman', education: 'Pendidikan', skills: 'Keahlian', links: 'Tautan', downloadCv: 'Unduh CV', darkMode: 'Mode Gelap', lightMode: 'Mode Terang', dashboard: 'Dasbor', btnContact: 'Hubungi Saya', btnPortfolio: 'Lihat Portofolio',
    whatIDo: 'Keahlian Utama', featuredProjects: 'Proyek Unggulan', viewAllPortfolio: 'Lihat Semua', latestBlogs: 'Thoughts Terbaru', readAllBlogs: 'Lihat Semua Tulisan', readMore: 'Baca Selengkapnya', back: 'Kembali', share: 'Bagikan', backToProjects: 'Kembali ke Karya', loadMore: 'Muat Lebih Banyak',
    contactTitle: 'Kontak', contactSubtitle: 'Hubungi saya untuk kolaborasi atau pertanyaan', email: 'Email', whatsapp: 'WhatsApp', location: 'Lokasi', workingHours: 'Jam Kerja',
    formName: 'Nama Lengkap', formEmail: 'Email', formSubject: 'Subjek', formMessage: 'Pesan', formSend: 'Kirim Pesan',
    technicalTitle: 'Proyek Teknikal', creativeTitle: 'Karya Kreatif', portfolioSub: 'Koleksi proyek teknis dan pengembangan sistem', creativeSub: 'Eksplorasi visual, branding, dan desain', overview: 'Ikhtisar', techUsed: 'Teknologi Digunakan', client: 'Klien', duration: 'Durasi', year: 'Tahun', role: 'Peran', status: 'Status', viewLive: 'Lihat Langsung', sourceCode: 'Kode Sumber', tags: 'Tag', projectLinks: 'Tautan Proyek', notAvailable: 'Tidak tersedia', featured: 'Unggulan', noProjects: 'Karya tidak ditemukan.', projectGoals: 'Tujuan Proyek', keyFeatures: 'Fitur Utama', challenges: 'Tantangan & Solusi', outcomes: 'Hasil', projectInfo: 'Informasi Proyek', organizedBy: 'Klien / Organizer', creativeStory: 'Cerita di Balik Karya', gallery: 'Galeri Visual', viewGallery: 'Lihat Galeri',
    thoughtsTitle: 'Blog & Tulisan', thoughtsSub: 'Artikel dan tutorial teknologi', searchPlaceholder: 'Cari artikel...', searchBtn: 'Cari', all: 'Semua', readText: 'baca', noArticles: 'Artikel tidak ditemukan.', blogKnowledgeSession: 'Sesi Pengetahuan',
    aboutTitle: 'Tentang Saya', aboutSubtitle: 'Mengenal lebih dekat', philosophy: 'Filosofi', values: 'Nilai-Nilai', linkDesc: 'Tautan penting.',
    yearsExp: 'Tahun Pengalaman', totalWorks: 'Total Karya', articles: 'Tulisan / Artikel', happyClients: 'Klien Puas', collabTitle: 'Mari Berkolaborasi', collabDesc: 'Punya ide proyek atau ingin berdiskusi? Hubungi saya kapan saja.', sendEmail: 'Kirim Email',
    expTitle: 'Pengalaman', expDesc: 'Rekam jejak karir profesional saya.', noExp: 'Belum ada data pengalaman.', eduTitle: 'Pendidikan', eduDesc: 'Latar belakang pendidikan saya.', noEdu: 'Belum ada data pendidikan.',
    notFound: 'Data tidak ditemukan.', shareSuccess: 'Tautan disalin!', shareError: 'Gagal membagikan.',
    deleteConfirm: 'Yakin ingin menghapus data ini secara permanen?', deleting: 'Menghapus...', deleted: 'Berhasil dihapus'
  },
  en: {
    main: 'Main', home: 'Home', about: 'About', contact: 'Contact', portfolio: 'Portfolio', technical: 'Technical', creative: 'Creative', thoughts: 'Thoughts', professional: 'Professional', experience: 'Experience', education: 'Education', skills: 'Skills', links: 'Links', downloadCv: 'Download CV', darkMode: 'Dark Mode', lightMode: 'Light Mode', dashboard: 'Dashboard', btnContact: 'Contact Me', btnPortfolio: 'View Portfolio',
    whatIDo: 'Core Skills', featuredProjects: 'Featured Projects', viewAllPortfolio: 'View All', latestBlogs: 'Latest Thoughts', readAllBlogs: 'View All Writings', readMore: 'Read More', back: 'Back', share: 'Share', backToProjects: 'Back to Works', loadMore: 'Load More',
    contactTitle: 'Contact', contactSubtitle: 'Reach out for collaboration', email: 'Email', whatsapp: 'WhatsApp', location: 'Location', workingHours: 'Working Hours',
    formName: 'Full Name', formEmail: 'Email', formSubject: 'Subject', formMessage: 'Message', formSend: 'Send Message',
    technicalTitle: 'Technical Projects', creativeTitle: 'Creative Works', portfolioSub: 'System development and technical projects', creativeSub: 'Visual explorations, branding, and design', overview: 'Overview', techUsed: 'Technologies Used', client: 'Client', duration: 'Duration', year: 'Year', role: 'Role', status: 'Status', viewLive: 'View Live', sourceCode: 'Source Code', tags: 'Tags', projectLinks: 'Project Links', notAvailable: 'Not available', featured: 'Featured', noProjects: 'No works found.', projectGoals: 'Project Goals', keyFeatures: 'Key Features', challenges: 'Challenges', outcomes: 'Outcomes', projectInfo: 'Project Info', organizedBy: 'Client / Organizer', creativeStory: 'The Story Behind', gallery: 'Visual Gallery', viewGallery: 'View Gallery',
    thoughtsTitle: 'Blog & Writings', thoughtsSub: 'Articles and tech tutorials', searchPlaceholder: 'Search articles...', searchBtn: 'Search', all: 'All', readText: 'read', noArticles: 'No articles found.', blogKnowledgeSession: 'Knowledge Session',
    aboutTitle: 'About Me', aboutSubtitle: 'Getting to know closer', philosophy: 'Philosophy', values: 'Values', linkDesc: 'My important links.',
    yearsExp: 'Years Experience', totalWorks: 'Total Projects', articles: 'Articles', happyClients: 'Happy Clients', collabTitle: 'Let\'s Collaborate', collabDesc: 'Have a project idea or want to discuss? Reach out.', sendEmail: 'Send Email',
    expTitle: 'Experience', expDesc: 'My professional career track.', noExp: 'No experience data yet.', eduTitle: 'Education', eduDesc: 'My educational background.', noEdu: 'No education data yet.',
    notFound: 'Data not found.', shareSuccess: 'Link copied!', shareError: 'Failed to share link.',
    deleteConfirm: 'Are you sure you want to delete this permanently?', deleting: 'Deleting...', deleted: 'Deleted successfully'
  }
};

const getIcon = (name) => {
  switch(name) { case 'Code': return Code; case 'Terminal': return Terminal; case 'Lightbulb': return Lightbulb; case 'Mic': return Mic; case 'Palette': return Palette; case 'Database': return Database; case 'Monitor': return Monitor; case 'Smartphone': return Smartphone; case 'Server': return Server; default: return Code; }
};

const NavItem = ({ icon: Icon, label, path, isActive, delayClass, onNavigate }) => (
  <button onClick={() => onNavigate(path)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 text-[14px] font-bold reveal-on-scroll ${delayClass} ${isActive ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-md transform scale-[1.02]' : 'text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white active:scale-95'}`}>
    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-white dark:text-gray-900' : 'text-gray-500 dark:text-gray-400'} />{label}
  </button>
);

const DetailCard = ({ title, content, children, icon: Icon, delay, t }) => (
  <div className={`glass-panel rounded-[2rem] p-6 md:p-8 mb-6 w-full reveal-on-scroll delay-${delay}`}>
    <h3 className="text-[16px] font-extrabold text-gray-900 dark:text-white mb-4 flex items-center gap-3">{Icon && <Icon size={22} className="text-gray-900 dark:text-white" />} {title}</h3>
    {content ? (<div className="text-gray-600 dark:text-gray-300 text-[14.5px] leading-relaxed whitespace-pre-wrap font-medium">{(content === 'Not available' || content === 'Tidak tersedia' || content === 'Not available') ? <span className="text-gray-400 italic">{t.notAvailable}</span> : content}</div>) : children}
  </div>
);

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean']
  ],
  clipboard: { matchVisual: false }
};

export default function App() {
  const [isLoadingData, setIsLoadingData] = useState(true); 
  const [theme, setTheme] = useState('dark');
  const [lang, setLang] = useState('id'); 
  const [currentPath, setCurrentPath] = useState('/home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [blogContentId, setBlogContentId] = useState('');
  const [blogContentEn, setBlogContentEn] = useState('');
  const [profileAboutId, setProfileAboutId] = useState('');
  const [profileAboutEn, setProfileAboutEn] = useState('');

  const [profile, setProfile] = useState(initialProfile);
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [skills, setSkills] = useState([]);
  const [links, setLinks] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);

  const [visibleTech, setVisibleTech] = useState(6);
  const [visibleCreative, setVisibleCreative] = useState(6);
  const [visibleThoughts, setVisibleThoughts] = useState(6);
  const [techFilter, setTechFilter] = useState('All');
  const [thoughtsSearch, setThoughtsSearch] = useState('');
  const [thoughtsFilter, setThoughtsFilter] = useState('All');

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [cmsTab, setCmsTab] = useState('overview'); 
  const [modalType, setModalType] = useState(null); 
  const [editingItem, setEditingItem] = useState(null); 
  const [defaultProjType, setDefaultProjType] = useState('technical');
  
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [cropType, setCropType] = useState(null); 
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

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

  const isModalOpen = modalType !== null;
  const t = translations[lang] || translations['id'];

  const SEO = ({ title, desc, img }) => {
    const pageTitle = title ? `${title} | ${tText(profile.name, lang)}` : tText(profile.name, lang);
    const pageDesc = desc || tText(profile.bio, lang);
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

  useEffect(() => {
    const fetchSupabaseData = async () => {
      if (!supabase) { setIsLoadingData(false); return; }
      try {
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

        if (projData) setProjects(projData); 
        if (blogData) setBlogs(blogData); 
        if (expData) setExperiences(expData);
        if (eduData) setEducations(eduData);
        if (skillData) setSkills(skillData);
        if (linkData) setLinks(linkData);
        if (servData) setServices(servData);
        
        if (profData) {
          const parsedAbout = splitText(profData.about || '');
          setProfileAboutId(parsedAbout.id);
          setProfileAboutEn(parsedAbout.en);

          setProfile({ 
            ...initialProfile, ...profData,
            whatsapp: profData.whatsapp || initialProfile.whatsapp, email: profData.email || initialProfile.email,
            name: profData.name || initialProfile.name, role: profData.role || initialProfile.role,
            location: profData.location || initialProfile.location, bio: profData.bio || initialProfile.bio,
            about: profData.about || '',
            heroImage: profData.heroImage || initialProfile.heroImage,
            socials: { ...initialProfile.socials, ...(profData.socials || {}) } 
          });
        }
      } catch (error) { console.error(error); } finally { setIsLoadingData(false); }
    };
    fetchSupabaseData();
  }, []);

  useEffect(() => { if (theme === 'dark') document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); }, [theme]);
  useEffect(() => { if (secretClickCount > 0) { const timer = setTimeout(() => setSecretClickCount(0), 1500); return () => clearTimeout(timer); } }, [secretClickCount]);
  useEffect(() => { if (toastMessage) { const timer = setTimeout(() => setToastMessage(null), 3000); return () => clearTimeout(timer); } }, [toastMessage]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  
  const navigate = (path) => { 
    setCurrentPath(path); setIsMobileMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); 
    if(path !== '/technical') setVisibleTech(6);
    if(path !== '/creative') setVisibleCreative(6);
    if(path !== '/thoughts') setVisibleThoughts(6);
  };
  
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
    if (type === 'blog') {
      const parsedContent = splitText(item?.content);
      setBlogContentId(parsedContent.id);
      setBlogContentEn(parsedContent.en);
    }
  };
  
  const closeModal = () => { setModalType(null); setEditingItem(null); setPreviewImage(''); setBlogContentId(''); setBlogContentEn(''); };
  
  const handleDelete = async (table, id, stateList, stateUpdater) => {
    if (window.confirm(t.deleteConfirm)) {
      showToast(t.deleting);
      try {
        if(supabase) await supabase.from(table).delete().eq('id', id);
        stateUpdater(stateList.filter(x => x.id !== id));
        showToast(t.deleted);
      } catch (e) {
        showToast(e.message);
      }
    }
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => { setCroppedAreaPixels(croppedAreaPixels); }, []);
  const triggerCropModal = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.includes('video')) {
         if(type === 'preview') setPreviewImage(file);
      } else {
         setCropType(type);
         setImageToCrop(URL.createObjectURL(file));
         setCropModalOpen(true);
      }
    }
  };

  const handleSaveCroppedImage = async () => {
    try {
      const croppedFile = await getCroppedImg(imageToCrop, croppedAreaPixels);
      if (cropType === 'preview') setPreviewImage(croppedFile);
      if (cropType === 'profile') setProfileTempImg(croppedFile);
      if (cropType === 'hero') setHeroTempImg(croppedFile);
      setCropModalOpen(false); setImageToCrop(null); setCropType(null);
    } catch (e) { showToast('Gagal memotong gambar.'); }
  };

  const handleCvUpload = (e) => { const file = e.target.files[0]; if (file) { setCvFileObj(file); setCvFileName(file.name); } };
  const handleDownloadCV = () => {
    if (profile.cvUrl) { const a = document.createElement('a'); a.href = profile.cvUrl; a.target = "_blank"; a.download = "CV.pdf"; document.body.appendChild(a); a.click(); document.body.removeChild(a); showToast('Mengunduh CV...'); } 
    else { showToast('CV belum diunggah.'); }
  };

  const uploadFileToSupabase = async (file, bucketName = 'portfolio') => {
    if (!supabase || typeof file === 'string') return file; 
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;
      await supabase.storage.from(bucketName).upload(filePath, file);
      const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(filePath);
      return publicUrl;
    } catch (error) { throw error; }
  };

  const handleSaveData = async (e) => {
    e.preventDefault(); setIsUploading(true);
    const formData = new FormData(e.target); 
    const id = editingItem ? editingItem.id : `item-${Date.now()}`; 
    let tableName = ''; let newItem = { id };
    let finalImageUrl = editingItem?.image || editingItem?.thumbnail || editingItem?.img || '';

    const combine = (field) => {
      const idVal = formData.get(`${field}_id`) || '';
      const enVal = formData.get(`${field}_en`) || '';
      return enVal ? `${idVal} |~| ${enVal}` : idVal;
    };

    try {
      if (previewImage instanceof File) finalImageUrl = await uploadFileToSupabase(previewImage);

      if (modalType === 'project') { 
        tableName = 'projects';
        newItem = { ...newItem, title: combine('title'), shortDesc: combine('shortDesc'), overview: combine('overview'), features: combine('features'), challenges: combine('challenges'), goals: combine('goals'), type: formData.get('type'), category: formData.get('category'), image: finalImageUrl, tech: (formData.get('tech') || '').split(',').map(text => text.trim()).filter(Boolean), client: combine('client'), year: formData.get('year'), featured: formData.get('featured') === 'on' }; 
      }
      else if (modalType === 'blog') { 
        tableName = 'blogs';
        newItem = { ...newItem, title: combine('title'), summary: combine('summary'), date: formData.get('date'), readTime: formData.get('readTime'), tag: formData.get('tag'), thumbnail: finalImageUrl, content: `${blogContentId} |~| ${blogContentEn}` }; 
      }
      else if (modalType === 'skill') { 
        tableName = 'skills';
        newItem = { ...newItem, name: formData.get('name'), img: finalImageUrl, invert: formData.get('invert') === 'on' }; 
      }
      else if (modalType === 'link') { 
        tableName = 'links';
        newItem = { ...newItem, label: combine('label'), url: formData.get('url'), desc: combine('desc') }; 
      }
      else if (modalType === 'experience') { 
        tableName = 'experiences';
        newItem = { ...newItem, role: combine('role'), company: combine('company'), period: combine('period'), desc: combine('desc') }; 
      }
      else if (modalType === 'education') { 
        tableName = 'educations';
        newItem = { ...newItem, degree: combine('degree'), institution: combine('institution'), period: combine('period'), desc: combine('desc') }; 
      }
      else if (modalType === 'service') { 
        tableName = 'services';
        newItem = { ...newItem, title: combine('title'), desc: combine('desc'), icon: formData.get('icon') }; 
      }
      
      if (supabase) await supabase.from(tableName).upsert(newItem);
      window.location.reload();
    } catch (err) { showToast(`Error: ${err.message}`); } finally { setIsUploading(false); }
  };

 const handleProfileSave = async (e) => {
    e.preventDefault(); setIsUploading(true); const formData = new FormData(e.target);
    let finalProfileImgUrl = profile.profileImage;
    let finalHeroImgUrl = profile.heroImage;
    let finalCvUrl = profile.cvUrl;
    const combine = (field) => { const idVal = formData.get(`${field}_id`) || ''; const enVal = formData.get(`${field}_en`) || ''; return enVal ? `${idVal} |~| ${enVal}` : idVal; };

    try {
      if (profileTempImg instanceof File) finalProfileImgUrl = await uploadFileToSupabase(profileTempImg);
      if (heroTempImg instanceof File) finalHeroImgUrl = await uploadFileToSupabase(heroTempImg); 
      if (cvFileObj instanceof File) finalCvUrl = await uploadFileToSupabase(cvFileObj);

      const newProfile = { 
        id: 1, name: combine('name'), role: combine('role'), bio: combine('bio'), 
        about: `${profileAboutId} |~| ${profileAboutEn}`,
        email: formData.get('email'), whatsapp: formData.get('whatsapp'), location: formData.get('location'), 
        profileImage: finalProfileImgUrl, heroImage: finalHeroImgUrl, cvUrl: finalCvUrl, 
        socials: { instagram: formData.get('instagram') || '', threads: formData.get('threads') || '', tiktok: formData.get('tiktok') || '', linkedin: formData.get('linkedin') || '' } 
      };

      if (supabase) await supabase.from('profile').upsert(newProfile);
      window.location.reload();
    } catch (err) { showToast(`Error: ${err.message}`); } finally { setIsUploading(false); }
  };

  const renderSidebar = () => (
    <aside className={`fixed inset-y-0 left-0 z-40 w-[280px] max-w-[85vw] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0 glass-panel border-r-0 lg:border-r border-gray-200 dark:border-white/10 shadow-[20px_0_40px_-15px_rgba(0,0,0,0.05)] lg:shadow-none ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col items-center pt-10 pb-6 border-b border-black/5 dark:border-white/10 shrink-0 px-4 relative group w-full overflow-hidden">
        <div className="relative">
          <img src={profile.profileImage} alt="Profile" onClick={handleSecretClick} className="w-24 h-24 rounded-full object-cover mb-4 ring-[4px] ring-gray-100 dark:ring-gray-800 shadow-2xl cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 bg-gray-50 dark:bg-gray-900" />
        </div>
        <h2 className="text-[19px] font-extrabold text-gray-900 dark:text-white text-center leading-snug tracking-tight drop-shadow-sm break-words w-full px-2">{tText(profile.name, lang)}</h2>
        <p className="text-[12px] text-gray-900 dark:text-gray-100 mt-2 font-black text-center tracking-widest uppercase bg-gray-100 dark:bg-white/10 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/20 w-fit max-w-[95%] break-words leading-tight">{tText(profile.role, lang)}</p>
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

      <div className="px-5 py-6 border-t border-black/5 dark:border-white/10 flex flex-col items-center gap-4 shrink-0 bg-gray-50/50 dark:bg-black/20 backdrop-blur-md">
        <div className="flex rounded-xl p-1 bg-gray-200/50 dark:bg-white/10 border border-black/5 dark:border-white/5 shadow-inner w-full justify-center">
          <button onClick={() => setLang('id')} className={`px-6 py-2 text-xs font-bold rounded-lg transition-all flex-1 ${lang === 'id' ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>ID</button>
          <button onClick={() => setLang('en')} className={`px-6 py-2 text-xs font-bold rounded-lg transition-all flex-1 ${lang === 'en' ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}>EN</button>
        </div>
        <div className="w-full space-y-3 flex flex-col items-center">
          <div className="flex justify-center gap-3 w-full pb-2">
              {['instagram', 'threads', 'tiktok', 'linkedin'].map(s => profile.socials?.[s] && <a key={s} href={profile.socials[s]} target="_blank" className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all shadow-sm border border-gray-200 dark:border-white/10"><BrandIcon name={s} size={18}/></a>)}
          </div>
          <button onClick={handleDownloadCV} className="w-full py-3.5 rounded-xl bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95"><Download size={18} /> {t.downloadCv}</button>
          <button onClick={toggleTheme} className="w-full py-3.5 rounded-xl glass-panel hover:bg-gray-100 dark:hover:bg-white/10 text-gray-800 dark:text-gray-200 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 border-gray-200 dark:border-white/10">{theme === 'light' ? <Sun size={18} className="text-gray-900"/> : <Moon size={18} className="text-white"/>} {theme === 'light' ? t.darkMode : t.lightMode}</button>
        </div>
      </div>
    </aside>
  );

  const renderContent = () => {
    // --- HOME ---
    if (currentPath === '/home') return (
      <div className="max-w-5xl mx-auto space-y-24 pb-24 w-full animate-page-enter">
        <SEO title={t.home} />
        
        {/* --- HERO SECTION --- (Tetap rata kiri dan landscape di Mobile) */}
        <div className="relative flex flex-col justify-center min-h-[400px] sm:min-h-[500px] w-full z-10 reveal-on-scroll delay-0 group rounded-[2rem] sm:rounded-[3rem] overflow-hidden glass-panel">
          
          
          
        
         {/* FOTO AREA (SEPARUH KANAN) DENGAN GRADIENT BLENDING MULUS */}
          {/* FOTO AREA DENGAN CSS MASKING (TRANSPARANSI SEAMLESS 100%) */}
          <div 
            className="absolute inset-y-0 right-0 w-[80%] sm:w-[60%] z-0 overflow-hidden"
            style={{ 
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 70%, black 100%)',
              maskImage: 'linear-gradient(to right, transparent 0%, black 70%, black 100%)' 
            }}
          >
             {/* Foto Dibuat Center */}
             <img 
               src={profile.heroImage || profile.profileImage} 
               loading="lazy" 
               className="w-full h-full object-cover object-center transition-all duration-700 ease-in-out grayscale group-hover:grayscale-0 scale-100 group-hover:scale-105 opacity-90 dark:opacity-50 group-hover:opacity-100" 
               alt="Hero Portrait" 
             />
             
             {/* Gradient Vertikal di bawah foto agar ujung bawah membaur mulus */}
             <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-white/50 to-transparent dark:from-black/50 dark:to-transparent z-10 pointer-events-none"></div>
          </div>

          <div className="relative w-[90%] sm:w-[60%] flex flex-col items-start text-left z-20 px-6 sm:px-12 py-12 sm:py-16">
            <div className="flex gap-4 sm:gap-5 mb-6">
               {['instagram', 'threads', 'tiktok', 'linkedin'].map(s => profile.socials?.[s] && <a key={s} href={profile.socials[s]} target="_blank" className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"><BrandIcon name={s} size={18}/></a>)}
            </div>
            
            <h1 className="font-black text-gray-900 dark:text-white leading-[1.1] sm:leading-[1.2] mb-4 sm:mb-6 tracking-tighter w-full">
              <span className="block mb-1 text-[clamp(1.8rem,5vw,3.5rem)] capitalize">{lang === 'id' ? 'Saya ' : "I'm "} {tText(profile.name, lang)},</span>
              <span className="text-gray-900 dark:text-white drop-shadow-sm block min-h-[40px] sm:min-h-[60px] text-[clamp(1.3rem,3vw,2.2rem)] w-full"><TypingText text={tText(profile.role, lang)} /></span>
            </h1>
            
            <p className="text-[12px] sm:text-[15px] text-gray-600 dark:text-gray-400 font-medium mb-8 sm:mb-10 max-w-[280px] sm:max-w-md leading-relaxed z-20 relative line-clamp-3 sm:line-clamp-none">{tText(profile.bio, lang)}</p>
            
            <div className="flex flex-row flex-wrap gap-3 sm:gap-4 w-full sm:w-auto z-20 relative">
               <button onClick={() => { const el = document.getElementById('portfolio-categories'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }} className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 font-black transition-all shadow-[0_8px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_20px_rgba(255,255,255,0.2)] hover:-translate-y-1 active:scale-95 text-[10px] sm:text-[12px] uppercase tracking-widest border border-gray-900 dark:border-white">MY WORK</button>
               <button onClick={() => navigate('/contact')} className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-white dark:bg-transparent text-gray-900 dark:text-white font-black transition-all shadow-md hover:shadow-xl hover:-translate-y-1 active:scale-95 text-[10px] sm:text-[12px] uppercase tracking-widest border border-gray-200 dark:border-white/30 hover:bg-gray-50 dark:hover:bg-white/10">HIRE ME</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full reveal-on-scroll delay-200">
           {[{i:Briefcase, e:4, l:t.yearsExp}, {i:Code, e:projects.length, l:t.totalWorks}, {i:FileText, e:blogs.length, l:t.articles}, {i:Users, e:10, l:t.happyClients}].map((s, idx) => (
             <div key={idx} className="glass-panel p-6 rounded-[2rem] flex flex-col items-center justify-center text-center group hover:border-gray-900 dark:hover:border-white transition-all hover:-translate-y-1 border border-gray-200 dark:border-white/10">
               <s.i className="text-gray-900 dark:text-white mb-3 group-hover:scale-110 transition-transform" size={28} />
               <p className="text-[26px] font-black text-gray-900 dark:text-white drop-shadow-sm"><CountUp end={s.e} suffix={idx===0||idx===3?"+":""}/></p>
               <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-1">{s.l}</p>
             </div>
           ))}
        </div>

        <div id="portfolio-categories" className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full reveal-on-scroll delay-200 scroll-mt-24 pt-4">
           {[{p:'/technical', i:Code, l:'Technical', c:projects.filter(p=>p.type==='technical').length}, {p:'/creative', i:Palette, l:'Creative', c:projects.filter(p=>p.type==='creative').length}, {p:'/thoughts', i:FileText, l:'Thoughts', c:blogs.length}].map((c, idx) => (
             <div key={idx} onClick={() => navigate(c.p)} className="glass-panel p-8 rounded-[2rem] flex flex-col items-center justify-center text-center group hover:border-gray-900 dark:hover:border-white hover:-translate-y-2 transition-all cursor-pointer border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-2xl dark:hover:shadow-white/5">
                <div className="w-20 h-20 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><c.i size={36} /></div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{c.l}</h3>
                <p className="text-[13px] font-bold text-gray-500 uppercase tracking-widest">{c.c} {idx===2?'Tulisan':'Karya'}</p>
             </div>
           ))}
        </div>

        <div className="glass-panel p-8 md:p-12 rounded-[2rem] w-full reveal-on-scroll delay-100 shadow-sm border border-gray-200 dark:border-white/10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8 text-center tracking-tight">{t.whatIDo}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((srv, idx) => { const IconComp = getIcon(srv.icon); return (<div key={srv.id} className="p-5 border border-gray-200 dark:border-white/10 rounded-xl bg-white/40 dark:bg-white/5 flex gap-4 hover:shadow-md transition-all items-start group"><div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center shrink-0 shadow-sm"><IconComp size={18} className="text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white" /></div><div><h3 className="text-[15px] font-bold text-gray-900 dark:text-white mb-1">{tText(srv.title, lang)}</h3><p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium">{tText(srv.desc, lang)}</p></div></div>)})}
            {services.length === 0 && <p className="col-span-2 text-center text-gray-500">Belum ada layanan ditambahkan.</p>}
          </div>
        </div>

        <div className="glass-panel p-8 md:p-12 rounded-[2rem] w-full reveal-on-scroll delay-200 shadow-sm border border-gray-200 dark:border-white/10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8 text-center tracking-tight">{t.featuredProjects}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.filter(p => p.type === 'technical' && p.featured).slice(0, 4).map(proj => (
               <div key={proj.id} onClick={() => navigate(`/technical/${proj.id}`)} className="p-6 border border-gray-200 dark:border-white/10 rounded-xl bg-white/40 dark:bg-white/5 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col group"><h3 className="text-[18px] font-bold text-gray-900 dark:text-white mb-2 group-hover:text-gray-600 dark:group-hover:text-gray-300">{tText(proj.title, lang)}</h3><p className="text-[13.5px] text-gray-500 dark:text-gray-400 line-clamp-2 flex-grow mb-5 font-medium">{tText(proj.shortDesc, lang)}</p><div className="flex flex-wrap gap-2 mt-auto">{(proj.tech || []).slice(0, 4).map((tItem, i) => <span key={i} className="text-[11px] font-bold bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 px-3 py-1.5 rounded-md border border-gray-200 dark:border-white/10">{tItem}</span>)}</div></div>
            ))}
            {projects.filter(p => p.type === 'technical' && p.featured).length === 0 && <p className="col-span-2 text-center text-gray-500 text-sm py-4">Belum ada karya unggulan.</p>}
          </div>
          <div className="mt-8 flex justify-center"><button onClick={() => navigate('/technical')} className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-transparent border border-gray-200 dark:border-white/30 text-gray-900 dark:text-white rounded-xl text-sm font-bold shadow-sm hover:scale-105 active:scale-95 transition-transform hover:bg-gray-50 dark:hover:bg-white/10">{t.viewAllPortfolio} <ExternalLink size={16} className="ml-1" /></button></div>
        </div>

        <div className="glass-panel p-8 md:p-12 rounded-[2rem] w-full reveal-on-scroll delay-200 shadow-sm border border-gray-200 dark:border-white/10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8 text-center tracking-tight">{t.latestBlogs}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {blogs.slice(0, 4).map(blog => (
               <div key={blog.id} onClick={() => navigate(`/thoughts/${blog.id}`)} className="p-5 border border-gray-200 dark:border-white/10 rounded-2xl bg-white/40 dark:bg-white/5 hover:shadow-md transition-all duration-300 cursor-pointer flex gap-5 group items-center">
                 <img src={blog.thumbnail} loading="lazy" className="w-24 h-24 rounded-xl object-cover border border-gray-200 dark:border-white/10 shrink-0" alt="" />
                 <div className="flex-1 min-w-0">
                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white mb-2 block px-2 py-1 bg-gray-100 dark:bg-white/10 rounded-md w-fit border border-gray-200 dark:border-white/20">{blog.tag}</span>
                   <h3 className="text-[16px] font-bold text-gray-900 dark:text-white mb-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 line-clamp-2 leading-snug">{tText(blog.title, lang)}</h3>
                   <p className="text-[12px] font-bold text-gray-500 flex items-center gap-1.5"><Calendar size={12}/>{blog.date}</p>
                 </div>
               </div>
            ))}
            {blogs.length === 0 && <p className="col-span-2 text-center text-gray-500 text-sm py-4">Belum ada tulisan terbaru.</p>}
          </div>
          <div className="mt-8 flex justify-center"><button onClick={() => navigate('/thoughts')} className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-transparent border border-gray-200 dark:border-white/30 text-gray-900 dark:text-white rounded-xl text-sm font-bold shadow-sm hover:scale-105 active:scale-95 transition-transform hover:bg-gray-50 dark:hover:bg-white/10">{t.readAllBlogs} <ExternalLink size={16} className="ml-1" /></button></div>
        </div>

        <footer className="w-full pt-12 reveal-on-scroll delay-400">
          <div className="glass-panel p-10 md:p-16 rounded-[3rem] text-center w-full relative overflow-hidden bg-gray-50/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-lg">
             <div className="relative z-10">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">{t.collabTitle}</h2>
                <p className="text-[15px] text-gray-600 dark:text-gray-400 max-w-lg mx-auto mb-10 font-medium">{t.collabDesc}</p>
                <div className="flex flex-wrap justify-center gap-5 mb-12">
                   <a href={`mailto:${profile.email || ''}`} className="flex items-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white hover:bg-black dark:hover:bg-gray-200 text-white dark:text-gray-900 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-md"><Mail size={18}/> {t.sendEmail}</a>
                   <a href={`https://wa.me/${(profile.whatsapp || '').replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-8 py-4 glass-panel text-gray-900 dark:text-white rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-sm border border-gray-200 dark:border-white/10"><Phone size={18}/> WhatsApp</a>
                </div>
                <div className="flex justify-center gap-6 border-t border-gray-200 dark:border-white/10 pt-10">
                   {['instagram', 'threads', 'tiktok', 'linkedin'].map(s => profile.socials?.[s] && <a key={s} href={profile.socials[s]} target="_blank" className="w-12 h-12 rounded-xl glass-panel flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:scale-110 transition-all border border-gray-200 dark:border-white/10 shadow-sm"><BrandIcon name={s} size={20}/></a>)}
                </div>
             </div>
          </div>
          <div className="mt-8 mb-4 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest px-4"><p>© {new Date().getFullYear()} {tText(profile.name, lang)}.</p><p className="flex items-center gap-1.5">Powered by <Code size={14} className="text-gray-900 dark:text-white"/> & Coffee</p></div>
        </footer>
      </div>
    );

    if (currentPath === '/about') return (
      <div className="max-w-4xl mx-auto pt-6 w-full pb-20 animate-page-enter">
        <SEO title={t.aboutTitle} />
        <div className="mb-10 reveal-on-scroll delay-0"><h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">{t.aboutTitle}</h1><p className="text-[16px] text-gray-600 dark:text-gray-400 font-medium">{t.aboutSubtitle} {tText(profile.name, lang)}</p></div>
        <div className="space-y-6">
          <div className="glass-panel p-8 md:p-12 rounded-[3rem] w-full reveal-on-scroll delay-100 border border-gray-200 dark:border-white/10">
             <div className="article-content text-[15.5px] text-gray-800 dark:text-gray-200 font-medium leading-relaxed" dangerouslySetInnerHTML={{ __html: tText(profile.about, lang) || `<p>Tuliskan filosofi, nilai-nilai, atau deskripsi panjang tentang diri Anda melalui CMS di tab Profil & CV.</p>` }} />
          </div>
        </div>
      </div>
    );

    if (currentPath === '/contact') return (
      <div className="max-w-5xl mx-auto pt-6 w-full pb-20 animate-page-enter">
        <SEO title={t.contactTitle} />
        <div className="mb-10 reveal-on-scroll delay-0"><h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">{t.contactTitle}</h1><p className="text-[16px] text-gray-600 dark:text-gray-400 font-medium">{t.contactSubtitle}</p></div>
        <div className="flex flex-col lg:flex-row gap-8 w-full">
          <div className="w-full lg:w-2/3 glass-panel p-8 md:p-10 rounded-[3rem] border border-gray-200 dark:border-white/10 reveal-on-scroll delay-100">
            <form className="space-y-6 w-full" onSubmit={(e) => { e.preventDefault(); showToast('Pesan Terkirim!'); e.target.reset(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-2">{t.formName}</label><input required className="w-full px-5 py-3.5 rounded-2xl glass-panel outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white border-gray-200 dark:border-white/10" /></div><div><label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-2">{t.formEmail}</label><input type="email" required className="w-full px-5 py-3.5 rounded-2xl glass-panel outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white border-gray-200 dark:border-white/10" /></div></div>
              <div><label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-2">{t.formSubject}</label><input required className="w-full px-5 py-3.5 rounded-2xl glass-panel outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white border-gray-200 dark:border-white/10" /></div>
              <div><label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-2">{t.formMessage}</label><textarea required rows="5" className="w-full px-5 py-3.5 rounded-2xl glass-panel outline-none resize-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white border-gray-200 dark:border-white/10"></textarea></div>
              <button type="submit" className="py-4 px-8 rounded-2xl bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform"><Send size={18}/> {t.formSend}</button>
            </form>
          </div>
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            <div className="glass-panel p-8 md:p-10 rounded-[3rem] border border-gray-200 dark:border-white/10 space-y-6 reveal-on-scroll delay-200">
               <div className="flex gap-4 items-start"><div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white flex items-center justify-center border border-gray-200 dark:border-white/20"><Mail size={18}/></div><div className="flex-1 min-w-0"><h4 className="text-[15px] font-bold dark:text-white">{t.email}</h4><p className="text-[14px] text-gray-500 break-all">{profile.email}</p></div></div>
               <div className="flex gap-4 items-start"><div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white flex items-center justify-center border border-gray-200 dark:border-white/20"><Phone size={18}/></div><div className="flex-1 min-w-0"><h4 className="text-[15px] font-bold dark:text-white">{t.whatsapp}</h4><p className="text-[14px] text-gray-500 break-all">{profile.whatsapp}</p></div></div>
               <div className="pt-4 border-t border-gray-200 dark:border-white/10 flex justify-start gap-4">
                  {['instagram', 'threads', 'tiktok', 'linkedin'].map(s => profile.socials?.[s] && <a key={s} href={profile.socials[s]} target="_blank" className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:scale-110 transition-all shadow-sm border border-gray-200 dark:border-white/10"><BrandIcon name={s} size={18}/></a>)}
               </div>
            </div>
          </div>
        </div>
      </div>
    );

    if (currentPath === '/experience') return (
      <div className="max-w-4xl mx-auto pt-6 w-full pb-20 animate-page-enter">
        <SEO title={t.expTitle} />
        <h1 className="text-4xl font-black dark:text-white mb-2 tracking-tight flex items-center gap-4"><Briefcase className="text-gray-900 dark:text-white" size={32}/> {t.expTitle}</h1>
        <p className="text-[16px] text-gray-600 dark:text-gray-400 font-medium mb-12 border-b border-gray-200 dark:border-white/10 pb-6">{t.expDesc}</p>
        <div className="border-l-[3px] border-gray-300 dark:border-gray-700 ml-4 md:ml-8 space-y-12">
          {experiences.map(exp => (
            <div key={exp.id} className="relative pl-8 md:pl-12"><div className="absolute w-6 h-6 bg-gray-900 dark:bg-white rounded-full -left-[13.5px] top-1.5 ring-[6px] ring-[#F8FAFC] dark:ring-[#0a0a0a]"></div><div className="glass-panel p-8 rounded-[2.5rem] border border-gray-200 dark:border-white/10 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"><span className="text-gray-900 dark:text-white bg-gray-100 dark:bg-white/10 px-3.5 py-1.5 rounded-lg text-[13px] font-bold mb-4 inline-block border border-gray-200 dark:border-white/20">{tText(exp.period, lang)}</span><h3 className="text-2xl font-black dark:text-white mb-2">{tText(exp.role, lang)}</h3><h4 className="font-bold text-gray-600 dark:text-gray-400 mb-5">{tText(exp.company, lang)}</h4><p className="text-[15px] font-medium text-gray-700 dark:text-gray-300">{tText(exp.desc, lang)}</p></div></div>
          ))}
          {experiences.length === 0 && <div className="pl-8 text-gray-500">{t.noExp}</div>}
        </div>
      </div>
    );

    if (currentPath === '/education') return (
      <div className="max-w-5xl mx-auto pt-6 w-full pb-20 animate-page-enter">
        <SEO title={t.eduTitle} />
        <h1 className="text-4xl font-black dark:text-white mb-2 tracking-tight flex items-center gap-4"><GraduationCap className="text-gray-900 dark:text-white" size={32}/> {t.eduTitle}</h1>
        <p className="text-[16px] text-gray-600 dark:text-gray-400 font-medium mb-12 border-b border-gray-200 dark:border-white/10 pb-6">{t.eduDesc}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {educations.map(edu => (
             <div key={edu.id} className="glass-panel p-8 md:p-10 rounded-[3rem] hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-white/10"><div className="w-16 h-16 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white rounded-[1.2rem] flex items-center justify-center mb-6 shadow-sm border border-gray-200 dark:border-white/20"><GraduationCap size={32}/></div><span className="text-[12px] font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-white/10 px-3.5 py-1.5 rounded-lg mb-4 inline-block shadow-sm border border-gray-200 dark:border-white/20">{tText(edu.period, lang)}</span><h3 className="text-2xl font-black dark:text-white mb-2 leading-snug">{tText(edu.degree, lang)}</h3><h4 className="font-bold text-gray-600 dark:text-gray-400 mb-5">{tText(edu.institution, lang)}</h4><p className="text-[14.5px] font-medium text-gray-700 dark:text-gray-300">{tText(edu.desc, lang)}</p></div>
          ))}
          {educations.length === 0 && <div className="col-span-2 text-center py-10 text-gray-500">{t.noEdu}</div>}
        </div>
      </div>
    );

    if (currentPath === '/skills') return (
      <div className="max-w-5xl mx-auto pt-6 w-full pb-20 animate-page-enter">
        <SEO title={t.skillsTitle || t.mySkills} />
        <h1 className="text-4xl font-black dark:text-white mb-2">{t.skillsTitle || t.mySkills}</h1>
        <p className="text-[16px] text-gray-600 dark:text-gray-400 font-medium mb-12 border-b border-gray-200 dark:border-white/10 pb-6">{t.skillsDesc || t.mySkillsDesc}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-6">
          {skills.map(s => (<div key={s.id} className="glass-panel p-6 rounded-[2rem] flex flex-col items-center gap-5 hover:-translate-y-2 hover:shadow-xl transition-all border border-gray-200 dark:border-white/10"><div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-white/5 p-3 rounded-2xl shadow-sm border border-gray-200 dark:border-white/10"><img src={s.img} loading="lazy" className={`w-full h-full object-contain ${s.invert ? 'dark:invert' : ''}`} alt=""/></div><h3 className="font-bold dark:text-white">{tText(s.name, lang)}</h3></div>))}
        </div>
      </div>
    );

    if (currentPath === '/links') return (
      <div className="max-w-2xl mx-auto pt-12 w-full pb-20 animate-page-enter text-center">
        <SEO title={t.links} />
        <img src={profile.profileImage} alt="Profile" className="w-28 h-28 rounded-full border-[6px] border-white/60 dark:border-gray-800 shadow-2xl object-cover mx-auto mb-5 animate-float bg-gray-100 dark:bg-gray-900" />
        <h1 className="text-3xl font-black dark:text-white mb-2 tracking-tight">{tText(profile.name, lang)}</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2 font-bold uppercase tracking-widest text-[11px] mb-12">{t.linkDesc}</p>
        <div className="space-y-5 w-full">{links.map(l => (<a key={l.id} href={l.url} target="_blank" rel="noreferrer" className="block w-full p-6 glass-panel rounded-[2rem] text-left hover:-translate-y-1 hover:shadow-2xl transition-all border border-gray-200 dark:border-white/10 flex justify-between items-center group"><div className="min-w-0 flex-1"><h3 className="font-black dark:text-white text-lg group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">{tText(l.label, lang)}</h3><p className="text-gray-500 font-bold mt-1">{tText(l.desc, lang)}</p></div><div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-600 dark:text-white group-hover:bg-gray-200 dark:group-hover:bg-white/20 transition-all shadow-sm border border-gray-200 dark:border-white/20"><ExternalLink size={18} /></div></a>))}</div>
      </div>
    );

    if (currentPath === '/technical') {
      const allTechTags = [t.all, ...new Set(projects.filter(p => p.type === 'technical').flatMap(p => p.tech || []))];
      const filtered = projects.filter(p => p.type === 'technical' && (techFilter === 'All' || techFilter === t.all || (p.tech && p.tech.includes(techFilter))));
      const displayed = filtered.slice(0, visibleTech);
      return (
        <div className="max-w-5xl mx-auto pt-6 w-full animate-page-enter">
          <SEO title={t.technicalTitle} />
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 reveal-on-scroll delay-0">{t.technicalTitle}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-10 text-[16px] font-medium reveal-on-scroll delay-100">{t.portfolioSub}</p>
          
          <div className="flex flex-wrap gap-2.5 mb-10 reveal-on-scroll delay-200">
             {allTechTags.map(tag => (
               <button key={tag} onClick={() => {setTechFilter(tag); setVisibleTech(6);}} className={`px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all border border-gray-200 dark:border-white/10 ${techFilter === tag ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-md transform scale-105' : 'glass-panel text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-white/5'}`}>{tag}</button>
             ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full reveal-on-scroll delay-200">
              {displayed.map(proj => (
                <div key={proj.id} onClick={() => navigate(`/technical/${proj.id}`)} className="glass-panel rounded-[2.5rem] overflow-hidden cursor-pointer group hover:-translate-y-2 transition-all flex flex-col w-full shadow-sm border border-gray-200 dark:border-white/10 hover:shadow-2xl hover:border-gray-400 dark:hover:border-white/30">
                  <div className="w-full h-56 overflow-hidden relative"><img src={proj.image} loading="lazy" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" /></div>
                  <div className="p-8 flex-1 flex flex-col w-full"><div className="flex justify-between items-start mb-4"><h3 className="text-xl font-black dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300">{tText(proj.title, lang)}</h3>{proj.featured && <span className="bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-gray-200 dark:border-white/20">{t.featured}</span>}</div><p className="text-[14.5px] text-gray-600 dark:text-gray-400 mb-6 flex-1 line-clamp-2">{tText(proj.shortDesc, lang)}</p><div className="flex flex-wrap gap-2 mt-auto">{(proj.tech || []).slice(0, 4).map((tItem, i) => <span key={i} className="text-[11px] font-bold bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/20 px-3 py-1.5 rounded-lg shadow-sm text-gray-800 dark:text-gray-200">{tItem}</span>)}</div></div>
                </div>
              ))}
          </div>
          {filtered.length > visibleTech && (
             <div className="mt-12 flex justify-center reveal-on-scroll">
               <button onClick={() => setVisibleTech(prev => prev + 6)} className="px-8 py-3.5 rounded-xl glass-panel font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-sm border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white">{t.loadMore}</button>
             </div>
          )}
          {filtered.length === 0 && <div className="py-16 text-center text-gray-500 font-medium">{t.noProjects}</div>}
        </div>
      );
    }

    if (currentPath.startsWith('/technical/')) {
      const id = currentPath.split('/')[2]; const proj = projects.find(p => p.id === id);
      if (!proj) return <div className="text-center pt-20 text-gray-500 font-bold">{t.notFound}</div>;
      return (
        <div className="max-w-5xl mx-auto pt-6 w-full animate-page-enter">
          <SEO title={tText(proj.title, lang)} desc={tText(proj.shortDesc, lang)} img={proj.image} />
          <div className="flex justify-between items-center mb-8 reveal-on-scroll delay-0">
            <button onClick={() => navigate(`/technical`)} className="flex items-center gap-2 px-5 py-2.5 glass-panel rounded-xl font-bold hover:scale-105 transition-all w-fit border border-gray-200 dark:border-white/10 shadow-sm"><ArrowLeft size={16}/> {t.backToProjects}</button>
            <button onClick={() => handleShare(tText(proj.title, lang), tText(proj.shortDesc, lang))} className="flex items-center gap-2 px-5 py-2.5 glass-panel rounded-xl font-bold text-gray-900 dark:text-white hover:scale-105 transition-all w-fit border border-gray-200 dark:border-white/10 shadow-sm"><Share2 size={16}/> {t.share}</button>
          </div>
          <div className="mb-12">
            <span className="bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm mb-4 inline-block tracking-wider uppercase border border-transparent">{proj.category || 'Web Application'}</span>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-4 leading-tight">{tText(proj.title, lang)}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-bold">{tText(proj.shortDesc, lang)}</p>
          </div>
          <div className="w-full rounded-[3rem] overflow-hidden shadow-2xl mb-12 border border-gray-200 dark:border-white/10"><img src={proj.image} className="w-full h-auto max-h-[600px] object-cover" alt=""/></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="md:col-span-2 flex flex-col gap-4">
                <DetailCard title={t.overview} content={tText(proj.overview, lang)} t={t}/>
                <DetailCard title={t.projectGoals} content={tText(proj.goals, lang)} icon={Target} t={t}/>
                <DetailCard title={t.keyFeatures} content={tText(proj.features, lang)} icon={CheckCircle} t={t}/>
                <DetailCard title={t.challenges} content={tText(proj.challenges, lang)} icon={Lightbulb} t={t}/>
             </div>
             <div className="md:col-span-1">
                <DetailCard title={t.projectInfo} t={t}>
                   <div className="space-y-4 text-[14.5px]"><div><p className="text-gray-500 font-bold text-[12px] uppercase tracking-wider">{t.client}</p><p className="font-bold dark:text-white">{tText(proj.client, lang) || t.notAvailable}</p></div><div><p className="text-gray-500 font-bold text-[12px] uppercase tracking-wider">{t.duration}</p><p className="font-bold dark:text-white">{proj.duration || t.notAvailable}</p></div><div><p className="text-gray-500 font-bold text-[12px] uppercase tracking-wider">{t.year}</p><p className="font-bold dark:text-white">{proj.year || '2024'}</p></div></div>
                </DetailCard>
                <DetailCard title={t.techUsed} t={t}>
                   <div className="flex flex-wrap gap-2">{(proj.tech || []).map((tItem, i) => <span key={i} className="px-3 py-1.5 bg-gray-100 dark:bg-white/10 shadow-sm rounded-lg text-[13px] font-bold text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-white/20">{tItem}</span>)}</div>
                </DetailCard>
             </div>
          </div>
        </div>
      );
    }

    if (currentPath === '/creative') {
      const filtered = projects.filter(p => p.type === 'creative');
      const displayed = filtered.slice(0, visibleCreative);
      return (
        <div className="max-w-5xl mx-auto pt-6 w-full animate-page-enter">
          <SEO title={t.creativeTitle} />
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 reveal-on-scroll delay-0">{t.creativeTitle}</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-12 text-[16px] font-medium reveal-on-scroll delay-100">{t.creativeSub}</p>
          <div className="flex flex-col gap-8 w-full max-w-full reveal-on-scroll delay-200">
              {displayed.map(proj => (
                <div key={proj.id} onClick={() => navigate(`/creative/${proj.id}`)} className="glass-panel rounded-[2.5rem] overflow-hidden cursor-pointer group hover:-translate-y-2 transition-all flex flex-col md:flex-row w-full shadow-sm border border-gray-200 dark:border-white/10 hover:shadow-2xl hover:border-gray-400 dark:hover:border-white/30">
                  <div className="w-full md:w-[40%] h-64 md:h-auto shrink-0 overflow-hidden relative">
                    <img src={proj.image} loading="lazy" alt={tText(proj.title, lang)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 absolute inset-0" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500 flex items-center justify-center">
                       <span className="bg-white/95 text-gray-900 text-xs font-bold px-5 py-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0">{t.viewGallery} <ChevronRight size={14}/></span>
                    </div>
                  </div>
                  <div className="p-8 md:p-10 flex-1 min-w-0 flex flex-col w-full">
                    <div className="flex flex-wrap gap-2 mb-5"><span className="bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-sm uppercase tracking-wider">{proj.category || 'Creative'}</span>{(proj.tech || []).slice(0,2).map((tItem, i) => <span key={i} className="glass-panel text-gray-600 dark:text-gray-300 px-3 py-1.5 rounded-lg text-[11px] font-bold border border-gray-200 dark:border-white/10 shadow-sm">{tItem}</span>)}</div>
                    <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-3 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors line-clamp-2 leading-snug">{tText(proj.title, lang)}</h3>
                    <p className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed mb-6 line-clamp-3 font-medium">{tText(proj.shortDesc, lang)}</p>
                    <div className="mt-auto pt-6 border-t border-gray-200 dark:border-white/10 flex items-center justify-between"><p className="text-[13px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{t.organizedBy} <span className="text-gray-800 dark:text-gray-200">{tText(proj.client, lang) || t.notAvailable}</span></p></div>
                  </div>
                </div>
              ))}
          </div>
          {filtered.length > visibleCreative && (
             <div className="mt-12 flex justify-center reveal-on-scroll">
               <button onClick={() => setVisibleCreative(prev => prev + 6)} className="px-8 py-3.5 rounded-xl glass-panel font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-sm border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white">{t.loadMore}</button>
             </div>
          )}
          {filtered.length === 0 && <div className="py-16 text-center text-gray-500 font-medium">{t.noProjects}</div>}
        </div>
      );
    }

    if (currentPath.startsWith('/creative/')) {
      const id = currentPath.split('/')[2]; const proj = projects.find(p => p.id === id);
      if (!proj) return <div className="text-center pt-20 text-gray-500 font-bold">{t.notFound}</div>;
      const galleryItems = proj.gallery || [{ type: 'image', url: proj.image, caption: proj.shortDesc }];

      return (
        <div className="max-w-6xl mx-auto pt-6 w-full animate-page-enter">
          <SEO title={tText(proj.title, lang)} desc={tText(proj.shortDesc, lang)} img={proj.image} />
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start w-full relative">
            <div className="w-full lg:w-1/3 flex flex-col gap-6 lg:sticky lg:top-24 z-10 reveal-on-scroll delay-0">
               <div className="flex justify-between items-center w-full">
                  <button onClick={() => navigate('/creative')} className="mb-2 flex items-center gap-2 px-5 py-2.5 glass-panel rounded-xl text-gray-700 dark:text-gray-300 text-sm font-bold shadow-sm w-fit hover:scale-105 active:scale-95 transition-all border border-gray-200 dark:border-white/10"><ArrowLeft size={16} /> {t.back}</button>
                  <button onClick={() => handleShare(tText(proj.title, lang), tText(proj.shortDesc, lang))} className="mb-2 flex items-center gap-2 px-5 py-2.5 glass-panel rounded-xl text-gray-900 dark:text-white text-sm font-bold shadow-sm w-fit hover:scale-105 active:scale-95 transition-all border border-gray-200 dark:border-white/10"><Share2 size={16} /> {t.share}</button>
               </div>
               <div className="flex flex-wrap gap-2"><span className="bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wider shadow-sm uppercase">{proj.category || 'Creative Work'}</span></div>
               <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-[1.1]">{tText(proj.title, lang)}</h1>
               <div className="flex flex-wrap items-center gap-4 text-[14px] font-bold text-gray-600 dark:text-gray-400 border-y border-gray-200 dark:border-white/10 py-5 mt-2">
                 {proj.date && <div className="flex items-center gap-2"><Calendar size={16} className="text-gray-900 dark:text-white"/> {proj.date}</div>}
                 {proj.location && <div className="flex items-center gap-2"><MapPin size={16} className="text-gray-900 dark:text-white"/> {proj.location}</div>}
               </div>
               <div className="prose prose-sm dark:prose-invert text-gray-700 dark:text-gray-300 font-medium leading-relaxed">
                 <h4 className="text-[16px] font-black text-gray-900 dark:text-white mb-2">{t.creativeStory}</h4>
                 <p>{tText(proj.overview, lang) || tText(proj.shortDesc, lang)}</p>
               </div>
               <div className="mt-4"><h4 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">{t.techUsed}</h4><div className="flex flex-wrap gap-2">{(proj.tech || []).map((tItem, i) => <span key={i} className="text-[11px] font-semibold glass-panel text-gray-800 dark:text-gray-200 px-3.5 py-1.5 rounded-full border border-gray-200 dark:border-white/10 shadow-sm bg-gray-100 dark:bg-white/5">{tItem}</span>)}</div></div>
               <div className="glass-panel rounded-2xl p-6 mt-6 border-l-4 border-l-gray-900 dark:border-l-white shadow-sm bg-gray-50 dark:bg-white/5"><p className="text-[11px] text-gray-500 uppercase tracking-widest font-black mb-1.5">{t.organizedBy}</p><p className="text-[15px] font-black text-gray-900 dark:text-white">{tText(proj.client, lang) || t.notAvailable}</p></div>
            </div>
            <div className="w-full lg:w-2/3 flex flex-col gap-12 pb-16">
               <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{t.gallery}</h3>
               {galleryItems.map((media, idx) => (
                  <div key={idx} className={`w-full flex flex-col gap-5 reveal-on-scroll delay-${(idx % 4) * 100}`}>
                     <div className="w-full rounded-[2.5rem] overflow-hidden glass-panel group relative border border-gray-200 dark:border-white/10 shadow-lg">
                        {media.url.match(/\.(mp4|webm|ogg)$/i) ? (
                          <div className="aspect-[4/3] md:aspect-video w-full relative flex items-center justify-center bg-black">
                            <video src={media.url} controls className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000" />
                          </div>
                        ) : (<img src={media.url} loading="lazy" alt={`Gallery ${idx}`} className="w-full h-auto object-cover max-h-[80vh]" />)}
                     </div>
                     {media.caption && (<div className="px-6 flex items-start gap-4"><div className="w-10 h-10 rounded-xl glass-panel flex items-center justify-center shrink-0 mt-0.5 border border-gray-200 dark:border-white/10 shadow-sm bg-gray-100 dark:bg-white/5">{media.url.match(/\.(mp4|webm|ogg)$/i) ? <Video size={18} className="text-gray-900 dark:text-white"/> : <Palette size={18} className="text-gray-900 dark:text-white"/>}</div><p className="text-[15px] font-medium text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl pt-2">{tText(media.caption, lang)}</p></div>)}
                  </div>
               ))}
            </div>
          </div>
        </div>
      );
    }

    if (currentPath === '/thoughts') {
      const allTags = [t.all, ...new Set(blogs.map(b => b.tag).filter(Boolean))];
      const filtered = blogs.filter(b => {
        const matchesSearch = (tText(b.title, lang) || '').toLowerCase().includes(thoughtsSearch.toLowerCase()) || (tText(b.summary, lang) || '').toLowerCase().includes(thoughtsSearch.toLowerCase());
        const matchesFilter = thoughtsFilter === 'All' || thoughtsFilter === t.all || b.tag === thoughtsFilter;
        return matchesSearch && matchesFilter;
      });
      const displayed = filtered.slice(0, visibleThoughts);
      
      return (
        <div className="max-w-5xl mx-auto pt-6 w-full animate-page-enter">
          <SEO title={t.thoughtsTitle} />
          <h1 className="text-4xl font-black dark:text-white mb-2">{t.thoughtsTitle}</h1><p className="text-gray-600 dark:text-gray-400 mb-12 font-medium">{t.thoughtsSub}</p>
          <div className="mb-12 w-full reveal-on-scroll delay-200">
            <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full"><div className="relative flex-1"><Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="text" placeholder={t.searchPlaceholder} value={thoughtsSearch} onChange={(e) => setThoughtsSearch(e.target.value)} className="w-full pl-14 pr-5 py-4 rounded-2xl glass-panel outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white font-bold border border-gray-200 dark:border-white/10 shadow-sm" /></div><button className="bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 px-8 py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-95 text-[15px]">{t.searchBtn}</button></div>
            <div className="flex flex-wrap gap-2.5">{allTags.map(tag => (<button key={tag} onClick={() => {setThoughtsFilter(tag); setVisibleThoughts(6);}} className={`px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all border border-gray-200 dark:border-white/10 ${thoughtsFilter === tag || (thoughtsFilter === 'All' && tag === 'Semua') ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-md transform scale-105' : 'glass-panel text-gray-600 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-white/5'}`}>{tag}</button>))}</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayed.map((blog, idx) => (
              <div key={blog.id} onClick={() => navigate(`/thoughts/${blog.id}`)} className={`glass-panel rounded-[2.5rem] overflow-hidden cursor-pointer group hover:-translate-y-2 transition-all flex flex-col border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-2xl delay-${(idx % 4) * 100}`}>
                <div className="h-64 overflow-hidden relative"><img src={blog.thumbnail} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="" /></div>
                <div className="p-8 flex-1 flex flex-col"><span className="bg-gray-900 text-white dark:bg-white dark:text-gray-900 border border-transparent px-3.5 py-1.5 rounded-lg text-[11px] font-black uppercase mb-5 w-fit shadow-sm">{blog.tag}</span><h3 className="text-2xl font-black dark:text-white mb-3 group-hover:text-gray-600 dark:group-hover:text-gray-300 leading-snug">{tText(blog.title, lang)}</h3><p className="text-[15px] text-gray-600 dark:text-gray-400 mb-8 flex-1 line-clamp-2 font-medium">{tText(blog.summary, lang)}</p><div className="mt-auto flex items-center gap-6 text-[13px] font-bold text-gray-500 border-t border-gray-200 dark:border-white/10 pt-5"><div className="flex items-center gap-2"><Calendar size={16}/> {blog.date}</div><div className="flex items-center gap-2"><Clock size={16}/> {blog.readTime} {t.readText}</div></div></div>
              </div>
            ))}
          </div>
          {filtered.length > visibleThoughts && (
             <div className="mt-12 flex justify-center reveal-on-scroll">
               <button onClick={() => setVisibleThoughts(prev => prev + 6)} className="px-8 py-3.5 rounded-xl glass-panel font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-sm border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white">{t.loadMore}</button>
             </div>
          )}
          {filtered.length === 0 && <div className="py-16 text-center text-gray-500 font-medium">{t.noArticles}</div>}
        </div>
      );
    }

    if (currentPath.startsWith('/thoughts/')) {
      const id = currentPath.split('/')[2]; const blog = blogs.find(b => b.id === id);
      if (!blog) return <div className="text-center pt-20 text-gray-500 font-bold">{t.notFound}</div>;
      return (
        <div className="max-w-4xl mx-auto pt-6 w-full animate-page-enter glass-panel p-8 md:p-16 rounded-[3rem] border border-gray-200 dark:border-white/10 shadow-xl">
          <SEO title={tText(blog.title, lang)} desc={tText(blog.summary, lang)} img={blog.thumbnail} />
          <div className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-white/10 pb-6">
            <button onClick={() => navigate('/thoughts')} className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 dark:bg-white/5 rounded-xl font-bold shadow-sm hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-200 dark:border-white/10"><ArrowLeft size={16}/> {t.back}</button>
            <button onClick={() => handleShare(tText(blog.title, lang), tText(blog.summary, lang))} className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 dark:bg-white/5 rounded-xl font-bold shadow-sm hover:text-gray-900 dark:hover:text-white transition-colors border border-gray-200 dark:border-white/10"><Share2 size={16}/> {t.share}</button>
          </div>
          <span className="bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-4 py-1.5 rounded-lg text-xs font-black uppercase mb-6 inline-block shadow-sm">{blog.tag}</span>
          <h1 className="text-4xl md:text-6xl font-black dark:text-white mb-8 leading-[1.15]">{tText(blog.title, lang)}</h1>
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-[14px] text-gray-500 dark:text-gray-400 mb-10 font-bold border-b border-gray-200 dark:border-white/10 pb-8"><div className="flex items-center gap-2.5"><User size={18} className="text-gray-900 dark:text-white"/> {tText(profile.name, lang)}</div><div className="flex items-center gap-2.5"><Calendar size={18} className="text-gray-900 dark:text-white"/> {blog.date}</div><div className="flex items-center gap-2.5"><Clock size={18} className="text-gray-900 dark:text-white"/> {blog.readTime} {t.readText}</div></div>
          <div className="w-full rounded-[2rem] overflow-hidden mb-12 shadow-xl border border-gray-200 dark:border-white/10"><img src={blog.thumbnail} className="w-full h-auto object-cover max-h-[500px]" alt=""/></div>
          <div className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-loose font-medium">
             <div className="bg-gray-50 dark:bg-white/5 backdrop-blur-md p-8 md:p-10 rounded-[2rem] border border-gray-200 dark:border-white/10 mb-10 shadow-inner">
               <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 mt-0 tracking-tight">{t.blogKnowledgeSession}</h3>
               <p className="mb-0 text-gray-700 dark:text-gray-300 leading-relaxed text-[16px]">{tText(blog.summary, lang)}</p>
             </div>
             <div className="article-content leading-relaxed" dangerouslySetInnerHTML={{ __html: tText(blog.content, lang) || "<p>Konten artikel akan tampil di sini...</p>" }} />
          </div>
        </div>
      );
    }

    if (currentPath === '/dashboard') {
      if (!isAuthenticated) return (
        <div className="flex items-center justify-center min-h-[80vh] w-full px-4"><form onSubmit={handleLogin} className="glass-panel p-12 rounded-[3rem] w-full max-w-md text-center shadow-2xl border border-gray-200 dark:border-white/10"><div className="w-24 h-24 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white rounded-[1.5rem] flex items-center justify-center mx-auto mb-8 shadow-xl border border-gray-200 dark:border-white/20 transform rotate-3"><Lock size={40} strokeWidth={2.5}/></div><h1 className="text-3xl font-black dark:text-white mb-8 tracking-tight">CMS Access</h1><input type="password" value={loginPassword} onChange={e=>setLoginPassword(e.target.value)} placeholder="••••••••" className="w-full px-6 py-4 rounded-2xl glass-panel text-center tracking-[0.5em] font-black mb-6 border border-gray-200 dark:border-white/10 outline-none focus:ring-4 focus:ring-gray-900/30 dark:focus:ring-white/30 dark:text-white shadow-inner" /><button type="submit" className="w-full py-4 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 font-black rounded-2xl shadow-lg shadow-gray-900/30 dark:shadow-white/30 transition-all active:scale-95 flex items-center justify-center gap-2">Buka Workspace <ChevronRight size={18}/></button></form></div>
      );

      return (
        <div className="max-w-6xl mx-auto pb-24 w-full animate-dashboard-enter">
          <SEO title="Admin Dashboard" />
          
          {isModalOpen && (
             <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
                <form onSubmit={handleSaveData} className="glass-panel w-full max-w-4xl rounded-[3rem] p-8 md:p-10 shadow-2xl bg-white/95 dark:bg-[#0a0a0a]/95 max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-white/10 animate-fade-in relative custom-scrollbar">
                   
                   {isUploading && (
                     <div className="absolute inset-0 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-[3rem]">
                       <div className="w-12 h-12 border-4 border-gray-900 dark:border-white border-t-transparent rounded-full animate-spin mb-4"></div>
                       <p className="font-bold text-gray-800 dark:text-white animate-pulse">Menyimpan data dan mengunggah media...</p>
                     </div>
                   )}

                   <div className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-white/10 pb-5"><h2 className="text-2xl font-black dark:text-white flex items-center gap-3"><Settings size={24} className="text-gray-900 dark:text-white"/> Form {modalType.toUpperCase()}</h2><button type="button" onClick={closeModal} className="p-2.5 bg-gray-100 dark:bg-white/10 rounded-full text-gray-500 hover:text-white hover:bg-red-500 transition-all"><X size={20}/></button></div>
                   <div className="space-y-8">
                      {(modalType === 'project' || modalType === 'blog' || modalType === 'skill') && (
                        <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-[2rem] border-dashed border border-gray-300 dark:border-white/20 shadow-inner">
                          <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-widest">Media Utama (Otomatis Crop)</label>
                          <div className="flex flex-col sm:flex-row items-center gap-6">
                             <div className="w-40 h-28 bg-gray-200 dark:bg-black/50 rounded-2xl overflow-hidden flex items-center justify-center border-4 border-white dark:border-white/10 shadow-inner">
                                {previewImage instanceof File ? (
                                  <img src={URL.createObjectURL(previewImage)} className="w-full h-full object-cover"/>
                                ) : (
                                  (editingItem?.image || editingItem?.thumbnail || editingItem?.img) ? <img src={editingItem.image || editingItem.thumbnail || editingItem.img} className="w-full h-full object-cover"/> : <ImageIcon size={32} className="text-gray-400"/>
                                )}
                             </div>
                             <div className="flex flex-col gap-3 w-full sm:w-auto">
                                <label className="px-6 py-4 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 font-bold rounded-xl cursor-pointer shadow-lg active:scale-95 text-sm transition-all flex items-center justify-center">
                                   <UploadCloud size={18} className="inline mr-2"/> Pilih & Crop Gambar
                                   <input type="file" accept="image/*,video/mp4" onChange={(e) => triggerCropModal(e, 'preview')} className="hidden"/>
                                </label>
                                <p className="text-[11px] text-gray-500 font-bold text-center">Video MP4 tidak akan di-crop</p>
                             </div>
                          </div>
                        </div>
                      )}
                      
                      {/* INPUT BILINGUAL - PROYEK */}
                      {modalType === 'project' && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div><label className="text-xs font-bold text-gray-500 uppercase">Judul (Indonesia)</label><input name="title_id" defaultValue={splitText(editingItem?.title).id} required className="w-full mt-2 p-4 glass-panel rounded-xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"/></div>
                             <div><label className="text-xs font-bold text-gray-500 uppercase">Title (English)</label><input name="title_en" defaultValue={splitText(editingItem?.title).en} className="w-full mt-2 p-4 glass-panel rounded-xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"/></div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div><label className="text-xs font-bold text-gray-500 uppercase">Deskripsi Singkat (ID)</label><textarea name="shortDesc_id" defaultValue={splitText(editingItem?.shortDesc).id} required rows="3" className="w-full mt-2 p-4 glass-panel rounded-xl font-medium dark:text-white resize-none outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"/></div>
                             <div><label className="text-xs font-bold text-gray-500 uppercase">Short Desc (EN)</label><textarea name="shortDesc_en" defaultValue={splitText(editingItem?.shortDesc).en} rows="3" className="w-full mt-2 p-4 glass-panel rounded-xl font-medium dark:text-white resize-none outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"/></div>
                          </div>
                          
                          <div className="p-6 bg-white/50 dark:bg-white/5 rounded-[2rem] border border-gray-200 dark:border-white/10 space-y-4">
                             <h4 className="font-black text-gray-800 dark:text-white mb-2 border-b border-gray-200 dark:border-white/10 pb-2">Detail Ekstra (Opsional)</h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <textarea name="overview_id" placeholder="Overview (ID)..." defaultValue={splitText(editingItem?.overview).id} rows="2" className="w-full p-4 glass-panel rounded-xl font-medium dark:text-white resize-none text-sm"/>
                               <textarea name="overview_en" placeholder="Overview (EN)..." defaultValue={splitText(editingItem?.overview).en} rows="2" className="w-full p-4 glass-panel rounded-xl font-medium dark:text-white resize-none text-sm"/>
                             </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               <textarea name="features_id" placeholder="Fitur (ID)..." defaultValue={splitText(editingItem?.features).id} rows="2" className="w-full p-4 glass-panel rounded-xl font-medium dark:text-white resize-none text-sm"/>
                               <textarea name="features_en" placeholder="Features (EN)..." defaultValue={splitText(editingItem?.features).en} rows="2" className="w-full p-4 glass-panel rounded-xl font-medium dark:text-white resize-none text-sm"/>
                             </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <select name="type" defaultValue={editingItem?.type || defaultProjType} className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white dark:bg-[#111111] outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"><option value="technical">Technical</option><option value="creative">Creative</option></select>
                             <input name="tech" defaultValue={(editingItem?.tech||[]).join(',')} placeholder="Teknologi (Koma: React, Node)" className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"/>
                          </div>
                          
                          <div className="flex items-center gap-3 bg-gray-100 dark:bg-white/10 p-4 rounded-xl border border-gray-200 dark:border-white/20">
                             <input type="checkbox" name="featured" defaultChecked={editingItem?.featured} id="fCheck" className="w-5 h-5 cursor-pointer rounded border-gray-300 text-gray-900 focus:ring-gray-900"/>
                             <label htmlFor="fCheck" className="text-[14px] font-black text-gray-800 dark:text-gray-200 cursor-pointer select-none">Tampilkan di Beranda (Featured)</label>
                          </div>
                        </>
                      )}
                      
                      {/* INPUT BILINGUAL - BLOG */}
                      {modalType === 'blog' && (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div><label className="text-xs font-bold text-gray-500 uppercase">Judul Artikel (ID)</label><input name="title_id" defaultValue={splitText(editingItem?.title).id} required className="w-full mt-2 p-4 glass-panel rounded-xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"/></div>
                             <div><label className="text-xs font-bold text-gray-500 uppercase">Blog Title (EN)</label><input name="title_en" defaultValue={splitText(editingItem?.title).en} className="w-full mt-2 p-4 glass-panel rounded-xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"/></div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div><label className="text-xs font-bold text-gray-500 uppercase">Ringkasan (ID)</label><textarea name="summary_id" defaultValue={splitText(editingItem?.summary).id} required rows="2" className="w-full mt-2 p-4 glass-panel rounded-xl font-medium dark:text-white outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"/></div>
                             <div><label className="text-xs font-bold text-gray-500 uppercase">Summary (EN)</label><textarea name="summary_en" defaultValue={splitText(editingItem?.summary).en} rows="2" className="w-full mt-2 p-4 glass-panel rounded-xl font-medium dark:text-white outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"/></div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             <input name="tag" defaultValue={editingItem?.tag} placeholder="Tag/Kategori" required className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"/>
                             <input name="readTime" defaultValue={editingItem?.readTime} placeholder="Waktu Baca (misal: 5 min)" className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"/>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-[#111111] rounded-xl overflow-hidden border border-gray-200 dark:border-white/10">
                               <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 p-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">Konten Artikel (ID)</label>
                               <ReactQuill theme="snow" value={blogContentId} onChange={setBlogContentId} modules={quillModules} className="text-gray-900 dark:text-white h-64 pb-10" />
                            </div>
                            <div className="bg-white dark:bg-[#111111] rounded-xl overflow-hidden border border-gray-200 dark:border-white/10">
                               <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 p-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">Content (EN)</label>
                               <ReactQuill theme="snow" value={blogContentEn} onChange={setBlogContentEn} modules={quillModules} className="text-gray-900 dark:text-white h-64 pb-10" />
                            </div>
                          </div>
                        </>
                      )}

                      {/* INPUT BILINGUAL - EXPERIENCE */}
                      {modalType === 'experience' && (
                         <>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <input name="role_id" defaultValue={splitText(editingItem?.role).id} placeholder="Jabatan (ID)" required className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"/>
                             <input name="role_en" defaultValue={splitText(editingItem?.role).en} placeholder="Role (EN)" className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"/>
                             <input name="company_id" defaultValue={splitText(editingItem?.company).id} placeholder="Nama Perusahaan (ID)" required className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"/>
                             <input name="company_en" defaultValue={splitText(editingItem?.company).en} placeholder="Company (EN)" className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"/>
                             <input name="period_id" defaultValue={splitText(editingItem?.period).id} placeholder="Periode (ID: Jan 2023 - Sek)" required className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"/>
                             <input name="period_en" defaultValue={splitText(editingItem?.period).en} placeholder="Period (EN: Jan 2023 - Pres)" className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"/>
                             <textarea name="desc_id" defaultValue={splitText(editingItem?.desc).id} placeholder="Deskripsi (ID)" required rows="3" className="w-full p-4 glass-panel rounded-xl font-medium dark:text-white resize-none"/>
                             <textarea name="desc_en" defaultValue={splitText(editingItem?.desc).en} placeholder="Description (EN)" rows="3" className="w-full p-4 glass-panel rounded-xl font-medium dark:text-white resize-none"/>
                           </div>
                         </>
                      )}

                      {/* INPUT BILINGUAL - EDUCATION */}
                      {modalType === 'education' && (
                         <>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <input name="degree_id" defaultValue={splitText(editingItem?.degree).id} placeholder="Gelar (ID)" required className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"/>
                             <input name="degree_en" defaultValue={splitText(editingItem?.degree).en} placeholder="Degree (EN)" className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"/>
                             <input name="institution_id" defaultValue={splitText(editingItem?.institution).id} placeholder="Nama Institusi (ID)" required className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"/>
                             <input name="institution_en" defaultValue={splitText(editingItem?.institution).en} placeholder="Institution (EN)" className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"/>
                             <input name="period_id" defaultValue={splitText(editingItem?.period).id} placeholder="Periode (ID)" required className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"/>
                             <input name="period_en" defaultValue={splitText(editingItem?.period).en} placeholder="Period (EN)" className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"/>
                             <textarea name="desc_id" defaultValue={splitText(editingItem?.desc).id} placeholder="Deskripsi (ID)" required rows="3" className="w-full p-4 glass-panel rounded-xl font-medium dark:text-white resize-none"/>
                             <textarea name="desc_en" defaultValue={splitText(editingItem?.desc).en} placeholder="Description (EN)" rows="3" className="w-full p-4 glass-panel rounded-xl font-medium dark:text-white resize-none"/>
                           </div>
                         </>
                      )}

                      {/* INPUT BILINGUAL - SKILL */}
                      {modalType === 'skill' && (
                        <>
                           <input name="name_id" defaultValue={splitText(editingItem?.name).id} placeholder="Nama Skill (ID)" required className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white shadow-sm"/>
                           <input name="name_en" defaultValue={splitText(editingItem?.name).en} placeholder="Skill Name (EN)" className="w-full mt-4 p-4 glass-panel rounded-xl font-bold dark:text-white outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white shadow-sm"/>
                           <div className="flex items-center gap-3 bg-gray-100 dark:bg-white/10 mt-4 p-4 rounded-xl border border-gray-200 dark:border-white/20">
                              <input type="checkbox" name="invert" defaultChecked={editingItem?.invert} id="invCheck" className="w-5 h-5 cursor-pointer rounded text-gray-900 focus:ring-gray-900"/>
                              <label htmlFor="invCheck" className="text-[14px] font-black text-gray-800 dark:text-gray-200 cursor-pointer select-none">Invert warna otomatis di Mode Gelap</label>
                           </div>
                        </>
                      )}

                      {/* INPUT BILINGUAL - LINK & SERVICE */}
                      {modalType === 'link' && (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <input name="label_id" defaultValue={splitText(editingItem?.label).id} placeholder="Label Link (ID)" required className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white"/>
                             <input name="label_en" defaultValue={splitText(editingItem?.label).en} placeholder="Label Link (EN)" className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white"/>
                             <input name="url" defaultValue={editingItem?.url} placeholder="URL Lengkap (https://...)" required className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white col-span-full"/>
                             <input name="desc_id" defaultValue={splitText(editingItem?.desc).id} placeholder="Deskripsi Singkat (ID)" className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white"/>
                             <input name="desc_en" defaultValue={splitText(editingItem?.desc).en} placeholder="Short Desc (EN)" className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white"/>
                         </div>
                      )}
                      {modalType === 'service' && (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <input name="title_id" defaultValue={splitText(editingItem?.title).id} placeholder="Layanan (ID)" required className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white"/>
                             <input name="title_en" defaultValue={splitText(editingItem?.title).en} placeholder="Service (EN)" className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white"/>
                             <textarea name="desc_id" defaultValue={splitText(editingItem?.desc).id} placeholder="Deskripsi (ID)" required rows="3" className="w-full p-4 glass-panel rounded-xl font-medium dark:text-white resize-none"/>
                             <textarea name="desc_en" defaultValue={splitText(editingItem?.desc).en} placeholder="Description (EN)" rows="3" className="w-full p-4 glass-panel rounded-xl font-medium dark:text-white resize-none"/>
                             <input name="icon" defaultValue={editingItem?.icon} placeholder="Nama Icon (Code, Terminal, dll)" required className="w-full p-4 glass-panel rounded-xl font-bold dark:text-white col-span-full"/>
                         </div>
                      )}
                   </div>
                   <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-gray-200 dark:border-white/10"><button type="button" onClick={closeModal} disabled={isUploading} className="px-6 py-3 rounded-xl bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-gray-200 font-bold active:scale-95 text-sm transition-colors hover:bg-gray-300 dark:hover:bg-white/20 disabled:opacity-50">Batal</button><button type="submit" disabled={isUploading} className="px-8 py-3 rounded-xl bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 font-black shadow-lg shadow-gray-900/20 flex items-center gap-2 active:scale-95 text-sm transition-all disabled:opacity-50"><Save size={18}/> {isUploading ? 'Menyimpan...' : 'Simpan Data'}</button></div>
                </form>
             </div>
          )}

          <div className="flex flex-col gap-6 mb-12 w-full">
             <div><h1 className="text-4xl font-black dark:text-white flex items-center gap-4 tracking-tighter"><Settings className="text-gray-900 dark:text-white" size={36}/> <span className="truncate">Workspace Admin</span></h1><p className="text-[16px] font-medium text-gray-500 mt-2 max-w-2xl">Kelola konten bilingual, identitas, media sosial, dan potong foto otomatis.</p></div>
             <div className="flex items-center justify-between w-full bg-white/40 dark:bg-[#111111] p-3 rounded-[2.5rem] border border-gray-200 dark:border-white/10 backdrop-blur-2xl shadow-lg mt-2 overflow-hidden">
               <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-3 sm:pb-0 w-full px-2 flex-nowrap">
                 {[{id:'overview', label:'Overview', icon: Home}, {id:'profile', label:'Profil & CV', icon: User}, {id:'technical', label:'Technical', icon: Code}, {id:'creative', label:'Creative', icon: Palette}, {id:'blogs', label:'Thoughts', icon: FileText}, {id:'experience', label:'Exp & Edu', icon: Briefcase}, {id:'skills', label:'Skills & Links', icon: Lightbulb}].map(tb => (<button key={tb.id} onClick={()=>setCmsTab(tb.id)} className={`px-6 py-3.5 rounded-[1.2rem] text-[13px] font-black shrink-0 transition-all flex items-center gap-2 ${cmsTab === tb.id ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-lg shadow-gray-900/20 transform scale-[1.03]' : 'text-gray-600 dark:text-gray-400 hover:bg-white/80 hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'}`}><tb.icon size={16}/> {tb.label}</button>))}
               </div>
               <button onClick={()=>{setIsAuthenticated(false); showToast('Keluar Sesi');}} className="hidden md:flex items-center gap-2 px-6 py-3.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-[1.2rem] font-black shrink-0 border border-red-100 dark:border-red-900/50 hover:scale-105 active:scale-95 text-[13px] ml-4"><Lock size={16}/> Keluar</button>
             </div>
          </div>

          <div className="w-full animate-dashboard-enter">
            {cmsTab === 'overview' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                <div className="glass-panel p-8 rounded-[2.5rem] border-l-8 border-gray-900 dark:border-white shadow-xl hover:-translate-y-2 transition-all"><p className="text-[12px] font-black text-gray-500 uppercase tracking-widest mb-2">Technical</p><h4 className="text-5xl font-black dark:text-white">{projects.filter(p=>p.type==='technical').length} <span className="text-xl text-gray-400 font-bold">Karya</span></h4></div>
                <div className="glass-panel p-8 rounded-[2.5rem] border-l-8 border-gray-900 dark:border-white shadow-xl hover:-translate-y-2 transition-all"><p className="text-[12px] font-black text-gray-500 uppercase tracking-widest mb-2">Creative</p><h4 className="text-5xl font-black dark:text-white">{projects.filter(p=>p.type==='creative').length} <span className="text-xl text-gray-400 font-bold">Karya</span></h4></div>
                <div className="glass-panel p-8 rounded-[2.5rem] border-l-8 border-gray-900 dark:border-white shadow-xl hover:-translate-y-2 transition-all"><p className="text-[12px] font-black text-gray-500 uppercase tracking-widest mb-2">Thoughts</p><h4 className="text-5xl font-black dark:text-white">{blogs.length} <span className="text-xl text-gray-400 font-bold">Blog</span></h4></div>
                <div className="glass-panel p-8 rounded-[2.5rem] border-l-8 border-gray-900 dark:border-white shadow-xl hover:-translate-y-2 transition-all"><p className="text-[12px] font-black text-gray-500 uppercase tracking-widest mb-2">Pengalaman</p><h4 className="text-5xl font-black dark:text-white">{experiences.length} <span className="text-xl text-gray-400 font-bold">Data</span></h4></div>
              </div>
            )}

            {cmsTab === 'profile' && (
              <div className="glass-panel p-8 md:p-12 rounded-[3.5rem] shadow-2xl relative">
                {isUploading && (
                  <div className="absolute inset-0 bg-white/80 dark:bg-[#0a0a0a]/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-[3.5rem]">
                    <div className="w-12 h-12 border-4 border-gray-900 dark:border-white border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="font-bold text-gray-800 dark:text-white animate-pulse">Menyinkronkan data profil...</p>
                  </div>
                )}

                <h2 className="text-3xl font-black mb-8 border-b pb-6 border-gray-200 dark:border-white/10 flex items-center gap-3 tracking-tight"><User className="text-gray-900 dark:text-white"/> Personal Identity Setup</h2>
                <form onSubmit={handleProfileSave} className="space-y-10">
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-8 border-b border-gray-200 dark:border-white/10">
                      
                      <div className="bg-white/40 dark:bg-white/5 p-6 rounded-[2rem] border-dashed border border-gray-300 dark:border-white/20 flex flex-col items-center text-center">
                        <label className="block text-[12px] font-black text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-widest">Foto Sidebar (Crop Kotak)</label>
                        <div className="w-20 h-20 bg-gray-200 dark:bg-black/50 rounded-full overflow-hidden mb-4 border-2 border-white dark:border-white/10 shadow-md">{profileTempImg instanceof File ? <img src={URL.createObjectURL(profileTempImg)} className="w-full h-full object-cover"/> : (profile.profileImage ? <img src={profile.profileImage} className="w-full h-full object-cover" /> : <ImageIcon size={30} className="text-gray-400 mt-5 mx-auto"/>)}</div>
                        <label className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 rounded-xl font-bold text-xs cursor-pointer active:scale-95 transition-all w-full"><UploadCloud size={16}/> Crop Profil<input type="file" accept="image/*" onChange={(e) => triggerCropModal(e, 'profile')} className="hidden" /></label>
                      </div>
                      
                      <div className="bg-white/40 dark:bg-white/5 p-6 rounded-[2rem] border-dashed border border-gray-300 dark:border-white/20 flex flex-col items-center text-center">
                        <label className="block text-[12px] font-black text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-widest">Foto Beranda</label>
                        <div className="w-20 h-20 bg-gray-200 dark:bg-black/50 rounded-xl overflow-hidden mb-4 border-2 border-white dark:border-white/10 shadow-md">{heroTempImg instanceof File ? <img src={URL.createObjectURL(heroTempImg)} className="w-full h-full object-cover"/> : (profile.heroImage ? <img src={profile.heroImage} className="w-full h-full object-cover" /> : <ImageIcon size={30} className="text-gray-400 mt-5 mx-auto"/>)}</div>
                        <label className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-300 dark:hover:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-xs cursor-pointer active:scale-95 transition-all w-full"><UploadCloud size={16}/> Pilih Hero PNG<input type="file" accept="image/*" onChange={(e) => triggerCropModal(e, 'hero')} className="hidden" /></label>
                      </div>

                      <div className="bg-white/40 dark:bg-white/5 p-6 rounded-[2rem] border-dashed border border-gray-300 dark:border-white/20 flex flex-col items-center text-center justify-center">
                        <label className="block text-[12px] font-black text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-widest">Dokumen CV (PDF)</label>
                        <div className="flex flex-col gap-3 w-full"><label className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-xs cursor-pointer active:scale-95 transition-all w-full"><FileText size={16}/> {cvFileName ? 'Ganti File' : 'Upload PDF'}<input type="file" accept=".pdf" onChange={handleCvUpload} className="hidden" /></label>{cvFileName && <p className="text-[11px] text-gray-900 dark:text-white font-bold flex items-center gap-1 justify-center truncate"><Check size={12}/> {cvFileName}</p>}{profile.cvUrl && !cvFileName && <p className="text-[11px] text-gray-500 font-bold flex items-center gap-1 justify-center"><CheckCircle size={12} className="text-gray-900 dark:text-white"/> CV Publik Aktif</p>}</div>
                      </div>
                   </div>

                   <div className="p-6 bg-white/50 dark:bg-[#111111] rounded-[2rem] border border-gray-200 dark:border-white/10 space-y-4">
                      <h4 className="font-black text-gray-800 dark:text-white mb-4 border-b border-gray-200 dark:border-white/10 pb-2">Teks Identitas Bilingual</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div><label className="block text-[12px] font-black text-gray-500 uppercase tracking-widest mb-3">Nama Lengkap (ID)</label><input name="name_id" defaultValue={splitText(profile.name).id} required className="w-full px-6 py-4 rounded-2xl glass-panel font-bold text-[15px] outline-none dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white" /></div>
                          <div><label className="block text-[12px] font-black text-gray-500 uppercase tracking-widest mb-3">Full Name (EN)</label><input name="name_en" defaultValue={splitText(profile.name).en} className="w-full px-6 py-4 rounded-2xl glass-panel font-bold text-[15px] outline-none dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white" /></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                          <div><label className="block text-[12px] font-black text-gray-500 uppercase tracking-widest mb-3">Role Profesi (ID)</label><input name="role_id" defaultValue={splitText(profile.role).id} required className="w-full px-6 py-4 rounded-2xl glass-panel font-bold text-[15px] outline-none dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white" /></div>
                          <div><label className="block text-[12px] font-black text-gray-500 uppercase tracking-widest mb-3">Professional Role (EN)</label><input name="role_en" defaultValue={splitText(profile.role).en} className="w-full px-6 py-4 rounded-2xl glass-panel font-bold text-[15px] outline-none dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white" /></div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                          <div><label className="block text-[12px] font-black text-gray-500 uppercase tracking-widest mb-3">Bio Singkat (ID)</label><textarea name="bio_id" defaultValue={splitText(profile.bio).id} required rows="4" className="w-full px-6 py-4 rounded-2xl glass-panel font-medium text-[15px] outline-none dark:text-white resize-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white" /></div>
                          <div><label className="block text-[12px] font-black text-gray-500 uppercase tracking-widest mb-3">Short Bio (EN)</label><textarea name="bio_en" defaultValue={splitText(profile.bio).en} rows="4" className="w-full px-6 py-4 rounded-2xl glass-panel font-medium text-[15px] outline-none dark:text-white resize-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white" /></div>
                      </div>

                      <h4 className="font-black text-gray-800 dark:text-white mb-4 mt-8 border-b border-gray-200 dark:border-white/10 pb-2">Konten 'Tentang Saya' (Rich Text)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                          <div className="bg-white dark:bg-[#111111] rounded-xl overflow-hidden border border-gray-200 dark:border-white/10">
                             <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 p-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">Konten Tentang Saya (ID)</label>
                             <ReactQuill theme="snow" value={profileAboutId} onChange={setProfileAboutId} modules={quillModules} className="text-gray-900 dark:text-white h-48 pb-10" />
                          </div>
                          <div className="bg-white dark:bg-[#111111] rounded-xl overflow-hidden border border-gray-200 dark:border-white/10">
                             <label className="block text-[13px] font-bold text-gray-700 dark:text-gray-300 p-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">About Me Content (EN)</label>
                             <ReactQuill theme="snow" value={profileAboutEn} onChange={setProfileAboutEn} modules={quillModules} className="text-gray-900 dark:text-white h-48 pb-10" />
                          </div>
                      </div>
                   </div>

                   <div className="pt-6 border-t border-gray-200 dark:border-white/10">
                      <h3 className="block text-[14px] font-black text-gray-700 dark:text-gray-300 mb-6 uppercase tracking-widest">Tautan Sosial Media Publik</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div><label className="block text-[12px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><BrandIcon name="instagram"/> Instagram URL</label><input name="instagram" defaultValue={profile.socials?.instagram} className="w-full px-6 py-4 rounded-2xl glass-panel font-medium text-[14.5px] outline-none dark:text-white focus:ring-2 focus:ring-pink-500" placeholder="https://instagram.com/..." /></div>
                         <div><label className="block text-[12px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><BrandIcon name="threads"/> Threads URL</label><input name="threads" defaultValue={profile.socials?.threads} className="w-full px-6 py-4 rounded-2xl glass-panel font-medium text-[14.5px] outline-none dark:text-white focus:ring-2 focus:ring-gray-400" placeholder="https://threads.net/..." /></div>
                         <div><label className="block text-[12px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><BrandIcon name="tiktok"/> TikTok URL</label><input name="tiktok" defaultValue={profile.socials?.tiktok} className="w-full px-6 py-4 rounded-2xl glass-panel font-medium text-[14.5px] outline-none dark:text-white focus:ring-2 focus:ring-gray-400" placeholder="https://tiktok.com/..." /></div>
                         <div><label className="block text-[12px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><BrandIcon name="linkedin"/> LinkedIn URL</label><input name="linkedin" defaultValue={profile.socials?.linkedin} className="w-full px-6 py-4 rounded-2xl glass-panel font-medium text-[14.5px] outline-none dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white" placeholder="https://linkedin.com/..." /></div>
                      </div>
                   </div>
                   <div className="flex justify-end pt-8 mt-6 border-t border-gray-200 dark:border-white/10"><button type="submit" disabled={isUploading} className="px-10 py-5 rounded-2xl bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 font-black text-[16px] shadow-2xl shadow-gray-900/40 dark:shadow-white/20 flex items-center gap-3 active:scale-95 transition-all hover:scale-105 disabled:opacity-50"><Save size={22}/> Publish & Simpan ke Database</button></div>
                </form>
              </div>
            )}

            {(cmsTab === 'technical' || cmsTab === 'creative') && (
              <div className="glass-panel p-8 md:p-12 rounded-[3rem]">
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4"><h2 className="text-3xl font-black uppercase text-gray-900 dark:text-white flex items-center gap-3 tracking-tighter">{cmsTab === 'technical' ? <Code size={30} className="text-gray-900 dark:text-white"/> : <Palette size={30} className="text-gray-900 dark:text-white"/>} Koleksi {cmsTab}</h2><button onClick={() => openModal('project', null, cmsTab)} className="px-8 py-4 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 rounded-2xl font-black text-sm flex items-center gap-2 active:scale-95 transition-all hover:scale-105"><Plus size={18}/> Tambah Baru</button></div>
                 <div className="grid grid-cols-1 gap-5">
                    {projects.filter(p => p.type === cmsTab).map(p => (
                       <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white/40 dark:bg-[#111111] rounded-[2rem] border border-gray-200 dark:border-white/5 hover:-translate-y-1 transition-all duration-300 group gap-5">
                          <div className="flex items-center gap-6">
                            {p.image?.match(/\.(mp4|webm|ogg)$/i) ? (
                              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-black flex items-center justify-center shrink-0 border border-white/20"><Video className="text-white opacity-50"/></div>
                            ) : (
                              <img src={p.image} className="w-20 h-20 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all border border-gray-200 dark:border-white/10 shrink-0" alt="" />
                            )}
                            <div><h4 className="font-black text-gray-900 dark:text-white text-[18px] mb-1 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">{tText(p.title, lang)}</h4><p className="text-[12px] font-bold text-gray-500 uppercase tracking-widest">{p.category}</p></div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0"><button onClick={() => openModal('project', p, cmsTab)} className="p-4 bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white rounded-2xl border border-gray-200 dark:border-white/10 hover:scale-110 active:scale-95 transition-transform"><Edit size={20}/></button><button onClick={() => handleDelete('projects', p.id, projects, setProjects)} className="p-4 bg-white dark:bg-[#1A1A1A] text-red-600 dark:text-red-500 rounded-2xl border border-gray-200 dark:border-white/10 hover:scale-110 active:scale-95 transition-transform"><Trash2 size={20}/></button></div>
                       </div>
                    ))}
                    {projects.filter(p => p.type === cmsTab).length === 0 && <div className="p-12 text-center border-2 border-dashed border-gray-300 dark:border-white/10 rounded-[2.5rem] font-bold text-gray-500">Belum ada karya.</div>}
                 </div>
              </div>
            )}

            {cmsTab === 'blogs' && (
              <div className="glass-panel p-8 md:p-12 rounded-[3rem]">
                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4"><h2 className="text-3xl font-black uppercase text-gray-900 dark:text-white flex items-center gap-3 tracking-tighter"><FileText size={30} className="text-gray-900 dark:text-white"/> Artikel Blog (Rich Text)</h2><button onClick={() => openModal('blog', null)} className="px-8 py-4 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 rounded-2xl font-black text-sm flex items-center gap-2 active:scale-95 transition-all hover:scale-105"><Plus size={18}/> Tulis Artikel</button></div>
                 <div className="grid grid-cols-1 gap-5">
                    {blogs.map(b => (
                       <div key={b.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white/40 dark:bg-[#111111] rounded-[2rem] border border-gray-200 dark:border-white/5 hover:-translate-y-1 transition-all duration-300 group gap-5">
                          <div className="flex items-center gap-6"><img src={b.thumbnail} className="w-24 h-24 rounded-2xl object-cover border border-gray-200 dark:border-white/10 shrink-0" alt="" /><div><h4 className="font-black text-gray-900 dark:text-white text-[18px] mb-2 line-clamp-1 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">{tText(b.title, lang)}</h4><p className="text-[12px] font-bold text-gray-800 dark:text-gray-200 uppercase tracking-widest bg-gray-100 dark:bg-white/10 px-3 py-1.5 rounded-lg inline-block border border-gray-200 dark:border-white/20">{b.tag} • {b.date}</p></div></div>
                          <div className="flex items-center gap-3 shrink-0"><button onClick={() => openModal('blog', b)} className="p-4 bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white rounded-2xl border border-gray-200 dark:border-white/10 hover:scale-110 active:scale-95 transition-transform"><Edit size={20}/></button><button onClick={() => handleDelete('blogs', b.id, blogs, setBlogs)} className="p-4 bg-white dark:bg-[#1A1A1A] text-red-600 dark:text-red-500 rounded-2xl border border-gray-200 dark:border-white/10 hover:scale-110 active:scale-95 transition-transform"><Trash2 size={20}/></button></div>
                       </div>
                    ))}
                 </div>
              </div>
            )}

            {cmsTab === 'experience' && (
              <div className="glass-panel p-8 md:p-12 rounded-[3rem]">
                 <div className="flex justify-between items-center mb-10 border-b border-gray-200 dark:border-white/5 pb-6"><h2 className="text-3xl font-black uppercase text-gray-900 dark:text-white flex items-center gap-3 tracking-tighter"><Briefcase size={30} className="text-gray-900 dark:text-white"/> Pengalaman</h2><button onClick={() => openModal('experience', null)} className="px-8 py-4 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 rounded-2xl font-black text-sm flex items-center gap-2 active:scale-95 transition-all hover:scale-105"><Plus size={18}/> Tambah Pengalaman</button></div>
                 <div className="grid grid-cols-1 gap-5 mb-16">
                    {experiences.map(e => (
                       <div key={e.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white/40 dark:bg-[#111111] rounded-[2rem] border border-gray-200 dark:border-white/5 hover:-translate-y-1 transition-all duration-300 group gap-5">
                          <div><h4 className="font-black text-gray-900 dark:text-white text-[18px] mb-1">{tText(e.role, lang)}</h4><p className="text-[13px] font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/10 px-3 py-1.5 rounded-lg inline-block border border-gray-200 dark:border-white/10 mt-2">{tText(e.company, lang)} • {tText(e.period, lang)}</p></div>
                          <div className="flex items-center gap-3 shrink-0"><button onClick={() => openModal('experience', e)} className="p-4 bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white rounded-2xl border border-gray-200 dark:border-white/10 hover:scale-110 active:scale-95 transition-transform"><Edit size={20}/></button><button onClick={() => handleDelete('experiences', e.id, experiences, setExperiences)} className="p-4 bg-white dark:bg-[#1A1A1A] text-red-600 dark:text-red-500 rounded-2xl border border-gray-200 dark:border-white/10 hover:scale-110 active:scale-95 transition-transform"><Trash2 size={20}/></button></div>
                       </div>
                    ))}
                    {experiences.length === 0 && <p className="text-gray-500 font-bold p-6 text-center border-2 border-dashed border-gray-300 dark:border-white/10 rounded-3xl">Belum ada data pengalaman.</p>}
                 </div>

                 <div className="flex justify-between items-center mb-10 border-b border-gray-200 dark:border-white/5 pb-6"><h2 className="text-3xl font-black uppercase text-gray-900 dark:text-white flex items-center gap-3 tracking-tighter"><GraduationCap size={30} className="text-gray-900 dark:text-white"/> Pendidikan</h2><button onClick={() => openModal('education', null)} className="px-8 py-4 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 rounded-2xl font-black text-sm flex items-center gap-2 active:scale-95 transition-all hover:scale-105"><Plus size={18}/> Tambah Pendidikan</button></div>
                 <div className="grid grid-cols-1 gap-5">
                    {educations.map(e => (
                       <div key={e.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white/40 dark:bg-[#111111] rounded-[2rem] border border-gray-200 dark:border-white/5 hover:-translate-y-1 transition-all duration-300 group gap-5">
                          <div><h4 className="font-black text-gray-900 dark:text-white text-[18px] mb-1">{tText(e.degree, lang)}</h4><p className="text-[13px] font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/10 px-3 py-1.5 rounded-lg inline-block border border-gray-200 dark:border-white/10 mt-2">{tText(e.institution, lang)} • {tText(e.period, lang)}</p></div>
                          <div className="flex items-center gap-3 shrink-0"><button onClick={() => openModal('education', e)} className="p-4 bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white rounded-2xl border border-gray-200 dark:border-white/10 hover:scale-110 active:scale-95 transition-transform"><Edit size={20}/></button><button onClick={() => handleDelete('educations', e.id, educations, setEducations)} className="p-4 bg-white dark:bg-[#1A1A1A] text-red-600 dark:text-red-500 rounded-2xl border border-gray-200 dark:border-white/10 hover:scale-110 active:scale-95 transition-transform"><Trash2 size={20}/></button></div>
                       </div>
                    ))}
                    {educations.length === 0 && <p className="text-gray-500 font-bold p-6 text-center border-2 border-dashed border-gray-300 dark:border-white/10 rounded-3xl">Belum ada data pendidikan.</p>}
                 </div>
              </div>
            )}
            
            {cmsTab === 'skills' && (
              <div className="glass-panel p-8 md:p-12 rounded-[3rem]">
                 <div className="flex justify-between items-center mb-10 border-b border-gray-200 dark:border-white/5 pb-6"><h2 className="text-3xl font-black uppercase text-gray-900 dark:text-white flex items-center gap-3 tracking-tighter"><Lightbulb size={30} className="text-gray-900 dark:text-white"/> Keahlian (Skills)</h2><button onClick={() => openModal('skill', null)} className="px-8 py-4 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 rounded-2xl font-black text-sm flex items-center gap-2 active:scale-95 transition-all hover:scale-105"><Plus size={18}/> Tambah Skill</button></div>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-16">
                    {skills.map(s => (
                       <div key={s.id} className="flex flex-col items-center justify-between p-6 bg-white/40 dark:bg-[#111111] rounded-[2rem] border border-gray-200 dark:border-white/5 hover:-translate-y-1 transition-all duration-300 group gap-5">
                          <img src={s.img} loading="lazy" className={`w-16 h-16 object-contain ${s.invert ? 'dark:invert' : ''}`}/>
                          <h4 className="font-black text-gray-900 dark:text-white text-[16px]">{tText(s.name, lang)}</h4>
                          <div className="flex items-center gap-3 shrink-0"><button onClick={() => openModal('skill', s)} className="p-3 bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-white/10 hover:scale-110 active:scale-95 transition-transform"><Edit size={16}/></button><button onClick={() => handleDelete('skills', s.id, skills, setSkills)} className="p-3 bg-white dark:bg-[#1A1A1A] text-red-600 dark:text-red-500 rounded-xl border border-gray-200 dark:border-white/10 hover:scale-110 active:scale-95 transition-transform"><Trash2 size={16}/></button></div>
                       </div>
                    ))}
                    {skills.length === 0 && <p className="text-gray-500 font-bold p-6 text-center col-span-full border-2 border-dashed border-gray-300 dark:border-white/10 rounded-3xl">Belum ada skill ditambahkan.</p>}
                 </div>

                 <div className="flex justify-between items-center mb-10 border-b border-gray-200 dark:border-white/5 pb-6"><h2 className="text-3xl font-black uppercase text-gray-900 dark:text-white flex items-center gap-3 tracking-tighter"><LinkIcon size={30} className="text-gray-900 dark:text-white"/> Tautan Penting (Links)</h2><button onClick={() => openModal('link', null)} className="px-8 py-4 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-gray-900 rounded-2xl font-black text-sm flex items-center gap-2 active:scale-95 transition-all hover:scale-105"><Plus size={18}/> Tambah Tautan</button></div>
                 <div className="grid grid-cols-1 gap-5">
                    {links.map(l => (
                       <div key={l.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white/40 dark:bg-[#111111] rounded-[2rem] border border-gray-200 dark:border-white/5 hover:-translate-y-1 transition-all duration-300 group gap-5">
                          <div className="flex-1 min-w-0">
                             <h4 className="font-black text-gray-900 dark:text-white text-[18px] mb-1">{tText(l.label, lang)}</h4>
                             <p className="text-[13px] font-bold text-gray-500">{tText(l.desc, lang)}</p>
                             <p className="text-[12px] mt-2 text-gray-900 dark:text-white bg-gray-100 dark:bg-white/10 px-3 py-1.5 rounded-lg inline-block truncate max-w-full border border-gray-200 dark:border-white/20">{l.url}</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                             <button onClick={() => openModal('link', l)} className="p-4 bg-white dark:bg-[#1A1A1A] text-gray-900 dark:text-white rounded-2xl border border-gray-200 dark:border-white/10 hover:scale-110 active:scale-95 transition-transform"><Edit size={20}/></button>
                             <button onClick={() => handleDelete('links', l.id, links, setLinks)} className="p-4 bg-white dark:bg-[#1A1A1A] text-red-600 dark:text-red-500 rounded-2xl border border-gray-200 dark:border-white/10 hover:scale-110 active:scale-95 transition-transform"><Trash2 size={20}/></button>
                          </div>
                       </div>
                    ))}
                    {links.length === 0 && <p className="text-gray-500 font-bold p-6 text-center border-2 border-dashed border-gray-300 dark:border-white/10 rounded-3xl">Belum ada tautan ditambahkan.</p>}
                 </div>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  if (isLoadingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC] dark:bg-[#0a0a0a]">
         <div className="w-12 h-12 border-4 border-gray-900 dark:border-white border-t-transparent rounded-full animate-spin mb-4 shadow-lg dark:shadow-white/20"></div>
         <p className="text-gray-500 dark:text-gray-400 font-bold animate-pulse text-sm tracking-widest uppercase">Memuat Portofolio...</p>
      </div>
    );
  }

  return (
    <HelmetProvider>
      <div className="flex relative bg-[#F8FAFC] dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 min-h-screen font-sans overflow-x-hidden selection:bg-gray-900/30 dark:selection:bg-white/30 selection:text-white dark:selection:text-black">
       {toastMessage && (
          <div className="fixed bottom-8 right-8 z-[100] animate-dashboard-enter">
             <div className="glass-panel bg-white/95 dark:bg-[#1A1A1A]/95 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-gray-200 dark:border-white/20 backdrop-blur-2xl">
                <div className="w-10 h-10 rounded-xl bg-gray-900 dark:bg-white flex items-center justify-center text-white dark:text-gray-900 shrink-0"><Check size={20} strokeWidth={4} /></div>
                <p className="text-[14px] font-black uppercase tracking-wider">{toastMessage}</p>
             </div>
          </div>
       )}

       {/* EFEK NOISE BACKGROUND */}
       <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] dark:opacity-[0.06]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat" }}></div>

       <style dangerouslySetInnerHTML={{__html: `
        body { background-color: #0a0a0a; }

        .glass-panel { 
          background: rgba(255, 255, 255, 0.7); 
          backdrop-filter: blur(16px); 
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.4); 
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.05);
          transition: all 0.3s ease;
        }
        
        /* Dark Mode Glass Panel - Lebih Terang Sedikit agar Batas Terlihat (Mencegah Deep Black Tenggelam) */
        html.dark .glass-panel { 
          background: rgba(30, 30, 32, 0.85); 
          border: 1px solid rgba(255, 255, 255, 0.08); 
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
        }
        .glass-panel:hover { border-color: rgba(0, 0, 0, 0.3); }
        html.dark .glass-panel:hover { 
          border-color: rgba(255, 255, 255, 0.25); 
          background: rgba(40, 40, 42, 0.9);
        }
        
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.4); border-radius: 20px; }
        .reveal-on-scroll { opacity: 0; animation: revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes revealUp { 0% { opacity: 0; transform: translateY(40px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes blink { 0%, 100% { border-color: transparent; } 50% { border-color: currentColor; } }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0px); } } .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-dashboard-enter { animation: dashboardEnter 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes dashboardEnter { 0% { opacity: 0; transform: scale(0.96) translateY(20px); filter: blur(8px); } 100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); } }
        .animate-page-enter { animation: pageEnter 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        @keyframes pageEnter { 0% { opacity: 0; transform: translateX(15px); } 100% { opacity: 1; transform: translateX(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        /* Typography Rich Text Content */
        .article-content h1, .article-content h2, .article-content h3 { font-weight: 800; color: #111; margin-top: 1.5em; margin-bottom: 0.5em; }
        html.dark .article-content h1, html.dark .article-content h2, html.dark .article-content h3 { color: #fff; }
        .article-content p { margin-bottom: 1em; line-height: 1.8; }
        .article-content strong, .article-content b { font-weight: 900; color: #111; }
        html.dark .article-content strong, html.dark .article-content b { color: #fff; }
        
        .article-content table { width: 100%; border-collapse: collapse; margin: 2rem 0; border: 1px solid rgba(156, 163, 175, 0.3); border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .article-content th, .article-content td { border: 1px solid rgba(156, 163, 175, 0.3); padding: 12px 16px; text-align: left; }
        .article-content th { background: rgba(0, 0, 0, 0.05); font-weight: 900; }
        html.dark .article-content th { background: rgba(255, 255, 255, 0.1); }
        .article-content tr:nth-child(even) { background: rgba(156, 163, 175, 0.05); }
        .article-content img { max-width: 100%; border-radius: 1rem; margin: 1.5rem 0; box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
        .article-content a { color: #111; text-decoration: underline; font-weight: bold; }
        html.dark .article-content a { color: #fff; }
        .article-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1rem; }
        .article-content ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1rem; }
        
        /* Styling Code Snippet pada Artikel (<pre>) */
        .article-content pre { background: #f1f5f9; color: #334155; padding: 1.5rem; border-radius: 1rem; overflow-x: auto; font-family: 'Consolas', monospace; font-size: 14px; margin: 1.5rem 0; border: 1px solid rgba(0,0,0,0.05); box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); }
        html.dark .article-content pre { background: #0a0a0c; color: #e2e8f0; border-color: rgba(255,255,255,0.05); box-shadow: inset 0 2px 4px rgba(0,0,0,0.5); }
        .article-content code { background: rgba(0,0,0,0.05); padding: 0.2rem 0.4rem; border-radius: 0.3rem; font-family: 'Consolas', monospace; font-size: 0.9em; }
        html.dark .article-content code { background: rgba(255,255,255,0.1); }
        .article-content pre code { background: transparent; padding: 0; }

        .ql-toolbar.ql-snow { border-color: rgba(255,255,255,0.1) !important; border-top-left-radius: 0.75rem; border-top-right-radius: 0.75rem; background: rgba(255,255,255,0.05); }
        .ql-container.ql-snow { border-color: rgba(255,255,255,0.1) !important; min-height: 250px; border-bottom-left-radius: 0.75rem; border-bottom-right-radius: 0.75rem; font-family: inherit; font-size: 15px; }
        html.dark .ql-picker-label, html.dark .ql-picker-item { color: white !important; }
        html.dark .ql-stroke { stroke: white !important; }
        html.dark .ql-fill { fill: white !important; }
       `}} />

       <div className={`lg:hidden fixed top-0 left-0 right-0 h-16 glass-panel z-50 px-5 flex items-center justify-between !border-x-0 !border-t-0 !rounded-none transition-transform duration-500 ease-in-out ${isMobileMenuOpen ? '-translate-y-full' : 'translate-y-0'}`}>
          <div className="font-black text-[16px] text-gray-900 dark:text-white uppercase truncate pr-4">{tText(profile.name, lang)}</div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white"><Menu size={20} /></button>
        </div>
        
        {isMobileMenuOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />}
        {renderSidebar()}
        
        <main className="flex-1 lg:pl-[280px] pt-16 lg:pt-0 min-h-screen transition-all duration-300 w-full overflow-x-hidden relative z-10">
          <div key={currentPath} className="p-5 sm:p-8 md:p-12 lg:p-16 min-h-screen max-w-[1400px] mx-auto w-full">
            {renderContent()}
          </div>
          {/* CROPPER MODAL (FOR CMS) */}
          {cropModalOpen && (
             <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center p-4">
                <div className="relative w-full max-w-2xl h-[60vh] bg-gray-900 rounded-3xl overflow-hidden border border-white/20">
                   <Cropper image={imageToCrop} crop={crop} zoom={zoom} aspect={cropType === 'hero' ? 16 / 9 : 1} onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={onCropComplete} />
                </div>
                <div className="w-full max-w-2xl mt-6 flex justify-between items-center bg-gray-900 p-4 rounded-2xl border border-white/20">
                   <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={(e) => setZoom(e.target.value)} className="w-1/2 accent-white" />
                   <div className="flex gap-3">
                      <button onClick={() => setCropModalOpen(false)} className="px-5 py-2.5 rounded-xl bg-gray-800 text-white font-bold">Batal</button>
                      <button onClick={handleSaveCroppedImage} className="px-5 py-2.5 rounded-xl bg-white text-gray-900 font-bold flex items-center gap-2"><Crop size={16}/> Terapkan</button>
                   </div>
                </div>
             </div>
          )}
       </main>
      </div>
    </HelmetProvider>
  );
}