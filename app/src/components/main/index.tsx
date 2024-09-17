import React from 'react';

const MainView = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-white">
          Welcome to Whisper-All
        </h1>
        <p className="text-xl text-indigo-200">
          The ultimate voice to text solution.
        </p>
      </div>
    </div>
  );
};

export default MainView;
