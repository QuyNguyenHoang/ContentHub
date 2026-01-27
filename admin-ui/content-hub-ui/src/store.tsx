import { legacy_createStore as createStore } from 'redux'

/* ================= TYPES ================= */

export interface RootState {
  sidebarShow: boolean
  theme: 'light' | 'dark'
}

interface SetAction {
  type: 'set'
  sidebarShow?: boolean
  theme?: 'light' | 'dark'
}

type Action = SetAction

/* ================= STATE ================= */

const initialState: RootState = {
  sidebarShow: true,
  theme: 'light',
}

/* ================= REDUCER ================= */

const changeState = (
  state: RootState = initialState,
  action: Action,
): RootState => {
  switch (action.type) {
    case 'set':
      return { ...state, ...action }
    default:
      return state
  }
}

/* ================= STORE ================= */

const store = createStore(changeState)
export default store
