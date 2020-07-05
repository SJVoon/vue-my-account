const rules = {
    required(v) {
        return !!v || 'This field is required!'
    }
}

export default rules