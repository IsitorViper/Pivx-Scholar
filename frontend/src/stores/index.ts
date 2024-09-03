import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import darkModeReducer from "./slices/darkModeSlice";

// ...

const store = configureStore({
  reducer: {
    user: userReducer,
    darkMode: darkModeReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
