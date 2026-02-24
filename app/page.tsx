'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

export default function UserCatalog() {
  const [shoes, setShoes] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/shoes').then(res => res.json()).then(data => {
      if(data.success) setShoes(data.data);
    });
  }, []);

  const filteredShoes = useMemo(() => {
    return shoes.filter(s => 
      s.name.toLowerCase().includes(search.toLowerCase()) || s.brand.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, shoes]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-black">Kicks<span className="text-indigo-600">Store</span></h1>
        <Link href="/admin" className="px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition">
          Login Admin 
        </Link>
      </nav>

      <main className="max-w-7xl mx-auto p-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-4xl font-extrabold">Katalog Terbaru</h2>
            <p className="text-slate-500 mt-2 text-lg">Temukan sepatu impianmu hari ini.</p>
          </div>
          <input 
            type="text" placeholder="Cari merk atau nama..." 
            className="w-full md:w-1/3 px-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {filteredShoes.map((shoe) => (
            <div key={shoe.id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all border border-slate-100 group">
              <div className="h-48 rounded-xl bg-slate-100 mb-4 overflow-hidden">
                <img src={shoe.image_url} alt={shoe.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <h3 className="font-bold text-lg">{shoe.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{shoe.brand}</p>
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-indigo-600">Rp {shoe.price.toLocaleString('id-ID')}</span>
                <button onClick={() => alert('Fitur checkout dalam pengembangan')} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800">Beli</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}