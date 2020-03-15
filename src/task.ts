import { Actor } from './actor';

/**
 * Type definition for task interactions.
 */
export interface TaskInteraction<P> {
  invoke(param: P): void;
}

/**
 * Type definition for tasks.
 *
 * An task is a list of interactions that accept a parameter of type P and don't
 * yield a result, but modify the state as a side effect.
 */
type TaskType<P> = { new (actor: Actor): TaskInteraction<P> };
export type Task<P> = TaskType<P> | TaskType<P>[];
