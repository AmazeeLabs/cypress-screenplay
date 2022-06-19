import { Actor, Question, Task } from '../../index';

let _actor = new Actor();

Cypress.Commands.add('initiateActor', (actor: Actor) => {
  _actor = actor;
});

Cypress.Commands.add('perform', (task: any, param: any = undefined) => {
  _actor.perform(task, param);
});

Cypress.Commands.add(
  'ask',
  (question: Question<any, any>, param: any = undefined) => {
    return cy.wrap(
      new Cypress.Promise(resolve => {
        _actor.ask(question, param, resolve);
      })
    );
  }
);

declare global {
  namespace Cypress {
    interface Chainable<Subject> {
      /**
       * Initiate with a different actor.
       *
       * Allows to set a customized actor with specialised abilities.
       *
       * @param actor
       */
      initiateActor(actor: Actor): Chainable<void>;

      /**
       * Perform a given task.
       *
       * @param task
       *   The task implementation.
       * @param param
       *   The tasks parameter.
       */
      perform<P>(task: Task, param: P): Chainable<void>;

      /**
       * Ask a question.
       *
       * The questions result will be returned as a chainable.
       *
       * @param question
       *   The question implementation.
       * @param param
       *   Question parameter.
       */
      ask<P, R>(question: Question<P, R>, param: P): Chainable<R>;
    }
  }
}
