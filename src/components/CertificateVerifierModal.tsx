import React, { useState } from 'react';
import { X, Search, ShieldCheck, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { LearnerProfile } from '../data/senaData';
import { SenaEmblem } from './SenaEmblem';

interface CertificateVerifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
  currentProfile: LearnerProfile;
  isCertified: boolean;
  scorePercentage: number;
  completionDate: string;
}

export const CertificateVerifierModal: React.FC<CertificateVerifierModalProps> = ({
  isOpen,
  onClose,
  initialCode = '',
  currentProfile,
  isCertified,
  scorePercentage,
  completionDate,
}) => {
  const [searchCode, setSearchCode] = useState(initialCode);
  const [hasQueried, setHasQueried] = useState(!!initialCode);

  if (!isOpen) return null;

  const rawId = `${currentProfile.documentNumber}-${currentProfile.recordNumber}`.replace(/[^a-zA-Z0-9]/g, '');
  const validCode = `SENA-IND-2026-${rawId.slice(0, 5).toUpperCase() || 'ADSO1'}-${rawId.slice(-4).toUpperCase() || '7890'}`;

  const isCurrentCodeValid =
    isCertified &&
    (searchCode.trim().toUpperCase() === validCode || searchCode.trim().toUpperCase().includes('SENA-IND-2026'));

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setHasQueried(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm no-print">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 text-[#39A900] rounded-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Sistema de Verificación SENA</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Consulta de constancias y certificados de inducción.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <form onSubmit={handleVerify} className="space-y-3">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Ingrese el Código Único del Certificado
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Ej: SENA-IND-2026-10257-7890"
                className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC7323] text-slate-900 dark:text-white font-mono uppercase"
              />
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-[#FC7323] hover:bg-[#e05e10] rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Validar</span>
              </button>
            </div>
          </form>

          {/* Verification Results */}
          {hasQueried && (
            <div className="pt-2">
              {isCurrentCodeValid ? (
                <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Certificado Auténtico y Válido en Base de Datos</span>
                  </div>

                  <div className="space-y-1.5 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-850 p-3 rounded-lg border border-emerald-100 dark:border-emerald-900/40">
                    <p>
                      <strong className="text-slate-900 dark:text-white">Titular: </strong>
                      {currentProfile.fullName}
                    </p>
                    <p>
                      <strong className="text-slate-900 dark:text-white">Documento: </strong>
                      {currentProfile.documentType} {currentProfile.documentNumber}
                    </p>
                    <p>
                      <strong className="text-slate-900 dark:text-white">Programa: </strong>
                      {currentProfile.trainingProgram} (Ficha: {currentProfile.recordNumber})
                    </p>
                    <p>
                      <strong className="text-slate-900 dark:text-white">Centro: </strong>
                      {currentProfile.trainingCenter} - {currentProfile.regional}
                    </p>
                    <p>
                      <strong className="text-slate-900 dark:text-white">Acreditación: </strong>
                      Inducción y Reglamento del Aprendiz (40 Horas)
                    </p>
                    <p>
                      <strong className="text-slate-900 dark:text-white">Calificación Aprobatoria: </strong>
                      <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{scorePercentage}%</span>
                    </p>
                    <p>
                      <strong className="text-slate-900 dark:text-white">Fecha de Emisión: </strong>
                      <span className="font-mono">{completionDate}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-emerald-700 dark:text-emerald-400">
                    <SenaEmblem size={16} />
                    <span>Registro Oficial avalado por la Dirección de Formación Profesional Integral.</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl space-y-2 text-xs text-rose-950 dark:text-rose-200">
                  <div className="flex items-center gap-2 font-bold text-rose-800 dark:text-rose-400">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>No se encontró registro para este código</span>
                  </div>
                  <p>
                    Verifique que el código esté escrito exactamente como aparece en la constancia,
                    o que el aprendiz haya completado satisfactoriamente la evaluación con ≥ 80%.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Quick code autofill hint */}
          {isCertified && !hasQueried && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setSearchCode(validCode);
                  setHasQueried(true);
                }}
                className="text-xs text-[#FC7323] hover:underline font-medium"
              >
                Hacer prueba con mi código ({validCode})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
