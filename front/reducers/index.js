import { HYDRATE } from "next-redux-wrapper";
import user from "./user";
import post from "./post";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  // HYDRATE SSR을 위해 일부러 만들어 진 것입니다.
  index: (state = {}, action) => {
    switch (action.type) {
      case HYDRATE:
        return { ...state, ...action.payload };
      default:
        return state;
    }
  },
  user,
  post,
});
export default rootReducer;
