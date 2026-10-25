import { THEME_COLORS } from '@/lib/constants/theme';
import mongoose, { Schema, Document, Model } from 'mongoose';
import { SceneSourceType, SceneViewport } from '@/types/demo';

export interface ISceneDoc extends Document {
  demoId: mongoose.Types.ObjectId;
  workspaceId: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  order: number;
  sourceType: SceneSourceType;
  sourceAssetUrl: string;
  viewport: SceneViewport;
  background: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const SceneSchema = new Schema<ISceneDoc>(
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
    name: {
      type: String,
      required: [true, 'Scene name is required'],
      trim: true,
      default: 'Scene 1',
    },
    slug: {
      type: String,
      trim: true,
      default: 'scene-1',
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    sourceType: {
      type: String,
      enum: ['screenshot', 'recording', 'url', 'upload', 'custom'],
      default: 'screenshot',
    },
    sourceAssetUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
    },
    viewport: {
      width: { type: Number, default: 1920 },
      height: { type: Number, default: 1080 },
      aspectRatio: { type: String, default: '16:9' },
    },
    background: {
      type: String,
      default: THEME_COLORS.bgLight,
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

// Compound index for scene ordering within demo
SceneSchema.index({ demoId: 1, order: 1 });
SceneSchema.index({ workspaceId: 1, demoId: 1 });

export const Scene: Model<ISceneDoc> =
  mongoose.models.Scene || mongoose.model<ISceneDoc>('Scene', SceneSchema);
