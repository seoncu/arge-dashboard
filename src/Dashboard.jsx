import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import { db } from "./firebase";
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";

// ─── Timeout Wrapper — Firestore askıda kalma engeli ───
function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise(function(_, reject) {
      setTimeout(function() {
        reject(new Error("TIMEOUT (" + ms + "ms): " + (label || "Firestore işlemi") + " yanıt vermedi. Güvenlik kurallarını kontrol edin!"));
      }, ms);
    })
  ]);
}
import {
  Users, BookOpen, FolderKanban, GripVertical, X, Plus, Search,
  Filter, ChevronDown, Check, Clock, AlertCircle, ArrowRight,
  Trash2, Edit3, UserPlus, ListTodo, BarChart3, Settings,
  LogOut, Eye, Tag, Calendar, Target, TrendingUp, CheckCircle2,
  Circle, Timer, ChevronRight, Layers, UserCheck, FileText, Activity,
  Globe, Phone, Mail, GraduationCap, Building2, Wrench, Award,
  Languages, ExternalLink, StickyNote, Briefcase, MapPin,
  Bell, CalendarDays, ChevronLeft, AlertTriangle, Link2, Pencil,
  Table2, Download, Upload, DatabaseBackup, Maximize2, Minimize2, Send, Bot, RefreshCw, CloudUpload,
  Lightbulb, Undo2, Loader2
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
    hasPIExperience: false, isAofMember: true,
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
    hasPIExperience: false, isAofMember: true,
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
    hasPIExperience: false, isAofMember: true,
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
    hasPIExperience: false, isAofMember: true,
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
    hasPIExperience: false, isAofMember: false,
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
    hasPIExperience: false, isAofMember: true,
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
    hasPIExperience: false, isAofMember: true,
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
    hasPIExperience: false, isAofMember: true,
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
    hasPIExperience: false, isAofMember: true,
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
    hasPIExperience: false, isAofMember: true,
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
    hasPIExperience: false, isAofMember: true,
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
    hasPIExperience: false, isAofMember: true,
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
    hasPIExperience: false, isAofMember: true,
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
    hasPIExperience: false, isAofMember: true,
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
    hasPIExperience: false, isAofMember: true,
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
    hasPIExperience: false, isAofMember: true,
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
    hasPIExperience: false, isAofMember: true,
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
    hasPIExperience: false, isAofMember: true,
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
    hasPIExperience: false, isAofMember: true,
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
    hasPIExperience: false, isAofMember: true,
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
    hasPIExperience: false, isAofMember: true,
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
    hasPIExperience: false, isAofMember: true,
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
    hasPIExperience: false, isAofMember: true,
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
    hasPIExperience: false, isAofMember: true,
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
    hasPIExperience: false, isAofMember: true,
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
    hasPIExperience: false, isAofMember: true,
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
    hasPIExperience: false, isAofMember: true,
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
    hasPIExperience: false, isAofMember: true,
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
    hasPIExperience: false, isAofMember: true,
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
    hasPIExperience: false, isAofMember: true,
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
    hasPIExperience: false, isAofMember: true,
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
    hasPIExperience: false, isAofMember: false,
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
    hasPIExperience: false, isAofMember: false,
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
    hasPIExperience: false, isAofMember: false,
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
  review: { label: "İnceleme", color: "bg-purple-100 text-indigo-700", dot: "bg-purple-500" },
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
  advisor: { label: "Danışman", color: "bg-purple-100 text-indigo-700", weight: 2 },
  scholar: { label: "Bursiyer", color: "bg-cyan-100 text-cyan-700", weight: 1 },
};
const taskStatusConfig = {
  todo: { label: "Yapılacak", icon: <Circle size={14} className="text-slate-400" />, color: "text-slate-500" },
  in_progress: { label: "Devam Ediyor", icon: <Timer size={14} className="text-blue-500" />, color: "text-blue-600" },
  done: { label: "Tamamlandı", icon: <CheckCircle2 size={14} className="text-emerald-500" />, color: "text-emerald-600" },
};
const DEFAULT_EDU_DEGREES = ["Lisans", "Yüksek Lisans", "Doktora", "Doçentlik", "Profesörlük"];
const DEFAULT_EDU_STATUSES = ["Devam Ediyor", "Mezun", "Doktora Devam Ediyor", "Doçentlik Aşamasında"];
const COUNTRIES = [
  "Türkiye","Almanya","ABD","İngiltere","Fransa","İtalya","İspanya","Hollanda","Belçika","İsveç",
  "Norveç","Danimarka","Finlandiya","Avusturya","İsviçre","Polonya","Çekya","Macaristan","Romanya","Bulgaristan",
  "Yunanistan","Portekiz","İrlanda","Hırvatistan","Slovenya","Slovakya","Litvanya","Letonya","Estonya","Lüksemburg",
  "Malta","Kıbrıs","Japonya","Çin","Güney Kore","Hindistan","Kanada","Avustralya","Brezilya","Meksika",
  "Arjantin","Rusya","Ukrayna","Gürcistan","Azerbaycan","Kazakistan","İsrail","Mısır","Güney Afrika","Nijerya",
  "Fas","Tunus","Suudi Arabistan","BAE","Katar","Pakistan","Endonezya","Malezya","Singapur","Tayland",
  "Vietnam","Filipinler","Yeni Zelanda","Şili","Kolombiya","Peru","Sırbistan","Bosna Hersek","Karadağ","Arnavutluk",
  "Kuzey Makedonya","Kosova","Moldova","Belarus","İzlanda","Tayvan"
].sort((a,b) => a.localeCompare(b, "tr"));

const DEFAULT_INSTITUTION = "ANADOLU ÜNİVERSİTESİ AÇIKÖĞRETİM FAKÜLTESİ";
const toUpperTR = s => s.toLocaleUpperCase("tr-TR");

// Tüm projelerden bilinen kurumları çıkar (autocomplete için)
const getKnownInstitutions = (projects) => {
  const set = new Set([DEFAULT_INSTITUTION]);
  (projects || []).forEach(p => {
    if (p.piInstitution) set.add(toUpperTR(p.piInstitution));
    (p.partnerInstitutions || []).forEach(i => set.add(toUpperTR(i)));
  });
  return [...set].sort((a, b) => a.localeCompare(b, "tr"));
};
const DEFAULT_CATEGORY_OPTIONS = ["Ar-Ge İçi", "Ortak Çalışma", "Diğer"];
const DEFAULT_INDEX_TYPES = [
  { id: "sci", label: "SCI", coefficient: 10, color: "#3b82f6" },
  { id: "sci-e", label: "SCI-E", coefficient: 9, color: "#06b6d4" },
  { id: "ssci", label: "SSCI", coefficient: 8, color: "#8b5cf6" },
  { id: "ahci", label: "AHCI", coefficient: 7, color: "#ec4899" },
  { id: "esci", label: "ESCI", coefficient: 6, color: "#f59e0b" },
  { id: "scopus", label: "Scopus", coefficient: 5, color: "#14b8a6" },
  { id: "tr-dizin", label: "TR Dizin", coefficient: 4, color: "#10b981" },
  { id: "diger", label: "Diğer", coefficient: 2, color: "#94a3b8" },
];
const DEFAULT_PROJECT_TYPE_COEFF = 5;

// Module-level config refs (synced from component state on each render)
let roleConfig = DEFAULT_ROLE_CONFIG;
let statusConfig = DEFAULT_STATUS_CONFIG;
let priorityConfig = DEFAULT_PRIORITY_CONFIG;
let projectTypeOptions = DEFAULT_PROJECT_TYPES;
let categoryOptions = DEFAULT_CATEGORY_OPTIONS;
let eduDegreeOptions = DEFAULT_EDU_DEGREES;
let eduStatusOptions = DEFAULT_EDU_STATUSES;
let indexTypesConfig = DEFAULT_INDEX_TYPES;
let projectTypeCoeff = DEFAULT_PROJECT_TYPE_COEFF;

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
    <div className={`fixed bottom-6 left-6 z-[60] ${colors[type]} text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-slide-up text-sm font-medium`}>
      {type === "success" && <CheckCircle2 size={16} />}{type === "info" && <Activity size={16} />}
      {message}
      <button onClick={onClose} className="ml-2 hover:bg-white/20 rounded p-0.5"><X size={14} /></button>
    </div>
  );
};

