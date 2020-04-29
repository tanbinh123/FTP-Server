import * as actionTypes from 'actions';

const initialState = {
  loggedIn: true,
  user: {
    first_name: 'Ítalo',
    last_name: 'Gustavo',
    email: 'demo@devias.io',
    avatar: 'https://ca.slack-edge.com/T0DFB0TJN-UB0744VEH-57dff1d722b2-512',
    bio: 'Diretoria',
    role: 'ADMIN' // ['GUEST', 'USER', 'ADMIN']
  }
};

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SESSION_LOGIN: {
      return {
        ...initialState
      };
    }

    case actionTypes.SESSION_LOGOUT: {
      return {
        ...state,
        loggedIn: false,
        user: {
          role: 'GUEST'
        }
      };
    }

    default: {
      return state;
    }
  }
};

export default sessionReducer;
