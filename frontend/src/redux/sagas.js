import api from '@/utils/api';
import { all, delay, call, put, debounce, takeLeading, takeLatest } from 'redux-saga/effects';
import { tickerSliceActions } from './tickerSlice';

function* updateUserTickers() {
    try {
        console.log('Calling update user tickers');
        const response = yield call(api.get, '/user_ticker/tickers/');
        yield put(tickerSliceActions.setUserTickers(response.data));
    } catch (error) {
        console.error('Error getting user tickres', error);
    }
}
function* watchCallUpdateTickers() {
    while (true) {
        yield call(updateUserTickers);
        yield delay(1000 * 60); // every minute
    }
}

function* watchUpdateTickers() {
    yield takeLatest(tickerSliceActions.updateTickers, updateUserTickers);
}

export default function* rootSaga() {
    yield all([call(watchCallUpdateTickers), call(watchUpdateTickers)]);
}