// ─── RESEARCHER CARD (Compact — just name shown, click for full profile) ──
const ResearcherCard = ({ researcher, onClick, isAdmin, topics, projects, maximized, editingBy }) => {
  const myTopics = (topics || []).filter(t => t.researchers.some(r => r.researcherId === researcher.id));
  const totalCount = myTopics.length;
  const isProjected = (t) => (projects || []).some(p => (p.topics || []).includes(t.id));
  // Her durum için projelendirilen / projelendirilmeyen ayrımı
  const proposedFree = myTopics.filter(t => t.status === "proposed" && !isProjected(t)).length;
  const proposedProj = myTopics.filter(t => t.status === "proposed" && isProjected(t)).length;
  const activeFree = myTopics.filter(t => t.status === "active" && !isProjected(t)).length;
  const activeProj = myTopics.filter(t => t.status === "active" && isProjected(t)).length;
  const completedFree = myTopics.filter(t => t.status === "completed" && !isProjected(t)).length;
  const completedProj = myTopics.filter(t => t.status === "completed" && isProjected(t)).length;
  const failedCount = myTopics.filter(t => t.status === "failed").length;
  const proposedCount = proposedFree + proposedProj;
  const activeCount = activeFree + activeProj;
  const completedCount = completedFree + completedProj;
  // Proje türü istatistikleri (sadece projelendirilmiş konular)
  const projectedTopics = myTopics.filter(t => isProjected(t));
  const projectedCount = projectedTopics.length;
  const projectTypeCount = {};
  projectedTopics.forEach(t => { if (t.projectType) projectTypeCount[t.projectType] = (projectTypeCount[t.projectType] || 0) + 1; });
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
      className={`bg-white rounded-xl border cursor-grab active:cursor-grabbing
        hover:shadow-md transition-all duration-200 group relative ${maximized ? "p-4" : "p-3"} ${
        editingBy ? `${editingBy.color.border} border-2 ring-1 ${editingBy.color.ring} shadow-md` : "border-slate-200 hover:border-indigo-200"
      }`}
    >
      {editingBy && (
        <div className={`absolute -top-2.5 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold text-white ${editingBy.color.bg} shadow-sm z-10`}>
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          {editingBy.displayName} düzenliyor
        </div>
      )}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar name={researcher.name} color={researcher.color} size="md" />
          {totalCount > 0 && (
            <div className={`absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-white shadow-sm ${activeCount > 0 ? "bg-emerald-500" : completedCount > 0 ? "bg-blue-500" : "bg-slate-400"}`}
              title={`${totalCount} konu: ${proposedCount} önerilen, ${activeCount} aktif, ${completedCount} tamamlanan${projectedCount > 0 ? ` (${projectedCount} projelendirilen)` : ""}`}>
              {totalCount}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-slate-800 truncate ${maximized ? "text-base" : "text-sm"}`}>{researcher.title} {researcher.name}</p>
          <p className={`text-slate-500 truncate ${maximized ? "text-sm" : "text-xs"}`}>{researcher.institution}{researcher.unit ? ` · ${researcher.unit}` : ""}</p>
          {totalCount > 0 ? (
            <div className="flex items-center gap-1 mt-1 flex-wrap">
              {proposedFree > 0 && <Badge className="bg-slate-100 text-slate-600">{proposedFree} önerilen konu</Badge>}
              {proposedProj > 0 && <Badge className="bg-violet-50 text-violet-600">{proposedProj} projelendirilen önerilen konu</Badge>}
              {activeFree > 0 && <Badge className="bg-emerald-50 text-emerald-700">{activeFree} aktif konu</Badge>}
              {activeProj > 0 && <Badge className="bg-emerald-100 text-violet-700">{activeProj} projelendirilen aktif konu</Badge>}
              {completedFree > 0 && <Badge className="bg-blue-50 text-blue-700">{completedFree} tamamlanan konu</Badge>}
              {completedProj > 0 && <Badge className="bg-blue-100 text-violet-700">{completedProj} projelendirilen tamamlanan konu</Badge>}
              {failedCount > 0 && <Badge className="bg-red-50 text-red-600">{failedCount} tamamlanamayan konu</Badge>}
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
          {/* Projelendirilmiş konu sayısı + tür dağılımı */}
          {projectedCount > 0 && (
            <div className="flex items-center gap-1 mt-1 flex-wrap">
              <Badge className="bg-violet-100 text-violet-700 border border-violet-200" style={{fontSize: "10px", padding: "1px 5px"}}><FolderKanban size={10} className="mr-0.5 inline" />{projectedCount}p</Badge>
              {Object.entries(projectTypeCount).slice(0, 3).map(([type, count]) => (
                <Badge key={type} className="bg-violet-50 text-violet-600 border border-violet-200" style={{fontSize: "9px", padding: "1px 4px"}}>{type.length > 12 ? type.slice(0, 12) + "…" : type} ×{count}</Badge>
              ))}
              {Object.keys(projectTypeCount).length > 3 && (
                <Badge className="bg-violet-50 text-violet-400" style={{fontSize: "9px", padding: "1px 4px"}}>+{Object.keys(projectTypeCount).length - 3}</Badge>
              )}
            </div>
          )}
          {/* Yayın İndeksleri */}
          {(() => {
            const pubTopics = myTopics.filter(t => t.status === "completed" && t.publishingIndex?.types?.length > 0);
            if (pubTopics.length === 0) return null;
            const idxCounts = {};
            pubTopics.forEach(t => t.publishingIndex.types.forEach(iid => { idxCounts[iid] = (idxCounts[iid] || 0) + 1; }));
            return (
              <div className="flex items-center gap-1 mt-1 flex-wrap">
                <span className="text-[10px] text-blue-500 font-medium">{pubTopics.length} yayın:</span>
                {Object.entries(idxCounts).slice(0, 3).map(([iid, cnt]) => { const ic = (indexTypesConfig || []).find(i => i.id === iid); return ic ? <span key={iid} className="px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white" style={{ backgroundColor: ic.color }}>{ic.label} {cnt > 1 ? `×${cnt}` : ""}</span> : null; })}
                {Object.keys(idxCounts).length > 3 && <span className="text-[9px] text-slate-400">+{Object.keys(idxCounts).length - 3}</span>}
              </div>
            );
          })()}
        </div>
        <div className="flex flex-col items-center gap-1">
          <GripVertical size={16} className="text-slate-300" />
          {researcher.isAofMember && (
            <span className="text-[8px] font-bold text-teal-600 bg-teal-50 border border-teal-200 rounded px-1 py-0.5 leading-none" title="AÖF Öğretim Üyesi">AÖF</span>
          )}
          {researcher.hasPIExperience && (
            <Award size={12} className="text-amber-400" title="Proje Yürütücülüğü Deneyimi" />
          )}
        </div>
      </div>
    </div>
  );
};

// ─── RESEARCHER DETAIL MODAL (Full profile) ──────────────
const ResearcherDetailModal = ({ researcher, topics, projects, isAdmin, onClose, onUpdate, onSelectTopic, onDeleteResearcher, editingBy, allResearchers }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...researcher });
  const ef = (key, val) => setForm({ ...form, [key]: val });
  const eInput = "w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300";

  const assignedTopics = topics.filter(t =>
    t.researchers.some(r => r.researcherId === researcher.id)
  );

  // Proje türü istatistikleri (sadece projelendirilmiş konular)
  const projectedTopics = assignedTopics.filter(t => (projects || []).some(p => (p.topics || []).includes(t.id)));
  const projectedCount = projectedTopics.length;
  const projectTypeCount = {};
  projectedTopics.forEach(t => { if (t.projectType) projectTypeCount[t.projectType] = (projectTypeCount[t.projectType] || 0) + 1; });

  const [resDupWarning, setResDupWarning] = useState("");
  const handleSave = () => {
    setResDupWarning("");
    const nameNorm = (form.name || "").trim().toLowerCase();
    if (nameNorm) {
      const dup = (allResearchers || []).find(r => r.id !== researcher.id && r.name.trim().toLowerCase() === nameNorm);
      if (dup) { setResDupWarning(`"${dup.name}" adında başka bir araştırmacı zaten mevcut!`); return; }
    }
    onUpdate({
      ...form,
      languages: typeof form.languages === "string" ? form.languages.split(",").map(s => s.trim()).filter(Boolean) : form.languages,
      researchAreas: typeof form.researchAreas === "string" ? form.researchAreas.split(",").map(s => s.trim()).filter(Boolean) : form.researchAreas,
      tools: typeof form.tools === "string" ? form.tools.split(",").map(s => s.trim()).filter(Boolean) : form.tools,
    });
    setEditing(false);
    setResDupWarning("");
  };
  const handleCancel = () => { setForm({ ...researcher }); setEditing(false); };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2
        md:w-[580px] md:max-h-[85vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">

        {editingBy && (
          <div className={`flex items-center gap-2 px-4 py-2 text-xs font-medium text-white ${editingBy.color.bg}`}>
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span>{editingBy.displayName} de bu profili düzenliyor</span>
          </div>
        )}
        {/* Header with avatar — all inside gradient */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5 relative flex-shrink-0">
          <div className="absolute top-3 right-3 flex gap-1.5">
            {isAdmin && <button onClick={() => editing ? handleCancel() : setEditing(true)}
              className={`p-1.5 rounded-lg text-white ${editing ? "bg-white/30" : "bg-white/20 hover:bg-white/30"}`}
              title={editing ? "Düzenlemeyi iptal et" : "Profili düzenle"}>
              {editing ? <Undo2 size={16} /> : <Edit3 size={16} />}
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
            {editing ? (<>
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input type="checkbox" checked={form.hasPIExperience} onChange={e => ef("hasPIExperience", e.target.checked)} className="rounded border-slate-300" />
                Proje Yürütücülüğü Deneyimi
              </label>
              <label className="flex items-center gap-2 text-sm text-teal-700 cursor-pointer">
                <input type="checkbox" checked={form.isAofMember || false} onChange={e => ef("isAofMember", e.target.checked)} className="rounded border-teal-300 text-teal-500 focus:ring-teal-200" />
                AÖF Öğretim Üyesi
              </label>
            </>) : (<>
              {researcher.isAofMember && <Badge className="bg-teal-100 text-teal-700">AÖF Öğretim Üyesi</Badge>}
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
            const myTopicStatus = { proposed: 0, active: 0, completed: 0 };
            myTopics.forEach(t => { if (myTopicStatus[t.status] !== undefined) myTopicStatus[t.status]++; });
            const myProjectTopicIds = new Set(myTopics.map(t => t.id));
            const myProjects = (projects || []).filter(p =>
              (p.researchers || []).some(r => r.researcherId === researcher.id) ||
              (p.topics || []).some(tid => myProjectTopicIds.has(tid))
            );
            const myProjectStatus = { proposed: 0, planning: 0, active: 0, completed: 0 };
            myProjects.forEach(p => { if (myProjectStatus[p.status] !== undefined) myProjectStatus[p.status]++; });
            const proposedProjects = (myProjectStatus.proposed || 0) + (myProjectStatus.planning || 0);
            const allMyTasks = [...myTopics, ...myProjects].flatMap(x => x.tasks || []);
            const doneTasks = allMyTasks.filter(tk => tk.status === "done").length;
            const myRoleCounts = {};
            myTopics.forEach(t => {
              const a = t.researchers.find(r => r.researcherId === researcher.id);
              if (a?.role) myRoleCounts[a.role] = (myRoleCounts[a.role] || 0) + 1;
            });
            return (
              <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-xl p-4 border border-slate-100">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <BarChart3 size={12} className="text-indigo-500" />Kişisel İstatistikler
                </h4>
                {/* Konu istatistikleri */}
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Konular</p>
                <div className="grid grid-cols-3 gap-1.5 mb-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-2 bg-slate-50 rounded-lg border border-slate-100">
                    <BookOpen size={12} className="text-slate-400 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[9px] text-slate-400">Önerilen</p>
                      <p className="text-sm font-bold text-slate-700">{myTopicStatus.proposed}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-2 bg-emerald-50 rounded-lg border border-emerald-100">
                    <BookOpen size={12} className="text-emerald-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[9px] text-emerald-500">Aktif</p>
                      <p className="text-sm font-bold text-emerald-700">{myTopicStatus.active}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-2 bg-blue-50 rounded-lg border border-blue-100">
                    <BookOpen size={12} className="text-blue-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[9px] text-blue-500">Tamamlanan</p>
                      <p className="text-sm font-bold text-blue-700">{myTopicStatus.completed}</p>
                    </div>
                  </div>
                </div>
                {/* Proje istatistikleri */}
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Projeler</p>
                <div className="grid grid-cols-3 gap-1.5 mb-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-2 bg-amber-50 rounded-lg border border-amber-100">
                    <FolderKanban size={12} className="text-amber-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[9px] text-amber-500">Önerilen</p>
                      <p className="text-sm font-bold text-amber-700">{proposedProjects}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-2 bg-violet-50 rounded-lg border border-violet-100">
                    <FolderKanban size={12} className="text-violet-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[9px] text-violet-500">Aktif</p>
                      <p className="text-sm font-bold text-violet-700">{myProjectStatus.active}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-2 bg-teal-50 rounded-lg border border-teal-100">
                    <FolderKanban size={12} className="text-teal-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[9px] text-teal-500">Tamamlanan</p>
                      <p className="text-sm font-bold text-teal-700">{myProjectStatus.completed}</p>
                    </div>
                  </div>
                </div>
                {/* Görevler */}
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Görevler</p>
                <div className="flex items-center gap-2 bg-white rounded-lg p-2.5 border border-slate-100 mb-3">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-600 font-medium">{doneTasks} / {allMyTasks.length} tamamlandı</span>
                      <span className="text-[10px] font-bold text-indigo-600">{allMyTasks.length > 0 ? Math.round((doneTasks / allMyTasks.length) * 100) : 0}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-1.5 rounded-full transition-all" style={{ width: `${allMyTasks.length > 0 ? (doneTasks / allMyTasks.length) * 100 : 0}%` }} />
                    </div>
                  </div>
                </div>
                {/* Proje Türü Dağılımı (sadece projelendirilmiş) */}
                {projectedCount > 0 && (<>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Projelendirilmiş Konular ({projectedCount})</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {Object.entries(projectTypeCount).sort((a, b) => b[1] - a[1]).map(([pt, cnt]) => (
                      <div key={pt} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-100">
                        <FolderKanban size={10} /><span>{pt}</span><span className="font-bold">×{cnt}</span>
                      </div>
                    ))}
                  </div>
                </>)}
                {/* Rol dağılımı */}
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
                  {Object.keys(myRoleCounts).length === 0 && <span className="text-xs text-slate-400 italic">Atama yok</span>}
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
            const textMap = { emerald: "text-emerald-700", blue: "text-blue-700", red: "text-red-700", slate: "text-slate-700", amber: "text-amber-700", purple: "text-indigo-700", gray: "text-gray-500" };
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

          {/* Yayın İndeksleri Dağılımı */}
          {(() => {
            const pubTopics = assignedTopics.filter(t => t.status === "completed" && t.publishingIndex?.types?.length > 0);
            if (pubTopics.length === 0) return null;
            const idxCounts = {};
            pubTopics.forEach(t => t.publishingIndex.types.forEach(iid => { idxCounts[iid] = (idxCounts[iid] || 0) + 1; }));
            const entries = Object.entries(idxCounts).sort((a, b) => b[1] - a[1]);
            const maxVal = Math.max(...entries.map(e => e[1]), 1);
            return (
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Yayın İndeksleri ({pubTopics.length} yayın)</h4>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="space-y-2">
                    {entries.map(([iid, cnt]) => {
                      const ic = (indexTypesConfig || []).find(i => i.id === iid);
                      if (!ic) return null;
                      return (
                        <div key={iid} className="flex items-center gap-3">
                          <span className="text-xs font-medium text-slate-600 w-20 text-right flex-shrink-0">{ic.label}</span>
                          <div className="flex-1 bg-blue-100 rounded-full h-5 overflow-hidden">
                            <div className="h-full rounded-full flex items-center justify-end pr-2 transition-all" style={{ width: `${Math.max((cnt / maxVal) * 100, 15)}%`, backgroundColor: ic.color }}>
                              <span className="text-[10px] font-bold text-white">{cnt}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
            <div className="pt-2 border-t border-slate-100">
              {resDupWarning && <p className="text-xs text-red-500 mb-2 flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-lg px-3 py-2"><AlertTriangle size={14} className="flex-shrink-0" />{resDupWarning}</p>}
              <div className="flex gap-2">
                <button onClick={handleSave} className="flex-1 px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors">Kaydet</button>
                <button onClick={handleCancel} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">İptal</button>
              </div>
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
const TopicCard = ({ topic, allResearchers, onDrop, onClick, isAdmin, projects, allTopics, onRemoveFromProject, maximized, editingBy }) => {
  const [dragOver, setDragOver] = useState(false);
  const stCfg = statusConfig[topic.status] || statusConfig.proposed;
  const prCfg = priorityConfig[topic.priority] || priorityConfig.medium;
  const isProjected = (projects || []).some(p => (p.topics || []).includes(topic.id));
  const linkedProject = isProjected ? (projects || []).find(p => (p.topics || []).includes(topic.id)) : null;
  // Projelendirilmişse: projenin tüm görevleriyle (proje + bağlı konular) senkron progress göster
  const progress = isProjected && linkedProject
    ? getProgress([...(linkedProject.tasks || []), ...(linkedProject.topics || []).flatMap(tid => { const t = (allTopics || []).find(x => x.id === tid); return t ? (t.tasks || []) : []; })])
    : getProgress(topic.tasks);
  const cardStyle = getCardStyle(topic.status, topic.endDate);
  const baseBg = isProjected ? "bg-slate-100 opacity-80 hover:opacity-100" : cardStyle ? `${cardStyle.bg} hover:shadow-md` : "bg-white hover:shadow-md";
  const baseBorder = editingBy
    ? `${editingBy.color.border} border-2 ring-1 ${editingBy.color.ring} shadow-md`
    : dragOver ? "border-indigo-400 bg-indigo-50 shadow-lg ring-2 ring-indigo-200" : isProjected ? "border-slate-300" : cardStyle ? cardStyle.border : "border-slate-200 hover:border-indigo-200";
  return (
    <div
      draggable={isAdmin}
      onDragStart={(e) => { if (!isAdmin) { e.preventDefault(); return; } e.dataTransfer.setData("type", "topic"); e.dataTransfer.setData("id", topic.id); e.dataTransfer.effectAllowed = "copy"; }}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); const type = e.dataTransfer.getData("type"); const id = e.dataTransfer.getData("id"); if (type === "researcher") onDrop(topic.id, id, e); }}
      onClick={() => onClick(topic)}
      className={`rounded-xl border cursor-pointer transition-all duration-200 relative ${baseBg} ${baseBorder} ${maximized ? "p-4" : "p-3"}`}
    >
      {editingBy && (
        <div className={`absolute -top-2.5 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold text-white ${editingBy.color.bg} shadow-sm z-10`}>
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          {editingBy.displayName} düzenliyor
        </div>
      )}
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
        <h3 className={`font-semibold flex-1 pr-2 ${maximized ? "text-base" : "text-sm"} ${isProjected ? "text-slate-600" : topic.status === "failed" ? "text-red-700" : topic.status === "completed" ? "text-emerald-700" : "text-slate-800"}`}>{topic.title}</h3>
        <GripVertical size={16} className="text-slate-300 flex-shrink-0" />
      </div>
      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        <Badge className={stCfg.color}><span className={`w-1.5 h-1.5 rounded-full ${stCfg.dot} mr-1`} />{stCfg.label}</Badge>
        <Badge className={prCfg.color}>{prCfg.icon} {prCfg.label}</Badge>
        {topic.projectType && (projects || []).some(p => (p.topics || []).includes(topic.id)) && <Badge className="bg-violet-50 text-violet-600">{topic.projectType}{topic.projectTypeDetail ? `: ${topic.projectTypeDetail}` : ""}</Badge>}
        {topic.category && <Badge className="bg-blue-50 text-blue-600">{topic.category}</Badge>}
        {topic.publishingIndex?.types?.length > 0 && topic.publishingIndex.types.slice(0, 3).map(iid => { const ic = (indexTypesConfig || []).find(i => i.id === iid); return ic ? <span key={iid} className="px-1.5 py-0.5 rounded-full text-[9px] font-bold text-white" style={{ backgroundColor: ic.color }}>{ic.label}</span> : null; })}
        {topic.publishingIndex?.types?.length > 3 && <span className="text-[9px] text-slate-400">+{topic.publishingIndex.types.length - 3}</span>}
      </div>
      <p className={`text-slate-500 mb-3 ${maximized ? "text-sm line-clamp-3" : "text-xs line-clamp-2"}`}>{topic.description}</p>
      {topic.tasks.length > 0 && (
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-400">Görev Tamamlanma</span>
            <span className="text-xs font-medium text-slate-600">{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <div className="flex -space-x-1.5">
            {topic.researchers.slice(0, 4).map(tr => { const r = allResearchers.find(x => x.id === tr.researcherId); return r ? <Avatar key={r.id} name={r.name} color={r.color} size="xs" /> : null; })}
            {topic.researchers.length > 4 && <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-500">+{topic.researchers.length - 4}</div>}
          </div>
          {topic.researchers.some(tr => tr.isIdeaOwner) && (
            <span className="text-[10px] text-yellow-600 bg-yellow-50 px-1 py-0.5 rounded flex items-center gap-0.5" title={`Fikir: ${topic.researchers.filter(tr => tr.isIdeaOwner).map(tr => { const r = allResearchers.find(x => x.id === tr.researcherId); return r ? r.name.split(" ").pop() : ""; }).join(", ")}`}>
              💡{topic.researchers.filter(tr => tr.isIdeaOwner).map(tr => { const r = allResearchers.find(x => x.id === tr.researcherId); return r ? r.name.split(" ").pop() : ""; }).join(", ")}
            </span>
          )}
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
const ProjectCard = ({ project, topics, allResearchers, onDrop, onClick, onCancelProject, isAdmin, maximized, editingBy }) => {
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
  const hasInternational = useMemo(() => {
    const countries = [project.piCountry, ...(project.partnerCountries || [])].filter(Boolean);
    return countries.some(c => c !== "Türkiye");
  }, [project.piCountry, project.partnerCountries]);
  const cardStyle = getCardStyle(project.status, project.endDate);
  const pBg = cardStyle ? `${cardStyle.bg} hover:shadow-md` : "bg-white hover:shadow-md";
  const pBorder = editingBy
    ? `${editingBy.color.border} border-2 ring-1 ${editingBy.color.ring} shadow-md`
    : dragOver ? "border-emerald-400 bg-emerald-50 shadow-lg ring-2 ring-emerald-200" : cardStyle ? cardStyle.border : "border-slate-200 hover:border-emerald-200";

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(false); const type = e.dataTransfer.getData("type"); const id = e.dataTransfer.getData("id"); if (type === "topic") onDrop(project.id, id); }}
      onClick={() => onClick(project)}
      className={`rounded-xl border cursor-pointer transition-all duration-200 relative ${pBg} ${pBorder} ${maximized ? "p-4" : "p-3"}`}
    >
      {editingBy && (
        <div className={`absolute -top-2.5 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold text-white ${editingBy.color.bg} shadow-sm z-10`}>
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          {editingBy.displayName} düzenliyor
        </div>
      )}
      {cardStyle && (
        <div className={`flex items-center gap-1.5 mb-2 px-2 py-1 rounded-lg ${cardStyle.labelClass}`}>
          <span className="text-xs">{cardStyle.icon}</span>
          <span className="text-[11px] font-semibold uppercase tracking-wide">{cardStyle.label}</span>
        </div>
      )}
      <div className="flex items-start justify-between mb-2">
        <h3 className={`font-semibold flex-1 pr-2 ${maximized ? "text-base" : "text-sm"} ${project.status === "failed" ? "text-red-700" : project.status === "completed" ? "text-emerald-700" : "text-slate-800"}`}>{project.title}</h3>
        <FolderKanban size={16} className="text-slate-300 flex-shrink-0" />
      </div>
      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
        <Badge className={stCfg.color}><span className={`w-1.5 h-1.5 rounded-full ${stCfg.dot} mr-1`} />{stCfg.label}</Badge>
        <Badge className={prCfg.color}>{prCfg.icon} {prCfg.label}</Badge>
        {hasInternational && <Badge className="bg-blue-50 text-blue-600 border border-blue-200"><Globe size={11} className="mr-0.5" />Uluslararası</Badge>}
        {project.fundingSource && <Badge className="bg-violet-50 text-violet-600">{project.fundingSource}</Badge>}
        {project.type && <Badge className="bg-sky-50 text-sky-600">{project.type}</Badge>}
      </div>
      <p className={`text-slate-500 mb-3 ${maximized ? "text-sm line-clamp-3" : "text-xs line-clamp-2"}`}>{project.description}</p>
      {project.budget > 0 && <p className="text-xs text-slate-500 mb-2"><span className="font-medium text-slate-700">₺{project.budget.toLocaleString("tr-TR")}</span></p>}
      {allTasks.length > 0 && (
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              Görev Tamamlanma
              <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-slate-200 text-slate-500 cursor-help text-[8px] font-bold" title={`Tamamlanan / Toplam görev: Projenin kendi görevleri (${(project.tasks||[]).length}) + bağlı konuların görevleri (${projectTopics.flatMap(t=>t.tasks||[]).length}) = ${allTasks.length} görev`}>i</span>
            </span>
            <span className="text-xs font-medium text-slate-600">{progress}%</span>
          </div>
          <ProgressBar value={progress} />
        </div>
      )}
      {projectTopics.length > 0 && (
        <div className="mb-2"><div className="flex flex-wrap gap-1">
          {projectTopics.map(t => <Badge key={t.id} className="bg-blue-50 text-blue-600 text-xs"><BookOpen size={10} className="mr-0.5" />{t.title.slice(0, 20)}</Badge>)}
        </div></div>
      )}
      {/* Fikir Sahipleri — konulardan ve projeden */}
      {(() => {
        const ideaOwners = new Set();
        // Konulardaki fikir sahipleri
        projectTopics.forEach(t => (t.researchers || []).filter(tr => tr.isIdeaOwner).forEach(tr => ideaOwners.add(tr.researcherId)));
        // Projenin kendi fikir sahipleri
        (project.researchers || []).filter(r => r.isIdeaOwner).forEach(r => ideaOwners.add(r.researcherId));
        if (ideaOwners.size === 0) return null;
        const names = [...ideaOwners].map(id => { const r = allResearchers.find(x => x.id === id); return r ? r.name.split(" ").pop() : ""; }).filter(Boolean);
        return (
          <div className="mb-2 flex items-center gap-1 flex-wrap">
            <span className="text-[10px] text-yellow-600 bg-yellow-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-yellow-200" title={`Fikir Sahibi: ${names.join(", ")}`}>
              💡{names.join(", ")}
            </span>
          </div>
        );
      })()}
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
        <div className="mt-2 pt-2 border-t border-slate-100 relative z-10">
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onCancelProject(project.id); }}
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full text-center text-[11px] text-red-500 hover:text-white hover:bg-red-500 py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-red-200 hover:border-red-500 cursor-pointer select-none">
            <Trash2 size={12} />Projeyi İptal Et
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
const DetailModal = ({ item, type, allResearchers, topics, projects, isAdmin, onClose, onUpdate, onSelectResearcher, onSelectTopic, onRemoveFromProject, onCancelProject, onDeleteTopic, editingBy }) => {
  const knownInsts = useMemo(() => getKnownInstitutions(projects), [projects]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [editing, setEditing] = useState(false);
  // Eski projelerde eksik alanları default'la doldur
  const itemWithDefaults = useMemo(() => ({
    ...item,
    piInstitution: item.piInstitution || "",
    piCountry: item.piCountry || "Türkiye",
    partnerInstitutions: Array.isArray(item.partnerInstitutions) ? item.partnerInstitutions : [],
    partnerCountries: Array.isArray(item.partnerCountries) ? item.partnerCountries : [],
  }), [item]);
  const [editForm, setEditForm] = useState({ ...itemWithDefaults });
  const [showAddResearcher, setShowAddResearcher] = useState(false);
  const [addResearcherRole, setAddResearcherRole] = useState("member");
  const eff = (key, val) => {
    const next = { ...editForm, [key]: val };
    // Status "completed"dan çıkınca publishingIndex'i temizle
    if (key === "status" && editForm.status === "completed" && val !== "completed") {
      next.publishingIndex = { types: [], date: "", notes: "" };
    }
    setEditForm(next);
  };
  const eInputD = "w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300";
  const [detailDupWarning, setDetailDupWarning] = useState("");
  const handleSaveEdit = () => {
    setDetailDupWarning("");
    const cleaned = { ...editForm };
    if (cleaned.budget !== undefined) cleaned.budget = parseFloat(cleaned.budget) || 0;
    // Duplikasyon kontrolü: konu veya proje başlığı
    const titleNorm = (cleaned.title || "").trim().toLowerCase();
    if (titleNorm) {
      if (isTopic) {
        const dup = topics.find(t => t.id !== item.id && t.title.trim().toLowerCase() === titleNorm);
        if (dup) { setDetailDupWarning(`"${dup.title}" başlığında bir konu zaten mevcut!`); return; }
      } else if (isProject) {
        const dup = projects.find(p => p.id !== item.id && p.title.trim().toLowerCase() === titleNorm);
        if (dup) { setDetailDupWarning(`"${dup.title}" başlığında bir proje zaten mevcut!`); return; }
      }
    }
    // Kurum adlarını büyük harfe dönüştür
    cleaned.piInstitution = toUpperTR(cleaned.piInstitution || "");
    cleaned.piCountry = cleaned.piCountry || "Türkiye";
    if (typeof cleaned.partnerInstitutions === "string") cleaned.partnerInstitutions = cleaned.partnerInstitutions.split(",").map(s => toUpperTR(s.trim())).filter(Boolean);
    if (Array.isArray(cleaned.partnerInstitutions)) cleaned.partnerInstitutions = cleaned.partnerInstitutions.map(s => toUpperTR(s));
    else cleaned.partnerInstitutions = [];
    if (!Array.isArray(cleaned.partnerCountries)) cleaned.partnerCountries = [];
    onUpdate({ ...item, ...cleaned }); setEditing(false);
    setDetailDupWarning("");
  };
  const handleCancelEdit = () => { setEditForm({ ...itemWithDefaults }); setEditing(false); };
  const stCfg = statusConfig[item.status] || statusConfig.proposed;
  const prCfg = priorityConfig[item.priority] || priorityConfig.medium;
  const isTopic = type === "topic";
  const isProject = type === "project";

  const itemResearchers = isTopic
    ? (item.researchers || []).map(tr => ({ ...allResearchers.find(r => r.id === tr.researcherId), role: tr.role, isIdeaOwner: tr.isIdeaOwner || false })).filter(Boolean)
    : [];
  const projectTopics = isProject ? topics.filter(t => (item.topics || []).includes(t.id)) : [];
  const projectResearcherSet = isProject
    ? (() => { const map = new Map(); projectTopics.forEach(t => { (t.researchers || []).forEach(tr => { const r = allResearchers.find(x => x.id === tr.researcherId); if (r && !map.has(r.id)) map.set(r.id, { ...r, role: tr.role, isIdeaOwner: tr.isIdeaOwner || false, topicTitle: t.title }); else if (r && tr.isIdeaOwner) { const existing = map.get(r.id); map.set(r.id, { ...existing, isIdeaOwner: true }); } }); }); return Array.from(map.values()); })()
    : [];

  const handleAddTask = () => { if (!newTaskTitle.trim()) return; onUpdate({ ...item, tasks: [...(item.tasks || []), { id: `tk_${Date.now()}`, title: newTaskTitle.trim(), status: "todo", assignedTo: null }] }); setNewTaskTitle(""); };
  const handleTaskStatus = (taskId, newStatus) => { onUpdate({ ...item, tasks: (item.tasks || []).map(t => t.id === taskId ? { ...t, status: newStatus } : t) }); };
  const handleDeleteTask = (taskId) => { onUpdate({ ...item, tasks: (item.tasks || []).filter(t => t.id !== taskId) }); };
  const handleRemoveResearcher = (researcherId) => { onUpdate({ ...item, researchers: (item.researchers || []).filter(tr => tr.researcherId !== researcherId) }); };
  // Projelendirilmiş konularda proje ile senkron progress göster
  const linkedPrjForProgress = isTopic ? (projects || []).find(p => (p.topics || []).includes(item.id)) : null;
  const progress = linkedPrjForProgress
    ? getProgress([...(linkedPrjForProgress.tasks || []), ...(linkedPrjForProgress.topics || []).flatMap(tid => { const t = (topics || []).find(x => x.id === tid); return t ? (t.tasks || []) : []; })])
    : isProject
      ? getProgress([...(item.tasks || []), ...projectTopics.flatMap(t => t.tasks || [])])
      : getProgress(item.tasks || []);

  const statusOptions = Object.keys(statusConfig || {});
  const priorityOptions = Object.keys(priorityConfig || {});

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[600px] md:max-h-[80vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
        {editingBy && (
          <div className={`flex items-center gap-2 px-4 py-2 text-xs font-medium text-white ${editingBy.color.bg}`}>
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span>{editingBy.displayName} de bu öğeyi düzenliyor</span>
          </div>
        )}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {isTopic ? <BookOpen size={18} className="text-indigo-500" /> : <FolderKanban size={18} className="text-emerald-500" />}
                {editing
                  ? <input value={editForm.title} onChange={e => eff("title", e.target.value)} className={eInputD + " text-lg font-bold"} />
                  : <h2 className="text-lg font-bold text-slate-800">{item.title}</h2>}
              </div>
              {editing ? (<>
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
                {/* Yayın İndeksleri — sadece tamamlanmış konularda */}
                {isTopic && editForm.status === "completed" && (
                  <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-3">
                    <p className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-1.5"><Award size={13} />Yayın İndeksleri</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(indexTypesConfig || []).map(idx => {
                        const sel = (editForm.publishingIndex?.types || []).includes(idx.id);
                        return (
                          <label key={idx.id} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all border ${sel ? "text-white border-transparent" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"}`}
                            style={sel ? { backgroundColor: idx.color, borderColor: idx.color } : {}}>
                            <input type="checkbox" checked={sel} onChange={() => {
                              const cur = editForm.publishingIndex?.types || [];
                              const next = sel ? cur.filter(t => t !== idx.id) : [...cur, idx.id];
                              eff("publishingIndex", { ...(editForm.publishingIndex || {}), types: next });
                            }} className="sr-only" />
                            {sel ? <Check size={12} /> : <Circle size={12} className="text-slate-300" />}
                            {idx.label}
                          </label>
                        );
                      })}
                    </div>
                    <div className="flex gap-2">
                      <input type="date" value={editForm.publishingIndex?.date || ""} onChange={e => eff("publishingIndex", { ...(editForm.publishingIndex || {}), date: e.target.value })}
                        className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-200" />
                      <input value={editForm.publishingIndex?.notes || ""} onChange={e => eff("publishingIndex", { ...(editForm.publishingIndex || {}), notes: e.target.value })}
                        placeholder="Not (opsiyonel)" className="flex-1 text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-200" />
                    </div>
                  </div>
                )}
              </>) : (
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
              {/* Yayın İndeksleri badge'leri — sadece okuma modu */}
              {isTopic && !editing && item.publishingIndex?.types?.length > 0 && (
                <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200 flex-wrap">
                  <Award size={14} className="text-blue-500 flex-shrink-0" />
                  {item.publishingIndex.types.map(iid => { const ic = (indexTypesConfig || []).find(i => i.id === iid); return ic ? <span key={iid} className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: ic.color }}>{ic.label}</span> : null; })}
                  {item.publishingIndex.date && <span className="text-[10px] text-slate-400 ml-auto">{new Date(item.publishingIndex.date).toLocaleDateString("tr-TR")}</span>}
                  {item.publishingIndex.notes && <span className="text-[10px] text-slate-500 italic">{item.publishingIndex.notes}</span>}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              {isAdmin && <button onClick={() => { if (editing) { handleCancelEdit(); } else { setEditForm({ ...itemWithDefaults }); setEditing(true); } }}
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
                <div className="col-span-2"><label className="block text-xs font-medium text-slate-500 mb-1">Yürütücü Kurum</label>
                  <input list="inst-list-edit" value={editForm.piInstitution || ""} onChange={e => eff("piInstitution", toUpperTR(e.target.value))} onBlur={e => eff("piInstitution", toUpperTR(e.target.value))} className={eInputD} placeholder="Kurum adı yazın veya seçin..." />
                  <datalist id="inst-list-edit">{knownInsts.map(i => <option key={i} value={i} />)}</datalist>
                </div>
                <div><label className="block text-xs font-medium text-slate-500 mb-1">Yürütücü Ülke</label>
                  <select value={editForm.piCountry || "Türkiye"} onChange={e => eff("piCountry", e.target.value)} className={eInputD}>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-span-2"><label className="block text-xs font-medium text-slate-500 mb-1">Ortak Kurumlar (virgülle ayırın)</label>
                  <input list="inst-list-partner-edit" value={Array.isArray(editForm.partnerInstitutions) ? editForm.partnerInstitutions.join(", ") : (editForm.partnerInstitutions || "")} onChange={e => eff("partnerInstitutions", e.target.value.split(",").map(s => toUpperTR(s.trim())).filter(Boolean))} onBlur={e => { if (Array.isArray(editForm.partnerInstitutions)) eff("partnerInstitutions", editForm.partnerInstitutions.map(s => toUpperTR(s))); }} className={eInputD} />
                  <datalist id="inst-list-partner-edit">{knownInsts.map(i => <option key={i} value={i} />)}</datalist>
                </div>
                <div><label className="block text-xs font-medium text-slate-500 mb-1">Ortak Ülkeler</label>
                  <div className="border border-slate-200 rounded-lg p-2 max-h-24 overflow-y-auto bg-slate-50 space-y-0.5">
                    {COUNTRIES.map(c => (
                      <label key={c} className={`flex items-center gap-2 px-2 py-0.5 rounded cursor-pointer text-xs ${(editForm.partnerCountries || []).includes(c) ? "bg-violet-50 text-violet-700 font-medium" : "hover:bg-white text-slate-600"}`}>
                        <input type="checkbox" checked={(editForm.partnerCountries || []).includes(c)}
                          onChange={e => { if (e.target.checked) eff("partnerCountries", [...(editForm.partnerCountries || []), c]); else eff("partnerCountries", (editForm.partnerCountries || []).filter(x => x !== c)); }}
                          className="w-3 h-3 rounded border-slate-300 text-violet-500" />
                        {c}
                      </label>
                    ))}
                  </div>
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
              {isTopic && item.projectType && (projects || []).some(p => (p.topics || []).includes(item.id)) && <div className="bg-indigo-50 rounded-lg p-2.5"><p className="text-xs text-indigo-400 mb-0.5">Proje Türü</p><p className="text-sm font-medium text-indigo-700">{item.projectType}{item.projectTypeDetail ? ` — ${item.projectTypeDetail}` : ""}</p></div>}
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

          {/* Kurum & Ülke Bilgileri (project only, view mode) */}
          {!editing && isProject && (itemWithDefaults.piInstitution || itemWithDefaults.piCountry || itemWithDefaults.partnerInstitutions.length > 0 || itemWithDefaults.partnerCountries.length > 0) && (
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><Globe size={13} /> Kurum & Ülke Bilgileri
                {[itemWithDefaults.piCountry, ...itemWithDefaults.partnerCountries].filter(Boolean).some(c => c !== "Türkiye") && (
                  <span className="ml-auto px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center gap-1"><Globe size={10} />Uluslararası Proje</span>
                )}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {itemWithDefaults.piInstitution && <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100"><p className="text-xs text-indigo-400 mb-1 font-medium">Yürütücü Kurum</p><p className="text-sm font-semibold text-indigo-700">{itemWithDefaults.piInstitution}</p></div>}
                {itemWithDefaults.piCountry && <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100"><p className="text-xs text-indigo-400 mb-1 font-medium">Yürütücü Ülke</p><p className="text-sm font-semibold text-indigo-700">{itemWithDefaults.piCountry}</p></div>}
                {itemWithDefaults.partnerInstitutions.length > 0 && <div className="bg-violet-50 rounded-lg p-3 border border-violet-100 col-span-2"><p className="text-xs text-violet-400 mb-1.5 font-medium">Ortak Kurumlar</p><div className="flex flex-wrap gap-1.5">{itemWithDefaults.partnerInstitutions.map((inst, i) => <span key={i} className="px-2.5 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">{inst}</span>)}</div></div>}
                {itemWithDefaults.partnerCountries.length > 0 && <div className="bg-violet-50 rounded-lg p-3 border border-violet-100 col-span-2"><p className="text-xs text-violet-400 mb-1.5 font-medium">Ortak Ülkeler</p><div className="flex flex-wrap gap-1.5">{itemWithDefaults.partnerCountries.map((c, i) => <span key={i} className="px-2.5 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-medium">{c}</span>)}</div></div>}
              </div>
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
            <div className="pt-2 border-t border-slate-100">
              {detailDupWarning && <p className="text-xs text-red-500 mb-2 flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-lg px-3 py-2"><AlertTriangle size={14} className="flex-shrink-0" />{detailDupWarning}</p>}
              <div className="flex gap-2">
                <button onClick={handleSaveEdit} className="flex-1 px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors">Kaydet</button>
                <button onClick={handleCancelEdit} className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">İptal</button>
              </div>
            </div>
          )}

          {(item.tasks || []).length > 0 && <div><div className="flex items-center justify-between mb-2"><h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Görev Tamamlanma</h4><span className="text-sm font-bold" style={{ color: progress === 100 ? "#10b981" : "#6366f1" }}>{progress}%</span></div><ProgressBar value={progress} className="h-2" /></div>}

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
                  {/* Fikir Sahibi checkbox */}
                  <button onClick={() => {
                    const newResearchers = (item.researchers || []).map(tr => tr.researcherId === r.id ? { ...tr, isIdeaOwner: !tr.isIdeaOwner } : tr);
                    onUpdate({ ...item, researchers: newResearchers });
                  }} className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors flex-shrink-0 flex items-center gap-0.5 ${r.isIdeaOwner ? "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-300" : "bg-slate-100 text-slate-400 hover:bg-yellow-50 hover:text-yellow-600"}`}
                    title={r.isIdeaOwner ? "Fikir sahibi (işareti kaldır)" : "Fikir sahibi olarak işaretle"}>
                    💡{r.isIdeaOwner && <span>Fikir</span>}
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
                  {/* Fikir Sahibi checkbox (proje ekibi) */}
                  <button onClick={() => {
                    const newResearchers = (item.researchers || []).map(x => x.researcherId === tr.researcherId ? { ...x, isIdeaOwner: !x.isIdeaOwner } : x);
                    onUpdate({ ...item, researchers: newResearchers });
                  }} className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors flex-shrink-0 flex items-center gap-0.5 ${tr.isIdeaOwner ? "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-300" : "bg-slate-100 text-slate-400 hover:bg-yellow-50 hover:text-yellow-600"}`}
                    title={tr.isIdeaOwner ? "Fikir sahibi (işareti kaldır)" : "Fikir sahibi olarak işaretle"}>
                    💡{tr.isIdeaOwner && <span>Fikir</span>}
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
                      {r.isIdeaOwner && <span className="text-[10px] text-yellow-600 bg-yellow-50 px-1 py-0.5 rounded border border-yellow-200 flex items-center gap-0.5">💡Fikir</span>}
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
              <div className="space-y-1.5">{projectTopics.map(t => {
                const ideaOwners = (t.researchers || []).filter(tr => tr.isIdeaOwner).map(tr => { const r = allResearchers.find(x => x.id === tr.researcherId); return r ? r.name.split(" ").pop() : ""; }).filter(Boolean);
                return (
                <button key={t.id} onClick={() => { if (onSelectTopic) onSelectTopic(t); }}
                  className="w-full flex items-center gap-2 p-2 rounded-lg bg-blue-50 hover:ring-2 hover:ring-indigo-200 transition-all text-left group">
                  <BookOpen size={14} className="text-blue-500" />
                  <span className="text-sm text-blue-700 font-medium flex-1 truncate group-hover:text-indigo-600">{t.title}</span>
                  {ideaOwners.length > 0 && <span className="text-[10px] text-yellow-600 bg-yellow-50 px-1 py-0.5 rounded border border-yellow-200 flex items-center gap-0.5 flex-shrink-0">💡{ideaOwners.join(", ")}</span>}
                  <Badge className={statusConfig[t.status]?.color || ""}>{statusConfig[t.status]?.label}</Badge>
                  <ExternalLink size={12} className="text-slate-300 group-hover:text-indigo-400 flex-shrink-0" />
                </button>
                );
              })}</div>
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
              <button type="button" onClick={() => onCancelProject(item.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 active:bg-red-200 rounded-xl border border-red-200 transition-colors cursor-pointer select-none">
                <Trash2 size={14} />Projeyi İptal Et
              </button>
              <p className="text-[10px] text-slate-400 text-center mt-1.5">Proje silinir, bağlı konular projelendirilmemiş olarak kalır.</p>
            </div>
          )}
          {isTopic && isAdmin && onDeleteTopic && (
            <div className="pt-3 mt-3 border-t border-red-100">
              <button type="button" onClick={() => onDeleteTopic(item.id)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 active:bg-red-200 rounded-xl border border-red-200 transition-colors cursor-pointer select-none">
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
const AddItemModal = ({ type, onAdd, onClose, allTopics, projects, allResearchers }) => {
  const knownInsts = useMemo(() => getKnownInstitutions(projects), [projects]);
  const [form, setForm] = useState({
    title: "", description: "", status: type === "project" ? "planning" : "proposed",
    priority: "medium", category: "", applicationDate: "", startDate: "", endDate: "",
    budget: "", fundingSource: "", projectType: "", projectTypeDetail: "", workLink: "",
    piInstitution: "", piCountry: "Türkiye", partnerInstitutions: "", partnerCountries: [],
    ourInstitution: DEFAULT_INSTITUTION, isOurPI: true,
    // researcher
    name: "", rTitle: "", institution: "", unit: "",
    eduUniversity: "", eduProgram: "", eduDegree: "Yüksek Lisans", eduStatus: "Devam Ediyor",
    languages: "", researchAreas: "", tools: "",
    hasPIExperience: false, isAofMember: true, url: "", phone: "", email: "", bio: "", performanceNotes: "",
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

  const [dupWarning, setDupWarning] = useState("");

  const handleSubmit = () => {
    setDupWarning("");
    if (isR) {
      if (!form.name.trim()) return;
      const nameNorm = form.name.trim().toLowerCase();
      const dup = (allResearchers || []).find(r => r.name.trim().toLowerCase() === nameNorm);
      if (dup) { setDupWarning(`"${dup.name}" adında bir araştırmacı zaten mevcut!`); return; }
      onAdd({
        id: `r_${Date.now()}`, name: form.name, title: form.rTitle,
        institution: form.institution, unit: form.unit,
        eduUniversity: form.eduUniversity, eduProgram: form.eduProgram,
        eduDegree: form.eduDegree, eduStatus: form.eduStatus,
        languages: form.languages.split(",").map(s => s.trim()).filter(Boolean),
        researchAreas: form.researchAreas.split(",").map(s => s.trim()).filter(Boolean),
        tools: form.tools.split(",").map(s => s.trim()).filter(Boolean),
        hasPIExperience: form.hasPIExperience, isAofMember: form.isAofMember,
        url: form.url, phone: form.phone, email: form.email,
        bio: form.bio, performanceNotes: form.performanceNotes,
        color: `hsl(${Math.random() * 360}, 55%, 55%)`,
      });
    } else if (isT) {
      if (!form.title.trim()) return;
      if (!form.category) { alert("Lütfen bir kategori seçiniz (Ar-Ge İçi veya Ortak Çalışma)"); return; }
      const titleNorm = form.title.trim().toLowerCase();
      const dupT = (allTopics || []).find(t => t.title.trim().toLowerCase() === titleNorm);
      if (dupT) { setDupWarning(`"${dupT.title}" başlığında bir konu zaten mevcut!`); return; }
      onAdd({ id: `t_${Date.now()}`, title: form.title, description: form.description, category: form.category, status: form.status, priority: form.priority, projectType: form.projectType, projectTypeDetail: form.projectTypeDetail, applicationDate: form.applicationDate, startDate: form.startDate, endDate: form.endDate, workLink: form.workLink, tags: [], researchers: [], tasks: [] });
    } else {
      if (!form.title.trim()) return;
      if (selectedTopics.length === 0) { setTopicError("Bir proje en az bir konuyla ilişkilendirilmelidir!"); return; }
      const pTitleNorm = form.title.trim().toLowerCase();
      const dupP = (projects || []).find(p => p.title.trim().toLowerCase() === pTitleNorm);
      if (dupP) { setDupWarning(`"${dupP.title}" başlığında bir proje zaten mevcut!`); return; }
      const ourInst = toUpperTR(form.ourInstitution || DEFAULT_INSTITUTION);
      let finalPiInst = toUpperTR(form.piInstitution || "");
      let finalPartnerInsts = form.partnerInstitutions.split(",").map(s => toUpperTR(s.trim())).filter(Boolean);
      if (form.isOurPI) {
        finalPiInst = ourInst;
        // eğer kullanıcı ayrıca piInstitution'a başka kurum girdiyse, onu ortaklara ekle
        if (form.piInstitution && toUpperTR(form.piInstitution) !== ourInst && !finalPartnerInsts.includes(toUpperTR(form.piInstitution))) {
          finalPartnerInsts = [toUpperTR(form.piInstitution), ...finalPartnerInsts];
        }
      } else {
        // biz yürütücü değiliz, ortaklara ekle
        if (!finalPartnerInsts.includes(ourInst)) finalPartnerInsts = [ourInst, ...finalPartnerInsts];
      }
      onAdd({ id: `p_${Date.now()}`, title: form.title, description: form.description, type: form.projectType, projectTypeDetail: form.projectTypeDetail, status: form.status, priority: form.priority, startDate: form.startDate, endDate: form.endDate, budget: parseFloat(form.budget) || 0, fundingSource: form.fundingSource, workLink: form.workLink, topics: selectedTopics, tasks: [], researchers: [],
        piInstitution: finalPiInst, piCountry: form.piCountry,
        partnerInstitutions: finalPartnerInsts,
        partnerCountries: form.partnerCountries || [],
      });
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
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isAofMember} onChange={e => f("isAofMember", e.target.checked)}
                      className="w-4 h-4 rounded border-teal-300 text-teal-500 focus:ring-teal-200" />
                    <span className="text-sm text-teal-700 font-medium">AÖF Öğretim Üyesi</span>
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
              {isT && <div><label className={labelClass}>Kategori <span className="text-red-400">*</span></label><select value={form.category} onChange={e => f("category", e.target.value)} className={inputClass + (!form.category ? " border-red-300 bg-red-50" : "")}><option value="" disabled>Kategori seçiniz...</option><option value="Ar-Ge İçi">Ar-Ge İçi</option><option value="Ortak Çalışma">Ortak Çalışma</option></select></div>}
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
                {/* Kurumumuz & Yürütücü */}
                <div className="bg-teal-50/60 rounded-lg p-3 border border-teal-200 space-y-2 mt-2">
                  <p className="text-[10px] font-semibold text-teal-600 uppercase tracking-wider">Kurumumuz</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 font-medium flex-1">{form.ourInstitution || DEFAULT_INSTITUTION}</span>
                    <label className="flex items-center gap-1.5 cursor-pointer select-none">
                      <input type="checkbox" checked={form.isOurPI} onChange={e => f("isOurPI", e.target.checked)}
                        className="w-4 h-4 rounded border-teal-300 text-teal-600 focus:ring-teal-200" />
                      <span className="text-xs font-semibold text-teal-700">Yürütücü</span>
                    </label>
                  </div>
                  {!form.isOurPI && <p className="text-[10px] text-teal-500">Kurumumuz bu projede ortak kurum olarak kaydedilecek.</p>}
                </div>
                {/* Proje Yürütücüsü Kurum & Ülke (yürütücü biz değilsek) */}
                {!form.isOurPI && (
                  <div className="bg-indigo-50/50 rounded-lg p-3 border border-indigo-100 space-y-2">
                    <p className="text-[10px] font-semibold text-indigo-500 uppercase tracking-wider">Proje Yürütücüsü (Dış Kurum)</p>
                    <div><label className={labelClass}>Yürütücü Kurum</label>
                      <input list="inst-list-add" value={form.piInstitution} onChange={e => f("piInstitution", toUpperTR(e.target.value))} onBlur={e => f("piInstitution", toUpperTR(e.target.value))} className={inputClass} placeholder="Kurum adı yazın veya seçin..." />
                      <datalist id="inst-list-add">{knownInsts.map(i => <option key={i} value={i} />)}</datalist>
                    </div>
                    <div><label className={labelClass}>Yürütücü Ülke</label>
                      <select value={form.piCountry} onChange={e => f("piCountry", e.target.value)} className={inputClass}>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                )}
                {form.isOurPI && (
                  <div className="bg-indigo-50/50 rounded-lg p-3 border border-indigo-100 space-y-2">
                    <p className="text-[10px] font-semibold text-indigo-500 uppercase tracking-wider">Yürütücü Ülke</p>
                    <select value={form.piCountry} onChange={e => f("piCountry", e.target.value)} className={inputClass}>
                      {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                )}
                {/* Ortak Kurumlar & Ülkeler */}
                <div className="bg-violet-50/50 rounded-lg p-3 border border-violet-100 space-y-2">
                  <p className="text-[10px] font-semibold text-violet-500 uppercase tracking-wider">Ortak Kurum & Ülkeler</p>
                  <div><label className={labelClass}>Ortak Kurumlar</label>
                    <input list="inst-list-partner-add" value={form.partnerInstitutions} onChange={e => f("partnerInstitutions", toUpperTR(e.target.value))} onBlur={e => f("partnerInstitutions", toUpperTR(e.target.value))} className={inputClass} placeholder="Virgülle ayırarak: KURUM1, KURUM2, ..." />
                    <datalist id="inst-list-partner-add">{knownInsts.map(i => <option key={i} value={i} />)}</datalist>
                  </div>
                  <div><label className={labelClass}>Ortak Ülkeler (çoklu seçim)</label>
                    <div className="border border-slate-200 rounded-lg p-2 max-h-28 overflow-y-auto bg-white space-y-0.5">
                      {COUNTRIES.map(c => (
                        <label key={c} className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer text-xs transition-colors ${(form.partnerCountries || []).includes(c) ? "bg-violet-50 text-violet-700 font-medium" : "hover:bg-slate-50 text-slate-600"}`}>
                          <input type="checkbox" checked={(form.partnerCountries || []).includes(c)}
                            onChange={e => { if (e.target.checked) f("partnerCountries", [...(form.partnerCountries || []), c]); else f("partnerCountries", (form.partnerCountries || []).filter(x => x !== c)); }}
                            className="w-3 h-3 rounded border-slate-300 text-violet-500 focus:ring-violet-200" />
                          {c}
                        </label>
                      ))}
                    </div>
                    {(form.partnerCountries || []).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {form.partnerCountries.map(c => <Badge key={c} className="bg-violet-100 text-violet-700">{c} <button onClick={() => f("partnerCountries", form.partnerCountries.filter(x => x !== c))} className="ml-1 hover:text-red-500">×</button></Badge>)}
                      </div>
                    )}
                  </div>
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
        <div className="p-5 border-t border-slate-100">
          {dupWarning && <p className="text-xs text-red-500 mb-3 flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-lg px-3 py-2"><AlertTriangle size={14} className="flex-shrink-0" />{dupWarning}</p>}
          <div className="flex gap-2 justify-end">
            <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">İptal</button>
            <button onClick={handleSubmit} className="px-4 py-2 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 font-medium">Ekle</button>
          </div>
        </div>
      </div>
    </>
  );
};

// ─── SETTINGS MODAL ──────────────────────────────────────

// ─── REPORT PREVIEW (Markdown fetch + render) ───────────
const ReportPreview = () => {
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/ArGe-Dashboard-Teknik-Rapor.md")
      .then(r => { if (!r.ok) throw new Error("Rapor yüklenemedi"); return r.text(); })
      .then(md => {
        if (cancelled) return;
        // Simple markdown → HTML
        let h = md
          .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
          // Headers
          .replace(/^#### (.+)$/gm, '<h4 class="rp-h4">$1</h4>')
          .replace(/^### (.+)$/gm, '<h3 class="rp-h3">$1</h3>')
          .replace(/^## (.+)$/gm, '<h2 class="rp-h2">$1</h2>')
          .replace(/^# (.+)$/gm, '<h1 class="rp-h1">$1</h1>')
          // Bold & italic
          .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.+?)\*/g, '<em>$1</em>')
          // Horizontal rule
          .replace(/^---$/gm, '<hr class="rp-hr"/>')
          // Unordered list items
          .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
          // Table rows
          .replace(/^\|(.+)\|$/gm, (match, inner) => {
            const cells = inner.split("|").map(c => c.trim());
            if (cells.every(c => /^[-:]+$/.test(c))) return ""; // separator
            const tag = "td";
            return "<tr>" + cells.map(c => `<${tag}>${c}</${tag}>`).join("") + "</tr>";
          });
        // Wrap consecutive <li> in <ul>
        h = h.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul class="rp-ul">$1</ul>');
        // Wrap consecutive <tr> in <table>
        h = h.replace(/((?:<tr>.*<\/tr>\n?)+)/g, '<table class="rp-table">$1</table>');
        // Paragraphs: non-empty lines not already tags
        h = h.split("\n").map(line => {
          const trimmed = line.trim();
          if (!trimmed) return "";
          if (/^<(h[1-4]|ul|li|table|tr|td|hr|\/)/i.test(trimmed)) return line;
          return `<p class="rp-p">${trimmed}</p>`;
        }).join("\n");
        // Remove empty lines
        h = h.replace(/\n{3,}/g, "\n\n");
        setHtml(h);
        setLoading(false);
      })
      .catch(e => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className="flex items-center justify-center py-12 text-slate-500"><Loader2 className="animate-spin mr-2" size={18} />Rapor yükleniyor...</div>;
  if (error) return <div className="text-center py-8 text-red-500 text-sm">{error}</div>;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <style>{`
        .rp-container { font-family: 'Times New Roman', Georgia, serif; max-width: 100%; padding: 24px; line-height: 1.8; color: #1e293b; font-size: 13px; max-height: 60vh; overflow-y: auto; }
        .rp-container .rp-h1 { text-align: center; font-size: 17px; font-weight: bold; margin: 0 0 4px; color: #1e293b; }
        .rp-container .rp-h2 { font-size: 15px; font-weight: 600; margin: 20px 0 6px; color: #334155; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
        .rp-container .rp-h3 { font-size: 14px; font-weight: 600; margin: 16px 0 6px; color: #475569; }
        .rp-container .rp-h4 { font-size: 13px; font-weight: 600; margin: 12px 0 4px; color: #64748b; }
        .rp-container .rp-p { text-align: justify; margin: 6px 0; }
        .rp-container .rp-ul { margin: 6px 0 10px 20px; padding: 0; }
        .rp-container .rp-ul li { margin: 3px 0; }
        .rp-container .rp-table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 12px; }
        .rp-container .rp-table td { border: 1px solid #e2e8f0; padding: 5px 8px; }
        .rp-container .rp-table tr:first-child td { background: #f8fafc; font-weight: 600; }
        .rp-container .rp-hr { border: none; border-top: 1px solid #e2e8f0; margin: 16px 0; }
      `}</style>
      <div className="rp-container" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

/* eski generateAcademicReportHTML kaldırıldı — rapor artık public/ klasöründen okunuyor */

const SettingsModal = ({
  roleConfig, onRoleConfigChange,
  statusConfig, onStatusConfigChange,
  priorityConfig, onPriorityConfigChange,
  projectTypeOptions, onProjectTypeOptionsChange,
  categoryOptions, onCategoryOptionsChange,
  eduDegreeOptions, onEduDegreeOptionsChange,
  eduStatusOptions, onEduStatusOptionsChange,
  indexTypesConfig: itcProp, onIndexTypesConfigChange,
  projectTypeCoeffConfig, onProjectTypeCoeffChange,
  onResetDefaults, onClose,
  onExportData, onImportData, onResetAllData,
  quickLinks, onQuickLinksChange,
  onForceSync, syncStatus, onForcePublish,
  isMaster, onBackupDownload, onBackupRestore, lastBackupAt
}) => {
  const [activeTab, setActiveTab] = useState("roles");
  const fileInputRef = useRef(null);
  const [editingLinkId, setEditingLinkId] = useState(null);
  const [linkDraft, setLinkDraft] = useState({ label: "", url: "" });
  const tabs = [
    { key: "roles", label: "Roller", icon: UserCheck },
    { key: "projectTypes", label: "Proje Türleri", icon: FolderKanban },
    { key: "statuses", label: "Durum", icon: Activity },
    { key: "priorities", label: "Öncelik", icon: Target },
    { key: "categories", label: "Kategoriler", icon: Tag },
    { key: "education", label: "Eğitim", icon: GraduationCap },
    { key: "indexTypes", label: "Yayın İndeksleri", icon: Award },
    { key: "scoring", label: "Puanlama", icon: TrendingUp },
    { key: "links", label: "Bağlantılar", icon: Link2 },
    { key: "data", label: "Veri", icon: DatabaseBackup },
    { key: "report", label: "Rapor", icon: FileText },
  ];

  const PALETTE = [
    { value: "bg-indigo-100 text-indigo-700", label: "İndigo", preview: "bg-indigo-100" },
    { value: "bg-rose-100 text-rose-700", label: "Gül", preview: "bg-rose-100" },
    { value: "bg-orange-100 text-orange-700", label: "Turuncu", preview: "bg-orange-100" },
    { value: "bg-emerald-100 text-emerald-700", label: "Yeşil", preview: "bg-emerald-100" },
    { value: "bg-purple-100 text-indigo-700", label: "Mor", preview: "bg-purple-100" },
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

  // ── Index Types Tab ──
  const IndexTypesTab = () => {
    const [editIdx, setEditIdx] = useState(null);
    const [editForm, setEditForm] = useState({ label: "", coefficient: 1, color: "#3b82f6" });
    const [showNew, setShowNew] = useState(false);
    const [newForm, setNewForm] = useState({ id: "", label: "", coefficient: 1, color: "#3b82f6" });
    const itc = itcProp || [];
    const HEX_COLORS = ["#3b82f6","#06b6d4","#8b5cf6","#ec4899","#f59e0b","#14b8a6","#10b981","#94a3b8","#f97316","#ef4444","#6366f1","#84cc16","#0ea5e9","#d946ef"];
    const saveEdit = () => {
      if (!editForm.label.trim()) return;
      const updated = [...itc]; updated[editIdx] = { ...updated[editIdx], label: editForm.label.trim(), coefficient: Number(editForm.coefficient) || 1, color: editForm.color };
      onIndexTypesConfigChange(updated); setEditIdx(null);
    };
    const remove = (idx) => { if (itc.length <= 1) return; if (!confirm(`"${itc[idx].label}" silinsin mi?`)) return; onIndexTypesConfigChange(itc.filter((_, i) => i !== idx)); };
    const add = () => {
      const id = newForm.id.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      if (!id || !newForm.label.trim() || itc.some(i => i.id === id)) return;
      onIndexTypesConfigChange([...itc, { id, label: newForm.label.trim(), coefficient: Number(newForm.coefficient) || 1, color: newForm.color }]);
      setNewForm({ id: "", label: "", coefficient: 1, color: "#3b82f6" }); setShowNew(false);
    };
    const move = (idx, dir) => { const arr = [...itc]; [arr[idx], arr[idx + dir]] = [arr[idx + dir], arr[idx]]; onIndexTypesConfigChange(arr); };
    return (
      <div className="space-y-3">
        <p className="text-xs text-slate-500 mb-3">Yayın indeks türlerini yönetin. Katsayı değeri Leaderboard puan hesabında kullanılır.</p>
        {itc.map((item, idx) => (
          <div key={item.id} className="border border-slate-200 rounded-xl p-3 bg-white">
            {editIdx === idx ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input value={editForm.label} onChange={e => setEditForm({ ...editForm, label: e.target.value })} className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-200 outline-none" placeholder="İndeks adı" />
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-400">×</span>
                    <input type="number" value={editForm.coefficient} onChange={e => setEditForm({ ...editForm, coefficient: e.target.value })} className="w-14 text-sm border border-slate-200 rounded-lg px-2 py-1.5 text-center focus:ring-2 focus:ring-indigo-200 outline-none" min="0" max="100" />
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {HEX_COLORS.map(c => (
                    <button key={c} onClick={() => setEditForm({ ...editForm, color: c })}
                      className={`w-8 h-8 rounded-lg border-2 transition-all flex items-center justify-center ${editForm.color === c ? "border-indigo-500 ring-1 ring-indigo-200" : "border-transparent hover:border-slate-300"}`}
                      style={{ backgroundColor: c }}>{editForm.color === c && <Check size={12} className="text-white" />}</button>
                  ))}
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setEditIdx(null)} className="px-3 py-1.5 text-xs text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200">İptal</button>
                  <button onClick={saveEdit} className="px-3 py-1.5 text-xs text-white bg-indigo-500 rounded-lg hover:bg-indigo-600">Kaydet</button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => move(idx, -1)} disabled={idx === 0} className="text-slate-300 hover:text-slate-500 disabled:opacity-30"><ChevronLeft size={12} className="rotate-90" /></button>
                  <button onClick={() => move(idx, 1)} disabled={idx === itc.length - 1} className="text-slate-300 hover:text-slate-500 disabled:opacity-30"><ChevronRight size={12} className="rotate-90" /></button>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-medium text-white" style={{ backgroundColor: item.color }}>{item.label}</span>
                <span className="text-xs text-slate-400 font-mono">×{item.coefficient}</span>
                <span className="text-[10px] text-slate-300 ml-auto">{item.id}</span>
                <button onClick={() => { setEditIdx(idx); setEditForm({ label: item.label, coefficient: item.coefficient, color: item.color }); }} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><Edit3 size={13} /></button>
                <button onClick={() => remove(idx)} disabled={itc.length <= 1} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 disabled:opacity-30"><Trash2 size={13} /></button>
              </div>
            )}
          </div>
        ))}
        {showNew ? (
          <div className="border border-dashed border-indigo-300 rounded-xl p-3 bg-indigo-50/30 space-y-3">
            <div className="flex gap-2">
              <input value={newForm.id} onChange={e => setNewForm({ ...newForm, id: e.target.value })} className="w-24 text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white outline-none" placeholder="anahtar" />
              <input value={newForm.label} onChange={e => setNewForm({ ...newForm, label: e.target.value })} className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white outline-none" placeholder="İndeks adı" />
              <div className="flex items-center gap-1">
                <span className="text-xs text-slate-400">×</span>
                <input type="number" value={newForm.coefficient} onChange={e => setNewForm({ ...newForm, coefficient: e.target.value })} className="w-14 text-sm border border-slate-200 rounded-lg px-2 py-1.5 text-center bg-white outline-none" min="0" max="100" />
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {HEX_COLORS.map(c => (
                <button key={c} onClick={() => setNewForm({ ...newForm, color: c })}
                  className={`w-8 h-8 rounded-lg border-2 transition-all flex items-center justify-center ${newForm.color === c ? "border-indigo-500 ring-1 ring-indigo-200" : "border-transparent hover:border-slate-300"}`}
                  style={{ backgroundColor: c }}>{newForm.color === c && <Check size={12} className="text-white" />}</button>
              ))}
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowNew(false)} className="px-3 py-1.5 text-xs text-slate-500 bg-white border border-slate-200 rounded-lg">İptal</button>
              <button onClick={add} disabled={!newForm.id.trim() || !newForm.label.trim()} className="px-3 py-1.5 text-xs text-white bg-indigo-500 rounded-lg hover:bg-indigo-600 disabled:opacity-50">Ekle</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowNew(true)} className="w-full py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-xs font-medium text-slate-400 hover:text-indigo-500 hover:border-indigo-300 transition-colors flex items-center justify-center gap-1.5"><Plus size={14} />Yeni İndeks Türü Ekle</button>
        )}
      </div>
    );
  };

  // ── Scoring Tab ──
  const ScoringTab = () => {
    const [localCoeff, setLocalCoeff] = useState(projectTypeCoeffConfig || DEFAULT_PROJECT_TYPE_COEFF);
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2"><TrendingUp size={14} />Proje Türü Bonus Katsayısı</h3>
          <p className="text-xs text-slate-500 mb-3">Tamamlanmış ve projelendirilmiş konular için ek puan katsayısı. Bu değer yayın indeks puanından daha yüksek olmalıdır.</p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg px-3 py-2">
              <span className="text-xs text-slate-400">×</span>
              <input type="number" value={localCoeff} onChange={e => setLocalCoeff(Number(e.target.value) || 1)} className="w-16 text-sm text-center outline-none focus:ring-1 focus:ring-indigo-200 rounded" min="1" max="100" />
            </div>
            <button onClick={() => onProjectTypeCoeffChange(localCoeff)} className="px-4 py-2 text-xs font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600">Kaydet</button>
          </div>
          <p className="text-xs text-slate-400 mt-2">Her tamamlanmış ve projelendirilmiş konu için araştırmacıya bu katsayı kadar ek puan verilir.</p>
        </div>
        <div className="border-t border-slate-200 pt-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2"><Award size={14} />Yayın İndeks Katsayıları</h3>
          <p className="text-xs text-slate-500 mb-3">Her indeks türünün katsayısı "Yayın İndeksleri" sekmesinden düzenlenir. Aşağıda özet:</p>
          <div className="space-y-1.5">
            {(itcProp || []).map(item => (
              <div key={item.id} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-slate-700 flex-1">{item.label}</span>
                <span className="text-xs text-slate-500 font-mono">×{item.coefficient}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-slate-200 pt-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Puan Formülü</h3>
          <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-600 space-y-1.5 font-mono">
            <p>puan = rol_puanları</p>
            <p className="pl-6">+ tamamlanan × 15</p>
            <p className="pl-6">+ görev × 3</p>
            <p className="pl-6">- başarısız × 20</p>
            <p className="pl-6 text-indigo-600">+ indeks_bonusu (her indeks türü katsayısı toplamı)</p>
            <p className="pl-6 text-violet-600">+ proje_bonusu (tamamlanmış + projelendirilmiş × {projectTypeCoeffConfig || DEFAULT_PROJECT_TYPE_COEFF})</p>
          </div>
        </div>
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
          {activeTab === "indexTypes" && <IndexTypesTab />}
          {activeTab === "scoring" && <ScoringTab />}
          {activeTab === "education" && <EducationTab />}
          {activeTab === "links" && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">Hızlı bağlantıları yönetin. Ekle, düzenle, sil veya sırasını değiştir.</p>
              {/* Existing links */}
              <div className="space-y-1.5">
                {(quickLinks || []).map((link, idx) => (
                  <div key={link.id} className="flex items-center gap-2 bg-slate-50 rounded-lg p-2.5 border border-slate-100 group">
                    {editingLinkId === link.id ? (
                      <div className="flex-1 space-y-1.5">
                        <input value={linkDraft.label} onChange={e => setLinkDraft({ ...linkDraft, label: e.target.value })}
                          placeholder="Bağlantı adı" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                        <input value={linkDraft.url} onChange={e => setLinkDraft({ ...linkDraft, url: e.target.value })}
                          placeholder="https://..." className="w-full text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                        <div className="flex gap-1.5">
                          <button onClick={() => {
                            if (!linkDraft.label.trim() || !linkDraft.url.trim()) return;
                            onQuickLinksChange(quickLinks.map(l => l.id === link.id ? { ...l, label: linkDraft.label.trim(), url: linkDraft.url.trim() } : l));
                            setEditingLinkId(null);
                          }} className="px-3 py-1 text-xs font-medium text-white bg-indigo-500 rounded-lg hover:bg-indigo-600">Kaydet</button>
                          <button onClick={() => setEditingLinkId(null)} className="px-3 py-1 text-xs font-medium text-slate-500 bg-slate-200 rounded-lg hover:bg-slate-300">İptal</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-col gap-0.5">
                          <button onClick={() => { if (idx > 0) { const n = [...quickLinks]; [n[idx - 1], n[idx]] = [n[idx], n[idx - 1]]; onQuickLinksChange(n); } }}
                            disabled={idx === 0} className="text-slate-300 hover:text-slate-500 disabled:opacity-30"><ChevronLeft size={12} className="rotate-90" /></button>
                          <button onClick={() => { if (idx < quickLinks.length - 1) { const n = [...quickLinks]; [n[idx], n[idx + 1]] = [n[idx + 1], n[idx]]; onQuickLinksChange(n); } }}
                            disabled={idx === quickLinks.length - 1} className="text-slate-300 hover:text-slate-500 disabled:opacity-30"><ChevronRight size={12} className="rotate-90" /></button>
                        </div>
                        <ExternalLink size={14} className="text-slate-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-700 truncate">{link.label}</p>
                          <p className="text-[11px] text-slate-400 truncate">{link.url}</p>
                        </div>
                        <button onClick={() => { setEditingLinkId(link.id); setLinkDraft({ label: link.label, url: link.url }); }}
                          className="p-1 text-slate-300 hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" title="Düzenle"><Pencil size={13} /></button>
                        <button onClick={() => { if (confirm(`"${link.label}" bağlantısını silmek istiyor musunuz?`)) onQuickLinksChange(quickLinks.filter(l => l.id !== link.id)); }}
                          className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" title="Sil"><Trash2 size={13} /></button>
                      </>
                    )}
                  </div>
                ))}
                {(quickLinks || []).length === 0 && <p className="text-sm text-slate-400 text-center py-6">Henüz bağlantı eklenmemiş</p>}
              </div>
              {/* Add new link */}
              <div className="bg-indigo-50/50 rounded-xl p-3 border border-indigo-100 space-y-2">
                <h4 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Yeni Bağlantı Ekle</h4>
                <input value={editingLinkId === "new" ? linkDraft.label : ""} onChange={e => { setEditingLinkId("new"); setLinkDraft({ ...linkDraft, label: e.target.value }); }}
                  onFocus={() => { if (editingLinkId !== "new") { setEditingLinkId("new"); setLinkDraft({ label: "", url: "" }); } }}
                  placeholder="Bağlantı adı" className="w-full text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white" />
                <div className="flex gap-2">
                  <input value={editingLinkId === "new" ? linkDraft.url : ""} onChange={e => { setEditingLinkId("new"); setLinkDraft({ ...linkDraft, url: e.target.value }); }}
                    onFocus={() => { if (editingLinkId !== "new") { setEditingLinkId("new"); setLinkDraft({ label: linkDraft.label || "", url: "" }); } }}
                    onKeyDown={e => {
                      if (e.key === "Enter" && linkDraft.label.trim() && linkDraft.url.trim()) {
                        onQuickLinksChange([...(quickLinks || []), { id: `ql_${Date.now()}`, label: linkDraft.label.trim(), url: linkDraft.url.trim(), icon: "external" }]);
                        setLinkDraft({ label: "", url: "" }); setEditingLinkId(null);
                      }
                    }}
                    placeholder="https://..." className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-200 bg-white" />
                  <button onClick={() => {
                    if (!linkDraft.label.trim() || !linkDraft.url.trim()) return;
                    onQuickLinksChange([...(quickLinks || []), { id: `ql_${Date.now()}`, label: linkDraft.label.trim(), url: linkDraft.url.trim(), icon: "external" }]);
                    setLinkDraft({ label: "", url: "" }); setEditingLinkId(null);
                  }} className="px-3 py-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 text-sm font-medium flex items-center gap-1"><Plus size={14} />Ekle</button>
                </div>
              </div>
              {/* Reset to defaults */}
              <button onClick={() => { if (confirm("Bağlantıları varsayılana sıfırlamak istiyor musunuz?")) onQuickLinksChange(defaultQuickLinks); }}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1"><AlertTriangle size={11} />Varsayılana sıfırla</button>
            </div>
          )}
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

              {/* Manuel Senkronizasyon */}
              <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
                <h4 className="text-sm font-semibold text-indigo-800 flex items-center gap-2 mb-2"><RefreshCw size={15} />Manuel Senkronizasyon</h4>
                <p className="text-xs text-indigo-600 mb-3">Otomatik senkronizasyon her 30 saniyede çalışır. Sorun yaşıyorsanız bu butonla tüm verileri elle senkronize edebilirsiniz.</p>
                <button onClick={onForceSync} disabled={syncStatus === "syncing"}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-all flex items-center gap-2 ${syncStatus === "syncing" ? "bg-indigo-400 cursor-not-allowed" : syncStatus === "done" ? "bg-emerald-500" : "bg-indigo-500 hover:bg-indigo-600"}`}>
                  <RefreshCw size={14} className={syncStatus === "syncing" ? "animate-spin" : ""} />
                  {syncStatus === "syncing" ? "Senkronize ediliyor..." : syncStatus === "done" ? "Senkronize edildi!" : "Senkronize Et"}
                </button>
              </div>

              {/* Zorunlu Yayınla */}
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <h4 className="text-sm font-semibold text-amber-800 flex items-center gap-2 mb-2"><Upload size={15} />Zorunlu Yayınla</h4>
                <p className="text-xs text-amber-600 mb-3">Tüm verileri Firestore'a yazar ve açık olan tüm ekranlara "Sayfa Güncelleniyor" bildirimi gönderip sayfayı yeniler. Senkronizasyon sorunu yaşanıyorsa kullanın.</p>
                <button onClick={onForcePublish}
                  className="px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2">
                  <Upload size={14} />Tüm Ekranlara Yayınla
                </button>
              </div>

              {/* Firestore Yedekleme — sadece Master */}
              {isMaster && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <h4 className="text-sm font-semibold text-amber-800 flex items-center gap-2 mb-2"><DatabaseBackup size={15} />Bulut Yedekleme (Firestore)</h4>
                  <p className="text-xs text-amber-600 mb-2">Verileriniz Firestore'a yedeklenir ve JSON olarak da indirilir. Her "Yayınla" işleminde otomatik yedek alınır.</p>
                  {lastBackupAt && (
                    <p className="text-xs text-amber-700 mb-3 font-medium">
                      Son yedek: {lastBackupAt.toLocaleDateString("tr-TR")} {lastBackupAt.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                      {(Date.now() - lastBackupAt.getTime() > 30 * 24 * 60 * 60 * 1000) && (
                        <span className="text-red-600 font-bold ml-2">⚠️ 30 günü aştı!</span>
                      )}
                    </p>
                  )}
                  {!lastBackupAt && (
                    <p className="text-xs text-red-600 font-bold mb-3">⚠️ Hiç yedek alınmamış!</p>
                  )}
                  <div className="flex gap-2">
                    <button onClick={onBackupDownload}
                      className="px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2">
                      <Download size={14} />Yedek Al (JSON + Firestore)
                    </button>
                    <button onClick={() => document.getElementById("backup-restore-input")?.click()}
                      className="px-4 py-2 text-sm font-medium text-amber-700 bg-white border border-amber-300 rounded-lg hover:bg-amber-50 transition-colors flex items-center gap-2">
                      <Upload size={14} />Yedekten Geri Yükle
                    </button>
                  </div>
                </div>
              )}

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

                    {activeTab === "report" && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                <h3 className="text-sm font-bold text-indigo-800 flex items-center gap-2 mb-2"><FileText size={16} />Ar-Ge Dashboard Akademik Raporu</h3>
                <p className="text-xs text-slate-600 mb-3">Bu rapor, Ar-Ge Dashboard uygulamasının geliştirilme sürecini, kullanılan yapay zeka teknolojilerini, Ar-Ge birimi sorunlarına getirilen çözümleri ve gelecek araştırma yönelimlerini akademik formatta açıklamaktadır.</p>
                <div className="flex gap-2 flex-wrap">
                  <a href={"/ArGe-Dashboard-Teknik-Rapor.pdf"} download className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 no-underline">
                    <Download size={14} />PDF İndir
                  </a>
                  <a href={"/ArGe-Dashboard-Teknik-Rapor.docx"} download className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 no-underline">
                    <Download size={14} />Word İndir (.docx)
                  </a>
                  <a href={"/ArGe-Dashboard-Teknik-Rapor.md"} download className="px-4 py-2 text-sm font-medium text-white bg-slate-600 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2 no-underline">
                    <Download size={14} />Markdown İndir
                  </a>
                  <button onClick={() => {
                    window.open("/ArGe-Dashboard-Teknik-Rapor.pdf", "_blank");
                  }} className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-2 border border-indigo-200">
                    <Eye size={14} />PDF Önizle
                  </button>
                </div>
              </div>
              <ReportPreview />

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
  const [aofFilter, setAofFilter] = useState("");
  const filteredResearchers = useMemo(() => {
    if (!aofFilter) return researchers;
    return researchers.filter(r => aofFilter === "aof" ? r.isAofMember : !r.isAofMember);
  }, [researchers, aofFilter]);
  const leaderboard = useMemo(() => {
    const activeByRole = (rid, role) => topics.filter(t => t.status === "active" && (t.researchers || []).some(tr => tr.researcherId === rid && tr.role === role)).length;
    return filteredResearchers.map(r => {
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
      // Yayın indeks bonusu
      let indexBonus = 0;
      topicEntries.filter(t => t.status === "completed" && t.publishingIndex?.types?.length > 0).forEach(t => {
        t.publishingIndex.types.forEach(iid => { const ic = (indexTypesConfig || []).find(i => i.id === iid); indexBonus += ic ? ic.coefficient : 1; });
      });
      // Proje türü bonusu (tamamlanmış + projelendirilmiş konular)
      const projBonusCount = topicEntries.filter(t => t.status === "completed" && projects.some(p => (p.topics || []).includes(t.id))).length;
      const projBonus = projBonusCount * (projectTypeCoeff || 5);
      const baseScore = leadCount * 10 + unitManagerCount * 9 + responsibleCount * 8 + memberCount * 4 + advisorCount * 2 + scholarCount * 1 + completedCount * 15 + doneTasks * 3 - failedCount * 20;
      return {
        ...r, total: topicEntries.length, leadCount, unitManagerCount, responsibleCount, memberCount, advisorCount, scholarCount,
        completedCount, failedCount, tasksDone: doneTasks, tasksTotal: myTasks.length, indexBonus, projBonus,
        score: baseScore + indexBonus + projBonus
      };
    }).filter(r => r.total > 0);
  }, [filteredResearchers, topics, projects]);

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
    else if (sortBy === "indexBonus") arr.sort((a, b) => b.indexBonus - a.indexBonus);
    else if (sortBy === "projBonus") arr.sort((a, b) => b.projBonus - a.projBonus);
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
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-teal-200 rounded-lg overflow-hidden">
              <button onClick={() => setAofFilter("")} className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${!aofFilter ? "bg-teal-500 text-white" : "bg-white text-slate-500 hover:bg-teal-50"}`}>Tümü</button>
              <button onClick={() => setAofFilter("aof")} className={`px-2.5 py-1.5 text-xs font-medium transition-colors border-l border-teal-200 ${aofFilter === "aof" ? "bg-teal-500 text-white" : "bg-white text-teal-600 hover:bg-teal-50"}`}>AÖF Üyesi</button>
              <button onClick={() => setAofFilter("other")} className={`px-2.5 py-1.5 text-xs font-medium transition-colors border-l border-teal-200 ${aofFilter === "other" ? "bg-teal-500 text-white" : "bg-white text-slate-500 hover:bg-teal-50"}`}>Diğer</button>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><X size={18} /></button>
          </div>
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
                <th onClick={() => setSortBy("indexBonus")} className={sortBy === "indexBonus" ? thAct : thNorm}>
                  <div className="flex items-center justify-center gap-0.5">Yayın<InfoTip tip="Tamamlanmış konulardaki yayın indeks katsayıları toplamı" /></div>
                </th>
                <th onClick={() => setSortBy("projBonus")} className={sortBy === "projBonus" ? thAct : thNorm}>
                  <div className="flex items-center justify-center gap-0.5">Proje Pn.<InfoTip tip="Tamamlanmış ve projelendirilmiş konu başına ek puan" /></div>
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
                  <td className={`px-3 py-2.5 text-center text-sm font-medium text-blue-600 ${sortBy === "indexBonus" ? "bg-indigo-50/30" : ""}`}>
                    {r.indexBonus > 0 ? <span>+{r.indexBonus}</span> : <span className="text-slate-300">0</span>}
                  </td>
                  <td className={`px-3 py-2.5 text-center text-sm font-medium text-violet-600 ${sortBy === "projBonus" ? "bg-indigo-50/30" : ""}`}>
                    {r.projBonus > 0 ? <span>+{r.projBonus}</span> : <span className="text-slate-300">0</span>}
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
            <span className="font-bold text-slate-300">+</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" />Yayın İndeks <span className="font-mono text-blue-600">katsayı</span></span>
            <span className="font-bold text-slate-300">+</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-500" />Proje Pn. <span className="font-mono text-violet-600">×{projectTypeCoeff || 5}</span></span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Sütun başlıklarına tıklayarak sıralama değiştirebilirsiniz. Yayın = tamamlanmış konulardaki indeks katsayıları toplamı. Proje Pn. = tamamlanmış ve projelendirilmiş konu başına ek puan.</p>
        </div>
      </div>
    </>
  );
};

// ─── Otomatik Proje Türü Renk Paleti ────────────────────
const PT_COLOR_PALETTE = ["#6366f1","#10b981","#3b82f6","#f59e0b","#ec4899","#8b5cf6","#14b8a6","#f97316","#06b6d4","#a78bfa","#84cc16","#ef4444","#0ea5e9","#d946ef"];
const getPtColor = (label, index) => PT_COLOR_PALETTE[index % PT_COLOR_PALETTE.length];
const withPtColors = (entries) => entries.map(([label, value], i) => ({ label, value, color: getPtColor(label, i) }));

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
  const [aofFilter, setAofFilter] = useState("");

  const aofResearcherIds = useMemo(() => {
    if (!aofFilter) return null;
    const ids = new Set();
    researchers.forEach(r => { if (aofFilter === "aof" ? r.isAofMember : !r.isAofMember) ids.add(r.id); });
    return ids;
  }, [researchers, aofFilter]);

  const filteredTopics = useMemo(() => {
    let result = topics;
    if (aofResearcherIds) result = result.filter(t => (t.researchers || []).some(r => aofResearcherIds.has(r.researcherId)));
    if (personFilter) result = result.filter(t => (t.researchers || []).some(r => r.researcherId === personFilter));
    if (statusFilter) result = result.filter(t => t.status === statusFilter);
    if (typeFilter) result = result.filter(t => t.projectType === typeFilter);
    return result;
  }, [topics, personFilter, statusFilter, typeFilter, aofResearcherIds]);

  const filteredProjects = useMemo(() => {
    let result = projects;
    if (aofResearcherIds) {
      const aofTopicIds = new Set(topics.filter(t => (t.researchers || []).some(r => aofResearcherIds.has(r.researcherId))).map(t => t.id));
      result = result.filter(p => (p.topics || []).some(tid => aofTopicIds.has(tid)));
    }
    if (personFilter) {
      const personTopicIds = topics.filter(t => (t.researchers || []).some(r => r.researcherId === personFilter)).map(t => t.id);
      result = result.filter(p => (p.topics || []).some(tid => personTopicIds.includes(tid)));
    }
    if (statusFilter) result = result.filter(p => p.status === statusFilter);
    if (typeFilter) result = result.filter(p => p.type === typeFilter);
    return result;
  }, [projects, topics, personFilter, statusFilter, typeFilter, aofResearcherIds]);

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
    // Projelerdeki doğrudan atanan araştırmacıları da say
    fp.forEach(p => (p.researchers || []).forEach(r => uniqueResearchers.add(r.researcherId)));
    // Kişi istatistikleri
    const totalResearchers = researchers.length;
    const aofMembers = researchers.filter(r => r.isAofMember).length;
    const piExperienced = researchers.filter(r => r.hasPIExperience).length;
    const withTopics = researchers.filter(r => ft.some(t => (t.researchers || []).some(tr => tr.researcherId === r.id))).length;
    const withoutTopics = totalResearchers - withTopics;
    // Fikir sahipleri sayısı
    const ideaOwnerIds = new Set();
    ft.forEach(t => (t.researchers || []).filter(tr => tr.isIdeaOwner).forEach(tr => ideaOwnerIds.add(tr.researcherId)));
    fp.forEach(p => (p.researchers || []).filter(pr => pr.isIdeaOwner).forEach(pr => ideaOwnerIds.add(pr.researcherId)));
    const ideaOwners = ideaOwnerIds.size;
    // Proje türü dağılımı (sadece projelendirilmiş konular)
    const projectTypeDistribution = {};
    ft.filter(t => fp.some(p => (p.topics || []).includes(t.id))).forEach(t => { if (t.projectType) projectTypeDistribution[t.projectType] = (projectTypeDistribution[t.projectType] || 0) + 1; });
    return { topicCount: ft.length, projectCount: fp.length, topicsByStatus, projectsByStatus, totalBudget, totalTasks: allTasks.length, doneTasks: allTasks.filter(t => t.status === "done").length, uniqueResearchers: uniqueResearchers.size, totalResearchers, aofMembers, piExperienced, withTopics, withoutTopics, ideaOwners, projectTypeDistribution };
  }, [filteredTopics, filteredProjects, researchers]);

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

  const [selectedPersonId, setSelectedPersonId] = useState("");

  // Person-based stats
  const personStats = useMemo(() => {
    if (!selectedPersonId) return null;
    const person = researchers.find(r => r.id === selectedPersonId);
    if (!person) return null;
    const myTopics = topics.filter(t => (t.researchers || []).some(r => r.researcherId === selectedPersonId));
    const myTopicStatus = { proposed: 0, active: 0, completed: 0 };
    myTopics.forEach(t => { if (myTopicStatus[t.status] !== undefined) myTopicStatus[t.status]++; });
    const myProjectTopicIds = new Set(myTopics.map(t => t.id));
    const myProjects = (projects || []).filter(p =>
      (p.researchers || []).some(r => r.researcherId === selectedPersonId) ||
      (p.topics || []).some(tid => myProjectTopicIds.has(tid))
    );
    const myProjectStatus = { proposed: 0, planning: 0, active: 0, completed: 0 };
    myProjects.forEach(p => { if (myProjectStatus[p.status] !== undefined) myProjectStatus[p.status]++; });
    const proposedProjects = (myProjectStatus.proposed || 0) + (myProjectStatus.planning || 0);
    const allTasks = [...myTopics, ...myProjects].flatMap(x => x.tasks || []);
    const doneTasks = allTasks.filter(tk => tk.status === "done").length;
    const myRoleCounts = {};
    myTopics.forEach(t => {
      const a = t.researchers.find(r => r.researcherId === selectedPersonId);
      if (a?.role) myRoleCounts[a.role] = (myRoleCounts[a.role] || 0) + 1;
    });
    return { person, myTopics, myTopicStatus, myProjects, myProjectStatus, proposedProjects, allTasks, doneTasks, myRoleCounts };
  }, [selectedPersonId, researchers, topics, projects]);

  // Researcher column stats (same logic as main page)
  const researcherStats = useMemo(() => {
    const matchesAof = (rid) => !aofResearcherIds || aofResearcherIds.has(rid);
    const uniqueResInTopics = (status) => {
      const ids = new Set();
      topics.filter(t => t.status === status).forEach(t => (t.researchers || []).forEach(r => { if (matchesAof(r.researcherId)) ids.add(r.researcherId); }));
      return ids.size;
    };
    const uniqueResInProjects = (status) => {
      const ids = new Set();
      projects.filter(p => p.status === status).forEach(p => {
        (p.researchers || []).forEach(r => { if (matchesAof(r.researcherId)) ids.add(r.researcherId); });
        (p.topics || []).forEach(tid => {
          const t = topics.find(x => x.id === tid);
          if (t) (t.researchers || []).forEach(r => { if (matchesAof(r.researcherId)) ids.add(r.researcherId); });
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
  }, [topics, projects, aofResearcherIds]);

  // Title (unvan) distribution
  const titleDistribution = useMemo(() => {
    const filteredRes = aofResearcherIds ? researchers.filter(r => aofResearcherIds.has(r.id)) : researchers;
    const counts = {};
    const order = ["Prof.Dr.", "Doç.Dr.", "Dr.Öğr.Üyesi", "Öğr.Gör.Dr.", "Arş.Gör.Dr.", "Arş.Gör.", "Belirtilmemiş"];
    const colors = { "Prof.Dr.": "#6366f1", "Doç.Dr.": "#8b5cf6", "Dr.Öğr.Üyesi": "#3b82f6", "Öğr.Gör.Dr.": "#10b981", "Arş.Gör.Dr.": "#14b8a6", "Arş.Gör.": "#f59e0b", "Belirtilmemiş": "#94a3b8" };
    filteredRes.forEach(r => {
      const t = (r.title && r.title.trim()) ? r.title.trim() : "Belirtilmemiş";
      counts[t] = (counts[t] || 0) + 1;
    });
    const sorted = order.filter(t => counts[t]).map(t => ({ title: t, count: counts[t], color: colors[t] || "#94a3b8" }));
    Object.keys(counts).forEach(t => { if (!order.includes(t)) sorted.push({ title: t, count: counts[t], color: "#94a3b8" }); });
    const max = Math.max(...sorted.map(s => s.count), 1);
    return { items: sorted, max, total: filteredRes.length };
  }, [researchers, aofResearcherIds]);

  // Time stats
  const [timeView, setTimeView] = useState("year"); // "year" or "month"
  const [timeSelectedYear, setTimeSelectedYear] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState("");

  const availableYears = useMemo(() => {
    const ySet = new Set();
    [...topics, ...projects].forEach(item => {
      if (item.startDate) ySet.add(item.startDate.slice(0, 4));
      if (item.endDate) ySet.add(item.endDate.slice(0, 4));
      if (item.createdAt) ySet.add(item.createdAt.slice(0, 4));
    });
    return [...ySet].sort();
  }, [topics, projects]);

  const timeData = useMemo(() => {
    if (timeView === "year") {
      // Year-based aggregation
      const yearMap = {};
      availableYears.forEach(y => { yearMap[y] = { proposedT: 0, activeT: 0, completedT: 0, proposedP: 0, activeP: 0, completedP: 0 }; });
      topics.forEach(t => {
        const y = (t.startDate || t.createdAt || "").slice(0, 4);
        if (!y || !yearMap[y]) return;
        if (t.status === "proposed") yearMap[y].proposedT++;
        else if (t.status === "active") yearMap[y].activeT++;
        else if (t.status === "completed") yearMap[y].completedT++;
      });
      projects.forEach(p => {
        const y = (p.startDate || p.createdAt || "").slice(0, 4);
        if (!y || !yearMap[y]) return;
        if (p.status === "proposed" || p.status === "planning") yearMap[y].proposedP++;
        else if (p.status === "active") yearMap[y].activeP++;
        else if (p.status === "completed") yearMap[y].completedP++;
      });
      return Object.entries(yearMap).map(([y, v]) => ({ label: y, ...v }));
    } else {
      // Month-based aggregation for selected year
      const yr = timeSelectedYear || availableYears[availableYears.length - 1] || new Date().getFullYear().toString();
      const months = ["01","02","03","04","05","06","07","08","09","10","11","12"];
      const monthNames = ["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];
      const monthMap = {};
      months.forEach((m, i) => { monthMap[`${yr}-${m}`] = { label: monthNames[i], proposedT: 0, activeT: 0, completedT: 0, proposedP: 0, activeP: 0, completedP: 0 }; });
      topics.forEach(t => {
        const ym = (t.startDate || t.createdAt || "").slice(0, 7);
        if (!monthMap[ym]) return;
        if (t.status === "proposed") monthMap[ym].proposedT++;
        else if (t.status === "active") monthMap[ym].activeT++;
        else if (t.status === "completed") monthMap[ym].completedT++;
      });
      projects.forEach(p => {
        const ym = (p.startDate || p.createdAt || "").slice(0, 7);
        if (!monthMap[ym]) return;
        if (p.status === "proposed" || p.status === "planning") monthMap[ym].proposedP++;
        else if (p.status === "active") monthMap[ym].activeP++;
        else if (p.status === "completed") monthMap[ym].completedP++;
      });
      return Object.values(monthMap);
    }
  }, [timeView, timeSelectedYear, topics, projects, availableYears]);

  const tabs = [
    { key: "summary", label: "Özet", icon: BarChart3 },
    { key: "researcherStats", label: "Araştırmacı İst.", icon: Users },
    { key: "personReport", label: "Kişi Bazlı Rapor", icon: UserCheck },
    { key: "timeStats", label: "Zaman İstatistikleri", icon: CalendarDays },
    { key: "topics", label: "Konu Bazlı", icon: BookOpen },
    { key: "projects", label: "Proje Bazlı", icon: FolderKanban },
    { key: "publishingIndex", label: "Yayın İndeksleri", icon: Award },
    { key: "collaboration", label: "İşbirliği", icon: Users },
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
            {(aofResearcherIds ? researchers.filter(r => aofResearcherIds.has(r.id)) : researchers).map(r => <option key={r.id} value={r.id}>{r.title ? `${r.title} ` : ""}{r.name}</option>)}
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
          <div className="flex items-center border border-teal-200 rounded-lg overflow-hidden">
            <button onClick={() => setAofFilter("")} className={`px-2.5 py-1.5 text-xs font-medium transition-colors ${!aofFilter ? "bg-teal-500 text-white" : "bg-white text-slate-500 hover:bg-teal-50"}`}>Tümü</button>
            <button onClick={() => setAofFilter("aof")} className={`px-2.5 py-1.5 text-xs font-medium transition-colors border-l border-teal-200 ${aofFilter === "aof" ? "bg-teal-500 text-white" : "bg-white text-teal-600 hover:bg-teal-50"}`}>AÖF Üyesi</button>
            <button onClick={() => setAofFilter("other")} className={`px-2.5 py-1.5 text-xs font-medium transition-colors border-l border-teal-200 ${aofFilter === "other" ? "bg-teal-500 text-white" : "bg-white text-slate-500 hover:bg-teal-50"}`}>Diğer</button>
          </div>
          {(personFilter || statusFilter || typeFilter || yearFilter || aofFilter) && (
            <button onClick={() => { setPersonFilter(""); setStatusFilter(""); setTypeFilter(""); setYearFilter(""); setAofFilter(""); }} className="text-xs text-red-500 hover:text-red-700 px-2">Filtreleri Temizle</button>
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
              {/* Top row: genel sayılar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {statCard("Araştırmacı", summary.uniqueResearchers, <Users size={16} className="text-indigo-500" />, "bg-indigo-50")}
                {statCard("Toplam Konu", summary.topicCount, <BookOpen size={16} className="text-emerald-500" />, "bg-emerald-50")}
                {statCard("Toplam Proje", summary.projectCount, <FolderKanban size={16} className="text-violet-500" />, "bg-violet-50")}
                {statCard("Toplam Bütçe", `₺${summary.totalBudget.toLocaleString("tr-TR")}`, <Briefcase size={16} className="text-amber-500" />, "bg-amber-50")}
              </div>
              {/* Konu durum kartları */}
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Konular</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                    <BookOpen size={16} className="text-slate-400" />
                    <div><p className="text-[10px] text-slate-400">Önerilen Konu</p><p className="text-lg font-bold text-slate-700">{summary.topicsByStatus.proposed || 0}</p></div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <BookOpen size={16} className="text-emerald-500" />
                    <div><p className="text-[10px] text-emerald-500">Aktif Konu</p><p className="text-lg font-bold text-emerald-700">{summary.topicsByStatus.active || 0}</p></div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 rounded-xl border border-blue-100">
                    <BookOpen size={16} className="text-blue-500" />
                    <div><p className="text-[10px] text-blue-500">Tamamlanan Konu</p><p className="text-lg font-bold text-blue-700">{summary.topicsByStatus.completed || 0}</p></div>
                  </div>
                </div>
              </div>
              {/* Proje durum kartları */}
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Projeler</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 rounded-xl border border-amber-100">
                    <FolderKanban size={16} className="text-amber-500" />
                    <div><p className="text-[10px] text-amber-500">Önerilen Proje</p><p className="text-lg font-bold text-amber-700">{(summary.projectsByStatus.proposed || 0) + (summary.projectsByStatus.planning || 0)}</p></div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 bg-violet-50 rounded-xl border border-violet-100">
                    <FolderKanban size={16} className="text-violet-500" />
                    <div><p className="text-[10px] text-violet-500">Aktif Proje</p><p className="text-lg font-bold text-violet-700">{summary.projectsByStatus.active || 0}</p></div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 bg-teal-50 rounded-xl border border-teal-100">
                    <FolderKanban size={16} className="text-teal-500" />
                    <div><p className="text-[10px] text-teal-500">Tamamlanan Proje</p><p className="text-lg font-bold text-teal-700">{summary.projectsByStatus.completed || 0}</p></div>
                  </div>
                </div>
              </div>
              {/* Kişi İstatistikleri */}
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Araştırmacılar</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-center gap-3 px-4 py-3 bg-indigo-50 rounded-xl border border-indigo-100">
                    <Users size={16} className="text-indigo-500" />
                    <div><p className="text-[10px] text-indigo-500">Toplam Kişi</p><p className="text-lg font-bold text-indigo-700">{summary.totalResearchers}</p></div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 bg-teal-50 rounded-xl border border-teal-100">
                    <Users size={16} className="text-teal-500" />
                    <div><p className="text-[10px] text-teal-500">AÖF Üyesi</p><p className="text-lg font-bold text-teal-700">{summary.aofMembers}</p></div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 rounded-xl border border-amber-100">
                    <Award size={16} className="text-amber-500" />
                    <div><p className="text-[10px] text-amber-500">PI Deneyimli</p><p className="text-lg font-bold text-amber-700">{summary.piExperienced}</p></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <Users size={16} className="text-emerald-500" />
                    <div><p className="text-[10px] text-emerald-500">Konusu Olan</p><p className="text-lg font-bold text-emerald-700">{summary.withTopics}</p></div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                    <Users size={16} className="text-slate-400" />
                    <div><p className="text-[10px] text-slate-400">Konusu Olmayan</p><p className="text-lg font-bold text-slate-700">{summary.withoutTopics}</p></div>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 bg-yellow-50 rounded-xl border border-yellow-100">
                    <Lightbulb size={16} className="text-yellow-500" />
                    <div><p className="text-[10px] text-yellow-500">Fikir Sahibi</p><p className="text-lg font-bold text-yellow-700">{summary.ideaOwners}</p></div>
                  </div>
                </div>
              </div>
              {/* Proje Türü Dağılımı — Bar Chart */}
              {Object.keys(summary.projectTypeDistribution).length > 0 && (() => {
                const ptEntries = Object.entries(summary.projectTypeDistribution).sort((a, b) => b[1] - a[1]);
                const ptMax = Math.max(...ptEntries.map(e => e[1]), 1);
                const ptTotal = ptEntries.reduce((s, e) => s + e[1], 0);
                return (
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Proje Türü Dağılımı</p>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="space-y-2">
                    {ptEntries.map(([label, count], i) => (
                      <div key={label} className="flex items-center gap-3">
                        <span className="text-xs font-medium text-slate-600 w-28 text-right flex-shrink-0 truncate" title={label}>{label}</span>
                        <div className="flex-1 bg-slate-200 rounded-full h-5 overflow-hidden">
                          <div className="h-full rounded-full flex items-center justify-end pr-2 transition-all" style={{ width: `${Math.max((count / ptMax) * 100, 12)}%`, backgroundColor: getPtColor(label, i) }}>
                            <span className="text-[10px] font-bold text-white">{count}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-3 text-right">Toplam: {ptTotal} projelendirilmiş konu</p>
                </div>
              </div>
                );
              })()}
              {/* Görevler */}
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Görevler</p>
                <div className="flex items-center gap-3 bg-sky-50 rounded-xl p-4 border border-sky-100">
                  <ListTodo size={18} className="text-sky-500 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-slate-600 font-medium">{summary.doneTasks} / {summary.totalTasks} tamamlandı</span>
                      <span className="text-sm font-bold text-sky-600">{summary.totalTasks > 0 ? Math.round((summary.doneTasks / summary.totalTasks) * 100) : 0}%</span>
                    </div>
                    <div className="w-full bg-sky-100 rounded-full h-2">
                      <div className="bg-gradient-to-r from-sky-500 to-emerald-500 h-2 rounded-full transition-all" style={{ width: `${summary.totalTasks > 0 ? (summary.doneTasks / summary.totalTasks) * 100 : 0}%` }} />
                    </div>
                  </div>
                </div>
              </div>
              {/* Unvan Dağılımı */}
              {titleDistribution.items.length > 0 && (
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Unvan Dağılımı</p>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="space-y-2">
                    {titleDistribution.items.map(item => (
                      <div key={item.title} className="flex items-center gap-3">
                        <span className="text-xs font-medium text-slate-600 w-28 text-right flex-shrink-0">{item.title}</span>
                        <div className="flex-1 bg-slate-200 rounded-full h-5 overflow-hidden">
                          <div className="h-full rounded-full flex items-center justify-end pr-2 transition-all" style={{ width: `${Math.max((item.count / titleDistribution.max) * 100, 12)}%`, backgroundColor: item.color }}>
                            <span className="text-[10px] font-bold text-white">{item.count}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-3 text-right">Toplam: {titleDistribution.total} araştırmacı</p>
                </div>
              </div>
              )}
              {/* Grafikler */}
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

          {/* Araştırmacı İstatistikleri Tab */}
          {activeTab === "researcherStats" && (
            <div className="space-y-6">
              <p className="text-sm text-slate-500">Her durumdaki konu ve projelerde yer alan benzersiz (unique) araştırmacı sayıları.</p>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Konulardaki Araştırmacılar</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <BookOpen size={16} className="text-slate-400 mx-auto mb-2" />
                    <p className="text-[10px] text-slate-400 mb-1">Önerilen Konu</p>
                    <p className="text-2xl font-bold text-slate-700">{researcherStats.proposedTopicRes}</p>
                    <p className="text-[9px] text-slate-300 mt-0.5">kişi</p>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <BookOpen size={16} className="text-emerald-500 mx-auto mb-2" />
                    <p className="text-[10px] text-emerald-500 mb-1">Aktif Konu</p>
                    <p className="text-2xl font-bold text-emerald-700">{researcherStats.activeTopicRes}</p>
                    <p className="text-[9px] text-emerald-300 mt-0.5">kişi</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <BookOpen size={16} className="text-blue-500 mx-auto mb-2" />
                    <p className="text-[10px] text-blue-500 mb-1">Tamamlanan Konu</p>
                    <p className="text-2xl font-bold text-blue-700">{researcherStats.completedTopicRes}</p>
                    <p className="text-[9px] text-blue-300 mt-0.5">kişi</p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Projelerdeki Araştırmacılar</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-4 bg-amber-50 rounded-xl border border-amber-100">
                    <FolderKanban size={16} className="text-amber-500 mx-auto mb-2" />
                    <p className="text-[10px] text-amber-500 mb-1">Önerilen Proje</p>
                    <p className="text-2xl font-bold text-amber-700">{researcherStats.proposedProjectRes}</p>
                    <p className="text-[9px] text-amber-300 mt-0.5">kişi</p>
                  </div>
                  <div className="text-center p-4 bg-violet-50 rounded-xl border border-violet-100">
                    <FolderKanban size={16} className="text-violet-500 mx-auto mb-2" />
                    <p className="text-[10px] text-violet-500 mb-1">Aktif Proje</p>
                    <p className="text-2xl font-bold text-violet-700">{researcherStats.activeProjectRes}</p>
                    <p className="text-[9px] text-violet-300 mt-0.5">kişi</p>
                  </div>
                  <div className="text-center p-4 bg-teal-50 rounded-xl border border-teal-100">
                    <FolderKanban size={16} className="text-teal-500 mx-auto mb-2" />
                    <p className="text-[10px] text-teal-500 mb-1">Tamamlanan Proje</p>
                    <p className="text-2xl font-bold text-teal-700">{researcherStats.completedProjectRes}</p>
                    <p className="text-[9px] text-teal-300 mt-0.5">kişi</p>
                  </div>
                </div>
              </div>
              {/* Unvan Dağılımı */}
              {titleDistribution.items.length > 0 && (
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2"><GraduationCap size={14} className="text-indigo-500" />Unvan Dağılımı</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {titleDistribution.items.map(item => (
                    <div key={item.title} className="text-center p-3 bg-white rounded-lg border border-slate-100">
                      <p className="text-2xl font-bold" style={{ color: item.color }}>{item.count}</p>
                      <p className="text-[10px] text-slate-500 mt-1 font-medium">{item.title}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-2 text-right">Toplam: {titleDistribution.total} araştırmacı</p>
              </div>
              )}
              {/* Proje Türü Bazlı Dağılım — sadece projelendirilmiş konular */}
              {(() => {
                const ptDist = {};
                const filteredT = aofResearcherIds ? topics.filter(t => (t.researchers || []).some(r => aofResearcherIds.has(r.researcherId))) : topics;
                filteredT.filter(t => projects.some(p => (p.topics || []).includes(t.id))).forEach(t => { if (t.projectType) ptDist[t.projectType] = (ptDist[t.projectType] || 0) + 1; });
                const entries = Object.entries(ptDist).sort((a, b) => b[1] - a[1]);
                if (entries.length === 0) return null;
                const ptMax2 = Math.max(...entries.map(e => e[1]), 1);
                const ptTotal2 = entries.reduce((s, e) => s + e[1], 0);
                return (
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2"><FolderKanban size={14} className="text-indigo-500" />Proje Türü Dağılımı</h3>
                    <div className="space-y-2">
                      {entries.map(([label, count], i) => (
                        <div key={label} className="flex items-center gap-3">
                          <span className="text-xs font-medium text-slate-600 w-28 text-right flex-shrink-0 truncate" title={label}>{label}</span>
                          <div className="flex-1 bg-slate-200 rounded-full h-5 overflow-hidden">
                            <div className="h-full rounded-full flex items-center justify-end pr-2 transition-all" style={{ width: `${Math.max((count / ptMax2) * 100, 12)}%`, backgroundColor: getPtColor(label, i) }}>
                              <span className="text-[10px] font-bold text-white">{count}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-3 text-right">Toplam: {ptTotal2} projelendirilmiş konu</p>
                  </div>
                );
              })()}
              {/* Researcher activity table */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Araştırmacı Aktivite Tablosu</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th rowSpan="2" className="pb-2 font-semibold text-slate-500 text-left align-bottom">Araştırmacı</th>
                        <th colSpan="3" className="pb-1 font-semibold text-slate-400 text-center border-b border-slate-100 text-[10px] uppercase tracking-wider">Konular</th>
                        <th colSpan="3" className="pb-1 font-semibold text-slate-400 text-center border-b border-slate-100 text-[10px] uppercase tracking-wider">Projeler</th>
                        <th rowSpan="2" className="pb-2 font-semibold text-slate-500 text-center align-bottom">Görev</th>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <th className="pb-1.5 pt-1 text-[9px] font-medium text-slate-400 text-center">Önerilen</th>
                        <th className="pb-1.5 pt-1 text-[9px] font-medium text-emerald-500 text-center">Aktif</th>
                        <th className="pb-1.5 pt-1 text-[9px] font-medium text-blue-500 text-center">Tamamlanan</th>
                        <th className="pb-1.5 pt-1 text-[9px] font-medium text-amber-500 text-center">Önerilen</th>
                        <th className="pb-1.5 pt-1 text-[9px] font-medium text-violet-500 text-center">Aktif</th>
                        <th className="pb-1.5 pt-1 text-[9px] font-medium text-teal-500 text-center">Tamamlanan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(aofResearcherIds ? researchers.filter(r => aofResearcherIds.has(r.id)) : researchers).map(r => {
                        const rTopics = topics.filter(t => (t.researchers || []).some(ra => ra.researcherId === r.id));
                        const rTopicIds = new Set(rTopics.map(t => t.id));
                        const rProjects = projects.filter(p => (p.researchers || []).some(ra => ra.researcherId === r.id) || (p.topics || []).some(tid => rTopicIds.has(tid)));
                        const rTasks = [...rTopics, ...rProjects].flatMap(x => x.tasks || []);
                        const rDone = rTasks.filter(tk => tk.status === "done").length;
                        const tProposed = rTopics.filter(t => t.status === "proposed").length;
                        const tActive = rTopics.filter(t => t.status === "active").length;
                        const tCompleted = rTopics.filter(t => t.status === "completed").length;
                        const pProposed = rProjects.filter(p => p.status === "proposed" || p.status === "planning").length;
                        const pActive = rProjects.filter(p => p.status === "active").length;
                        const pCompleted = rProjects.filter(p => p.status === "completed").length;
                        return (
                          <tr key={r.id} className="border-b border-slate-100 hover:bg-white/50">
                            <td className="py-1.5 font-medium text-slate-700 whitespace-nowrap">{r.title ? `${r.title} ` : ""}{r.name}</td>
                            <td className="text-center text-slate-500">{tProposed}</td>
                            <td className="text-center text-emerald-600 font-medium">{tActive}</td>
                            <td className="text-center text-blue-600 font-medium">{tCompleted}</td>
                            <td className="text-center text-amber-500">{pProposed}</td>
                            <td className="text-center text-violet-600 font-medium">{pActive}</td>
                            <td className="text-center text-teal-600 font-medium">{pCompleted}</td>
                            <td className="text-center text-slate-500">{rDone}/{rTasks.length}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Kişi Bazlı Rapor Tab */}
          {activeTab === "personReport" && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-slate-600">Araştırmacı Seçin:</label>
                <select value={selectedPersonId} onChange={e => setSelectedPersonId(e.target.value)}
                  className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-200 outline-none min-w-[250px]">
                  <option value="">-- Kişi Seçin --</option>
                  {(aofResearcherIds ? researchers.filter(r => aofResearcherIds.has(r.id)) : researchers).map(r => <option key={r.id} value={r.id}>{r.title ? `${r.title} ` : ""}{r.name}</option>)}
                </select>
              </div>
              {!selectedPersonId && (
                <div className="text-center py-12 text-slate-400">
                  <Users size={40} className="mx-auto mb-3 text-slate-300" />
                  <p className="text-sm">Kişi bazlı istatistikleri görmek için yukarıdan bir araştırmacı seçin.</p>
                </div>
              )}
              {personStats && (
                <div className="space-y-5">
                  {/* Person header */}
                  <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {personStats.person.name[0]}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{personStats.person.title ? `${personStats.person.title} ` : ""}{personStats.person.name}</h3>
                      <p className="text-sm text-white/70">{personStats.person.institution}{personStats.person.unit ? ` · ${personStats.person.unit}` : ""}</p>
                    </div>
                  </div>
                  {/* Konu istatistikleri */}
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Konular</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                        <BookOpen size={14} className="text-slate-400 flex-shrink-0" />
                        <div><p className="text-[9px] text-slate-400">Önerilen</p><p className="text-lg font-bold text-slate-700">{personStats.myTopicStatus.proposed}</p></div>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 rounded-xl border border-emerald-100">
                        <BookOpen size={14} className="text-emerald-500 flex-shrink-0" />
                        <div><p className="text-[9px] text-emerald-500">Aktif</p><p className="text-lg font-bold text-emerald-700">{personStats.myTopicStatus.active}</p></div>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 rounded-xl border border-blue-100">
                        <BookOpen size={14} className="text-blue-500 flex-shrink-0" />
                        <div><p className="text-[9px] text-blue-500">Tamamlanan</p><p className="text-lg font-bold text-blue-700">{personStats.myTopicStatus.completed}</p></div>
                      </div>
                    </div>
                  </div>
                  {/* Proje istatistikleri */}
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Projeler</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 rounded-xl border border-amber-100">
                        <FolderKanban size={14} className="text-amber-500 flex-shrink-0" />
                        <div><p className="text-[9px] text-amber-500">Önerilen</p><p className="text-lg font-bold text-amber-700">{personStats.proposedProjects}</p></div>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-3 bg-violet-50 rounded-xl border border-violet-100">
                        <FolderKanban size={14} className="text-violet-500 flex-shrink-0" />
                        <div><p className="text-[9px] text-violet-500">Aktif</p><p className="text-lg font-bold text-violet-700">{personStats.myProjectStatus.active}</p></div>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-3 bg-teal-50 rounded-xl border border-teal-100">
                        <FolderKanban size={14} className="text-teal-500 flex-shrink-0" />
                        <div><p className="text-[9px] text-teal-500">Tamamlanan</p><p className="text-lg font-bold text-teal-700">{personStats.myProjectStatus.completed}</p></div>
                      </div>
                    </div>
                  </div>
                  {/* Görevler */}
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Görevler</p>
                    <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-slate-100">
                      <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm text-slate-600 font-medium">{personStats.doneTasks} / {personStats.allTasks.length} tamamlandı</span>
                          <span className="text-sm font-bold text-indigo-600">{personStats.allTasks.length > 0 ? Math.round((personStats.doneTasks / personStats.allTasks.length) * 100) : 0}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-2 rounded-full transition-all" style={{ width: `${personStats.allTasks.length > 0 ? (personStats.doneTasks / personStats.allTasks.length) * 100 : 0}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Proje Türü Dağılımı — sadece projelendirilmiş konular bar chart */}
                  {(() => {
                    const ptDist = {};
                    personStats.myTopics.filter(t => projects.some(p => (p.topics || []).includes(t.id))).forEach(t => { if (t.projectType) ptDist[t.projectType] = (ptDist[t.projectType] || 0) + 1; });
                    const entries = Object.entries(ptDist).sort((a, b) => b[1] - a[1]);
                    if (entries.length === 0) return null;
                    const ptMax3 = Math.max(...entries.map(e => e[1]), 1);
                    return (
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Proje Türü Dağılımı</p>
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
                          {entries.map(([label, count], i) => (
                            <div key={label} className="flex items-center gap-3">
                              <span className="text-xs font-medium text-slate-600 w-24 text-right flex-shrink-0 truncate" title={label}>{label}</span>
                              <div className="flex-1 bg-slate-200 rounded-full h-5 overflow-hidden">
                                <div className="h-full rounded-full flex items-center justify-end pr-2 transition-all" style={{ width: `${Math.max((count / ptMax3) * 100, 15)}%`, backgroundColor: getPtColor(label, i) }}>
                                  <span className="text-[10px] font-bold text-white">{count}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                  {/* Rol dağılımı */}
                  <div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Rol Dağılımı</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(roleConfig).map(([rKey, rCfg]) => {
                        const cnt = personStats.myRoleCounts[rKey] || 0;
                        if (cnt === 0) return null;
                        return (
                          <div key={rKey} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${rCfg.color} text-sm font-medium`}>
                            <span>{rCfg.label}</span>
                            <span className="font-bold">{cnt}</span>
                          </div>
                        );
                      })}
                      {Object.keys(personStats.myRoleCounts).length === 0 && <span className="text-sm text-slate-400 italic">Atama yok</span>}
                    </div>
                  </div>
                  {/* Konu listesi */}
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Konuları ({personStats.myTopics.length})</h3>
                    {personStats.myTopics.length > 0 ? (
                      <div className="space-y-1.5">
                        {personStats.myTopics.map(t => {
                          const linkedPrj = (projects || []).find(p => (p.topics || []).includes(t.id));
                          const assignment = t.researchers.find(r => r.researcherId === selectedPersonId);
                          return (
                            <div key={t.id} className={`flex items-center gap-2 rounded-lg p-2 border ${linkedPrj ? "bg-gradient-to-r from-violet-50 to-indigo-50 border-violet-200" : "bg-white border-slate-100"}`}>
                              <Badge className={statusConfig[t.status]?.color}>{statusConfig[t.status]?.label}</Badge>
                              <div className="flex-1 min-w-0">
                                <span className="text-xs font-medium text-slate-700 truncate block">{t.title}</span>
                                {linkedPrj && (
                                  <span className="inline-flex items-center gap-1 mt-0.5 px-1.5 py-0.5 rounded bg-violet-100 text-[10px] font-semibold text-violet-700">
                                    <FolderKanban size={9} />{linkedPrj.title?.length > 35 ? linkedPrj.title.slice(0, 35) + "…" : linkedPrj.title}
                                    {linkedPrj.projectType && <span className="text-violet-500 ml-1">({linkedPrj.projectType})</span>}
                                  </span>
                                )}
                              </div>
                              {assignment?.role && <Badge className={roleConfig[assignment.role]?.color}>{roleConfig[assignment.role]?.label}</Badge>}
                            </div>
                          );
                        })}
                      </div>
                    ) : <p className="text-xs text-slate-400 text-center py-3">Konu atanmamış</p>}
                  </div>
                  {/* Proje listesi */}
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Projeleri ({personStats.myProjects.length})</h3>
                    {personStats.myProjects.length > 0 ? (
                      <div className="space-y-1.5">
                        {personStats.myProjects.map(p => (
                          <div key={p.id} className="flex items-center gap-2 bg-white rounded-lg p-2 border border-slate-100">
                            <Badge className={statusConfig[p.status]?.color}>{statusConfig[p.status]?.label}</Badge>
                            <span className="text-xs font-medium text-slate-700 truncate flex-1">{p.title}</span>
                            {(p.projectType || p.type) && <Badge className="bg-indigo-50 text-indigo-600">{p.projectType || p.type}</Badge>}
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-xs text-slate-400 text-center py-3">Proje atanmamış</p>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Zaman İstatistikleri Tab */}
          {activeTab === "timeStats" && (
            <div className="space-y-6">
              {/* View toggle + year selector */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex bg-slate-100 rounded-lg p-0.5">
                  <button onClick={() => setTimeView("year")}
                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${timeView === "year" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                    Yıl Bazlı
                  </button>
                  <button onClick={() => setTimeView("month")}
                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition-colors ${timeView === "month" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                    Ay Bazlı
                  </button>
                </div>
                {timeView === "month" && (
                  <select value={timeSelectedYear || availableYears[availableYears.length - 1] || ""} onChange={e => setTimeSelectedYear(e.target.value)}
                    className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 bg-white focus:ring-1 focus:ring-indigo-200 outline-none">
                    {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                )}
              </div>

              {/* Konu grafikleri */}
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Konu Zaman Dağılımı</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <h4 className="text-xs font-semibold text-slate-600 mb-3 flex items-center gap-1.5"><BookOpen size={12} className="text-slate-400" />Önerilen Konu</h4>
                    <SimpleBarChart data={timeData.map(d => ({ label: d.label, value: d.proposedT, color: "#94a3b8" }))} height={120} />
                  </div>
                  <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100">
                    <h4 className="text-xs font-semibold text-emerald-700 mb-3 flex items-center gap-1.5"><BookOpen size={12} className="text-emerald-500" />Aktif Konu</h4>
                    <SimpleBarChart data={timeData.map(d => ({ label: d.label, value: d.activeT, color: "#10b981" }))} height={120} />
                  </div>
                  <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                    <h4 className="text-xs font-semibold text-blue-700 mb-3 flex items-center gap-1.5"><BookOpen size={12} className="text-blue-500" />Tamamlanan Konu</h4>
                    <SimpleBarChart data={timeData.map(d => ({ label: d.label, value: d.completedT, color: "#3b82f6" }))} height={120} />
                  </div>
                </div>
              </div>

              {/* Proje grafikleri */}
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Proje Zaman Dağılımı</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100">
                    <h4 className="text-xs font-semibold text-amber-700 mb-3 flex items-center gap-1.5"><FolderKanban size={12} className="text-amber-500" />Önerilen Proje</h4>
                    <SimpleBarChart data={timeData.map(d => ({ label: d.label, value: d.proposedP, color: "#f59e0b" }))} height={120} />
                  </div>
                  <div className="bg-violet-50/50 rounded-xl p-4 border border-violet-100">
                    <h4 className="text-xs font-semibold text-violet-700 mb-3 flex items-center gap-1.5"><FolderKanban size={12} className="text-violet-500" />Aktif Proje</h4>
                    <SimpleBarChart data={timeData.map(d => ({ label: d.label, value: d.activeP, color: "#8b5cf6" }))} height={120} />
                  </div>
                  <div className="bg-teal-50/50 rounded-xl p-4 border border-teal-100">
                    <h4 className="text-xs font-semibold text-teal-700 mb-3 flex items-center gap-1.5"><FolderKanban size={12} className="text-teal-500" />Tamamlanan Proje</h4>
                    <SimpleBarChart data={timeData.map(d => ({ label: d.label, value: d.completedP, color: "#14b8a6" }))} height={120} />
                  </div>
                </div>
              </div>

              {/* Toplam trend çizgi grafik */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2"><TrendingUp size={14} className="text-indigo-500" />Toplam Konu Trendi</h3>
                <SimpleLineChart data={timeData.map(d => ({ label: d.label, value: d.proposedT + d.activeT + d.completedT }))} color="#6366f1" />
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2"><TrendingUp size={14} className="text-violet-500" />Toplam Proje Trendi</h3>
                <SimpleLineChart data={timeData.map(d => ({ label: d.label, value: d.proposedP + d.activeP + d.completedP }))} color="#8b5cf6" />
              </div>

              {/* Detay tablosu */}
              <div className="bg-slate-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Detay Tablosu</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead><tr className="text-left border-b border-slate-200">
                      <th className="pb-2 font-semibold text-slate-500">{timeView === "year" ? "Yıl" : "Ay"}</th>
                      <th className="pb-2 font-semibold text-slate-400 text-center">Ön. Konu</th>
                      <th className="pb-2 font-semibold text-emerald-500 text-center">Aktif K.</th>
                      <th className="pb-2 font-semibold text-blue-500 text-center">Tam. K.</th>
                      <th className="pb-2 font-semibold text-amber-500 text-center">Ön. Proje</th>
                      <th className="pb-2 font-semibold text-violet-500 text-center">Aktif P.</th>
                      <th className="pb-2 font-semibold text-teal-500 text-center">Tam. P.</th>
                    </tr></thead>
                    <tbody>
                      {timeData.map((d, i) => (
                        <tr key={i} className="border-b border-slate-100 hover:bg-white/50">
                          <td className="py-1.5 font-medium text-slate-700">{d.label}</td>
                          <td className="text-center">{d.proposedT}</td>
                          <td className="text-center text-emerald-600 font-medium">{d.activeT}</td>
                          <td className="text-center text-blue-600 font-medium">{d.completedT}</td>
                          <td className="text-center">{d.proposedP}</td>
                          <td className="text-center text-violet-600 font-medium">{d.activeP}</td>
                          <td className="text-center text-teal-600 font-medium">{d.completedP}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
              {/* Proje Türü Dağılımı — sadece projelendirilmiş konular bar chart */}
              {(() => {
                const ft = filteredTopics;
                const topicPtDist = {};
                ft.filter(t => filteredProjects.some(p => (p.topics || []).includes(t.id))).forEach(t => { if (t.projectType) topicPtDist[t.projectType] = (topicPtDist[t.projectType] || 0) + 1; });
                const ptEntries = Object.entries(topicPtDist).sort((a, b) => b[1] - a[1]);
                if (ptEntries.length === 0) return null;
                const ptMax4 = Math.max(...ptEntries.map(e => e[1]), 1);
                const ptTotal4 = ptEntries.reduce((s, e) => s + e[1], 0);
                return (
                  <div className="bg-slate-50 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2"><FolderKanban size={14} className="text-violet-500" />Proje Türü Dağılımı</h3>
                    <div className="space-y-2">
                      {ptEntries.map(([label, count], i) => (
                        <div key={label} className="flex items-center gap-3">
                          <span className="text-xs font-medium text-slate-600 w-28 text-right flex-shrink-0 truncate" title={label}>{label}</span>
                          <div className="flex-1 bg-slate-200 rounded-full h-5 overflow-hidden">
                            <div className="h-full rounded-full flex items-center justify-end pr-2 transition-all" style={{ width: `${Math.max((count / ptMax4) * 100, 12)}%`, backgroundColor: getPtColor(label, i) }}>
                              <span className="text-[10px] font-bold text-white">{count}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-3 text-right">Toplam: {ptTotal4} projelendirilmiş konu</p>
                  </div>
                );
              })()}
            </div>
          )}

          {activeTab === "projects" && (
            <div className="space-y-6">
              {/* Uluslararası Proje İstatistikleri */}
              {(() => {
                const isIntl = p => [p.piCountry, ...(p.partnerCountries || [])].filter(Boolean).some(c => c !== "Türkiye");
                const intlProjects = filteredProjects.filter(isIntl);
                const intlByStatus = { proposed: 0, active: 0, completed: 0 };
                const allByStatus = { proposed: 0, active: 0, completed: 0 };
                intlProjects.forEach(p => { const st = p.status === "planning" ? "proposed" : (p.status || "proposed"); if (intlByStatus[st] !== undefined) intlByStatus[st]++; });
                filteredProjects.forEach(p => { const st = p.status === "planning" ? "proposed" : (p.status || "proposed"); if (allByStatus[st] !== undefined) allByStatus[st]++; });
                const intlTotal = intlProjects.length;
                const allTotal = filteredProjects.length;
                return (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                    <h3 className="text-sm font-semibold text-blue-800 flex items-center gap-2 mb-3"><Globe size={15} className="text-blue-600" />Uluslararası Ortaklı Projeler</h3>
                    <div className="grid grid-cols-4 gap-3 mb-3">
                      {[
                        { label: "Toplam", intl: intlTotal, all: allTotal, bg: "bg-slate-50", color: "text-slate-700", border: "border-slate-200" },
                        { label: "Önerilen", intl: intlByStatus.proposed, all: allByStatus.proposed, bg: "bg-amber-50", color: "text-amber-700", border: "border-amber-200" },
                        { label: "Aktif", intl: intlByStatus.active, all: allByStatus.active, bg: "bg-blue-50", color: "text-blue-700", border: "border-blue-300" },
                        { label: "Tamamlanan", intl: intlByStatus.completed, all: allByStatus.completed, bg: "bg-emerald-50", color: "text-emerald-700", border: "border-emerald-200" },
                      ].map(s => (
                        <div key={s.label} className={`${s.bg} rounded-xl p-3 border ${s.border} text-center`}>
                          <p className="text-[10px] text-slate-500 mb-1">{s.label}</p>
                          <div className="flex items-baseline justify-center gap-1">
                            <span className={`text-xl font-bold ${s.color}`}>{s.intl}</span>
                            <span className="text-slate-400 text-xs">/ {s.all}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">{s.all > 0 ? Math.round(s.intl / s.all * 100) : 0}% uluslararası</p>
                        </div>
                      ))}
                    </div>
                    {intlTotal > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-white/70 rounded-lg p-3">
                          <p className="text-[10px] font-medium text-slate-500 mb-2">Uluslararası vs Ulusal (Pie)</p>
                          <SimplePieChart data={[
                            { label: "Uluslararası", value: intlTotal, color: "#3b82f6" },
                            { label: "Ulusal", value: allTotal - intlTotal, color: "#e2e8f0" },
                          ]} size={110} />
                        </div>
                        <div className="bg-white/70 rounded-lg p-3">
                          <p className="text-[10px] font-medium text-slate-500 mb-2">Durum Bazlı Karşılaştırma</p>
                          <SimpleBarChart data={[
                            { label: "Önerilen (U)", value: intlByStatus.proposed, color: "#f59e0b" },
                            { label: "Önerilen (T)", value: allByStatus.proposed, color: "#fde68a" },
                            { label: "Aktif (U)", value: intlByStatus.active, color: "#3b82f6" },
                            { label: "Aktif (T)", value: allByStatus.active, color: "#93c5fd" },
                            { label: "Tamamlanan (U)", value: intlByStatus.completed, color: "#10b981" },
                            { label: "Tamamlanan (T)", value: allByStatus.completed, color: "#6ee7b7" },
                          ]} height={140} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
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
              {/* Ülke & Kurum Dağılımı — Detaylı */}
              {(() => {
                const fp = filteredProjects;
                // --- Genel maps ---
                const piCountryMap = {}; const partnerCountryMap = {}; const allCountrySet = new Set();
                const piInstMap = {}; const partnerInstMap = {}; const allInstSet = new Set();
                let projectsWithCountry = 0; let projectsWithInst = 0;
                // --- Durum bazlı maps ---
                const statusCountryMap = { proposed: {}, active: {}, completed: {} };
                const statusInstMap = { proposed: {}, active: {}, completed: {} };
                fp.forEach(p => {
                  const st = (p.status === "planning") ? "proposed" : (p.status || "proposed");
                  if (p.piCountry) {
                    piCountryMap[p.piCountry] = (piCountryMap[p.piCountry] || 0) + 1;
                    allCountrySet.add(p.piCountry);
                    projectsWithCountry++;
                    if (statusCountryMap[st]) { statusCountryMap[st][p.piCountry] = (statusCountryMap[st][p.piCountry] || 0) + 1; }
                  }
                  (p.partnerCountries || []).forEach(c => {
                    partnerCountryMap[c] = (partnerCountryMap[c] || 0) + 1;
                    allCountrySet.add(c);
                  });
                  if (p.piInstitution) {
                    piInstMap[p.piInstitution] = (piInstMap[p.piInstitution] || 0) + 1;
                    allInstSet.add(p.piInstitution);
                    projectsWithInst++;
                    if (statusInstMap[st]) { statusInstMap[st][p.piInstitution] = (statusInstMap[st][p.piInstitution] || 0) + 1; }
                  }
                  (p.partnerInstitutions || []).forEach(inst => {
                    partnerInstMap[inst] = (partnerInstMap[inst] || 0) + 1;
                    allInstSet.add(inst);
                  });
                });
                const piCountryEntries = Object.entries(piCountryMap).sort((a, b) => b[1] - a[1]);
                const partnerCountryEntries = Object.entries(partnerCountryMap).sort((a, b) => b[1] - a[1]);
                const piInstEntries = Object.entries(piInstMap).sort((a, b) => b[1] - a[1]);
                const partnerInstEntries = Object.entries(partnerInstMap).sort((a, b) => b[1] - a[1]);
                const hasCountry = allCountrySet.size > 0;
                const hasInst = allInstSet.size > 0;
                const proposed = statusCountryMap.proposed; const active = statusCountryMap.active; const completed = statusCountryMap.completed;
                const proposedInst = statusInstMap.proposed; const activeInst = statusInstMap.active; const completedInst = statusInstMap.completed;
                // Durum bazlı pie data oluştur
                const makePie = (map, colors) => Object.entries(map).sort((a,b) => b[1]-a[1]).map(([label, value], i) => ({ label, value, color: colors[i % colors.length] }));
                const cPalette = ["#6366f1","#8b5cf6","#a78bfa","#c4b5fd","#3b82f6","#60a5fa","#93c5fd","#06b6d4","#14b8a6","#10b981","#f59e0b","#ef4444","#ec4899","#f97316"];
                const iPalette = ["#0ea5e9","#0284c7","#0369a1","#1d4ed8","#4f46e5","#7c3aed","#9333ea","#c026d3","#db2777","#e11d48","#f97316","#84cc16","#14b8a6","#06b6d4"];
                if (!hasCountry && !hasInst) return (
                  <div className="text-center py-8 text-slate-400">
                    <MapPin size={32} className="mx-auto mb-2 text-slate-300" />
                    <p className="text-sm">Henüz projelere ülke/kurum bilgisi eklenmemiş.</p>
                    <p className="text-xs text-slate-300 mt-1">Proje detaylarından yürütücü ve ortak bilgilerini ekleyebilirsiniz.</p>
                  </div>
                );
                return (
                  <div className="space-y-6">
                    <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><MapPin size={14} className="text-rose-500" />Ülke & Kurum Dağılımı</h3>

                    {/* Özet kartlar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-rose-50 rounded-xl p-3 border border-rose-100 text-center">
                        <p className="text-2xl font-bold text-rose-700">{allCountrySet.size}</p>
                        <p className="text-[10px] text-rose-400 mt-0.5">Tekil Ülke</p>
                      </div>
                      <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100 text-center">
                        <p className="text-2xl font-bold text-indigo-700">{projectsWithCountry}</p>
                        <p className="text-[10px] text-indigo-400 mt-0.5">Ülke Bilgili Proje</p>
                      </div>
                      <div className="bg-sky-50 rounded-xl p-3 border border-sky-100 text-center">
                        <p className="text-2xl font-bold text-sky-700">{allInstSet.size}</p>
                        <p className="text-[10px] text-sky-400 mt-0.5">Tekil Kurum</p>
                      </div>
                      <div className="bg-violet-50 rounded-xl p-3 border border-violet-100 text-center">
                        <p className="text-2xl font-bold text-violet-700">{Object.keys(partnerCountryMap).length}</p>
                        <p className="text-[10px] text-violet-400 mt-0.5">İşbirliği Ülke</p>
                      </div>
                    </div>

                    {/* ── ÜLKE DAĞILIMLARI ── */}
                    {hasCountry && (<>
                      {/* Genel Yürütücü Ülke + Pie */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 rounded-xl p-4">
                          <h4 className="text-xs font-semibold text-slate-600 mb-3 flex items-center gap-1.5"><Globe size={12} className="text-indigo-500" />Yürütücü Ülke Dağılımı (Tümü)</h4>
                          <SimplePieChart data={makePie(piCountryMap, cPalette)} size={130} />
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4">
                          <h4 className="text-xs font-semibold text-slate-600 mb-3 flex items-center gap-1.5"><Globe size={12} className="text-indigo-500" />Yürütücü Ülke (Bar)</h4>
                          <SimpleBarChart data={piCountryEntries.map(([c, v]) => ({ label: c, value: v, color: "#6366f1" }))} height={Math.max(100, piCountryEntries.length * 26)} />
                        </div>
                      </div>

                      {/* Durum bazlı ülke pie'ları */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { key: "proposed", label: "Önerilen Proje Ülke Dağılımı", data: proposed, color: "#f59e0b", bg: "bg-amber-50", border: "border-amber-100" },
                          { key: "active", label: "Aktif Proje Ülke Dağılımı", data: active, color: "#3b82f6", bg: "bg-blue-50", border: "border-blue-100" },
                          { key: "completed", label: "Tamamlanan Proje Ülke Dağılımı", data: completed, color: "#10b981", bg: "bg-emerald-50", border: "border-emerald-100" },
                        ].map(s => {
                          const entries = Object.entries(s.data).sort((a,b) => b[1]-a[1]);
                          return (
                            <div key={s.key} className={`${s.bg} rounded-xl p-4 border ${s.border}`}>
                              <h4 className="text-[11px] font-semibold text-slate-600 mb-2">{s.label}</h4>
                              {entries.length > 0 ? (
                                <SimplePieChart data={entries.map(([label, value], i) => ({ label, value, color: cPalette[i % cPalette.length] }))} size={110} />
                              ) : (
                                <p className="text-xs text-slate-400 text-center py-4">Veri yok</p>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Ortak ülke dağılımı */}
                      {partnerCountryEntries.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-violet-50 rounded-xl p-4 border border-violet-100">
                            <h4 className="text-xs font-semibold text-slate-600 mb-3 flex items-center gap-1.5"><Globe size={12} className="text-violet-500" />Ortak Ülke (Pie)</h4>
                            <SimplePieChart data={makePie(partnerCountryMap, cPalette)} size={130} />
                          </div>
                          <div className="bg-violet-50 rounded-xl p-4 border border-violet-100">
                            <h4 className="text-xs font-semibold text-slate-600 mb-3 flex items-center gap-1.5"><Globe size={12} className="text-violet-500" />Ortak Ülke (Bar)</h4>
                            <SimpleBarChart data={partnerCountryEntries.map(([c, v]) => ({ label: c, value: v, color: "#8b5cf6" }))} height={Math.max(100, partnerCountryEntries.length * 26)} />
                          </div>
                        </div>
                      )}

                      {/* Ülke detay tablosu */}
                      <div className="bg-slate-50 rounded-xl p-4">
                        <h4 className="text-xs font-semibold text-slate-600 mb-3">Ülke Detay Tablosu</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead><tr className="text-left border-b border-slate-200">
                              <th className="pb-2 font-semibold text-slate-500">Ülke</th>
                              <th className="pb-2 font-semibold text-amber-500 text-center">Önerilen</th>
                              <th className="pb-2 font-semibold text-blue-500 text-center">Aktif</th>
                              <th className="pb-2 font-semibold text-emerald-500 text-center">Tamamlanan</th>
                              <th className="pb-2 font-semibold text-indigo-500 text-center">Yürütücü Top.</th>
                              <th className="pb-2 font-semibold text-violet-500 text-center">Ortak</th>
                              <th className="pb-2 font-semibold text-slate-600 text-center">Genel Top.</th>
                            </tr></thead>
                            <tbody>
                              {[...allCountrySet].sort((a, b) => {
                                const ta = (piCountryMap[a] || 0) + (partnerCountryMap[a] || 0);
                                const tb = (piCountryMap[b] || 0) + (partnerCountryMap[b] || 0);
                                return tb - ta;
                              }).map(c => (
                                <tr key={c} className="border-b border-slate-100 hover:bg-white/50">
                                  <td className="py-1.5 font-medium text-slate-700">{c}</td>
                                  <td className="text-center text-amber-600">{proposed[c] || "-"}</td>
                                  <td className="text-center text-blue-600">{active[c] || "-"}</td>
                                  <td className="text-center text-emerald-600">{completed[c] || "-"}</td>
                                  <td className="text-center font-semibold text-indigo-600">{piCountryMap[c] || "-"}</td>
                                  <td className="text-center text-violet-600">{partnerCountryMap[c] || "-"}</td>
                                  <td className="text-center font-bold text-slate-700">{(piCountryMap[c] || 0) + (partnerCountryMap[c] || 0)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>)}

                    {/* ── KURUM DAĞILIMLARI ── */}
                    {hasInst && (<>
                      <div className="border-t border-slate-200 pt-4">
                        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-4"><Building2 size={14} className="text-sky-500" />Yürütücü Kurum İstatistikleri</h3>
                      </div>

                      {/* Genel Yürütücü Kurum */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-slate-50 rounded-xl p-4">
                          <h4 className="text-xs font-semibold text-slate-600 mb-3">Yürütücü Kurum Dağılımı (Pie)</h4>
                          <SimplePieChart data={makePie(piInstMap, iPalette)} size={130} />
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4">
                          <h4 className="text-xs font-semibold text-slate-600 mb-3">Yürütücü Kurum Dağılımı (Bar)</h4>
                          <SimpleBarChart data={piInstEntries.map(([c, v]) => ({ label: c, value: v, color: "#0ea5e9" }))} height={Math.max(100, piInstEntries.length * 26)} />
                        </div>
                      </div>

                      {/* Durum bazlı kurum pie'ları */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { key: "proposed", label: "Önerilen Proje Kurum Dağılımı", data: proposedInst, bg: "bg-amber-50", border: "border-amber-100" },
                          { key: "active", label: "Aktif Proje Kurum Dağılımı", data: activeInst, bg: "bg-blue-50", border: "border-blue-100" },
                          { key: "completed", label: "Tamamlanan Proje Kurum Dağılımı", data: completedInst, bg: "bg-emerald-50", border: "border-emerald-100" },
                        ].map(s => {
                          const entries = Object.entries(s.data).sort((a,b) => b[1]-a[1]);
                          return (
                            <div key={s.key} className={`${s.bg} rounded-xl p-4 border ${s.border}`}>
                              <h4 className="text-[11px] font-semibold text-slate-600 mb-2">{s.label}</h4>
                              {entries.length > 0 ? (
                                <SimplePieChart data={entries.map(([label, value], i) => ({ label, value, color: iPalette[i % iPalette.length] }))} size={110} />
                              ) : (
                                <p className="text-xs text-slate-400 text-center py-4">Veri yok</p>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Ortak kurum dağılımı */}
                      {partnerInstEntries.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
                            <h4 className="text-xs font-semibold text-slate-600 mb-3">Ortak Kurum Dağılımı (Pie)</h4>
                            <SimplePieChart data={makePie(partnerInstMap, iPalette)} size={130} />
                          </div>
                          <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
                            <h4 className="text-xs font-semibold text-slate-600 mb-3">Ortak Kurum Dağılımı (Bar)</h4>
                            <SimpleBarChart data={partnerInstEntries.map(([c, v]) => ({ label: c, value: v, color: "#0284c7" }))} height={Math.max(100, partnerInstEntries.length * 26)} />
                          </div>
                        </div>
                      )}

                      {/* Kurum detay tablosu */}
                      <div className="bg-slate-50 rounded-xl p-4">
                        <h4 className="text-xs font-semibold text-slate-600 mb-3">Kurum Detay Tablosu</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead><tr className="text-left border-b border-slate-200">
                              <th className="pb-2 font-semibold text-slate-500">Kurum</th>
                              <th className="pb-2 font-semibold text-amber-500 text-center">Önerilen</th>
                              <th className="pb-2 font-semibold text-blue-500 text-center">Aktif</th>
                              <th className="pb-2 font-semibold text-emerald-500 text-center">Tamamlanan</th>
                              <th className="pb-2 font-semibold text-sky-500 text-center">Yürütücü Top.</th>
                              <th className="pb-2 font-semibold text-cyan-500 text-center">Ortak</th>
                              <th className="pb-2 font-semibold text-slate-600 text-center">Genel Top.</th>
                            </tr></thead>
                            <tbody>
                              {[...allInstSet].sort((a, b) => {
                                const ta = (piInstMap[a] || 0) + (partnerInstMap[a] || 0);
                                const tb = (piInstMap[b] || 0) + (partnerInstMap[b] || 0);
                                return tb - ta;
                              }).map(inst => (
                                <tr key={inst} className={`border-b border-slate-100 hover:bg-white/50 cursor-pointer ${selectedInstitution === inst ? "bg-sky-50 ring-1 ring-sky-200" : ""}`} onClick={() => setSelectedInstitution(selectedInstitution === inst ? "" : inst)}>
                                  <td className="py-1.5 font-medium text-slate-700">{inst} {selectedInstitution === inst && <span className="text-sky-500 text-[10px]">(seçili)</span>}</td>
                                  <td className="text-center text-amber-600">{proposedInst[inst] || "-"}</td>
                                  <td className="text-center text-blue-600">{activeInst[inst] || "-"}</td>
                                  <td className="text-center text-emerald-600">{completedInst[inst] || "-"}</td>
                                  <td className="text-center font-semibold text-sky-600">{piInstMap[inst] || "-"}</td>
                                  <td className="text-center text-cyan-600">{partnerInstMap[inst] || "-"}</td>
                                  <td className="text-center font-bold text-slate-700">{(piInstMap[inst] || 0) + (partnerInstMap[inst] || 0)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Kurum Bazlı Detay Drill-Down */}
                      <div className="border-t border-slate-200 pt-4">
                        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3"><Building2 size={14} className="text-teal-500" />Kurum Bazlı Detay Raporu</h3>
                        <select value={selectedInstitution} onChange={e => setSelectedInstitution(e.target.value)} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300">
                          <option value="">Kurum seçin...</option>
                          {[...allInstSet].sort((a, b) => a.localeCompare(b, "tr")).map(inst => <option key={inst} value={inst}>{inst} ({piInstMap[inst] || 0} yürütücü, {partnerInstMap[inst] || 0} ortak)</option>)}
                        </select>
                        {selectedInstitution && (() => {
                          const instProjects = fp.filter(p => p.piInstitution === selectedInstitution || (p.partnerInstitutions || []).includes(selectedInstitution));
                          const instByStatus = { proposed: [], active: [], completed: [] };
                          instProjects.forEach(p => { const st = p.status === "planning" ? "proposed" : (p.status || "proposed"); if (instByStatus[st]) instByStatus[st].push(p); });
                          // Ülke dağılımı (bu kurum bazında)
                          const instCountryMap = {}; const instCountryByStatus = { proposed: {}, active: {}, completed: {} };
                          instProjects.forEach(p => {
                            const st = p.status === "planning" ? "proposed" : (p.status || "proposed");
                            if (p.piCountry) { instCountryMap[p.piCountry] = (instCountryMap[p.piCountry] || 0) + 1; if (instCountryByStatus[st]) instCountryByStatus[st][p.piCountry] = (instCountryByStatus[st][p.piCountry] || 0) + 1; }
                            (p.partnerCountries || []).forEach(c => { instCountryMap[c] = (instCountryMap[c] || 0) + 1; });
                          });
                          // Ortak kurum dağılımı (bu kurum bazında)
                          const instPartnerMap = {}; const instPartnerByStatus = { proposed: {}, active: {}, completed: {} };
                          instProjects.forEach(p => {
                            const st = p.status === "planning" ? "proposed" : (p.status || "proposed");
                            (p.partnerInstitutions || []).filter(i => i !== selectedInstitution).forEach(i => {
                              instPartnerMap[i] = (instPartnerMap[i] || 0) + 1;
                              if (instPartnerByStatus[st]) instPartnerByStatus[st][i] = (instPartnerByStatus[st][i] || 0) + 1;
                            });
                            if (p.piInstitution && p.piInstitution !== selectedInstitution) {
                              instPartnerMap[p.piInstitution] = (instPartnerMap[p.piInstitution] || 0) + 1;
                              if (instPartnerByStatus[st]) instPartnerByStatus[st][p.piInstitution] = (instPartnerByStatus[st][p.piInstitution] || 0) + 1;
                            }
                          });
                          const instCountryEntries = Object.entries(instCountryMap).sort((a,b) => b[1]-a[1]);
                          const instPartnerEntries = Object.entries(instPartnerMap).sort((a,b) => b[1]-a[1]);
                          return (
                            <div className="space-y-4 bg-gradient-to-br from-sky-50 to-indigo-50 rounded-xl p-4 border border-sky-200">
                              <div className="flex items-center gap-2 mb-2">
                                <Building2 size={16} className="text-sky-600" />
                                <h4 className="text-sm font-bold text-sky-800">{selectedInstitution}</h4>
                                <span className="text-xs text-sky-500 ml-auto">{instProjects.length} proje</span>
                              </div>
                              {/* Durum kartları */}
                              <div className="grid grid-cols-3 gap-2">
                                <div className="bg-amber-50 rounded-lg p-2 border border-amber-100 text-center">
                                  <p className="text-lg font-bold text-amber-700">{instByStatus.proposed.length}</p>
                                  <p className="text-[10px] text-amber-500">Önerilen</p>
                                </div>
                                <div className="bg-blue-50 rounded-lg p-2 border border-blue-100 text-center">
                                  <p className="text-lg font-bold text-blue-700">{instByStatus.active.length}</p>
                                  <p className="text-[10px] text-blue-500">Aktif</p>
                                </div>
                                <div className="bg-emerald-50 rounded-lg p-2 border border-emerald-100 text-center">
                                  <p className="text-lg font-bold text-emerald-700">{instByStatus.completed.length}</p>
                                  <p className="text-[10px] text-emerald-500">Tamamlanan</p>
                                </div>
                              </div>
                              {/* Ülke dağılımları — durum bazlı pie */}
                              {instCountryEntries.length > 0 && (<>
                                <h4 className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mt-2"><Globe size={12} className="text-indigo-500" />Ülke Dağılımı</h4>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-white/70 rounded-lg p-3">
                                    <p className="text-[10px] font-medium text-slate-500 mb-2">Genel Ülke (Pie)</p>
                                    <SimplePieChart data={makePie(instCountryMap, cPalette)} size={100} />
                                  </div>
                                  <div className="bg-white/70 rounded-lg p-3">
                                    <p className="text-[10px] font-medium text-slate-500 mb-2">Genel Ülke (Bar)</p>
                                    <SimpleBarChart data={instCountryEntries.map(([c,v]) => ({label:c, value:v, color:"#6366f1"}))} height={Math.max(80, instCountryEntries.length * 22)} />
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  {[
                                    {label: "Önerilen Ülke", data: instCountryByStatus.proposed, bg: "bg-amber-50/80", border: "border-amber-100"},
                                    {label: "Aktif Ülke", data: instCountryByStatus.active, bg: "bg-blue-50/80", border: "border-blue-100"},
                                    {label: "Tamamlanan Ülke", data: instCountryByStatus.completed, bg: "bg-emerald-50/80", border: "border-emerald-100"},
                                  ].map(s => {
                                    const e = Object.entries(s.data).sort((a,b)=>b[1]-a[1]);
                                    return (<div key={s.label} className={`${s.bg} rounded-lg p-2 border ${s.border}`}>
                                      <p className="text-[10px] font-semibold text-slate-600 mb-1">{s.label}</p>
                                      {e.length > 0 ? <SimplePieChart data={e.map(([label,value],i)=>({label,value,color:cPalette[i%cPalette.length]}))} size={80} /> : <p className="text-[10px] text-slate-400 text-center py-2">—</p>}
                                    </div>);
                                  })}
                                </div>
                              </>)}
                              {/* Ortak kurum dağılımları — durum bazlı pie */}
                              {instPartnerEntries.length > 0 && (<>
                                <h4 className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mt-2"><Building2 size={12} className="text-cyan-500" />İşbirliği Yapılan Kurumlar</h4>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-white/70 rounded-lg p-3">
                                    <p className="text-[10px] font-medium text-slate-500 mb-2">Genel Ortak Kurum (Pie)</p>
                                    <SimplePieChart data={makePie(instPartnerMap, iPalette)} size={100} />
                                  </div>
                                  <div className="bg-white/70 rounded-lg p-3">
                                    <p className="text-[10px] font-medium text-slate-500 mb-2">Genel Ortak Kurum (Bar)</p>
                                    <SimpleBarChart data={instPartnerEntries.map(([c,v]) => ({label:c, value:v, color:"#0ea5e9"}))} height={Math.max(80, instPartnerEntries.length * 22)} />
                                  </div>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  {[
                                    {label: "Önerilen Kurum", data: instPartnerByStatus.proposed, bg: "bg-amber-50/80", border: "border-amber-100"},
                                    {label: "Aktif Kurum", data: instPartnerByStatus.active, bg: "bg-blue-50/80", border: "border-blue-100"},
                                    {label: "Tamamlanan Kurum", data: instPartnerByStatus.completed, bg: "bg-emerald-50/80", border: "border-emerald-100"},
                                  ].map(s => {
                                    const e = Object.entries(s.data).sort((a,b)=>b[1]-a[1]);
                                    return (<div key={s.label} className={`${s.bg} rounded-lg p-2 border ${s.border}`}>
                                      <p className="text-[10px] font-semibold text-slate-600 mb-1">{s.label}</p>
                                      {e.length > 0 ? <SimplePieChart data={e.map(([label,value],i)=>({label,value,color:iPalette[i%iPalette.length]}))} size={80} /> : <p className="text-[10px] text-slate-400 text-center py-2">—</p>}
                                    </div>);
                                  })}
                                </div>
                              </>)}
                              {/* Proje listesi */}
                              <div className="bg-white/70 rounded-lg p-3">
                                <p className="text-[10px] font-medium text-slate-500 mb-2">Proje Listesi</p>
                                <div className="space-y-1">
                                  {instProjects.map(p => (
                                    <div key={p.id} className="flex items-center gap-2 text-xs">
                                      <span className={`w-2 h-2 rounded-full ${p.status === "completed" ? "bg-emerald-400" : p.status === "active" ? "bg-blue-400" : "bg-amber-400"}`} />
                                      <span className="font-medium text-slate-700 truncate flex-1">{p.title}</span>
                                      <span className="text-slate-400">{p.piCountry || "—"}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                        {!selectedInstitution && (
                          <div className="text-center py-6 text-slate-400">
                            <Building2 size={28} className="mx-auto mb-2 text-slate-300" />
                            <p className="text-xs">Yukarıdan bir kurum seçin veya tablodaki bir kuruma tıklayın.</p>
                          </div>
                        )}
                      </div>
                    </>)}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ── Yayın İndeksleri Tab ── */}
          {activeTab === "publishingIndex" && (
            <div className="space-y-6">
              {(() => {
                const pubTopics = filteredTopics.filter(t => t.status === "completed" && t.publishingIndex?.types?.length > 0);
                const pubCount = pubTopics.length;
                if (pubCount === 0) return <p className="text-sm text-slate-400 text-center py-12">Henüz yayın indeksi girilmiş tamamlanmış konu yok.</p>;

                // 1. Genel indeks dağılımı
                const overallIdx = {};
                pubTopics.forEach(t => t.publishingIndex.types.forEach(iid => { overallIdx[iid] = (overallIdx[iid] || 0) + 1; }));
                const overallEntries = Object.entries(overallIdx).sort((a, b) => b[1] - a[1]);
                const overallMax = Math.max(...overallEntries.map(e => e[1]), 1);

                // 2. Kişi bazlı indeks
                const personIdx = {};
                pubTopics.forEach(t => { t.researchers?.forEach(r => { t.publishingIndex.types.forEach(iid => { const k = r.researcherId + "|" + iid; personIdx[k] = (personIdx[k] || 0) + 1; }); }); });
                const personTotals = {};
                Object.entries(personIdx).forEach(([k, v]) => { const rid = k.split("|")[0]; personTotals[rid] = (personTotals[rid] || 0) + v; });
                const topPersons = Object.entries(personTotals).sort((a, b) => b[1] - a[1]).slice(0, 15);

                // 3. Unvan bazlı
                const titleIdx = {};
                pubTopics.forEach(t => { t.researchers?.forEach(r => { const res = researchers.find(x => x.id === r.researcherId); const title = res?.title || "Belirtilmemiş"; t.publishingIndex.types.forEach(() => { titleIdx[title] = (titleIdx[title] || 0) + 1; }); }); });
                const titleEntries = Object.entries(titleIdx).sort((a, b) => b[1] - a[1]);
                const titleMax = Math.max(...titleEntries.map(e => e[1]), 1);

                // 4. Projelendirilmiş vs bağımsız
                const withProj = pubTopics.filter(t => projects.some(p => (p.topics || []).includes(t.id))).length;
                const withoutProj = pubCount - withProj;

                // 5. Yıl bazlı
                const yearIdx = {};
                pubTopics.forEach(t => {
                  const yr = t.publishingIndex.date ? t.publishingIndex.date.slice(0, 4) : (t.completedDate ? t.completedDate.slice(0, 4) : "Belirsiz");
                  t.publishingIndex.types.forEach(iid => {
                    if (!yearIdx[yr]) yearIdx[yr] = {};
                    yearIdx[yr][iid] = (yearIdx[yr][iid] || 0) + 1;
                  });
                });
                const yearKeys = Object.keys(yearIdx).sort();
                const allIdxIds = [...new Set(pubTopics.flatMap(t => t.publishingIndex.types))];

                return (<>
                  {/* Özet kartlar */}
                  <div className="grid grid-cols-3 gap-3">
                    {statCard("Toplam Yayın", pubCount, <FileText size={16} className="text-blue-500" />, "bg-blue-50")}
                    {statCard("Projelendirilmiş", withProj, <FolderKanban size={16} className="text-violet-500" />, "bg-violet-50")}
                    {statCard("Bağımsız", withoutProj, <BookOpen size={16} className="text-emerald-500" />, "bg-emerald-50")}
                  </div>

                  {/* Genel indeks dağılımı */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">İndeks Türü Dağılımı</p>
                    <div className="space-y-2">
                      {overallEntries.map(([iid, cnt]) => {
                        const ic = (indexTypesConfig || []).find(i => i.id === iid);
                        if (!ic) return null;
                        return (
                          <div key={iid} className="flex items-center gap-3">
                            <span className="text-xs font-medium text-slate-600 w-20 text-right flex-shrink-0">{ic.label}</span>
                            <div className="flex-1 bg-slate-200 rounded-full h-5 overflow-hidden">
                              <div className="h-full rounded-full flex items-center justify-end pr-2 transition-all" style={{ width: `${Math.max((cnt / overallMax) * 100, 12)}%`, backgroundColor: ic.color }}>
                                <span className="text-[10px] font-bold text-white">{cnt}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 text-right">Toplam: {pubCount} yayın</p>
                  </div>

                  {/* Kişi bazlı */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Kişi Bazlı Yayın Dağılımı</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead><tr className="text-left border-b border-slate-200">
                          <th className="pb-2 font-semibold text-slate-500">Araştırmacı</th>
                          {(indexTypesConfig || []).map(ic => <th key={ic.id} className="pb-2 text-center font-semibold" style={{ color: ic.color }}>{ic.label}</th>)}
                          <th className="pb-2 text-center font-semibold text-slate-700">Toplam</th>
                        </tr></thead>
                        <tbody>
                          {topPersons.map(([rid, total]) => {
                            const res = researchers.find(r => r.id === rid);
                            if (!res) return null;
                            return (
                              <tr key={rid} className="border-b border-slate-100 hover:bg-white/70">
                                <td className="py-1.5 font-medium text-slate-700">{res.title ? `${res.title} ` : ""}{res.name}</td>
                                {(indexTypesConfig || []).map(ic => {
                                  const cnt = personIdx[rid + "|" + ic.id] || 0;
                                  return <td key={ic.id} className="text-center">{cnt > 0 ? <span className="font-medium" style={{ color: ic.color }}>{cnt}</span> : <span className="text-slate-300">-</span>}</td>;
                                })}
                                <td className="text-center font-bold text-slate-700">{total}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Unvan bazlı */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Unvan Bazlı Yayın Dağılımı</p>
                    <div className="space-y-2">
                      {titleEntries.map(([title, cnt], i) => (
                        <div key={title} className="flex items-center gap-3">
                          <span className="text-xs font-medium text-slate-600 w-32 text-right flex-shrink-0 truncate">{title || "Belirtilmemiş"}</span>
                          <div className="flex-1 bg-slate-200 rounded-full h-5 overflow-hidden">
                            <div className="h-full rounded-full flex items-center justify-end pr-2 transition-all" style={{ width: `${Math.max((cnt / titleMax) * 100, 12)}%`, backgroundColor: PT_COLOR_PALETTE[i % PT_COLOR_PALETTE.length] }}>
                              <span className="text-[10px] font-bold text-white">{cnt}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Projelendirilmiş vs bağımsız */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Projelendirme Durumu</p>
                      <SimplePieChart data={[
                        { label: "Projelendirilmiş", value: withProj, color: "#8b5cf6" },
                        { label: "Bağımsız", value: withoutProj, color: "#94a3b8" },
                      ]} size={140} />
                    </div>
                    {/* Yıl bazlı */}
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Yıl Bazlı Yayın Dağılımı</p>
                      {yearKeys.length > 0 ? (
                        <div className="space-y-2">
                          {yearKeys.map(yr => {
                            const yrTotal = Object.values(yearIdx[yr]).reduce((s, v) => s + v, 0);
                            return (
                              <div key={yr}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-medium text-slate-600">{yr}</span>
                                  <span className="text-xs text-slate-400">{yrTotal}</span>
                                </div>
                                <div className="flex h-4 rounded-full overflow-hidden bg-slate-200">
                                  {allIdxIds.map(iid => {
                                    const cnt = yearIdx[yr][iid] || 0;
                                    if (cnt === 0) return null;
                                    const ic = (indexTypesConfig || []).find(i => i.id === iid);
                                    return <div key={iid} className="h-full" style={{ width: `${(cnt / yrTotal) * 100}%`, backgroundColor: ic?.color || "#94a3b8" }} title={`${ic?.label}: ${cnt}`} />;
                                  })}
                                </div>
                              </div>
                            );
                          })}
                          <div className="flex flex-wrap gap-2 mt-2">
                            {allIdxIds.map(iid => { const ic = (indexTypesConfig || []).find(i => i.id === iid); return ic ? <span key={iid} className="flex items-center gap-1 text-[10px] text-slate-500"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ic.color }} />{ic.label}</span> : null; })}
                          </div>
                        </div>
                      ) : <p className="text-xs text-slate-400 text-center py-4">Tarih verisi yok</p>}
                    </div>
                  </div>
                </>);
              })()}
            </div>
          )}

          {/* ── İşbirliği Matrisi Tab ── */}
          {activeTab === "collaboration" && (
            <div className="space-y-6">
              {(() => {
                // Matrisi hesapla: aynı konuda bulunan araştırmacı çiftleri
                const matrix = new Map();
                const involvedIds = new Set();
                filteredTopics.forEach(t => {
                  const rs = t.researchers || [];
                  rs.forEach(r => involvedIds.add(r.researcherId));
                  for (let i = 0; i < rs.length; i++) {
                    for (let j = i + 1; j < rs.length; j++) {
                      const key = [rs[i].researcherId, rs[j].researcherId].sort().join("-");
                      matrix.set(key, (matrix.get(key) || 0) + 1);
                    }
                  }
                });
                if (involvedIds.size === 0) return <p className="text-sm text-slate-400 text-center py-12">Henüz işbirliği verisi yok.</p>;

                const sortedRes = researchers.filter(r => involvedIds.has(r.id)).sort((a, b) => a.name.localeCompare(b.name, "tr"));
                const maxCollab = Math.max(...[...matrix.values()], 1);
                const totalCollabs = [...matrix.values()].reduce((s, v) => s + v, 0);
                const getCount = (id1, id2) => { const key = [id1, id2].sort().join("-"); return matrix.get(key) || 0; };

                // En çok işbirliği yapan çiftler
                const topPairs = [...matrix.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);

                return (<>
                  <div className="grid grid-cols-3 gap-3">
                    {statCard("Araştırmacı", sortedRes.length, <Users size={16} className="text-indigo-500" />, "bg-indigo-50")}
                    {statCard("Toplam İşbirliği", totalCollabs, <Activity size={16} className="text-emerald-500" />, "bg-emerald-50")}
                    {statCard("Eşsiz Çift", matrix.size, <UserCheck size={16} className="text-violet-500" />, "bg-violet-50")}
                  </div>

                  {/* En çok işbirliği yapan çiftler */}
                  {topPairs.length > 0 && (
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">En Çok İşbirliği Yapan Çiftler</p>
                      <div className="space-y-1.5">
                        {topPairs.map(([key, cnt]) => {
                          const [id1, id2] = key.split("-");
                          const r1 = researchers.find(r => r.id === id1);
                          const r2 = researchers.find(r => r.id === id2);
                          if (!r1 || !r2) return null;
                          return (
                            <div key={key} className="flex items-center gap-2">
                              <div className="flex items-center gap-1 w-60 flex-shrink-0">
                                <Avatar name={r1.name} color={r1.color} size="xs" />
                                <span className="text-xs text-slate-600 truncate">{r1.name.split(" ").pop()}</span>
                                <span className="text-[10px] text-slate-300">↔</span>
                                <Avatar name={r2.name} color={r2.color} size="xs" />
                                <span className="text-xs text-slate-600 truncate">{r2.name.split(" ").pop()}</span>
                              </div>
                              <div className="flex-1 bg-slate-200 rounded-full h-4 overflow-hidden">
                                <div className="h-full bg-indigo-500 rounded-full flex items-center justify-end pr-2 transition-all" style={{ width: `${Math.max((cnt / maxCollab) * 100, 10)}%` }}>
                                  <span className="text-[9px] font-bold text-white">{cnt}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Heatmap matrisi */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">İşbirliği Matrisi</p>
                    <p className="text-[10px] text-slate-400 mb-3">Sayılar iki araştırmacının birlikte çalıştığı konu sayısını gösterir. Renk yoğunluğu işbirliği sıklığını yansıtır.</p>
                    <div className="overflow-x-auto">
                      <table className="border-collapse text-[10px]">
                        <thead>
                          <tr>
                            <th className="p-1.5 text-left bg-slate-100 border border-slate-200 sticky left-0 z-10 min-w-[100px]">Araştırmacı</th>
                            {sortedRes.map(r => (
                              <th key={r.id} className="p-1.5 text-center bg-slate-100 border border-slate-200 max-w-[50px] min-w-[40px]" title={r.name}>
                                <span className="block truncate">{r.name.split(" ").pop().slice(0, 4)}</span>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sortedRes.map(r1 => (
                            <tr key={r1.id}>
                              <td className="p-1.5 border border-slate-200 bg-slate-100 font-medium text-slate-700 truncate max-w-[100px] sticky left-0 z-10" title={r1.name}>
                                {r1.name.split(" ").slice(-1)[0]}
                              </td>
                              {sortedRes.map(r2 => {
                                if (r1.id === r2.id) return <td key={r2.id} className="p-1.5 border border-slate-200 bg-slate-300/30 text-center text-slate-400">—</td>;
                                const cnt = getCount(r1.id, r2.id);
                                const intensity = cnt > 0 ? cnt / maxCollab : 0;
                                return (
                                  <td key={r2.id} className="p-1.5 border border-slate-200 text-center font-medium"
                                    style={{ backgroundColor: intensity > 0 ? `rgba(99, 102, 241, ${0.15 + intensity * 0.65})` : "transparent", color: intensity > 0.5 ? "white" : (cnt > 0 ? "#4338ca" : "#cbd5e1") }}
                                    title={`${r1.name} ↔ ${r2.name}: ${cnt} konu`}>
                                    {cnt > 0 ? cnt : "·"}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>);
              })()}
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
    { label: "Ekip", get: t => (t.researchers || []).map(tr => { const r = researchers.find(x => x.id === tr.researcherId); return r ? `${r.name} (${roleConfig[tr.role]?.label || tr.role}${tr.isIdeaOwner ? ", Fikir Sahibi" : ""})` : ""; }).filter(Boolean).join(", ") },
    { label: "Fikir Sahibi", get: t => (t.researchers || []).filter(tr => tr.isIdeaOwner).map(tr => { const r = researchers.find(x => x.id === tr.researcherId); return r ? r.name : ""; }).filter(Boolean).join(", ") || "-" },
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

// ─── AR-GE CHATBOT (KURAL TABANLI) ─────────────────────
const ArGeChatbot = ({ researchers, topics, projects }) => {
  const [open, setOpen] = useState(false);
  const [chatMaximized, setChatMaximized] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Merhaba! Ben Ar-Ge Asistanı. Aşağıdaki kategorilerden birini seçerek başlayabilirsiniz.", isWelcome: true }
  ]);
  const [input, setInput] = useState("");
  const [topicMode, setTopicMode] = useState(false);
  const [researcherMode, setResearcherMode] = useState(false);
  const chatRef = useRef(null);

  const processQuery = useCallback((q) => {
    const low = q.toLowerCase().replace(/[?!.,]/g, "").trim();
    const hasWord = (...words) => words.some(w => low.includes(w));
    const yearMatch = low.match(/\b(20\d{2})\b/);
    const year = yearMatch ? yearMatch[1] : null;
    const filterByYear = (items, y) => items.filter(i => (i.startDate || i.createdAt || "").startsWith(y));
    const countByStatus = (items, s) => items.filter(i => i.status === s).length;
    const countByType = (items, t) => items.filter(i => (i.type || "").toLowerCase() === t.toLowerCase()).length;
    const topResearchers = (metric, label, n = 3) => {
      const sorted = metric.sort((a, b) => b.count - a.count).filter(m => m.count > 0);
      if (sorted.length === 0) return "Bu kriterde sonu\u00e7 bulunamad\u0131.";
      return sorted.slice(0, n).map((c, i) => `${i+1}. ${c.name} (${c.count} ${label})`).join("\n");
    };

    // ── SELAMLAMA ──
    if (hasWord("merhaba", "selam", "hey", "g\u00fcnayd\u0131n", "iyi g\u00fcnler", "nas\u0131ls\u0131n")) return "Merhaba! Size Ar-Ge verileri hakk\u0131nda yard\u0131mc\u0131 olabilirim. Ne sormak istersiniz?";

    // ── GENEL \u00d6ZET ──
    if (hasWord("\u00f6zet", "genel", "dashboard", "panel", "durum ne", "rapor ver")) {
      const at = countByStatus(topics, "active"); const ap = countByStatus(projects, "active");
      const ct = countByStatus(topics, "completed"); const cp = countByStatus(projects, "completed");
      const pt = countByStatus(topics, "proposed"); const pp = countByStatus(projects, "proposed") + countByStatus(projects, "planning");
      const budget = projects.reduce((s, p) => s + (parseFloat(p.budget) || 0), 0);
      const aofCount = researchers.filter(r => r.isAofMember).length;
      return `Dashboard \u00d6zeti:\n\u2022 ${researchers.length} ara\u015ft\u0131rmac\u0131 (${aofCount} A\u00d6F \u00fcyesi)\n\u2022 ${topics.length} konu (${pt} \u00f6nerilen, ${at} aktif, ${ct} tamamlanan)\n\u2022 ${projects.length} proje (${pp} \u00f6nerilen, ${ap} aktif, ${cp} tamamlanan)\n\u2022 Toplam b\u00fct\u00e7e: \u20ba${budget.toLocaleString("tr-TR")}`;
    }

    // ── ARA\u015eTIRMACI SAYISI ──
    if (hasWord("ka\u00e7") && hasWord("ara\u015ft\u0131rmac\u0131", "ki\u015fi", "\u00fcye", "akademisyen")) {
      if (hasWord("a\u00f6f")) return `A\u00d6F \u00f6\u011fretim \u00fcyesi olan ${researchers.filter(r => r.isAofMember).length} ara\u015ft\u0131rmac\u0131 bulunmaktad\u0131r.`;
      if (hasWord("prof")) return `Sistemde ${researchers.filter(r => (r.title || "").includes("Prof")).length} Prof.Dr. bulunmaktad\u0131r.`;
      if (hasWord("do\u00e7")) return `Sistemde ${researchers.filter(r => (r.title || "").includes("Do\u00e7")).length} Do\u00e7.Dr. bulunmaktad\u0131r.`;
      return `Sistemde toplam ${researchers.length} ara\u015ft\u0131rmac\u0131 kay\u0131tl\u0131d\u0131r.`;
    }

    // ── KONU SAYISI ──
    if (hasWord("ka\u00e7") && hasWord("konu", "ara\u015ft\u0131rma konusu", "topic")) {
      let items = topics; if (year) items = filterByYear(items, year);
      if (hasWord("aktif")) return `${year ? year + " y\u0131l\u0131nda " : ""}${countByStatus(items, "active")} aktif konu bulunmaktad\u0131r.`;
      if (hasWord("tamamla")) return `${year ? year + " y\u0131l\u0131nda " : ""}${countByStatus(items, "completed")} tamamlanan konu bulunmaktad\u0131r.`;
      if (hasWord("\u00f6neril")) return `${year ? year + " y\u0131l\u0131nda " : ""}${countByStatus(items, "proposed")} \u00f6nerilen konu bulunmaktad\u0131r.`;
      return `${year ? year + " y\u0131l\u0131nda " : "Toplam "}${items.length} konu bulunmaktad\u0131r.`;
    }

    // ── PROJE SAYISI ──
    if (hasWord("ka\u00e7") && hasWord("proje", "project")) {
      let items = projects; if (year) items = filterByYear(items, year);
      if (hasWord("bap")) return `${year ? year+"'den beri " : ""}${countByType(items, "BAP")} BAP projesi bulunmaktad\u0131r.`;
      if (hasWord("t\u00fcbitak", "tubitak")) return `${year ? year+"'den beri " : ""}${countByType(items, "T\u00dcB\u0130TAK")} T\u00dcB\u0130TAK projesi bulunmaktad\u0131r.`;
      if (hasWord("horizon")) return `${year ? year+"'den beri " : ""}${countByType(items, "Horizon")} Horizon projesi bulunmaktad\u0131r.`;
      if (hasWord("erasmus")) return `${year ? year+"'den beri " : ""}${countByType(items, "Erasmus+")} Erasmus+ projesi bulunmaktad\u0131r.`;
      if (hasWord("digital")) return `${year ? year+"'den beri " : ""}${countByType(items, "DIGITAL")} DIGITAL projesi bulunmaktad\u0131r.`;
      if (hasWord("uluslararas\u0131")) return `${year ? year+"'den beri " : ""}${items.filter(p => (p.partnerCountries || []).length > 0).length} uluslararas\u0131 ortakl\u0131\u011f\u0131 olan proje bulunmaktad\u0131r.`;
      if (hasWord("aktif")) return `${year ? year + " y\u0131l\u0131nda " : ""}${countByStatus(items, "active")} aktif proje bulunmaktad\u0131r.`;
      if (hasWord("tamamla")) return `${year ? year + " y\u0131l\u0131nda " : ""}${countByStatus(items, "completed")} tamamlanan proje bulunmaktad\u0131r.`;
      return `${year ? year + "'den beri " : "Toplam "}${items.length} proje bulunmaktad\u0131r.`;
    }

    // ── PROJE T\u00dcR\u00dc DA\u011eILIMI ──
    if (hasWord("proje t\u00fcr", "proje da\u011f\u0131l\u0131m", "t\u00fcr da\u011f\u0131l\u0131m")) {
      const counts = {};
      projects.forEach(p => { const t = p.type || "Belirtilmemi\u015f"; counts[t] = (counts[t] || 0) + 1; });
      const lines = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([k, v]) => `\u2022 ${k}: ${v} proje`).join("\n");
      return `Proje T\u00fcr\u00fc Da\u011f\u0131l\u0131m\u0131:\n${lines}`;
    }

        // ── YAYIN İNDEKS TÜRLERİ ──
    if (hasWord("yay\u0131n", "indeks", "sci", "ssci", "scopus", "ahci", "esci", "tr dizin", "tr-dizin", "publikasyon", "yay\u0131n indeks")) {
      const pubTopics = topics.filter(t => t.status === "completed" && t.publishingIndex?.types?.length > 0);
      if (pubTopics.length === 0) return "Hen\u00fcz yay\u0131n indeksi atanm\u0131\u015f tamamlanm\u0131\u015f konu bulunmamaktad\u0131r.";
      const idxCounts = {};
      pubTopics.forEach(t => (t.publishingIndex.types || []).forEach(iid => { idxCounts[iid] = (idxCounts[iid] || 0) + 1; }));
      const idxLines = Object.entries(idxCounts).sort((a, b) => b[1] - a[1]).map(([iid, cnt]) => {
        const ic = (indexTypesConfig || []).find(i => i.id === iid);
        return `\u2022 ${ic ? ic.label : iid}: ${cnt} yay\u0131n (\u00d7${ic ? ic.coefficient : "?"} puan)`;
      }).join("\n");
      const resPub = {};
      pubTopics.forEach(t => (t.researchers || []).forEach(tr => { resPub[tr.researcherId] = (resPub[tr.researcherId] || 0) + 1; }));
      const topPub = Object.entries(resPub).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([rid, cnt]) => {
        const r = researchers.find(r => r.id === rid);
        return r ? `${r.title ? r.title + " " : ""}${r.name}: ${cnt} yay\u0131n` : null;
      }).filter(Boolean).join("\n");
      return `\ud83d\udcc4 Yay\u0131n \u0130ndeks Da\u011f\u0131l\u0131m\u0131:\n${idxLines}\n\nToplam: ${pubTopics.length} yay\u0131nl\u0131 konu\n\n\ud83c\udfc6 En \u00e7ok yay\u0131na sahip ara\u015ft\u0131rmac\u0131lar:\n${topPub || "Veri yok"}`;
    }

    // ── PROJE TÜRÜ DETAY ──
    if (hasWord("proje t\u00fcr\u00fc detay", "proje t\u00fcrleri detay", "t\u00fcr detay")) {
      const typeCounts = {};
      projects.forEach(p => { 
        const t = p.type || "Belirtilmemi\u015f"; 
        if (!typeCounts[t]) typeCounts[t] = { total: 0, active: 0, completed: 0, proposed: 0, budget: 0 };
        typeCounts[t].total++;
        if (p.status === "active") typeCounts[t].active++;
        if (p.status === "completed") typeCounts[t].completed++;
        if (p.status === "proposed" || p.status === "planning") typeCounts[t].proposed++;
        typeCounts[t].budget += parseFloat(p.budget) || 0;
      });
      const lines = Object.entries(typeCounts).sort((a, b) => b[1].total - a[1].total).map(([k, v]) => 
        `\u2022 ${k}: ${v.total} proje (${v.active} aktif, ${v.completed} tamamlanan) \u2014 \u20ba${v.budget.toLocaleString("tr-TR")}`
      ).join("\n");
      return `\ud83d\udcc1 Proje T\u00fcr\u00fc Detayl\u0131 Da\u011f\u0131l\u0131m:\n${lines}`;
    }

    // ── BAP SPESIFIK ──
    if (hasWord("bap")) {
      let items = projects.filter(p => (p.type || "").toLowerCase() === "bap"); if (year) items = filterByYear(items, year);
      const active = items.filter(p => p.status === "active").length; const completed = items.filter(p => p.status === "completed").length;
      return `${year ? year+"'den beri " : "Toplam "}${items.length} BAP projesi var (${active} aktif, ${completed} tamamlanan).`;
    }

    // ── T\u00dcB\u0130TAK SPESIFIK ──
    if (hasWord("t\u00fcbitak", "tubitak")) {
      let items = projects.filter(p => (p.type || "").toLowerCase().includes("t\u00fcbitak")); if (year) items = filterByYear(items, year);
      return `${year ? year+"'den beri " : "Toplam "}${items.length} T\u00dcB\u0130TAK projesi bulunmaktad\u0131r.`;
    }

    // ── EN \u00c7OK KONU ──
    if (hasWord("en \u00e7ok", "en fazla") && hasWord("konu", "topic")) {
      const counts = researchers.map(r => ({ name: (r.title ? r.title + " " : "") + r.name, count: topics.filter(t => (t.researchers || []).some(tr => tr.researcherId === r.id)).length }));
      return `En \u00e7ok konuya sahip ara\u015ft\u0131rmac\u0131lar:\n${topResearchers(counts, "konu", 5)}`;
    }

    // ── EN \u00c7OK PROJE ──
    if (hasWord("en \u00e7ok", "en fazla") && hasWord("proje")) {
      const counts = researchers.map(r => {
        const rTopics = topics.filter(t => (t.researchers || []).some(tr => tr.researcherId === r.id));
        const rTopicIds = new Set(rTopics.map(t => t.id));
        return { name: (r.title ? r.title + " " : "") + r.name, count: projects.filter(p => (p.topics || []).some(tid => rTopicIds.has(tid))).length };
      });
      return `En \u00e7ok projeye sahip ara\u015ft\u0131rmac\u0131lar:\n${topResearchers(counts, "proje", 5)}`;
    }

    // ── EN Y\u00dcKSEK B\u00dcT\u00c7E ──
    if (hasWord("en y\u00fcksek", "en b\u00fcy\u00fck") && hasWord("b\u00fct\u00e7e", "butce")) {
      const sorted = [...projects].filter(p => parseFloat(p.budget) > 0).sort((a, b) => parseFloat(b.budget) - parseFloat(a.budget));
      if (sorted.length === 0) return "B\u00fct\u00e7esi belirlenmi\u015f proje bulunamad\u0131.";
      const top3 = sorted.slice(0, 3).map((p, i) => `${i+1}. ${p.title} (\u20ba${parseFloat(p.budget).toLocaleString("tr-TR")})`).join("\n");
      return `En y\u00fcksek b\u00fct\u00e7eli projeler:\n${top3}`;
    }

    // ── B\u00dcT\u00c7E ──
    if (hasWord("b\u00fct\u00e7e", "butce", "toplam b\u00fct\u00e7e", "mali", "finansman")) {
      let items = projects; if (year) items = filterByYear(items, year);
      const total = items.reduce((s, p) => s + (parseFloat(p.budget) || 0), 0);
      const avg = items.length > 0 ? total / items.length : 0;
      const maxP = items.reduce((m, p) => (parseFloat(p.budget) || 0) > (parseFloat(m.budget) || 0) ? p : m, items[0]);
      return `${year ? year + " y\u0131l\u0131 " : ""}Proje B\u00fct\u00e7e \u00d6zeti:\n\u2022 Toplam: \u20ba${total.toLocaleString("tr-TR")}\n\u2022 Ortalama: \u20ba${Math.round(avg).toLocaleString("tr-TR")}\n\u2022 Proje say\u0131s\u0131: ${items.length}${maxP ? "\n\u2022 En y\u00fcksek: " + maxP.title : ""}`;
    }

    // ── UNVAN DA\u011eILIMI ──
    if (hasWord("unvan", "\u00fcnvan", "akademik kadro", "profes\u00f6r", "do\u00e7ent")) {
      const counts = {};
      researchers.forEach(r => { const t = (r.title && r.title.trim()) ? r.title.trim() : "Belirtilmemi\u015f"; counts[t] = (counts[t] || 0) + 1; });
      const lines = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([k, v]) => `\u2022 ${k}: ${v} ki\u015fi`).join("\n");
      return `Unvan Da\u011f\u0131l\u0131m\u0131:\n${lines}\nToplam: ${researchers.length} ara\u015ft\u0131rmac\u0131`;
    }

    // ── KURUM DA\u011eILIMI ──
    if (hasWord("kurum", "birim", "fak\u00fclte", "b\u00f6l\u00fcm")) {
      const counts = {};
      researchers.forEach(r => { const inst = r.institution || "Belirtilmemi\u015f"; counts[inst] = (counts[inst] || 0) + 1; });
      const lines = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([k, v]) => `\u2022 ${k}: ${v} ki\u015fi`).join("\n");
      return `Kurum Da\u011f\u0131l\u0131m\u0131:\n${lines}`;
    }

    // ── A\u00d6F \u00dcYELERI ──
    if (hasWord("a\u00f6f", "a\u00e7\u0131k\u00f6\u011fretim")) {
      const aof = researchers.filter(r => r.isAofMember); const diger = researchers.filter(r => !r.isAofMember);
      const aofNames = aof.slice(0, 5).map(r => (r.title ? r.title + " " : "") + r.name).join(", ");
      return `A\u00d6F \u00d6\u011fretim \u00dcyesi: ${aof.length} ki\u015fi\nDi\u011fer: ${diger.length} ki\u015fi\n\n\u00d6rnek A\u00d6F \u00fcyeleri: ${aofNames}${aof.length > 5 ? " ve di\u011ferleri..." : ""}`;
    }

    // ── GOREV / TASK ──
    if (hasWord("g\u00f6rev", "task", "yap\u0131lacak")) {
      const allTasks = [...topics, ...projects].flatMap(x => x.tasks || []);
      const done = allTasks.filter(t => t.status === "done").length;
      const todo = allTasks.filter(t => t.status === "todo").length;
      const inProgress = allTasks.filter(t => t.status === "in_progress").length;
      return `G\u00f6rev \u00d6zeti:\n\u2022 Toplam: ${allTasks.length} g\u00f6rev\n\u2022 Tamamlanan: ${done}\n\u2022 Devam eden: ${inProgress}\n\u2022 Bekleyen: ${todo}\n\u2022 Tamamlanma oran\u0131: %${allTasks.length > 0 ? Math.round(done / allTasks.length * 100) : 0}`;
    }

    // ── DURUM BAZLI ──
    if (hasWord("aktif")) { return `Aktif durumda:\n\u2022 ${countByStatus(topics, "active")} konu\n\u2022 ${countByStatus(projects, "active")} proje`; }
    if (hasWord("tamamla", "bitir", "biten", "tamamlanan")) { return `Tamamlanan:\n\u2022 ${countByStatus(topics, "completed")} konu\n\u2022 ${countByStatus(projects, "completed")} proje`; }
    if (hasWord("\u00f6nerilen", "\u00f6neri", "bekleyen")) { return `\u00d6nerilen/Bekleyen:\n\u2022 ${countByStatus(topics, "proposed")} konu\n\u2022 ${countByStatus(projects, "proposed") + countByStatus(projects, "planning")} proje`; }
    if (hasWord("ba\u015far\u0131s\u0131z", "iptal", "ba\u015far\u0131lamayan")) { return `Ba\u015far\u0131s\u0131z/\u0130ptal:\n\u2022 ${countByStatus(topics, "failed")} konu\n\u2022 ${countByStatus(projects, "failed")} proje`; }

    // ── ULUSLARARASI ──
    if (hasWord("uluslararas\u0131", "international", "yabanc\u0131", "\u00fclke", "ortakl\u0131k")) {
      const intl = projects.filter(p => (p.partnerCountries || []).length > 0);
      const countries = new Set(); intl.forEach(p => (p.partnerCountries || []).forEach(c => countries.add(c)));
      return `Uluslararas\u0131 Ortakl\u0131klar:\n\u2022 ${intl.length} uluslararas\u0131 proje\n\u2022 ${countries.size} farkl\u0131 \u00fclke${countries.size > 0 ? "\n\u2022 \u00dclkeler: " + [...countries].join(", ") : ""}`;
    }

    // ── ROL DA\u011eILIMI ──
    if (hasWord("rol", "y\u00fcr\u00fct\u00fcc\u00fc", "sorumlu", "lider")) {
      const roleCounts = {};
      topics.forEach(t => (t.researchers || []).forEach(r => { if (r.role) roleCounts[r.role] = (roleCounts[r.role] || 0) + 1; }));
      const lines = Object.entries(roleCounts).sort((a, b) => b[1] - a[1]).map(([k, v]) => `\u2022 ${k}: ${v} atama`).join("\n");
      return `Konulardaki Rol Da\u011f\u0131l\u0131m\u0131:\n${lines || "Rol atas\u0131 bulunamad\u0131."}`;
    }

    // ── SON EKLENEN ──
    if (hasWord("son eklenen", "yeni", "en son")) {
      const sorted = [...topics, ...projects].filter(i => i.createdAt).sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
      const top5 = sorted.slice(0, 5).map((item, i) => `${i+1}. ${item.title} (${item.createdAt || "?"})`).join("\n");
      return `Son Eklenen \u00d6\u011feler:\n${top5 || "Tarih bilgisi olan \u00f6\u011fe bulunamad\u0131."}`;
    }

    // ── KARI\u015eTIRMA: KONU vs PROJE ──
    if (hasWord("kar\u015f\u0131la\u015ft\u0131r", "k\u0131yasla", "fark")) {
      return `Konu vs Proje Kar\u015f\u0131la\u015ft\u0131rmas\u0131:\n\n\u2022 Konular (${topics.length}):\n  Aktif: ${countByStatus(topics, "active")} | Tamamlanan: ${countByStatus(topics, "completed")} | \u00d6nerilen: ${countByStatus(topics, "proposed")}\n\n\u2022 Projeler (${projects.length}):\n  Aktif: ${countByStatus(projects, "active")} | Tamamlanan: ${countByStatus(projects, "completed")} | \u00d6nerilen: ${countByStatus(projects, "proposed") + countByStatus(projects, "planning")}`;
    }

    // ── VERIMLILIK ──
    if (hasWord("verimlilik", "performans", "ba\u015far\u0131", "oran")) {
      const topicSuccess = topics.length > 0 ? Math.round(countByStatus(topics, "completed") / topics.length * 100) : 0;
      const projectSuccess = projects.length > 0 ? Math.round(countByStatus(projects, "completed") / projects.length * 100) : 0;
      const allTasks = [...topics, ...projects].flatMap(x => x.tasks || []);
      const taskRate = allTasks.length > 0 ? Math.round(allTasks.filter(t => t.status === "done").length / allTasks.length * 100) : 0;
      return `Verimlilik Metrikleri:\n\u2022 Konu tamamlanma oran\u0131: %${topicSuccess}\n\u2022 Proje tamamlanma oran\u0131: %${projectSuccess}\n\u2022 G\u00f6rev tamamlanma oran\u0131: %${taskRate}\n\u2022 Ara\u015ft\u0131rmac\u0131 ba\u015f\u0131na ortalama konu: ${(topics.length / Math.max(researchers.length, 1)).toFixed(1)}`;
    }

    // ── PI DENEYIMI ──
    if (hasWord("y\u00fcr\u00fct\u00fcc\u00fc deneyim", "pi deneyim", "proje y\u00fcr\u00fct")) {
      const withPI = researchers.filter(r => r.hasPIExperience);
      return `Proje Y\u00fcr\u00fct\u00fcc\u00fcl\u00fc\u011f\u00fc Deneyimi:\n\u2022 Deneyimi olan: ${withPI.length} ki\u015fi\n\u2022 Deneyimi olmayan: ${researchers.length - withPI.length} ki\u015fi`;
    }

    // ── ARA\u015eTIRMACI ARAMA (isim ile) ──
    const nameSearch = researchers.find(r => low.includes(r.name.toLowerCase().split(" ")[0]) && low.includes(r.name.toLowerCase().split(" ").pop()));
    if (nameSearch) {
      const rTopics = topics.filter(t => (t.researchers || []).some(tr => tr.researcherId === nameSearch.id));
      const rTopicIds = new Set(rTopics.map(t => t.id));
      const rProjects = projects.filter(p => (p.topics || []).some(tid => rTopicIds.has(tid)));
      const roles = {};
      rTopics.forEach(t => { const a = (t.researchers || []).find(r => r.researcherId === nameSearch.id); if (a?.role) roles[a.role] = (roles[a.role] || 0) + 1; });
      const roleStr = Object.entries(roles).map(([k, v]) => `${k}: ${v}`).join(", ");
      return `${nameSearch.title ? nameSearch.title + " " : ""}${nameSearch.name}:\n\u2022 Kurum: ${nameSearch.institution || "Belirtilmemi\u015f"}\n\u2022 A\u00d6F \u00dcyesi: ${nameSearch.isAofMember ? "Evet" : "Hay\u0131r"}\n\u2022 PI Deneyimi: ${nameSearch.hasPIExperience ? "Var" : "Yok"}\n\u2022 ${rTopics.length} konu, ${rProjects.length} proje\n\u2022 Aktif konu: ${rTopics.filter(t=>t.status==="active").length}${roleStr ? "\n\u2022 Roller: " + roleStr : ""}`;
    }

    // ── AKILLI ARAMA MOTORU ──
    // Konu başlığı, açıklama, tag, kategori araması
    const searchTerms = low.split(/\s+/).filter(w => w.length > 2);
    if (searchTerms.length > 0) {
      const matchedTopics = topics.filter(t => {
        const haystack = [t.title, t.description, t.category, ...(t.tags || []), t.projectType, t.projectTypeDetail, t.projectCall, t.targetJournal, t.requiredSkills, t.researchMethod].filter(Boolean).join(" ").toLowerCase();
        return searchTerms.some(term => haystack.includes(term));
      });
      const matchedProjects = projects.filter(p => {
        const haystack = [p.title, p.description, p.type, ...(p.tags || []), ...(p.partnerCountries || []), p.piInstitution, p.piCountry].filter(Boolean).join(" ").toLowerCase();
        return searchTerms.some(term => haystack.includes(term));
      });
      const matchedResearchers = researchers.filter(r => {
        const haystack = [r.name, r.title, r.institution, r.unit, ...(r.researchAreas || []), ...(r.languages || []), r.eduProgram, r.eduUniversity].filter(Boolean).join(" ").toLowerCase();
        return searchTerms.some(term => haystack.includes(term));
      });

      const results = [];
      if (matchedTopics.length > 0) {
        const topicList = matchedTopics.slice(0, 5).map((t, i) => {
          const status = t.status === "active" ? "Aktif" : t.status === "completed" ? "Tamamlandı" : t.status === "proposed" ? "Önerilen" : t.status;
          return `  ${i+1}. ${t.title} [${status}]${t.category ? " (" + t.category + ")" : ""}`;
        }).join("\n");
        results.push(`📖 Eşleşen Konular (${matchedTopics.length}):\n${topicList}${matchedTopics.length > 5 ? "\n  ... ve " + (matchedTopics.length - 5) + " konu daha" : ""}`);
      }
      if (matchedProjects.length > 0) {
        const projList = matchedProjects.slice(0, 5).map((p, i) => {
          const status = p.status === "active" ? "Aktif" : p.status === "completed" ? "Tamamlandı" : p.status === "proposed" ? "Önerilen" : p.status;
          return `  ${i+1}. ${p.title} [${status}]${p.type ? " - " + p.type : ""}`;
        }).join("\n");
        results.push(`📁 Eşleşen Projeler (${matchedProjects.length}):\n${projList}${matchedProjects.length > 5 ? "\n  ... ve " + (matchedProjects.length - 5) + " proje daha" : ""}`);
      }
      if (matchedResearchers.length > 0) {
        const resList = matchedResearchers.slice(0, 5).map((r, i) => {
          const areas = (r.researchAreas || []).slice(0, 3).join(", ");
          return `  ${i+1}. ${r.title ? r.title + " " : ""}${r.name}${areas ? " (" + areas + ")" : ""}`;
        }).join("\n");
        results.push(`👥 Eşleşen Araştırmacılar (${matchedResearchers.length}):\n${resList}${matchedResearchers.length > 5 ? "\n  ... ve " + (matchedResearchers.length - 5) + " kişi daha" : ""}`);
      }

      if (results.length > 0) {
        return `🔍 "${q}" için arama sonuçları:\n\n${results.join("\n\n")}`;
      }
    }

    // ── YARDIM ──
    if (hasWord("yard\u0131m", "help", "ne sor", "neler sor", "komut")) {
      return "Sorabilece\u011finiz soru kategorileri:\n\n\ud83d\udcca Genel: \u00d6zet, durum, kar\u015f\u0131la\u015ft\u0131rma\n\ud83d\udc65 Ara\u015ft\u0131rmac\u0131: Ka\u00e7 ki\u015fi, A\u00d6F, unvan\n\ud83d\udcd6 Konu: Ka\u00e7 konu, aktif/tamamlanan\n\ud83d\udcc1 Proje: BAP/T\u00dcB\u0130TAK, b\u00fct\u00e7e\n\ud83d\udcc4 Yay\u0131n \u0130ndeksleri: SCI, SSCI, Scopus da\u011f\u0131l\u0131m\u0131\n\ud83d\uddc2\ufe0f Proje T\u00fcrleri: T\u00fcr detaylar\u0131, b\u00fct\u00e7e da\u011f\u0131l\u0131m\u0131\n\ud83c\udf10 Uluslararas\u0131: Ortakl\u0131klar, \u00fclkeler\n\ud83d\udcc8 Performans: Verimlilik, g\u00f6revler\n\ud83d\udd0d Arama: Herhangi bir kelime yaz\u0131n!\n\n\u00d6rne\u011fin: \"yapay zeka\", \"SCI\", \"BAP\", \"Almanya\" gibi kelimelerle arayabilirsiniz.";
    }

    // ── FALLBACK ──
    return "Tam e\u015fle\u015fme bulunamad\u0131. \u015eunlar\u0131 deneyebilirsiniz:\n\u2022 \u0130statistik sorgular\u0131: \"Genel \u00f6zet\", \"B\u00fct\u00e7e\", \"Unvan da\u011f\u0131l\u0131m\u0131\"\n\u2022 Anahtar kelime aramas\u0131: \"yapay zeka\", \"XR\", \"Horizon\"\n\u2022 Ki\u015fi aramas\u0131: Ara\u015ft\u0131rmac\u0131 ad\u0131 yaz\u0131n\n\n\"Yard\u0131m\" yazarak t\u00fcm kategorileri g\u00f6rebilirsiniz.";
  }, [researchers, topics, projects]);

  const analyzeTopicProposal = useCallback((keyword) => {
    const kw = keyword.toLowerCase().trim();
    const kwWords = kw.split(/\s+/).filter(w => w.length > 2);

    // Benzer konuları bul (başlık, açıklama, tag'lerde ara)
    const similarTopics = topics.filter(t => {
      const haystack = [t.title, t.description, ...(t.tags || []), t.category, t.projectType].filter(Boolean).join(" ").toLowerCase();
      return kwWords.some(w => haystack.includes(w));
    }).map(t => {
      const statusMap = { active: "Aktif", completed: "Tamamlandı", proposed: "Önerilen", planning: "Planlama", failed: "Başarısız" };
      return { title: t.title, status: statusMap[t.status] || t.status, category: t.category || "", id: t.id };
    });

    // İlgili araştırmacıları bul (researchAreas, mevcut konu eşleşmesi)
    const matchedResearchers = researchers.filter(r => {
      const areas = (r.researchAreas || []).join(" ").toLowerCase();
      const nameInst = [r.name, r.institution, r.unit, r.eduProgram].filter(Boolean).join(" ").toLowerCase();
      return kwWords.some(w => areas.includes(w) || nameInst.includes(w));
    });

    // Konularda görev alan araştırmacıları bul (rol + görev sayısı)
    const resTopicMap = {};
    similarTopics.forEach(st => {
      const t = topics.find(t => t.id === st.id);
      if (t) (t.researchers || []).forEach(tr => {
        if (!resTopicMap[tr.researcherId]) resTopicMap[tr.researcherId] = { roles: {}, count: 0 };
        resTopicMap[tr.researcherId].count++;
        const role = tr.role || "üye";
        resTopicMap[tr.researcherId].roles[role] = (resTopicMap[tr.researcherId].roles[role] || 0) + 1;
      });
    });
    const topicResearchers = Object.entries(resTopicMap)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([rid, info]) => ({ ...researchers.find(r => r.id === rid), _topicCount: info.count, _roles: info.roles }))
      .filter(r => r.id && !matchedResearchers.find(mr => mr.id === r.id));

    // Sonucu oluştur
    let result = `🔎 "${keyword}" için analiz sonuçları:\n`;

    if (similarTopics.length > 0) {
      result += `\n📋 Benzer/İlgili Konular (${similarTopics.length}):\n`;
      similarTopics.slice(0, 6).forEach((t, i) => {
        const badge = t.status === "Aktif" ? "🟢" : t.status === "Tamamlandı" ? "🔵" : t.status === "Önerilen" ? "🟡" : "⚪";
        result += `  ${badge} ${t.title}\n     [${t.status}]${t.category ? " · " + t.category : ""}\n`;
      });
      if (similarTopics.length > 6) result += `  ... ve ${similarTopics.length - 6} konu daha\n`;
    } else {
      result += `\n✨ Bu alanda henüz kayıtlı konu yok — yeni bir alan olabilir!\n`;
    }

    if (matchedResearchers.length > 0 || topicResearchers.length > 0) {
      result += `\n👥 Önerilen Araştırmacılar:\n`;
      if (matchedResearchers.length > 0) {
        result += `\n  🎯 Araştırma alanı eşleşenler:\n`;
        matchedResearchers.slice(0, 5).forEach((r, i) => {
          const areas = (r.researchAreas || []).slice(0, 3).join(", ");
          result += `  ${i+1}. ${r.title ? r.title + " " : ""}${r.name}\n     ${areas}\n`;
        });
      }
      if (topicResearchers.length > 0) {
        result += `\n  🔗 Benzer konularda görev alanlar:\n`;
        topicResearchers.slice(0, 5).forEach((r, i) => {
          const roleStr = Object.entries(r._roles || {}).map(([k,v]) => k === "lead" ? "Lider" : k === "responsible" ? "Sorumlu" : k === "member" ? "Üye" : k).join(", ");
          result += `  ${i+1}. ${r.title ? r.title + " " : ""}${r.name} (${r._topicCount} konu · ${roleStr})\n`;
        });
      }
    } else {
      result += `\n👥 Bu alanda eşleşen araştırmacı bulunamadı.\n`;
    }

    const totalRelated = similarTopics.filter(t => t.status === "Aktif" || t.status === "Önerilen").length;
    result += `\n💡 Öneri: `;
    if (totalRelated > 3) {
      result += `Bu alanda ${totalRelated} aktif/önerilen konu var. Mevcut bir konuya dahil olmayı düşünebilirsiniz.`;
    } else if (similarTopics.length > 0) {
      result += `Mevcut konularla sinerji oluşturulabilir. Yeni bir konu olarak eklemek ister misiniz?`;
    } else {
      result += `Yeni ve özgün bir alan! Konu olarak eklenmesi önerilir.`;
    }

    return result;
  }, [researchers, topics]);

  const analyzeResearcherSuggestion = useCallback((keyword) => {
    const kw = keyword.toLowerCase().trim();
    const kwWords = kw.split(/\s+/).filter(w => w.length > 2);

    // [1] Araştırma alanı eşleşen araştırmacılar
    const areaMatched = researchers.map(r => {
      const areas = (r.researchAreas || []).join(" ").toLowerCase();
      const score = kwWords.reduce((s, w) => s + (areas.includes(w) ? 2 : 0), 0);
      return { ...r, _score: score, _matchType: "area" };
    }).filter(r => r._score > 0).sort((a, b) => b._score - a._score);

    // [2] Konularda görev alan araştırmacılar
    const relTopics = topics.filter(t => {
      const hay = [t.title, t.description, ...(t.tags || []), t.category, t.projectType].filter(Boolean).join(" ").toLowerCase();
      return kwWords.some(w => hay.includes(w));
    });
    const roleMap = {};
    relTopics.forEach(t => {
      (t.researchers || []).forEach(tr => {
        if (!roleMap[tr.researcherId]) roleMap[tr.researcherId] = { topics: [], roles: {} };
        roleMap[tr.researcherId].topics.push(t.title);
        const role = tr.role || "member";
        roleMap[tr.researcherId].roles[role] = (roleMap[tr.researcherId].roles[role] || 0) + 1;
      });
    });
    const topicMatched = Object.entries(roleMap)
      .map(([rid, info]) => ({ ...researchers.find(r => r.id === rid), _topics: info.topics, _roles: info.roles, _topicCount: info.topics.length }))
      .filter(r => r.id)
      .sort((a, b) => b._topicCount - a._topicCount);

    // [3] Projelerde yer alan araştırmacılar
    const relProjects = projects.filter(p => {
      const hay = [p.name, p.type, p.status, p.description, p.fundingSource].filter(Boolean).join(" ").toLowerCase();
      return kwWords.some(w => hay.includes(w));
    });
    const projMap = {};
    relProjects.forEach(p => {
      (p.researchers || []).forEach(pr => {
        if (!projMap[pr.researcherId]) projMap[pr.researcherId] = { projects: [], roles: {} };
        projMap[pr.researcherId].projects.push(p.name);
        const role = pr.role || "member";
        projMap[pr.researcherId].roles[role] = (projMap[pr.researcherId].roles[role] || 0) + 1;
      });
    });
    const projMatched = Object.entries(projMap)
      .map(([rid, info]) => ({ ...researchers.find(r => r.id === rid), _projects: info.projects, _projRoles: info.roles, _projCount: info.projects.length }))
      .filter(r => r.id)
      .sort((a, b) => b._projCount - a._projCount);

    // Sonucu oluştur
    let result = `🔍 "${keyword}" için uygun araştırmacı analizi:\n`;
    const shown = new Set();

    if (areaMatched.length > 0) {
      result += `\n🎯 Araştırma Alanı Eşleşenler (${areaMatched.length}):\n`;
      areaMatched.slice(0, 5).forEach((r, i) => {
        const areas = (r.researchAreas || []).slice(0, 4).join(", ");
        result += `  ${i+1}. ${r.title ? r.title + " " : ""}${r.name}\n     📚 ${areas}\n`;
        if (r.institution) result += `     🏫 ${r.institution}\n`;
        shown.add(r.id);
      });
    }

    if (topicMatched.length > 0) {
      result += `\n🔗 İlgili Konularda Görev Alanlar (${topicMatched.length}):\n`;
      topicMatched.filter(r => !shown.has(r.id)).slice(0, 5).forEach((r, i) => {
        const roleStr = Object.entries(r._roles || {}).map(([k,v]) => k === "lead" ? "Lider(" + v + ")" : k === "responsible" ? "Sorumlu(" + v + ")" : k === "member" ? "Üye(" + v + ")" : k + "(" + v + ")").join(", ");
        result += `  ${i+1}. ${r.title ? r.title + " " : ""}${r.name} — ${r._topicCount} konu · ${roleStr}\n`;
        shown.add(r.id);
      });
    }

    if (projMatched.length > 0) {
      result += `\n📁 İlgili Projelerde Yer Alanlar (${projMatched.length}):\n`;
      projMatched.filter(r => !shown.has(r.id)).slice(0, 4).forEach((r, i) => {
        const roleStr = Object.entries(r._projRoles || {}).map(([k,v]) => k === "lead" ? "Yürütücü(" + v + ")" : k === "responsible" ? "Sorumlu(" + v + ")" : k === "member" ? "Üye(" + v + ")" : k + "(" + v + ")").join(", ");
        result += `  ${i+1}. ${r.title ? r.title + " " : ""}${r.name} — ${r._projCount} proje · ${roleStr}\n`;
        shown.add(r.id);
      });
    }

    if (shown.size === 0) {
      result += `\n⚠️ Bu anahtar kelimelerle eşleşen araştırmacı bulunamadı.\n`;
      result += `💡 Daha genel terimler deneyin veya araştırma alanlarını kontrol edin.`;
    } else {
      const total = shown.size;
      result += `\n📊 Toplam ${total} benzersiz araştırmacı bulundu.`;
      if (areaMatched.length > 0 && topicMatched.length > 0) {
        const overlap = areaMatched.filter(a => topicMatched.find(t => t.id === a.id));
        if (overlap.length > 0) {
          result += `\n⭐ ${overlap.length} araştırmacı hem alan hem konu eşleşmesi gösteriyor — güçlü adaylar!`;
        }
      }
    }

    return result;
  }, [researchers, topics, projects]);

  const getSuggestions = useCallback((q) => {
    const low = q.toLowerCase();
    if (low.includes("özet") || low.includes("genel") || low.includes("dashboard")) return ["Bütçe detayları", "Unvan dağılımı", "Aktif projeler"];
    if (low.includes("bap")) return ["TÜBİTAK projeleri", "Toplam bütçe", "Proje türü dağılımı"];
    if (low.includes("tübitak") || low.includes("tubitak")) return ["BAP projeleri", "Horizon projeleri", "Bütçe karşılaştırması"];
    if (low.includes("horizon") || low.includes("erasmus") || low.includes("uluslararası")) return ["Ortaklık ülkeleri", "Proje türü dağılımı", "Toplam bütçe"];
    if (low.includes("bütçe") || low.includes("butce") || low.includes("mali")) return ["En yüksek bütçeli proje", "Proje türü dağılımı", "Verimlilik metrikleri"];
    if (low.includes("unvan") || low.includes("ünvan") || low.includes("profesör") || low.includes("doçent")) return ["Kurum dağılımı", "AÖF üyeleri", "Araştırmacı sayısı"];
    if (low.includes("kurum") || low.includes("birim") || low.includes("fakülte")) return ["Unvan dağılımı", "AÖF üyeleri", "Genel özet"];
    if (low.includes("araştırmacı") || low.includes("kişi") || low.includes("akademisyen")) return ["Unvan dağılımı", "En çok konusu olan", "AÖF üyeleri"];
    if (low.includes("konu") && !low.includes("proje")) return ["Aktif konular", "En çok konusu olan", "Konu-proje karşılaştırması"];
    if (low.includes("proje") && !low.includes("bap") && !low.includes("tübitak")) return ["BAP projeleri", "Bütçe detayları", "Uluslararası projeler"];
    if (low.includes("aktif")) return ["Tamamlanan projeler", "Önerilen projeler", "Verimlilik metrikleri"];
    if (low.includes("tamamla") || low.includes("bitir") || low.includes("biten")) return ["Aktif durumda olanlar", "Verimlilik metrikleri", "Görev özeti"];
    if (low.includes("görev") || low.includes("task")) return ["Verimlilik metrikleri", "Aktif projeler", "Genel özet"];
    if (low.includes("verimlilik") || low.includes("performans") || low.includes("başarı")) return ["Görev özeti", "Tamamlanan projeler", "Karşılaştırma"];
    if (low.includes("aöf") || low.includes("açıköğretim")) return ["Unvan dağılımı", "Kurum dağılımı", "Genel özet"];
    if (low.includes("rol") || low.includes("yürütücü")) return ["PI deneyimi olanlar", "En çok projesi olan", "Unvan dağılımı"];
    if (low.includes("son eklenen") || low.includes("yeni")) return ["Genel özet", "Aktif projeler", "Görev özeti"];
    if (low.includes("karşılaştır") || low.includes("kıyasla")) return ["Verimlilik metrikleri", "Bütçe detayları", "Görev özeti"];
    if (low.includes("yapay zeka") || low.includes("ai") || low.includes("llm")) return ["uzaktan eğitim", "XR konuları", "Proje türü dağılımı"];
    if (low.includes("xr") || low.includes("vr") || low.includes("ar ")) return ["yapay zeka", "STEM konuları", "Erasmus+ projeleri"];
    if (low.includes("uzaktan") || low.includes("eğitim") || low.includes("öğretim")) return ["yapay zeka", "e-Kampüs", "Araştırmacı sayısı"];
    if (low.includes("horizon") || low.includes("erasmus")) return ["Uluslararası projeler", "BAP projeleri", "Toplam bütçe"];
    if (low.includes("yayın") || low.includes("indeks") || low.includes("sci") || low.includes("ssci") || low.includes("scopus") || low.includes("publikasyon")) return ["Yayın indeks dağılımı", "Proje türü dağılımı", "Verimlilik metrikleri"];
    if (low.includes("proje türü detay") || low.includes("proje türleri")) return ["BAP projeleri", "TÜBİTAK projeleri", "Yayın indeks dağılımı"];
    return ["Genel özet", "yapay zeka", "Yardım"];
  }, []);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    const userMsg = input.trim(); setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    if (topicMode) {
      setTopicMode(false);
      setTimeout(() => {
        const analysis = analyzeTopicProposal(userMsg);
        setMessages(prev => [...prev, { role: "bot", text: analysis, suggestions: ["Genel özet", "Başka konu öner", "Uygun araştırmacı öner", "Yardım"] }]);
      }, 400);
    } else if (researcherMode) {
      setResearcherMode(false);
      setTimeout(() => {
        const analysis = analyzeResearcherSuggestion(userMsg);
        setMessages(prev => [...prev, { role: "bot", text: analysis, suggestions: ["Genel özet", "Başka araştırmacı ara", "Yeni konu öner", "Yardım"] }]);
      }, 400);
    } else {
      setTimeout(() => { const response = processQuery(userMsg); const suggs = getSuggestions(userMsg); setMessages(prev => [...prev, { role: "bot", text: response, suggestions: suggs }]); }, 300);
    }
  }, [input, processQuery, topicMode, researcherMode, analyzeTopicProposal, analyzeResearcherSuggestion, getSuggestions]);

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [messages]);


  const searchThemes = useMemo(() => {
    const stopWords = new Set(["bir","ve","ile","için","de","da","den","dan","bu","olan","olarak","göre","gibi","daha","ile","arasında","sonra","ile","hem","veya","mi","mı","mu","mü","ne","nasıl","kaç","ki","ise","ya","veya","her","çok","en"]);
    const themeMap = {};

    // Konu başlıklarından anahtar kelimeler
    const keywords = [
      { pattern: /yapay\s*zeka|\bai\b|\byz\b|llm|büyük dil model|agentic ai|üretken yapay/i, label: "Yapay Zeka / AI" },
      { pattern: /\bxr\b|\bvr\b|\bar\b|sanal gerçeklik|artırılmış gerçeklik/i, label: "XR / VR / AR" },
      { pattern: /uzaktan\s*(eğitim|öğretim|öğren)|açık.*öğret|açıköğretim/i, label: "Uzaktan Eğitim" },
      { pattern: /e.kampüs|e-kampüs|lms|öğrenme analitik/i, label: "e-Kampüs / LMS" },
      { pattern: /mikro.yeterli|mikro.kredi/i, label: "Mikro-yeterlik" },
      { pattern: /oyunlaştır|gamif/i, label: "Oyunlaştırma" },
      { pattern: /stem/i, label: "STEM" },
      { pattern: /öğretim tasarım/i, label: "Öğretim Tasarımı" },
      { pattern: /veri\s*(analiz|görsel)|data/i, label: "Veri Analizi" },
      { pattern: /destek\s*(hizmet|sistem)|dropout|uyarı sistemi/i, label: "Öğrenci Destek" },
      { pattern: /erasmus|horizon|avrupa birliği|\bab\b|jean monnet/i, label: "AB / Uluslararası" },
      { pattern: /infografik|video|podcast|medya/i, label: "Medya / İçerik" },
      { pattern: /kalite|akreditasyon/i, label: "Kalite" },
      { pattern: /tercih|rehberlik|kayıt/i, label: "Öğrenci Rehberlik" },
    ];

    // Tüm konu ve proje başlıklarını tara
    const allTexts = [
      ...topics.map(t => [t.title, t.description, ...(t.tags || [])].filter(Boolean).join(" ")),
      ...projects.map(p => [p.title, p.description, ...(p.tags || [])].filter(Boolean).join(" ")),
    ];
    keywords.forEach(kw => {
      const count = allTexts.filter(text => kw.pattern.test(text)).length;
      if (count > 0) themeMap[kw.label] = (themeMap[kw.label] || 0) + count;
    });

    // Araştırma alanlarından en popüler olanlar
    const areaCounts = {};
    researchers.forEach(r => (r.researchAreas || []).forEach(a => { areaCounts[a] = (areaCounts[a] || 0) + 1; }));
    const topAreas = Object.entries(areaCounts).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k]) => k);

    // Ülkelerden
    const countryCounts = {};
    projects.forEach(p => (p.partnerCountries || []).forEach(c => { countryCounts[c] = (countryCounts[c] || 0) + 1; }));
    const topCountries = Object.entries(countryCounts).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k]) => k);

    // Tema butonlarını sırala (en çok eşleşen önce)
    const sortedThemes = Object.entries(themeMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k]) => k);

    return { themes: sortedThemes, areas: topAreas, countries: topCountries };
  }, [researchers, topics, projects]);

  const chatCategories = useMemo(() => {
    const cats = [
      { label: "Özet", emoji: "📊", subs: ["Genel özet", "Durum dağılımı", "Konu-proje karşılaştırması"] },
      { label: "Araştırmacılar", emoji: "👥", subs: ["Araştırmacı sayısı", "Unvan dağılımı", "AÖF üyeleri", "Kurum dağılımı"] },
      { label: "Konular", emoji: "📖", subs: ["Kaç konu var?", "Aktif konular", "En çok konusu olan"] },
      { label: "Projeler", emoji: "📁", subs: ["Proje türü dağılımı", "BAP projeleri", "TÜBİTAK projeleri", "Uluslararası projeler", "Toplam bütçe"] },
      { label: "Performans", emoji: "📈", subs: ["Verimlilik metrikleri", "Görev özeti", "Rol dağılımı", "PI deneyimi olanlar"] },
      { label: "Yayın İndeksleri", emoji: "📄", subs: ["Yayın indeks dağılımı", "SCI yayınları", "SSCI yayınları", "Scopus yayınları"] },
      { label: "Proje Türleri", emoji: "🗂️", subs: ["Proje türü dağılımı", "Proje türü detayları", "BAP projeleri", "TÜBİTAK projeleri"] },
    ];
    if (searchThemes.themes.length > 0) cats.push({ label: "Temalar", emoji: "🏷️", subs: searchThemes.themes.slice(0, 4) });
    if (searchThemes.areas.length > 0) cats.push({ label: "Araştırma Alanları", emoji: "🔬", subs: searchThemes.areas.slice(0, 4) });
    if (searchThemes.countries.length > 0) cats.push({ label: "Ülkeler", emoji: "🌍", subs: searchThemes.countries.slice(0, 4) });
    return cats;
  }, [searchThemes]);

  const catGradients = [
    "from-indigo-600 to-violet-500",
    "from-violet-500 to-purple-500",
    "from-purple-500 to-indigo-500",
    "from-indigo-500 to-blue-500",
    "from-blue-500 to-indigo-400",
    "from-violet-500 to-blue-500",
    "from-purple-500 to-violet-400",
    "from-indigo-500 to-violet-400",
  ];
  const catSubColors = [
    "from-indigo-50 to-violet-50 text-indigo-600 border-indigo-200 hover:from-indigo-100 hover:to-violet-100",
    "from-violet-50 to-purple-50 text-violet-600 border-violet-200 hover:from-violet-100 hover:to-purple-100",
    "from-purple-50 to-indigo-50 text-purple-600 border-purple-200 hover:from-purple-100 hover:to-indigo-100",
    "from-indigo-50 to-blue-50 text-indigo-600 border-indigo-200 hover:from-indigo-100 hover:to-blue-100",
    "from-blue-50 to-indigo-50 text-blue-600 border-blue-200 hover:from-blue-100 hover:to-indigo-100",
    "from-violet-50 to-blue-50 text-violet-600 border-violet-200 hover:from-violet-100 hover:to-blue-100",
    "from-purple-50 to-violet-50 text-purple-600 border-purple-200 hover:from-purple-100 hover:to-violet-100",
    "from-indigo-50 to-violet-50 text-indigo-600 border-indigo-200 hover:from-indigo-100 hover:to-violet-100",
  ];

  const handleCatClick = useCallback((text) => {
    setMessages(prev => [...prev, { role: "user", text }]);
    setTimeout(() => { const r = processQuery(text); const sg = getSuggestions(text); setMessages(prev => [...prev, { role: "bot", text: r, suggestions: sg }]); }, 300);
  }, [processQuery, getSuggestions]);

  if (!open) return (
    <div className="fixed bottom-5 right-5 z-40 flex items-end gap-3">
      <div onClick={() => setOpen(true)} className="relative bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 rounded-2xl shadow-lg shadow-indigo-100/50 border border-indigo-200/60 px-4 py-3 max-w-[220px] cursor-pointer hover:shadow-xl hover:border-indigo-300 transition-all" style={{animation:"fadeIn 0.6s ease-out"}}>
        <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
        <p className="text-xs text-indigo-700 font-medium leading-relaxed">Merhaba, ben Ar-Ge Asistanı! Nasıl yardımcı olabilirim?</p>
        <div className="absolute bottom-3 -right-2 w-3 h-3 bg-violet-50 border-r border-b border-indigo-200 rotate-[-45deg]" />
      </div>
      <button onClick={() => setOpen(true)} className="w-14 h-14 bg-gradient-to-br from-violet-600 via-purple-500 to-indigo-500 text-white rounded-full shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:shadow-indigo-300/50 hover:scale-105 transition-all flex items-center justify-center flex-shrink-0" title="Ar-Ge Asistanı">
        <Bot size={24} /><span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
      </button>
    </div>
  );

  return (
    <div className={chatMaximized ? "fixed inset-4 z-40 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden" : "fixed bottom-5 right-5 z-40 w-[340px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"} style={chatMaximized ? {} : {height:"min(580px, calc(100vh - 40px))"}}>
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-3.5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className={`bg-white/20 rounded-xl flex items-center justify-center ${chatMaximized ? "w-11 h-11" : "w-9 h-9"}`}><Bot size={chatMaximized ? 24 : 20} className="text-white" /></div>
          <div><h3 className={`font-bold text-white ${chatMaximized ? "text-base" : "text-sm"}`}>Ar-Ge Asistanı</h3><p className={`text-white/70 ${chatMaximized ? "text-xs" : "text-[10px]"}`}>Akıllı veri sorgu asistanı</p></div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 1 && <button onClick={() => setMessages([{ role: "bot", text: "Merhaba! Ben Ar-Ge Asistanı. Aşağıdaki kategorilerden birini seçerek başlayabilirsiniz.", isWelcome: true }])} className="p-1.5 rounded-lg hover:bg-white/20 text-white/60 hover:text-white transition-colors" title="Görüşmeyi temizle"><Trash2 size={14} /></button>}
          <button onClick={() => setChatMaximized(!chatMaximized)} className="p-1.5 rounded-lg hover:bg-white/20 text-white/60 hover:text-white transition-colors" title={chatMaximized ? "Küçült" : "Tam Ekran"}>{chatMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}</button>
          <button onClick={() => { setOpen(false); setChatMaximized(false); }} className="p-1.5 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors"><X size={16} /></button>
        </div>
      </div>
      <div ref={chatRef} className={`flex-1 overflow-y-auto space-y-3 ${chatMaximized ? "p-5" : "p-3"}`}>
        {messages.map((m, i) => (
          <div key={i}>
            <div className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`${chatMaximized ? "max-w-[70%]" : "max-w-[85%]"} rounded-2xl ${chatMaximized ? "px-5 py-3.5" : "px-3.5 py-2.5"} ${m.role === "user" ? "bg-indigo-500 text-white rounded-br-md" : "bg-slate-100 text-slate-700 rounded-bl-md"}`}>
                <p className={`leading-relaxed whitespace-pre-line ${chatMaximized ? "text-sm" : "text-xs"}`}>{m.text}</p>
              </div>
            </div>
            {m.isWelcome && i === messages.length - 1 && (
              <div className="mt-3 space-y-2 bg-gradient-to-b from-slate-50/50 to-white rounded-xl p-2 -mx-1">
                <div>
                  <button onClick={() => { setTopicMode(true); setMessages(prev => [...prev, { role: "bot", text: "🆕 Yeni bir araştırma konusu mu düşünüyorsunuz? Harika!\n\nLütfen çalışmak istediğiniz konuyu veya anahtar kelimeleri yazın.\n\nÖrneğin: \"yapay zeka ve uzaktan eğitim\", \"XR tabanlı öğretim\", \"öğrenme analitikleri\" gibi..." }]); }}
                    className={`w-full text-left font-semibold bg-gradient-to-r from-violet-600 to-indigo-500 text-white rounded-xl hover:from-violet-700 hover:to-indigo-600 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:shadow-indigo-300/50 hover:scale-[1.02] ${chatMaximized ? "px-4 py-3.5 text-sm" : "px-3 py-2.5 text-[11px]"}`}>
                    <span>🆕</span> Yeni Araştırma Konusu Öner
                  </button>
                  <div className="flex flex-wrap gap-1 mt-1 ml-2">
                    {["Yapay Zeka & Eğitim", "XR / AR", "Öğrenme Analitikleri"].map((sub, si) => (
                      <button key={si} onClick={() => { setTopicMode(true); setMessages(prev => [...prev, { role: "bot", text: `🆕 "${sub}" alanında yeni bir konu mu düşünüyorsunuz? Harika!\n\nBu alandaki spesifik araştırma fikrinizi veya anahtar kelimeleri yazın...` }]); }}
                        className={`bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-600 border-violet-200 hover:from-violet-100 hover:to-indigo-100 rounded-full transition-all border hover:shadow-sm ${chatMaximized ? "px-3 py-1 text-xs" : "px-2 py-0.5 text-[9px]"}`}>{sub}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <button onClick={() => { setResearcherMode(true); setMessages(prev => [...prev, { role: "bot", text: "👤 Belirli bir alan veya konu için uygun araştırmacı mı arıyorsunuz?\n\nLütfen araştırma alanı, konu veya anahtar kelimeleri yazın.\n\nÖrneğin: \"yapay zeka\", \"uzaktan eğitim\", \"veri analitiği\" gibi..." }]); }}
                    className={`w-full text-left font-semibold bg-gradient-to-r from-violet-600 to-indigo-500 text-white rounded-xl hover:from-violet-700 hover:to-indigo-600 transition-all flex items-center gap-2 shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:shadow-indigo-300/50 hover:scale-[1.02] ${chatMaximized ? "px-4 py-3.5 text-sm" : "px-3 py-2.5 text-[11px]"}`}>
                    <span>👤</span> Uygun Araştırmacı Öner
                  </button>
                  <div className="flex flex-wrap gap-1 mt-1 ml-2">
                    {["Proje Yürütücüsü", "Veri Analisti", "Alan Uzmanı"].map((sub, si) => (
                      <button key={si} onClick={() => { setResearcherMode(true); setMessages(prev => [...prev, { role: "bot", text: `👤 "${sub}" rolüne uygun araştırmacı mı arıyorsunuz?\n\nBu role uygun spesifik alan veya anahtar kelimeleri yazın...` }]); }}
                        className={`bg-gradient-to-r from-violet-50 to-indigo-50 text-violet-600 border-violet-200 hover:from-violet-100 hover:to-indigo-100 rounded-full transition-all border hover:shadow-sm ${chatMaximized ? "px-3 py-1 text-xs" : "px-2 py-0.5 text-[9px]"}`}>{sub}</button>
                    ))}
                  </div>
                </div>
                {chatCategories.map((cat, ci) => (
                  <div key={ci}>
                    <button onClick={() => cat.subs.length > 0 && handleCatClick(cat.subs[0])}
                      className={`w-full text-left font-semibold bg-gradient-to-r ${catGradients[ci % catGradients.length]} text-white rounded-xl hover:brightness-110 transition-all flex items-center gap-2 shadow-md shadow-indigo-100/40 hover:shadow-lg hover:scale-[1.01] ${chatMaximized ? "px-4 py-3 text-sm" : "px-3 py-2 text-[11px]"}`}>
                      <span>{cat.emoji}</span> {cat.label} <span className="ml-auto text-[9px] text-white/60">{cat.subs.length}</span>
                    </button>
                    <div className="flex flex-wrap gap-1 mt-1 ml-2">
                      {cat.subs.map((sub, si) => (
                        <button key={si} onClick={() => handleCatClick(sub)}
                          className={`bg-gradient-to-r ${catSubColors[ci % catSubColors.length]} rounded-full transition-all border hover:shadow-sm ${chatMaximized ? "px-3 py-1 text-xs" : "px-2 py-0.5 text-[9px]"}`}>{sub}</button>
                      ))}
                    </div>
                  </div>
                ))}              </div>
            )}
            {m.role === "bot" && !m.isWelcome && m.suggestions && i === messages.length - 1 && (
              <div className="flex flex-wrap gap-1.5 mt-2 ml-1">
                {m.suggestions.map((s, si) => (
                  <button key={si} onClick={() => { if (s === "Başka konu öner" || s === "Yeni konu öner") { setTopicMode(true); setMessages(prev => [...prev, { role: "user", text: s }, { role: "bot", text: "Başka bir konu için anahtar kelimeleri yazın..." }]); } else if (s === "Başka araştırmacı ara" || s === "Uygun araştırmacı öner") { setResearcherMode(true); setMessages(prev => [...prev, { role: "user", text: s }, { role: "bot", text: "Araştırmacı aramak için anahtar kelimeleri yazın..." }]); } else { setMessages(prev => [...prev, { role: "user", text: s }]); setTimeout(() => { const r = processQuery(s); const sg = getSuggestions(s); setMessages(prev => [...prev, { role: "bot", text: r, suggestions: sg }]); }, 300); } }}
                    className={`bg-gradient-to-r from-violet-50 to-indigo-50 text-indigo-600 rounded-full hover:from-violet-100 hover:to-indigo-100 transition-all border border-indigo-200/60 cursor-pointer hover:shadow-sm ${chatMaximized ? "px-3.5 py-1.5 text-xs" : "px-2.5 py-1 text-[10px]"}`}>{s}</button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={`border-t border-slate-100 flex-shrink-0 ${chatMaximized ? "p-4" : "p-3"}`}>
        <div className="flex items-center gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
            placeholder={topicMode ? "Konu veya anahtar kelime yazın..." : researcherMode ? "Araştırma alanı veya konu yazın..." : "Bir soru sorun..."} className={`flex-1 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 outline-none transition-all ${chatMaximized ? "text-base px-4 py-3" : "text-sm px-3.5 py-2.5"}`} />
          <button onClick={handleSend} className={`bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors flex-shrink-0 disabled:opacity-40 ${chatMaximized ? "p-3" : "p-2.5"}`} disabled={!input.trim()}><Send size={chatMaximized ? 20 : 16} /></button>
        </div>
      </div>
    </div>
  );
};

// ─── NotepadPanel Component ───────────────────────────────────────────────
function NotepadPanel({ notes, onNotesChange, topics, projects, canEdit, onClose, isMaster, isAdmin, isEditor }) {
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [search, setSearch] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newLinks, setNewLinks] = useState([]);
  const [newTopicLinks, setNewTopicLinks] = useState([]);
  const [newProjectLinks, setNewProjectLinks] = useState([]);
  const [newUrlTitle, setNewUrlTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  const selectedNote = selectedNoteId ? notes.find(n => n.id === selectedNoteId) : null;

  const createNote = () => {
    if (!canEdit) return;
    const newNote = {
      id: Date.now().toString(),
      title: "Yeni Not",
      content: "",
      links: [],
      topicLinks: [],
      projectLinks: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    onNotesChange([...notes, newNote]);
    setSelectedNoteId(newNote.id);
    setNewTitle(newNote.title);
    setNewContent("");
    setNewLinks([]);
    setNewTopicLinks([]);
    setNewProjectLinks([]);
  };

  const updateNote = () => {
    if (!canEdit || !selectedNote) return;
    const updated = notes.map(n => n.id === selectedNote.id ? {
      ...n,
      title: newTitle || "Başlıksız Not",
      content: newContent,
      links: newLinks,
      topicLinks: newTopicLinks,
      projectLinks: newProjectLinks,
      updatedAt: Date.now()
    } : n);
    onNotesChange(updated);
  };

  const deleteNote = () => {
    if (!canEdit || !selectedNote) return;
    if (!confirm("Bu notu silmek istediğinize emin misiniz?")) return;
    onNotesChange(notes.filter(n => n.id !== selectedNote.id));
    setSelectedNoteId(null);
    setNewTitle("");
    setNewContent("");
    setNewLinks([]);
    setNewTopicLinks([]);
    setNewProjectLinks([]);
  };

  const addLink = () => {
    if (newUrl.trim()) {
      setNewLinks([...newLinks, { title: newUrlTitle || "Bağlantı", url: newUrl }]);
      setNewUrlTitle("");
      setNewUrl("");
    }
  };

  const toggleTopicLink = (topicId) => {
    setNewTopicLinks(prev => prev.includes(topicId) ? prev.filter(id => id !== topicId) : [...prev, topicId]);
  };

  const toggleProjectLink = (projectId) => {
    setNewProjectLinks(prev => prev.includes(projectId) ? prev.filter(id => id !== projectId) : [...prev, projectId]);
  };

  useEffect(() => {
    if (selectedNote) {
      setNewTitle(selectedNote.title);
      setNewContent(selectedNote.content);
      setNewLinks(selectedNote.links || []);
      setNewTopicLinks(selectedNote.topicLinks || []);
      setNewProjectLinks(selectedNote.projectLinks || []);
    }
  }, [selectedNote]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
        isFullscreen ? "w-full h-full max-w-full max-h-full rounded-none" : "w-full max-w-5xl max-h-[90vh]"
      }`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <StickyNote size={22} className="text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-800">Notlar</h2>
            {notes.length > 0 && <span className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full font-medium">{notes.length} not</span>}
            {!canEdit && <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-medium border border-amber-200">Salt okunur</span>}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 hover:bg-slate-200 rounded-lg transition-colors" title={isFullscreen ? "Küçült" : "Tam Ekran"}>
              {isFullscreen ? <Minimize2 size={16} className="text-slate-500" /> : <Maximize2 size={16} className="text-slate-500" />}
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
              <X size={18} className="text-slate-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* Left: Notes List */}
          <div className="w-72 border-r border-slate-200 flex flex-col bg-slate-50/50 overflow-hidden flex-shrink-0">
            <div className="p-3 border-b border-slate-200 space-y-2 flex-shrink-0">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Notlarda ara..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
              {canEdit && (
                <button
                  onClick={createNote}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-indigo-500 text-white text-xs font-medium rounded-lg hover:bg-indigo-600 transition-colors shadow-sm"
                >
                  <Plus size={14} /> Yeni Not Oluştur
                </button>
              )}
            </div>
            <div className="flex-1 overflow-y-auto space-y-1 p-2">
              {filteredNotes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                  <StickyNote size={32} className="text-slate-300 mb-3" />
                  <p className="text-xs text-slate-400 font-medium">{search ? "Sonuç bulunamadı" : "Henüz not yok"}</p>
                  {!search && !canEdit && <p className="text-[10px] text-amber-500 mt-2">Not oluşturmak için Editör veya üstü yetki gerekir</p>}
                  {!search && canEdit && <p className="text-[10px] text-slate-400 mt-1">Yukarıdaki butona tıklayarak ilk notunuzu oluşturun</p>}
                </div>
              ) : (
                filteredNotes.sort((a, b) => b.updatedAt - a.updatedAt).map(note => (
                  <button
                    key={note.id}
                    onClick={() => setSelectedNoteId(note.id)}
                    className={`w-full text-left p-3 rounded-lg transition-all text-xs ${
                      selectedNoteId === note.id
                        ? "bg-indigo-100 border border-indigo-300 shadow-sm"
                        : "hover:bg-slate-100 border border-transparent"
                    }`}
                  >
                    <p className="font-semibold text-slate-800 truncate">{note.title}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{note.content || "İçerik yok"}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] text-slate-400">{new Date(note.updatedAt).toLocaleDateString("tr-TR")}</span>
                      {(note.topicLinks || []).length > 0 && <span className="text-[10px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded">{(note.topicLinks || []).length} konu</span>}
                      {(note.links || []).length > 0 && <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">{(note.links || []).length} link</span>}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right: Note Editor */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedNote ? (
              <div className="flex-1 flex flex-col overflow-y-auto p-6 space-y-4">
                {/* Title */}
                <div>
                  <input
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    onBlur={updateNote}
                    disabled={!canEdit}
                    placeholder="Not başlığı..."
                    className="w-full px-0 py-2 border-0 border-b-2 border-slate-200 bg-transparent focus:outline-none focus:border-indigo-400 disabled:text-slate-500 text-xl font-bold text-slate-800 placeholder-slate-300"
                  />
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                    <span>Oluşturulma: {new Date(selectedNote.createdAt).toLocaleString("tr-TR")}</span>
                    <span>·</span>
                    <span>Son güncelleme: {new Date(selectedNote.updatedAt).toLocaleString("tr-TR")}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col min-h-[200px]">
                  <textarea
                    value={newContent}
                    onChange={e => setNewContent(e.target.value)}
                    onBlur={updateNote}
                    disabled={!canEdit}
                    placeholder="Not içeriği yazın..."
                    className="flex-1 px-0 py-2 border-0 bg-transparent focus:outline-none disabled:text-slate-400 text-sm text-slate-700 resize-none leading-relaxed placeholder-slate-300"
                  />
                </div>

                {/* Related Topics & Projects */}
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <div>
                    <p className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5"><BookOpen size={13} /> İlgili Konular</p>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                      {topics.map(topic => (
                        <button
                          key={topic.id}
                          onClick={() => { toggleTopicLink(topic.id); setTimeout(updateNote, 50); }}
                          disabled={!canEdit}
                          className={`text-[11px] px-2.5 py-1 rounded-full transition-all border ${
                            newTopicLinks.includes(topic.id)
                              ? "bg-indigo-500 text-white border-indigo-500 shadow-sm"
                              : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
                          } disabled:opacity-50 disabled:cursor-default`}
                        >
                          {topic.title}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5"><FolderKanban size={13} /> İlgili Projeler</p>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                      {projects.map(project => (
                        <button
                          key={project.id}
                          onClick={() => { toggleProjectLink(project.id); setTimeout(updateNote, 50); }}
                          disabled={!canEdit}
                          className={`text-[11px] px-2.5 py-1 rounded-full transition-all border ${
                            newProjectLinks.includes(project.id)
                              ? "bg-violet-500 text-white border-violet-500 shadow-sm"
                              : "bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:text-violet-600"
                          } disabled:opacity-50 disabled:cursor-default`}
                        >
                          {project.title || project.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* URLs */}
                <div className="border-t border-slate-100 pt-4 space-y-2">
                  <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><Globe size={13} /> Bağlantılar</p>
                  <div className="space-y-1.5">
                    {newLinks.map((link, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg group border border-slate-100 hover:border-slate-200 transition-colors">
                        <ExternalLink size={12} className="text-indigo-400 flex-shrink-0" />
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-0 hover:underline">
                          <p className="text-xs font-medium text-indigo-600 truncate">{link.title}</p>
                          <p className="text-[10px] text-slate-400 truncate">{link.url}</p>
                        </a>
                        {canEdit && (
                          <button
                            onClick={() => { const nl = newLinks.filter((_, i) => i !== idx); setNewLinks(nl); setTimeout(updateNote, 50); }}
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition-all"
                          >
                            <X size={12} className="text-red-500" />
                          </button>
                        )}
                      </div>
                    ))}
                    {canEdit && (
                      <div className="flex gap-1.5 mt-2">
                        <input
                          value={newUrlTitle}
                          onChange={e => setNewUrlTitle(e.target.value)}
                          placeholder="Başlık"
                          className="w-1/3 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-300 bg-white"
                        />
                        <input
                          value={newUrl}
                          onChange={e => setNewUrl(e.target.value)}
                          placeholder="https://..."
                          onKeyDown={e => { if (e.key === "Enter") addLink(); }}
                          className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-300 bg-white"
                        />
                        <button
                          onClick={addLink}
                          className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors flex items-center gap-1 text-xs font-medium"
                        >
                          <Plus size={14} /> Ekle
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {canEdit && (
                  <div className="flex gap-2 pt-3 border-t border-slate-200">
                    <button
                      onClick={deleteNote}
                      className="px-4 py-2 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
                    >
                      <Trash2 size={14} /> Notu Sil
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
                <StickyNote size={48} className="text-slate-200 mb-4" />
                <p className="text-sm font-medium text-slate-500">Not seçin veya yeni bir not oluşturun</p>
                {!canEdit && <p className="text-xs text-amber-500 mt-2">Düzenleme için Editör veya üstü yetki gerekir</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── MAIN APP ─────────────────────────────────────────────
export default function ArGeDashboard({ role, user, onLogout }) {
  const isMaster = role === "master";
  const isAdmin = role === "admin" || isMaster;
  const isEditor = role === "editor";
  const canEdit = isAdmin || isEditor; // araştırmacı/konu/proje düzenleyebilir
  const [forceReloading, setForceReloading] = useState(false);
  const forcePublishRef = useRef(null);
  const tabId = useRef(Date.now() + "_" + Math.random().toString(36).slice(2));

  // ─── Presence (Google Docs tarzı canlı gösterge) ───
  // Renk paleti — her kullanıcıya benzersiz renk
  const PRESENCE_COLORS = useMemo(() => [
    { bg: "bg-blue-500", ring: "ring-blue-400", text: "text-blue-600", light: "bg-blue-50", border: "border-blue-400" },
    { bg: "bg-emerald-500", ring: "ring-emerald-400", text: "text-emerald-600", light: "bg-emerald-50", border: "border-emerald-400" },
    { bg: "bg-orange-500", ring: "ring-orange-400", text: "text-orange-600", light: "bg-orange-50", border: "border-orange-400" },
    { bg: "bg-pink-500", ring: "ring-pink-400", text: "text-pink-600", light: "bg-pink-50", border: "border-pink-400" },
    { bg: "bg-cyan-500", ring: "ring-cyan-400", text: "text-cyan-600", light: "bg-cyan-50", border: "border-cyan-400" },
    { bg: "bg-amber-500", ring: "ring-amber-400", text: "text-amber-600", light: "bg-amber-50", border: "border-amber-400" },
  ], []);
  const [onlineUsers, setOnlineUsers] = useState({}); // { tabId: { username, displayName, role, section, editingId, editingType, lastSeen, color } }
  const presenceRef = useRef(null); // zamanlayıcı temizleme
  const myPresence = useRef({ section: null, editingId: null, editingType: null });

  // Presence güncelle — Firestore'a yaz (merge: tüm kullanıcılar tek dokümanda)
  const updatePresence = useCallback((section, editingId, editingType) => {
    myPresence.current = { section, editingId, editingType };
    const entry = {};
    entry[tabId.current] = {
      username: user?.username || "unknown",
      displayName: user?.displayName || "Kullanıcı",
      role: role,
      section: section || null,
      editingId: editingId || null,
      editingType: editingType || null,
      lastSeen: Date.now(),
    };
    setDoc(doc(db, "arge", "_presence"), entry, { merge: true })
      .catch((err) => console.error("[PRESENCE] Güncelleme hatası:", err));
  }, [user, role]);

  // ─── Firestore senkronizasyon (JSON karşılaştırma tabanlı) ───
  // Notion gibi çoklu kullanıcı: herkes aynı anda giriş yapabilir.
  // onSnapshot ile tüm değişiklikler anlık yansır.
  // Roller sadece yetki belirler (kim düzenleyebilir, kim görebilir).
  const firestoreReady = useRef(false);
  const [firestoreStatus, setFirestoreStatus] = useState("connecting"); // "connecting" | "ready" | "error"
  const lastJson = useRef({}); // Her docId için son bilinen JSON — write-back loop engeller

  const writeToFirestore = useCallback((docId, data) => {
    if (!firestoreReady.current) {
      console.log("[SYNC] firestoreReady=false, yazma atlandı:", docId);
      return;
    }
    // Firestore'dan ilk veri yüklenmeden yazma yapma — boş state'in kaydedilmiş veriyi ezmesini engeller
    if (lastJson.current[docId] === undefined) {
      console.log("[SYNC] İlk yükleme tamamlanmadı, yazma atlandı:", docId);
      return;
    }
    const json = JSON.stringify(data);
    if (lastJson.current[docId] === json) return;
    lastJson.current[docId] = json;
    console.log("[SYNC] Firestore'a yazılıyor:", docId);
    setSaveIndicator("saving");
    withTimeout(setDoc(doc(db, "arge", docId), { items: data, updatedAt: Date.now() }), 8000, "setDoc:" + docId)
      .then(() => {
        console.log("[SYNC] Yazma başarılı:", docId);
        setLastSavedAt(new Date());
        setSaveIndicator("saved");
        setTimeout(() => setSaveIndicator("idle"), 2000);
      })
      .catch(err => {
        console.error("[SYNC] YAZMA HATASI:", docId, err.message);
        setSaveIndicator("idle");
        setToast({ type: "error", message: "Kayıt hatası: " + err.message });
      });
  }, []);

  const writeConfigToFirestore = useCallback((docId, data) => {
    if (!firestoreReady.current) {
      console.log("[SYNC] firestoreReady=false, config yazma atlandı:", docId);
      return;
    }
    const json = JSON.stringify(data);
    if (lastJson.current[docId] === json) return;
    lastJson.current[docId] = json;
    console.log("[SYNC] Config yazılıyor:", docId);
    setSaveIndicator("saving");
    withTimeout(setDoc(doc(db, "arge", docId), { data, updatedAt: Date.now() }), 8000, "setDoc:" + docId)
      .then(() => {
        console.log("[SYNC] Config yazma başarılı:", docId);
        setLastSavedAt(new Date());
        setSaveIndicator("saved");
        setTimeout(() => setSaveIndicator("idle"), 2000);
      })
      .catch(err => {
        console.error("[SYNC] CONFIG YAZMA HATASI:", docId, err.message);
        setSaveIndicator("idle");
      });
  }, []);

  // ─── Ana veri state'leri (başlangıçta default, Firestore'dan güncellenecek) ───
  const [researchers, setResearchers] = useState(initialResearchers);
  const [topics, setTopics] = useState(initialTopics);
  const [projects, setProjects] = useState(initialProjects);

  const [searchQuery, setSearchQuery] = useState("");
  const [topicStatusFilter, setTopicStatusFilter] = useState("");
  const [topicPriorityFilter, setTopicPriorityFilter] = useState("");
  const [projectStatusFilter, setProjectStatusFilter] = useState("");
  const [projectPriorityFilter, setProjectPriorityFilter] = useState("");
  const [researcherDeptFilter, setResearcherDeptFilter] = useState("");
  const [aofMemberFilter, setAofMemberFilter] = useState("");
  const [maximizedCol, setMaximizedCol] = useState(null); // "researchers" | "topics" | "projects" | null
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
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteSearch, setNoteSearch] = useState("");

  const [projectColDragOver, setProjectColDragOver] = useState(false);
  const [quickLinks, setQuickLinks] = useState(defaultQuickLinks);
  const [roleConfigSt, setRoleConfig] = useState(DEFAULT_ROLE_CONFIG);
  const [statusConfigSt, setStatusConfig] = useState(DEFAULT_STATUS_CONFIG);
  const [priorityConfigSt, setPriorityConfig] = useState(DEFAULT_PRIORITY_CONFIG);
  const [projectTypeOptionsSt, setProjectTypeOptions] = useState(DEFAULT_PROJECT_TYPES);
  const [categoryOptionsSt, setCategoryOptions] = useState(DEFAULT_CATEGORY_OPTIONS);
  const [eduDegreeOptionsSt, setEduDegreeOptions] = useState(DEFAULT_EDU_DEGREES);
  const [eduStatusOptionsSt, setEduStatusOptions] = useState(DEFAULT_EDU_STATUSES);
  const [indexTypesConfigSt, setIndexTypesConfig] = useState(DEFAULT_INDEX_TYPES);
  const [projectTypeCoeffSt, setProjectTypeCoeff] = useState(DEFAULT_PROJECT_TYPE_COEFF);
  const [showSettings, setShowSettings] = useState(false);
  const [syncStatus, setSyncStatus] = useState("idle"); // "idle" | "syncing" | "done"
  const [lastSavedAt, setLastSavedAt] = useState(null); // Son kayıt zamanı
  const [saveIndicator, setSaveIndicator] = useState("idle"); // "idle" | "saving" | "saved"
  const [lastBackupAt, setLastBackupAt] = useState(null); // Son yedekleme zamanı
  const [backupWarningDismissed, setBackupWarningDismissed] = useState(false);

  // ─── Yedekleme Sistemi ───
  // 1. Firestore'dan son yedekleme zamanını oku
  useEffect(() => {
    if (!isMaster) return;
    const unsub = onSnapshot(doc(db, "arge", "_backup_meta"), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        if (d.lastBackupAt) setLastBackupAt(new Date(d.lastBackupAt));
      }
    }, () => {});
    return () => unsub();
  }, [isMaster]);

  // 2. Firestore'a snapshot yedek yaz
  const saveBackupToFirestore = useCallback(async (triggerType) => {
    try {
      const backupData = {
        researchers, topics, projects, quickLinks: quickLinks,
        cfg_roles: roleConfigSt, cfg_statuses: statusConfigSt,
        cfg_priorities: priorityConfigSt, cfg_ptypes: projectTypeOptionsSt,
        cfg_categories: categoryOptionsSt, cfg_degrees: eduDegreeOptionsSt,
        cfg_edustatus: eduStatusOptionsSt,
        cfg_indexTypes: indexTypesConfigSt, cfg_projectTypeCoeff: projectTypeCoeffSt,
      };
      const now = Date.now();
      const dateStr = new Date(now).toISOString().slice(0, 10); // "2026-02-28"
      const backupId = "backup_" + dateStr + "_" + now;
      await withTimeout(setDoc(doc(db, "arge_backups", backupId), {
        data: backupData,
        createdAt: now,
        trigger: triggerType, // "manual" | "auto_publish" | "auto_daily"
        createdBy: user?.displayName || "Bilinmeyen",
      }), 15000, "backup:" + backupId);
      // Meta bilgi güncelle
      await setDoc(doc(db, "arge", "_backup_meta"), {
        lastBackupAt: now,
        lastBackupId: backupId,
        lastBackupBy: user?.displayName || "Bilinmeyen",
        trigger: triggerType,
      });
      setLastBackupAt(new Date(now));
      console.log("[BACKUP] ✅ Yedek kaydedildi:", backupId);
      return backupId;
    } catch (err) {
      console.error("[BACKUP] ❌ Yedekleme hatası:", err.message);
      throw err;
    }
  }, [researchers, topics, projects, quickLinks, roleConfigSt, statusConfigSt, priorityConfigSt, projectTypeOptionsSt, categoryOptionsSt, eduDegreeOptionsSt, eduStatusOptionsSt, user]);

  // 3. JSON dosyası olarak indir + Firestore'a da yedekle
  const downloadBackupJSON = useCallback(async () => {
    try {
      setToast({ type: "info", message: "Yedek hazırlanıyor..." });
      // Firestore'a da kaydet
      await saveBackupToFirestore("manual");
      // JSON dosyası oluştur ve indir
      const backupData = {
        _meta: {
          exportedAt: new Date().toISOString(),
          exportedBy: user?.displayName || "Bilinmeyen",
          version: "1.0",
          projectId: "arge-dashboard",
        },
        researchers, topics, projects, quickLinks: quickLinks,
        cfg_roles: roleConfigSt, cfg_statuses: statusConfigSt,
        cfg_priorities: priorityConfigSt, cfg_ptypes: projectTypeOptionsSt,
        cfg_categories: categoryOptionsSt, cfg_degrees: eduDegreeOptionsSt,
        cfg_edustatus: eduStatusOptionsSt,
      };
      const json = JSON.stringify(backupData, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "arge-backup-" + new Date().toISOString().slice(0, 10) + ".json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setToast({ type: "success", message: "✅ Yedek indirildi ve Firestore'a da kaydedildi!" });
    } catch (err) {
      setToast({ type: "error", message: "Yedekleme hatası: " + err.message });
    }
  }, [saveBackupToFirestore, researchers, topics, projects, quickLinks, roleConfigSt, statusConfigSt, priorityConfigSt, projectTypeOptionsSt, categoryOptionsSt, eduDegreeOptionsSt, eduStatusOptionsSt, indexTypesConfigSt, projectTypeCoeffSt, user]);

  // 4. JSON dosyasından geri yükle
  const restoreFromJSON = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.researchers) setResearchers(data.researchers);
        if (data.topics) setTopics(data.topics);
        if (data.projects) setProjects(data.projects);
        if (data.quickLinks) setQuickLinks(data.quickLinks);
        if (data.cfg_roles) setRoleConfig(data.cfg_roles);
        if (data.cfg_statuses) setStatusConfig(data.cfg_statuses);
        if (data.cfg_priorities) setPriorityConfig(data.cfg_priorities);
        if (data.cfg_ptypes) setProjectTypeOptions(data.cfg_ptypes);
        if (data.cfg_categories) setCategoryOptions(data.cfg_categories);
        if (data.cfg_degrees) setEduDegreeOptions(data.cfg_degrees);
        if (data.cfg_edustatus) setEduStatusOptions(data.cfg_edustatus);
        if (data.cfg_indexTypes) setIndexTypesConfig(data.cfg_indexTypes);
        if (data.cfg_projectTypeCoeff !== undefined) setProjectTypeCoeff(data.cfg_projectTypeCoeff);
        setToast({ type: "success", message: "✅ Veriler yedeğten geri yüklendi! Firestore'a kaydediliyor..." });
      } catch (err) {
        setToast({ type: "error", message: "Geçersiz yedek dosyası: " + err.message });
      }
    };
    reader.readAsText(file);
  }, []);

  // ─── Bağlantı Testi — Firestore'a yaz ve oku (timeout'lu) ───
  const testConnection = useCallback(async () => {
    const testId = "_conn_test";
    const testVal = Date.now();
    console.log("[TEST] Bağlantı testi başlıyor...");
    setToast({ type: "info", message: "Firestore bağlantı testi yapılıyor (8 saniye)..." });
    try {
      // 1. Yaz (8s timeout)
      await withTimeout(
        setDoc(doc(db, "arge", testId), { v: testVal, by: user?.displayName || "?" }),
        8000, "test yazma"
      );
      console.log("[TEST] Yazma OK:", testVal);
      // 2. Oku (8s timeout)
      const snap = await withTimeout(
        getDoc(doc(db, "arge", testId)),
        8000, "test okuma"
      );
      if (snap.exists() && snap.data().v === testVal) {
        console.log("[TEST] ✅ Okuma OK — Firestore bağlantısı ÇALIŞIYOR");
        setToast({ type: "success", message: "✅ Firestore bağlantısı çalışıyor!" });
        setFirestoreStatus("ready");
        firestoreReady.current = true;
      } else {
        console.error("[TEST] ❌ Okuma başarısız — yazılan değer okunamadı");
        setToast({ type: "error", message: "❌ Firestore okuma başarısız!" });
      }
    } catch (err) {
      console.error("[TEST] ❌ BAŞARISIZ:", err.message);
      setFirestoreStatus("error");
      if (err.message.includes("TIMEOUT")) {
        setToast({ type: "error", message: "❌ Firestore YANIT VERMİYOR! Güvenlik kurallarını kontrol edin. (Firebase Console → Firestore → Rules)" });
      } else {
        setToast({ type: "error", message: "❌ Firestore hatası: " + err.message });
      }
    }
  }, [user]);

  // ─── Manuel Senkronizasyon (Yayınla/Güncelle) ───
  const forceSync = useCallback(async () => {
    setSyncStatus("syncing");
    try {
      // Firestore SUNUCUSUNDAN taze veri çek (cache bypass!)
      const reads = [
        { id: "researchers", setter: setResearchers, isConfig: false },
        { id: "topics", setter: setTopics, isConfig: false },
        { id: "projects", setter: setProjects, isConfig: false },
        { id: "quicklinks", setter: setQuickLinks, isConfig: false },
      { id: "notes", setter: setNotes, isConfig: false },
        { id: "cfg_roles", setter: setRoleConfig, isConfig: true },
        { id: "cfg_statuses", setter: setStatusConfig, isConfig: true },
        { id: "cfg_priorities", setter: setPriorityConfig, isConfig: true },
        { id: "cfg_ptypes", setter: setProjectTypeOptions, isConfig: true },
        { id: "cfg_categories", setter: setCategoryOptions, isConfig: true },
        { id: "cfg_degrees", setter: setEduDegreeOptions, isConfig: true },
        { id: "cfg_edustatus", setter: setEduStatusOptions, isConfig: true },
      ];
      for (const { id, setter, isConfig } of reads) {
        const snap = await withTimeout(getDoc(doc(db, "arge", id)), 8000, "getDoc:" + id);
        if (snap.exists()) {
          const d = snap.data();
          const val = isConfig ? d.data : d.items;
          if (val !== undefined) {
            lastJson.current[id] = JSON.stringify(val);
            setter(val);
          }
        }
      }

      setSyncStatus("done");
      setToast({ type: "success", message: "Veriler senkronize edildi!" });
      setTimeout(() => setSyncStatus("idle"), 2000);
    } catch (err) {
      console.error("[SYNC] Senkronizasyon hatası:", err.message);
      setSyncStatus("idle");
      if (err.message.includes("TIMEOUT")) {
        setToast({ type: "error", message: "❌ Firestore yanıt vermiyor! Güvenlik kurallarını kontrol edin." });
      } else {
        setToast({ type: "error", message: "Senkronizasyon hatası: " + err.message });
      }
    }
  }, []);

  // ─── Zorunlu Yayınla — tüm client'lara bildirim gönder ───
  const forcePublish = useCallback(async () => {
    setSyncStatus("syncing");
    try {
      // 1. Tüm verileri Firestore'a yaz (timeout'lu)
      await withTimeout(Promise.all([
        setDoc(doc(db, "arge", "researchers"), { items: researchers, updatedAt: Date.now() }),
        setDoc(doc(db, "arge", "topics"), { items: topics, updatedAt: Date.now() }),
        setDoc(doc(db, "arge", "projects"), { items: projects, updatedAt: Date.now() }),
        setDoc(doc(db, "arge", "quicklinks"), { items: quickLinks, updatedAt: Date.now() }),
        setDoc(doc(db, "arge", "notes"), { items: notes, updatedAt: Date.now() }),
        setDoc(doc(db, "arge", "cfg_roles"), { data: roleConfigSt, updatedAt: Date.now() }),
        setDoc(doc(db, "arge", "cfg_statuses"), { data: statusConfigSt, updatedAt: Date.now() }),
        setDoc(doc(db, "arge", "cfg_priorities"), { data: priorityConfigSt, updatedAt: Date.now() }),
        setDoc(doc(db, "arge", "cfg_ptypes"), { data: projectTypeOptionsSt, updatedAt: Date.now() }),
        setDoc(doc(db, "arge", "cfg_categories"), { data: categoryOptionsSt, updatedAt: Date.now() }),
        setDoc(doc(db, "arge", "cfg_degrees"), { data: eduDegreeOptionsSt, updatedAt: Date.now() }),
        setDoc(doc(db, "arge", "cfg_edustatus"), { data: eduStatusOptionsSt, updatedAt: Date.now() }),
      ]), 15000, "forcePublish");
      // 2. Force reload sinyali gönder
      await withTimeout(setDoc(doc(db, "arge", "_force_reload"), {
        tabId: tabId.current,
        user: user?.displayName || "Admin",
        timestamp: Date.now()
      }), 8000, "forceReload");
      setSyncStatus("done");
      setLastSavedAt(new Date());
      // Toast kaldırıldı — kullanıcıya bildirim gösterilmez, işlem sessizce tamamlanır
      setTimeout(() => setSyncStatus("idle"), 3000);
      // 3. Otomatik yedek al (arka planda, hata görmezden gelinir)
      saveBackupToFirestore("auto_publish").catch(() => {});
    } catch (err) {
      setSyncStatus("idle");
      setToast({ type: "error", message: "Yayınlama hatası: " + err.message });
    }
  }, [researchers, topics, projects, quickLinks, roleConfigSt, statusConfigSt, priorityConfigSt, projectTypeOptionsSt, categoryOptionsSt, eduDegreeOptionsSt, eduStatusOptionsSt, user, saveBackupToFirestore]);
  forcePublishRef.current = forcePublish;

  // Otomatik senkronizasyon — her 10 saniyede Firestore SUNUCUSUNDAN güncelle
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!firestoreReady.current) {
        console.log("[AUTO-SYNC] firestoreReady=false, atlanıyor");
        return;
      }
      try {
        const reads = [
          { id: "researchers", setter: setResearchers, isConfig: false },
          { id: "topics", setter: setTopics, isConfig: false },
          { id: "projects", setter: setProjects, isConfig: false },
          { id: "quicklinks", setter: setQuickLinks, isConfig: false },
          { id: "notes", setter: setNotes, isConfig: false },
          { id: "cfg_roles", setter: setRoleConfig, isConfig: true },
          { id: "cfg_statuses", setter: setStatusConfig, isConfig: true },
          { id: "cfg_priorities", setter: setPriorityConfig, isConfig: true },
          { id: "cfg_ptypes", setter: setProjectTypeOptions, isConfig: true },
          { id: "cfg_categories", setter: setCategoryOptions, isConfig: true },
          { id: "cfg_degrees", setter: setEduDegreeOptions, isConfig: true },
          { id: "cfg_edustatus", setter: setEduStatusOptions, isConfig: true },
        ];
        let updatedCount = 0;
        for (const { id, setter, isConfig } of reads) {
          const snap = await withTimeout(getDoc(doc(db, "arge", id)), 8000, "autoSync:" + id);
          if (snap.exists()) {
            const d = snap.data();
            const val = isConfig ? d.data : d.items;
            if (val !== undefined) {
              const json = JSON.stringify(val);
              if (lastJson.current[id] !== json) {
                lastJson.current[id] = json;
                updatedCount++;
                setter(val);
              }
            }
          }
        }
        if (updatedCount > 0) console.log("[AUTO-SYNC] " + updatedCount + " doküman güncellendi");
      } catch (err) { console.error("[AUTO-SYNC] HATA:", err); }
    }, 5000); // 5 saniyede bir otomatik güncelle
    return () => clearInterval(interval);
  }, []);

  // ─── 5 Dakikada Bir Otomatik Kaydet ───
  useEffect(() => {
    const autoSaveInterval = setInterval(async () => {
      if (!firestoreReady.current) return;
      try {
        if (forcePublishRef.current) {
          setSaveIndicator("saving");
          await forcePublishRef.current();
          setLastSavedAt(new Date());
          setSaveIndicator("saved");
          setTimeout(() => setSaveIndicator("idle"), 2000);
        }
      } catch (e) { console.warn("Auto-save error:", e); }
    }, 5 * 60 * 1000); // 5 dakika
    return () => clearInterval(autoSaveInterval);
  }, []);

  // ─── Firestore'dan gerçek zamanlı okuma (onSnapshot) ───
  useEffect(() => {
    const unsubs = [];
    const readyDocs = new Set();

    const markReady = (docId) => {
      if (!readyDocs.has(docId)) {
        readyDocs.add(docId);
        console.log("[SYNC] Doc hazır:", docId, "(" + readyDocs.size + "/14)");
        if (readyDocs.size >= 14) {
          firestoreReady.current = true;
          setFirestoreStatus("ready");
          console.log("[SYNC] ✅ Firestore HAZIR — tüm dokümanlar yüklendi");
          // NOT: Initial push KALDIRILDI!
          // Closure problemi: useEffect mount anındaki boş state'i yakalar,
          // Firestore'dan yüklenen gerçek veriyi DEĞİL → projeler siliniyordu.
          // onSnapshot zaten doküman yoksa varsayılan değerleri yazıyor (listen fonksiyonu).
          // Doküman varsa state otomatik güncelleniyor. Ek push'a gerek yok.
        }
      }
    };

    const listen = (docId, setter, fallback, isConfig) => {
      const unsub = onSnapshot(doc(db, "arge", docId), (snap) => {
        if (snap.exists()) {
          const d = snap.data();
          const val = isConfig ? d.data : d.items;
          if (val !== undefined) {
            const json = JSON.stringify(val);
            if (lastJson.current[docId] !== json) {
              lastJson.current[docId] = json;
              setter(val);
              console.log("[SYNC] onSnapshot güncelleme:", docId);
            }
          }
        } else {
          console.log("[SYNC] Doküman yok, varsayılan yazılıyor:", docId);
          const payload = isConfig
            ? { data: fallback, updatedAt: Date.now() }
            : { items: fallback, updatedAt: Date.now() };
          lastJson.current[docId] = JSON.stringify(fallback);
          setDoc(doc(db, "arge", docId), payload).catch(() => {});
        }
        markReady(docId);
      }, (err) => {
        console.error("[SYNC] ❌ Dinleme HATASI:", docId, err);
        setFirestoreStatus("error");
        markReady(docId);
      });
      unsubs.push(unsub);
    };

    // Fallback: 5 saniye sonra firestoreReady'yi zorla
    const readyTimeout = setTimeout(() => {
      if (!firestoreReady.current) {
        console.warn("[SYNC] ⚠️ 5s timeout — firestoreReady zorlanıyor (" + readyDocs.size + "/13 hazır)");
        firestoreReady.current = true;
        setFirestoreStatus(readyDocs.size > 0 ? "ready" : "error");
      }
    }, 5000);

    listen("researchers", setResearchers, initialResearchers, false);
    listen("topics", setTopics, initialTopics, false);
    listen("projects", setProjects, initialProjects, false);
    listen("quicklinks", setQuickLinks, defaultQuickLinks, false);
        listen("notes", setNotes, [], false);
    listen("cfg_roles", setRoleConfig, DEFAULT_ROLE_CONFIG, true);
    listen("cfg_statuses", setStatusConfig, DEFAULT_STATUS_CONFIG, true);
    listen("cfg_priorities", setPriorityConfig, DEFAULT_PRIORITY_CONFIG, true);
    listen("cfg_ptypes", setProjectTypeOptions, DEFAULT_PROJECT_TYPES, true);
    listen("cfg_categories", setCategoryOptions, DEFAULT_CATEGORY_OPTIONS, true);
    listen("cfg_degrees", setEduDegreeOptions, DEFAULT_EDU_DEGREES, true);
    listen("cfg_edustatus", setEduStatusOptions, DEFAULT_EDU_STATUSES, true);
    listen("cfg_indexTypes", setIndexTypesConfig, DEFAULT_INDEX_TYPES, false);
    listen("cfg_projectTypeCoeff", setProjectTypeCoeff, DEFAULT_PROJECT_TYPE_COEFF, true);

    // ─── Force Reload dinleyicisi ───
    const forceReloadUnsub = onSnapshot(doc(db, "arge", "_force_reload"), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        const elapsed = Date.now() - (d.timestamp || 0);
        // Son 10 saniye içinde yayınlandıysa ve bu session'dan değilse → reload
        if (elapsed < 10000 && d.tabId !== tabId.current) {
          setForceReloading(true);
          setTimeout(() => window.location.reload(), 2000);
        }
      }
    });

    // ─── Presence dinleyicisi (Google Docs tarzı canlı gösterge) ───
    // İlk presence yazımı
    const initEntry = {};
    initEntry[tabId.current] = {
      username: user?.username || "unknown",
      displayName: user?.displayName || "Kullanıcı",
      role: role,
      section: null, editingId: null, editingType: null,
      lastSeen: Date.now(),
    };
    setDoc(doc(db, "arge", "_presence"), initEntry, { merge: true })
      .then(() => console.log("[PRESENCE] İlk presence yazıldı"))
      .catch((err) => console.error("[PRESENCE] İlk yazma HATASI:", err));

    // Heartbeat — 20 saniyede bir presence güncelle
    const presenceInterval = setInterval(() => {
      const entry = {};
      entry[tabId.current] = {
        username: user?.username || "unknown",
        displayName: user?.displayName || "Kullanıcı",
        role: role,
        section: myPresence.current.section,
        editingId: myPresence.current.editingId,
        editingType: myPresence.current.editingType,
        lastSeen: Date.now(),
      };
      setDoc(doc(db, "arge", "_presence"), entry, { merge: true })
        .catch((err) => console.error("[PRESENCE] Heartbeat hatası:", err));
    }, 20000);

    // Diğer kullanıcıları dinle
    const presenceUnsub = onSnapshot(doc(db, "arge", "_presence"), (snap) => {
      if (!snap.exists()) {
        console.log("[PRESENCE] _presence dokümanı yok");
        return;
      }
      const all = snap.data();
      const now = Date.now();
      const active = {};
      const totalEntries = Object.keys(all).length;
      Object.entries(all).forEach(([tid, info]) => {
        if (!info || !info.lastSeen) return;
        if (now - info.lastSeen > 60000) return;
        if (tid === tabId.current) return;
        active[tid] = info;
      });
      const activeCount = Object.keys(active).length;
      console.log("[PRESENCE] Toplam kayıt:", totalEntries, "| Aktif diğer kullanıcı:", activeCount, activeCount > 0 ? Object.values(active).map(u => u.displayName) : "");
      setOnlineUsers(active);
    }, (err) => {
      console.error("[PRESENCE] Dinleme HATASI:", err);
    });

    // Sayfa kapanınca presence temizle
    const handleBeforeUnload = () => {
      const entry = {};
      entry[tabId.current] = { lastSeen: 0 };
      setDoc(doc(db, "arge", "_presence"), entry, { merge: true }).catch(() => {});
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      unsubs.forEach(fn => fn());
      forceReloadUnsub();
      presenceUnsub();
      clearInterval(presenceInterval);
      clearTimeout(readyTimeout);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      handleBeforeUnload();
    };
  }, []);

  // ─── Firestore'a yazma (state değiştiğinde, sadece kullanıcı eylemi sonrası) ───
  useEffect(() => { writeToFirestore("researchers", researchers); }, [researchers, writeToFirestore]);
  useEffect(() => { writeToFirestore("topics", topics); }, [topics, writeToFirestore]);
  useEffect(() => { writeToFirestore("projects", projects); }, [projects, writeToFirestore]);
  useEffect(() => { writeToFirestore("quicklinks", quickLinks); }, [quickLinks, writeToFirestore]);
  useEffect(() => { writeToFirestore("notes", notes); }, [notes, writeToFirestore]);
  useEffect(() => { writeConfigToFirestore("cfg_roles", roleConfigSt); }, [roleConfigSt, writeConfigToFirestore]);
  useEffect(() => { writeConfigToFirestore("cfg_statuses", statusConfigSt); }, [statusConfigSt, writeConfigToFirestore]);
  useEffect(() => { writeConfigToFirestore("cfg_priorities", priorityConfigSt); }, [priorityConfigSt, writeConfigToFirestore]);
  useEffect(() => { writeConfigToFirestore("cfg_ptypes", projectTypeOptionsSt); }, [projectTypeOptionsSt, writeConfigToFirestore]);
  useEffect(() => { writeConfigToFirestore("cfg_categories", categoryOptionsSt); }, [categoryOptionsSt, writeConfigToFirestore]);
  useEffect(() => { writeToFirestore("cfg_indexTypes", indexTypesConfigSt); }, [indexTypesConfigSt, writeToFirestore]);
  useEffect(() => { writeConfigToFirestore("cfg_projectTypeCoeff", projectTypeCoeffSt); }, [projectTypeCoeffSt, writeConfigToFirestore]);
  useEffect(() => { writeConfigToFirestore("cfg_degrees", eduDegreeOptionsSt); }, [eduDegreeOptionsSt, writeConfigToFirestore]);
  useEffect(() => { writeConfigToFirestore("cfg_edustatus", eduStatusOptionsSt); }, [eduStatusOptionsSt, writeConfigToFirestore]);

  // ─── Presence güncelle (düzenleme durumu değiştiğinde) ───
  useEffect(() => {
    if (selectedItem && selectedType) {
      updatePresence(selectedType === "topic" ? "topics" : "projects", selectedItem.id, selectedType);
    } else if (selectedResearcher) {
      updatePresence("researchers", selectedResearcher.id, "researcher");
    } else {
      updatePresence(null, null, null);
    }
  }, [selectedItem, selectedType, selectedResearcher, updatePresence]);

  // ─── Diğer kullanıcıların düzenleme bilgisini hesapla ───
  const editingByOthers = useMemo(() => {
    // { itemId: { displayName, role, color } } — her öğe için bakan kişi
    const map = {};
    const colorIndex = {};
    let ci = 0;
    Object.values(onlineUsers).forEach((u) => {
      if (!u.editingId) return;
      if (!colorIndex[u.username]) {
        colorIndex[u.username] = PRESENCE_COLORS[ci % PRESENCE_COLORS.length];
        ci++;
      }
      map[u.editingId] = {
        displayName: u.displayName,
        role: u.role,
        username: u.username,
        color: colorIndex[u.username],
      };
    });
    return map;
  }, [onlineUsers, PRESENCE_COLORS]);

  // Online kullanıcı listesi (benzersiz username bazlı)
  const onlineUsersList = useMemo(() => {
    const byUser = {};
    let ci = 0;
    Object.values(onlineUsers).forEach((u) => {
      if (!byUser[u.username] || u.lastSeen > byUser[u.username].lastSeen) {
        if (!byUser[u.username]) ci++;
        byUser[u.username] = { ...u, color: PRESENCE_COLORS[(ci - 1) % PRESENCE_COLORS.length] };
      }
    });
    return Object.values(byUser);
  }, [onlineUsers, PRESENCE_COLORS]);

  // Sync module-level config refs for sub-components
  roleConfig = roleConfigSt;
  statusConfig = statusConfigSt;
  priorityConfig = priorityConfigSt;
  projectTypeOptions = projectTypeOptionsSt;
  categoryOptions = categoryOptionsSt;
  eduDegreeOptions = eduDegreeOptionsSt;
  eduStatusOptions = eduStatusOptionsSt;
  indexTypesConfig = indexTypesConfigSt;
  projectTypeCoeff = projectTypeCoeffSt;

  const showToast = (message, type = "success") => { setToast({ message, type }); setTimeout(() => setToast(null), 3000); };

  const handleResearcherDropOnTopic = (topicId, researcherId, event) => {
    const topic = topics.find(t => t.id === topicId);
    if (topic?.researchers.some(r => r.researcherId === researcherId)) { showToast("Bu araştırmacı zaten bu konuya atanmış", "warning"); return; }
    setRolePopup({ topicId, researcherId, position: { x: event?.clientX || window.innerWidth / 2, y: event?.clientY || window.innerHeight / 2 } });
  };
  const handleRoleSelect = (role) => {
    if (!rolePopup) return;
    const newEntry = { researcherId: rolePopup.researcherId, role };
    setTopics(prev => prev.map(t => t.id === rolePopup.topicId ? { ...t, researchers: [...t.researchers, newEntry] } : t));
    // Bağlı projeye de ekle (zaten projede yoksa)
    const linkedProject = projects.find(p => (p.topics || []).includes(rolePopup.topicId));
    if (linkedProject) {
      const alreadyInProject = (linkedProject.researchers || []).some(r => r.researcherId === rolePopup.researcherId);
      if (!alreadyInProject) {
        setProjects(prev => prev.map(p => p.id === linkedProject.id
          ? { ...p, researchers: [...(p.researchers || []), newEntry] }
          : p
        ));
      }
    }
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
    // KURAL: Projenin tek konusuysa silinemez — önce proje iptal edilmeli
    if (linkedProject) {
      const remainingTopics = (linkedProject.topics || []).filter(tid => tid !== topicId);
      if (remainingTopics.length === 0) {
        alert(`"${topic.title}" konusu silinemez!\n\n"${linkedProject.title}" projesinin tek konusu budur. Bir projenin en az bir konusu olmak zorundadır.\n\nÖnce projeyi iptal edin, ardından konuyu silebilirsiniz.\n(Proje kartında → "Projeyi İptal Et" butonu)`);
        return;
      }
    }
    let msg = `"${topic.title}" konusu kalıcı olarak silinecek.`;
    if (linkedProject) {
      msg += `\n\n⚠️ Bu konu "${linkedProject.title}" projesiyle ilişkilidir. Konu projeden de çıkarılacaktır.`;
    }
    msg += "\n\nBu işlem geri alınamaz. Devam etmek istiyor musunuz?";
    if (!confirm(msg)) return;
    // Remove topic from project + silinen konunun araştırmacılarını temizle
    // NOT: Tek konu kontrolü yukarıda yapıldı, buraya geldiysek remainingTopics.length > 0 garantili
    if (linkedProject) {
      const remainingTopics = (linkedProject.topics || []).filter(tid => tid !== topicId);
      const deletedTopicResIds = new Set((topic.researchers || []).map(r => r.researcherId));
      const remainingTopicResIds = new Set();
      remainingTopics.forEach(tid => {
        const t = topics.find(x => x.id === tid);
        if (t) (t.researchers || []).forEach(r => remainingTopicResIds.add(r.researcherId));
      });
      setProjects(prev => prev.map(p => {
        if (p.id !== linkedProject.id) return p;
        const cleanedResearchers = (p.researchers || []).filter(pr =>
          !deletedTopicResIds.has(pr.researcherId) || remainingTopicResIds.has(pr.researcherId)
        );
        return { ...p, topics: remainingTopics, researchers: cleanedResearchers };
      }));
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
    // KURAL: Projenin tek konusu çıkarılamaz — önce proje iptal edilmeli
    if (updatedTopics.length === 0) {
      alert(`"${topic?.title}" projeden çıkarılamaz!\n\n"${project.title}" projesinin tek konusu budur. Bir projenin en az bir konusu olmak zorundadır.\n\nÖnce projeyi iptal edin, ardından konuyu bağımsız kullanabilirsiniz.\n(Proje kartında → "Projeyi İptal Et" butonu)`);
      return;
    } else {
      // Çıkarılan konunun araştırmacı ID'leri
      const removedTopicResIds = new Set((topic?.researchers || []).map(r => r.researcherId));
      // Kalan konulardaki araştırmacı ID'leri (bunlar korunmalı)
      const remainingTopicResIds = new Set();
      updatedTopics.forEach(tid => {
        const t = topics.find(x => x.id === tid);
        if (t) (t.researchers || []).forEach(r => remainingTopicResIds.add(r.researcherId));
      });
      setProjects(prev => prev.map(p => {
        if (p.id !== project.id) return p;
        // Sadece çıkarılan konuya özgü araştırmacıları kaldır (başka konuda olanları koru)
        const cleanedResearchers = (p.researchers || []).filter(pr =>
          !removedTopicResIds.has(pr.researcherId) || remainingTopicResIds.has(pr.researcherId)
        );
        return { ...p, topics: updatedTopics, researchers: cleanedResearchers };
      }));
      showToast(`"${topic?.title}" projeden çıkarıldı`);
    }
  };
  const handleUpdateItem = (updatedItem) => {
    if (selectedType === "topic") {
      setTopics(prev => prev.map(t => t.id === updatedItem.id ? updatedItem : t));
      // ─── Konu→Proje Senkronizasyonu ───
      // topics state henüz güncellenmedi (React batching) → eski konu verisine erişebiliriz
      const oldTopic = topics.find(t => t.id === updatedItem.id);
      const oldTopicResIds = new Set((oldTopic?.researchers || []).map(r => r.researcherId));
      const newTopicResIds = new Set((updatedItem.researchers || []).map(tr => tr.researcherId));
      // Konudan SİLİNEN araştırmacılar
      const removedFromTopic = new Set([...oldTopicResIds].filter(id => !newTopicResIds.has(id)));
      // Konuya YENİ EKLENEN araştırmacılar
      const addedToTopic = (updatedItem.researchers || []).filter(tr => !oldTopicResIds.has(tr.researcherId));

      setProjects(prev => prev.map(p => {
        if (!(p.topics || []).includes(updatedItem.id)) return p;
        // Diğer konulardaki araştırmacı ID'leri (bu konudan silinen biri başka konuda olabilir)
        const otherTopicResIds = new Set();
        (p.topics || []).filter(tid => tid !== updatedItem.id).forEach(tid => {
          const t = topics.find(x => x.id === tid);
          if (t) (t.researchers || []).forEach(r => otherTopicResIds.add(r.researcherId));
        });
        // 1. Konudan silinen araştırmacıları projeden kaldır (başka konuda yoksa)
        let updatedResearchers = (p.researchers || []).filter(pr => {
          if (!removedFromTopic.has(pr.researcherId)) return true; // silinmedi → koru
          if (otherTopicResIds.has(pr.researcherId)) return true;  // başka konuda var → koru
          return false; // konudan silindi, başka konuda da yok → kaldır
        });
        // 2. Mevcut proje araştırmacılarının bilgilerini güncelle (rol, isIdeaOwner)
        updatedResearchers = updatedResearchers.map(pr => {
          const topicRes = (updatedItem.researchers || []).find(tr => tr.researcherId === pr.researcherId);
          if (topicRes) return { ...pr, role: topicRes.role, isIdeaOwner: topicRes.isIdeaOwner || false };
          return pr;
        });
        // 3. Konuya yeni eklenen araştırmacıları projeye de ekle
        const existingProjResIds = new Set(updatedResearchers.map(r => r.researcherId));
        addedToTopic.forEach(tr => {
          if (!existingProjResIds.has(tr.researcherId)) updatedResearchers.push({ ...tr });
        });
        return { ...p, researchers: updatedResearchers };
      }));
    } else {
      setProjects(prev => prev.map(p => p.id === updatedItem.id ? updatedItem : p));
      // ─── Proje→Konu Senkronizasyonu ───
      // Projede isIdeaOwner veya rol değiştiğinde bağlı konulara yansıt
      setTopics(prev => prev.map(t => {
        if (!(updatedItem.topics || []).includes(t.id)) return t;
        const updatedResearchers = (t.researchers || []).map(tr => {
          const projRes = (updatedItem.researchers || []).find(pr => pr.researcherId === tr.researcherId);
          if (projRes) return { ...tr, isIdeaOwner: projRes.isIdeaOwner || false, role: projRes.role };
          return tr;
        });
        return { ...t, researchers: updatedResearchers };
      }));
    }
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
  // ─── İlişkili (cross-entity) arama: araştırmacı↔konu↔proje ────
  const crossSearchIds = useMemo(() => {
    if (!searchQuery) return { researcherIds: null, topicIds: null, projectIds: null };
    const q = searchQuery.toLowerCase();
    // Eşleşen araştırmacılar
    const matchedResearchers = new Set(researchers.filter(r => r.name.toLowerCase().includes(q) || r.researchAreas.some(a => a.toLowerCase().includes(q)) || (r.institution || "").toLowerCase().includes(q)).map(r => r.id));
    // Eşleşen konular
    const matchedTopics = new Set(topics.filter(t => t.title.toLowerCase().includes(q) || (t.description || "").toLowerCase().includes(q)).map(t => t.id));
    // Eşleşen projeler
    const matchedProjects = new Set(projects.filter(p => p.title.toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q)).map(p => p.id));

    // Araştırmacı → ilişkili konu ve projeler
    const relTopicIds = new Set(matchedTopics);
    const relProjectIds = new Set(matchedProjects);
    const relResearcherIds = new Set(matchedResearchers);

    // Eşleşen araştırmacının konularını ve projelerini bul
    matchedResearchers.forEach(rid => {
      topics.forEach(t => { if ((t.researchers || []).some(r => r.researcherId === rid)) relTopicIds.add(t.id); });
      projects.forEach(p => {
        if ((p.researchers || []).some(r => r.researcherId === rid)) relProjectIds.add(p.id);
        if ((p.topics || []).some(tid => { const t = topics.find(x => x.id === tid); return t && (t.researchers || []).some(r => r.researcherId === rid); })) relProjectIds.add(p.id);
      });
    });
    // Eşleşen konunun araştırmacılarını ve projelerini bul
    matchedTopics.forEach(tid => {
      const t = topics.find(x => x.id === tid);
      if (t) (t.researchers || []).forEach(r => relResearcherIds.add(r.researcherId));
      projects.forEach(p => { if ((p.topics || []).includes(tid)) relProjectIds.add(p.id); });
    });
    // Eşleşen projenin konularını ve araştırmacılarını bul
    matchedProjects.forEach(pid => {
      const p = projects.find(x => x.id === pid);
      if (p) {
        (p.topics || []).forEach(tid => { relTopicIds.add(tid); const t = topics.find(x => x.id === tid); if (t) (t.researchers || []).forEach(r => relResearcherIds.add(r.researcherId)); });
        (p.researchers || []).forEach(r => relResearcherIds.add(r.researcherId));
      }
    });

    return { researcherIds: relResearcherIds, topicIds: relTopicIds, projectIds: relProjectIds };
  }, [searchQuery, researchers, topics, projects]);

  const filteredResearchers = useMemo(() => {
    const filtered = researchers.filter(r => {
      if (searchQuery && crossSearchIds.researcherIds && !crossSearchIds.researcherIds.has(r.id)) return false;
      if (researcherDeptFilter && r.institution !== researcherDeptFilter) return false;
      if (aofMemberFilter === "aof" && !r.isAofMember) return false;
      if (aofMemberFilter === "other" && r.isAofMember) return false;
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
  }, [researchers, topics, searchQuery, crossSearchIds, researcherDeptFilter, aofMemberFilter, advRes, getActiveWorkCount]);
  const researcherColumnStats = useMemo(() => {
    const aofIds = aofMemberFilter ? new Set(researchers.filter(r => aofMemberFilter === "aof" ? r.isAofMember : !r.isAofMember).map(r => r.id)) : null;
    const matchAof = (rid) => !aofIds || aofIds.has(rid);
    const uniqueResInTopics = (status) => {
      const ids = new Set();
      topics.filter(t => t.status === status).forEach(t => (t.researchers || []).forEach(r => { if (matchAof(r.researcherId)) ids.add(r.researcherId); }));
      return ids.size;
    };
    const uniqueResInProjects = (status) => {
      const ids = new Set();
      projects.filter(p => p.status === status).forEach(p => {
        (p.researchers || []).forEach(r => { if (matchAof(r.researcherId)) ids.add(r.researcherId); });
        (p.topics || []).forEach(tid => {
          const t = topics.find(x => x.id === tid);
          if (t) (t.researchers || []).forEach(r => { if (matchAof(r.researcherId)) ids.add(r.researcherId); });
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
  }, [topics, projects, researchers, aofMemberFilter]);
  const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const filteredTopics = useMemo(() => {
    const filtered = topics.filter(t => {
      if (searchQuery && crossSearchIds.topicIds && !crossSearchIds.topicIds.has(t.id)) return false;
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
  }, [topics, projects, searchQuery, crossSearchIds, topicStatusFilter, topicPriorityFilter, advTopic]);
  const filteredProjects = useMemo(() => {
    const filtered = projects.filter(p => {
      if (searchQuery && crossSearchIds.projectIds && !crossSearchIds.projectIds.has(p.id)) return false;
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
  }, [projects, searchQuery, crossSearchIds, projectStatusFilter, projectPriorityFilter, advProject]);

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
  }, [filteredResearchers, topics, projects]);

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
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Ara... (ilişkili konu, proje ve kişileri de gösterir)"
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
          {/* Firestore Connection Status — tıklayınca bağlantı testi yapar */}
          <button onClick={testConnection} className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium cursor-pointer transition-all hover:shadow-sm ${
            firestoreStatus === "connecting" ? "bg-yellow-50 text-yellow-600 animate-pulse hover:bg-yellow-100"
              : firestoreStatus === "error" ? "bg-red-50 text-red-600 hover:bg-red-100"
              : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
          }`} title="Tıklayın: Firestore bağlantı testi yapılır">
            <div className={`w-2 h-2 rounded-full ${
              firestoreStatus === "connecting" ? "bg-yellow-400"
                : firestoreStatus === "error" ? "bg-red-400"
                : "bg-emerald-400"
            }`} />
            {firestoreStatus === "connecting" ? "Bağlanıyor..."
              : firestoreStatus === "error" ? "Hata! (Test Et)"
              : "Bağlı"}
          </button>
          {/* Sync Button */}
          {/* Save Indicator */}
          {canEdit && saveIndicator !== "idle" && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
              saveIndicator === "saving" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
            }`}>
              <CloudUpload size={12} className={saveIndicator === "saving" ? "animate-pulse" : ""} />
              {saveIndicator === "saving" ? "Kaydediliyor..." : "Kaydedildi"}
            </div>
          )}
          {/* Notes Button */}
          <div className="relative">
            <button onClick={() => { setShowNotes(!showNotes); setShowDeadlines(false); }}
              className={`p-2 rounded-lg transition-colors ${showNotes ? "bg-violet-100 text-violet-600" : "hover:bg-slate-100 text-slate-500"}`}
              title="Notlar">
              <StickyNote size={18} />
            </button>
          </div>
          {canEdit && lastSavedAt && saveIndicator === "idle" && (
            <div className="flex items-center gap-1 px-2 py-1 text-[10px] text-slate-400" title={`Son kayıt: ${lastSavedAt.toLocaleTimeString("tr-TR")}`}>
              <CloudUpload size={11} />
              {lastSavedAt.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
            </div>
          )}
          {canEdit && <button onClick={forceSync} disabled={syncStatus === "syncing"}
            className={`p-2 rounded-lg transition-all ${syncStatus === "done" ? "bg-emerald-100 text-emerald-600" : syncStatus === "syncing" ? "bg-indigo-100 text-indigo-600" : "hover:bg-slate-100 text-slate-500"}`}
            title="Senkronize Et">
            <RefreshCw size={18} className={syncStatus === "syncing" ? "animate-spin" : ""} />
          </button>}
          {/* Backup Button — sadece Master görür */}
          {isMaster && (
            <div className="relative group">
              <button onClick={downloadBackupJSON}
                className="p-2 rounded-lg hover:bg-amber-50 text-slate-500 hover:text-amber-600 transition-colors"
                title={lastBackupAt ? `Son yedek: ${lastBackupAt.toLocaleDateString("tr-TR")} ${lastBackupAt.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}` : "Yedek al (JSON + Firestore)"}>
                <DatabaseBackup size={18} />
              </button>
              {/* Yedek geri yükleme (gizli input) */}
              <input type="file" accept=".json" id="backup-restore-input" className="hidden"
                onChange={(e) => { if (e.target.files[0]) restoreFromJSON(e.target.files[0]); e.target.value = ""; }} />
            </div>
          )}
          {/* Settings Button */}
          {isAdmin && <button onClick={() => { setShowSettings(true); setShowDeadlines(false); }}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            title="Ayarlar">
            <Wrench size={18} />
          </button>}
          {/* Online Users (Google Docs tarzı) */}
          {onlineUsersList.length > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex -space-x-2">
                {onlineUsersList.slice(0, 4).map((u, i) => (
                  <div
                    key={u.username}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${u.color.bg} ring-2 ring-white shadow-sm`}
                    title={`${u.displayName} (${u.role === "master" ? "Master" : u.role === "admin" ? "Yönetici" : u.role === "editor" ? "Editör" : "Görüntüleyici"})${u.editingId ? " — düzenliyor" : " — çevrimiçi"}`}
                  >
                    {(u.displayName || "?")[0]}
                  </div>
                ))}
                {onlineUsersList.length > 4 && (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-600 bg-slate-200 ring-2 ring-white">
                    +{onlineUsersList.length - 4}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 ml-1">{onlineUsersList.length} çevrimiçi</span>
            </div>
          )}
          {onlineUsersList.length > 0 && <div className="w-px h-6 bg-slate-200" />}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs font-medium text-slate-700">{user?.displayName || "Kullanıcı"}</p>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs ${
              isMaster
                ? "bg-red-100 text-red-600 ring-2 ring-red-300"
                : isAdmin
                  ? "bg-emerald-100 text-emerald-600 ring-2 ring-emerald-300"
                  : isEditor
                    ? "bg-violet-100 text-violet-600 ring-2 ring-violet-300"
                    : "bg-indigo-100 text-indigo-600"
            }`}>
              {(user?.displayName || "K")[0]}
            </div>
            <button onClick={onLogout} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Çıkış Yap">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>
      {showNotes && <NotepadPanel notes={notes} onNotesChange={setNotes} topics={topics} projects={projects} canEdit={canEdit} onClose={() => setShowNotes(false)} isMaster={isMaster} isAdmin={isAdmin} isEditor={isEditor} />}


      {/* FORCE RELOAD OVERLAY */}
      {forceReloading && (
        <div className="fixed inset-0 z-[60] bg-gradient-to-br from-indigo-900/90 to-purple-900/90 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
              <RefreshCw size={32} className="text-indigo-500 animate-spin" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Sayfa Güncelleniyor</h2>
            <p className="text-sm text-slate-500">Yönetici verileri yayınladı. Sayfa yeniden yükleniyor...</p>
          </div>
        </div>
      )}



      {/* 30 GÜN YEDEKLEME UYARISI — sadece Master görür */}
      {isMaster && !backupWarningDismissed && (
        lastBackupAt === null || (Date.now() - lastBackupAt.getTime() > 30 * 24 * 60 * 60 * 1000)
      ) && (
        <div className="bg-red-600 text-white px-5 py-3 flex items-center justify-between flex-shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-yellow-300 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold">Yedekleme Uyarısı!</p>
              <p className="text-xs text-red-100">
                {lastBackupAt === null
                  ? "Hiç yedek alınmamış! Veri kaybını önlemek için hemen yedek alın."
                  : `Son yedek ${Math.floor((Date.now() - lastBackupAt.getTime()) / (24*60*60*1000))} gün önce alındı. 30 günü aştınız!`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={downloadBackupJSON}
              className="px-4 py-1.5 bg-white text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1.5">
              <DatabaseBackup size={14} /> Hemen Yedekle
            </button>
            <button onClick={() => setBackupWarningDismissed(true)}
              className="p-1 hover:bg-red-500 rounded transition-colors" title="Kapat">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

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
        {(!maximizedCol || maximizedCol === "researchers") && (
        <div className={`${maximizedCol === "researchers" ? "flex-1" : "w-1/3"} min-w-0 border-r border-slate-200 flex flex-col bg-white/50 transition-all`}>
          <div className="p-3 border-b border-slate-100 space-y-2 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className={`font-bold text-slate-700 flex items-center gap-1.5 ${maximizedCol === "researchers" ? "text-base" : "text-sm"}`}><Users size={maximizedCol === "researchers" ? 18 : 15} className="text-indigo-500" />Araştırmacılar<Badge className="bg-slate-100 text-slate-500 ml-1">{filteredResearchers.length}</Badge></h2>
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
                <button onClick={() => setMaximizedCol(maximizedCol === "researchers" ? null : "researchers")} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors" title={maximizedCol === "researchers" ? "Normal Görünüm" : "Tam Ekran"}>{maximizedCol === "researchers" ? <Minimize2 size={14} /> : <Maximize2 size={14} />}</button>
                <button onClick={() => setShowAdvRes(!showAdvRes)} className={`p-1.5 rounded-lg transition-colors ${showAdvRes ? "bg-indigo-100 text-indigo-600" : "hover:bg-slate-100 text-slate-400"}`} title="Detaylı Filtre"><Filter size={14} /></button>
                {canEdit && <button onClick={() => setAddModal("researcher")} className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-500 transition-colors" title="Yeni Araştırmacı"><Plus size={16} /></button>}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <FilterDropdown label="Kurum" icon={Building2}
                options={institutions.map(d => ({ value: d, label: d.length > 20 ? d.slice(0, 20) + "..." : d }))}
                value={researcherDeptFilter} onChange={setResearcherDeptFilter} />
              <div className="flex items-center border border-teal-200 rounded-lg overflow-hidden">
                <button onClick={() => setAofMemberFilter("")} className={`px-2 py-1 text-[10px] font-medium transition-colors ${!aofMemberFilter ? "bg-teal-500 text-white" : "bg-white text-slate-500 hover:bg-teal-50"}`}>Tümü</button>
                <button onClick={() => setAofMemberFilter("aof")} className={`px-2 py-1 text-[10px] font-medium transition-colors border-l border-teal-200 ${aofMemberFilter === "aof" ? "bg-teal-500 text-white" : "bg-white text-teal-600 hover:bg-teal-50"}`}>AÖF</button>
                <button onClick={() => setAofMemberFilter("other")} className={`px-2 py-1 text-[10px] font-medium transition-colors border-l border-teal-200 ${aofMemberFilter === "other" ? "bg-teal-500 text-white" : "bg-white text-slate-500 hover:bg-teal-50"}`}>Diğer</button>
              </div>
            </div>
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
          <div className={`flex-1 overflow-y-auto ${maximizedCol === "researchers" ? "p-4" : "p-3"}`}>
            <div className={maximizedCol === "researchers" ? "grid grid-cols-2 xl:grid-cols-3 gap-3" : "space-y-2"}>
            {filteredResearchers.map(r => <ResearcherCard key={r.id} researcher={r} isAdmin={canEdit} topics={topics} projects={projects} onClick={setSelectedResearcher} maximized={maximizedCol === "researchers"} editingBy={editingByOthers[r.id]} />)}
            {filteredResearchers.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Araştırmacı bulunamadı</p>}
            </div>
          </div>
        </div>
        )}

        {/* COL 2: TOPICS */}
        {(!maximizedCol || maximizedCol === "topics") && (
        <div className={`${maximizedCol === "topics" ? "flex-1" : "w-1/3"} min-w-0 border-r border-slate-200 flex flex-col bg-white/30 transition-all`}>
          <div className="p-3 border-b border-slate-100 space-y-2 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className={`font-bold text-slate-700 flex items-center gap-1.5 ${maximizedCol === "topics" ? "text-base" : "text-sm"}`}><BookOpen size={maximizedCol === "topics" ? 18 : 15} className="text-emerald-500" />Konular<Badge className="bg-slate-100 text-slate-500 ml-1">{filteredTopics.length}</Badge></h2>
              <div className="flex items-center gap-1">
                <button onClick={() => setMaximizedCol(maximizedCol === "topics" ? null : "topics")} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors" title={maximizedCol === "topics" ? "Normal Görünüm" : "Tam Ekran"}>{maximizedCol === "topics" ? <Minimize2 size={14} /> : <Maximize2 size={14} />}</button>
                <button onClick={() => setShowAdvTopic(!showAdvTopic)} className={`p-1.5 rounded-lg transition-colors ${showAdvTopic ? "bg-emerald-100 text-emerald-600" : "hover:bg-slate-100 text-slate-400"}`} title="Detaylı Filtre"><Filter size={14} /></button>
                {canEdit && <button onClick={() => setAddModal("topic")} className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-500 transition-colors" title="Yeni Konu"><Plus size={16} /></button>}
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
          <div className={`flex-1 overflow-y-auto ${maximizedCol === "topics" ? "p-4" : "p-3"}`}>
            <div className={maximizedCol === "topics" ? "grid grid-cols-2 xl:grid-cols-3 gap-3" : "space-y-2"}>
            {filteredTopics.map(t => <TopicCard key={t.id} topic={t} allResearchers={researchers} isAdmin={canEdit} projects={projects} allTopics={topics} onRemoveFromProject={handleRemoveTopicFromProject} onDrop={handleResearcherDropOnTopic} onClick={(topic) => { setSelectedItem(topic); setSelectedType("topic"); }} maximized={maximizedCol === "topics"} editingBy={editingByOthers[t.id]} />)}
            {filteredTopics.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Konu bulunamadı</p>}
            </div>
          </div>
        </div>
        )}

        {/* COL 3: PROJECTS */}
        {(!maximizedCol || maximizedCol === "projects") && (
        <div className={`${maximizedCol === "projects" ? "flex-1" : "w-1/3"} min-w-0 flex flex-col transition-all`}>
          <div className="p-3 border-b border-slate-100 space-y-2 flex-shrink-0">
            <div className="flex items-center justify-between">
              <h2 className={`font-bold text-slate-700 flex items-center gap-1.5 ${maximizedCol === "projects" ? "text-base" : "text-sm"}`}><FolderKanban size={maximizedCol === "projects" ? 18 : 15} className="text-violet-500" />Projeler<Badge className="bg-slate-100 text-slate-500 ml-1">{filteredProjects.length}</Badge></h2>
              <div className="flex items-center gap-1">
                <button onClick={() => setMaximizedCol(maximizedCol === "projects" ? null : "projects")} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors" title={maximizedCol === "projects" ? "Normal Görünüm" : "Tam Ekran"}>{maximizedCol === "projects" ? <Minimize2 size={14} /> : <Maximize2 size={14} />}</button>
                <button onClick={() => setShowAdvProject(!showAdvProject)} className={`p-1.5 rounded-lg transition-colors ${showAdvProject ? "bg-violet-100 text-violet-600" : "hover:bg-slate-100 text-slate-400"}`} title="Detaylı Filtre"><Filter size={14} /></button>
                {canEdit && <button onClick={() => setAddModal("project")} className="p-1.5 rounded-lg hover:bg-violet-50 text-violet-500 transition-colors" title="Yeni Proje"><Plus size={16} /></button>}
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
          <div className={`flex-1 overflow-y-auto transition-colors duration-200 ${maximizedCol === "projects" ? "p-4" : "p-3"} ${projectColDragOver ? "bg-violet-50 ring-2 ring-inset ring-violet-300 rounded-lg" : ""}`}
            onDragOver={(e) => { e.preventDefault(); const t = e.dataTransfer.types; if (t) setProjectColDragOver(true); }}
            onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setProjectColDragOver(false); }}
            onDrop={(e) => {
              if (!isAdmin) return;
              e.preventDefault(); setProjectColDragOver(false);
              const type = e.dataTransfer.getData("type"); const id = e.dataTransfer.getData("id");
              if (type === "topic") handleCreateProjectFromTopic(id);
            }}>
            <div className={maximizedCol === "projects" ? "grid grid-cols-2 xl:grid-cols-3 gap-3" : "space-y-2"}>
            {filteredProjects.map(p => <ProjectCard key={p.id} project={p} topics={topics} allResearchers={researchers} isAdmin={canEdit} onDrop={handleTopicDropOnProject} onCancelProject={handleCancelProject} onClick={(project) => { setSelectedItem(project); setSelectedType("project"); }} maximized={maximizedCol === "projects"} editingBy={editingByOthers[p.id]} />)}
            {filteredProjects.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Proje bulunamadı</p>}
            </div>
            {projectColDragOver && (
              <div className="border-2 border-dashed border-violet-400 rounded-xl p-4 text-center animate-slide-up">
                <FolderKanban size={24} className="text-violet-400 mx-auto mb-1" />
                <p className="text-sm font-medium text-violet-600">Konuyu buraya bırakarak yeni proje oluştur</p>
                <p className="text-xs text-violet-400 mt-0.5">Konu bilgileri projeye aktarılacak</p>
              </div>
            )}
          </div>
        </div>
        )}
      </div>

      {/* MODALS */}
      {rolePopup && <RoleSelectPopup position={rolePopup.position} onSelect={handleRoleSelect} onCancel={() => setRolePopup(null)} />}
      {selectedResearcher && <ResearcherDetailModal researcher={selectedResearcher} topics={topics} projects={projects} allResearchers={researchers} isAdmin={canEdit} onClose={() => setSelectedResearcher(null)} onUpdate={handleUpdateResearcher} onDeleteResearcher={handleDeleteResearcher} onSelectTopic={(t) => { setSelectedResearcher(null); setSelectedItem(t); setSelectedType("topic"); }} editingBy={editingByOthers[selectedResearcher.id]} />}
      {selectedItem && <DetailModal item={selectedItem} type={selectedType} allResearchers={researchers} topics={topics} projects={projects} isAdmin={canEdit} onClose={() => { setSelectedItem(null); setSelectedType(null); }} onUpdate={handleUpdateItem} onRemoveFromProject={handleRemoveTopicFromProject} onCancelProject={handleCancelProject} onDeleteTopic={handleDeleteTopic} onSelectResearcher={(r) => { setSelectedItem(null); setSelectedType(null); setSelectedResearcher(r); }} onSelectTopic={(t) => { setSelectedItem(t); setSelectedType("topic"); }} editingBy={editingByOthers[selectedItem.id]} />}
      {addModal && canEdit && <AddItemModal type={addModal} allTopics={topics} projects={projects} allResearchers={researchers} onAdd={(item) => handleAddItem(addModal, item)} onClose={() => setAddModal(null)} />}
      {showCalendar && <CalendarModal topics={topics} projects={projects} onClose={() => setShowCalendar(false)} />}
      {showLeaderboard && <LeaderboardModal researchers={researchers} topics={topics} projects={projects} onClose={() => setShowLeaderboard(false)} />}
      {showTableView && <TableViewModal researchers={researchers} topics={topics} projects={projects} onClose={() => setShowTableView(false)} />}
      {showStats && <StatsModal researchers={researchers} topics={topics} projects={projects} onClose={() => setShowStats(false)} />}
      <ArGeChatbot researchers={researchers} topics={topics} projects={projects} />
      {showSettings && isAdmin && <SettingsModal
        roleConfig={roleConfig} onRoleConfigChange={setRoleConfig}
        statusConfig={statusConfig} onStatusConfigChange={setStatusConfig}
        priorityConfig={priorityConfig} onPriorityConfigChange={setPriorityConfig}
        projectTypeOptions={projectTypeOptions} onProjectTypeOptionsChange={setProjectTypeOptions}
        categoryOptions={categoryOptions} onCategoryOptionsChange={setCategoryOptions}
        eduDegreeOptions={eduDegreeOptions} onEduDegreeOptionsChange={setEduDegreeOptions}
        eduStatusOptions={eduStatusOptions} onEduStatusOptionsChange={setEduStatusOptions}
        indexTypesConfig={indexTypesConfig} onIndexTypesConfigChange={setIndexTypesConfig}
        projectTypeCoeffConfig={projectTypeCoeff} onProjectTypeCoeffChange={setProjectTypeCoeff}
        quickLinks={quickLinks} onQuickLinksChange={setQuickLinks}
        onResetDefaults={() => {
          if (confirm("Tüm ayarları varsayılana sıfırlamak istediğinize emin misiniz?")) {
            setRoleConfig(DEFAULT_ROLE_CONFIG); setStatusConfig(DEFAULT_STATUS_CONFIG);
            setPriorityConfig(DEFAULT_PRIORITY_CONFIG); setProjectTypeOptions(DEFAULT_PROJECT_TYPES);
            setCategoryOptions(DEFAULT_CATEGORY_OPTIONS); setEduDegreeOptions(DEFAULT_EDU_DEGREES);
            setEduStatusOptions(DEFAULT_EDU_STATUSES);
            setIndexTypesConfig(DEFAULT_INDEX_TYPES); setProjectTypeCoeff(DEFAULT_PROJECT_TYPE_COEFF);
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
              indexTypes: indexTypesConfigSt, projectTypeCoeff: projectTypeCoeffSt,
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
            if (data.config.indexTypes) setIndexTypesConfig(data.config.indexTypes);
            if (data.config.projectTypeCoeff !== undefined) setProjectTypeCoeff(data.config.projectTypeCoeff);
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
          setIndexTypesConfig(DEFAULT_INDEX_TYPES); setProjectTypeCoeff(DEFAULT_PROJECT_TYPE_COEFF);
          showToast("Tüm veriler sıfırlandı", "warning");
        }}
        onForceSync={forceSync} syncStatus={syncStatus} onForcePublish={forcePublish}
        isMaster={isMaster} onBackupDownload={downloadBackupJSON} onBackupRestore={restoreFromJSON} lastBackupAt={lastBackupAt}
        onClose={() => setShowSettings(false)}
      />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 px-5 py-1.5 flex flex-col items-center gap-0.5 text-[10px] text-slate-400 flex-shrink-0 select-none">
        <div className="flex items-center gap-1.5">
          <span>&#169; SEÖ, 2026</span>
          <span className="text-slate-300">|</span>
          <span>Bu uygulama, Anadolu Üniversitesi Açıköğretim Fakültesi Ar-Ge birimi içi bilgi amaçlı olup izinsiz kullanılamaz.</span>
        </div>
        <div className="text-[9px] text-slate-300">Son Sistem Güncellemesi: 1 Mart 2026, 10:50</div>
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
