import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useStore } from '../hooks/useStore';

const AddTopicModal: React.FC = () => {
  const { showAddTopicModal, setShowAddTopicModal, addTopic } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Data Structures',
    icon: 'Square3Stack3DIcon'
  });

  const categories = ['Data Structures', 'Algorithms', 'Techniques'];
  const icons = [
    { name: 'Square3Stack3DIcon', label: 'Stack' },
    { name: 'DocumentTextIcon', label: 'Document' },
    { name: 'LinkIcon', label: 'Link' },
    { name: 'TreeIcon', label: 'Tree' },
    { name: 'ShareIcon', label: 'Graph' },
    { name: 'CpuChipIcon', label: 'CPU' },
    { name: 'SparklesIcon', label: 'Sparkles' },
    { name: 'CursorArrowRaysIcon', label: 'Cursor' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.description.trim()) {
      addTopic({
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        icon: formData.icon,
        order: Date.now()
      });
      setFormData({ name: '', description: '', category: 'Data Structures', icon: 'Square3Stack3DIcon' });
      setShowAddTopicModal(false);
    }
  };

  return (
    <Dialog
      open={showAddTopicModal}
      onClose={() => setShowAddTopicModal(false)}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md w-full bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Add New Topic
            </Dialog.Title>
            <button
              onClick={() => setShowAddTopicModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Topic Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Arrays, Dynamic Programming"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Brief description of the topic..."
                required
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="icon" className="block text-sm font-medium text-gray-700 mb-1">
                Icon
              </label>
              <select
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {icons.map((icon) => (
                  <option key={icon.name} value={icon.name}>
                    {icon.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowAddTopicModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add Topic
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddTopicModal;
