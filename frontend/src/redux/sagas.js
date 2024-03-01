import api from '@/utils/api';
import { select, all, delay, call, put, debounce, takeLatest } from 'redux-saga/effects';
import { tickerSliceActions } from './tickerSlice';
import { userSliceActions } from './userSlice';
import supabase from '@/utils/supabase/client';
import { persistor } from './store';

function* updateUserTickers() {
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
function* watchCallUpdateTickers() {
    while (true) {
        yield call(updateUserTickers);
        yield delay(1000 * 60); // every minute
    }
}

function* watchUpdateTickers() {
    yield debounce(500, tickerSliceActions.updateTickers, updateUserTickers);
}

const call_purge = persistor => {
    persistor.pause();
    persistor.flush().then(() => {
        return persistor.purge();
    });
};
function* handleLogout() {
    console.log('Logging out');
    yield call([supabase.auth, supabase.auth.signOut]);
    yield call(call_purge, persistor);
}

function* innerRefreshSessionSaga() {
    const { data: user } = yield call([supabase.auth, supabase.auth.getUser]);
    if (!user) {
        yield put(userSliceActions.logout());
        return;
    }

    const { data, error } = yield call([supabase.auth, supabase.auth.getSession]);

    if (error) {
        console.error('Session refresh error:', error);
        yield put(userSliceActions.logout());
    } else {
        const { session } = data;
        yield put(userSliceActions.setUserSession(session));
    }
}

function* refreshSessionSaga() {
    while (true) {
        try {
            yield call(innerRefreshSessionSaga);
            yield delay(300000 / 2); // 5 minutes in milliseconds
        } catch (error) {
            console.error('Error refreshing session:', error);
            yield delay(30000); // 30 seconds in milliseconds
        }
    }
}

function* watchSessionUpdate() {
    yield takeLatest(userSliceActions.updateSession.type, innerRefreshSessionSaga);
}
function* watchLogout() {
    yield takeLatest(userSliceActions.logout.type, handleLogout);
}

export default function* rootSaga() {
    yield all([
        call(watchLogout),
        call(watchSessionUpdate),
        call(refreshSessionSaga),
        call(watchCallUpdateTickers),
        call(watchUpdateTickers),
    ]);
}
