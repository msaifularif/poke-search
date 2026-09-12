# Poke-Search — Pokémon Search & Pokédex App

[![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vue Router](https://img.shields.io/badge/Vue_Router-5.3-4FC08D?logo=vuedotjs&logoColor=white)](https://router.vuejs.org/)
[![Pinia](https://img.shields.io/badge/Pinia-4.0-FFE885?logo=pinia&logoColor=black)](https://pinia.vuejs.org/)
[![PokéAPI](https://img.shields.io/badge/PokéAPI-REST_v2-EE1515?logo=pokemon&logoColor=white)](https://pokeapi.co/)

**Poke-Search** adalah aplikasi web modern, responsif, dan kaya fitur untuk mencari serta mengeksplorasi data profil Pokémon dari Generasi 1 hingga Generasi 9 (total 1.025 Pokémon). Dibangun di atas **Vue 3 (Composition API)**, **Vite 8**, **Tailwind CSS v4 (CSS-first architecture)**, dan **PokéAPI REST v2**.

---

## ✨ Fitur Utama

- 🔍 **Pencarian Real-Time (FR-1)**: Pencarian instan dengan *debounce* (±300ms) berdasarkan nama Pokémon atau nomor ID Pokédex (misal: `#025` atau `Pikachu`).
- 📄 **Katalog & Paginasi Cerdas (FR-2, FR-3)**: Grid responsif menampilkan artwork resmi, nomor ID terformat, nama kapital, dan lencana tipe. Paginasi fleksibel (12, 24, 48, 96 kartu per halaman).
- 🧬 **Profil Detail Lengkap (FR-4, FR-5)**:
  - Tampilan visual multi-mode: **Official Artwork**, **Animated Showdown GIF**, dan **Shiny form**.
  - Metrik fisik: Tinggi (meter & kaki) dan Berat (kg & lbs).
  - Deskripsi Pokédex resmi (Bahasa Inggris) & klasifikasi genus.
  - Statistik dasar (*Base Stats*) dengan bar visual berkode warna dan kalkulasi total stat.
  - Daftar kemampuan (*Abilities*) dengan penanda khusus *Hidden Ability*.
- 🔊 **Pemutar Suara Pokémon Cry (FR-14)**: Memutar suara teriakan resmi (*cry*) dari data PokéAPI secara interaktif.
- 🌳 **Visualisasi Pohon Evolusi (FR-6)**: Menampilkan jalur evolusi multi-tahap dan percabangan (*branching*, misal: Eevee), lengkap dengan kondisi/pemicu evolusi (*minimum level*, batu evolusi, *trade*, atau *happiness*).
- 🎯 **Filter Tipe & Generasi (FR-7)**: Memfilter Pokémon berdasarkan 18 tipe Pokémon dan Generasi I hingga IX.
- 📊 **Sorting Fleksibel (FR-15)**: Urutkan Pokémon berdasarkan:
  - Nomor ID (Kecil ke Besar / Besar ke Kecil)
  - Nama Alfabetis (A–Z / Z–A)
  - **Total Base Stats**: Paling Kuat Dahulu (*Highest First*) atau Paling Rendah Dahulu (*Lowest First*).
- 🛡️ **Kalkulator Efektivitas Tipe (FR-11)**: Menghitung kelemahan defensif Pokémon (*Super Weak 4×, Weak 2×, Resistant ½×, Super Resistant ¼×, Immune 0×*).
- ❤️ **Sistem Favorit (FR-8, FR-9)**: Simpan Pokémon favorit ke `localStorage` browser tanpa perlu registrasi akun. Dilengkapi fitur pencarian di dalam daftar favorit.
- 👥 **Tim Battle 6-Slot (FR-17)**: Bentuk regu battle hingga 6 Pokémon langsung dari daftar favorit, lengkap dengan kalkulasi total base stat tim dan analisis cakupan tipe (*type coverage*).
- ⚔️ **Komparasi Head-to-Head (FR-10)**: Bandingkan 2 Pokémon berdampingan di halaman `/compare` dengan indikator pemenang tiap statistik.
- 🎲 **Tombol Random Pokémon (FR-13)**: Navigasi acak ("I'm feeling lucky") ke salah satu dari 1.025 Pokémon.
- 🌙 **Dark / Light Mode (FR-12)**: Dukungan tema gelap & terang dengan deteksi preferensi sistem dan persistensi `localStorage`.
- 💀 **Skeleton Loader & Empty States (FR-16)**: Tampilan animasi skeleton pulse saat loading dan ilustrasi ramah ketika data tidak ditemukan.

---

## 🛠️ Tech Stack

| Layer | Teknologi | Versi |
|---|---|---|
| **Framework** | Vue 3 (Composition API + `<script setup>`) | `^3.5.42` |
| **Build Tool** | Vite | `^8.3.0` |
| **Routing** | Vue Router (HTML5 History Mode) | `^5.3.1` |
| **Styling** | Tailwind CSS (CSS-first architecture + `@tailwindcss/vite`) | `^4.3.3` |
| **State Management** | Pinia | `^4.0.3` |
| **Icons** | Lucide Vue Next | `^1.0.0` |
| **Data Source** | PokéAPI (RESTful v2 publik, tanpa API key) | v2 |
| **Code Formatting** | Prettier | – |

---

## 📂 Struktur Project

```text
poke-search/
├── public/
│   └── _redirects            # Rule rewrite untuk Netlify SPA
├── src/
│   ├── api/
│   │   ├── pokeapi.js        # Wrapper PokéAPI client dengan cache in-memory
│   │   └── typeChart.js      # Definisi 18 tipe, warna tema, & kalkulator efektivitas
│   ├── assets/
│   ├── components/
│   │   ├── EmptyState.vue    # Komponen tampilan saat data kosong
│   │   ├── EvolutionChain.vue# Visualisasi jalur evolusi & triggers
│   │   ├── FilterBar.vue     # Filter tipe, generasi, sorting, & pills
│   │   ├── Footer.vue        # Footer aplikasi & atribusi hak cipta
│   │   ├── LoadingSkeleton.vue# Placeholder loading shimmer
│   │   ├── Navbar.vue        # Header sticky, link navigasi, random, & tema
│   │   ├── PokemonCard.vue   # Kartu Pokémon dengan artwork & tipe
│   │   ├── PokemonList.vue   # Grid responsif & kontrol paginasi
│   │   ├── SearchBar.vue     # Input pencarian debounced
│   │   ├── StatBar.vue       # Bar progres statistik berkode warna
│   │   ├── TeamSection.vue   # Display regu 6 Pokémon dengan statistik tim
│   │   ├── TypeBadge.vue     # Lencana tipe Pokémon
│   │   └── TypeEffectiveness.vue # Matriks kelemahan dan resistensi
│   ├── composables/
│   │   ├── useAudioCry.js    # Controller pemutar suara Pokémon cry
│   │   └── useDebounce.js    # Utilitas reactive debounce
│   ├── data/
│   │   └── baseStats.json    # Lookup dataset total base stat 1.025 Pokémon
│   ├── router/
│   │   └── index.js          # Konfigurasi rute & scroll restoration
│   ├── stores/
│   │   ├── favorites.js      # Store favorit (localStorage)
│   │   ├── pokemon.js        # Store katalog, filter, pencarian, & paginasi
│   │   ├── team.js           # Store tim battle 6 slot (localStorage)
│   │   └── theme.js          # Store tema dark/light
│   ├── views/
│   │   ├── About.vue         # Dokumentasi project & info teknis
│   │   ├── Compare.vue       # Komparasi 2 Pokémon berdampingan
│   │   ├── Favorites.vue     # Halaman favorit & manajer tim battle
│   │   ├── Home.vue          # Halaman utama (pencarian & Pokédex)
│   │   └── PokemonDetail.vue # Halaman profil mendalam Pokémon
│   ├── App.vue               # Root layout & transisi halaman
│   ├── main.js               # Entry point aplikasi
│   └── style.css             # Tailwind v4 @import & @theme custom tokens
├── .prettierrc               # Konfigurasi Prettier
├── index.html                # HTML entry point & favicon Pokeball
├── package.json
├── vercel.json               # Konfigurasi rewrite SPA untuk Vercel
└── vite.config.js            # Konfigurasi Vite 8 & Tailwind v4 plugin
```

---

## 🚀 Memulai (Getting Started)

### Prasyarat
- **Node.js**: versi 20 atau lebih baru (direkomendasikan Node.js 22/24)
- **npm**: versi 10 atau lebih baru

### 1. Kloning Repositori
```bash
git clone https://github.com/msaifularif/poke-search.git
cd poke-search
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Menjalankan Server Development
```bash
npm run dev
```
Buka browser di alamat `http://localhost:5173`.

### 4. Build untuk Production
```bash
npm run build
```
Hasil kompilasi file statis akan tersimpan di dalam folder `dist/`.

### 5. Preview Build Production
```bash
npm run preview
```

---

## 🌐 Panduan Deployment

Aplikasi ini adalah Single Page Application (SPA) murni tanpa backend khusus, sehingga dapat langsung di-deploy ke penyedia hosting statis:

### Vercel
Sudah dilengkapi konfigurasi [`vercel.json`](file:///e:/MSA-Develop/poke-search/vercel.json) untuk rewrite SPA:
1. Hubungkan repositori GitHub ke Vercel.
2. Atur **Framework Preset**: `Vite`.
3. Atur **Build Command**: `npm run build` dan **Output Directory**: `dist`.
4. Deploy langsung.

### Netlify
Sudah dilengkapi file [`public/_redirects`](file:///e:/MSA-Develop/poke-search/public/_redirects):
1. Hubungkan repositori GitHub ke Netlify.
2. Atur **Build Command**: `npm run build` dan **Publish Directory**: `dist`.
3. Deploy langsung.

---

## 📜 Lisensi & Atribusi

- Data Pokémon, nama karakter, gambar sprite, dan suara disediakan secara publik oleh [PokéAPI](https://pokeapi.co/).
- Pokémon dan nama karakter Pokémon adalah merek dagang dan hak cipta milik **Nintendo**, **Creatures Inc.**, dan **Game Freak**.
- Proyek ini dibuat sebagai portofolio dan materi pembelajaran non-komersial (*fan-made educational project*).
- Kode sumber dilisensikan di bawah lisensi [MIT](LICENSE).
