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
    yield call([supabase.auth, supabase.auth.signOut]);
    yield call(call_purge, persistor);
}

function* refreshSessionSaga() {
    while (true) {
        try {
            const {
                data: { session },
            } = yield call([supabase.auth, supabase.auth.getSession]);

            if (session) {
                const expiresAt = session.expires_at;
                const currentTime = Math.floor(Date.now() / 1000);
                const timeUntilExpiration = expiresAt - currentTime;

                if (timeUntilExpiration > 0) {
                    yield delay(timeUntilExpiration * 1000);
                    yield call(innerRefreshSessionSaga);
                } else {
                    yield call(innerRefreshSessionSaga);
                }
            } else {
                yield put(userSliceActions.logout());
                return;
            }
        } catch (error) {
            console.error('Error refreshing session:', error);
            yield put(userSliceActions.logout());
            return;
        }
    }
}

function* innerRefreshSessionSaga() {
    try {
        const {
            data: { session },
            error,
        } = yield call([supabase.auth, supabase.auth.refreshSession]);

        if (error) {
            console.error('Session refresh error:', error);
            yield put(userSliceActions.logout());
        } else {
            yield put(userSliceActions.setUserSession(session));
        }
    } catch (error) {
        console.error('Error refreshing session:', error);
        yield put(userSliceActions.logout());
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
