import { createStore } from 'redux';

// Hand-written action types and a single global reducer.
export const SAY_HELLO = 'SAY_HELLO';
export const SET_FAVOURITE = 'SET_FAVOURITE';

const initialState: any = {
  helloCount: 0,
  favourite: null,
};

function rootReducer(state: any = initialState, action: any) {
  switch (action.type) {
    case SAY_HELLO:
      return { ...state, helloCount: state.helloCount + 1 };
    case SET_FAVOURITE:
      return { ...state, favourite: action.payload };
    default:
      return state;
  }
}

const store = createStore(
  rootReducer,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
);

export default store;
