import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IMAGES } from '../../data/seedData';

interface AuthUser {
  name: string;
  role: string;
  email: string;
  avatar: string;
}

interface AuthState {
  isAuthenticated: boolean;
  rememberMe: boolean;
  user: AuthUser;
}

const initialState: AuthState = {
  isAuthenticated: true,
  rememberMe: true,
  user: {
    name: 'Sonali Gupta',
    role: 'Master Baker',
    email: 'admin@sonalicakes.com',
    avatar: IMAGES.sonaliAvatar,
  },
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{ email: string; rememberMe: boolean }>
    ) {
      state.isAuthenticated = true;
      state.rememberMe = action.payload.rememberMe;
      if (action.payload.email.trim()) {
        state.user.email = action.payload.email.trim();
        const namePart = action.payload.email.split('@')[0];
        if (namePart.toLowerCase().includes('julianne')) {
          state.user.name = 'Chef Julianne';
          state.user.role = 'Head Pastry Designer';
          state.user.avatar = IMAGES.julianneAvatar;
        } else {
          state.user.name = 'Sonali Gupta';
          state.user.role = 'Master Baker';
          state.user.avatar = IMAGES.sonaliAvatar;
        }
      }
    },
    logout(state) {
      state.isAuthenticated = false;
    },
    updateProfile(
      state,
      action: PayloadAction<{ name: string; role: string; email: string }>
    ) {
      state.user.name = action.payload.name;
      state.user.role = action.payload.role;
      state.user.email = action.payload.email;
    },
  },
});

export const { login, logout, updateProfile } = authSlice.actions;
export default authSlice.reducer;
