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

/* ══════════════════════════════════════════════
   TODO: DB 연동 시 이 함수 하나만 채우면 됩니다
   예) Supabase, Google Sheets, Notion 등
══════════════════════════════════════════════ */
async function saveLead(payload) {
  console.log('[리드 수집]', payload);
  await new Promise(r => setTimeout(r, 700)); // 로딩 효과용 딜레이만 있음
}

/* ══════════════════════════════════════════════
   CTA 리드 수집 모달 (무료상담받기 / 패키지문의)
══════════════════════════════════════════════ */
(function injectCtaModal() {
  const html = `
  <div id="cta-modal-bg" style="
    display:none; position:fixed; inset:0; z-index:300;
    background:rgba(0,0,0,0.75); backdrop-filter:blur(6px);
    align-items:center; justify-content:center; padding:24px;
  " onclick="closeCtaModal(event)">
    <div style="
      background:#141414; border:0.5px solid rgba(255,255,255,0.16);
      border-radius:20px; width:100%; max-width:440px; padding:36px;
      position:relative; animation:fadeUp 0.25s ease both;
    ">
      <button onclick="document.getElementById('cta-modal-bg').style.display='none'" style="
        position:absolute; top:18px; right:20px;
        width:32px; height:32px; border-radius:50%;
        background:#1C1C1C; border:0.5px solid rgba(255,255,255,0.08);
        color:rgba(245,245,243,0.45); font-size:18px; cursor:pointer;
        display:flex; align-items:center; justify-content:center;
        font-family:'Noto Sans KR',sans-serif;
      ">✕</button>

      <div id="cta-badge" style="margin-bottom:14px;"></div>
      <h2 id="cta-title" style="font-size:20px;font-weight:900;letter-spacing:-0.025em;line-height:1.3;margin-bottom:8px;color:#F5F5F3;"></h2>
      <p  id="cta-desc"  style="font-size:13px;color:rgba(245,245,243,0.45);line-height:1.7;margin-bottom:22px;"></p>

      <div style="border-top:0.5px solid rgba(255,255,255,0.08);padding-top:20px;margin-bottom:18px;">
        <div style="font-size:12px;font-weight:600;color:rgba(245,245,243,0.45);margin-bottom:14px;display:flex;align-items:center;gap:6px;">
          <span style="display:inline-block;width:4px;height:14px;background:#FF503C;border-radius:2px;"></span>
          연락처를 남겨주시면 빠르게 연락드릴게요
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${['cta-name|이름 *|홍길동|text|30','cta-phone|연락처 *|010-0000-0000|tel|20','cta-email|이메일 (선택)|example@email.com|email|80']
            .map(s => { const [id,label,ph,type,max] = s.split('|'); return `
            <div style="display:flex;flex-direction:column;gap:5px;">
              <label style="font-size:12px;font-weight:500;color:rgba(245,245,243,0.45);">${label}</label>
              <input id="${id}" type="${type}" placeholder="${ph}" maxlength="${max}" style="
                background:#1C1C1C;border:0.5px solid rgba(255,255,255,0.08);border-radius:10px;
                padding:11px 14px;color:#F5F5F3;font-family:'Noto Sans KR',sans-serif;
                font-size:14px;outline:none;width:100%;transition:border-color 0.18s;
              " onfocus="this.style.borderColor='#FF503C'" onblur="this.style.borderColor='rgba(255,255,255,0.08)'">
            </div>`; }).join('')}
        </div>
        <div id="cta-status" style="font-size:13px;padding:10px 14px;border-radius:10px;margin-top:10px;display:none;"></div>
      </div>

      <div style="display:flex;gap:10px;">
        <button id="cta-submit" onclick="submitCta()" style="
          flex:1;background:#FF503C;color:#fff;border:none;border-radius:12px;
          padding:14px 20px;font-family:'Noto Sans KR',sans-serif;font-size:14px;font-weight:700;
          cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;transition:opacity 0.15s;
        " onmouseover="this.style.opacity='0.88'" onmouseout="this.style.opacity='1'">
          <span id="cta-btn-text">신청하기</span>
          <div id="cta-spinner" style="display:none;width:16px;height:16px;border-radius:50%;border:2px solid rgba(255,255,255,0.3);border-top-color:#fff;animation:spin 0.7s linear infinite;"></div>
        </button>
        <button onclick="document.getElementById('cta-modal-bg').style.display='none'" style="
          padding:14px 20px;border-radius:12px;border:0.5px solid rgba(255,255,255,0.16);
          background:transparent;color:rgba(245,245,243,0.45);font-family:'Noto Sans KR',sans-serif;
          font-size:14px;cursor:pointer;white-space:nowrap;transition:all 0.15s;
        " onmouseover="this.style.background='#1C1C1C';this.style.color='#F5F5F3'"
           onmouseout="this.style.background='transparent';this.style.color='rgba(245,245,243,0.45)'">닫기</button>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
})();

let ctaType = '';

function openCtaModal(type) {
  ctaType = type;
  const isPkg = type === 'package';

  document.getElementById('cta-badge').innerHTML = isPkg
    ? '<span style="font-size:11px;font-weight:500;padding:4px 10px;border-radius:100px;background:rgba(180,130,255,0.1);color:#B482FF;border:0.5px solid rgba(180,130,255,0.2);">📦 전 업종 패키지</span>'
    : '<span style="font-size:11px;font-weight:500;padding:4px 10px;border-radius:100px;background:rgba(255,80,60,0.1);color:#FF503C;border:0.5px solid rgba(255,80,60,0.25);">💬 무료 상담</span>';

  document.getElementById('cta-title').textContent = isPkg ? '패키지 문의하기' : '무료 상담 신청';
  document.getElementById('cta-desc').textContent  = isPkg
    ? '5개 업종 전체 템플릿 + 카카오·네이버 연동 가이드 + 무제한 클라이언트 라이선스 관련해서 빠르게 안내해 드릴게요.'
    : '광고비 대비 전환이 안 나오고 있다면, 랜딩 구조부터 같이 봐드릴게요. 무료로 진단해 드립니다.';
  document.getElementById('cta-btn-text').textContent = isPkg ? '문의 신청' : '상담 신청';

  ['cta-name','cta-phone','cta-email'].forEach(id => {
    const el = document.getElementById(id);
    el.value = '';
    el.style.borderColor = 'rgba(255,255,255,0.08)';
  });
  const st = document.getElementById('cta-status');
  st.style.display = 'none';

  const btn = document.getElementById('cta-submit');
  btn.disabled = false;
  btn.style.background = '#FF503C';
  btn.style.opacity = '1';
  document.getElementById('cta-spinner').style.display = 'none';
  document.getElementById('cta-btn-text').style.display = '';

  document.getElementById('cta-modal-bg').style.display = 'flex';
}

function closeCtaModal(e) {
  if (e.target === document.getElementById('cta-modal-bg'))
    document.getElementById('cta-modal-bg').style.display = 'none';
}

async function submitCta() {
  const name  = document.getElementById('cta-name').value.trim();
  const phone = document.getElementById('cta-phone').value.trim();
  const email = document.getElementById('cta-email').value.trim();

  if (!name)  { showCtaStatus('이름을 입력해 주세요.', 'error'); document.getElementById('cta-name').style.borderColor='rgba(255,80,60,0.6)'; return; }
  if (!phone || !/^[0-9\-+\s]{7,20}$/.test(phone)) { showCtaStatus('올바른 연락처를 입력해 주세요.', 'error'); document.getElementById('cta-phone').style.borderColor='rgba(255,80,60,0.6)'; return; }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showCtaStatus('올바른 이메일 주소를 입력해 주세요.', 'error'); document.getElementById('cta-email').style.borderColor='rgba(255,80,60,0.6)'; return; }

  const btn = document.getElementById('cta-submit');
  btn.disabled = true;
  document.getElementById('cta-btn-text').style.display = 'none';
  document.getElementById('cta-spinner').style.display = 'block';

  try {
    await saveLead({ name, phone, email: email || null, type: ctaType });
    showCtaStatus('✓ 신청 완료! 빠르게 연락드릴게요.', 'success');
    btn.innerHTML = '<span>✓ 완료</span>';
    btn.style.background = '#3DD68C';
    setTimeout(() => { document.getElementById('cta-modal-bg').style.display = 'none'; }, 1800);
  } catch {
    showCtaStatus('오류가 발생했습니다. 다시 시도해 주세요.', 'error');
    btn.disabled = false;
    document.getElementById('cta-btn-text').style.display = '';
    document.getElementById('cta-spinner').style.display = 'none';
  }
}

function showCtaStatus(msg, type) {
  const el = document.getElementById('cta-status');
  el.textContent = msg;
  el.style.display = 'block';
  el.style.background = type === 'success' ? 'rgba(61,214,140,0.08)' : 'rgba(255,80,60,0.08)';
  el.style.border      = type === 'success' ? '0.5px solid rgba(61,214,140,0.2)' : '0.5px solid rgba(255,80,60,0.25)';
  el.style.color       = type === 'success' ? '#3DD68C' : '#FF503C';
}

/* ── Nav / Banner 버튼 인터셉트 ── */
document.addEventListener('DOMContentLoaded', () => {
  const navCta = document.querySelector('.nav-cta');
  if (navCta) navCta.addEventListener('click', e => { e.preventDefault(); openCtaModal('consult'); });

  const bannerBtn = document.querySelector('.btn-banner');
  if (bannerBtn) bannerBtn.addEventListener('click', e => { e.preventDefault(); openCtaModal('package'); });
});

/* ══════════════════════════════════════════════
   템플릿 다운로드 모달 (카드 클릭)
══════════════════════════════════════════════ */
function validateForm() {
  const name  = document.getElementById('f-name').value.trim();
  const phone = document.getElementById('f-phone').value.trim();
  const email = document.getElementById('f-email').value.trim();

  ['f-name','f-phone','f-email'].forEach(id => document.getElementById(id).classList.remove('error'));

  if (!name)  { document.getElementById('f-name').classList.add('error');  showStatus('이름을 입력해 주세요.', 'error');  return null; }
  if (!phone || !/^[0-9\-+\s]{7,20}$/.test(phone)) { document.getElementById('f-phone').classList.add('error'); showStatus('올바른 연락처를 입력해 주세요.', 'error'); return null; }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { document.getElementById('f-email').classList.add('error'); showStatus('올바른 이메일 주소를 입력해 주세요.', 'error'); return null; }
  return { name, phone, email };
}

function showStatus(msg, type) {
  const el = document.getElementById('form-status');
  el.textContent = msg;
  el.className = 'form-status ' + type;
}

async function handleDownload() {
  if (!currentCard) return;
  const data = validateForm();
  if (!data) return;

  const btn = document.getElementById('m-cta');
  btn.disabled = true;
  btn.classList.add('loading');

  try {
    await saveLead({
      name: data.name, phone: data.phone, email: data.email || null,
      template_title: currentCard.title, template_category: currentCard.tag,
    });

    showStatus('✓ 신청 완료! 다운로드 링크를 준비했습니다.', 'success');

    /* 실제 파일 다운로드 — 경로 확인 후 주석 해제
    const url = `template/${currentCard.cat}_0${currentCard.id + 1}.html`;
    const a = document.createElement('a'); a.href = url; a.download = ''; a.click(); */

    btn.innerHTML = '<span class="btn-text">✓ 완료</span>';
    btn.style.background = '#3DD68C';
    setTimeout(() => {
      btn.disabled = false;
      btn.classList.remove('loading');
      btn.innerHTML = '<span class="btn-text">무료 다운로드</span><div class="spinner"></div>';
      btn.style.background = '';
    }, 3000);
  } catch {
    showStatus('오류가 발생했습니다. 다시 시도해 주세요.', 'error');
    btn.disabled = false;
    btn.classList.remove('loading');
  }
}

function openModal(id) {
  currentCard = cards[id];
  const c = currentCard;

  document.getElementById('m-tag').innerHTML =
    `<span class="tag tag-industry">${c.tag}</span>
     <span class="tag ${c.free ? 'tag-free' : 'tag-pro'}">${c.free ? '무료' : '프리미엄'}</span>`;
  document.getElementById('m-title').textContent = c.title;
  document.getElementById('m-desc').textContent  = c.desc;
  document.getElementById('m-features').innerHTML =
    c.features.map(f => `<li class="modal-feat"><span class="feat-check">✓</span>${f}</li>`).join('');

  const btn = document.getElementById('m-cta');
  btn.innerHTML = `<span class="btn-text">${c.free ? '무료 다운로드' : '구매하기'}</span><div class="spinner"></div>`;
  btn.style.background = ''; btn.disabled = false; btn.classList.remove('loading');

  ['f-name','f-phone','f-email'].forEach(id => { const el = document.getElementById(id); el.value = ''; el.classList.remove('error'); });
  const st = document.getElementById('form-status'); st.className = 'form-status'; st.textContent = '';

  document.getElementById('modal').classList.add('open');
}

function closeModal(e) {
  if (e.target === document.getElementById('modal'))
    document.getElementById('modal').classList.remove('open');
}

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => openModal(+card.dataset.id));
});

document.querySelectorAll('.card-dl-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const url = btn.dataset.preview;
    if (url) window.open(url, '_blank');
    else openModal(+btn.closest('.card').dataset.id);
  });
});

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