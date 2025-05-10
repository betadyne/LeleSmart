# LeleSmart - Sistem Pakar Analisis Lele

LeleSmart adalah aplikasi web yang menggunakan sistem pakar untuk menganalisis kondisi benih dan kolam lele. Aplikasi ini membantu peternak lele dalam menentukan kualitas benih dan kondisi kolam yang optimal untuk budidaya lele.

## Fitur

- Analisis kondisi benih lele berdasarkan:
  - Bentuk kepala (Runcing/Gemuk)
  - Kelincahan (Lincah/Lambat)
  - Warna kulit (Mengkilap/Buram)
  - Kecacatan (Sirip Merah/Moncong Putih/Tidak Ada)
  - Tingkat keyakinan untuk setiap parameter

- Analisis kondisi kolam berdasarkan:
  - pH air (Tinggi/Netral/Rendah)
  - Suhu air (°C)

- Rekomendasi berdasarkan:
  - Hasil analisis benih
  - Hasil analisis kolam
  - Jenis pakan (Pelet/Telur/Usus/Cacing)

- Riwayat analisis dengan:
  - Tampilan tabel yang dapat diurutkan
  - Paginasi
  - Detail hasil analisis

## Teknologi

- **Frontend:**
  - Next.js 14 (App Router)
  - React Query
  - Tailwind CSS
  - Framer Motion
  - Headless UI
  - TanStack Table

- **Backend:**
  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL

## Persyaratan Sistem

- Node.js 18.0.0 atau lebih baru
- PostgreSQL 12.0 atau lebih baru
- npm atau yarn

## Instalasi

1. Clone repository:
```bash
git clone https://github.com/betadyne/LeleSmart
```

2. Install dependencies:
```bash
npm install
# atau
yarn install
```

3. Buat file `.env` di root project dan isi dengan konfigurasi database:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/lelesmart?schema=public"
```

4. Jalankan migrasi database:
```bash
npx prisma migrate dev
```

5. Jalankan aplikasi dalam mode development:
```bash
npm run dev
# atau
yarn dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## Penggunaan

1. **Analisis Benih dan Kolam**
   - Buka halaman utama
   - Isi form dengan data benih dan kolam
   - Pilih tingkat keyakinan untuk setiap parameter benih
   - Klik tombol "Analisis"
   - Lihat hasil analisis yang ditampilkan

2. **Riwayat Analisis**
   - Buka halaman "Riwayat Analisis"
   - Lihat daftar analisis yang telah dilakukan
   - Klik pada baris untuk melihat detail hasil
   - Gunakan fitur pengurutan dan paginasi untuk navigasi

## Struktur Proyek

```
lelesmart/
├── prisma/
│   └── schema.prisma      # Skema database
├── src/
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── analyses/     # Halaman riwayat
│   │   ├── page.tsx      # Halaman utama
│   │   └── layout.tsx    # Layout aplikasi
│   ├── components/       # Komponen React
│   └── lib/
│       └── expert-system/ # Logika sistem pakar
├── public/              # Aset statis
└── package.json
```

## Logika Sistem Pakar

### Analisis Benih
- Evaluasi berdasarkan 4 parameter utama
- Setiap parameter memiliki tingkat keyakinan (CF)
- Hasil akhir menggunakan metode Certainty Factor

### Analisis Kolam
- Evaluasi berdasarkan pH dan suhu
- Kondisi optimal: pH netral (2) dan suhu 27-30°C
- Penyesuaian CF berdasarkan kondisi

### Hasil Akhir
- Kombinasi hasil analisis benih dan kolam
- Pertimbangan jenis pakan
- Rekomendasi dengan tingkat kepastian

## Kontribusi

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## Lisensi

Distribusikan di bawah Lisensi MIT. Lihat `LICENSE` untuk informasi lebih lanjut.

## Kontak

Nama Anda - [@twitter_handle](https://twitter.com/twitter_handle) - email@example.com

Link Proyek: [https://github.com/username/lelesmart](https://github.com/username/lelesmart) 
