export interface ModuleLesson {
  id: string;
  title: string;
  summary: string;
  articleReference?: string;
  keyPoints: string[];
  practicalAdvice: string;
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface LearningModule {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  description: string;
  iconName: string;
  estimatedMinutes: number;
  lessons: ModuleLesson[];
}

export interface DilemmaScenario {
  id: string;
  title: string;
  category: 'Derechos' | 'Deberes' | 'Prohibiciones' | 'Debido Proceso' | 'Seguridad y SST';
  context: string;
  character: string;
  dilemma: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    consequence: string;
    articleApplied: string;
    points: number;
  }[];
}

export interface QuizQuestion {
  id: string;
  moduleId: string;
  question: string;
  options: string[];
  correctIndex: number;
  articleCitation: string;
  explanation: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAtXP: number;
  category: string;
}

export interface LearnerProfile {
  fullName: string;
  documentType: 'C.C.' | 'T.I.' | 'P.E.P.' | 'C.E.';
  documentNumber: string;
  trainingProgram: string;
  recordNumber: string; // Ficha de caracterización
  regional: string;
  trainingCenter: string;
  modality: 'Presencial' | 'Virtual' | 'Combinada';
  startDate: string;
}

export const DEFAULT_PROFILE: LearnerProfile = {
  fullName: 'Juan Leonardo Castillo',
  documentType: 'C.C.',
  documentNumber: '1.025.789.450',
  trainingProgram: 'Tecnólogo en Análisis y Desarrollo de Software (ADSO)',
  recordNumber: '2824910',
  regional: 'Regional Distrito Capital',
  trainingCenter: 'Centro de Electricidad, Electrónica y Telecomunicaciones (CEET)',
  modality: 'Presencial',
  startDate: '2026-03-02'
};

export const BADGES: Badge[] = [
  {
    id: 'badge-1',
    title: 'Identidad y Orgullo SENA',
    description: 'Completó el módulo de valores, símbolos y formación integral bajo el Acuerdo 0009 de 2024.',
    icon: 'Flag',
    unlockedAtXP: 100,
    category: 'Identidad'
  },
  {
    id: 'badge-2',
    title: 'Defensor de Derechos',
    description: 'Conoce y apropia los 24 derechos fundamentales del aprendiz SENA.',
    icon: 'ShieldCheck',
    unlockedAtXP: 250,
    category: 'Derechos'
  },
  {
    id: 'badge-3',
    title: 'Ciudadano Ejemplar SENA',
    description: 'Aprobó con honores la sección de deberes formativos, ética y prohibiciones expresas.',
    icon: 'Award',
    unlockedAtXP: 450,
    category: 'Deberes'
  },
  {
    id: 'badge-4',
    title: 'Garante del Debido Proceso',
    description: 'Superó los casos prácticos sobre novedades, comités y plan de mejoramiento formativo.',
    icon: 'Scale',
    unlockedAtXP: 700,
    category: 'Debido Proceso'
  },
  {
    id: 'badge-5',
    title: 'Aprendiz Certificado 2026',
    description: 'Superó la evaluación oficial con puntaje sobresaliente y acreditó su inducción.',
    icon: 'Sparkles',
    unlockedAtXP: 900,
    category: 'Certificación'
  }
];

