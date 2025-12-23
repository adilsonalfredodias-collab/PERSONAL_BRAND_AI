
export type SocialNetwork = 'LinkedIn' | 'Instagram' | 'TikTok' | 'Facebook' | 'X (Twitter)' | 'Outra';
export type Objective = 'Autoridade' | 'Vendas de Serviço' | 'Conseguir Emprego' | 'Branding Pessoal' | 'Crescimento de Seguidores';
export type DailyTime = '30 minutos' | '1 hora' | '2 horas' | 'Mais de 2 horas';

export interface QuizData {
  objective: Objective;
  socialNetwork: SocialNetwork;
  dailyTime: DailyTime;
  niche: string;
  profileUrl: string;
  cvText: string;
  cvFileName?: string;
}

export interface ActionPlan {
  markdown: string;
}

export interface AppState {
  step: 'landing' | 'quiz' | 'processing' | 'result';
  quizData: QuizData;
  result: ActionPlan | null;
  error: string | null;
}
