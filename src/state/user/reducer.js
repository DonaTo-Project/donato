import { GET_USER, UPDATE_USER, getUser, updateUser } from "./actions";

const userReducer = (state = {}, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_USER:
      return payload.user;
    case UPDATE_USER:
      return { ...state, ...payload.fields };
    default:
      return state;
  }
};

export default userReducer;
