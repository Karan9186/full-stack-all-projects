import bcrypt from 'bcryptjs';
import { connectToDatabase } from './mongodb';
import { User } from './models/User';
import { Workspace } from './models/Workspace';

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
    brandColor: '#5B5CE2',
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
    brandColor: '#4f46e5',
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

  // Seed default demo tours if none exist
  await seedDefaultDemos(acmeWorkspace._id.toString(), karanUser._id.toString());
}

export async function seedDefaultDemos(workspaceId: string, userId: string) {
  const { Demo } = await import('./models/Demo');
  const { DemoService } = await import('@/lib/services/demoService');

  const demoCount = await Demo.countDocuments({ workspaceId });
  if (demoCount > 0) return;

  console.log('[MongoDB] Seeding initial interactive demos into workspace...');

  // 1. Acme Analytics Interactive Tour
  const analyticsDemo = await DemoService.createDemo(workspaceId, userId, {
    name: 'Acme Analytics Interactive Tour',
    description: 'A 3-step interactive guided walkthrough of the Acme KPI dashboard and cohort retention reports.',
    type: 'walkthrough',
    initialImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
  });

  // Automatically publish it so public preview /d/[publicId] is ready out of the box
  await DemoService.publishDemo(workspaceId, analyticsDemo.demo.id, userId);

  // 2. Lead Flow CRM Walkthrough
  const crmDemo = await DemoService.createDemo(workspaceId, userId, {
    name: 'Lead Flow CRM Pipeline',
    description: 'Interactive experience showcasing deal pipeline stages, drag-and-drop actions, and deal closing analytics.',
    type: 'interactive',
    initialImageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80',
  });
  await DemoService.publishDemo(workspaceId, crmDemo.demo.id, userId);

  // 3. Customer Billing Portal
  await DemoService.createDemo(workspaceId, userId, {
    name: 'Customer Billing & Invoicing Flow',
    description: 'Self-serve onboarding walkthrough for workspace tier selection and enterprise invoice downloads.',
    type: 'onboarding',
    initialImageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80',
  });

  console.log('[MongoDB] Starter interactive demos seeded successfully!');
}
