import { combineReducers } from "redux";

import userReducer from "./user/reducer";
import campaignsReducer from "./campaigns/reducer";

const appReducer = combineReducers({
  user: userReducer,
  campaigns: campaignsReducer,
});

const rootReducer = (state = {}, action) => {
  if (action.type === "USER_LOGOUT") {
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;
