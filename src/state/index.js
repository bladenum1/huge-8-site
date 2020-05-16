import React from "react";
import useGlobalHook from "use-global-hook";

import * as actions from "../actions";

const initialState = {
  counter: 0,
  menuToggle: false,
  page: 'Home',
  dialog: false,
  messages: [],
  title: '',
  init: {},
  homeContent: '',
};

const useGlobal = useGlobalHook(React, initialState, actions);

export default useGlobal;
