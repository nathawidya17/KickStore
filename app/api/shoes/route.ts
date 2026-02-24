import { NextResponse } from 'next/server';
import { ShoeRepository } from '@/lib/ShoeRepository';
import { writeFile } from 'fs/promises';
import path from 'path';

// Cegah cache agar data selalu fresh
export const dynamic = 'force-dynamic'; 

const repo = new ShoeRepository();

export async function GET() {
  const data = await repo.getAll();
  return NextResponse.json({ success: true, data });
}

export async function POST(req: Request) {
  try {
    // Karena sekarang menerima File, kita pakai formData() bukan json()
    const formData = await req.formData();
    
    const name = formData.get('name') as string;
    const brand = formData.get('brand') as string;
    const price = Number(formData.get('price'));
    const file = formData.get('image') as File;
    
    let image_url = '';

    // Jika ada file yang diupload, proses filenya
    if (file && file.name) {
      // Ubah file menjadi buffer agar bisa disimpan
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Buat nama file unik (gabungan timestamp & nama asli) agar tidak tertimpa
      const uniqueFilename = Date.now() + '-' + file.name.replace(/\s/g, '_');
      
      // Tentukan path penyimpanan ke folder public/uploads
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      const filepath = path.join(uploadDir, uniqueFilename);
      
      // Simpan file secara fisik
      await writeFile(filepath, buffer);
      
      // Path inilah yang akan disimpan di database MySQL
      image_url = `/uploads/${uniqueFilename}`;
    }

    // Simpan data ke database
    await repo.create({ name, brand, price, image_url, description: '-' });
    
    return NextResponse.json({ success: true, message: 'Sepatu berhasil ditambahkan!' });
  } catch (error: any) {
    console.error("Terjadi error upload:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}