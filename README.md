# Cypress Screenplay

A simple implementation of the [screenplay pattern] for [Cypress][cypress]. Pairs perfectly with [cypress-cucumber-preprocessor].

[cypress-cucumber-preprocessor]: https://github.com/TheBrainFamily/cypress-cucumber-preprocessor
[screenplay pattern]: https://www.infoq.com/articles/Beyond-Page-Objects-Test-Automation-Serenity-Screenplay/
[cypress]: https://cypress.io

## Why?

Improve maintainability and re-usability of your Cypress test code. The screenplay patterns puts focus on actors and
generic interactions instead of page structure details, which makes it the natural companion of a behaviour driven
workflow.

## Installation

```shell script
yarn add -D cypress-screenplay
```

## Usage

Every test case is a series of user interactions with the test case. There are two fundamental types of interactions:
_Task_ and _Questions_. When executing a _Task_, the user changes the systems internal state. A _Question_ on the other
hand investigates the current state and asserts its correctness. This means every test first has to define the required
tasks and questions and then execute them.
The following example is implemented in Typescript, but the library is usable in plain javascript as well.

```typescript
import {Actor, Task, Question, createTask, createQuestion} from 'cypress-screenplay';

const visitTestPage = createTask<string>((cy, page) => {
  cy.visit(`./cypress/integration/${page}`);
});

const readListItems = createQuestion<undefined, string[]>((cy, param, assert) => {
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

describe('Screenplay', () => {
  const actor = new Actor();

  it('executes tasks and questions', () => {
    actor
      .perform(visitTestPage, 'test.html');
      .ask(readListItems, undefined, (items) => {
        expect(items).to.contain('A');
        expect(items).to.contain('B');
        expect(items).to.contain('C');
      });
  });
});
```

## Advanced usage

### Custom abilities

### Custom interactions

### Multi-ability setups
