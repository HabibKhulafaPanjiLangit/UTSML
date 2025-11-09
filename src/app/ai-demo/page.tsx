
'use client';
import * as XLSX from 'xlsx';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'

import { RefreshCw, Search } from 'lucide-react';

export default function AIDemoPage() {
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCapability, setSelectedCapability] = useState<string>('data-analysis');
  const [imagePrompt, setImagePrompt] = useState<string>('');
  const [imageSize, setImageSize] = useState<string>('512x512');
  const [imageResult, setImageResult] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [analysisPrompt, setAnalysisPrompt] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Dummy handlers for upload/export
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResults({ uploaded: true });
  };
  const exportToXLSX = () => {
    alert('Export to Excel');
  };
  const exportToCSV = () => {
    alert('Export to CSV');
  };

  // Dummy handlers for AI features
  const performImageGeneration = () => {
    setLoading(true);
    setTimeout(() => {
      setImageResult('');
      setLoading(false);
    }, 1000);
  };
  const performWebSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setSearchResults([{ name: 'Contoh hasil', url: '#', snippet: 'Ini hasil pencarian.', host_name: 'example.com', date: '2025-11-09' }]);
      setLoading(false);
    }, 1000);
  };

// ...existing logic...
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 to-purple-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                    Demo Kemampuan AI
                  </h1>
                  <p className="text-lg text-slate-600 dark:text-slate-400">
                    Eksplorasi kemampuan AI tanpa Z-AI SDK
                  </p>
                  {/* Penjelasan hasil analisis */}
                  {results && (
                    <div className="mt-4 p-4 bg-indigo-100 rounded text-indigo-900 text-sm">
                      <strong>Penjelasan Hasil Analisis:</strong><br />
                      Fitur AI meliputi text generation, image generation, dan analisis data.<br />
                      Akurasi dan parameter model dapat dilihat pada hasil analisis.<br />
                      Setiap fitur AI memiliki penjelasan dan contoh output di bawah grafik.<br />
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset Semua
                  </Button>
                </div>
              </div>
            </div>
            {/* Upload dan Export Data */}
            <div className="flex gap-2 mb-2">
              <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} className="border rounded px-2 py-1 text-sm" />
              <Button onClick={exportToXLSX} variant="outline" size="sm">Export Excel</Button>
              <Button onClick={exportToCSV} variant="outline" size="sm">Export CSV</Button>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400 mb-4">Upload file data (CSV/Excel) untuk olah data manual. Export hasil ke Excel/CSV untuk analisis di aplikasi lain seperti Microsoft Excel. Sheet Ringkasan berisi penjelasan hasil AI.</div>
            {/* Feature Tabs */}
            {/* Web Search */}
            {selectedCapability === 'web-search' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Web Search
                  </CardTitle>
                  <CardDescription>
                    Search and analyze web content with AI-powered insights
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="search-query">Search Query</Label>
                    <Input
                      id="search-query"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="What do you want to search for?"
                      onKeyPress={(e) => e.key === 'Enter' && performWebSearch()}
                    />
                  </div>
                  <Button 
                    onClick={performWebSearch} 
                    disabled={loading || !searchQuery.trim()}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Search Web
                      </>
                    )}
                  </Button>
                  {searchResults.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Search Results:</Label>
                      {searchResults.map((result, idx) => (
                        <div key={idx} className="p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                          <h4 className="font-medium text-blue-600 hover:underline cursor-pointer">
                            <a href={result.url} target="_blank" rel="noopener noreferrer">
                              {result.name}
                            </a>
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {result.snippet}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}