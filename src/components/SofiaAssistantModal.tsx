import React, { useState } from 'react';
import { X, Send, Sparkles, BookOpen, ShieldCheck, HelpCircle } from 'lucide-react';
import { SenaEmblem } from './SenaEmblem';
import { FREQUENT_QUESTIONS } from '../data/senaData';

interface SofiaAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'sofia';
  text: string;
  articleCitation?: string;
  timestamp: string;
}

const KNOWLEDGE_RESPONSES: Record<string, { answer: string; article: string }> = {
  acuerdo: {
    answer: 'El reglamento vigente del aprendiz SENA es el Acuerdo 0009 de 2024, expedido por el Consejo Directivo Nacional y publicado en el Diario Oficial No. 52.947 del 21 de noviembre de 2024. Derogó expresamente al Acuerdo 007 de 2012 y sus reformas.',
    article: 'Acuerdo 0009 de 2024 - Cap. I y Disposiciones Finales'
  },
  carne: {
    answer: 'El carné institucional del SENA es un documento público personal e intransferible. Debe portarse en lugar visible durante toda la permanencia en sedes físicas o visitas técnicas. Prestarlo, duplicarlo o comercializarlo es una prohibición expresa calificada como falta disciplinaria grave.',
    article: 'Acuerdo 0009 de 2024 - Cap. III (Deberes y Prohibiciones)'
  },
  inasistencia: {
    answer: 'Si faltas por fuerza mayor, calamidad o incapacidad médica avalada por EPS/IPS, dispones de hasta tres (3) días hábiles siguientes al hecho generador para radicar la justificación por escrito con los debidos soportes ante la coordinación del centro.',
    article: 'Acuerdo 0009 de 2024 - Cap. IV (Justificación de Inasistencias)'
  },
  medica: {
    answer: 'Las incapacidades médicas deben ser expedidas por una EPS o IPS habilitada. Debes radicar copia legible dentro de los 3 días hábiles siguientes al inicio del reposo médico para que tus inasistencias sean justificadas y tus evidencias reprogramadas.',
    article: 'Acuerdo 0009 de 2024 - Cap. IV'
  },
  desercion: {
    answer: 'La deserción se configura cuando acumulas tres (3) días hábiles consecutivos de inasistencia injustificada presencial o virtual, o no reportas la etapa productiva. El centro te notificará otorgándote cinco (5) días hábiles para presentar descargos; de no justificar, se cancela la matrícula con 6 meses de inhabilidad.',
    article: 'Acuerdo 0009 de 2024 - Cap. IV (Procedimiento de Deserción)'
  },
  aplazamiento: {
    answer: 'Puedes solicitar el aplazamiento justificado de tu programa formativo a través del sistema por motivos de salud comprobada, servicio militar, maternidad o fuerza mayor, hasta por un máximo de seis (6) meses continuos.',
    article: 'Acuerdo 0009 de 2024 - Cap. IV (Novedades de Matrícula)'
  },
  bienestar: {
    answer: 'Bienestar al Aprendiz brinda acompañamiento integral: salud preventiva, actividades deportivas y culturales, orientación psicosocial y convocatorias equitativas para apoyos de sostenimiento (FIC, Regular y Monitorías de formación).',
    article: 'Acuerdo 0009 de 2024 - Cap. II (Derechos del Aprendiz)'
  },
  sanciones: {
    answer: 'El SENA prioriza las medidas pedagógicas: Llamado de atención verbal y Plan de Mejoramiento Formativo. Si hay reiteración o faltas graves, aplican sanciones formales previo debido proceso ante el Comité de Evaluación: llamado de atención escrito, condicionamiento de matrícula y cancelación de matrícula.',
    article: 'Acuerdo 0009 de 2024 - Cap. V (Régimen Sancionatorio)'
  },
  vocero: {
    answer: 'El Vocero de Ficha es un aprendiz elegido democráticamente por votación de su grupo formativo. Es el portavoz para canalizar solicitudes pedagógicas y de bienestar ante instructores y coordinadores, garantizando la representación estudiantil.',
    article: 'Acuerdo 0009 de 2024 - Cap. II (Derecho a la Representación)'
  },
  plagio: {
    answer: 'Presentar evidencias ajenas como propias, copiar código de internet sin licencias/citas o suplantar identidad en el Ecosistema Digital Zajuna vulnera la probidad académica y constituye falta disciplinaria grave sancionable en el reglamento.',
    article: 'Acuerdo 0009 de 2024 - Cap. III (Prohibición expresa de plagio y fraude)'
  }
};

