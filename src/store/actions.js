import _ from "lodash";
import STORE_CONSTANT from "./constant";

const actions = {
  [STORE_CONSTANT.ACTIONS.FETCH_USER]({ commit }, user) {
    commit(STORE_CONSTANT.MUTATIONS.SET_USER_IS_LOGIN, user !== null);
    if (user) {
      commit(STORE_CONSTANT.MUTATIONS.SET_USER_DATA, {
        displayName: user.displayName,
        email: user.email,
      });
      commit(STORE_CONSTANT.MUTATIONS.SET_USER_ID, user.uid);
    } else {
      commit(STORE_CONSTANT.MUTATIONS.SET_USER_DATA, null);
      commit(STORE_CONSTANT.MUTATIONS.SET_USER_ID, "");
    }
  },
};

export default actions;
