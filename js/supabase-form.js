// ── supabase-form.js ──
// 상담 신청 폼 → Supabase DB 저장 전용 스크립트
// 사용법: <script src="js/supabase-form.js"></script>

// ── 설정 (여기만 수정하면 됩니다) ──
const SUPABASE_URL = 'https://jcwdodfiunuorqmekepw.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impjd2RvZGZpdW51b3JxbWVrZXB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNDIwOTAsImV4cCI6MjA5NDYxODA5MH0.t_hDaSsqIYSV2BrQeQvEzf9Wqv8sD8Jvz1GHuwnGGyo';
const TABLE = 'consultations';

// ── 초기화 ──
const _db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
let _currentIndustry = '';

// 카드 클릭 시 업종 자동 저장
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.card[data-cat]').forEach(card => {
    card.addEventListener('click', () => {
      _currentIndustry = card.dataset.cat || '';
    });
  });
});

// ── 핵심 함수: DB 저장 ──
async function saveConsultation({ name, phone, email = '', industry = '', memo = '' }) {
  const { data, error } = await _db.from(TABLE).insert({
    name,
    phone,
    email: email || null,
    industry: industry || _currentIndustry || 'general',
    status: 'wait',
    memo: memo || ''
  });
  if (error) throw error;
  return data;
}

// ── 쇼케이스 모달 폼 핸들러 ──
async function handleDownload() {
  const name  = (document.getElementById('f-name')?.value  || '').trim();
  const phone = (document.getElementById('f-phone')?.value || '').trim();
  const email = (document.getElementById('f-email')?.value || '').trim();
  const btn   = document.getElementById('m-cta');

  // 유효성 검사
  if (!name)  { showFormStatus('이름을 입력해주세요.', 'error');  return; }
  if (!phone) { showFormStatus('연락처를 입력해주세요.', 'error'); return; }
  if (phone.replace(/[^0-9]/g, '').length < 10) {
    showFormStatus('올바른 연락처를 입력해주세요.', 'error'); return;
  }

  // 로딩
  if (btn) btn.classList.add('loading');
  showFormStatus('', '');

  try {
    await saveConsultation({ name, phone, email });

    showFormStatus('✓ 신청 완료! 곧 연락드릴게요 😊', 'success');
    if (btn) btn.classList.remove('loading');

    // 2초 후 모달 닫기 + 폼 초기화
    setTimeout(() => {
      const modal = document.getElementById('modal');
      if (modal) modal.classList.remove('open');
      ['f-name', 'f-phone', 'f-email'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      showFormStatus('', '');
    }, 2000);

  } catch (err) {
    console.error('Supabase 저장 오류:', err);
    showFormStatus('오류가 발생했습니다. 다시 시도해주세요.', 'error');
    if (btn) btn.classList.remove('loading');
  }
}

// ── 개별 랜딩페이지 폼 핸들러 (academy, hospital 등) ──
async function submitLandingForm({ industry }) {
  const name  = (document.getElementById('form-name')?.value  || '').trim();
  const phone = (document.getElementById('form-phone')?.value || '').trim();
  const email = (document.getElementById('form-email')?.value || '').trim();
  const memo  = (document.getElementById('form-memo')?.value  || '').trim();
  const btn   = document.getElementById('form-submit-btn');

  if (!name)  { showLandingStatus('이름을 입력해주세요.', 'error');  return; }
  if (!phone) { showLandingStatus('연락처를 입력해주세요.', 'error'); return; }

  if (btn) btn.disabled = true;
  showLandingStatus('', '');

  try {
    await saveConsultation({ name, phone, email, industry, memo });
    showLandingStatus('✓ 상담 신청이 완료되었습니다! 24시간 내 연락드립니다.', 'success');
    ['form-name','form-phone','form-email','form-memo'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
  } catch (err) {
    console.error('저장 오류:', err);
    showLandingStatus('오류가 발생했습니다. 다시 시도해주세요.', 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
}

// ── 상태 메시지 표시 ──
function showFormStatus(msg, type) {
  const el = document.getElementById('form-status');
  if (!el) return;
  el.textContent = msg;
  el.style.color = type === 'error' ? '#FF503C' : type === 'success' ? '#3DD68C' : '';
  el.style.display = msg ? 'block' : 'none';
}

function showLandingStatus(msg, type) {
  const el = document.getElementById('landing-form-status');
  if (!el) return;
  el.textContent = msg;
  el.style.color = type === 'error' ? '#FF503C' : type === 'success' ? '#3DD68C' : '';
  el.style.display = msg ? 'block' : 'none';
}
