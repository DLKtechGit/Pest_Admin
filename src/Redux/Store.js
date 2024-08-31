import { configureStore, createAsyncThunk } from '@reduxjs/toolkit';
import rootReducer from './RootReducer';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistedUserData = localStorage.getItem('userData');


const initialState = {
  user: {
    userData: persistedUserData ? JSON.parse(persistedUserData) : null,
  },
};

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  preloadedState: initialState,
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

export default store;
