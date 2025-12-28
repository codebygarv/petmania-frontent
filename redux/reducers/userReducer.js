import { userConstants } from "../constants/usersConstants";

const initalState = {
    loading: false,
    userInfo: null,
    error: null,
};

export const userReducer = (state = initalState, action) => {
    switch (action.type) {
        case 'persist/REHYDRATE':
            // When redux-persist restores state, ensure transient flags like
            // `loading` are reset to false to avoid UI showing spinners.
            return {
                ...state,
                loading: false,
            };
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

        case userConstants.USER_GOOGLE_LOGIN_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case userConstants.USER_GOOGLE_LOGIN_ACCEPT:
            return {
                ...state,
                loading: false,
                userInfo: action.payload.user,
                error: null,
            };
        case userConstants.USER_GOOGLE_LOGIN_FAILURE:
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

        case userConstants.USER_OTP_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case userConstants.USER_OTP_ACCEPT:
            return {
                ...state,
                loading: false,
                userInfo: action.payload.user,
                error: null,
            };
        case userConstants.USER_OTP_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };

        case userConstants.USER_FORGOT_PASSWORD_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case userConstants.USER_FORGOT_PASSWORD_ACCEPT:
            return {
                ...state,
                loading: false,
                error: null,
            };

        case userConstants.USER_FORGOT_PASSWORD_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };

        case userConstants.USER_FORGOT_PASSWORD_OTP_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case userConstants.USER_FORGOT_PASSWORD_OTP_ACCEPT:
            return {
                ...state,
                loading: false,
                error: null,
            };

        case userConstants.USER_FORGOT_PASSWORD_OTP_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };

        case userConstants.USER_UPDATE_PASSWORD_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case userConstants.USER_UPDATE_PASSWORD_ACCEPT:
            return {
                ...state,
                loading: false,
                error: null,
            };
        case userConstants.USER_UPDATE_PASSWORD_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };
        default:
            return state;
    }
};