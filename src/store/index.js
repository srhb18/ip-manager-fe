import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

import * as actions from './actions'
import * as mutations from './mutations'

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    // state,
    // getters,
    mutations,
    actions,
    plugins: debug ? [createLogger()] : []
});

