import mongoose, { Schema, Document, Model } from 'mongoose';
import { InteractionTrigger, InteractionCondition, InteractionAction } from '@/types/demo';

export interface IInteractionDoc extends Document {
  demoId: mongoose.Types.ObjectId;
  workspaceId: mongoose.Types.ObjectId;
  sceneId: mongoose.Types.ObjectId;
  elementId?: string;
  trigger: InteractionTrigger;
  conditions: InteractionCondition[];
  actions: InteractionAction[];
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InteractionSchema = new Schema<IInteractionDoc>(
  {
    demoId: {
      type: Schema.Types.ObjectId,
      ref: 'Demo',
      required: [true, 'Demo ID is required'],
      index: true,
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: [true, 'Workspace ID is required'],
      index: true,
    },
    sceneId: {
      type: Schema.Types.ObjectId,
      ref: 'Scene',
      required: [true, 'Scene ID is required'],
      index: true,
    },
    elementId: {
      type: String,
      default: null,
    },
    trigger: {
      type: String,
      enum: [
        'click',
        'doubleClick',
        'hover',
        'mouseenter',
        'mouseleave',
        'focus',
        'input',
        'change',
        'submit',
        'scroll',
        'drag',
        'load',
        'timer',
        'stepEnter',
        'stepComplete',
      ],
      default: 'click',
    },
    conditions: {
      type: [
        {
          field: { type: String, required: true },
          operator: {
            type: String,
            enum: ['equals', 'notEquals', 'contains', 'notContains', 'greaterThan', 'lessThan', 'exists', 'notExists'],
            required: true,
          },
          value: { type: Schema.Types.Mixed },
        },
      ],
      default: [],
    },
    actions: {
      type: [
        {
          type: {
            type: String,
            enum: [
              'navigate',
              'nextStep',
              'previousStep',
              'openScene',
              'close',
              'show',
              'hide',
              'highlight',
              'spotlight',
              'tooltip',
              'scrollTo',
              'focus',
              'setVariable',
              'openUrl',
              'showModal',
              'completeDemo',
            ],
            required: true,
          },
          targetSceneId: { type: String, default: null },
          targetStepId: { type: String, default: null },
          targetElementId: { type: String, default: null },
          variableKey: { type: String, default: null },
          variableValue: { type: Schema.Types.Mixed, default: null },
          url: { type: String, default: null },
          openInNewTab: { type: Boolean, default: false },
          modalContent: { type: String, default: null },
        },
      ],
      default: [],
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
InteractionSchema.index({ demoId: 1, sceneId: 1 });
InteractionSchema.index({ demoId: 1, elementId: 1 });
InteractionSchema.index({ workspaceId: 1, demoId: 1 });

export const Interaction: Model<IInteractionDoc> =
  mongoose.models.Interaction || mongoose.model<IInteractionDoc>('Interaction', InteractionSchema);
