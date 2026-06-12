/**
 * 삼국시대 문화유산 발굴 & 복원 체험관 - 핵심 애플리케이션 로직
 * Three.js 기반의 3D 인터랙션 엔진
 */

// ==========================================
// 1. 유물 데이터 정의 (JSON)
// ==========================================
const HERITAGE_DATA = {
    goguryeo: {
        id: 'goguryeo',
        name: '고구려 금동관식 (金銅冠飾)',
        era: '고구려 (5~6세기)',
        location: '평양시 청암리 토성 출토 (평양 석암리 등 추정)',
        use: '머리 장식 혹은 모자(관)의 전면부 장식품',
        desc: '고구려의 독창적인 기개와 정교한 금속 공예 미학을 보여주는 대표적인 유물입니다. 불꽃이 활활 타오르는 듯한 태양과 불꽃무늬(화염문)를 역동적이면서도 유려하게 형상화한 것이 특징입니다. 금동판을 가위로 오려내고 끌로 문양을 뚫어 내었으며, 가장자리에는 촘촘하게 톱니 모양의 미세한 돌기를 조각하여 조형미를 극대화했습니다. 황금의 영원한 빛을 표현하기 위해 금동 재질로 제작되었습니다.',
        features: '• 화염문(불꽃무늬): 하늘과 우주의 기운, 그리고 태양을 숭배하던 고구려인들의 역동적 사상 투영\n• 투조(뚫어내기) 기법: 금속판을 뚫어 가벼우면서도 세밀한 기하학적 문양 표현\n• 세잎무늬(삼엽문) 배치: 중앙 줄기를 축으로 생명력 넘치는 비대칭적 균형 조율'
    },
    baekje: {
        id: 'baekje',
        name: '백제 무령왕릉 금제 관식 (金製冠飾)',
        era: '백제 (6세기 초, 525년경)',
        location: '충청남도 공주시 금성동 무령왕릉 출토 (국보 제154호)',
        use: '왕 또는 왕비의 관(모자) 좌우를 장식하던 금제 꾸미개',
        desc: '백제 무령왕릉에서 출토된 왕의 금제 관식입니다. 얇은 금판에 꽃잎과 타오르는 불꽃(화염문) 문양을 유려하게 도안하고 정교하게 오려내어 완성했습니다. 전면에 구슬 모양의 둥근 금박 장식(보개)이 줄줄이 부착되어 있어, 미풍이 불거나 머리를 움직일 때마다 수많은 금박 조각들이 흔들리며 신비롭고 화려한 시각적 효과를 자아냅니다. 백제 미술 특유의 온화하고 부드러운 선의 아름다움과 높은 격조를 보여줍니다.',
        features: '• 인동당초문(꽃불꽃무늬): 아라베스크 풍의 식물 덩굴 선이 불꽃처럼 상승하는 형상 조각\n• 영락(떨잠) 장식: 얇은 금박 원판 127개를 부착해 움직일 때마다 영롱하게 흔들리는 동적 미학 완성\n• 좌우 대칭성: 정적인 대칭 구조 속에 생동하는 덩굴 곡선을 삽입한 뛰어난 조형 균형'
    },
    silla: {
        id: 'silla',
        name: '경주 얼굴무늬 수막새 (Roof-end Tile)',
        era: '신라 (7세기, 삼국시대~통일신라)',
        location: '경상북도 경주시 사정동 영묘사 터 출토 (보물 제2010호)',
        use: '전통 목조 건축의 기와지붕 끝을 마감하고 장식하는 원형 와당',
        desc: '‘신라의 미소’라는 별칭으로 널리 알려진 신라의 대표적 기와 유물입니다. 기존의 정형화된 연꽃무늬나 도깨비무늬 수막새와 달리, 인간의 따뜻한 미소를 흙으로 직접 빚어 표현한 유일한 와당입니다. 와당의 틀(와범)을 찍어낸 것이 아니라 손으로 빚어 얼굴 모양을 세밀히 조각한 후 구워냈기에 신라 장인의 자유롭고 천재적인 예술성이 돋보입니다. 천년의 세월을 뚫고 다정하게 웃는 자비로운 눈망울과 포근한 뺨이 신라인들의 평화롭고 원융(圓融)한 내면 세계를 고스란히 담고 있습니다.',
        features: '• 신라의 미소: 인위적이지 않은 자연스러운 입꼬리 굴곡을 통해 자비와 미소의 깊이 표현\n• 수제(Handmade) 성형: 틀로 찍어내지 않고 손으로 점토를 성형한 유일무이한 소조(Plastic) 예술\n• 와전 공예 기술: 적절한 가마 온도 조절과 유약을 바르지 않고 구워낸 특유의 고운 회청색 기와'
    }
};

// ==========================================
// 2. Web Audio API 기반 사운드 신시사이저
// ==========================================
class SoundFX {
    constructor() {
        this.ctx = null;
    }
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }
    resume() {
        this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }
    playHit() {
        this.resume();
        const now = this.ctx.currentTime;
        
        // 저음 타격감 (돌 묵직함)
        const oscThud = this.ctx.createOscillator();
        const gainThud = this.ctx.createGain();
        oscThud.connect(gainThud);
        gainThud.connect(this.ctx.destination);
        oscThud.type = 'triangle';
        oscThud.frequency.setValueAtTime(100, now);
        oscThud.frequency.exponentialRampToValueAtTime(10, now + 0.2);
        gainThud.gain.setValueAtTime(0.6, now);
        gainThud.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        
        oscThud.start(now);
        oscThud.stop(now + 0.2);
        
        // 고음 금속성 클링크 (망치 접촉음)
        const oscClink = this.ctx.createOscillator();
        const gainClink = this.ctx.createGain();
        oscClink.connect(gainClink);
        gainClink.connect(this.ctx.destination);
        oscClink.type = 'sine';
        oscClink.frequency.setValueAtTime(900, now);
        oscClink.frequency.exponentialRampToValueAtTime(300, now + 0.05);
        gainClink.gain.setValueAtTime(0.2, now);
        gainClink.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        
        oscClink.start(now);
        oscClink.stop(now + 0.05);
    }
    playSnap() {
        this.resume();
        const now = this.ctx.currentTime;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.12); // C6
        
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.005, now + 0.15);
        
        osc.start(now);
        osc.stop(now + 0.15);
    }
    playSuccess() {
        this.resume();
        const now = this.ctx.currentTime;
        
        // 동양풍 5음음계 아르페지오 (도-레-미-솔-라-도)
        const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C4, D4, E4, G4, A4, C5
        
        scale.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.1);
            
            gain.gain.setValueAtTime(0, now + i * 0.1);
            gain.gain.linearRampToValueAtTime(0.2, now + i * 0.1 + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.6);
            
            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.6);
        });
    }
}
const sfx = new SoundFX();

