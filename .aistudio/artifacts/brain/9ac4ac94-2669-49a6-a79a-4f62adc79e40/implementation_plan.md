# Sincronización Automática con Google Sheets y Google Drive (Sin Intervención Manual)

Sistema de sincronización desatendida y automática para el prototipo de Inducción SENA, que envía y registra de manera transparente todos los datos de los aprendices en la hoja de cálculo de Google Drive inmediatamente al aprobar la evaluación y certificarse bajo el Acuerdo 0009 de 2024, sin ventanas emergentes (popups), sin logins continuos de Google y con tolerancia a desconexiones mediante cola de reintentos en segundo plano.

## User Review & Critical Decisions

> [!IMPORTANT]
> Decisiones confirmadas por el usuario y configuración del mecanismo de conexión automática:

- **Decisión Confirmada 1 (Método de Envío Automático)**: Se implementará un despachador por Webhook directo (Google Apps Script Web App endpoint / API proxy) que recibe las solicitudes `POST` en segundo plano desde el cliente sin abrir ventanas emergentes de Google (`signInWithPopup`), eliminando para siempre el error `auth/popup-closed-by-user` para los aprendices.
- **Decisión Confirmada 2 (Momento de Disparo)**: El registro se ejecuta automáticamente en el instante en que el aprendiz alcanza el 80% o más en la evaluación final del Acuerdo 0009 de 2024 y se genera su certificado oficial con código de verificación.
- **Mecanismo de Resiliencia (Cola Offline & Silent Retry)**: Si el aprendiz pierde la conexión o el endpoint de red tarda, los registros se encolan automáticamente en almacenamiento local y se sincronizan silenciosamente en segundo plano sin bloquear la experiencia del aprendiz.
- **Acceso Directo a la Hoja para el Instructor/Administrador**: La barra de navegación y la vista de certificación mostrarán un enlace directo y persistente a la hoja de cálculo oficial en Google Drive para que el instructor o evaluador pueda auditar los registros en cualquier momento con un solo clic.

---

## 1. Overview & Core Concept

- **Qué hace**: Automatiza por completo el flujo de recolección de datos de inducción. Cada vez que un aprendiz completa su perfil y aprueba la inducción, el sistema empaqueta sus 16 campos normativos (Nombre, Tipo/No. Documento, Ficha, Regional, Centro, Modalidad, Lecciones, XP, Calificación, Estado, Código Certificado y Reglamento Acuerdo 0009 de 2024) y los despacha a la hoja de Google Sheets en la nube de forma transparente y sin fricción.
- **Público Objetivo**: Aprendices SENA que realizan su inducción institucional y coordinadores/instructores de bienestar y formación que necesitan consolidar las planillas de asistencia y aprobación en Google Drive sin tener que configurar credenciales ni autenticarse repetidamente.
- **Valor Clave**: Cero fricción para el usuario final (ninguna configuración ni popup requerido) y garantía de persistencia con actualización instantánea de la planilla en Google Drive.

---

## 2. User Experience & Visual Design

- **Flujo del Aprendiz (100% Desatendido)**:
  1. El aprendiz navega por los 8 capítulos del Acuerdo 0009 de 2024 y acumula XP.
  2. Presenta la Evaluación Final (10 preguntas de selección múltiple sobre derechos, deberes, prohibiciones, deserción e instancias de descargos).
  3. Al presionar "Finalizar y Evaluar" y superar el 80%:
     - El certificado se genera en pantalla de inmediato.
     - Un indicador sutil y no invasivo en la esquina del certificado confirma: *"Sincronizado automáticamente con la planilla oficial de Google Drive"*.
     - Ninguna ventana emergente de login interrumpe el flujo.
- **Flujo de Auditoría e Instructor**:
  - En la barra de navegación superior (junto al botón de modo oscuro) se conserva el acceso directo a la Planilla de Google Drive.
  - Al hacer clic, se abre una vista limpia de estado que muestra el enlace directo para abrir la hoja en Google Drive, el estado del conector automático y el historial de aprendices registrados localmente.
- **Retroalimentación Visual e Identidad**:
  - Paleta institucional SENA: Verde institucional (`#39A900`), Naranja de acento (`#FC7323`) y fondo neutral limpio con soporte completo de Modo Oscuro con desenfoque suave (*backdrop-blur*).
  - Estados de conexión silenciosos: Iconografía clara de verificación con texto explicativo sin cajas tipo "píldora" estáticas.

---

## 3. Key Product Decisions & Trade-Offs

