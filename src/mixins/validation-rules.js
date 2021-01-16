const rules = {
    required(v) {
        return !!v || 'This field is required!'
    },
    isNumber(v) {
        return !isNaN(v) || 'Must be in numberic!'
    }
}

export default rules