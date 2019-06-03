import axios from 'axios';

export const getUserProfile = async (userId, redirect) => {

  const { data } = await axios.get(`https://graph.facebook.com/v3.3/${userId}/picture?redirect=${redirect}`);

  return data.data;

};
