import axiosInstance from '../../api/axiosInstance'
import { userConstants } from '../constants/usersConstants';
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

WebBrowser.maybeCompleteAuthSession();

const discovery = {
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
};

export const loginAction = (userData) => {
    return async (dispatch) => {
        dispatch({ type: userConstants.USER_LOGIN_REQUEST });

        try {
            const res = await axiosInstance.post('/user/login', userData);

            if (res.status === 200) {
                dispatch({
                    type: userConstants.USER_LOGIN_ACCEPT,
                    payload: { user: res.data.user },
                });
                return res.data;
            } else {
                dispatch({
                    type: userConstants.USER_LOGIN_FAILURE,
                    payload: { error: res.data },
                });
                return { error: res.data };
            }
        } catch (error) {
            dispatch({
                type: userConstants.USER_LOGIN_FAILURE,
                payload: { error: error?.response?.data }
            });

            return { error: error?.response?.data };
        }
    };
};

export const googleLoginAction = (accessToken) => {
    return async (dispatch) => {
        dispatch({ type: userConstants.USER_GOOGLE_LOGIN_REQUEST });
        try {
            const res = await axiosInstance.post('/user/google', { accessToken });
            if (res.status === 200) {
                dispatch({
                    type: userConstants.USER_GOOGLE_LOGIN_ACCEPT,
                    payload: { user: res.data.user },
                });
                return res.data;
            } else {
                dispatch({
                    type: userConstants.USER_GOOGLE_LOGIN_FAILURE,  
                    payload: { error: res.data },
                });
                return { error: res.data };
            }
        } catch (error) {
            dispatch({
                type: userConstants.USER_GOOGLE_LOGIN_FAILURE,
                payload: { error: error?.response?.data }
            });

            return { error: error?.response?.data };
        }
    };
}

export const signupAction = (userData) => {
    return async (dispatch) => {
        dispatch({ type: userConstants.USER_REGISTER_REQUEST });

        try {
            const res = await axiosInstance.post('/user/register', userData);

            if (res.status === 201) {
                dispatch({
                    type: userConstants.USER_REGISTER_ACCEPT,
                    payload: { user: res.data.user },
                });
                return res.data;
            } else {
                dispatch({
                    type: userConstants.USER_LOGIN_FAILURE,
                    payload: { error: res.data },
                });
                return { error: res.data };
            }
        } catch (error) {
            dispatch({
                type: userConstants.USER_REGISTER_FAILURE,
                payload: { error: error?.response?.data }
            });
            return { error: error?.response?.data };
        }
    };
};

export const verifyOtpAction = (otpData) => {
    return async (dispatch) => {
        dispatch({ type: userConstants.USER_OTP_REQUEST });
        try {
            const res = await axiosInstance.post('/user/resgister/verifyOtp', otpData);
            if (res.status === 200) {
                dispatch({
                    type: userConstants.USER_OTP_ACCEPT,
                    payload: { message: res.data.message },
                });
                return res.data;
            }
            else {
                dispatch({
                    type: userConstants.USER_OTP_FAILURE,
                    payload: { error: res.data?.error },
                });
                return { error: res.data?.errors };
            }
        } catch (error) {
            dispatch({
                type: userConstants.USER_OTP_FAILURE,
                payload: { error: error?.response?.data }
            });
            return { error: error?.response?.data };
        }
    };
};

export const forgotPasswordAction = (emailData) => {
    return async (dispatch) => {
        dispatch({ type: userConstants.USER_FORGOT_PASSWORD_REQUEST });
        try {
            const res = await axiosInstance.post('/user/forgotPassword', emailData);
            if (res.status === 200) {
                dispatch({
                    type: userConstants.USER_FORGOT_PASSWORD_ACCEPT,
                    payload: { message: res.data.message },
                });
                return res.data;
            }
            else {
                dispatch({
                    type: userConstants.USER_FORGOT_PASSWORD_FAILURE,
                    payload: { error: res.data?.error || 'Forgot password request failed' },
                });
                return { error: res.data?.errors };
            }
        } catch (error) {
            dispatch({
                type: userConstants.USER_FORGOT_PASSWORD_FAILURE,
                payload: { error: error?.response?.data || [{ type: "general", message: "Forgot password request failed" }] }
            });
            return { error: error?.response?.data };
        }
    };
};


