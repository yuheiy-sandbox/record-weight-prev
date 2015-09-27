'use strict';

export default {
  storage(key, value) {
    if (value) {
      return localStorage.setItem(key, JSON.stringify(value));
    }

    const store = localStorage.getItem(key);
    return JSON.parse(store) || [];
  }
};
