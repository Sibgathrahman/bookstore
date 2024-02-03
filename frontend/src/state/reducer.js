// Initial state for the global state
export const initialState = {
    profile: null,
    carts: null,
    cart_product_complete: null,
    cart_product_incomplete: null,
    reloadPage: null,
}

// Reducer function to handle state changes based on actions
const reducer = (state, action) => {
    switch (action.type) {
        // Action to add or update user profile in the state
        case "ADD_PROFILE":
            return {
                ...state,
                profile: action.profile,
            };
        // Action to add or update carts in the state
        case "ADD_CART":
            return {
                ...state,
                carts: action.carts,
            }
        // Action to add or update complete cart products in the state
        case "ADD_CART_PRODUCT_COMPLETE":
            return {
                ...state,
                cart_product_complete: action.cart_product_complete
            }
        // Action to add or update incomplete cart products in the state
        case "ADD_CART_PRODUCT_INCOMPLETE":
            return {
                ...state,
                cart_product_incomplete: action.cart_product_incomplete
            }
        // Action to add or update data for page reload in the state
        case "ADD_RELOAD_PAGE_DATA":
            return {
                ...state,
                reloadPage: action.reloadPage
            }
        // Default case returns the current state if action type is not recognized
        default:
            return state;
    }
};

export default reducer;
