import React, { useState, useRef } from 'react';
import { Upload, Camera, X, Search, AlertCircle } from 'lucide-react';
import { analyzeComponentImage } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const VisualInspector: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImage(base64);
      setAnalysis(null); // Reset previous analysis
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!image) return;

    setIsAnalyzing(true);
    try {
      const base64Data = image.split(',')[1]; // Remove "data:image/jpeg;base64," prefix
      const mimeType = image.substring(image.indexOf(':') + 1, image.indexOf(';'));
      
      const result = await analyzeComponentImage(base64Data, mimeType);
      setAnalysis(result || "Could not analyze image.");
    } catch (error) {
      console.error(error);
      setAnalysis("Error analyzing image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    setAnalysis(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Component Vision Analysis</h2>
            <p className="text-gray-400">Upload a photo of a motherboard, GPU, or burnt connector. Our AI will identify it and look for visible damage.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-4">
                <div 
                    className={`border-2 border-dashed rounded-2xl h-80 flex flex-col items-center justify-center transition-all relative overflow-hidden ${
                        image ? 'border-cyber-primary/50 bg-cyber-800' : 'border-gray-700 hover:border-gray-500 bg-cyber-800/50'
                    }`}
                >
                    {image ? (
                        <>
                            <img src={image} alt="Preview" className="w-full h-full object-contain p-4" />
                            <button 
                                onClick={clearImage}
                                className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-red-500/50 rounded-full text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </>
                    ) : (
                        <div className="text-center p-6">
                            <Camera size={48} className="mx-auto mb-4 text-gray-500" />
                            <p className="text-gray-300 font-medium mb-2">Drag & Drop or Click to Upload</p>
                            <p className="text-gray-500 text-sm">Supports JPG, PNG</p>
                            <input 
                                type="file" 
                                ref={fileInputRef}
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    )}
                </div>

                <button
                    onClick={handleAnalyze}
                    disabled={!image || isAnalyzing}
                    className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                        !image || isAnalyzing
                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cyber-secondary to-cyber-primary text-white hover:shadow-[0_0_20px_rgba(112,0,255,0.4)]'
                    }`}
                >
                    {isAnalyzing ? (
                        <>
                            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                            Scanning Component...
                        </>
                    ) : (
                        <>
                            <Search size={20} />
                            Analyze Component
                        </>
                    )}
                </button>
            </div>

            {/* Results Section */}
            <div className="glass-panel rounded-2xl p-6 min-h-[320px] flex flex-col">
                <h3 className="text-xl font-bold text-cyber-primary mb-4 border-b border-gray-700 pb-2">Analysis Report</h3>
                
                {analysis ? (
                    <div className="prose prose-invert prose-sm overflow-y-auto flex-1 custom-scrollbar">
                         <ReactMarkdown>{analysis}</ReactMarkdown>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 opacity-50">
                        <AlertCircle size={48} className="mb-4" />
                        <p>No analysis data yet.</p>
                        <p className="text-sm">Upload an image to begin.</p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default VisualInspector;
