/* ── 카드 데이터 ── */
const cards = [
  { id:0, cat:'hospital', title:'원장 신뢰형 병원 상담 랜딩', desc:'원장 소개·수상 이력·환자 후기 섹션이 핵심. 신뢰 기반 상담 예약 전환에 최적화된 구조입니다.', tag:'병원·의원', free:true, features:['원장 프로필 + 수상·인증 섹션','환자 후기 카드 슬라이더','카카오 채널 즉시연결 CTA','모바일 최적화 완료'] },
  { id:1, cat:'hospital', title:'비포·애프터 시술 특화 랜딩', desc:'전후 사진 갤러리 + 실시간 예약 폼 + 한정 프로모션 배너 포함.', tag:'병원·의원', free:false, price:'₩12,000', features:['비포·애프터 갤러리 섹션','실시간 예약 폼 연동','한정 프로모션 카운트다운','카카오·전화 플로팅 버튼'] },
  { id:2, cat:'diet',     title:'체험단 모집 다이어트 랜딩',  desc:'한정 체험단 배너 + 체중감량 후기 카드 + 긴박감 유도 카운트다운.', tag:'헬스·다이어트', free:true, features:['체험단 모집 배너','후기 카드 슬라이더','카운트다운 타이머','카카오 즉시연결'] },
  { id:3, cat:'diet',     title:'PT 등록 전환 헬스장 랜딩',   desc:'트레이너 소개·수강 후기·PT 패키지 비교 섹션 포함. 카카오 즉시연결.', tag:'헬스·다이어트', free:false, price:'₩12,000', features:['트레이너 프로필 카드','수강 후기 슬라이더','PT 패키지 비교표','카카오 즉시연결 CTA'] },
  { id:4, cat:'academy',  title:'합격률 강조 입시학원 랜딩',  desc:'성적향상 그래프 + 합격 후기 + 강사 프로필 섹션. 무료 상담 신청 폼.', tag:'학원·교육', free:true, features:['성적향상 그래프 섹션','합격 후기 카드','강사 프로필','무료 상담 신청 폼'] },
  { id:5, cat:'academy',  title:'커리큘럼 중심 어학원 랜딩',  desc:'단계별 커리큘럼 타임라인 + 레벨 테스트 CTA + 원비 비교표 포함.', tag:'학원·교육', free:false, price:'₩12,000', features:['커리큘럼 타임라인','레벨 테스트 CTA','원비 비교표','카카오 즉시연결'] },
  { id:6, cat:'estate',   title:'매물 신뢰형 부동산 상담 랜딩', desc:'매물 카드 섹션 + 공인중개사 소개 + 즉시 전화·카카오 플로팅 버튼.', tag:'부동산', free:true, features:['매물 카드 섹션','공인중개사 소개','즉시 전화·카카오 버튼','모바일 최적화'] },
  { id:7, cat:'beauty',   title:'시술 전환형 피부샵 랜딩',    desc:'시술 메뉴 카드 + 피부 고민별 필터 + 당일 예약 강조 CTA 섹션.', tag:'피부·뷰티', free:true, features:['시술 메뉴 카드','피부 고민 필터','당일 예약 CTA','카카오 즉시연결'] },
];

let currentCard = null;

/* ── 리드 데이터 저장소 (로컬 + 외부 전송 준비) ── */
const STORAGE_KEY = 'template_leads';

