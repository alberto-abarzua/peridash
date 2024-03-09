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
                const timeUntilExpiration = session.expires_in;

                if (timeUntilExpiration > 300) {
                    yield delay((timeUntilExpiration - 300) * 1000); // Wait until 5 minutes before expiration
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

export function* watchSessionUpdate() {
    yield takeLatest(userSliceActions.updateSession.type, refreshSessionSaga);
}

export function* watchLogout() {
    yield takeLatest(userSliceActions.logout.type, handleLogout);
}
