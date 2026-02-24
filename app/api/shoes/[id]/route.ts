import { NextResponse } from 'next/server';
import { ShoeRepository } from '@/lib/ShoeRepository';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params; 
    const id = Number(resolvedParams.id);
    
    const repo = new ShoeRepository();
    await repo.delete(id);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params; 
    const id = Number(resolvedParams.id);

    const formData = await req.formData();
    const name = formData.get('name') as string;
    const brand = formData.get('brand') as string;
    const price = Number(formData.get('price'));
    const file = formData.get('image') as File | null;
    
    let image_url = '';

    if (file && file.name && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uniqueFilename = Date.now() + '-' + file.name.replace(/\s/g, '_');
      const filepath = path.join(process.cwd(), 'public/uploads', uniqueFilename);
      await writeFile(filepath, buffer);
      image_url = `/uploads/${uniqueFilename}`;
    }

    const repo = new ShoeRepository();
    await repo.update(id, { name, brand, price, image_url });
    
    return NextResponse.json({ success: true, message: 'Data berhasil diubah!' });
  } catch (error: any) {
    console.error("Error update:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}