// Action types
const GET_CAMPAIGNS = "GET_CAMPAIGNS";

// Actions
const getCampaigns = () => {
  return async (dispatch, getState) => {
    dispatch({
      type: GET_CAMPAIGNS,
      payload: {
        campaigns: [
          {
            name: "Recipient name",
            address: "0xC0aa5cc8B6024DE60b5EdA42Bb0ED47Fb530f87C",
          },
        ],
      },
    });
  };
};

export { GET_CAMPAIGNS, getCampaigns };
