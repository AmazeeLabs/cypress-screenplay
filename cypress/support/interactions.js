import {createQuestion, createTask} from "../../dist";

export const visitTestPage = createTask((cy, page) => {
  cy.visit(`./cypress/fixtures/${page}`);
});

export const readListItems = createQuestion((cy, assert) => {
  cy.get('li')
      .should(items =>
          assert(
              items
                  .toArray()
                  .map((item) => item.textContent)
                  .filter((item) => item !== null)
          )
      );
});

