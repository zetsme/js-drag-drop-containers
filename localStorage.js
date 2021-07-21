export const getItemsFromLocalStorage = (valuesArr, itemName) => {
  if (localStorage.getItem(itemName)) {
    return JSON.parse(localStorage.getItem(itemName));
  } else {
    const map = new Map();
    valuesArr.forEach((item, index) => {
      map.set(
        item,
        [...Array(index + 1).keys()].map((i) => `test ${item} ${i + 1}`)
      );
    });
    localStorage.setItem(itemName, JSON.stringify(Object.fromEntries(map)));
    return JSON.parse(localStorage.getItem(itemName));
  }
};

export const saveItemsToLocalStorage = (valuesObj, itemName) => {
  localStorage.setItem(itemName, JSON.stringify(valuesObj));
};
