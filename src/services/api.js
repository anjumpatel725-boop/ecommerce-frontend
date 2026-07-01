export const loginUser = (email, password) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.email === email && user.password === password) {
    localStorage.setItem("isLoggedIn", "true");
    return true;
  }
  return false;
};

export const registerUser = (email, password) => {
  localStorage.setItem(
    "user",
    JSON.stringify({ email, password })
  );
  return true;
};

export const logoutUser = () => {
  localStorage.removeItem("isLoggedIn");
};