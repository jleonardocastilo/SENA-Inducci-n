import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  FileSpreadsheet,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  LogOut,
  UserCheck,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Download,
  Copy,
  Check,
  Settings2,
  Send,
  CloudCheck,
  HelpCircle
} from 'lucide-react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  googleSignOut,
  getAccessToken
} from '../services/googleAuth';
import {
  findOrCreateSpreadsheet,
  appendLearnerRecord,
  fetchLearnersFromSheet,
  LearnerSheetRecord,
  SpreadsheetInfo
} from '../services/googleSheetsService';
import {
  getAutoSyncStatus,
  getSyncHistory,
  setWebhookUrl,
  getWebhookUrl,
  getGoogleAppsScriptTemplate,
  getSpreadsheetDirectUrl,
  autoSyncLearner,
  retryPendingQueue,
  subscribeSyncStatus,
  AutoSyncStatus,
  SyncHistoryItem,
  LearnerSyncPayload
} from '../services/autoSyncService';
import { LearnerProfile } from '../data/senaData';

interface GoogleDriveSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: LearnerProfile;
  completedLessonsCount: number;
  totalLessonsCount: number;
  xp: number;
  scorePercentage: number;
  isCertified: boolean;
}

export const GoogleDriveSyncModal: React.FC<GoogleDriveSyncModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  completedLessonsCount,
  totalLessonsCount,
  xp,
  scorePercentage,
  isCertified
}) => {
  // Tab state: 'status' (default) | 'history' | 'settings' | 'google-auth'
  const [activeTab, setActiveTab] = useState<'status' | 'settings' | 'google-auth'>('status');

  // AutoSync Service state
  const [syncStatus, setSyncStatus] = useState<AutoSyncStatus>(getAutoSyncStatus());
  const [syncHistory, setSyncHistory] = useState<SyncHistoryItem[]>(getSyncHistory());
  const [webhookInput, setWebhookInput] = useState(getWebhookUrl());
  const [copiedScript, setCopiedScript] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // Google OAuth & Sheets API state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [spreadsheetInfo, setSpreadsheetInfo] = useState<SpreadsheetInfo | null>(null);
  const [isLoadingSpreadsheet, setIsLoadingSpreadsheet] = useState(false);
  const [sheetRecords, setSheetRecords] = useState<LearnerSheetRecord[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Generate unique certificate verification code
  const rawId = `${currentProfile.documentNumber}-${currentProfile.recordNumber}`.replace(/[^a-zA-Z0-9]/g, '');
  const certificateCode = isCertified
    ? `SENA-IND-2026-${rawId.slice(0, 5).toUpperCase() || 'ADSO1'}-${rawId.slice(-4).toUpperCase() || '7890'}`
    : 'PENDIENTE DE EVALUACIÓN';

  // Subscribe to autoSync updates
  useEffect(() => {
    const unsub = subscribeSyncStatus((newStatus) => {
      setSyncStatus(newStatus);
      setSyncHistory(getSyncHistory());
    });
    return () => unsub();
  }, []);

  // Listen to Auth State
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
      },
      () => {
        setCurrentUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const loadSpreadsheetAndRecords = useCallback(async (token: string) => {
    setIsLoadingSpreadsheet(true);
    setStatusMessage(null);
    try {
      const info = await findOrCreateSpreadsheet(token);
      setSpreadsheetInfo(info);
      setIsLoadingRecords(true);
      const list = await fetchLearnersFromSheet(token, info.spreadsheetId, info.sheetTitle);
      setSheetRecords(list);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido al acceder a Google Sheets';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setIsLoadingSpreadsheet(false);
      setIsLoadingRecords(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && accessToken) {
      loadSpreadsheetAndRecords(accessToken);
    }
  }, [isOpen, accessToken, loadSpreadsheetAndRecords]);

  if (!isOpen) return null;

  const handleManualSyncNow = async () => {
    setIsSubmitting(true);
    setStatusMessage(null);
    try {
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
        completedLessons: completedLessonsCount,
        totalLessons: totalLessonsCount,
        xp,
        scorePercentage,
        isCertified,
        certificateCode,
        regulation: 'Acuerdo 0009 de 2024'
      };

      const res = await autoSyncLearner(payload);
      setStatusMessage({
        type: 'success',
        text: res.message
      });
      setSyncHistory(getSyncHistory());
    } catch (err: unknown) {
      setStatusMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error al sincronizar'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetryQueue = async () => {
    setIsRetrying(true);
    try {
      await retryPendingQueue();
      setSyncHistory(getSyncHistory());
      setStatusMessage({
        type: 'success',
        text: 'Reintento de sincronización en segundo plano completado.'
      });
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: 'No se pudo completar el reintento. Verifica la conexión a internet.'
      });
    } finally {
      setIsRetrying(false);
    }
  };

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    setWebhookUrl(webhookInput);
    setStatusMessage({
      type: 'success',
      text: 'Configuración de Webhook guardada exitosamente.'
    });
  };

  const handleCopyAppsScript = () => {
    const code = getGoogleAppsScriptTemplate();
    navigator.clipboard.writeText(code);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setStatusMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        setAccessToken(result.accessToken);
        await loadSpreadsheetAndRecords(result.accessToken);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al conectar con Google';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    await googleSignOut();
    setCurrentUser(null);
    setAccessToken(null);
    setSpreadsheetInfo(null);
    setSheetRecords([]);
    setStatusMessage(null);
  };

  const handleConfirmSave = async () => {
    setShowConfirmDialog(false);
    const token = accessToken || (await getAccessToken());
    if (!token || !spreadsheetInfo) {
      setStatusMessage({ type: 'error', text: 'Sesión no activa con Google Drive' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    const now = new Date();
    const formattedTimestamp = `${now.toLocaleDateString('es-CO')} ${now.toLocaleTimeString('es-CO')}`;

    const newRecord: LearnerSheetRecord = {
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
      completedLessons: completedLessonsCount,
      totalLessons: totalLessonsCount,
      xp,
      scorePercentage,
      isCertified,
      certificateCode,
      regulation: 'Acuerdo 0009 de 2024'
    };

    try {
      await appendLearnerRecord(
        token,
        spreadsheetInfo.spreadsheetId,
        spreadsheetInfo.sheetTitle,
        newRecord
      );

      setStatusMessage({
        type: 'success',
        text: `¡Datos de ${currentProfile.fullName} registrados exitosamente en la hoja de cálculo de Google Drive!`
      });

      const updatedList = await fetchLearnersFromSheet(
        token,
        spreadsheetInfo.spreadsheetId,
        spreadsheetInfo.sheetTitle
      );
      setSheetRecords(updatedList);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar los datos en Google Sheets';
      setStatusMessage({ type: 'error', text: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadCsv = () => {
    const headers = [
      'ID Registro',
      'Fecha y Hora',
      'Nombre Completo',
      'Tipo Doc',
      'No. Documento',
      'Ficha (Caracterización)',
      'Programa de Formación',
      'Regional',
      'Centro de Formación',
      'Modalidad',
      'Lecciones Completadas',
      'Total Lecciones',
      'Puntos XP',
      'Calificación (%)',
      'Estado',
      'Código Certificado',
      'Reglamento'
    ];

    // Build rows from current profile + history
    const rows = [
      [
        `SENA-${rawId.slice(0, 6)}`,
        new Date().toLocaleString('es-CO'),
        `"${currentProfile.fullName.replace(/"/g, '""')}"`,
        currentProfile.documentType,
        currentProfile.documentNumber,
        currentProfile.recordNumber,
        `"${currentProfile.trainingProgram.replace(/"/g, '""')}"`,
        `"${currentProfile.regional.replace(/"/g, '""')}"`,
        `"${currentProfile.trainingCenter.replace(/"/g, '""')}"`,
        currentProfile.modality,
        completedLessonsCount,
        totalLessonsCount,
        xp,
        `${scorePercentage}%`,
        isCertified ? 'CERTIFICADO' : 'EN PROCESO',
        certificateCode,
        'Acuerdo 0009 de 2024'
      ]
    ];

    // Add additional historical entries if available
    syncHistory.forEach((h) => {
      if (h.payload.documentNumber !== currentProfile.documentNumber) {
        rows.push([
          h.id,
          h.payload.timestamp,
          `"${h.payload.fullName.replace(/"/g, '""')}"`,
          h.payload.documentType,
          h.payload.documentNumber,
          h.payload.recordNumber,
          `"${h.payload.trainingProgram.replace(/"/g, '""')}"`,
          `"${h.payload.regional.replace(/"/g, '""')}"`,
          `"${h.payload.trainingCenter.replace(/"/g, '""')}"`,
          h.payload.modality,
          h.payload.completedLessons,
          h.payload.totalLessons,
          h.payload.xp,
          `${h.payload.scorePercentage}%`,
          h.payload.isCertified ? 'CERTIFICADO' : 'EN PROCESO',
          h.payload.certificateCode,
          'Acuerdo 0009 de 2024'
        ]);
      }
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SENA_Induccion_Planilla_${currentProfile.recordNumber}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const spreadsheetLink = spreadsheetInfo?.spreadsheetUrl || getSpreadsheetDirectUrl();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm no-print">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-colors">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/60 text-[#39A900] rounded-xl shrink-0">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Sincronización con Google Drive & Sheets
                </h3>
                <span className="text-[11px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                  100% Automático
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                La información se almacena automáticamente al aprobar la inducción (Acuerdo 0009 de 2024).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4 bg-slate-50/50 dark:bg-slate-800/30 text-xs">
          <button
            onClick={() => setActiveTab('status')}
            className={`pb-2.5 font-semibold transition-colors border-b-2 ${
              activeTab === 'status'
                ? 'border-[#39A900] text-[#39A900]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Estado y Registros
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-2.5 font-semibold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'border-[#39A900] text-[#39A900]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Configuración Webhook</span>
          </button>
          <button
            onClick={() => setActiveTab('google-auth')}
            className={`pb-2.5 font-semibold transition-colors border-b-2 ${
              activeTab === 'google-auth'
                ? 'border-[#39A900] text-[#39A900]'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Acceso Directo API Google
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status feedback alerts */}
          {statusMessage && (
            <div
              className={`p-4 rounded-xl text-xs sm:text-sm flex items-start gap-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-100 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-100 border border-rose-200 dark:border-rose-800'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 leading-relaxed space-y-2">
                <div>{statusMessage.text}</div>
                {statusMessage.type === 'success' && (
                  <div>
                    <a
                      href={spreadsheetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-300 underline hover:text-emerald-800"
                    >
                      <span>Abrir hoja de cálculo en Google Drive</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 1: Status and Records */}
          {activeTab === 'status' && (
            <div className="space-y-5">
              {/* Automated Active Banner */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#39A900] text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      Sincronización Automática Activa
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      No necesitas abrir ventanas de Google ni presionar botones para registrar aprendices.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={spreadsheetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#39A900] hover:bg-[#329600] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors whitespace-nowrap cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Abrir en Google Drive</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Data of Current Learner Ready to Sync */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Aprendiz Actual en Pantalla
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      isCertified
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    {isCertified ? 'Inducción Certificada (80%+)' : 'En Progreso'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Aprendiz</span>
                    <span className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                      {currentProfile.fullName}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Documento</span>
                    <span className="font-semibold text-slate-900 dark:text-white font-mono">
                      {currentProfile.documentType} {currentProfile.documentNumber}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Ficha</span>
                    <span className="font-semibold text-slate-900 dark:text-white font-mono">
                      {currentProfile.recordNumber}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Calificación</span>
                    <span className="font-bold text-[#FC7323] font-mono">{scorePercentage}%</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Reglamento</span>
                    <span className="font-semibold text-slate-900 dark:text-white">Acuerdo 009 de 2024</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Estado Sync</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      {isCertified ? 'Sincronizado' : 'Pendiente Evaluación'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleManualSyncNow}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
                    <span>Forzar Registro Manual Ahora</span>
                  </button>

                  {syncStatus.totalPending > 0 && (
                    <button
                      onClick={handleRetryQueue}
                      disabled={isRetrying}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 hover:bg-amber-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
                      <span>Reintentar {syncStatus.totalPending} Pendientes</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Table of Synced Learners */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Historial de Aprendices Registrados en la Planilla ({syncHistory.length})
                  </span>
                  <span className="text-[11px] text-slate-500">16 columnas Acuerdo 0009 de 2024</span>
                </div>

                {syncHistory.length === 0 ? (
                  <div className="p-5 bg-slate-50 dark:bg-slate-800/30 rounded-xl text-center text-xs text-slate-500 border border-slate-200 dark:border-slate-800">
                    Aún no hay registros en el historial. Los aprendices se registrarán automáticamente al aprobar su evaluación final.
                  </div>
                ) : (
                  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto max-h-52 text-[11px]">
                    <table className="w-full text-left divide-y divide-slate-200 dark:divide-slate-800">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold sticky top-0">
                        <tr>
                          <th className="px-3 py-2">Fecha</th>
                          <th className="px-3 py-2">Aprendiz</th>
                          <th className="px-3 py-2">Documento</th>
                          <th className="px-3 py-2">Ficha</th>
                          <th className="px-3 py-2">Estado</th>
                          <th className="px-3 py-2">Calificación</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300">
                        {syncHistory.map((item, i) => (
                          <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                            <td className="px-3 py-2 whitespace-nowrap font-mono">{item.payload.timestamp}</td>
                            <td className="px-3 py-2 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                              {item.payload.fullName}
                            </td>
                            <td className="px-3 py-2 font-mono whitespace-nowrap">
                              {item.payload.documentType} {item.payload.documentNumber}
                            </td>
                            <td className="px-3 py-2 font-mono whitespace-nowrap">{item.payload.recordNumber}</td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                                  item.status === 'synced'
                                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                                    : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                                }`}
                              >
                                {item.status === 'synced' ? 'Sincronizado' : 'En cola'}
                              </span>
                            </td>
                            <td className="px-3 py-2 font-mono font-bold text-[#FC7323]">
                              {item.payload.scorePercentage}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Settings and Webhook */}
          {activeTab === 'settings' && (
            <div className="space-y-5 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                  <Settings2 className="w-4 h-4 text-[#39A900]" />
                  <span>Configuración de Webhook Directo (Google Apps Script)</span>
                </div>
                <p className="leading-relaxed">
                  Puedes conectar cualquier Hoja de Google Sheets mediante un script gratuito de Google Apps Script.
                  Los aprendices enviarán sus datos directamente a tu hoja sin que ellos tengan que iniciar sesión ni permitir popups.
                </p>

                <form onSubmit={handleSaveWebhook} className="space-y-3 pt-2">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-200">
                      URL de la Aplicación Web (Google Apps Script):
                    </label>
                    <input
                      type="url"
                      value={webhookInput}
                      onChange={(e) => setWebhookInput(e.target.value)}
                      placeholder="https://script.google.com/macros/s/.../exec"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#39A900] hover:bg-[#329600] text-white rounded-xl font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Guardar URL de Webhook
                  </button>
                </form>
              </div>

              {/* Instructions and Code Copy */}
              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-950 dark:text-emerald-100 text-xs sm:text-sm">
                    Código de Apps Script para tu Hoja (3 Pasos):
                  </span>
                  <button
                    onClick={handleCopyAppsScript}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer"
                  >
                    {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedScript ? '¡Copiado!' : 'Copiar Código'}</span>
                  </button>
                </div>

                <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-emerald-900 dark:text-emerald-300">
                  <li>
                    Abre tu hoja en Google Sheets y ve al menú: <strong>Extensiones &gt; Apps Script</strong>.
                  </li>
                  <li>Borra el código que aparezca, pega este script copiado y guarda el proyecto.</li>
                  <li>
                    Haz clic en <strong>Implementar &gt; Nueva implementación</strong>, selecciona tipo{' '}
                    <strong>Aplicación web</strong>, en <em>Quién tiene acceso</em> elige <strong>Cualquiera (Anyone)</strong>, y copia la URL generada aquí.
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: Google Auth Direct API */}
          {activeTab === 'google-auth' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <p>
                  Esta sección permite al administrador o instructor conectar su cuenta de Google mediante la API oficial de Google Sheets.
                </p>
              </div>

              {!currentUser ? (
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-[#39A900] mx-auto flex items-center justify-center">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">
                      Conectar cuenta de Google (Opcional)
                    </h4>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Permite inspeccionar las filas de la hoja en tiempo real directamente desde la API oficial de Google Workspace.
                    </p>
                  </div>

                  <div className="pt-2 flex justify-center">
                    <button
                      onClick={handleSignIn}
                      disabled={isAuthenticating}
                      className="inline-flex items-center gap-3 px-5 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl font-semibold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>{isAuthenticating ? 'Conectando...' : 'Acceder con Google'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      {currentUser.photoURL ? (
                        <img
                          src={currentUser.photoURL}
                          alt={currentUser.displayName || 'Usuario'}
                          className="w-9 h-9 rounded-full border border-slate-300 dark:border-slate-600 object-cover"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#FC7323] text-white flex items-center justify-center font-bold text-xs">
                          {currentUser.displayName?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                            {currentUser.displayName || 'Usuario de Google'}
                          </span>
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {currentUser.email}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleSignOut}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Desconectar</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-xs sm:text-sm text-emerald-950 dark:text-emerald-100 block">
                        Hoja Oficial SENA en Google Drive
                      </span>
                      <span className="text-xs text-emerald-800 dark:text-emerald-300">
                        {spreadsheetInfo ? spreadsheetInfo.sheetTitle : 'Conectada'}
                      </span>
                    </div>
                    {spreadsheetInfo && (
                      <a
                        href={spreadsheetInfo.spreadsheetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#39A900] hover:underline"
                      >
                        <span>Abrir en Drive</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <button
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg font-medium transition-colors cursor-pointer"
            title="Descargar copia de los datos actuales en formato CSV (Excel)"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Descargar Copia CSV</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1 text-[11px]">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Sincronización Automática · Acuerdo 0009 de 2024
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                  ¿Confirmar registro en Google Drive?
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Se agregará una nueva fila a la hoja de cálculo con los datos de {currentProfile.fullName}.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmSave}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#39A900] hover:bg-[#329600] rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Confirmar y Registrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
