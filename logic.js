// ===== RIASEC HEXAGON SCORING =====
const adjacencyMap = {
  'R': {'I': 1, 'A': 2, 'S': 3, 'E': 2, 'C': 1},
  'I': {'R': 1, 'A': 1, 'S': 2, 'E': 3, 'C': 2},
  'A': {'I': 1, 'S': 1, 'E': 2, 'C': 3, 'R': 2},
  'S': {'A': 1, 'E': 1, 'C': 2, 'R': 3, 'I': 2},
  'E': {'S': 1, 'C': 1, 'R': 2, 'I': 3, 'A': 2},
  'C': {'E': 1, 'R': 1, 'I': 2, 'A': 3, 'S': 2}
};

function getDistance(type1, type2) {
  if(type1 === type2) return 0;
  return adjacencyMap[type1][type2];
}

function calculateRIASECScore(userCode, jurusanCocok) {
  // userCode = ["S", "A", "I"]
  // jurusanCocok = ["S", "A", "I"] or similar
  
  // EXACT MATCH
  if(JSON.stringify(userCode) === JSON.stringify(jurusanCocok)){
    return 1000;
  }
  
  let pos1Match = userCode[0] === jurusanCocok[0];
  let pos2Match = userCode[1] === jurusanCocok[1];
  let pos3Match = userCode[2] === jurusanCocok[2];
  
  // TOP 2 MATCH (pos1 & pos2 cocok)
  if(pos1Match && pos2Match){
    let score = 880;
    let dist3 = getDistance(userCode[2], jurusanCocok[2]);
    if(dist3 === 1) score += 20;
    else if(dist3 === 2) score += 10;
    return score;
  }
  
  // POS1 & POS3 MATCH
  if(pos1Match && pos3Match){
    let score = 820;
    let dist2 = getDistance(userCode[1], jurusanCocok[1]);
    if(dist2 === 1) score += 30;
    else if(dist2 === 2) score += 15;
    return score;
  }
  
  // ONLY POS1 MATCH
  if(pos1Match){
    let score = 700;
    let dist2 = getDistance(userCode[1], jurusanCocok[1]);
    let dist3 = getDistance(userCode[2], jurusanCocok[2]);
    
    if(dist2 === 1 && dist3 === 1) score += 100;
    else if(dist2 === 1 || dist3 === 1) score += 50;
    else if(dist2 === 2 && dist3 === 2) score += 25;
    else if(dist2 === 2 || dist3 === 2) score += 10;
    
    return score;
  }
  
  // SAME 3 LETTERS, DIFFERENT ORDER
  let sameLetters = jurusanCocok.every(t => userCode.includes(t)) &&
                    userCode.every(t => jurusanCocok.includes(t));
  
  if(sameLetters){
    let displacement = 0;
    for(let i = 0; i < 3; i++){
      let userIdx = userCode.indexOf(jurusanCocok[i]);
      displacement += Math.abs(userIdx - i);
    }
    
    if(displacement === 2) return 840;
    else if(displacement === 4) return 600;
    else return 530;
  }
  
  // PARTIAL MATCH (2 letters)
  let letterMatches = jurusanCocok.filter(t => userCode.includes(t)).length;
  
  if(letterMatches === 2){
    let score = 350;
    for(let i = 0; i < 3; i++){
      if(userCode.includes(jurusanCocok[i])){
        let userIdx = userCode.indexOf(jurusanCocok[i]);
        if(Math.abs(userIdx - i) <= 1) score += 50;
      }
    }
    return score;
  }
  
  // PARTIAL MATCH (1 letter)
  if(letterMatches === 1) return 100;
  
  // NO MATCH
  return 0;
}

// ==================== NAVIGATION ====================

function show(page){
  ["home","test","tipe","jurusan","karier","explore","profile"].forEach(p=>{
    document.getElementById(p).classList.add("hidden");
  });
  document.getElementById(page).classList.remove("hidden");

  if(page==="tipe") loadTipeDetail();
  if(page==="jurusan") renderJurusan();
  if(page==="karier") renderKarier();
  if(page==="profile") loadProfile();
}

function toggleMenu(){
  document.getElementById("navMenu").classList.toggle("show");
}

// ==================== CALCULATE ====================

