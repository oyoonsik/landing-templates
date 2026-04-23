const templates = [
  {
    title: "원장 신뢰형 병원 상담 랜딩",
    cat: "hospital", label: "병원·의원", free: true,
    desc: "원장 소개·수상 이력·환자 후기 섹션이 핵심. 신뢰 기반 상담 예약 전환에 최적화된 구조입니다.",
    features: ["원장 프로필 + 수상·인증 섹션","환자 후기 카드 슬라이더","카카오 채널 즉시연결 CTA","모바일 최적화 완료"],
    cta: "무료 다운로드"
  },
  {
    title: "비포·애프터 시술 특화 랜딩",
    cat: "hospital", label: "병원·의원", free: false,
    desc: "전후 사진 갤러리, 실시간 예약 폼, 한정 프로모션 배너까지 포함. 시술 상담 전환에 최적화.",
    features: ["비포·애프터 갤러리 섹션","한정 프로모션 카운트다운","실시간 예약 신청 폼","카카오 플로팅 버튼"],
    cta: "₩12,000 구매하기"
  },
  {
    title: "체험단 모집 다이어트 랜딩",
    cat: "diet", label: "헬스·다이어트", free: true,
    desc: "한정 체험단 배너와 체중감량 후기 카드, 긴박감 유도 카운트다운으로 즉각적인 상담 전환 유도.",
    features: ["한정 체험단 배너 + 마감 D-day","체중 감량 후기 카드","카운트다운 타이머 CTA","카카오·전화 즉시연결"],
    cta: "무료 다운로드"
  },
  {
    title: "PT 등록 전환 헬스장 랜딩",
    cat: "diet", label: "헬스·다이어트", free: false,
    desc: "트레이너 소개, 수강 후기, PT 패키지 비교 섹션. 카카오 채널 즉시연결까지 완성된 구조.",
    features: ["트레이너 프로필 카드","PT 패키지 비교 섹션","수강생 후기 + 사진","카카오 즉시 연결"],
    cta: "₩12,000 구매하기"
  },
  {
    title: "합격률 강조 입시학원 랜딩",
    cat: "academy", label: "학원·교육", free: true,
    desc: "성적 향상 그래프, 합격 후기, 강사 프로필 섹션으로 신뢰를 쌓고 무료 상담 신청으로 연결.",
    features: ["성적향상 그래프 섹션","합격 후기 카드","강사 프로필 + 이력","무료 상담 신청 폼"],
    cta: "무료 다운로드"
  },
  {
    title: "커리큘럼 중심 어학원 랜딩",
    cat: "academy", label: "학원·교육", free: false,
    desc: "단계별 커리큘럼 타임라인, 레벨 테스트 CTA, 원비 비교표까지. 등록 전환에 최적화된 구조.",
    features: ["단계별 커리큘럼 타임라인","레벨 테스트 유도 CTA","원비 비교 테이블","상담 신청 + 카카오 연동"],
    cta: "₩12,000 구매하기"
  },
  {
    title: "매물 신뢰형 부동산 상담 랜딩",
    cat: "estate", label: "부동산", free: true,
    desc: "매물 카드 섹션, 공인중개사 소개, 즉시 전화·카카오 플로팅 버튼으로 빠른 상담 연결.",
    features: ["매물 카드 그리드 섹션","공인중개사 프로필","즉시전화 + 카카오 플로팅","모바일 최적화 완료"],
    cta: "무료 다운로드"
  },
  {
    title: "시술 전환형 피부샵 랜딩",
    cat: "beauty", label: "피부·뷰티", free: true,
    desc: "시술 메뉴 카드, 피부 고민별 필터, 당일 예약 강조 CTA로 즉각적인 예약 전환 유도.",
    features: ["시술 메뉴 카드 그리드","피부 고민별 필터 버튼","당일 예약 강조 CTA","카카오 즉시연결 버튼"],
    cta: "무료 다운로드"
  }
];

// Filter
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.card').forEach(card => {
      card.classList.toggle('hidden', f !== 'all' && card.dataset.cat !== f);
    });
  });
});

// Card click → modal
document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => openModal(parseInt(card.dataset.id)));
});

function openModal(id) {
  const t = templates[id];
  document.getElementById('m-tag').innerHTML =
    `<span class="tag tag-industry">${t.label}</span> <span class="tag ${t.free ? 'tag-free' : 'tag-pro'}">${t.free ? '무료' : '프리미엄'}</span>`;
  document.getElementById('m-title').textContent = t.title;
  document.getElementById('m-desc').textContent = t.desc;
  document.getElementById('m-features').innerHTML = t.features.map(f =>
    `<li class="modal-feat"><span class="feat-check">✓</span>${f}</li>`).join('');
  document.getElementById('m-cta').textContent = t.cta;
  document.getElementById('m-cta').onclick = () => {
    // ✅ 실제 다운로드 링크 또는 결제 페이지로 교체
    window.open('https://open.kakao.com/YOUR_LINK', '_blank');
  };
  document.getElementById('modal').classList.add('open');
}

function closeModal(e) {
  if (e.target === document.getElementById('modal')) {
    document.getElementById('modal').classList.remove('open');
  }
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.getElementById('modal').classList.remove('open');
});