export const LEARNING_MODULES: LearningModule[] = [
  {
    id: 'mod-1',
    number: 1,
    title: 'Identidad Institucional, Formación Profesional Integral y Acuerdo 0009 de 2024',
    shortTitle: 'Identidad y Marco Legal',
    description: 'Conoce la historia, misión, valores, principios pedagógicos y el nuevo marco normativo unificado del SENA adoptado mediante Acuerdo 0009 de 2024.',
    iconName: 'Building2',
    estimatedMinutes: 45,
    lessons: [
      {
        id: 'l-1-1',
        title: 'Misión, Visión, Valores y Símbolos del SENA',
        summary: 'El SENA es la entidad más querida por los colombianos. Desde su creación legal (Ley 119 de 1994), imparte formación profesional integral y gratuita para el desarrollo social y técnico del país.',
        articleReference: 'Ley 119 de 1994 y Acuerdo 0009 de 2024 - Cap. I',
        keyPoints: [
          'El escudo y la bandera representan los sectores de la economía nacional: primario (agropecuario), secundario (industria y construcción) y terciario (comercio y servicios).',
          'El himno institucional exalta el trabajo productivo como fuerza creadora de paz y dignidad.',
          'La formación profesional integral (FPI) articula la dimensión técnica y el desarrollo ético humano.',
          'El logotipo del SENA simboliza el camino del aprendiz que proyecta su conocimiento hacia el progreso.'
        ],
        practicalAdvice: 'Porta los colores y símbolos del SENA con orgullo, respetando la diversidad y manteniendo una conducta alineada con los principios de honradez, solidaridad y respeto.',
        quiz: {
          question: '¿Qué sectores económicos están representados en el escudo y bandera institucional del SENA?',
          options: [
            'Únicamente el sector petrolero y minero energético.',
            'Los sectores agropecuario, industrial/construcción y comercio/servicios.',
            'Exclusivamente el sector financiero y bancario internacional.',
            'Sector de transporte marítimo y aeronáutico.'
          ],
          correctIndex: 1,
          explanation: 'El escudo del SENA plasma la rueda dentada (industria/construcción), el caduceo (comercio/servicios) y la rama de café (sector primario/agropecuario), sintetizando la economía productiva nacional.'
        }
      },
      {
        id: 'l-1-2',
        title: 'El Nuevo Reglamento del Aprendiz: Acuerdo 0009 de 2024',
        summary: 'El Consejo Directivo Nacional del SENA expidió el Acuerdo 0009 de 2024 (Diario Oficial No. 52.947), unificando y actualizando las normas de convivencia, derechos, deberes y debido proceso. Derogó expresamente al antiguo Acuerdo 007 de 2012.',
        articleReference: 'Acuerdo 0009 de 2024 - Cap. I y Disposiciones Finales',
        keyPoints: [
          'Aplica a todos los aprendices matriculados en programas de formación titulada y complementaria en todo el territorio nacional.',
          'Cubre todas las modalidades formativas: presencial, virtual (LMS Zajuna) y combinada.',
          'Derogó en su totalidad al Acuerdo 007 de 2012, Acuerdo 02 de 2014, Acuerdo 06 de 2023 y Acuerdo 02 de 2024.',
          'Consagra un enfoque pedagógico restaurativo centrado en los derechos humanos, la inclusión y el debido proceso.'
        ],
        practicalAdvice: 'Ten presente que el Acuerdo 0009 de 2024 es la única norma vigente que rige tus derechos, deberes y trámites en el SENA. Ningún centro ni instructor puede aplicar normas derogadas.',
        quiz: {
          question: '¿Cuál es el acuerdo vigente que rige el Reglamento del Aprendiz SENA y a cuál derogó?',
          options: [
            'El Acuerdo 007 de 2012, el cual derogó a la Ley 119 de 1994.',
            'El Acuerdo 0009 de 2024, el cual derogó expresamente al Acuerdo 007 de 2012 y sus reformas.',
            'La Resolución 219 de 2005, que sólo aplica para cursos virtuales.',
            'El Decreto 1072 de 2015 del Ministerio de Salud.'
          ],
          correctIndex: 1,
          explanation: 'El Acuerdo 0009 de 2024 adoptó el Reglamento del Aprendiz SENA vigente, derogando expresamente el Acuerdo 007 de 2012 y recopilando de forma unificada los derechos, deberes y garantías.'
        }
      },
      {
        id: 'l-1-3',
        title: 'Estructura de la Formación Profesional Integral (Lectiva y Productiva)',
        summary: 'Todo programa de formación profesional en el SENA comprende dos etapas complementarias: la etapa lectiva de fundamentación y la etapa productiva de aplicación real en el entorno laboral.',
        articleReference: 'Acuerdo 0009 de 2024 - Cap. I y IV',
        keyPoints: [
          'Etapa Lectiva: Desarrollo de competencias técnicas, transversales y socioemocionales en ambientes presenciales o en el Ecosistema Digital Zajuna.',
          'Etapa Productiva: Aplicación de conocimientos mediante contrato de aprendizaje, proyecto productivo, pasantía, monitoría o vínculo laboral/contractual.',
          'La formación en el SENA es gratuita en todas sus etapas; nadie puede cobrarte por cupos, evaluaciones o certificaciones.',
          'El seguimiento evaluativo se basa en juicios de competencia: "Aprobado" o "No Aprobado" según los resultados de aprendizaje.'
        ],
        practicalAdvice: 'Planifica tu etapa productiva desde el primer trimestre lectivo con el apoyo de tu instructor técnico y el área de Relaciones Corporativas de tu centro.',
        quiz: {
          question: '¿Cuáles son las alternativas reconocidas para el desarrollo de la etapa productiva en el SENA?',
          options: [
            'Únicamente el pago de una cuota de compensación económica al centro de formación.',
            'Contrato de aprendizaje, proyecto productivo, pasantía, monitoría y vínculo laboral afín al programa.',
            'Exclusivamente la asistencia a foros virtuales sin práctica laboral.',
            'Presentar una carta de recomendación de un familiar.'
          ],
          correctIndex: 1,
          explanation: 'El SENA reconoce diversas alternativas legítimas para la etapa productiva: contrato de aprendizaje, vinculación laboral afín, proyectos productivos I+D+i, monitorías y pasantías concertadas.'
        }
      }
    ]
  },
  {
    id: 'mod-2',
    number: 2,
    title: 'Derechos del Aprendiz SENA (Capítulo II - Acuerdo 0009 de 2024)',
    shortTitle: 'Derechos del Aprendiz',
    description: 'Apropia el catálogo de los 24 derechos fundamentales consagrados en el Capítulo II del Acuerdo 0009 de 2024, desde la inducción y calidad hasta las garantías del debido proceso.',
    iconName: 'ShieldCheck',
    estimatedMinutes: 50,
    lessons: [
      {
        id: 'l-2-1',
        title: 'Derecho a la Inducción, Formación de Calidad y Ambientes Dotados',
        summary: 'Todo aprendiz formalmente matriculado tiene derecho a recibir una inducción completa al inicio de su programa, acceder a ambientes tecnológicos adecuados y recibir formación por instructores idóneos.',
        articleReference: 'Acuerdo 0009 de 2024 - Cap. II (Derechos del Aprendiz)',
        keyPoints: [
          'Derecho a una inducción integral que garantice la apropiación del reglamento, el programa formativo y el proyecto formativo.',
          'Derecho al uso de aulas, laboratorios, talleres, bibliotecas físicas y bases de datos digitales.',
          'Acceso garantizado a las plataformas de aprendizaje (Ecosistema Digital Zajuna, correo "Soy SENA").',
          'Recibir oportunamente las guías de aprendizaje, cronogramas y retroalimentación pedagógica formativa.'
        ],
        practicalAdvice: 'Si presentas fallas con tus credenciales de Zajuna o tu correo institucional, contacta a la mesa de ayuda o a la coordinación académica de inmediato para no atrasar tus evidencias.',
        quiz: {
          question: '¿Qué derecho tiene el aprendiz respecto a la retroalimentación de sus evidencias de aprendizaje?',
          options: [
            'Solo puede conocer su calificación al finalizar todo el año lectivo sin derecho a revisión.',
            'Tiene derecho a recibir retroalimentación oportuna, constructiva y conocer las valoraciones de sus evidencias.',
            'El instructor no está obligado a retroalimentar si el curso es presencial.',
            'Las retroalimentaciones se cobran en la secretaría del centro.'
          ],
          correctIndex: 1,
          explanation: 'El Capítulo II del Acuerdo 0009 de 2024 establece el derecho de los aprendices a recibir retroalimentación clara, pedagógica y oportuna sobre sus evidencias para fortalecer sus competencias.'
        }
      },
      {
        id: 'l-2-2',
        title: 'Derecho a Bienestar al Aprendiz, Inclusión y Seguridad (SST)',
        summary: 'El SENA promueve un entorno seguro, diverso y enriquecedor. Tienes derecho a participar en las convocatorias de bienestar, recibir acompañamiento psicosocial y contar con Elementos de Protección Personal (EPP).',
        articleReference: 'Acuerdo 0009 de 2024 - Cap. II (Derechos del Aprendiz)',
        keyPoints: [
          'Beneficiarse de los programas de Bienestar al Aprendiz: salud, deporte, arte, cultura y orientación psicosocial.',
          'Acceso equitativo y transparente a convocatorias de apoyos de sostenimiento (FIC, Regular y Monitorías).',
          'Garantía de no discriminación por motivos de género, raza, credo, orientación sexual u origen étnico.',
          'Dotación y exigencia de Elementos de Protección Personal (EPP) y primeros auxilios en talleres y ambientes de riesgo.'
        ],
        practicalAdvice: 'Aprovecha las convocatorias de Bienestar de tu Centro. Si requieres apoyo psicosocial o experimentas situaciones de acoso o vulnerabilidad, acude a los profesionales de bienestar.',
        quiz: {
          question: '¿A qué programas y beneficios de Bienestar tiene derecho a postularse un aprendiz SENA según el Acuerdo 0009 de 2024?',
          options: [
            'Exclusivamente al préstamo de libros de biblioteca.',
            'A apoyos de sostenimiento, monitorías, actividades deportivas, culturales, salud preventiva y orientación psicosocial.',
            'A créditos bancarios hipotecarios directos con el director general.',
            'A viáticos de turismo internacional ilimitados.'
          ],
          correctIndex: 1,
          explanation: 'El Plan Nacional de Bienestar al Aprendiz del SENA abarca líneas estratégicas de salud, cultura, deporte, desarrollo integral, monitorías y apoyos de sostenimiento bajo criterios transparentes.'
        }
      },
      {
        id: 'l-2-3',
        title: 'Derecho al Debido Proceso, Libertad de Expresión y Representación',
        summary: 'En toda actuación académica o disciplinaria, el aprendiz goza de plenas garantías constitucionales: presunción de inocencia, derecho a ser escuchado, presentar pruebas y elegir a sus representantes.',
        articleReference: 'Acuerdo 0009 de 2024 - Cap. II (Derechos del Aprendiz)',
        keyPoints: [
          'Presunción de inocencia en cualquier señalamiento de falta académica o disciplinaria.',
          'Derecho a ser escuchado en descargos ante el Comité de Evaluación y Seguimiento de su ficha.',
          'Presentar pruebas, testimonios y controvertir los llamados de atención mediante recursos formales.',
          'Elegir y ser elegido democráticamente como Vocero de Ficha y Representante de Centro ante el Consejo Directivo.'
        ],
        practicalAdvice: 'Si eres citado a un Comité de Evaluación y Seguimiento, prepara tus argumentos con serenidad, aporta las evidencias pertinentes y asiste puntualmente; es tu espacio formal de defensa.',
        quiz: {
          question: '¿Qué garantía protege al aprendiz frente a una investigación disciplinaria en el SENA?',
          options: [
            'Expulsión inmediata sin citación ni derecho a ser escuchado.',
            'El principio de presunción de inocencia y el derecho irrenunciable al debido proceso con descargos y recursos.',
            'Sanción automática decidida por el celador del centro.',
            'Retención indefinida de sus documentos de identidad.'
          ],
          correctIndex: 1,
          explanation: 'El Acuerdo 0009 de 2024 consagra el debido proceso como derecho fundamental: nadie puede ser sancionado sin previa formulación de cargos, derecho a presentar descargos y ejercer recursos.'
        }
      }
    ]
  },
  {
    id: 'mod-3',
    number: 3,
    title: 'Deberes y Prohibiciones del Aprendiz SENA (Capítulo III - Acuerdo 0009 de 2024)',
    shortTitle: 'Deberes y Prohibiciones',
    description: 'Comprende las 24 obligaciones formativas y las 14 prohibiciones expresas consagradas en el Capítulo III del Acuerdo 0009 de 2024 para una convivencia pacífica y segura.',
    iconName: 'BookOpenCheck',
    estimatedMinutes: 55,
    lessons: [
      {
        id: 'l-3-1',
        title: 'Deberes Formativos, Acta de Compromiso y Carné Institucional',
        summary: 'Al matricularte en el SENA suscribes voluntariamente el Acta de Compromiso del Aprendiz. Debes asumir con responsabilidad tu proceso formativo, cuidar la infraestructura y portar tu identificación institucional.',
        articleReference: 'Acuerdo 0009 de 2024 - Cap. III (Deberes del Aprendiz)',
        keyPoints: [
          'Firmar y cumplir cabalmente el Acta de Compromiso como aprendiz SENA.',
          'Portar el carné institucional en lugar visible durante toda la permanencia en sedes físicas o visitas técnicas.',
          'Asistir con puntualidad a todas las sesiones presenciales y sincrónicas concertadas.',
          'Cuidar los equipos de cómputo, maquinaria de taller, mobiliario y recursos del centro de formación.',
          'Utilizar la indumentaria institucional y los EPP reglamentarios en los ambientes de taller y laboratorio.'
        ],
        practicalAdvice: 'El carné institucional del SENA es personal e intransferible. Prestarlo o alterarlo constituye una falta grave contra la seguridad del centro de formación.',
        quiz: {
          question: '¿Qué obligación tiene el aprendiz SENA respecto a su carné institucional según el Acuerdo 0009 de 2024?',
          options: [
            'Dejarlo guardado en casa para evitar que se deteriore.',
            'Portarlo en lugar visible en las instalaciones del SENA y utilizarlo de forma estrictamente personal e intransferible.',
            'Prestarlo a amigos o familiares para que ingresen al centro a almorzar.',
            'Venderlo o alquilarlo al finalizar la etapa lectiva.'
          ],
          correctIndex: 1,
          explanation: 'El carné es un documento público institucional personal e intransferible. Su porte visible es obligatorio por motivos de seguridad y control de acceso a los centros de formación.'
        }
      },
      {
        id: 'l-3-2',
        title: 'Probidad Académica, Ética Digital y No Plagio',
        summary: 'La formación en el SENA se fundamenta en la honestidad intelectual. Entregar código ajeno, usar IA sin autorización o apropiarse de evidencias de otros aprendices vulnera gravemente los principios formativos.',
        articleReference: 'Acuerdo 0009 de 2024 - Cap. III (Deberes y Prohibiciones)',
        keyPoints: [
          'Entregar evidencias de aprendizaje de autoría propia, citando debidamente fuentes bibliográficas y técnicas.',
          'Respetar los derechos de autor y licencias de software, esquemas de diseño y prototipos.',
          'Prohibido el plagio total o parcial en tareas, proyectos de desarrollo de software, informes y evaluaciones.',
          'Prohibida la suplantación de identidad en el Ecosistema Digital Zajuna o evaluaciones virtuales.',
          'Custodiar de manera confidencial las credenciales personales de acceso (usuario y contraseña de Zajuna / SOFIA).'
        ],
        practicalAdvice: 'Si utilizas código abierto o librerías externas en tus proyectos, documenta las licencias (MIT, Apache, GPL) y cita la procedencia. La transparencia técnica es un valor profesional esencial.',
        quiz: {
          question: '¿Cómo cataloga el Acuerdo 0009 de 2024 la copia de evidencias, el plagio de código y la suplantación en plataformas virtuales?',
          options: [
            'Como una conducta creativa recomendada para ahorrar tiempo.',
            'Como una falta académica grave que amerita plan de mejoramiento o comité disciplinario.',
            'Como un trámite administrativo sin consecuencias pedagógicas.',
            'Como un derecho de libre expresión del aprendiz.'
          ],
          correctIndex: 1,
          explanation: 'El fraude, el plagio intelectual y la suplantación de identidad vulneran la integridad de la formación profesional y constituyen faltas sancionables en el régimen disciplinario.'
        }
      },
      {
        id: 'l-3-3',
        title: 'Prohibiciones Expresas: Convivencia, No Discriminación y Cero Sustancias',
        summary: 'El Capítulo III del Acuerdo 0009 de 2024 establece 14 prohibiciones expresas diseñadas para preservar la convivencia pacífica, la seguridad física y la neutralidad institucional en el SENA.',
        articleReference: 'Acuerdo 0009 de 2024 - Cap. III (Prohibiciones)',
        keyPoints: [
          'Prohibido cualquier acto de discriminación, hostigamiento, ciberacoso o violencia física/verbal.',
          'Prohibido el proselitismo político electoral o religioso dentro de las instalaciones y canales institucionales.',
          'Prohibido portar, comercializar o consumir bebidas alcohólicas o sustancias psicoactivas en el SENA.',
          'Prohibido ingresar cualquier tipo de arma de fuego, cortopunzante o artefactos pirotécnicos a los centros.',
          'Prohibido comercializar bienes, rifas o servicios particulares no autorizados dentro de la entidad.'
        ],
        practicalAdvice: 'El SENA es un espacio plural, laico y neutral dedicado al aprendizaje. Respeta siempre las opiniones de los demás y fomenta el diálogo respetuoso ante cualquier desacuerdo.',
        quiz: {
          question: '¿Cuál de las siguientes conductas está expresamente prohibida en el Capítulo III del Acuerdo 0009 de 2024?',
          options: [
            'Proponer ideas innovadoras en el proyecto formativo de ficha.',
            'Realizar proselitismo político electoral o discriminar a otros miembros de la comunidad formativa.',
            'Participar en actividades deportivas programadas por Bienestar.',
            'Solicitar asesoría técnica adicional a los instructores del centro.'
          ],
          correctIndex: 1,
          explanation: 'El Acuerdo 0009 de 2024 prohíbe taxativamente el proselitismo político-electoral, los actos de discriminación y el consumo o porte de sustancias en las sedes institucionales.'
        }
      }
    ]
  },
  {
    id: 'mod-4',
    number: 4,
    title: 'Novedades, Permanencia, Faltas y Debido Proceso (Cap. IV y V - Acuerdo 0009 de 2024)',
    shortTitle: 'Novedades y Debido Proceso',
    description: 'Aprende cómo gestionar novedades de matrícula (aplazamientos, traslados), evitar la deserción, entender las medidas formativas y el debido proceso ante el Comité de Evaluación y Seguimiento.',
    iconName: 'Scale',
    estimatedMinutes: 50,
    lessons: [
      {
        id: 'l-4-1',
        title: 'Novedades de Matrícula: Traslados, Aplazamiento y Retiro Voluntario',
        summary: 'Durante tu vida formativa pueden presentarse circunstancias personales o laborales imprevistas. El Capítulo IV del Acuerdo 0009 de 2024 reglamenta los trámites para novedades de formación.',
        articleReference: 'Acuerdo 0009 de 2024 - Cap. IV (Ingreso, Permanencia y Certificación)',
        keyPoints: [
          'Aplazamiento: Solicitud motivada para suspender la formación por fuerza mayor, salud o servicio militar, hasta por un máximo de seis (6) meses.',
          'Reingreso: Trámite para reactivar la matrícula una vez vencido el período de aplazamiento, sujeto a cupo y vigencia del programa.',
          'Traslado: Cambio de jornada, sede o centro de formación previa justificación y análisis de cupo.',
          'Retiro Voluntario: Manifestación escrita del aprendiz para retirarse del programa; si se radica formalmente, no acarrea sanción de inhabilidad.'
        ],
        practicalAdvice: 'Si tienes problemas personales graves o de salud, tramita un aplazamiento a tiempo antes de dejar de asistir. Esto protegerá tu hoja de vida académica en el SENA.',
        quiz: {
          question: '¿Cuál es el tiempo máximo continuo de aplazamiento permitido en el SENA por causas justificadas?',
          options: [
            'Hasta dos (2) años consecutivos sin necesidad de justificación.',
            'Hasta seis (6) meses continuos, debidamente soportados ante la coordinación académica.',
            'Tres (3) días calendario únicamente.',
            'No existe el aplazamiento en el SENA.'
          ],
          correctIndex: 1,
          explanation: 'El Acuerdo 0009 de 2024 permite el aplazamiento justificado de la formación hasta por un máximo de seis (6) meses continuos por razones de salud, calamidad o servicio militar comprobadas.'
        }
      },
      {
        id: 'l-4-2',
        title: 'Inasistencias, Justificaciones y Causales de Deserción',
        summary: 'El ausentismo no justificado perjudica el avance del grupo y puede desencadenar la cancelación de la matrícula por deserción. Aprende los plazos y procedimientos para justificar ausencias médicas o de fuerza mayor.',
        articleReference: 'Acuerdo 0009 de 2024 - Cap. IV y V',
        keyPoints: [
          'Plazo de justificación: El aprendiz dispone de hasta tres (3) días hábiles siguientes al hecho generador para radicar los soportes válidos (incapacidad médica EPS/IPS o fuerza mayor).',
          'Causal de Deserción 1: Tres (3) días hábiles consecutivos de inasistencia injustificada a la formación presencial o virtual.',
          'Causal de Deserción 2: No reportar el inicio o avance de la etapa productiva dentro de los plazos establecidos.',
          'Procedimiento de Deserción: El centro notifica por escrito al aprendiz para que presente descargos en un término de cinco (5) días hábiles; de no justificar, se cancela la matrícula con 6 meses de inhabilidad.'
        ],
        practicalAdvice: 'Nunca te ausentes sin avisar a tu instructor o vocero de ficha. Radica siempre tus incapacidades expedidas por tu EPS de manera oportuna por los canales oficiales del centro.',
        quiz: {
          question: '¿Cuántos días hábiles consecutivos de inasistencia injustificada configuran causal de deserción según el Acuerdo 0009 de 2024?',
          options: [
            'Quince (15) días hábiles.',
            'Tres (3) días hábiles consecutivos.',
            'Un (1) mes calendario completo.',
            'Ocho (8) semanas.'
          ],
          correctIndex: 1,
          explanation: 'Acumular tres (3) días hábiles consecutivos de inasistencia injustificada activa el proceso formal de deserción del aprendiz, otorgando 5 días hábiles para presentar descargos formales.'
        }
      },
      {
        id: 'l-4-3',
        title: 'Medidas Formativas, Faltas y Comité de Evaluación y Seguimiento',
        summary: 'El régimen disciplinario del SENA prioriza las medidas pedagógicas formativas antes que las sanciones punitivas. El Comité de Evaluación y Seguimiento actúa como cuerpo colegiado asesor de la Subdirección de Centro.',
        articleReference: 'Acuerdo 0009 de 2024 - Cap. V (Régimen Sancionatorio y Debido Proceso)',
        keyPoints: [
          'Medida pedagógica prioritaria: Llamado de atención verbal y Plan de Mejoramiento Formativo concertado.',
          'Clasificación de Faltas: Académicas (incumplimiento de evidencias) y Disciplinarias (conductas contra la convivencia y seguridad); graduadas en leves o graves.',
          'Sanciones Formales: Llamado de atención escrito a hoja de vida, Condicionamiento de matrícula y Cancelación de matrícula (con inhabilidad de 6 a 24 meses según la gravedad).',
          'Comité de Evaluación y Seguimiento: Sesiona con presencia del instructor líder, vocero de ficha, bienestar y coordinación para escuchar al aprendiz y recomendar medidas al Subdirector.'
        ],
        practicalAdvice: 'Un Plan de Mejoramiento es una oportunidad pedagógica invaluable para nivelar tus competencias técnicas o corregir una conducta. Cúmplelo con entusiasmo y rigurosidad.',
        quiz: {
          question: '¿Cuál es la primera medida formativa y pedagógica que contempla el Acuerdo 0009 de 2024 frente a dificultades académicas o leves?',
          options: [
            'Denuncia penal inmediata ante la Fiscalía General.',
            'Llamado de atención verbal y formulación de un Plan de Mejoramiento pedagógico.',
            'Expulsión definitiva del centro con cobro de multa.',
            'Cancelación automática del carné institucional.'
          ],
          correctIndex: 1,
          explanation: 'El Acuerdo 0009 de 2024 privilegia el sentido pedagógico de la formación profesional mediante el llamado de atención verbal y la concertación de un Plan de Mejoramiento académico o actitudinal.'
        }
      }
    ]
  }
];

