import { Actor } from './actor';
import { TaskInteraction } from './task';
import { QuestionInteraction } from '../index';

/**
 * Cypress ability base class.
 */
export class UseCypress {
  /**
   * A cypress instance.
   */
  protected cypress: Cypress.Chainable;

  constructor() {
    this.cypress = cy;
  }

  /**
   * Retrieve the cypress instance.
   */
  get cy() {
    return this.cypress;
  }
}

/**
 * Private base class for cypress interactions.
 *
 * Injects `cy` from the Cypress ability.
 */
class CypressInteraction {
  /**
   * A cypress instance to invoke commands on.
   */
  public cy: Cypress.Chainable;

  /**
   * An actor to perform sub-tasks.
   */
  public actor: Actor;

  /**
   * Create an interaction.
   *
   * @param actor
   *   The actor to retrieve abilities from.
   */
  constructor(actor: Actor) {
    this.actor = actor;
    this.cy = actor.ability(UseCypress).cy;
  }
}

/**
 * Base class for cypress tasks.
 */
export abstract class CypressTask<P> extends CypressInteraction
  implements TaskInteraction<P> {
  abstract invoke(param: P): void;
}

/**
 * Base class for cypress questions.
 */
export abstract class CypressQuestion<P, R> extends CypressInteraction
  implements QuestionInteraction<P, R> {
  abstract invoke(param: P, assert: (answer: R) => void): void;
}

/**
 * Shorthand for creating simple cypress tasks.
 *
 * @param procedure
 *   The procedure to fulfill this task.
 */
export function createTask<P>(
  procedure: (cy: Cypress.Chainable, param: P) => void
) {
  return class extends CypressTask<P> {
    invoke(param: P): void {
      procedure(this.cy, param);
    }
  };
}

/**
 * Shorthand for creating simple cypress questions.
 *
 * @param procedure
 *   The procedure to answer this question.
 */
export function createQuestion<P, R>(
  procedure: (
    cy: Cypress.Chainable,
    param: P,
    assert: (answer: R) => void
  ) => void
) {
  return class extends CypressQuestion<P, R> {
    invoke(param: P, assert: (answer: R) => void): void {
      procedure(cy, param, assert);
    }
  };
}
