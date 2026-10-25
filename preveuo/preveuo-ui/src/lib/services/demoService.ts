import { THEME_COLORS } from '@/lib/constants/theme';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Demo, IDemoDoc } from '@/lib/db/models/Demo';
import { Chapter } from '@/lib/db/models/Chapter';
import { Scene, ISceneDoc } from '@/lib/db/models/Scene';
import { Step, IStepDoc } from '@/lib/db/models/Step';
import { Element, IElementDoc } from '@/lib/db/models/Element';
import { Interaction, IInteractionDoc } from '@/lib/db/models/Interaction';
import { PublishVersion } from '@/lib/db/models/PublishVersion';
import { DemoSession, DemoEvent } from '@/lib/db/models/Analytics';
import {
  IDemo,
  IDemoChapter,
  IDemoScene,
  IDemoStep,
  IDemoElement,
  IDemoInteraction,
  FullDemoData,
  DemoRuntimeSnapshot,
  DemoAnalyticsEventType,
} from '@/types/demo';
import { PRIMARY_COLOR } from '@/lib/constants/theme';

function generateRandomSlug(base: string): string {
  const clean = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  return `${clean || 'demo'}-${randomSuffix}`;
}

function generatePublicId(): string {
  return 'prv_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36).slice(-4);
}

export class DemoService {
  /**
   * Retrieves list of demos strictly isolated by workspace.
   */
  static async getDemos(
    workspaceId: string,
    options: {
      search?: string;
      status?: string;
      type?: string;
      page?: number;
      limit?: number;
    } = {}
  ) {
    await connectToDatabase();

    const { search, status, type, page = 1, limit = 50 } = options;
    const filter: Record<string, unknown> = {
      workspaceId: new mongoose.Types.ObjectId(workspaceId),
    };

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (type && type !== 'all') {
      filter.type = type;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [demos, total] = await Promise.all([
      Demo.find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Demo.countDocuments(filter),
    ]);

    const formattedDemos: IDemo[] = await Promise.all(
      demos.map(async (d: any) => {
        // Resolve thumbnail from first step
        let thumb = '';
        const firstStep = await Step.findOne({ demoId: d._id }).sort({ order: 1 }).lean();
        if (firstStep && (firstStep as any).sceneId) {
          const stepScene = await Scene.findOne({ _id: (firstStep as any).sceneId }).lean();
          if (stepScene && (stepScene as any).sourceAssetUrl) {
            thumb = (stepScene as any).sourceAssetUrl;
          }
        }
        if (!thumb) {
          const firstScene = await Scene.findOne({ demoId: d._id, sourceAssetUrl: { $ne: '' } })
            .sort({ order: 1 })
            .lean();
          if (firstScene && (firstScene as any).sourceAssetUrl) {
            thumb = (firstScene as any).sourceAssetUrl;
          }
        }
        if (!thumb && d.thumbnail) {
          thumb = d.thumbnail;
        }

        if (thumb && thumb !== d.thumbnail) {
          Demo.updateOne({ _id: d._id }, { $set: { thumbnail: thumb } }).exec().catch(() => {});
        }

        return {
          id: d._id.toString(),
          _id: d._id.toString(),
          workspaceId: d.workspaceId.toString(),
          projectId: d.projectId?.toString(),
          name: d.name,
          slug: d.slug,
          description: d.description || '',
          type: d.type,
          status: d.status,
          thumbnail: thumb,
          coverImage: d.coverImage || '',
          publicId: d.publicId,
          settings: d.settings || {},
          activeVersionId: d.activeVersionId?.toString(),
          publishedVersionId: d.publishedVersionId?.toString(),
          scenesCount: d.scenesCount || 1,
          stepsCount: d.stepsCount || 0,
          viewsCount: d.viewsCount || 0,
          completionsCount: d.completionsCount || 0,
          createdAt: d.createdAt.toISOString(),
          updatedAt: d.updatedAt.toISOString(),
        };
      })
    );

    return {
      demos: formattedDemos,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Fetches full demo bundle including Scenes, Steps, Elements, and Interactions.
   */
  static async getDemoById(workspaceId: string, demoId: string): Promise<FullDemoData | null> {
    await connectToDatabase();

    if (!mongoose.Types.ObjectId.isValid(demoId)) {
      return null;
    }

    const demoDoc = await Demo.findOne({
      _id: new mongoose.Types.ObjectId(demoId),
      workspaceId: new mongoose.Types.ObjectId(workspaceId),
    }).lean();

    if (!demoDoc) {
      return null;
    }

    const d: any = demoDoc;
    const demo: IDemo = {
      id: d._id.toString(),
      _id: d._id.toString(),
      workspaceId: d.workspaceId.toString(),
      projectId: d.projectId?.toString(),
      name: d.name,
      slug: d.slug,
      description: d.description || '',
      type: d.type,
      status: d.status,
      thumbnail: d.thumbnail || '',
      coverImage: d.coverImage || '',
      publicId: d.publicId,
      settings: d.settings || {},
      activeVersionId: d.activeVersionId?.toString(),
      publishedVersionId: d.publishedVersionId?.toString(),
      scenesCount: d.scenesCount || 1,
      stepsCount: d.stepsCount || 0,
      viewsCount: d.viewsCount || 0,
      completionsCount: d.completionsCount || 0,
      createdAt: d.createdAt.toISOString(),
      updatedAt: d.updatedAt.toISOString(),
    };

    const [chapterDocs, sceneDocs, stepDocs, elementDocs, interactionDocs] = await Promise.all([
      Chapter.find({ demoId: d._id }).sort({ order: 1 }).lean(),
      Scene.find({ demoId: d._id }).sort({ order: 1 }).lean(),
      Step.find({ demoId: d._id }).sort({ order: 1 }).lean(),
      Element.find({ demoId: d._id }).sort({ order: 1 }).lean(),
      Interaction.find({ demoId: d._id }).lean(),
    ]);

    const firstStepDoc = stepDocs[0];
    let firstStepThumb = '';
    if (firstStepDoc && (firstStepDoc as any).sceneId) {
      const matchScene = sceneDocs.find(
        (s: any) => s._id.toString() === (firstStepDoc as any).sceneId.toString()
      );
      if (matchScene && (matchScene as any).sourceAssetUrl) {
        firstStepThumb = (matchScene as any).sourceAssetUrl;
      }
    }
    if (!firstStepThumb && sceneDocs.length > 0) {
      const firstWithAsset = sceneDocs.find((s: any) => s.sourceAssetUrl);
      if (firstWithAsset) {
        firstStepThumb = (firstWithAsset as any).sourceAssetUrl;
      }
    }
    if (firstStepThumb) {
      demo.thumbnail = firstStepThumb;
      if (d.thumbnail !== firstStepThumb) {
        Demo.updateOne({ _id: d._id }, { $set: { thumbnail: firstStepThumb } }).exec().catch(() => {});
      }
    }

    const chapters: IDemoChapter[] = chapterDocs.map((ch: any) => ({
      id: ch._id.toString(),
      _id: ch._id.toString(),
      demoId: ch.demoId.toString(),
      type: ch.type || 'default',
      title: ch.title,
      order: ch.order,
      description: ch.description,
      logo: ch.logo,
      cover: ch.cover,
      layout: ch.layout || 'center',
      theme: ch.theme || 'dark',
      opacity: ch.opacity ?? 24,
      blur: ch.blur ?? false,
      buttons: ch.buttons || [],
      createdAt: ch.createdAt ? ch.createdAt.toISOString() : undefined,
      updatedAt: ch.updatedAt ? ch.updatedAt.toISOString() : undefined,
    }));

    const scenes: IDemoScene[] = sceneDocs.map((s: any) => ({
      id: s._id.toString(),
      _id: s._id.toString(),
      demoId: s.demoId.toString(),
      name: s.name,
      slug: s.slug,
      order: s.order,
      sourceType: s.sourceType,
      sourceAssetUrl: s.sourceAssetUrl,
      viewport: s.viewport,
      background: s.background,
      metadata: s.metadata,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    }));

    const steps: IDemoStep[] = stepDocs.map((st: any) => ({
      id: st._id.toString(),
      _id: st._id.toString(),
      demoId: st.demoId.toString(),
      sceneId: st.sceneId.toString(),
      chapterId: st.chapterId ? st.chapterId.toString() : undefined,
      order: st.order,
      title: st.title,
      description: st.description,
      targetElementId: st.targetElementId,
      action: st.action,
      tooltip: st.tooltip,
      spotlight: st.spotlight,
      navigation: st.navigation,
      zoomPan: st.zoomPan || undefined,
      completion: st.completion,
      createdAt: st.createdAt.toISOString(),
      updatedAt: st.updatedAt.toISOString(),
    }));

    const elements: IDemoElement[] = elementDocs.map((el: any) => ({
      id: el._id.toString(),
      _id: el._id.toString(),
      demoId: el.demoId.toString(),
      sceneId: el.sceneId.toString(),
      stepId: el.stepId ? el.stepId.toString() : undefined,
      type: el.type,
      name: el.name,
      position: el.position,
      style: el.style,
      content: el.content,
      target: el.target,
      visible: el.visible,
      locked: el.locked,
      order: el.order,
      hotspotConfig: el.hotspotConfig,
      metadata: el.metadata,
      createdAt: el.createdAt.toISOString(),
      updatedAt: el.updatedAt.toISOString(),
    }));

    const interactions: IDemoInteraction[] = interactionDocs.map((it: any) => ({
      id: it._id.toString(),
      _id: it._id.toString(),
      demoId: it.demoId.toString(),
      sceneId: it.sceneId.toString(),
      elementId: it.elementId,
      trigger: it.trigger,
      conditions: it.conditions || [],
      actions: it.actions || [],
      enabled: it.enabled,
      createdAt: it.createdAt.toISOString(),
      updatedAt: it.updatedAt.toISOString(),
    }));

    return {
      demo,
      chapters,
      scenes,
      steps,
      elements,
      interactions,
    };
  }

  /**
   * Creates a new Demo with starter Scene, Step, Hotspot Element, and Interaction.
   */
  static async createDemo(
    workspaceId: string,
    userId: string,
    payload: {
      name: string;
      description?: string;
      type?: 'interactive' | 'walkthrough' | 'presentation' | 'onboarding';
      initialImageUrl?: string;
    }
  ): Promise<FullDemoData> {
    await connectToDatabase();

    const wId = new mongoose.Types.ObjectId(workspaceId);
    const uId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : null;
    const name = payload.name.trim() || 'Untitled Demo';
    const slug = generateRandomSlug(name);
    const publicId = generatePublicId();

    const hasInitialImage = Boolean(payload.initialImageUrl);

    const demoDoc = await Demo.create({
      workspaceId: wId,
      name,
      slug,
      description: payload.description || '',
      type: payload.type || 'walkthrough',
      status: 'draft',
      publicId,
      thumbnail: payload.initialImageUrl || '',
      scenesCount: hasInitialImage ? 1 : 0,
      stepsCount: hasInitialImage ? 1 : 0,
      createdBy: uId || undefined,
      updatedBy: uId || undefined,
      settings: {
        theme: 'light',
        navigation: true,
        progressBar: true,
        autoplay: false,
        autoplayDelay: 3500,
        showBranding: true,
        allowRestart: true,
        allowSkip: true,
        showCursor: true,
        showControls: true,
        responsive: true,
        background: THEME_COLORS.bgDark,
        defaultTransition: 'fade',
        accentColor: PRIMARY_COLOR,
      },
    });

    const demoId = (demoDoc as any)._id;

    // Only create starter scene and step if initialImageUrl was explicitly provided
    if (hasInitialImage) {
      const sceneDoc = await Scene.create({
        demoId,
        workspaceId: wId,
        name: 'Scene 1',
        slug: 'scene-1',
        order: 0,
        sourceType: 'screenshot',
        sourceAssetUrl: payload.initialImageUrl,
        viewport: { width: 1920, height: 1080, aspectRatio: '16:9' },
        background: THEME_COLORS.bgLight,
      });

      const stepDoc = await Step.create({
        demoId,
        workspaceId: wId,
        sceneId: sceneDoc._id,
        order: 0,
        title: 'Step 1',
        description: '',
        targetElementId: '',
        action: 'click',
        tooltip: {
          title: 'Step 1',
          description: '',
          position: 'bottom',
          badge: 'Step 1',
          buttonText: 'Next',
        },
        spotlight: {
          enabled: false,
          shape: 'rectangle',
          padding: 10,
          borderRadius: 12,
        },
        navigation: {
          canSkip: true,
          autoAdvance: false,
          delayMs: 3500,
        },
        completion: {
          type: 'click',
        },
      });
    }

    return (await this.getDemoById(workspaceId, demoId.toString()))!;
  }

  /**
   * Updates Demo details and persists synchronized scenes, steps, elements, and interactions.
   */
  static async updateDemo(
    workspaceId: string,
    demoId: string,
    payload: {
      name?: string;
      description?: string;
      thumbnail?: string;
      coverImage?: string;
      status?: 'draft' | 'published' | 'archived';
      type?: 'interactive' | 'walkthrough' | 'presentation' | 'onboarding';
      settings?: any;
      chapters?: IDemoChapter[];
      scenes?: IDemoScene[];
      steps?: IDemoStep[];
      elements?: IDemoElement[];
      interactions?: IDemoInteraction[];
    }
  ): Promise<FullDemoData | null> {
    await connectToDatabase();

    const wId = new mongoose.Types.ObjectId(workspaceId);
    const dId = new mongoose.Types.ObjectId(demoId);

    const demoDoc = await Demo.findOne({ _id: dId, workspaceId: wId });
    if (!demoDoc) return null;

    if (payload.name) demoDoc.name = payload.name.trim();
    if (payload.description !== undefined) demoDoc.description = payload.description;
    if (payload.thumbnail !== undefined) demoDoc.thumbnail = payload.thumbnail;
    if (payload.coverImage !== undefined) demoDoc.coverImage = payload.coverImage;
    if (payload.status) demoDoc.status = payload.status;
    if (payload.type) demoDoc.type = payload.type;
    if (payload.settings) {
      demoDoc.settings = {
        ...(demoDoc.settings || {}),
        ...payload.settings,
      };
      demoDoc.markModified('settings');
    }

    // Pre-calculate ID mappings to preserve relationships between scenes, chapters, steps, and elements
    const sceneIdMap = new Map<string, mongoose.Types.ObjectId>();
    if (payload.scenes) {
      payload.scenes.forEach((s) => {
        const sId = s.id || s._id;
        const assigned = (sId && mongoose.Types.ObjectId.isValid(sId))
          ? new mongoose.Types.ObjectId(sId)
          : new mongoose.Types.ObjectId();
        if (s.id) sceneIdMap.set(s.id, assigned);
        if (s._id) sceneIdMap.set(s._id, assigned);
      });
    }

    const chapterIdMap = new Map<string, mongoose.Types.ObjectId>();
    if (payload.chapters) {
      payload.chapters.forEach((ch) => {
        const assigned = mongoose.Types.ObjectId.isValid(ch.id)
          ? new mongoose.Types.ObjectId(ch.id)
          : new mongoose.Types.ObjectId();
        if (ch.id) chapterIdMap.set(ch.id, assigned);
        if (ch._id) chapterIdMap.set(ch._id, assigned);
      });
    }

    const stepIdMap = new Map<string, mongoose.Types.ObjectId>();
    if (payload.steps) {
      payload.steps.forEach((st) => {
        const assigned = mongoose.Types.ObjectId.isValid(st.id)
          ? new mongoose.Types.ObjectId(st.id)
          : new mongoose.Types.ObjectId();
        if (st.id) stepIdMap.set(st.id, assigned);
        if (st._id) stepIdMap.set(st._id, assigned);
      });
    }

    const elementIdMap = new Map<string, mongoose.Types.ObjectId>();
    if (payload.elements) {
      payload.elements.forEach((el) => {
        const assigned = mongoose.Types.ObjectId.isValid(el.id)
          ? new mongoose.Types.ObjectId(el.id)
          : new mongoose.Types.ObjectId();
        if (el.id) elementIdMap.set(el.id, assigned);
        if (el._id) elementIdMap.set(el._id, assigned);
      });
    }

    // Upsert or synchronize child entities if provided in full-state save
    if (payload.chapters) {
      await Chapter.deleteMany({ demoId: dId });
      if (payload.chapters.length > 0) {
        const newChapters = payload.chapters.map((ch, idx) => {
          const chId = ch.id || ch._id;
          return {
            _id: (chId && chapterIdMap.get(chId)) || new mongoose.Types.ObjectId(),
            demoId: dId,
            workspaceId: wId,
            type: ch.type || 'default',
            title: ch.title || `Chapter ${idx + 1}`,
            order: idx,
            description: ch.description || '',
            logo: ch.logo,
            cover: ch.cover,
            layout: ch.layout || 'center',
            theme: ch.theme || 'dark',
            opacity: ch.opacity ?? 24,
            blur: ch.blur ?? false,
            buttons: ch.buttons || [],
          };
        });
        await Chapter.insertMany(newChapters);
      }
    }

    let insertedScenes: any[] = [];
    if (payload.scenes && payload.scenes.length > 0) {
      demoDoc.scenesCount = payload.scenes.length;
      await Scene.deleteMany({ demoId: dId });
      const newScenes = payload.scenes.map((s, idx) => {
        const sId = s.id || s._id;
        return {
          _id: (sId && sceneIdMap.get(sId)) || new mongoose.Types.ObjectId(),
          demoId: dId,
          workspaceId: wId,
          name: s.name || `Scene ${idx + 1}`,
          slug: s.slug || `scene-${idx + 1}`,
          order: idx,
          sourceType: s.sourceType || 'screenshot',
          sourceAssetUrl: s.sourceAssetUrl || '',
          viewport: s.viewport || { width: 1920, height: 1080 },
          background: s.background || THEME_COLORS.bgLight,
          metadata: s.metadata || {},
        };
      });
      insertedScenes = await Scene.insertMany(newScenes);
      if (!demoDoc.thumbnail || demoDoc.thumbnail === '') {
        const firstImg = insertedScenes.find((s) => s.sourceAssetUrl && s.sourceType !== 'recording');
        demoDoc.thumbnail = firstImg?.sourceAssetUrl || insertedScenes[0]?.sourceAssetUrl || '';
      }
    }

    // Determine fallback scene ID to ensure steps and elements always have a valid scene reference
    let fallbackSceneId: mongoose.Types.ObjectId | null = null;
    if (insertedScenes.length > 0) {
      fallbackSceneId = insertedScenes[0]._id;
    } else {
      const existingScene = await Scene.findOne({ demoId: dId }).sort({ order: 1 });
      if (existingScene) {
        fallbackSceneId = existingScene._id;
      } else if (payload.steps && payload.steps.length > 0) {
        const defaultScene = await Scene.create({
          demoId: dId,
          workspaceId: wId,
          name: 'Scene 1',
          slug: 'scene-1',
          order: 0,
          sourceType: 'screenshot',
          sourceAssetUrl: '',
          viewport: { width: 1920, height: 1080 },
          background: THEME_COLORS.bgLight,
        });
        fallbackSceneId = defaultScene._id;
      }
    }

    if (payload.steps && payload.steps.length > 0) {
      demoDoc.stepsCount = payload.steps.length;
      await Step.deleteMany({ demoId: dId });
      const newSteps = payload.steps.map((st, idx) => {
        const targetElId = st.targetElementId
          ? elementIdMap.get(st.targetElementId)?.toString() || st.targetElementId
          : '';
        const mappedChapterId = st.chapterId
          ? chapterIdMap.get(st.chapterId) || (mongoose.Types.ObjectId.isValid(st.chapterId) ? new mongoose.Types.ObjectId(st.chapterId) : null)
          : null;
        const mappedSceneId = st.sceneId
          ? sceneIdMap.get(st.sceneId) || (mongoose.Types.ObjectId.isValid(st.sceneId) ? new mongoose.Types.ObjectId(st.sceneId) : null)
          : null;
        const finalSceneId = mappedSceneId || fallbackSceneId;
        const stId = st.id || st._id;

        return {
          _id: (stId && stepIdMap.get(stId)) || new mongoose.Types.ObjectId(),
          demoId: dId,
          workspaceId: wId,
          sceneId: finalSceneId,
          chapterId: mappedChapterId,
          order: idx,
          title: st.title || `Step ${idx + 1}`,
          description: st.description || '',
          targetElementId: targetElId,
          action: st.action || 'click',
          tooltip: st.tooltip || { title: 'Step', description: '', position: 'bottom' },
          spotlight: st.spotlight || { enabled: true },
          navigation: st.navigation || {},
          zoomPan: st.zoomPan || null,
          completion: st.completion || {},
        };
      });
      await Step.insertMany(newSteps);
    }

    if (payload.elements) {
      await Element.deleteMany({ demoId: dId });
      if (payload.elements.length > 0) {
        const newElements = payload.elements.map((el, idx) => {
          const mappedStepId = el.stepId
            ? stepIdMap.get(el.stepId) || (mongoose.Types.ObjectId.isValid(el.stepId) ? new mongoose.Types.ObjectId(el.stepId) : null)
            : null;
          const mappedSceneId = el.sceneId
            ? sceneIdMap.get(el.sceneId) || (mongoose.Types.ObjectId.isValid(el.sceneId) ? new mongoose.Types.ObjectId(el.sceneId) : null)
            : null;
          const finalSceneId = mappedSceneId || fallbackSceneId;
          const elId = el.id || el._id;

          return {
            _id: (elId && elementIdMap.get(elId)) || new mongoose.Types.ObjectId(),
            demoId: dId,
            workspaceId: wId,
            sceneId: finalSceneId,
            stepId: mappedStepId,
            type: el.type || 'hotspot',
            name: el.name || `Element ${idx + 1}`,
            position: el.position || { x: 50, y: 50, width: 36, height: 36 },
            style: el.style || {},
            content: el.content || '',
            target: el.target || '',
            visible: el.visible ?? true,
            locked: el.locked ?? false,
            order: idx,
            hotspotConfig: el.hotspotConfig || null,
            metadata: el.metadata || {},
          };
        });
        await Element.insertMany(newElements);
      }
    }

    if (payload.interactions) {
      await Interaction.deleteMany({ demoId: dId });
      if (payload.interactions.length > 0) {
        const newInteractions = payload.interactions.map((it) => {
          const mappedSceneId = it.sceneId
            ? sceneIdMap.get(it.sceneId) || (mongoose.Types.ObjectId.isValid(it.sceneId) ? new mongoose.Types.ObjectId(it.sceneId) : null)
            : null;
          return {
            _id: mongoose.Types.ObjectId.isValid(it.id) ? new mongoose.Types.ObjectId(it.id) : new mongoose.Types.ObjectId(),
            demoId: dId,
            workspaceId: wId,
            sceneId: mappedSceneId || fallbackSceneId,
            elementId: it.elementId ? (elementIdMap.get(it.elementId)?.toString() || it.elementId) : undefined,
            trigger: it.trigger || 'click',
            conditions: it.conditions || [],
            actions: it.actions || [],
            enabled: it.enabled ?? true,
          };
        });
        await Interaction.insertMany(newInteractions);
      }
    }

    // Ensure thumbnail is always the first step's scene image
    const firstStepDoc = await Step.findOne({ demoId: dId }).sort({ order: 1 }).lean();
    if (firstStepDoc && (firstStepDoc as any).sceneId) {
      const matchScene = await Scene.findOne({ _id: (firstStepDoc as any).sceneId }).lean();
      if (matchScene && (matchScene as any).sourceAssetUrl) {
        demoDoc.thumbnail = (matchScene as any).sourceAssetUrl;
      }
    } else if (!demoDoc.thumbnail) {
      const firstSceneDoc = await Scene.findOne({ demoId: dId, sourceAssetUrl: { $ne: '' } }).sort({ order: 1 }).lean();
      if (firstSceneDoc && (firstSceneDoc as any).sourceAssetUrl) {
        demoDoc.thumbnail = (firstSceneDoc as any).sourceAssetUrl;
      }
    }

    await demoDoc.save();
    return await this.getDemoById(workspaceId, demoId);
  }

  /**
   * Cascade-deletes a demo and all associated scenes, steps, elements, interactions, and publish records.
   */
  static async deleteDemo(workspaceId: string, demoId: string): Promise<boolean> {
    await connectToDatabase();

    const wId = new mongoose.Types.ObjectId(workspaceId);
    const dId = new mongoose.Types.ObjectId(demoId);

    const deleted = await Demo.findOneAndDelete({ _id: dId, workspaceId: wId });
    if (!deleted) return false;

    await Promise.all([
      Chapter.deleteMany({ demoId: dId }),
      Scene.deleteMany({ demoId: dId }),
      Step.deleteMany({ demoId: dId }),
      Element.deleteMany({ demoId: dId }),
      Interaction.deleteMany({ demoId: dId }),
      PublishVersion.deleteMany({ demoId: dId }),
      DemoEvent.deleteMany({ demoId: dId }),
      DemoSession.deleteMany({ demoId: dId }),
    ]);

    return true;
  }

  /**
   * Deep clones a demo with remapped IDs so that element references and scene relations remain intact.
   */
  static async duplicateDemo(
    workspaceId: string,
    demoId: string,
    userId: string
  ): Promise<FullDemoData | null> {
    const original = await this.getDemoById(workspaceId, demoId);
    if (!original) return null;

    const wId = new mongoose.Types.ObjectId(workspaceId);
    const uId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : null;
    const newName = `${original.demo.name} (Copy)`;
    const newSlug = generateRandomSlug(newName);
    const newPublicId = generatePublicId();

    const duplicatedDemoDoc = await Demo.create({
      workspaceId: wId,
      name: newName,
      slug: newSlug,
      description: original.demo.description,
      type: original.demo.type,
      status: 'draft',
      publicId: newPublicId,
      thumbnail: original.demo.thumbnail,
      coverImage: original.demo.coverImage,
      settings: original.demo.settings,
      scenesCount: original.scenes.length,
      stepsCount: original.steps.length,
      createdBy: uId || undefined,
      updatedBy: uId || undefined,
    });

    const newDemoId = (duplicatedDemoDoc as any)._id;

    // ID Remapping dictionaries: oldId -> newId
    const sceneIdMap = new Map<string, string>();
    const elementIdMap = new Map<string, string>();
    const chapterIdMap = new Map<string, string>();
    const stepIdMap = new Map<string, string>();

    // Duplicate Chapters
    if (original.chapters && original.chapters.length > 0) {
      await Promise.all(
        original.chapters.map(async (ch) => {
          const newChapter: any = await Chapter.create({
            demoId: newDemoId,
            workspaceId: wId,
            type: ch.type || 'default',
            title: ch.title,
            order: ch.order,
            description: ch.description,
            logo: ch.logo
              ? {
                  visible: ch.logo.visible ?? true,
                  assetUrl: ch.logo.assetUrl || undefined,
                  assetId: ch.logo.assetId || undefined,
                  altText: ch.logo.altText || undefined,
                }
              : undefined,
            cover: ch.cover
              ? {
                  type: ch.cover.type || 'none',
                  assetUrl: ch.cover.assetUrl || undefined,
                  assetId: ch.cover.assetId || undefined,
                  stepId: ch.cover.stepId || undefined,
                }
              : undefined,
            layout: ch.layout || 'center',
            theme: ch.theme || 'dark',
            opacity: ch.opacity ?? 24,
            blur: ch.blur ?? false,
            buttons: (ch.buttons || []).map((b) => ({
              ...b,
              id: `btn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            })),
          });
          chapterIdMap.set(ch.id, newChapter._id.toString());
        })
      );
    }

    // Duplicate Scenes
    const duplicatedScenes = await Promise.all(
      original.scenes.map(async (s) => {
        const newScene = await Scene.create({
          demoId: newDemoId,
          workspaceId: wId,
          name: s.name,
          slug: s.slug,
          order: s.order,
          sourceType: s.sourceType,
          sourceAssetUrl: s.sourceAssetUrl,
          viewport: s.viewport,
          background: s.background,
          metadata: s.metadata,
        });
        sceneIdMap.set(s.id, newScene._id.toString());
        return newScene;
      })
    );

    // Duplicate Steps (remap sceneId and chapterId)
    await Promise.all(
      original.steps.map(async (st) => {
        const targetSceneId = sceneIdMap.get(st.sceneId) || duplicatedScenes[0]._id.toString();
        const remappedChapterId = st.chapterId ? chapterIdMap.get(st.chapterId) : undefined;

        const newStep = await Step.create({
          demoId: newDemoId,
          workspaceId: wId,
          sceneId: new mongoose.Types.ObjectId(targetSceneId),
          chapterId: remappedChapterId ? new mongoose.Types.ObjectId(remappedChapterId) : undefined,
          order: st.order,
          title: st.title,
          description: st.description,
          targetElementId: st.targetElementId,
          action: st.action,
          tooltip: st.tooltip,
          spotlight: st.spotlight,
          navigation: st.navigation,
          zoomPan: st.zoomPan || null,
          completion: st.completion,
        });
        stepIdMap.set(st.id, newStep._id.toString());
        return newStep;
      })
    );

    // Duplicate Elements (remap sceneId and stepId, preserve hotspotConfig)
    await Promise.all(
      original.elements.map(async (el) => {
        const targetSceneId = sceneIdMap.get(el.sceneId) || duplicatedScenes[0]._id.toString();
        const remappedStepId = el.stepId ? stepIdMap.get(el.stepId) : undefined;

        const newElement = await Element.create({
          demoId: newDemoId,
          workspaceId: wId,
          sceneId: new mongoose.Types.ObjectId(targetSceneId),
          stepId: remappedStepId ? new mongoose.Types.ObjectId(remappedStepId) : undefined,
          type: el.type,
          name: el.name,
          position: el.position,
          style: el.style,
          content: el.content,
          target: el.target,
          visible: el.visible,
          locked: el.locked,
          order: el.order,
          hotspotConfig: (el.hotspotConfig as any) || null,
          metadata: el.metadata,
        });
        elementIdMap.set(el.id, (newElement as any)._id.toString());
        return newElement;
      })
    );

    // Re-link Steps to remapped targetElementId if needed
    await Promise.all(
      original.steps.map(async (st) => {
        const newStepId = stepIdMap.get(st.id);
        if (newStepId && st.targetElementId) {
          const remappedTarget = elementIdMap.get(st.targetElementId);
          if (remappedTarget) {
            await Step.findByIdAndUpdate(newStepId, { targetElementId: remappedTarget });
          }
        }
      })
    );

    // Duplicate Interactions
    await Promise.all(
      original.interactions.map(async (it) => {
        const targetSceneId = sceneIdMap.get(it.sceneId) || duplicatedScenes[0]._id.toString();
        const remappedElementId = it.elementId ? elementIdMap.get(it.elementId) || it.elementId : undefined;

        return await Interaction.create({
          demoId: newDemoId,
          workspaceId: wId,
          sceneId: new mongoose.Types.ObjectId(targetSceneId),
          elementId: remappedElementId,
          trigger: it.trigger,
          conditions: it.conditions,
          actions: it.actions,
          enabled: it.enabled,
        });
      })
    );

    return await this.getDemoById(workspaceId, newDemoId.toString());
  }

  /**
   * Publishes a demo, creating an immutable PublishVersion snapshot for instant 1-query public playback.
   */
  static async publishDemo(
    workspaceId: string,
    demoId: string,
    userId?: string
  ): Promise<{
    versionNumber: number;
    publicId: string;
    publicUrl: string;
  } | null> {
    await connectToDatabase();

    const fullDemo = await this.getDemoById(workspaceId, demoId);
    if (!fullDemo) return null;

    // Validate navigation targets & configurations before publishing
    const existingStepIds = new Set(fullDemo.steps.map((s) => s.id));
    const existingChapterIds = new Set((fullDemo.chapters || []).map((c) => c.id));

    if (fullDemo.chapters && fullDemo.chapters.length > 0) {
      for (const ch of fullDemo.chapters) {
        if (ch.buttons && ch.buttons.length > 0) {
          for (const btn of ch.buttons) {
            if (btn.action?.type === 'go_to_step' && btn.action.targetId) {
              if (!existingStepIds.has(btn.action.targetId)) {
                throw new Error(
                  `Chapter "${ch.title || 'Untitled'}" has a button pointing to a deleted or non-existent Step.`
                );
              }
            }
            if (btn.action?.type === 'go_to_chapter' && btn.action.targetId) {
              if (!existingChapterIds.has(btn.action.targetId)) {
                throw new Error(
                  `Chapter "${ch.title || 'Untitled'}" has a button pointing to a deleted or non-existent Chapter.`
                );
              }
            }
            if (btn.action?.type === 'external_url' && btn.action.url) {
              const url = btn.action.url.trim().toLowerCase();
              if (!url.startsWith('http://') && !url.startsWith('https://')) {
                throw new Error(
                  `Chapter "${ch.title || 'Untitled'}" has an invalid external URL (must begin with http:// or https://).`
                );
              }
            }
          }
        }
      }
    }

    // Validate hotspots pointing to chapters
    for (const el of fullDemo.elements) {
      const nextBtn = el.hotspotConfig?.navigation?.nextButton;
      if (nextBtn?.action === 'goToChapter' && nextBtn.target) {
        if (!existingChapterIds.has(nextBtn.target)) {
          throw new Error(
            `Hotspot "${el.name || 'Untitled'}" points to a deleted or non-existent Chapter.`
          );
        }
      }
      const backBtn = el.hotspotConfig?.navigation?.backButton;
      if (backBtn?.action === 'goToChapter' && backBtn.target) {
        if (!existingChapterIds.has(backBtn.target)) {
          throw new Error(
            `Hotspot "${el.name || 'Untitled'}" back button points to a deleted or non-existent Chapter.`
          );
        }
      }
    }

    const dId = new mongoose.Types.ObjectId(demoId);
    const wId = new mongoose.Types.ObjectId(workspaceId);
    const uId = userId && mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : null;

    // Get previous active version count
    const versionCount = await PublishVersion.countDocuments({ demoId: dId });
    const versionNumber = versionCount + 1;
    const publicId = fullDemo.demo.publicId || generatePublicId();

    const snapshot: DemoRuntimeSnapshot = {
      demo: {
        id: fullDemo.demo.id,
        name: fullDemo.demo.name,
        description: fullDemo.demo.description,
        type: fullDemo.demo.type,
        settings: fullDemo.demo.settings,
        publicId,
      },
      chapters: fullDemo.chapters,
      scenes: fullDemo.scenes,
      steps: fullDemo.steps,
      elements: fullDemo.elements,
      interactions: fullDemo.interactions,
      publishedAt: new Date().toISOString(),
    };

    // Supersede previous active versions
    await PublishVersion.updateMany({ demoId: dId, status: 'active' }, { status: 'superseded' });

    // Create new published snapshot version
    const versionDoc = await PublishVersion.create({
      demoId: dId,
      workspaceId: wId,
      publicId,
      version: versionNumber,
      snapshot,
      status: 'active',
      publishedBy: uId || undefined,
      publishedAt: new Date(),
    });

    // Mark Demo as published with version pointer
    await Demo.findByIdAndUpdate(dId, {
      status: 'published',
      publicId,
      publishedVersionId: (versionDoc as any)._id,
      activeVersionId: (versionDoc as any)._id,
    });

    return {
      versionNumber,
      publicId,
      publicUrl: `/d/${publicId}`,
    };
  }

  /**
   * Public runtime access: Serves the published immutable snapshot without revealing internal workspace/user IDs.
   */
  static async getPublicDemo(publicId: string): Promise<DemoRuntimeSnapshot | null> {
    await connectToDatabase();

    // Check if demo exists directly by publicId (serves live up-to-date data for instant preview and share)
    const demoDoc = await Demo.findOne({ publicId }).lean();
    if (demoDoc) {
      const fullData = await this.getDemoById(demoDoc.workspaceId.toString(), demoDoc._id.toString());
      if (fullData) {
        return {
          demo: {
            id: fullData.demo.id,
            name: fullData.demo.name,
            description: fullData.demo.description,
            type: fullData.demo.type,
            settings: fullData.demo.settings,
            publicId,
          },
          chapters: fullData.chapters,
          scenes: fullData.scenes,
          steps: fullData.steps,
          elements: fullData.elements,
          interactions: fullData.interactions,
          publishedAt: fullData.demo.updatedAt || new Date().toISOString(),
        };
      }
    }

    // Fallback: check immutable PublishVersion snapshot
    const versionDoc = await PublishVersion.findOne({
      publicId,
      status: 'active',
    })
      .sort({ version: -1 })
      .lean();

    if (versionDoc) {
      return (versionDoc as any).snapshot as DemoRuntimeSnapshot;
    }

    return null;
  }

  /**
   * Records lightweight analytics events and maintains engagement metrics.
   */
  static async recordAnalyticsEvent(payload: {
    publicId: string;
    sessionId: string;
    eventType: DemoAnalyticsEventType;
    visitorId?: string;
    sceneId?: string;
    stepId?: string;
    elementId?: string;
    device?: string;
    browser?: string;
    referrer?: string;
    metadata?: Record<string, unknown>;
  }) {
    await connectToDatabase();

    const demoDoc = await Demo.findOne({ publicId: payload.publicId });
    if (!demoDoc) return;

    const demoId = demoDoc._id;
    const workspaceId = demoDoc.workspaceId;

    // Record Event
    await DemoEvent.create({
      demoId,
      workspaceId,
      sessionId: payload.sessionId,
      visitorId: payload.visitorId || '',
      eventType: payload.eventType,
      sceneId: payload.sceneId,
      stepId: payload.stepId,
      elementId: payload.elementId,
      timestamp: new Date(),
      metadata: payload.metadata || {},
    });

    // Update Session
    if (payload.eventType === 'SESSION_START' || payload.eventType === 'DEMO_VIEW') {
      await DemoSession.findOneAndUpdate(
        { sessionId: payload.sessionId },
        {
          $setOnInsert: {
            demoId,
            workspaceId,
            sessionId: payload.sessionId,
            visitorId: payload.visitorId,
            device: payload.device || 'desktop',
            browser: payload.browser || 'Chrome',
            referrer: payload.referrer || 'direct',
            startedAt: new Date(),
          },
          $set: { lastActivityAt: new Date() },
        },
        { upsert: true }
      );
      await Demo.findByIdAndUpdate(demoId, { $inc: { viewsCount: 1 } });
    } else if (payload.eventType === 'DEMO_COMPLETE') {
      await DemoSession.findOneAndUpdate(
        { sessionId: payload.sessionId },
        {
          $set: {
            isCompleted: true,
            completedAt: new Date(),
            lastActivityAt: new Date(),
          },
        }
      );
      await Demo.findByIdAndUpdate(demoId, { $inc: { completionsCount: 1 } });
    } else {
      await DemoSession.findOneAndUpdate(
        { sessionId: payload.sessionId },
        { $set: { lastActivityAt: new Date() } }
      );
    }
  }

  /**
   * Aggregates live analytics for a demo.
   */
  static async getDemoAnalytics(workspaceId: string, demoId: string) {
    await connectToDatabase();

    const dId = new mongoose.Types.ObjectId(demoId);
    const wId = new mongoose.Types.ObjectId(workspaceId);

    const demo = await Demo.findOne({ _id: dId, workspaceId: wId });
    if (!demo) return null;

    const [totalSessions, completedSessions, events] = await Promise.all([
      DemoSession.countDocuments({ demoId: dId }),
      DemoSession.countDocuments({ demoId: dId, isCompleted: true }),
      DemoEvent.find({ demoId: dId }).sort({ timestamp: -1 }).limit(100).lean(),
    ]);

    const completionRate =
      totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;

    return {
      views: demo.viewsCount || totalSessions,
      completions: demo.completionsCount || completedSessions,
      completionRate,
      recentEvents: events.map((ev: any) => ({
        eventType: ev.eventType,
        sessionId: ev.sessionId,
        stepId: ev.stepId,
        timestamp: ev.timestamp.toISOString(),
      })),
    };
  }
}
