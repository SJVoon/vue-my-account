const constants = {
    NAME: 'store',
    get ACTIONS() {
        const actions = {
            FETCH_USER: 'FETCH_USER'
        }
        return actions
    },
    get GETTERS() {
        const getters = {
            USER: 'USER'
        }
        return getters
    },
    get MUTATIONS() {
        const mutations = {
            SET_USER_IS_LOGIN: 'SET_USER_IS_LOGIN',
            SET_USER_DATA: 'SET_USER_DATA'
        }
        return mutations
    }
}

export default constants