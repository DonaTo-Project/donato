// Action types
const GET_USER = "GET_USER";

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

export { GET_USER, getUser };
