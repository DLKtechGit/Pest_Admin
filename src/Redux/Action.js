
export const setUserData = (userData) => {
  localStorage.setItem("userData", JSON.stringify(userData)); // Store user data in local storage
  return {
    type: "SET_USER_DATA",
    payload:userData,
  };
};


export const clearUserData = () => {
  localStorage.removeItem("userData"); // Remove user data from local storage
  return {
    type: "CLEAR_USER_DATA",
  };
};