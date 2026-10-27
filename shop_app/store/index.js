import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import { persistReducer } from "redux-persist";

import cart from "./cartSlice";
import expandSidebar from "./ExpandSlice";
import dialog from "./DialogSlice";

// 1. Заглушка для SSR (Node.js environment), где нет window.localStorage
const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

// 2. Корневой редюсер
const reducers = combineReducers({
  cart,
  expandSidebar,
  dialog,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

// 3. Создание стора в современном стиле RTK
const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Отключает предупреждение о несериализуемых данных redux-persist
    }),
});

export default store;
// import { configureStore } from "@reduxjs/toolkit";
// import { combineReducers } from "redux";
// import thunk from "redux-thunk";
// import storage from "redux-persist/lib/storage";
// import { persistReducer } from "redux-persist";
// import cart from "./cartSlice";
// import expandSidebar from "./ExpandSlice";
// import dialog from "./DialogSlice";
// const reducers = combineReducers({ cart, expandSidebar, dialog });

// const config = {
//   key: "root",
//   storage,
// };

// const reducer = persistReducer(config, reducers);

// const store = configureStore({
//   reducer: reducer,
//   devTools: process.env.NODE_ENV !== "production",
//   middleware: [thunk],
// });

// export default store;

