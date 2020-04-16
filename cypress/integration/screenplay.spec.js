import {readListItems, visitTestPage} from "../support/interactions";

describe('Screenplay', () => {
  it('executes tasks and questions', () => {
    cy.perform(visitTestPage, 'test.html');
    cy.ask(readListItems)
      .should('contain', 'A')
      .should('contain', 'B')
      .should('contain', 'C')
  });
});
