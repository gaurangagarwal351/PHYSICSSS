'use strict';
const controls = [...document.querySelectorAll('[data-filter]')];
const cards = [...document.querySelectorAll('[data-category]')];
const status = document.querySelector('#filter-status');
controls.forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  let count = 0;
  controls.forEach(control => control.setAttribute('aria-pressed', String(control === button)));
  cards.forEach(card => {
    const visible = category === 'all' || card.dataset.category.split(' ').includes(category);
    card.hidden = !visible;
    if (visible) count += 1;
  });
  status.textContent = `Showing ${count} project${count === 1 ? '' : 's'}.`;
}));
