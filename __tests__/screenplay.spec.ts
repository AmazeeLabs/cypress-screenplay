import {
  Actor,
  Task,
  UnsupportedTaskError,
  TaskInteraction,
  QuestionInteraction,
} from '../index';
import { expect } from 'chai';
import { stub } from 'sinon';

class WorthlessAbility {}

describe('Task', () => {
  const a = stub();
  const b = stub();

  beforeEach(() => {
    a.reset();
    b.reset();
  });

  class UseA {
    public a() {
      a();
    }
  }

  class UseB {
    public b() {
      b();
    }
  }

  class UseAInteraction implements TaskInteraction<undefined> {
    protected useA: UseA;
    constructor(actor: Actor) {
      this.useA = actor.ability(UseA);
    }

    invoke(): void {
      this.useA.a();
    }
  }

  class UseBInteraction implements TaskInteraction<undefined> {
    protected useB: UseB;
    constructor(actor: Actor) {
      this.useB = actor.ability(UseB);
    }
    invoke(): void {
      this.useB.b();
    }
  }

  const MyTask: Task<undefined> = [UseAInteraction, UseBInteraction];

  class MetaInteraction implements TaskInteraction<undefined> {
    protected actor: Actor;
    constructor(actor: Actor) {
      this.actor = actor;
    }
    invoke(): void {
      this.actor.perform(MyTask, undefined);
    }
  }

  it('executes an interaction to fulfill a task', () => {
    const actor = new Actor([new UseA()]);
    actor.perform(MyTask, undefined);
    expect(a.callCount).to.equal(1);
    expect(b.callCount).to.equal(0);
  });

  it('allows tasks to call other tasks', () => {
    const actor = new Actor([new UseA()]);
    actor.perform([MetaInteraction], undefined);
    expect(a.callCount).to.equal(1);
  });

  it('raises an exception if there is no supported interaction', () => {
    const actor = new Actor([new WorthlessAbility()]);
    expect(() => {
      actor.perform(MyTask, undefined);
    }).to.throw(UnsupportedTaskError);
  });

  it('uses the first supported interaction', () => {
    const actor = new Actor([new UseB()]);
    actor.perform(MyTask, undefined);
    expect(a.callCount).to.equal(0);
    expect(b.callCount).to.equal(1);
  });
});

describe('Question', () => {
  class UseUpperCase {
    public toUpperCase(value: string) {
      return value.toUpperCase();
    }
  }

  class Transform implements QuestionInteraction<string, string> {
    protected upperCase: UseUpperCase;
    constructor(actor: Actor) {
      this.upperCase = actor.ability(UseUpperCase);
    }

    invoke(param: string, assert: (answer: string) => void): void {
      assert(this.upperCase.toUpperCase(param));
    }
  }

  it('executes an interaction to answer a question', () => {
    const actor = new Actor([new UseUpperCase()]);
    actor.ask(Transform, 'Foo', res => {
      expect(res).to.equal('FOO');
    });
  });
});
