# DOKUMENTASI APLIKASI BIOSKOP (CINEMA APP)

Dokumen ini berisi alur proses pembuatan sistem, panduan pengguna (User Guide), dan panduan administrator (Admin Guide) untuk aplikasi pemesanan tiket bioskop berbasis web.

---

## 1. ALUR PROSES PEMBUATAN APLIKASI

Proses perancangan dan pembangunan aplikasi ini dilakukan melalui tahapan berikut:

### A. Analisis Kebutuhan & Perancangan Database

1. **Identifikasi Entitas**: Menentukan entitas utama yaitu Pengguna (`users`), Film (`movies`), Jadwal Tayang (`showtimes`), dan Pesanan (`orders`).
2. **Skema Database (MySQL)**:
   - `users`: Menyimpan data autentikasi (username, email, password, role: `admin`/`user`).
   - `movies`: Menyimpan informasi film (nama, genre, poster, rating, durasi, sinopsis, harga tiket).
   - `showtimes`: Menyimpan jam tayang yang terhubung ke film.
   - `orders`: Menyimpan transaksi pemesanan tiket (user, film, jadwal, kursi, jumlah tiket, total harga, bukti pembayaran, status soft delete).

### B. Pengembangan Backend (Node.js & Express)

1. **Inisialisasi Project**: Setup `package.json`, install dependencies (`express`, `mysql2`, `jsonwebtoken`, `bcryptjs`, `multer`, `cors`, `dotenv`).
2. **Koneksi Database**: Membuat konfigurasi pool koneksi database di `src/config/database.js`.
3. **Middleware**:
   - `auth.js`: Verifikasi token JWT dan proteksi route berdasarkan role (`admin`/`user`).
   - `upload.js`: Konfigurasi penyimpanan file gambar (poster film & bukti transfer) menggunakan `multer`.
4. **Model & Controller**:
   - Membuat query database terpisah di folder `models/` untuk menjaga kerapian kode.
   - Membuat logika bisnis di folder `controllers/` (misal: perhitungan harga tiket fixed Rp 35.000 + pajak 10% = Rp 38.500 di `orderController.js`).
5. **Routing**: Menyusun endpoint API untuk autentikasi, film, jadwal tayang, dan pemesanan.

### C. Pengembangan Frontend (React & Vite)

1. **Setup Project**: Inisialisasi React dengan Vite, install `react-router-dom`, `axios`, `react-icons`, dan Bootstrap untuk styling.
2. **Arsitektur Folder**: Memisahkan komponen reusable (`components/`), tata letak (`layouts/`), halaman (`pages/`), routing (`routes/`), dan integrasi API (`services/`).
3. **State Management & Auth**: Menyimpan token JWT dan data user di `localStorage` setelah login berhasil.
4. **Integrasi API**: Menghubungkan frontend ke backend menggunakan Axios (`services/api.js`).

### D. Pengujian & Seeding

1. Membuat script `seed.js` untuk mengisi data awal (user admin, user biasa, film default, jadwal tayang, dan beberapa transaksi).
2. Menguji fungsionalitas utama seperti pencegahan pemesanan kursi ganda (double booking) pada jadwal yang sama.

---

## 2. PANDUAN PENGGUNA (USER GUIDE)

Panduan ini ditujukan bagi pelanggan yang ingin memesan tiket bioskop.

### A. Registrasi & Login

1. Buka aplikasi di browser.
2. Jika belum memiliki akun, klik **Daftar** di sidebar/navbar. Isi username, email, dan password, lalu klik **Daftar**.
3. Jika sudah memiliki akun, klik **Masuk**. Masukkan username/email dan password Anda, lalu klik **Masuk**.

### B. Menjelajahi & Mencari Film

1. Di halaman utama (**Daftar Film**), Anda dapat melihat semua film yang sedang tayang.
2. Gunakan **Search Bar** di navbar bagian kanan atas untuk mencari film berdasarkan judul. Ketik judul film, hasil pencarian akan langsung menyaring daftar film. Hapus teks pencarian untuk menampilkan kembali semua film.
3. Klik tombol **Detail** pada kartu film untuk membaca sinopsis lengkap, rating, durasi, dan harga tiket.

