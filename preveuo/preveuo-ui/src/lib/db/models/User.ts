import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserWorkspaceMembership {
  workspaceId: mongoose.Types.ObjectId;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  joinedAt: Date;
}

export interface IUser extends Document {
  fullName: string;
  email: string;
  passwordHash: string;
  avatarUrl?: string;
  workspaces: IUserWorkspaceMembership[];
  defaultWorkspaceId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const UserWorkspaceMembershipSchema = new Schema<IUserWorkspaceMembership>(
  {
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'editor', 'viewer'],
      default: 'editor',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    workspaces: [UserWorkspaceMembershipSchema],
    defaultWorkspaceId: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent recompilation in Next.js development hot reloading
export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
