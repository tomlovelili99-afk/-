import React, { Component, Suspense, lazy, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitText from './SplitText';
import pdfPreviewManifest from './pdf-page-manifest.json';
import './styles.css';

gsap.registerPlugin(ScrollTrigger);
gsap.config({ force3D: 'auto' });
ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });

const SideRays = lazy(() => import('./SideRays'));

class AppErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error('Portfolio runtime error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="app-recovery" role="alert">
          <p>页面正在恢复</p>
          <h1>内容加载出现短暂异常</h1>
          <button type="button" onClick={() => window.location.reload()}>重新加载页面</button>
        </main>
      );
    }

    return this.props.children;
  }
}

const profile = {
  name: '熊鹏程',
  title: 'UI/UE/UX / 平面 / 品牌视觉设计师',
  phone: '17370866926',
  email: '1031831371@qq.com',
  wechat: 'pc92668',
  location: '南昌市东湖区沿江北大道',
};

const stats = [
  { value: 11, suffix: '+', label: '年设计经验' },
  { value: 1200, suffix: '+', label: '完整项目交付' },
  { value: 50, suffix: '+', label: 'B/G 端系统' },
  { value: 40, suffix: '%', label: '交付效率提升' },
];

const navItems = [
  ['简介', '#about'],
  ['经历', '#experience'],
  ['项目', '#projects'],
  ['优势', '#strengths'],
  ['联系', '#contact'],
];

const strengthIconLabels = ['1', '2', '3', '4', '5', '6'];

const asset = (path) => {
  if (!path.startsWith('/assets/') || path.startsWith('/assets/pdf-pages/')) return path;
  const extensionIndex = path.lastIndexOf('.');
  if (extensionIndex === -1) return path;
  const extension = path.slice(extensionIndex + 1).toLowerCase();
  if (!['jpg', 'jpeg', 'png'].includes(extension)) return path;
  return `/assets/optimized/${path.slice('/assets/'.length, extensionIndex)}.jpg`;
};

const aboutHighlights = [
  ['资深从业背景', '11 年全品类视觉设计经验，设计科班出身，累计主导交付 1200 + 完整设计项目，覆盖互联网产品、商业品牌、文创周边等多元领域'],
  ['全链路界面设计', '可独立完成 UI/UX 设计、B/G 端后台、PC 端网页、APP / 小程序、数据大屏、交互动效设计，精通从用户调研、竞品分析、交互原型到视觉落地的完整产品设计流程'],
  ['全场景商业平面', '覆盖 LOGO 设计、企业全套 VI、门店门头、电商主图详情页、海报 KV、宣传画册、折页 DM 单、文化墙、商务 PPT 等全类型商业视觉物料'],
  ['文创创意设计', '具备商业插画、IP 形象设计、产品包装、文创周边设计能力，可输出差异化创意视觉方案'],
  ['高效落地执行', '熟悉各领域设计规范，执行力强，可快速推进需求落地，保障设计成果完整匹配业务诉求，兼顾视觉质感与商业价值'],
];

const projects = [
  {
    title: '电网 B/G 端业务系统',
    type: 'UI/UX · Design System',
    desc: '覆盖运维系统、小程序、数据大屏，建立业务组件库与统一视觉规范。',
    className: 'project-blue',
  },
  {
    title: '赣服通&中医药大学数据大屏',
    type: 'Government UX · Data Visualization',
    desc: '覆盖赣服通政务服务与高校第二课堂数据展示，梳理活动、荣誉、学生分布等信息，提升管理决策效率。',
    className: 'project-black',
  },
  {
    title: '科技商务 PPT 视觉设计',
    type: 'PPT Design · Technology & Business',
    desc: '覆盖人工智能、数据治理、云计算与商业 SaaS 等主题，建立清晰叙事结构与统一科技视觉体系。',
    className: 'project-silver',
  },
  {
    title: '电商产品视觉设计',
    type: 'E-commerce · Key Visual',
    desc: '围绕产品卖点、促销信息与品牌调性完成电商主图视觉设计，以高对比排版和场景化产品呈现强化购买吸引力。',
    className: 'project-light',
  },
];

const powerGridScreens = [
  ['/assets/power-grid-smart-brain-light.jpg', '供用电全景监控平台'],
  ['/assets/power-grid-smart-brain-blue.jpg', '供用电智慧大脑'],
  ['/assets/power-grid-smart-power-dashboard.jpeg', '智慧电力大屏'],
];

const dataScreens = [
  ['/assets/dashboard-jiangxi-data-center.png', '赣青二课省级大数据中心'],
  ['/assets/dashboard-second-class-score-platform.png', '第二课堂成绩单数据化展示平台'],
  ['/assets/dashboard-meeting-room-overview.png', '会议室使用情况概览'],
  ['/assets/dashboard-factory-entry-overview.png', '入厂情况概览'],
  ['/assets/dashboard-factory-logistics.png', '入厂物流'],
  ['/assets/dashboard-material-kitting-rate.png', 'T-1 物料齐套率'],
  ['/assets/dashboard-zero-defect-line.png', '包装 4B2P03 线生产节拍看板'],
  ['/assets/dashboard-work-order-maintenance.png', '主板维修看板'],
  ['/assets/dashboard-core-talent.png', '核心人才'],
  ['/assets/dashboard-plan-completion.png', '计划完成率'],
  ['/assets/dashboard-smart-campus.png', '智慧园区总览'],
  ['/assets/dashboard-inclusive-finance-cockpit.jpeg', '普惠金融监测驾驶舱'],
  ['/assets/dashboard-bank-ai-operations.jpeg', '银行 AI 数字运营大屏'],
  ['/assets/dashboard-bank-design-system.png', '银行经营驾驶舱设计规范'],
  ['/assets/dashboard-bank-business-cockpit.png', '全行经营数据驾驶舱'],
  ['/assets/dashboard-loan-risk-design-system.png', '贷后风险管理监控大屏设计规范'],
  ['/assets/dashboard-loan-risk-monitor.png', '贷后风险管理监控大屏'],
];

const posterDesigns = [
  ['/assets/IT服务中心申请流程介绍.png', 'IT 服务中心申请流程介绍'],
  ['/assets/华勤智造上线.png', '华勤智能制造系统重磅上线'],
  ['/assets/JAVA开发规范.png', 'JAVA 开发规范培训讲解'],
  ['/assets/Python代码安全.png', 'Python 代码安全培训'],
  ['/assets/《管理BT&IT流程介绍》.png', '管理 BT & IT 流程介绍'],
  ['/assets/回溯方法实操.png', '回溯方法实操培训'],
  ['/assets/数据库培训.png', '数据库性能培训'],
  ['/assets/SMT模块.png', 'SMT 系统主要模块介绍'],
  ['/assets/IT学院培训海报.png', '技术中台培训日志服务'],
  ['/assets/飞流培训海报.png', '飞流计划系统介绍'],
];

const ipDisplayDesigns = [
  ['/assets/IMG_5369.jpeg', '运动品牌 IP 空间与周边设计'],
  ['/assets/IMG_5368.jpeg', '茶饮品牌 IP 门店与物料设计'],
  ['/assets/IMG_5370.jpeg', '宠物品牌 IP 空间与周边设计'],
  ['/assets/IMG_5371.jpeg', '冰岛咖啡品牌 IP 视觉设计'],
  ['/assets/IMG_5372.jpeg', '江湖鹅霸餐饮 IP 空间设计'],
  ['/assets/commercial-ip-display.jpeg', '记忆锚点品牌 IP 视觉手册'],
  ['/assets/IMG_5390.jpeg', '商业活动插画视觉设计'],
  ['/assets/IMG_5389.jpeg', '品牌活动插画视觉设计'],
  ['/assets/IMG_5388.jpeg', '潮流商业插画视觉设计'],
  ['/assets/IMG_5375.jpeg', '潮咖品牌 IP 与周边设计'],
  ['/assets/IMG_5262.jpeg', '南福建美学骑行插画设计'],
  ['/assets/IMG_5261.jpeg', '南福建美学城市插画设计'],
  ['/assets/IMG_5260.jpeg', '南福建美学骑行插画设计'],
  ['/assets/IMG_5259.jpeg', '四月自然生活插画设计'],
  ['/assets/IMG_5258.jpeg', '中秋城市文化插画设计'],
  ['/assets/IMG_5257.jpeg', '福吧咖啡公园商业插画设计'],
  ['/assets/IMG_5256.jpeg', '丙午新年国潮插画设计'],
  ['/assets/IMG_5255.jpeg', '新禧马年主题插画设计'],
];

