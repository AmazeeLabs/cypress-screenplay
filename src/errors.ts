/**
 * Exception thrown if an interaction requests an unsupported actor ability..
 *
 * Used internally to find supported interactions.
 */
export class MissingAbilityError extends Error {}

/**
 * Thrown if an ability is requested outside of an interaction constructor.
 */
export class AbilityRequestError extends Error {
  constructor() {
    super(`Abilities may only be requested in interaction constructors.`);
  }
}

/*
 * Exception thrown when no interaction of a task matches the actors abilities.
 */
export class UnsupportedTaskError<T> extends Error {
  constructor(interactions: string[]) {
    super(
      `None of the interaction options is supported by the current actor: ${interactions}`
    );
  }
}