export const SofiaAssistantModal: React.FC<SofiaAssistantModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'sofia',
      text: '¡Hola, aprendiz! Soy Sofía, tu Tutora Virtual de Inducción SENA. Conozco a fondo el nuevo Acuerdo 0009 de 2024 (Diario Oficial No. 52.947) y el reglamento vigente. ¿En qué duda sobre tus derechos, deberes, novedades o debido proceso te puedo orientar hoy?',
      timestamp: 'Ahora'
    }
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Ahora'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Answer resolution
    setTimeout(() => {
      const q = text.toLowerCase();
      let matched = Object.entries(KNOWLEDGE_RESPONSES).find(([key]) => q.includes(key));

      let replyText = '';
      let citation = 'Acuerdo 007 de 2012 - Reglamento del Aprendiz SENA';

      if (matched) {
        replyText = matched[1].answer;
        citation = matched[1].article;
      } else {
        replyText =
          'En el marco del Reglamento del Aprendiz SENA (Acuerdo 007 de 2012), todos los trámites, derechos y deberes buscan garantizar una Formación Profesional Integral gratuita y de excelencia. Te recomiendo consultar el Módulo de Reglamento en la plataforma o comunicarte con tu Vocero de Ficha para casos particulares.';
        citation = 'Acuerdo 007 de 2012 - Formación Integral';
      }

      const botMsg: Message = {
        id: `s-${Date.now()}`,
        sender: 'sofia',
        text: replyText,
        articleCitation: citation,
        timestamp: 'Ahora'
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-xl w-full h-[580px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 transition-colors">
        {/* Header */}
        <div className="px-6 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FC7323] text-white flex items-center justify-center font-bold text-sm">
              <SenaEmblem size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base flex items-center gap-1.5">
                <span>Tutor Sofía</span>
                <span className="text-xs bg-amber-100 dark:bg-amber-950/60 text-[#FC7323] px-2 py-0.2 rounded-full font-medium">
                  Guía de Inducción
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Asesoría reglamentaria oficial en tiempo real</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick query chips */}
        <div className="px-4 py-2 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
          <span className="text-slate-400 dark:text-slate-500 font-medium shrink-0">Temas rápidos:</span>
          {[
            'Incapacidad médica',
            'Porte de carné',
            'Deserción de ficha',
            'Aplazamiento',
            'Bienestar SENA',
            'Sanciones y comités'
          ].map((topic, i) => (
            <button
              key={i}
              onClick={() => handleSend(topic)}
              className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full shrink-0 transition-colors"
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Chat message body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/40">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-slate-900 dark:bg-slate-800 text-white rounded-br-xs border border-transparent dark:border-slate-700'
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-bl-xs shadow-2xs'
                }`}
              >
                <p>{m.text}</p>
                {m.articleCitation && (
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1 text-[11px] font-mono text-[#FC7323] font-semibold">
                    <BookOpen className="w-3 h-3 shrink-0" />
                    <span>{m.articleCitation}</span>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1">{m.timestamp}</span>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Pregunta sobre el reglamento (ej: ¿cuántos días para justificar?)..."
            className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FC7323] text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 text-white bg-[#FC7323] hover:bg-[#e05e10] disabled:bg-slate-300 dark:disabled:bg-slate-700 rounded-xl transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
