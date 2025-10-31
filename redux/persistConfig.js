import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist';
import rootReducer from './reducers/index';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user'], // only persist 'user' reducer
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default persistedReducer;