// ==========================================
// 3. 애플리케이션 상태 및 전역 변수
// ==========================================
const STATES = {
    MAIN: 'main',
    EXCAVATION: 'excavation',
    RESTORATION: 'restoration',
    RESULT: 'result'
};
let currentState = STATES.MAIN;
let selectedKingdom = null;

// Three.js 인스턴스 변수
let scene, camera, renderer, orbitControls;
let mainCanvas;
let currentArtifact = null; // 현재 전시/게임용 유물 그룹

// 애니메이션 프레임 참조
let animationFrameId = null;

// 게임 플레이용 변수
let rockChunksGroup = null; // 발굴용 돌 덩어리 그룹
let rockChunks = [];        // 돌 조각 상태 배열
let excavationProgress = 0; // 진행률 (0~100)

let puzzlePieces = [];      // 복원용 조각 배열 (Local Clipped)
let selectedPiece = null;   // 현재 클릭/드래그 선택된 조각
let dragOffset = new THREE.Vector2(); // 드래그 마우스 오프셋
let snappedCount = 0;       // 스냅 완료된 조각 개수

// 동적 오브젝트 참조 (회전/흔들림용)
let dynamicSwayables = [];  // 흔들리는 영락(medallions) 배열

// 로드된 에셋 캐시
let loadedSillaScene = null;

// ==========================================
// 4. HTML UI 요소 참조
// ==========================================
let loadingOverlay, progressFill, progressPercentage, loaderTitle;
let screenMain, screenResult;
let hudExcavation, hudRestoration;
let backToMainBtn, restartGameBtn;
let pieceControlPanel, rotateCwBtn;
let revealScreen;

// 결과 화면 슬라이더 & 토글
let toggleRotateBtn, resetCamBtn;
let exposureSlider, exposureVal;