export const DILEMMA_SCENARIOS: DilemmaScenario[] = [
  {
    id: 'case-1',
    title: 'El Préstamo del Carné Institucional para el Almuerzo',
    category: 'Deberes',
    character: 'Camilo, aprendiz de Gestión Logística en sede presencial',
    context: 'Un compañero de ficha llegó a la sede del SENA sin su carné institucional porque lo olvidó en su casa. El personal de seguridad no le permite el ingreso para almorzar en el comedor del centro. El compañero le pide a Camilo que le preste su carné durante 15 minutos para pasar el control biométrico.',
    dilemma: '¿Debe Camilo prestar su carné para ayudar a su compañero a ingresar al centro de formación?',
    options: [
      {
        id: 'opt-1-a',
        text: 'Prestarle el carné discretamente para que su amigo pueda comer, ya que la solidaridad entre compañeros prima sobre cualquier regla administrativa.',
        isCorrect: false,
        consequence: 'El lector de seguridad detectó duplicidad de registro. Ambos aprendices fueron citados al Comité de Evaluación por suplantación y uso indebido de documento institucional, falta calificada como grave.',
        articleApplied: 'Acuerdo 0009 de 2024 - Cap. III (Deberes del Aprendiz y Prohibición expresa de uso indebido de carné)',
        points: -40
      },
      {
        id: 'opt-1-b',
        text: 'Negarse amablemente a prestar el carné y acompañar al compañero ante la Oficina de Seguridad o Coordinación para que expidan un pase de ingreso provisional.',
        isCorrect: true,
        consequence: 'Decisión reglamentaria intachable. El compañero obtuvo su pase provisional de visitante previa verificación de identidad en el sistema y Camilo protegió su integridad académica institucional.',
        articleApplied: 'Acuerdo 0009 de 2024 - Cap. III (Deber de porte visible y personal del carné institucional)',
        points: 150
      },
      {
        id: 'opt-1-c',
        text: 'Ignorar a su amigo y decirle al guarda de seguridad que lo sancione inmediatamente.',
        isCorrect: false,
        consequence: 'Aunque no prestó el carné, la actitud hostil deterioró el clima de convivencia formativa sin aportar una solución institucional empática.',
        articleApplied: 'Acuerdo 0009 de 2024 - Cap. I y III (Principios de convivencia y compañerismo en la FPI)',
        points: 20
      }
    ]
  },
  {
    id: 'case-2',
    title: 'Incapacidad Médica y Plazo de Justificación Legal',
    category: 'Debido Proceso',
    character: 'Valentina, aprendiz de ADSO que sufrió una fractura deportiva',
    context: 'Valentina sufrió un accidente jugando fútbol el fin de semana y su médico de la EPS le otorgó 5 días de incapacidad médica. Como está en cama reposando, piensa esperar a regresar a clases presenciales la próxima semana para entregar los documentos originales en físico a su instructor técnico.',
    dilemma: '¿Debe Valentina esperar a volver a clases para entregar la incapacidad médica o debe reportarla antes?',
    options: [
      {
        id: 'opt-2-a',
        text: 'Esperar a regresar físicamente la siguiente semana y entregar la hoja original arrugada al instructor.',
        isCorrect: false,
        consequence: 'Al pasar más de tres (3) días hábiles sin radicar la justificación, el sistema registró inasistencia injustificada consecutiva y se emitió notificación preventiva por presunta deserción.',
        articleApplied: 'Acuerdo 0009 de 2024 - Cap. IV (Término perentorio de 3 días hábiles para justificar inasistencias)',
        points: -30
      },
      {
        id: 'opt-2-b',
        text: 'Escanear o fotografiar legiblemente la incapacidad de la EPS y enviarla por correo institucional o radicarla virtualmente dentro de los tres (3) días hábiles siguientes.',
        isCorrect: true,
        consequence: 'Excelente aplicación reglamentaria. La coordinación validó oportunamente la excusa, el instructor concertó la reprogramación de evidencias y Valentina protegió su matrícula formal.',
        articleApplied: 'Acuerdo 0009 de 2024 - Cap. IV (Justificación válida dentro de 3 días hábiles)',
        points: 150
      },
      {
        id: 'opt-2-c',
        text: 'Pedirle a un amigo que falsifique una firma en la lista de asistencia diaria mientras ella se recupera.',
        isCorrect: false,
        consequence: 'Falsedad documental grave. La alteración de listas de asistencia constituye falta disciplinaria grave con apertura inmediata de comité sancionatorio.',
        articleApplied: 'Acuerdo 0009 de 2024 - Cap. III y V (Prohibición de fraude y alteración de registros)',
        points: -100
      }
    ]
  },
  {
    id: 'case-3',
    title: 'Plagio de Código y Trabajo Colaborativo en Zajuna',
    category: 'Prohibiciones',
    character: 'Mateo, aprendiz de Desarrollo de Software ante la entrega final',
    context: 'Faltan 2 horas para vencer el plazo en Zajuna para entregar el backend de un proyecto de e-commerce. Mateo no alcanzó a completar la autenticación JWT y encuentra en un repositorio público de GitHub un proyecto idéntico subido por un aprendiz de otra regional. Su compañero le dice: "Copia el código, cámbiale el nombre de las variables y súbelo; nadie se dará cuenta".',
    dilemma: '¿Debe Mateo copiar el código para no reprobar la competencia o asumir su estado real?',
    options: [
      {
        id: 'opt-3-a',
        text: 'Copiar el código de GitHub cambiando el nombre de algunas variables y entregarlo como propio.',
        isCorrect: false,
        consequence: 'El analizador de código y la sustentación del instructor detectaron la copia idéntica. Se le asignó juicio "No Aprobado" y se inició proceso disciplinario por fraude académico.',
        articleApplied: 'Acuerdo 0009 de 2024 - Cap. III (Deber de probidad académica y prohibición expresa de plagio)',
        points: -80
      },
      {
        id: 'opt-3-b',
        text: 'Entregar su código propio hasta donde alcanzó, documentar honestamente las limitaciones y solicitar al instructor un Plan de Mejoramiento pedagógico.',
        isCorrect: true,
        consequence: 'Decisión ética intachable. El instructor valoró la honestidad intelectual y le formuló un Plan de Mejoramiento de 8 días para culminar la competencia técnica satisfactoriamente.',
        articleApplied: 'Acuerdo 0009 de 2024 - Cap. V (Uso de medidas pedagógicas y Plan de Mejoramiento formativo)',
        points: 150
      },
      {
        id: 'opt-3-c',
        text: 'No entregar nada y no responder los mensajes del instructor durante dos semanas.',
        isCorrect: false,
        consequence: 'El abandono de actividades sin justificación condujo a la apertura de un proceso de deserción por incumplimiento de evidencias.',
        articleApplied: 'Acuerdo 0009 de 2024 - Cap. IV (Deserción por incumplimiento injustificado de actividades)',
        points: -50
      }
    ]
  },
  {
    id: 'case-4',
    title: 'Seguridad en Taller y Elementos de Protección Personal (EPP)',
    category: 'Seguridad y SST',
    character: 'Sofía, aprendiz de Mantenimiento Electromecánico',
    context: 'Sofía debe ingresar al taller de máquinas herramientas para realizar un mecanizado en torno. Hace calor en la nave y olvidó sus gafas de seguridad y botas dieléctricas en su casa. Un compañero le ofrece unos lentes de sol normales y le dice: "Entra rápido, el instructor está ocupado calificando en el computador y no te va a decir nada".',
    dilemma: '¿Debe Sofía ingresar al taller sin los EPP reglamentarios para no perder la práctica de mecanizado?',
    options: [
      {
        id: 'opt-4-a',
        text: 'Ingresar con los lentes de sol oscuros y mantenerse agachada detrás del torno para que no la vean.',
        isCorrect: false,
        consequence: 'Una viruta metálica desprendida golpeó el lente provocando riesgo ocular severo. Además, violó el protocolo de SST, haciéndose acreedora a un llamado de atención formal por imprudencia grave.',
        articleApplied: 'Acuerdo 0009 de 2024 - Cap. III (Deber de acatar normas de Seguridad y Salud en el Trabajo)',
        points: -70
      },
      {
        id: 'opt-4-b',
        text: 'Informar al instructor que no cuenta con los EPP adecuados, abstenerse de operar la maquinaria y solicitar apoyo al pañol de herramientas para el préstamo de elementos reglamentarios.',
        isCorrect: true,
        consequence: 'Excelente decisión preventiva. El almacén del centro le facilitó gafas de policarbonato normadas y Sofía realizó su práctica garantizando su vida e integridad física.',
        articleApplied: 'Acuerdo 0009 de 2024 - Cap. II y III (Derecho a ambientes seguros y deber de autocuidado en SST)',
        points: 150
      },
      {
        id: 'opt-4-c',
        text: 'Operar la máquina a control remoto usando un palo de madera para no acercarse.',
        isCorrect: false,
        consequence: 'Conducta temeraria que arriesga los equipos de alto costo del taller y la seguridad colectiva de los compañeros.',
        articleApplied: 'Acuerdo 0009 de 2024 - Cap. III (Prohibición de maniobras inseguras no autorizadas)',
        points: -60
      }
    ]
  }
];

