import { State } from "./state";
import { Entry } from "../types";
import { User } from "../types";

export type Action =
  | {
      type: "SET_ENTRY_LIST";
      payload: Entry[];
    }
  | {
      type: "ADD_ENTRY";
      payload: Entry;
    }
  | {
      type: "SET_USER";
      payload: User;
    }
  | {
      type: "REGISTER_USER";
      payload: User;
    };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_ENTRY_LIST":
      return {
        ...state,
        entries: {
          ...action.payload.reduce(
            (memo, entry) => ({ ...memo, [entry.id]: entry }),
            {}
          ),
          ...state.entries
        }
      };
    case "ADD_ENTRY":
      return {
        ...state,
        entries: {
          ...state.entries,
          [action.payload.id]: action.payload
        }
      };
    case "SET_USER":
      return {
        ...state,
        user: {
          id: action.payload.id,
          username: action.payload.username,
          password: action.payload.password,
          token: action.payload.token
        }
      };
    case "REGISTER_USER":
      return {
        ...state,
        newUser: {
          username: action.payload.username,
          password: action.payload.password,
        }
      };
    default:
      return state;
  }
};
