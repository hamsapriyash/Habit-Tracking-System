// app/api/affirmation/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://www.affirmations.dev/', {
      cache: 'no-store', // Ensures you get a fresh quote
    });
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ affirmation: "Keep moving forward!" }, { status: 500 });
  }
}