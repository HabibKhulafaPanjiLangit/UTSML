'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Sparkles, 
  Brain, 
  Search, 
  Image as ImageIcon,
  BarChart3,
  TrendingUp,
  Zap,
  Download,
  RefreshCw,
  Info,
  CheckCircle,
  AlertCircle,
  Globe,
  Calculator
} from 'lucide-react'

const aiCapabilities = [
  {
    id: 'text-generation',
    title: 'Text Generation',
    description: 'Generate human-like text for various applications',
    icon: Sparkles,
    color: 'bg-blue-500'
  },
  {
    id: 'image-generation',
    title: 'Image Generation',
    description: 'Create images from text descriptions',
    icon: ImageIcon,
    color: 'bg-purple-500'
  },
  {
    id: 'web-search',
    title: 'Web Search',
    description: 'Search and analyze web content with AI',
    icon: Globe,
    color: 'bg-green-500'
  },
  {
    id: 'data-analysis',
    title: 'Data Analysis',
    description: 'Advanced data analysis and insights',
    icon: BarChart3,
    color: 'bg-orange-500'
  }
]

export default function AIDemoPage() {
  const [selectedCapability, setSelectedCapability] = useState('text-generation')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState('')
  
  // Text Generation States
  const [prompt, setPrompt] = useState('')
  const [textResult, setTextResult] = useState('')
  
  // Image Generation States
  const [imagePrompt, setImagePrompt] = useState('')
  const [imageSize, setImageSize] = useState('1024x1024')
  const [imageResult, setImageResult] = useState('')
  
  // Web Search States
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  
  // Data Analysis States
  const [analysisPrompt, setAnalysisPrompt] = useState('')
  const [analysisResult, setAnalysisResult] = useState('')

  const performTextGeneration = async () => {
    if (!prompt.trim()) return
    
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/ai-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          capability: 'text-generation',
          prompt
        })
      })

      const result = await response.json()
      
      if (response.ok) {
        setTextResult(result.content || 'Generated text will appear here...')
      } else {
        setError(result.error || 'Failed to generate text')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const performImageGeneration = async () => {
    if (!imagePrompt.trim()) return
    
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/ai-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          capability: 'image-generation',
          prompt: imagePrompt,
          size: imageSize
        })
      })

      const result = await response.json()
      
      if (response.ok) {
        setImageResult(result.image || '')
      } else {
        setError(result.error || 'Failed to generate image')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const performWebSearch = async () => {
    if (!searchQuery.trim()) return
    
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/ai-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          capability: 'web-search',
          query: searchQuery,
          num: 10
        })
      })

      const result = await response.json()
      
      if (response.ok) {
        setSearchResults(result.results || [])
      } else {
        setError(result.error || 'Failed to perform search')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const performDataAnalysis = async () => {
    if (!analysisPrompt.trim()) return
    
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/ai-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          capability: 'data-analysis',
          prompt: analysisPrompt
        })
      })

      const result = await response.json()
      
      if (response.ok) {
        setAnalysisResult(result.analysis || 'Analysis results will appear here...')
      } else {
        setError(result.error || 'Failed to perform analysis')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                AI Capabilities Demo
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Eksplorasi kemampuan AI dengan Z-AI SDK integration
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset All
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {aiCapabilities.map((capability) => {
            const Icon = capability.icon
            return (
              <Card 
                key={capability.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                  selectedCapability === capability.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedCapability(capability.id)}
              >
                <CardHeader className="text-center">
                  <div className={`mx-auto p-3 rounded-lg ${capability.color} text-white mb-3`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg">{capability.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {capability.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Text Generation */}
            {selectedCapability === 'text-generation' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Text Generation
                  </CardTitle>
                  <CardDescription>
                    Generate creative text using advanced AI models
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="text-prompt">Prompt</Label>
                    <Textarea
                      id="text-prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Enter your prompt here..."
                      className="min-h-24"
                    />
                  </div>
                  <Button 
                    onClick={performTextGeneration} 
                    disabled={loading || !prompt.trim()}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Text
                      </>
                    )}
                  </Button>
                  
                  {textResult && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <Label className="text-sm font-medium mb-2 block">Generated Text:</Label>
                      <div className="text-sm whitespace-pre-wrap">{textResult}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Image Generation */}
            {selectedCapability === 'image-generation' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Image Generation
                  </CardTitle>
                  <CardDescription>
                    Create stunning images from text descriptions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="image-prompt">Image Description</Label>
                    <Textarea
                      id="image-prompt"
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      placeholder="Describe the image you want to generate..."
                      className="min-h-20"
                    />
                  </div>
                  <div>
                    <Label>Image Size</Label>
                    <Select value={imageSize} onValueChange={setImageSize}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="512x512">512x512</SelectItem>
                        <SelectItem value="1024x1024">1024x1024</SelectItem>
                        <SelectItem value="1024x768">1024x768</SelectItem>
                        <SelectItem value="768x1024">768x1024</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={performImageGeneration} 
                    disabled={loading || !imagePrompt.trim()}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Generate Image
                      </>
                    )}
                  </Button>
                  
                  {imageResult && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Generated Image:</Label>
                      <div className="relative rounded-lg overflow-hidden">
                        <img 
                          src={`data:image/png;base64,${imageResult}`}
                          alt="Generated image"
                          className="w-full h-auto"
                        />
                        <Button 
                          size="sm" 
                          className="absolute top-2 right-2"
                          onClick={() => {
                            const link = document.createElement('a')
                            link.download = 'generated-image.png'
                            link.href = `data:image/png;base64,${imageResult}`
                            link.click()
                          }}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Web Search */}
            {selectedCapability === 'web-search' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
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
                          <div className="text-xs text-slate-500 mt-2">
                            {result.host_name} • {result.date}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Data Analysis */}
            {selectedCapability === 'data-analysis' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Data Analysis
                  </CardTitle>
                  <CardDescription>
                    Advanced data analysis and AI-powered insights
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="analysis-prompt">Analysis Request</Label>
                    <Textarea
                      id="analysis-prompt"
                      value={analysisPrompt}
                      onChange={(e) => setAnalysisPrompt(e.target.value)}
                      placeholder="Describe the analysis you want to perform..."
                      className="min-h-24"
                    />
                  </div>
                  <Button 
                    onClick={performDataAnalysis} 
                    disabled={loading || !analysisPrompt.trim()}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analyze Data
                      </>
                    )}
                  </Button>
                  
                  {analysisResult && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <Label className="text-sm font-medium mb-2 block">Analysis Results:</Label>
                      <div className="text-sm whitespace-pre-wrap">{analysisResult}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  About Z-AI SDK
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <p>
                    Z-AI SDK provides powerful AI capabilities for modern applications.
                  </p>
                  <div className="space-y-2">
                    <div className="font-medium">Features:</div>
                    <div className="space-y-1 text-xs">
                      <div>• <strong>Text Generation</strong>: Advanced language models</div>
                      <div>• <strong>Image Creation</strong>: Text-to-image generation</div>
                      <div>• <strong>Web Search</strong>: AI-powered search</div>
                      <div>• <strong>Data Analysis</strong>: Intelligent insights</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  API Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm">API Connected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span className="text-sm">Models Ready</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Response time: &lt;2s
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}