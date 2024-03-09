import { all, call } from 'redux-saga/effects';
import { watchLogout, refreshSessionSaga } from '@/redux/sagas/userSagas';
import { watchCallUpdateTickers, watchUpdateTickers } from '@/redux/sagas/tickerSagas';
export default function* rootSaga() {
    yield all([
        call(watchLogout),
        call(refreshSessionSaga),
        call(watchCallUpdateTickers),
        call(watchUpdateTickers),
    ]);
}
