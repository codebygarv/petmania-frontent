import { combineReducers } from "redux";
import { userReducer } from "./userReducer";
import { petReducer } from "./petReducer";

const rootReducer = combineReducers({
  user: userReducer,
  pet: petReducer,
});

export default rootReducer;
