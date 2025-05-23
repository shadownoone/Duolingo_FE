import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import languageReducer from "../features/language/languageSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    language: languageReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type AppDispatch = typeof store.dispatch
