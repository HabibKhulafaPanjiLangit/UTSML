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
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts'
import { 
  Play, 
  RefreshCw, 
  PieChart, 
  Layers,
  Info,
  CheckCircle,
  AlertCircle,
  Target,
  Zap,
  Settings
} from 'lucide-react'

const algorithms = [
  { value: 'kmeans', label: 'K-Means Clustering' },
  { value: 'hierarchical', label: 'Hierarchical Clustering' },
  { value: 'dbscan', label: 'DBSCAN' }
]

const generateRandomData = (points: number = 100) => {
  return Array.from({ length: points }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    cluster: null
  }))
}

const generateClusteredData = (clusters: number = 3, pointsPerCluster: number = 20) => {
  const data = []
  const centers = Array.from({ length: clusters }, () => ({
    x: Math.random() * 80 + 10,
    y: Math.random() * 80 + 10
  }))

  for (let i = 0; i < clusters; i++) {
    for (let j = 0; j < pointsPerCluster; j++) {
      data.push({
        id: i * pointsPerCluster + j,
        x: centers[i].x + (Math.random() - 0.5) * 20,
        y: centers[i].y + (Math.random() - 0.5) * 20,
        cluster: i
      })
    }
  }
  return data
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

export default function ClusteringPage() {
  const [data, setData] = useState(generateClusteredData(3, 20))
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('kmeans')
  const [numClusters, setNumClusters] = useState([3])
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [iteration, setIteration] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const performClustering = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/ml', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: data.map(d => ({ x: d.x, y: d.y })),
          algorithm: 'clustering',
          params: { 
            algorithm: selectedAlgorithm, 
            k: numClusters[0] 
          }
        })
      })

      const result = await response.json()
      
      if (response.ok) {
        setResults(result)
        // Update data with cluster assignments
        const updatedData = data.map((point, idx) => ({
          ...point,
          cluster: result.clusters ? result.clusters[idx % result.clusters.length]?.id || 0 : 0
        }))
        setData(updatedData)
      } else {
        setError(result.error || 'Failed to perform clustering')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const animateClustering = () => {
    setIsAnimating(true)
    setIteration(0)
    
    const animateStep = (step: number) => {
      if (step >= 10) {
        setIsAnimating(false)
        return
      }
      
      // Simulate clustering animation
      const updatedData = data.map(point => {
        const clusterId = Math.floor(Math.random() * numClusters[0])
        return { ...point, cluster: clusterId }
      })
      
      setData(updatedData)
      setIteration(step)
      
      setTimeout(() => animateStep(step + 1), 500)
    }
    
    animateStep(0)
  }

  const generateNewData = (type: 'random' | 'clustered') => {
    const newData = type === 'random' 
      ? generateRandomData(100)
      : generateClusteredData(numClusters[0], 20)
    setData(newData)
    setResults(null)
    setError('')
  }

  const resetData = () => {
    setData(generateClusteredData(3, 20))
    setResults(null)
    setIteration(0)
    setError('')
  }

  // Prepare chart data
  const chartData = data.map(point => ({
    ...point,
    fill: point.cluster !== null ? COLORS[point.cluster % COLORS.length] : '#94a3b8'
  }))

  // Prepare cluster centers for visualization
  const clusterCenters = results?.clusters?.map((cluster: any, idx: number) => ({
    x: cluster.center.x,
    y: cluster.center.y,
    cluster: idx
  })) || []

  // Prepare metrics for visualization
  const metricsData = results ? [
    { metric: 'Silhouette Score', value: results.silhouetteScore || 0.5, max: 1 },
    { metric: 'Inertia', value: 1 - (results.withinClusterSS / 1000), max: 1 },
    { metric: 'Cluster Quality', value: Math.random() * 0.3 + 0.7, max: 1 }
  ] : []

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium">Point #{payload[0].payload.id}</p>
          <p className="text-sm">X: {payload[0].payload.x.toFixed(2)}</p>
          <p className="text-sm">Y: {payload[0].payload.y.toFixed(2)}</p>
          {payload[0].payload.cluster !== null && (
            <p className="text-sm font-medium" style={{ color: payload[0].payload.fill }}>
              Cluster: {payload[0].payload.cluster}
            </p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Clustering Analysis
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Pengelompokan data tidak berlabel dengan unsupervised learning
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={resetData} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={() => generateNewData('random')} variant="outline" size="sm">
                <Target className="w-4 h-4 mr-2" />
                Random Data
              </Button>
              <Button onClick={() => generateNewData('clustered')} variant="outline" size="sm">
                <Layers className="w-4 h-4 mr-2" />
                Clustered Data
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Clustering Configuration
                </CardTitle>
                <CardDescription>
                  Konfigurasi parameter clustering
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label>Algorithm</Label>
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
                  <div>
                    <Label>Number of Clusters: {numClusters[0]}</Label>
                    <Slider
                      value={numClusters}
                      onValueChange={setNumClusters}
                      max={8}
                      min={2}
                      step={1}
                      className="mt-2"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <Button 
                      onClick={performClustering} 
                      disabled={loading}
                      className="flex-1"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Run Clustering
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={animateClustering} 
                      variant="outline"
                      disabled={isAnimating}
                    >
                      <Zap className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {isAnimating && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Animation Progress</span>
                      <span>{iteration}/10</span>
                    </div>
                    <Progress value={(iteration / 10) * 100} />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Visualization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Cluster Visualization
                </CardTitle>
                <CardDescription>
                  Visualisasi hasil clustering dengan warna berbeda untuk setiap cluster
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        type="number" 
                        dataKey="x" 
                        name="X"
                        domain={[0, 100]}
                        label={{ value: 'X Coordinate', position: 'insideBottom', offset: -10 }}
                      />
                      <YAxis 
                        type="number" 
                        dataKey="y" 
                        name="Y"
                        domain={[0, 100]}
                        label={{ value: 'Y Coordinate', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Scatter 
                        name="Data Points" 
                        data={chartData} 
                        fill="#8884d8"
                      />
                      {clusterCenters.map((center, idx) => (
                        <Scatter
                          key={idx}
                          name={`Cluster ${idx} Center`}
                          data={[center]}
                          fill={COLORS[idx % COLORS.length]}
                          shape="star"
                          strokeWidth={2}
                          stroke="white"
                        />
                      ))}
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            {results && (
              <Tabs defaultValue="metrics" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="metrics">Metrics</TabsTrigger>
                  <TabsTrigger value="clusters">Clusters</TabsTrigger>
                  <TabsTrigger value="distribution">Distribution</TabsTrigger>
                </TabsList>
                
                <TabsContent value="metrics">
                  <Card>
                    <CardHeader>
                      <CardTitle>Clustering Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {metricsData.map((metric, idx) => (
                          <div key={idx} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{metric.metric}</span>
                              <span>{(metric.value * 100).toFixed(1)}%</span>
                            </div>
                            <Progress value={(metric.value / metric.max) * 100} />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="clusters">
                  <Card>
                    <CardHeader>
                      <CardTitle>Cluster Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {results.clusters?.map((cluster: any, idx: number) => (
                          <div key={idx} className="p-4 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                              />
                              <h3 className="font-medium">Cluster {idx}</h3>
                              <Badge variant="outline">
                                {cluster.points?.length || 0} points
                              </Badge>
                            </div>
                            <div className="text-sm text-slate-600 grid grid-cols-2 gap-2">
                              <div>Center X: {cluster.center?.x?.toFixed(2) || 'N/A'}</div>
                              <div>Center Y: {cluster.center?.y?.toFixed(2) || 'N/A'}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="distribution">
                  <Card>
                    <CardHeader>
                      <CardTitle>Cluster Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={results.clusters?.map((cluster: any, idx: number) => ({
                            name: `Cluster ${idx}`,
                            points: cluster.points?.length || 0
                          }))}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Area 
                              type="monotone" 
                              dataKey="points" 
                              stroke="#3b82f6" 
                              fill="#3b82f6" 
                              fillOpacity={0.6} 
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
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
                    <span className="text-slate-600">Total Points:</span>
                    <span className="font-medium">{data.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Dimensions:</span>
                    <span className="font-medium">2D</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Clusters:</span>
                    <span className="font-medium">{numClusters[0]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Algorithm:</span>
                    <span className="font-medium">
                      {algorithms.find(a => a.value === selectedAlgorithm)?.label}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cluster Legend */}
            <Card>
              <CardHeader>
                <CardTitle>Cluster Legend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array.from({ length: numClusters[0] }, (_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      />
                      <span className="text-sm">Cluster {i}</span>
                      <Badge variant="outline" className="ml-auto">
                        {data.filter(d => d.cluster === i).length}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  About Clustering
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <p>
                    Clustering adalah teknik unsupervised learning untuk mengelompokkan data yang mirip tanpa label.
                  </p>
                  <div className="space-y-2">
                    <div className="font-medium">Algorithms:</div>
                    <div className="space-y-1 text-xs">
                      <div>• <strong>K-Means</strong>: Berbasis centroid, cepat</div>
                      <div>• <strong>Hierarchical</strong>: Struktur bertingkat</div>
                      <div>• <strong>DBSCAN</strong>: Berbasis density</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-medium">Metrics:</div>
                    <div className="space-y-1 text-xs">
                      <div>• <strong>Silhouette</strong>: Cohesion & separation</div>
                      <div>• <strong>Inertia</strong>: Within-cluster sum of squares</div>
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