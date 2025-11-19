import React, { useState } from 'react';
import { Search, Download, ExternalLink, BookOpen } from 'lucide-react';
import { findResources } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const ResourceFinder: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{text: string, chunks: any[]} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const data = await findResources(query);
      setResult({
        text: data.text || "No description generated.",
        chunks: data.groundingChunks
      });
    } catch (error) {
      console.error(error);
      setResult({
        text: "Failed to fetch resources. Please try again.",
        chunks: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to extract valid web URLs from chunks
  const getLinks = () => {
    if (!result || !result.chunks) return [];
    // Flatten the chunks into a list of unique URLs
    const links: {title: string, url: string}[] = [];
    
    result.chunks.forEach((chunk: any) => {
       if (chunk.web?.uri && chunk.web?.title) {
           links.push({ title: chunk.web.title, url: chunk.web.uri });
       }
    });
    return links;
  };

  const links = getLinks();

  return (
    <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">Driver & Manual Finder</h2>
            <p className="text-gray-400">Find the exact drivers, BIOS updates, or manuals for your specific hardware.</p>
        </div>

        <div className="relative mb-8">
            <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="e.g. 'RTX 3080 drivers' or 'ASUS B550-F Manual'"
                className="w-full bg-cyber-800 text-xl text-white py-4 pl-6 pr-14 rounded-full border border-gray-600 focus:border-cyber-primary focus:shadow-[0_0_15px_rgba(0,242,255,0.2)] outline-none transition-all placeholder-gray-600"
            />
            <button 
                onClick={handleSearch}
                disabled={isLoading || !query.trim()}
                className="absolute right-2 top-2 bottom-2 w-12 bg-cyber-primary text-black rounded-full flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50"
            >
                {isLoading ? <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></span> : <Search size={24} />}
            </button>
        </div>

        {result && (
            <div className="space-y-6">
                {/* AI Summary */}
                <div className="glass-panel rounded-2xl p-6 border-l-4 border-cyber-secondary">
                    <h3 className="text-lg font-semibold text-cyber-secondary mb-3 flex items-center gap-2">
                        <BookOpen size={20} />
                        AI Summary
                    </h3>
                    <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{result.text}</ReactMarkdown>
                    </div>
                </div>

                {/* Links Grid */}
                {links.length > 0 && (
                    <div className="grid grid-cols-1 gap-4">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2 ml-1">
                            <ExternalLink size={20} />
                            Verified Sources
                        </h3>
                        {links.map((link, idx) => (
                            <a 
                                key={idx} 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="group block bg-cyber-800 hover:bg-cyber-700 p-4 rounded-xl border border-gray-700 hover:border-cyber-primary transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-medium text-cyber-primary group-hover:text-white transition-colors truncate max-w-lg">{link.title}</h4>
                                        <p className="text-xs text-gray-500 mt-1 truncate max-w-md">{link.url}</p>
                                    </div>
                                    <Download size={20} className="text-gray-600 group-hover:text-cyber-primary" />
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        )}
    </div>
  );
};

export default ResourceFinder;
