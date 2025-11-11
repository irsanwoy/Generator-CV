✨ Fitur

🤖 Generate CV dengan AI - Menggunakan Groq AI (Llama 3.3 70B) untuk membuat CV yang optimal
🌐 Dukungan Multi-Bahasa - Otomatis mendeteksi bahasa dari deskripsi pekerjaan (Indonesia/Inggris)
📊 Optimasi ATS - Membuat CV yang dioptimalkan untuk sistem ATS perusahaan
🎯 Pencocokan Keyword - Mengekstrak dan mencocokkan keyword dari job description
⚡ Cepat & Gratis - Didukung oleh Groq AI dengan response time yang sangat cepat
📝 Generate Pengalaman Kerja - Membuat pengalaman kerja yang relevan berdasarkan bidang Anda
⚠️ Analisis Skill Gap - Mengidentifikasi skill yang kurang dan memberikan rekomendasi

🛠️ Teknologi

Framework: Next.js 15 (App Router)
Bahasa: TypeScript
AI Provider: Groq AI (Llama 3.3 70B)
Styling: Tailwind CSS
Deployment: Vercel (recommended)

📋 Persyaratan

Node.js 18+ terinstall
Groq API key (gratis di console.groq.com)

🚀 Cara Memulai
1. Clone repository
bashgit clone https://github.com/USERNAME_ANDA/ai-cv-optimizer.git
cd ai-cv-optimizer
2. Install dependencies
bashnpm install
3. Dapatkan Groq API Key

Kunjungi console.groq.com
Daftar/Login dengan akun Google
Buat API key baru
Copy API key tersebut

4. Jalankan development server
bashnpm run dev
Buka http://localhost:3000 di browser Anda.
5. Gunakan aplikasi

Isi informasi pribadi Anda
Masukkan detail pendidikan dan pengalaman
Paste deskripsi pekerjaan yang Anda lamar
Masukkan Groq API key Anda
Klik "Generate CV"
CV yang sudah dioptimasi akan ter-generate!

📁 Struktur Project
ai-cv-optimizer/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # API endpoint untuk generate CV
│   ├── layout.tsx                # Layout utama
│   └── page.tsx                  # Halaman utama dengan form
├── lib/
│   └── gemini.ts                 # Integrasi Groq AI
├── public/
├── .gitignore
├── next.config.ts
├── package.json
├── README.md
└── tsconfig.json
🔑 Setup API Key
Penting: Jangan pernah commit API key ke GitHub!
Aplikasi ini meminta API key di UI. Untuk deployment production:

Gunakan environment variables
Buat file .env.local:

env   GROQ_API_KEY=api_key_anda_disini

Pastikan .env.local ada di .gitignore
