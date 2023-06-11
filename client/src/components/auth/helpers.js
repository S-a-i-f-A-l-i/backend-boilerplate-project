import cookie from "js-cookie";

// set Cookie
export const setCookie = (key, value) => {
  if (window !== undefined) {
    cookie.set(key, value, {
      expires: 1,
    });
  }
};
// remove cookie
export const removeCookie = (key) => {
  if (window !== undefined) {
    cookie.remove(key);
  }
};
// get cookie
export const getCookie = (key) => {
  if (window !== undefined) {
    return cookie.get(key);
  }
};

// set localStorage
export const setLocalStorage = (key, value) => {
  if (window !== undefined) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// remove localStorage
export const removeLocalStorage = (key) => {
  if (window !== undefined) {
    localStorage.removeItem(key);
  }
};

export const authenticate = (response, next) => {
  //   console.log("AUTHENTICATION HELPER ON SIGNING RESPONSE", response);
  setCookie("token", response.data.token);
  setLocalStorage("user", response.data.user);
  next();
};

export const isAuth = () => {
  if (window !== undefined) {
    const cookieChecked = getCookie("token");
    if (cookieChecked) {
      if (localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user"));
      } else {
        return false;
      }
    }
  }
};

export const signout = (next) => {
  if (window !== undefined) {
    removeCookie("token");
    removeLocalStorage("user");
    next();
  }
};
