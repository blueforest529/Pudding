const product = {
    state: { 
        data: {}
    }, 
    mutations: { 
        updateProduct(state, product) {
            state.data = product;
        },
        clearProduct(state) {
            state.data = {};
        }  
    }, 
    actions:{ 
    } 
}

export default product