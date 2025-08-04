import { create } from 'zustand';
import { Topic, Problem } from '../types';
import { storage } from '../utils/storage';

interface DSAStore {
  // State
  topics: Topic[];
  problems: Problem[];
  selectedTopic: Topic | null;
  selectedProblem: Problem | null;
  searchQuery: string;
  showAddTopicModal: boolean;
  showAddProblemModal: boolean;

  // Actions
  loadData: () => void;
  resetData: () => void;
  setSelectedTopic: (topic: Topic | null) => void;
  setSelectedProblem: (problem: Problem | null) => void;
  setSearchQuery: (query: string) => void;
  
  // Topic actions
  addTopic: (topic: Omit<Topic, 'id'>) => void;
  deleteTopic: (topicId: string) => void;
  updateTopic: (topicId: string, updates: Partial<Topic>) => void;
  
  // Problem actions
  addProblem: (problem: Omit<Problem, 'id' | 'createdAt'>) => void;
  deleteProblem: (problemId: string) => void;
  updateProblem: (problemId: string, updates: Partial<Problem>) => void;
  
  // Modal actions
  setShowAddTopicModal: (show: boolean) => void;
  setShowAddProblemModal: (show: boolean) => void;
  
  // Computed
  getFilteredTopics: () => Topic[];
  getProblemsByTopic: (topicId: string) => Problem[];
  getFilteredProblems: () => Problem[];
  
  // Topic Notes
  getTopicNotes: (topicId: string) => string;
  saveTopicNotes: (topicId: string, notes: string) => void;
}

export const useStore = create<DSAStore>((set, get) => ({
  // Initial state
  topics: [],
  problems: [],
  selectedTopic: null,
  selectedProblem: null,
  searchQuery: '',
  showAddTopicModal: false,
  showAddProblemModal: false,

  // Load data from storage
  loadData: () => {
    const topics = storage.getTopics();
    const problems = storage.getProblems();
    set({ topics, problems });
  },

  // Reset data to defaults
  resetData: () => {
    storage.clearAll();
    const topics = storage.getTopics();
    const problems = storage.getProblems();
    set({ topics, problems });
  },

  setSelectedTopic: (topic) => set({ selectedTopic: topic }),
  setSelectedProblem: (problem) => set({ selectedProblem: problem }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Topic actions
  addTopic: (topicData) => {
    const newTopic: Topic = {
      ...topicData,
      id: `topic-${Date.now()}`,
    };
    storage.addTopic(newTopic);
    set((state) => ({ topics: [...state.topics, newTopic] }));
  },

  deleteTopic: (topicId) => {
    storage.deleteTopic(topicId);
    set((state) => ({
      topics: state.topics.filter(t => t.id !== topicId),
      problems: state.problems.filter(p => p.topicId !== topicId)
    }));
  },

  updateTopic: (topicId, updates) => {
    const topics = get().topics.map(t => 
      t.id === topicId ? { ...t, ...updates } : t
    );
    storage.saveTopics(topics);
    set({ topics });
  },

  // Problem actions
  addProblem: (problemData) => {
    const newProblem: Problem = {
      ...problemData,
      id: `problem-${Date.now()}`,
      createdAt: new Date(),
    };
    storage.addProblem(newProblem);
    set((state) => ({ problems: [...state.problems, newProblem] }));
  },

  deleteProblem: (problemId) => {
    storage.deleteProblem(problemId);
    set((state) => ({
      problems: state.problems.filter(p => p.id !== problemId)
    }));
  },

  updateProblem: (problemId, updates) => {
    storage.updateProblem(problemId, updates);
    set((state) => ({
      problems: state.problems.map(p => 
        p.id === problemId ? { ...p, ...updates } : p
      )
    }));
  },

  // Modal actions
  setShowAddTopicModal: (show) => set({ showAddTopicModal: show }),
  setShowAddProblemModal: (show) => set({ showAddProblemModal: show }),

  // Computed values
  getFilteredTopics: () => {
    const { topics, searchQuery } = get();
    if (!searchQuery) return topics;
    return topics.filter(topic =>
      topic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  },

  getProblemsByTopic: (topicId) => {
    const { problems } = get();
    return problems.filter(p => p.topicId === topicId);
  },

  getFilteredProblems: () => {
    const { problems, searchQuery } = get();
    if (!searchQuery) return problems;
    const query = searchQuery.toLowerCase();
    return problems.filter(problem =>
      problem.title.toLowerCase().includes(query) ||
      problem.solution.toLowerCase().includes(query) ||
      (problem.notes && problem.notes.toLowerCase().includes(query)) ||
      problem.tags.some(tag => tag.toLowerCase().includes(query))
    );
  },

  // Topic Notes
  getTopicNotes: (topicId) => {
    return storage.getTopicNotes(topicId);
  },

  saveTopicNotes: (topicId, notes) => {
    storage.saveTopicNotes(topicId, notes);
  }
}));
