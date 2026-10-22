import React from 'react';
import { SenaEmblem } from './SenaEmblem';
import {
  User,
  Sparkles,
  Moon,
  Sun,
  FileSpreadsheet,
  ShieldCheck,
  GraduationCap,
  Users,
  Link as LinkIcon,
  Check,
  LogOut
} from 'lucide-react';
import { LearnerProfile } from '../data/senaData';

interface NavbarProps {
  currentTab: 'modules' | 'regulation' | 'simulator' | 'evaluation' | 'certificate' | 'instructor';
  setCurrentTab: (tab: 'modules' | 'regulation' | 'simulator' | 'evaluation' | 'certificate' | 'instructor') => void;
  xp: number;
  profile: LearnerProfile;
  isCertified: boolean;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenProfile: () => void;
  onOpenAssistant: () => void;
  onOpenDriveSync: () => void;
  userRole: 'aprendiz' | 'instructor';
  onRequestInstructorAccess: () => void;
  onSwitchToLearner: () => void;
  onLogoutToLanding?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  xp,
  profile,
  isCertified,
  isDarkMode,
  onToggleDarkMode,
  onOpenProfile,
  onOpenAssistant,
  onOpenDriveSync,
  userRole,
  onRequestInstructorAccess,
  onSwitchToLearner,
  onLogoutToLanding
}) => {
  const [copiedLink, setCopiedLink] = React.useState(false);

  const handleCopyLearnerLink = () => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set('role', 'aprendiz');
    navigator.clipboard.writeText(url.toString());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 sm:gap-6 h-[68px]">
          {/* Zone 1: Single text wordmark with Role Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentTab(userRole === 'instructor' ? 'instructor' : 'modules')}
              className="flex items-center gap-3 text-left focus:outline-none group"
            >
              <SenaEmblem size={57} className="w-[57px] h-[57px] shrink-0 transition-transform group-hover:scale-105" />
              <div className="flex flex-col hidden sm:flex">
                <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight whitespace-nowrap">
                  SENA <span className="text-[#FC7323]">Inducción</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                  Acuerdo 0009 de 2024
                </span>
              </div>
            </button>

            {/* Role indicator pill */}
            <div className="hidden sm:flex items-center">
              {userRole === 'instructor' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] border border-emerald-300 dark:border-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Modo Instructor</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                  <GraduationCap className="w-3.5 h-3.5 text-[#FC7323]" />
                  <span>Modo Aprendiz</span>
                </span>
              )}
            </div>
          </div>

          {/* Zone 2: Navigation Links based on role */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 overflow-x-auto no-scrollbar">
            {userRole === 'instructor' && (
              <button
                onClick={() => setCurrentTab('instructor')}
                className={`whitespace-nowrap pb-1 transition-colors relative flex items-center gap-1.5 ${
                  currentTab === 'instructor'
                    ? 'text-[#39A900] font-bold border-b-2 border-[#39A900]'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Panel</span>
              </button>
            )}

            <button
              onClick={() => setCurrentTab('modules')}
              className={`whitespace-nowrap pb-1 transition-colors relative ${
                currentTab === 'modules'
                  ? 'text-[#FC7323] font-semibold border-b-2 border-[#FC7323]'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Ruta
            </button>

            <button
              onClick={() => setCurrentTab('regulation')}
              className={`whitespace-nowrap pb-1 transition-colors relative ${
                currentTab === 'regulation'
                  ? 'text-[#FC7323] font-semibold border-b-2 border-[#FC7323]'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Reglamento
            </button>

            <button
              onClick={() => setCurrentTab('simulator')}
              className={`whitespace-nowrap pb-1 transition-colors relative ${
                currentTab === 'simulator'
                  ? 'text-[#FC7323] font-semibold border-b-2 border-[#FC7323]'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Simulador
            </button>

            <button
              onClick={() => setCurrentTab('evaluation')}
              className={`whitespace-nowrap pb-1 transition-colors relative ${
                currentTab === 'evaluation'
                  ? 'text-[#FC7323] font-semibold border-b-2 border-[#FC7323]'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Evaluación
            </button>

            <button
              onClick={() => setCurrentTab('certificate')}
              className={`whitespace-nowrap pb-1 transition-colors relative flex items-center gap-1.5 ${
                currentTab === 'certificate'
                  ? 'text-[#FC7323] font-semibold border-b-2 border-[#FC7323]'
                  : 'hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Certificado</span>
              {isCertified && (
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Certificado desbloqueado" />
              )}
            </button>
          </nav>

          {/* Zone 3: Actions depending on role */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Instructor-only actions */}
            {userRole === 'instructor' ? (
              <>
                <button
                  onClick={handleCopyLearnerLink}
                  className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-900 dark:text-emerald-100 bg-emerald-100/70 dark:bg-emerald-950/80 hover:bg-emerald-200/80 border border-emerald-300 dark:border-emerald-800 rounded-lg transition-colors whitespace-nowrap shadow-xs cursor-pointer"
                  title="Copiar enlace limpio para enviar a los aprendices"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <LinkIcon className="w-3.5 h-3.5 text-[#39A900]" />}
                  <span>{copiedLink ? '¡Link Copiado!' : 'Link Aprendices'}</span>
                </button>

                {/* Google Drive Button (VISIBLE ONLY FOR INSTRUCTOR) */}
                <button
                  onClick={onOpenDriveSync}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white bg-[#39A900] hover:bg-[#329600] rounded-lg transition-colors whitespace-nowrap shadow-xs cursor-pointer"
                  title="Administrar Hoja de Cálculo en Google Drive"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Google Drive</span>
                </button>

                <button
                  onClick={onSwitchToLearner}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
                  title="Cambiar a la vista que ven los aprendices"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-[#FC7323]" />
                  <span className="hidden md:inline">Vista Aprendiz</span>
                </button>

                {onLogoutToLanding && (
                  <button
                    onClick={onLogoutToLanding}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900/50 rounded-lg transition-colors whitespace-nowrap shadow-xs cursor-pointer"
                    title="Salir de la sesión de Instructor / Cambiar de Rol"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-600" />
                    <span className="hidden md:inline">Salir</span>
                  </button>
                )}
              </>
            ) : (
              /* Apprentice-facing buttons: NO Google Drive or Webhook controls */
              <>
                <button
                  onClick={onOpenAssistant}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
                  title="Consultar al Tutor Sofía"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FC7323]" />
                  <span>Tutor Sofía</span>
                </button>

                <button
                  onClick={onOpenProfile}
                  className="flex items-center gap-2 px-3 sm:px-3 py-1.5 text-xs font-semibold text-slate-900 dark:text-amber-100 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800/60 rounded-lg transition-colors whitespace-nowrap shadow-xs"
                >
                  <User className="w-3.5 h-3.5 text-[#FC7323]" />
                  <span className="truncate max-w-[90px] sm:max-w-[120px]">{profile.fullName.split(' ')[0]}</span>
                  <span className="text-slate-400 dark:text-slate-500">|</span>
                  <span className="font-mono tabular-nums text-[#FC7323]">{xp} XP</span>
                </button>

                {onLogoutToLanding && (
                  <button
                    onClick={onLogoutToLanding}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors whitespace-nowrap"
                    title="Salir o cambiar de rol"
                  >
                    <LogOut className="w-3.5 h-3.5 text-[#FC7323]" />
                    <span className="hidden md:inline">Salir</span>
                  </button>
                )}

                {/* Subtle Instructor Unlock Button for Teacher */}
                <button
                  onClick={onRequestInstructorAccess}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800/60 rounded-lg transition-colors whitespace-nowrap"
                  title="Acceso exclusivo para Instructores (Clave SENA1234)"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#39A900]" />
                  <span className="hidden md:inline">Soy Instructor</span>
                </button>
              </>
            )}

            {/* Dark Mode Toggle Button */}
            <button
              onClick={onToggleDarkMode}
              aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="p-2 text-slate-600 dark:text-amber-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#FC7323] cursor-pointer"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 transition-transform duration-300 rotate-0 hover:-rotate-12 text-slate-700" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav strip */}
      <div className="lg:hidden flex overflow-x-auto border-t border-slate-100 dark:border-slate-800 px-3 py-2 gap-2 text-xs font-medium scrollbar-none bg-white dark:bg-slate-900">
        {userRole === 'instructor' && (
          <button
            onClick={() => setCurrentTab('instructor')}
            className={`px-2.5 py-1 rounded-md shrink-0 font-bold ${
              currentTab === 'instructor' ? 'bg-[#39A900] text-white' : 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60'
            }`}
          >
            Panel Instructor
          </button>
        )}
        <button
          onClick={() => setCurrentTab('modules')}
          className={`px-2.5 py-1 rounded-md shrink-0 ${
            currentTab === 'modules' ? 'bg-[#FC7323] text-white' : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800'
          }`}
        >
          Ruta
        </button>
        <button
          onClick={() => setCurrentTab('regulation')}
          className={`px-2.5 py-1 rounded-md shrink-0 ${
            currentTab === 'regulation' ? 'bg-[#FC7323] text-white' : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800'
          }`}
        >
          Reglamento
        </button>
        <button
          onClick={() => setCurrentTab('simulator')}
          className={`px-2.5 py-1 rounded-md shrink-0 ${
            currentTab === 'simulator' ? 'bg-[#FC7323] text-white' : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800'
          }`}
        >
          Simulador
        </button>
        <button
          onClick={() => setCurrentTab('evaluation')}
          className={`px-2.5 py-1 rounded-md shrink-0 ${
            currentTab === 'evaluation' ? 'bg-[#FC7323] text-white' : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800'
          }`}
        >
          Evaluación
        </button>
        <button
          onClick={() => setCurrentTab('certificate')}
          className={`px-2.5 py-1 rounded-md shrink-0 ${
            currentTab === 'certificate' ? 'bg-[#FC7323] text-white' : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800'
          }`}
        >
          Certificado
        </button>

        {userRole === 'instructor' && (
          <button
            onClick={onOpenDriveSync}
            className="px-2.5 py-1 rounded-md shrink-0 text-white bg-[#39A900] flex items-center gap-1 font-semibold"
          >
            <FileSpreadsheet className="w-3 h-3" />
            <span>Drive</span>
          </button>
        )}

        {onLogoutToLanding && (
          <button
            onClick={onLogoutToLanding}
            className="px-2.5 py-1 rounded-md shrink-0 text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 flex items-center gap-1 font-semibold"
            title="Salir / Cambiar Rol"
          >
            <LogOut className="w-3 h-3 text-rose-500" />
            <span>Salir</span>
          </button>
        )}
      </div>
    </header>
  );
};
