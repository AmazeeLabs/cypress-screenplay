import { Actor } from './actor';

/**
 * Type definition for question interactions.
 */
export interface QuestionInteraction<P, R> {
  invoke(param: P, assert: (answer: R) => void): void;
}

/**
 * Type definition for questions.
 *
 * An question is a list of interactions that accept a parameter of type P and
 * and accept an assertion callback of type R.
 */
type QuestionType<P, R> = { new (actor: Actor): QuestionInteraction<P, R> };
export type Question<P, R> = QuestionType<P, R> | QuestionType<P, R>[];
