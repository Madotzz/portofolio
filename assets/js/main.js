/* =========================================================
   Landing Page Portofolio: interaksi
   1. Menu burger   2. Modal (dialog)   3. Validasi form
   ========================================================= */

/* ---------- 1. Menu burger ---------- */
const burger = document.getElementById('burger');
const menuMobile = document.getElementById('menu-mobile');

function setMenu(open) {
  menuMobile.hidden = !open;
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
}

burger.addEventListener('click', () => {
  setMenu(burger.getAttribute('aria-expanded') !== 'true');
});

// Tutup menu setelah salah satu tautan diklik
menuMobile.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => setMenu(false));
});

/* ---------- 2. Modal ---------- */
document.querySelectorAll('[data-modal-open]').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.getElementById(btn.dataset.modalOpen).showModal();
  });
});

document.querySelectorAll('dialog').forEach((dialog) => {
  // Tombol tutup
  dialog.querySelector('[data-modal-close]').addEventListener('click', () => dialog.close());
  // Klik di area gelap (backdrop) menutup modal
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
});

/* ---------- 3. Validasi form kontak ---------- */
const form = document.getElementById('form-kontak');
const sukses = document.getElementById('sukses');
const hitungPesan = document.getElementById('hitung-pesan');
const MIN_PESAN = 10;
const POLA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Aturan tiap kolom: mengembalikan teks error, atau '' jika valid
const aturan = {
  nama: (v) => {
    if (!v) return 'Nama wajib diisi.';
    if (v.length < 3) return 'Nama minimal 3 karakter.';
    return '';
  },
  email: (v) => {
    if (!v) return 'Email wajib diisi.';
    if (!POLA_EMAIL.test(v)) return 'Format email belum benar. Contoh: nama@email.com';
    return '';
  },
  pesan: (v) => {
    if (!v) return 'Pesan wajib diisi.';
    if (v.length < MIN_PESAN) return `Pesan minimal ${MIN_PESAN} karakter.`;
    return '';
  },
};

// Tampilkan hasil validasi: kelas is-valid / is-invalid + teks error
function tampilkanStatus(input, pesanError) {
  const elError = document.getElementById(`err-${input.name}`);
  const salah = pesanError !== '';

  input.classList.toggle('is-invalid', salah);
  input.classList.toggle('is-valid', !salah);
  input.setAttribute('aria-invalid', String(salah));

  elError.textContent = pesanError;
  elError.hidden = !salah;
}

function validasi(input) {
  const pesanError = aturan[input.name](input.value.trim());
  tampilkanStatus(input, pesanError);
  return pesanError === '';
}

const kolom = [...form.querySelectorAll('input, textarea')];

kolom.forEach((input) => {
  // Cek saat pengguna selesai mengisi, lalu cek langsung saat mengetik
  input.addEventListener('blur', () => validasi(input));
  input.addEventListener('input', () => {
    sukses.hidden = true;
    if (input.hasAttribute('aria-invalid')) validasi(input);
  });
});

form.pesan.addEventListener('input', () => {
  hitungPesan.textContent = `${form.pesan.value.trim().length} / ${MIN_PESAN} karakter minimum`;
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const hasil = kolom.map(validasi); // validasi semua kolom sekaligus
  const pertamaSalah = kolom[hasil.indexOf(false)];

  if (pertamaSalah) {
    sukses.hidden = true;
    pertamaSalah.focus();
    return;
  }

  sukses.textContent = `Terima kasih, ${form.nama.value.trim()}. Pesanmu sudah terkirim.`;
  sukses.hidden = false;
  form.reset();
  hitungPesan.textContent = `0 / ${MIN_PESAN} karakter minimum`;
  kolom.forEach((input) => {
    input.removeAttribute('aria-invalid');
    input.classList.remove('is-invalid', 'is-valid');
  });
});
