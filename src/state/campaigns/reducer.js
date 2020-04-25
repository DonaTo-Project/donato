import { GET_CAMPAIGNS } from "./actions";

const campaignsReducer = (state = {}, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_CAMPAIGNS:
      return { ...state, ...payload.campaigns };
    default:
      return state;
  }
};

export default campaignsReducer;
