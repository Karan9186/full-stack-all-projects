import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWorkspace extends Document {
  name: string;
  slug: string;
  teamSize: '1-10' | '11-50' | '51-200' | '201+';
  primaryGoal: 'sales' | 'marketing' | 'onboarding' | 'support';
  ownerId: mongoose.Types.ObjectId;
  brandColor?: string;
  customDomain?: string;
  whiteLabel?: boolean;
  plan: {
    name: 'free' | 'starter' | 'pro' | 'enterprise';
    status: 'active' | 'trialing' | 'canceled';
    seatsLimit: number;
    viewsLimit: number;
  };
  ssoSettings: {
    enabled: boolean;
    provider?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const WorkspaceSchema = new Schema<IWorkspace>(
  {
    name: {
      type: String,
      required: [true, 'Workspace name is required'],
      trim: true,
      maxlength: [100, 'Workspace name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Workspace slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase alphanumeric characters and hyphens'],
    },
    teamSize: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201+'],
      default: '11-50',
    },
    primaryGoal: {
      type: String,
      enum: ['sales', 'marketing', 'onboarding', 'support'],
      default: 'sales',
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false, // set upon user registration
    },
    brandColor: {
      type: String,
      default: '#5B5CE2',
    },
    customDomain: {
      type: String,
      trim: true,
      default: '',
    },
    whiteLabel: {
      type: Boolean,
      default: true,
    },
    plan: {
      name: {
        type: String,
        enum: ['free', 'starter', 'pro', 'enterprise'],
        default: 'pro',
      },
      status: {
        type: String,
        enum: ['active', 'trialing', 'canceled'],
        default: 'active',
      },
      seatsLimit: {
        type: Number,
        default: 10,
      },
      viewsLimit: {
        type: Number,
        default: 50000,
      },
    },
    ssoSettings: {
      enabled: {
        type: Boolean,
        default: true,
      },
      provider: {
        type: String,
        default: 'SAML / Okta',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Prevent recompilation in Next.js development hot reloading
export const Workspace: Model<IWorkspace> =
  mongoose.models.Workspace || mongoose.model<IWorkspace>('Workspace', WorkspaceSchema);
