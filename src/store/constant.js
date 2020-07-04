const constants = {
  NAME: "store",
  get ACTIONS() {
    const actions = {
      FETCH_USER: "FETCH_USER",
    };
    return actions;
  },
  get GETTERS() {
    const getters = {
      USER: "USER",
      USER_ID: "USER_ID",
    };
    return getters;
  },
  get MUTATIONS() {
    const mutations = {
      SET_USER_IS_LOGIN: "SET_USER_IS_LOGIN",
      SET_USER_DATA: "SET_USER_DATA",
      SET_USER_ID: "SET_USER_ID",
    };
    return mutations;
  },
};

export default constants;
