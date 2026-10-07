import mongoose, { Schema, Document, Model } from 'mongoose';
import { ElementType, ElementPosition, ElementStyle } from '@/types/demo';

export interface IElementDoc extends Document {
  demoId: mongoose.Types.ObjectId;
  workspaceId: mongoose.Types.ObjectId;
  sceneId: mongoose.Types.ObjectId;
  stepId?: mongoose.Types.ObjectId;
  type: ElementType;
  name: string;
  position: ElementPosition;
  style: ElementStyle;
  content?: string;
  target?: string;
  visible: boolean;
  locked: boolean;
  order: number;
  hotspotConfig?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const ElementSchema = new Schema<IElementDoc>(
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
    type: {
      type: String,
      enum: [
        'hotspot',
        'button',
        'text',
        'image',
        'input',
        'tooltip',
        'callout',
        'cursor',
        'highlight',
        'video',
        'embed',
        'link',
      ],
      default: 'hotspot',
    },
    name: {
      type: String,
      required: [true, 'Element name is required'],
      trim: true,
      default: 'Interactive Element',
    },
    position: {
      x: { type: Number, default: 50 }, // percentage 0-100
      y: { type: Number, default: 50 }, // percentage 0-100
      width: { type: Number, default: 36 },
      height: { type: Number, default: 36 },
      rotation: { type: Number, default: 0 },
    },
    style: {
      type: Schema.Types.Mixed,
      default: {
        backgroundColor: '#5B5CE2',
        color: '#ffffff',
        borderRadius: 9999,
        pulseAnimation: true,
      },
    },
    content: {
      type: String,
      default: '',
    },
    target: {
      type: String,
      default: '',
    },
    visible: {
      type: Boolean,
      default: true,
    },
    locked: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    stepId: {
      type: Schema.Types.ObjectId,
      ref: 'Step',
      default: null,
      index: true,
    },
    hotspotConfig: {
      type: Schema.Types.Mixed,
      default: null,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ElementSchema.index({ sceneId: 1, order: 1 });
ElementSchema.index({ demoId: 1, sceneId: 1 });
ElementSchema.index({ demoId: 1, stepId: 1 });
ElementSchema.index({ workspaceId: 1, demoId: 1 });

export const Element: Model<IElementDoc> =
  mongoose.models.Element || mongoose.model<IElementDoc>('Element', ElementSchema);
