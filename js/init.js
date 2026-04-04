// iOS Safari Fix - Force dark background on load
window.addEventListener('load', function() {
  // Pastikan body punya background
  document.body.style.background = 'linear-gradient(135deg, #0f172e 0%, #1a2557 20%, #1e3a8f 40%, #1a2557 60%, #0f172e 100%)';
  document.body.style.backgroundAttachment = 'fixed';
  
  // Semua section harus punya background
  ["home","test","tipe","jurusan","karier","explore","profile"].forEach(p=>{
    let el = document.getElementById(p);
    if(el) {
      el.style.backgroundColor = 'transparent';
      el.style.backgroundImage = 'linear-gradient(135deg, #0f172e 0%, #1a2557 20%, #1e3a8f 40%, #1a2557 60%, #0f172e 100%)';
      el.style.backgroundAttachment = 'fixed';
      el.style.minHeight = '100vh';
    }
  });
  
  // Set default view
  show('home');
});

// Additional iOS fix
if(/iPad|iPhone|iPod/.test(navigator.userAgent)) {
  document.documentElement.style.height = '100%';
  document.body.style.height = '100%';
}

// ==================== TIPE DETAIL ====================

function loadTipeDetail(){

  let code = localStorage.getItem("riasec") || "";

  let intro = `
  <div class="card">
  <h3>Apa itu RIASEC?</h3>

  <p style="text-align: justify;">
  RIASEC merupakan model tipologi kepribadian dan minat karier yang dikembangkan oleh <b>John L. Holland</b>.
  Model ini menjelaskan bahwa individu cenderung merasa lebih nyaman, termotivasi, dan berfungsi secara optimal 
  ketika mereka berada dalam lingkungan yang sesuai dengan karakteristik kepribadian dan minatnya. 
  Prinsip utama dari teori ini dikenal sebagai <i>person–environment fit</i>, yaitu kesesuaian antara individu dan lingkungan.
  </p>

  <p style="text-align: justify;">
  Holland mengelompokkan minat dan kepribadian individu ke dalam enam tipe utama, yaitu
  Realistic, Investigative, Artistic, Social, Enterprising, dan Conventional (RIASEC).
  Setiap individu umumnya tidak hanya memiliki satu tipe, melainkan kombinasi beberapa tipe dengan
  tiga tipe dominan yang sering disebut sebagai <i>Holland Code</i>.
  </p>

  <p style="text-align: justify;">
  Selain itu, model RIASEC juga disusun dalam bentuk struktur heksagonal.
  Tipe-tipe yang berdekatan dalam struktur tersebut memiliki kemiripan karakteristik, sedangkan tipe yang berlawanan menunjukkan perbedaan yang lebih besar.
  Hal ini membantu dalam memahami hubungan antar minat dan kemungkinan kombinasi yang muncul pada individu.
  </p>

  </div>
  `;

  let detail = {

  R: {
  title: "Realistic",
  desc: "Tipe Realistic ditandai dengan preferensi terhadap aktivitas yang bersifat praktis, konkret, dan berorientasi pada tindakan langsung. Individu dengan tipe ini cenderung lebih nyaman berinteraksi dengan objek, alat, atau lingkungan fisik dibandingkan dengan interaksi sosial yang intens. Mereka umumnya memiliki keterampilan mekanis yang baik, menyukai kegiatan yang membutuhkan koordinasi motorik, serta lebih menyukai penyelesaian masalah yang bersifat langsung dan aplikatif daripada abstrak. Karakteristik lain yang menonjol adalah kecenderungan untuk bekerja secara mandiri, fokus pada hasil nyata, serta kurang tertarik pada aktivitas yang menuntut ekspresi emosional atau komunikasi interpersonal yang kompleks.",
  strength: "Praktis, hands-on, suka memperbaiki atau membangun sesuatu.",
  weakness: "Kurang menikmati pekerjaan yang terlalu abstrak atau teoritis.",
  env: "Lingkungan lapangan, teknik, konstruksi, atau pekerjaan teknis."
  },

  I: {
  title: "Investigative",
  desc: "Tipe Investigative ditandai dengan ketertarikan pada aktivitas yang melibatkan pemikiran analitis, eksplorasi intelektual, dan pemecahan masalah secara sistematis. Individu dengan tipe ini memiliki rasa ingin tahu yang tinggi serta kecenderungan untuk memahami fenomena secara mendalam melalui observasi, analisis, dan penalaran logis. Mereka cenderung menikmati proses berpikir abstrak, bekerja dengan konsep atau teori, serta lebih menyukai aktivitas yang menantang secara intelektual dibandingkan aktivitas yang bersifat rutin. Selain itu, individu Investigative biasanya lebih nyaman bekerja secara mandiri dan menunjukkan ketertarikan yang lebih rendah terhadap aktivitas yang menekankan interaksi sosial intens atau persuasi.",
  strength: "Analitis, kritis, suka riset dan memecahkan masalah.",
  weakness: "Kurang suka interaksi sosial yang terlalu intens.",
  env: "Penelitian, sains, teknologi, atau akademik."
  },

  A: {
  title: "Artistic",
  desc: "Tipe Artistic ditandai dengan kecenderungan untuk mengekspresikan diri secara kreatif, imajinatif, dan tidak konvensional. Individu dengan tipe ini umumnya memiliki sensitivitas terhadap aspek estetika serta kebutuhan untuk menyalurkan ide, emosi, atau pengalaman melalui berbagai bentuk ekspresi. Mereka cenderung tidak menyukai struktur yang kaku dan lebih memilih kebebasan dalam berpikir maupun bertindak. Selain itu, individu Artistic sering menunjukkan fleksibilitas tinggi dalam melihat berbagai kemungkinan, memiliki cara pandang yang orisinal, serta lebih tertarik pada aktivitas yang memungkinkan eksplorasi ide dibandingkan aktivitas yang bersifat sistematis dan terstruktur.",
  strength: "Kreatif, imajinatif, ekspresif.",
  weakness: "Kurang nyaman dengan aturan yang kaku atau struktur yang terlalu ketat.",
  env: "Seni, desain, media, penulisan, atau bidang kreatif."
  },

  S: {
  title: "Social",
  desc: "Tipe Social ditandai dengan orientasi pada interaksi interpersonal serta keinginan untuk membantu, membimbing, atau mendukung orang lain. Individu dengan tipe ini umumnya memiliki empati yang tinggi, kemampuan komunikasi yang baik, serta sensitivitas terhadap kebutuhan dan perasaan orang lain. Mereka cenderung menikmati aktivitas yang melibatkan kerja sama, pertukaran ide, serta hubungan sosial yang bermakna. Selain itu, individu Social lebih tertarik pada proses relasional dibandingkan hasil yang bersifat material, serta menunjukkan preferensi terhadap aktivitas yang memberikan kontribusi langsung terhadap kesejahteraan orang lain.",
  strength: "Empati, komunikatif, suka bekerja dalam tim.",
  weakness: "Bisa terlalu mengutamakan orang lain dibanding diri sendiri.",
  env: "Pendidikan, kesehatan, konseling, atau pekerjaan sosial."
  },

  E: {
  title: "Enterprising",
  desc: "Tipe Enterprising ditandai dengan kecenderungan untuk memengaruhi, memimpin, dan mengarahkan orang lain dalam mencapai tujuan tertentu. Individu dengan tipe ini umumnya memiliki kepercayaan diri yang tinggi, kemampuan komunikasi persuasif, serta orientasi yang kuat terhadap pencapaian dan hasil. Mereka cenderung menikmati situasi yang dinamis dan kompetitif, serta tertarik pada aktivitas yang melibatkan pengambilan keputusan, negosiasi, dan inisiatif. Selain itu, individu Enterprising sering menunjukkan kecenderungan untuk mengambil risiko, memiliki energi yang tinggi dalam berinteraksi sosial, serta berorientasi pada keberhasilan yang dapat diukur secara konkret.",
  strength: "Leadership, percaya diri, persuasive.",
  weakness: "Kadang terlalu dominan atau fokus pada hasil.",
  env: "Bisnis, manajemen, organisasi, atau entrepreneurship."
  },

  C: {
  title: "Conventional",
  desc: "Tipe Conventional ditandai dengan preferensi terhadap aktivitas yang terstruktur, sistematis, dan berorientasi pada keteraturan. Individu dengan tipe ini umumnya memiliki ketelitian yang tinggi, kemampuan organisasi yang baik, serta kenyamanan dalam bekerja dengan prosedur yang jelas dan terstandar. Mereka cenderung menyukai aktivitas yang melibatkan pengelolaan data, detail, dan informasi secara teratur, serta menunjukkan konsistensi dalam mengikuti aturan atau instruksi. Selain itu, individu Conventional biasanya lebih menyukai lingkungan yang stabil dan terprediksi, serta kurang tertarik pada situasi yang ambigu, tidak terstruktur, atau menuntut improvisasi tinggi.",
  strength: "Teliti, rapi, terorganisir.",
  weakness: "Kurang nyaman dengan perubahan atau situasi yang tidak pasti.",
  env: "Administrasi, keuangan, data, atau pekerjaan terstruktur."
  }

  };

  let html = intro;

  html += `
  <div class="card" style="text-align:center;">
  <h2 style="transform:translateX(-8px);">✨ Holland Code-Mu</h2>
  <p style="font-size:28px; font-weight:700; letter-spacing:3px; transform:translateX(-8px);">
  ${code}
  </p>
  <p style="opacity:0.7;">
  Ini adalah kombinasi 3 tipe kepribadian dominanmu
  </p>
  </div>
  `;

  if(!code){
  html += `
  <div class="card">
  <p>Kamu belum mengerjakan assessment.</p>
  </div>
  `;
  document.getElementById("tipeDetail").innerHTML = html;
  return;
  }

  code.split("-").forEach((c, index)=>{

  let d = detail[c];

  html += `
  <div class="card">

  <h3>${index+1}. ${c} - ${d.title}</h3>

  <p style="text-align: justify;">
  <b>Deskripsi:</b> ${d.desc}
  </p>
  <p><b>Kekuatan:</b> ${d.strength}</p>
  <p><b>Kekurangan:</b> ${d.weakness}</p>
  <p><b>Lingkungan yang cocok:</b> ${d.env}</p>

  </div>
  `;
  });

  let userCode = code.split("-");

  let topJurusan = jurusanData
  .map(j=>{
    let score = calculateRIASECScore(userCode, j.cocok);
    return {...j, score};
  })
  .sort((a,b)=>b.score - a.score)
  .slice(0,3);

  let jurusanHTML = topJurusan.map(j=>`
  <li>${j.name} <span style="opacity:0.7;">(${j.cocok.join('-')})</span></li>
  `).join("");

  html += `
  <div class="card">
  <h3>🎓 Rekomendasi Jurusan Terbaik</h3>
  <ul>
  ${jurusanHTML}
  </ul>
  </div>
  `;

  let topKarier = karierData
  .map(k => {
    let score = calculateRIASECScore(userCode, k.cocok);
    return {...k, score};
  })
  .sort((a,b)=>b.score - a.score)
  .slice(0,3);

  let karierHTML = topKarier.map(k=>`
  <li>${k.name} <span style="opacity:0.7;">(${k.cocok.join('-')})</span></li>
  `).join("");

  html += `
  <div class="card">
  <h3>💼 Rekomendasi Karier</h3>
  <ul>
  ${karierHTML}
  </ul>
  </div>
  `;

  document.getElementById("tipeDetail").innerHTML = html;

}