function getLeads() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
}
function saveLead(lead) {
  const leads = getLeads();
  leads.push(lead);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

/* ── 폼 유효성 검사 ── */
function validateForm() {
  const name  = document.getElementById('f-name').value.trim();
  const phone = document.getElementById('f-phone').value.trim();
  const email = document.getElementById('f-email').value.trim();

  document.getElementById('f-name').classList.remove('error');
  document.getElementById('f-phone').classList.remove('error');
  document.getElementById('f-email').classList.remove('error');

  if (!name) {
    document.getElementById('f-name').classList.add('error');
    showStatus('이름을 입력해 주세요.', 'error');
    return null;
  }
  if (!phone || !/^[0-9\-+\s]{7,20}$/.test(phone)) {
    document.getElementById('f-phone').classList.add('error');
    showStatus('올바른 연락처를 입력해 주세요.', 'error');
    return null;
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    document.getElementById('f-email').classList.add('error');
    showStatus('올바른 이메일 주소를 입력해 주세요.', 'error');
    return null;
  }
  return { name, phone, email };
}

function showStatus(msg, type) {
  const el = document.getElementById('form-status');
  el.textContent = msg;
  el.className = 'form-status ' + type;
}

/* ── 다운로드 처리 ── */
async function handleDownload() {
  if (!currentCard) return;

  const data = validateForm();
  if (!data) return;

  const btn = document.getElementById('m-cta');
  btn.disabled = true;
  btn.classList.add('loading');

  // 리드 데이터 구성
  const lead = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    templateId: currentCard.id,
    templateTitle: currentCard.title,
    templateCategory: currentCard.tag,
    name: data.name,
    phone: data.phone,
    email: data.email || null,
  };

  try {
    // 로컬 저장
    saveLead(lead);

    // 여기에 외부 API 전송 코드 추가 가능 (Google Sheets, Notion, DB 등)
    // await sendToExternalDB(lead);

    // 성공 처리
    await new Promise(r => setTimeout(r, 800)); // 실제 전송 시 제거
    showStatus('✓ 신청 완료! 다운로드 링크를 준비했습니다.', 'success');

    // 실제 다운로드 트리거 (파일 경로 설정)
    // const url = `template/${currentCard.cat}_0${currentCard.id + 1}.html`;
    // const a = document.createElement('a'); a.href = url; a.download = ''; a.click();

    // 버튼 완료 상태
    btn.innerHTML = '<span class="btn-text">✓ 완료</span>';
    btn.style.background = '#3DD68C';
    setTimeout(() => {
      btn.disabled = false;
      btn.classList.remove('loading');
      btn.innerHTML = '<span class="btn-text">무료 다운로드</span><div class="spinner"></div>';
      btn.style.background = '';
    }, 3000);

  } catch (err) {
    showStatus('오류가 발생했습니다. 다시 시도해 주세요.', 'error');
    btn.disabled = false;
    btn.classList.remove('loading');
  }
}

/* ── 모달 열기 ── */
function openModal(id) {
  currentCard = cards[id];
  const c = currentCard;

  // 태그
  document.getElementById('m-tag').innerHTML =
    `<span class="tag tag-industry">${c.tag}</span>
     <span class="tag ${c.free ? 'tag-free' : 'tag-pro'}">${c.free ? '무료' : '프리미엄'}</span>`;

  document.getElementById('m-title').textContent = c.title;
  document.getElementById('m-desc').textContent  = c.desc;

  // 기능 목록
  document.getElementById('m-features').innerHTML =
    c.features.map(f =>
      `<li class="modal-feat"><span class="feat-check">✓</span>${f}</li>`
    ).join('');

  // 버튼 텍스트
  const btn = document.getElementById('m-cta');
  btn.innerHTML = `<span class="btn-text">${c.free ? '무료 다운로드' : '구매하기'}</span><div class="spinner"></div>`;
  btn.style.background = '';
  btn.disabled = false;
  btn.classList.remove('loading');

  // 폼 초기화
  ['f-name','f-phone','f-email'].forEach(id => {
    const el = document.getElementById(id);
    el.value = ''; el.classList.remove('error');
  });
  const st = document.getElementById('form-status');
  st.className = 'form-status'; st.textContent = '';

  document.getElementById('modal').classList.add('open');
}

function closeModal(e) {
  if (e.target === document.getElementById('modal'))
    document.getElementById('modal').classList.remove('open');
}

/* ── 카드 클릭 ── */
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => openModal(+card.dataset.id));
});
document.querySelectorAll('.card-dl-btn').forEach(btn => {
  btn.addEventListener('click', e => { e.stopPropagation(); openModal(+btn.closest('.card').dataset.id); });
});

/* ── 필터 ── */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.card').forEach(c => {
      c.classList.toggle('hidden', f !== 'all' && c.dataset.cat !== f);
    });
  });
});