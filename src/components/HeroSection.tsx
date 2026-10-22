import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Award, BookOpen, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { BADGES } from '../data/senaData';

interface HeroSectionProps {
  progressPercentage: number;
  xp: number;
  completedLessonsCount: number;
  totalLessonsCount: number;
  unlockedBadges: string[];
  isCertified: boolean;
  onStartRoute: () => void;
  onOpenSimulator: () => void;
  onOpenCertificate: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  progressPercentage,
  xp,
  completedLessonsCount,
  totalLessonsCount,
  unlockedBadges,
  isCertified,
  onStartRoute,
  onOpenSimulator,
  onOpenCertificate,
}) => {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading and Value proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <span className="text-[#FC7323] font-bold">{t('hero.sena_tag', 'Servicio Nacional de Aprendizaje')}</span>
              <span aria-hidden="true">·</span>
              <span>{t('hero.induction_tag', 'Inducción Integral 2026')}</span>
              <span aria-hidden="true">·</span>
              <span>{t('hero.accord_tag', 'Acuerdo 0009 de 2024 (Vigente)')}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {t('hero.title', 'Apropia tus derechos, deberes y el reglamento SENA con orgullo')}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              {t('hero.desc', 'Vive una experiencia de inducción interactiva y gamificada. Resuelve casos reales de convivencia, supera los retos de formación y genera tu certificado oficial de inducción al completar el programa.')}
            </p>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onStartRoute}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#FC7323] hover:bg-[#e05e10] active:scale-[0.99] rounded-xl transition-all shadow-sm"
              >
                <span>{completedLessonsCount > 0 ? t('hero.btn_continue', 'Continuar Ruta de Formación') : t('hero.btn_start', 'Iniciar Inducción')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenSimulator}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-[#39A900]" />
                <span>{t('hero.btn_sim', 'Simulador de Casos')}</span>
              </button>

              {isCertified && (
                <button
                  onClick={onOpenCertificate}
                  className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800/80 rounded-xl transition-colors"
                >
                  <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{t('hero.btn_cert', 'Ver Mi Certificado')}</span>
                </button>
              )}
            </div>

            {/* Progress indicators strip */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Progreso de Ruta</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                    {progressPercentage}%
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    ({completedLessonsCount}/{totalLessonsCount})
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Puntos de Experiencia</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl sm:text-2xl font-bold text-[#FC7323] font-mono tabular-nums">
                    {xp}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">XP</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Insignias Ganadas</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                    {unlockedBadges.length}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">/ {BADGES.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual hero image with subtle stats overlay */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md bg-slate-900 group">
              <img
                src="/src/assets/images/sena_induction_hero_1792526787772.jpg"
                alt="Aprendices SENA en ambiente de formación integral"
                referrerPolicy="no-referrer"
                className="w-full h-72 sm:h-84 lg:h-96 object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Módulos de Inducción Institucional</span>
                  <span className="text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> 40 Horas Certificables
                  </span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#39A900] h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-300 mt-2">
                  Reglamento del Aprendiz SENA · Garantías, responsabilidades y debido proceso en la FPI.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Item Feature Strip */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-start gap-2.5">
            <BookOpen className="w-4 h-4 text-[#FC7323] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Reglamento Vigente</p>
              <p className="text-slate-500 dark:text-slate-400">Acuerdo 0009 de 2024 (Diario Oficial 52.947).</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#39A900] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Derechos y Deberes</p>
              <p className="text-slate-500 dark:text-slate-400">Conoce tus garantías y responsabilidades claras.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#FC7323] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Evaluación Gamificada</p>
              <p className="text-slate-500 dark:text-slate-400">Preguntas interactivas con casos reales y puntos.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Award className="w-4 h-4 text-[#39A900] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">Certificado Oficial</p>
              <p className="text-slate-500 dark:text-slate-400">Genera y descarga tu constancia con código QR.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
