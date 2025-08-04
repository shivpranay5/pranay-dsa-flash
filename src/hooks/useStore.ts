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
  loadData: () => Promise<void>;
  resetData: () => Promise<void>;
  setSelectedTopic: (topic: Topic | null) => void;
  setSelectedProblem: (problem: Problem | null) => void;
  setSearchQuery: (query: string) => void;
  
  // Topic actions
  addTopic: (topic: Omit<Topic, 'id'>) => Promise<void>;
  deleteTopic: (topicId: string) => Promise<void>;
  updateTopic: (topicId: string, updates: Partial<Topic>) => Promise<void>;
  
  // Problem actions
  addProblem: (problem: Omit<Problem, 'id' | 'createdAt'>) => Promise<void>;
  deleteProblem: (problemId: string) => Promise<void>;
  updateProblem: (problemId: string, updates: Partial<Problem>) => Promise<void>;
  
  // Modal actions
  setShowAddTopicModal: (show: boolean) => void;
  setShowAddProblemModal: (show: boolean) => void;
  
  // Computed
  getFilteredTopics: () => Topic[];
  getProblemsByTopic: (topicId: string) => Problem[];
  getFilteredProblems: () => Problem[];
  
  // Topic Notes
  getTopicNotes: (topicId: string) => Promise<string>;
  saveTopicNotes: (topicId: string, notes: string) => Promise<void>;
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
  loadData: async () => {
    try {
      const topics = await storage.getTopics();
      const problems = await storage.getProblems();
      set({ topics, problems });
    } catch (error) {
      console.error('Error loading data:', error);
      // Set empty arrays if loading fails
      set({ topics: [], problems: [] });
    }
  },

  // Reset data to defaults
  resetData: async () => {
    try {
      await storage.clearAll();
      const topics = await storage.getTopics();
      const problems = await storage.getProblems();
      set({ topics, problems });
    } catch (error) {
      console.error('Error resetting data:', error);
    }
  },

  setSelectedTopic: (topic) => set({ selectedTopic: topic }),
  setSelectedProblem: (problem) => set({ selectedProblem: problem }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Topic actions
  addTopic: async (topicData) => {
    const newTopic: Topic = {
      ...topicData,
      id: `topic-${Date.now()}`,
    };
    try {
      const createdTopic = await storage.addTopic(newTopic);
      // Use the MongoDB response if available, otherwise use the local topic
      const topicToAdd = createdTopic._id ? { ...createdTopic, id: createdTopic._id } : newTopic;
      set((state) => ({ topics: [...state.topics, topicToAdd] }));
    } catch (error) {
      console.error('Error adding topic:', error);
    }
  },

  deleteTopic: async (topicId) => {
    try {
      await storage.deleteTopic(topicId);
      set((state) => ({
        topics: state.topics.filter(t => t.id !== topicId),
        problems: state.problems.filter(p => p.topicId !== topicId)
      }));
    } catch (error) {
      console.error('Error deleting topic:', error);
    }
  },

  updateTopic: async (topicId, updates) => {
    try {
      const topics = get().topics.map(t => 
        t.id === topicId ? { ...t, ...updates } : t
      );
      await storage.saveTopics(topics);
      set({ topics });
    } catch (error) {
      console.error('Error updating topic:', error);
    }
  },

  // Problem actions
  addProblem: async (problemData) => {
    const newProblem: Problem = {
      ...problemData,
      id: `problem-${Date.now()}`,
      createdAt: new Date(),
    };
    try {
      const createdProblem = await storage.addProblem(newProblem);
      // Use the MongoDB response if available, otherwise use the local problem
      const problemToAdd = createdProblem._id ? { ...createdProblem, id: createdProblem._id } : newProblem;
      set((state) => ({ problems: [...state.problems, problemToAdd] }));
    } catch (error) {
      console.error('Error adding problem:', error);
    }
  },

  deleteProblem: async (problemId) => {
    try {
      await storage.deleteProblem(problemId);
      set((state) => ({
        problems: state.problems.filter(p => p.id !== problemId)
      }));
    } catch (error) {
      console.error('Error deleting problem:', error);
    }
  },

  updateProblem: async (problemId, updates) => {
    try {
      await storage.updateProblem(problemId, updates);
      set((state) => ({
        problems: state.problems.map(p => 
          p.id === problemId ? { ...p, ...updates } : p
        )
      }));
    } catch (error) {
      console.error('Error updating problem:', error);
    }
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
  getTopicNotes: async (topicId) => {
    try {
      return await storage.getTopicNotes(topicId);
    } catch (error) {
      console.error('Error getting topic notes:', error);
      return '';
    }
  },

  saveTopicNotes: async (topicId, notes) => {
    try {
      await storage.saveTopicNotes(topicId, notes);
    } catch (error) {
      console.error('Error saving topic notes:', error);
    }
  }
}));
