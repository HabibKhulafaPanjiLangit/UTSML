'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain, 
  LineChart, 
  Layers, 
  Network, 
  BarChart3, 
  Zap,
  TrendingUp,
  PieChart,
  Activity,
  Database,
  Cpu,
  Lightbulb
} from 'lucide-react'

const mlModels = [
  {
    id: 'linear-regression',
    title: 'Linear Regression',
    description: 'Prediksi nilai kontinyu dengan regresi linear sederhana dan berganda',
    icon: LineChart,
    color: 'bg-blue-500',
    features: ['Simple Linear Regression', 'Multiple Linear Regression', 'Polynomial Regression', 'Interactive Visualization'],
    difficulty: 'Beginner',
    status: 'ready'
  },
  {
    id: 'classification',
    title: 'Classification',
    description: 'Klasifikasi data menggunakan berbagai algoritma supervised learning',
    icon: Layers,
    color: 'bg-green-500',
    features: ['Logistic Regression', 'Decision Trees', 'Random Forest', 'SVM', 'Naive Bayes'],
    difficulty: 'Intermediate',
    status: 'ready'
  },
  {
    id: 'clustering',
    title: 'Clustering',
    description: 'Pengelompokan data tidak berlabel dengan unsupervised learning',
    icon: PieChart,
    color: 'bg-purple-500',
    features: ['K-Means', 'Hierarchical Clustering', 'DBSCAN', 'Silhouette Analysis'],
    difficulty: 'Intermediate',
    status: 'ready'
  },
  {
    id: 'neural-network',
    title: 'Neural Networks',
    description: 'Deep learning dengan neural networks untuk pattern recognition',
    icon: Network,
    color: 'bg-orange-500',
    features: ['Feed Forward NN', 'Backpropagation', 'Training Visualization', 'Custom Architectures'],
    difficulty: 'Advanced',
    status: 'ready'
  },
  {
    id: 'ai-demo',
    title: 'AI Capabilities',
    description: 'Eksplorasi kemampuan AI dengan Z-AI SDK integration',
    icon: Brain,
    color: 'bg-indigo-500',
    features: ['Text Generation', 'Image Generation', 'Web Search', 'Data Analysis'],
    difficulty: 'Advanced',
    status: 'ready'
  }
]

const features = [
  {
    icon: Database,
    title: 'Data Management',
    description: 'Upload, preprocess, dan manage dataset dengan mudah'
  },
  {
    icon: Activity,
    title: 'Real-time Training',
    description: 'Monitor proses training model secara real-time dengan visualisasi interaktif'
  },
  {
    icon: TrendingUp,
    title: 'Performance Metrics',
    description: 'Evaluasi model dengan comprehensive metrics dan visualisasi'
  },
  {
    icon: Cpu,
    title: 'AI-Powered',
    description: 'Diperkuat dengan Z-AI SDK untuk advanced ML capabilities'
  },
  {
    icon: Zap,
    title: 'Fast Processing',
    description: 'Optimasi performa untuk training dan inference yang cepat'
  },
  {
    icon: Lightbulb,
    title: 'Smart Insights',
    description: 'Dapatkan insights dan rekomendasi dari hasil analisis ML'
  }
]

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <img
                  src="/logo.svg"
                  alt="Z.ai Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  ML Lab
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Machine Learning Laboratory
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                <Activity className="w-3 h-3 mr-1" />
                Active
              </Badge>
              <Button variant="outline" size="sm">
                Documentation
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl"></div>
              <Brain className="relative w-20 h-20 text-blue-600" />
            </div>
          </div>
          <h2 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Machine Learning
            <span className="text-blue-600"> Playground</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-8">
            Eksplorasi, implementasi, dan visualisasi berbagai algoritma Machine Learning 
            dengan interface interaktif dan pembelajaran yang menyenangkan
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="text-sm py-2 px-4">
              🚀 Interactive Learning
            </Badge>
            <Badge variant="secondary" className="text-sm py-2 px-4">
              📊 Real-time Visualization
            </Badge>
            <Badge variant="secondary" className="text-sm py-2 px-4">
              🧠 AI-Powered
            </Badge>
          </div>
        </div>

        {/* ML Models Grid */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Machine Learning Models
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {mlModels.map((model) => {
              const Icon = model.icon
              return (
                <Card 
                  key={model.id}
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 cursor-pointer border-0 ${
                    model.status === 'ready' ? 'hover:border-blue-500' : 'opacity-75'
                  }`}
                  onMouseEnter={() => setHoveredCard(model.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className={`absolute inset-0 ${model.color} opacity-5`}></div>
                  <CardHeader className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${model.color} text-white`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <Badge 
                        variant={model.difficulty === 'Beginner' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {model.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{model.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {model.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {model.features.slice(0, 2).map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {model.features.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{model.features.length - 2}
                          </Badge>
                        )}
                      </div>
                      <Button 
                        className="w-full" 
                        disabled={model.status !== 'ready'}
                        asChild={model.status === 'ready'}
                      >
                        {model.status === 'ready' ? (
                          <Link href={`/${model.id}`}>
                            Explore
                          </Link>
                        ) : (
                          'Coming Soon'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                  {hoveredCard === model.id && model.status === 'ready' && (
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-600/10 to-transparent pointer-events-none"></div>
                  )}
                </Card>
              )
            })}
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">
            Platform Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <div key={idx} className="text-center group">
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8" />
                    </div>
                  </div>
                  <h4 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10+</div>
              <div className="text-blue-100">ML Algorithms</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">Real-time</div>
              <div className="text-blue-100">Training</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">Interactive</div>
              <div className="text-blue-100">Visualization</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">AI</div>
              <div className="text-blue-100">Powered</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}