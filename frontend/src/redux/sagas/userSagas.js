import { delay, call, put, takeLatest } from 'redux-saga/effects';

import { userSliceActions } from '@/redux/slices/userSlice';

import supabase from '@/utils/supabase/client';

import { persistor } from '@/redux/store';

const call_purge = persistor => {
    // clear redux store
    persistor.pause();
    persistor.flush().then(() => {
        return persistor.purge();
    });
};

function* handleLogout() {
    yield call([supabase.auth, supabase.auth.signOut]);
    yield call(call_purge, persistor);
}

export function* refreshSessionSaga() {
    while (true) {
        try {
            const {
                data: { session },
            } = yield call([supabase.auth, supabase.auth.getSession]);

            yield put(userSliceActions.setUserSession(session));

            if (session) {
                const expiresAt = session.expires_at;
                const currentTime = Math.floor(Date.now() / 1000);
                const timeUntilExpiration = expiresAt - currentTime;

                if (timeUntilExpiration > 200) {
                    yield delay(timeUntilExpiration * 1000 * 0.8);
                }

                const {
                    data: { session: refreshedSession },
                    error: refreshError,
                } = yield call([supabase.auth, supabase.auth.refreshSession]);

                if (refreshError) {
                    console.error('Session refresh error:', refreshError);
                    yield put(userSliceActions.logout());
                } else {
                    yield put(userSliceActions.setUserSession(refreshedSession));
                }
            } else {
                yield delay(5000);
                continue;
            }
        } catch (error) {
            console.error('Error refreshing session:', error);
            yield delay(5000);
            continue;
        }
    }
}

export function* watchSessionUpdate() {
    yield takeLatest(userSliceActions.updateSession.type, refreshSessionSaga);
}

export function* watchLogout() {
    yield takeLatest(userSliceActions.logout.type, handleLogout);
}
