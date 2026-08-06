# Support Ticket Mini Application

Aplikasi sederhana untuk mencatat dan memantau tiket bantuan internal (internet lambat,
printer bermasalah, komputer tidak menyala, tidak dapat login, dll).

Stack: **FastAPI** (backend) + **React** (frontend) + **PostgreSQL** (database), semuanya
dijalankan lewat **Docker Compose**.

## Cara Menjalankan

1. Salin file environment:
   ```bash
   cp .env.example .env
   ```
2. Jalankan seluruh stack (db, backend, frontend):
   ```bash
   docker compose up --build
   ```
3. Tunggu hingga semua service running, lalu buka:
   - Frontend: http://localhost:3000
   - Backend (API docs Swagger): http://localhost:8000/docs

Tabel `tickets` dibuat otomatis oleh SQLAlchemy saat backend pertama kali start —
tidak perlu migration manual untuk aplikasi mini ini.

Untuk menghentikan:
```bash
docker compose down
```

## URL Aplikasi

| Service  | URL                          |
|----------|-------------------------------|
| Frontend | http://localhost:3000        |
| Backend  | http://localhost:8000        |
| API Docs | http://localhost:8000/docs   |

## Endpoint API

| Method        | Endpoint        | Fungsi                    |
|---------------|-----------------|----------------------------|
| GET           | /tickets        | Menampilkan semua tiket    |
| GET           | /tickets/{id}   | Menampilkan detail tiket   |
| POST          | /tickets        | Membuat tiket baru         |
| PATCH / PUT   | /tickets/{id}   | Memperbarui tiket/status   |
| DELETE        | /tickets/{id}   | Menghapus tiket            |

## Fitur yang Sudah Selesai

- [x] Menampilkan seluruh tiket (list, urut dari terbaru)
- [x] Membuat tiket baru (status otomatis `open`)
- [x] Melihat detail tiket
- [x] Mengubah status tiket (open / in_progress / closed)
- [x] Menghapus tiket
- [x] Data tersimpan di PostgreSQL
- [x] Integrasi frontend React <-> backend FastAPI
- [x] Semua service (frontend, backend, db) berjalan via Docker Compose
- [x] Validasi: title & description wajib diisi, priority/status hanya sesuai pilihan
      yang ditentukan, ID tidak ditemukan -> 404
- [x] Pesan error sederhana ditampilkan di frontend (form dan detail tiket)

## Fitur yang Belum Selesai / Sengaja Dikesampingkan

Sesuai arahan, **fitur bonus autentikasi & otorisasi (register/login JWT, password
hashing, role user/admin, "user hanya bisa mengelola tiket miliknya sendiri") belum
dikerjakan** pada iterasi ini — akan ditambahkan menyusul di atas struktur yang sudah
ada. Bonus lain yang juga belum dikerjakan:

- Filter / pencarian tiket (misalnya by status atau priority)
- Unit test / integration test

## Struktur Folder

```
support-ticket-app/
├── backend/
│   ├── app/
│   │   ├── main.py        # FastAPI app & routes
│   │   ├── models.py      # SQLAlchemy model (Ticket)
│   │   ├── schemas.py     # Pydantic schemas & validasi
│   │   └── database.py    # Koneksi DB (SQLAlchemy engine/session)
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TicketForm.js
│   │   │   ├── TicketList.js
│   │   │   └── TicketDetail.js
│   │   ├── api.js         # Wrapper axios ke backend
│   │   ├── App.js
│   │   └── App.css
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

## Catatan Implementasi

- Struktur data tiket (`id`, `title`, `description`, `priority`, `status`,
  `created_at`, `updated_at`) mengikuti spesifikasi pada dokumen assessment.
- `priority` dibatasi pada `low` / `medium` / `high`; `status` pada
  `open` / `in_progress` / `closed` — divalidasi baik di level Pydantic (backend)
  maupun lewat `<select>` di frontend, sehingga nilai di luar pilihan tersebut
  ditolak dengan pesan error yang jelas.
- Tiket baru selalu dibuat dengan status `open`, sesuai ketentuan; field `status`
  tidak bisa diisi manual saat pembuatan tiket (hanya lewat endpoint update).
- `.env.example` menyediakan template kredensial database & konfigurasi port,
  tanpa menyimpan credential asli di repository.
