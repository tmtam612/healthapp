import { RootState } from "store/index";
import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./UserManager.types";

const initialUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "johndoe@gmail.com",
  },
  {
    id: "2",
    name: "Zoe Smith",
    email: "zoesmith@gmail.com",
  },
  {
    id: "3",
    name: "Daisy Campbell",
    email: "daisycampbell@gmail.com",
  },
];

export type UsersState = {
  users: User[];
  selectedUserId?: User["id"] | null;
};

const initialState: UsersState = {
  users: initialUsers,
  selectedUserId: undefined,
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload);
    },
    removeUser: (state, action: PayloadAction<User>) => {
      state.users = state.users.filter((user) => user.id !== action.payload.id);
    },
    selectUser: (state, action: PayloadAction<string>) => {
      state.selectedUserId = action.payload;
    },
  },
});

export const { setUsers, addUser, removeUser, selectUser } = usersSlice.actions;

export const getSelectedUser = createSelector(
  (state: RootState) => state.users,
  (usersState) => {
    if (usersState.selectedUserId) {
      return usersState.users.find(
        (user) => user.id === usersState.selectedUserId
      );
    } else {
      return null;
    }
  }
);

export default usersSlice.reducer;
