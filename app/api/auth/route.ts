import { NextResponse } from 'next/server';
import { UserRepository } from '@/lib/UserRepository';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const repo = new UserRepository();
    const isValid = await repo.authenticate(username, password);

    if (isValid) return NextResponse.json({ success: true });
    return NextResponse.json({ success: false, message: 'Username/Password salah!' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}