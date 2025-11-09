import { NextResponse } from 'next/server';

function linearRegression(data: { x: number; y: number }[]) {
  const n = data.length;
  if (n < 2) return null;
  const sumX = data.reduce((acc, d) => acc + d.x, 0);
  const sumY = data.reduce((acc, d) => acc + d.y, 0);
  const sumXY = data.reduce((acc, d) => acc + d.x * d.y, 0);
  const sumX2 = data.reduce((acc, d) => acc + d.x * d.x, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  const equation = `Y = ${slope.toFixed(4)}X + ${intercept.toFixed(4)}`;
  // R^2
  const meanY = sumY / n;
  const ssTot = data.reduce((acc, d) => acc + (d.y - meanY) ** 2, 0);
  const ssRes = data.reduce((acc, d) => acc + (d.y - (slope * d.x + intercept)) ** 2, 0);
  const rSquared = 1 - ssRes / ssTot;
  return { slope, intercept, equation, rSquared };
}

function polynomialRegression(data: { x: number; y: number }[]) {
  // Quadratic fit (degree=2)
  const n = data.length;
  if (n < 3) return null;
  const X = data.map(d => d.x);
  const Y = data.map(d => d.y);
  let sumX = 0, sumX2 = 0, sumX3 = 0, sumX4 = 0, sumY = 0, sumXY = 0, sumX2Y = 0;
  for (let i = 0; i < n; i++) {
    sumX += X[i];
    sumX2 += X[i] ** 2;
    sumX3 += X[i] ** 3;
    sumX4 += X[i] ** 4;
    sumY += Y[i];
    sumXY += X[i] * Y[i];
    sumX2Y += (X[i] ** 2) * Y[i];
  }
  const D = n * (sumX2 * sumX4 - sumX3 * sumX3) - sumX * (sumX * sumX4 - sumX3 * sumX2) + sumX2 * (sumX * sumX3 - sumX2 * sumX2);
  if (D === 0) return null;
  const Dc = sumY * (sumX2 * sumX4 - sumX3 * sumX3) - sumX * (sumXY * sumX4 - sumX3 * sumX2Y) + sumX2 * (sumXY * sumX3 - sumX2 * sumX2Y);
  const Db = n * (sumXY * sumX4 - sumX3 * sumX2Y) - sumY * (sumX * sumX4 - sumX3 * sumX2) + sumX2 * (sumX * sumX2Y - sumXY * sumX2);
  const Da = n * (sumX2 * sumX2Y - sumXY * sumX3) - sumX * (sumX * sumX2Y - sumXY * sumX2) + sumY * (sumX * sumX3 - sumX2 * sumX2);
  const c = Dc / D;
  const b = Db / D;
  const a = Da / D;
  const equation = `Y = ${a.toFixed(4)}X² + ${b.toFixed(4)}X + ${c.toFixed(4)}`;
  return { a, b, c, equation };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { data, type } = body;
    if (!Array.isArray(data)) return NextResponse.json({ error: 'Data harus array' }, { status: 400 });
  let result: any = null;
  if (type === 'linear') result = linearRegression(data);
  else if (type === 'polynomial') result = polynomialRegression(data);
  else return NextResponse.json({ error: 'Tipe model tidak valid' }, { status: 400 });
  if (!result) return NextResponse.json({ error: 'Gagal menghitung model' }, { status: 400 });
  return NextResponse.json({ result });
  } catch (err) {
    return NextResponse.json({ error: 'Request tidak valid' }, { status: 400 });
  }
}
