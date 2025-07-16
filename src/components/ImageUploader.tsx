'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Loader2, UploadCloud, X } from 'lucide-react'; // npm install lucide-react

interface ImageUploadResponse {
  url: string;
}

interface ImageUploaderProps {
  onUrlsChange: (urls: string[]) => void;
  initialUrls?: string[];
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onUrlsChange, initialUrls = [] }) => {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(initialUrls);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploadingFiles(acceptedFiles);

    const newUrls: string[] = [];
    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/uploads', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Falha no upload');
        }

        const { url } = (await response.json()) as ImageUploadResponse;
        newUrls.push(url);
      } catch (error) {
        console.error('Erro no upload da imagem:', error);
        // Opcional: Adicionar feedback de erro para o usuário
      }
    }
    
    const allUrls = [...uploadedUrls, ...newUrls];
    setUploadedUrls(allUrls);
    onUrlsChange(allUrls); // Notifica o componente pai sobre a mudança
    setUploadingFiles([]);
  }, [uploadedUrls, onUrlsChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.webp'] },
  });

  const removeImage = (urlToRemove: string) => {
    const updatedUrls = uploadedUrls.filter(url => url !== urlToRemove);
    setUploadedUrls(updatedUrls);
    onUrlsChange(updatedUrls);
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={`w-full p-6 border-2 border-dashed rounded-lg cursor-pointer text-center
        ${isDragActive ? 'border-primary bg-blue-50' : 'border-gray-300'}`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="w-12 h-12 mx-auto text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive ? 'Solte as imagens aqui...' : 'Arraste e solte as imagens aqui, ou clique para selecionar'}
        </p>
      </div>

      {(uploadingFiles.length > 0 || uploadedUrls.length > 0) && (
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {uploadedUrls.map((url) => (
            <div key={url} className="relative group">
              <img src={url} alt="Preview" className="w-full h-24 object-cover rounded-md" />
              <button
                onClick={() => removeImage(url)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          ))}
          {uploadingFiles.map((file, index) => (
            <div key={index} className="w-full h-24 flex items-center justify-center bg-gray-100 rounded-md">
              <Loader2 className="animate-spin text-primary" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};