// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   cartItems: [],
// };

// export const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     addToCart(state, action) {
//       const item = action.payload;
//       // Проверяем, есть ли уже такой товар в корзине (по _id и, если есть, по размеру/стилю)
//       const existItem = state.cartItems.find(
//         (x) => x._id === item._id && x.size === item.size && x.style === item.style
//       );

//       if (existItem) {
//         // Если есть — обновляем его параметры/количество
//         state.cartItems = state.cartItems.map((x) =>
//           x === existItem ? item : x
//         );
//       } else {
//         // Если нет — добавляем в массив
//         state.cartItems.push(item);
//       }
//     },
//     updateCart(state, action) {
//       state.cartItems = action.payload;
//     },
//     emptyCart(state) {
//       state.cartItems = [];
//     },
//   },
// });

// export const { addToCart, updateCart, emptyCart } = cartSlice.actions;

// // Селекторы для безошибочного использования в useSelector
// export const selectCartItems = (state) => state.cart.cartItems;

// export default cartSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  cartItems: [],
};
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      state.cartItems.push(action.payload);
    },
    updateCart(state, action) {
      state.cartItems = action.payload;
    },
    emptyCart(state, action) {
      state.cartItems = [];
    },
  },
});

export const { addToCart, updateCart, emptyCart } = cartSlice.actions;

export default cartSlice.reducer;
