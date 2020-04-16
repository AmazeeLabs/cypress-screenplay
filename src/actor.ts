import { Question, Task, UseCypress } from '../index';
import {
  AbilityRequestError,
  MissingAbilityError,
  UnsupportedTaskError,
} from './errors';

/**
 * The Actor class.
 *
 * Encapsulates the current users abilities and grants access to them.
 * Used to perform tasks using abilities given to the actor.
 */
export class Actor {
  /**
   * The list of abilities this actor is empowered to use.
   *
   * A list of arbitrary objects that grant access to operations.
   */
  protected abilities: object[];

  /**
   * Flag that indicates if the actor is currently preparing a task.
   *
   * Abilities can only be requested in interaction constructors.
   */
  protected preparing: boolean = false;

  /**
   * Retrieve an ability instance by type.
   *
   * @param type
   *   The ability class.
   */
  public ability<T extends object>(type: { new (): T }): T {
    // If the actor is not preparing, this method is misused.
    if (!this.preparing) {
      throw new AbilityRequestError();
    }

    // Search for the first matching ability.
    const ability = this.abilities
      .filter((ability): ability is T => ability.constructor.name === type.prototype.constructor.name)
      .shift();

    // If no ability is found, throw an exception.
    if (!ability) {
      throw new MissingAbilityError();
    }
    return ability;
  }

  /**
   * Actor constructor.
   *
   * @param abilities
   *   The set of abilities.
   */
  constructor(abilities?: object[]) {
    this.abilities = abilities || [new UseCypress()];
  }

  /**
   * Prepare interaction.
   *
   * Accepts a list of interactions that are fit to perform a given task and
   * selects the first one that is covered by the current actors abilities.
   *
   * @param interactions
   *   A list of possible interactions.
   */
  protected prepare<T extends object>(
    interactions: { new (actor: Actor): T } | { new (actor: Actor): T }[]
  ): T {
    // Try to create an instance of all interactions.
    this.preparing = true;
    const executor = (interactions instanceof Array
      ? interactions
      : [interactions]
    )
      .map(interaction => {
        try {
          return new interaction(this);
        } catch (err) {
          // If the constructor threw a MissingAbilityError, this interaction is
          // no supported by the actor, so we skip it.
          if (err instanceof MissingAbilityError) {
            return null;
          }
          // All other errors are passed outside.
          throw err;
        }
      })
      .filter(executor => executor !== null)
      .shift();
    this.preparing = false;

    if (executor === undefined || executor === null) {
      // If there was no matching interaction, raise an exception to indicate that
      // this task is not supported by the current actor.
      throw new UnsupportedTaskError(
        (interactions instanceof Array ? interactions : [interactions]).map(
          interaction => interaction.prototype.constructor.name
        )
      );
    }

    return executor;
  }

  /**
   * Perform a task.
   *
   * @param task
   * @param param
   */
  public perform<P>(task: Task<P>, param: P): Actor {
    this.prepare(task).invoke(param);
    return this;
  }

  /**
   * Ask a question.
   *
   * @param question
   * @param param
   * @param assert
   */
  public ask<P, R>(
    question: Question<P, R>,
    param: P,
    assert: (resp: R) => void
  ): Actor {
    this.prepare(question).invoke(param, assert);
    return this;
  }
}
