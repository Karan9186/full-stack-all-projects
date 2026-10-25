import bcrypt from 'bcryptjs';
import { connectToDatabase } from './mongodb';
import { User } from './models/User';
import { Workspace } from './models/Workspace';
import { PRIMARY_COLOR } from '@/lib/constants/theme';

export async function ensureDefaultDataSeeded() {
  await connectToDatabase();

  const userCount = await User.countDocuments();
  if (userCount > 0) {
    return;
  }

  console.log('[MongoDB] Initializing database with default demo workspace & users...');

  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // 1. Create Acme Corporation Workspace
  const acmeWorkspace = await Workspace.create({
    name: 'Acme Corporation',
    slug: 'acme-corp',
    teamSize: '51-200',
    primaryGoal: 'sales',
    brandColor: PRIMARY_COLOR,
    customDomain: 'demos.acme.co',
    whiteLabel: true,
    plan: {
      name: 'pro',
      status: 'active',
      seatsLimit: 10,
      viewsLimit: 50000,
    },
    ssoSettings: {
      enabled: true,
      provider: 'Okta SAML 2.0',
    },
  });

  // 2. Create Karan Shah
  const karanUser = await User.create({
    fullName: 'Karan Shah',
    email: 'karan@acme.co',
    passwordHash: hashedPassword,
    avatarUrl: '',
    workspaces: [
      {
        workspaceId: acmeWorkspace._id,
        role: 'owner',
        joinedAt: new Date('2025-01-15'),
      },
    ],
    defaultWorkspaceId: acmeWorkspace._id,
  });

  acmeWorkspace.ownerId = karanUser._id as any;
  await acmeWorkspace.save();

  // 3. Create TechCloud Solutions Workspace
  const techCloudWorkspace = await Workspace.create({
    name: 'TechCloud Solutions',
    slug: 'techcloud',
    teamSize: '11-50',
    primaryGoal: 'onboarding',
    brandColor: PRIMARY_COLOR,
    customDomain: 'tours.techcloud.io',
    whiteLabel: false,
    plan: {
      name: 'starter',
      status: 'active',
      seatsLimit: 5,
      viewsLimit: 10000,
    },
    ssoSettings: {
      enabled: false,
    },
  });

  // 4. Create Sarah Jenkins
  const sarahUser = await User.create({
    fullName: 'Sarah Jenkins',
    email: 'sarah@company.com',
    passwordHash: hashedPassword,
    avatarUrl: '',
    workspaces: [
      {
        workspaceId: techCloudWorkspace._id,
        role: 'admin',
        joinedAt: new Date('2025-03-01'),
      },
    ],
    defaultWorkspaceId: techCloudWorkspace._id,
  });

  techCloudWorkspace.ownerId = sarahUser._id as any;
  await techCloudWorkspace.save();

  console.log('[MongoDB] Default workspaces and accounts seeded successfully!');
}

