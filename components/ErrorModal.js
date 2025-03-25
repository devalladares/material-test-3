import { X } from 'lucide-react';

const ErrorModal = ({ 
  showErrorModal, 
  closeErrorModal, 
  customApiKey, 
  setCustomApiKey, 
  handleApiKeySubmit 
}) => {
  return (
    <>
      {showErrorModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-xl shadow-medium max-w-md w-full mx-4 my-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium text-gray-800">API Quota Exceeded</h2>
                <button 
                  type="button"
                  onClick={closeErrorModal}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="text-gray-600">
                <p className="mb-2">
                  You've exceeded your API quota. You can:
                </p>
                <ul className="list-disc ml-5 mb-4 space-y-1 text-gray-600">
                  <li>Wait for your quota to reset</li>
                  <li>Use your own API key</li>
                </ul>
              </div>
              
              <form onSubmit={handleApiKeySubmit} className="space-y-3">
                <div>
                  <label 
                    htmlFor="apiKey" 
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Gemini API Key
                  </label>
                  <input
                    id="apiKey"
                    type="password"
                    placeholder="Enter your Gemini API key"
                    value={customApiKey}
                    onChange={(e) => setCustomApiKey(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeErrorModal}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    Use My Key
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ErrorModal; 