const logoSpaceDesigns = [
  ['/assets/IMG_5249.jpeg', '黑白标志风格探索'],
  ['/assets/IMG_5410.jpeg', '现代标志系统设计'],
  ['/assets/IMG_5251.jpeg', '无穷符号标志探索'],
  ['/assets/logo-store-culture-wall.png', '彩色 Logo 字母设计'],
  ['/assets/IMG_5401.jpeg', '家居装饰门头设计'],
  ['/assets/IMG_5400.jpeg', '口腔诊所门头设计'],
  ['/assets/IMG_5402.jpeg', '美业门店门头设计'],
  ['/assets/IMG_5403.jpeg', '宠物门店空间设计'],
  ['/assets/IMG_5404.jpeg', '企业文化墙设计'],
  ['/assets/IMG_5405.jpeg', '创新成果展示文化墙'],
  ['/assets/IMG_5406.jpeg', '核心技术与团队文化墙'],
  ['/assets/IMG_5407.jpeg', '企业资质与团队文化墙'],
  ['/assets/IMG_5408.jpeg', '科技展厅文化墙设计'],
  ['/assets/IMG_5409.jpeg', '企业展厅文化墙设计'],
];

const strengths = [
  {
    title: '全链路产品设计',
    desc: '从用户调研、竞品分析、交互原型到视觉落地，可独立推进 UI/UX 闭环。',
  },
  {
    title: '复杂业务可视化',
    desc: '擅长电力调度、负荷分析、仓储监控等数据大屏的信息架构与视觉表达。',
  },
  {
    title: '品牌与商业平面',
    desc: '覆盖 LOGO、企业 VI、门头、电商详情、海报、画册、折页、文化墙与商务 PPT。',
  },
  {
    title: '组件库与规范搭建',
    desc: '沉淀企业级组件库、设计规范和标准化文档，提升复用率与交付效率。',
  },
  {
    title: '创意视觉扩展',
    desc: '具备商业插画、IP 形象、包装与文创周边设计能力，输出差异化方案。',
  },
  {
    title: '跨团队交付管理',
    desc: '有设计经理与主管经验，能高效响应业务需求，把控多端体验和视觉一致性。',
  },
];

const timeline = [
  {
    time: '2024.04 - 2024.11',
    company: '泰豪软件股份有限公司',
    role: 'UI 设计兼产品经理',
    detail: '主导电网 B/G 端业务系统全链路 UI/UX 设计，覆盖 30 + 套运维、小程序类系统，全闭环交付，提升一线操作效率。负责电力调度、负荷分析等数据大屏设计，梳理复杂数据逻辑，文化墙、统一视觉标准，搭建电网业务设计组件库与规范，提效40%；高效响应需求，获客户高度认可。',
  },
  {
    time: '2022·3 - 2023·12',
    company: '南昌华勤技术股份有限公司',
    role: 'UI 设计经理',
    detail: '统筹制造 APP、EIP 系统 / 人事审批网页、仓管 PDA 等全产品线 UI 设计，带队完成全链路设计闭环，适配多业务场景，提升一线操作效率。负责仓储数据大屏、飞书监控平台可视化设计，搭建企业级设计组件库与规范体系，输出标准化文档，统一设计语言，提升团队设计复用率与交付效率。统筹商务 PPT、LOGO、海报、文化墙、交互动效等全品类视觉设计，统一企业内部视觉传播标准。',
  },
  {
    time: '2019·9 - 2022·2',
    company: '中兴软件技术（南昌）有限公司',
    role: 'UI 设计主管',
    detail: '主导赣服通移动端、江西省市县三级政务门户全页面 UI 设计，严守政务规范，全链路闭环交付，优化线上政务体验。负责政务可视化大屏视觉设计，梳理数据逻辑，优化信息呈现，支撑管理决策。统筹政务 banner 等平面视觉输出，统一政务形象视觉标准。沉淀政务设计规范与复用组件，保障多端一致性，提升交付效率。',
  },
  {
    time: '2016·7 - 2019·8',
    company: '江西洪大集团股份有限公司',
    role: 'UI 设计师',
    detail: '主导新洪城大市场、用友产业园、江西移动和我信项目全端 UI 设计，覆盖 APP、H5 小程序、Web 端，把控 UI/UX 方向，优化用户体验。独立输出 Axure 交互原型，搭建设计规范与组件体系，统一多端设计语言，提升交付效率。负责企业画册、文化墙等品牌视觉物料设计，覆盖线上线下全场景。',
  },
];

function AnimatedGhostButtonLabel({ children }) {
  return (
    <>
      <span className="button-label">{children}</span>
      <span className="button-letters" aria-hidden="true">
        {Array.from(children).map((character, index) => (
          <span key={`${character}-${index}`}>{character === ' ' ? '\u00a0' : character}</span>
        ))}
      </span>
    </>
  );
}

function DeferredSideRays(props) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const connection = navigator.connection || navigator.webkitConnection;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowPowerDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    if (reduceMotion || connection?.saveData || lowPowerDevice) return undefined;

    let timeoutId = 0;
    const start = () => setShouldRender(true);
    const idleId = 'requestIdleCallback' in window
      ? window.requestIdleCallback(start, { timeout: 1800 })
      : 0;
    if (!idleId) timeoutId = window.setTimeout(start, 900);

    return () => {
      if (idleId && 'cancelIdleCallback' in window) window.cancelIdleCallback(idleId);
      window.clearTimeout(timeoutId);
    };
  }, []);

  if (!shouldRender) return null;
  return (
    <Suspense fallback={null}>
      <SideRays {...props} />
    </Suspense>
  );
}

function ProtectedPdfViewer({ pages = [], title, initialPage = 1, onPageChange }) {
  const pageCount = pages.length;
  const [pageNumber, setPageNumber] = useState(Math.min(Math.max(1, initialPage), pageCount || 1));
  const [status, setStatus] = useState('loading');

  const blockPdfActions = (event) => event.preventDefault();

  const goToPage = (nextPage) => {
    const page = Math.min(Math.max(1, nextPage), pageCount || 1);
    setStatus('loading');
    setPageNumber(page);
    onPageChange?.(page);
  };

  useEffect(() => {
    const page = Math.min(Math.max(1, initialPage), pageCount || 1);
    setPageNumber(page);
    setStatus('loading');
  }, [initialPage, pageCount]);

  useEffect(() => {
    [pages[pageNumber - 2], pages[pageNumber]].filter(Boolean).forEach((src) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = src;
    });
  }, [pageNumber, pages]);

  if (!pageCount) {
    return (
      <div className="pdf-reader-shell" onContextMenu={blockPdfActions} onDragStart={blockPdfActions} onCopy={blockPdfActions}>
        <div className="pdf-password-gate">
          <span className="pdf-lock-icon" aria-hidden="true">⌁</span>
          <strong>{title}</strong>
          <small className="pdf-error" role="alert">文档页面暂时无法加载。</small>
        </div>
      </div>
    );
  }

  const pageSrc = pages[pageNumber - 1];

  return (
    <div className="pdf-reader-shell" onContextMenu={blockPdfActions} onDragStart={blockPdfActions} onCopy={blockPdfActions}>
      <div className="pdf-page-toolbar" aria-label="文档翻页控制">
        <button type="button" onClick={() => goToPage(pageNumber - 1)} disabled={pageNumber === 1} aria-label="上一页" title="上一页">←</button>
        <span>第 {pageNumber} / {pageCount} 页</span>
        <button type="button" onClick={() => goToPage(pageNumber + 1)} disabled={pageNumber === pageCount} aria-label="下一页" title="下一页">→</button>
      </div>
      <div className="pdf-image-stage" onContextMenu={blockPdfActions}>
        <img
          src={pageSrc}
          alt={`${title}，第 ${pageNumber} 页`}
          draggable="false"
          onContextMenu={blockPdfActions}
          onDragStart={blockPdfActions}
          onCopy={blockPdfActions}
          onLoad={() => setStatus('ready')}
          onError={() => setStatus('error')}
        />
        <span className="pdf-watermark" aria-hidden="true">熊鹏程 · 仅供在线预览</span>
        {status === 'loading' && <span className="pdf-rendering" aria-live="polite">正在加载页面</span>}
        {status === 'error' && <span className="pdf-rendering pdf-error" role="alert">当前页面暂时无法加载</span>}
      </div>
    </div>
  );
}

