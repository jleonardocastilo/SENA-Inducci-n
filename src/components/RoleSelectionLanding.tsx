import React, { useState } from 'react';
import { SenaEmblem } from './SenaEmblem';
import {
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  KeyRound,
  AlertCircle,
  Sun,
  Moon,
  Building2,
  FileCheck2,
  Users,
  Sparkles,
  Lock,
  CheckCircle2,
  BookOpen,
  Video
} from 'lucide-react';
import { VideoModal } from './VideoModal';
import { LearnerProfile, DEFAULT_PROFILE } from '../data/senaData';

interface RoleSelectionLandingProps {
  onSelectLearner: (profile: LearnerProfile) => void;
  onSelectInstructor: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  initialRole?: 'aprendiz' | 'instructor';
}

const PROGRAM_PRESETS = [
  'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
  'Tecnólogo en Gestión Empresarial',
  'Tecnólogo en Mantenimiento Electromecánico Industrial',
  'Técnico en Sistemas y Redes de Computadores',
  'Técnico en Cocina y Gastronomía Colombiana',
  'Tecnólogo en Animación 3D y Contenidos Digitales',
  'Tecnólogo en Gestión de Redes de Datos',
  'Técnico en Contabilización de Operaciones Comerciales'
];

const REGIONAL_PRESETS = [
  'Regional Distrito Capital',
  'Regional Antioquia',
  'Regional Valle',
  'Regional Atlántico',
  'Regional Santander',
  'Regional Cundinamarca',
  'Regional Caldas',
  'Regional Bolívar',
  'Regional Risaralda'
];

const INSTRUCTOR_PIN = 'SENA1234';

