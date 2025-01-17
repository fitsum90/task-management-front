import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X } from "lucide-react";

interface FileDropzoneProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFileSelect,
  selectedFile,
  onClear,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles[0]) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "application/pdf": [],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  });

  if (selectedFile) {
    return (
      <div className="flex items-center justify-between p-4 border-2 border-gray-200 border-dashed rounded-lg bg-gray-50">
        <div className="flex items-center">
          <File className="w-5 h-5 text-blue-500 mr-2" />
          <div>
            <p className="text-sm font-medium text-gray-900">
              {selectedFile.name}
            </p>
            <p className="text-xs text-gray-500">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
        <button
          onClick={onClear}
          className="p-1 rounded-full hover:bg-gray-200 transition-colors"
          title="Remove file"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all duration-200 ${
        isDragActive
          ? "border-blue-400 bg-blue-50"
          : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
      }`}
    >
      <input {...getInputProps()} />
      <Upload
        className={`w-10 h-10 mx-auto mb-3 ${
          isDragActive ? "text-blue-500" : "text-gray-400"
        }`}
      />
      <p className="text-sm text-gray-600 font-medium">
        {isDragActive
          ? "Drop the file here"
          : "Drag & drop a file here, or click to select"}
      </p>
      <p className="text-xs text-gray-500 mt-2">
        Supported formats: JPEG, PNG, PDF (max 2MB)
      </p>
    </div>
  );
};

export default FileDropzone;
