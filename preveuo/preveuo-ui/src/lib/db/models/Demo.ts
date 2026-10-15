import mongoose, { Schema, Document, Model } from 'mongoose';
import { DemoType, DemoStatus, DemoSettings } from '@/types/demo';

export interface IDemoDoc extends Document {
  workspaceId: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  type: DemoType;
  status: DemoStatus;
  thumbnail?: string;
  coverImage?: string;
  publicId?: string;
  settings: DemoSettings;
  activeVersionId?: mongoose.Types.ObjectId;
  publishedVersionId?: mongoose.Types.ObjectId;
  scenesCount: number;
  stepsCount: number;
  viewsCount: number;
  completionsCount: number;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DemoSchema = new Schema<IDemoDoc>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: [true, 'Workspace ID is required'],
      index: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
    name: {
      type: String,
      required: [true, 'Demo name is required'],
      trim: true,
      maxlength: [140, 'Demo name cannot exceed 140 characters'],
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    type: {
      type: String,
      enum: ['interactive', 'walkthrough', 'presentation', 'onboarding'],
      default: 'walkthrough',
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
      index: true,
    },
    thumbnail: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    publicId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    settings: {
      type: Schema.Types.Mixed,
      default: () => ({
        theme: 'light',
        navigation: true,
        progressBar: true,
        autoplay: false,
        autoplayDelay: 3500,
        autoplayProgressionPolicy: 'auto',
        loop: false,
        showBranding: true,
        allowRestart: true,
        allowSkip: true,
        showCursor: true,
        showControls: true,
        responsive: true,
        background: '#0f0f1a',
        defaultTransition: 'fade',
        accentColor: '#5B5CE2',
        aspectRatio: '16:9',
        canonicalWidth: 1920,
        canonicalHeight: 1080,
      }),
    },
    activeVersionId: {
      type: Schema.Types.ObjectId,
      ref: 'PublishVersion',
      default: null,
    },
    publishedVersionId: {
      type: Schema.Types.ObjectId,
      ref: 'PublishVersion',
      default: null,
    },
    scenesCount: {
      type: Number,
      default: 1,
    },
    stepsCount: {
      type: Number,
      default: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    completionsCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for workspace multi-tenancy & efficient queries
DemoSchema.index({ workspaceId: 1, updatedAt: -1 });
DemoSchema.index({ workspaceId: 1, status: 1 });
DemoSchema.index({ workspaceId: 1, slug: 1 });

export const Demo: Model<IDemoDoc> =
  mongoose.models.Demo || mongoose.model<IDemoDoc>('Demo', DemoSchema);
