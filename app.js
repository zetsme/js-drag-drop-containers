import { createElement, appendToDOM } from './utils.js';
import { getItemsFromLocalStorage, saveItemsToLocalStorage } from './localStorage.js';

const container = document.querySelector('.container');

const valuesArr = ['red', 'green', 'blue', 'orange'];

let valuesFromLocalStorage = getItemsFromLocalStorage(valuesArr, 'listItems');

const createListItemsFromLocalStorage = (item, list) => {
  const itemArray = valuesFromLocalStorage[item];
  itemArray.forEach((listItem, index) => {
    const li = createElement(
      'li',
      'drag-item',
      { draggable: true, id: `${item}-${index + 1}` },
      listItem
    );
    li.addEventListener('dragstart', onDragStart);
    li.addEventListener('dragend', onDragEnd);
    list.append(li);
  });
};

const createList = (item) => {
  const column = createElement('div', `column column-${item}`, {});
  const header = createElement('h2', '', {}, item.toUpperCase());
  const list = createElement('ul', 'drag-list', { id: item });
  const btnGroup = createElement('div', 'btn-group', {});
  const addBtn = createElement('button', 'btn add-btn', {}, 'Add Item');
  addBtn.addEventListener('click', (e) => createAddItemContainer(e, item));

  createListItemsFromLocalStorage(item, list);

  list.addEventListener('drop', onDrop);
  list.addEventListener('dragenter', onDragEnter);
  list.addEventListener('dragover', onDragOver);
  list.addEventListener('dragleave', onDragLeave);

  appendToDOM(
    new Map([
      [btnGroup, [addBtn]],
      [column, [header, list, btnGroup]],
      [container, [column]],
    ])
  );
};

const createAddItemContainer = (e, item) => {
  const addContainer = createElement('div', 'add-container');
  const addItem = createElement('div', 'add-item', { contenteditable: true });
  const parentEl = document.getElementById(item).parentElement;
  const saveBtn = createElement('button', 'btn save-btn', {}, 'Save Item');
  saveBtn.addEventListener('click', (e) => createNewItem(e, item));
  parentEl.querySelector('.add-btn').remove();
  appendToDOM(
    new Map([
      [parentEl.querySelector('.btn-group'), [saveBtn]],
      [addContainer, [addItem]],
      [parentEl, [addContainer]],
    ])
  );
};

const createNewItem = (e, item) => {
  const parentEl = document.getElementById(item).parentElement;
  const text = parentEl.querySelector('.add-item').textContent;
  if (text) {
    valuesFromLocalStorage[item].push(text);
    saveItemsToLocalStorage(valuesFromLocalStorage, 'listItems');
    //
    const tempId = parentEl.querySelectorAll('li').length;
    const li = createElement(
      'li',
      'drag-item',
      { draggable: true, id: `${item}-${tempId + 1}` },
      text
    );
    li.addEventListener('dragstart', onDragStart);
    li.addEventListener('dragend', onDragEnd);
    parentEl.querySelector('.drag-list').appendChild(li);
  }
  parentEl.querySelector('.add-container').remove();
  parentEl.querySelector('.save-btn').remove();
  const addBtn = createElement('button', 'btn add-btn', {}, 'Add Item');
  addBtn.addEventListener('click', (e) => createAddItemContainer(e, item));
  parentEl.querySelector('.btn-group').appendChild(addBtn);
};

const onDragStart = (e) => {
  setTimeout(() => {
    document.querySelectorAll('.drag-item').forEach((i) => (i.style.pointerEvents = 'none'));
  }, 0);
  e.dataTransfer.setData('elementId', e.target.id);
};
const onDragEnd = (e) => {
  document.querySelectorAll('.drag-item').forEach((i) => i.removeAttribute('style'));
};
const onDragEnter = (e) => {
  e.currentTarget.classList.add('over');
};
const onDragOver = (e) => e.preventDefault();

const onDragLeave = (e) => {
  e.currentTarget.classList.remove('over');
};
const onDrop = (e) => {
  e.preventDefault();
  e.currentTarget.classList.remove('over');
  const elementId = e.dataTransfer.getData('elementId');
  const currentTargetListId = e.currentTarget.id;
  const elementToAppend = document.getElementById(elementId);
  e.target.appendChild(elementToAppend);
  const currentListChildrens = [...e.currentTarget.children];
  currentListChildrens.forEach((v, i) => (v.id = `${currentTargetListId}-${i + 1}`));
  const previousTargetListId = elementId.split('-')[0];
  valuesFromLocalStorage[previousTargetListId] = valuesFromLocalStorage[
    previousTargetListId
  ].filter((i) => i !== elementToAppend.textContent);
  valuesFromLocalStorage[currentTargetListId].push(elementToAppend.textContent);
  saveItemsToLocalStorage(valuesFromLocalStorage, 'listItems');
};

valuesArr.forEach(createList);
