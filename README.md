# p1-pairProject-EduPay-Iya
Untuk menyelesaikan phase 1 Pair Project EduPay-Iya

npm yang perlu diinstall

    npm install express ejs pg sequelize bcryptjs express-session moment 
    npm install --save-dev sequelize-cli

Deskripsi

EduPay-Iya adalah aplikasi berbasis web yang dikembangkan menggunakan Express.js, EJS, PostgreSQL, Sequelize ORM, dan pola arsitektur MVC (Model-View-Controller). Aplikasi ini bertujuan untuk mengelola pengguna dalam sistem edukasi dengan fitur-fitur yang lengkap, termasuk registrasi, login, dan tampilan data yang dapat menggabungkan beberapa tabel menggunakan eager loading dari Sequelize.

Aplikasi ini mengimplementasikan berbagai fitur terkait dengan pengelolaan data pengguna, termasuk validasi, autentikasi, asosiasi antar entitas, dan pengelolaan session. EduPay-Iya juga dilengkapi dengan fitur pencarian dan pengurutan data menggunakan Sequelize.
Teknologi yang Digunakan

    Node.js (Express)
    EJS (Template Engine)
    PostgreSQL (Database)
    Sequelize (ORM)
    Bcryptjs (Enkripsi Password)
    Session Middleware (untuk manajemen session pengguna)
    Sequelize Validation (Validasi data)
    Sequelize Hooks (Event-driven programming dalam CRUD)
    MVC (Arsitektur Model-View-Controller)

Fitur

    1. CRUD Pengguna
    Pengguna dapat melakukan operasi Create, Read, Update, dan Delete terhadap data pengguna.

    2. Autentikasi Pengguna
    Pengguna dapat mendaftar dan masuk ke aplikasi dengan menggunakan email dan password yang terenkripsi dengan bcryptjs.

    3. Search & Sort
    Pengguna dapat melakukan pencarian dan pengurutan data secara langsung (ascending) menggunakan Sequelize dan operatornya.

    4. Asosiasi Data
    Aplikasi ini mengimplementasikan tiga jenis asosiasi relasional:
        One-to-One
        One-to-Many
        Many-to-Many

    5. Eager Loading
    Data gabungan dari dua atau lebih tabel ditampilkan dengan menggunakan eager loading dari Sequelize.

    6. Validasi Data
    Validasi pada model menggunakan berbagai jenis validasi seperti notNull, notEmpty, dan validasi lainnya.

    7. Hooks
    Digunakan untuk menangani proses otomatis pada event tertentu (misalnya sebelum/ sesudah create, update, atau delete).

    8. Middleware dan Session
    Pengelolaan session dan autentikasi pengguna menggunakan middleware dan session.

    9. Penggunaan Helper
    Terdapat helper untuk operasi tertentu yang digunakan dalam beberapa bagian aplikasi.

    10. Fitur Filter
    Digunakan untuk memfilter Course apa saja yang sudah sesuai dengan yang diinginkan User untuk belajar
