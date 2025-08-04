import React, { useState, useRef } from 'react';
import { ChevronDownIcon, ChevronRightIcon, PencilIcon, ArrowTopRightOnSquareIcon, XMarkIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useStore } from '../hooks/useStore';

interface NoteContent {
  type: 'text' | 'image';
  content: string;
  id: string;
}

interface TopicNotesProps {
  topicId: string;
  topicName: string;
}

const TopicNotes: React.FC<TopicNotesProps> = ({ topicId, topicName }) => {
  const { getTopicNotes, saveTopicNotes } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [noteContent, setNoteContent] = useState<NoteContent[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with existing notes
  React.useEffect(() => {
    const loadNotes = async () => {
      try {
        const existingNotes = await getTopicNotes(topicId);
        if (existingNotes) {
          try {
            const parsed = JSON.parse(existingNotes);
            if (Array.isArray(parsed)) {
              setNoteContent(parsed);
            } else {
              // Convert old format to new format
              setNoteContent([{ type: 'text', content: existingNotes, id: Date.now().toString() }]);
            }
          } catch {
            setNoteContent([{ type: 'text', content: existingNotes, id: Date.now().toString() }]);
          }
        } else {
          setNoteContent([{ type: 'text', content: '', id: Date.now().toString() }]);
        }
      } catch (error) {
        console.error('Error loading notes:', error);
        setNoteContent([{ type: 'text', content: '', id: Date.now().toString() }]);
      }
    };
    
    loadNotes();
  }, [topicId, getTopicNotes]);

  const handleSave = async () => {
    try {
      await saveTopicNotes(topicId, JSON.stringify(noteContent));
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const handleCancel = async () => {
    try {
      const existingNotes = await getTopicNotes(topicId);
      if (existingNotes) {
        try {
          const parsed = JSON.parse(existingNotes);
          if (Array.isArray(parsed)) {
            setNoteContent(parsed);
          } else {
            setNoteContent([{ type: 'text', content: existingNotes, id: Date.now().toString() }]);
          }
        } catch {
          setNoteContent([{ type: 'text', content: existingNotes, id: Date.now().toString() }]);
        }
      } else {
        setNoteContent([{ type: 'text', content: '', id: Date.now().toString() }]);
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error loading notes for cancel:', error);
      setIsEditing(false);
    }
  };

  const handleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          const newImage: NoteContent = {
            type: 'image',
            content: result,
            id: Date.now().toString() + Math.random()
          };
          setNoteContent(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const addTextBlock = () => {
    const newText: NoteContent = {
      type: 'text',
      content: '',
      id: Date.now().toString() + Math.random()
    };
    setNoteContent(prev => [...prev, newText]);
  };

  const updateTextBlock = (id: string, content: string) => {
    setNoteContent(prev => 
      prev.map(item => 
        item.id === id ? { ...item, content } : item
      )
    );
  };

  const removeBlock = (id: string) => {
    setNoteContent(prev => prev.filter(item => item.id !== id));
  };

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 mb-4">
        <div 
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center space-x-2">
            {isOpen ? (
              <ChevronDownIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronRightIcon className="h-5 w-5 text-gray-500" />
            )}
            <h3 className="text-lg font-medium text-gray-900">
              Notes for {topicName}
            </h3>
          </div>
          {isOpen && !isEditing && (
            <div className="flex items-center space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFullScreen();
                }}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                title="Expand to full screen"
              >
                                        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                title="Edit notes"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

      {isOpen && (
        <div className="px-4 pb-4">
          {isEditing ? (
            <div className="space-y-4">
              {/* Content Blocks */}
              <div className="space-y-4">
                {noteContent.map((block, index) => (
                  <div key={block.id} className="relative group">
                    {block.type === 'text' ? (
                      <textarea
                        value={block.content}
                        onChange={(e) => updateTextBlock(block.id, e.target.value)}
                        placeholder={index === 0 ? `Start Writing Notes for ${topicName}...` : "Add more text..."}
                        className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      />
                    ) : (
                      <div className="relative">
                        <img
                          src={block.content}
                          alt="Note content"
                          className="w-full max-w-md h-auto rounded-lg"
                        />
                        <button
                          onClick={() => removeBlock(block.id)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => removeBlock(block.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              
              {/* Add Content Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={addTextBlock}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span>+ Add Text</span>
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <PhotoIcon className="h-4 w-4" />
                  <span>+ Add Image</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="px-3 py-1 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {noteContent.length === 0 || (noteContent.length === 1 && noteContent[0].content === '') ? (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-gray-500 italic">
                    Start Writing Notes for {topicName}...
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {noteContent.map((block) => (
                    <div key={block.id}>
                      {block.type === 'text' ? (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="whitespace-pre-wrap text-gray-700">
                            {block.content}
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-center">
                          <img
                            src={block.content}
                            alt="Note content"
                            className="max-w-full h-auto rounded-lg shadow-md"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>

    {/* Full Screen Modal */}
    {isFullScreen && (
      <div className="fixed inset-0 bg-white z-50 flex flex-col">
        <div className="w-full h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Notes for {topicName}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                title="Edit notes"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                title="Upload images"
              >
                <PhotoIcon className="h-5 w-5" />
              </button>
              <button
                onClick={handleFullScreen}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                title="Close full screen"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto h-full">
            {isEditing ? (
              <div className="space-y-4 h-full">
                {/* Content Blocks */}
                <div className="space-y-4">
                  {noteContent.map((block, index) => (
                    <div key={block.id} className="relative group">
                      {block.type === 'text' ? (
                        <textarea
                          value={block.content}
                          onChange={(e) => updateTextBlock(block.id, e.target.value)}
                          placeholder={index === 0 ? `Start Writing Notes for ${topicName}...` : "Add more text..."}
                          className="w-full min-h-[100px] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        />
                      ) : (
                        <div className="relative">
                          <img
                            src={block.content}
                            alt="Note content"
                            className="w-full max-w-md h-auto rounded-lg"
                          />
                          <button
                            onClick={() => removeBlock(block.id)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      <button
                        onClick={() => removeBlock(block.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* Add Content Buttons */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={addTextBlock}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <span>+ Add Text</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <PhotoIcon className="h-4 w-4" />
                    <span>+ Add Image</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {noteContent.length === 0 || (noteContent.length === 1 && noteContent[0].content === '') ? (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="text-gray-500 italic text-lg">
                      Start Writing Notes for {topicName}...
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {noteContent.map((block) => (
                      <div key={block.id}>
                        {block.type === 'text' ? (
                          <div className="bg-gray-50 rounded-lg p-6">
                            <div className="whitespace-pre-wrap text-gray-700 text-lg leading-relaxed">
                              {block.content}
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <img
                              src={block.content}
                              alt="Note content"
                              className="max-w-full h-auto rounded-lg shadow-md"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )}
  </>
  );
};

export default TopicNotes; 