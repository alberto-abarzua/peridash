import rootSaga from '@/redux/sagas';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import tickerSliceReducer from '@/redux/slices/tickerSlice';
import userSliceReducer from '@/redux/slices/userSlice';
const persistConfig = {
    key: 'root',
    storage,
};

const sagaMiddleware = createSagaMiddleware();
const rootReducer = combineReducers({
    user: userSliceReducer,
    ticker: tickerSliceReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    'persist/PERSIST',
                    'persist/REHYDRATE',
                    'persist/PAUSE',
                    'persist/PERSIST',
                    'persist/PURGE',
                    'persist/REGISTER',
                    'persist/FLUSH',
                ],
                ignoredPaths: ['some.path.to.ignore'], // Add paths to ignore here
            },
        }).prepend(sagaMiddleware),
});

export const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

export default store;
