const createElement = (tag, classes = '', attributes = {}, textCotent = '') => {
  const setAttrs = (elem, attrs) =>
    Object.keys(attrs).map((key) => elem.setAttribute(key, attrs[key]));
  const $ = document.createElement(tag);
  if (classes) $.className = classes;
  if (Object.keys(attributes).length > 0) {
    setAttrs($, attributes);
  }
  $.textContent = textCotent;
  return $;
};

const appendToDOM = (myMap) => myMap.forEach((value, key) => key.append(...value));

export { createElement, appendToDOM };
