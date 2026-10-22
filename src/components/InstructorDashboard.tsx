import React, { useState, useEffect } from 'react';
import {
  Users,
  Award,
  FileSpreadsheet,
  ExternalLink,
  Download,
  Copy,
  Check,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  RefreshCw,
  Plus,
  ShieldCheck,
  Eye,
  Trash2,
  ArrowRight,
  BookOpen,
  Sparkles,
  Link as LinkIcon,
  HelpCircle
} from 'lucide-react';
import {
  getSyncHistory,
  saveSyncHistory,
  deleteSyncRecord,
  getSpreadsheetDirectUrl,
  SyncHistoryItem,
  LearnerSyncPayload,
  autoSyncLearner
} from '../services/autoSyncService';

interface InstructorDashboardProps {
  onOpenDriveModal: () => void;
  onSwitchToLearnerView: () => void;
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  onOpenDriveModal,
  onSwitchToLearnerView
}) => {
  const [history, setHistory] = useState<SyncHistoryItem[]>(getSyncHistory());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'certified' | 'in_progress'>('all');
  const [copiedLink, setCopiedLink] = useState(false);
  const [selectedLearner, setSelectedLearner] = useState<SyncHistoryItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New learner form state
  const [newFullName, setNewFullName] = useState('');
  const [newDocType, setNewDocType] = useState('C.C.');
  const [newDocNumber, setNewDocNumber] = useState('');
  const [newRecordNumber, setNewRecordNumber] = useState('2824910');
  const [newProgram, setNewProgram] = useState('Tecnólogo en Análisis y Desarrollo de Software (ADSO)');
  const [newScore, setNewScore] = useState(90);

  const spreadsheetUrl = getSpreadsheetDirectUrl();

  // Generate learner link
  const getLearnerLink = () => {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.href);
    url.searchParams.set('role', 'aprendiz');
    return url.toString();
  };

  const handleCopyLearnerLink = () => {
    const link = getLearnerLink();
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Refresh history
  const reloadHistory = () => {
    setHistory(getSyncHistory());
  };

  useEffect(() => {
    reloadHistory();
  }, []);

  // Filtered learners
  const filteredLearners = history.filter((item) => {
    const matchesSearch =
      item.payload.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.payload.documentNumber.includes(searchTerm) ||
      item.payload.recordNumber.includes(searchTerm);

    if (statusFilter === 'certified') {
      return matchesSearch && item.payload.isCertified;
    }
    if (statusFilter === 'in_progress') {
      return matchesSearch && !item.payload.isCertified;
    }
    return matchesSearch;
  });

  // Calculate cohort metrics
  const totalLearners = history.length;
  const certifiedCount = history.filter((h) => h.payload.isCertified).length;
  const inProgressCount = totalLearners - certifiedCount;
  const averageScore = totalLearners > 0
    ? Math.round(history.reduce((acc, h) => acc + (h.payload.scorePercentage || 0), 0) / totalLearners)
    : 0;
  const certifiedRate = totalLearners > 0 ? Math.round((certifiedCount / totalLearners) * 100) : 0;

  // Add new learner manually
  const handleCreateLearner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newDocNumber) return;

    const rawId = `${newDocNumber}-${newRecordNumber}`.replace(/[^a-zA-Z0-9]/g, '');
    const isCert = newScore >= 80;
    const certCode = isCert
      ? `SENA-IND-2026-${rawId.slice(0, 5).toUpperCase() || 'ADSO1'}-${rawId.slice(-4).toUpperCase() || '7890'}`
      : 'PENDIENTE DE EVALUACIÓN';

    const now = new Date();
    const formattedTimestamp = `${now.toLocaleDateString('es-CO')} ${now.toLocaleTimeString('es-CO')}`;

    const payload: LearnerSyncPayload = {
      id: `SENA-${rawId.slice(0, 6)}-${Date.now().toString().slice(-4)}`,
      timestamp: formattedTimestamp,
      fullName: newFullName,
      documentType: newDocType,
      documentNumber: newDocNumber,
      recordNumber: newRecordNumber,
      trainingProgram: newProgram,
      regional: 'Regional Distrito Capital',
      trainingCenter: 'Centro de Electricidad, Electrónica y Telecomunicaciones (CEET)',
      modality: 'Presencial',
      completedLessons: isCert ? 12 : 8,
      totalLessons: 12,
      xp: isCert ? 450 : 250,
      scorePercentage: newScore,
      isCertified: isCert,
      certificateCode: certCode,
      regulation: 'Acuerdo 0009 de 2024'
    };

    await autoSyncLearner(payload);
    reloadHistory();
    setShowAddModal(false);
    setNewFullName('');
    setNewDocNumber('');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Seguro que deseas eliminar este aprendiz de la lista local?')) {
      deleteSyncRecord(id);
      reloadHistory();
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

    const rows = history.map((h) => [
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
      h.payload.isCertified ? 'CERTIFICADO (APROBADO)' : 'EN PROCESO',
      h.payload.certificateCode,
      h.payload.regulation
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SENA_Consolidado_Induccion_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Top Banner: Instructor Identity and Link Generator */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-900 to-slate-900 text-white shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-emerald-800/60">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#39A900] text-white text-xs font-bold uppercase tracking-wider">
              Perfil: Instructor SENA
            </span>
            <span className="text-emerald-300 text-xs font-mono">Ficha: 2824910 · ADSO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Panel de Control y Seguimiento de Inducción
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
            Administra la cohorte de aprendices, supervisa la aprobación bajo el{' '}
            <strong>Acuerdo 0009 de 2024</strong> y gestiona la hoja oficial de Google Drive.
          </p>
        </div>

        {/* Share with Apprentices CTA */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 space-y-2.5 shrink-0 sm:min-w-[320px]">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-200">
              <LinkIcon className="w-4 h-4 text-[#FC7323]" />
              <span>Enlace para los Aprendices</span>
            </span>
            <span className="text-[10px] text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full">
              Modo Aprendiz
            </span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={getLearnerLink()}
              className="bg-black/30 border border-white/20 text-white text-xs font-mono rounded-lg px-2.5 py-1.5 w-full select-all focus:outline-none"
            />
            <button
              onClick={handleCopyLearnerLink}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#39A900] hover:bg-[#329600] text-white rounded-lg text-xs font-semibold transition-colors shrink-0 shadow-xs cursor-pointer"
              title="Copiar enlace limpio para enviar a los aprendices"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? '¡Copiado!' : 'Copiar'}</span>
            </button>
          </div>
          <p className="text-[10px] text-emerald-200/80">
            Los aprendices no tendrán acceso a Google Drive ni a las opciones de instructor.
          </p>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Total Aprendices</span>
            <Users className="w-4 h-4 text-[#FC7323]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            {totalLearners}
          </div>
          <p className="text-[11px] text-slate-400">En la cohorte actual</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Certificados (80%+)</span>
            <Award className="w-4 h-4 text-[#39A900]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#39A900] font-mono tabular-nums">
            {certifiedCount}
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold">{certifiedRate}% de aprobación</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>En Formación</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-mono tabular-nums">
            {inProgressCount}
          </div>
          <p className="text-[11px] text-slate-400">Pendiente aprobar test</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span>Promedio General</span>
            <Sparkles className="w-4 h-4 text-[#FC7323]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            {averageScore}%
          </div>
          <p className="text-[11px] text-slate-400">Calificación del grupo</p>
        </div>

        <div className="col-span-2 lg:col-span-1 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 text-xs">
            <span>Google Drive</span>
            <CheckCircle2 className="w-4 h-4 text-[#39A900]" />
          </div>
          <div className="text-sm font-bold text-emerald-950 dark:text-emerald-100 flex items-center gap-1 pt-1">
            <span>Auto-Sincronizado</span>
          </div>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400">Planilla oficial en la nube</p>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href={spreadsheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#39A900] hover:bg-[#329600] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Abrir Hoja en Google Drive</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onOpenDriveModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#39A900]" />
            <span>Ajustes Webhook & Drive</span>
          </button>

          <button
            onClick={handleDownloadCsv}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Descargar Consolidado CSV</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 text-[#FC7323] border border-amber-200 dark:border-amber-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Aprendiz Manual</span>
          </button>

          <button
            onClick={onSwitchToLearnerView}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-medium transition-colors cursor-pointer"
            title="Ver los módulos tal como los ve el aprendiz"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#FC7323]" />
            <span className="hidden sm:inline">Ver Contenido de Aprendiz</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, documento o ficha..."
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#39A900]"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Todos ({totalLearners})
          </button>
          <button
            onClick={() => setStatusFilter('certified')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              statusFilter === 'certified'
                ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Certificados ({certifiedCount})
          </button>
          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              statusFilter === 'in_progress'
                ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            En Proceso ({inProgressCount})
          </button>
        </div>
      </div>

      {/* Cohort Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Fecha y Hora</th>
                <th className="px-4 py-3">Aprendiz</th>
                <th className="px-4 py-3">Documento</th>
                <th className="px-4 py-3">Ficha / Programa</th>
                <th className="px-4 py-3">Lecciones</th>
                <th className="px-4 py-3">Calificación</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Código Certificado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-200">
              {filteredLearners.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-400">
                    No se encontraron aprendices con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredLearners.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px] text-slate-500">
                      {item.payload.timestamp}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-[#39A900] font-bold flex items-center justify-center text-xs shrink-0">
                          {item.payload.fullName.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {item.payload.fullName}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap font-mono text-slate-600 dark:text-slate-300">
                      {item.payload.documentType} {item.payload.documentNumber}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap font-mono">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {item.payload.recordNumber}
                      </span>
                      <span className="block text-[10px] text-slate-400 truncate max-w-[150px]">
                        {item.payload.trainingProgram}
                      </span>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap font-mono">
                      {item.payload.completedLessons}/{item.payload.totalLessons}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap font-mono font-bold text-sm text-[#FC7323]">
                      {item.payload.scorePercentage}%
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          item.payload.isCertified
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                            : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                        }`}
                      >
                        {item.payload.isCertified ? 'Certificado' : 'En Formación'}
                      </span>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px] text-slate-500 dark:text-slate-400">
                      {item.payload.certificateCode}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-right space-x-1">
                      <button
                        onClick={() => setSelectedLearner(item)}
                        className="p-1.5 text-slate-500 hover:text-[#39A900] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        title="Ver detalle del aprendiz"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar registro"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Learner Detail Viewer */}
      {selectedLearner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#39A900]" />
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Ficha Oficial del Aprendiz
                </h3>
              </div>
              <button
                onClick={() => setSelectedLearner(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold">Nombre Completo</span>
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  {selectedLearner.payload.fullName}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Documento</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">
                    {selectedLearner.payload.documentType} {selectedLearner.payload.documentNumber}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Ficha</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">
                    {selectedLearner.payload.recordNumber}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Calificación</span>
                  <span className="font-mono font-bold text-base text-[#FC7323]">
                    {selectedLearner.payload.scorePercentage}%
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Lecciones</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-white">
                    {selectedLearner.payload.completedLessons}/{selectedLearner.payload.totalLessons}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">XP Ganados</span>
                  <span className="font-mono font-semibold text-[#39A900]">
                    {selectedLearner.payload.xp} XP
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">
                  Código de Certificación (Acuerdo 0009 de 2024)
                </span>
                <span className="font-mono font-bold text-[#39A900] text-xs">
                  {selectedLearner.payload.certificateCode}
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => setSelectedLearner(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Manual Add Learner */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Registrar Aprendiz en la Planilla
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLearner} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Nombre Completo del Aprendiz:
                </label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="Ej. Andrés Camilo Martínez"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-[#39A900]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Tipo:
                  </label>
                  <select
                    value={newDocType}
                    onChange={(e) => setNewDocType(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                  >
                    <option value="C.C.">C.C.</option>
                    <option value="T.I.">T.I.</option>
                    <option value="C.E.">C.E.</option>
                    <option value="P.E.P.">P.E.P.</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    No. Documento:
                  </label>
                  <input
                    type="text"
                    required
                    value={newDocNumber}
                    onChange={(e) => setNewDocNumber(e.target.value)}
                    placeholder="1.034.567.890"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Ficha:
                  </label>
                  <input
                    type="text"
                    required
                    value={newRecordNumber}
                    onChange={(e) => setNewRecordNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Calificación (%):
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newScore}
                    onChange={(e) => setNewScore(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#39A900] hover:bg-[#329600] text-white rounded-xl font-semibold"
                >
                  Guardar y Sincronizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
