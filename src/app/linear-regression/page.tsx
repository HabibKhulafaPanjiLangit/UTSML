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
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ReferenceLine
} from 'recharts'
import { 
  Play, 
  RefreshCw, 
  Download, 
  TrendingUp, 
  Calculator,
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const defaultData = [
  { x: 1, y: 2.5 },
  { x: 2, y: 3.8 },
  { x: 3, y: 5.2 },
  { x: 4, y: 6.1 },
  { x: 5, y: 7.8 },
  { x: 6, y: 8.9 },
  { x: 7, y: 10.2 },
  { x: 8, y: 11.5 }
]

export default function LinearRegressionPage() {
  const [data, setData] = useState(defaultData)
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [newX, setNewX] = useState('')
  const [prediction, setPrediction] = useState<number | null>(null)

  const performRegression = async () => {
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
          algorithm: 'linear_regression',
          params: {}
        })
      })

      const result = await response.json()
      
      if (response.ok) {
        setResults(result)
      } else {
        setError(result.error || 'Failed to perform regression')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const makePrediction = () => {
    if (results && newX) {
      const x = parseFloat(newX)
      if (!isNaN(x)) {
        const pred = results.slope * x + results.intercept
        setPrediction(pred)
      }
    }
  }

  const addDataPoint = () => {
    const newPoint = {
      x: data.length + 1,
      y: Math.random() * 10 + 2
    }
    setData([...data, newPoint])
  }

  const resetData = () => {
    setData(defaultData)
    setResults(null)
    setPrediction(null)
    setError('')
  }

  const generateData = () => {
    const newData = Array.from({ length: 20 }, (_, i) => ({
      x: i + 1,
      y: (i + 1) * 1.5 + Math.random() * 4 - 2
    }))
    setData(newData)
    setResults(null)
  }

  const chartData = data.map(point => ({
    ...point,
    predicted: results ? results.slope * point.x + results.intercept : null
  }))

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium">X: {payload[0].payload.x}</p>
          <p className="text-sm text-blue-600">Actual Y: {payload[0].payload.y.toFixed(2)}</p>
          {payload[0].payload.predicted && (
            <p className="text-sm text-red-600">Predicted Y: {payload[0].payload.predicted.toFixed(2)}</p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                Linear Regression
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Analisis regresi linear dengan visualisasi interaktif dan prediksi real-time
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={resetData} variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={generateData} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Generate Data
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Visualization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Data Visualization
                </CardTitle>
                <CardDescription>
                  Visualisasi data points dan garis regresi linear
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="x" 
                        name="X" 
                        type="number"
                        label={{ value: 'X Variable', position: 'insideBottom', offset: -10 }}
                      />
                      <YAxis 
                        dataKey="y" 
                        name="Y" 
                        type="number"
                        label={{ value: 'Y Variable', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Scatter 
                        name="Data Points" 
                        data={chartData} 
                        fill="#3b82f6"
                      />
                      {results && (
                        <ReferenceLine 
                          segment={[
                            { x: 0, y: results.intercept },
                            { x: Math.max(...data.map(d => d.x)), 
                              y: results.slope * Math.max(...data.map(d => d.x)) + results.intercept }
                          ]}
                          stroke="#ef4444"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                        />
                      )}
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            {results && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Regression Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Equation</Label>
                        <div className="text-lg font-mono bg-slate-100 dark:bg-slate-800 p-3 rounded">
                          {results.equation}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Slope (m)</Label>
                        <div className="text-2xl font-bold text-blue-600">
                          {results.slope?.toFixed(4)}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Intercept (b)</Label>
                        <div className="text-2xl font-bold text-green-600">
                          {results.intercept?.toFixed(4)}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-slate-600">R-squared</Label>
                        <div className="text-2xl font-bold text-purple-600">
                          {results.rSquared?.toFixed(4)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Prediction */}
            {results && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="w-5 h-5" />
                    Make Prediction
                  </CardTitle>
                  <CardDescription>
                    Gunakan model regresi untuk memprediksi nilai Y baru
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <Label htmlFor="x-input">X Value</Label>
                      <Input
                        id="x-input"
                        type="number"
                        value={newX}
                        onChange={(e) => setNewX(e.target.value)}
                        placeholder="Enter X value"
                      />
                    </div>
                    <Button onClick={makePrediction}>
                      Predict Y
                    </Button>
                  </div>
                  {prediction !== null && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Predicted Y Value:</div>
                      <div className="text-3xl font-bold text-blue-600">
                        {prediction.toFixed(4)}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={performRegression} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Run Regression
                    </>
                  )}
                </Button>
                <Button 
                  onClick={addDataPoint} 
                  variant="outline" 
                  className="w-full"
                >
                  Add Data Point
                </Button>
              </CardContent>
            </Card>

            {/* Data Info */}
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
                    <span className="text-slate-600">X Range:</span>
                    <span className="font-medium">
                      {Math.min(...data.map(d => d.x))} - {Math.max(...data.map(d => d.x))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Y Range:</span>
                    <span className="font-medium">
                      {Math.min(...data.map(d => d.y)).toFixed(2)} - {Math.max(...data.map(d => d.y)).toFixed(2)}
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
                  About Linear Regression
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                  <p>
                    Linear regression adalah metode statistik untuk memodelkan hubungan antara variabel dependen (Y) dan independen (X).
                  </p>
                  <div className="space-y-2">
                    <div className="font-medium">Rumus:</div>
                    <div className="font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded text-center">
                      Y = mX + b
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div>• <strong>m</strong>: Slope (kemiringan garis)</div>
                    <div>• <strong>b</strong>: Intercept (titik potong sumbu Y)</div>
                    <div>• <strong>R²</strong>: Koefisien determinasi</div>
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