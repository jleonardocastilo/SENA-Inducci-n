import React, { useState } from 'react';
import { DILEMMA_SCENARIOS, DilemmaScenario } from '../data/senaData';
import { ShieldCheck, Award, AlertTriangle, CheckCircle2, XCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CaseSimulatorProps {
  onEarnXP: (amount: number) => void;
  onGoToEvaluation: () => void;
}

export const CaseSimulator: React.FC<CaseSimulatorProps> = ({ onEarnXP, onGoToEvaluation }) => {
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [resolvedCases, setResolvedCases] = useState<Record<string, { optionId: string; points: number }>>({});
  const [totalSimulatorScore, setTotalSimulatorScore] = useState(0);

  const currentCase: DilemmaScenario = DILEMMA_SCENARIOS[currentCaseIndex];
  const isCaseResolved = !!resolvedCases[currentCase.id];
  const selectedOption = currentCase.options.find((opt) => opt.id === (isCaseResolved ? resolvedCases[currentCase.id].optionId : selectedOptionId));

  const handleSelectOption = (optionId: string) => {
    if (isCaseResolved) return;
    setSelectedOptionId(optionId);
  };

  const handleSubmitDecision = () => {
    if (!selectedOptionId || isCaseResolved) return;

    const option = currentCase.options.find((o) => o.id === selectedOptionId);
    if (!option) return;

    const points = option.points;
    setResolvedCases((prev) => ({
      ...prev,
      [currentCase.id]: { optionId: selectedOptionId, points },
    }));

    setTotalSimulatorScore((prev) => prev + points);
    onEarnXP(Math.max(0, points));

    if (option.isCorrect) {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {
        // Safe fallback
      }
    }
  };

  const handleNextCase = () => {
    if (currentCaseIndex < DILEMMA_SCENARIOS.length - 1) {
      setCurrentCaseIndex((prev) => prev + 1);
      setSelectedOptionId(null);
    }
  };

  const handleResetSimulator = () => {
    setResolvedCases({});
    setCurrentCaseIndex(0);
    setSelectedOptionId(null);
  };

  const totalResolvedCount = Object.keys(resolvedCases).length;
  const allResolved = totalResolvedCount === DILEMMA_SCENARIOS.length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#FC7323] uppercase tracking-wider">
            <span>Simulador de Casos Prácticos</span>
            <span aria-hidden="true">·</span>
            <span>Toma de Decisiones Éticas</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
            Dilemas Reales del Reglamento SENA
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Enfréntate a situaciones cotidianas en centros de formación, talleres y proyectos.
            Toma la decisión reglamentaria correcta para ganar puntos de experiencia.
          </p>
        </div>

        {/* Score Card */}
        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shrink-0">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Casos Resueltos</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {totalResolvedCount} / {DILEMMA_SCENARIOS.length}
            </p>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Puntaje Simulador</p>
            <p className="text-sm font-bold text-[#FC7323] font-mono tabular-nums flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> +{totalSimulatorScore} pts
            </p>
          </div>
        </div>
      </div>

      {/* Case Navigator Stepper */}
      <div className="flex items-center gap-2 overflow-x-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
        {DILEMMA_SCENARIOS.map((c, idx) => {
          const isDone = !!resolvedCases[c.id];
          const isCurrent = idx === currentCaseIndex;
          const wasSuccess = isDone && resolvedCases[c.id].points > 0;

          return (
            <button
              key={c.id}
              onClick={() => {
                setCurrentCaseIndex(idx);
                setSelectedOptionId(resolvedCases[c.id]?.optionId || null);
              }}
              className={`flex-1 min-w-[120px] py-2 px-3 rounded-lg text-xs font-semibold text-center transition-all ${
                isCurrent
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5">
                {isDone ? (
                  wasSuccess ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  )
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 shrink-0" />
                )}
                <span className="truncate">Caso {idx + 1}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Dilemma Card */}
      <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xs">
        {/* Scenario Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono">Caso #{currentCaseIndex + 1}</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#FC7323] font-semibold">{currentCase.category}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-600 dark:text-slate-300">{currentCase.character}</span>
          </div>

          <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
            Recompensa: +150 XP
          </span>
        </div>

        {/* Story context */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">{currentCase.title}</h3>
          <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
            {currentCase.context}
          </p>

          <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/70 text-xs sm:text-sm text-amber-950 dark:text-amber-200 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#FC7323] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">El dilema ético: </span>
              <span>{currentCase.dilemma}</span>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            ¿Qué decisión reglamentaria debe tomarse?
          </h4>

          <div className="space-y-2.5">
            {currentCase.options.map((option, optIdx) => {
              const isSelected = (isCaseResolved ? resolvedCases[currentCase.id].optionId : selectedOptionId) === option.id;
              
              let cardStyle = 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 text-slate-800 dark:text-slate-200';
              if (isCaseResolved) {
                if (option.isCorrect) {
                  cardStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-950 dark:text-emerald-100 ring-1 ring-emerald-500';
                } else if (isSelected && !option.isCorrect) {
                  cardStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-950 dark:text-rose-100';
                }
              } else if (isSelected) {
                cardStyle = 'bg-amber-50/60 dark:bg-amber-950/50 border-[#FC7323] ring-1 ring-[#FC7323] text-slate-900 dark:text-white';
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  disabled={isCaseResolved}
                  className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${cardStyle}`}
                >
                  <span className="w-6 h-6 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs font-mono shrink-0 mt-0.5">
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="flex-1 leading-relaxed">{option.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Decision Submission / Consequence Debrief */}
        {!isCaseResolved ? (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={handleSubmitDecision}
              disabled={!selectedOptionId}
              className="px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#FC7323] hover:bg-[#e05e10] disabled:bg-slate-300 dark:disabled:bg-slate-700 rounded-xl transition-colors shadow-xs"
            >
              Confirmar Decisión
            </button>
          </div>
        ) : (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
            {/* Feedback box */}
            {selectedOption && (
              <div
                className={`p-4 rounded-xl text-xs sm:text-sm ${
                  selectedOption.isCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-rose-50 dark:bg-rose-950/60 text-rose-950 dark:text-rose-100 border border-rose-200 dark:border-rose-800'
                }`}
              >
                <div className="flex items-center gap-2 font-bold mb-1">
                  {selectedOption.isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Decisión Reglamentaria Correcta (+{selectedOption.points} XP)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      <span>Infracción o Error de Procedimiento ({selectedOption.points} XP)</span>
                    </>
                  )}
                </div>
                <p className="leading-relaxed">{selectedOption.consequence}</p>
                <p className="mt-2 text-xs font-mono font-semibold opacity-90">
                  Fundamento Normativo: {selectedOption.articleApplied}
                </p>
              </div>
            )}

            {/* Stepper controls */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {currentCaseIndex + 1} de {DILEMMA_SCENARIOS.length} casos
              </span>

              <div className="flex items-center gap-2">
                {currentCaseIndex < DILEMMA_SCENARIOS.length - 1 ? (
                  <button
                    onClick={handleNextCase}
                    className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                  >
                    <span>Siguiente Caso</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={onGoToEvaluation}
                    className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-[#FC7323] hover:bg-[#e05e10] rounded-lg transition-colors"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Ir a la Evaluación Final</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Completion message if all resolved */}
      {allResolved && (
        <div className="p-6 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-emerald-950 dark:text-emerald-100">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/60 rounded-xl text-emerald-700 dark:text-emerald-300">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm sm:text-base">¡Completaste todos los dilemas reales!</h4>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
                Demostraste criterio ético y dominio del reglamento del aprendiz SENA.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetSimulator}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reiniciar Casos</span>
            </button>

            <button
              onClick={onGoToEvaluation}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#FC7323] hover:bg-[#e05e10] rounded-lg transition-colors shadow-xs"
            >
              Presentar Evaluación Final
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