// ==========================================
// 5. Three.js 초기화 & 글로벌 세팅
// ==========================================
function initApp() {
    // DOM 요소 매핑
    loadingOverlay = document.getElementById('loading-overlay');
    progressFill = document.getElementById('progress-fill');
    progressPercentage = document.getElementById('progress-percentage');
    loaderTitle = document.getElementById('loader-title');
    
    screenMain = document.getElementById('screen-main');
    screenResult = document.getElementById('screen-result');
    hudExcavation = document.getElementById('hud-excavation');
    hudRestoration = document.getElementById('hud-restoration');
    
    backToMainBtn = document.getElementById('back-to-main-btn');
    restartGameBtn = document.getElementById('restart-game-btn');
    pieceControlPanel = document.getElementById('piece-control-panel');
    rotateCwBtn = document.getElementById('rotate-cw-btn');
    revealScreen = document.getElementById('reveal-screen');
    
    toggleRotateBtn = document.getElementById('toggle-rotate');
    resetCamBtn = document.getElementById('reset-cam');
    exposureSlider = document.getElementById('exposure-slider');
    exposureVal = document.getElementById('exposure-val');
    
    mainCanvas = document.getElementById('game-canvas');

    // 1. Three.js 렌더러 생성
    renderer = new THREE.WebGLRenderer({ canvas: mainCanvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.localClippingEnabled = true; // 로컬 클리핑 활성화 (3D 퍼즐 구현용)
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    // 2. 씬 생성
    scene = new THREE.Scene();

    // 3. 카메라 생성
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 6);

    // 4. 조명 설정
    setupLights();

    // 5. OrbitControls 생성 (결과 화면에서만 활성화)
    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.05;
    orbitControls.minDistance = 3;
    orbitControls.maxDistance = 12;
    orbitControls.enabled = false; // 시작할 때는 비활성화

    // 6. 이벤트 바인딩
    window.addEventListener('resize', onWindowResize);
    setupUIEvents();

    // 7. 메인 화면 상태로 시작
    changeState(STATES.MAIN);
    
    // 8. 렌더 루프 시작
    animate();
}

function setupLights() {
    // 환경광
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // 메인 조명
    const mainLight = new THREE.DirectionalLight(0xfff6e0, 1.8);
    mainLight.position.set(5, 8, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    mainLight.shadow.bias = -0.001;
    scene.add(mainLight);

    // 보조 채우기 조명
    const fillLight = new THREE.DirectionalLight(0x90b0ff, 0.7);
    fillLight.position.set(-5, 3, -5);
    scene.add(fillLight);

    // 하단 반사광
    const floorLight = new THREE.DirectionalLight(0x504030, 0.4);
    floorLight.position.set(0, -5, 0);
    scene.add(floorLight);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ==========================================
// 6. 3D 모델 생성 / 로딩 함수
// ==========================================
function getGoldMaterial(rough = 0.2, metal = 0.9, colorHex = 0xd4af37) {
    return new THREE.MeshStandardMaterial({
        color: colorHex,
        metalness: metal,
        roughness: rough,
        side: THREE.DoubleSide,
        shadowSide: THREE.DoubleSide
    });
}

/**
 * 고구려 금동관식 생성 (절차적 모델링)
 */
function createGoguryeoModel() {
    const group = new THREE.Group();
    const goldMat = getGoldMaterial(0.15, 0.92, 0xd4af37);
    
    // 1. 하단 머리 띠 기단부 (Cylinder)
    const baseGeom = new THREE.CylinderGeometry(1.2, 1.25, 0.2, 32, 1, true);
    const baseBand = new THREE.Mesh(baseGeom, goldMat);
    baseBand.position.y = -1.2;
    group.add(baseBand);

    // 2. 중앙 웅장한 화염형 가지 (ExtrudeShape)
    const mainShape = new THREE.Shape();
    mainShape.moveTo(0, 0);
    mainShape.bezierCurveTo(0.2, 0.4, 0.4, 0.8, 0.1, 1.4);
    mainShape.bezierCurveTo(0.5, 1.8, 0.6, 2.4, 0.1, 3.0);
    mainShape.bezierCurveTo(0.4, 3.4, 0.2, 4.0, 0, 4.5); // 끝 뾰족한 정점
    mainShape.bezierCurveTo(-0.2, 4.0, -0.4, 3.4, -0.1, 3.0);
    mainShape.bezierCurveTo(-0.6, 2.4, -0.5, 1.8, -0.1, 1.4);
    mainShape.bezierCurveTo(-0.2, 0.8, -0.2, 0.4, 0, 0);

    const extrudeSettings = { depth: 0.04, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.015, bevelThickness: 0.015 };
    const branchGeom = new THREE.ExtrudeGeometry(mainShape, extrudeSettings);
    
    const mainBranch = new THREE.Mesh(branchGeom, goldMat);
    mainBranch.position.set(0, -1.2, 0);
    mainBranch.castShadow = true;
    mainBranch.receiveShadow = true;
    group.add(mainBranch);

    // 3. 좌우 작은 불꽃 가지
    const leftBranch = mainBranch.clone();
    leftBranch.scale.set(0.72, 0.72, 0.72);
    leftBranch.position.set(-0.75, -1.1, 0.08);
    leftBranch.rotation.z = Math.PI / 6.5;
    group.add(leftBranch);

    const rightBranch = mainBranch.clone();
    rightBranch.scale.set(0.72, 0.72, 0.72);
    rightBranch.position.set(0.75, -1.1, 0.08);
    rightBranch.rotation.z = -Math.PI / 6.5;
    group.add(rightBranch);

    // 4. 흔들리는 영락(Medallions) 부착용 헬퍼 함수
    function attachSwayingMedallion(parent, x, y, z) {
        const medPivot = new THREE.Group();
        medPivot.position.set(x, y, z);
        
        // 얇은 고리/와이어 연결선
        const wireGeom = new THREE.CylinderGeometry(0.008, 0.008, 0.18, 8);
        const wire = new THREE.Mesh(wireGeom, goldMat);
        wire.position.y = -0.09;
        medPivot.add(wire);
        
        // 매달린 황금 원판
        const discGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.004, 16);
        discGeom.rotateX(Math.PI / 2);
        const disc = new THREE.Mesh(discGeom, goldMat);
        disc.position.y = -0.18;
        disc.castShadow = true;
        medPivot.add(disc);

        parent.add(medPivot);
        
        // 흔들림 애니메이션용 배열 등록
        dynamicSwayables.push({
            group: medPivot,
            phase: Math.random() * Math.PI * 2,
            speed: 1.2 + Math.random() * 1.5
        });
    }

    // 중앙 가지에 영락 부착
    attachSwayingMedallion(mainBranch, 0, 1.2, 0.05);
    attachSwayingMedallion(mainBranch, 0, 2.2, 0.05);
    attachSwayingMedallion(mainBranch, 0, 3.2, 0.05);
    attachSwayingMedallion(mainBranch, 0.22, 1.7, 0.05);
    attachSwayingMedallion(mainBranch, -0.22, 1.7, 0.05);

    // 좌우 가지에 영락 부착
    attachSwayingMedallion(leftBranch, 0, 1.5, 0.05);
    attachSwayingMedallion(leftBranch, 0, 2.5, 0.05);
    attachSwayingMedallion(rightBranch, 0, 1.5, 0.05);
    attachSwayingMedallion(rightBranch, 0, 2.5, 0.05);

    group.scale.set(0.9, 0.9, 0.9);
    return group;
}

/**
 * 백제 금제 관식 생성 (절차적 모델링)
 */
function createBaekjeModel() {
    const group = new THREE.Group();
    const goldMat = getGoldMaterial(0.25, 0.88, 0xebc45f); // 백제 금제 관식은 약간 밝고 부드러운 순금 느낌
    
    // 꽃잎 형상과 인동당초문(덩굴문)을 형상화한 유려한 외곽 쉐이프
    const shape = new THREE.Shape();
    shape.moveTo(0, -1.0);
    shape.bezierCurveTo(0.3, -0.8, 0.5, -0.2, 0.2, 0.3);
    shape.bezierCurveTo(0.8, 0.6, 1.1, 1.2, 0.4, 2.0);
    shape.bezierCurveTo(1.2, 2.4, 1.4, 3.3, 0, 4.0); // 메인 불꽃 정상
    shape.bezierCurveTo(-1.4, 3.3, -1.2, 2.4, -0.4, 2.0);
    shape.bezierCurveTo(-1.1, 1.2, -0.8, 0.6, -0.2, 0.3);
    shape.bezierCurveTo(-0.5, -0.2, -0.3, -0.8, 0, -1.0);

    // 정교한 백제 특유의 오픈워크(투조) 구멍 삽입
    const hole1 = new THREE.Path();
    hole1.absellipse(0, 0.8, 0.1, 0.35, 0, Math.PI * 2, false);
    shape.holes.push(hole1);

    const hole2 = new THREE.Path();
    hole2.absellipse(0, 2.4, 0.16, 0.5, 0, Math.PI * 2, false);
    shape.holes.push(hole2);

    const hole3 = new THREE.Path();
    const extrudeSettings = { depth: 0.03, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.012, bevelThickness: 0.012 };
    hole3.absellipse(0.4, 1.5, 0.08, 0.2, 0, Math.PI * 2, false);
    shape.holes.push(hole3);

    const hole4 = new THREE.Path();
    hole4.absellipse(-0.4, 1.5, 0.08, 0.2, 0, Math.PI * 2, false);
    shape.holes.push(hole4);

    const baseGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    
    const mainPlate = new THREE.Mesh(baseGeom, goldMat);
    mainPlate.castShadow = true;
    mainPlate.receiveShadow = true;
    group.add(mainPlate);

    // 덩굴 잎사귀 조각들을 좌우에 정교하게 대칭 배치
    for (let i = 0; i < 5; i++) {
        const leafGeom = new THREE.DodecahedronGeometry(0.14, 1);
        
        const leafL = new THREE.Mesh(leafGeom, goldMat);
        leafL.position.set(-0.4 - i * 0.14, -0.5 + i * 0.6, 0.06);
        leafL.scale.set(1.1, 0.4, 0.2);
        leafL.rotation.z = Math.PI / 4.5;
        leafL.castShadow = true;
        mainPlate.add(leafL);

        const leafR = leafL.clone();
        leafR.position.x = 0.4 + i * 0.14;
        leafR.rotation.z = -Math.PI / 4.5;
        mainPlate.add(leafR);
    }

    // 흔들리는 영락(Medallions) 대량 부착 (무령왕릉 왕관식 특징)
    function attachSwayingMedallion(parent, x, y, z) {
        const medPivot = new THREE.Group();
        medPivot.position.set(x, y, z);
        
        const wireGeom = new THREE.CylinderGeometry(0.005, 0.005, 0.15, 8);
        const wire = new THREE.Mesh(wireGeom, goldMat);
        wire.position.y = -0.075;
        medPivot.add(wire);
        
        const discGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.003, 16);
        discGeom.rotateX(Math.PI / 2);
        const disc = new THREE.Mesh(discGeom, goldMat);
        disc.position.y = -0.15;
        disc.castShadow = true;
        medPivot.add(disc);

        parent.add(medPivot);
        
        dynamicSwayables.push({
            group: medPivot,
            phase: Math.random() * Math.PI * 2,
            speed: 1.5 + Math.random() * 2.0
        });
    }

    attachSwayingMedallion(mainPlate, 0, 0.1, 0.05);
    attachSwayingMedallion(mainPlate, 0.3, 0.8, 0.05);
    attachSwayingMedallion(mainPlate, -0.3, 0.8, 0.05);
    attachSwayingMedallion(mainPlate, 0, 1.6, 0.05);
    attachSwayingMedallion(mainPlate, 0.4, 2.0, 0.05);
    attachSwayingMedallion(mainPlate, -0.4, 2.0, 0.05);
    attachSwayingMedallion(mainPlate, 0, 3.2, 0.05);

    group.scale.set(0.9, 0.9, 0.9);
    return group;
}

/**
 * 신라 수막새 3D 모델 비동기 로딩 연동
 */
function loadSillaModel(onSuccess) {
    if (loadedSillaScene) {
        // 이미 캐시된 에셋이 있다면 즉시 호출
        onSuccess(loadedSillaScene.clone());
        return;
    }

    // 로더 UI 세팅
    loadingOverlay.style.display = 'flex';
    loadingOverlay.classList.remove('fade-out');
    loaderTitle.textContent = '수막새 GLB 모델 불러오는 중';
    progressFill.style.width = '0%';
    progressPercentage.textContent = '0%';

    const loader = new THREE.GLTFLoader();
    loader.load('수막새41.glb',
        (gltf) => {
            loadedSillaScene = gltf.scene;
            
            // 수막새 모델 최적화 세팅
            loadedSillaScene.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    // 그림자 및 질감 극대화
                    if (child.material) {
                        child.material.roughness = 0.8;
                        child.material.metalness = 0.1;
                    }
                }
            });

            // 로딩 종료
            progressFill.style.width = '100%';
            progressPercentage.textContent = '100%';
            setTimeout(() => {
                loadingOverlay.classList.add('fade-out');
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                    onSuccess(loadedSillaScene.clone());
                }, 600);
            }, 300);
        },
        (xhr) => {
            if (xhr.lengthComputable) {
                const percent = Math.round((xhr.loaded / xhr.total) * 100);
                progressFill.style.width = `${percent}%`;
                progressPercentage.textContent = `${percent}%`;
            }
        },
        (error) => {
            console.error('Error loading Silla GLB:', error);
            loaderTitle.textContent = '모델 로드 실패 (glb 파일 확인 필요)';
            loaderTitle.style.color = '#ff4d4d';
        }
    );
}