export const RoleSelectionLanding: React.FC<RoleSelectionLandingProps> = ({
  onSelectLearner,
  onSelectInstructor,
  isDarkMode,
  onToggleDarkMode,
  initialRole = 'aprendiz'
}) => {
  const [selectedTab, setSelectedTab] = useState<'aprendiz' | 'instructor'>(initialRole);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Apprentice Characterization Form State
  const [learnerForm, setLearnerForm] = useState<LearnerProfile>(() => {
    const saved = localStorage.getItem('sena_learner_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_PROFILE;
      }
    }
    return DEFAULT_PROFILE;
  });

  // Instructor Form State
  const [instructorKey, setInstructorKey] = useState('');
  const [instructorError, setInstructorError] = useState(false);

  const handleLearnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSelectLearner(learnerForm);
  };

  const handleInstructorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (instructorKey.trim().toUpperCase() === INSTRUCTOR_PIN) {
      setInstructorError(false);
      onSelectInstructor();
    } else {
      setInstructorError(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300">
      {/* Top Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <SenaEmblem size={57} className="w-[57px] h-[57px] shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  SENA <span className="text-[#FC7323]">Inducción</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold">
                  Acuerdo 0009 de 2024
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sistema Integrado de Inducción Institucional y Certificación
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="p-2 text-slate-600 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-xl border border-emerald-200 dark:border-emerald-800 transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#39A900] cursor-pointer"
              title="Ver video tutorial"
            >
              <Video className="w-5 h-5" />
            </button>
            <button
              onClick={onToggleDarkMode}
              aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="p-2 text-slate-600 dark:text-amber-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#FC7323] cursor-pointer"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 transition-transform duration-300 rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="w-5 h-5 transition-transform duration-300 rotate-0 hover:-rotate-12 text-slate-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
        {/* Banner Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-8 pt-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FC7323] uppercase tracking-wider bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-900/60">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Portal de Acceso Diferenciado</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            ¿Cómo deseas ingresar a la plataforma?
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Selecciona tu rol para acceder a tu entorno correspondiente. Los aprendices realizan su inducción sin clave y los instructores acceden con la clave autorizada.
          </p>
        </div>

        {/* Role Selector Tabs (Mobile & Quick Toggle) */}
        <div className="flex items-center justify-center p-1.5 bg-slate-200/80 dark:bg-slate-800 rounded-2xl max-w-md w-full mb-8 shadow-inner">
          <button
            onClick={() => setSelectedTab('aprendiz')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              selectedTab === 'aprendiz'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-[#FC7323]" />
            <span>Soy Aprendiz</span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">(Sin clave)</span>
          </button>

          <button
            onClick={() => setSelectedTab('instructor')}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              selectedTab === 'instructor'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#39A900]" />
            <span>Soy Instructor</span>
          </button>
        </div>

        {/* Role Panel Form Container */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* APRENDIZ TAB */}
          {selectedTab === 'aprendiz' && (
            <div className="md:col-span-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-amber-500/10 via-emerald-500/5 to-transparent">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#FC7323] text-white flex items-center justify-center shadow-md shrink-0">
                      <GraduationCap className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                          Ingreso para Aprendices
                        </h2>
                        <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
                          Sin contraseña
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                        Diligencia tus datos de caracterización para registrar tu avance y generar tu Certificado Oficial de 40 Horas.
                      </p>
                    </div>
                  </div>

                  <div className="hidden lg:flex flex-col text-right text-xs text-slate-500 font-medium">
                    <span>Reglamento Vigente</span>
                    <strong className="text-slate-900 dark:text-slate-200">Acuerdo 0009 de 2024</strong>
                  </div>
                </div>
              </div>

              <form onSubmit={handleLearnerSubmit} className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                      Nombre Completo del Aprendiz *
                    </label>
                    <input
                      type="text"
                      required
                      value={learnerForm.fullName}
                      onChange={(e) => setLearnerForm({ ...learnerForm, fullName: e.target.value })}
                      placeholder="Ej: Juan Leonardo Castillo"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FC7323]"
                    />
                  </div>

                  {/* Document Type & Number */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                      Tipo de Documento *
                    </label>
                    <select
                      value={learnerForm.documentType}
                      onChange={(e) =>
                        setLearnerForm({
                          ...learnerForm,
                          documentType: e.target.value as 'C.C.' | 'T.I.' | 'P.E.P.' | 'C.E.'
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FC7323]"
                    >
                      <option value="C.C.">Cédula de Ciudadanía (C.C.)</option>
                      <option value="T.I.">Tarjeta de Identidad (T.I.)</option>
                      <option value="C.E.">Cédula de Extranjería (C.E.)</option>
                      <option value="P.E.P.">Permiso Especial (P.E.P.)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                      Número de Documento *
                    </label>
                    <input
                      type="text"
                      required
                      value={learnerForm.documentNumber}
                      onChange={(e) => setLearnerForm({ ...learnerForm, documentNumber: e.target.value })}
                      placeholder="Ej: 1.025.789.450"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FC7323]"
                    />
                  </div>

                  {/* Record Number (Ficha) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                      Número de Ficha de Caracterización *
                    </label>
                    <input
                      type="text"
                      required
                      value={learnerForm.recordNumber}
                      onChange={(e) => setLearnerForm({ ...learnerForm, recordNumber: e.target.value })}
                      placeholder="Ej: 2824910"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FC7323]"
                    />
                  </div>

                  {/* Modality */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                      Modalidad de Formación
                    </label>
                    <select
                      value={learnerForm.modality}
                      onChange={(e) =>
                        setLearnerForm({
                          ...learnerForm,
                          modality: e.target.value as 'Presencial' | 'Virtual' | 'Combinada'
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FC7323]"
                    >
                      <option value="Presencial">Presencial</option>
                      <option value="Virtual">Virtual</option>
                      <option value="Combinada">Combinada (B-Learning)</option>
                    </select>
                  </div>

                  {/* Training Program */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                      Programa de Formación
                    </label>
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        required
                        value={learnerForm.trainingProgram}
                        onChange={(e) => setLearnerForm({ ...learnerForm, trainingProgram: e.target.value })}
                        list="programs-list"
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FC7323]"
                      />
                      <datalist id="programs-list">
                        {PROGRAM_PRESETS.map((p, i) => (
                          <option key={i} value={p} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  {/* Regional */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                      Regional SENA
                    </label>
                    <select
                      value={learnerForm.regional}
                      onChange={(e) => setLearnerForm({ ...learnerForm, regional: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FC7323]"
                    >
                      {REGIONAL_PRESETS.map((r, i) => (
                        <option key={i} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Training Center */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide mb-1.5">
                      Centro de Formación
                    </label>
                    <input
                      type="text"
                      required
                      value={learnerForm.trainingCenter}
                      onChange={(e) => setLearnerForm({ ...learnerForm, trainingCenter: e.target.value })}
                      placeholder="Ej: Centro de Electricidad, Electrónica y Telecomunicaciones (CEET)"
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#FC7323]"
                    />
                  </div>
                </div>

                {/* Submit Row */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Tu progreso y certificado se sincronizarán de forma segura y automática.</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#FC7323] hover:bg-[#e05e10] text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer"
                  >
                    <span>Iniciar Mi Inducción SENA</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* INSTRUCTOR TAB */}
          {selectedTab === 'instructor' && (
            <div className="md:col-span-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-emerald-500/10 via-slate-500/5 to-transparent">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#39A900] text-white flex items-center justify-center shadow-md shrink-0">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                          Acceso de Instructor / Coordinador
                        </h2>
                        <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
                          Requiere Clave
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                        Supervisa el avance de la cohorte, administra la hoja de cálculo en Google Drive y exporta informes.
                      </p>
                    </div>
                  </div>

                  <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl">
                    <Lock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Clave Requerida: <strong>SENA1234</strong></span>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Instructor Privileges Overview */}
                  <div className="lg:col-span-7 space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      Privilegios Exclusivos del Perfil de Instructor:
                    </h3>

                    <ul className="space-y-2.5">
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0 mt-0.5" />
                        <span>
                          <strong>Monitoreo en vivo de fichas:</strong> Visualiza calificaciones, estado de aprobación (80%+) y códigos de certificación de todos los aprendices.
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0 mt-0.5" />
                        <span>
                          <strong>Control total de Google Drive:</strong> Acceso y sincronización directa con la hoja oficial <em>&quot;SENA - Registro Oficial de Inducción de Aprendices&quot;</em>.
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0 mt-0.5" />
                        <span>
                          <strong>Exportación y Webhooks:</strong> Descarga inmediata de planillas en CSV/Excel y configuración de Webhooks para Google Apps Script.
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0 mt-0.5" />
                        <span>
                          <strong>Generador de Enlace para Aprendices:</strong> Comparte un enlace directo que bloquea las pantallas de configuración para los estudiantes.
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Password Form Box */}
                  <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-4">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                      <KeyRound className="w-4 h-4 text-[#39A900]" />
                      <span>Ingreso con Clave de Instructor</span>
                    </div>

                    <form onSubmit={handleInstructorSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Clave de Acceso (SENA1234):
                        </label>
                        <input
                          type="password"
                          required
                          value={instructorKey}
                          onChange={(e) => {
                            setInstructorKey(e.target.value);
                            setInstructorError(false);
                          }}
                          placeholder="Ingresa SENA1234"
                          autoFocus
                          className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                        />
                      </div>

                      {instructorError && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200 text-xs border border-rose-200 dark:border-rose-900">
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>Clave incorrecta. Por favor escribe <strong>SENA1234</strong>.</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#39A900] hover:bg-[#329600] text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.99] cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Ingresar al Panel de Instructor</span>
                      </button>

                      <p className="text-[11px] text-center text-slate-400">
                        Clave predeterminada asignada: <strong className="text-slate-700 dark:text-slate-300 font-mono">SENA1234</strong>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900/60 transition-colors">
        <p>
          Servicio Nacional de Aprendizaje SENA · Inducción Integral de Aprendices · Acuerdo 0009 de 2024
        </p>
      </footer>

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoSrc="/assets/aistudio/2026__16_27_72d306bd.mp4"
      />
    </div>
  );
};
