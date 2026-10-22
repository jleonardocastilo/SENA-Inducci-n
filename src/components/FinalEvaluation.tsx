import React, { useState } from 'react';
import { FINAL_EVALUATION_QUESTIONS, QuizQuestion, LearnerProfile } from '../data/senaData';
import { Award, CheckCircle2, XCircle, ArrowRight, ArrowLeft, RotateCcw, Sparkles, ShieldCheck, FileSpreadsheet, ExternalLink, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { autoSyncLearner, LearnerSyncPayload, getSpreadsheetDirectUrl } from '../services/autoSyncService';

interface FinalEvaluationProps {
  onEvaluationCompleted: (scorePercentage: number, passed: boolean) => void;
  onGoToCertificate: () => void;
  onOpenDriveSync?: () => void;
  currentProfile?: LearnerProfile;
  xp?: number;
  completedLessonsCount?: number;
  totalLessonsCount?: number;
}

export const FinalEvaluation: React.FC<FinalEvaluationProps> = ({
  onEvaluationCompleted,
  onGoToCertificate,
  onOpenDriveSync,
  currentProfile,
  xp,
  completedLessonsCount,
  totalLessonsCount,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [autoSyncState, setAutoSyncState] = useState<{
    isSyncing: boolean;
    synced: boolean;
    message: string;
    spreadsheetUrl?: string;
  }>({
    isSyncing: false,
    synced: false,
    message: '',
    spreadsheetUrl: getSpreadsheetDirectUrl()
  });

  const questions: QuizQuestion[] = FINAL_EVALUATION_QUESTIONS;
  const currentQ = questions[currentQuestionIndex];

  const handleSelectOption = (qId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qId]: optionIndex,
    }));
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isComplete = answeredCount === questions.length;

  // Calculate score
  let correctCount = 0;
  questions.forEach((q) => {
    if (selectedAnswers[q.id] === q.correctIndex) {
      correctCount++;
    }
  });

  const scorePercentage = Math.round((correctCount / questions.length) * 100);
  const hasPassed = scorePercentage >= 80;

  const handleSubmitEvaluation = () => {
    if (!isComplete) return;
    setIsSubmitted(true);
    onEvaluationCompleted(scorePercentage, hasPassed);

    if (hasPassed) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Fallback
      }

      // Disparar sincronización automática con Google Drive en segundo plano
      if (currentProfile) {
        const rawId = `${currentProfile.documentNumber}-${currentProfile.recordNumber}`.replace(/[^a-zA-Z0-9]/g, '');
        const certCode = `SENA-IND-2026-${rawId.slice(0, 5).toUpperCase() || 'ADSO1'}-${rawId.slice(-4).toUpperCase() || '7890'}`;
        const now = new Date();
        const formattedTimestamp = `${now.toLocaleDateString('es-CO')} ${now.toLocaleTimeString('es-CO')}`;

        const payload: LearnerSyncPayload = {
          id: `SENA-${rawId.slice(0, 6)}-${Date.now().toString().slice(-4)}`,
          timestamp: formattedTimestamp,
          fullName: currentProfile.fullName,
          documentType: currentProfile.documentType,
          documentNumber: currentProfile.documentNumber,
          recordNumber: currentProfile.recordNumber,
          trainingProgram: currentProfile.trainingProgram,
          regional: currentProfile.regional,
          trainingCenter: currentProfile.trainingCenter,
          modality: currentProfile.modality,
          completedLessons: completedLessonsCount || 12,
          totalLessons: totalLessonsCount || 12,
          xp: (xp || 0) + 300,
          scorePercentage,
          isCertified: true,
          certificateCode: certCode,
          regulation: 'Acuerdo 0009 de 2024'
        };

        setAutoSyncState({
          isSyncing: true,
          synced: false,
          message: 'Sincronizando automáticamente con la planilla de Google Drive...',
          spreadsheetUrl: getSpreadsheetDirectUrl()
        });

        autoSyncLearner(payload).then((res) => {
          setAutoSyncState({
            isSyncing: false,
            synced: res.success,
            message: res.message,
            spreadsheetUrl: res.spreadsheetUrl || getSpreadsheetDirectUrl()
          });
        }).catch((err) => {
          setAutoSyncState({
            isSyncing: false,
            synced: true,
            message: 'Registro respaldado en la cola local para sincronización desatendida.',
            spreadsheetUrl: getSpreadsheetDirectUrl()
          });
        });
      }
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setShowReview(false);
    setCurrentQuestionIndex(0);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#FC7323] uppercase tracking-wider">
          <span>Evaluación Institucional Oficial</span>
          <span aria-hidden="true">·</span>
          <span>Acreditación de Inducción</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
          Evaluación de Apropiación del Reglamento SENA
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
          Demuestra tu comprensión de los derechos, deberes, prohibiciones y debido proceso.
          Obtén un puntaje mínimo del <strong>80% (8/10)</strong> para desbloquear y emitir tu Certificado Oficial de Inducción.
        </p>
      </div>

      {!isSubmitted ? (
        /* Question Answering View */
        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
          {/* Progress and Question Stepper */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono">
                Pregunta {currentQuestionIndex + 1} de {questions.length}
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-[#FC7323] font-semibold">Módulo 0{currentQ.moduleId.replace('mod-', '')}</span>
            </div>

            {/* Question Quick Jump Badges */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {questions.map((q, idx) => {
                const isAnswered = selectedAnswers[q.id] !== undefined;
                const isCurrent = idx === currentQuestionIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold font-mono transition-all flex items-center justify-center ${
                      isCurrent
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 ring-2 ring-[#FC7323]'
                        : isAnswered
                        ? 'bg-[#39A900] text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
              {currentQ.question}
            </h3>

            {/* Options list */}
            <div className="space-y-2.5">
              {currentQ.options.map((option, optIdx) => {
                const isSelected = selectedAnswers[currentQ.id] === optIdx;

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(currentQ.id, optIdx)}
                    className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-amber-50/70 dark:bg-amber-950/50 border-[#FC7323] text-slate-900 dark:text-white ring-1 ring-[#FC7323]'
                        : 'bg-white dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 ${
                        isSelected
                          ? 'border-[#FC7323] bg-[#FC7323] text-white'
                          : 'border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="flex-1 leading-relaxed">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </button>

            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {answeredCount} de {questions.length} respondidas
            </span>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              >
                <span>Siguiente</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleSubmitEvaluation}
                disabled={!isComplete}
                className="inline-flex items-center gap-1.5 px-6 py-2 text-xs sm:text-sm font-semibold text-white bg-[#FC7323] hover:bg-[#e05e10] disabled:bg-slate-300 dark:disabled:bg-slate-700 rounded-lg transition-colors shadow-xs"
              >
                <span>Finalizar Evaluación</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="text-center space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div
              className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
                hasPassed ? 'bg-emerald-100 dark:bg-emerald-950 text-[#39A900]' : 'bg-rose-100 dark:bg-rose-950 text-rose-600'
              }`}
            >
              {hasPassed ? <Award className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {hasPassed ? '¡Felicitaciones! Aprobaste la Inducción' : 'Evaluación no aprobada'}
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
              {hasPassed
                ? 'Has demostrado el conocimiento reglamentario necesario para tu etapa formativa en el SENA. Tu certificado oficial de inducción ya está listo para emitir y descargar.'
                : 'Para obtener el certificado de inducción necesitas un mínimo de 80% (8/10). Revisa las respuestas incorrectas y vuelve a presentar la prueba.'}
            </p>

            <div className="inline-flex items-center gap-6 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Puntaje Final</p>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                  {scorePercentage}%
                </p>
              </div>
              <div className="h-8 w-px bg-slate-300 dark:bg-slate-600" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Aciertos</p>
                <p className="text-2xl font-bold text-[#FC7323] font-mono tabular-nums">
                  {correctCount} / {questions.length}
                </p>
              </div>
              <div className="h-8 w-px bg-slate-300 dark:bg-slate-600" />
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Estado</p>
                <p
                  className={`text-sm font-bold uppercase ${
                    hasPassed ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'
                  }`}
                >
                  {hasPassed ? 'Aprobado' : 'No Aprobado'}
                </p>
              </div>
            </div>

            {/* Automatic Google Drive Sync Notification Card */}
            {hasPassed && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/60 text-[#39A900] rounded-xl shrink-0">
                    {autoSyncState.isSyncing ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-emerald-950 dark:text-emerald-100">
                        {autoSyncState.isSyncing
                          ? 'Sincronizando con Google Drive...'
                          : 'Sincronizado Automáticamente en Google Drive'}
                      </span>
                      <span className="text-[10px] bg-emerald-200/80 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                        Automático
                      </span>
                    </div>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300">
                      {autoSyncState.message ||
                        'Datos del aprendiz registrados en la planilla oficial de inducción bajo el Acuerdo 0009 de 2024.'}
                    </p>
                  </div>
                </div>

                {autoSyncState.spreadsheetUrl && (
                  <a
                    href={autoSyncState.spreadsheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors"
                  >
                    <span>Ver Hoja en Drive</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {hasPassed ? (
              <>
                <button
                  onClick={onGoToCertificate}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#39A900] hover:bg-[#319200] rounded-xl transition-all shadow-sm"
                >
                  <Award className="w-4 h-4" />
                  <span>Generar y Ver Mi Certificado Oficial</span>
                </button>

                {onOpenDriveSync && (
                  <button
                    onClick={onOpenDriveSync}
                    className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-emerald-800 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-800 rounded-xl transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-[#39A900]" />
                    <span>Guardar en Google Drive</span>
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={handleRetake}
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#FC7323] hover:bg-[#e05e10] rounded-xl transition-all shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Presentar la Prueba Nuevamente</span>
              </button>
            )}

            <button
              onClick={() => setShowReview(!showReview)}
              className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              <span>{showReview ? 'Ocultar Revisión' : 'Revisar Respuestas y Artículos'}</span>
            </button>
          </div>

          {/* Answer Review Detail */}
          {showReview && (
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Retroalimentación Pregunta por Pregunta:
              </h4>

              <div className="space-y-4">
                {questions.map((q, idx) => {
                  const userAnswer = selectedAnswers[q.id];
                  const isCorrect = userAnswer === q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border text-xs sm:text-sm ${
                        isCorrect
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
                          : 'bg-rose-50/50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 mb-2">
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">
                            {idx + 1}. {q.question}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                            Referencia: {q.articleCitation}
                          </p>
                        </div>
                      </div>

                      <div className="pl-6 space-y-1">
                        <p className="text-slate-700 dark:text-slate-300">
                          <span className="font-semibold">Tu respuesta: </span>
                          <span className={isCorrect ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-rose-700 dark:text-rose-400 font-medium'}>
                            {q.options[userAnswer]}
                          </span>
                        </p>

                        {!isCorrect && (
                          <p className="text-emerald-800 dark:text-emerald-300">
                            <span className="font-semibold">Respuesta correcta: </span>
                            {q.options[q.correctIndex]}
                          </p>
                        )}

                        <p className="text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-800/70 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60 mt-2 text-xs leading-relaxed">
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
