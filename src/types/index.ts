export interface Topic {
  id: string;
  name: string;
  description: string;
  category: string;
  order: number;
  icon?: string;
}

export interface Problem {
  id: string;
  topicId: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  leetcodeUrl?: string;
  geeksforgeeksUrl?: string;
  solution: string;
  notes?: string;
  tags: string[];
  createdAt: Date;
  timeComplexity?: string;
  spaceComplexity?: string;
}


