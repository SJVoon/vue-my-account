import _ from "lodash";
import STORE_CONSTANT from "./constant";

const mutations = {
  [STORE_CONSTANT.MUTATIONS.SET_USER_IS_LOGIN](state, data) {
    state.user.isLogin = data;
  },
  [STORE_CONSTANT.MUTATIONS.SET_USER_DATA](state, data) {
    state.user.data = data;
  },
  [STORE_CONSTANT.MUTATIONS.SET_USER_ID](state, data) {
    state.user.id = data;
  },
};

export default mutations;
