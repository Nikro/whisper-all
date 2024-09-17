import React, { useState } from 'react';

const SettingsView = () => {
  const [settingValue, setSettingValue] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettingValue(event.target.value);
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 p-6">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-4">
          Settings
        </h2>
        <form className="space-y-4 mt-4">
          <div>
            <label
              htmlFor="setting"
              className="block text-sm font-medium text-gray-700"
            >
              Example Setting
            </label>
            <input
              type="text"
              id="setting"
              name="setting"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Type here..."
              value={settingValue}
              onChange={handleInputChange}
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsView;
