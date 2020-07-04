import _ from "lodash";
import STORE_CONSTANT from "./constant";

const getters = {
  [STORE_CONSTANT.GETTERS.USER](state) {
    return _.get(state, "user");
  },
  [STORE_CONSTANT.GETTERS.USER_ID](state) {
    return _.get(state, "user.id");
  },
};

export default getters;
