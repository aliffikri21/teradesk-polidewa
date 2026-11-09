import React from 'react';

const aboutImages = [
  {
    src: '/images/about/img1.webp',
    alt: 'Kegiatan Pengurus TERAMEDIA di Gazebo Bersama Anggota',
  },
  {
    src: '/images/about/img2.webp',
    alt: 'Outbound dan Kebersamaan Mahasiswa TERAMEDIA di Pantai Membawa Bendera',
  },
  {
    src: '/images/about/img3.webp',
    alt: 'Dokumentasi Kebersamaan dan Dinamika Organisasi TERAMEDIA',
  },
  {
    src: '/images/about/img4.webp',
    alt: 'Pelatihan dan Kaderisasi Anggota Baru TERAMEDIA',
  },
  {
    src: '/images/about/img5.webp',
    alt: 'Foto Bersama Pengurus dan Kader TERAMEDIA dengan Spanduk Multimedia Teknik',
  },
];

const AboutUs = () => {
  // Duplikasi 3x (15 gambar) untuk memastikan perputaran infinite marquee mulus 100% tanpa jeda
  const marqueeList = [...aboutImages, ...aboutImages, ...aboutImages];

  return (
    <section
      id="tentang-kami"
      className="w-full bg-white text-slate-900 pt-16 sm:pt-20 lg:pt-24 pb-0 scroll-mt-20 select-none overflow-hidden"
    >
      {/* =========================================================================
          TEXT CONTENT: Left-aligned clean editorial layout matching design reference
          ========================================================================= */}
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-12 mb-8 sm:mb-12">
        {/* Section Heading - Left-Aligned */}
        <h2 className="text-3xl sm:text-4xl md:text-[40px] lg:text-[44px] font-bold text-slate-950 tracking-tight mb-5 sm:mb-6 text-left">
          Tentang Kami
        </h2>

        {/* Text Paragraphs - Clean responsive text alignment */}
        <div className="space-y-4 sm:space-y-5 text-slate-800 text-sm sm:text-base md:text-[16px] lg:text-[17px] leading-relaxed max-w-4xl text-left sm:text-justify font-normal">
          <p>
            TERAMEDIA merupakan suatu organisasi Program Studi Teknologi Rekayasa Multimedia yang dinaungi oleh kampus Politeknik Dewantara. Didirikan pada tahun 14 Februari 2020 hingga saat ini telah aktif selama 6 tahun.
          </p>

          <p>
            TERAMEDIA merupakan singkatan dari Teknologi Rekayasa Multimedia. Organisasi ini dibuat dengan tujuan membangun wadah kreasi yang aktif, kreatif dan bertanggung jawab.
          </p>

          <p>
            TERAMEDIA sebelumnya bernama HIMAMEDA yang memiliki kepanjangan Himpunan Mahasiswa Multimedia. TERAMEDIA berubah nama pada tanggal [tanggal] dan telah ditetapkan pada Musyawarah Besar - V.
          </p>
        </div>
      </div>

      {/* =========================================================================
          AUTO-MOVING CAROUSEL: Full-bleed seamless infinite continuous photo ribbon
          - Bergerak otomatis secara halus (GPU accelerated)
          - Pause otomatis saat di-hover / disentuh
          ========================================================================= */}
      <div
        className="w-full relative overflow-hidden select-none border-t border-gray-100 bg-gray-50"
        title="Galeri Dokumentasi TERAMEDIA (Hover untuk menjeda animasi)"
      >
        <div className="animate-marquee-infinite flex gap-0">
          {marqueeList.map((item, index) => (
            <div
              key={index}
              className="w-[280px] sm:w-[400px] md:w-[500px] lg:w-[600px] xl:w-[700px] h-52 sm:h-64 md:h-72 lg:h-[360px] xl:h-[420px] shrink-0 overflow-hidden relative group cursor-pointer"
            >
              <img
                src={item.src}
                alt={item.alt}
                draggable="false"
                className="w-full h-full object-cover select-none transition-transform duration-700 ease-out group-hover:scale-105"
                loading={index < 5 ? 'eager' : 'lazy'}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
