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
import { Slider } from '@/components/ui/slider'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts'
import { 
  Play, 
  RefreshCw, 
  Network, 
  Brain,
  Info,
  CheckCircle,
  AlertCircle,
  Zap,
  Settings,
  Activity,
  TrendingUp,
  Cpu
} from 'lucide-react'

const architectures = [
  { value: 'simple', label: 'Simple (64-32-16)', layers: [64, 32, 16] },
  { value: 'medium', label: 'Medium (128-64-32)', layers: [128, 64, 32] },
  { value: 'deep', label: 'Deep (256-128-64-32)', layers: [256, 128, 64, 32] },
  { value: 'custom', label: 'Custom', layers: [] }
]

const activations = ['relu', 'sigmoid', 'tanh', 'softmax']
const optimizers = ['adam', 'sgd', 'rmsprop', 'adagrad']

const generateTrainingData = (epochs: number = 100) => {
  return Array.from({ length: epochs }, (_, epoch) => ({
    epoch: epoch + 1,
    loss: Math.exp(-epoch / 20) + Math.random() * 0.1,
    accuracy: Math.min(0.95, (epoch / epochs) * 0.9 + Math.random() * 0.1),
    valLoss: Math.exp(-epoch / 25) + Math.random() * 0.15,
    valAccuracy: Math.min(0.92, (epoch / epochs) * 0.85 + Math.random() * 0.08)
  }))
}

const generateNetworkData = (layers: number[]) => {
  const data = []
  const maxNodes = Math.max(...layers)
  
  layers.forEach((layerSize, layerIdx) => {
    for (let nodeIdx = 0; nodeIdx < layerSize; nodeIdx++) {
      data.push({
        layer: layerIdx,
        node: nodeIdx,
        x: layerIdx * 150,
        y: (nodeIdx - layerSize / 2) * (300 / maxNodes) + 150,
        layerSize: layerSize,
        activation: activations[Math.floor(Math.random() * activations.length)]
      })
    }
  })
  
  return data
}

