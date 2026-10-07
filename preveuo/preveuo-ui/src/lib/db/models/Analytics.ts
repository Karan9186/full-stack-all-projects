import mongoose, { Schema, Document, Model } from 'mongoose';
import { DemoAnalyticsEventType } from '@/types/demo';

export interface IDemoSessionDoc extends Document {
  demoId: mongoose.Types.ObjectId;
  workspaceId: mongoose.Types.ObjectId;
  publishVersionId?: mongoose.Types.ObjectId;
  sessionId: string;
  visitorId?: string;
  device?: string;
  browser?: string;
  referrer?: string;
  startedAt: Date;
  lastActivityAt: Date;
  completedAt?: Date;
  isCompleted: boolean;
}

const DemoSessionSchema = new Schema<IDemoSessionDoc>(
  {
    demoId: {
      type: Schema.Types.ObjectId,
      ref: 'Demo',
      required: true,
      index: true,
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    publishVersionId: {
      type: Schema.Types.ObjectId,
      ref: 'PublishVersion',
      default: null,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    visitorId: {
      type: String,
      default: '',
    },
    device: {
      type: String,
      default: 'desktop',
    },
    browser: {
      type: String,
      default: 'Chrome',
    },
    referrer: {
      type: String,
      default: 'direct',
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    lastActivityAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

DemoSessionSchema.index({ demoId: 1, startedAt: -1 });
DemoSessionSchema.index({ workspaceId: 1, startedAt: -1 });

export const DemoSession: Model<IDemoSessionDoc> =
  mongoose.models.DemoSession || mongoose.model<IDemoSessionDoc>('DemoSession', DemoSessionSchema);

export interface IDemoEventDoc extends Document {
  demoId: mongoose.Types.ObjectId;
  workspaceId: mongoose.Types.ObjectId;
  publishVersionId?: mongoose.Types.ObjectId;
  sessionId: string;
  visitorId?: string;
  eventType: DemoAnalyticsEventType;
  sceneId?: string;
  stepId?: string;
  elementId?: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

const DemoEventSchema = new Schema<IDemoEventDoc>(
  {
    demoId: {
      type: Schema.Types.ObjectId,
      ref: 'Demo',
      required: true,
      index: true,
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    publishVersionId: {
      type: Schema.Types.ObjectId,
      ref: 'PublishVersion',
      default: null,
    },
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    visitorId: {
      type: String,
      default: '',
    },
    eventType: {
      type: String,
      enum: [
        'DEMO_VIEW',
        'SESSION_START',
        'STEP_VIEW',
        'STEP_COMPLETE',
        'ELEMENT_VIEW',
        'ELEMENT_CLICK',
        'INTERACTION_TRIGGER',
        'CTA_CLICK',
        'DEMO_COMPLETE',
        'DEMO_EXIT',
        'REPLAY',
      ],
      required: true,
    },
    sceneId: {
      type: String,
      default: null,
    },
    stepId: {
      type: String,
      default: null,
    },
    elementId: {
      type: String,
      default: null,
    },
    timestamp: {
      type: Date,
      default: Date.now,
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

DemoEventSchema.index({ demoId: 1, timestamp: -1 });
DemoEventSchema.index({ sessionId: 1, timestamp: 1 });
DemoEventSchema.index({ workspaceId: 1, eventType: 1 });

export const DemoEvent: Model<IDemoEventDoc> =
  mongoose.models.DemoEvent || mongoose.model<IDemoEventDoc>('DemoEvent', DemoEventSchema);
