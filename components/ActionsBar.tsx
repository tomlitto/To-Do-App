import React, { useRef } from 'react';
import { UploadIcon, DownloadIcon } from './icons';

interface ActionsBarProps {
  onImport: (file: File) => void;
  onExport: () => void;
}

const ActionsBar: React.FC<ActionsBarProps> = ({ onImport, onExport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImport(file);
      // Reset file input to allow importing the same file again
      event.target.value = '';
    }
  };

  const baseButtonClasses = "inline-flex items-center justify-center gap-x-2 rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 transition-all";

  return (
    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
      <div>
        <h2 className="text-lg font-bold text-gray-700">Tips</h2>
        <ul className="mt-2 list-disc list-inside text-lg text-gray-600 space-y-1">
          <li>Do not schedule 10 tasks + 2 bonus tasks in a day.</li>
          <li>Make time to sleep well, eat healthy and move your body.</li>
          <li>Remember to make time for family and friends. Tell them that you love them when they are still around.</li>
        </ul>
      </div>
      <div className="flex items-center gap-x-3 self-center sm:self-start">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".xlsx, .xls, .csv"
        />
        <button onClick={handleImportClick} className={`${baseButtonClasses} bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50`}>
          <UploadIcon className="-ml-0.5 h-5 w-5" />
          Import
        </button>
        <button onClick={onExport} className={`${baseButtonClasses} bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50`}>
          <DownloadIcon className="-ml-0.5 h-5 w-5" />
          Export
        </button>
      </div>
    </div>
  );
};

export default ActionsBar;