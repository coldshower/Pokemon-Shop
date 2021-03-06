import { createStore, combineReducers, applyMiddleware } from "redux";
import createLogger from "redux-logger";
import thunkMiddleware from "redux-thunk";
import Cookies from "js-cookie";
import { createCookieMiddleware } from "redux-cookie";
import { composeWithDevTools } from "redux-devtools-extension";
import { routerMiddleware } from "react-router-redux";
import user from "./user";
import pokemonReducer from "./pokemon";
import cartReducer from "./cart";
import reviewReducer from "./review";
import orderReducer from "./order";
import allusers from "./allusers";
import { BrowserRouter } from "react-router-dom";

const reducer = combineReducers({
  user: user,
  users: allusers,
  pokemon: pokemonReducer,
  cart: cartReducer,
  reviews: reviewReducer,
  orders: orderReducer
});

const middleware = composeWithDevTools(
  applyMiddleware(
    thunkMiddleware,
    routerMiddleware(BrowserRouter),
    createCookieMiddleware(Cookies),
    createLogger({ collapsed: true })
  )
);
const store = createStore(reducer, middleware);

export default store;
export * from "./user";