// ==================== RENDER QUESTIONS ====================

function renderQuestions(){
  let qHTML="";
  questions.forEach((q,i)=>{
    qHTML+=`
    <div class="card">
      <p><strong>Pertanyaan ${i+1}:</strong> ${q[1]}</p>
      <select id="q${i}" onchange="updateProgress()" aria-label="Answer for question ${i+1}">
        <option value="" disabled selected>Pilih jawaban</option>
        <option value="1">1 - Sangat Tidak Cocok</option>
        <option value="2">2 - Tidak Cocok</option>
        <option value="3">3 - Netral</option>
        <option value="4">4 - Cocok</option>
        <option value="5">5 - Sangat Cocok</option>
      </select>
    </div>`;
  });
  document.getElementById("questions").innerHTML=qHTML;
  document.getElementById("totalQuestions").innerText = questions.length;
  updateProgress();
}

// ==================== UPDATE PROGRESS ====================

function updateProgress(){
  let answered = 0;
  
  for(let i = 0; i < questions.length; i++){
    let val = document.getElementById("q"+i).value;
    if(val) answered++;
  }
  
  let percentage = (answered / questions.length) * 100;
  document.getElementById("progressBar").style.width = percentage + "%";
  document.getElementById("progressText").innerText = answered;
}

// ==================== INIT ====================

document.addEventListener('DOMContentLoaded', function(){
  renderQuestions();
  show('home');
});
