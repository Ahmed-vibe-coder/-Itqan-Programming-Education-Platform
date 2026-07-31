export type UserRole = 'owner' | 'teacher' | 'student';

export interface Profile {
  id: string;
  full_name: string;
  username: string;
  avatar_url?: string;
  age?: number;
  created_at: string;
  updated_at: string;
}

export interface UserRoleRecord {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

export interface Invitation {
  id: string;
  code: string;
  group_id: string;
  created_by: string;
  max_uses: number;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Group {
  id: string;
  name: string;
  code: string;
  description?: string;
  is_active: boolean;
  leaderboard_enabled: boolean;
  created_at: string;
}

export interface Course {
  id: string;
  slug: string;
  title_ar: string;
  description_ar: string;
  subject: 'html' | 'css' | 'js';
  status: 'draft' | 'published' | 'archived';
  estimated_hours: number;
  order_index: number;
  created_at: string;
}

export interface Module {
  id: string;
  course_id: string;
  title_ar: string;
  description_ar: string;
  order_index: number;
  created_at: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  title_ar: string;
  slug: string;
  estimated_minutes: number;
  order_index: number;
  status: 'draft' | 'published' | 'archived';
  version: number;
  created_at: string;
}

export type BlockType =
  | 'rich_text'
  | 'heading'
  | 'analogy'
  | 'note'
  | 'tip'
  | 'warning'
  | 'steps'
  | 'code'
  | 'code_explanation'
  | 'live_playground'
  | 'practice'
  | 'common_mistakes'
  | 'vocabulary'
  | 'summary'
  | 'embedded_mastery';

export interface LessonBlock {
  id: string;
  lesson_id: string;
  block_type: BlockType;
  content: Record<string, any>;
  order_index: number;
}

export type ProgressState = 'locked' | 'available' | 'in_progress' | 'awaiting_mastery' | 'completed';

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  status: ProgressState;
  reading_progress: number;
  mastery_passed_at?: string;
  completed_at?: string;
  updated_at: string;
}

export type QuestionType =
  | 'single_choice'
  | 'multiple_choice'
  | 'true_false'
  | 'fill_blank'
  | 'short_answer'
  | 'essay'
  | 'code_output'
  | 'choose_code'
  | 'small_code_task';

export interface Question {
  id: string;
  type: QuestionType;
  prompt_ar: string;
  supporting_text_ar?: string;
  code_snippet?: string;
  options?: Array<{ id: string; text_ar: string; code?: string }>;
  correct_answer?: any; // Hidden from student queries
  explanation_ar?: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
  status: 'draft' | 'published';
}

export type AssessmentType = 'practice' | 'lesson_mastery' | 'module_quiz' | 'course_exam' | 'final_exam';

export interface Assessment {
  id: string;
  course_id?: string;
  module_id?: string;
  title_ar: string;
  type: AssessmentType;
  time_limit_minutes?: number;
  passing_score: number;
  is_published: boolean;
}

export interface AssessmentAttempt {
  id: string;
  assessment_id: string;
  user_id: string;
  status: 'in_progress' | 'submitted' | 'awaiting_manual_grading' | 'graded';
  score?: number;
  max_score?: number;
  started_at: string;
  submitted_at?: string;
  graded_at?: string;
}

export interface XPTransaction {
  id: string;
  user_id: string;
  points: number;
  event_type: string;
  source_id?: string;
  created_at: string;
}

export interface AchievementDefinition {
  id: string;
  code: string;
  title_ar: string;
  description_ar: string;
  badge_icon: string;
  xp_reward: number;
}

export interface StudentAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
}

export interface StudentStreak {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
}

export interface AppNotification {
  id: string;
  user_id: string;
  title_ar: string;
  body_ar: string;
  link_url?: string;
  is_read: boolean;
  created_at: string;
}
