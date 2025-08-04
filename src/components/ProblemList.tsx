import React from 'react';
import { 
  TrashIcon, 
  PencilIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { useStore } from '../hooks/useStore';

const ProblemList: React.FC = () => {
  const { 
    selectedTopic, 
    getProblemsByTopic, 
    getFilteredProblems,
    searchQuery,
    deleteProblem, 
    setSelectedProblem,
    setShowAddProblemModal
  } = useStore();

  if (!selectedTopic) return null;

  // Use filtered problems if there's a search query, otherwise use problems by topic
  const problems = searchQuery ? getFilteredProblems().filter(p => p.topicId === selectedTopic.id) : getProblemsByTopic(selectedTopic.id);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {problems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No matching problems found' : 'No problems yet'}
          </h3>
          <p className="text-gray-500">
            {searchQuery 
              ? `No problems match "${searchQuery}" in ${selectedTopic.name}.`
              : `Add your first problem to get started with ${selectedTopic.name}.`
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {problems.map((problem) => (
            <div
              key={problem.id}
              className="group bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {problem.title}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </div>

                  {/* Solution */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Solution:</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                      {problem.solution}
                    </p>
                  </div>

                  {/* Complexity */}
                  {(problem.timeComplexity || problem.spaceComplexity) && (
                    <div className="flex items-center space-x-4 mb-4 text-sm">
                      {problem.timeComplexity && (
                        <span className="text-gray-600">
                          <span className="font-medium">Time:</span> {problem.timeComplexity}
                        </span>
                      )}
                      {problem.spaceComplexity && (
                        <span className="text-gray-600">
                          <span className="font-medium">Space:</span> {problem.spaceComplexity}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Tags */}
                  {problem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {problem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Notes */}
                  {problem.notes && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Notes:</h4>
                      <p className="text-sm text-gray-600 bg-yellow-50 rounded-lg p-3 border-l-4 border-yellow-400">
                        {problem.notes}
                      </p>
                    </div>
                  )}

                  {/* Links */}
                  <div className="flex items-center space-x-3">
                    {problem.leetcodeUrl && (
                      <a
                        href={problem.leetcodeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                        <span>LeetCode</span>
                      </a>
                    )}
                    {problem.geeksforgeeksUrl && (
                      <a
                        href={problem.geeksforgeeksUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-sm text-green-600 hover:text-green-800 transition-colors"
                      >
                        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                        <span>GeeksforGeeks</span>
                      </a>
                    )}

                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setSelectedProblem(problem);
                      setShowAddProblemModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete "${problem.title}"?`)) {
                        deleteProblem(problem.id);
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Created date */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Added on {new Date(problem.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProblemList;
