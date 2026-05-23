import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User
} from 'firebase/auth';
import { auth as firebaseAuth } from './supabaseClient';

export const auth = {
  signOut: async () => {
    try {
      await signOut(firebaseAuth);
    } catch (e) {
      console.error('Firebase SignOut error:', e);
    }
    localStorage.removeItem('propai_cached_access_token');
    localStorage.removeItem('propai_active_user');
  }
};

let cachedAccessToken: string | null = localStorage.getItem('propai_cached_access_token');

export const initAuth = (
  onAuthSuccess?: (user: any, token: string) => void,
  onAuthFailure?: () => void
) => {
  // Listen to Firebase Auth state updates
  const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser: User | null) => {
    if (firebaseUser) {
      const formattedUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || 'desmondtetteh155@gmail.com',
        displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Alex Johnson',
        photoURL: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.email}&background=random`
      };
      
      // Obtain token
      const token = await firebaseUser.getIdToken();
      cachedAccessToken = token;
      localStorage.setItem('propai_cached_access_token', token);
      localStorage.setItem('propai_active_user', JSON.stringify(formattedUser));
      
      if (onAuthSuccess) {
        onAuthSuccess(formattedUser, token);
      }
    } else {
      cachedAccessToken = null;
      localStorage.removeItem('propai_cached_access_token');
      localStorage.removeItem('propai_active_user');
      
      const localUserStr = localStorage.getItem('propai_active_user_offline');
      if (localUserStr) {
        try {
          const localUser = JSON.parse(localUserStr);
          if (onAuthSuccess) onAuthSuccess(localUser, 'offline-token');
          return;
        } catch (e) {}
      }

      if (onAuthFailure) onAuthFailure();
    }
  });

  return () => {
    unsubscribe();
  };
};

export const googleSignIn = async (): Promise<{ user: any; accessToken: string } | null> => {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    
    const result = await signInWithPopup(firebaseAuth, provider);
    const token = await result.user.getIdToken();
    cachedAccessToken = token;

    const formattedUser = {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName || result.user.email?.split('@')[0] || 'Google User',
      photoURL: result.user.photoURL || `https://ui-avatars.com/api/?name=${result.user.email || 'User'}&background=random`
    };

    localStorage.setItem('propai_cached_access_token', token);
    localStorage.setItem('propai_active_user', JSON.stringify(formattedUser));

    return { user: formattedUser, accessToken: token };
  } catch (error: any) {
    console.error('Firebase Google Auth error:', error);
    
    const code = error.code;
    const msg = error.message || '';

    if (code === 'auth/operation-not-allowed' || msg.includes('operation-not-allowed') || msg.includes('operation_not_allowed')) {
      throw new Error(
        'Google Auth provider is not enabled in the Firebase Console. Go to Console > Authentication > Sign-in Method to enable Google Provider.'
      );
    }

    if (code === 'auth/popup-closed-by-user' || msg.includes('popup-closed-by-user') || msg.includes('closed-by-user')) {
      throw new Error(
        'The Google sign-in popup was closed before completing the authentication process. Please try again.'
      );
    }

    if (code === 'auth/popup-blocked' || msg.includes('popup-blocked') || msg.includes('cancelled-by-user')) {
      throw new Error(
        'Google login popups are blocked. Please click the pop-up blocker icon in your browser address bar to allow pop-ups for this domain, or use Email Sign Up.'
      );
    }

    // Customize error message for general iframe/sandbox constraints
    if (window.self !== window.top) {
      throw new Error(
        'Google login popups are blocked in the sandboxed frame. Please open this app in a new tab (click the toolbar icon in the top right of AI Studio) to sign in securely, or use Email Sign Up.'
      );
    }
    
    throw new Error(error.message || 'Google Sign-In failed. Please try again or use Email Sign Up.');
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await auth.signOut();
  localStorage.removeItem('propai_active_user_offline');
  cachedAccessToken = null;
};
