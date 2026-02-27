import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import {
  Users, BookOpen, FolderKanban, GripVertical, X, Plus, Search,
  Filter, ChevronDown, Check, Clock, AlertCircle, ArrowRight,
  Trash2, Edit3, UserPlus, ListTodo, BarChart3, Settings,
  LogOut, Eye, Tag, Calendar, Target, TrendingUp, CheckCircle2,
  Circle, Timer, ChevronRight, Layers, UserCheck, FileText, Activity,
  Globe, Phone, Mail, GraduationCap, Building2, Wrench, Award,
  Languages, ExternalLink, StickyNote, Briefcase, MapPin,
  Bell, CalendarDays, ChevronLeft, AlertTriangle, Link2, Pencil,
  Table2, Download, Upload, DatabaseBackup
} from "lucide-react";

// ─── MOCK DATA (Notion Aktarımı) ────────────────────────
const initialResearchers = [
  {
    id: "r1", name: "Sefa Emre Öncü", title: "",
   institution: "Anadolu Üniversitesi", unit: "Ar-Ge",
   eduUniversity: "Anadolu Üniversitesi", eduProgram: "Uzaktan Eğitim", eduDegree: "Doktora", eduStatus: "Öğrenci",
   languages: ["İngilizce"],
   researchAreas: ["destek hizmetleri", "mikro-yeterlik (mikro-kredilendirme)", "uzaktan eğitim", "yapay zeka (AI)", "yükseköğretimin yönetimi"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#6366f1"
 },
  {
    id: "r2", name: "Aras Bozkurt", title: "Prof.Dr.",
   institution: "Anadolu Üniversitesi", unit: "Açıköğretim Fakültesi",
   eduUniversity: "Anadolu Üniversitesi", eduProgram: "Uzaktan Eğitim", eduDegree: "Doktora", eduStatus: "Mezun",
   languages: ["İngilizce"],
   researchAreas: ["karma araştırma yöntemleri", "uzaktan eğitim", "yabancı dil eğitimi", "yapay zeka (AI)"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#8b5cf6"
 },
  {
    id: "r3", name: "Halil Elibol", title: "Öğr.Gör.Dr.",
   institution: "Anadolu Üniversitesi", unit: "Ar-Ge",
   eduUniversity: "Anadolu Üniversitesi", eduProgram: "Eğitim Bilimleri", eduDegree: "Doktora", eduStatus: "Mezun",
   languages: ["Fransızca", "İngilizce"],
   researchAreas: ["eğitim bilimleri", "uzaktan eğitim", "yabancı dil eğitimi"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#ec4899"
 },
  {
    id: "r4", name: "Fatih Özer", title: "Dr.Öğr.Üyesi",
   institution: "Anadolu Üniversitesi", unit: "Ar-Ge",
   eduUniversity: "İstanbul Üniversitesi", eduProgram: "Eğitim Programları ve Öğretim", eduDegree: "Doktora", eduStatus: "Mezun",
   languages: ["İngilizce"],
   researchAreas: ["AR", "VR", "XR", "oyunlaştırma", "uzaktan eğitim"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#f43f5e"
 },
  {
    id: "r5", name: "Rabia Taş", title: "Öğr.Gör.Dr.",
   institution: "Anadolu Üniversitesi", unit: "ARİNKOM",
   eduUniversity: "Anadolu Üniversitesi", eduProgram: "", eduDegree: "", eduStatus: "",
   languages: ["İngilizce"],
   researchAreas: ["proje yönetimi", "uluslararası ilişkiler"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#f97316"
 },
  {
    id: "r6", name: "Erdem Erdoğdu", title: "Dr.Öğr.Üyesi",
   institution: "Anadolu Üniversitesi", unit: "Açıköğretim Fakültesi",
   eduUniversity: "Anadolu Üniversitesi", eduProgram: "Uzaktan Eğitim", eduDegree: "Doktora", eduStatus: "Mezun",
   languages: ["İngilizce"],
   researchAreas: ["bilgisayar öğretimi ve teknolojileri", "destek hizmetleri", "uzaktan eğitim", "yapay zeka (AI)", "öğretim tasarımı"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#eab308"
 },
  {
    id: "r7", name: "Alper Tolga Kumtepe", title: "Prof.Dr.",
   institution: "Anadolu Üniversitesi", unit: "Açıköğretim Fakültesi",
   eduUniversity: "Florida State University", eduProgram: "Eğitim Programları ve Öğretim", eduDegree: "Doktora", eduStatus: "Mezun",
   languages: ["İngilizce"],
   researchAreas: ["eğitim programları (curriculum)", "uzaktan eğitim", "ölçme ve değerlendirme"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#22c55e"
 },
  {
    id: "r8", name: "Nedime Selin Çöpgeven", title: "Arş.Gör.",
   institution: "Anadolu Üniversitesi", unit: "Açıköğretim Fakültesi",
   eduUniversity: "Anadolu Üniversitesi", eduProgram: "Uzaktan Eğitim", eduDegree: "Doktora", eduStatus: "Öğrenci",
   languages: ["İngilizce"],
   researchAreas: ["bilgisayar öğretimi ve teknolojileri", "oyunlaştırma", "sayısal tablolar", "uzaktan eğitim", "yapay zeka (AI)", "öğretim tasarımı"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#14b8a6"
 },
  {
    id: "r9", name: "Fırat Sösuncu", title: "Arş.Gör.",
   institution: "Anadolu Üniversitesi", unit: "Açıköğretim Fakültesi",
   eduUniversity: "Anadolu Üniversitesi", eduProgram: "Uzaktan Eğitim", eduDegree: "Doktora", eduStatus: "Öğrenci",
   languages: ["İngilizce"],
   researchAreas: ["grafik tasarımı", "uzaktan eğitim"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#06b6d4"
 },
  {
    id: "r10", name: "Gamze Tuna Büyükköse", title: "Arş.Gör.Dr.",
   institution: "Anadolu Üniversitesi", unit: "Açıköğretim Fakültesi",
   eduUniversity: "Anadolu Üniversitesi", eduProgram: "Uzaktan Eğitim", eduDegree: "Doktora", eduStatus: "Mezun",
   languages: ["İngilizce"],
   researchAreas: ["uzaktan eğitim"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#3b82f6"
 },
  {
    id: "r11", name: "Mesut Aydemir", title: "Dr.Öğr.Üyesi",
   institution: "Anadolu Üniversitesi", unit: "Açıköğretim Fakültesi",
   eduUniversity: "Anadolu Üniversitesi", eduProgram: "Uzaktan Eğitim", eduDegree: "Doktora", eduStatus: "Mezun",
   languages: ["İngilizce"],
   researchAreas: ["oyunlaştırma", "programlama", "uzaktan eğitim", "öğretim tasarımı"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#a855f7"
 },
  {
    id: "r12", name: "İlker Kayabaş", title: "Dr.Öğr.Üyesi",
   institution: "Anadolu Üniversitesi", unit: "Açıköğretim Fakültesi",
   eduUniversity: "Anadolu Üniversitesi", eduProgram: "Uzaktan Eğitim", eduDegree: "Doktora", eduStatus: "Mezun",
   languages: ["İngilizce"],
   researchAreas: ["oyunlaştırma", "programlama", "uzaktan eğitim", "yapay zeka (AI)"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#d946ef"
 },
  {
    id: "r13", name: "Gökhan Deniz Dinçer", title: "Dr.Öğr.Üyesi",
   institution: "Anadolu Üniversitesi", unit: "Açıköğretim Fakültesi",
   eduUniversity: "Anadolu Üniversitesi", eduProgram: "Uzaktan Eğitim", eduDegree: "Doktora", eduStatus: "Mezun",
   languages: ["İngilizce"],
   researchAreas: ["fotoğrafçılık", "iletişim", "sosyal medya", "uzaktan eğitim"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#0ea5e9"
 },
  {
    id: "r14", name: "Sinan Aydın", title: "Doç.Dr.",
   institution: "Anadolu Üniversitesi", unit: "Açıköğretim Fakültesi",
   eduUniversity: "Anadolu Üniversitesi", eduProgram: "Sayısal Yöntemler", eduDegree: "Doktora", eduStatus: "Mezun",
   languages: ["İngilizce"],
   researchAreas: ["oyunlaştırma", "sayısal tablolar", "veri analizi", "yapay zeka (AI)"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#10b981"
 },
  {
    id: "r15", name: "Seçil Kaya Gülen", title: "Doç.Dr.",
   institution: "Anadolu Üniversitesi", unit: "Açıköğretim Fakültesi",
   eduUniversity: "Anadolu Üniversitesi", eduProgram: "Eğitim Bilimleri", eduDegree: "Doktora", eduStatus: "Mezun",
   languages: ["İngilizce"],
   researchAreas: ["eğitim bilimleri", "uzaktan eğitim"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#f59e0b"
 },
  {
    id: "r16", name: "Nejdet Karadağ", title: "Doç.Dr.",
   institution: "Anadolu Üniversitesi", unit: "Açıköğretim Fakültesi",
   eduUniversity: "Anadolu Üniversitesi", eduProgram: "Uzaktan Eğitim", eduDegree: "Doktora", eduStatus: "Mezun",
   languages: ["İngilizce"],
   researchAreas: ["destek hizmetleri", "uzaktan eğitim", "yabancı dil eğitimi", "ölçme ve değerlendirme"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#ef4444"
 },
  {
    id: "r17", name: "İlker Usta", title: "Doç.Dr.",
   institution: "Anadolu Üniversitesi", unit: "Açıköğretim Fakültesi",
   eduUniversity: "Anadolu Üniversitesi", eduProgram: "Uzaktan Eğitim", eduDegree: "Doktora", eduStatus: "Mezun",
   languages: ["İngilizce"],
   researchAreas: ["eğitim programları (curriculum)", "uzaktan eğitim"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#8b5cf6"
 },
  {
    id: "r18", name: "Emine Demiray", title: "Prof.Dr.",
   institution: "Anadolu Üniversitesi", unit: "Açıköğretim Fakültesi",
   eduUniversity: "Anadolu Üniversitesi", eduProgram: "Sinema ve Televizyon", eduDegree: "Doktora", eduStatus: "Mezun",
   languages: ["İngilizce"],
   researchAreas: ["sinema ve televizyon", "uzaktan eğitim"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#6366f1"
 },
  {
    id: "r19", name: "Tevfik Volkan Yüzer", title: "Prof.Dr.",
   institution: "Anadolu Üniversitesi", unit: "Açıköğretim Fakültesi",
   eduUniversity: "Anadolu Üniversitesi", eduProgram: "Sinema ve Televizyon", eduDegree: "Doktora", eduStatus: "Mezun",
   languages: ["İngilizce"],
   researchAreas: ["sinema ve televizyon", "uzaktan eğitim"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#14b8a6"
 },
  {
    id: "r20", name: "Serpil Koçdar", title: "Prof.Dr.",
   institution: "Anadolu Üniversitesi", unit: "Açıköğretim Fakültesi",
   eduUniversity: "Anadolu Üniversitesi", eduProgram: "Uzaktan Eğitim", eduDegree: "Doktora", eduStatus: "Mezun",
   languages: ["İngilizce"],
   researchAreas: ["uzaktan eğitim", "öğrenci topluluğu"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#ec4899"
 },
  {
    id: "r21", name: "Nilgün Özdamar", title: "Prof.Dr.",
   institution: "Anadolu Üniversitesi", unit: "Açıköğretim Fakültesi",
   eduUniversity: "Anadolu Üniversitesi", eduProgram: "Bilgisayar ve Öğretim Teknolojileri Öğretmenliği", eduDegree: "Doktora", eduStatus: "Mezun",
   languages: ["İngilizce"],
   researchAreas: ["bilgisayar öğretimi ve teknolojileri", "uzaktan eğitim", "yapay zeka (AI)"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#3b82f6"
 },
  {
    id: "r22", name: "Müjgan Yazıcı", title: "Prof.Dr.",
   institution: "Anadolu Üniversitesi", unit: "Açıköğretim Fakültesi",
   eduUniversity: "Anadolu Üniversitesi", eduProgram: "İletişim Bilimleri", eduDegree: "Doktora", eduStatus: "Mezun",
   languages: ["İngilizce"],
   researchAreas: ["iletişim", "uzaktan eğitim"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#22c55e"
 },
  {
    id: "r23", name: "Murat Akyıldız", title: "Prof.Dr.",
   institution: "Anadolu Üniversitesi", unit: "Açıköğretim Fakültesi",
   eduUniversity: "Ankara Üniversitesi", eduProgram: "Ölçme ve Değerlendirme", eduDegree: "Doktora", eduStatus: "Mezun",
   languages: ["İngilizce"],
   researchAreas: ["nicel araştırma yöntemleri", "ölçme ve değerlendirme"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#f97316"
 },
  {
    id: "r24", name: "Mehmet Emin Mutlu", title: "Prof.Dr.",
   institution: "Anadolu Üniversitesi", unit: "Açıköğretim Fakültesi",
   eduUniversity: "Eskişehir Osmangazi Üniversitesi", eduProgram: "Endüstri Mühendisliği", eduDegree: "Doktora", eduStatus: "Mezun",
   languages: ["İngilizce"],
   researchAreas: ["bilgisayar öğretimi ve teknolojileri", "programlama"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#06b6d4"
 },
  {
    id: "r25", name: "Mediha Terlemez", title: "Prof.Dr.",
   institution: "Anadolu Üniversitesi", unit: "Açıköğretim Fakültesi",
   eduUniversity: "Anadolu Üniversitesi", eduProgram: "Sinema ve Televizyon", eduDegree: "Doktora", eduStatus: "Mezun",
   languages: ["İngilizce"],
   researchAreas: ["sinema ve televizyon", "uzaktan eğitim"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#a855f7"
 },
  {
    id: "r26", name: "Kamil Çekerol", title: "Prof.Dr.",
   institution: "Anadolu Üniversitesi", unit: "Açıköğretim Fakültesi",
   eduUniversity: "Anadolu Üniversitesi", eduProgram: "İktisat", eduDegree: "Doktora", eduStatus: "Mezun",
   languages: ["İngilizce"],
   researchAreas: ["eğitim programları (curriculum)", "görsel iletişim ve tasarım", "iktisat", "nitel araştırma yöntemleri", "uzaktan eğitim"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#d946ef"
 },
  {
    id: "r27", name: "Gülsün Kurubacak", title: "Prof.Dr.",
   institution: "Anadolu Üniversitesi", unit: "Açıköğretim Fakültesi",
   eduUniversity: "University of Cincinnati", eduProgram: "Eğitim Bilimleri", eduDegree: "Doktora", eduStatus: "Mezun",
   languages: ["İngilizce"],
   researchAreas: ["uzaktan eğitim"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#eab308"
 },
  {
    id: "r28", name: "Hasan Uçar", title: "Doç.Dr.",
   institution: "Anadolu Üniversitesi", unit: "Açıköğretim Fakültesi",
   eduUniversity: "Anadolu Üniversitesi", eduProgram: "Uzaktan Eğitim", eduDegree: "Doktora", eduStatus: "Mezun",
   languages: ["İngilizce"],
   researchAreas: ["uzaktan eğitim", "yabancı dil eğitimi"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#0ea5e9"
 },
  {
    id: "r29", name: "Evrim Genç Kumtepe", title: "Prof.Dr.",
   institution: "Anadolu Üniversitesi", unit: "Açıköğretim Fakültesi",
   eduUniversity: "Florida State University", eduProgram: "Eğitim Programları ve Öğretim", eduDegree: "Doktora", eduStatus: "Mezun",
   languages: ["İngilizce"],
   researchAreas: ["eğitim programları (curriculum)", "mikro-yeterlik (mikro-kredilendirme)", "nicel araştırma yöntemleri", "su ürünleri", "tarım teknolojileri", "uzaktan eğitim"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#10b981"
 },
  {
    id: "r30", name: "Elif Toprak", title: "Prof.Dr.",
   institution: "Anadolu Üniversitesi", unit: "Açıköğretim Fakültesi",
   eduUniversity: "Bursa Uludağ Üniversitesi", eduProgram: "Uluslararası İlişkiler", eduDegree: "Doktora", eduStatus: "Mezun",
   languages: ["İngilizce"],
   researchAreas: ["uluslararası ilişkiler", "uzaktan eğitim"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#f59e0b"
 },
  {
    id: "r31", name: "Berrin Özkanal", title: "Prof.Dr.",
   institution: "Anadolu Üniversitesi", unit: "Açıköğretim Fakültesi",
   eduUniversity: "Selçuk Üniversitesi", eduProgram: "Halkla İlişkiler ve Tanıtım", eduDegree: "Doktora", eduStatus: "Mezun",
   languages: ["İngilizce"],
   researchAreas: ["halkla ilişkiler", "iletişim", "uzaktan eğitim"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#ef4444"
 },
  {
    id: "r32", name: "Uygar Soyraç", title: "",
   institution: "Anadolu Üniversitesi", unit: "",
   eduUniversity: "Anadolu Üniversitesi", eduProgram: "Uzaktan Eğitim", eduDegree: "Doktora", eduStatus: "Öğrenci",
   languages: ["İngilizce"],
   researchAreas: ["halkla ilişkiler", "iletişim", "uzaktan eğitim", "öğrenci topluluğu"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#f43f5e"
 },
  {
    id: "r33", name: "Sercan Uzun", title: "",
   institution: "Anadolu Üniversitesi", unit: "",
   eduUniversity: "Anadolu Üniversitesi", eduProgram: "Uzaktan Eğitim", eduDegree: "Doktora", eduStatus: "Öğrenci",
   languages: ["İngilizce"],
   researchAreas: ["oyunlaştırma", "uzaktan eğitim", "yabancı dil eğitimi"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#6366f1"
 },
  {
    id: "r34", name: "Elif Dağdelen", title: "",
   institution: "Anadolu Üniversitesi", unit: "",
   eduUniversity: "Anadolu Üniversitesi", eduProgram: "İİBF", eduDegree: "Tezsiz Yüksek Lisans", eduStatus: "Öğrenci",
   languages: [],
    researchAreas: ["yapay zeka (AI)"],
   tools: [],
    hasPIExperience: false,
    url: "", phone: "", email: "",
   bio: "", performanceNotes: "",
   color: "#8b5cf6"
 },
];

const initialTopics = [
  {
    id: "t1", title: "Türkçe'nin Yurtdışında K-12 düzeyinde miras dil olarak oyunlaştırılarak öğretilmesi",
   description: "TRT ile anlaşma yapılabilir",
   category: "Ar-Ge İçi", status: "proposed", priority: "critical",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["Horizon Europe"],
   researchers: [{ researcherId: "r3", role: "lead" }, { researcherId: "r4", role: "member" }, { researcherId: "r5", role: "member" }],
   tasks: [],
    projectType: "Horizon", projectTypeDetail: "Horizon Europe", projectCall: "",
   applicationStatus: "Başvuru yapılabilir",
 },
  {
    id: "t2", title: "STEM ve XR (Mikro-yeterlik)",
   description: "",
   category: "Ar-Ge İçi", status: "proposed", priority: "critical",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["AB-KA220 (HED)"],
   researchers: [{ researcherId: "r4", role: "lead" }, { researcherId: "r5", role: "member" }],
   tasks: [],
    projectType: "Erasmus+", projectTypeDetail: "KA220-HED", projectCall: "",
   applicationStatus: "Başvuru yapılabilir",
 },
  {
    id: "t3", title: "aiCTS: Büyük dil modelleri kullanarak yükseköğretim kurumlarında yapay zeka destekli kredi transfer sisteminin kurulması",
   description: "",
   category: "Ar-Ge İçi", status: "proposed", priority: "critical",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["TÜBİTAK"],
   researchers: [{ researcherId: "r1", role: "responsible" }],
   tasks: [],
    projectType: "TÜBİTAK", projectTypeDetail: "", projectCall: "",
   applicationStatus: "Başvurular henüz başlamadı",
 },
  {
    id: "t4", title: "Avrupa Birliği (AB) içeriğiyle ders verilmesi",
   description: "",
   category: "Ar-Ge İçi", status: "proposed", priority: "critical",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["AB-ERASMUS-JMO"],
   researchers: [{ researcherId: "r5", role: "lead" }, { researcherId: "r3", role: "member" }],
   tasks: [],
    projectType: "Erasmus+", projectTypeDetail: "Jean Monnet", projectCall: "",
   applicationStatus: "",
 },
  {
    id: "t5", title: "XR, VR Merkezi",
   description: "",
   category: "Ar-Ge İçi", status: "proposed", priority: "critical",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["AB-KA2"],
   researchers: [{ researcherId: "r4", role: "lead" }],
   tasks: [],
    projectType: "Erasmus+", projectTypeDetail: "KA2", projectCall: "",
   applicationStatus: "Başvurular henüz başlamadı",
 },
  {
    id: "t6", title: "Yapay zeka ile kitaptan sınav sorusu üretme",
   description: "",
   category: "Ortak Çalışma", status: "proposed", priority: "high",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["BAP"],
   researchers: [{ researcherId: "r1", role: "responsible" }],
   tasks: [],
    projectType: "BAP", projectTypeDetail: "", projectCall: "",
   applicationStatus: "",
 },
  {
    id: "t7", title: "Açık ve Uzaktan Öğretim Yayınlarının İnfografik, Video ve Podcast ile Sunulması",
   description: "",
   category: "Ar-Ge İçi", status: "proposed", priority: "high",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["BAP"],
   researchers: [{ researcherId: "r3", role: "lead" }, { researcherId: "r2", role: "member" }],
   tasks: [],
    projectType: "BAP", projectTypeDetail: "", projectCall: "",
   applicationStatus: "Başvurular henüz başlamadı",
   requiredSkills: "Yapay zeka araçlarını kullanma",
   researchMethod: "Daha sonra belirlenecek",
 },
  {
    id: "t8", title: "e-Kampüs ve Öğrenci Bilgi Sistemi verilerine göre öğrenme analitiklerine dahalı veri görselleştirmesi (rozet vb.) yapay zeka temelli akıllı uyarı sisteminin tasarlanması",
   description: "",
   category: "Ortak Çalışma", status: "proposed", priority: "high",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["BAP"],
   researchers: [{ researcherId: "r2", role: "lead" }, { researcherId: "r1", role: "member" }, { researcherId: "r6", role: "member" }, { researcherId: "r3", role: "member" }, { researcherId: "r11", role: "member" }],
   tasks: [],
    projectType: "BAP", projectTypeDetail: "", projectCall: "",
   applicationStatus: "Başvurular henüz başlamadı",
 },
  {
    id: "t9", title: "Mikro-yeterlilik program ihtiyaçlarının belirlenmesi: AÖF öğrenci ve mezunları, akademisyenler ve sektör araştırması",
   description: "",
   category: "Ortak Çalışma", status: "proposed", priority: "high",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["Makale"],
   researchers: [{ researcherId: "r1", role: "responsible" }, { researcherId: "r3", role: "member" }],
   tasks: [],
    projectType: "Diğer", projectTypeDetail: "Makale", projectCall: "",
   applicationStatus: "Başvurular henüz başlamadı",
 },
  {
    id: "t10", title: "ARF Projesi: Uzaktan Eğitim Araştırma Topluluğu",
   description: "(1) CoI: Lisansüstü eğitimde araştırma topluluklarının akademik yazma becerleri ve sosyal bulunuşluk üzerindeki etkisi, öğrenen-öğrenen etkileşiminin araştırılması, öğrenen-yapay-zeka etkileşimi hakkında topluluğun tutumu araştırılabilir (2) Lisansüstü Eğitim Enstitüsü ARF projesi kapsamında uzaktan eğitim dışında hangi toplulukların kurulmasının talep edildiğine dair anket toplayabilir (CoI ile ölçek varsa bunu uygulayabilir)",
   category: "Ortak Çalışma", status: "proposed", priority: "high",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["BAP"],
   researchers: [{ researcherId: "r1", role: "responsible" }],
   tasks: [],
    projectType: "BAP", projectTypeDetail: "", projectCall: "",
   applicationStatus: "Başvuru yapılabilir",
   requiredSkills: "Yapay zeka araçlarını kullanma, İleri düzey akademik yazma becerileri",
   researchMethod: "Daha sonra belirlenecek",
 },
  {
    id: "t11", title: "Uzaktan eğitimde görme engelliler için popüler YZ araçlarını öğrenme süreçlerine entegre etme",
   description: "ChatGPT Atlas ve Google Docs + Gemini’yi/sesli komut verme gibi özelliklerle öğretim tasarım yapılabilir",
   category: "Ar-Ge İçi", status: "proposed", priority: "medium",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["TÜBİTAK"],
   researchers: [{ researcherId: "r1", role: "responsible" }],
   tasks: [],
    projectType: "TÜBİTAK", projectTypeDetail: "", projectCall: "",
   applicationStatus: "Başvurular henüz başlamadı",
 },
  {
    id: "t12", title: "Açık ve Uzaktan Öğrenenlerin Dropout Davranışlarının İrdelenmesi ve YZ Desteğiyle Uyarı Sisteminin Tasarlanması",
   description: "",
   category: "Ortak Çalışma", status: "proposed", priority: "medium",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["TÜBİTAK"],
   researchers: [{ researcherId: "r2", role: "lead" }, { researcherId: "r16", role: "member" }],
   tasks: [],
    projectType: "TÜBİTAK", projectTypeDetail: "", projectCall: "",
   applicationStatus: "Başvurular henüz başlamadı",
   requiredSkills: "Yapay zeka araçlarını kullanma",
   researchMethod: "Daha sonra belirlenecek",
 },
  {
    id: "t13", title: "e-Kampüs Alıştırmalar ile Akademik Başarı Arasındaki İlişki",
   description: "",
   category: "Ortak Çalışma", status: "proposed", priority: "medium",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["BAP"],
   researchers: [{ researcherId: "r6", role: "lead" }],
   tasks: [],
    projectType: "BAP", projectTypeDetail: "", projectCall: "",
   applicationStatus: "",
 },
  {
    id: "t14", title: "Açık ve uzaktan eğitimde yapay zeka etikletleri",
   description: "",
   category: "Ar-Ge İçi", status: "proposed", priority: "medium",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["AÜ Yayın"],
   researchers: [{ researcherId: "r2", role: "lead" }],
   tasks: [],
    projectType: "Diğer", projectTypeDetail: "AÜ Yayın", projectCall: "",
   applicationStatus: "Başvurular henüz başlamadı",
   targetJournal: "AUAd",
   researchMethod: "Daha sonra belirlenecek",
 },
  {
    id: "t15", title: "Benim Hikayem: Yurt Dışı Programları",
   description: "",
   category: "Ortak Çalışma", status: "proposed", priority: "medium",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["AÜ Kitap"],
   researchers: [{ researcherId: "r2", role: "lead" }, { researcherId: "r1", role: "member" }],
   tasks: [],
    projectType: "Diğer", projectTypeDetail: "AÜ Kitap", projectCall: "",
   applicationStatus: "Başvurular henüz başlamadı",
 },
  {
    id: "t16", title: "Agentic AI'ın açık ve uzaktan öğreitmde çeşitli konulara göre performansının incelenmesi",
   description: "",
   category: "Ortak Çalışma", status: "proposed", priority: "medium",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["AÜ Yayın"],
   researchers: [{ researcherId: "r1", role: "responsible" }],
   tasks: [],
    projectType: "Diğer", projectTypeDetail: "AÜ Yayın", projectCall: "",
   applicationStatus: "Başvurular henüz başlamadı",
   targetJournal: "AUAd",
 },
  {
    id: "t17", title: "Bilgi paketlerinin yapay zeka desteğiyle oluşturulması",
   description: "",
   category: "Ortak Çalışma", status: "proposed", priority: "medium",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["Makale"],
   researchers: [{ researcherId: "r1", role: "responsible" }, { researcherId: "r6", role: "member" }, { researcherId: "r2", role: "member" }, { researcherId: "r26", role: "member" }],
   tasks: [],
    projectType: "Diğer", projectTypeDetail: "Makale", projectCall: "",
   applicationStatus: "Başvurular henüz başlamadı",
 },
  {
    id: "t18", title: "LMS-Wrapped: Öğrenenlerinin öğrenme malzeme kullanma verilerinin hikayeleştirilmesinin SLR’e etkisi",
   description: "Araştırma konuları (1)⁠ ⁠veri hikayeleştirme Data Storytelling (2)⁠ ⁠SRL / özyönetimli öğrenme, (3)⁠ ⁠Bu bileşkenin uzaktan eğitim üzerindeki yansıması ve ölçümü ve çıktıları. Buna göre “Q1: veri hikayeleştirme uzaktan eğitimdeki öğrencilerin özyönetimli öğrenme becerilerini nasıl etkiler?”",
   category: "Ortak Çalışma", status: "proposed", priority: "medium",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["Makale"],
   researchers: [{ researcherId: "r1", role: "responsible" }],
   tasks: [],
    projectType: "Diğer", projectTypeDetail: "Makale", projectCall: "",
   applicationStatus: "Başvurular henüz başlamadı",
   requiredSkills: "Temel düzeyde oyunlaştırma bilgisine sahip olma, Yapay zeka araçlarını kullanma, Öğretim tasarımı yapabilme",
   researchMethod: "Daha sonra belirlenecek",
 },
  {
    id: "t20", title: "Büyük dil modelleri kullanılarak yapay zeka ile derslerde okutulan kitap içeriklerinin bağlamına göre içerik analizinin yapılması",
   description: "",
   category: "Ortak Çalışma", status: "proposed", priority: "low",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["BAP"],
   researchers: [{ researcherId: "r6", role: "lead" }],
   tasks: [],
    projectType: "BAP", projectTypeDetail: "", projectCall: "",
   applicationStatus: "Başvurular henüz başlamadı",
 },
  {
    id: "t21", title: "Yapay Zeka Destekli İkinci Üniversite Tercih Asistanı",
   description: "",
   category: "Ortak Çalışma", status: "proposed", priority: "low",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["BAP"],
   researchers: [{ researcherId: "r1", role: "responsible" }],
   tasks: [],
    projectType: "BAP", projectTypeDetail: "", projectCall: "",
   applicationStatus: "Başvurular henüz başlamadı",
 },
  {
    id: "t22", title: "Yurtdışı programlarında öğrenci beklentilerinin analizi",
   description: "",
   category: "Ortak Çalışma", status: "proposed", priority: "low",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["AÜ Yayın"],
   researchers: [{ researcherId: "r1", role: "responsible" }],
   tasks: [],
    projectType: "Diğer", projectTypeDetail: "AÜ Yayın", projectCall: "",
   applicationStatus: "Başvurular henüz başlamadı",
   targetJournal: "AUAd",
 },
  {
    id: "t23", title: "Kayıt yaptırmak isteyen öğrencilere üretken yapay zeka temelli tercih rehberliğinin insan ve yapay zeka ortaklığında sunulması",
   description: "",
   category: "Ortak Çalışma", status: "proposed", priority: "low",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["Makale"],
   researchers: [{ researcherId: "r1", role: "responsible" }, { researcherId: "r6", role: "member" }, { researcherId: "r2", role: "member" }],
   tasks: [],
    projectType: "Diğer", projectTypeDetail: "Makale", projectCall: "",
   applicationStatus: "Başvurular henüz başlamadı",
   targetJournal: "TOJDE",
 },
  {
    id: "t24", title: "E kampüs kalite elçiliği rolüyle öğrenen-içerik etkileşiminin çift yönlü artırılması",
   description: "",
   category: "Ortak Çalışma", status: "proposed", priority: "low",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["Makale"],
   researchers: [{ researcherId: "r6", role: "lead" }],
   tasks: [],
    projectType: "Diğer", projectTypeDetail: "Makale", projectCall: "",
   applicationStatus: "Başvurular henüz başlamadı",
 },
  {
    id: "t25", title: "Örgütsel yapay zekanın gerçek hayattaki yansıması: Bir açık ve uzaktan eğitim kurumunda birim bazlı mikro ÜYZ araçları ile makro ÜYZ tasarlama",
   description: "",
   category: "Ortak Çalışma", status: "proposed", priority: "low",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["Makale"],
   researchers: [{ researcherId: "r1", role: "responsible" }, { researcherId: "r2", role: "member" }],
   tasks: [],
    projectType: "Diğer", projectTypeDetail: "Makale", projectCall: "",
   applicationStatus: "Başvurular henüz başlamadı",
 },
  {
    id: "t26", title: "Bütünleşik destek sistemleri: Açık ve uzaktan eğitimde farklı kanallardan insan ve yapay zeka işbirliğiyle öğrenen desteği verilmesi",
   description: "",
   category: "Ortak Çalışma", status: "proposed", priority: "low",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["BAP"],
   researchers: [{ researcherId: "r1", role: "responsible" }, { researcherId: "r16", role: "member" }],
   tasks: [],
    projectType: "BAP", projectTypeDetail: "", projectCall: "",
   applicationStatus: "Başvurular henüz başlamadı",
   requiredSkills: "Destek sistemlerinde uzmanlık, Yapay zeka araçlarını kullanma",
   researchMethod: "Daha sonra belirlenecek",
 },
  {
    id: "t27", title: "Öğrenci ve öğrenci adayların web, mobil kullanma ve YZ davranışlarının ülke bazlı karşılaştırılması",
   description: "",
   category: "Ortak Çalışma", status: "proposed", priority: "low",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["AÜ Yayın"],
   researchers: [{ researcherId: "r1", role: "responsible" }],
   tasks: [],
    projectType: "Diğer", projectTypeDetail: "AÜ Yayın", projectCall: "",
   applicationStatus: "Başvurular henüz başlamadı",
   targetJournal: "TOJDE",
 },
  {
    id: "t28", title: "Açık ve uzaktan öğretimde kullanılan öğrenme malzemelerinin ülke bazlı incelenmesi",
   description: "",
   category: "Ortak Çalışma", status: "proposed", priority: "low",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["AÜ Yayın"],
   researchers: [{ researcherId: "r1", role: "responsible" }],
   tasks: [],
    projectType: "Diğer", projectTypeDetail: "AÜ Yayın", projectCall: "",
   applicationStatus: "Başvurular henüz başlamadı",
   targetJournal: "TOJDE",
 },
  {
    id: "t29", title: "Öğrenen-öğrenen etkileşimi için ÜYZ Grup Özelliğinin Kullanılması",
   description: "",
   category: "Ortak Çalışma", status: "proposed", priority: "low",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["Makale"],
   researchers: [{ researcherId: "r1", role: "responsible" }],
   tasks: [],
    projectType: "Diğer", projectTypeDetail: "Makale", projectCall: "",
   applicationStatus: "Başvurular henüz başlamadı",
 },
  {
    id: "t30", title: "Üretken yapay zeka task özelliğinin uzaktan eğitimde kişiselleştirilerek kullanılması",
   description: "ChatGPT task özelliğini bir derse Sokratik yöntemlerle entegre etme",
   category: "Ar-Ge İçi", status: "proposed", priority: "low",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["BAP"],
   researchers: [{ researcherId: "r1", role: "responsible" }],
   tasks: [],
    projectType: "BAP", projectTypeDetail: "", projectCall: "",
   applicationStatus: "Başvurular henüz başlamadı",
 },
  {
    id: "t31", title: "Öğrenme amaçları ve dersin içeriğine göre YZ destekli \"What-if\" botunun tasarlanması",
   description: "",
   category: "Ortak Çalışma", status: "proposed", priority: "low",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["AÜ Yayın"],
   researchers: [{ researcherId: "r6", role: "lead" }],
   tasks: [],
    projectType: "Diğer", projectTypeDetail: "AÜ Yayın", projectCall: "",
   applicationStatus: "Başvurular henüz başlamadı",
   targetJournal: "TOJDE",
 },
  {
    id: "t32", title: "Senkron ve asenkron derslerde öğrenen-içerik etkileşiminin incelenmesi (AÖF canlı dersler)",
   description: "",
   category: "Ortak Çalışma", status: "proposed", priority: "low",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["AÜ Yayın"],
   researchers: [{ researcherId: "r6", role: "lead" }],
   tasks: [],
    projectType: "Diğer", projectTypeDetail: "AÜ Yayın", projectCall: "",
   applicationStatus: "Başvurular henüz başlamadı",
   targetJournal: "AUAd",
 },
  {
    id: "t33", title: "Anadolu Üniversitesi Açıköğretim Fakültesi kayıtlarındaki tanıtım faaliyetlerinin incelenmesi",
   description: "",
   category: "Ortak Çalışma", status: "proposed", priority: "low",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["AÜ Yayın"],
   researchers: [{ researcherId: "r2", role: "lead" }],
   tasks: [],
    projectType: "Diğer", projectTypeDetail: "AÜ Yayın", projectCall: "",
   applicationStatus: "Başvurular henüz başlamadı",
   targetJournal: "AUAd",
 },
  {
    id: "t34", title: "Dünyadaki açık ve uzaktan eğitim kurumlarındaki mikro-yeterlik örnekleri",
   description: "",
   category: "Ortak Çalışma", status: "proposed", priority: "low",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["AÜ Yayın"],
   researchers: [{ researcherId: "r2", role: "lead" }, { researcherId: "r1", role: "member" }],
   tasks: [],
    projectType: "Diğer", projectTypeDetail: "AÜ Yayın", projectCall: "",
   applicationStatus: "Başvurular henüz başlamadı",
   targetJournal: "AUAd",
 },
  {
    id: "t35", title: "Açık ve uzaktan eğitimde kayıtlı öğrenciler için sisteme yönelik kapsamlı oryantasyon dersinin oluşturulması",
   description: "",
   category: "Ortak Çalışma", status: "proposed", priority: "low",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["Makale"],
   researchers: [{ researcherId: "r6", role: "lead" }],
   tasks: [],
    projectType: "Diğer", projectTypeDetail: "Makale", projectCall: "",
   applicationStatus: "Başvurular henüz başlamadı",
 },
  {
    id: "t36", title: "Anlık YZ çevirisine farklı bir bakış: Günlük hayatta dil öğrenimi için kullanım",
   description: "Örneğin Airpods (Pro3 ile) yabancı dil olarak İspanyolca öğrenmek isteyen bir Amerikalı şu an Airpodsunu listening için kullanabilir",
   category: "Ortak Çalışma", status: "proposed", priority: "low",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["Makale"],
   researchers: [{ researcherId: "r1", role: "responsible" }],
   tasks: [],
    projectType: "Diğer", projectTypeDetail: "Makale", projectCall: "",
   applicationStatus: "Başvurular henüz başlamadı",
 },
  {
    id: "t37", title: "Farklı dillerde konuşan ve aynı dersi alan uluslararası öğrenenlerle birlikte Grup ÜYZ kullanımı",
   description: "",
   category: "Ortak Çalışma", status: "proposed", priority: "low",   applicationDate: "", startDate: "", endDate: "",
   workLink: "",
   tags: ["Makale"],
   researchers: [{ researcherId: "r1", role: "responsible" }],
   tasks: [],
    projectType: "Diğer", projectTypeDetail: "Makale", projectCall: "",
   applicationStatus: "Başvurular henüz başlamadı",
  },
];

const DEFAULT_PROJECT_TYPES = [
  "BAP", "TÜBİTAK", "Horizon", "Erasmus+", "DIGITAL",
  "Diğer Ulusal", "Diğer Uluslararası", "Diğer"
];

const initialProjects = [];

// ─── UTILITY / CONFIG ─────────────────────────────────────
const DEFAULT_STATUS_CONFIG = {
  proposed: { label: "Önerilen", color: "bg-slate-100 text-slate-700", dot: "bg-slate-400" },
  active: { label: "Aktif", color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  completed: { label: "Tamamlandı", color: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  failed: { label: "Tamamlanamadı", color: "bg-red-100 text-red-700", dot: "bg-red-500" },
  archived: { label: "Arşiv", color: "bg-gray-100 text-gray-500", dot: "bg-gray-400" },
  planning: { label: "İşlem Yapılıyor", color: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  review: { label: "İnceleme", color: "bg-purple-100 text-purple-700", dot: "bg-purple-500" },
};
const DEFAULT_PRIORITY_CONFIG = {
  low: { label: "Düşük", color: "bg-slate-100 text-slate-600", icon: "○" },
  medium: { label: "Orta", color: "bg-amber-100 text-amber-700", icon: "◐" },
  high: { label: "Yüksek", color: "bg-red-100 text-red-700", icon: "●" },
  critical: { label: "Kritik", color: "bg-red-200 text-red-800", icon: "◉" },
};
const DEFAULT_ROLE_CONFIG = {
  lead: { label: "Yürütücü", color: "bg-indigo-100 text-indigo-700", weight: 10 },
  unit_manager: { label: "Birim Sorumlusu", color: "bg-rose-100 text-rose-700", weight: 9 },
  responsible: { label: "Sorumlu", color: "bg-orange-100 text-orange-700", weight: 8 },
  member: { label: "Araştırmacı", color: "bg-emerald-100 text-emerald-700", weight: 4 },
  advisor: { label: "Danışman", color: "bg-purple-100 text-purple-700", weight: 2 },
  scholar: { label: "Bursiyer", color: "bg-cyan-100 text-cyan-700", weight: 1 },
};
const taskStatusConfig = {
  todo: { label: "Yapılacak", icon: <Circle size={14} className="text-slate-400" />, color: "text-slate-500" },
  in_progress: { label: "Devam Ediyor", icon: <Timer size={14} className="text-blue-500" />, color: "text-blue-600" },
  done: { label: "Tamamlandı", icon: <CheckCircle2 size={14} className="text-emerald-500" />, color: "text-emerald-600" },
};
const DEFAULT_EDU_DEGREES = ["Lisans", "Yüksek Lisans", "Doktora", "Doçentlik", "Profesörlük"];
const DEFAULT_EDU_STATUSES = ["Devam Ediyor", "Mezun", "Doktora Devam Ediyor", "Doçentlik Aşamasında"];
const DEFAULT_CATEGORY_OPTIONS = ["Ar-Ge İçi", "Ortak Çalışma", "Diğer"];

// Module-level config refs (synced from component state on each render)
let roleConfig = DEFAULT_ROLE_CONFIG;
let statusConfig = DEFAULT_STATUS_CONFIG;
let priorityConfig = DEFAULT_PRIORITY_CONFIG;
let projectTypeOptions = DEFAULT_PROJECT_TYPES;
let categoryOptions = DEFAULT_CATEGORY_OPTIONS;
let eduDegreeOptions = DEFAULT_EDU_DEGREES;
let eduStatusOptions = DEFAULT_EDU_STATUSES;

const getInitials = (name) => name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
const getProgress = (tasks) => {
  if (!tasks || tasks.length === 0) return 0;
  return Math.round((tasks.filter(t => t.status === "done").length / tasks.length) * 100);
};
const statusOrder = { active: 0, proposed: 1, planning: 2, review: 3, completed: 4, failed: 5, archived: 6 };
const getCardStyle = (status, endDate) => {
  if (status === "failed") return { bg: "bg-red-50", border: "border-red-200 hover:border-red-300", label: "Tamamlanamayan Çalışma", labelClass: "bg-red-100 text-red-700", icon: "🚫" };
  if (status === "completed") return { bg: "bg-emerald-50", border: "border-emerald-200 hover:border-emerald-300", label: "Tamamlandı", labelClass: "bg-emerald-100 text-emerald-700", icon: "✓" };
  if (endDate) {
    const now = new Date();
    const end = new Date(endDate);
    const diffDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    if (diffDays >= 0 && diffDays <= 30) return { bg: "bg-amber-50", border: "border-amber-200 hover:border-amber-300", label: `Süre: ${diffDays} gün`, labelClass: "bg-amber-100 text-amber-700", icon: "⏰" };
  }
  return null;
};

// ─── SHARED UI COMPONENTS ─────────────────────────────────
const Badge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${className}`}>{children}</span>
);
const ProgressBar = ({ value, className = "" }) => (
  <div className={`w-full bg-slate-100 rounded-full h-1.5 ${className}`}>
    <div className="h-1.5 rounded-full transition-all duration-500"
      style={{ width: `${value}%`, background: value === 100 ? "#10b981" : value > 60 ? "#6366f1" : value > 30 ? "#f59e0b" : "#94a3b8" }} />
  </div>
);
const Avatar = ({ name, color, size = "sm" }) => {
  const sizes = { xs: "w-6 h-6 text-xs", sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-lg", xl: "w-20 h-20 text-2xl" };
  return (
    <div className={`${sizes[size]} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}
      style={{ backgroundColor: color || "#6366f1" }}>{getInitials(name)}</div>
  );
};
const InfoRow = ({ icon: Icon, label, value, href }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2.5 py-1.5">
      <Icon size={14} className="text-slate-400 mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline break-all">{value}</a>
        ) : (
          <p className="text-sm text-slate-700">{value}</p>
        )}
      </div>
    </div>
  );
};
const FilterDropdown = ({ label, icon: Icon, options, value, onChange, className = "" }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`relative ${className}`}>
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-slate-600">
        {Icon && <Icon size={14} />}
        <span>{value ? options.find(o => o.value === value)?.label || label : label}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20 min-w-[160px]">
            <button onClick={() => { onChange(""); setOpen(false); }}
              className={`w-full text-left px-3 py-1.5 text-sm hover:bg-slate-50 ${!value ? "text-indigo-600 font-medium" : "text-slate-600"}`}>Tümü</button>
            {options.map(opt => (
              <button key={opt.value} onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full text-left px-3 py-1.5 text-sm hover:bg-slate-50 flex items-center gap-2 ${value === opt.value ? "text-indigo-600 font-medium" : "text-slate-600"}`}>
                {opt.dot && <span className={`w-2 h-2 rounded-full ${opt.dot}`} />}{opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
const RoleSelectPopup = ({ onSelect, onCancel, position }) => (
  <>
    <div className="fixed inset-0 z-40 bg-black/20" onClick={onCancel} />
    <div className="fixed z-50 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 w-64"
      style={{ top: position?.y || "50%", left: position?.x || "50%", transform: "translate(-50%, -50%)" }}>
      <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
        <UserCheck size={16} className="text-indigo-500" />Rol Seçin
      </h3>
      <div className="space-y-1.5">
        {Object.entries(roleConfig).map(([key, config]) => (
          <button key={key} onClick={() => onSelect(key)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left">
            <Badge className={config.color}>{config.label}</Badge>
          </button>
        ))}
      </div>
      <button onClick={onCancel} className="mt-3 w-full text-center text-xs text-slate-400 hover:text-slate-600">İptal</button>
    </div>
  </>
);
const TaskItem = ({ task, researchers, onStatusChange, onDelete }) => {
  const assignee = researchers.find(r => r.id === task.assignedTo);
  const statusCycle = { todo: "in_progress", in_progress: "done", done: "todo" };
  const cfg = taskStatusConfig[task.status];
  return (
    <div className="flex items-center gap-2 py-1.5 group">
      <button onClick={() => onStatusChange(task.id, statusCycle[task.status])}
        className="flex-shrink-0 hover:scale-110 transition-transform" title="Durum değiştir">{cfg.icon}</button>
      <span className={`text-sm flex-1 ${task.status === "done" ? "line-through text-slate-400" : "text-slate-700"}`}>{task.title}</span>
      {assignee && <Avatar name={assignee.name} color={assignee.color} size="xs" />}
      <button onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 transition-all"><X size={12} /></button>
    </div>
  );
};
const Toast = ({ message, type = "success", onClose }) => {
  const colors = { success: "bg-emerald-500", info: "bg-indigo-500", warning: "bg-amber-500", error: "bg-red-500" };
  return (
    <div className={`fixed bottom-6 right-6 z-[60] ${colors[type]} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-slide-up text-sm font-medium`}>
      {type === "success" && <CheckCircle2 size={16} />}{type === "info" && <Activity size={16} />}
      {message}
      <button onClick={onClose} className="ml-2 hover:bg-white/20 rounded p-0.5"><X size={14} /></button>
    </div>
  );
};

// ─── RESEARCHER CARD (Compact — just name shown, click for full profile) ──
const ResearcherCard = ({ researcher, onClick, isAdmin, topics }) => {
  const myTopics = (topics || []).filter(t => t.researchers.some(r => r.researcherId === researcher.id));
  const proposedCount = myTopics.filter(t => t.status === "proposed").length;
  const activeCount = myTopics.filter(t => t.status === "active").length;
  const completedCount = myTopics.filter(t => t.status === "completed").length;
  const totalCount = myTopics.length;
  return (
    <div
      draggable={isAdmin}
      onDragStart={(e) => {
        if (!isAdmin) {
          e.preventDefault();
          return;
        }
        e.stopPropagation();
        e.dataTransfer.setData("type", "researcher");
        e.dataTransfer.setData("id", researcher.id);
        e.dataTransfer.effectAllowed = "copy";
      }}
      onClick={(e) => { e.stopPropagation(); onClick(researcher); }}
      className="bg-white rounded-xl border border-slate-200 p-3 cursor-grab active:cursor-grabbing
        hover:shadow-md hover:border-indigo-200 transition-all duration-200 group"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar name={researcher.name} color={researcher.color} size="md" />
          {totalCount > 0 && (
            <div className={`absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-white shadow-sm ${activeCount > 0 ? "bg-emerald-500" : completedCount > 0 ? "bg-blue-500" : "bg-slate-400"}`}
              title={`${proposedCount} önerilen · ${activeCount} aktif · ${completedCount} tamamlanan`}>
              {totalCount}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 truncate">{researcher.title} {researcher.name}</p>
          <p className="text-xs text-slate-500 truncate">{researcher.institution}{researcher.unit ? ` · ${researcher.unit}` : ""}</p>
          {totalCount > 0 ? (
            <div className="flex items-center gap-1 mt-1 flex-wrap">
              {proposedCount > 0 && <Badge className="bg-slate-100 text-slate-600">{proposedCount} Önerilen</Badge>}
              {activeCount > 0 && <Badge className="bg-emerald-50 text-emerald-700">{activeCount} Aktif</Badge>}
              {completedCount > 0 && <Badge className="bg-blue-50 text-blue-700">{completedCount} Tamamlanan</Badge>}
              {totalCount > proposedCount + activeCount + completedCount && <Badge className="bg-red-50 text-red-600">+{totalCount - proposedCount - activeCount - completedCount}</Badge>}
            </div>
          ) : (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {researcher.researchAreas.slice(0, 2).map(a => (
                <Badge key={a} className="bg-slate-100 text-slate-600">{a}</Badge>
              ))}
              {researcher.researchAreas.length > 2 && (
                <Badge className="bg-slate-50 text-slate-400">+{researcher.researchAreas.length - 2}</Badge>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col items-center gap-1">
          <GripVertical size={16} className="text-slate-300" />
          {researcher.hasPIExperience && (
            <Award size={12} className="text-amber-400" title="Proje Yürütücülüğü Deneyimi" />
          )}
        </div>
      </div>
    </div>
  );
};

// ─── RESEARCHER DETAIL MODAL (Full profile) ──────────────
const ResearcherDetailModal = ({ researcher, topics, projects, isAdmin, onClose, onUpdate, onSelectTopic, onDeleteResearcher }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...researcher });
  const ef = (key, val) => setForm({ ...form, [key]: val });
  const eInput = "w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300";

  const assignedTopics = topics.filter(t =>
    t.researchers.some(r => r.researcherId === researcher.id)
  );

  const handleSave = () => {
    onUpdate({
      ...form,
      languages: typeof form.languages === "string" ? form.languages.split(",").map(s => s.trim()).filter(Boolean) : form.languages,
      researchAreas: typeof form.researchAreas === "string" ? form.researchAreas.split(",").map(s => s.trim()).filter(Boolean) : form.researchAreas,
      tools: typeof form.tools === "string" ? form.tools.split(",").map(s => s.trim()).filter(Boolean) : form.tools,
    });
    setEditing(false);
  };
  const handleCancel = () => { setForm({ ...researcher }); setEditing(false); };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
        md:w-[580px] md:max-h-[85vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">

        {/* Header with avatar — all inside gradient */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5 relative flex-shrink-0">
          <div className="absolute top-3 right-3 flex gap-1.5">
            {isAdmin && <button onClick={() => editing ? handleCancel() : setEditing(true)}
              className={`p-1.5 rounded-lg text-white ${editing ? "bg-white/30" : "bg-white/20 hover:bg-white/30"}`}
              title={editing ? "Düzenlemeyi iptal et" : "Profili düzenle"}>
              {editing ? <X size={16} /> : <Edit3 size={16} />}
            </button>}
            <button onClick={onClose} className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white">
              <X size={16} />
            </button>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <div className="ring-4 ring-white/30 rounded-full flex-shrink-0">
              <Avatar name={editing ? form.name : researcher.name} color={researcher.color} size="xl" />
            </div>
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="flex gap-2">
                  <input value={form.title} onChange={e => ef("title", e.target.value)} placeholder="Unvan" className="text-sm bg-white/20 border border-white/30 rounded px-2 py-1 w-28 text-white placeholder-white/60" />
                  <input value={form.name} onChange={e => ef("name", e.target.value)} placeholder="Ad Soyad" className="text-sm bg-white/20 border border-white/30 rounded px-2 py-1 flex-1 font-bold text-white placeholder-white/60" />
                </div>
              ) : (
                <h2 className="text-xl font-bold text-white drop-shadow-sm truncate">{researcher.title} {researcher.name}</h2>
              )}
              <p className="text-sm text-white/70 mt-1">{researcher.institution}{researcher.unit ? ` · ${researcher.unit}` : ""}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 pb-5 space-y-4">

          {/* Badges: PI experience */}
          <div className="flex flex-wrap gap-2">
            {editing ? (
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input type="checkbox" checked={form.hasPIExperience} onChange={e => ef("hasPIExperience", e.target.checked)} className="rounded border-slate-300" />
                Proje Yürütücülüğü Deneyimi
              </label>
            ) : (<>
              {researcher.hasPIExperience
                ? <Badge className="bg-amber-100 text-amber-700"><Award size={11} className="mr-1" />Proje Yürütücülüğü Deneyimi Var</Badge>
                : <Badge className="bg-slate-100 text-slate-500">Proje Yürütücülüğü Deneyimi Yok</Badge>}
              <Badge className="bg-indigo-50 text-indigo-600">{researcher.eduDegree}</Badge>
              <Badge className="bg-slate-100 text-slate-600">{researcher.eduStatus}</Badge>
            </>)}
          </div>

          {/* Kişisel İstatistikler */}
          {!editing && (() => {
            const myTopics = assignedTopics;
            const myRoleCounts = {};
            myTopics.forEach(t => {
              const a = t.researchers.find(r => r.researcherId === researcher.id);
              if (a?.role) myRoleCounts[a.role] = (myRoleCounts[a.role] || 0) + 1;
            });
            const myStatusCounts = {};
            myTopics.forEach(t => { myStatusCounts[t.status] = (myStatusCounts[t.status] || 0) + 1; });
            const myProjectTopicIds = new Set(myTopics.map(t => t.id));
            const myProjects = (projects || []).filter(p => (p.topics || []).some(tid => myProjectTopicIds.has(tid)));
            const projectedTopicCount = myTopics.filter(t => (projects || []).some(p => (p.topics || []).includes(t.id))).length;
            const allMyTasks = [...myTopics, ...myProjects].flatMap(x => x.tasks || []);
            const doneTasks = allMyTasks.filter(tk => tk.status === "done").length;
            return (
              <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-xl p-4 border border-slate-100">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <BarChart3 size={12} className="text-indigo-500" />Kişisel İstatistikler
                </h4>
                {/* Ana metrikler */}
                <div className="grid grid-cols-5 gap-1.5 mb-3">
                  <div className="bg-white rounded-lg p-2 text-center border border-slate-100">
                    <p className="text-base font-bold text-indigo-600">{myTopics.length}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Toplam</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-2 text-center border border-emerald-100">
                    <p className="text-base font-bold text-emerald-600">{myStatusCounts["active"] || 0}</p>
                    <p className="text-[9px] text-emerald-500 mt-0.5">Aktif</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2 text-center border border-blue-100">
                    <p className="text-base font-bold text-blue-600">{myStatusCounts["completed"] || 0}</p>
                    <p className="text-[9px] text-blue-500 mt-0.5">Tamamlanan</p>
                  </div>
                  <div className="bg-violet-50 rounded-lg p-2 text-center border border-violet-100">
                    <p className="text-base font-bold text-violet-600">{myProjects.length}</p>
                    <p className="text-[9px] text-violet-500 mt-0.5">Proje</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center border border-slate-100">
                    <p className="text-base font-bold text-slate-600">{doneTasks}/{allMyTasks.length}</p>
                    <p className="text-[9px] text-slate-400 mt-0.5">Görev</p>
                  </div>
                </div>
                {/* Rol dağılımı */}
                <div className="mb-3">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Rol Dağılımı</p>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(roleConfig).map(([rKey, rCfg]) => {
                      const cnt = myRoleCounts[rKey] || 0;
                      if (cnt === 0) return null;
                      return (
                        <div key={rKey} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${rCfg.color} text-xs font-medium`}>
                          <span>{rCfg.label}</span>
                          <span className="font-bold">{cnt}</span>
                        </div>
                      );
                    })}
                    {Object.values(myRoleCounts).every(v => v === 0) && <span className="text-xs text-slate-400 italic">Atama yok</span>}
                  </div>
                </div>
                {/* Durum dağılımı */}
                <div className="mb-3">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Konu Durumu</p>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(statusConfig).map(([sKey, sCfg]) => {
                      const cnt = myStatusCounts[sKey] || 0;
                      if (cnt === 0) return null;
                      return (
                        <div key={sKey} className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ${sCfg.color} text-[11px] font-medium`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sCfg.dot}`} />
                          <span>{sCfg.label}: {cnt}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Proje özeti */}
                <div className="flex items-center gap-3 bg-white rounded-lg p-2.5 border border-slate-100">
                  <FolderKanban size={16} className="text-violet-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-slate-600">
                      <span className="font-semibold text-violet-700">{projectedTopicCount}</span> konu projelendirilmiş
                      {myProjects.length > 0 && <span className="text-slate-400"> · {myProjects.length} projede yer alıyor</span>}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Contact */}
          <div className="bg-slate-50 rounded-xl p-3 space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">İletişim</h4>
            {editing ? (<>
              <div className="grid grid-cols-2 gap-2">
                <input value={form.email} onChange={e => ef("email", e.target.value)} placeholder="E-posta" className={eInput} />
                <input value={form.phone} onChange={e => ef("phone", e.target.value)} placeholder="Telefon" className={eInput} />
              </div>
              <input value={form.url} onChange={e => ef("url", e.target.value)} placeholder="Profil URL" className={eInput} />
            </>) : (<>
              <InfoRow icon={Mail} label="E-posta" value={researcher.email} href={`mailto:${researcher.email}`} />
              <InfoRow icon={Phone} label="Telefon" value={researcher.phone} />
              {researcher.url && <InfoRow icon={Globe} label="Profil URL" value={researcher.url} href={researcher.url} />}
            </>)}
          </div>

          {/* Education */}
          <div className="bg-slate-50 rounded-xl p-3 space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Öğrenim Bilgileri</h4>
            {editing ? (<>
              <input value={form.eduUniversity} onChange={e => ef("eduUniversity", e.target.value)} placeholder="Üniversite" className={eInput} />
              <input value={form.eduProgram} onChange={e => ef("eduProgram", e.target.value)} placeholder="Program" className={eInput} />
              <div className="grid grid-cols-2 gap-2">
                <select value={form.eduDegree} onChange={e => ef("eduDegree", e.target.value)} className={eInput}>
                  {eduDegreeOptions.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={form.eduStatus} onChange={e => ef("eduStatus", e.target.value)} className={eInput}>
                  {eduStatusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </>) : (<>
              <InfoRow icon={GraduationCap} label="Üniversite" value={researcher.eduUniversity} />
              <InfoRow icon={BookOpen} label="Program" value={researcher.eduProgram} />
              <InfoRow icon={Award} label="Derece" value={researcher.eduDegree} />
              <InfoRow icon={Clock} label="Durum" value={researcher.eduStatus} />
            </>)}
          </div>

          {/* Institution */}
          <div className="bg-slate-50 rounded-xl p-3 space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Kurum Bilgileri</h4>
            {editing ? (<>
              <input value={form.institution} onChange={e => ef("institution", e.target.value)} placeholder="Çalıştığı Kurum" className={eInput} />
              <input value={form.unit} onChange={e => ef("unit", e.target.value)} placeholder="Birimi" className={eInput} />
            </>) : (<>
              <InfoRow icon={Building2} label="Çalıştığı Kurum" value={researcher.institution} />
              <InfoRow icon={MapPin} label="Birimi" value={researcher.unit} />
            </>)}
          </div>

          {/* Languages */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Yabancı Diller</h4>
            {editing ? (
              <input value={Array.isArray(form.languages) ? form.languages.join(", ") : form.languages}
                onChange={e => ef("languages", e.target.value)} placeholder="Virgülle ayırarak yazın..." className={eInput} />
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {(researcher.languages || []).map(lang => (
                  <Badge key={lang} className="bg-blue-50 text-blue-600"><Languages size={11} className="mr-1" />{lang}</Badge>
                ))}
                {(!researcher.languages || researcher.languages.length === 0) && <span className="text-sm text-slate-400 italic">Belirtilmemiş</span>}
              </div>
            )}
          </div>

          {/* Research Areas */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Çalışma Alanları</h4>
            {editing ? (
              <textarea value={Array.isArray(form.researchAreas) ? form.researchAreas.join(", ") : form.researchAreas}
                onChange={e => ef("researchAreas", e.target.value)} placeholder="Virgülle ayırarak yazın..."
                className={eInput + " h-20 resize-none"} />
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {researcher.researchAreas.map(area => (
                  <Badge key={area} className="bg-indigo-50 text-indigo-700">{area}</Badge>
                ))}
              </div>
            )}
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Kullanabildiği Araçlar</h4>
            {editing ? (
              <input value={Array.isArray(form.tools) ? form.tools.join(", ") : form.tools}
                onChange={e => ef("tools", e.target.value)} placeholder="Virgülle ayırarak yazın..." className={eInput} />
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {(researcher.tools || []).map(tool => (
                  <Badge key={tool} className="bg-emerald-50 text-emerald-700"><Wrench size={10} className="mr-1" />{tool}</Badge>
                ))}
                {(!researcher.tools || researcher.tools.length === 0) && <span className="text-sm text-slate-400 italic">Belirtilmemiş</span>}
              </div>
            )}
          </div>

          {/* Bio */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Açıklama</h4>
            {editing ? (
              <textarea value={form.bio} onChange={e => ef("bio", e.target.value)} placeholder="Açıklama..."
                className={eInput + " h-20 resize-none"} />
            ) : (
              <p className="text-sm text-slate-600 leading-relaxed">{researcher.bio || <span className="italic text-slate-400">Belirtilmemiş</span>}</p>
            )}
          </div>

          {/* Assigned Topics — grouped by status, sorted by role, with project info */}
          {assignedTopics.length > 0 && (() => {
            const statusGroups = [
              { key: "active", label: "Aktif", icon: "emerald" },
              { key: "completed", label: "Tamamlandı", icon: "blue" },
              { key: "failed", label: "Tamamlanamadı", icon: "red" },
              { key: "proposed", label: "Önerilen", icon: "slate" },
              { key: "planning", label: "İşlem Yapılıyor", icon: "amber" },
              { key: "review", label: "İnceleme", icon: "purple" },
              { key: "archived", label: "Arşiv", icon: "gray" },
            ];
            const bgMap = { emerald: "bg-emerald-50", blue: "bg-blue-50", red: "bg-red-50", slate: "bg-slate-50", amber: "bg-amber-50", purple: "bg-purple-50", gray: "bg-gray-50" };
            const dotMap = { emerald: "bg-emerald-500", blue: "bg-blue-500", red: "bg-red-500", slate: "bg-slate-400", amber: "bg-amber-500", purple: "bg-purple-500", gray: "bg-gray-400" };
            const textMap = { emerald: "text-emerald-700", blue: "text-blue-700", red: "text-red-700", slate: "text-slate-700", amber: "text-amber-700", purple: "text-purple-700", gray: "text-gray-500" };
            const roleOrder = { lead: 0, unit_manager: 1, responsible: 2, member: 3, advisor: 4, scholar: 5 };
            const getLinkedProject = (topicId) => (projects || []).find(p => (p.topics || []).includes(topicId));

            // Rol bazlı sayılar
            const roleCounts = {};
            assignedTopics.forEach(t => {
              const a = t.researchers.find(r => r.researcherId === researcher.id);
              if (a?.role) roleCounts[a.role] = (roleCounts[a.role] || 0) + 1;
            });

            return (
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Atandığı Konular ({assignedTopics.length})</h4>

                {/* Rol bazlı özet satırı */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {Object.entries(roleConfig).map(([rKey, rCfg]) => {
                    const cnt = roleCounts[rKey] || 0;
                    if (cnt === 0) return null;
                    return (
                      <div key={rKey} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${rCfg.color} text-xs font-medium`}>
                        <span>{rCfg.label}</span>
                        <span className="font-bold">{cnt}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3">
                  {statusGroups.map(sg => {
                    const groupTopics = assignedTopics
                      .filter(t => t.status === sg.key)
                      .sort((a, b) => {
                        // Projelendirilmişler önce
                        const aPrj = (projects || []).some(p => (p.topics || []).includes(a.id)) ? 0 : 1;
                        const bPrj = (projects || []).some(p => (p.topics || []).includes(b.id)) ? 0 : 1;
                        if (aPrj !== bPrj) return aPrj - bPrj;
                        // Sonra role göre
                        const roleA = (a.researchers.find(r => r.researcherId === researcher.id))?.role || "member";
                        const roleB = (b.researchers.find(r => r.researcherId === researcher.id))?.role || "member";
                        return (roleOrder[roleA] ?? 99) - (roleOrder[roleB] ?? 99);
                      });
                    if (groupTopics.length === 0) return null;
                    return (
                      <div key={sg.key}>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className={`w-2 h-2 rounded-full ${dotMap[sg.icon]}`} />
                          <span className={`text-xs font-semibold ${textMap[sg.icon]}`}>{sg.label} ({groupTopics.length})</span>
                        </div>
                        <div className="space-y-1">
                          {groupTopics.map(t => {
                            const assignment = t.researchers.find(r => r.researcherId === researcher.id);
                            const linkedProject = getLinkedProject(t.id);
                            const isProjected = !!linkedProject;
                            return (
                              <button key={t.id} onClick={() => { if (onSelectTopic) { onClose(); onSelectTopic(t); } }}
                                className={`w-full flex items-center gap-2 p-2 rounded-lg transition-all text-left group ${
                                  isProjected
                                    ? "bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 ring-1 ring-violet-100 shadow-sm"
                                    : `${bgMap[sg.icon]} hover:ring-2 hover:ring-indigo-200`
                                }`}>
                                {isProjected
                                  ? <FolderKanban size={14} className="text-violet-500 flex-shrink-0" />
                                  : <BookOpen size={14} className={`${textMap[sg.icon]} flex-shrink-0`} />}
                                <div className="flex-1 min-w-0">
                                  <span className={`text-sm font-medium truncate block group-hover:text-indigo-600 ${isProjected ? "text-violet-800" : textMap[sg.icon]}`}>{t.title}</span>
                                  {isProjected && (
                                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-violet-100 text-[10px] font-semibold text-violet-700">
                                        <FolderKanban size={9} />
                                        {linkedProject.title?.length > 30 ? linkedProject.title.slice(0, 30) + "..." : linkedProject.title}
                                      </span>
                                      {linkedProject.type && (
                                        <span className="text-[10px] text-violet-500 font-medium">{linkedProject.type}{linkedProject.projectTypeDetail ? ` — ${linkedProject.projectTypeDetail}` : ""}</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <Badge className={roleConfig[assignment?.role]?.color || "bg-slate-100"}>
                                  {roleConfig[assignment?.role]?.label || assignment?.role}
                                </Badge>
                                <ExternalLink size={12} className="text-slate-300 group-hover:text-indigo-400 flex-shrink-0" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Performance Notes */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Performans Takip Notları</h4>
            {editing ? (
              <textarea value={form.performanceNotes} onChange={e => ef("performanceNotes", e.target.value)}
                placeholder="Performans notları..."
                className={eInput + " h-24 resize-none"} />
            ) : (
              <div className="bg-amber-50 rounded-lg p-3">
                <p className="text-sm text-slate-600">{researcher.performanceNotes || <span className="italic text-slate-400">Henüz not eklenmedi</span>}</p>
              </div>
            )}
          </div>

          {/* Save/Cancel Buttons */}
          {editing && (
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button onClick={handleSave} className="flex-1 px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors">Kaydet</button>
              <button onClick={handleCancel} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">İptal</button>
            </div>
          )}

          {/* Delete Researcher */}
          {!editing && isAdmin && onDeleteResearcher && (
            <div className="pt-3 mt-3 border-t border-red-100">
              <button onClick={() => onDeleteResearcher(researcher.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 transition-colors">
                <Trash2 size={14} />Kişiyi Sil
              </button>
              <p className="text-[10px] text-slate-400 text-center mt-1.5">Kişi kalıcı olarak silinir. Atandığı tüm konulardan ve projelerden kaldırılır.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ─── TOPIC CARD ───────────────────────────────────────────
const TopicCard = ({ topic, allResearchers, onDrop, onClick, isAdmin, projects, onRemoveFromProject }) => {
  const [dragOver, setDragOver] = useState(false);
  const stCfg = statusConfig[topic.status] || statusConfig.proposed;
  const prCfg = priorityConfig[topic.priority] || priorityConfig.medium;
  const progress = getProgress(topic.tasks);
  const isProjected = (projects || []).some(p => (p.topics || []).includes(topic.id));
  const linkedProject = isProjected ? (projects || []).find(p => (p.topics || []).includes(topic.id)) : null;
  const cardStyle = getCardStyle(topic.status, topic.endDate);
  const baseBg = isProjected ? "bg-slate-100 opacity-80 hover:opacity-100" : cardStyle ? `${cardStyle.bg} hover:shadow-md` : "bg-white hover:shadow-md";
  const baseBorder = dragOver ? "border-indigo-400 bg-indigo-50 shadow-lg ring-2 ring-indigo-200" : isProjected ? "border-slate-300" : cardStyle ? cardStyle.border : "border-slate-200 hover:border-indigo-200";
  return (
    <div
      draggable={isAdmin}
      onDragStart={(e) => { if (!isAdmin) { e.preventDefault(); return; } e.dataTransfer.setData("type", "topic"); e.dataTransfer.setData("id", topic.id); e.dataTransfer.effectAllowed = "copy"; }}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); const type = e.dataTransfer.getData("type"); const id = e.dataTransfer.getData("id"); if (type === "researcher") onDrop(topic.id, id, e); }}
      onClick={() => onClick(topic)}
      className={`rounded-xl border p-3 cursor-pointer transition-all duration-200 ${baseBg} ${baseBorder}`}
    >
      {cardStyle && !isProjected && (
        <div className={`flex items-center gap-1.5 mb-2 px-2 py-1 rounded-lg ${cardStyle.labelClass}`}>
          <span className="text-xs">{cardStyle.icon}</span>
          <span className="text-[11px] font-semibold uppercase tracking-wide">{cardStyle.label}</span>
        </div>
      )}
      {isProjected && (
        <div className="flex items-center gap-1.5 mb-2 px-2 py-1 bg-slate-200/80 rounded-lg">
          <FolderKanban size={12} className="text-slate-500" />
          <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wide">Projelendirildi</span>
          {linkedProject && <span className="text-[10px] text-slate-500 truncate max-w-[100px]">{linkedProject.title}</span>}
          {isAdmin && onRemoveFromProject && (
            <button onClick={(e) => { e.stopPropagation(); onRemoveFromProject(topic.id); }}
              className="ml-auto px-1.5 py-0.5 text-[10px] font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded transition-colors"
              title="Projelendirmeyi İptal Et">
              <X size={10} className="inline mr-0.5" />İptal
            </button>
          )}
        </div>
      )}
      <div className="flex items-start justify-between mb-2">
        <h3 className={`text-sm font-semibold flex-1 pr-2 ${isProjected ? "text-slate-600" : topic.status === "failed" ? "text-red-700" : topic.status === "completed" ? "text-emerald-700" : "text-slate-800"}`}>{topic.title}</h3>
        <GripVertical size={16} className="text-slate-300 flex-shrink-0" />
      </div>
      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        <Badge className={stCfg.color}><span className={`w-1.5 h-1.5 rounded-full ${stCfg.dot} mr-1`} />{stCfg.label}</Badge>
        <Badge className={prCfg.color}>{prCfg.icon} {prCfg.label}</Badge>
        {topic.projectType && <Badge className="bg-violet-50 text-violet-600">{topic.projectType}{topic.projectTypeDetail ? `: ${topic.projectTypeDetail}` : ""}</Badge>}
        {topic.category && <Badge className="bg-blue-50 text-blue-600">{topic.category}</Badge>}
      </div>
      <p className="text-xs text-slate-500 mb-3 line-clamp-2">{topic.description}</p>
      {topic.tasks.length > 0 && (
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-400">İlerleme</span>
            <span className="text-xs font-medium text-slate-600">{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-1.5">
          {topic.researchers.slice(0, 4).map(tr => { const r = allResearchers.find(x => x.id === tr.researcherId); return r ? <Avatar key={r.id} name={r.name} color={r.color} size="xs" /> : null; })}
          {topic.researchers.length > 4 && <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-500">+{topic.researchers.length - 4}</div>}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          {topic.workLink && <span title="Çalışma Linki"><ExternalLink size={12} className="text-indigo-400" /></span>}
          {topic.tasks.length > 0 && <span className="flex items-center gap-0.5"><ListTodo size={12} />{topic.tasks.filter(t => t.status === "done").length}/{topic.tasks.length}</span>}
        </div>
      </div>
      {dragOver && (
        <div className="mt-2 pt-2 border-t border-dashed border-indigo-300 text-center">
          <p className="text-xs text-indigo-500 font-medium flex items-center justify-center gap-1"><UserPlus size={12} /> Araştırmacıyı bu konuya ekle</p>
        </div>
      )}
    </div>
  );
};

// ─── PROJECT CARD ─────────────────────────────────────────
const ProjectCard = ({ project, topics, allResearchers, onDrop, onClick, onCancelProject, isAdmin }) => {
  const [dragOver, setDragOver] = useState(false);
  const stCfg = statusConfig[project.status] || statusConfig.planning;
  const prCfg = priorityConfig[project.priority] || priorityConfig.medium;
  const projectTopics = topics.filter(t => project.topics.includes(t.id));
  const allTasks = [...(project.tasks || []), ...projectTopics.flatMap(t => t.tasks || [])];
  const progress = getProgress(allTasks);
  const projectResearchers = useMemo(() => {
    const ids = new Set();
    (project.researchers || []).forEach(r => ids.add(r.researcherId));
    projectTopics.forEach(t => t.researchers.forEach(r => ids.add(r.researcherId)));
    return allResearchers.filter(r => ids.has(r.id));
  }, [project.researchers, projectTopics, allResearchers]);
  const cardStyle = getCardStyle(project.status, project.endDate);
  const pBg = cardStyle ? `${cardStyle.bg} hover:shadow-md` : "bg-white hover:shadow-md";
  const pBorder = dragOver ? "border-emerald-400 bg-emerald-50 shadow-lg ring-2 ring-emerald-200" : cardStyle ? cardStyle.border : "border-slate-200 hover:border-emerald-200";

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(false); const type = e.dataTransfer.getData("type"); const id = e.dataTransfer.getData("id"); if (type === "topic") onDrop(project.id, id); }}
      onClick={() => onClick(project)}
      className={`rounded-xl border p-3 cursor-pointer transition-all duration-200 ${pBg} ${pBorder}`}
    >
      {cardStyle && (
        <div className={`flex items-center gap-1.5 mb-2 px-2 py-1 rounded-lg ${cardStyle.labelClass}`}>
          <span className="text-xs">{cardStyle.icon}</span>
          <span className="text-[11px] font-semibold uppercase tracking-wide">{cardStyle.label}</span>
        </div>
      )}
      <div className="flex items-start justify-between mb-2">
        <h3 className={`text-sm font-semibold flex-1 pr-2 ${project.status === "failed" ? "text-red-700" : project.status === "completed" ? "text-emerald-700" : "text-slate-800"}`}>{project.title}</h3>
        <FolderKanban size={16} className="text-slate-300 flex-shrink-0" />
      </div>
      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        <Badge className={stCfg.color}><span className={`w-1.5 h-1.5 rounded-full ${stCfg.dot} mr-1`} />{stCfg.label}</Badge>
        <Badge className={prCfg.color}>{prCfg.icon} {prCfg.label}</Badge>
        {project.fundingSource && <Badge className="bg-violet-50 text-violet-600">{project.fundingSource}</Badge>}
        {project.type && <Badge className="bg-sky-50 text-sky-600">{project.type}</Badge>}
      </div>
      <p className="text-xs text-slate-500 mb-3 line-clamp-2">{project.description}</p>
      {project.budget > 0 && <p className="text-xs text-slate-500 mb-2"><span className="font-medium text-slate-700">₺{project.budget.toLocaleString("tr-TR")}</span></p>}
      {allTasks.length > 0 && (
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1"><span className="text-xs text-slate-400">Genel İlerleme</span><span className="text-xs font-medium text-slate-600">{progress}%</span></div>
          <ProgressBar value={progress} />
        </div>
      )}
      {projectTopics.length > 0 && (
        <div className="mb-2"><div className="flex flex-wrap gap-1">
          {projectTopics.map(t => <Badge key={t.id} className="bg-blue-50 text-blue-600 text-xs"><BookOpen size={10} className="mr-0.5" />{t.title.slice(0, 20)}</Badge>)}
        </div></div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-1.5">
          {projectResearchers.slice(0, 4).map(r => <Avatar key={r.id} name={r.name} color={r.color} size="xs" />)}
          {projectResearchers.length > 4 && <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-500">+{projectResearchers.length - 4}</div>}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="flex items-center gap-0.5"><Layers size={12} />{projectTopics.length}</span>
          <span className="flex items-center gap-0.5"><Users size={12} />{projectResearchers.length}</span>
        </div>
      </div>
      {isAdmin && onCancelProject && (
        <div className="mt-2 pt-2 border-t border-slate-100">
          <button onClick={(e) => { e.stopPropagation(); onCancelProject(project.id); }}
            className="w-full text-center text-[11px] text-red-400 hover:text-red-600 hover:bg-red-50 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1">
            <Trash2 size={11} />Projeyi İptal Et
          </button>
        </div>
      )}
      {dragOver && (
        <div className="mt-2 pt-2 border-t border-dashed border-emerald-300 text-center">
          <p className="text-xs text-emerald-600 font-medium flex items-center justify-center gap-1"><BookOpen size={12} /> Konuyu bu projeye ekle</p>
        </div>
      )}
    </div>
  );
};

// ─── DETAIL MODAL (Topic & Project) ──────────────────────
const DetailModal = ({ item, type, allResearchers, topics, projects, isAdmin, onClose, onUpdate, onSelectResearcher, onSelectTopic, onRemoveFromProject, onCancelProject, onDeleteTopic }) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...item });
  const [showAddResearcher, setShowAddResearcher] = useState(false);
  const [addResearcherRole, setAddResearcherRole] = useState("member");
  const eff = (key, val) => setEditForm({ ...editForm, [key]: val });
  const eInputD = "w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300";
  const handleSaveEdit = () => {
    const cleaned = { ...editForm };
    if (cleaned.budget !== undefined) cleaned.budget = parseFloat(cleaned.budget) || 0;
    onUpdate({ ...item, ...cleaned }); setEditing(false);
  };
  const handleCancelEdit = () => { setEditForm({ ...item }); setEditing(false); };
  const stCfg = statusConfig[item.status] || statusConfig.proposed;
  const prCfg = priorityConfig[item.priority] || priorityConfig.medium;
  const isTopic = type === "topic";
  const isProject = type === "project";

  const itemResearchers = isTopic
    ? (item.researchers || []).map(tr => ({ ...allResearchers.find(r => r.id === tr.researcherId), role: tr.role })).filter(Boolean)
    : [];
  const projectTopics = isProject ? topics.filter(t => (item.topics || []).includes(t.id)) : [];
  const projectResearcherSet = isProject
    ? (() => { const map = new Map(); projectTopics.forEach(t => { (t.researchers || []).forEach(tr => { const r = allResearchers.find(x => x.id === tr.researcherId); if (r && !map.has(r.id)) map.set(r.id, { ...r, role: tr.role, topicTitle: t.title }); }); }); return Array.from(map.values()); })()
    : [];

  const handleAddTask = () => { if (!newTaskTitle.trim()) return; onUpdate({ ...item, tasks: [...(item.tasks || []), { id: `tk_${Date.now()}`, title: newTaskTitle.trim(), status: "todo", assignedTo: null }] }); setNewTaskTitle(""); };
  const handleTaskStatus = (taskId, newStatus) => { onUpdate({ ...item, tasks: (item.tasks || []).map(t => t.id === taskId ? { ...t, status: newStatus } : t) }); };
  const handleDeleteTask = (taskId) => { onUpdate({ ...item, tasks: (item.tasks || []).filter(t => t.id !== taskId) }); };
  const handleRemoveResearcher = (researcherId) => { onUpdate({ ...item, researchers: (item.researchers || []).filter(tr => tr.researcherId !== researcherId) }); };
  const progress = getProgress(item.tasks || []);

  const statusOptions = Object.keys(statusConfig || {});
  const priorityOptions = Object.keys(priorityConfig || {});

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[600px] md:max-h-[80vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {isTopic ? <BookOpen size={18} className="text-indigo-500" /> : <FolderKanban size={18} className="text-emerald-500" />}
                {editing
                  ? <input value={editForm.title} onChange={e => eff("title", e.target.value)} className={eInputD + " text-lg font-bold"} />
                  : <h2 className="text-lg font-bold text-slate-800">{item.title}</h2>}
              </div>
              {editing ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <select value={editForm.status} onChange={e => eff("status", e.target.value)} className="text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-200">
                    {statusOptions.map(s => <option key={s} value={s}>{statusConfig[s]?.label || s}</option>)}
                  </select>
                  <select value={editForm.priority} onChange={e => eff("priority", e.target.value)} className="text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-200">
                    {priorityOptions.map(p => <option key={p} value={p}>{priorityConfig[p]?.label || p}</option>)}
                  </select>
                  {isTopic && <select value={editForm.category || ""} onChange={e => eff("category", e.target.value)} className="text-xs border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-200">
                    <option value="">Kategori seçin</option>
                    {categoryOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>}
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={stCfg.color}><span className={`w-1.5 h-1.5 rounded-full ${stCfg.dot} mr-1`} />{stCfg.label}</Badge>
                  <Badge className={prCfg.color}>{prCfg.icon} {prCfg.label}</Badge>
                  {isTopic && item.category && <Badge className="bg-blue-50 text-blue-600">{item.category}</Badge>}
                  {isProject && item.fundingSource && <Badge className="bg-violet-50 text-violet-600">{item.fundingSource}</Badge>}
                </div>
              )}
              {isTopic && !editing && (() => {
                const projectedProject = (projects || []).find(p => (p.topics || []).includes(item.id));
                if (!projectedProject) return null;
                return (
                  <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-slate-100 rounded-lg border border-slate-200">
                    <FolderKanban size={14} className="text-violet-500" />
                    <span className="text-xs text-slate-600 font-medium">Proje: <span className="text-violet-600">{projectedProject.title}</span></span>
                    {isAdmin && onRemoveFromProject && (
                      <button onClick={() => { onRemoveFromProject(item.id); onClose(); }}
                        className="ml-auto px-2 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200">
                        <X size={12} className="inline mr-0.5" />Projelendirmeyi İptal Et
                      </button>
                    )}
                  </div>
                );
              })()}
            </div>
            <div className="flex items-center gap-1">
              {isAdmin && <button onClick={() => { if (editing) { handleCancelEdit(); } else { setEditForm({ ...item }); setEditing(true); } }}
                className={`p-1.5 rounded-lg transition-colors ${editing ? "bg-amber-100 text-amber-600 hover:bg-amber-200" : "hover:bg-slate-100 text-slate-400 hover:text-slate-600"}`}
                title={editing ? "Düzenlemeyi iptal et" : "Düzenle"}>
                <Pencil size={16} />
              </button>}
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Açıklama</h4>
            {editing
              ? <textarea value={editForm.description || ""} onChange={e => eff("description", e.target.value)} placeholder="Açıklama ekleyin..." className={eInputD + " h-20 resize-none"} />
              : <p className="text-sm text-slate-600">{item.description || <span className="italic text-slate-400">Belirtilmemiş</span>}</p>}
          </div>

          {/* Work Link */}
          {editing ? (
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Çalışma Linki</h4>
              <input value={editForm.workLink || ""} onChange={e => eff("workLink", e.target.value)} placeholder="https://..." className={eInputD} />
            </div>
          ) : item.workLink ? (
            <div className="bg-indigo-50 rounded-lg p-3 flex items-center gap-2">
              <ExternalLink size={16} className="text-indigo-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-indigo-400 mb-0.5">Çalışma Linki</p>
                <a href={item.workLink} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline truncate block">{item.workLink}</a>
              </div>
            </div>
          ) : null}

          {/* Editable detail fields */}
          {editing ? (
            <div className="grid grid-cols-2 gap-3">
              {isTopic && <>
                <div><label className="block text-xs font-medium text-slate-500 mb-1">Öngörülen Proje Türü</label>
                  <select value={editForm.projectType || ""} onChange={e => eff("projectType", e.target.value)} className={eInputD}>
                    <option value="">Seçiniz</option>
                    {projectTypeOptions.map(pt => <option key={pt} value={pt}>{pt}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-medium text-slate-500 mb-1">Proje Türü Detayı</label>
                  <input value={editForm.projectTypeDetail || ""} onChange={e => eff("projectTypeDetail", e.target.value)} placeholder="Detay..." className={eInputD} />
                </div>
                <div><label className="block text-xs font-medium text-slate-500 mb-1">Başvuru Durumu</label>
                  <input value={editForm.applicationStatus || ""} onChange={e => eff("applicationStatus", e.target.value)} className={eInputD} />
                </div>
                <div><label className="block text-xs font-medium text-slate-500 mb-1">Hedef Dergi</label>
                  <input value={editForm.targetJournal || ""} onChange={e => eff("targetJournal", e.target.value)} className={eInputD} />
                </div>
                <div><label className="block text-xs font-medium text-slate-500 mb-1">Başvuru Tarihi</label>
                  <input type="date" value={editForm.applicationDate || ""} onChange={e => eff("applicationDate", e.target.value)} className={eInputD} />
                </div>
              </>}
              {isProject && <>
                <div><label className="block text-xs font-medium text-slate-500 mb-1">Proje Türü</label>
                  <select value={editForm.type || ""} onChange={e => eff("type", e.target.value)} className={eInputD}>
                    <option value="">Seçiniz</option>
                    {projectTypeOptions.map(pt => <option key={pt} value={pt}>{pt}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-medium text-slate-500 mb-1">Proje Türü Detayı</label>
                  <input value={editForm.projectTypeDetail || ""} onChange={e => eff("projectTypeDetail", e.target.value)} placeholder="Detay..." className={eInputD} />
                </div>
                <div><label className="block text-xs font-medium text-slate-500 mb-1">Fon Kaynağı</label>
                  <input value={editForm.fundingSource || ""} onChange={e => eff("fundingSource", e.target.value)} className={eInputD} />
                </div>
                <div><label className="block text-xs font-medium text-slate-500 mb-1">Bütçe (₺)</label>
                  <input type="number" value={editForm.budget ?? ""} onChange={e => eff("budget", e.target.value)} className={eInputD} />
                </div>
              </>}
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Başlangıç Tarihi</label>
                <input type="date" value={editForm.startDate || ""} onChange={e => eff("startDate", e.target.value)} className={eInputD} />
              </div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Bitiş Tarihi</label>
                <input type="date" value={editForm.endDate || ""} onChange={e => eff("endDate", e.target.value)} className={eInputD} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {isTopic && item.projectType && <div className="bg-indigo-50 rounded-lg p-2.5"><p className="text-xs text-indigo-400 mb-0.5">Öngörülen Proje Türü</p><p className="text-sm font-medium text-indigo-700">{item.projectType}{item.projectTypeDetail ? ` — ${item.projectTypeDetail}` : ""}</p></div>}
              {isTopic && item.applicationStatus && <div className="bg-slate-50 rounded-lg p-2.5"><p className="text-xs text-slate-400 mb-0.5">Başvuru Durumu</p><p className="text-sm font-medium text-slate-700">{item.applicationStatus}</p></div>}
              {isTopic && item.targetJournal && <div className="bg-slate-50 rounded-lg p-2.5"><p className="text-xs text-slate-400 mb-0.5">Hedef Dergi</p><p className="text-sm font-medium text-slate-700">{item.targetJournal}</p></div>}
              {isTopic && item.applicationDate && <div className="bg-slate-50 rounded-lg p-2.5"><p className="text-xs text-slate-400 mb-0.5">Başvuru Tarihi</p><p className="text-sm font-medium text-slate-700">{new Date(item.applicationDate).toLocaleDateString("tr-TR")}</p></div>}
              {item.startDate && <div className="bg-slate-50 rounded-lg p-2.5"><p className="text-xs text-slate-400 mb-0.5">Çalışma Başlangıç</p><p className="text-sm font-medium text-slate-700">{new Date(item.startDate).toLocaleDateString("tr-TR")}</p></div>}
              {item.endDate && <div className="bg-slate-50 rounded-lg p-2.5"><p className="text-xs text-slate-400 mb-0.5">Çalışma Bitiş</p><p className="text-sm font-medium text-slate-700">{new Date(item.endDate).toLocaleDateString("tr-TR")}</p></div>}
              {isProject && item.budget > 0 && <div className="bg-slate-50 rounded-lg p-2.5"><p className="text-xs text-slate-400 mb-0.5">Bütçe</p><p className="text-sm font-medium text-slate-700">₺{item.budget.toLocaleString("tr-TR")}</p></div>}
              {isProject && item.type && <div className="bg-slate-50 rounded-lg p-2.5"><p className="text-xs text-slate-400 mb-0.5">Proje Türü</p><p className="text-sm font-medium text-slate-700">{item.type}{item.projectTypeDetail ? ` — ${item.projectTypeDetail}` : ""}</p></div>}
              {isProject && item.fundingSource && <div className="bg-slate-50 rounded-lg p-2.5"><p className="text-xs text-slate-400 mb-0.5">Fon Kaynağı</p><p className="text-sm font-medium text-slate-700">{item.fundingSource}</p></div>}
            </div>
          )}

          {/* Required Skills & Research Method (topic only) */}
          {isTopic && (editing ? (
            <div className="space-y-3">
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Gerekli Beceriler</label>
                <textarea value={editForm.requiredSkills || ""} onChange={e => eff("requiredSkills", e.target.value)} className={eInputD + " h-16 resize-none"} /></div>
              <div><label className="block text-xs font-medium text-slate-500 mb-1">Araştırma Yöntemi</label>
                <input value={editForm.researchMethod || ""} onChange={e => eff("researchMethod", e.target.value)} className={eInputD} /></div>
            </div>
          ) : (<>
            {item.requiredSkills && <div><h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Gerekli Beceriler</h4><p className="text-sm text-slate-600">{item.requiredSkills}</p></div>}
            {item.researchMethod && <div><h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Araştırma Yöntemi</h4><p className="text-sm text-slate-600">{item.researchMethod}</p></div>}
          </>))}

          {/* Save / Cancel buttons for edit mode */}
          {editing && (
            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button onClick={handleSaveEdit} className="flex-1 px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors">Kaydet</button>
              <button onClick={handleCancelEdit} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">İptal</button>
            </div>
          )}

          {(item.tasks || []).length > 0 && <div><div className="flex items-center justify-between mb-2"><h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">İlerleme</h4><span className="text-sm font-bold" style={{ color: progress === 100 ? "#10b981" : "#6366f1" }}>{progress}%</span></div><ProgressBar value={progress} className="h-2" /></div>}

          {isTopic && <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ekip ({itemResearchers.length})</h4>
              {isAdmin && <button onClick={() => setShowAddResearcher(!showAddResearcher)}
                className={`p-1 rounded-lg transition-colors ${showAddResearcher ? "bg-indigo-100 text-indigo-600" : "hover:bg-slate-100 text-slate-400"}`}
                title="Araştırmacı Ekle"><UserPlus size={14} /></button>}
            </div>
            {showAddResearcher && isAdmin && (
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-3 mb-3 space-y-2 animate-slide-up">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-indigo-600">Araştırmacı Ekle</p>
                  <select value={addResearcherRole} onChange={e => setAddResearcherRole(e.target.value)} className="text-[10px] border border-slate-200 rounded px-1.5 py-0.5 bg-white">
                    {Object.entries(roleConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {allResearchers.filter(r => !(item.researchers || []).some(tr => tr.researcherId === r.id)).map(r => (
                    <button key={r.id} onClick={() => {
                      onUpdate({ ...item, researchers: [...(item.researchers || []), { researcherId: r.id, role: addResearcherRole }] });
                      setShowAddResearcher(false);
                    }} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white transition-colors text-left">
                      <Avatar name={r.name} color={r.color} size="xs" />
                      <span className="text-xs text-slate-700 truncate">{r.title ? `${r.title} ` : ""}{r.name}</span>
                    </button>
                  ))}
                  {allResearchers.filter(r => !(item.researchers || []).some(tr => tr.researcherId === r.id)).length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-2">Tüm araştırmacılar zaten eklenmiş</p>
                  )}
                </div>
              </div>
            )}
            {itemResearchers.length === 0 ? <p className="text-sm text-slate-400 italic">Henüz araştırmacı atanmadı. Yukarıdaki + butonundan ekleyin veya araştırmacı kartını sürükleyin.</p> : (
              <div className="space-y-2">{itemResearchers.map(r => {
                const trEntry = (item.researchers || []).find(tr => tr.researcherId === r.id);
                const failed = trEntry?.failed;
                const roleKeys = Object.keys(roleConfig);
                const currentRoleIdx = roleKeys.indexOf(r.role);
                const cycleRole = () => {
                  const nextRole = roleKeys[(currentRoleIdx + 1) % roleKeys.length];
                  const newResearchers = (item.researchers || []).map(tr => tr.researcherId === r.id ? { ...tr, role: nextRole } : tr);
                  onUpdate({ ...item, researchers: newResearchers });
                };
                return (
                <div key={r.id} className={`flex items-center gap-2 p-2 rounded-lg group ${failed ? "bg-red-50 border border-red-200" : "bg-slate-50"}`}>
                  <Avatar name={r.name} color={r.color} size="sm" />
                  <div className="flex-1 min-w-0">
                    <button onClick={(e) => { e.stopPropagation(); if (onSelectResearcher) onSelectResearcher(allResearchers.find(x => x.id === r.id)); }}
                      className="text-sm font-medium text-slate-700 hover:text-indigo-600 hover:underline text-left truncate block">
                      {r.title} {r.name}
                    </button>
                    <p className="text-xs text-slate-400 truncate">{r.unit || r.institution}</p>
                  </div>
                  <button onClick={cycleRole} title="Rolü değiştirmek için tıklayın"
                    className="cursor-pointer hover:opacity-80 transition-opacity">
                    <Badge className={roleConfig[r.role]?.color || "bg-slate-100 text-slate-600"}>{roleConfig[r.role]?.label || r.role}</Badge>
                  </button>
                  <button onClick={() => {
                    const newResearchers = (item.researchers || []).map(tr => tr.researcherId === r.id ? { ...tr, failed: !tr.failed } : tr);
                    onUpdate({ ...item, researchers: newResearchers });
                  }} className={`p-1 rounded text-xs font-medium transition-colors flex-shrink-0 ${failed ? "bg-red-100 text-red-600 hover:bg-red-200" : "bg-slate-100 text-slate-400 hover:bg-amber-100 hover:text-amber-600"}`}
                    title={failed ? "Görevi yerine getirmedi (işareti kaldır)" : "Görevi yerine getirmedi olarak işaretle"}>
                    <AlertTriangle size={14} />
                  </button>
                  <button onClick={() => handleRemoveResearcher(r.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 p-1 flex-shrink-0"><X size={14} /></button>
                </div>
                );
              })}</div>
            )}
          </div>}

          {isProject && <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Proje Ekibi ({(item.researchers || []).length})</h4>
              {isAdmin && <button onClick={() => setShowAddResearcher(!showAddResearcher)}
                className={`p-1 rounded-lg transition-colors ${showAddResearcher ? "bg-indigo-100 text-indigo-600" : "hover:bg-slate-100 text-slate-400"}`}
                title="Araştırmacı Ekle"><UserPlus size={14} /></button>}
            </div>
            {showAddResearcher && isAdmin && (
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-3 mb-3 space-y-2 animate-slide-up">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-indigo-600">Projeye Araştırmacı Ekle</p>
                  <select value={addResearcherRole} onChange={e => setAddResearcherRole(e.target.value)} className="text-[10px] border border-slate-200 rounded px-1.5 py-0.5 bg-white">
                    {Object.entries(roleConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {allResearchers.filter(r => !(item.researchers || []).some(tr => tr.researcherId === r.id)).map(r => (
                    <button key={r.id} onClick={() => {
                      onUpdate({ ...item, researchers: [...(item.researchers || []), { researcherId: r.id, role: addResearcherRole }] });
                      setShowAddResearcher(false);
                    }} className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white transition-colors text-left">
                      <Avatar name={r.name} color={r.color} size="xs" />
                      <span className="text-xs text-slate-700 truncate">{r.title ? `${r.title} ` : ""}{r.name}</span>
                    </button>
                  ))}
                  {allResearchers.filter(r => !(item.researchers || []).some(tr => tr.researcherId === r.id)).length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-2">Tüm araştırmacılar zaten eklenmiş</p>
                  )}
                </div>
              </div>
            )}
            {(item.researchers || []).length === 0 ? <p className="text-sm text-slate-400 italic">Henüz araştırmacı atanmadı. Yukarıdaki + butonundan ekleyin.</p> : (
              <div className="space-y-2">{(item.researchers || []).map(tr => {
                const r = allResearchers.find(x => x.id === tr.researcherId);
                if (!r) return null;
                const roleKeys = Object.keys(roleConfig);
                const currentRoleIdx = roleKeys.indexOf(tr.role);
                const cycleRole = () => {
                  const nextRole = roleKeys[(currentRoleIdx + 1) % roleKeys.length];
                  const newResearchers = (item.researchers || []).map(x => x.researcherId === tr.researcherId ? { ...x, role: nextRole } : x);
                  onUpdate({ ...item, researchers: newResearchers });
                };
                return (
                <div key={r.id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 group">
                  <Avatar name={r.name} color={r.color} size="sm" />
                  <div className="flex-1 min-w-0">
                    <button onClick={(e) => { e.stopPropagation(); if (onSelectResearcher) onSelectResearcher(r); }}
                      className="text-sm font-medium text-slate-700 hover:text-indigo-600 hover:underline text-left truncate block">
                      {r.title ? `${r.title} ` : ""}{r.name}
                    </button>
                    <p className="text-xs text-slate-400 truncate">{r.unit || r.institution}</p>
                  </div>
                  <button onClick={cycleRole} title="Rolü değiştirmek için tıklayın"
                    className="cursor-pointer hover:opacity-80 transition-opacity">
                    <Badge className={roleConfig[tr.role]?.color || "bg-slate-100 text-slate-600"}>{roleConfig[tr.role]?.label || tr.role}</Badge>
                  </button>
                  {isAdmin && <button onClick={() => {
                    const newResearchers = (item.researchers || []).filter(x => x.researcherId !== tr.researcherId);
                    onUpdate({ ...item, researchers: newResearchers });
                  }} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400 p-1 flex-shrink-0"><X size={14} /></button>}
                </div>
                );
              }).filter(Boolean)}</div>
            )}
            {projectResearcherSet.length > 0 && (item.researchers || []).length > 0 && (() => {
              const directIds = new Set((item.researchers || []).map(r => r.researcherId));
              const fromTopicsOnly = projectResearcherSet.filter(r => !directIds.has(r.id));
              if (fromTopicsOnly.length === 0) return null;
              return (
                <div className="mt-3 pt-2 border-t border-slate-100">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1.5">Konulardan Gelen ({fromTopicsOnly.length})</p>
                  <div className="space-y-1">{fromTopicsOnly.map(r => (
                    <div key={r.id} className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50/50">
                      <Avatar name={r.name} color={r.color} size="xs" />
                      <span className="text-xs text-slate-500 truncate flex-1">{r.name}</span>
                      <span className="text-[10px] text-slate-400">{r.topicTitle}</span>
                      <Badge className={`${roleConfig[r.role]?.color || "bg-slate-100"} text-[10px]`}>{roleConfig[r.role]?.label || r.role}</Badge>
                    </div>
                  ))}</div>
                </div>
              );
            })()}
          </div>}

          {isProject && <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Bağlı Konular ({projectTopics.length})</h4>
            {projectTopics.length === 0 ? <p className="text-sm text-slate-400 italic">Henüz konu eklenmedi. Konu kartını bu projeye sürükleyin.</p> : (
              <div className="space-y-1.5">{projectTopics.map(t => (
                <button key={t.id} onClick={() => { if (onSelectTopic) onSelectTopic(t); }}
                  className="w-full flex items-center gap-2 p-2 rounded-lg bg-blue-50 hover:ring-2 hover:ring-indigo-200 transition-all text-left group">
                  <BookOpen size={14} className="text-blue-500" />
                  <span className="text-sm text-blue-700 font-medium flex-1 truncate group-hover:text-indigo-600">{t.title}</span>
                  <Badge className={statusConfig[t.status]?.color || ""}>{statusConfig[t.status]?.label}</Badge>
                  <ExternalLink size={12} className="text-slate-300 group-hover:text-indigo-400 flex-shrink-0" />
                </button>
              ))}</div>
            )}
          </div>}

          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Görevler ({(item.tasks || []).length})</h4>
            <div className="space-y-0.5 mb-3">
              {(item.tasks || []).map(task => <TaskItem key={task.id} task={task} researchers={allResearchers} onStatusChange={handleTaskStatus} onDelete={handleDeleteTask} />)}
            </div>
            {isAdmin && <div className="flex gap-2">
              <input value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAddTask()}
                placeholder="Yeni görev ekle..." className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300" />
              <button onClick={handleAddTask} className="px-3 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"><Plus size={16} /></button>
            </div>}
          </div>
          {isTopic && item.tags?.length > 0 && <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Etiketler</h4>
            <div className="flex flex-wrap gap-1.5">{item.tags.map(tag => <Badge key={tag} className="bg-slate-100 text-slate-600">#{tag}</Badge>)}</div>
          </div>}
          {isProject && isAdmin && onCancelProject && (
            <div className="pt-3 mt-3 border-t border-red-100">
              <button onClick={() => onCancelProject(item.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 transition-colors">
                <Trash2 size={14} />Projeyi İptal Et
              </button>
              <p className="text-[10px] text-slate-400 text-center mt-1.5">Proje silinir, bağlı konular projelendirilmemiş olarak kalır.</p>
            </div>
          )}
          {isTopic && isAdmin && onDeleteTopic && (
            <div className="pt-3 mt-3 border-t border-red-100">
              <button onClick={() => onDeleteTopic(item.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 transition-colors">
                <Trash2 size={14} />Konuyu Sil
              </button>
              <p className="text-[10px] text-slate-400 text-center mt-1.5">Konu kalıcı olarak silinir. Projelendirilmişse ilgili proje de etkilenir.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ─── ADD ITEM MODAL (expanded researcher form) ───────────
const AddItemModal = ({ type, onAdd, onClose, allTopics }) => {
  const [form, setForm] = useState({
    title: "", description: "", status: type === "project" ? "planning" : "proposed",
    priority: "medium", category: "", applicationDate: "", startDate: "", endDate: "",
    budget: "", fundingSource: "", projectType: "", projectTypeDetail: "", workLink: "",
    // researcher
    name: "", rTitle: "", institution: "", unit: "",
    eduUniversity: "", eduProgram: "", eduDegree: "Yüksek Lisans", eduStatus: "Devam Ediyor",
    languages: "", researchAreas: "", tools: "",
    hasPIExperience: false, url: "", phone: "", email: "", bio: "", performanceNotes: "",
  });
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [topicError, setTopicError] = useState("");
  const [activeTab, setActiveTab] = useState("basic");

  const isR = type === "researcher";
  const isT = type === "topic";
  const isP = type === "project";
  const f = (key, val) => setForm({ ...form, [key]: val });
  const inputClass = "w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300";
  const labelClass = "block text-xs font-medium text-slate-500 mb-1";

  const handleSubmit = () => {
    if (isR) {
      if (!form.name.trim()) return;
      onAdd({
        id: `r_${Date.now()}`, name: form.name, title: form.rTitle,
        institution: form.institution, unit: form.unit,
        eduUniversity: form.eduUniversity, eduProgram: form.eduProgram,
        eduDegree: form.eduDegree, eduStatus: form.eduStatus,
        languages: form.languages.split(",").map(s => s.trim()).filter(Boolean),
        researchAreas: form.researchAreas.split(",").map(s => s.trim()).filter(Boolean),
        tools: form.tools.split(",").map(s => s.trim()).filter(Boolean),
        hasPIExperience: form.hasPIExperience,
        url: form.url, phone: form.phone, email: form.email,
        bio: form.bio, performanceNotes: form.performanceNotes,
        color: `hsl(${Math.random() * 360}, 55%, 55%)`,
      });
    } else if (isT) {
      if (!form.title.trim()) return;
      onAdd({ id: `t_${Date.now()}`, title: form.title, description: form.description, category: form.category, status: form.status, priority: form.priority, projectType: form.projectType, projectTypeDetail: form.projectTypeDetail, applicationDate: form.applicationDate, startDate: form.startDate, endDate: form.endDate, workLink: form.workLink, tags: [], researchers: [], tasks: [] });
    } else {
      if (!form.title.trim()) return;
      if (selectedTopics.length === 0) { setTopicError("Bir proje en az bir konuyla ilişkilendirilmelidir!"); return; }
      onAdd({ id: `p_${Date.now()}`, title: form.title, description: form.description, type: form.projectType, projectTypeDetail: form.projectTypeDetail, status: form.status, priority: form.priority, startDate: form.startDate, endDate: form.endDate, budget: parseFloat(form.budget) || 0, fundingSource: form.fundingSource, workLink: form.workLink, topics: selectedTopics, tasks: [], researchers: [] });
    }
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
        md:w-[520px] md:max-h-[85vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">
            {isR ? "Yeni Araştırmacı" : isT ? "Yeni Konu" : "Yeni Proje"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X size={18} /></button>
        </div>

        {/* Tabs for researcher form */}
        {isR && (
          <div className="flex border-b border-slate-100 px-5 gap-1">
            {[
              { key: "basic", label: "Temel Bilgiler", icon: Users },
              { key: "education", label: "Öğrenim", icon: GraduationCap },
              { key: "skills", label: "Yetkinlikler", icon: Wrench },
              { key: "contact", label: "İletişim", icon: Mail },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === tab.key ? "border-indigo-500 text-indigo-600" : "border-transparent text-slate-400 hover:text-slate-600"
                }`}>
                <tab.icon size={13} />{tab.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {isR ? (
            <>
              {activeTab === "basic" && <>
                <div><label className={labelClass}>Adı Soyadı *</label><input value={form.name} onChange={e => f("name", e.target.value)} className={inputClass} placeholder="Adı Soyadı" /></div>
                <div><label className={labelClass}>Unvan</label>
                  <select value={form.rTitle} onChange={e => f("rTitle", e.target.value)} className={inputClass}>
                    <option value="">Seçiniz</option>
                    <option value="Prof. Dr.">Prof. Dr.</option>
                    <option value="Doç. Dr.">Doç. Dr.</option>
                    <option value="Dr. Öğr. Üyesi">Dr. Öğr. Üyesi</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Araş. Gör. Dr.">Araş. Gör. Dr.</option>
                    <option value="Araş. Gör.">Araş. Gör.</option>
                    <option value="Öğr. Gör.">Öğr. Gör.</option>
                    <option value="Uzman">Uzman</option>
                  </select>
                </div>
                <div><label className={labelClass}>Çalıştığı Kurum</label><input value={form.institution} onChange={e => f("institution", e.target.value)} className={inputClass} placeholder="Üniversite veya kurum adı" /></div>
                <div><label className={labelClass}>Birimi</label><input value={form.unit} onChange={e => f("unit", e.target.value)} className={inputClass} placeholder="Bölüm / Birim / Anabilim Dalı" /></div>
                <div><label className={labelClass}>Açıklama</label><textarea value={form.bio} onChange={e => f("bio", e.target.value)} className={`${inputClass} h-16 resize-none`} placeholder="Kısa biyografi..." /></div>
              </>}
              {activeTab === "education" && <>
                <div><label className={labelClass}>Öğrenim Gördüğü Üniversite</label><input value={form.eduUniversity} onChange={e => f("eduUniversity", e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>Öğrenim Gördüğü Program</label><input value={form.eduProgram} onChange={e => f("eduProgram", e.target.value)} className={inputClass} /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className={labelClass}>Öğrenim Derecesi</label>
                    <select value={form.eduDegree} onChange={e => f("eduDegree", e.target.value)} className={inputClass}>
                      {eduDegreeOptions.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div><label className={labelClass}>Öğrenim Durumu</label>
                    <select value={form.eduStatus} onChange={e => f("eduStatus", e.target.value)} className={inputClass}>
                      {eduStatusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div><label className={labelClass}>Yabancı Diller (virgülle ayırın)</label><input value={form.languages} onChange={e => f("languages", e.target.value)} className={inputClass} placeholder="İngilizce (C1), Almanca (B1)" /></div>
                <div className="flex items-center gap-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.hasPIExperience} onChange={e => f("hasPIExperience", e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-200" />
                    <span className="text-sm text-slate-700">Daha önce Proje Yürütücülüğü yaptı</span>
                  </label>
                </div>
              </>}
              {activeTab === "skills" && <>
                <div><label className={labelClass}>Çalışma Alanları (virgülle ayırın)</label><input value={form.researchAreas} onChange={e => f("researchAreas", e.target.value)} className={inputClass} placeholder="Yapay Zeka, NLP, Veri Bilimi" /></div>
                <div><label className={labelClass}>Kullanabildiği Araçlar (virgülle ayırın)</label><input value={form.tools} onChange={e => f("tools", e.target.value)} className={inputClass} placeholder="Python, MATLAB, LaTeX, SPSS" /></div>
                <div><label className={labelClass}>Performans Takip Notları</label><textarea value={form.performanceNotes} onChange={e => f("performanceNotes", e.target.value)} className={`${inputClass} h-20 resize-none`} placeholder="Notlar..." /></div>
              </>}
              {activeTab === "contact" && <>
                <div><label className={labelClass}>E-posta</label><input type="email" value={form.email} onChange={e => f("email", e.target.value)} className={inputClass} placeholder="ad@kurum.edu.tr" /></div>
                <div><label className={labelClass}>Telefon</label><input value={form.phone} onChange={e => f("phone", e.target.value)} className={inputClass} placeholder="+90 5XX XXX XXXX" /></div>
                <div><label className={labelClass}>URL (Google Scholar, ORCID, vb.)</label><input value={form.url} onChange={e => f("url", e.target.value)} className={inputClass} placeholder="https://..." /></div>
              </>}
            </>
          ) : (
            <>
              <div><label className={labelClass}>Başlık *</label><input value={form.title} onChange={e => f("title", e.target.value)} className={inputClass} /></div>
              <div><label className={labelClass}>Açıklama</label><textarea value={form.description} onChange={e => f("description", e.target.value)} className={`${inputClass} h-20 resize-none`} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>Durum</label>
                  <select value={form.status} onChange={e => f("status", e.target.value)} className={inputClass}>
                    {isT ? <><option value="proposed">Önerilen</option><option value="active">Aktif</option><option value="completed">Tamamlandı</option><option value="failed">Tamamlanamadı</option></>
                      : <><option value="planning">İşlem Yapılıyor</option><option value="active">Aktif</option><option value="review">İnceleme</option><option value="completed">Tamamlandı</option><option value="failed">Tamamlanamadı</option></>}
                  </select>
                </div>
                <div><label className={labelClass}>Öncelik</label>
                  <select value={form.priority} onChange={e => f("priority", e.target.value)} className={inputClass}>
                    <option value="low">Düşük</option><option value="medium">Orta</option><option value="high">Yüksek</option><option value="critical">Kritik</option>
                  </select>
                </div>
              </div>
              {isT && <div><label className={labelClass}>Kategori</label><input value={form.category} onChange={e => f("category", e.target.value)} className={inputClass} placeholder="Ar-Ge İçi, Ortak Çalışma..." /></div>}
              {/* Proje Türü + Detay (hem konu hem proje için) */}
              <div>
                <label className={labelClass}>{isT ? "Öngörülen Proje Türü" : "Proje Türü"}</label>
                <select value={form.projectType || ""} onChange={e => f("projectType", e.target.value)} className={inputClass}>
                  <option value="">Seçiniz</option>
                  {projectTypeOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Proje Türü Detayı</label>
                <input value={form.projectTypeDetail || ""} onChange={e => f("projectTypeDetail", e.target.value)} className={inputClass} placeholder="Örn: KA220-HED, TÜBİTAK 1001, AÜ Yayın..." />
              </div>
              {isP && <>
                {/* Konu Seçimi - Zorunlu */}
                <div>
                  <label className={labelClass}>İlişkili Konular *</label>
                  <div className="border border-slate-200 rounded-lg p-2 max-h-36 overflow-y-auto bg-slate-50 space-y-1">
                    {(allTopics || []).length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-2">Henüz konu bulunmuyor</p>
                    ) : (allTopics || []).map(t => (
                      <label key={t.id} className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${selectedTopics.includes(t.id) ? "bg-indigo-50 border border-indigo-200" : "hover:bg-white"}`}>
                        <input type="checkbox" checked={selectedTopics.includes(t.id)} onChange={(e) => {
                          if (e.target.checked) setSelectedTopics(prev => [...prev, t.id]);
                          else setSelectedTopics(prev => prev.filter(id => id !== t.id));
                          setTopicError("");
                        }} className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-500 focus:ring-indigo-200" />
                        <span className="text-xs text-slate-700 truncate flex-1">{t.title}</span>
                        <Badge className={statusConfig[t.status]?.color || "bg-slate-100 text-slate-500"}>{statusConfig[t.status]?.label || t.status}</Badge>
                      </label>
                    ))}
                  </div>
                  {topicError && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={12} />{topicError}</p>}
                  <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 flex items-start gap-2">
                    <AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-[11px] text-amber-700">Yeni eklenen bir projenin, en az bir konuyla ilişkilendirilmesi gerekmektedir.</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className={labelClass}>Fon Kaynağı</label><input value={form.fundingSource} onChange={e => f("fundingSource", e.target.value)} className={inputClass} placeholder="TÜBİTAK 1001, Horizon..." /></div>
                  <div><label className={labelClass}>Bütçe (₺)</label><input value={form.budget} onChange={e => f("budget", e.target.value)} className={inputClass} type="number" /></div>
                </div>
              </>}
              {isT && <div><label className={labelClass}>Başvuru Tarihi</label><input type="date" value={form.applicationDate} onChange={e => f("applicationDate", e.target.value)} className={inputClass} /></div>}
              <div className="grid grid-cols-2 gap-3">
                <div><label className={labelClass}>Çalışma Başlangıç</label><input type="date" value={form.startDate} onChange={e => f("startDate", e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>Çalışma Bitiş</label><input type="date" value={form.endDate} onChange={e => f("endDate", e.target.value)} className={inputClass} /></div>
              </div>
              <div><label className={labelClass}>Çalışma Linki (Drive, URL)</label><input value={form.workLink} onChange={e => f("workLink", e.target.value)} className={inputClass} placeholder="https://drive.google.com/..." /></div>
            </>
          )}
        </div>
        <div className="p-5 border-t border-slate-100 flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">İptal</button>
          <button onClick={handleSubmit} className="px-4 py-2 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 font-medium">Ekle</button>
        </div>
      </div>
    </>
  );
};

// ─── SETTINGS MODAL ──────────────────────────────────────
const SettingsModal = ({
  roleConfig, onRoleConfigChange,
  statusConfig, onStatusConfigChange,
  priorityConfig, onPriorityConfigChange,
  projectTypeOptions, onProjectTypeOptionsChange,
  categoryOptions, onCategoryOptionsChange,
  eduDegreeOptions, onEduDegreeOptionsChange,
  eduStatusOptions, onEduStatusOptionsChange,
  onResetDefaults, onClose,
  onExportData, onImportData, onResetAllData
}) => {
  const [activeTab, setActiveTab] = useState("roles");
  const fileInputRef = useRef(null);
  const tabs = [
    { key: "roles", label: "Roller", icon: UserCheck },
    { key: "projectTypes", label: "Proje Türleri", icon: FolderKanban },
    { key: "statuses", label: "Durum", icon: Activity },
    { key: "priorities", label: "Öncelik", icon: Target },
    { key: "categories", label: "Kategoriler", icon: Tag },
    { key: "education", label: "Eğitim", icon: GraduationCap },
    { key: "data", label: "Veri", icon: DatabaseBackup },
  ];

  const PALETTE = [
    { value: "bg-indigo-100 text-indigo-700", label: "İndigo", preview: "bg-indigo-100" },
    { value: "bg-rose-100 text-rose-700", label: "Gül", preview: "bg-rose-100" },
    { value: "bg-orange-100 text-orange-700", label: "Turuncu", preview: "bg-orange-100" },
    { value: "bg-emerald-100 text-emerald-700", label: "Yeşil", preview: "bg-emerald-100" },
    { value: "bg-purple-100 text-purple-700", label: "Mor", preview: "bg-purple-100" },
    { value: "bg-cyan-100 text-cyan-700", label: "Camgöbeği", preview: "bg-cyan-100" },
    { value: "bg-amber-100 text-amber-700", label: "Amber", preview: "bg-amber-100" },
    { value: "bg-pink-100 text-pink-700", label: "Pembe", preview: "bg-pink-100" },
    { value: "bg-blue-100 text-blue-700", label: "Mavi", preview: "bg-blue-100" },
    { value: "bg-teal-100 text-teal-700", label: "Teal", preview: "bg-teal-100" },
    { value: "bg-red-100 text-red-700", label: "Kırmızı", preview: "bg-red-100" },
    { value: "bg-slate-100 text-slate-700", label: "Gri", preview: "bg-slate-100" },
    { value: "bg-red-200 text-red-800", label: "Koyu Kırmızı", preview: "bg-red-200" },
    { value: "bg-gray-100 text-gray-500", label: "Soluk", preview: "bg-gray-100" },
  ];

  // ── Roles Tab ──
  const RolesTab = () => {
    const [editKey, setEditKey] = useState(null);
    const [editForm, setEditForm] = useState({ label: "", color: "", weight: 1 });
    const [newForm, setNewForm] = useState({ key: "", label: "", color: "bg-indigo-100 text-indigo-700", weight: 1 });
    const [showNew, setShowNew] = useState(false);

    const startEdit = (key, cfg) => { setEditKey(key); setEditForm({ label: cfg.label, color: cfg.color, weight: cfg.weight || 1 }); };
    const saveEdit = () => {
      if (!editForm.label.trim()) return;
      onRoleConfigChange(prev => {
        const updated = { ...prev };
        updated[editKey] = { ...updated[editKey], label: editForm.label.trim(), color: editForm.color, weight: Number(editForm.weight) || 1 };
        return updated;
      });
      setEditKey(null);
    };
    const deleteRole = (key) => {
      if (Object.keys(roleConfig).length <= 1) return;
      if (!confirm(`"${roleConfig[key].label}" rolünü silmek istediğinize emin misiniz?`)) return;
      onRoleConfigChange(prev => { const updated = { ...prev }; delete updated[key]; return updated; });
    };
    const addRole = () => {
      const key = newForm.key.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
      if (!key || !newForm.label.trim() || roleConfig[key]) return;
      onRoleConfigChange(prev => ({ ...prev, [key]: { label: newForm.label.trim(), color: newForm.color, weight: Number(newForm.weight) || 1 } }));
      setNewForm({ key: "", label: "", color: "bg-indigo-100 text-indigo-700", weight: 1 });
      setShowNew(false);
    };
    const moveRole = (key, dir) => {
      const keys = Object.keys(roleConfig);
      const idx = keys.indexOf(key);
      if ((dir === -1 && idx === 0) || (dir === 1 && idx === keys.length - 1)) return;
      const newKeys = [...keys];
      [newKeys[idx], newKeys[idx + dir]] = [newKeys[idx + dir], newKeys[idx]];
      const reordered = {};
      newKeys.forEach(k => { reordered[k] = roleConfig[k]; });
      onRoleConfigChange(reordered);
    };

    return (
      <div className="space-y-3">
        <p className="text-xs text-slate-500 mb-3">Araştırmacılara atanabilecek rolleri yönetin. Ağırlık değeri Leaderboard puan hesabında kullanılır.</p>
        {Object.entries(roleConfig).map(([key, cfg], idx) => (
          <div key={key} className="border border-slate-200 rounded-xl p-3 bg-white">
            {editKey === key ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input value={editForm.label} onChange={e => setEditForm({ ...editForm, label: e.target.value })} className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="Rol adı" />
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-400">×</span>
                    <input type="number" value={editForm.weight} onChange={e => setEditForm({ ...editForm, weight: e.target.value })} className="w-14 text-sm border border-slate-200 rounded-lg px-2 py-1.5 text-center focus:ring-2 focus:ring-indigo-200 outline-none" min="0" max="100" />
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {PALETTE.map(c => (
                    <button key={c.value} onClick={() => setEditForm({ ...editForm, color: c.value })}
                      className={`h-8 rounded-lg border-2 transition-all flex items-center justify-center ${c.preview} ${editForm.color === c.value ? "border-indigo-500 ring-1 ring-indigo-200" : "border-transparent hover:border-slate-300"}`}>
                      {editForm.color === c.value && <Check size={12} />}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setEditKey(null)} className="px-3 py-1.5 text-xs text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200">İptal</button>
                  <button onClick={saveEdit} className="px-3 py-1.5 text-xs text-white bg-indigo-500 rounded-lg hover:bg-indigo-600">Kaydet</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => moveRole(key, -1)} disabled={idx === 0} className="text-slate-300 hover:text-slate-500 disabled:opacity-30"><ChevronLeft size={12} className="rotate-90" /></button>
                  <button onClick={() => moveRole(key, 1)} disabled={idx === Object.keys(roleConfig).length - 1} className="text-slate-300 hover:text-slate-500 disabled:opacity-30"><ChevronRight size={12} className="rotate-90" /></button>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                <span className="text-xs text-slate-400 font-mono">×{cfg.weight || 1}</span>
                <span className="text-[10px] text-slate-300 ml-auto">{key}</span>
                <button onClick={() => startEdit(key, cfg)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><Edit3 size={13} /></button>
                <button onClick={() => deleteRole(key)} disabled={Object.keys(roleConfig).length <= 1} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 disabled:opacity-30"><Trash2 size={13} /></button>
              </div>
            )}
          </div>
        ))}
        {showNew ? (
          <div className="border border-dashed border-indigo-300 rounded-xl p-3 bg-indigo-50/30 space-y-3">
            <div className="flex gap-2">
              <input value={newForm.key} onChange={e => setNewForm({ ...newForm, key: e.target.value })} className="w-28 text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white outline-none" placeholder="anahtar (ör: intern)" />
              <input value={newForm.label} onChange={e => setNewForm({ ...newForm, label: e.target.value })} className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white outline-none" placeholder="Görünen ad" />
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-400">×</span>
                <input type="number" value={newForm.weight} onChange={e => setNewForm({ ...newForm, weight: e.target.value })} className="w-14 text-sm border border-slate-200 rounded-lg px-2 py-1.5 text-center bg-white outline-none" min="0" max="100" />
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {PALETTE.map(c => (
                <button key={c.value} onClick={() => setNewForm({ ...newForm, color: c.value })}
                  className={`h-8 rounded-lg border-2 transition-all flex items-center justify-center ${c.preview} ${newForm.color === c.value ? "border-indigo-500 ring-1 ring-indigo-200" : "border-transparent hover:border-slate-300"}`}>
                  {newForm.color === c.value && <Check size={12} />}
                </button>
              ))}
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowNew(false)} className="px-3 py-1.5 text-xs text-slate-500 bg-white border border-slate-200 rounded-lg">İptal</button>
              <button onClick={addRole} disabled={!newForm.key.trim() || !newForm.label.trim()} className="px-3 py-1.5 text-xs text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 disabled:opacity-50">Ekle</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowNew(true)} className="w-full py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-xs font-medium text-slate-400 hover:text-indigo-500 hover:border-indigo-300 transition-colors flex items-center justify-center gap-1.5"><Plus size={14} />Yeni Rol Ekle</button>
        )}
      </div>
    );
  };

  // ── Generic List Settings Tab ──
  const ListTab = ({ items, onChange, itemLabel, placeholder }) => {
    const [editIdx, setEditIdx] = useState(null);
    const [editVal, setEditVal] = useState("");
    const [newVal, setNewVal] = useState("");

    const save = () => { if (!editVal.trim()) return; const upd = [...items]; upd[editIdx] = editVal.trim(); onChange(upd); setEditIdx(null); };
    const remove = (idx) => { if (items.length <= 1) return; if (!confirm(`"${items[idx]}" silinsin mi?`)) return; onChange(items.filter((_, i) => i !== idx)); };
    const add = () => { if (!newVal.trim() || items.includes(newVal.trim())) return; onChange([...items, newVal.trim()]); setNewVal(""); };
    const move = (idx, dir) => { const arr = [...items]; [arr[idx], arr[idx + dir]] = [arr[idx + dir], arr[idx]]; onChange(arr); };

    return (
      <div className="space-y-2">
        <p className="text-xs text-slate-500 mb-3">{itemLabel} listesini düzenleyin. Sıralamayı değiştirmek için ok tuşlarını kullanın.</p>
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 bg-white">
            {editIdx === idx ? (
              <>
                <input value={editVal} onChange={e => setEditVal(e.target.value)} className="flex-1 text-sm border border-slate-200 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-indigo-200" autoFocus onKeyDown={e => e.key === "Enter" && save()} />
                <button onClick={save} className="text-xs text-white bg-indigo-500 px-2.5 py-1 rounded hover:bg-indigo-600">Kaydet</button>
                <button onClick={() => setEditIdx(null)} className="text-xs text-slate-500 px-2 py-1">İptal</button>
              </>
            ) : (
              <>
                <div className="flex flex-col gap-0.5 flex-shrink-0">
                  <button onClick={() => move(idx, -1)} disabled={idx === 0} className="text-slate-300 hover:text-slate-500 disabled:opacity-30"><ChevronLeft size={11} className="rotate-90" /></button>
                  <button onClick={() => move(idx, 1)} disabled={idx === items.length - 1} className="text-slate-300 hover:text-slate-500 disabled:opacity-30"><ChevronRight size={11} className="rotate-90" /></button>
                </div>
                <span className="flex-1 text-sm text-slate-700">{item}</span>
                <button onClick={() => { setEditIdx(idx); setEditVal(item); }} className="p-1 rounded hover:bg-slate-100 text-slate-400"><Edit3 size={13} /></button>
                <button onClick={() => remove(idx)} disabled={items.length <= 1} className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 disabled:opacity-30"><Trash2 size={13} /></button>
              </>
            )}
          </div>
        ))}
        <div className="flex gap-2 mt-3">
          <input value={newVal} onChange={e => setNewVal(e.target.value)} className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-200" placeholder={placeholder} onKeyDown={e => e.key === "Enter" && add()} />
          <button onClick={add} disabled={!newVal.trim()} className="px-4 py-2 text-xs font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 disabled:opacity-50">Ekle</button>
        </div>
      </div>
    );
  };

  // ── Object Config Tab (status/priority with colors) ──
  const ObjectConfigTab = ({ config, onChange, description, showDot, showIcon }) => {
    const [editKey, setEditKey] = useState(null);
    const [editForm, setEditForm] = useState({ label: "", color: "" });
    const [showNew, setShowNew] = useState(false);
    const [newForm, setNewForm] = useState({ key: "", label: "", color: "bg-slate-100 text-slate-700" });

    const saveEdit = () => {
      if (!editForm.label.trim()) return;
      onChange(prev => ({ ...prev, [editKey]: { ...prev[editKey], label: editForm.label.trim(), color: editForm.color } }));
      setEditKey(null);
    };
    const deleteItem = (key) => {
      if (Object.keys(config).length <= 1) return;
      if (!confirm(`"${config[key].label}" silinsin mi?`)) return;
      onChange(prev => { const u = { ...prev }; delete u[key]; return u; });
    };
    const addItem = () => {
      const key = newForm.key.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
      if (!key || !newForm.label.trim() || config[key]) return;
      onChange(prev => ({ ...prev, [key]: { label: newForm.label.trim(), color: newForm.color, dot: newForm.color.replace("bg-", "bg-").split(" ")[0]?.replace("100", "500") || "bg-slate-400" } }));
      setNewForm({ key: "", label: "", color: "bg-slate-100 text-slate-700" });
      setShowNew(false);
    };

    return (
      <div className="space-y-3">
        <p className="text-xs text-slate-500 mb-3">{description}</p>
        {Object.entries(config).map(([key, cfg]) => (
          <div key={key} className="border border-slate-200 rounded-xl p-3 bg-white">
            {editKey === key ? (
              <div className="space-y-3">
                <input value={editForm.label} onChange={e => setEditForm({ ...editForm, label: e.target.value })} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="Etiket" />
                <div className="grid grid-cols-7 gap-1.5">
                  {PALETTE.map(c => (
                    <button key={c.value} onClick={() => setEditForm({ ...editForm, color: c.value })}
                      className={`h-8 rounded-lg border-2 transition-all flex items-center justify-center ${c.preview} ${editForm.color === c.value ? "border-indigo-500 ring-1 ring-indigo-200" : "border-transparent hover:border-slate-300"}`}>
                      {editForm.color === c.value && <Check size={12} />}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setEditKey(null)} className="px-3 py-1.5 text-xs text-slate-500 bg-slate-100 rounded-lg">İptal</button>
                  <button onClick={saveEdit} className="px-3 py-1.5 text-xs text-white bg-indigo-500 rounded-lg hover:bg-indigo-600">Kaydet</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                <span className="text-[10px] text-slate-300 ml-auto">{key}</span>
                <button onClick={() => { setEditKey(key); setEditForm({ label: cfg.label, color: cfg.color }); }} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><Edit3 size={13} /></button>
                <button onClick={() => deleteItem(key)} disabled={Object.keys(config).length <= 1} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 disabled:opacity-30"><Trash2 size={13} /></button>
              </div>
            )}
          </div>
        ))}
        {showNew ? (
          <div className="border border-dashed border-indigo-300 rounded-xl p-3 bg-indigo-50/30 space-y-3">
            <div className="flex gap-2">
              <input value={newForm.key} onChange={e => setNewForm({ ...newForm, key: e.target.value })} className="w-28 text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white outline-none" placeholder="anahtar" />
              <input value={newForm.label} onChange={e => setNewForm({ ...newForm, label: e.target.value })} className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white outline-none" placeholder="Görünen ad" />
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {PALETTE.map(c => (
                <button key={c.value} onClick={() => setNewForm({ ...newForm, color: c.value })}
                  className={`h-8 rounded-lg border-2 transition-all flex items-center justify-center ${c.preview} ${newForm.color === c.value ? "border-indigo-500 ring-1 ring-indigo-200" : "border-transparent hover:border-slate-300"}`}>
                  {newForm.color === c.value && <Check size={12} />}
                </button>
              ))}
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowNew(false)} className="px-3 py-1.5 text-xs text-slate-500 bg-white border border-slate-200 rounded-lg">İptal</button>
              <button onClick={addItem} disabled={!newForm.key.trim() || !newForm.label.trim()} className="px-3 py-1.5 text-xs text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 disabled:opacity-50">Ekle</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowNew(true)} className="w-full py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-xs font-medium text-slate-400 hover:text-indigo-500 hover:border-indigo-300 transition-colors flex items-center justify-center gap-1.5"><Plus size={14} />Yeni Ekle</button>
        )}
      </div>
    );
  };

  // ── Education Tab (two sections) ──
  const EducationTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2"><GraduationCap size={14} />Derece Seçenekleri</h3>
        <ListTab items={eduDegreeOptions} onChange={onEduDegreeOptionsChange} itemLabel="Eğitim derecesi" placeholder="Yeni derece ekle..." />
      </div>
      <div className="border-t border-slate-200 pt-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2"><Activity size={14} />Eğitim Durumu Seçenekleri</h3>
        <ListTab items={eduStatusOptions} onChange={onEduStatusOptionsChange} itemLabel="Eğitim durumu" placeholder="Yeni durum ekle..." />
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-4 md:inset-auto md:top-[50%] md:left-[50%] md:-translate-x-1/2 md:-translate-y-1/2 md:w-[850px] md:max-h-[85vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-slide-up">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center"><Wrench size={18} className="text-indigo-600" /></div>
            <div><h2 className="text-lg font-bold text-slate-800">Ayarlar</h2><p className="text-[11px] text-slate-400">Sistem yapılandırmasını buradan yönetin</p></div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400"><X size={18} /></button>
        </div>
        <div className="border-b border-slate-200 flex flex-shrink-0 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === tab.key ? "text-indigo-600 border-indigo-500 bg-indigo-50/50" : "text-slate-500 border-transparent hover:text-slate-700 hover:bg-slate-50"}`}>
              <tab.icon size={13} />{tab.label}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === "roles" && <RolesTab />}
          {activeTab === "projectTypes" && <ListTab items={projectTypeOptions} onChange={onProjectTypeOptionsChange} itemLabel="Proje türü" placeholder="Yeni proje türü ekle..." />}
          {activeTab === "statuses" && <ObjectConfigTab config={statusConfig} onChange={onStatusConfigChange} description="Konu ve projelerde kullanılan durum seçeneklerini yönetin." />}
          {activeTab === "priorities" && <ObjectConfigTab config={priorityConfig} onChange={onPriorityConfigChange} description="Öncelik seviyelerini ve renklerini düzenleyin." />}
          {activeTab === "categories" && <ListTab items={categoryOptions} onChange={onCategoryOptionsChange} itemLabel="Kategori" placeholder="Yeni kategori ekle..." />}
          {activeTab === "education" && <EducationTab />}
          {activeTab === "data" && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Tüm verileri (araştırmacılar, konular, projeler, ayarlar) dışa aktarıp başka bir cihaza veya tarayıcıya aktarabilirsiniz.</p>

              {/* Export */}
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <h4 className="text-sm font-semibold text-emerald-800 flex items-center gap-2 mb-2"><Download size={15} />Veriyi Dışa Aktar</h4>
                <p className="text-xs text-emerald-600 mb-3">Tüm verileriniz bir JSON dosyası olarak indirilir. Bu dosyayı başka bir cihazda "İçe Aktar" ile yükleyebilirsiniz.</p>
                <button onClick={onExportData} className="px-4 py-2 text-sm font-medium text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors flex items-center gap-2">
                  <Download size={14} />JSON Olarak İndir
                </button>
              </div>

              {/* Import */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <h4 className="text-sm font-semibold text-blue-800 flex items-center gap-2 mb-2"><Upload size={15} />Veriyi İçe Aktar</h4>
                <p className="text-xs text-blue-600 mb-3">Daha önce dışa aktardığınız JSON dosyasını yükleyerek tüm verileri bu cihaza aktarın. Mevcut veriler değiştirilecektir!</p>
                <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    try {
                      const data = JSON.parse(ev.target.result);
                      onImportData(data);
                    } catch { alert("Geçersiz dosya formatı!"); }
                  };
                  reader.readAsText(file);
                  e.target.value = "";
                }} />
                <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2">
                  <Upload size={14} />JSON Dosyası Seç
                </button>
              </div>

              {/* Reset All */}
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <h4 className="text-sm font-semibold text-red-800 flex items-center gap-2 mb-2"><Trash2 size={15} />Tüm Verileri Sıfırla</h4>
                <p className="text-xs text-red-600 mb-3">Tüm araştırmacı, konu ve proje verilerini başlangıç haline döndürür. Ayarlar da varsayılana sıfırlanır. Bu işlem geri alınamaz!</p>
                <button onClick={onResetAllData} className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2">
                  <Trash2 size={14} />Her Şeyi Sıfırla
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between flex-shrink-0">
          <button onClick={onResetDefaults} className="px-4 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1.5"><AlertTriangle size={12} className="text-amber-500" />Ayarları Varsayılana Sıfırla</button>
          <button onClick={onClose} className="px-5 py-2 text-xs font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600">Kapat</button>
        </div>
      </div>
    </>
  );
};

// ─── DEADLINE UTILS ───────────────────────────────────────
// ─── LEADERBOARD MODAL ───────────────────────────────────
const LeaderboardModal = ({ researchers, topics, projects, onClose }) => {
  const [sortBy, setSortBy] = useState("score");
  const leaderboard = useMemo(() => {
    const activeByRole = (rid, role) => topics.filter(t => t.status === "active" && (t.researchers || []).some(tr => tr.researcherId === rid && tr.role === role)).length;
    return researchers.map(r => {
      const topicEntries = topics.filter(t => (t.researchers || []).some(tr => tr.researcherId === r.id));
      const leadCount = activeByRole(r.id, "lead");
      const unitManagerCount = activeByRole(r.id, "unit_manager");
      const responsibleCount = activeByRole(r.id, "responsible");
      const memberCount = activeByRole(r.id, "member");
      const advisorCount = activeByRole(r.id, "advisor");
      const scholarCount = activeByRole(r.id, "scholar");
      const completedCount = topicEntries.filter(t => t.status === "completed").length;
      const failedCount = topicEntries.filter(t => t.status === "failed").length;
      const allTasks = [...topics.flatMap(t => t.tasks || []), ...projects.flatMap(p => p.tasks || [])];
      const myTasks = allTasks.filter(tk => tk.assignedTo === r.id);
      const doneTasks = myTasks.filter(tk => tk.status === "done").length;
      return {
        ...r, total: topicEntries.length, leadCount, unitManagerCount, responsibleCount, memberCount, advisorCount, scholarCount,
        completedCount, failedCount, tasksDone: doneTasks, tasksTotal: myTasks.length,
        score: leadCount * 10 + unitManagerCount * 9 + responsibleCount * 8 + memberCount * 4 + advisorCount * 2 + scholarCount * 1 + completedCount * 15 + doneTasks * 3 - failedCount * 20
      };
    }).filter(r => r.total > 0);
  }, [researchers, topics, projects]);

  const sorted = useMemo(() => {
    const arr = [...leaderboard];
    if (sortBy === "total") arr.sort((a, b) => b.total - a.total);
    else if (sortBy === "lead") arr.sort((a, b) => b.leadCount - a.leadCount);
    else if (sortBy === "unit_manager") arr.sort((a, b) => b.unitManagerCount - a.unitManagerCount);
    else if (sortBy === "responsible") arr.sort((a, b) => b.responsibleCount - a.responsibleCount);
    else if (sortBy === "member") arr.sort((a, b) => b.memberCount - a.memberCount);
    else if (sortBy === "advisor") arr.sort((a, b) => b.advisorCount - a.advisorCount);
    else if (sortBy === "scholar") arr.sort((a, b) => b.scholarCount - a.scholarCount);
    else if (sortBy === "score") arr.sort((a, b) => b.score - a.score);
    else if (sortBy === "completed") arr.sort((a, b) => b.completedCount - a.completedCount);
    return arr;
  }, [leaderboard, sortBy]);

  const thBase = "px-2 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-center select-none leading-tight";
  const thNorm = thBase + " text-slate-400 hover:text-slate-600 cursor-pointer";
  const thAct = thBase + " text-indigo-600 bg-indigo-50/50 cursor-pointer";
  const thStatic = thBase + " text-slate-400";
  const InfoTip = ({ tip }) => (
    <span title={tip} className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-slate-200/70 text-slate-400 text-[8px] font-bold cursor-help hover:bg-slate-300 hover:text-slate-600 flex-shrink-0 ml-0.5 transition-colors">i</span>
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
        md:w-[1100px] md:max-h-[85vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-amber-500" />
            <h2 className="text-lg font-bold text-slate-800">Leaderboard</h2>
            <Badge className="bg-slate-100 text-slate-500">{sorted.length} araştırmacı</Badge>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X size={18} /></button>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-2 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider text-left w-10">#</th>
                <th className="px-2 py-2.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider text-left">Araştırmacı</th>
                <th onClick={() => setSortBy("total")} className={sortBy === "total" ? thAct : thNorm}>
                  <div className="flex items-center justify-center gap-0.5">Toplam<InfoTip tip="Araştırmacının dahil olduğu toplam konu sayısı" /></div>
                </th>
                <th onClick={() => setSortBy("lead")} className={sortBy === "lead" ? thAct : thNorm}>
                  <div className="flex items-center justify-center gap-0.5">Yürütücü<InfoTip tip="Aktif konularda Yürütücü rolü — Puan: ×10" /></div>
                </th>
                <th onClick={() => setSortBy("unit_manager")} className={sortBy === "unit_manager" ? thAct : thNorm}>
                  <div className="flex items-center justify-center gap-0.5">Birim S.<InfoTip tip="Aktif konularda Birim Sorumlusu rolü — Puan: ×9" /></div>
                </th>
                <th onClick={() => setSortBy("responsible")} className={sortBy === "responsible" ? thAct : thNorm}>
                  <div className="flex items-center justify-center gap-0.5">Sorumlu<InfoTip tip="Aktif konularda Sorumlu rolü — Puan: ×8" /></div>
                </th>
                <th onClick={() => setSortBy("member")} className={sortBy === "member" ? thAct : thNorm}>
                  <div className="flex items-center justify-center gap-0.5">Araştırmacı<InfoTip tip="Aktif konularda Araştırmacı rolü — Puan: ×4" /></div>
                </th>
                <th onClick={() => setSortBy("advisor")} className={sortBy === "advisor" ? thAct : thNorm}>
                  <div className="flex items-center justify-center gap-0.5">Danışman<InfoTip tip="Aktif konularda Danışman rolü — Puan: ×2" /></div>
                </th>
                <th onClick={() => setSortBy("scholar")} className={sortBy === "scholar" ? thAct : thNorm}>
                  <div className="flex items-center justify-center gap-0.5">Bursiyer<InfoTip tip="Aktif konularda Bursiyer rolü — Puan: ×1" /></div>
                </th>
                <th onClick={() => setSortBy("completed")} className={sortBy === "completed" ? thAct : thNorm}>
                  <div className="flex items-center justify-center gap-0.5">Biten<InfoTip tip="Tamamlanan konu sayısı — Puan: ×15" /></div>
                </th>
                <th className={thStatic}>
                  <div className="flex items-center justify-center gap-0.5">Başarısız<InfoTip tip="Dahil olduğu Tamamlanamadı durumundaki konu sayısı — Puan: ×-20" /></div>
                </th>
                <th className={thStatic}>
                  <div className="flex items-center justify-center gap-0.5">Görev<InfoTip tip="Tamamlanan / toplam atanmış görev sayısı — Her biten görev: ×3 puan" /></div>
                </th>
                <th onClick={() => setSortBy("score")} className={`${sortBy === "score" ? thAct : thNorm} border-l-2 border-slate-200`}>
                  <div className="flex items-center justify-center gap-0.5">Puan<InfoTip tip="Tüm metriklerin ağırlıklı toplamı. Detaylar için alttaki açıklamaya bakınız." /></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((r, i) => (
                <tr key={r.id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${i < 3 ? "bg-amber-50/20" : ""}`}>
                  <td className="px-3 py-2.5 text-center">
                    <span className={`text-sm font-bold ${i === 0 ? "text-amber-500" : i === 1 ? "text-slate-400" : i === 2 ? "text-amber-700" : "text-slate-300"}`}>
                      {i === 0 ? "\u{1F947}" : i === 1 ? "\u{1F948}" : i === 2 ? "\u{1F949}" : i + 1}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <Avatar name={r.name} color={r.color} size="sm" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{r.title ? `${r.title} ` : ""}{r.name}</p>
                        <p className="text-xs text-slate-400 truncate">{r.unit || r.institution}</p>
                      </div>
                    </div>
                  </td>
                  <td className={`px-3 py-2.5 text-center text-sm font-bold text-slate-600 ${sortBy === "total" ? "bg-indigo-50/30" : ""}`}>{r.total}</td>
                  <td className={`px-3 py-2.5 text-center text-sm font-bold text-indigo-600 ${sortBy === "lead" ? "bg-indigo-50/30" : ""}`}>{r.leadCount || <span className="text-slate-300">0</span>}</td>
                  <td className={`px-3 py-2.5 text-center text-sm font-semibold text-rose-600 ${sortBy === "unit_manager" ? "bg-indigo-50/30" : ""}`}>{r.unitManagerCount || <span className="text-slate-300">0</span>}</td>
                  <td className={`px-3 py-2.5 text-center text-sm font-semibold text-orange-600 ${sortBy === "responsible" ? "bg-indigo-50/30" : ""}`}>{r.responsibleCount || <span className="text-slate-300">0</span>}</td>
                  <td className={`px-3 py-2.5 text-center text-sm font-semibold text-emerald-600 ${sortBy === "member" ? "bg-indigo-50/30" : ""}`}>{r.memberCount || <span className="text-slate-300">0</span>}</td>
                  <td className={`px-3 py-2.5 text-center text-sm font-medium text-purple-600 ${sortBy === "advisor" ? "bg-indigo-50/30" : ""}`}>{r.advisorCount || <span className="text-slate-300">0</span>}</td>
                  <td className={`px-3 py-2.5 text-center text-sm font-medium text-cyan-600 ${sortBy === "scholar" ? "bg-indigo-50/30" : ""}`}>{r.scholarCount || <span className="text-slate-300">0</span>}</td>
                  <td className={`px-3 py-2.5 text-center text-sm font-medium text-blue-600 ${sortBy === "completed" ? "bg-indigo-50/30" : ""}`}>{r.completedCount}</td>
                  <td className="px-3 py-2.5 text-center">
                    {r.failedCount > 0
                      ? <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">{r.failedCount}</span>
                      : <span className="text-sm text-slate-300">0</span>}
                  </td>
                  <td className="px-3 py-2.5 text-center text-sm text-slate-500">
                    {r.tasksTotal > 0 ? <span>{r.tasksDone}/{r.tasksTotal}</span> : <span className="text-slate-300">-</span>}
                  </td>
                  <td className={`px-3 py-2.5 text-center border-l-2 border-slate-200 ${sortBy === "score" ? "bg-indigo-50/30" : ""}`}>
                    <span className="text-sm font-bold text-amber-600">{r.score}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sorted.length === 0 && <p className="text-sm text-slate-400 text-center py-12">Henüz araştırmacı-konu eşleştirmesi yapılmamış</p>}
        </div>

        {/* Scoring Explanation Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex-shrink-0">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Puan Hesaplama (yalnızca aktif çalışmalar)</h4>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-indigo-500" />Yürütücü <span className="font-mono text-indigo-600">×10</span></span>
            <span className="font-bold text-slate-300">+</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500" />Birim Sorumlusu <span className="font-mono text-rose-600">×9</span></span>
            <span className="font-bold text-slate-300">+</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500" />Sorumlu <span className="font-mono text-orange-600">×8</span></span>
            <span className="font-bold text-slate-300">+</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" />Araştırmacı <span className="font-mono text-emerald-600">×4</span></span>
            <span className="font-bold text-slate-300">+</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500" />Danışman <span className="font-mono text-purple-600">×2</span></span>
            <span className="font-bold text-slate-300">+</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-500" />Bursiyer <span className="font-mono text-cyan-600">×1</span></span>
            <span className="font-bold text-slate-300">+</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" />Biten <span className="font-mono text-blue-600">×15</span></span>
            <span className="font-bold text-slate-300">+</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-400" />Görev <span className="font-mono text-slate-600">×3</span></span>
            <span className="font-bold text-slate-300">&minus;</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" />Başarısız <span className="font-mono text-red-600">×20</span></span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Sütun başlıklarına tıklayarak sıralama değiştirebilirsiniz. "Başarısız" = durumu Tamamlanamadı olan konu sayısı.</p>
        </div>
      </div>
    </>
  );
};

// ─── STATS PANEL MODAL ──────────────────────────────────
const SimplePieChart = ({ data, size = 160 }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <p className="text-xs text-slate-400 text-center py-4">Veri yok</p>;
  let cum = 0;
  const slices = data.filter(d => d.value > 0).map(d => {
    const start = cum / total;
    cum += d.value;
    const end = cum / total;
    return { ...d, start, end };
  });
  const r = size / 2 - 4;
  const cx = size / 2;
  const cy = size / 2;
  const arc = (s, e) => {
    const sa = 2 * Math.PI * s - Math.PI / 2;
    const ea = 2 * Math.PI * e - Math.PI / 2;
    const large = e - s > 0.5 ? 1 : 0;
    return `M ${cx + r * Math.cos(sa)} ${cy + r * Math.sin(sa)} A ${r} ${r} 0 ${large} 1 ${cx + r * Math.cos(ea)} ${cy + r * Math.sin(ea)} L ${cx} ${cy} Z`;
  };
  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size}>
        {slices.length === 1 ? (
          <circle cx={cx} cy={cy} r={r} fill={slices[0].color} />
        ) : slices.map((s, i) => (
          <path key={i} d={arc(s.start, s.end)} fill={s.color} stroke="white" strokeWidth="2" />
        ))}
      </svg>
      <div className="space-y-1">
        {data.filter(d => d.value > 0).map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-slate-600">{d.label}: <b>{d.value}</b> ({total > 0 ? Math.round(d.value / total * 100) : 0}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};
const SimpleBarChart = ({ data, height = 180 }) => {
  if (!data.length) return <p className="text-xs text-slate-400 text-center py-4">Veri yok</p>;
  const max = Math.max(...data.map(d => d.value), 1);
  const barW = Math.min(40, Math.max(16, Math.floor(500 / data.length) - 8));
  const chartW = data.length * (barW + 8) + 40;
  return (
    <div className="overflow-x-auto">
      <svg width={Math.max(chartW, 300)} height={height + 40} className="mx-auto">
        {data.map((d, i) => {
          const bh = (d.value / max) * height;
          const x = 30 + i * (barW + 8);
          return (
            <g key={i}>
              <rect x={x} y={height - bh + 10} width={barW} height={bh} fill={d.color || "#6366f1"} rx="3" />
              <text x={x + barW / 2} y={height - bh + 4} textAnchor="middle" className="text-[10px] fill-slate-600 font-medium">{d.value}</text>
              <text x={x + barW / 2} y={height + 26} textAnchor="middle" className="text-[9px] fill-slate-400" transform={`rotate(-30 ${x + barW / 2} ${height + 26})`}>{d.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
const SimpleLineChart = ({ data, height = 160, color = "#6366f1" }) => {
  if (!data.length) return <p className="text-xs text-slate-400 text-center py-4">Veri yok</p>;
  const max = Math.max(...data.map(d => d.value), 1);
  const w = Math.max(data.length * 50, 300);
  const pad = { t: 10, b: 30, l: 30, r: 10 };
  const cw = w - pad.l - pad.r;
  const ch = height - pad.t - pad.b;
  const pts = data.map((d, i) => ({ x: pad.l + (data.length > 1 ? (i / (data.length - 1)) * cw : cw / 2), y: pad.t + ch - (d.value / max) * ch }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const area = `${line} L ${pts[pts.length - 1].x} ${pad.t + ch} L ${pts[0].x} ${pad.t + ch} Z`;
  return (
    <div className="overflow-x-auto">
      <svg width={w} height={height}>
        {[0, 0.25, 0.5, 0.75, 1].map(f => (
          <line key={f} x1={pad.l} y1={pad.t + ch * (1 - f)} x2={w - pad.r} y2={pad.t + ch * (1 - f)} stroke="#e2e8f0" strokeDasharray="3,3" />
        ))}
        <path d={area} fill={color} opacity="0.1" />
        <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="white" stroke={color} strokeWidth="2" />
            <text x={p.x} y={p.y - 10} textAnchor="middle" className="text-[10px] fill-slate-600 font-medium">{data[i].value}</text>
            <text x={p.x} y={pad.t + ch + 16} textAnchor="middle" className="text-[9px] fill-slate-400">{data[i].label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
};
const StatsModal = ({ researchers, topics, projects, onClose }) => {
  const [activeTab, setActiveTab] = useState("summary");
  const [personFilter, setPersonFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filteredTopics = useMemo(() => {
    let result = topics;
    if (personFilter) result = result.filter(t => (t.researchers || []).some(r => r.researcherId === personFilter));
    if (statusFilter) result = result.filter(t => t.status === statusFilter);
    if (typeFilter) result = result.filter(t => t.projectType === typeFilter);
    return result;
  }, [topics, personFilter, statusFilter, typeFilter]);

  const filteredProjects = useMemo(() => {
    let result = projects;
    if (personFilter) {
      const personTopicIds = topics.filter(t => (t.researchers || []).some(r => r.researcherId === personFilter)).map(t => t.id);
      result = result.filter(p => (p.topics || []).some(tid => personTopicIds.includes(tid)));
    }
    if (statusFilter) result = result.filter(p => p.status === statusFilter);
    if (typeFilter) result = result.filter(p => p.type === typeFilter);
    return result;
  }, [projects, topics, personFilter, statusFilter, typeFilter]);

  const years = useMemo(() => {
    const ySet = new Set();
    [...topics, ...projects].forEach(item => {
      if (item.startDate) ySet.add(item.startDate.slice(0, 4));
      if (item.endDate) ySet.add(item.endDate.slice(0, 4));
    });
    return [...ySet].sort();
  }, [topics, projects]);

  // Summary stats
  const summary = useMemo(() => {
    const ft = filteredTopics;
    const fp = filteredProjects;
    const topicsByStatus = {};
    Object.keys(statusConfig).forEach(s => { topicsByStatus[s] = ft.filter(t => t.status === s).length; });
    const projectsByStatus = {};
    Object.keys(statusConfig).forEach(s => { projectsByStatus[s] = fp.filter(p => p.status === s).length; });
    const totalBudget = fp.reduce((s, p) => s + (parseFloat(p.budget) || 0), 0);
    const allTasks = [...ft, ...fp].flatMap(item => item.tasks || []);
    const uniqueResearchers = new Set();
    ft.forEach(t => (t.researchers || []).forEach(r => uniqueResearchers.add(r.researcherId)));
    return { topicCount: ft.length, projectCount: fp.length, topicsByStatus, projectsByStatus, totalBudget, totalTasks: allTasks.length, doneTasks: allTasks.filter(t => t.status === "done").length, uniqueResearchers: uniqueResearchers.size };
  }, [filteredTopics, filteredProjects]);

  // Topic monthly data
  const topicMonthly = useMemo(() => {
    const months = {};
    filteredTopics.forEach(t => {
      if (t.startDate) { const m = t.startDate.slice(0, 7); months[m] = (months[m] || { start: 0, end: 0 }); months[m].start++; }
      if (t.endDate) { const m = t.endDate.slice(0, 7); months[m] = (months[m] || { start: 0, end: 0 }); months[m].end++; }
    });
    return Object.entries(months).sort(([a], [b]) => a.localeCompare(b)).map(([m, v]) => ({ label: m.slice(2), start: v.start, end: v.end }));
  }, [filteredTopics]);

  // Topic status pie
  const topicStatusPie = useMemo(() => {
    const colors = { proposed: "#94a3b8", active: "#10b981", completed: "#3b82f6", failed: "#ef4444", archived: "#6b7280", planning: "#f59e0b", review: "#a855f7" };
    return Object.entries(summary.topicsByStatus).filter(([, v]) => v > 0).map(([k, v]) => ({ label: statusConfig[k]?.label || k, value: v, color: colors[k] || "#94a3b8" }));
  }, [summary]);

  // Project monthly line
  const projectMonthly = useMemo(() => {
    const months = {};
    filteredProjects.forEach(p => {
      if (p.startDate) { const m = p.startDate.slice(0, 7); months[m] = (months[m] || 0) + 1; }
    });
    return Object.entries(months).sort(([a], [b]) => a.localeCompare(b)).map(([m, v]) => ({ label: m.slice(2), value: v }));
  }, [filteredProjects]);

  // Project status yearly pie
  const projectStatusPie = useMemo(() => {
    const colors = { planning: "#f59e0b", active: "#10b981", review: "#a855f7", completed: "#3b82f6", failed: "#ef4444" };
    let fp = filteredProjects;
    if (yearFilter) fp = fp.filter(p => (p.startDate || "").startsWith(yearFilter) || (p.endDate || "").startsWith(yearFilter));
    const counts = {};
    fp.forEach(p => { counts[p.status] = (counts[p.status] || 0) + 1; });
    return Object.entries(counts).map(([k, v]) => ({ label: statusConfig[k]?.label || k, value: v, color: colors[k] || "#94a3b8" }));
  }, [filteredProjects, yearFilter]);

  // Project type yearly bar
  const projectTypeBar = useMemo(() => {
    const colors = { "BAP": "#6366f1", "TÜBİTAK": "#10b981", "Horizon": "#3b82f6", "Erasmus+": "#f59e0b", "DIGITAL": "#ec4899", "Diğer Ulusal": "#8b5cf6", "Diğer Uluslararası": "#14b8a6", "Diğer": "#94a3b8" };
    let fp = filteredProjects;
    if (yearFilter) fp = fp.filter(p => (p.startDate || "").startsWith(yearFilter) || (p.endDate || "").startsWith(yearFilter));
    const counts = {};
    fp.forEach(p => { const t = p.type || "Belirtilmemiş"; counts[t] = (counts[t] || 0) + 1; });
    return Object.entries(counts).map(([k, v]) => ({ label: k, value: v, color: colors[k] || "#6366f1" }));
  }, [filteredProjects, yearFilter]);

  const tabs = [
    { key: "summary", label: "Özet", icon: BarChart3 },
    { key: "topics", label: "Konu Bazlı", icon: BookOpen },
    { key: "projects", label: "Proje Bazlı", icon: FolderKanban },
  ];

  const statCard = (label, value, icon, color) => (
    <div className={`${color} rounded-xl p-3 flex items-center gap-3`}>
      <div className="p-2 bg-white/60 rounded-lg">{icon}</div>
      <div><p className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</p><p className="text-lg font-bold text-slate-800">{value}</p></div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-3 bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-xl"><BarChart3 size={20} className="text-indigo-600" /></div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">İstatistikler</h2>
              <p className="text-xs text-slate-400">Konu ve proje istatistikleri, grafikler, özet veriler</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400"><X size={18} /></button>
        </div>

        {/* Filters */}
        <div className="px-5 py-3 border-b border-slate-100 flex flex-wrap items-center gap-3 flex-shrink-0 bg-slate-50/50">
          <select value={personFilter} onChange={e => setPersonFilter(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:ring-1 focus:ring-indigo-200 outline-none min-w-[180px]">
            <option value="">Tüm Araştırmacılar</option>
            {researchers.map(r => <option key={r.id} value={r.id}>{r.title ? `${r.title} ` : ""}{r.name}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:ring-1 focus:ring-indigo-200 outline-none">
            <option value="">Tüm Durumlar</option>
            {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:ring-1 focus:ring-indigo-200 outline-none">
            <option value="">Tüm Türler</option>
            {projectTypeOptions.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={yearFilter} onChange={e => setYearFilter(e.target.value)} className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:ring-1 focus:ring-indigo-200 outline-none">
            <option value="">Tüm Yıllar</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          {(personFilter || statusFilter || typeFilter || yearFilter) && (
            <button onClick={() => { setPersonFilter(""); setStatusFilter(""); setTypeFilter(""); setYearFilter(""); }} className="text-xs text-red-500 hover:text-red-700 px-2">Filtreleri Temizle</button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-5">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === t.key ? "border-indigo-500 text-indigo-600" : "border-transparent text-slate-400 hover:text-slate-600"}`}>
              <t.icon size={15} />{t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === "summary" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {statCard("Araştırmacı", summary.uniqueResearchers, <Users size={16} className="text-indigo-500" />, "bg-indigo-50")}
                {statCard("Toplam Konu", summary.topicCount, <BookOpen size={16} className="text-emerald-500" />, "bg-emerald-50")}
                {statCard("Toplam Proje", summary.projectCount, <FolderKanban size={16} className="text-violet-500" />, "bg-violet-50")}
                {statCard("Toplam Bütçe", `₺${summary.totalBudget.toLocaleString("tr-TR")}`, <Briefcase size={16} className="text-amber-500" />, "bg-amber-50")}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {statCard("Aktif Konular", summary.topicsByStatus.active || 0, <Activity size={16} className="text-green-500" />, "bg-green-50")}
                {statCard("Aktif Projeler", summary.projectsByStatus.active || 0, <Target size={16} className="text-blue-500" />, "bg-blue-50")}
                {statCard("Tamamlanan Görevler", `${summary.doneTasks}/${summary.totalTasks}`, <CheckCircle2 size={16} className="text-emerald-500" />, "bg-emerald-50")}
                {statCard("Önerilen Konular", summary.topicsByStatus.proposed || 0, <Clock size={16} className="text-slate-500" />, "bg-slate-50")}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2"><BookOpen size={14} className="text-emerald-500" />Konu Durumu Dağılımı</h3>
                  <SimplePieChart data={topicStatusPie} />
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2"><FolderKanban size={14} className="text-violet-500" />Proje Durumu Dağılımı</h3>
                  <SimplePieChart data={projectStatusPie} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "topics" && (
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Konu Durumu Dağılımı</h3>
                <SimplePieChart data={topicStatusPie} size={140} />
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Konuların Aylık Başlangıç/Bitiş Dağılımı</h3>
                {topicMonthly.length > 0 ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-2 flex items-center gap-1"><span className="w-3 h-1 bg-indigo-500 rounded" /> Başlangıç</p>
                      <SimpleBarChart data={topicMonthly.map(m => ({ label: m.label, value: m.start, color: "#6366f1" }))} height={120} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-2 flex items-center gap-1"><span className="w-3 h-1 bg-emerald-500 rounded" /> Bitiş</p>
                      <SimpleBarChart data={topicMonthly.map(m => ({ label: m.label, value: m.end, color: "#10b981" }))} height={120} />
                    </div>
                  </div>
                ) : <p className="text-xs text-slate-400 text-center py-4">Tarih verisi bulunamadı</p>}
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Konu Detay Tablosu</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr className="text-left border-b border-slate-200">
                      <th className="pb-2 font-semibold text-slate-500">Durum</th>
                      <th className="pb-2 font-semibold text-slate-500 text-center">Sayı</th>
                      <th className="pb-2 font-semibold text-slate-500 text-center">%</th>
                    </tr></thead>
                    <tbody>
                      {Object.entries(summary.topicsByStatus).filter(([, v]) => v > 0).map(([k, v]) => (
                        <tr key={k} className="border-b border-slate-100">
                          <td className="py-1.5"><Badge className={statusConfig[k]?.color}>{statusConfig[k]?.label}</Badge></td>
                          <td className="text-center font-medium">{v}</td>
                          <td className="text-center text-slate-400">{summary.topicCount > 0 ? Math.round(v / summary.topicCount * 100) : 0}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Proje Durumu {yearFilter ? `(${yearFilter})` : "(Tümü)"}</h3>
                  <SimplePieChart data={projectStatusPie} size={140} />
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Proje Türü {yearFilter ? `(${yearFilter})` : "(Tümü)"}</h3>
                  <SimpleBarChart data={projectTypeBar} height={140} />
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Projelerin Aylık Başlangıç Dağılımı (Çizgi Grafik)</h3>
                <SimpleLineChart data={projectMonthly} color="#8b5cf6" />
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Proje Detay Tablosu</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr className="text-left border-b border-slate-200">
                      <th className="pb-2 font-semibold text-slate-500">Durum</th>
                      <th className="pb-2 font-semibold text-slate-500 text-center">Sayı</th>
                      <th className="pb-2 font-semibold text-slate-500 text-center">%</th>
                      <th className="pb-2 font-semibold text-slate-500 text-right">Bütçe (₺)</th>
                    </tr></thead>
                    <tbody>
                      {Object.entries(summary.projectsByStatus).filter(([, v]) => v > 0).map(([k, v]) => (
                        <tr key={k} className="border-b border-slate-100">
                          <td className="py-1.5"><Badge className={statusConfig[k]?.color}>{statusConfig[k]?.label}</Badge></td>
                          <td className="text-center font-medium">{v}</td>
                          <td className="text-center text-slate-400">{summary.projectCount > 0 ? Math.round(v / summary.projectCount * 100) : 0}%</td>
                          <td className="text-right font-medium">{filteredProjects.filter(p => p.status === k).reduce((s, p) => s + (parseFloat(p.budget) || 0), 0).toLocaleString("tr-TR")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ─── TABLE VIEW + EXPORT MODAL ──────────────────────────
const TableViewModal = ({ researchers, topics, projects, onClose }) => {
  const [tab, setTab] = useState("researchers");
  const tabs = [
    { key: "researchers", label: "Araştırmacılar", icon: Users, count: researchers.length },
    { key: "topics", label: "Konular", icon: BookOpen, count: topics.length },
    { key: "projects", label: "Projeler", icon: FolderKanban, count: projects.length },
  ];

  const exportCSV = (data, headers, filename) => {
    const bom = "\uFEFF";
    const headerRow = headers.map(h => h.label).join(";");
    const rows = data.map(row => headers.map(h => {
      let val = typeof h.get === "function" ? h.get(row) : row[h.key] || "";
      val = String(val).replace(/"/g, '""');
      if (String(val).includes(";") || String(val).includes('"') || String(val).includes("\n")) val = `"${val}"`;
      return val;
    }).join(";"));
    const csv = bom + [headerRow, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const resHeaders = [
    { label: "Ad Soyad", key: "name", get: r => `${r.title || ""} ${r.name}`.trim() },
    { label: "Kurum", key: "institution" },
    { label: "Birim", key: "unit" },
    { label: "Eğitim Derecesi", key: "eduDegree" },
    { label: "Eğitim Durumu", key: "eduStatus" },
    { label: "Üniversite", key: "eduUniversity" },
    { label: "Program", key: "eduProgram" },
    { label: "Araştırma Alanları", get: r => (r.researchAreas || []).join(", ") },
    { label: "Diller", get: r => (r.languages || []).join(", ") },
    { label: "Araçlar", get: r => (r.tools || []).join(", ") },
    { label: "PI Deneyimi", get: r => r.hasPIExperience ? "Evet" : "Hayır" },
    { label: "E-posta", key: "email" },
    { label: "Telefon", key: "phone" },
    { label: "Konu Sayısı", get: r => topics.filter(t => (t.researchers || []).some(tr => tr.researcherId === r.id)).length },
  ];
  const topicHeaders = [
    { label: "Başlık", key: "title" },
    { label: "Durum", get: t => statusConfig[t.status]?.label || t.status },
    { label: "Öncelik", get: t => priorityConfig[t.priority]?.label || t.priority },
    { label: "Kategori", key: "category" },
    { label: "Proje Türü", key: "projectType" },
    { label: "Proje Türü Detayı", key: "projectTypeDetail" },
    { label: "Ekip", get: t => (t.researchers || []).map(tr => { const r = researchers.find(x => x.id === tr.researcherId); return r ? `${r.name} (${roleConfig[tr.role]?.label || tr.role})` : ""; }).filter(Boolean).join(", ") },
    { label: "Başlangıç", key: "startDate" },
    { label: "Bitiş", key: "endDate" },
    { label: "Hedef Dergi", key: "targetJournal" },
    { label: "Araştırma Yöntemi", key: "researchMethod" },
    { label: "Çalışma Linki", key: "workLink" },
    { label: "Projelendirilmiş", get: t => projects.some(p => (p.topics || []).includes(t.id)) ? "Evet" : "Hayır" },
    { label: "Görev İlerlemesi", get: t => { const tasks = t.tasks || []; return tasks.length > 0 ? `${tasks.filter(tk => tk.status === "done").length}/${tasks.length}` : "-"; }},
  ];
  const projHeaders = [
    { label: "Başlık", key: "title" },
    { label: "Durum", get: p => statusConfig[p.status]?.label || p.status },
    { label: "Öncelik", get: p => priorityConfig[p.priority]?.label || p.priority },
    { label: "Proje Türü", key: "type" },
    { label: "Proje Türü Detayı", key: "projectTypeDetail" },
    { label: "Fon Kaynağı", key: "fundingSource" },
    { label: "Bütçe (₺)", get: p => p.budget ? p.budget.toLocaleString("tr-TR") : "" },
    { label: "Başlangıç", key: "startDate" },
    { label: "Bitiş", key: "endDate" },
    { label: "Bağlı Konu Sayısı", get: p => (p.topics || []).length },
    { label: "Bağlı Konular", get: p => (p.topics || []).map(tid => topics.find(t => t.id === tid)?.title || "").filter(Boolean).join(", ") },
    { label: "Çalışma Linki", key: "workLink" },
  ];

  const headers = tab === "researchers" ? resHeaders : tab === "topics" ? topicHeaders : projHeaders;
  const data = tab === "researchers" ? researchers : tab === "topics" ? topics : projects;

  const thCls = "px-3 py-2.5 text-[10px] font-semibold text-slate-500 uppercase tracking-wider text-left whitespace-nowrap bg-slate-50 border-b border-slate-200 sticky top-0 z-10";
  const tdCls = "px-3 py-2 text-sm text-slate-600 border-b border-slate-50 max-w-[200px] truncate";

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-4 md:inset-6 bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <Table2 size={18} className="text-indigo-500" />
            <h2 className="text-lg font-bold text-slate-800">Tablo Görünümü</h2>
            <div className="flex gap-1 ml-2">
              {tabs.map(t => (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${tab === t.key ? "bg-indigo-100 text-indigo-700" : "text-slate-500 hover:bg-slate-100"}`}>
                  <t.icon size={13} />{t.label}<span className="text-[10px] opacity-60">({t.count})</span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => exportCSV(data, headers, `${tab}_export.csv`)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
              <Download size={13} />CSV İndir
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X size={18} /></button>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>{headers.map((h, i) => <th key={i} className={thCls}>{h.label}</th>)}</tr>
            </thead>
            <tbody>
              {data.map((row, ri) => (
                <tr key={row.id || ri} className="hover:bg-slate-50 transition-colors">
                  {headers.map((h, ci) => {
                    const val = typeof h.get === "function" ? h.get(row) : row[h.key] || "";
                    return <td key={ci} className={tdCls} title={String(val)}>{String(val)}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {data.length === 0 && <p className="text-sm text-slate-400 text-center py-12">Veri bulunamadı</p>}
        </div>
        <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-400 flex-shrink-0">
          <span>{data.length} kayıt · {headers.length} sütun</span>
          <span>CSV dosyası noktalı virgül (;) ayırıcı ile UTF-8 BOM kodlamasında indirilir.</span>
        </div>
      </div>
    </>
  );
};

// ─── QUICK LINKS PANEL ───────────────────────────────────
const defaultQuickLinks = [
  { id: "ql1", label: "AÖF Web Sitesi", url: "https://www.anadolu.edu.tr/aof", icon: "globe" },
  { id: "ql2", label: "Ar-Ge Birimi", url: "https://www.anadolu.edu.tr/arge", icon: "building" },
  { id: "ql3", label: "e-Kampüs", url: "https://ekampus.anadolu.edu.tr", icon: "globe" },
  { id: "ql4", label: "TÜBİTAK", url: "https://www.tubitak.gov.tr", icon: "external" },
  { id: "ql5", label: "Erasmus+ Türkiye", url: "https://www.ua.gov.tr", icon: "external" },
];
const linkIcons = { globe: Globe, building: Building2, external: ExternalLink, file: FileText };

const QuickLinksPanel = ({ links, onChange, onClose }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ label: "", url: "" });

  const handleAdd = () => {
    if (!draft.label.trim() || !draft.url.trim()) return;
    const newLink = { id: `ql_${Date.now()}`, label: draft.label.trim(), url: draft.url.trim(), icon: "external" };
    onChange([...links, newLink]);
    setDraft({ label: "", url: "" });
  };
  const handleRemove = (id) => { onChange(links.filter(l => l.id !== id)); };

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute top-full right-0 mt-2 w-[340px] bg-white rounded-xl shadow-2xl border border-slate-200 z-40 overflow-hidden">
        <div className="p-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 size={16} className="text-indigo-500" />
            <h3 className="text-sm font-bold text-slate-800">Bağlantılar</h3>
          </div>
          <button onClick={() => setEditing(!editing)} className={`p-1 rounded-lg transition-colors ${editing ? "bg-indigo-100 text-indigo-600" : "hover:bg-slate-100 text-slate-400"}`} title="Düzenle">
            <Pencil size={14} />
          </button>
        </div>
        <div className="max-h-[350px] overflow-y-auto p-2 space-y-1">
          {links.map(link => {
            const Icon = linkIcons[link.icon] || ExternalLink;
            return (
              <div key={link.id} className="flex items-center gap-2 group">
                <a href={link.url} target="_blank" rel="noopener noreferrer"
                  className="flex-1 flex items-center gap-2.5 p-2 rounded-lg hover:bg-indigo-50 transition-colors">
                  <Icon size={15} className="text-slate-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-700 truncate">{link.label}</p>
                    <p className="text-xs text-slate-400 truncate">{link.url.replace(/^https?:\/\//, "").split("/")[0]}</p>
                  </div>
                  <ExternalLink size={12} className="text-slate-300 flex-shrink-0" />
                </a>
                {editing && <button onClick={() => handleRemove(link.id)} className="p-1 text-slate-300 hover:text-red-400 flex-shrink-0"><X size={14} /></button>}
              </div>
            );
          })}
          {links.length === 0 && <p className="text-sm text-slate-400 text-center py-4">Henüz bağlantı eklenmemiş</p>}
        </div>
        {editing && (
          <div className="p-3 border-t border-slate-100 space-y-2">
            <input value={draft.label} onChange={e => setDraft({ ...draft, label: e.target.value })} placeholder="Bağlantı adı"
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
            <div className="flex gap-2">
              <input value={draft.url} onChange={e => setDraft({ ...draft, url: e.target.value })} placeholder="https://..."
                onKeyDown={e => e.key === "Enter" && handleAdd()}
                className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
              <button onClick={handleAdd} className="px-3 py-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 text-sm font-medium"><Plus size={14} /></button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const getDeadlineInfo = (dateStr) => {
  if (!dateStr) return null;
  const now = new Date(); now.setHours(0,0,0,0);
  const end = new Date(dateStr); end.setHours(0,0,0,0);
  const diffMs = end - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { label: `${Math.abs(diffDays)} gün gecikti`, color: "text-red-600", bg: "bg-red-50 border-red-200", urgency: 0, days: diffDays };
  if (diffDays === 0) return { label: "Bugün!", color: "text-red-700", bg: "bg-red-100 border-red-300", urgency: 1, days: 0 };
  if (diffDays <= 7) return { label: `${diffDays} gün kaldı`, color: "text-red-600", bg: "bg-red-50 border-red-200", urgency: 2, days: diffDays };
  if (diffDays <= 14) return { label: "2 hafta kaldı", color: "text-orange-600", bg: "bg-orange-50 border-orange-200", urgency: 3, days: diffDays };
  if (diffDays <= 21) return { label: "3 hafta kaldı", color: "text-amber-600", bg: "bg-amber-50 border-amber-200", urgency: 4, days: diffDays };
  if (diffDays <= 28) return { label: "4 hafta kaldı", color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200", urgency: 5, days: diffDays };
  return null;
};

// ─── DEADLINE PANEL (Bell dropdown) ──────────────────────
const DeadlinePanel = ({ topics, projects, onClose }) => {
  const deadlines = useMemo(() => {
    const items = [];
    topics.forEach(t => {
      if (t.status === "completed" || t.status === "archived") return;
      const info = getDeadlineInfo(t.endDate);
      if (info) items.push({ ...info, title: t.title, type: "Konu", date: t.endDate, icon: BookOpen, iconColor: "text-emerald-500" });
    });
    projects.forEach(p => {
      if (p.status === "completed" || p.status === "archived") return;
      const info = getDeadlineInfo(p.endDate);
      if (info) items.push({ ...info, title: p.title, type: "Proje", date: p.endDate, icon: FolderKanban, iconColor: "text-violet-500" });
    });
    // Also check task deadlines could be added later
    items.sort((a, b) => a.days - b.days);
    return items;
  }, [topics, projects]);

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute top-full right-0 mt-2 w-[380px] bg-white rounded-xl shadow-2xl border border-slate-200 z-40 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
          <Bell size={16} className="text-amber-500" />
          <h3 className="text-sm font-bold text-slate-800">Yaklaşan Tarihler</h3>
          <Badge className="bg-slate-100 text-slate-500 ml-auto">{deadlines.length}</Badge>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {deadlines.length === 0 ? (
            <div className="p-6 text-center">
              <CheckCircle2 size={24} className="text-emerald-400 mx-auto mb-2" />
              <p className="text-sm text-slate-500">Yaklaşan tarih yok</p>
            </div>
          ) : (
            <div className="p-2 space-y-1.5">
              {deadlines.map((d, i) => {
                const Icon = d.icon;
                return (
                  <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg border ${d.bg}`}>
                    <Icon size={16} className={d.iconColor + " flex-shrink-0"} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{d.title}</p>
                      <p className="text-xs text-slate-400">{d.type} · {new Date(d.date).toLocaleDateString("tr-TR")}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-xs font-bold ${d.color}`}>{d.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ─── CALENDAR MODAL ──────────────────────────────────────
const CalendarModal = ({ topics, projects, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const monthName = currentMonth.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));
  const goToday = () => { const d = new Date(); setCurrentMonth(new Date(d.getFullYear(), d.getMonth(), 1)); };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7; // Monday=0
  const today = new Date(); today.setHours(0,0,0,0);

  // Collect all events
  const events = useMemo(() => {
    const map = {};
    const addEvent = (dateStr, title, type, color) => {
      if (!dateStr) return;
      const d = new Date(dateStr);
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (!map[day]) map[day] = [];
        map[day].push({ title, type, color });
      }
    };
    topics.forEach(t => {
      addEvent(t.applicationDate, t.title, "Başvuru", "bg-slate-400");
      addEvent(t.startDate, t.title, "Başlangıç", "bg-emerald-500");
      addEvent(t.endDate, t.title, "Bitiş", "bg-red-500");
    });
    projects.forEach(p => {
      addEvent(p.startDate, p.title, "Başlangıç", "bg-indigo-500");
      addEvent(p.endDate, p.title, "Bitiş", "bg-red-500");
    });
    return map;
  }, [topics, projects, year, month]);

  const dayNames = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
  const cells = [];
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const [hoveredDay, setHoveredDay] = useState(null);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
        md:w-[640px] md:max-h-[85vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <CalendarDays size={18} className="text-indigo-500" />
            <h2 className="text-lg font-bold text-slate-800">Takvim</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><ChevronLeft size={18} /></button>
            <span className="text-sm font-semibold text-slate-700 w-40 text-center capitalize">{monthName}</span>
            <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"><ChevronRight size={18} /></button>
            <button onClick={goToday} className="ml-2 px-2.5 py-1 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100">Bugün</button>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X size={18} /></button>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-7 gap-px mb-1">
            {dayNames.map(d => <div key={d} className="text-center text-xs font-semibold text-slate-400 py-1">{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-px bg-slate-100 rounded-lg overflow-hidden">
            {cells.map((day, i) => {
              if (day === null) return <div key={`e${i}`} className="bg-slate-50 min-h-[72px]" />;
              const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
              const dayEvents = events[day] || [];
              const deadlineInfo = (() => {
                const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
                const info = getDeadlineInfo(dateStr);
                return dayEvents.some(e => e.type === "Bitiş") ? info : null;
              })();
              return (
                <div key={day} className={`bg-white min-h-[72px] p-1 relative cursor-default
                  ${isToday ? "ring-2 ring-inset ring-indigo-400" : ""}`}
                  onMouseEnter={() => dayEvents.length > 0 && setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}>
                  <span className={`text-xs font-medium inline-flex items-center justify-center w-5 h-5 rounded-full
                    ${isToday ? "bg-indigo-500 text-white" : "text-slate-600"}`}>{day}</span>
                  <div className="mt-0.5 space-y-0.5">
                    {dayEvents.slice(0, 3).map((ev, j) => (
                      <div key={j} className="flex items-center gap-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${ev.color} flex-shrink-0`} />
                        <span className="text-xs text-slate-600 truncate leading-tight">{ev.title.slice(0, 12)}</span>
                      </div>
                    ))}
                    {dayEvents.length > 3 && <span className="text-xs text-slate-400">+{dayEvents.length - 3}</span>}
                  </div>
                  {/* Tooltip on hover */}
                  {hoveredDay === day && dayEvents.length > 0 && (
                    <div className="absolute z-30 bottom-full left-1/2 -translate-x-1/2 mb-1 bg-slate-800 text-white rounded-lg shadow-lg p-2 min-w-[180px]">
                      {dayEvents.map((ev, j) => (
                        <div key={j} className="flex items-center gap-1.5 py-0.5">
                          <span className={`w-2 h-2 rounded-full ${ev.color} flex-shrink-0`} />
                          <span className="text-xs">{ev.title}</span>
                          <span className="text-xs text-slate-400 ml-auto">{ev.type}</span>
                        </div>
                      ))}
                      {deadlineInfo && <div className={`text-xs font-bold mt-1 pt-1 border-t border-slate-600 ${deadlineInfo.days <= 7 ? "text-red-400" : "text-amber-400"}`}>{deadlineInfo.label}</div>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
            <span className="flex items-center gap-1 text-xs text-slate-500"><span className="w-2 h-2 rounded-full bg-slate-400" />Başvuru</span>
            <span className="flex items-center gap-1 text-xs text-slate-500"><span className="w-2 h-2 rounded-full bg-emerald-500" />Konu Başlangıç</span>
            <span className="flex items-center gap-1 text-xs text-slate-500"><span className="w-2 h-2 rounded-full bg-indigo-500" />Proje Başlangıç</span>
            <span className="flex items-center gap-1 text-xs text-slate-500"><span className="w-2 h-2 rounded-full bg-red-500" />Bitiş</span>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────
export default function ArGeDashboard({ role, user, onLogout }) {
  const isAdmin = role === "admin";
  const [researchers, setResearchers] = useState(() => {
    try { const saved = localStorage.getItem("arge_researchers"); return saved ? JSON.parse(saved) : initialResearchers; } catch { return initialResearchers; }
  });
  const [topics, setTopics] = useState(() => {
    try { const saved = localStorage.getItem("arge_topics"); return saved ? JSON.parse(saved) : initialTopics; } catch { return initialTopics; }
  });
  const [projects, setProjects] = useState(() => {
    try { const saved = localStorage.getItem("arge_projects"); return saved ? JSON.parse(saved) : initialProjects; } catch { return initialProjects; }
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [topicStatusFilter, setTopicStatusFilter] = useState("");
  const [topicPriorityFilter, setTopicPriorityFilter] = useState("");
  const [projectStatusFilter, setProjectStatusFilter] = useState("");
  const [projectPriorityFilter, setProjectPriorityFilter] = useState("");
  const [researcherDeptFilter, setResearcherDeptFilter] = useState("");
  // Advanced filters
  const [showAdvRes, setShowAdvRes] = useState(false);
  const [showResearcherStats, setShowResearcherStats] = useState(false);
  const [showAdvTopic, setShowAdvTopic] = useState(false);
  const [showAdvProject, setShowAdvProject] = useState(false);
  const [advRes, setAdvRes] = useState({ unit: "", degree: "", status: "", hasPIExp: "", areaSearch: "" });
  const [advTopic, setAdvTopic] = useState({ projectType: "", category: "", researchMethod: "", hasProject: "", roleFilter: "" });
  const [advProject, setAdvProject] = useState({ type: "", fundingSource: "", budgetMin: "", budgetMax: "" });

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedResearcher, setSelectedResearcher] = useState(null);
  const [rolePopup, setRolePopup] = useState(null);
  const [addModal, setAddModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [showDeadlines, setShowDeadlines] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showQuickLinks, setShowQuickLinks] = useState(false);
  const [showTableView, setShowTableView] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [projectColDragOver, setProjectColDragOver] = useState(false);
  const [quickLinks, setQuickLinks] = useState(() => {
    try { const saved = localStorage.getItem("arge_quicklinks"); return saved ? JSON.parse(saved) : defaultQuickLinks; } catch { return defaultQuickLinks; }
  });
  const [roleConfigSt, setRoleConfig] = useState(() => {
    try { const s = localStorage.getItem("arge_cfg_roles"); return s ? JSON.parse(s) : DEFAULT_ROLE_CONFIG; } catch { return DEFAULT_ROLE_CONFIG; }
  });
  const [statusConfigSt, setStatusConfig] = useState(() => {
    try { const s = localStorage.getItem("arge_cfg_statuses"); return s ? JSON.parse(s) : DEFAULT_STATUS_CONFIG; } catch { return DEFAULT_STATUS_CONFIG; }
  });
  const [priorityConfigSt, setPriorityConfig] = useState(() => {
    try { const s = localStorage.getItem("arge_cfg_priorities"); return s ? JSON.parse(s) : DEFAULT_PRIORITY_CONFIG; } catch { return DEFAULT_PRIORITY_CONFIG; }
  });
  const [projectTypeOptionsSt, setProjectTypeOptions] = useState(() => {
    try { const s = localStorage.getItem("arge_cfg_ptypes"); return s ? JSON.parse(s) : DEFAULT_PROJECT_TYPES; } catch { return DEFAULT_PROJECT_TYPES; }
  });
  const [categoryOptionsSt, setCategoryOptions] = useState(() => {
    try { const s = localStorage.getItem("arge_cfg_categories"); return s ? JSON.parse(s) : DEFAULT_CATEGORY_OPTIONS; } catch { return DEFAULT_CATEGORY_OPTIONS; }
  });
  const [eduDegreeOptionsSt, setEduDegreeOptions] = useState(() => {
    try { const s = localStorage.getItem("arge_cfg_degrees"); return s ? JSON.parse(s) : DEFAULT_EDU_DEGREES; } catch { return DEFAULT_EDU_DEGREES; }
  });
  const [eduStatusOptionsSt, setEduStatusOptions] = useState(() => {
    try { const s = localStorage.getItem("arge_cfg_edustatus"); return s ? JSON.parse(s) : DEFAULT_EDU_STATUSES; } catch { return DEFAULT_EDU_STATUSES; }
  });
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => { localStorage.setItem("arge_researchers", JSON.stringify(researchers)); }, [researchers]);
  useEffect(() => { localStorage.setItem("arge_topics", JSON.stringify(topics)); }, [topics]);
  useEffect(() => { localStorage.setItem("arge_projects", JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem("arge_quicklinks", JSON.stringify(quickLinks)); }, [quickLinks]);
  useEffect(() => { localStorage.setItem("arge_cfg_roles", JSON.stringify(roleConfigSt)); }, [roleConfigSt]);
  useEffect(() => { localStorage.setItem("arge_cfg_statuses", JSON.stringify(statusConfigSt)); }, [statusConfigSt]);
  useEffect(() => { localStorage.setItem("arge_cfg_priorities", JSON.stringify(priorityConfigSt)); }, [priorityConfigSt]);
  useEffect(() => { localStorage.setItem("arge_cfg_ptypes", JSON.stringify(projectTypeOptionsSt)); }, [projectTypeOptionsSt]);
  useEffect(() => { localStorage.setItem("arge_cfg_categories", JSON.stringify(categoryOptionsSt)); }, [categoryOptionsSt]);
  useEffect(() => { localStorage.setItem("arge_cfg_degrees", JSON.stringify(eduDegreeOptionsSt)); }, [eduDegreeOptionsSt]);
  useEffect(() => { localStorage.setItem("arge_cfg_edustatus", JSON.stringify(eduStatusOptionsSt)); }, [eduStatusOptionsSt]);

  // Sync module-level config refs for sub-components
  roleConfig = roleConfigSt;
  statusConfig = statusConfigSt;
  priorityConfig = priorityConfigSt;
  projectTypeOptions = projectTypeOptionsSt;
  categoryOptions = categoryOptionsSt;
  eduDegreeOptions = eduDegreeOptionsSt;
  eduStatusOptions = eduStatusOptionsSt;

  const showToast = (message, type = "success") => { setToast({ message, type }); setTimeout(() => setToast(null), 3000); };

  const handleResearcherDropOnTopic = (topicId, researcherId, event) => {
    const topic = topics.find(t => t.id === topicId);
    if (topic?.researchers.some(r => r.researcherId === researcherId)) { showToast("Bu araştırmacı zaten bu konuya atanmış", "warning"); return; }
    setRolePopup({ topicId, researcherId, position: { x: event?.clientX || window.innerWidth / 2, y: event?.clientY || window.innerHeight / 2 } });
  };
  const handleRoleSelect = (role) => {
    if (!rolePopup) return;
    setTopics(prev => prev.map(t => t.id === rolePopup.topicId ? { ...t, researchers: [...t.researchers, { researcherId: rolePopup.researcherId, role }] } : t));
    const researcher = researchers.find(r => r.id === rolePopup.researcherId);
    showToast(`${researcher?.name} konuya ${roleConfig[role].label} olarak atandı`);
    setRolePopup(null);
  };
  const handleTopicDropOnProject = (projectId, topicId) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    if ((project.topics || []).includes(topicId)) { showToast("Bu konu zaten bu projeye ekli", "warning"); return; }
    const topic = topics.find(t => t.id === topicId);
    const topicResearchers = (topic?.researchers || []);
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const existingIds = new Set((p.researchers || []).map(r => r.researcherId));
      const newResearchers = topicResearchers.filter(r => !existingIds.has(r.researcherId));
      return { ...p, topics: [...(p.topics || []), topicId], researchers: [...(p.researchers || []), ...newResearchers] };
    }));
    showToast(`"${topic?.title}" projeye eklendi`);
  };
  const handleCreateProjectFromTopic = (topicId) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;
    const alreadyProject = projects.some(p => (p.topics || []).includes(topicId));
    if (alreadyProject) { showToast("Bu konu zaten bir projeye bağlı", "warning"); return; }
    const newProject = {
      id: `p_${Date.now()}`, title: topic.title, description: topic.description || "",
      type: topic.projectType || "", projectTypeDetail: topic.projectTypeDetail || "",
      status: "planning", priority: topic.priority || "medium",
      startDate: topic.startDate || "", endDate: topic.endDate || "",
      budget: 0, fundingSource: "", workLink: topic.workLink || "",
      topics: [topicId], tasks: [],
      researchers: [...(topic.researchers || [])],
    };
    setProjects(prev => [...prev, newProject]);
    setProjectStatusFilter(""); setProjectPriorityFilter("");
    showToast(`"${topic.title}" konusundan yeni proje oluşturuldu`);
  };
  const handleCancelProject = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;
    if (!confirm(`"${project.title}" projesi iptal edilecek ve tüm konular projelendirilmemiş olacak. Emin misiniz?`)) return;
    setProjects(prev => prev.filter(p => p.id !== projectId));
    showToast(`"${project.title}" projesi iptal edildi, konular serbest bırakıldı`, "warning");
    if (selectedItem?.id === projectId) { setSelectedItem(null); setSelectedType(null); }
  };

  // ─── DELETE TOPIC ───────────────────────────────────────
  const handleDeleteTopic = (topicId) => {
    const topic = topics.find(t => t.id === topicId);
    if (!topic) return;
    const linkedProject = projects.find(p => (p.topics || []).includes(topicId));
    let msg = `"${topic.title}" konusu kalıcı olarak silinecek.`;
    if (linkedProject) {
      const remainingTopics = (linkedProject.topics || []).filter(tid => tid !== topicId);
      if (remainingTopics.length === 0) {
        msg += `\n\n⚠️ DİKKAT: Bu konu "${linkedProject.title}" projesinin tek konusudur. Konu silinirse proje de tamamen silinecektir!`;
      } else {
        msg += `\n\n⚠️ Bu konu "${linkedProject.title}" projesiyle ilişkilidir. Konu projeden de çıkarılacaktır.`;
      }
    }
    msg += "\n\nBu işlem geri alınamaz. Devam etmek istiyor musunuz?";
    if (!confirm(msg)) return;
    // Remove topic from any project
    if (linkedProject) {
      const remainingTopics = (linkedProject.topics || []).filter(tid => tid !== topicId);
      if (remainingTopics.length === 0) {
        setProjects(prev => prev.filter(p => p.id !== linkedProject.id));
      } else {
        setProjects(prev => prev.map(p => p.id === linkedProject.id ? { ...p, topics: remainingTopics } : p));
      }
    }
    setTopics(prev => prev.filter(t => t.id !== topicId));
    showToast(`"${topic.title}" konusu silindi`, "warning");
    if (selectedItem?.id === topicId) { setSelectedItem(null); setSelectedType(null); }
  };

  // ─── DELETE RESEARCHER ──────────────────────────────────
  const handleDeleteResearcher = (researcherId) => {
    const researcher = researchers.find(r => r.id === researcherId);
    if (!researcher) return;
    const usedInTopics = topics.filter(t => (t.researchers || []).some(r => r.researcherId === researcherId));
    const usedInProjects = projects.filter(p => (p.researchers || []).some(r => r.researcherId === researcherId));
    let msg = `"${researcher.title ? researcher.title + " " : ""}${researcher.name}" kişisi kalıcı olarak silinecek.`;
    if (usedInTopics.length > 0 || usedInProjects.length > 0) {
      msg += `\n\n⚠️ DİKKAT: Bu kişi şu anda;`;
      if (usedInTopics.length > 0) {
        msg += `\n• ${usedInTopics.length} konuda (${usedInTopics.slice(0, 3).map(t => t.title).join(", ")}${usedInTopics.length > 3 ? "..." : ""})`;
      }
      if (usedInProjects.length > 0) {
        msg += `\n• ${usedInProjects.length} projede (${usedInProjects.slice(0, 3).map(p => p.title).join(", ")}${usedInProjects.length > 3 ? "..." : ""})`;
      }
      msg += `\n\ngörev almaktadır. Silinirse TÜM konulardan ve projelerden de kaldırılacaktır!`;
    }
    msg += "\n\nBu işlem geri alınamaz. Devam etmek istiyor musunuz?";
    if (!confirm(msg)) return;
    // Remove from all topics
    if (usedInTopics.length > 0) {
      setTopics(prev => prev.map(t => ({
        ...t,
        researchers: (t.researchers || []).filter(r => r.researcherId !== researcherId)
      })));
    }
    // Remove from all projects
    if (usedInProjects.length > 0) {
      setProjects(prev => prev.map(p => ({
        ...p,
        researchers: (p.researchers || []).filter(r => r.researcherId !== researcherId)
      })));
    }
    setResearchers(prev => prev.filter(r => r.id !== researcherId));
    showToast(`"${researcher.name}" silindi ve tüm atamalardan kaldırıldı`, "warning");
    if (selectedResearcher?.id === researcherId) setSelectedResearcher(null);
  };

  const handleRemoveTopicFromProject = (topicId) => {
    const project = projects.find(p => (p.topics || []).includes(topicId));
    if (!project) return;
    const topic = topics.find(t => t.id === topicId);
    const updatedTopics = (project.topics || []).filter(tid => tid !== topicId);
    if (updatedTopics.length === 0) {
      setProjects(prev => prev.filter(p => p.id !== project.id));
      showToast(`"${topic?.title}" projeden çıkarıldı ve proje silindi (son konu)`, "warning");
    } else {
      setProjects(prev => prev.map(p => p.id === project.id ? { ...p, topics: updatedTopics } : p));
      showToast(`"${topic?.title}" projeden çıkarıldı`);
    }
  };
  const handleUpdateItem = (updatedItem) => {
    if (selectedType === "topic") setTopics(prev => prev.map(t => t.id === updatedItem.id ? updatedItem : t));
    else setProjects(prev => prev.map(p => p.id === updatedItem.id ? updatedItem : p));
    setSelectedItem(updatedItem);
  };
  const handleUpdateResearcher = (updated) => {
    setResearchers(prev => prev.map(r => r.id === updated.id ? updated : r));
    setSelectedResearcher(updated);
  };
  const handleAddItem = (type, item) => {
    if (type === "researcher") setResearchers(prev => [...prev, item]);
    else if (type === "topic") setTopics(prev => [...prev, item]);
    else setProjects(prev => [...prev, item]);
    showToast(`${type === "researcher" ? "Araştırmacı" : type === "topic" ? "Konu" : "Proje"} eklendi`);
  };

  const institutions = useMemo(() => [...new Set(researchers.map(r => r.institution).filter(Boolean))], [researchers]);
  const getActiveWorkCount = useCallback((researcherId) =>
    topics.filter(t => t.researchers.some(r => r.researcherId === researcherId) && t.status !== "completed" && t.status !== "failed").length
  , [topics]);
  const filteredResearchers = useMemo(() => {
    const filtered = researchers.filter(r => {
      if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase()) && !r.researchAreas.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) && !r.institution?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (researcherDeptFilter && r.institution !== researcherDeptFilter) return false;
      if (advRes.unit && !(r.unit || "").toLowerCase().includes(advRes.unit.toLowerCase())) return false;
      if (advRes.degree && r.eduDegree !== advRes.degree) return false;
      if (advRes.status && r.eduStatus !== advRes.status) return false;
      if (advRes.hasPIExp === "yes" && !r.hasPIExperience) return false;
      if (advRes.hasPIExp === "no" && r.hasPIExperience) return false;
      if (advRes.areaSearch && !r.researchAreas.some(a => a.toLowerCase().includes(advRes.areaSearch.toLowerCase()))) return false;
      return true;
    });
    const hasAnyActive = filtered.some(r => getActiveWorkCount(r.id) > 0);
    if (!hasAnyActive) return filtered;
    return filtered.sort((a, b) => getActiveWorkCount(b.id) - getActiveWorkCount(a.id));
  }, [researchers, topics, searchQuery, researcherDeptFilter, advRes, getActiveWorkCount]);
  const researcherColumnStats = useMemo(() => {
    const uniqueResInTopics = (status) => {
      const ids = new Set();
      topics.filter(t => t.status === status).forEach(t => (t.researchers || []).forEach(r => ids.add(r.researcherId)));
      return ids.size;
    };
    const uniqueResInProjects = (status) => {
      const ids = new Set();
      projects.filter(p => p.status === status).forEach(p => {
        (p.researchers || []).forEach(r => ids.add(r.researcherId));
        (p.topics || []).forEach(tid => {
          const t = topics.find(x => x.id === tid);
          if (t) (t.researchers || []).forEach(r => ids.add(r.researcherId));
        });
      });
      return ids.size;
    };
    return {
      proposedTopicRes: uniqueResInTopics("proposed"),
      activeTopicRes: uniqueResInTopics("active"),
      completedTopicRes: uniqueResInTopics("completed"),
      proposedProjectRes: uniqueResInProjects("proposed") + uniqueResInProjects("planning"),
      activeProjectRes: uniqueResInProjects("active"),
      completedProjectRes: uniqueResInProjects("completed"),
    };
  }, [topics, projects]);
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const filteredTopics = useMemo(() => {
    const filtered = topics.filter(t => {
      if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase()) && !t.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (topicStatusFilter && t.status !== topicStatusFilter) return false;
      if (topicPriorityFilter && t.priority !== topicPriorityFilter) return false;
      if (advTopic.projectType && t.projectType !== advTopic.projectType) return false;
      if (advTopic.category && t.category !== advTopic.category) return false;
      if (advTopic.researchMethod && !(t.researchMethod || "").toLowerCase().includes(advTopic.researchMethod.toLowerCase())) return false;
      if (advTopic.hasProject === "yes" && !projects.some(p => (p.topics || []).includes(t.id))) return false;
      if (advTopic.hasProject === "no" && projects.some(p => (p.topics || []).includes(t.id))) return false;
      if (advTopic.roleFilter && !(t.researchers || []).some(r => r.role === advTopic.roleFilter)) return false;
      return true;
    });
    return filtered.sort((a, b) => {
      const aPrj = projects.some(p => (p.topics || []).includes(a.id)) ? 1 : 0;
      const bPrj = projects.some(p => (p.topics || []).includes(b.id)) ? 1 : 0;
      if (aPrj !== bPrj) return aPrj - bPrj;
      const aStatus = statusOrder[a.status] ?? 3;
      const bStatus = statusOrder[b.status] ?? 3;
      if (aStatus !== bStatus) return aStatus - bStatus;
      return (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2);
    });
  }, [topics, projects, searchQuery, topicStatusFilter, topicPriorityFilter, advTopic]);
  const filteredProjects = useMemo(() => {
    const filtered = projects.filter(p => {
      if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase()) && !p.description?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (projectStatusFilter && p.status !== projectStatusFilter) return false;
      if (projectPriorityFilter && p.priority !== projectPriorityFilter) return false;
      if (advProject.type && p.type !== advProject.type) return false;
      if (advProject.fundingSource && !(p.fundingSource || "").toLowerCase().includes(advProject.fundingSource.toLowerCase())) return false;
      if (advProject.budgetMin && (p.budget || 0) < Number(advProject.budgetMin)) return false;
      if (advProject.budgetMax && (p.budget || 0) > Number(advProject.budgetMax)) return false;
      return true;
    });
    return filtered.sort((a, b) => {
      const aStatus = statusOrder[a.status] ?? 3;
      const bStatus = statusOrder[b.status] ?? 3;
      if (aStatus !== bStatus) return aStatus - bStatus;
      return (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2);
    });
  }, [projects, searchQuery, projectStatusFilter, projectPriorityFilter, advProject]);

  const stats = useMemo(() => {
    const allTasks = [...topics.flatMap(t => t.tasks || []), ...projects.flatMap(p => p.tasks || [])];
    return {
      researchers: researchers.length,
      proposedTopics: topics.filter(t => t.status === "proposed").length,
      activeTopics: topics.filter(t => t.status === "active").length,
      completedTopics: topics.filter(t => t.status === "completed").length,
      proposedProjects: projects.filter(p => p.status === "planning" || p.status === "proposed").length,
      activeProjects: projects.filter(p => p.status === "active").length,
      completedProjects: projects.filter(p => p.status === "completed").length,
      totalTasks: allTasks.length,
      completedTasks: allTasks.filter(t => t.status === "done").length,
      inProgressTasks: allTasks.filter(t => t.status === "in_progress").length,
    };
  }, [researchers, topics, projects]);

  const deadlineCount = useMemo(() => {
    let count = 0;
    topics.forEach(t => { if (t.status !== "completed" && t.status !== "archived" && getDeadlineInfo(t.endDate)) count++; });
    projects.forEach(p => { if (p.status !== "completed" && p.status !== "archived" && getDeadlineInfo(p.endDate)) count++; });
    return count;
  }, [topics, projects]);

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden">
      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 px-5 py-3 flex items-center justify-between flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center"><Target size={18} className="text-white" /></div>
          <div><h1 className="text-base font-bold text-slate-800 leading-tight">Anadolu Üniversitesi <span className="text-slate-400 font-normal">|</span> Açıköğretim Fakültesi</h1><p className="text-xs text-slate-400">Ar-Ge Akademik Araştırma & Proje Yönetimi</p></div>
        </div>
        <div className="flex-1 max-w-md mx-6">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Araştırmacı, konu veya proje ara..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all" />
            {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"><X size={14} /></button>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Deadline Bell */}
          <div className="relative">
            <button onClick={() => { setShowDeadlines(!showDeadlines); setShowCalendar(false); }}
              className={`p-2 rounded-lg transition-colors ${showDeadlines ? "bg-amber-100 text-amber-600" : "hover:bg-slate-100 text-slate-500"}`}
              title="Yaklaşan Tarihler">
              <Bell size={18} />
              {deadlineCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px] leading-none">
                  {deadlineCount}
                </span>
              )}
            </button>
            {showDeadlines && <DeadlinePanel topics={topics} projects={projects} onClose={() => setShowDeadlines(false)} />}
          </div>
          {/* Calendar Button */}
          <button onClick={() => { setShowCalendar(true); setShowDeadlines(false); }}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            title="Takvim">
            <CalendarDays size={18} />
          </button>
          {/* Table View Button */}
          <button onClick={() => { setShowTableView(true); setShowDeadlines(false); }}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            title="Tablo Görünümü & Dışa Aktar">
            <Table2 size={18} />
          </button>
          {/* Stats Button */}
          <button onClick={() => { setShowStats(true); setShowDeadlines(false); }}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            title="İstatistikler">
            <BarChart3 size={18} />
          </button>
          {/* Leaderboard Button */}
          <button onClick={() => { setShowLeaderboard(true); setShowDeadlines(false); }}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            title="Leaderboard">
            <TrendingUp size={18} />
          </button>
          {/* Quick Links Button */}
          <div className="relative">
            <button onClick={() => { setShowQuickLinks(!showQuickLinks); setShowDeadlines(false); }}
              className={`p-2 rounded-lg transition-colors ${showQuickLinks ? "bg-indigo-100 text-indigo-600" : "hover:bg-slate-100 text-slate-500"}`}
              title="Bağlantılar">
              <Link2 size={18} />
            </button>
            {showQuickLinks && <QuickLinksPanel links={quickLinks} onChange={setQuickLinks} onClose={() => setShowQuickLinks(false)} />}
          </div>
          {/* Settings Button */}
          {isAdmin && <button onClick={() => { setShowSettings(true); setShowDeadlines(false); }}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            title="Ayarlar">
            <Wrench size={18} />
          </button>}
          <div className="w-px h-6 bg-slate-200" />
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs font-medium text-slate-700">{user?.displayName || "Kullanıcı"}</p>
              <p className="text-[10px] text-slate-400">{role === "admin" ? "Yönetici" : "Görüntüleyici"}</p>
            </div>
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-xs">
              {(user?.displayName || "K")[0]}
            </div>
            <button onClick={onLogout} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Çıkış Yap">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* STATS BAR */}
      <div className="bg-white border-b border-slate-200 px-5 py-2.5 flex items-center gap-3 flex-shrink-0 overflow-x-auto">
        <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-lg"><Users size={14} className="text-indigo-500" /><span className="text-xs text-slate-500">Araştırmacı</span><span className="text-sm font-bold text-indigo-700">{stats.researchers}</span></div>
        <div className="w-px h-6 bg-slate-200" />
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 rounded-lg"><BookOpen size={12} className="text-slate-400" /><span className="text-[11px] text-slate-500">Önerilen Konu</span><span className="text-xs font-bold text-slate-700">{stats.proposedTopics}</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-lg"><BookOpen size={12} className="text-emerald-500" /><span className="text-[11px] text-slate-500">Aktif Konu</span><span className="text-xs font-bold text-emerald-700">{stats.activeTopics}</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 rounded-lg"><BookOpen size={12} className="text-blue-500" /><span className="text-[11px] text-slate-500">Tamamlanan Konu</span><span className="text-xs font-bold text-blue-700">{stats.completedTopics}</span></div>
        <div className="w-px h-6 bg-slate-200" />
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 rounded-lg"><FolderKanban size={12} className="text-amber-500" /><span className="text-[11px] text-slate-500">Önerilen Proje</span><span className="text-xs font-bold text-amber-700">{stats.proposedProjects}</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-violet-50 rounded-lg"><FolderKanban size={12} className="text-violet-500" /><span className="text-[11px] text-slate-500">Aktif Proje</span><span className="text-xs font-bold text-violet-700">{stats.activeProjects}</span></div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-teal-50 rounded-lg"><FolderKanban size={12} className="text-teal-500" /><span className="text-[11px] text-slate-500">Tamamlanan Proje</span><span className="text-xs font-bold text-teal-700">{stats.completedProjects}</span></div>
        <div className="w-px h-6 bg-slate-200" />
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-sky-50 rounded-lg"><ListTodo size={12} className="text-sky-500" /><span className="text-[11px] text-slate-500">Görevler</span><span className="text-xs font-bold text-sky-700">{stats.completedTasks}/{stats.totalTasks}</span></div>
      </div>

      {/* MAIN */}
      <div className="flex-1 flex overflow-hidden">
        {/* COL 1: RESEARCHERS */}
        <div className="w-1/3 min-w-0 border-r border-slate-200 flex flex-col bg-white/50">
          <div className="p-3 border-b border-slate-100 space-y-2 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-700 flex items-center gap-1.5"><Users size={15} className="text-indigo-500" />Araştırmacılar<Badge className="bg-slate-100 text-slate-500 ml-1">{filteredResearchers.length}</Badge></h2>
                <button onClick={() => setShowResearcherStats(!showResearcherStats)}
                  className="flex items-center gap-1 mt-1 text-[10px] font-medium text-indigo-500 hover:text-indigo-700 transition-colors">
                  <BarChart3 size={11} />
                  <span>Araştırmacı İstatistikleri</span>
                  <ChevronDown size={10} className={`transition-transform ${showResearcherStats ? "rotate-180" : ""}`} />
                </button>
                {showResearcherStats && (
                  <div className="mt-1.5 bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-lg p-2 border border-slate-100 space-y-1.5">
                    <div className="grid grid-cols-3 gap-1">
                      <div className="text-center p-1.5 bg-white rounded border border-slate-100">
                        <p className="text-[9px] text-slate-400 mb-0.5">Önerilen Konu</p>
                        <p className="text-sm font-bold text-slate-600">{researcherColumnStats.proposedTopicRes}</p>
                        <p className="text-[8px] text-slate-300">kişi</p>
                      </div>
                      <div className="text-center p-1.5 bg-emerald-50 rounded border border-emerald-100">
                        <p className="text-[9px] text-emerald-500 mb-0.5">Aktif Konu</p>
                        <p className="text-sm font-bold text-emerald-600">{researcherColumnStats.activeTopicRes}</p>
                        <p className="text-[8px] text-emerald-300">kişi</p>
                      </div>
                      <div className="text-center p-1.5 bg-blue-50 rounded border border-blue-100">
                        <p className="text-[9px] text-blue-500 mb-0.5">Tamamlanan Konu</p>
                        <p className="text-sm font-bold text-blue-600">{researcherColumnStats.completedTopicRes}</p>
                        <p className="text-[8px] text-blue-300">kişi</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <div className="text-center p-1.5 bg-white rounded border border-slate-100">
                        <p className="text-[9px] text-slate-400 mb-0.5">Önerilen Proje</p>
                        <p className="text-sm font-bold text-amber-600">{researcherColumnStats.proposedProjectRes}</p>
                        <p className="text-[8px] text-slate-300">kişi</p>
                      </div>
                      <div className="text-center p-1.5 bg-violet-50 rounded border border-violet-100">
                        <p className="text-[9px] text-violet-500 mb-0.5">Aktif Proje</p>
                        <p className="text-sm font-bold text-violet-600">{researcherColumnStats.activeProjectRes}</p>
                        <p className="text-[8px] text-violet-300">kişi</p>
                      </div>
                      <div className="text-center p-1.5 bg-blue-50 rounded border border-blue-100">
                        <p className="text-[9px] text-blue-500 mb-0.5">Tamamlanan Proje</p>
                        <p className="text-sm font-bold text-blue-600">{researcherColumnStats.completedProjectRes}</p>
                        <p className="text-[8px] text-blue-300">kişi</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setShowAdvRes(!showAdvRes)} className={`p-1.5 rounded-lg transition-colors ${showAdvRes ? "bg-indigo-100 text-indigo-600" : "hover:bg-slate-100 text-slate-400"}`} title="Detaylı Filtre"><Filter size={14} /></button>
                {isAdmin && <button onClick={() => setAddModal("researcher")} className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-500 transition-colors" title="Yeni Araştırmacı"><Plus size={16} /></button>}
              </div>
            </div>
            <FilterDropdown label="Kurum" icon={Building2}
              options={institutions.map(d => ({ value: d, label: d.length > 20 ? d.slice(0, 20) + "..." : d }))}
              value={researcherDeptFilter} onChange={setResearcherDeptFilter} />
            {showAdvRes && (
              <div className="bg-indigo-50/50 rounded-lg p-2.5 space-y-2 border border-indigo-100">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Detaylı Filtre</span>
                  <button onClick={() => setAdvRes({ unit: "", degree: "", status: "", hasPIExp: "", areaSearch: "" })} className="text-[10px] text-slate-400 hover:text-red-500">Temizle</button>
                </div>
                <input value={advRes.unit} onChange={e => setAdvRes({ ...advRes, unit: e.target.value })} placeholder="Birim ara..." className="w-full text-xs border border-slate-200 rounded px-2 py-1.5 bg-white focus:ring-1 focus:ring-indigo-200 focus:border-indigo-300 outline-none" />
                <input value={advRes.areaSearch} onChange={e => setAdvRes({ ...advRes, areaSearch: e.target.value })} placeholder="Araştırma alanı ara..." className="w-full text-xs border border-slate-200 rounded px-2 py-1.5 bg-white focus:ring-1 focus:ring-indigo-200 focus:border-indigo-300 outline-none" />
                <div className="grid grid-cols-2 gap-1.5">
                  <select value={advRes.degree} onChange={e => setAdvRes({ ...advRes, degree: e.target.value })} className="text-xs border border-slate-200 rounded px-2 py-1.5 bg-white focus:ring-1 focus:ring-indigo-200 outline-none">
                    <option value="">Derece</option>
                    {eduDegreeOptions.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <select value={advRes.status} onChange={e => setAdvRes({ ...advRes, status: e.target.value })} className="text-xs border border-slate-200 rounded px-2 py-1.5 bg-white focus:ring-1 focus:ring-indigo-200 outline-none">
                    <option value="">Eğt. Durumu</option>
                    {eduStatusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <select value={advRes.hasPIExp} onChange={e => setAdvRes({ ...advRes, hasPIExp: e.target.value })} className="w-full text-xs border border-slate-200 rounded px-2 py-1.5 bg-white focus:ring-1 focus:ring-indigo-200 outline-none">
                  <option value="">PI Deneyimi</option>
                  <option value="yes">Var</option>
                  <option value="no">Yok</option>
                </select>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredResearchers.map(r => <ResearcherCard key={r.id} researcher={r} isAdmin={isAdmin} topics={topics} onClick={setSelectedResearcher} />)}
            {filteredResearchers.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Araştırmacı bulunamadı</p>}
          </div>
        </div>

        {/* COL 2: TOPICS */}
        <div className="w-1/3 min-w-0 border-r border-slate-200 flex flex-col bg-white/30">
          <div className="p-3 border-b border-slate-100 space-y-2 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-700 flex items-center gap-1.5"><BookOpen size={15} className="text-emerald-500" />Konular<Badge className="bg-slate-100 text-slate-500 ml-1">{filteredTopics.length}</Badge></h2>
              <div className="flex items-center gap-1">
                <button onClick={() => setShowAdvTopic(!showAdvTopic)} className={`p-1.5 rounded-lg transition-colors ${showAdvTopic ? "bg-emerald-100 text-emerald-600" : "hover:bg-slate-100 text-slate-400"}`} title="Detaylı Filtre"><Filter size={14} /></button>
                {isAdmin && <button onClick={() => setAddModal("topic")} className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-500 transition-colors" title="Yeni Konu"><Plus size={16} /></button>}
              </div>
            </div>
            <div className="flex gap-2">
              <FilterDropdown label="Durum" icon={Filter} options={[{ value: "proposed", label: "Önerilen", dot: "bg-slate-400" }, { value: "active", label: "Aktif", dot: "bg-emerald-500" }, { value: "completed", label: "Tamamlandı", dot: "bg-blue-500" }, { value: "failed", label: "Tamamlanamadı", dot: "bg-red-500" }]} value={topicStatusFilter} onChange={setTopicStatusFilter} />
              <FilterDropdown label="Öncelik" icon={Target} options={[{ value: "low", label: "Düşük" }, { value: "medium", label: "Orta" }, { value: "high", label: "Yüksek" }, { value: "critical", label: "Kritik" }]} value={topicPriorityFilter} onChange={setTopicPriorityFilter} />
            </div>
            {showAdvTopic && (
              <div className="bg-emerald-50/50 rounded-lg p-2.5 space-y-2 border border-emerald-100">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Detaylı Filtre</span>
                  <button onClick={() => setAdvTopic({ projectType: "", category: "", researchMethod: "", hasProject: "", roleFilter: "" })} className="text-[10px] text-slate-400 hover:text-red-500">Temizle</button>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <select value={advTopic.projectType} onChange={e => setAdvTopic({ ...advTopic, projectType: e.target.value })} className="text-xs border border-slate-200 rounded px-2 py-1.5 bg-white focus:ring-1 focus:ring-emerald-200 outline-none">
                    <option value="">Proje Türü</option>
                    {projectTypeOptions.map(pt => <option key={pt} value={pt}>{pt}</option>)}
                  </select>
                  <select value={advTopic.category} onChange={e => setAdvTopic({ ...advTopic, category: e.target.value })} className="text-xs border border-slate-200 rounded px-2 py-1.5 bg-white focus:ring-1 focus:ring-emerald-200 outline-none">
                    <option value="">Kategori</option>
                    {[...new Set(topics.map(t => t.category).filter(Boolean))].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <input value={advTopic.researchMethod} onChange={e => setAdvTopic({ ...advTopic, researchMethod: e.target.value })} placeholder="Araştırma yöntemi ara..." className="w-full text-xs border border-slate-200 rounded px-2 py-1.5 bg-white focus:ring-1 focus:ring-emerald-200 focus:border-emerald-300 outline-none" />
                <div className="grid grid-cols-2 gap-1.5">
                  <select value={advTopic.hasProject} onChange={e => setAdvTopic({ ...advTopic, hasProject: e.target.value })} className="text-xs border border-slate-200 rounded px-2 py-1.5 bg-white focus:ring-1 focus:ring-emerald-200 outline-none">
                    <option value="">Proje Durumu</option>
                    <option value="yes">Projelendirilmiş</option>
                    <option value="no">Projelendirilmemiş</option>
                  </select>
                  <select value={advTopic.roleFilter} onChange={e => setAdvTopic({ ...advTopic, roleFilter: e.target.value })} className="text-xs border border-slate-200 rounded px-2 py-1.5 bg-white focus:ring-1 focus:ring-emerald-200 outline-none">
                    <option value="">Rol Filtresi</option>
                    {Object.entries(roleConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredTopics.map(t => <TopicCard key={t.id} topic={t} allResearchers={researchers} isAdmin={isAdmin} projects={projects} onRemoveFromProject={handleRemoveTopicFromProject} onDrop={handleResearcherDropOnTopic} onClick={(topic) => { setSelectedItem(topic); setSelectedType("topic"); }} />)}
            {filteredTopics.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Konu bulunamadı</p>}
          </div>
        </div>

        {/* COL 3: PROJECTS */}
        <div className="w-1/3 min-w-0 flex flex-col">
          <div className="p-3 border-b border-slate-100 space-y-2 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-700 flex items-center gap-1.5"><FolderKanban size={15} className="text-violet-500" />Projeler<Badge className="bg-slate-100 text-slate-500 ml-1">{filteredProjects.length}</Badge></h2>
              <div className="flex items-center gap-1">
                <button onClick={() => setShowAdvProject(!showAdvProject)} className={`p-1.5 rounded-lg transition-colors ${showAdvProject ? "bg-violet-100 text-violet-600" : "hover:bg-slate-100 text-slate-400"}`} title="Detaylı Filtre"><Filter size={14} /></button>
                {isAdmin && <button onClick={() => setAddModal("project")} className="p-1.5 rounded-lg hover:bg-violet-50 text-violet-500 transition-colors" title="Yeni Proje"><Plus size={16} /></button>}
              </div>
            </div>
            <div className="flex gap-2">
              <FilterDropdown label="Durum" icon={Filter} options={[{ value: "planning", label: "İşlem Yapılıyor", dot: "bg-amber-500" }, { value: "active", label: "Aktif", dot: "bg-emerald-500" }, { value: "review", label: "İnceleme", dot: "bg-purple-500" }, { value: "completed", label: "Tamamlandı", dot: "bg-blue-500" }, { value: "failed", label: "Tamamlanamadı", dot: "bg-red-500" }]} value={projectStatusFilter} onChange={setProjectStatusFilter} />
              <FilterDropdown label="Öncelik" icon={Target} options={[{ value: "low", label: "Düşük" }, { value: "medium", label: "Orta" }, { value: "high", label: "Yüksek" }, { value: "critical", label: "Kritik" }]} value={projectPriorityFilter} onChange={setProjectPriorityFilter} />
            </div>
            {showAdvProject && (
              <div className="bg-violet-50/50 rounded-lg p-2.5 space-y-2 border border-violet-100">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wider">Detaylı Filtre</span>
                  <button onClick={() => setAdvProject({ type: "", fundingSource: "", budgetMin: "", budgetMax: "" })} className="text-[10px] text-slate-400 hover:text-red-500">Temizle</button>
                </div>
                <select value={advProject.type} onChange={e => setAdvProject({ ...advProject, type: e.target.value })} className="w-full text-xs border border-slate-200 rounded px-2 py-1.5 bg-white focus:ring-1 focus:ring-violet-200 outline-none">
                  <option value="">Proje Türü</option>
                  {projectTypeOptions.map(pt => <option key={pt} value={pt}>{pt}</option>)}
                </select>
                <input value={advProject.fundingSource} onChange={e => setAdvProject({ ...advProject, fundingSource: e.target.value })} placeholder="Fon kaynağı ara..." className="w-full text-xs border border-slate-200 rounded px-2 py-1.5 bg-white focus:ring-1 focus:ring-violet-200 focus:border-violet-300 outline-none" />
                <div className="grid grid-cols-2 gap-1.5">
                  <input type="number" value={advProject.budgetMin} onChange={e => setAdvProject({ ...advProject, budgetMin: e.target.value })} placeholder="Min bütçe (₺)" className="text-xs border border-slate-200 rounded px-2 py-1.5 bg-white focus:ring-1 focus:ring-violet-200 outline-none" />
                  <input type="number" value={advProject.budgetMax} onChange={e => setAdvProject({ ...advProject, budgetMax: e.target.value })} placeholder="Max bütçe (₺)" className="text-xs border border-slate-200 rounded px-2 py-1.5 bg-white focus:ring-1 focus:ring-violet-200 outline-none" />
                </div>
              </div>
            )}
          </div>
          <div className={`flex-1 overflow-y-auto p-3 space-y-2 transition-colors duration-200 ${projectColDragOver ? "bg-violet-50 ring-2 ring-inset ring-violet-300 rounded-lg" : ""}`}
            onDragOver={(e) => { e.preventDefault(); const t = e.dataTransfer.types; if (t) setProjectColDragOver(true); }}
            onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setProjectColDragOver(false); }}
            onDrop={(e) => {
              if (!isAdmin) return;
              e.preventDefault(); setProjectColDragOver(false);
              const type = e.dataTransfer.getData("type"); const id = e.dataTransfer.getData("id");
              if (type === "topic") handleCreateProjectFromTopic(id);
            }}>
            {filteredProjects.map(p => <ProjectCard key={p.id} project={p} topics={topics} allResearchers={researchers} isAdmin={isAdmin} onDrop={handleTopicDropOnProject} onCancelProject={handleCancelProject} onClick={(project) => { setSelectedItem(project); setSelectedType("project"); }} />)}
            {filteredProjects.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Proje bulunamadı</p>}
            {projectColDragOver && (
              <div className="border-2 border-dashed border-violet-400 rounded-xl p-4 text-center animate-slide-up">
                <FolderKanban size={24} className="text-violet-400 mx-auto mb-1" />
                <p className="text-sm font-medium text-violet-600">Konuyu buraya bırakarak yeni proje oluştur</p>
                <p className="text-xs text-violet-400 mt-0.5">Konu bilgileri projeye aktarılacak</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODALS */}
      {rolePopup && <RoleSelectPopup position={rolePopup.position} onSelect={handleRoleSelect} onCancel={() => setRolePopup(null)} />}
      {selectedResearcher && <ResearcherDetailModal researcher={selectedResearcher} topics={topics} projects={projects} isAdmin={isAdmin} onClose={() => setSelectedResearcher(null)} onUpdate={handleUpdateResearcher} onDeleteResearcher={handleDeleteResearcher} onSelectTopic={(t) => { setSelectedResearcher(null); setSelectedItem(t); setSelectedType("topic"); }} />}
      {selectedItem && <DetailModal item={selectedItem} type={selectedType} allResearchers={researchers} topics={topics} projects={projects} isAdmin={isAdmin} onClose={() => { setSelectedItem(null); setSelectedType(null); }} onUpdate={handleUpdateItem} onRemoveFromProject={handleRemoveTopicFromProject} onCancelProject={handleCancelProject} onDeleteTopic={handleDeleteTopic} onSelectResearcher={(r) => { setSelectedItem(null); setSelectedType(null); setSelectedResearcher(r); }} onSelectTopic={(t) => { setSelectedItem(t); setSelectedType("topic"); }} />}
      {addModal && isAdmin && <AddItemModal type={addModal} allTopics={topics} onAdd={(item) => handleAddItem(addModal, item)} onClose={() => setAddModal(null)} />}
      {showCalendar && <CalendarModal topics={topics} projects={projects} onClose={() => setShowCalendar(false)} />}
      {showLeaderboard && <LeaderboardModal researchers={researchers} topics={topics} projects={projects} onClose={() => setShowLeaderboard(false)} />}
      {showTableView && <TableViewModal researchers={researchers} topics={topics} projects={projects} onClose={() => setShowTableView(false)} />}
      {showStats && <StatsModal researchers={researchers} topics={topics} projects={projects} onClose={() => setShowStats(false)} />}
      {showSettings && isAdmin && <SettingsModal
        roleConfig={roleConfig} onRoleConfigChange={setRoleConfig}
        statusConfig={statusConfig} onStatusConfigChange={setStatusConfig}
        priorityConfig={priorityConfig} onPriorityConfigChange={setPriorityConfig}
        projectTypeOptions={projectTypeOptions} onProjectTypeOptionsChange={setProjectTypeOptions}
        categoryOptions={categoryOptions} onCategoryOptionsChange={setCategoryOptions}
        eduDegreeOptions={eduDegreeOptions} onEduDegreeOptionsChange={setEduDegreeOptions}
        eduStatusOptions={eduStatusOptions} onEduStatusOptionsChange={setEduStatusOptions}
        onResetDefaults={() => {
          if (confirm("Tüm ayarları varsayılana sıfırlamak istediğinize emin misiniz?")) {
            setRoleConfig(DEFAULT_ROLE_CONFIG); setStatusConfig(DEFAULT_STATUS_CONFIG);
            setPriorityConfig(DEFAULT_PRIORITY_CONFIG); setProjectTypeOptions(DEFAULT_PROJECT_TYPES);
            setCategoryOptions(DEFAULT_CATEGORY_OPTIONS); setEduDegreeOptions(DEFAULT_EDU_DEGREES);
            setEduStatusOptions(DEFAULT_EDU_STATUSES);
          }
        }}
        onExportData={() => {
          const data = {
            version: 1,
            exportDate: new Date().toISOString(),
            researchers, topics, projects, quickLinks,
            config: {
              roles: roleConfigSt, statuses: statusConfigSt, priorities: priorityConfigSt,
              projectTypes: projectTypeOptionsSt, categories: categoryOptionsSt,
              eduDegrees: eduDegreeOptionsSt, eduStatuses: eduStatusOptionsSt,
            }
          };
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url; a.download = `arge-dashboard-veri-${new Date().toISOString().slice(0, 10)}.json`;
          a.click(); URL.revokeObjectURL(url);
          showToast("Veriler dışa aktarıldı!");
        }}
        onImportData={(data) => {
          if (!data.researchers || !data.topics) { alert("Geçersiz veri dosyası!"); return; }
          if (!confirm(`Bu dosyada ${data.researchers?.length || 0} araştırmacı, ${data.topics?.length || 0} konu, ${data.projects?.length || 0} proje var.\n\nMevcut tüm veriler bu dosyadakiyle değiştirilecek. Devam etmek istiyor musunuz?`)) return;
          setResearchers(data.researchers || []);
          setTopics(data.topics || []);
          setProjects(data.projects || []);
          if (data.quickLinks) setQuickLinks(data.quickLinks);
          if (data.config) {
            if (data.config.roles) setRoleConfig(data.config.roles);
            if (data.config.statuses) setStatusConfig(data.config.statuses);
            if (data.config.priorities) setPriorityConfig(data.config.priorities);
            if (data.config.projectTypes) setProjectTypeOptions(data.config.projectTypes);
            if (data.config.categories) setCategoryOptions(data.config.categories);
            if (data.config.eduDegrees) setEduDegreeOptions(data.config.eduDegrees);
            if (data.config.eduStatuses) setEduStatusOptions(data.config.eduStatuses);
          }
          showToast(`Veriler içe aktarıldı: ${data.researchers.length} araştırmacı, ${data.topics.length} konu, ${(data.projects || []).length} proje`);
        }}
        onResetAllData={() => {
          if (!confirm("⚠️ DİKKAT: Tüm araştırmacılar, konular, projeler ve ayarlar başlangıç haline döndürülecek.\n\nBu işlem geri alınamaz! Devam etmek istiyor musunuz?")) return;
          setResearchers(initialResearchers);
          setTopics(initialTopics);
          setProjects(initialProjects);
          setQuickLinks([]);
          setRoleConfig(DEFAULT_ROLE_CONFIG); setStatusConfig(DEFAULT_STATUS_CONFIG);
          setPriorityConfig(DEFAULT_PRIORITY_CONFIG); setProjectTypeOptions(DEFAULT_PROJECT_TYPES);
          setCategoryOptions(DEFAULT_CATEGORY_OPTIONS); setEduDegreeOptions(DEFAULT_EDU_DEGREES);
          setEduStatusOptions(DEFAULT_EDU_STATUSES);
          showToast("Tüm veriler sıfırlandı", "warning");
        }}
        onClose={() => setShowSettings(false)}
      />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 px-5 py-1.5 flex items-center justify-center gap-1.5 text-[10px] text-slate-400 flex-shrink-0 select-none">
        <span>&#169; SEÖ, 2026</span>
        <span className="text-slate-300">|</span>
        <span>Bu uygulama, Anadolu Üniversitesi Açıköğretim Fakültesi Ar-Ge birimi içi bilgi amaçlı olup izinsiz kullanılamaz.</span>
      </footer>

      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slideUp 0.3s ease-out; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
}
