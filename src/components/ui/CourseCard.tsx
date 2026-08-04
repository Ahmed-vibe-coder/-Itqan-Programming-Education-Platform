import React from 'react';
import { NavLink } from 'react-router-dom';
import { PlayCircle, Clock, BookOpen, Star, User, ChevronLeft } from 'lucide-react';
import { Badge } from './Badge';
import { Button } from './Button';

export interface CourseCardProps {
  id: string;
  slug: string;
  title: string;
  instructor: string;
  level: string;
  duration: string;
  lessonsCount: number;
  rating?: number;
  coverImage?: string;
  badge?: string;
  progress?: number; // 0 to 100
  variant?: 'catalog' | 'continue' | 'compact';
}

export const CourseCard: React.FC<CourseCardProps> = ({
  slug,
  title,
  instructor,
  level,
  duration,
  lessonsCount,
  rating = 4.9,
  coverImage,
  badge,
  progress,
  variant = 'catalog'
}) => {
  const defaultImage = "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80";
  const imageSrc = coverImage || defaultImage;

  if (variant === 'continue') {
    return (
      <div className="bg-card border border-bdr hover:border-orange-500/40 rounded-itqan-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-itqan-soft flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-44 h-28 rounded-xl overflow-hidden shrink-0 group">
          <img src={imageSrc} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <PlayCircle className="w-10 h-10 text-orange-500 drop-shadow-md" />
          </div>
        </div>
        <div className="flex-1 min-w-0 w-full flex flex-col justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="primary" size="sm">{level}</Badge>
              {badge && <Badge variant="warning" size="sm">{badge}</Badge>}
            </div>
            <h4 className="font-extrabold text-base text-txt-primary truncate hover:text-orange-500 transition-colors">
              {title}
            </h4>
            <p className="text-xs text-txt-muted flex items-center gap-1.5 mt-1">
              <User className="w-3.5 h-3.5 text-orange-500" />
              <span>{instructor}</span>
            </p>
          </div>

          {progress !== undefined && (
            <div className="space-y-1 mt-1">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-txt-muted">مستوى التقدم</span>
                <span className="text-orange-500 font-mono">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-surface-secondary rounded-full overflow-hidden border border-bdr-soft">
                <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>
        <div className="shrink-0 w-full md:w-auto">
          <NavLink to={`/app/courses/${slug}`}>
            <Button variant="primary" size="md" fullWidth rightIcon={<ChevronLeft className="w-4 h-4" />}>
              متابعة التعلم
            </Button>
          </NavLink>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-bdr rounded-itqan-card overflow-hidden hover:border-orange-500/40 hover:shadow-itqan-soft transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between group">
      <div>
        {/* Cover Image & Badges */}
        <div className="relative aspect-video w-full overflow-hidden bg-surface-secondary">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
          
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <Badge variant="primary" size="sm">{level}</Badge>
            {badge && <Badge variant="warning" size="sm">{badge}</Badge>}
          </div>

          <div className="absolute bottom-2.5 left-3 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono text-amber-400 font-bold">
            <Star className="w-3 h-3 fill-amber-400" />
            <span>{rating}</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3">
          <NavLink to={`/app/courses/${slug}`}>
            <h3 className="font-extrabold text-base text-txt-primary line-clamp-2 leading-snug group-hover:text-orange-500 transition-colors">
              {title}
            </h3>
          </NavLink>

          <p className="text-xs text-txt-muted flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-orange-500" />
            <span>{instructor}</span>
          </p>

          <div className="flex items-center justify-between text-xs text-txt-muted pt-2 border-t border-bdr-soft">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-txt-muted" />
              <span>{lessonsCount} درسًا</span>
            </span>
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-txt-muted" />
              <span>{duration}</span>
            </span>
          </div>

          {progress !== undefined && (
            <div className="space-y-1 pt-1">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-txt-muted">التقدم</span>
                <span className="text-orange-500 font-mono">{progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-surface-secondary rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Action */}
      <div className="p-4 pt-0">
        <NavLink to={`/app/courses/${slug}`} className="block">
          <Button variant="secondary" size="md" fullWidth rightIcon={<ChevronLeft className="w-4 h-4" />}>
            {progress !== undefined ? 'متابعة الكورس' : 'عرض التفاصيل'}
          </Button>
        </NavLink>
      </div>
    </div>
  );
};
