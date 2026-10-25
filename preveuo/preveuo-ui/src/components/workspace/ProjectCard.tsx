import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DemoProject } from '@/types/demo';
import { Card, Badge, Button } from '@/components/ui';
import { Play, Eye, MoreVertical } from 'lucide-react';

interface ProjectCardProps {
  project: DemoProject;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Card hoverEffect className="group flex flex-col justify-between">
      <div>
        {/* Thumbnail Preview */}
        <div className="relative aspect-[16/10] overflow-hidden bg-dark">
          <Image
            src={project.thumbnail}
            alt={project.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
          />
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            <Badge variant="default" size="sm" className="bg-dark/80 text-white border-white/10 backdrop-blur-md">
              {project.category}
            </Badge>
          </div>

          <div className="absolute top-3 right-3 z-10">
            <Badge
              variant={project.status === 'published' ? 'success' : 'default'}
              size="sm"
              dot
            >
              {project.status === 'published' ? 'Published' : 'Draft'}
            </Badge>
          </div>

          <Link
            href={`/demo?id=${project.id}`}
            className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs z-10"
          >
            <div className="w-12 h-12 rounded-full bg-brand-purple text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </div>
          </Link>
        </div>

        {/* Project Content */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-1.5">
            <h3 className="font-bold text-[15px] sm:text-[16px] text-heading group-hover:text-brand-purple transition-colors line-clamp-1">
              {project.name}
            </h3>
            <button className="text-muted hover:text-heading p-1 rounded-lg">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[12.5px] text-body line-clamp-2 mb-4 leading-relaxed">
            {project.description}
          </p>

          <div className="grid grid-cols-3 gap-2 py-3 px-3.5 bg-light rounded-xl border border-border-light text-center">
            <div>
              <span className="block text-[11px] text-muted">Views</span>
              <span className="text-[13px] font-bold text-heading">{project.views.toLocaleString()}</span>
            </div>
            <div>
              <span className="block text-[11px] text-muted">Completion</span>
              <span className="text-[13px] font-bold text-emerald-600">{project.completionRate}%</span>
            </div>
            <div>
              <span className="block text-[11px] text-muted">Steps</span>
              <span className="text-[13px] font-bold text-heading">{project.stepsCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-5 pt-0 border-t border-border-light mt-auto flex items-center justify-between">
        <span className="text-[11.5px] text-muted">{project.createdAt}</span>
        <div className="flex items-center gap-2">
          <Link href={`/edit?id=${project.id}`}>
            <Button variant="ghost" size="sm">
              Edit
            </Button>
          </Link>
          <Link href={`/demo?id=${project.id}`}>
            <Button variant="outline" size="sm">
              Preview
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};
