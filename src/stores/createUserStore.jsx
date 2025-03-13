import dayjs from 'dayjs';

export const createUserSlice = (set) => ({
  name: '',
  username: '',
  joinedAt: dayjs(),
  loggedIn: false,

  setName: (name) => {
    if (typeof name !== 'string') {
      console.warn('Invalid value for `name`. Expected a string.');
      return;
    }
    set(() => ({ name }));
  },

  setUsername: (username) => {
    if (typeof username !== 'string') {
      console.warn('Invalid value for `username`. Expected a string.');
      return;
    }
    set(() => ({ username }));
  },

  logIn: () => set(() => ({ loggedIn: true })),
  logOut: () => set(() => ({ loggedIn: false })),
});
