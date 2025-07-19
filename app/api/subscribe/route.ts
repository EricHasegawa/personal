import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import path from 'path';

const SHEET_ID = '1PF-J9V1DbxhF_JGhbc32K03Zhp0hmBUHKPwy3MFhPqI';
const SHEET_TAB = 'emails';

interface SubscribeRequestBody {
    email: string;
}

interface ErrorResponse {
    error: string;
}

interface SuccessResponse {
    success: boolean;
}

export async function POST(req: Request): Promise<NextResponse<ErrorResponse | SuccessResponse>> {
  const body: SubscribeRequestBody = await req.json();
  const { email } = body;

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(process.cwd(), 'lib/google-creds.json'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_TAB}!A:B`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[email, new Date().toISOString()]],
    },
  });

  return NextResponse.json({ success: true });
}
