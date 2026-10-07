import mongoose, { Schema, Document, Model } from 'mongoose';
import { DemoRuntimeSnapshot } from '@/types/demo';

export interface IPublishVersionDoc extends Document {
  demoId: mongoose.Types.ObjectId;
  workspaceId: mongoose.Types.ObjectId;
  publicId: string;
  version: number;
  snapshot: DemoRuntimeSnapshot;
  status: 'active' | 'superseded' | 'archived';
  publishedBy?: mongoose.Types.ObjectId;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PublishVersionSchema = new Schema<IPublishVersionDoc>(
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
    publicId: {
      type: String,
      required: [true, 'Public ID is required'],
      unique: true,
      index: true,
    },
    version: {
      type: Number,
      required: true,
      default: 1,
    },
    snapshot: {
      type: Schema.Types.Mixed,
      required: [true, 'Runtime snapshot is required'],
    },
    status: {
      type: String,
      enum: ['active', 'superseded', 'archived'],
      default: 'active',
    },
    publishedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
PublishVersionSchema.index({ demoId: 1, version: -1 });
PublishVersionSchema.index({ demoId: 1, status: 1 });

export const PublishVersion: Model<IPublishVersionDoc> =
  mongoose.models.PublishVersion ||
  mongoose.model<IPublishVersionDoc>('PublishVersion', PublishVersionSchema);
