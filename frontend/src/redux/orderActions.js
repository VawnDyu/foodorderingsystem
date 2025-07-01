import axios from '../api/axios';

export const addOrder = (orderData) => async (dispatch, getState) => {
  try {
    const userId = getState().user.user._id;

    const orderPayload = {
      customerId: userId,
      items: orderData.items, 
    };

    const config = {
      withCredentials: true, // ✅ Send cookies including accessToken
    };

    const response = await axios.post('/order', orderPayload, config);

    dispatch({
      type: 'ADD_ORDER_SUCCESS',
      payload: response.data,
    });

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message;

    dispatch({
      type: 'ADD_ORDER_FAILURE',
      payload: errorMessage,
    });

    throw error;
  }
};
