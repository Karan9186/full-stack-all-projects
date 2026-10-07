import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IChapterDoc extends Document {
  demoId: mongoose.Types.ObjectId;
  workspaceId: mongoose.Types.ObjectId;
  type: string;
  title: string;
  order: number;
  description?: string;
  logo?: {
    visible: boolean;
    assetUrl?: string;
    assetId?: string;
    altText?: string;
  };
  cover?: {
    type: string;
    assetUrl?: string;
    assetId?: string;
    stepId?: string;
  };
  layout?: string;
  theme?: string;
  opacity?: number;
  blur?: boolean;
  buttons?: Array<{
    id: string;
    label: string;
    action: {
      type: string;
      targetId?: string;
      url?: string;
    };
    style: string;
    visible: boolean;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const ChapterSchema = new Schema<IChapterDoc>(
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
    type: {
      type: String,
      enum: ['default', 'form', 'embed', 'password'],
      default: 'default',
    },
    title: {
      type: String,
      required: [true, 'Chapter title is required'],
      trim: true,
      default: 'Chapter title',
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    logo: {
      visible: { type: Boolean, default: true },
      assetUrl: { type: String, default: '' },
      assetId: { type: String, default: null },
      altText: { type: String, default: 'Logo' },
    },
    cover: {
      type: {
        type: String,
        enum: ['none', 'steps', 'custom'],
        default: 'none',
      },
      assetUrl: { type: String, default: null },
      assetId: { type: String, default: null },
      stepId: { type: String, default: null },
    },
    layout: {
      type: String,
      enum: ['left', 'center', 'right'],
      default: 'center',
    },
    theme: {
      type: String,
      enum: ['dark', 'light', 'custom'],
      default: 'dark',
    },
    opacity: {
      type: Number,
      default: 24,
      min: 0,
      max: 100,
    },
    blur: {
      type: Boolean,
      default: false,
    },
    buttons: [
      {
        id: { type: String, required: true },
        label: { type: String, default: 'Continue' },
        action: {
          type: {
            type: String,
            enum: ['next', 'previous', 'go_to_step', 'go_to_chapter', 'external_url'],
            default: 'next',
          },
          targetId: { type: String, default: null },
          url: { type: String, default: null },
        },
        style: {
          type: String,
          enum: ['primary', 'secondary', 'outline'],
          default: 'primary',
        },
        visible: { type: Boolean, default: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

ChapterSchema.index({ demoId: 1, order: 1 });
ChapterSchema.index({ workspaceId: 1, demoId: 1 });

export const Chapter: Model<IChapterDoc> =
  mongoose.models.Chapter || mongoose.model<IChapterDoc>('Chapter', ChapterSchema);
