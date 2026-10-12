import mongoose, { Schema, Document, Model } from 'mongoose';
import { StepActionType, StepTooltip, StepSpotlight, StepNavigation } from '@/types/demo';

export interface IStepDoc extends Document {
  demoId: mongoose.Types.ObjectId;
  workspaceId: mongoose.Types.ObjectId;
  sceneId: mongoose.Types.ObjectId;
  chapterId?: mongoose.Types.ObjectId;
  order: number;
  title: string;
  description?: string;
  targetElementId?: string;
  action: StepActionType;
  tooltip: StepTooltip;
  spotlight: StepSpotlight;
  navigation: StepNavigation;
  zoomPan?: any;
  completion?: {
    type: 'click' | 'delay' | 'button';
    nextStepId?: string;
    nextSceneId?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const StepSchema = new Schema<IStepDoc>(
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
    chapterId: {
      type: Schema.Types.ObjectId,
      ref: 'Chapter',
      default: null,
      index: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    title: {
      type: String,
      required: [true, 'Step title is required'],
      trim: true,
      default: 'New Walkthrough Step',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    targetElementId: {
      type: String,
      default: null,
    },
    action: {
      type: String,
      enum: ['click', 'hover', 'type', 'select', 'scroll', 'observe', 'custom'],
      default: 'click',
    },
    tooltip: {
      title: { type: String, default: 'Interactive Hotspot' },
      description: {
        type: String,
        default: 'Click this highlighted feature to continue your guided tour.',
      },
      position: {
        type: String,
        enum: ['top', 'bottom', 'left', 'right', 'center'],
        default: 'bottom',
      },
      badge: { type: String, default: 'Step 1' },
      buttonText: { type: String, default: 'Next Step' },
      secondaryButtonText: { type: String, default: '' },
    },
    spotlight: {
      enabled: { type: Boolean, default: true },
      shape: { type: String, enum: ['rectangle', 'circle'], default: 'rectangle' },
      padding: { type: Number, default: 8 },
      borderRadius: { type: Number, default: 12 },
    },
    navigation: {
      canSkip: { type: Boolean, default: true },
      autoAdvance: { type: Boolean, default: false },
      delayMs: { type: Number, default: 3500 },
      progressionPolicy: { type: String, enum: ['auto', 'requireInteraction'], default: 'auto' },
      durationOverrideMs: { type: Number, default: null },
    },
    zoomPan: {
      type: Schema.Types.Mixed,
      default: null,
    },
    completion: {
      type: { type: String, enum: ['click', 'delay', 'button'], default: 'click' },
      nextStepId: { type: String, default: null },
      nextSceneId: { type: String, default: null },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
StepSchema.index({ demoId: 1, order: 1 });
StepSchema.index({ sceneId: 1, order: 1 });
StepSchema.index({ workspaceId: 1, demoId: 1 });

export const Step: Model<IStepDoc> =
  mongoose.models.Step || mongoose.model<IStepDoc>('Step', StepSchema);
