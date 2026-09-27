'use strict';
// Small DOM fixture: verifies the shipped filter logic without third-party packages.
var buttons = ['all', 'materials', 'hardware', 'computing'].map(filter => ({
  dataset: { filter },
  attributes: {},
  setAttribute(key, value) { this.attributes[key] = value; },
  addEventListener(event, callback) { this.click = callback; }
}));
var projectCards = ['materials computing', 'hardware', 'hardware', 'computing', 'computing', 'computing']
  .map(category => ({ dataset: { category }, hidden: false }));
var announcement = { textContent: '' };
var document = {
  querySelectorAll(selector) { return selector === '[data-filter]' ? buttons : projectCards; },
  querySelector() { return announcement; }
};
function assert(value, message) { if (!value) throw new Error(message); }
function verifyFilters() {
  buttons[1].click();
  assert(projectCards.filter(c => !c.hidden).length === 1, 'Materials filter');
  assert(announcement.textContent === 'Showing 1 project.', 'Singular announcement');
  buttons[2].click();
  assert(projectCards.filter(c => !c.hidden).length === 2, 'Hardware filter');
  buttons[3].click();
  assert(projectCards.filter(c => !c.hidden).length === 4, 'Computing filter');
  buttons[0].click();
  assert(projectCards.every(c => !c.hidden), 'All projects restored');
  assert(buttons.filter(b => b.attributes['aria-pressed'] === 'true').length === 1, 'Selection state');
}
if (typeof require === 'function') {
  const fs = require('fs');
  const vm = require('vm');
  const source = fs.readFileSync('portfolio/assets/portfolio.js', 'utf8');
  const context = vm.createContext({ document });
  vm.runInContext(source, context);
  verifyFilters();
  console.log('Portfolio filter checks passed.');
}
