import axiosInstance from '../../api/axiosInstance'
import { userConstants } from '../constants/usersConstants';

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
                    payload: { error: res.data?.error || 'Login failed from try ' },
                });
                return { error: res.data?.errors };
            }
        } catch (error) {
            dispatch({
                type: userConstants.USER_LOGIN_FAILURE,
                payload: { error: error?.response?.data?.errors || [{ type: "general", message: "Login failed" }] }
            });

            return { error: error?.response?.data?.errors };
        }
    };
};

export const signupAction = (userData) => {
    return async (dispatch) => {
        dispatch({ type: userConstants.USER_REGISTER_REQUEST });

        try {
            const res = await axiosInstance.post('/user/register', userData);

            if (res.status === 200) {
                dispatch({
                    type: userConstants.USER_REGISTER_ACCEPT,
                    payload: { user: res.data.user },
                });
                return res.data;
            } else {
                dispatch({
                    type: userConstants.USER_LOGIN_FAILURE,
                    payload: { error: res.data?.error || 'Login failed from try ' },
                });
                return { error: res.data?.errors };
            }
        } catch (error) {
            dispatch({
                type: userConstants.USER_REGISTER_FAILURE,
                payload: { error: error?.response?.data?.errors || [{ type: "general", message: "Login failed" }] }
            });

            return { error: error?.response?.data?.errors };
        }
    };
};
