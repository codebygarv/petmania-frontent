import { userConstants } from "../constants/usersConstants";

const initalState = {
    loading: false,
    userInfo: null,
    error: null,
};

export const userReducer = (state = initalState, action) => {
    switch (action.type) {
        case userConstants.USER_LOGIN_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case userConstants.USER_LOGIN_ACCEPT:
            return {
                ...state,
                loading: false,
                userInfo: action.payload.user,
                error: null,
            };
        case userConstants.USER_LOGIN_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };

        case userConstants.USER_REGISTER_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case userConstants.USER_REGISTER_ACCEPT:
            return {
                ...state,
                loading: false,
                userInfo: action.payload.user,
                error: null,
            };
        case userConstants.USER_REGISTER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };  
        default:
            return state;
    }
};