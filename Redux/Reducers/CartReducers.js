import { ADD_TO_CART, REMOVE_FROM_CART, INCREMENT, DECREMENT, TOTAL_AMOUNT, CART_LINE_NAME_CHANGE, ADD_TO_CART_FROM_QUOTE } from '../constants';

const initialState = {
  cartItems: [],
  vendorId:"",
  totalAmout: 0,
  orgId:""
}

export const CartReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      let existed_item = state.cartItems.find(item => (action.payload.productData.productId === item.productId && action.payload.productData.uom === item.uom));
      if (existed_item) {
        existed_item.product_qty = action.payload.productData.product_qty;
        existed_item.itemLineDesc = action.payload.productData.itemLineDesc;
        return {
          ...state,
        }

      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, action.payload.productData]
        };
      }

      // case ADD_TO_CART_FROM_QUOTE:
      // let existed_items = state.cartItems.find(item => (action.payload.productData.productId === item.productId && action.payload.productData.uom === item.uom && action.payload.productData.itemLineDesc == item?.itemLineDesc));
      // if (existed_items) {
      //   existed_items.product_qty = action.payload.productData.product_qty;
      //   // existed_items.itemLineDesc = action.payload.productData.itemLineDesc;
      //   return {
      //     ...state,
      //   }

      // } else {
      //   return {
      //     ...state,
      //     cartItems: [...state.cartItems, action.payload.productData]
      //   };
      // }

    case ADD_TO_CART_FROM_QUOTE:
      const { productData } = action.payload;
      const exists = state.cartItems.find(item =>
        item.itemId === productData.itemId &&
        item.uom === productData.uom &&
        item.itemLineDesc === productData.itemLineDesc
      );

      if (exists) {
        // Exact same product with same UOM and note exists – do nothing
        return {
          ...state,
        };
      } else {
        // Add new product (different note or UOM or itemId)
        return {
          ...state,
          cartItems: [...state.cartItems, productData],
        };
      }

    case REMOVE_FROM_CART:
      let removeItem = state.cartItems.filter((item, index) => {
        return index !== action.payload
      });

      // let removeItem = state.cartItems.filter(item => !values.includes(item));
      // console.log(action.payload);

      return {
        ...state,
        cartItems: removeItem
      }

    case INCREMENT:
      let updatedCart = state.cartItems.map((item, index) => {
        if (index == action.payload) {
          let qty = Number(item.product_qty) + 1;
          let price = (qty * item.price).toFixed(2);
          return {
            ...item,
            product_qty: qty,
            totalPrice:price
          }

        }
        return item;
      });
      return {
        ...state,
        cartItems: updatedCart
      }
    case DECREMENT:
      //console.log(state.cartItems);
      let afterDecrementCart = state.cartItems.map((item, index) => {
        if (index == action.payload) {
          let qty = Number(item.product_qty) - 1;
          let price = (qty * item.price).toFixed(2);
          return {
            ...item,
            product_qty: qty,
            totalPrice:price
          }
        }
        return item;
      }).filter(elem => elem.product_qty != 0);
      return {
        ...state,
        cartItems: afterDecrementCart
      }
      case TOTAL_AMOUNT:
      //console.log(state);
      let totalAmout = state.cartItems.reduce((accum, currentVal) => {
        let { price, product_qty } = currentVal;
        let updatedTotalAmout = price * product_qty;

        accum.totalAmout += updatedTotalAmout;
        return accum;
      }, {
        totalAmout: 0
      })
      return { ...state, totalAmout }
      case "RESET_CART_DATA":
      return {
        ...state,
        isLoading: false,
        cartItems: []
      }
      // case CART_LINE_NAME_CHANGE:
      //   let exist_item = state.cartItems.find(item => (action.payload.lineProductId === item.productId && action.payload.lineProductUom === item.uom));
      //   if (exist_item) {
      //     exist_item.itemLineDesc = action.payload.itemLineDesc;
      //     return {
      //         ...state,
      //     }
      //   }

      case CART_LINE_NAME_CHANGE:
        const { cartItemId, itemLineDesc } = action.payload;
        if (!cartItemId) {
          // console.warn('CART_LINE_NAME_CHANGE: Missing cartItemId', action.payload);
          return state;
        }
        return {
          ...state,
          cartItems: state.cartItems.map(item =>
            item.cartItemId === cartItemId
              ? { ...item, itemLineDesc }
              : item
          ),
        };
       case "STORE_SELECTED_ORG_ID":
          return {
              ...state,
              orgId:action.payload
          }
    default:
      return state;
  }
}

