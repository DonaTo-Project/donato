// Action types
const GET_USER = "GET_USER";
const UPDATE_USER = "UPDATE_USER";

// Actions
const getUser = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: GET_USER,
      payload: {
        address: "",
      },
    });
  };
};

// Actions
const updateUser = (fields) => {
  return async (dispatch, getState) => {
    dispatch({
      type: UPDATE_USER,
      payload: { fields },
    });
  };
};

export { GET_USER, UPDATE_USER, getUser, updateUser };
