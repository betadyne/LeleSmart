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

## Requirements

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
