export interface LearnerSheetRecord {
  id: string;
  timestamp: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  recordNumber: string; // Ficha
  trainingProgram: string;
  regional: string;
  trainingCenter: string;
  modality: string;
  completedLessons: number;
  totalLessons: number;
  xp: number;
  scorePercentage: number;
  isCertified: boolean;
  certificateCode: string;
  regulation: string;
}

export interface SpreadsheetInfo {
  spreadsheetId: string;
  spreadsheetUrl: string;
  sheetTitle: string;
}

const SHEET_TITLE = 'Aprendices_Induccion';
const SPREADSHEET_NAME = 'SENA - Registro Oficial de Inducción de Aprendices';
const STORAGE_KEY_SPREADSHEET_ID = 'sena_drive_spreadsheet_id';

const HEADERS = [
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
  'Puntos de Experiencia (XP)',
  'Calificación (%)',
  'Estado Inducción',
  'Código Verificación Certificado',
  'Reglamento Aplicado'
];

/**
 * Searches for an existing induction spreadsheet or creates a new one in Google Drive
 */
export const findOrCreateSpreadsheet = async (accessToken: string): Promise<SpreadsheetInfo> => {
  // Check local cached ID first
  const cachedId = localStorage.getItem(STORAGE_KEY_SPREADSHEET_ID);
  if (cachedId) {
    try {
      const checkRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${cachedId}?fields=spreadsheetId,properties.title,sheets.properties`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      if (checkRes.ok) {
        const data = await checkRes.json();
        const tab = data.sheets?.[0]?.properties?.title || SHEET_TITLE;
        return {
          spreadsheetId: cachedId,
          spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${cachedId}/edit`,
          sheetTitle: tab
        };
      }
    } catch {
      // Continue to search or create
    }
  }

  // Search existing file in Google Drive via Drive v3 API
  try {
    const query = encodeURIComponent(
      `name = '${SPREADSHEET_NAME}' and mimeType = 'application/vnd.google-apps.spreadsheet' and trashed = false`
    );
    const driveRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,webViewLink)&pageSize=1`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    if (driveRes.ok) {
      const driveData = await driveRes.json();
      if (driveData.files && driveData.files.length > 0) {
        const file = driveData.files[0];
        localStorage.setItem(STORAGE_KEY_SPREADSHEET_ID, file.id);

        // Fetch sheet metadata to get exact first sheet title
        const metaRes = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${file.id}?fields=sheets.properties.title`,
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );
        const metaData = await metaRes.json();
        const tabTitle = metaData.sheets?.[0]?.properties?.title || SHEET_TITLE;

        return {
          spreadsheetId: file.id,
          spreadsheetUrl: file.webViewLink || `https://docs.google.com/spreadsheets/d/${file.id}/edit`,
          sheetTitle: tabTitle
        };
      }
    }
  } catch (error) {
    console.warn('No se pudo buscar en Google Drive, creando nueva hoja...', error);
  }

  // Create new Google Spreadsheet with stylized SENA headers
  const createPayload = {
    properties: {
      title: SPREADSHEET_NAME
    },
    sheets: [
      {
        properties: {
          title: SHEET_TITLE,
          gridProperties: {
            frozenRowCount: 1
          }
        }
      }
    ]
  };

  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(createPayload)
  });

  if (!createRes.ok) {
    const errorBody = await createRes.text();
    throw new Error(`Error al crear la hoja en Google Drive: ${errorBody}`);
  }

  const createdData = await createRes.json();
  const spreadsheetId = createdData.spreadsheetId;
  const sheetId = createdData.sheets?.[0]?.properties?.sheetId ?? 0;
  localStorage.setItem(STORAGE_KEY_SPREADSHEET_ID, spreadsheetId);

  // Initialize header row values
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${SHEET_TITLE}!A1:P1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        range: `${SHEET_TITLE}!A1:P1`,
        majorDimension: 'ROWS',
        values: [HEADERS]
      })
    }
  );

  // Apply styling to the header row (SENA green background #39A900, white bold text)
  try {
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: [
          {
            repeatCell: {
              range: {
                sheetId: sheetId,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: HEADERS.length
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: {
                    red: 0.223,
                    green: 0.662,
                    blue: 0.0
                  },
                  horizontalAlignment: 'CENTER',
                  textFormat: {
                    foregroundColor: {
                      red: 1.0,
                      green: 1.0,
                      blue: 1.0
                    },
                    fontSize: 10,
                    bold: true
                  }
                }
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)'
            }
          },
          {
            autoResizeDimensions: {
              dimensions: {
                sheetId: sheetId,
                dimension: 'COLUMNS',
                startIndex: 0,
                endIndex: HEADERS.length
              }
            }
          }
        ]
      })
    });
  } catch (styleErr) {
    console.warn('No se pudo aplicar estilo al encabezado, pero la hoja fue creada con éxito:', styleErr);
  }

  return {
    spreadsheetId,
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    sheetTitle: SHEET_TITLE
  };
};

/**
 * Appends an apprentice record row to the Google Spreadsheet
 */
export const appendLearnerRecord = async (
  accessToken: string,
  spreadsheetId: string,
  sheetTitle: string,
  record: LearnerSheetRecord
): Promise<{ success: boolean; spreadsheetUrl: string }> => {
  const row = [
    record.id,
    record.timestamp,
    record.fullName,
    record.documentType,
    record.documentNumber,
    record.recordNumber,
    record.trainingProgram,
    record.regional,
    record.trainingCenter,
    record.modality,
    `${record.completedLessons}/${record.totalLessons}`,
    record.xp,
    `${record.scorePercentage}%`,
    record.isCertified ? 'CERTIFICADO (APROBADO)' : 'EN PROCESO',
    record.certificateCode,
    record.regulation
  ];

  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetTitle)}!A:P:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: [row]
      })
    }
  );

  if (!appendRes.ok) {
    const errorText = await appendRes.text();
    throw new Error(`Error al registrar datos en Google Sheets: ${errorText}`);
  }

  return {
    success: true,
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`
  };
};

/**
 * Reads existing learner records from the spreadsheet
 */
export const fetchLearnersFromSheet = async (
  accessToken: string,
  spreadsheetId: string,
  sheetTitle: string
): Promise<LearnerSheetRecord[]> => {
  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetTitle)}!A2:P`,
      {
        headers: { Authorization: `Bearer ${accessToken}` }
      }
    );

    if (!res.ok) return [];

    const data = await res.json();
    const rows = data.values || [];

    return rows.map((r: string[], idx: number) => ({
      id: r[0] || `row-${idx}`,
      timestamp: r[1] || '',
      fullName: r[2] || '',
      documentType: r[3] || 'C.C.',
      documentNumber: r[4] || '',
      recordNumber: r[5] || '',
      trainingProgram: r[6] || '',
      regional: r[7] || '',
      trainingCenter: r[8] || '',
      modality: r[9] || 'Presencial',
      completedLessons: parseInt(r[10]?.split('/')[0] || '0', 10),
      totalLessons: parseInt(r[10]?.split('/')[1] || '12', 10),
      xp: parseInt(r[11] || '0', 10),
      scorePercentage: parseInt(r[12]?.replace('%', '') || '0', 10),
      isCertified: (r[13] || '').includes('CERTIFICADO'),
      certificateCode: r[14] || '',
      regulation: r[15] || 'Acuerdo 0009 de 2024'
    }));
  } catch (error) {
    console.error('Error al leer registros de Google Sheets:', error);
    return [];
  }
};
