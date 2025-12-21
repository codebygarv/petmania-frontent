import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist';
import rootReducer from './reducers/index';

// Avoid referencing window during SSR / Node (e.g., Expo web static render)
const createNoopStorage = () => ({
  getItem: () => Promise.resolve(null),
  setItem: (_key, value) => Promise.resolve(value),
  removeItem: () => Promise.resolve(),
});

const storage =
  typeof window !== 'undefined' ? AsyncStorage : createNoopStorage();

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'], // only persist 'user' reducer
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