/**
 * 선택된 삼국 유물 모델 획득 래퍼
 */
function getArtifactModel(kingdom, callback) {
    if (kingdom === 'goguryeo') {
        callback(createGoguryeoModel());
    } else if (kingdom === 'baekje') {
        callback(createBaekjeModel());
    } else if (kingdom === 'silla') {
        loadSillaModel((model) => {
            // Silla GLB 눕혀져 있는 각도 조절 및 스케일 매칭
            const wrapper = new THREE.Group();
            model.rotation.x = Math.PI / 2; // 똑바로 보게 회전
            model.scale.set(1.4, 1.4, 1.4);
            wrapper.add(model);
            callback(wrapper);
        });
    }
}

// ==========================================
// 7. 발굴 게임 로직 (Excavation State)
// ==========================================
let dustParticles = []; // 비산하는 돌가루 파티클

function setupExcavationPhase() {
    // 1. 유물 데이터 비동기 탑재
    getArtifactModel(selectedKingdom, (model) => {
        currentArtifact = model;
        scene.add(currentArtifact);
        
        // 발굴 상태에서는 유물이 안 보여야 함 (숨기기)
        currentArtifact.visible = false;

        // 2. 암석 구체 클러스터 생성
        rockChunksGroup = new THREE.Group();
        scene.add(rockChunksGroup);
        rockChunks = [];
        
        const numChunks = 14;
        const radius = 1.35;
        
        for (let i = 0; i < numChunks; i++) {
            // 다양한 크기의 입체 불규칙 구체 생성
            const geom = new THREE.DodecahedronGeometry(0.85 + Math.random() * 0.25, 1);
            
            // 버텍스에 약간의 노이즈를 줘서 바위처럼 투박하게 변형
            const pos = geom.attributes.position;
            for (let j = 0; j < pos.count; j++) {
                pos.setX(j, pos.getX(j) + (Math.random() - 0.5) * 0.12);
                pos.setY(j, pos.getY(j) + (Math.random() - 0.5) * 0.12);
                pos.setZ(j, pos.getZ(j) + (Math.random() - 0.5) * 0.12);
            }
            geom.computeVertexNormals();

            // 바위 텍스처 느낌의 투박한 다크 매질
            const mat = new THREE.MeshStandardMaterial({
                color: 0x564e48,
                roughness: 0.95,
                metalness: 0.05
            });

            const mesh = new THREE.Mesh(geom, mat);
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            // 황금나선 분배법(Fibonacci Sphere)을 활용해 골고루 분포시켜 3D 유물을 둘러쌈
            const phi = Math.acos(-1 + (2 * i) / numChunks);
            const theta = Math.sqrt(numChunks * Math.PI) * phi;
            
            mesh.position.set(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );
            mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

            rockChunksGroup.add(mesh);

            rockChunks.push({
                mesh: mesh,
                hp: 2, // 각 돌당 2번 타격 시 파괴
                exploded: false,
                velocity: new THREE.Vector3(),
                spin: new THREE.Vector3()
            });
        }

        // 진행률 리셋
        excavationProgress = 0;
        updateExcavationProgressUI();

        // 3. UI 설정
        const data = HERITAGE_DATA[selectedKingdom];
        document.getElementById('excavation-title').textContent = `${data.name} 발굴 중`;
        hudExcavation.classList.remove('hidden');
        backToMainBtn.classList.remove('hidden');
        
        // 망치 모양 마우스 세팅
        mainCanvas.classList.add('cursor-hammer');
        
        // 카메라 강제 리셋
        camera.position.set(0, 0, 5.5);
        camera.lookAt(0, 0, 0);
        orbitControls.enabled = false; // 제어 끔
    });
}

/**
 * 클릭 시 타격 망치 스윙 모션 효과
 */
function triggerHammerSwing() {
    mainCanvas.classList.remove('cursor-hammer');
    mainCanvas.classList.add('cursor-hammer-swing');
    setTimeout(() => {
        mainCanvas.classList.remove('cursor-hammer-swing');
        mainCanvas.classList.add('cursor-hammer');
    }, 110);
}

/**
 * 돌 타격 처리
 */
