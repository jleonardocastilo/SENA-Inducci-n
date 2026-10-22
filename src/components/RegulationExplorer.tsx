import React, { useState, useMemo } from 'react';
import { REGULATION_ARTICLES, FREQUENT_QUESTIONS } from '../data/senaData';
import { Search, BookOpen, ShieldCheck, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const RegulationExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('todos');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const filteredChapters = useMemo(() => {
    return REGULATION_ARTICLES.map((chap) => {
      // Filter by chapter category if specified
      if (selectedFilter === 'derechos' && !chap.chapter.includes('II')) return null;
      if (selectedFilter === 'deberes' && !chap.chapter.includes('III')) return null;
      if (selectedFilter === 'novedades' && !chap.chapter.includes('IV')) return null;
      if (selectedFilter === 'sanciones' && !chap.chapter.includes('V')) return null;

      const matchingArticles = chap.articles.filter((art) => {
        if (!searchTerm.trim()) return true;
        const q = searchTerm.toLowerCase();
        return (
          art.name.toLowerCase().includes(q) ||
          art.number.toLowerCase().includes(q) ||
          art.content.toLowerCase().includes(q)
        );
      });

      if (matchingArticles.length === 0) return null;

      return {
        ...chap,
        articles: matchingArticles,
      };
    }).filter(Boolean);
  }, [searchTerm, selectedFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#FC7323] uppercase tracking-wider">
          <span>Compendio Normativo Oficial</span>
          <span aria-hidden="true">·</span>
          <span>Acuerdo 0009 de 2024 (Vigente)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1">
          Reglamento del Aprendiz SENA
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
          Consulta ágil de los 24 derechos, 24 deberes, 14 prohibiciones, novedades de formación,
          medidas formativas pedagógicas y el debido proceso garantista consagrados en el Acuerdo 0009 de 2024.
        </p>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por artículo, palabra clave (ej. carné, deserción, inasistencia, Zajuna)..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FC7323] focus:border-transparent text-slate-900 dark:text-white"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
          {[
            { id: 'todos', label: 'Todos los Capítulos' },
            { id: 'derechos', label: 'Derechos (Cap. II)' },
            { id: 'deberes', label: 'Deberes y Prohibiciones (Cap. III)' },
            { id: 'novedades', label: 'Novedades y Deserción (Cap. IV)' },
            { id: 'sanciones', label: 'Medidas y Sanciones (Cap. V)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedFilter === tab.id
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Display */}
      <div className="space-y-6">
        {filteredChapters.length === 0 ? (
          <div className="bg-white dark:bg-slate-900/80 p-8 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
            <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-700 dark:text-slate-200 font-semibold text-sm">No se encontraron artículos</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Prueba con otra palabra clave como "inasistencia", "carné" o "comité".</p>
          </div>
        ) : (
          filteredChapters.map((chap, i) => (
            <div key={i} className="bg-white dark:bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-800/80 px-5 py-3 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#FC7323]">{chap!.chapter}</span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{chap!.title}</h3>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {chap!.articles.length} artículos
                </span>
              </div>

              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {chap!.articles.map((art, artIdx) => (
                  <div
                    key={artIdx}
                    className="p-4 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800/80 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-200 bg-white dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600 font-mono">
                        {art.number}
                      </span>
                      <span className="text-xs font-semibold text-[#FC7323]">{art.name}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">{art.content}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Frequently Asked Questions (FAQ) Section */}
      <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#FC7323]" />
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Preguntas Frecuentes del Aprendiz SENA</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Respuestas rápidas a las situaciones más comunes en la vida formativa.</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {FREQUENT_QUESTIONS.map((faq, index) => {
            const isExpanded = expandedFaq === index;
            return (
              <div key={index} className="py-3">
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : index)}
                  className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-[#FC7323] dark:hover:text-[#FC7323] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[#39A900]">●</span>
                    <span>{faq.question}</span>
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 shrink-0 text-slate-400" /> : <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" />}
                </button>

                {isExpanded && (
                  <div className="mt-2 pl-4 pr-2 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <p className="leading-relaxed">{faq.answer}</p>
                    <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 font-mono">
                      Referencia: {faq.article}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
