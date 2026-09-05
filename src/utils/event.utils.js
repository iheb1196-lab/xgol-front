export const subscribe = (name, listener) => {
  document.addEventListener(name, listener);
};

export const unsubscribe = (name, listener) => {
  document.removeEventListener(name, listener);
};

export const publish = (name, data) => {
  const event = new CustomEvent(name, { data });
  document.dispatchEvent(event);
};
