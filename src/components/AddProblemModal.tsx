import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useStore } from '../hooks/useStore';

const AddProblemModal: React.FC = () => {
  const { 
    showAddProblemModal, 
    setShowAddProblemModal, 
    addProblem, 
    updateProblem,
    selectedTopic,
    selectedProblem,
    setSelectedProblem,
    topics 
  } = useStore();
  
  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'Easy' as 'Easy' | 'Medium' | 'Hard',
    leetcodeUrl: '',
    geeksforgeeksUrl: '',
    solution: '',
    notes: '',
    tags: '',
    timeComplexity: '',
    spaceComplexity: '',
    topicId: selectedTopic?.id || ''
  });

  // Check if we're editing an existing problem
  const isEditing = !!selectedProblem;

  const difficulties = ['Easy', 'Medium', 'Hard'];

  // Populate form when editing
  useEffect(() => {
    if (selectedProblem) {
      setFormData({
        title: selectedProblem.title,
        difficulty: selectedProblem.difficulty,
        leetcodeUrl: selectedProblem.leetcodeUrl || '',
        geeksforgeeksUrl: selectedProblem.geeksforgeeksUrl || '',
        solution: selectedProblem.solution,
        notes: selectedProblem.notes || '',
        tags: selectedProblem.tags.join(', '),
        timeComplexity: selectedProblem.timeComplexity || '',
        spaceComplexity: selectedProblem.spaceComplexity || '',
        topicId: selectedProblem.topicId
      });
    } else {
      // Reset form for new problem
      setFormData({
        title: '',
        difficulty: 'Easy',
        leetcodeUrl: '',
        geeksforgeeksUrl: '',
        solution: '',
        notes: '',
        tags: '',
        timeComplexity: '',
        spaceComplexity: '',
        topicId: selectedTopic?.id || ''
      });
    }
  }, [selectedProblem, selectedTopic]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim() && formData.solution.trim() && formData.topicId) {
      if (isEditing && selectedProblem) {
        // Update existing problem
        updateProblem(selectedProblem.id, {
          title: formData.title.trim(),
          difficulty: formData.difficulty,
          leetcodeUrl: formData.leetcodeUrl.trim() || undefined,
          geeksforgeeksUrl: formData.geeksforgeeksUrl.trim() || undefined,
          solution: formData.solution.trim(),
          notes: formData.notes.trim() || undefined,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
          timeComplexity: formData.timeComplexity.trim() || undefined,
          spaceComplexity: formData.spaceComplexity.trim() || undefined,
          topicId: formData.topicId
        });
      } else {
        // Add new problem
        addProblem({
          title: formData.title.trim(),
          difficulty: formData.difficulty,
          leetcodeUrl: formData.leetcodeUrl.trim() || undefined,
          geeksforgeeksUrl: formData.geeksforgeeksUrl.trim() || undefined,
          solution: formData.solution.trim(),
          notes: formData.notes.trim() || undefined,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
          timeComplexity: formData.timeComplexity.trim() || undefined,
          spaceComplexity: formData.spaceComplexity.trim() || undefined,
          topicId: formData.topicId
        });
      }
      
      setShowAddProblemModal(false);
      setSelectedProblem(null); // Clear selected problem when modal closes
    }
  };

  return (
    <Dialog
      open={showAddProblemModal}
      onClose={() => setShowAddProblemModal(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              {isEditing ? 'Edit Problem' : 'Add New Problem'}
            </Dialog.Title>
            <button
              onClick={() => {
                setShowAddProblemModal(false);
                setSelectedProblem(null); // Clear selected problem when modal closes
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Problem Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Two Sum"
                  required
                />
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as 'Easy' | 'Medium' | 'Hard' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {difficulties.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="topicId" className="block text-sm font-medium text-gray-700 mb-1">
                Topic *
              </label>
              <select
                id="topicId"
                value={formData.topicId}
                onChange={(e) => setFormData({ ...formData, topicId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="">Select a topic</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="leetcodeUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  LeetCode URL
                </label>
                <input
                  type="url"
                  id="leetcodeUrl"
                  value={formData.leetcodeUrl}
                  onChange={(e) => setFormData({ ...formData, leetcodeUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://leetcode.com/problems/..."
                />
              </div>

              <div>
                <label htmlFor="geeksforgeeksUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  GeeksforGeeks URL
                </label>
                <input
                  type="url"
                  id="geeksforgeeksUrl"
                  value={formData.geeksforgeeksUrl}
                  onChange={(e) => setFormData({ ...formData, geeksforgeeksUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://www.geeksforgeeks.org/..."
                />
              </div>
            </div>

            <div>
              <label htmlFor="solution" className="block text-sm font-medium text-gray-700 mb-1">
                Solution *
              </label>
              <textarea
                id="solution"
                value={formData.solution}
                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe your solution approach..."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="timeComplexity" className="block text-sm font-medium text-gray-700 mb-1">
                  Time Complexity
                </label>
                <input
                  type="text"
                  id="timeComplexity"
                  value={formData.timeComplexity}
                  onChange={(e) => setFormData({ ...formData, timeComplexity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., O(n), O(n²)"
                />
              </div>

              <div>
                <label htmlFor="spaceComplexity" className="block text-sm font-medium text-gray-700 mb-1">
                  Space Complexity
                </label>
                <input
                  type="text"
                  id="spaceComplexity"
                  value={formData.spaceComplexity}
                  onChange={(e) => setFormData({ ...formData, spaceComplexity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., O(1), O(n)"
                />
              </div>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., hashmap, array, two-pointers"
              />
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Any additional notes or insights..."
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowAddProblemModal(false);
                  setSelectedProblem(null); // Clear selected problem when modal closes
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
              >
                {isEditing ? 'Update Problem' : 'Add Problem'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddProblemModal;
