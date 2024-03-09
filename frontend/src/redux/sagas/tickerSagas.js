import api from '@/utils/api';
import { select, delay, call, put, debounce } from 'redux-saga/effects';
import { tickerSliceActions } from '@/redux/slices/tickerSlice';

export function* updateUserTickers() {
    try {
        yield delay(500); // every minute
        const token = yield select(state => state.user.session?.access_token);
        if (!token) {
            console.error('No token found');
            return;
        }
        const response = yield call(api.get, '/user_ticker/tickers/');
        yield put(tickerSliceActions.setUserTickers(response.data));
    } catch (error) {
        console.error('Error getting user tickres', error);
    }
}
export function* watchCallUpdateTickers() {
    while (true) {
        yield call(updateUserTickers);
        yield delay(1000 * 60); // every minute
    }
}

export function* watchUpdateTickers() {
    yield debounce(500, tickerSliceActions.updateTickers, updateUserTickers);
}
