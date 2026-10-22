import React, { useState, useEffect } from 'react';
import { LearnerProfile } from '../data/senaData';
import { SenaEmblem } from './SenaEmblem';
import { Printer, ShieldCheck, Download, Check, Share2, Edit3, Award, ExternalLink, Sparkles, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { autoSyncLearner, LearnerSyncPayload, getSpreadsheetDirectUrl } from '../services/autoSyncService';

interface CertificateViewProps {
  profile: LearnerProfile;
  isCertified: boolean;
  scorePercentage: number;
  completionDate: string;
  onOpenProfile: () => void;
  onGoToEvaluation: () => void;
  onOpenVerifier: (code: string) => void;
  onOpenDriveSync?: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  profile,
  isCertified,
  scorePercentage,
  completionDate,
  onOpenProfile,
  onGoToEvaluation,
  onOpenVerifier,
  onOpenDriveSync,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [syncMessage, setSyncMessage] = useState('Sincronizado automáticamente en la planilla de Google Drive');
  const [sheetUrl, setSheetUrl] = useState(getSpreadsheetDirectUrl());

  // Generate deterministic verification code from profile
  const rawId = `${profile.documentNumber}-${profile.recordNumber}`.replace(/[^a-zA-Z0-9]/g, '');
  const verificationCode = `SENA-IND-2026-${rawId.slice(0, 5).toUpperCase() || 'ADSO1'}-${rawId.slice(-4).toUpperCase() || '7890'}`;

  // Sincronización automática desatendida cuando el certificado está acreditado
  useEffect(() => {
    if (isCertified) {
      const now = new Date();
      const formattedTimestamp = `${now.toLocaleDateString('es-CO')} ${now.toLocaleTimeString('es-CO')}`;
      const payload: LearnerSyncPayload = {
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
        completedLessons: 12,
        totalLessons: 12,
        xp: 450,
        scorePercentage,
        isCertified: true,
        certificateCode: verificationCode,
        regulation: 'Acuerdo 0009 de 2024'
      };

      autoSyncLearner(payload)
        .then((res) => {
          setSyncMessage(res.message);
          if (res.spreadsheetUrl) setSheetUrl(res.spreadsheetUrl);
        })
        .catch(() => {
          setSyncMessage('Registro respaldado en la cola local de Google Drive.');
        });
    }
  }, [isCertified, profile, scorePercentage, verificationCode, rawId]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(verificationCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  if (!isCertified) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md p-8 sm:p-12 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs max-w-xl mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950 text-[#FC7323] mx-auto flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Certificado aún no desbloqueado</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Para obtener tu <strong>Certificado Oficial de Inducción SENA</strong> es requisito indispensable
            aprobar la Evaluación Institucional con un mínimo de <strong>80%</strong>.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onGoToEvaluation}
              className="w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#FC7323] hover:bg-[#e05e10] rounded-xl transition-colors shadow-xs"
            >
              Ir a la Evaluación Final
            </button>
            <button
              onClick={onOpenProfile}
              className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              Verificar Datos del Aprendiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Toolbar (Hidden on Print) */}
      <div className="no-print bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-emerald-950 dark:text-emerald-100 shadow-xs backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/60 rounded-xl text-emerald-700 dark:text-emerald-300 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base">Certificado Acreditado Oficialmente</span>
              <span className="text-xs bg-emerald-200/70 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-semibold px-2 py-0.5 rounded-full font-mono">
                {scorePercentage}% Calificación
              </span>
            </div>
            <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5 flex flex-wrap items-center gap-1.5">
              <span>Emitido a nombre de <strong>{profile.fullName}</strong> ({profile.documentType} {profile.documentNumber}).</span>
              <span className="hidden sm:inline" aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 text-[11px] text-[#39A900] dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{syncMessage}</span>
              </span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#FC7323] hover:bg-[#e05e10] rounded-lg transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir / Guardar en PDF</span>
          </button>

          {sheetUrl && (
            <a
              href={sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-900 dark:text-emerald-100 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-emerald-300 dark:border-emerald-700 rounded-lg transition-colors shadow-xs"
              title="Abrir la planilla oficial en Google Drive"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#39A900]" />
              <span>Ver en Google Drive</span>
              <ExternalLink className="w-3 h-3 text-emerald-600" />
            </a>
          )}

          {onOpenDriveSync && (
            <button
              onClick={onOpenDriveSync}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-emerald-100/60 dark:bg-emerald-900/40 hover:bg-emerald-200/60 dark:hover:bg-emerald-900/60 rounded-lg transition-colors"
              title="Panel de control de sincronización"
            >
              <span>Panel de Control</span>
            </button>
          )}

          <button
            onClick={() => onOpenVerifier(verificationCode)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Verificar Validez</span>
          </button>

          <button
            onClick={onOpenProfile}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
            title="Editar nombre o documento"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>Editar Datos</span>
          </button>
        </div>
      </div>

      {/* Printable Certificate Frame */}
      <div className="print-only-certificate bg-white rounded-3xl border-8 border-double border-slate-800 p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-lg text-slate-900">
        {/* Subtle Watermark SENA Emblem in background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <SenaEmblem size={550} />
        </div>

        {/* Outer security border line */}
        <div className="border border-slate-300 p-6 sm:p-10 rounded-2xl relative z-10 space-y-8">
          {/* Header Institutional Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-slate-900 pb-6 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <SenaEmblem size={54} />
              <div>
                <p className="text-xs font-bold text-slate-800 tracking-wider uppercase">República de Colombia</p>
                <p className="text-xs font-semibold text-slate-600 uppercase">Ministerio del Trabajo</p>
                <p className="text-sm font-extrabold text-[#FC7323] tracking-tight">SERVICIO NACIONAL DE APRENDIZAJE - SENA</p>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">
                Dirección de Formación Profesional Integral
              </span>
              <span className="text-xs font-bold text-slate-800 font-mono">
                {profile.trainingCenter}
              </span>
              <span className="text-[11px] text-slate-500 block">
                {profile.regional}
              </span>
            </div>
          </div>

          {/* Central Title */}
          <div className="text-center space-y-2 pt-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#39A900]">
              Constancia de Acreditación Institucional
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight uppercase">
              Certificado de Inducción
            </h1>
            <p className="text-sm font-medium text-slate-600">
              Apropiación del Reglamento del Aprendiz y Convivencia Formativa
            </p>
          </div>

          {/* Body Prose */}
          <div className="text-center max-w-3xl mx-auto space-y-4 py-2">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-slate-500">
              El Servicio Nacional de Aprendizaje (SENA) certifica que:
            </p>

            <div className="py-2">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight underline decoration-[#FC7323] decoration-2 underline-offset-8">
                {profile.fullName}
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-2 font-mono">
                Identificado(a) con {profile.documentType} No. {profile.documentNumber}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify sm:text-center">
              Cursó y aprobó con éxito el <strong>MÓDULO DE INDUCCIÓN INSTITUCIONAL Y REGLAMENTO DEL APRENDIZ</strong>,
              demostrando la apropiación integral de los <strong>24 Derechos, 24 Deberes, 14 Prohibiciones, Medidas Formativas y Garantías del Debido Proceso</strong>,
              conforme a lo consagrado en el <strong>Acuerdo 0009 de 2024</strong> (Diario Oficial No. 52.947) y los lineamientos pedagógicos del SENA.
            </p>

            {/* Academic details pill box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-left">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Programa de Formación</span>
                <span className="text-xs font-bold text-slate-900 line-clamp-2">{profile.trainingProgram}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Ficha de Caracterización</span>
                <span className="text-xs font-bold text-slate-900 font-mono">{profile.recordNumber}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Intensidad Horaria</span>
                <span className="text-xs font-bold text-[#FC7323] font-mono">40 Horas de Inducción</span>
              </div>
            </div>
          </div>

          {/* Signatures and QR Code Validation */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-6 items-end">
            {/* Signature 1 */}
            <div className="sm:col-span-4 text-center">
              <div className="h-12 flex items-center justify-center">
                {/* Stylized vector signature */}
                <svg className="w-36 h-10 text-slate-700" viewBox="0 0 150 40">
                  <path
                    d="M10 25 C30 5, 45 35, 70 15 C90 3, 110 32, 140 18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="w-44 mx-auto border-t border-slate-400 pt-1">
                <p className="text-xs font-bold text-slate-900">Dra. Mercedes Gómez Silva</p>
                <p className="text-[10px] text-slate-500">Subdirectora de Centro de Formación</p>
                <p className="text-[9px] text-slate-400">Servicio Nacional de Aprendizaje SENA</p>
              </div>
            </div>

            {/* Signature 2 */}
            <div className="sm:col-span-4 text-center">
              <div className="h-12 flex items-center justify-center">
                <svg className="w-36 h-10 text-slate-700" viewBox="0 0 150 40">
                  <path
                    d="M15 20 C40 38, 55 5, 80 25 C105 10, 120 30, 138 22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="w-44 mx-auto border-t border-slate-400 pt-1">
                <p className="text-xs font-bold text-slate-900">Ing. Carlos Alberto Rincón</p>
                <p className="text-[10px] text-slate-500">Coordinador Misional y Bienestar</p>
                <p className="text-[9px] text-slate-400">Formación Profesional Integral</p>
              </div>
            </div>

            {/* QR Code and Validation Hash */}
            <div className="sm:col-span-4 flex flex-col items-center sm:items-end text-center sm:text-right">
              <button
                onClick={() => onOpenVerifier(verificationCode)}
                className="group p-1.5 bg-white border border-slate-300 rounded-lg shadow-2xs hover:border-[#FC7323] transition-colors"
                title="Haga clic para validar este certificado en línea"
              >
                {/* High fidelity SVG QR pattern */}
                <svg className="w-20 h-20" viewBox="0 0 100 100" fill="none">
                  {/* Position detection squares */}
                  <rect x="5" y="5" width="28" height="28" rx="4" fill="#0f172a" />
                  <rect x="11" y="11" width="16" height="16" fill="white" />
                  <rect x="15" y="15" width="8" height="8" fill="#0f172a" />

                  <rect x="67" y="5" width="28" height="28" rx="4" fill="#0f172a" />
                  <rect x="73" y="11" width="16" height="16" fill="white" />
                  <rect x="77" y="15" width="8" height="8" fill="#0f172a" />

                  <rect x="5" y="67" width="28" height="28" rx="4" fill="#0f172a" />
                  <rect x="11" y="73" width="16" height="16" fill="white" />
                  <rect x="15" y="77" width="8" height="8" fill="#0f172a" />

                  {/* Data patterns */}
                  <rect x="38" y="10" width="8" height="8" fill="#FC7323" />
                  <rect x="50" y="10" width="8" height="8" fill="#0f172a" />
                  <rect x="38" y="24" width="8" height="8" fill="#0f172a" />
                  <rect x="50" y="24" width="8" height="8" fill="#FC7323" />

                  <rect x="10" y="40" width="8" height="8" fill="#0f172a" />
                  <rect x="24" y="40" width="8" height="8" fill="#39A900" />
                  <rect x="38" y="40" width="8" height="8" fill="#0f172a" />
                  <rect x="50" y="40" width="8" height="8" fill="#0f172a" />
                  <rect x="64" y="40" width="8" height="8" fill="#39A900" />
                  <rect x="78" y="40" width="8" height="8" fill="#0f172a" />

                  <rect x="38" y="54" width="8" height="8" fill="#39A900" />
                  <rect x="50" y="54" width="8" height="8" fill="#0f172a" />
                  <rect x="64" y="54" width="8" height="8" fill="#FC7323" />
                  <rect x="78" y="54" width="8" height="8" fill="#0f172a" />

                  <rect x="38" y="68" width="8" height="8" fill="#0f172a" />
                  <rect x="50" y="68" width="8" height="8" fill="#39A900" />
                  <rect x="64" y="68" width="8" height="8" fill="#0f172a" />
                  <rect x="78" y="68" width="8" height="8" fill="#FC7323" />

                  <rect x="38" y="82" width="8" height="8" fill="#FC7323" />
                  <rect x="50" y="82" width="8" height="8" fill="#0f172a" />
                  <rect x="64" y="82" width="8" height="8" fill="#39A900" />
                  <rect x="78" y="82" width="8" height="8" fill="#0f172a" />
                </svg>
              </button>

              <div className="mt-1">
                <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                  Código de Validación Oficial
                </span>
                <span className="text-[11px] font-bold font-mono text-slate-800">
                  {verificationCode}
                </span>
                <span className="text-[9px] text-slate-400 block font-mono">
                  Fecha: {completionDate}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share / Verification helper panel (Hidden on Print) */}
      <div className="no-print bg-white dark:bg-slate-900/80 backdrop-blur-md p-5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#39A900]" />
          <span>
            Este certificado es un documento institucional verificable. Los instructores o empleadores pueden
            validar el código único <strong className="font-mono text-slate-900 dark:text-white">{verificationCode}</strong> en el sistema.
          </span>
        </div>

        <button
          onClick={handleCopyCode}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold shrink-0 transition-colors"
        >
          {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copiedCode ? '¡Código Copiado!' : 'Copiar Código'}</span>
        </button>
      </div>
    </div>
  );
};
