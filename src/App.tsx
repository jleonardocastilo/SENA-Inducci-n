import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LearnerProfile,
  DEFAULT_PROFILE,
  LEARNING_MODULES,
  BADGES
} from './data/senaData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LearningModulesView } from './components/LearningModulesView';
import { RegulationExplorer } from './components/RegulationExplorer';
import { CaseSimulator } from './components/CaseSimulator';
import { FinalEvaluation } from './components/FinalEvaluation';
import { CertificateView } from './components/CertificateView';
import { ProfileModal } from './components/ProfileModal';
import { CertificateVerifierModal } from './components/CertificateVerifierModal';
import { SofiaAssistantModal } from './components/SofiaAssistantModal';
import { GoogleDriveSyncModal } from './components/GoogleDriveSyncModal';
import { InstructorDashboard } from './components/InstructorDashboard';
import { InstructorPinModal } from './components/InstructorPinModal';
import { RoleSelectionLanding } from './components/RoleSelectionLanding';
import { SenaEmblem } from './components/SenaEmblem';
import { autoSyncLearner, LearnerSyncPayload } from './services/autoSyncService';
import {
  BookOpen,
  Award,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';

export default function App() {
  const { t } = useTranslation();
  // Authenticated Role state: 'aprendiz' | 'instructor' | null
  // If null, the dedicated RoleSelectionLanding page is presented first
  const [authenticatedRole, setAuthenticatedRole] = useState<'aprendiz' | 'instructor' | null>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const roleParam = urlParams.get('role');
      const savedAuth = localStorage.getItem('sena_authenticated_role') as 'aprendiz' | 'instructor' | null;

      // If apprentice link was shared, check if they already have an active learner session; otherwise show characterization form
      if (roleParam === 'aprendiz') {
        return savedAuth === 'aprendiz' ? 'aprendiz' : null;
      }
      if (roleParam === 'instructor') {
        return savedAuth === 'instructor' ? 'instructor' : null;
      }
      if (savedAuth === 'aprendiz' || savedAuth === 'instructor') {
        return savedAuth;
      }
    }
    return null; // Default to landing role selector
  });

  // User Role Management: 'aprendiz' | 'instructor'
  const [userRole, setUserRole] = useState<'aprendiz' | 'instructor'>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const roleParam = urlParams.get('role');
      if (roleParam === 'aprendiz') return 'aprendiz';
      if (roleParam === 'instructor') return 'instructor';
      const savedRole = localStorage.getItem('sena_user_role');
      if (savedRole === 'aprendiz' || savedRole === 'instructor') return savedRole;
    }
    return 'instructor';
  });

  const [isInstructorPinOpen, setIsInstructorPinOpen] = useState(false);

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<'modules' | 'regulation' | 'simulator' | 'evaluation' | 'certificate' | 'instructor'>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('role') === 'aprendiz') return 'modules';
      if (urlParams.get('role') === 'instructor') return 'instructor';
      const savedRole = localStorage.getItem('sena_user_role');
      if (savedRole === 'aprendiz') return 'modules';
    }
    return 'instructor';
  });

  // Learner state
  const [profile, setProfile] = useState<LearnerProfile>(() => {
    const saved = localStorage.getItem('sena_learner_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_PROFILE;
      }
    }
    return DEFAULT_PROFILE;
  });

  const [xp, setXp] = useState<number>(() => {
    const saved = localStorage.getItem('sena_learner_xp');
    return saved ? parseInt(saved, 10) : 150; // Starter XP
  });

  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem('sena_completed_lessons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return ['l-1-1'];
      }
    }
    return ['l-1-1']; // First lesson pre-completed as warm-up
  });

  const [isCertified, setIsCertified] = useState<boolean>(() => {
    const saved = localStorage.getItem('sena_is_certified');
    return saved === 'true';
  });

  const [scorePercentage, setScorePercentage] = useState<number>(() => {
    const saved = localStorage.getItem('sena_evaluation_score');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [completionDate, setCompletionDate] = useState<string>(() => {
    const saved = localStorage.getItem('sena_completion_date');
    return saved || '20 de Octubre de 2026';
  });

  // Modals state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [verifierCode, setVerifierCode] = useState<string>('');
  const [isVerifierOpen, setIsVerifierOpen] = useState(false);
  const [isDriveSyncOpen, setIsDriveSyncOpen] = useState(false);
  const [showPlanBanner, setShowPlanBanner] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('sena_learner_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('sena_learner_xp', xp.toString());
  }, [xp]);

  useEffect(() => {
    localStorage.setItem('sena_completed_lessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem('sena_is_certified', isCertified ? 'true' : 'false');
  }, [isCertified]);

  useEffect(() => {
    localStorage.setItem('sena_evaluation_score', scorePercentage.toString());
  }, [scorePercentage]);

  useEffect(() => {
    localStorage.setItem('sena_completion_date', completionDate);
  }, [completionDate]);

  // Derived progress
  const totalLessons = LEARNING_MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
  const progressPercentage = Math.round((completedLessons.length / totalLessons) * 100);

  // Calculate unlocked badges based on XP or milestones
  const unlockedBadges = BADGES.filter((b) => xp >= b.unlockedAtXP).map((b) => b.id);

  const handleCompleteLesson = (lessonId: string, xpEarned: number) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons((prev) => [...prev, lessonId]);
    }
    setXp((prev) => prev + xpEarned);
  };

  const handleEarnXP = (amount: number) => {
    setXp((prev) => prev + amount);
  };

  const handleEvaluationCompleted = (score: number, passed: boolean) => {
    setScorePercentage(score);
    if (passed) {
      setIsCertified(true);
      setXp((prev) => prev + 300);
      const todayFormatted = new Intl.DateTimeFormat('es-CO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date());
      setCompletionDate(todayFormatted);

      // Despacho de sincronización automática en segundo plano
      const rawId = `${profile.documentNumber}-${profile.recordNumber}`.replace(/[^a-zA-Z0-9]/g, '');
      const certCode = `SENA-IND-2026-${rawId.slice(0, 5).toUpperCase() || 'ADSO1'}-${rawId.slice(-4).toUpperCase() || '7890'}`;
      const now = new Date();
      const formattedTimestamp = `${now.toLocaleDateString('es-CO')} ${now.toLocaleTimeString('es-CO')}`;

      const syncPayload: LearnerSyncPayload = {
        id: `SENA-${rawId.slice(0, 6)}-${Date.now().toString().slice(-4)}`,
        timestamp: formattedTimestamp,
        fullName: profile.fullName,
        documentType: profile.documentType,
        documentNumber: profile.documentNumber,
        recordNumber: profile.recordNumber,
        trainingProgram: profile.trainingProgram,
        regional: profile.regional,
        trainingCenter: profile.trainingCenter,
        modality: profile.modality,
        completedLessons: completedLessons.length,
        totalLessons,
        xp: xp + 300,
        scorePercentage: score,
        isCertified: true,
        certificateCode: certCode,
        regulation: 'Acuerdo 0009 de 2024'
      };

      autoSyncLearner(syncPayload).catch((err) => {
        console.warn('Auto-sync en segundo plano diferido:', err);
      });
    }
  };

  const handleOpenVerifier = (code: string) => {
    setVerifierCode(code);
    setIsVerifierOpen(true);
  };

  // Dark Mode state with persistence and blur screen effect
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('sena_dark_mode');
    if (saved !== null) {
      return saved === 'true';
    }
    return typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [blurActive, setBlurActive] = useState<boolean>(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('sena_dark_mode', isDarkMode ? 'true' : 'false');
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    // Trigger cinematic screen blur effect when changing mode
    setBlurActive(true);
    setIsDarkMode((prev) => !prev);
    setTimeout(() => {
      setBlurActive(false);
    }, 700);
  };

  // Dedicated Landing Page for Role Selection (Instructor with SENA1234, Apprentice with Characterization data)
  if (!authenticatedRole) {
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const initialLandingRole = urlParams?.get('role') === 'instructor' ? 'instructor' : 'aprendiz';

    return (
      <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} relative`}>
        {blurActive && (
          <div
            className="fixed inset-0 z-50 pointer-events-none dark-mode-blur-transition flex items-center justify-center backdrop-blur-md bg-slate-950/20"
            aria-hidden="true"
          />
        )}
        <RoleSelectionLanding
          initialRole={initialLandingRole}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
          onSelectLearner={(newProfile) => {
            setProfile(newProfile);
            setUserRole('aprendiz');
            setAuthenticatedRole('aprendiz');
            setCurrentTab('modules');
            localStorage.setItem('sena_authenticated_role', 'aprendiz');
            localStorage.setItem('sena_user_role', 'aprendiz');
          }}
          onSelectInstructor={() => {
            setUserRole('instructor');
            setAuthenticatedRole('instructor');
            setCurrentTab('instructor');
            localStorage.setItem('sena_authenticated_role', 'instructor');
            localStorage.setItem('sena_user_role', 'instructor');
          }}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-[#FC7323] selection:text-white transition-colors duration-300 relative ${
      isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Full-screen blur pulse effect when applying dark mode */}
      {blurActive && (
        <div
          className="fixed inset-0 z-50 pointer-events-none dark-mode-blur-transition flex items-center justify-center backdrop-blur-md bg-slate-950/20"
          aria-hidden="true"
        />
      )}

      {/* Atmospheric dark mode ambient blur background */}
      {isDarkMode && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#FC7323]/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 -right-32 w-96 h-96 bg-[#39A900]/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
        </div>
      )}

      {/* Top Navbar with Dark Mode Toggle in Top Right */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        xp={xp}
        profile={profile}
        isCertified={isCertified}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenDriveSync={() => setIsDriveSyncOpen(true)}
        userRole={userRole}
        onRequestInstructorAccess={() => setIsInstructorPinOpen(true)}
        onSwitchToLearner={() => {
          setUserRole('aprendiz');
          localStorage.setItem('sena_user_role', 'aprendiz');
          setCurrentTab('modules');
        }}
        onLogoutToLanding={() => {
          setAuthenticatedRole(null);
          localStorage.removeItem('sena_authenticated_role');
        }}
      />

      {/* Main Container */}
      <main className="flex-1 relative z-10">
        {/* Dedicated Instructor View */}
        {currentTab === 'instructor' && userRole === 'instructor' ? (
          <InstructorDashboard
            onOpenDriveModal={() => setIsDriveSyncOpen(true)}
            onSwitchToLearnerView={() => setCurrentTab('modules')}
          />
        ) : (
          <>
            {/* Hero Section displayed on 'modules' tab as welcome header */}
            {currentTab === 'modules' && (
              <HeroSection
                progressPercentage={progressPercentage}
                xp={xp}
                completedLessonsCount={completedLessons.length}
                totalLessonsCount={totalLessons}
                unlockedBadges={unlockedBadges}
                isCertified={isCertified}
                onStartRoute={() => setCurrentTab('modules')}
                onOpenSimulator={() => setCurrentTab('simulator')}
                onOpenCertificate={() => setCurrentTab('certificate')}
              />
            )}

            {/* Structured Implementation Plan Drawer / Notice */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 no-print">
              <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-800 p-4 transition-all shadow-2xs">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 dark:bg-amber-950/40 rounded-lg text-[#FC7323] shrink-0">
                      <Info className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                        {t('app.plan_badge', 'Plan de Modernización de la Inducción SENA 2026')}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                        {t('app.plan_sub', 'Estructura pedagógica aprobada para la apropiación del Acuerdo 0009 de 2024 y certificación digital.')}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowPlanBanner(!showPlanBanner)}
                    className="text-xs font-semibold text-[#FC7323] hover:text-[#e05e10] flex items-center gap-1 shrink-0"
                  >
                    <span>{showPlanBanner ? t('app.plan_hide', 'Ocultar Plan') : t('app.plan_show', 'Ver Plan Estructurado')}</span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showPlanBanner ? 'rotate-90' : ''}`} />
                  </button>
                </div>

                {showPlanBanner && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60">
                      <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">1. Diagnóstico Normativo</span>
                      <p className="text-slate-600 dark:text-slate-400">
                        Compilación del Acuerdo 0009 de 2024 (Diario Oficial 52.947), derogando al Acuerdo 007 de 2012 y sus reformas.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60">
                      <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">2. Módulos Interactivos</span>
                      <p className="text-slate-600 dark:text-slate-400">
                        4 fases de aprendizaje: Identidad, 24 Derechos (Cap. II), Deberes y Prohibiciones (Cap. III) y Debido Proceso.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60">
                      <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">3. Simulador de Casos</span>
                      <p className="text-slate-600 dark:text-slate-400">
                        Dilemas de carné, incapacidades médicas, SST y no plagio con retroalimentación jurídica en tiempo real.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60">
                      <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">4. Evaluación de Salida</span>
                      <p className="text-slate-600 dark:text-slate-400">
                        Prueba institucional de 10 reactivos con umbral mínimo aprobatorio del 80% (8/10).
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60">
                      <span className="font-bold text-slate-900 dark:text-slate-100 block mb-1">5. Certificación Oficial</span>
                      <p className="text-slate-600 dark:text-slate-400">
                        Constancia descargable de 40 horas con código QR verificable y firmas institucionales.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tab View Switcher for Learner */}
            {currentTab === 'modules' && (
              <LearningModulesView
                completedLessons={completedLessons}
                onCompleteLesson={handleCompleteLesson}
                onGoToSimulator={() => setCurrentTab('simulator')}
                onGoToEvaluation={() => setCurrentTab('evaluation')}
              />
            )}

            {currentTab === 'regulation' && <RegulationExplorer />}

            {currentTab === 'simulator' && (
              <CaseSimulator
                onEarnXP={handleEarnXP}
                onGoToEvaluation={() => setCurrentTab('evaluation')}
              />
            )}

            {currentTab === 'evaluation' && (
              <FinalEvaluation
                onEvaluationCompleted={handleEvaluationCompleted}
                onGoToCertificate={() => setCurrentTab('certificate')}
                onOpenDriveSync={userRole === 'instructor' ? () => setIsDriveSyncOpen(true) : undefined}
                currentProfile={profile}
                xp={xp}
                completedLessonsCount={completedLessons.length}
                totalLessonsCount={totalLessons}
              />
            )}

            {currentTab === 'certificate' && (
              <CertificateView
                profile={profile}
                isCertified={isCertified}
                scorePercentage={scorePercentage}
                completionDate={completionDate}
                onOpenProfile={() => setIsProfileOpen(true)}
                onGoToEvaluation={() => setCurrentTab('evaluation')}
                onOpenVerifier={handleOpenVerifier}
                onOpenDriveSync={userRole === 'instructor' ? () => setIsDriveSyncOpen(true) : undefined}
              />
            )}
          </>
        )}
      </main>

      {/* Institutional Footer (Hidden on print) */}
      <footer className="no-print bg-white dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 mt-16 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <SenaEmblem size={24} />
                <span className="font-bold text-slate-900 dark:text-white text-sm">{t('app.footer_col1_title', 'SENA Colombia')}</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                {t('app.footer_col1_desc', 'Servicio Nacional de Aprendizaje. Entidad pública que invierte en el desarrollo social y técnico de los trabajadores colombianos.')}
              </p>
            </div>

            <div>
              <p className="font-semibold text-slate-900 dark:text-white mb-2">{t('app.footer_col2_title', 'Canales Institucionales')}</p>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <li><a href="https://www.sena.edu.co" target="_blank" rel="noopener noreferrer" className="hover:text-[#FC7323]">Portal Oficial SENA</a></li>
                <li><a href="https://oferta.senasofiaplus.edu.co" target="_blank" rel="noopener noreferrer" className="hover:text-[#FC7323]">SOFIA Plus</a></li>
                <li><a href="https://zajuna.sena.edu.co" target="_blank" rel="noopener noreferrer" className="hover:text-[#FC7323]">Ecosistema Zajuna LMS</a></li>
                <li><a href="https://agenciapublicadeempleo.sena.edu.co" target="_blank" rel="noopener noreferrer" className="hover:text-[#FC7323]">Agencia Pública de Empleo (APE)</a></li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-slate-900 dark:text-white mb-2">{t('app.footer_col3_title', 'Marco Legal y Convivencia')}</p>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <li><span>Acuerdo 0009 de 2024 (Reglamento Vigente)</span></li>
                <li><span>Ley 119 de 1994 (Reestructuración SENA)</span></li>
                <li><span>Diario Oficial No. 52.947 (Publicación)</span></li>
                <li><span>Plan Nacional de Bienestar al Aprendiz</span></li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-slate-900 dark:text-white mb-2">{t('app.footer_col4_title', 'Acreditación')}</p>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700/60 space-y-1">
                <p className="text-slate-800 dark:text-slate-200 font-semibold">{t('app.footer_hours', 'Inducción Acreditada: 40 Horas')}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t('app.footer_valid', 'Válida para el cumplimiento del requisito de matrícula e inicio de la etapa lectiva.')}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {t('app.footer_copy', '© 2026 Servicio Nacional de Aprendizaje SENA · República de Colombia · Formación Profesional Integral Gratuita.')}
            </p>
            <div className="flex items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
              <button onClick={() => setIsVerifierOpen(true)} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                {t('app.footer_verifier', 'Verificador de Certificados')}
              </button>
              <span aria-hidden="true">·</span>
              <button onClick={() => setIsAssistantOpen(true)} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                {t('app.footer_assistant', 'Tutor Sofía')}
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Profile Config Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSaveProfile={(newProfile) => setProfile(newProfile)}
      />

      {/* Certificate Verifier Modal */}
      <CertificateVerifierModal
        isOpen={isVerifierOpen}
        onClose={() => setIsVerifierOpen(false)}
        initialCode={verifierCode}
        currentProfile={profile}
        isCertified={isCertified}
        scorePercentage={scorePercentage}
        completionDate={completionDate}
      />

      {/* Sofia Virtual Induction Assistant */}
      <SofiaAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
      />

      {/* Google Drive & Sheets Synchronization Modal */}
      <GoogleDriveSyncModal
        isOpen={isDriveSyncOpen}
        onClose={() => setIsDriveSyncOpen(false)}
        currentProfile={profile}
        completedLessonsCount={completedLessons.length}
        totalLessonsCount={totalLessons}
        xp={xp}
        scorePercentage={scorePercentage}
        isCertified={isCertified}
      />

      {/* Instructor PIN Security Modal */}
      <InstructorPinModal
        isOpen={isInstructorPinOpen}
        onClose={() => setIsInstructorPinOpen(false)}
        onSuccess={() => {
          setIsInstructorPinOpen(false);
          setUserRole('instructor');
          setAuthenticatedRole('instructor');
          localStorage.setItem('sena_authenticated_role', 'instructor');
          localStorage.setItem('sena_user_role', 'instructor');
          setCurrentTab('instructor');
        }}
      />
    </div>
  );
}
