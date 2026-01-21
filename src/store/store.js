import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import userReducer from './userSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'], // only user will be persisted
};

// Create a persisted reducer
const persistedUserReducer = persistReducer(persistConfig, userReducer);

// Configure store with persisted reducer
export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    // Add more reducers here as needed
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);