### C. Memesan Tiket

1. Klik tombol **Booking** pada film yang ingin ditonton.
2. Pilih **Tanggal Menonton** dan **Jam Tayang** yang tersedia.
3. Setelah memilih jadwal, grid kursi akan muncul.
   - Kursi berwarna **merah** berarti sudah dipesan orang lain dan tidak bisa dipilih.
   - Kursi berwarna **putih** tersedia untuk dipilih.
   - Klik kursi yang diinginkan (bisa memilih lebih dari 1 kursi). Kursi terpilih akan berwarna **biru**.
4. Sistem akan menampilkan ringkasan jumlah tiket dan total harga secara otomatis (Harga tiket Rp 38.500 sudah termasuk pajak 10%).
5. Unggah **Bukti Pembayaran** (foto/screenshot transfer) pada form yang disediakan.
6. Klik **Pesan Tiket Sekarang**. Jika berhasil, akan muncul notifikasi sukses.

### D. Melihat Riwayat Pemesanan

1. Klik menu **Riwayat** di sidebar.
2. Anda dapat melihat daftar tiket yang telah dipesan, detail kursi, total harga, dan status pembayaran (bukti transfer yang diunggah).

---

## 3. PANDUAN ADMINISTRATOR (ADMIN GUIDE)

Panduan ini ditujukan bagi pengelola bioskop untuk mengelola data film, jadwal, dan memantau transaksi.

### A. Masuk sebagai Admin

1. Lakukan login menggunakan akun dengan role `admin` (default seed: username `ahmad`, password `adminpass`).
2. Setelah login, Anda akan diarahkan ke halaman **Dashboard Admin**.

### B. Menggunakan Dashboard

Halaman Dashboard menampilkan statistik ringkas:

- Total Film yang terdaftar.
- Total Jadwal Tayang.
- Total Pesanan Tiket masuk.
- Total Pengguna terdaftar.
- Total Pendapatan (Revenue) dari seluruh penjualan tiket yang aktif.

### C. Manajemen Film (Movies CRUD)

1. Klik menu **Movies** di sidebar admin.
2. **Tambah Film**:
   - Klik tombol **Tambah Film**.
   - Isi nama film, genre, rating, durasi, harga tiket default, dan sinopsis/deskripsi film.
   - Masukkan URL poster atau unggah file gambar poster langsung dari komputer.
   - Klik **Simpan**.
3. **Edit Film**:
   - Klik ikon **Pensil (Edit)** pada baris film yang ingin diubah.
   - Sesuaikan data yang ingin diubah, lalu klik **Simpan**.
4. **Hapus Film**:
   - Klik ikon **Tempat Sampah (Hapus)** pada film yang ingin dihapus.
   - Konfirmasi penghapusan.

### D. Manajemen Jadwal Tayang (Showtimes CRUD)

1. Klik menu **Showtimes** di sidebar admin.
2. **Tambah Jadwal**:
   - Klik tombol **Tambah Jadwal**.
   - Pilih film yang ingin dijadwalkan.
   - Masukkan jam tayang (format HH:MM, contoh: `14:00`).
   - Klik **Simpan**.
3. **Hapus Jadwal**:
   - Klik ikon **Hapus** pada jadwal yang ingin dibatalkan.

### E. Memantau Pesanan (Orders)

1. Klik menu **Orders** di sidebar admin.
2. Anda dapat melihat seluruh transaksi pemesanan tiket oleh pengguna, termasuk detail film, jadwal, kursi yang dipilih, total harga, dan gambar bukti transfer yang diunggah oleh pengguna.

### F. Manajemen Pengguna (Users)

1. Klik menu **Users** di sidebar admin.
2. Halaman ini menampilkan daftar seluruh pengguna terdaftar beserta email dan role mereka (`admin` atau `user`).