function handleExcavationClick(event) {
    if (currentState !== STATES.EXCAVATION || !rockChunksGroup) return;

    // 망치 휘두르기 액션
    triggerHammerSwing();

    // 마우스 레이캐스팅
    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    // 살아있는 돌 덩어리만 대상 검출
    const activeMeshes = rockChunks
        .filter(c => !c.exploded)
        .map(c => c.mesh);

    const intersects = raycaster.intersectObjects(activeMeshes);

    if (intersects.length > 0) {
        const hitPoint = intersects[0].point;
        const hitMesh = intersects[0].object;
        
        // 대응되는 바위 상태 인덱스 찾기
        const chunk = rockChunks.find(c => c.mesh === hitMesh);
        if (chunk) {
            // 사운드 합성음 발생
            sfx.playHit();
            
            // 불꽃 및 먼지 스파크 파티클 생성
            spawnDustParticles(hitPoint, 15, 0xbfb6ae);
            
            // 바위 타격/피해 찌그러짐 셰이킹 애니메이션
            hitMesh.scale.multiplyScalar(0.92);
            
            chunk.hp--;
            if (chunk.hp <= 0) {
                // 바위 폭파 물리 트리거
                chunk.exploded = true;
                
                // 바위 잔해가 튕겨 나가는 방향과 회전 속도 결정
                const dir = hitMesh.position.clone().normalize().multiplyScalar(4 + Math.random() * 4);
                chunk.velocity.copy(dir);
                chunk.spin.set(
                    (Math.random() - 0.5) * 8,
                    (Math.random() - 0.5) * 8,
                    (Math.random() - 0.5) * 8
                );
                
                // 돌조각 대량 추가 파열 파티클
                spawnDustParticles(hitMesh.position, 25, 0x6e655f);
            }
            
            // 발굴 진행률 계산
            const destroyed = rockChunks.filter(c => c.exploded).length;
            excavationProgress = Math.round((destroyed / rockChunks.length) * 100);
            updateExcavationProgressUI();

            // 점진적으로 내부 유물을 부드럽게 노출 (투명도/가시성)
            if (excavationProgress > 15) {
                currentArtifact.visible = true;
            }

            // 모든 바위가 부서지면 발굴 성공 완료
            if (excavationProgress >= 100) {
                finishExcavationPhase();
            }
        }
    }
}

/**
 * 돌가루 파티클 시뮬레이터
 */
function spawnDustParticles(pos, count, colorHex) {
    const geom = new THREE.BufferGeometry();
    const positions = [];
    const velocities = [];
    
    for (let i = 0; i < count; i++) {
        // 발생 지점
        positions.push(pos.x, pos.y, pos.z);
        // 사방 사출 속도 벡터
        velocities.push(
            (Math.random() - 0.5) * 2.5,
            (Math.random() - 0.5) * 2.5 + 1.2, // 약간 위로 튀게
            (Math.random() - 0.5) * 2.5
        );
    }
    
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    
    const mat = new THREE.PointsMaterial({
        color: colorHex,
        size: 0.07,
        transparent: true,
        opacity: 0.9,
        blending: THREE.NormalBlending
    });
    
    const points = new THREE.Points(geom, mat);
    scene.add(points);
    
    dustParticles.push({
        points: points,
        velocities: velocities,
        age: 0,
        maxAge: 40 + Math.random() * 20
    });
}

function updateExcavationProgressUI() {
    document.getElementById('excavation-progress').style.width = `${excavationProgress}%`;
    document.getElementById('excavation-percent').textContent = `${excavationProgress}%`;
}

/**
 * 발굴 완료 및 연출
 */
function finishExcavationPhase() {
    currentState = STATES.RESTORATION; // 논블로킹 전환 준비
    mainCanvas.classList.remove('cursor-hammer');

    sfx.playSuccess();
    
    // 유물 발견 성공 금빛 플래시 오버레이 연출
    const revealTitle = document.getElementById('reveal-text-title');
    const revealDesc = document.getElementById('reveal-text-desc');
    revealTitle.textContent = "유물 발굴 성공";
    revealDesc.textContent = "유적 내 잔해를 걷어내고 유물을 안전하게 확보했습니다.";
    revealScreen.classList.remove('hidden');

    setTimeout(() => {
        revealScreen.classList.add('hidden');
        
        // 기존 씬 정리하고 복원 상태 세팅
        cleanSceneExcavation();
        setupRestorationPhase();
    }, 2200);
}

function cleanSceneExcavation() {
    if (rockChunksGroup) {
        scene.remove(rockChunksGroup);
        rockChunksGroup = null;
    }
    rockChunks = [];
    
    // 비산중인 파티클 소거
    dustParticles.forEach(dp => scene.remove(dp.points));
    dustParticles = [];
}

// ==========================================
// 8. 복원 게임 로직 (Restoration State - 3D Puzzle)
// ==========================================
function setupRestorationPhase() {
    const data = HERITAGE_DATA[selectedKingdom];
    document.getElementById('restoration-title').textContent = `${data.name} 복원 중`;
    hudRestoration.classList.remove('hidden');
    hudExcavation.classList.add('hidden');

    // 카메라 원형 중앙 고정
    camera.position.set(0, 0, 5.0);
    camera.lookAt(0, 0, 0);

    // 1. 유물 조각화 (Local Clipping Planes 사용)
    // 중심 X, Y 축 기준으로 화면을 4사분면으로 나눔
    const clipPlanes = [
        // 사분면 1: 우상단 (X >= 0, Y >= 0)
        [new THREE.Plane(new THREE.Vector3(1, 0, 0), 0.02), new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.02)],
        // 사분면 2: 좌상단 (X <= 0, Y >= 0)
        [new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0.02), new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.02)],
        // 사분면 3: 좌하단 (X <= 0, Y <= 0)
        [new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0.02), new THREE.Plane(new THREE.Vector3(0, -1, 0), 0.02)],
        // 사분면 4: 우하단 (X >= 0, Y <= 0)
        [new THREE.Plane(new THREE.Vector3(1, 0, 0), 0.02), new THREE.Plane(new THREE.Vector3(0, -1, 0), 0.02)]
    ];

    puzzlePieces = [];
    snappedCount = 0;
    updateRestorationProgressUI();

    // 4개의 사분면 3D 조각 객체 스폰
    for (let i = 0; i < 4; i++) {
        // 복제된 개별 재질을 적용하기 위한 딥 클론 메소드 호출
        const pieceGroup = cloneModelWithUniqueMaterials(currentArtifact);
        applyClippingPlanes(pieceGroup, clipPlanes[i]);
        scene.add(pieceGroup);

        // 조각 랜덤 흩뿌리기 분배 (외곽 배치)
        let rx, ry;
        switch(i) {
            case 0: rx = 1.8 + Math.random() * 0.7; ry = 1.2 + Math.random() * 0.5; break; // 우상단
            case 1: rx = -1.8 - Math.random() * 0.7; ry = 1.2 + Math.random() * 0.5; break; // 좌상단
            case 2: rx = -1.8 - Math.random() * 0.7; ry = -1.2 - Math.random() * 0.5; break; // 좌하단
            case 3: rx = 1.8 + Math.random() * 0.7; ry = -1.2 - Math.random() * 0.5; break; // 우하단
        }

        pieceGroup.position.set(rx, ry, 0);

        // 오답 회전 설정 (90, 180, 270도 중 무작위)
        const randomRotations = [1, 2, 3];
        const rotSteps = randomRotations[Math.floor(Math.random() * randomRotations.length)];
        
        pieceGroup.rotation.z = 0; // 초기화
        
        puzzlePieces.push({
            group: pieceGroup,
            index: i,
            targetPos: new THREE.Vector3(0, 0, 0),
            currentRotSteps: rotSteps, // 90도 곱해지는 팩터
            targetRotZ: rotSteps * (Math.PI / 2),
            snapped: false
        });

        // 애니메이션 회전 적용
        pieceGroup.rotation.z = rotSteps * (Math.PI / 2);
    }

    // 발굴 중이던 원본 유물은 숨김 (복원 조각들로 조립해야 함)
    currentArtifact.visible = false;
    
    // 2. 투영용 조립 중심 반투명 실루엣(가이드라인) 생성
    createShadowSilhouette();
}