export const getUserDetailsAction = () => {
    return async (dispatch) => {
        dispatch({ type: userConstants.USER_DETAILS_REQUEST });
        try {
            const res = await axiosInstance.get('/user/details');
            if (res.status === 200) {
                dispatch({
                    type: userConstants.USER_DETAILS_ACCEPT,
                    payload: { user: res.data.user },
                });
                return res.data;
            }
            else {
                dispatch({
                    type: userConstants.USER_DETAILS_FAILURE,
                    payload: { error: res.data?.error },
                });
                return { error: res.data?.errors };
            }
        } catch (error) {
            dispatch({
                type: userConstants.USER_DETAILS_FAILURE,
                payload: { error: error?.response?.data }
            });
            return { error: error?.response?.data };
        }
    };
}

export const updateUserProfileAction = (profileData) => {
    return async (dispatch) => {
        dispatch({ type: userConstants.USER_UPDATE_PROFILE_REQUEST });
        try {

            const res = await axiosInstance.put('/user/updateDetails', profileData);
            if (res.status === 200) {
                dispatch({
                    type: userConstants.USER_UPDATE_PROFILE_ACCEPT,
                    payload: { user: res.data.user },
                });
                return res.data;
            }
            else {
                dispatch({
                    type: userConstants.USER_UPDATE_PROFILE_FAILURE,
                    payload: { error: res.data?.error || 'Updating profile failed' },
                });
                return { error: res.data?.errors };
            }
        } catch (error) {
            dispatch({
                type: userConstants.USER_UPDATE_PROFILE_FAILURE,
                payload: { error: error?.response?.data || [{ type: "general", message: "Updating profile failed" }] }
            });
            return { error: error?.response?.data };
        }
    };
}

export const forgotPasswordOtpAction = (otpData) => {
    return async (dispatch) => {
        dispatch({ type: userConstants.USER_FORGOT_PASSWORD_OTP_REQUEST });
        try {
            const res = await axiosInstance.post('/user/forgotPassword/otpVerify', otpData);
            if (res.status === 200) {
                dispatch({
                    type: userConstants.USER_FORGOT_PASSWORD_OTP_ACCEPT,
                    payload: { message: res.data.message },
                });
                return res.data;
            }
            else {
                dispatch({
                    type: userConstants.USER_FORGOT_PASSWORD_OTP_FAILURE,
                    payload: { error: res.data?.error },
                });
                return { error: res.data?.errors };
            }
        } catch (error) {
            dispatch({
                type: userConstants.USER_FORGOT_PASSWORD_OTP_FAILURE,
                payload: { error: error?.response?.data }
            });
            return { error: error?.response?.data };
        }

    };
};

export const updatePasswordAction = (passwordData) => {
    return async (dispatch) => {
        dispatch({ type: userConstants.USER_UPDATE_PASSWORD_REQUEST });
        try {
            const res = await axiosInstance.post('/user/forgotPassword/changePassword', passwordData
            );
            if (res.status === 200) {
                dispatch({
                    type: userConstants.USER_UPDATE_PASSWORD_ACCEPT,
                    payload: { message: res.data.message },
                });
                return res.data;
            }

            else {
                dispatch({
                    type: userConstants.USER_UPDATE_PASSWORD_FAILURE,
                    payload: { error: res.data?.error },
                });
                return { error: res.data?.errors };
            }
        } catch (error) {
            dispatch({
                type: userConstants.USER_UPDATE_PASSWORD_FAILURE,
                payload: { error: error?.response?.data }
            });
            return { error: error?.response?.data };
        }
    };
}