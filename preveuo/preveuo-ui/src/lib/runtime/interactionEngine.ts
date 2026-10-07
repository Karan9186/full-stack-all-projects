import {
  IDemoInteraction,
  InteractionAction,
  InteractionTrigger,
} from '@/types/demo';
import { evaluateAllConditions } from './conditionEvaluator';

export type ActionHandler = (action: InteractionAction) => void;

export class DemoEventBus {
  private interactions: IDemoInteraction[] = [];
  private context: Record<string, unknown> = {};
  private actionHandler: ActionHandler | null = null;

  constructor(interactions: IDemoInteraction[] = [], context: Record<string, unknown> = {}) {
    this.interactions = interactions;
    this.context = context;
  }

  setInteractions(interactions: IDemoInteraction[]) {
    this.interactions = interactions;
  }

  setContext(context: Record<string, unknown>) {
    this.context = context;
  }

  setActionHandler(handler: ActionHandler) {
    this.actionHandler = handler;
  }

  /**
   * Dispatches a user trigger event on a scene or element.
   */
  dispatch(
    trigger: InteractionTrigger,
    sceneId: string,
    elementId?: string
  ) {
    const matchingInteractions = this.interactions.filter((it) => {
      if (!it.enabled) return false;
      if (it.trigger !== trigger) return false;
      if (it.sceneId && it.sceneId !== sceneId) return false;
      if (elementId && it.elementId && it.elementId !== elementId) return false;
      return true;
    });

    for (const interaction of matchingInteractions) {
      const conditionPassed = evaluateAllConditions(interaction.conditions, this.context);
      if (conditionPassed && this.actionHandler) {
        for (const action of interaction.actions) {
          this.actionHandler(action);
        }
      }
    }
  }
}
