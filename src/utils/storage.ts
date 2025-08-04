import { Topic, Problem } from '../types';

const TOPICS_KEY = 'dsa_topics';
const PROBLEMS_KEY = 'dsa_problems';
const TOPIC_NOTES_KEY = 'dsa_topic_notes';

export const storage = {
  // Topics
  getTopics: (): Topic[] => {
    try {
      const stored = localStorage.getItem(TOPICS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      // Return default topics if nothing stored
      return require('../data/topics.json');
    } catch (error) {
      console.error('Error loading topics:', error);
      return require('../data/topics.json');
    }
  },

  saveTopics: (topics: Topic[]): void => {
    try {
      localStorage.setItem(TOPICS_KEY, JSON.stringify(topics));
    } catch (error) {
      console.error('Error saving topics:', error);
    }
  },

  // Problems
  getProblems: (): Problem[] => {
    try {
      const stored = localStorage.getItem(PROBLEMS_KEY);
      if (stored) {
        return JSON.parse(stored).map((p: any) => ({
          ...p,
          createdAt: new Date(p.createdAt)
        }));
      }
      // Return default problems if nothing stored
      return require('../data/problems.json').map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt)
      }));
    } catch (error) {
      console.error('Error loading problems:', error);
      return require('../data/problems.json').map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt)
      }));
    }
  },

  saveProblems: (problems: Problem[]): void => {
    try {
      localStorage.setItem(PROBLEMS_KEY, JSON.stringify(problems));
    } catch (error) {
      console.error('Error saving problems:', error);
    }
  },

  // Helper functions
  addTopic: (topic: Topic): void => {
    const topics = storage.getTopics();
    topics.push(topic);
    storage.saveTopics(topics);
  },

  deleteTopic: (topicId: string): void => {
    const topics = storage.getTopics();
    const filteredTopics = topics.filter(t => t.id !== topicId);
    storage.saveTopics(filteredTopics);
  },

  addProblem: (problem: Problem): void => {
    const problems = storage.getProblems();
    problems.push(problem);
    storage.saveProblems(problems);
  },

  deleteProblem: (problemId: string): void => {
    const problems = storage.getProblems();
    const filteredProblems = problems.filter(p => p.id !== problemId);
    storage.saveProblems(filteredProblems);
  },

  updateProblem: (problemId: string, updates: Partial<Problem>): void => {
    const problems = storage.getProblems();
    const updatedProblems = problems.map(p => 
      p.id === problemId ? { ...p, ...updates } : p
    );
    storage.saveProblems(updatedProblems);
  },

  clearAll: (): void => {
    try {
      localStorage.removeItem(TOPICS_KEY);
      localStorage.removeItem(PROBLEMS_KEY);
      localStorage.removeItem(TOPIC_NOTES_KEY);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },

  // Topic Notes
  getTopicNotes: (topicId: string): string => {
    try {
      const stored = localStorage.getItem(TOPIC_NOTES_KEY);
      if (stored) {
        const notes = JSON.parse(stored);
        return notes[topicId] || '';
      }
      return '';
    } catch (error) {
      console.error('Error loading topic notes:', error);
      return '';
    }
  },

  saveTopicNotes: (topicId: string, notes: string): void => {
    try {
      const stored = localStorage.getItem(TOPIC_NOTES_KEY);
      const allNotes = stored ? JSON.parse(stored) : {};
      allNotes[topicId] = notes;
      localStorage.setItem(TOPIC_NOTES_KEY, JSON.stringify(allNotes));
    } catch (error) {
      console.error('Error saving topic notes:', error);
    }
  }
};
