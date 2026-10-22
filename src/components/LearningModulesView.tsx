import React, { useState } from 'react';
import {
  LearningModule,
  ModuleLesson,
  LEARNING_MODULES
} from '../data/senaData';
import {
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Award,
  Sparkles,
  HelpCircle,
  Lightbulb,
  Building2,
  ShieldCheck,
  BookOpenCheck,
  Scale,
  ArrowRight
} from 'lucide-react';

interface LearningModulesViewProps {
  completedLessons: string[];
  onCompleteLesson: (lessonId: string, xpEarned: number) => void;
  onGoToSimulator: () => void;
  onGoToEvaluation: () => void;
}

export const LearningModulesView: React.FC<LearningModulesViewProps> = ({
  completedLessons,
  onCompleteLesson,
  onGoToSimulator,
  onGoToEvaluation,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(LEARNING_MODULES[0].id);
  const [selectedLessonId, setSelectedLessonId] = useState<string>(LEARNING_MODULES[0].lessons[0].id);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const activeModule = LEARNING_MODULES.find((m) => m.id === selectedModuleId) || LEARNING_MODULES[0];
  const activeLesson = activeModule.lessons.find((l) => l.id === selectedLessonId) || activeModule.lessons[0];

  const isLessonCompleted = completedLessons.includes(activeLesson.id);

  const handleSelectLesson = (lesson: ModuleLesson, moduleId: string) => {
    setSelectedModuleId(moduleId);
    setSelectedLessonId(lesson.id);
    setSelectedAnswerIndex(null);
    setQuizSubmitted(false);
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswerIndex === null) return;
    setQuizSubmitted(true);
    if (selectedAnswerIndex === activeLesson.quiz.correctIndex && !isLessonCompleted) {
      onCompleteLesson(activeLesson.id, 50);
    }
  };

  const getModuleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2':
        return <Building2 className="w-5 h-5" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5" />;
      case 'BookOpenCheck':
        return <BookOpenCheck className="w-5 h-5" />;
      case 'Scale':
        return <Scale className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const totalLessons = LEARNING_MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
  const isAllLessonsCompleted = completedLessons.length >= totalLessons;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#FC7323] uppercase tracking-wider">
            <span>Ruta Formativa de Inducción</span>
            <span aria-hidden="true">·</span>
            <span>4 Módulos Esenciales</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            Apropiación del Reglamento y Vida del Aprendiz
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Explora cada tema interactivo, responde las preguntas de comprobación y acumula puntos para tu certificación.
          </p>
        </div>

        {/* Global Progress pill */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0">
          <div className="text-right">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Progreso en Lecciones</span>
            <span className="text-sm font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {completedLessons.length} de {totalLessons} completadas
            </span>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-[#FC7323] font-mono">
            {Math.round((completedLessons.length / totalLessons) * 100)}%
          </div>
        </div>
      </div>

      {/* Module Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {LEARNING_MODULES.map((module) => {
          const moduleCompletedLessons = module.lessons.filter((l) => completedLessons.includes(l.id)).length;
          const isSelected = module.id === selectedModuleId;
          const isModuleDone = moduleCompletedLessons === module.lessons.length;

          return (
            <button
              key={module.id}
              onClick={() => {
                setSelectedModuleId(module.id);
                setSelectedLessonId(module.lessons[0].id);
                setSelectedAnswerIndex(null);
                setQuizSubmitted(false);
              }}
              className={`text-left p-4 rounded-xl border transition-all relative ${
                isSelected
                  ? 'bg-amber-50/70 dark:bg-amber-950/40 border-[#FC7323] dark:border-[#FC7323] shadow-xs ring-1 ring-[#FC7323]'
                  : 'bg-white dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`p-2 rounded-lg ${isSelected ? 'bg-[#FC7323] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                  {getModuleIcon(module.iconName)}
                </span>
                {isModuleDone ? (
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Listo
                  </span>
                ) : (
                  <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
                    {moduleCompletedLessons}/{module.lessons.length}
                  </span>
                )}
              </div>

              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 block mb-0.5">
                Módulo 0{module.number}
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">
                {module.shortTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                {module.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Two-Zone Interactive Learning Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Lesson Navigator for Active Module */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
              Contenido de Módulo 0{activeModule.number}
            </span>
            <h4 className="font-bold text-slate-900 dark:text-white text-base mt-0.5">{activeModule.title}</h4>
          </div>

          <div className="space-y-2">
            {activeModule.lessons.map((lesson, idx) => {
              const isSelected = lesson.id === activeLesson.id;
              const isDone = completedLessons.includes(lesson.id);

              return (
                <button
                  key={lesson.id}
                  onClick={() => handleSelectLesson(lesson, activeModule.id)}
                  className={`w-full text-left p-3 rounded-lg border text-sm transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-slate-800 text-white border-slate-900 dark:border-slate-700'
                      : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-[#FC7323] text-white'
                          : isDone
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <p className={`font-semibold line-clamp-2 leading-snug ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        {lesson.title}
                      </p>
                      <p className={`text-xs mt-0.5 ${isSelected ? 'text-slate-300 dark:text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
                        {lesson.articleReference || 'Reglamento SENA'}
                      </p>
                    </div>
                  </div>

                  {isDone && (
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 mt-1 ${isSelected ? 'text-emerald-400' : 'text-emerald-600 dark:text-emerald-400'}`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Prompt to Simulator & Evaluation */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <button
              onClick={onGoToSimulator}
              className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#39A900]" />
                <span>Practicar en Simulador de Casos</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onGoToEvaluation}
              className="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold text-[#FC7323] bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800/60 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>Ir a la Evaluación Final</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Side: Active Lesson Reader & Interactive Check */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          {/* Header of lesson */}
          <div className="border-b border-slate-100 pb-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-1">
              <span className="text-[#FC7323] font-semibold">{activeModule.shortTitle}</span>
              <span aria-hidden="true">·</span>
              <span>{activeLesson.articleReference}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-amber-600">
                <Sparkles className="w-3 h-3" /> +50 XP al completar
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {activeLesson.title}
            </h3>
          </div>

          {/* Lesson Summary */}
          <div className="prose text-slate-700 dark:text-slate-200 text-sm leading-relaxed">
            <p className="text-base text-slate-800 dark:text-slate-100 font-medium bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
              {activeLesson.summary}
            </p>
          </div>

          {/* Key Points */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#39A900]" />
              <span>Aspectos Clave del Reglamento</span>
            </h4>
            <div className="grid grid-cols-1 gap-2.5">
              {activeLesson.keyPoints.map((point, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700/60 text-xs sm:text-sm text-slate-700 dark:text-slate-200"
                >
                  <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center font-mono text-xs shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Practical Advice from Instructor */}
          <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm">
            <div className="flex items-center gap-2 font-bold mb-1">
              <Lightbulb className="w-4 h-4 text-[#39A900]" />
              <span>Consejo del Instructor SENA</span>
            </div>
            <p className="text-emerald-800 dark:text-emerald-300 leading-relaxed">{activeLesson.practicalAdvice}</p>
          </div>

          {/* Gamified Micro-Quiz Check */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#FC7323]" />
                <span>Comprobación Rápida de Aprendizaje</span>
              </h4>
              {isLessonCompleted && (
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                  ✓ Lección Superada
                </span>
              )}
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <p className="font-semibold text-slate-900 dark:text-white text-sm">
                {activeLesson.quiz.question}
              </p>

              <div className="space-y-2">
                {activeLesson.quiz.options.map((option, idx) => {
                  const isSelected = selectedAnswerIndex === idx;
                  const isCorrect = idx === activeLesson.quiz.correctIndex;

                  let optionStyle = 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600';
                  if (quizSubmitted) {
                    if (isCorrect) {
                      optionStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-medium ring-1 ring-emerald-500';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-900 dark:text-rose-200 font-medium';
                    }
                  } else if (isSelected) {
                    optionStyle = 'bg-amber-50 dark:bg-amber-950/50 border-[#FC7323] text-slate-900 dark:text-white ring-1 ring-[#FC7323]';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (!quizSubmitted) {
                          setSelectedAnswerIndex(idx);
                        }
                      }}
                      disabled={quizSubmitted}
                      className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm transition-all flex items-center gap-3 ${optionStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs font-mono shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>

              {/* Submit or Result Action */}
              {!quizSubmitted ? (
                <button
                  onClick={handleAnswerSubmit}
                  disabled={selectedAnswerIndex === null}
                  className="mt-2 w-full sm:w-auto px-5 py-2 text-xs font-semibold text-white bg-[#FC7323] hover:bg-[#e05e10] disabled:bg-slate-300 dark:disabled:bg-slate-700 rounded-lg transition-colors"
                >
                  Verificar Respuesta (+50 XP)
                </button>
              ) : (
                <div className="pt-2">
                  <div
                    className={`p-3 rounded-lg text-xs sm:text-sm ${
                      selectedAnswerIndex === activeLesson.quiz.correctIndex
                        ? 'bg-emerald-100/70 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-rose-100/70 dark:bg-rose-950/70 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
                    }`}
                  >
                    <p className="font-bold">
                      {selectedAnswerIndex === activeLesson.quiz.correctIndex
                        ? '¡Respuesta Correcta! Ganaste +50 XP.'
                        : 'Respuesta Incorrecta. Revisa el reglamento:'}
                    </p>
                    <p className="mt-1 leading-relaxed">{activeLesson.quiz.explanation}</p>
                  </div>

                  <div className="mt-3 flex gap-2">
                    {selectedAnswerIndex !== activeLesson.quiz.correctIndex && (
                      <button
                        onClick={() => {
                          setQuizSubmitted(false);
                          setSelectedAnswerIndex(null);
                        }}
                        className="px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        Intentar de nuevo
                      </button>
                    )}

                    {/* Next lesson button if available */}
                    {(() => {
                      const currentIdx = activeModule.lessons.findIndex((l) => l.id === activeLesson.id);
                      if (currentIdx < activeModule.lessons.length - 1) {
                        const nextLesson = activeModule.lessons[currentIdx + 1];
                        return (
                          <button
                            onClick={() => handleSelectLesson(nextLesson, activeModule.id)}
                            className="inline-flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors ml-auto"
                          >
                            <span>Siguiente Lección</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        );
                      }
                      return null;
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
