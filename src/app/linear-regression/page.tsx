// Halaman Regresi Linear - Refaktor Total
'use client';
import { useState, useEffect, ChangeEvent, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ReferenceLine } from 'recharts';
import html2canvas from 'html2canvas';
import { Play, RefreshCw, Download, TrendingUp, Calculator, Info, CheckCircle, AlertCircle, Moon, Sun } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import dynamic from 'next/dynamic';

const defaultData = [
	{ x: 1, y: 2.5 },
	{ x: 2, y: 3.8 },
	{ x: 3, y: 5.2 },
	{ x: 4, y: 6.1 },
	{ x: 5, y: 7.8 },
	{ x: 6, y: 8.9 },
	{ x: 7, y: 10.2 },
	{ x: 8, y: 11.5 },
];

type RegressionResults = {
	slope: number;
	intercept: number;
	rSquared: number;
	equation: string;
};

export default function LinearRegressionPage() {
	// State utama
	const [data, setData] = useState(defaultData);
	const [results, setResults] = useState<RegressionResults | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [newX, setNewX] = useState('');
	const [prediction, setPrediction] = useState<number | null>(null);
	const [mae, setMae] = useState<number | null>(null);
	const [rmse, setRmse] = useState<number | null>(null);
	const [residuals, setResiduals] = useState<{ x: number; residual: number }[]>([]);
	const [darkMode, setDarkMode] = useState(false);
	const [inputError, setInputError] = useState('');
	const [xRange, setXRange] = useState<[number, number]>([1, 8]);
	const [chartType, setChartType] = useState<'scatter' | 'line'>('scatter');
	const [chartColor, setChartColor] = useState('#3b82f6');
	const [exportFormat, setExportFormat] = useState<'png' | 'jpg' | 'svg' | 'pdf'>('png');

	// Fungsi regresi linear sederhana
	function linearRegression(data: { x: number; y: number }[]): RegressionResults | null {
		const n = data.length;
		if (n < 2) return null;
		const sumX = data.reduce((a, b) => a + b.x, 0);
		const sumY = data.reduce((a, b) => a + b.y, 0);
		const sumXY = data.reduce((a, b) => a + b.x * b.y, 0);
		const sumX2 = data.reduce((a, b) => a + b.x * b.x, 0);
		const meanX = sumX / n;
		const meanY = sumY / n;
		const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
		const intercept = meanY - slope * meanX;
		const ssTot = data.reduce((a, b) => a + Math.pow(b.y - meanY, 2), 0);
		const ssRes = data.reduce((a, b) => a + Math.pow(b.y - (slope * b.x + intercept), 2), 0);
		const rSquared = 1 - ssRes / ssTot;
		return {
			slope,
			intercept,
			rSquared,
			equation: `Y = ${slope.toFixed(4)}X + ${intercept.toFixed(4)}`,
		};
	}

	// Hitung regresi saat data berubah
	useEffect(() => {
		const res = linearRegression(data);
		setResults(res);
		if (res) {
			const resids = data.map((d) => ({ x: d.x, residual: d.y - (res.slope * d.x + res.intercept) }));
			setResiduals(resids);
			const absErrors = resids.map((r) => Math.abs(r.residual));
			const squaredErrors = resids.map((r) => r.residual ** 2);
			setMae(absErrors.reduce((a, b) => a + b, 0) / absErrors.length);
			setRmse(Math.sqrt(squaredErrors.reduce((a, b) => a + b, 0) / squaredErrors.length));
		} else {
			setMae(null);
			setRmse(null);
			setResiduals([]);
		}
	}, [data]);

	// Fungsi prediksi
	const makePrediction = () => {
		if (!newX || isNaN(Number(newX))) {
			setInputError('Input X harus berupa angka dan tidak boleh kosong.');
			setPrediction(null);
			return;
		}
		setInputError('');
		if (results) {
			const x = parseFloat(newX);
			setPrediction(results.slope * x + results.intercept);
		}
	};

	// Fungsi export chart ke gambar
	async function downloadChartImage() {
		const chartArea = document.getElementById('chart-capture-area');
		if (!chartArea) return;
		const canvas = await html2canvas(chartArea);
		const link = document.createElement('a');
		link.download = 'chart_regresi_linear.png';
		link.href = canvas.toDataURL('image/png');
		link.click();
	}

	// Fungsi export chart ke PDF
	async function exportChartAndSummaryToPDF() {
		const doc = new jsPDF();
		const chartArea = document.getElementById('chart-capture-area');
		if (chartArea) {
			const canvas = await html2canvas(chartArea);
			const imgData = canvas.toDataURL('image/png');
			doc.addImage(imgData, 'PNG', 10, 10, 180, 80);
		}
		let y = 95;
		if (results) {
			doc.setFontSize(12);
			doc.text(`Persamaan: ${results.equation}`, 10, y);
			y += 8;
			doc.text(`Slope: ${results.slope?.toFixed(4)}`, 10, y);
		}
		doc.save('ringkasan_regresi_linear.pdf');
	}

	// Fungsi export data ke Excel
	const exportToXLSX = () => {
		if (!results) return;
		const header = ['X', 'Y', 'Prediksi'];
		const rows = data.map((d) => [d.x, d.y, results.slope * d.x + results.intercept]);
		const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
		const summary = [
			['Persamaan', results.equation],
			['Slope', results.slope],
			['Intercept', results.intercept],
			['R-kuadrat', results.rSquared],
		];
		const wsSummary = XLSX.utils.aoa_to_sheet(summary);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Data');
		XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan');
		XLSX.writeFile(wb, 'hasil_regresi_linear.xlsx');
	};

	// Fungsi export ke CSV
	const exportToCSV = () => {
		if (!results) return;
		const header = ['X', 'Y', 'Prediksi'];
		const rows = data.map((d) => [d.x, d.y, results.slope * d.x + results.intercept]);
		const csv = [header, ...rows].map((r) => r.join(',')).join('\n');
		const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'hasil_regresi_linear.csv';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
			reader.onload = (evt) => {
				try {
					const dataStr = evt.target?.result;
					if (!dataStr) return;
					let rows: any[] = [];
					if (file.name.endsWith('.csv')) {
						// Parse CSV
						const lines = (dataStr as string).split('\n').map(l => l.trim()).filter(Boolean);
						if (lines.length > 1001) {
							setError('File terlalu besar, maksimal 1000 baris data.');
							return;
						}
						const header = lines[0].split(',');
						rows = lines.slice(1).map(line => {
							const values = line.split(',');
							const obj: any = {};
							header.forEach((h, i) => obj[h] = isNaN(Number(values[i])) ? values[i] : Number(values[i]));
							return obj;
						});
					} else {
						// Parse Excel
						const workbook = XLSX.read(dataStr, { type: 'binary' });
						const sheetName = workbook.SheetNames[0];
						const sheet = workbook.Sheets[sheetName];
						rows = XLSX.utils.sheet_to_json(sheet);
						if (rows.length > 1000) {
							setError('File terlalu besar, maksimal 1000 baris data.');
							return;
						}
					}
					setError('');
					setData(rows);
					setResults(null);
					setPrediction(null);
				} catch (err) {
					setError('Format file tidak valid atau terjadi error saat parsing.');
				}
			};
		if (file.name.endsWith('.csv')) {
			reader.readAsText(file);
		} else {
			reader.readAsBinaryString(file);
		}
	};

	// Place this just before return
	const referenceLineSegment = results && results.intercept !== undefined && results.slope !== undefined
		? [
				{ x: 0, y: results.intercept },
				{ x: Math.max(...data.map((d) => d.x)), y: results.slope * Math.max(...data.map((d) => d.x)) + results.intercept },
			]
		: [
				{ x: 0, y: 0 },
				{ x: Math.max(...data.map((d) => d.x)), y: 0 },
			];

	// Komponen chart dan UI
	return (
		<div className="min-h-screen bg-blue-50 p-4">
			<div className="container mx-auto max-w-4xl">
				<h1 className="text-3xl font-bold mb-4">Regresi Linear - Demo UTS</h1>
				<div className="flex gap-2 mb-2">
					<input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} className="border rounded px-2 py-1 text-sm" />
					<Button onClick={exportToXLSX} variant="outline" size="sm">Export Excel</Button>
					<Button onClick={exportToCSV} variant="outline" size="sm">Export CSV</Button>
				</div>
				<div className="mt-4 p-4 bg-blue-100 rounded text-blue-900 text-sm">
					<strong>Penjelasan Hasil Analisis:</strong><br />
					{results && (
						<>
							Persamaan regresi linear: <b>{results.equation}</b><br />
							Slope menunjukkan perubahan rata-rata Y untuk setiap kenaikan 1 unit X.<br />
							Intercept adalah nilai Y saat X = 0.<br />
							R-kuadrat mengukur seberapa baik model menjelaskan variasi data (semakin mendekati 1, semakin baik).<br />
							MAE dan RMSE adalah ukuran error prediksi, semakin kecil semakin baik.<br />
						</>
					)}
				</div>
				<div className="text-xs text-slate-600 dark:text-slate-400 mb-4">Upload file data (CSV/Excel) untuk mengolah data manual. Export hasil ke Excel/CSV untuk analisis dan perhitungan di aplikasi lain seperti Microsoft Excel. Sheet Ringkasan berisi penjelasan hasil regresi.</div>
				<Card className="mb-6">
					<CardHeader>
						<CardTitle>Visualisasi Data & Garis Regresi</CardTitle>
						<CardDescription>Grafik titik data dan garis hasil regresi linear</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="h-96" id="chart-capture-area">
							<ResponsiveContainer width="100%" height="100%">
								<ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="x" name="X" type="number" label={{ value: 'X', position: 'insideBottom', offset: -10 }} />
									<YAxis dataKey="y" name="Y" type="number" label={{ value: 'Y', angle: -90, position: 'insideLeft' }} />
									<Tooltip />
									<Legend />
									<Scatter name="Data" data={data} fill="#3b82f6" />
									<ReferenceLine segment={referenceLineSegment} stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
								</ScatterChart>
							</ResponsiveContainer>
						</div>
						<div className="flex flex-col gap-2 mb-4">
							<div className="flex gap-2">
								<input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} className="border rounded px-2 py-1 text-sm" />
								<Button onClick={exportToXLSX} variant="outline" size="sm">Export Excel</Button>
								<Button onClick={exportToCSV} variant="outline" size="sm">Export CSV</Button>
							</div>
							<div className="text-xs text-slate-600 dark:text-slate-400">Upload file data (CSV/Excel) untuk mengolah data manual. Export hasil ke Excel/CSV untuk analisis dan perhitungan di aplikasi lain seperti Microsoft Excel. Sheet Ringkasan berisi penjelasan hasil regresi dan analisis.</div>
						</div>
					</CardContent>
				</Card>
				{results && (
					<Card className="mb-6">
						<CardHeader>
							<CardTitle>Hasil Regresi</CardTitle>
						</CardHeader>
						<CardContent>
							{results ? (
								<div className="mb-2">Persamaan: <span className="font-mono">{results.equation}</span></div>
							) : (
								<div className="mb-2">Persamaan: <span className="font-mono">-</span></div>
							)}
							{results && results.slope !== undefined ? (
								<div className="mb-2">Slope: <b>{results.slope.toFixed(4)}</b></div>
							) : (
								<div className="mb-2">Slope: <b>-</b></div>
							)}
							{results && results.intercept !== undefined ? (
								<div className="mb-2">Intercept: <b>{results.intercept.toFixed(4)}</b></div>
							) : (
								<div className="mb-2">Intercept: <b>-</b></div>
							)}
							{results && results.rSquared !== undefined ? (
								<div className="mb-2">R-kuadrat: <b>{results.rSquared.toFixed(4)}</b></div>
							) : (
								<div className="mb-2">R-kuadrat: <b>-</b></div>
							)}
							<div className="mb-2">MAE: <b>{mae?.toFixed(4)}</b></div>
							<div className="mb-2">RMSE: <b>{rmse?.toFixed(4)}</b></div>
							<div className="flex gap-2 mt-4">
								<Button onClick={exportToXLSX} variant="outline">Export Excel</Button>
								<Button onClick={exportToCSV} variant="outline">Export CSV</Button>
							</div>
						</CardContent>
					</Card>
				)}
				<Card className="mb-6">
					<CardHeader>
						<CardTitle>Prediksi Nilai Y</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex gap-4 items-end">
							<div>
								<Label htmlFor="x-input">Nilai X</Label>
								<Input id="x-input" value={newX} onChange={e => setNewX(e.target.value)} className="w-24" />
							</div>
							<Button onClick={makePrediction}>Prediksi Y</Button>
						</div>
						{prediction !== null && (
							<div className="mt-4 p-4 bg-blue-100 rounded-lg">
								<div className="text-sm mb-1">Hasil Prediksi Y:</div>
								{typeof prediction === 'number' ? (
									<div className="text-2xl font-bold text-blue-600">{prediction.toFixed(4)}</div>
								) : (
									<div className="text-2xl font-bold text-blue-600">-</div>
								)}
							</div>
						)}
						{inputError && <div className="mt-2 text-red-600 text-sm">{inputError}</div>}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
