import { Topic, Problem } from '../types';
import { topicsAPI, problemsAPI, topicNotesAPI } from './api';

// Fallback to localStorage if API fails
const TOPICS_KEY = 'dsa_topics';
const PROBLEMS_KEY = 'dsa_problems';
const TOPIC_NOTES_KEY = 'dsa_topic_notes';

// Helper function to get localStorage data as fallback
const getLocalStorageData = (key: string, defaultValue: any) => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
    return defaultValue;
  } catch (error) {
    console.error(`Error loading from localStorage (${key}):`, error);
    return defaultValue;
  }
};

// Helper function to save to localStorage as backup
const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
  }
};

export const storage = {
  // Topics
  getTopics: async (): Promise<Topic[]> => {
    try {
      const topics = await topicsAPI.getAll();
      // Save to localStorage as backup
      saveToLocalStorage(TOPICS_KEY, topics);
      return topics;
    } catch (error) {
      console.error('Error loading topics from API, using localStorage:', error);
      // Fallback to localStorage
      const localTopics = getLocalStorageData(TOPICS_KEY, require('../data/topics.json'));
      return localTopics;
    }
  },

  saveTopics: async (topics: Topic[]): Promise<void> => {
    try {
      // Save to localStorage as backup
      saveToLocalStorage(TOPICS_KEY, topics);
    } catch (error) {
      console.error('Error saving topics to localStorage:', error);
    }
  },

  // Problems
  getProblems: async (): Promise<Problem[]> => {
    try {
      const problems = await problemsAPI.getAll();
      // Convert dates
      const problemsWithDates = problems.map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt)
      }));
      // Save to localStorage as backup
      saveToLocalStorage(PROBLEMS_KEY, problemsWithDates);
      return problemsWithDates;
    } catch (error) {
      console.error('Error loading problems from API, using localStorage:', error);
      // Fallback to localStorage
      const localProblems = getLocalStorageData(PROBLEMS_KEY, require('../data/problems.json'));
      return localProblems.map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt)
      }));
    }
  },

  saveProblems: async (problems: Problem[]): Promise<void> => {
    try {
      // Save to localStorage as backup
      saveToLocalStorage(PROBLEMS_KEY, problems);
    } catch (error) {
      console.error('Error saving problems to localStorage:', error);
    }
  },

  // Helper functions
  addTopic: async (topic: Topic): Promise<any> => {
    try {
      // Remove the id field before sending to API (MongoDB will generate _id)
      const { id, ...topicWithoutId } = topic;
      const createdTopic = await topicsAPI.create(topicWithoutId);
      console.log('Topic added successfully to MongoDB');
      return createdTopic;
    } catch (error) {
      console.error('Error adding topic to API:', error);
      // Fallback to localStorage
      const topics = getLocalStorageData(TOPICS_KEY, []);
      topics.push(topic);
      saveToLocalStorage(TOPICS_KEY, topics);
      return topic;
    }
  },

  deleteTopic: async (topicId: string): Promise<void> => {
    try {
      await topicsAPI.delete(topicId);
      console.log('Topic deleted successfully from MongoDB');
    } catch (error) {
      console.error('Error deleting topic from API:', error);
      // Fallback to localStorage
      const topics = getLocalStorageData(TOPICS_KEY, []);
      const filteredTopics = topics.filter((t: Topic) => t.id !== topicId);
      saveToLocalStorage(TOPICS_KEY, filteredTopics);
    }
  },

  addProblem: async (problem: Problem): Promise<any> => {
    try {
      // Remove the id field before sending to API (MongoDB will generate _id)
      const { id, ...problemWithoutId } = problem;
      const createdProblem = await problemsAPI.create(problemWithoutId);
      console.log('Problem added successfully to MongoDB');
      return createdProblem;
    } catch (error) {
      console.error('Error adding problem to API:', error);
      // Fallback to localStorage
      const problems = getLocalStorageData(PROBLEMS_KEY, []);
      problems.push(problem);
      saveToLocalStorage(PROBLEMS_KEY, problems);
      return problem;
    }
  },

  deleteProblem: async (problemId: string): Promise<void> => {
    try {
      await problemsAPI.delete(problemId);
      console.log('Problem deleted successfully from MongoDB');
    } catch (error) {
      console.error('Error deleting problem from API:', error);
      // Fallback to localStorage
      const problems = getLocalStorageData(PROBLEMS_KEY, []);
      const filteredProblems = problems.filter((p: Problem) => p.id !== problemId);
      saveToLocalStorage(PROBLEMS_KEY, filteredProblems);
    }
  },

  updateProblem: async (problemId: string, updates: Partial<Problem>): Promise<void> => {
    try {
      await problemsAPI.update(problemId, updates);
      console.log('Problem updated successfully in MongoDB');
    } catch (error) {
      console.error('Error updating problem in API:', error);
      // Fallback to localStorage
      const problems = getLocalStorageData(PROBLEMS_KEY, []);
      const updatedProblems = problems.map((p: Problem) => 
        p.id === problemId ? { ...p, ...updates } : p
      );
      saveToLocalStorage(PROBLEMS_KEY, updatedProblems);
    }
  },

  clearAll: async (): Promise<void> => {
    try {
      localStorage.removeItem(TOPICS_KEY);
      localStorage.removeItem(PROBLEMS_KEY);
      localStorage.removeItem(TOPIC_NOTES_KEY);
      console.log('Local storage cleared');
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },

  // Topic Notes
  getTopicNotes: async (topicId: string): Promise<string> => {
    try {
      const response = await topicNotesAPI.get(topicId);
      const notes = response.notes || '';
      // Save to localStorage as backup
      const allNotes = getLocalStorageData(TOPIC_NOTES_KEY, {});
      allNotes[topicId] = notes;
      saveToLocalStorage(TOPIC_NOTES_KEY, allNotes);
      return notes;
    } catch (error) {
      console.error('Error loading topic notes from API, using localStorage:', error);
      // Fallback to localStorage
      const allNotes = getLocalStorageData(TOPIC_NOTES_KEY, {});
      return allNotes[topicId] || '';
    }
  },

  saveTopicNotes: async (topicId: string, notes: string): Promise<void> => {
    try {
      await topicNotesAPI.save(topicId, notes);
      console.log('Topic notes saved successfully to MongoDB');
      // Save to localStorage as backup
      const allNotes = getLocalStorageData(TOPIC_NOTES_KEY, {});
      allNotes[topicId] = notes;
      saveToLocalStorage(TOPIC_NOTES_KEY, allNotes);
    } catch (error) {
      console.error('Error saving topic notes to API:', error);
      // Fallback to localStorage
      const allNotes = getLocalStorageData(TOPIC_NOTES_KEY, {});
      allNotes[topicId] = notes;
      saveToLocalStorage(TOPIC_NOTES_KEY, allNotes);
    }
  }
};