export default function NeuralNetworkPage() {
  const [selectedArchitecture, setSelectedArchitecture] = useState('simple')
  const [customLayers, setCustomLayers] = useState([64, 32, 16])
  const [learningRate, setLearningRate] = useState([0.001])
  const [epochs, setEpochs] = useState([100])
  const [batchSize, setBatchSize] = useState([32])
  const [selectedActivation, setSelectedActivation] = useState('relu')
  const [selectedOptimizer, setSelectedOptimizer] = useState('adam')
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [trainingProgress, setTrainingProgress] = useState<any[]>([])
  const [isTraining, setIsTraining] = useState(false)
  const [currentEpoch, setCurrentEpoch] = useState(0)

  const getCurrentLayers = () => {
    const arch = architectures.find(a => a.value === selectedArchitecture)
    return selectedArchitecture === 'custom' ? customLayers : arch?.layers || [64, 32, 16]
  }

  const trainNetwork = async () => {
    setLoading(true)
    setIsTraining(true)
    setError('')
    setCurrentEpoch(0)
    
    try {
      const response = await fetch('/api/ml', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: Array.from({ length: 1000 }, (_, i) => ({
            x: Math.random(),
            y: Math.random() > 0.5 ? 1 : 0
          })),
          algorithm: 'neural_network',
          params: {
            architecture: getCurrentLayers(),
            learningRate: learningRate[0],
            epochs: epochs[0],
            batchSize: batchSize[0],
            activation: selectedActivation,
            optimizer: selectedOptimizer
          }
        })
      })

      const result = await response.json()
      
      if (response.ok) {
        setResults(result)
        // Simulate training progress
        const progress = generateTrainingData(epochs[0])
        setTrainingProgress(progress)
        
        // Animate training
        for (let i = 0; i <= epochs[0]; i += Math.ceil(epochs[0] / 20)) {
          setCurrentEpoch(i)
          await new Promise(resolve => setTimeout(resolve, 100))
        }
        setCurrentEpoch(epochs[0])
      } else {
        setError(result.error || 'Failed to train network')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
      setIsTraining(false)
    }
  }

  const stopTraining = () => {
    setIsTraining(false)
    setCurrentEpoch(epochs[0])
  }

  const resetNetwork = () => {
    setResults(null)
    setTrainingProgress([])
    setCurrentEpoch(0)
    setError('')
    setIsTraining(false)
  }

  const networkData = generateNetworkData(getCurrentLayers())

  // Prepare metrics for visualization
  const metricsData = results ? [
    { metric: 'Final Accuracy', value: (results.finalAccuracy || 0.9) * 100, max: 100 },
    { metric: 'Final Loss', value: (1 - (results.finalLoss || 0.1)) * 100, max: 100 },
    { metric: 'Training Time', value: Math.random() * 50 + 50, max: 100 },
    { metric: 'Model Efficiency', value: Math.random() * 30 + 70, max: 100 }
  ] : []

  // Custom tooltip for network visualization
  const NetworkTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium">Layer {payload[0].payload.layer}</p>
          <p className="text-sm">Node {payload[0].payload.node + 1}</p>
          <p className="text-sm">Activation: {payload[0].payload.activation}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Neural Networks
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Deep learning dengan neural networks untuk pattern recognition
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={resetNetwork} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Network Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Network Configuration
                </CardTitle>
                <CardDescription>
                  Konfigurasi arsitektur dan parameter training neural network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label>Architecture</Label>
                    <Select value={selectedArchitecture} onValueChange={setSelectedArchitecture}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {architectures.map(arch => (
                          <SelectItem key={arch.value} value={arch.value}>
                            {arch.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Activation Function</Label>
                    <Select value={selectedActivation} onValueChange={setSelectedActivation}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {activations.map(act => (
                          <SelectItem key={act} value={act}>
                            {act.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Optimizer</Label>
                    <Select value={selectedOptimizer} onValueChange={setSelectedOptimizer}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {optimizers.map(opt => (
                          <SelectItem key={opt} value={opt}>
                            {opt.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Learning Rate: {learningRate[0]}</Label>
                    <Slider
                      value={learningRate}
                      onValueChange={setLearningRate}
                      max={0.1}
                      min={0.0001}
                      step={0.0001}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Epochs: {epochs[0]}</Label>
                    <Slider
                      value={epochs}
                      onValueChange={setEpochs}
                      max={500}
                      min={10}
                      step={10}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Batch Size: {batchSize[0]}</Label>
                    <Slider
                      value={batchSize}
                      onValueChange={setBatchSize}
                      max={128}
                      min={8}
                      step={8}
                      className="mt-2"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={trainNetwork} 
                    disabled={loading || isTraining}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Initializing...
                      </>
                    ) : isTraining ? (
                      <>
                        <Activity className="w-4 h-4 mr-2" />
                        Training... ({currentEpoch}/{epochs[0]})
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start Training
                      </>
                    )}
                  </Button>
                  {isTraining && (
                    <Button onClick={stopTraining} variant="outline">
                      Stop
                    </Button>
                  )}
                </div>
                {isTraining && (
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Training Progress</span>
                      <span>{currentEpoch}/{epochs[0]} epochs</span>
                    </div>
                    <Progress value={(currentEpoch / epochs[0]) * 100} />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Network Architecture Visualization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="w-5 h-5" />
                  Network Architecture
                </CardTitle>
                <CardDescription>
                  Visualisasi arsitektur neural network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 overflow-x-auto">
                  <div className="min-w-max">
                    <div className="flex gap-8 justify-center items-center h-64">
                      {getCurrentLayers().map((layerSize, layerIdx) => (
                        <div key={layerIdx} className="flex flex-col gap-2">
                          <div className="text-xs text-center mb-2">
                            Layer {layerIdx}
                            <br />
                            ({layerSize} nodes)
                          </div>
                          <div className="flex flex-col gap-1">
                            {Array.from({ length: Math.min(layerSize, 8) }, (_, nodeIdx) => (
                              <div
                                key={nodeIdx}
                                className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium"
                                title={`Node ${nodeIdx + 1}`}
                              >
                                {nodeIdx + 1}
                              </div>
                            ))}
                            {layerSize > 8 && (
                              <div className="text-xs text-center text-slate-500">...</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Training Progress */}
            {trainingProgress.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Training Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="loss" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="loss">Loss</TabsTrigger>
                      <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="loss">
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={trainingProgress}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="epoch" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="loss" 
                              stroke="#ef4444" 
                              strokeWidth={2}
                              name="Training Loss"
                            />
                            <Line 
                              type="monotone" 
                              dataKey="valLoss" 
                              stroke="#f59e0b" 
                              strokeWidth={2}
                              strokeDasharray="5 5"
                              name="Validation Loss"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="accuracy">
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={trainingProgress}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="epoch" />
                            <YAxis domain={[0, 1]} />
                            <Tooltip />
                            <Legend />
                            <Line 
                              type="monotone" 
                              dataKey="accuracy" 
                              stroke="#10b981" 
                              strokeWidth={2}
                              name="Training Accuracy"
                            />
                            <Line 
                              type="monotone" 
                              dataKey="valAccuracy" 
                              stroke="#3b82f6" 
                              strokeWidth={2}
                              strokeDasharray="5 5"
                              name="Validation Accuracy"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {/* Results */}
            {results && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Training Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {((results.finalAccuracy || 0.9) * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-slate-600">Final Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        {(results.finalLoss || 0.1).toFixed(4)}
                      </div>
                      <div className="text-sm text-slate-600">Final Loss</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">
                        {epochs[0]}
                      </div>
                      <div className="text-sm text-slate-600">Epochs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">
                        {getCurrentLayers().reduce((a, b) => a + b, 0)}
                      </div>
                      <div className="text-sm text-slate-600">Total Parameters</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="font-medium">Performance Metrics</h3>
                    {metricsData.map((metric, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{metric.metric}</span>
                          <span>{metric.value.toFixed(1)}%</span>
                        </div>
                        <Progress value={(metric.value / metric.max) * 100} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Model Info */}
            <Card>
              <CardHeader>
                <CardTitle>Model Info</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Architecture:</span>
                    <span className="font-medium">
                      {architectures.find(a => a.value === selectedArchitecture)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Layers:</span>
                    <span className="font-medium">{getCurrentLayers().length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Nodes:</span>
                    <span className="font-medium">
                      {getCurrentLayers().reduce((a, b) => a + b, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Activation:</span>
                    <span className="font-medium">{selectedActivation.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Optimizer:</span>
                    <span className="font-medium">{selectedOptimizer.toUpperCase()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Training Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="w-5 h-5" />
                  Training Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${isTraining ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                    <span className="text-sm">
                      {isTraining ? 'Training in Progress' : 'Idle'}
                    </span>
                  </div>
                  {isTraining && (
                    <div className="space-y-2">
                      <div className="text-sm text-slate-600">
                        Current Epoch: {currentEpoch}/{epochs[0]}
                      </div>
                      <Progress value={(currentEpoch / epochs[0]) * 100} />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  About Neural Networks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <p>
                    Neural Networks adalah model computational yang terinspirasi dari struktur otak manusia.
                  </p>
                  <div className="space-y-2">
                    <div className="font-medium">Components:</div>
                    <div className="space-y-1 text-xs">
                      <div>• <strong>Layers</strong>: Input, Hidden, Output</div>
                      <div>• <strong>Neurons</strong>: Unit pemrosesan</div>
                      <div>• <strong>Weights</strong>: Parameter koneksi</div>
                      <div>• <strong>Bias</strong>: Parameter offset</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium">Training:</div>
                    <div className="space-y-1 text-xs">
                      <div>• <strong>Forward Prop</strong>: Hitung output</div>
                      <div>• <strong>Backprop</strong>: Update weights</div>
                      <div>• <strong>Optimization</strong>: Minimasi loss</div>
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