/**
 * 머티리얼 공유 문제 극복을 위한 딥 클론 유틸리티
 */
function cloneModelWithUniqueMaterials(source) {
    const clone = source.clone();
    clone.traverse((child) => {
        if (child.isMesh) {
            if (Array.isArray(child.material)) {
                child.material = child.material.map(m => m.clone());
            } else {
                child.material = child.material.clone();
            }
        }
    });
    return clone;
}

/**
 * 특정 그룹 내 메쉬들에 클리핑 플레인 동적 적용
 */
function applyClippingPlanes(group, planes) {
    group.traverse((child) => {
        if (child.isMesh && child.material) {
            if (Array.isArray(child.material)) {
                child.material.forEach(m => {
                    m.clippingPlanes = planes;
                    m.clipShadows = true;
                });
            } else {
                child.material.clippingPlanes = planes;
                child.material.clipShadows = true;
            }
        }
    });
}

/**
 * 조작 유무 식별용 골드 에미시브 하이라이트 펄스
 */
function highlightPiece(piece, enable) {
    piece.group.traverse((child) => {
        if (child.isMesh && child.material) {
            const mats = Array.isArray(child.material) ? child.material : [child.material];
            mats.forEach(m => {
                if (m.emissive) {
                    m.emissive.setHex(enable ? 0x2b1e06 : 0x000000); // 황금 발광광
                }
            });
        }
    });
}

let silhouetteObj = null;
/**
 * 중심 조립점 안내 반투명 가이드 실루엣
 */
function createShadowSilhouette() {
    silhouetteObj = cloneModelWithUniqueMaterials(currentArtifact);
    silhouetteObj.traverse((child) => {
        if (child.isMesh && child.material) {
            const silhouetteMat = new THREE.MeshBasicMaterial({
                color: 0xd4af37,
                transparent: true,
                opacity: 0.12,
                wireframe: true
            });
            child.material = silhouetteMat;
        }
    });
    silhouetteObj.position.set(0, 0, -0.01);
    silhouetteObj.visible = true;
    scene.add(silhouetteObj);
}

/**
 * 3D 조각 드래그 핸들러
 */
function handleRestorationPointerDown(event) {
    if (currentState !== STATES.RESTORATION) return;

    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    // 아직 조립되지 않은 조각들의 모든 메쉬 수집
    const activePieces = puzzlePieces.filter(p => !p.snapped);
    let hitObject = null;
    let hitPieceInfo = null;

    for (let p of activePieces) {
        const intersects = raycaster.intersectObject(p.group, true);
        if (intersects.length > 0) {
            hitObject = p.group;
            hitPieceInfo = p;
            break;
        }
    }

    if (hitObject) {
        // 기존 선택 조각 하이라이트 리셋
        if (selectedPiece) {
            highlightPiece(selectedPiece, false);
        }

        selectedPiece = hitPieceInfo;
        highlightPiece(selectedPiece, true);
        
        // 우측 하단 컨트롤러 표출
        pieceControlPanel.classList.remove('hidden');

        // 드래그 좌표 보정을 위한 Ray-Plane 충돌 산출
        const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // Z=0 평면
        const intersectionPoint = new THREE.Vector3();
        if (raycaster.ray.intersectPlane(dragPlane, intersectionPoint)) {
            dragOffset.set(
                intersectionPoint.x - selectedPiece.group.position.x,
                intersectionPoint.y - selectedPiece.group.position.y
            );
        }
    } else {
        // 바닥을 클릭했을 경우 선택 해제
        if (selectedPiece) {
            highlightPiece(selectedPiece, false);
            selectedPiece = null;
            pieceControlPanel.classList.add('hidden');
        }
    }
}

function handleRestorationPointerMove(event) {
    if (currentState !== STATES.RESTORATION || !selectedPiece) return;

    const mouse = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const intersectionPoint = new THREE.Vector3();

    if (raycaster.ray.intersectPlane(dragPlane, intersectionPoint)) {
        selectedPiece.group.position.x = intersectionPoint.x - dragOffset.x;
        selectedPiece.group.position.y = intersectionPoint.y - dragOffset.y;
    }
}

function handleRestorationPointerUp() {
    if (currentState !== STATES.RESTORATION || !selectedPiece) return;

    // 결합 정렬 스냅 판정 검사
    const pos = selectedPiece.group.position;
    const distToCenter = Math.sqrt(pos.x * pos.x + pos.y * pos.y);
    
    // 타겟 앵글 정렬도 판정 (오차범위 5도 이내)
    // 360도로 정렬하여 각도가 완전 0도에 수렴하는지 확인
    const rot = selectedPiece.group.rotation.z;
    const rotNormalized = Math.abs(rot % (Math.PI * 2));
    const rotAligned = rotNormalized < 0.08 || rotNormalized > (Math.PI * 2 - 0.08);

    if (distToCenter < 0.55 && rotAligned) {
        // 스냅 성공 처리
        selectedPiece.snapped = true;
        
        // 정확히 원점(0,0,0)과 회전 0도로 자석처럼 자동 맞춤
        selectedPiece.group.position.set(0, 0, 0);
        selectedPiece.group.rotation.z = 0;
        
        // 클릭/선택 비활성화
        highlightPiece(selectedPiece, false);
        
        // 성공음 발생
        sfx.playSnap();
        
        // 조각 주변 부드러운 먼지 스파크 연출
        spawnDustParticles(new THREE.Vector3(0, 0, 0.2), 15, 0xd4af37);

        selectedPiece = null;
        pieceControlPanel.classList.add('hidden');

        snappedCount++;
        updateRestorationProgressUI();

        // 4개 조각이 전원 복원 완료되었는지 검사
        if (snappedCount >= 4) {
            finishRestorationPhase();
        }
    }
}