export const FINAL_EVALUATION_QUESTIONS: QuizQuestion[] = [
  {
    id: 'feq-1',
    moduleId: 'mod-1',
    question: '¿Cuál es el acuerdo vigente que adopta el Reglamento del Aprendiz SENA actualmente en Colombia?',
    options: [
      'El Acuerdo 007 de 2012 expedido hace más de una década.',
      'El Acuerdo 0009 de 2024, expedido por el Consejo Directivo Nacional y publicado en el Diario Oficial No. 52.947.',
      'La Resolución 144 de 1999 de la Secretaría de Educación.',
      'El Código Sustantivo del Trabajo de 1950 exclusivamente.'
    ],
    correctIndex: 1,
    articleCitation: 'Acuerdo 0009 de 2024 - Diario Oficial No. 52.947',
    explanation: 'El Acuerdo 0009 de 2024 derogó al Acuerdo 007 de 2012 y unificó toda la reglamentación del aprendiz SENA en un solo cuerpo normativo integral.'
  },
  {
    id: 'feq-2',
    moduleId: 'mod-1',
    question: '¿Qué principio orienta la Formación Profesional Integral (FPI) según el marco legal del SENA?',
    options: [
      'La enseñanza teórica desarticulada del entorno laboral y sin práctica.',
      'El desarrollo armónico de la dimensión técnica profesional y la dimensión humana, ética y social.',
      'El cobro de matrículas mensuales obligatorias a los estratos 1 y 2.',
      'La exclusión de personas que no tengan título universitario previo.'
    ],
    correctIndex: 1,
    articleCitation: 'Ley 119 de 1994 y Acuerdo 0009 de 2024 - Cap. I',
    explanation: 'La FPI en el SENA concibe al ser humano de manera integral, combinando competencias técnicas de alto nivel con formación en valores, convivencia y responsabilidad ciudadana.'
  },
  {
    id: 'feq-3',
    moduleId: 'mod-2',
    question: '¿Cuántos derechos fundamentales consagra de manera expresa el Capítulo II del Acuerdo 0009 de 2024 para los aprendices?',
    options: [
      'Solo 3 derechos básicos relacionados con el uso de biblioteca.',
      '24 derechos que abarcan inducción, calidad formativa, bienestar, libertad de expresión, EPP y debido proceso.',
      'Ninguno, ya que el reglamento solo consagra obligaciones y sanciones.',
      '50 derechos laborales con derecho a pensión anticipada.'
    ],
    correctIndex: 1,
    articleCitation: 'Acuerdo 0009 de 2024 - Cap. II (Derechos del Aprendiz)',
    explanation: 'El Capítulo II del Acuerdo 0009 de 2024 formula un amplio catálogo de 24 derechos garantistas que fortalecen la dignidad y la protección del aprendiz SENA.'
  },
  {
    id: 'feq-4',
    moduleId: 'mod-2',
    question: '¿Qué garantía esencial protege a un aprendiz citado a Comité de Evaluación y Seguimiento según el Acuerdo 0009 de 2024?',
    options: [
      'La expulsión automática sin derecho a ser escuchado ni presentar pruebas.',
      'El derecho al debido proceso, presunción de inocencia, descargos y la interposición de recursos.',
      'El pago obligatorio de una fianza económica ante el director de centro.',
      'La retención de sus calificaciones en todas las materias de forma indefinida.'
    ],
    correctIndex: 1,
    articleCitation: 'Acuerdo 0009 de 2024 - Cap. II y Cap. V',
    explanation: 'El derecho al debido proceso es una garantía constitucional irrenunciable que asegura que todo aprendiz sea escuchado en descargos y ejerza su derecho a la contradicción.'
  },
  {
    id: 'feq-5',
    moduleId: 'mod-3',
    question: '¿Cuál es la naturaleza del carné institucional del SENA según el Capítulo III del Acuerdo 0009 de 2024?',
    options: [
      'Es un documento comercial transferible que se puede vender a terceros.',
      'Es un documento institucional público, de uso estrictamente personal e intransferible, de porte visible obligatorio.',
      'Es un carné optativo que solo se utiliza en fiestas institucionales.',
      'Es propiedad de los voceros de ficha quienes pueden intercambiarlo a discreción.'
    ],
    correctIndex: 1,
    articleCitation: 'Acuerdo 0009 de 2024 - Cap. III (Deberes del Aprendiz)',
    explanation: 'El carné del SENA es personal e intransferible; prestarlo, alterarlo o comercializarlo constituye una prohibición expresa calificada como falta grave.'
  },
  {
    id: 'feq-6',
    moduleId: 'mod-3',
    question: '¿Cuál de las siguientes acciones está expresamente prohibida en el Capítulo III del Acuerdo 0009 de 2024?',
    options: [
      'Proponer proyectos de innovación aplicada en TecnoParque o SENNOVA.',
      'Realizar proselitismo político electoral o ejercer actos de discriminación u hostigamiento.',
      'Participar en los torneos deportivos organizados por Bienestar al Aprendiz.',
      'Utilizar el correo electrónico institucional para entregar evidencias de aprendizaje.'
    ],
    correctIndex: 1,
    articleCitation: 'Acuerdo 0009 de 2024 - Cap. III (Prohibiciones)',
    explanation: 'El Acuerdo 0009 de 2024 prohíbe taxativamente el proselitismo político, la discriminación y cualquier manifestación de violencia en los ambientes presenciales y digitales del SENA.'
  },
  {
    id: 'feq-7',
    moduleId: 'mod-4',
    question: 'Si un aprendiz presenta una incapacidad médica expedida por su EPS/IPS, ¿de cuánto tiempo dispone para radicarla formalmente?',
    options: [
      'Hasta un mes después de haber terminado el trimestre.',
      'Hasta tres (3) días hábiles siguientes al hecho generador de la incapacidad.',
      'El mismo día antes de las 6:00 a.m. sin excepción alguna.',
      'No es necesario entregarla, basta con decírselo verbalmente a un compañero.'
    ],
    correctIndex: 1,
    articleCitation: 'Acuerdo 0009 de 2024 - Cap. IV (Justificación de Inasistencias)',
    explanation: 'El plazo legal improrrogable para radicar las justificaciones e incapacidades médicas ante el SENA es de tres (3) días hábiles siguientes al inicio del hecho generador.'
  },
  {
    id: 'feq-8',
    moduleId: 'mod-4',
    question: '¿Cuántos días hábiles consecutivos de inasistencia injustificada dan inicio formal al trámite de deserción?',
    options: [
      'Treinta (30) días calendario de ausencia continuada.',
      'Tres (3) días hábiles consecutivos de inasistencia sin soporte legal.',
      'Diez (10) días hábiles únicamente en jornada nocturna.',
      'Un solo retraso de 10 minutos a la primera clase.'
    ],
    correctIndex: 1,
    articleCitation: 'Acuerdo 0009 de 2024 - Cap. IV (Trámite de Deserción)',
    explanation: 'Tres días hábiles consecutivos de inasistencia injustificada activan la causal de deserción; el centro notificará al aprendiz otorgándole 5 días hábiles para rendir descargos.'
  },
  {
    id: 'feq-9',
    moduleId: 'mod-4',
    question: '¿Qué es un Plan de Mejoramiento Formativo según el Acuerdo 0009 de 2024?',
    options: [
      'Una sanción económica con retención de matrícula bancaria.',
      'Una medida pedagógica formativa concertada para superar falencias académicas o actitudinales en un plazo determinado.',
      'Un examen extraordinario cobrado por una universidad privada externa.',
      'Un trabajo de aseo y pintura de la sede durante los fines de semana.'
    ],
    correctIndex: 1,
    articleCitation: 'Acuerdo 0009 de 2024 - Cap. V (Medidas Formativas)',
    explanation: 'El Plan de Mejoramiento es una herramienta pedagógica garantista cuyo propósito es acompañar al aprendiz para que alcance los resultados de aprendizaje pendientes.'
  },
  {
    id: 'feq-10',
    moduleId: 'mod-4',
    question: '¿Por cuánto tiempo máximo continuo puede un aprendiz solicitar el aplazamiento justificado de su programa?',
    options: [
      'Hasta dos (2) años académicos sin soporte probatorio.',
      'Hasta seis (6) meses continuos por motivos de fuerza mayor, salud o servicio militar comprobados.',
      'Quince (15) días calendario como máximo.',
      'El aplazamiento fue prohibido en Colombia.'
    ],
    correctIndex: 1,
    articleCitation: 'Acuerdo 0009 de 2024 - Cap. IV (Novedades de Formación)',
    explanation: 'El Acuerdo 0009 de 2024 establece un período máximo de aplazamiento justificado de hasta seis (6) meses continuos, salvaguardando el derecho al reingreso formativo.'
  }
];

