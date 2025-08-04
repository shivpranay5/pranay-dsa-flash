import React, { useEffect } from 'react';
import { useStore } from './hooks/useStore';
import Layout from './components/Layout';
import TopicList from './components/TopicList';
import ProblemList from './components/ProblemList';
import AddTopicModal from './components/AddTopicModal';
import AddProblemModal from './components/AddProblemModal';
import TopicNotes from './components/TopicNotes';


function App() {
  const { 
    loadData, 
    selectedTopic, 
    showAddTopicModal, 
    showAddProblemModal,
    setShowAddTopicModal,
    setShowAddProblemModal
  } = useStore();

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Pranay's DSA Flash
              </h1>
              <p className="text-gray-600">
                Summer 2026 - &lt; Pranay Google SDE Intern &gt;
              </p>
              <p className="text-gray-600 mt-2">
                Pranay Nuvvu FANG Crack chesthav, nuvvu fight chey neetho nenu vunta - Sri Krishna
              </p>
              <p className="text-gray-600 mt-1 text-base font-bold">
                " Om Krishnaya Vasudevaya Haraye Paramatmane Pranata Kleshanashaya Govindaya Namo Namah "
              </p>
            </div>
            <img 
              src="https://miro.medium.com/v2/resize:fit:1224/0*eV0ZsqG15rKT9AZP.jpg" 
              alt="Google California" 
              className="w-32 h-32 rounded-lg ml-6 flex-shrink-0 object-cover"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Topics Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Topics</h2>
                  <button
                    onClick={() => setShowAddTopicModal(true)}
                    className="btn-primary text-sm"
                  >
                    Add Topic
                  </button>
                </div>
                <TopicList />
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {selectedTopic ? (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedTopic.name}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        {selectedTopic.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowAddProblemModal(true)}
                        className="btn-primary"
                      >
                        Add Problem
                      </button>
                    </div>
                  </div>
                  
                  {/* Topic Notes Section */}
                  <TopicNotes topicId={selectedTopic.id} topicName={selectedTopic.name} />
                  
                  <ProblemList />
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a Topic
                  </h3>
                  <p className="text-gray-500">
                    Choose a topic from the sidebar to view related problems and solutions.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>

      {/* Modals */}
      {showAddTopicModal && <AddTopicModal />}
      {showAddProblemModal && <AddProblemModal />}
    </div>
  );
}

export default App;
