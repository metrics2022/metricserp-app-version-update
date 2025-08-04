import { SALES_ORDER_ADD_TO_CART, SALES_ORDER_REMOVE_FROM_CART, SALES_ORDER_INCREMENT, SALES_ORDER_DECREMENT, SALES_ORDER_TOTAL_AMOUNT, SALES_ORDER_CART_LINE_NAME_CHANGE } from '../constants';

const initialState = {
  cartItems: [],
  vendorId:"",
  totalAmout: 0,
  orgId:""
}

export const SalesOrderCartReducer = (state = initialState, action) => {
  switch (action.type) {
    case SALES_ORDER_ADD_TO_CART:
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

    case SALES_ORDER_REMOVE_FROM_CART:
      let removeItem = state.cartItems.filter((item, index) => {
        return index !== action.payload
      });

      // let removeItem = state.cartItems.filter(item => !values.includes(item));
      // console.log(action.payload);

      return {
        ...state,
        cartItems: removeItem
      }

    case SALES_ORDER_INCREMENT:
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
    case SALES_ORDER_DECREMENT:
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
      case SALES_ORDER_TOTAL_AMOUNT:
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
      case SALES_ORDER_CART_LINE_NAME_CHANGE:
        let exist_item = state.cartItems.find(item => (action.payload.lineProductId === item.productId && action.payload.lineProductUom === item.uom));
        if (exist_item) {
          // console.logconsole.log('sdfsdf', action.payload)
          exist_item.itemLineDesc = action.payload.itemLineDesc;
          return {
              ...state,
          }
        }
       case "STORE_SELECTED_ORG_ID":
          return {
              ...state,
              orgId:action.payload
          }
    default:
      return state;
  }
}

