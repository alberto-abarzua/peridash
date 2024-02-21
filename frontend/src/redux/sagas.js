import api from '@/utils/api';
import { all, delay, call, put, debounce, takeLeading, takeLatest } from 'redux-saga/effects';
import { tickerSliceActions } from './tickerSlice';

function* updateUserTickers() {
    try {
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

function* watchCallEdgeUpdateTickers() {
    while (true) {
        yield call(api.get, '/update_prices/');
        yield delay(1000 * 60); // every minute
    }
}

function* watchUpdateTickers() {
    yield takeLatest(tickerSliceActions.updateTickers, updateUserTickers);
}
console.log('rootSaga');

export default function* rootSaga() {
    yield all([call(watchCallUpdateTickers), call(watchUpdateTickers), call(watchCallEdgeUpdateTickers)]);
}