- **Decisión 1: Webhook / Apps Script Web App vs OAuth Popup por Aprendiz**:
  - *Enfoque Elegido*: Webhook desatendido en segundo plano con URL configurable y soporte para Google Sheets API.
  - *Por qué*: La autenticación OAuth basada en popup (`signInWithPopup`) exige que cada aprendiz tenga o abra una cuenta de Google y mantenga la ventana abierta, lo cual generó el error `auth/popup-closed-by-user`. El webhook desacopla al aprendiz de la autenticación de Google y registra los datos de forma instantánea.
  - *Alternativas Descartadas*: Mantener el inicio de sesión manual obligatorio antes de guardar (demasiada fricción y fallas por bloqueadores de ventanas emergentes).
- **Decisión 2: Cola de Sincronización Local (Offline Resilience)**:
  - *Enfoque Elegido*: Almacenar en `localStorage` un registro de envíos pendientes y confirmados. Si una solicitud falla por red, se reintenta automáticamente en el siguiente ciclo o al recargar la página.
  - *Por qué*: Evita pérdida de información si el aprendiz tiene caídas momentáneas de internet al finalizar su evaluación.
- **Decisión 3: Formato Estructurado de la Hoja de Cálculo**:
  - *Enfoque Elegido*: Mantener las 16 columnas oficiales con encabezados institucionales SENA, garantizando compatibilidad total con reportes y auditorías de los centros de formación.

---

## 4. Technical Architecture & Data Strategy

### Diagrama del Sistema y Flujo de Datos

```
┌────────────────────────────────────────────────────────┐
│                   APRENDIZ SENA                        │
│   (Realiza lecciones y aprueba Evaluación 80%+)        │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│        Evaluación Final / Certificado Oficial          │
│   - Valida puntaje >= 80%                              │
│   - Genera código de certificación oficial             │
│   - Dispara hook automático: autoSyncLearner()         │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│            Servicio de Sincronización Auto             │
│  src/services/autoSyncService.ts                       │
│   - Valida si ya fue enviado (idempotencia)            │
│   - Encola en localSyncQueue                           │
│   - Despacha POST JSON en background                   │
└─────────────┬───────────────────────────┬──────────────┘
              │ (Online)                  │ (Falla de red)
              ▼                           ▼
┌───────────────────────────┐   ┌────────────────────────┐
│  Google Sheets Webhook    │   │ Cola Local Reintentos  │
│  (Apps Script / Drive API)│   │ (Silent Retry en BG)   │
└─────────────┬─────────────┘   └────────────────────────┘
              │
              ▼
┌────────────────────────────────────────────────────────┐
│ Hoja de Cálculo en Google Drive:                       │
│ "SENA - Registro Oficial de Inducción de Aprendices"   │
│ - Nueva fila con 16 columnas normativas (Acuerdo 009)  │
└────────────────────────────────────────────────────────┘
```

### Entidad de Datos a Sincronizar

```typescript
export interface LearnerSyncPayload {
  id: string; // SENA-FICHA-DOC-TIMESTAMP
  timestamp: string; // Formato local es-CO
  fullName: string;
  documentType: string;
  documentNumber: string;
  recordNumber: string; // Número de Ficha
  trainingProgram: string;
  regional: string;
  trainingCenter: string;
  modality: string;
  completedLessons: number;
  totalLessons: number;
  xp: number;
  scorePercentage: number;
  isCertified: boolean;
  certificateCode: string; // SENA-IND-2026-XXXXX
  regulation: 'Acuerdo 0009 de 2024';
}
```

### Componentes y Archivos Clave a Desarrollar:
1. `src/services/autoSyncService.ts`: Módulo de despacho automático, cola local idempotente (evita duplicados si el aprendiz recarga la página) y gestión de reintentos en segundo plano.
2. `src/components/FinalEvaluation.tsx`: Integración del disparador automático al culminar exitosamente el examen.
3. `src/components/CertificateView.tsx`: Insignia de confirmación de guardado en la nube y enlace directo a la hoja de Google Drive.
4. `src/components/GoogleDriveSyncModal.tsx`: Panel administrativo simplificado que muestra el estado de la sincronización automática, enlace de acceso directo al archivo en Google Drive, configuración de URL de webhook y botón para descargar copia CSV.
5. `src/utils/googleAppsScriptTemplate.ts`: Código de Google Apps Script listo para copiar y pegar en la hoja de cálculo de Google Drive con 1 solo clic si el usuario desea desplegar su propio webhook privado.