function calculate(){
  let score={R:0,I:0,A:0,S:0,E:0,C:0};

  // VALIDATION
  for(let i=0; i<questions.length; i++){
    let val = document.getElementById("q"+i).value;
    if(!val){
      alert("Isi semua pertanyaan dulu ya!");
      return;
    }
  }

  // CALCULATE SCORE
  questions.forEach((q,i)=>{
    score[q[0]] += parseInt(document.getElementById("q"+i).value);
  });

  // SORT & GET TOP 3
  let sorted=Object.entries(score).sort((a,b)=>b[1]-a[1]);
  let top3 = sorted.slice(0,3).map(x=>x[0]);
  let code = top3.join("-");

  // SAVE
  localStorage.setItem("riasec", code);

  // GET TYPE DATA
  let t1 = tipeData[top3[0]];
  let t2 = tipeData[top3[1]];
  let t3 = tipeData[top3[2]];

  // GENERATE DESCRIPTION
  let comboText = `
  Kamu adalah pribadi yang ${t1.trait}, namun juga ${t2.trait}, dan memiliki sisi ${t3.trait}.

  Dalam cara berpikir, kamu cenderung ${t1.style}, didukung oleh kecenderungan untuk ${t2.style}, serta ${t3.style}.

  Kamu kemungkinan akan berkembang di lingkungan yang memberikan ${t1.value}, sekaligus ${t2.value}, dan juga ${t3.value}.
  `;

  // SHOW RESULT
  document.getElementById("hasil").innerHTML=`
  <h3>Kode kamu: ${code}</h3>

  <p>${comboText}</p>

  <p style="opacity:0.8;">
  Kamu tidak harus langsung tahu masa depanmu. Tapi sekarang kamu sudah selangkah lebih dekat 🌱
  </p>

  <p><b>Tipe dominan kamu:</b> ${top3[0]}</p>

  <button class="main" onclick="show('tipe')">
  Lihat Penjelasan Lengkap
  </button>
  `;
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
  Prinsip utama dari teori ini dikenal sebagai person–environment fit, yaitu kesesuaian antara individu dan lingkungan.
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

// ==================== JURUSAN ====================

function renderJurusan(){
  let search=document.getElementById("searchJurusan").value.toLowerCase();
  let filter=document.getElementById("filterJurusan").value;
  let my=localStorage.getItem("riasec")||"";
  let userCode = my ? my.split("-") : [];

  if(!my){
    document.getElementById("jurusanList").innerHTML = `
      <div class="card" style="text-align:center;">
        <p style="opacity:0.7;">Kamu belum mengerjakan assessment.</p>
        <button class="main" onclick="show('test')">Mulai Assessment</button>
      </div>
    `;
    return;
  }

  let html="";
  let list = [...jurusanData];

  list = list.filter(j=>{
    let matchSearch = j.name.toLowerCase().includes(search);
    let matchFilter = true;

    if(filter==="my") matchFilter = true;
    else if(filter!=="all") matchFilter = j.tipe === filter;

    return matchSearch && matchFilter;
  });

  list = list.map(j=>{
    let score = calculateRIASECScore(userCode, j.cocok);
    return {...j, score};
  }).sort((a,b)=>b.score - a.score);

  list.forEach(j=>{
    html+=`
    <div class="card">
    <h3>${j.name}</h3>
    <p><b>Tipe RIASEC:</b> ${j.cocok.join('-')}</p>
    <p><b>Deskripsi:</b> ${j.desc}</p>
    <p><b>Kampus:</b> ${j.kampus}</p>
    <p><b>Sub-Major:</b> ${j.sub || ""}</p>
    <p><b>Potensi Karier:</b> ${j.potkarier || ""}</p>
    
    <div style="margin-top:15px; padding:12px; background:rgba(76,175,80,0.15); border-left:4px solid #4CAF50; border-radius:6px;">
      <p style="margin:0;"><b>Match Score:</b> <span style="color:#4CAF50; font-size:1.2em; font-weight:700;">${j.score}</span><span style="opacity:0.7;">/1000</span></p>
    </div>
    
    </div>`;
  });

  document.getElementById("jurusanList").innerHTML=html;
}

// ==================== KARIER ====================

function renderKarier(){
  let search=document.getElementById("searchKarier").value.toLowerCase();
  let filter=document.getElementById("filterKarier").value;
  let my=localStorage.getItem("riasec")||"";

  if(!my){
    document.getElementById("karierList").innerHTML = `
      <div class="card" style="text-align:center;">
        <p style="opacity:0.7;">Kamu belum mengerjakan assessment.</p>
        <button class="main" onclick="show('test')">Mulai Assessment</button>
      </div>
    `;
    return;
  }

  let html="";
  let top3 = my.split("-");

  let filtered = karierData
  .map(k=>{
    let score = calculateRIASECScore(top3, k.cocok);
    return {...k, score};
  })
  .filter(k=>{

  let matchSearch = k.name.toLowerCase().includes(search);
  let matchFilter = true;

  if(filter==="my"){
  matchFilter = k.score > 0;
  }
  else if(filter!=="all"){
  matchFilter = k.tipe === filter;
  }

  return matchSearch && matchFilter;

  })
  .sort((a,b)=>b.score - a.score);

  filtered.forEach(k=>{
  html+=`
  <div class="card">
  <h3>${k.name}</h3>
  <p><b>Tipe RIASEC:</b> ${k.cocok.join('-')}</p>
  <p>${k.desc}</p>
  <p><b>Gaji:</b> ${k.gaji}</p>
  <p><b>Pendidikan Terakhir yang Dibutuhkan:</b> ${k.pend}</p>
  
  <div style="margin-top:15px; padding:12px; background:rgba(76,175,80,0.15); border-left:4px solid #4CAF50; border-radius:6px;">
    <p style="margin:0;"><b>Match Score:</b> <span style="color:#4CAF50; font-size:1.2em; font-weight:700;">${k.score}</span><span style="opacity:0.7;">/1000</span></p>
  </div>
  
  </div>`;
  });

  document.getElementById("karierList").innerHTML=html;
}

// ==================== PROFILE ====================

function loadProfile(){
  let riasec = localStorage.getItem("riasec") || "Belum mengerjakan assessment";
  document.getElementById("riasecProfile").innerText = riasec;

  let mbti = localStorage.getItem("mbti") || "";
  document.getElementById("mbtiSelect").value = mbti;
  document.getElementById("mbtiResult").innerText = mbti ? "Tipe kamu: " + mbti : "";

  let vision = JSON.parse(localStorage.getItem("vision") || "{}");
  document.getElementById("vision1").value = vision.v1 || "";
  document.getElementById("vision2").value = vision.v2 || "";
  document.getElementById("vision3").value = vision.v3 || "";
  document.getElementById("vision4").value = vision.v4 || "";

  let plan = JSON.parse(localStorage.getItem("plan") || "{}");
  document.getElementById("plan1").value = plan.p1 || "";
  document.getElementById("plan2").value = plan.p2 || "";
  document.getElementById("plan3").value = plan.p3 || "";
  document.getElementById("plan4").value = plan.p4 || "";

  let refleksi = JSON.parse(localStorage.getItem("refleksi") || "{}");
  document.getElementById("ref1").value = refleksi.r1 || "";
  document.getElementById("ref2").value = refleksi.r2 || "";
  document.getElementById("ref3").value = refleksi.r3 || "";
  document.getElementById("ref4").value = refleksi.r4 || "";
  document.getElementById("ref5").value = refleksi.r5 || "";
}

// ==================== SAVE FUNCTIONS ====================

function saveMBTI(){
  let mbti = document.getElementById("mbtiSelect").value;
  if(!mbti) return alert("Pilih MBTI dulu ya!");
  localStorage.setItem("mbti", mbti);
  document.getElementById("mbtiResult").innerText = "Tipe kamu: " + mbti;
  alert("✅ MBTI tersimpan!");
}

function saveVision(){
  let v1 = document.getElementById("vision1").value.trim();
  let v2 = document.getElementById("vision2").value.trim();
  let v3 = document.getElementById("vision3").value.trim();
  let v4 = document.getElementById("vision4").value.trim();
  
  if(!v1 || !v2 || !v3 || !v4){
    return alert("❌ Semua field harus diisi!");
  }
  
  let data = {v1, v2, v3, v4};
  localStorage.setItem("vision", JSON.stringify(data));
  alert("✅ Vision tersimpan!");
}

function savePlan(){
  let p1 = document.getElementById("plan1").value.trim();
  let p2 = document.getElementById("plan2").value.trim();
  let p3 = document.getElementById("plan3").value.trim();
  let p4 = document.getElementById("plan4").value.trim();
  
  if(!p1 || !p2 || !p3 || !p4){
    return alert("❌ Semua field harus diisi!");
  }
  
  let data = {p1, p2, p3, p4};
  localStorage.setItem("plan", JSON.stringify(data));
  alert("✅ Plan tersimpan!");
}

function saveRefleksi(){
  let r1 = document.getElementById("ref1").value.trim();
  let r2 = document.getElementById("ref2").value.trim();
  let r3 = document.getElementById("ref3").value.trim();
  let r4 = document.getElementById("ref4").value.trim();
  let r5 = document.getElementById("ref5").value.trim();
  
  if(!r1 || !r2 || !r3 || !r4 || !r5){
    return alert("❌ Semua field harus diisi!");
  }
  
  let data = {r1, r2, r3, r4, r5};
  localStorage.setItem("refleksi", JSON.stringify(data));
  alert("✅ Refleksi tersimpan!");
}

// ==================== PDF EXPORT ====================

function exportToPDF(){
  try {
    let riasec = localStorage.getItem("riasec") || "Belum ada";
    let mbti = localStorage.getItem("mbti") || "Belum dipilih";
    let vision = JSON.parse(localStorage.getItem("vision") || "{}");
    let plan = JSON.parse(localStorage.getItem("plan") || "{}");
    let refleksi = JSON.parse(localStorage.getItem("refleksi") || "{}");
    
    let htmlContent = `
    <div style="font-family: Arial; max-width: 210mm; margin: auto; padding: 20mm;">
      <h1 style="text-align: center; color: #0b1e3d; margin-bottom: 10px;">🌱 FYP - FIND YOUR PURPOSE</h1>
      <p style="text-align: center; color: #666; margin-bottom: 30px;">Personal Career Assessment Report</p>
      
      <hr style="border: 1px solid #ddd; margin: 30px 0;">
      
      <h2 style="color: #0b1e3d; border-left: 5px solid #0b1e3d; padding-left: 15px; margin-bottom: 15px;">📊 RIASEC Result</h2>
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #4CAF50; text-align: center;">
        <h3 style="font-size: 32px; color: #0b1e3d; margin: 0;">${riasec}</h3>
        <p style="color: #666; margin-top: 10px;">Kombinasi 3 tipe kepribadian dominanmu berdasarkan Holland Code</p>
      </div>
      
      <h2 style="color: #0b1e3d; border-left: 5px solid #0b1e3d; padding-left: 15px; margin: 30px 0 15px 0;">✨ MBTI Type</h2>
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #4CAF50;">
        <p><strong>Tipe MBTI:</strong> ${mbti || 'Belum dipilih'}</p>
      </div>
      
      <h2 style="color: #0b1e3d; border-left: 5px solid #0b1e3d; padding-left: 15px; margin: 30px 0 15px 0;">🌸 Vision Board</h2>
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #4CAF50;">
        ${vision.v1 ? `<p><strong>10 tahun lagi:</strong> ${vision.v1}</p>` : '<p style="color: #999;">Belum ada data</p>'}
        ${vision.v2 ? `<p><strong>Goals utama:</strong> ${vision.v2}</p>` : ''}
        ${vision.v3 ? `<p><strong>Kebahagiaan:</strong> ${vision.v3}</p>` : ''}
        ${vision.v4 ? `<p><strong>Nilai hidup:</strong> ${vision.v4}</p>` : ''}
      </div>
      
      <h2 style="color: #0b1e3d; border-left: 5px solid #0b1e3d; padding-left: 15px; margin: 30px 0 15px 0;">🚀 Career Mapping</h2>
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #4CAF50;">
        ${plan.p1 ? `<p><strong>3-6 bulan:</strong> ${plan.p1}</p>` : '<p style="color: #999;">Belum ada data</p>'}
        ${plan.p2 ? `<p><strong>1-3 tahun:</strong> ${plan.p2}</p>` : ''}
        ${plan.p3 ? `<p><strong>Skills:</strong> ${plan.p3}</p>` : ''}
        ${plan.p4 ? `<p><strong>Action:</strong> ${plan.p4}</p>` : ''}
      </div>
      
      <h2 style="color: #0b1e3d; border-left: 5px solid #0b1e3d; padding-left: 15px; margin: 30px 0 15px 0;">🪞 Refleksi Diri</h2>
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #4CAF50;">
        ${refleksi.r1 ? `<p><strong>1. Penting:</strong> ${refleksi.r1}</p>` : '<p style="color: #999;">Belum ada data</p>'}
        ${refleksi.r2 ? `<p><strong>2. Hidup:</strong> ${refleksi.r2}</p>` : ''}
        ${refleksi.r3 ? `<p><strong>3. Ketakutan:</strong> ${refleksi.r3}</p>` : ''}
        ${refleksi.r4 ? `<p><strong>4. Kekuatan:</strong> ${refleksi.r4}</p>` : ''}
        ${refleksi.r5 ? `<p><strong>5. Impian:</strong> ${refleksi.r5}</p>` : ''}
      </div>
      
      <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #ddd; text-align: center; color: #999; font-size: 12px;">
        <p>Generated on ${new Date().toLocaleDateString('id-ID')} at ${new Date().toLocaleTimeString('id-ID')}</p>
        <p>FYP - Find Your Purpose © 2026</p>
      </div>
    </div>
    `;
    
    const opt = {
      margin: 10,
      filename: 'FYP_Result_' + new Date().toLocaleDateString('id-ID').replace(/\//g, '-') + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    
    html2pdf().set(opt).from(htmlContent).save();
    
    alert("✅ PDF berhasil diunduh!\n\n💡 File tersimpan di folder Downloads kamu.");
    
  } catch(error) {
    console.error("PDF Error:", error);
    alert("❌ Error saat membuat PDF. Coba lagi!\n\nError: " + error.message);
  }
}