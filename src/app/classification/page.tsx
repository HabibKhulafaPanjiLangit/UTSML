'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'
import { 
  Play, 
  RefreshCw, 
  Target, 
  Brain,
  Info,
  CheckCircle,
  AlertCircle,
  Zap,
  TrendingUp,
  Accuracy
} from 'lucide-react'

const algorithms = [
  { value: 'logistic_regression', label: 'Logistic Regression' },
  { value: 'decision_tree', label: 'Decision Tree' },
  { value: 'random_forest', label: 'Random Forest' },
  { value: 'svm', label: 'Support Vector Machine' },
  { value: 'naive_bayes', label: 'Naive Bayes' }
]

const defaultData = [
  { feature1: 5.1, feature2: 3.5, feature3: 1.4, feature4: 0.2, label: 'setosa' },
  { feature1: 4.9, feature2: 3.0, feature3: 1.4, feature4: 0.2, label: 'setosa' },
  { feature1: 4.7, feature2: 3.2, feature3: 1.3, feature4: 0.2, label: 'setosa' },
  { feature1: 7.0, feature2: 3.2, feature3: 4.7, feature4: 1.4, label: 'versicolor' },
  { feature1: 6.4, feature2: 3.2, feature3: 4.5, feature4: 1.5, label: 'versicolor' },
  { feature1: 6.9, feature2: 3.1, feature3: 4.9, feature4: 1.5, label: 'versicolor' },
  { feature1: 6.3, feature2: 3.3, feature3: 6.0, feature4: 2.5, label: 'virginica' },
  { feature1: 5.8, feature2: 2.7, feature3: 5.1, feature4: 1.9, label: 'virginica' },
  { feature1: 7.1, feature2: 3.0, feature3: 5.9, feature4: 2.1, label: 'virginica' }
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function ClassificationPage() {
  const [data, setData] = useState(defaultData)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('logistic_regression')
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [testData, setTestData] = useState({ feature1: '', feature2: '', feature3: '', feature4: '' })
  const [prediction, setPrediction] = useState<any>(null)

  const performClassification = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/ml', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data,
          algorithm: 'classification',
          params: { algorithm: selectedAlgorithm }
        })
      })

      const result = await response.json()
      
      if (response.ok) {
        setResults(result)
      } else {
        setError(result.error || 'Failed to perform classification')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const makePrediction = () => {
    if (results && Object.values(testData).every(val => val !== '')) {
      // Simulate prediction based on feature values
      const features = Object.values(testData).map(Number)
      const classes = results.classes || ['setosa', 'versicolor', 'virginica']
      
      // Simple mock prediction logic
      let predictedClass = classes[0]
      let confidence = 0.5
      
      if (features[2] > 4) { // feature3 > 4
        predictedClass = classes[2] // virginica
        confidence = 0.8 + Math.random() * 0.2
      } else if (features[2] > 2) { // feature3 > 2
        predictedClass = classes[1] // versicolor
        confidence = 0.7 + Math.random() * 0.3
      } else {
        predictedClass = classes[0] // setosa
        confidence = 0.9 + Math.random() * 0.1
      }
      
      setPrediction({
        class: predictedClass,
        confidence: confidence,
        probabilities: classes.map(cls => ({
          class: cls,
          probability: cls === predictedClass ? confidence : (1 - confidence) / (classes.length - 1)
        }))
      })
    }
  }

  const generateData = () => {
    const classes = ['setosa', 'versicolor', 'virginica']
    const newData = Array.from({ length: 30 }, (_, i) => {
      const classIdx = Math.floor(i / 10)
      const baseValues = [
        [5.0, 3.5, 1.5, 0.3], // setosa
        [6.0, 2.8, 4.5, 1.5], // versicolor
        [6.5, 3.0, 5.5, 2.0]  // virginica
      ][classIdx]
      
      return {
        feature1: baseValues[0] + (Math.random() - 0.5) * 2,
        feature2: baseValues[1] + (Math.random() - 0.5) * 1.5,
        feature3: baseValues[2] + (Math.random() - 0.5) * 1.5,
        feature4: baseValues[3] + (Math.random() - 0.5) * 0.8,
        label: classes[classIdx]
      }
    })
    setData(newData)
    setResults(null)
    setPrediction(null)
  }

  const resetData = () => {
    setData(defaultData)
    setResults(null)
    setPrediction(null)
    setError('')
  }

  // Prepare confusion matrix data
  const confusionMatrixData = results?.confusionMatrix ? 
    results.confusionMatrix.map((row: number[], i: number) => 
      row.map((val: number, j: number) => ({
        actual: results.classes[i],
        predicted: results.classes[j],
        value: val
      }))
    ).flat() : []

  // Prepare metrics data for radar chart
  const metricsData = results ? [
    { metric: 'Accuracy', value: (results.accuracy || 0) * 100, fullMark: 100 },
    { metric: 'Precision', value: (results.precision || 0.8) * 100, fullMark: 100 },
    { metric: 'Recall', value: (results.recall || 0.8) * 100, fullMark: 100 },
    { metric: 'F1-Score', value: (results.f1Score || 0.8) * 100, fullMark: 100 }
  ] : []

  // Prepare class distribution data
  const classDistribution = results?.classes ? 
    results.classes.map((cls: string, i: number) => ({
      name: cls,
      value: data.filter(d => d.label === cls).length
    })) : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Classification Models
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Klasifikasi data dengan berbagai algoritma supervised learning
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={resetData} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={generateData} variant="outline" size="sm">
                <Target className="w-4 h-4 mr-2" />
                Generate Data
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Algorithm Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Algorithm Selection
                </CardTitle>
                <CardDescription>
                  Pilih algoritma klasifikasi yang ingin digunakan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label>Classification Algorithm</Label>
                    <Select value={selectedAlgorithm} onValueChange={setSelectedAlgorithm}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {algorithms.map(algo => (
                          <SelectItem key={algo.value} value={algo.value}>
                            {algo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={performClassification} 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Training...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Train Model
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            {results && (
              <Tabs defaultValue="metrics" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="metrics">Metrics</TabsTrigger>
                  <TabsTrigger value="confusion">Confusion Matrix</TabsTrigger>
                  <TabsTrigger value="distribution">Distribution</TabsTrigger>
                </TabsList>
                
                <TabsContent value="metrics">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Accuracy className="w-5 h-5" />
                        Performance Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600">
                            {((results.accuracy || 0) * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-slate-600">Accuracy</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-600">
                            {((results.precision || 0) * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-slate-600">Precision</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-600">
                            {((results.recall || 0) * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-slate-600">Recall</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-orange-600">
                            {((results.f1Score || 0) * 100).toFixed(1)}%
                          </div>
                          <div className="text-sm text-slate-600">F1-Score</div>
                        </div>
                      </div>
                      
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={metricsData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="metric" />
                            <PolarRadiusAxis angle={90} domain={[0, 100]} />
                            <Radar 
                              name="Performance" 
                              dataKey="value" 
                              stroke="#3b82f6" 
                              fill="#3b82f6" 
                              fillOpacity={0.6} 
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="confusion">
                  <Card>
                    <CardHeader>
                      <CardTitle>Confusion Matrix</CardTitle>
                      <CardDescription>
                        Visualisasi hasil prediksi vs aktual
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={confusionMatrixData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="predicted" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#3b82f6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="distribution">
                  <Card>
                    <CardHeader>
                      <CardTitle>Class Distribution</CardTitle>
                      <CardDescription>
                        Distribusi kelas dalam dataset
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={classDistribution}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {classDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}

            {/* Prediction */}
            {results && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Make Prediction
                  </CardTitle>
                  <CardDescription>
                    Test model dengan data baru
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <Label htmlFor="feature1">Feature 1</Label>
                      <Input
                        id="feature1"
                        type="number"
                        value={testData.feature1}
                        onChange={(e) => setTestData({...testData, feature1: e.target.value})}
                        placeholder="Enter value"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="feature2">Feature 2</Label>
                      <Input
                        id="feature2"
                        type="number"
                        value={testData.feature2}
                        onChange={(e) => setTestData({...testData, feature2: e.target.value})}
                        placeholder="Enter value"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="feature3">Feature 3</Label>
                      <Input
                        id="feature3"
                        type="number"
                        value={testData.feature3}
                        onChange={(e) => setTestData({...testData, feature3: e.target.value})}
                        placeholder="Enter value"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="feature4">Feature 4</Label>
                      <Input
                        id="feature4"
                        type="number"
                        value={testData.feature4}
                        onChange={(e) => setTestData({...testData, feature4: e.target.value})}
                        placeholder="Enter value"
                        step="0.1"
                      />
                    </div>
                  </div>
                  <Button onClick={makePrediction} className="w-full mb-4">
                    Predict Class
                  </Button>
                  
                  {prediction && (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Predicted Class:</div>
                        <div className="text-2xl font-bold text-green-600 capitalize">
                          {prediction.class}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          Confidence: {(prediction.confidence * 100).toFixed(1)}%
                        </div>
                      </div>
                      
                      {prediction.probabilities && (
                        <div>
                          <Label className="text-sm font-medium">Class Probabilities:</Label>
                          <div className="mt-2 space-y-2">
                            {prediction.probabilities.map((prob: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-2">
                                <div className="w-20 text-sm capitalize">{prob.class}</div>
                                <Progress value={prob.probability * 100} className="flex-1" />
                                <div className="text-sm w-12 text-right">
                                  {(prob.probability * 100).toFixed(1)}%
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Dataset Info */}
            <Card>
              <CardHeader>
                <CardTitle>Dataset Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Samples:</span>
                    <span className="font-medium">{data.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Features:</span>
                    <span className="font-medium">4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Classes:</span>
                    <span className="font-medium">{results?.classes?.length || 3}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Algorithm:</span>
                    <span className="font-medium capitalize">
                      {algorithms.find(a => a.value === selectedAlgorithm)?.label}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  About Classification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <p>
                    Klasifikasi adalah proses memprediksi kategori atau label dari data berdasarkan fitur-fiturnya.
                  </p>
                  <div className="space-y-2">
                    <div className="font-medium">Metrics:</div>
                    <div className="space-y-1 text-xs">
                      <div>• <strong>Accuracy</strong>: Properti prediksi benar</div>
                      <div>• <strong>Precision</strong>: Positif prediksi yang benar</div>
                      <div>• <strong>Recall</strong>: Positif aktual yang terdeteksi</div>
                      <div>• <strong>F1-Score</strong>: Harmonik precision dan recall</div>
                    </div>
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