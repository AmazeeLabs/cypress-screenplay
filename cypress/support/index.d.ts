import { Actor, Question, Task } from '../../index';

declare namespace Cypress {
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
    perform<P>(task: Task<P>, param: P): Chainable<void>;

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
