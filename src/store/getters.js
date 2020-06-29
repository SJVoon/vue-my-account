import _ from 'lodash'
import STORE_CONSTANT from './constant'

const getters = {
    [STORE_CONSTANT.GETTERS.USER](state) {
        return _.get(state,'user')
    }
}

export default getters