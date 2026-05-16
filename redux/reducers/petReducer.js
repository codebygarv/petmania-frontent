import { petConstants } from "../constants/petConstants";

const initialState = {
    loading: false,
    pets: [],
    myPets: [],
    myPetsLoading: false,
    error: null,
};

export const petReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'persist/REHYDRATE':
            return {
                ...state,
                loading: false,
                myPetsLoading: false,
            };
        case petConstants.CREATE_PET_REQUEST:
        case petConstants.GET_PETS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case petConstants.CREATE_PET_ACCEPT:
            return {
                ...state,
                loading: false,
                error: null,
            };
        case petConstants.GET_PETS_ACCEPT:
            return {
                ...state,
                loading: false,
                pets: action.payload.pets,
                error: null,
            };
        case petConstants.CREATE_PET_FAILURE:
        case petConstants.GET_PETS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };
        case petConstants.GET_MY_PETS_REQUEST:
            return {
                ...state,
                myPetsLoading: true,
                error: null,
            };
        case petConstants.GET_MY_PETS_ACCEPT:
            return {
                ...state,
                myPetsLoading: false,
                myPets: action.payload.pets,
                error: null,
            };
        case petConstants.GET_MY_PETS_FAILURE:
            return {
                ...state,
                myPetsLoading: false,
                error: action.payload.error,
            };
        case petConstants.UPDATE_PET_ADOPTED_ACCEPT:
            return {
                ...state,
                loading: false,
                myPets: state.myPets.map((pet) =>
                    pet._id === action.payload.pet._id ? action.payload.pet : pet
                ),
                error: null,
            };
        case petConstants.UPDATE_PET_ADOPTED_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case petConstants.UPDATE_PET_ADOPTED_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };
        case petConstants.DELETE_PET_ACCEPT:
            return {
                ...state,
                loading: false,
                myPets: state.myPets.filter((pet) => pet._id !== action.payload.petId),
                error: null,
            };
        case petConstants.DELETE_PET_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case petConstants.DELETE_PET_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
            };
        default:
            return state;
    }
};