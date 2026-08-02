import { userConstants } from "../constants/usersConstants";

const initalState = {
    loading: false,
    userInfo: null,
    favourites: [],
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

        case userConstants.USER_FACEBOOK_LOGIN_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case userConstants.USER_FACEBOOK_LOGIN_ACCEPT:
            return {
                ...state,
                loading: false,
                userInfo: action.payload.user,
                error: null,
            };
        case userConstants.USER_FACEBOOK_LOGIN_FAILURE:
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
        case userConstants.USER_DETAILS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case userConstants.USER_DETAILS_ACCEPT:
            return {
                ...state,
                loading: false,
                userInfo: action.payload.user,
                error: null,
            };
        case userConstants.USER_DETAILS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };

        case userConstants.USER_UPDATE_PROFILE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case userConstants.USER_UPDATE_PROFILE_ACCEPT:
            return {
                ...state,
                loading: false,
                userInfo: action.payload.user,
                error: null,
            };
        case userConstants.USER_UPDATE_PROFILE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };
        case userConstants.USER_FAVOURITES_REQUEST:
        case userConstants.USER_TOGGLE_FAVOURITE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case userConstants.USER_FAVOURITES_ACCEPT:
        case userConstants.USER_TOGGLE_FAVOURITE_ACCEPT:
            return {
                ...state,
                loading: false,
                favourites: action.payload.favourites,
                error: null,
            };
        case userConstants.USER_FAVOURITES_FAILURE:
        case userConstants.USER_TOGGLE_FAVOURITE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };
        default:
            return state;
    }
};