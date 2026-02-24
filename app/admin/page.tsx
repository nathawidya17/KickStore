'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Pencil, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); 
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [shoes, setShoes] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', brand: '', size: '', price: 0 });
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const checkLoginStatus = localStorage.getItem('isAdminLoggedIn');
    if (checkLoginStatus === 'true') setIsLoggedIn(true);
    setIsCheckingAuth(false); 
  }, []); 

  const fetchShoes = () => {
    fetch('/api/shoes').then(res => res.json()).then(data => {
      if(data.success) setShoes(data.data);
    });
  };

  useEffect(() => { if (isLoggedIn) fetchShoes(); }, [isLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        setIsLoggedIn(true);
        localStorage.setItem('isAdminLoggedIn', 'true');
      } else alert(data.message);
    } catch { alert("Error server"); } finally { setIsLoading(false); }
  };

  const handleLogout = () => {
    setIsLoggedIn(false); setUsername(''); setPassword('');
    localStorage.removeItem('isAdminLoggedIn');
  };

  const handleEditClick = (shoe: any) => {
    setEditingId(shoe.id); 
    setForm({ name: shoe.name, brand: shoe.brand, size: shoe.size, price: shoe.price}); 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', brand: '', size: '', price: 0 });
    setImageFile(null);
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingId && !imageFile) { 
      alert("Harap pilih foto sepatu!"); return; 
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('brand', form.brand);
    formData.append('size', form.size);
    formData.append('price', form.price.toString());

    
    if (imageFile) formData.append('image', imageFile); 

    try {
      let res;
      if (editingId) {
        res = await fetch(`/api/shoes/${editingId}`, { method: 'PUT', body: formData });
      } else {
        res = await fetch('/api/shoes', { method: 'POST', body: formData });
      }
      
      const data = await res.json();

      if (data.success) {
        alert(editingId ? 'Data berhasil diupdate!' : 'Data sepatu berhasil ditambah!');
        handleCancelEdit(); 
        fetchShoes(); 
      } else {
        alert("Gagal menyimpan: " + data.error);
      }
    } catch (error) {
      alert("Terjadi kesalahan koneksi ke server.");
    }
  };

  const handleDelete = async (id: number) => {
    if(confirm('Yakin ingin menghapus?')) {
      await fetch(`/api/shoes/${id}`, { method: 'DELETE' });
      fetchShoes();
    }
  };

  if (isCheckingAuth) return <div className="min-h-screen bg-slate-50"></div>; 

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900">
        <Link href="/" className="text-slate-400 hover:text-white mb-6">&larr; Kembali ke Katalog Publik</Link>
        <form onSubmit={handleLogin} className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
          <div className="text-center mb-8"><h2 className="text-3xl font-black text-slate-800">Login Admin</h2></div>
          <input type="text" placeholder="Username" required value={username} onChange={e => setUsername(e.target.value)} className="w-full mb-4 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-black" />
          <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full mb-8 p-3 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 text-black" />
          <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 text-white p-4 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 transition">
            {isLoading ? 'Memeriksa...' : 'Masuk'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h1 className="text-2xl font-black text-slate-800">Dashboard Manajemen</h1>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition">Logout</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-fit">
            <h2 className="font-bold text-lg mb-6 text-slate-800 border-b pb-2">
              {editingId ? 'Edit Data Sepatu' : 'Tambah Sepatu Baru'}
            </h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input type="text" placeholder="Nama Sepatu" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="border border-slate-200 p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition text-black" />
              <input type="text" placeholder="Merk" required value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} className="border border-slate-200 p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition text-black" />
              <input type="text" placeholder="Ukuran" required value={form.size} onChange={e => setForm({...form, size: e.target.value})} className="border border-slate-200 p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition text-black" />
              <input type="number" placeholder="Harga" required value={form.price || ''} onChange={e => setForm({...form, price: Number(e.target.value)})} className="border border-slate-200 p-3 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition text-black" />
              <></>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-black">
                  {editingId ? 'Upload Foto Baru (Opsional)' : 'Upload Foto Sepatu'}
                </label>
                
                <div className="relative">
                  <input 
                    id="fileUpload" 
                    type="file" 
                    accept="image/*" 
                    required={!editingId}
                    onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)} 
                    className="hidden" 
                  />
                  
                  <label 
                    htmlFor="fileUpload"
                    className={`flex items-center justify-between border p-3 rounded-lg cursor-pointer transition ${
                      imageFile ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <span className={`text-sm truncate mr-2 ${imageFile ? 'text-indigo-700 font-semibold' : 'text-slate-400'}`}>
                      {imageFile ? imageFile.name : (editingId ? 'Gunakan foto lama, atau pilih baru...' : 'Pilih file gambar...')}
                    </span>
                    <span className="bg-slate-800 text-white py-1 px-3 rounded text-xs font-bold whitespace-nowrap">
                      Browse
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 mt-2">
                <button type="submit" className="flex-1 bg-slate-900 text-white p-3 rounded-lg font-bold hover:bg-slate-800 transition">
                  {editingId ? 'Update Data' : 'Simpan Data'}
                </button>
                {editingId && (
                  <button type="button" onClick={handleCancelEdit} className="bg-red-50 text-red-600 px-4 rounded-lg font-bold hover:bg-red-100 transition">
                    Batal
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100"><h2 className="font-bold text-lg text-slate-800">Daftar Inventori Sepatu</h2></div>
            <table className="w-full text-left border-collapse">
              <thead><tr className="bg-slate-50 text-slate-600 text-sm"><th className="p-4">Produk</th><th className="p-4">Harga</th><th className="p-4">Ukuran</th><th className="p-4">Aksi</th></tr></thead>
             <tbody>
                {shoes.map(shoe => (
                  <tr key={shoe.id} className="hover:bg-slate-50 transition border-b border-slate-50">
                    {/* Kolom 1: Produk */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={shoe.image_url} alt="img" className="w-12 h-12 rounded bg-slate-100 object-cover border" />
                        <div>
                          <div className="font-bold text-slate-800">{shoe.name}</div>
                          <div className="text-xs text-slate-500 uppercase">{shoe.brand}</div>
                        </div>
                      </div>
                    </td>

                    {/* Kolom 2: Harga */}
                    <td className="p-4 font-semibold text-slate-700">
                      Rp {shoe.price.toLocaleString('id-ID')}
                    </td>

                    {/* Kolom 3: Ukuran (Sesuai Header ke-3) */}
                    <td className="p-4 text-slate-600 font-medium text-sm">
                      {shoe.size || '-'}
                    </td>

                    {/* Kolom 4: Aksi */}
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditClick(shoe)} 
                          className="p-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition shadow-sm"
                          title="Edit Data"
                        >
                          <Pencil size={18} strokeWidth={2.5} />
                        </button>

                        <button 
                          onClick={() => handleDelete(shoe.id)} 
                          className="p-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition shadow-sm"
                          title="Hapus Data"
                        >
                          <Trash2 size={18} strokeWidth={2.5} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}