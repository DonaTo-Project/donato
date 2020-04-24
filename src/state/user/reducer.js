import { GET_CAMPAIGNS } from "./actions";

const userReducer = (state = {}, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_USER:
      return payload.user;
    default:
      return state;
  }
};

export default userReducer;