export const REGULATION_ARTICLES = [
  {
    chapter: 'Capítulo I',
    title: 'Disposiciones Generales, Marco Legal y Ámbito de Aplicación',
    articles: [
      {
        number: 'Cap. I - Art. 1',
        name: 'Objeto y Alcance del Reglamento',
        content: 'El Acuerdo 0009 de 2024 adopta el Reglamento del Aprendiz del Servicio Nacional de Aprendizaje (SENA). Regula los derechos, deberes, prohibiciones, novedades, medidas pedagógicas y debido proceso aplicable a todos los aprendices matriculados en formación presencial, virtual y combinada en todo el territorio colombiano.'
      },
      {
        number: 'Cap. I - Art. 2',
        name: 'Concepto de Aprendiz SENA',
        content: 'Se considera aprendiz a toda persona natural con matrícula formal vigente en cualquiera de los programas de formación profesional integral, titulada o complementaria, en cualquier centro de formación o entorno virtual (Ecosistema Zajuna).'
      },
      {
        number: 'Cap. I - Art. 3',
        name: 'Derogatoria Integral',
        content: 'El Acuerdo 0009 de 2024 deroga expresamente al Acuerdo 007 de 2012, al Acuerdo 02 de 2014, al Acuerdo 06 de 2023 y al Acuerdo 02 de 2024, consolidando un único marco normativo vigente para la comunidad del SENA.'
      }
    ]
  },
  {
    chapter: 'Capítulo II',
    title: 'Derechos del Aprendiz SENA (Catálogo de 24 Derechos)',
    articles: [
      {
        number: 'Cap. II - Num. 1 al 4',
        name: 'Inducción, Formación de Calidad y Acceso a Recursos',
        content: 'Derecho a recibir inducción completa al inicio del programa; acceder a formación profesional de calidad orientada por instructores competentes; disponer de aulas, talleres, laboratorios y herramientas tecnológicas adecuadas (Zajuna LMS); y ser evaluado bajo criterios pedagógicos claros y concertados.'
      },
      {
        number: 'Cap. II - Num. 5 al 9',
        name: 'Bienestar al Aprendiz e Inclusión Diferencial',
        content: 'Derecho a gozar de los programas de Bienestar al Aprendiz en salud preventiva, cultura, arte, recreación y deporte; postularse con transparencia a apoyos de sostenimiento (FIC, Regular y Monitorías); y recibir un trato digno sin discriminación alguna por motivos de género, raza, credo o procedencia.'
      },
      {
        number: 'Cap. II - Num. 10 al 16',
        name: 'Seguridad en Talleres y Elementos de Protección (EPP)',
        content: 'Derecho a contar con ambientes de aprendizaje seguros en cumplimiento de los estándares de Seguridad y Salud en el Trabajo (SST), recibir dotación oportuna de EPP según el nivel de riesgo de la especialidad y disponer de póliza de accidentes escolares durante la formación.'
      },
      {
        number: 'Cap. II - Num. 17 al 24',
        name: 'Debido Proceso, Libertad de Expresión y Representación',
        content: 'Derecho a la presunción de inocencia; ser escuchado en descargos ante el Comité de Evaluación y Seguimiento; interponer recursos de ley; manifestar libremente sus opiniones en un marco de respeto; y elegir democráticamente a voceros de ficha y representantes estudiantiles.'
      }
    ]
  },
  {
    chapter: 'Capítulo III',
    title: 'Deberes del Aprendiz y Prohibiciones Expresas',
    articles: [
      {
        number: 'Cap. III - Deberes',
        name: 'Catálogo de los 24 Deberes del Aprendiz',
        content: 'Firmar y cumplir el Acta de Compromiso; asistir con puntualidad; portar el carné en lugar visible; usar indumentaria adecuada y EPP en talleres; actuar con honestidad intelectual (evitar el plagio); cuidar los bienes institucionales; y mantener un trato respetuoso hacia toda la comunidad SENA.'
      },
      {
        number: 'Cap. III - Prohibiciones',
        name: 'Las 14 Prohibiciones Expresas en el SENA',
        content: 'Prohibido realizar proselitismo político electoral o religioso en sedes institucionales; ejercer cualquier forma de discriminación, acoso o violencia; cometer fraude, suplantación o plagio en Zajuna; portar armas; ingresar o consumir alcohol o drogas; prestar el carné institucional; y comercializar bienes o servicios particulares no autorizados.'
      }
    ]
  },
  {
    chapter: 'Capítulo IV',
    title: 'Ingreso, Permanencia, Novedades y Certificación',
    articles: [
      {
        number: 'Cap. IV - Art. Novedades',
        name: 'Traslados, Aplazamientos y Retiro Voluntario',
        content: 'El aprendiz puede solicitar aplazamiento justificado de su matrícula por hasta seis (6) meses continuos por salud, fuerza mayor o servicio militar. El retiro voluntario radicado por escrito no genera sanción de inhabilidad. Los traslados de ficha o sede requieren justificación académica y existencia de cupo.'
      },
      {
        number: 'Cap. IV - Art. Deserción',
        name: 'Causales y Procedimiento de Deserción',
        content: 'Se configura deserción al acumular tres (3) días hábiles consecutivos de inasistencia injustificada o no reportar el inicio de la etapa productiva. El centro formula requerimiento formal por escrito otorgando cinco (5) días hábiles para rendir descargos; de no justificarse, se emite resolución de cancelación de matrícula con inhabilidad de 6 meses.'
      }
    ]
  },
  {
    chapter: 'Capítulo V',
    title: 'Régimen de Faltas, Medidas Formativas y Debido Proceso',
    articles: [
      {
        number: 'Cap. V - Art. Medidas',
        name: 'Medidas Pedagógicas Formativas',
        content: 'El SENA prioriza la formación restaurativa: llamado de atención verbal formativo y suscripción de Plan de Mejoramiento pedagógico (académico o actitudinal), el cual establece compromisos medibles en un término definido.'
      },
      {
        number: 'Cap. V - Art. Sanciones',
        name: 'Sanciones Formales y Comité de Evaluación',
        content: 'Las sanciones formales se imponen previo debido proceso ante el Comité de Evaluación y Seguimiento: llamado de atención escrito a hoja de vida, condicionamiento de matrícula y cancelación definitiva de matrícula con inhabilidad de 6 a 24 meses según la gravedad de la falta.'
      }
    ]
  }
];

