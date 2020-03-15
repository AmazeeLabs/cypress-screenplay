import {Actor} from "../../dist";
import {readListItems, visitTestPage} from "../support/interactions";

describe('Screenplay', () => {
  const actor = new Actor();

  it('executes tasks and questions', () => {
    actor.perform(visitTestPage, 'test.html');
    actor.ask(readListItems, undefined, (items) => {
      expect(items).to.contain('A');
      expect(items).to.contain('B');
      expect(items).to.contain('C');
    })
  });
});
