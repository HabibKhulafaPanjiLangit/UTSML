import { describe, it, expect } from '@jest/globals';
import { POST } from './route';

describe('API Linear Regression', () => {
  it('should return linear regression result', async () => {
    const req = { json: async () => ({ data: [ { x: 1, y: 2 }, { x: 2, y: 4 } ], type: 'linear' }) } as any;
    const res = await POST(req);
    const json = await res.json();
    expect(json.result).toBeDefined();
    expect(json.result.equation).toContain('Y =');
  });

  it('should return polynomial regression result', async () => {
    const req = { json: async () => ({ data: [ { x: 1, y: 2 }, { x: 2, y: 4 }, { x: 3, y: 8 } ], type: 'polynomial' }) } as any;
    const res = await POST(req);
    const json = await res.json();
    expect(json.result).toBeDefined();
    expect(json.result.equation).toContain('Y =');
  });

  it('should return error for invalid type', async () => {
    const req = { json: async () => ({ data: [ { x: 1, y: 2 } ], type: 'unknown' }) } as any;
    const res = await POST(req);
    const json = await res.json();
    expect(json.error).toBeDefined();
  });
});
