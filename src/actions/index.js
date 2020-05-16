export const addToCounter = (state, amount) => {
  const counter = state.state.counter + amount;
  state.setState({ counter });
};

export const menuToggle = (state, menuToggle) => {
  state.setState({ menuToggle });
};

export const setPage = (state, page) => {
  state.setState({ page });
};

export const dialogToggle = (state, dialog) => {
  state.setState({ dialog });
};

export const messagesHandler = (state, messages) => {
  state.setState({ messages });
};

export const titleHandler = (state, title) => {
  state.setState({ title });
};

export const setInit = (state, init) => {
  state.setState({ init });
};

export const setHomeContent = (state, homeContent) => {
  state.setState({ homeContent });
};