function App() {
  const appRef = useRef(null);
  const scrollStateRef = useRef({ isScrolled: false, activeSection: '#about' });
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('#about');
  const [activeDetailHash, setActiveDetailHash] = useState(() => window.location.hash);
  const [pdfPage, setPdfPage] = useState(() => Number(new URLSearchParams(window.location.search).get('pdfPage')) || 1);
  const [isWechatQrOpen, setIsWechatQrOpen] = useState(false);

  useEffect(() => {
    let animationFrame = 0;
    const trackedSections = navItems
      .map(([, href]) => [href, document.querySelector(href)])
      .filter(([, section]) => section);
    const updateHeader = () => {
      const nextIsScrolled = window.scrollY > window.innerHeight * 0.72;
      if (scrollStateRef.current.isScrolled !== nextIsScrolled) {
        scrollStateRef.current.isScrolled = nextIsScrolled;
        setIsScrolled(nextIsScrolled);
      }

      let current = '#about';
      trackedSections.forEach(([href, section]) => {
        if (section && section.getBoundingClientRect().top <= window.innerHeight * 0.42) current = href;
      });
      if (scrollStateRef.current.activeSection !== current) {
        scrollStateRef.current.activeSection = current;
        setActiveSection(current);
      }
    };
    const onScroll = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(() => {
        animationFrame = 0;
        updateHeader();
      });
    };

    updateHeader();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    const syncDetailHash = () => {
      setActiveDetailHash(window.location.hash);
      setPdfPage(Number(new URLSearchParams(window.location.search).get('pdfPage')) || 1);
    };
    const returnToProjects = () => {
      const isPdfDetail = activeDetailHash === '#portfolio-detail' || activeDetailHash === '#fande-detail';
      if (!isPdfDetail) {
        syncDetailHash();
        return;
      }

      const url = new URL(window.location.href);
      url.searchParams.delete('pdfPage');
      url.hash = 'projects';
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
      setActiveDetailHash('#projects');
      setActiveSection('#projects');
      setPdfPage(1);
      window.requestAnimationFrame(() => document.querySelector('#projects')?.scrollIntoView({ block: 'start' }));
    };
    window.addEventListener('hashchange', syncDetailHash);
    window.addEventListener('popstate', returnToProjects);
    return () => {
      window.removeEventListener('hashchange', syncDetailHash);
      window.removeEventListener('popstate', returnToProjects);
    };
  }, [activeDetailHash]);

  const updatePdfPage = (nextPage) => {
    const url = new URL(window.location.href);
    if (nextPage <= 1) url.searchParams.delete('pdfPage');
    else url.searchParams.set('pdfPage', String(nextPage));
    window.history.replaceState({ pdfPage: nextPage }, '', `${url.pathname}${url.search}${url.hash}`);
    setPdfPage(nextPage);
  };

  const clearPdfPage = () => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has('pdfPage')) return;
    url.searchParams.delete('pdfPage');
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
    setPdfPage(1);
  };

  const detailClass = (id) => `project-detail-overlay${activeDetailHash === `#${id}` ? ' is-open' : ''}`;

  useEffect(() => {
    const root = appRef.current;
    if (!root) return undefined;

    const statNumbers = Array.from(root.querySelectorAll('.stat-number'));
    const setStatValues = () => {
      statNumbers.forEach((node) => {
        node.textContent = `${node.dataset.value || '0'}${node.dataset.suffix || ''}`;
      });
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStatValues();
      return undefined;
    }

    const context = gsap.context(() => {
      const revealHeading = (section) => {
        const heading = section.querySelector('.section-heading h2, .about-copy > h2, .contact-title');
        if (!heading) return;

        gsap.fromTo(
          heading,
          { autoAlpha: 0, y: 72, scale: 0.94, transformOrigin: 'left center' },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 1.1,
            ease: 'expo.out',
            clearProps: 'transform,opacity,visibility',
            scrollTrigger: { trigger: section, start: 'top 76%', once: true },
          },
        );
      };

      const revealCards = (section, selector) => {
        const cards = Array.from(section.querySelectorAll(selector));
        cards.forEach((card, index) => {
          gsap.fromTo(
            card,
            { autoAlpha: 0, y: 46, scale: 0.975 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.9,
              delay: (index % 3) * 0.09,
              ease: 'expo.out',
              clearProps: 'transform,opacity,visibility',
              scrollTrigger: { trigger: card, start: 'top 88%', once: true },
            },
          );
        });
      };

      const revealImages = (section) => {
        const images = Array.from(section.querySelectorAll('.portrait img, .project-image, .feishu-gallery img, .poster-gallery img, .showcase-item img'));
        images.forEach((image) => {
          gsap.fromTo(
            image,
            { clipPath: 'inset(0 0 100% 0)', scale: 1.08 },
            {
              clipPath: 'inset(0 0 0% 0)',
              scale: 1,
              duration: 1.05,
              ease: 'expo.out',
              clearProps: 'clipPath,transform',
              scrollTrigger: { trigger: image, start: 'top 91%', once: true },
            },
          );
        });
      };

      const about = root.querySelector('#about');
      const experience = root.querySelector('#experience');
      const projectsSection = root.querySelector('#projects');
      const strengthsSection = root.querySelector('#strengths');
      const contact = root.querySelector('#contact');

      if (about) {
        revealHeading(about);
        revealCards(about, '.portrait-card, .about-highlights p, .education-card');
        revealImages(about);
        const portrait = about.querySelector('.portrait img');
        if (portrait) {
          gsap.to(portrait, {
            yPercent: -5,
            ease: 'none',
            scrollTrigger: { trigger: about, start: 'top bottom', end: 'bottom top', scrub: 0.9 },
          });
        }
      }

      if (experience) {
        revealHeading(experience);
        revealCards(experience, '.timeline-item');
      }

      if (projectsSection) {
        revealHeading(projectsSection);
        revealCards(projectsSection, '.project-card, .feishu-showcase, .poster-showcase, .showcase-item, .showcase-note');
        revealImages(projectsSection);
      }

      if (strengthsSection) {
        revealHeading(strengthsSection);
        revealCards(strengthsSection, '.strength-card');
      }

      if (contact) {
        revealHeading(contact);
        revealCards(contact, '.contact-action, .footer-meta > span');
      }

      const hero = root.querySelector('.hero');
      const heroStats = root.querySelectorAll('.hero-stats > div');
      gsap.fromTo(heroStats, { autoAlpha: 0, y: 42 }, {
        autoAlpha: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: hero, start: 'top 86%', once: true },
      });

      statNumbers.forEach((node, index) => {
        const counter = { value: 0 };
        const value = Number(node.dataset.value || 0);
        const suffix = node.dataset.suffix || '';
        gsap.to(counter, {
          value,
          duration: 2.1,
          delay: 0.35 + index * 0.13,
          ease: 'power3.out',
          snap: { value: 1 },
          onUpdate: () => {
            node.textContent = `${counter.value}${suffix}`;
          },
          scrollTrigger: { trigger: hero, start: 'top 86%', once: true },
        });
      });
    }, root);

    return () => context.revert();
  }, []);

  useEffect(() => {
    const preventDefault = (event) => event.preventDefault();
    const preventProtectedShortcuts = (event) => {
      const key = event.key.toLowerCase();
      if (event.key === 'F12' || (event.ctrlKey || event.metaKey) && ['c', 's', 'u', 'p'].includes(key)) event.preventDefault();
      if ((event.ctrlKey || event.metaKey) && event.shiftKey && ['i', 'j', 'c'].includes(key)) event.preventDefault();
    };

    document.querySelectorAll('img').forEach((image) => image.setAttribute('draggable', 'false'));
    document.addEventListener('contextmenu', preventDefault);
    document.addEventListener('copy', preventDefault);
    document.addEventListener('dragstart', preventDefault);
    document.addEventListener('keydown', preventProtectedShortcuts);
    return () => {
      document.removeEventListener('contextmenu', preventDefault);
      document.removeEventListener('copy', preventDefault);
      document.removeEventListener('dragstart', preventDefault);
      document.removeEventListener('keydown', preventProtectedShortcuts);
    };
  }, []);

  return (
    <main ref={appRef}>
      <div className="copyright-badge" aria-label="原创设计版权声明"><strong>所有作品均为原创设计</strong><span>属企业专利 · 严禁商业用途 · 违法必究</span></div>
      {isWechatQrOpen && (
        <div className="wechat-qr-modal" role="presentation" onClick={() => setIsWechatQrOpen(false)}>
          <section className="wechat-qr-dialog" role="dialog" aria-modal="true" aria-label="微信二维码" onClick={(event) => event.stopPropagation()}>
            <button className="wechat-qr-close" type="button" aria-label="关闭微信二维码" onClick={() => setIsWechatQrOpen(false)}>×</button>
            <img loading="lazy" decoding="async" src={asset('/assets/wechat-qr-code.jpeg')} alt="熊鹏程微信二维码" />
            <strong>微信扫码添加好友</strong>
          </section>
        </div>
      )}
      <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`}>
        <a className="brand" href="#top" aria-label="回到首页">
          <img loading="eager" decoding="async" fetchPriority="high" className="brand-photo" src={asset('/assets/profile-photo-new.webp')} alt="熊鹏程形象照" />
          <strong>{profile.name}</strong>
        </a>
        <nav aria-label="主导航">
          {navItems.map(([label, href]) => (
            <a
              key={href}
              className={activeSection === href ? 'is-active' : ''}
              href={href}
              onClick={() => setActiveSection(href)}
            >
              {label}
            </a>
          ))}
        </nav>
        <a className="nav-cta" href={`mailto:${profile.email}`}>
          Let's Talk
          <span>→</span>
        </a>
      </header>

      <section className="hero section-shell" id="top">
        <div className="hero-rays" aria-hidden="true">
          <DeferredSideRays
            speed={5.2}
            rayColor1="#06d4ff"
            rayColor2="#a97cfc"
            intensity={2.05}
            spread={2.18}
            origin="top-right"
            tilt={-3}
            saturation={1.42}
            blend={0.74}
            falloff={1.45}
            opacity={0.96}
          />
        </div>
        <div className="hero-tech-grid" aria-hidden="true" />
        <div className="hero-tech-particles" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">Senior Visual Designer · Portfolio 2026</p>
          <h1>
            <SplitText tag="span" className="hero-title-line" text="设计高效、" delay={42} />
            <SplitText tag="span" className="hero-title-line hero-title-blue" text="简洁而有力量" delay={42} />
            <SplitText tag="span" className="hero-title-line" text="的数字体验" delay={42} />
          </h1>
          <p className="hero-copy">
            11 年全品类视觉设计经验，专注 UI/UX、B/G 端后台、APP / 小程序、数据大屏、品牌视觉与商业平面设计。
          </p>
          <div className="hero-actions">
            <a href="#projects" className="primary-btn">
              查看精选项目
              <span>→</span>
            </a>
            <a href="#about" className="ghost-btn">
              <AnimatedGhostButtonLabel>了解我的经历</AnimatedGhostButtonLabel>
            </a>
          </div>
          <div className="hero-stats">
            {stats.map(({ value, suffix, label }) => (
              <div key={label}>
                <strong className="stat-number" data-value={value} data-suffix={suffix}>0{suffix}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-panel hero-panel-image" aria-label="精选视觉效果图">
          <img loading="eager" decoding="async" fetchPriority="high" src={asset('/assets/hero-effect-reference.webp')} alt="蓝色科技感数字体验视觉效果图" />
          <div className="particle-earth" aria-hidden="true">
            <span className="earth-grid" />
            <span className="earth-orbit earth-orbit-a" />
            <span className="earth-orbit earth-orbit-b" />
            <span className="earth-satellite" />
          </div>
        </div>
      </section>

      <section className="about section-shell" id="about">
        <div className="portrait-card">
          <div className="portrait">
              <img loading="lazy" decoding="async" src={asset('/assets/profile-photo-layer-1.webp')} alt="熊鹏程形象照" />
          </div>
          <div className="contact-list">
            <a href={`tel:${profile.phone}`}><i className="contact-icon" data-label="TEL" aria-hidden="true" /><span><small>电话</small>{profile.phone}</span></a>
            <a href={`mailto:${profile.email}`}><i className="contact-icon" data-label="MAIL" aria-hidden="true" /><span><small>邮箱</small>{profile.email}</span></a>
            <button type="button" className="wechat-contact" aria-haspopup="dialog" onClick={() => setIsWechatQrOpen(true)}><i className="contact-icon" data-label="WX" aria-hidden="true" /><span><small>微信</small>{profile.wechat}</span></button>
            <div><i className="contact-icon" data-label="LOC" aria-hidden="true" /><span><small>所在地</small>{profile.location}</span></div>
          </div>
          <div className="skill-marquee" aria-label="核心技能">
            {['Figma', 'Illustrator', 'Photoshop', 'Sketch', 'Axure RP', 'UI/UX', 'VI Design', 'Web Design', 'E-commerce Homepage', 'Product Detail Page', 'Poster Design', 'Brochure Design', 'Book Design', 'Display Board', 'Culture Wall Design', 'Commercial Illustration', 'IP Design', 'Product Packaging', 'Cultural Creative Design'].map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </div>
        <div className="about-copy">
          <p className="eyebrow">About Me</p>
          <SplitText tag="h2" text="把复杂业务整理成清晰、稳定、可落地的视觉系统。" delay={34} duration={0.62} />
          <div className="about-highlights">
            {aboutHighlights.map(([title, desc]) => (
              <p key={title}>
                <strong>{title}：</strong>
                {desc}
              </p>
            ))}
          </div>
          <article className="education-card">
            <span>Education</span>
            <h3>洛阳师范大学艺术设计学院</h3>
            <p><strong>主修课程：</strong>动画设计、平面设计、界面设计、VI设计、标志设计、POP字体设计、包装设计、画册杂志排版、海报设计。</p>
          </article>
        </div>
      </section>

      <section className="experience section-shell" id="experience">
        <div className="section-heading">
          <p className="eyebrow">Work Experience</p>
          <SplitText tag="h2" text="经历从一线视觉到设计管理，覆盖政务、电力、制造、商业平台。" delay={28} duration={0.58} />
        </div>
        <div className="timeline">
          {timeline.map((item) => (
            <article className="timeline-item" key={`${item.company}-${item.time}`}>
              <span>{item.time}</span>
              <div>
                <h3>{item.company}</h3>
                <strong>{item.role}</strong>
                <p>{item.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="projects section-shell" id="projects">
        <div className="section-heading split">
          <div>
            <p className="eyebrow">Selected Work</p>
            <SplitText tag="h2" text="精选项目与作品展示" delay={36} duration={0.58} />
          </div>
          <a className="ghost-btn small" href="#portfolio-detail">
            <AnimatedGhostButtonLabel>获取部分UI作品集</AnimatedGhostButtonLabel>
          </a>
        </div>
        <div className="project-grid">
          {projects.slice(0, 2).map((project, index) => (
            <article className={`project-card ${project.className} ${index <= 1 ? 'project-clickable' : ''}`} key={project.title}>
              {index === 0 && <a className="project-entry" href="#power-grid-detail" aria-label="查看电网 B/G 端业务系统完整项目" />}
              {index === 1 && <a className="project-entry" href="#data-screen-detail" aria-label="查看数据大屏完整项目" />}
              <div className="project-visual">
                {index < 3 ? (
                  <img
                    loading="lazy"
                    decoding="async"
                    className="project-image"
                    src={asset(['/assets/power-smart-brain.webp', '/assets/tcm-university-dashboard.webp', '/assets/annual-review-ppt.png'][index])}
                    alt={['供用电智慧大脑数据大屏设计', '中医药大学第二课堂数据大屏设计', '年终总结 PPT 视觉设计展示'][index]}
                  />
                ) : (
                  <>
                    <div className="mock-window"><span /><span /><span /></div>
                    <div className="visual-lines"><i /><i /><i /></div>
                    <b>{String(index + 1).padStart(2, '0')}</b>
                  </>
                )}
              </div>
              <div className="project-info">
                <span>{project.type}</span>
                <h3>{project.title}</h3>
                <p>{project.desc}</p>
              </div>
            </article>
          ))}
          <div className="project-subgrid">
            <article className="feishu-showcase">
              <a className="feishu-entry" href="#feishu-detail" aria-label="查看飞书智能制造完整项目" />
              <div className="feishu-gallery">
                {[
                  ['/assets/smart-manufacturing.png', '智能制造移动端首页'],
                  ['/assets/manufacturing-monitor.png', '制造系统部监控'],
                ].map(([src, alt]) => <a href={asset(src)} target="_blank" rel="noreferrer" key={src}><img loading="lazy" decoding="async" src={asset(src)} alt={alt} /></a>)}
              </div>
              <div className="project-info"><span>Feishu · Brand & Product Design</span><h3>飞书品牌与智能制造平台设计</h3><p>覆盖飞书品牌视觉延展、AI 开发部署平台、智能制造移动端与系统监控，从品牌识别到业务可视化构建统一的蓝色科技视觉体系。</p></div>
            </article>
            <div className="compact-projects">
              {projects.slice(2).map((project, index) => (
                <article className={`project-card ${project.className} ${index < 2 ? 'project-clickable' : ''}`} key={project.title}>
                  {index < 2 && <a className="project-entry" href={index === 0 ? '#ppt-detail' : '#ecommerce-detail'} aria-label={index === 0 ? '查看科技商务 PPT 视觉设计完整项目' : '查看电商产品视觉设计完整项目'} />}
                  <div className="project-visual">
                    {index < 2 ? <img loading="lazy" decoding="async" className={`project-image ${index === 0 ? 'work-highlights-image' : ''}`} src={asset(index === 0 ? '/assets/work-highlights.webp' : '/assets/ecommerce-cover.jpg')} alt={index === 0 ? '工作亮点与成效视觉设计展示' : '蓝色饮品电商主图视觉设计'} /> : <><div className="mock-window"><span /><span /><span /></div><div className="visual-lines"><i /><i /><i /></div><b>{String(index + 3).padStart(2, '0')}</b></>}
                  </div>
                  <div className="project-info"><span>{project.type}</span><h3>{project.title}</h3><p>{project.desc}</p></div>
                </article>
              ))}
              <article className="poster-showcase project-clickable">
                <a className="project-entry" href="#poster-detail" aria-label="查看商业海报封面设计完整项目" />
                <div className="poster-gallery">
                  <img loading="lazy" decoding="async" src={asset('/assets/it-service-center-application-flow.png')} alt="IT 服务中心申请流程海报封面设计" />
                </div>
                <div className="project-info"><span>Poster Cover · Visual Design</span><h3>商业海报封面设计</h3><p>围绕 IT 服务中心申请流程，以清爽蓝绿色调、立体科技视觉和清晰信息层级完成课程海报表达。</p></div>
              </article>
            </div>
          </div>
          <article className="reference-card">
            <div className="showcase-intro">
              <span>More Selected Work</span>
              <h3>多场景设计，<em>让体验与品牌同</em><strong>时生长</strong></h3>
              <p>从复杂业务系统到品牌视觉，以清晰逻辑、统一规范和克制表达推动设计落地。</p>
          <a href="#portfolio-detail">获取部分UI项目 <b>→</b></a>
            </div>
            <div className="showcase-grid">
              {[
                ['包装设计', 'Packaging Design', 'crop-a', '/assets/packaging-design.jpeg'],
                ['手册书籍设计', 'Manual & Editorial Design', 'crop-b', '/assets/manual-book-design.jpeg'],
                ['企业VI视觉系统', 'Enterprise VI Visual System', 'crop-c', '/assets/founder-vi-visual-system.png'],
                ['商业IP美陈&插画设计', 'Commercial IP Display & Illustration Design', 'crop-d', '/assets/commercial-ip-display.jpeg'],
                ['LOGO&门店&文化墙设计', 'Logo, Storefront & Culture Wall Design', 'crop-e', '/assets/IMG_5411.jpeg'],
              ].map(([title, type, crop, src]) => (
                    <figure className={`showcase-item ${crop} ${title === '包装设计' || title === '手册书籍设计' || title === '企业VI视觉系统' || title === '商业IP美陈&插画设计' || title === 'LOGO&门店&文化墙设计' ? 'showcase-clickable' : ''} ${title === '手册书籍设计' ? 'manual-card' : ''} ${title === '企业VI视觉系统' ? 'vi-card' : ''} ${title === '商业IP美陈&插画设计' ? 'ip-display-card' : ''}`} key={title}>
                  {title === '包装设计' && <a className="showcase-entry" href="#packaging-detail" aria-label="查看包装设计完整项目" />}
                  {title === '手册书籍设计' && <a className="showcase-entry" href="#manual-detail" aria-label="查看 AppOS 品牌视觉手册完整项目" />}
                  {title === '企业VI视觉系统' && <a className="showcase-entry" href="#fande-detail" aria-label="查看方德证券品牌视觉识别系统规范手册" />}
                  {title === '商业IP美陈&插画设计' && <a className="showcase-entry" href="#ip-display-detail" aria-label="查看商业IP美陈与插画设计完整项目" />}
                  {title === 'LOGO&门店&文化墙设计' && <a className="showcase-entry" href="#logo-space-detail" aria-label="查看 LOGO、门店与文化墙设计完整项目" />}
                  {title === '手册书籍设计' ? <div className="manual-preview"><img loading="lazy" decoding="async" src={asset(src)} alt="AppOS 品牌视觉手册封面" /><img loading="lazy" decoding="async" src={asset('/assets/IMG_5349.jpeg')} alt="AppOS 品牌概念与视觉原则展示" /></div> : <img loading="lazy" decoding="async" src={asset(src)} alt={title} />}
                  <figcaption><strong>{title}</strong><span>{type}</span></figcaption>
                </figure>
              ))}
              <div className="showcase-note">
                <i>↗</i>
                <p>敬请期待更多优秀设计作品更新，让设计兼顾体验质感与商业价值。</p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className={detailClass("power-grid-detail")} id="power-grid-detail" aria-label="电网 B/G 端业务系统项目详情">
        <div className="project-detail-page dashboard-detail-page">
          <div className="rights-notice">所有作品均为原创设计，属企业专利，严禁商业用途，违法必究。</div>
          <header><div><span>UI/UX · Design System</span><h2>电网 B/G 端业务系统</h2><p>覆盖供用电全景监控平台与智慧电力大屏，以浅色科技与深色大屏两套视觉语言呈现电力运行、设备管理、故障告警和能效分析等业务场景。</p></div><a className="detail-close" href="#projects" aria-label="关闭电网项目详情">×</a></header>
          <div className="dashboard-detail-gallery">
            {powerGridScreens.map(([src, title]) => (
              <figure className="dashboard-feature" key={src}>
                <img loading="lazy" decoding="async" src={asset(src)} alt={`${title}效果图`} />
                <figcaption><strong>{title}</strong><span>Power Grid UI/UX Dashboard</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className={detailClass("data-screen-detail")} id="data-screen-detail" aria-label="数据大屏项目详情">
        <div className="project-detail-page dashboard-detail-page">
          <div className="rights-notice">所有作品均为原创设计，属企业专利，严禁商业用途，违法必究。</div>
          <header><div><span>Government UX · Data Visualization</span><h2>政务与制造数据大屏设计</h2><p>覆盖省级数据中心、智慧园区、入厂物流、生产节拍、物料齐套率、会议室与人才管理等已上线大屏，以统一科技蓝视觉语言承载复杂业务数据。</p></div><a className="detail-close" href="#projects" aria-label="关闭数据大屏项目详情">×</a></header>
          <div className="dashboard-detail-gallery">
            {dataScreens.map(([src, title], index) => (
              <figure className={index === 0 ? 'dashboard-feature' : ''} key={src}>
                <img loading="lazy" decoding="async" src={asset(src)} alt={`${title}大屏设计效果图`} />
                <figcaption><strong>{title}</strong><span>Data Visualization Dashboard</span></figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className={detailClass("feishu-detail")} id="feishu-detail" aria-label="飞书智能制造项目详情">
        <div className="project-detail-page">
          <div className="rights-notice">所有作品均为原创设计，属企业专利，严禁商业用途，违法必究。</div>
          <header><div><span>Feishu · Brand & Product Design</span><h2>飞书品牌与智能制造平台设计</h2><p>覆盖品牌视觉、AI 部署平台、移动端制造入口与多维系统监控的完整设计展示。</p></div><a className="detail-close" href="#projects" aria-label="关闭项目详情">×</a></header>
          <div className="detail-gallery">
            <figure className="detail-wide"><img loading="lazy" decoding="async" src={asset('/assets/deployment-platform.jpeg')} alt="人工智能开发与部署平台视觉设计" /><figcaption>AI 开发与部署平台</figcaption></figure>
            <figure><img loading="lazy" decoding="async" src={asset('/assets/smart-manufacturing.png')} alt="智能制造移动端首页" /><figcaption>智能制造移动端</figcaption></figure>
            <figure><img loading="lazy" decoding="async" src={asset('/assets/manufacturing-monitor.png')} alt="制造系统部监控" /><figcaption>制造系统部监控</figcaption></figure>
            <div className="detail-right-stack">
              <figure className="detail-system"><img loading="lazy" decoding="async" src={asset('/assets/ptd-system-development.png')} alt="PTD 系统开发平台完整页面设计" /><figcaption>PTD 系统开发平台</figcaption></figure>
              <figure className="detail-brand"><img loading="lazy" decoding="async" src={asset('/assets/feishu-brand.png')} alt="飞书品牌视觉延展设计" /><figcaption>飞书品牌视觉延展</figcaption></figure>
            </div>
          </div>
        </div>
      </section>

      <section className={detailClass("fande-detail")} id="fande-detail" aria-label="方德证券品牌视觉识别系统规范手册">
        <div className="project-detail-page pdf-detail-page">
          <div className="rights-notice">所有作品均为原创设计，属企业专利，严禁商业用途，违法必究。</div>
          <header><div><span>Founder Securities · Enterprise VI Visual System</span><h2>方德证券品牌视觉识别系统</h2><p>方德证券品牌视觉识别系统规范手册。</p></div><a className="detail-close" href="#projects" onClick={clearPdfPage} aria-label="关闭方德证券品牌书">×</a></header>
          {activeDetailHash === '#fande-detail' && <ProtectedPdfViewer pages={pdfPreviewManifest.fande.pages} title="方德证券品牌视觉识别系统规范手册" initialPage={pdfPage} onPageChange={updatePdfPage} />}
        </div>
      </section>

      <section className={detailClass("portfolio-detail")} id="portfolio-detail" aria-label="部分 UI 作品集在线预览">
        <div className="project-detail-page pdf-detail-page">
          <div className="rights-notice">所有作品均为原创设计，属企业专利，严禁商业用途，违法必究。</div>
          <header><div><span>UI/UX · Selected Work</span><h2>部分 UI 作品集</h2><p>在线预览仅供浏览，禁止下载、打印和保存。</p></div><a className="detail-close" href="#projects" onClick={clearPdfPage} aria-label="关闭作品集预览">×</a></header>
          {activeDetailHash === '#portfolio-detail' && <ProtectedPdfViewer pages={pdfPreviewManifest.portfolio.pages} title="熊鹏程部分 UI 作品集" initialPage={pdfPage} onPageChange={updatePdfPage} />}
        </div>
      </section>

      <section className={detailClass("manual-detail")} id="manual-detail" aria-label="AppOS 品牌视觉手册项目详情">
        <div className="project-detail-page ecommerce-detail-page manual-detail-page">
          <div className="rights-notice">所有作品均为原创设计，属企业专利，严禁商业用途，违法必究。</div>
          <header><div><span>AppOS · Brand Visual Manual</span><h2>AppOS 品牌视觉手册</h2><p>围绕品牌理念、标志与字体、产品包装、摄影方向、零售体验和跨平台应用，建立完整且统一的视觉设计体系。</p></div><a className="detail-close" href="#projects" aria-label="关闭 AppOS 品牌视觉手册详情">×</a></header>
          <div className="ecommerce-detail-gallery manual-detail-gallery">
            {[['5348', '品牌视觉手册封面'], ['5349', '品牌概念与视觉原则'], ['5350', '标志系统与字体规范'], ['5351', '产品细节偏执与包装探索'], ['5352', '编辑风格摄影'], ['5353', '沉浸式零售体验'], ['5354', '跨平台品牌应用'], ['5355', '视觉实验与品牌延展']].map(([id, title]) => <figure key={id}><img loading="lazy" decoding="async" src={asset(`/assets/IMG_${id}.jpeg`)} alt={`AppOS ${title}`} /><figcaption><strong>{title}</strong><span>AppOS Brand Visual Manual</span></figcaption></figure>)}
            {[['5336', '君子养成'], ['5337', '喝茶问祖'], ['5338', '皮囊'], ['5339', '了凡四训'], ['5344', '富养'], ['5346', '人生很长，你慢慢走']].map(([id, title]) => <figure key={id}><img loading="lazy" decoding="async" src={asset(`/assets/IMG_${id}.jpeg`)} alt={`${title}书籍设计效果图`} /><figcaption><strong>{title}</strong><span>Book Design Showcase</span></figcaption></figure>)}
          </div>
        </div>
      </section>

      <section className={detailClass("ppt-detail")} id="ppt-detail" aria-label="科技商务 PPT 视觉设计项目详情">
        <div className="project-detail-page ppt-detail-page">
          <div className="rights-notice">所有作品均为原创设计，属企业专利，严禁商业用途，违法必究。</div>
          <header><div><span>PPT Design · Technology & Business</span><h2>科技商务 PPT 视觉设计</h2><p>围绕人工智能、数据治理、云计算、存储设备与电商 SaaS 等主题，以清晰的信息层级、统一的科技蓝视觉语言和场景化三维表达，构建兼具专业性与传播力的商业演示体系。</p></div><a className="detail-close" href="#projects" aria-label="关闭项目详情">×</a></header>
          <div className="ppt-detail-gallery">
            <figure><img loading="lazy" decoding="async" src={asset('/assets/ppt-data-quality.jpg')} alt="数据治理与质量解决方案 PPT 设计" /><figcaption><strong>数据治理与质量方案</strong><span>围绕数据安全、风险评估、生命周期防护与技术支撑，梳理复杂内容层级。</span></figcaption></figure>
            <figure><img loading="lazy" decoding="async" src={asset('/assets/ppt-tech-support.jpg')} alt="技术支撑体系与保障措施 PPT 设计" /><figcaption><strong>技术支撑与实施保障</strong><span>将平台架构、实施路径和保障机制转化为直观、可扫描的信息图表。</span></figcaption></figure>
            <figure><img loading="lazy" decoding="async" src={asset('/assets/ppt-product-advantages.jpg')} alt="人工智能产品优势与机器人学习技术 PPT 设计" /><figcaption><strong>AI 产品优势与学习技术</strong><span>通过模块化卡片和流程表达，展示产品优势、抓取策略与学习闭环。</span></figcaption></figure>
            <figure><img loading="lazy" decoding="async" src={asset('/assets/ppt-cloud-advantages.jpg')} alt="云计算产品优势与核心技术 PPT 设计" /><figcaption><strong>云计算产品与应用场景</strong><span>统一呈现云计算底座、核心团队、技术架构及多行业应用能力。</span></figcaption></figure>
            <figure><img loading="lazy" decoding="async" src={asset('/assets/ppt-storage-tech.jpg')} alt="存储设备核心技术 PPT 设计" /><figcaption><strong>存储与边缘计算技术</strong><span>以指标、能力和行业方案为线索，建立高密度信息的清晰阅读节奏。</span></figcaption></figure>
            <figure><img loading="lazy" decoding="async" src={asset('/assets/ppt-core-architecture.png')} alt="核心技术架构 PPT 设计" /><figcaption><strong>核心技术架构</strong><span>拆解计算、存储、网络、安全与智能平台，形成系统化技术表达。</span></figcaption></figure>
            <figure><img loading="lazy" decoding="async" src={asset('/assets/ppt-ecommerce-saas.jpg')} alt="电商 SaaS 商业方案 PPT 设计" /><figcaption><strong>电商 SaaS 商业方案</strong><span>以暖色视觉区分商业产品线，展示商品管理、数据分析与智能运营能力。</span></figcaption></figure>
            <figure><img loading="lazy" decoding="async" src={asset('/assets/ppt-robotics.jpg')} alt="机器人与人工智能科技商务 PPT 设计" /><figcaption><strong>机器人与人工智能</strong><span>以未来城市与智能机器人建立主视觉，完整呈现产品能力、业务场景与创新价值。</span></figcaption></figure>
          </div>
        </div>
      </section>

      <section className={detailClass("poster-detail")} id="poster-detail" aria-label="商业海报封面设计项目详情">
        <div className="project-detail-page ecommerce-detail-page">
          <div className="rights-notice">所有作品均为原创设计，属企业专利，严禁商业用途，违法必究。</div>
          <header><div><span>Poster Cover · Visual Design</span><h2>商业海报封面设计</h2><p>覆盖企业系统上线、技术培训、流程介绍与课程传播等场景，通过清晰信息层级、主题化配色与多样视觉风格，提升内部传播的识别度与阅读效率。</p></div><a className="detail-close" href="#projects" aria-label="关闭商业海报封面设计详情">×</a></header>
          <div className="ecommerce-detail-gallery poster-detail-gallery">
            {posterDesigns.map(([src, title]) => <figure key={src}><img loading="lazy" decoding="async" src={asset(src)} alt={`${title}海报设计`} /><figcaption><strong>{title}</strong><span>Commercial Poster Cover Design</span></figcaption></figure>)}
          </div>
        </div>
      </section>

      <section className={detailClass("ecommerce-detail")} id="ecommerce-detail" aria-label="电商产品视觉设计项目详情">
        <div className="project-detail-page ecommerce-detail-page">
          <div className="rights-notice">所有作品均为原创设计，属企业专利，严禁商业用途，违法必究。</div>
          <header><div><span>E-commerce · Campaign Key Visual</span><h2>电商产品视觉设计</h2><p>覆盖宠物食品、快消饮品、食品餐饮、厨具、户外装备、男士护肤、智能家电与消费电子等品类，通过场景化产品表达、卖点分层和差异化视觉语言强化品牌识别与购买转化。</p></div><a className="detail-close" href="#projects" aria-label="关闭项目详情">×</a></header>
          <div className="ecommerce-detail-gallery">
            {[
              ['01', '宠物营养猫条', '深海胶原猫条的节庆促销、成分卖点与详情页视觉。'],
              ['02', '宠物冻干零食', '以蓝色科技质感呈现多配方冻干产品与营养机制。'],
              ['03', '餐饮食品详情页', '通过高饱和暖色与食欲场景展示酸辣汤面产品。'],
              ['04', '宠物排毛零食', '围绕绿色天然感呈现排毛机制、成分与功效。'],
              ['05', '鲜蒸宠物主食', '以温润棕色建立鲜蒸工艺、原料与配方价值。'],
              ['06', '果汁茶饮系列', '用明亮果色和东方排版呈现多口味饮品体系。'],
              ['07', '幼猫成长猫粮', '以深蓝金色塑造专业营养、成长阶段与成分优势。'],
              ['08', '纯钛高压锅', '围绕材质、结构与烹饪性能建立高端厨具详情页。'],
              ['09', '宠物下午茶冻干', '通过生活方式场景表达食趣造型与天然食材。'],
              ['10', '无糖果味茶饮', '清新黄色体系突出零糖零能量与自然果茶体验。'],
              ['11', '户外钓具产品', '以红黑力量感强化钓重参数、材料结构与专业性能。'],
              ['12', '智能电子刹车系统', '黑紫科技语言展示核心芯片、模式与结构创新。'],
              ['14', '智能家电发布视觉', '通过暗场光影与产品矩阵建立国际展会传播质感。'],
              ['15', '手机核心技术视觉', '以精密结构和黑蓝光影呈现芯片、影像与散热卖点。'],
              ['16', '户外电源与清洁电器', '统一深色科技风格，突出性能参数、活动节点与产品形态。'],
              ['17', '消费电子新品视觉', '以冷峻光影呈现投影、充电、存储与音频产品。'],
            ].map(([id, title, desc]) => <figure key={id}><img loading="lazy" decoding="async" src={asset(`/assets/ecom-case-${id}.jpeg`)} alt={`${title}电商详情页视觉设计`} /><figcaption><strong>{title}</strong><span>{desc}</span></figcaption></figure>)}
            {[
              ['IMG_5397.jpeg', '移动芯片性能视觉', '以深色科技语言整合芯片、性能参数与游戏体验，建立高性能移动终端的系列化传播视觉。'],
              ['IMG_5395.jpeg', '智能手机新品海报', '围绕手机、穿戴与影像产品，以冰感浅色体系呈现新品功能与质感卖点。'],
              ['IMG_5394.jpeg', '消费电子产品发布', '覆盖投影、音箱、快充和耳机等品类，以光影场景强化性能与新品发布氛围。'],
              ['IMG_5393.jpeg', '电竞手机与音频视觉', '采用橙黑对比与硬核材质感，突出移动电竞性能、配件与产品组合。'],
              ['IMG_5399.jpeg', '科技产品主视觉探索', '以不同产品品类的海报构图和氛围光影，探索消费电子传播的多元视觉表达。'],
              ['IMG_5424.jpeg', '智能硬件商业视觉', '覆盖投影、智能家居与清洁电器等品类，以暖金光影与产品质感构建系列化商业传播视觉。'],
            ].map(([src, title, desc]) => <figure key={src}><img loading="lazy" decoding="async" src={asset(`/assets/${src}`)} alt={`${title}海报视觉设计`} /><figcaption><strong>{title}</strong><span>{desc}</span></figcaption></figure>)}
          </div>
        </div>
      </section>

      <section className={detailClass("ip-display-detail")} id="ip-display-detail" aria-label="商业IP美陈与插画设计项目详情">
        <div className="project-detail-page ecommerce-detail-page">
          <div className="rights-notice">所有作品均为原创设计，属企业专利，严禁商业用途，违法必究。</div>
          <header><div><span>Commercial IP Display &amp; Illustration Design</span><h2>商业IP美陈&插画设计</h2><p>覆盖品牌 IP 塑造、门店空间、商业美陈、包装周边与活动插画，以统一且鲜明的视觉语言连接产品、空间与品牌体验。</p></div><a className="detail-close" href="#projects" aria-label="关闭商业IP美陈与插画设计详情">×</a></header>
          <div className="ecommerce-detail-gallery ip-display-detail-gallery">
            {ipDisplayDesigns.map(([src, title]) => <figure key={src}><img loading="lazy" decoding="async" src={asset(src)} alt={`${title}效果图`} /><figcaption><strong>{title}</strong><span>Commercial IP Display &amp; Illustration Design</span></figcaption></figure>)}
          </div>
        </div>
      </section>

      <section className={detailClass("logo-space-detail")} id="logo-space-detail" aria-label="LOGO、门店与文化墙设计项目详情">
        <div className="project-detail-page ecommerce-detail-page">
          <div className="rights-notice">所有作品均为原创设计，属企业专利，严禁商业用途，违法必究。</div>
          <header><div><span>Logo, Storefront &amp; Culture Wall Design</span><h2>LOGO&门店&文化墙设计</h2><p>覆盖品牌标志、门店门头、商业空间与企业文化墙设计，以清晰识别、空间秩序和场景化表达强化品牌形象与线下体验。</p></div><a className="detail-close" href="#projects" aria-label="关闭 LOGO、门店与文化墙设计详情">×</a></header>
          <div className="ecommerce-detail-gallery logo-space-detail-gallery">
            {logoSpaceDesigns.map(([src, title]) => <figure key={src}><img loading="lazy" decoding="async" src={asset(src)} alt={`${title}效果图`} /><figcaption><strong>{title}</strong><span>Logo, Storefront &amp; Culture Wall Design</span></figcaption></figure>)}
          </div>
        </div>
      </section>

      <section className={detailClass("packaging-detail")} id="packaging-detail" aria-label="食品包装设计项目详情">
        <div className="project-detail-page ecommerce-detail-page">
          <div className="rights-notice">所有作品均为原创设计，属企业专利，严禁商业用途，违法必究。</div>
          <header><div><span>Packaging Design · Food &amp; Consumer Goods</span><h2>食品包装设计</h2><p>围绕休闲食品、方便速食与烘焙产品，以鲜明的品类识别、真实食欲表达和清晰卖点层级，建立兼顾货架吸引力与品牌记忆的包装视觉体系。</p></div><a className="detail-close" href="#projects" aria-label="关闭包装设计详情">×</a></header>
          <div className="ecommerce-detail-gallery packaging-detail-gallery">
            {[
              ['01', '青花椒烤鱼', '高饱和黄蓝配色突出椒麻风味与餐厅级产品体验。'],
              ['02', '芒果酸奶脆', '以轻盈留白和真实水果质感建立健康零食识别。'],
              ['03', '高蛋白熔心威化', '通过浓郁可可质感强化高蛋白与熔心口感卖点。'],
              ['04', '云顶奶盖沙琪玛', '天空蓝视觉结合奶盖流动感，传达松软轻盈口感。'],
              ['05', '肉松蛋黄锅巴', '暖黄色体系突出咸香酥脆与年轻化零食属性。'],
              ['06', '椒香藕饼', '黄绿撞色强化青椒、松露与莲藕的复合风味。'],
              ['07', '老母鸡高汤面', '黑金与暖汤色建立传统滋补和高汤浓郁感。'],
              ['08', '芝士爆浆牛角包', '明亮橙蓝配色直观呈现酥皮层次与爆浆芝士。'],
              ['09', '爆浆曲奇', '柔和奶咖色与巧克力流心建立精致烘焙氛围。'],
              ['10', '鳕鱼玉米浓汤', '清爽蓝黄配色传达海鲜鲜味与家庭速食便利。'],
              ['11', '海苔脆脆米饼', '蓝黄高对比突出海苔颗粒、酥脆口感与活力感。'],
            ].map(([id, title, desc]) => <figure key={id}><img loading="lazy" decoding="async" src={asset(`/assets/packaging-case-${id}.jpeg`)} alt={`${title}包装设计`} /><figcaption><strong>{title}</strong><span>{desc}</span></figcaption></figure>)}
            <figure>
              <img loading="lazy" decoding="async" src={asset('/assets/IMG_5425.jpeg')} alt="芝士软心面包包装设计" />
              <figcaption><strong>芝士软心面包</strong><span>以明亮天空蓝和浓郁芝士黄呈现松软口感与流心卖点，强化产品的年轻化货架识别。</span></figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="strengths section-shell" id="strengths">
        <div className="section-heading">
          <p className="eyebrow">Core Strengths</p>
          <SplitText tag="h2" text="个人优势" delay={42} duration={0.58} />
        </div>
        <div className="strength-grid">
          {strengths.map((item, index) => (
            <article className="strength-card" key={item.title}>
              <span className="strength-icon" data-label={strengthIconLabels[index]} aria-hidden="true" />
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-finale" id="contact">
        <div className="contact-inner">
          <p className="eyebrow">Contact</p>
          <h2 className="contact-title">
            <SplitText tag="span" className="contact-title-line" text="让我们把下一个项目" delay={26} duration={0.6} />
            <SplitText tag="span" className="contact-title-line" text="做的更实用、更高级。" delay={26} duration={0.6} />
          </h2>
          <div className="contact-actions">
            <a className="contact-action contact-action-primary" href={`mailto:${profile.email}`}>
              <i aria-hidden="true">@</i>
              <span><small>项目合作</small>发送邮件</span>
              <b aria-hidden="true">→</b>
            </a>
            <a className="contact-action contact-action-email" href={`mailto:${profile.email}`}>
              <i aria-hidden="true">M</i>
              <span><small>邮箱</small>{profile.email}</span>
            </a>
            <a className="contact-action contact-action-phone" href={`tel:${profile.phone}`}>
              <i aria-hidden="true">T</i>
              <span><small>电话</small>{profile.phone}</span>
            </a>
            <button type="button" className="contact-action contact-action-wechat wechat-trigger" aria-haspopup="dialog" onClick={() => setIsWechatQrOpen(true)}>
              <i aria-hidden="true">W</i>
              <span><small>微信</small>{profile.wechat}</span>
            </button>
          </div>
          <div className="footer-meta">
            <span data-label="WeChat">{profile.wechat}</span>
            <span data-label="Location">{profile.location}</span>
            <span data-label="Copyright">© 2026 {profile.name} · 所有作品均为原创设计 · 属企业专利 · 严禁商业用途 · 违法必究</span>
          </div>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<AppErrorBoundary><App /></AppErrorBoundary>);
