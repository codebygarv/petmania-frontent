import axiosInstance from '../../api/axiosInstance';
import { petConstants } from '../constants/petConstants';

export const createPetAction = (petData) => {
    return async (dispatch) => {
        dispatch({ type: petConstants.CREATE_PET_REQUEST });
        try {
            const res = await axiosInstance.post('/pets/create-pet', petData);
            if (res.status === 201 || res.status === 200) {
                dispatch({
                    type: petConstants.CREATE_PET_ACCEPT,
                    payload: { pet: res.data.pet },
                });
                return res.data;
            } else {
                dispatch({
                    type: petConstants.CREATE_PET_FAILURE,
                    payload: { error: res.data?.message || 'Creation failed' },
                });
                return { error: res.data?.message || 'Creation failed' };
            }
        } catch (error) {
            dispatch({
                type: petConstants.CREATE_PET_FAILURE,
                payload: { error: error?.response?.data || 'Failed to create pet' },
            });
            return { error: error?.response?.data || 'Failed to create pet' };
        }
    };
};

export const getPetsAction = (filters = {}) => {
    return async (dispatch) => {
        dispatch({ type: petConstants.GET_PETS_REQUEST });
        try {
            let url = '/pets/get-pets';
            const queryParams = [];
            
            if (filters.city) queryParams.push(`city=${encodeURIComponent(filters.city)}`);
            if (filters.type) queryParams.push(`type=${encodeURIComponent(filters.type)}`);
            if (filters.gender) queryParams.push(`gender=${encodeURIComponent(filters.gender)}`);
            if (filters.minAge !== undefined) queryParams.push(`minAge=${filters.minAge}`);
            if (filters.maxAge !== undefined) queryParams.push(`maxAge=${filters.maxAge}`);
            if (filters.search) queryParams.push(`search=${encodeURIComponent(filters.search)}`);

            if (queryParams.length > 0) {
                url += `?${queryParams.join('&')}`;
            }

            const res = await axiosInstance.get(url);
            if (res.status === 200) {
                dispatch({
                    type: petConstants.GET_PETS_ACCEPT,
                    payload: { pets: res.data.pets },
                });
                return res.data;
            } else {
                dispatch({
                    type: petConstants.GET_PETS_FAILURE,
                    payload: { error: res.data?.message || 'Fetching failed' },
                });
                return { error: res.data?.message || 'Fetching failed' };
            }
        } catch (error) {
            dispatch({
                type: petConstants.GET_PETS_FAILURE,
                payload: { error: error?.response?.data || 'Failed to fetch pets' },
            });
            return { error: error?.response?.data || 'Failed to fetch pets' };
        }
    };
};
export const searchPetsAction = (query) => {
    return async (dispatch) => {
        dispatch({ type: petConstants.GET_PETS_REQUEST });
        try {
            const res = await axiosInstance.get(`/pets/get-pets?search=${encodeURIComponent(query)}`);
            if (res.status === 200) {
                dispatch({
                    type: petConstants.GET_PETS_ACCEPT,
                    payload: { pets: res.data.pets },
                });
                return res.data;
            } else {
                return { error: res.data?.message || 'Search failed' };
            }
        } catch (error) {
            return { error: error?.response?.data || 'Failed to search pets' };
        }
    };
};

export const getMyPetsAction = () => {
    return async (dispatch) => {
        dispatch({ type: petConstants.GET_MY_PETS_REQUEST });
        try {
            const res = await axiosInstance.get('/pets/get-my-pets');
            if (res.status === 200) {
                dispatch({
                    type: petConstants.GET_MY_PETS_ACCEPT,
                    payload: { pets: res.data.pets },
                });
                return res.data;
            } else {
                dispatch({
                    type: petConstants.GET_MY_PETS_FAILURE,
                    payload: { error: res.data?.message || 'Fetching failed' },
                });
                return { error: res.data?.message || 'Fetching failed' };
            }
        } catch (error) {
            dispatch({
                type: petConstants.GET_MY_PETS_FAILURE,
                payload: { error: error?.response?.data || 'Failed to fetch my pets' },
            });
            return { error: error?.response?.data || 'Failed to fetch my pets' };
        }
    };
};

export const markPetAdoptedAction = (petId) => {
    return async (dispatch) => {
        dispatch({ type: petConstants.UPDATE_PET_ADOPTED_REQUEST });
        try {
            const res = await axiosInstance.put(`/pets/mark-adopted/${petId}`);
            if (res.status === 200) {
                dispatch({
                    type: petConstants.UPDATE_PET_ADOPTED_ACCEPT,
                    payload: { pet: res.data.pet },
                });
                return res.data;
            } else {
                dispatch({
                    type: petConstants.UPDATE_PET_ADOPTED_FAILURE,
                    payload: { error: res.data?.message || 'Update failed' },
                });
                return { error: res.data?.message || 'Update failed' };
            }
        } catch (error) {
            dispatch({
                type: petConstants.UPDATE_PET_ADOPTED_FAILURE,
                payload: { error: error?.response?.data || 'Failed to update pet' },
            });
            return { error: error?.response?.data || 'Failed to update pet' };
        }
    };
};

export const deleteMyPetAction = (petId) => {
    return async (dispatch) => {
        dispatch({ type: petConstants.DELETE_PET_REQUEST });
        try {
            const res = await axiosInstance.delete(`/pets/delete-pet/${petId}`);
            if (res.status === 200) {
                dispatch({
                    type: petConstants.DELETE_PET_ACCEPT,
                    payload: { petId },
                });
                return res.data;
            } else {
                dispatch({
                    type: petConstants.DELETE_PET_FAILURE,
                    payload: { error: res.data?.message || 'Delete failed' },
                });
                return { error: res.data?.message || 'Delete failed' };
            }
        } catch (error) {
            dispatch({
                type: petConstants.DELETE_PET_FAILURE,
                payload: { error: error?.response?.data || 'Failed to delete pet' },
            });
            return { error: error?.response?.data || 'Failed to delete pet' };
        }
    };
};