function updateRestorationProgressUI() {
    document.getElementById('puzzle-pieces-left').textContent = `맞춘 조각: ${snappedCount} / 4`;
}

function rotateSelectedPieceCw() {
    if (currentState !== STATES.RESTORATION || !selectedPiece) return;
    
    sfx.resume();
    
    // 각도 스텝 증가
    selectedPiece.currentRotSteps++;
    selectedPiece.targetRotZ = selectedPiece.currentRotSteps * (Math.PI / 2);
    
    // 조작 중 스냅 검출 처리 바로 확인하기 위해 가볍게 호출
    sfx.playSnap();
}

/**
 * 복원 완료 단계
 */
function finishRestorationPhase() {
    currentState = STATES.RESULT;

    sfx.playSuccess();

    // 1. 성공 연출 화면 오버레이 표출
    const revealTitle = document.getElementById('reveal-text-title');
    const revealDesc = document.getElementById('reveal-text-desc');
    revealTitle.textContent = "유물 복원 완료";
    revealDesc.textContent = "갈라진 조각들을 완전히 결합하여 찬란한 미가 되살아났습니다.";
    revealScreen.classList.remove('hidden');

    setTimeout(() => {
        revealScreen.classList.add('hidden');
        
        // 복원 조각들과 가이드 실루엣 폐기
        puzzlePieces.forEach(p => scene.remove(p.group));
        puzzlePieces = [];
        if (silhouetteObj) {
            scene.remove(silhouetteObj);
            silhouetteObj = null;
        }

        // 결과 화면 세팅
        setupResultPhase();
    }, 2400);
}

// ==========================================
// 9. 결과 전시 화면 (Result / Exhibition State)
// ==========================================
function setupResultPhase() {
    hudRestoration.classList.add('hidden');
    screenResult.classList.remove('hidden');

    // 1. 원본 통합 유물 소환 및 세팅
    currentArtifact.visible = true;
    currentArtifact.position.set(0, 0, 0);
    currentArtifact.rotation.set(0, 0, 0);
    // Silla의 수막새인 경우 세로 방향으로 보이도록 눕히는 기본 각도 재적용
    if (selectedKingdom === 'silla') {
        currentArtifact.children[0].rotation.x = Math.PI / 2;
    }

    // 2. OrbitControls 제어 활성화 및 디폴트 자동 회전
    orbitControls.enabled = true;
    orbitControls.autoRotate = true;
    orbitControls.autoRotateSpeed = 2.0;
    toggleRotateBtn.classList.add('active');

    // 기본 시점 복원
    resetCameraView();

    // 3. UI 도감 아카이브 데이터 주입
    const data = HERITAGE_DATA[selectedKingdom];
    document.getElementById('result-artifact-name').textContent = data.name;
    document.getElementById('result-artifact-desc').textContent = data.desc;
    document.getElementById('spec-name').textContent = data.name;
    document.getElementById('spec-era').textContent = data.era;
    document.getElementById('spec-location').textContent = data.location;
    document.getElementById('spec-use').textContent = data.use;
    document.getElementById('result-artifact-features').innerHTML = data.features.replace(/\n/g, '<br>');

    // 4. 슬라이더 바 세팅 동기화
    renderer.toneMappingExposure = 1.0;
    exposureSlider.value = 1.0;
    exposureVal.textContent = "1.0";
}

function resetCameraView() {
    if (selectedKingdom === 'silla') {
        camera.position.set(0, 0, 3.8); // 수막새는 정면 밀접 배치
    } else {
        camera.position.set(0, 1.2, 5.0); // 삼국 관식은 약간 고각 배치
    }
    orbitControls.target.set(0, 0, 0);
    orbitControls.update();
}

// ==========================================
// 10. 통합 화면 상태 스위치 (State Controller)
// ==========================================
function changeState(newState) {
    currentState = newState;

    // 모든 UI 오버레이 숨기기
    screenMain.classList.remove('active');
    screenResult.classList.add('hidden');
    hudExcavation.classList.add('hidden');
    hudRestoration.classList.add('hidden');
    backToMainBtn.classList.add('hidden');
    pieceControlPanel.classList.add('hidden');

    // 3D 씬 잔해 청소
    cleanSceneExcavation();
    puzzlePieces.forEach(p => scene.remove(p.group));
    puzzlePieces = [];
    if (silhouetteObj) {
        scene.remove(silhouetteObj);
        silhouetteObj = null;
    }
    if (currentArtifact) {
        scene.remove(currentArtifact);
        currentArtifact = null;
    }
    dynamicSwayables = [];

    // 망치 커서 초기화
    mainCanvas.className = '';

    // OrbitControls 상태 비활성화
    orbitControls.enabled = false;

    // 상태별 빌딩 패턴 작동
    if (newState === STATES.MAIN) {
        screenMain.classList.add('active');
        setupMainMenuBackground();
    } else if (newState === STATES.EXCAVATION) {
        setupExcavationPhase();
    }
}

/**
 * 메인 대기 화면용 멋진 회전 관식 배경 생성
 */
let mainMenuRotationModel = null;
function setupMainMenuBackground() {
    // 웅장한 고구려 금동관식을 메인 화면 대기 백그라운드로 소환해 회전시킴
    mainMenuRotationModel = createGoguryeoModel();
    mainMenuRotationModel.position.set(0, 0.4, 0);
    scene.add(mainMenuRotationModel);
    currentArtifact = mainMenuRotationModel; // 루프 추적용

    camera.position.set(0, 0.8, 5.5);
    camera.lookAt(0, 0, 0);
}

