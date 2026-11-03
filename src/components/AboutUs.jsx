import React from 'react';

const AboutUs = () => {
  return (
    <section id="tentang-kami" className="w-full bg-white text-slate-900 pt-20 pb-0 scroll-mt-20 select-none">
      <div className="max-w-3xl mx-auto px-6 text-center mb-16">
        {/* Section Heading - Centered */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-8 text-center">
          Tentang Kami
        </h2>

        {/* Text Paragraphs - Centered */}
        <div className="space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed text-center">
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

      {/* 3 Photos Gallery Row */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-0 overflow-hidden border-t border-gray-100 select-none">
        <div className="h-64 sm:h-72 md:h-80 overflow-hidden group">
          <img
            src="/images/group_pavilion.jpg"
            alt="Kegiatan Pengurus TERAMEDIA di Gazebo Alam"
            draggable="false"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none"
          />
        </div>
        <div className="h-64 sm:h-72 md:h-80 overflow-hidden group border-x border-white/20">
          <img
            src="/images/group_water.jpg"
            alt="Kegiatan Outbound Kebersamaan TERAMEDIA"
            draggable="false"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none"
          />
        </div>
        <div className="h-64 sm:h-72 md:h-80 overflow-hidden group">
          <img
            src="/images/group_nature.jpg"
            alt="Anggota dan Kader Aktif TERAMEDIA"
            draggable="false"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
