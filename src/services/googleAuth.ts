import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Configure Google OAuth Provider with Workspace scopes
export const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file'
];

const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => provider.addScope(scope));

// In-memory token cache (NEVER stored in localStorage or sessionStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

// Initialize auth state listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // If user is logged into Firebase but token isn't cached in memory yet
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Sign in with Google Popup
export const formatAuthError = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'code' in error) {
    const code = (error as { code: string }).code;
    if (code === 'auth/popup-closed-by-user') {
      return 'Se cerró la ventana emergente de inicio de sesión antes de completar la autorización. Por favor haz clic en "Acceder con Google" nuevamente y selecciona tu cuenta de Google.';
    }
    if (code === 'auth/popup-blocked') {
      return 'Tu navegador bloqueó la ventana emergente de Google. Permite las ventanas emergentes (pop-ups) en tu navegador para continuar.';
    }
    if (code === 'auth/cancelled-popup-request') {
      return 'Se canceló la ventana anterior porque se abrió una nueva solicitud.';
    }
    if (code === 'auth/network-request-failed') {
      return 'Error de conexión de red con los servidores de Google. Revisa tu conexión a internet e inténtalo de nuevo.';
    }
  }
  return error instanceof Error ? error.message : 'Error inesperado al conectar con Google';
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('No se pudo obtener el token de acceso de Google');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: unknown) {
    console.error('Error al iniciar sesión con Google:', error);
    throw new Error(formatAuthError(error));
  } finally {
    isSigningIn = false;
  }
};

// Get in-memory access token
export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

// Sign out and clear in-memory token
export const googleSignOut = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};