export const FREQUENT_QUESTIONS = [
  {
    question: '¿Cuál es el reglamento que rige actualmente al aprendiz SENA?',
    answer: 'El Acuerdo 0009 de 2024 (publicado en el Diario Oficial No. 52.947 del 21 de noviembre de 2024), el cual derogó íntegramente al antiguo Acuerdo 007 de 2012 y sus reformas.',
    article: 'Acuerdo 0009 de 2024 - Cap. I y Disposiciones Finales'
  },
  {
    question: '¿Cuántos días tengo para justificar una inasistencia por incapacidad médica?',
    answer: 'Dispones de hasta tres (3) días hábiles siguientes al inicio de la incapacidad para radicarla formalmente con el certificado expedido por tu EPS o IPS habilitada.',
    article: 'Acuerdo 0009 de 2024 - Cap. IV'
  },
  {
    question: '¿Cuándo se configura la deserción en la formación del SENA?',
    answer: 'Cuando acumulas tres (3) días hábiles consecutivos de inasistencia injustificada a la formación presencial/virtual o cuando no reportas la etapa productiva en los plazos legales. Tienes 5 días hábiles para presentar descargos tras la notificación.',
    article: 'Acuerdo 0009 de 2024 - Cap. IV'
  },
  {
    question: '¿Por cuánto tiempo puedo solicitar el aplazamiento de mi programa?',
    answer: 'Hasta por un máximo de seis (6) meses continuos por motivos justificados de salud, fuerza mayor comprobada o servicio militar.',
    article: 'Acuerdo 0009 de 2024 - Cap. IV'
  },
  {
    question: '¿Qué pasa si presto mi carné institucional a otra persona?',
    answer: 'El carné es personal e intransferible. Prestarlo o alterarlo es una prohibición expresa (Capítulo III) calificada como falta disciplinaria grave que puede acarrear sanción formal o condicionamiento de matrícula.',
    article: 'Acuerdo 0009 de 2024 - Cap. III (Prohibiciones)'
  },
  {
    question: '¿Qué es el Plan de Mejoramiento Formativo?',
    answer: 'Es una medida pedagógica concertada entre el instructor y el aprendiz para superar resultados de aprendizaje no aprobados o compromisos actitudinales en un plazo perentorio.',
    article: 'Acuerdo 0009 de 2024 - Cap. V'
  }
];
