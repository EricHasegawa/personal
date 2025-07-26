import { POST } from '@/app/api/subscribe/route';

jest.mock('path', () => ({
  join: jest.fn().mockReturnValue('/mocked/path/google-creds.json'),
}));

const mockSheetsAppend = jest.fn();

jest.mock('googleapis', () => ({
  google: {
    auth: {
      GoogleAuth: jest.fn().mockImplementation(() => ({})),
    },
    sheets: jest.fn().mockImplementation(() => ({
      spreadsheets: {
        values: {
          append: mockSheetsAppend,
        },
      },
    })),
  },
}));

describe('/api/subscribe POST endpoint', () => {
  beforeEach(() => {
    mockSheetsAppend.mockClear();
    mockSheetsAppend.mockResolvedValue({});
  });

  const createRequest = (email: string) => {
    return new Request('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
  };

  it('should successfully subscribe a valid email', async () => {
    const request = createRequest('test@example.com');

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ success: true });

    expect(mockSheetsAppend).toHaveBeenCalledTimes(1);
    expect(mockSheetsAppend).toHaveBeenCalledWith({
      spreadsheetId: '1PF-J9V1DbxhF_JGhbc32K03Zhp0hmBUHKPwy3MFhPqI',
      range: 'emails!A:B',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [['test@example.com', expect.any(String)]],
      },
    });
  });

  it('should reject invalid email addresses', async () => {
    const request = createRequest('invalid-email');

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ error: 'Invalid email' });
    expect(mockSheetsAppend).not.toHaveBeenCalled();
  });

  it('should reject empty email', async () => {
    const request = createRequest('');

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({ error: 'Invalid email' });
    expect(mockSheetsAppend).not.toHaveBeenCalled();
  });

  it('should handle Google Sheets API errors', async () => {
    mockSheetsAppend.mockRejectedValueOnce(new Error('Google API Error'));

    const request = createRequest('test@example.com');

    await expect(POST(request)).rejects.toThrow('Google API Error');
  });

  it('should validate email contains @ symbol', async () => {
    const invalidEmails = ['invalid-email', 'test', 'test.com'];

    for (const email of invalidEmails) {
      const request = createRequest(email);
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Invalid email' });
    }
  });

  it('should include timestamp in Google Sheets data', async () => {
    const beforeTime = new Date().toISOString();
    const request = createRequest('test@example.com');

    await POST(request);

    expect(mockSheetsAppend).toHaveBeenCalledTimes(1);

    const afterTime = new Date().toISOString();
    const callArgs = mockSheetsAppend.mock.calls[0][0];
    const timestamp = callArgs.requestBody.values[0][1];

    expect(new Date(timestamp).toISOString()).toBe(timestamp);
    expect(new Date(timestamp).getTime()).toBeGreaterThanOrEqual(
      new Date(beforeTime).getTime(),
    );
    expect(new Date(timestamp).getTime()).toBeLessThanOrEqual(
      new Date(afterTime).getTime(),
    );
  });

  it('should handle malformed JSON request', async () => {
    const request = new Request('http://localhost:3000/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: 'invalid-json',
    });

    await expect(POST(request)).rejects.toThrow();
  });
});