// ==========================================
// 11. 인터랙션 이벤트 바인딩 (UI & Canvas)
// ==========================================
function setupUIEvents() {
    // 삼국 선택 카드 호버 및 클릭 이벤트
    document.querySelectorAll('.kingdom-card').forEach(card => {
        card.addEventListener('click', () => {
            selectedKingdom = card.getAttribute('data-kingdom');
            changeState(STATES.EXCAVATION);
        });
    });

    // 메인으로 가기 및 다시 시작
    backToMainBtn.addEventListener('click', () => {
        changeState(STATES.MAIN);
    });

    restartGameBtn.addEventListener('click', () => {
        changeState(STATES.MAIN);
    });

    // 3D 퍼즐 조각 90도 회전
    rotateCwBtn.addEventListener('click', rotateSelectedPieceCw);

    // 마우스 및 모바일 터치 Canvas 통합 핸들러
    mainCanvas.addEventListener('mousedown', (e) => {
        sfx.resume();
        if (currentState === STATES.EXCAVATION) {
            handleExcavationClick(e);
        } else if (currentState === STATES.RESTORATION) {
            handleRestorationPointerDown(e);
        }
    });

    mainCanvas.addEventListener('mousemove', (e) => {
        if (currentState === STATES.RESTORATION) {
            handleRestorationPointerMove(e);
        }
    });

    mainCanvas.addEventListener('mouseup', () => {
        if (currentState === STATES.RESTORATION) {
            handleRestorationPointerUp();
        }
    });

    // 터치 입력 보정 (모바일 대응)
    mainCanvas.addEventListener('touchstart', (e) => {
        sfx.resume();
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            const simulatedEvent = {
                clientX: touch.clientX,
                clientY: touch.clientY
            };
            if (currentState === STATES.EXCAVATION) {
                handleExcavationClick(simulatedEvent);
            } else if (currentState === STATES.RESTORATION) {
                handleRestorationPointerDown(simulatedEvent);
            }
        }
    }, { passive: true });

    mainCanvas.addEventListener('touchmove', (e) => {
        if (currentState === STATES.RESTORATION && e.touches.length === 1) {
            const touch = e.touches[0];
            const simulatedEvent = {
                clientX: touch.clientX,
                clientY: touch.clientY
            };
            handleRestorationPointerMove(simulatedEvent);
        }
    }, { passive: true });

    mainCanvas.addEventListener('touchend', () => {
        if (currentState === STATES.RESTORATION) {
            handleRestorationPointerUp();
        }
    });

    // --- 전시(Result) 화면용 컨트롤 바인딩 ---
    
    // 자동 회전 토글
    toggleRotateBtn.addEventListener('click', () => {
        const active = orbitControls.autoRotate;
        orbitControls.autoRotate = !active;
        if (orbitControls.autoRotate) {
            toggleRotateBtn.classList.add('active');
        } else {
            toggleRotateBtn.classList.remove('active');
        }
    });

    // 뷰포트 초기화
    resetCamBtn.addEventListener('click', resetCameraView);

    // 노출/조명 슬라이더 조절
    exposureSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        renderer.toneMappingExposure = val;
        exposureVal.textContent = val.toFixed(1);
    });

    // 테마 피커 연동
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const bgTheme = btn.getAttribute('data-bg');
            applyThemeBackground(bgTheme);
        });
    });
}

function applyThemeBackground(theme) {
    const wrapper = document.querySelector('.viewer-wrapper');
    if (theme === 'gradient-dark') {
        wrapper.style.background = 'radial-gradient(circle at center, #1b1b1f 0%, #08080a 100%)';
    } else if (theme === 'studio-gray') {
        wrapper.style.background = '#28282b';
    } else if (theme === 'ambient-warm') {
        wrapper.style.background = 'radial-gradient(circle at center, #231b15 0%, #0d0a08 100%)';
    } else if (theme === 'pure-black') {
        wrapper.style.background = '#000000';
    }
}

// ==========================================
// 12. 렌더 루프 및 애니메이션 프레임 관리
// ==========================================
function animate() {
    animationFrameId = requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;

    // 1. 메인 화면 대기 시 관식 천천히 자동 유휴 회전
    if (currentState === STATES.MAIN && currentArtifact) {
        currentArtifact.rotation.y = time * 0.15;
    }

    // 2. 발굴 화면 바위 조각 비산 및 중력 낙하 물리 업데이트
    if (currentState === STATES.EXCAVATION && rockChunks.length > 0) {
        rockChunks.forEach(chunk => {
            if (chunk.exploded) {
                // 튕겨나가는 중력 가속도 물리 방정식
                chunk.velocity.y -= 0.12; // 중력 가속도
                chunk.mesh.position.addScaledVector(chunk.velocity, 0.016);
                chunk.mesh.rotation.x += chunk.spin.x * 0.016;
                chunk.mesh.rotation.y += chunk.spin.y * 0.016;
                chunk.mesh.rotation.z += chunk.spin.z * 0.016;
                
                // 크기 점차 수렴 축소 소멸
                chunk.mesh.scale.multiplyScalar(0.96);
                if (chunk.mesh.scale.x < 0.05) {
                    chunk.mesh.visible = false;
                }
            }
        });

        // 3D 돌가루 파티클 비산 물리 업데이트
        for (let i = dustParticles.length - 1; i >= 0; i--) {
            const dp = dustParticles[i];
            const posAttr = dp.points.geometry.attributes.position;
            
            dp.age++;
            
            for (let j = 0; j < posAttr.count; j++) {
                // 중력 효과 감안해 하강
                dp.velocities[j * 3 + 1] -= 0.04;
                
                posAttr.setX(j, posAttr.getX(j) + dp.velocities[j * 3] * 0.016);
                posAttr.setY(j, posAttr.getY(j) + dp.velocities[j * 3 + 1] * 0.016);
                posAttr.setZ(j, posAttr.getZ(j) + dp.velocities[j * 3 + 2] * 0.016);
            }
            
            posAttr.needsUpdate = true;
            dp.points.material.opacity = 1.0 - (dp.age / dp.maxAge);

            if (dp.age >= dp.maxAge) {
                scene.remove(dp.points);
                dustParticles.splice(i, 1);
            }
        }
    }

    // 3. 복원 화면 조각 회전 서보 보간 애니메이션
    if (currentState === STATES.RESTORATION && puzzlePieces.length > 0) {
        puzzlePieces.forEach(piece => {
            if (!piece.snapped) {
                // 보간 계산을 활용한 부드러운 90도 회전 전이(Linterp)
                piece.group.rotation.z += (piece.targetRotZ - piece.group.rotation.z) * 0.18;
            }
        });
    }

    // 4. 유물 고유 애니메이션 (영락/Medallions 바람 흔들림 시뮬레이터)
    if (dynamicSwayables.length > 0) {
        dynamicSwayables.forEach(sway => {
            // 진자 운동 삼각함수 식
            const angle = Math.sin(time * sway.speed + sway.phase) * 0.12;
            sway.group.rotation.z = angle;
        });
    }

    // 5. 결과 화면 OrbitControls 렌더 상태 싱크
    if (currentState === STATES.RESULT && orbitControls.enabled) {
        orbitControls.update();
    }

    // 최종 프레임 렌더
    renderer.render(scene, camera);
}

// 창이 열릴 때 초기화 개시
window.addEventListener('DOMContentLoaded', initApp);
