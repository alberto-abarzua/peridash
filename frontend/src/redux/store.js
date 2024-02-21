import tickerSliceReducer from '@/redux/tickerSlice';
import rootSaga from '@/redux/sagas';
import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
    reducer: {
        ticker: tickerSliceReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;
