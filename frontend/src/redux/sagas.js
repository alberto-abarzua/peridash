import { all, call, takeLatest } from 'redux-saga/effects';
import { watchLogout, refreshSessionSaga } from '@/redux/sagas/userSagas';
import { watchCallUpdateTickers, watchUpdateTickers } from '@/redux/sagas/tickerSagas';

function* startupSaga() {
    yield takeLatest('REHYDRATION_COMPLETE', function* () {
        console.log('REHYDRATION_COMPLETE');
        yield all([
            call(watchLogout),
            call(refreshSessionSaga),
            call(watchCallUpdateTickers),
            call(watchUpdateTickers),
        ]);
    });
}

export default function* rootSaga() {
    yield all([call(startupSaga)]);
}
