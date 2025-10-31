import axiosInstance from './axiosInstance';

export const SignIn = async (data) => {
 return await axiosInstance.post('/users',data);
};