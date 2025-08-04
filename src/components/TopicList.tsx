import React from 'react';
import { 
  TrashIcon, 
  PencilIcon,
  Square3Stack3DIcon,
  DocumentTextIcon,
  LinkIcon,
  ChartBarIcon,
  ShareIcon,
  CpuChipIcon,
  SparklesIcon,
  CursorArrowRaysIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { useStore } from '../hooks/useStore';

const iconMap: { [key: string]: React.ComponentType<any> } = {
  Square3Stack3DIcon,
  DocumentTextIcon,
  LinkIcon,
  ChartBarIcon,
  ShareIcon,
  CpuChipIcon,
  SparklesIcon,
  CursorArrowRaysIcon,
  TrophyIcon,
};

const TopicList: React.FC = () => {
  const { 
    getFilteredTopics, 
    selectedTopic, 
    setSelectedTopic, 
    deleteTopic,
    problems 
  } = useStore();

  const topics = getFilteredTopics();

  const getProblemCount = (topicId: string) => {
    return problems.filter(p => p.topicId === topicId).length;
  };

  const getDifficultyBreakdown = (topicId: string) => {
    const topicProblems = problems.filter(p => p.topicId === topicId);
    const easy = topicProblems.filter(p => p.difficulty === 'Easy').length;
    const medium = topicProblems.filter(p => p.difficulty === 'Medium').length;
    const hard = topicProblems.filter(p => p.difficulty === 'Hard').length;
    return { easy, medium, hard };
  };

  return (
    <div className="space-y-2">
      {topics.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No topics found</p>
        </div>
      ) : (
        topics.map((topic) => {
          const IconComponent = iconMap[topic.icon || 'Square3Stack3DIcon'];
          const problemCount = getProblemCount(topic.id);
          const difficultyBreakdown = getDifficultyBreakdown(topic.id);
          
          return (
            <div
              key={topic.id}
              className={`group relative p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                selectedTopic?.id === topic.id
                  ? 'bg-primary-50 border-primary-200 shadow-sm'
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
              onClick={() => setSelectedTopic(topic)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className={`p-2 rounded-lg ${
                    selectedTopic?.id === topic.id
                      ? 'bg-primary-100 text-primary-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium text-sm truncate ${
                      selectedTopic?.id === topic.id
                        ? 'text-primary-900'
                        : 'text-gray-900'
                    }`}>
                      {topic.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {topic.description}
                    </p>
                  </div>
                </div>

                {/* Problem count badge */}
                {problemCount > 0 && (
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <span className="font-medium">{problemCount}</span>
                    <span>problems</span>
                  </div>
                )}
              </div>

              {/* Difficulty breakdown */}
              {problemCount > 0 && (
                <div className="flex items-center space-x-2 mt-3">
                  {difficultyBreakdown.easy > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {difficultyBreakdown.easy} Easy
                    </span>
                  )}
                  {difficultyBreakdown.medium > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {difficultyBreakdown.medium} Medium
                    </span>
                  )}
                  {difficultyBreakdown.hard > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {difficultyBreakdown.hard} Hard
                    </span>
                  )}
                </div>
              )}

              {/* Action buttons (visible on hover) */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: Implement edit functionality
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Are you sure you want to delete "${topic.name}" and all its problems?`)) {
                        deleteTopic(topic.id);
                      }
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default TopicList;
