"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiArrowUpRight,
  FiBookOpen,
  FiCompass,
  FiCpu,
  FiDatabase,
  FiGitBranch,
  FiLayers,
  FiMessageSquare,
  FiShield,
  FiTarget,
  FiTrendingUp,
  FiZap,
} from "react-icons/fi";
import TranslateMenu from "./TranslateMenu";

interface LandingPageProps {
  articleCount: number;
  bodyFontClassName: string;
  headingFontClassName: string;
}

const heroVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const listVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const featureItems = [
  {
    icon: <FiBookOpen />,
    title: "Editorial depth",
    text: "Each guide bridges fundamentals with implementation details you can ship.",
  },
  {
    icon: <FiTrendingUp />,
    title: "Signals and shifts",
    text: "Track changes in tooling, AI stacks, and modern engineering practices.",
  },
  {
    icon: <FiLayers />,
    title: "Learning paths",
    text: "Curated sequences that move from core CS to production systems.",
  },
  {
    icon: <FiMessageSquare />,
    title: "RAG-assisted answers",
    text: "Ask anything and get cited responses across the entire library.",
  },
  {
    icon: <FiShield />,
    title: "Decision-grade",
    text: "Clear tradeoffs and risk notes for architecture and systems choices.",
  },
  {
    icon: <FiZap />,
    title: "Implementation ready",
    text: "Practical checklists, patterns, and playbooks you can apply today.",
  },
];

const formatItems = [
  {
    icon: <FiDatabase />,
    title: "System design briefs",
    text: "Architecture maps, component breakdowns, and tradeoff summaries.",
    meta: "From monoliths to distributed systems",
  },
  {
    icon: <FiCpu />,
    title: "Engineering labs",
    text: "Hands-on walkthroughs to build and benchmark core workflows.",
    meta: "Code-first, outcome-focused",
  },
  {
    icon: <FiGitBranch />,
    title: "Operational playbooks",
    text: "Incident response, scaling strategy, and reliability checklists.",
    meta: "Built for on-call teams",
  },
  {
    icon: <FiTarget />,
    title: "Focused tracks",
    text: "Short learning paths that sharpen specific engineering skills.",
    meta: "Structured and measurable",
  },
];

const workflowItems = [
  {
    step: "01",
    title: "Scan the library",
    text: "Use curated paths and topic maps to scope your learning plan.",
    icon: <FiCompass />,
  },
  {
    step: "02",
    title: "Ask the chatbot",
    text: "Get concise, cited answers and jump straight into the sources.",
    icon: <FiMessageSquare />,
  },
  {
    step: "03",
    title: "Ship with confidence",
    text: "Apply the playbooks, labs, and checklists to real projects.",
    icon: <FiTarget />,
  },
];

const coverageItems = [
  {
    title: "Core CS foundations",
    description:
      "Algorithms, data structures, and performance thinking built for real systems.",
    topics: ["Algorithms", "Data structures", "Complexity"],
    fill: "92%",
    icon: <FiBookOpen />,
  },
  {
    title: "Systems and reliability",
    description:
      "Service design, observability, and scalable infrastructure patterns.",
    topics: ["System design", "SRE", "Observability"],
    fill: "88%",
    icon: <FiGitBranch />,
  },
  {
    title: "AI systems and retrieval",
    description:
      "RAG pipelines, evaluation, and production AI workflows you can trust.",
    topics: ["RAG pipelines", "Evaluation", "Safety"],
    fill: "76%",
    icon: <FiCpu />,
  },
];

const pulseItems = [
  {
    status: "Fresh drop",
    title: "Vector search in production",
    text: "Benchmarks across HNSW, IVF, and hybrid rerankers.",
    meta: "12 min read",
    tag: "AI systems",
    icon: <FiDatabase />,
  },
  {
    status: "In review",
    title: "Kubernetes reliability drills",
    text: "Failure modes, guardrails, and incident response rehearsals.",
    meta: "Playbook",
    tag: "Infra",
    icon: <FiShield />,
  },
  {
    status: "Updated",
    title: "Latency budgets at scale",
    text: "SLI math, budget burn alerts, and performance governance.",
    meta: "Systems",
    tag: "Performance",
    icon: <FiTrendingUp />,
  },
  {
    status: "Next up",
    title: "Event-driven pipelines",
    text: "Backpressure, retries, and data contract strategies.",
    meta: "Labs",
    tag: "Data",
    icon: <FiLayers />,
  },
];

const testimonialItems = [
  {
    quote:
      "DevVerse is the fastest way we align on architecture decisions across teams.",
    name: "Staff engineer, infrastructure",
    signal: "Used during design reviews",
  },
  {
    quote:
      "The RAG chatbot keeps our research grounded with sources we can trust.",
    name: "Engineering manager, platform",
    signal: "Shared in weekly learning syncs",
  },
  {
    quote:
      "We onboard new hires with the curated paths and labs, it saves weeks.",
    name: "Senior engineer, systems",
    signal: "Onboarding toolkit",
  },
];

const pathItems = [
  {
    title: "Foundations",
    description: "Strengthen core CS and algorithmic thinking.",
    topics: [
      "Algorithms",
      "Data structures",
      "Complexity",
      "Programming models",
    ],
  },
  {
    title: "Systems and scale",
    description: "Design reliable services and distributed infrastructure.",
    topics: ["System design", "Networking", "Datastores", "Observability"],
  },
  {
    title: "AI and retrieval",
    description: "Build practical AI systems with safe retrieval workflows.",
    topics: ["Embeddings", "RAG pipelines", "Evaluation", "Safety"],
  },
];

const faqItems = [
  {
    question: "How does the RAG chatbot work?",
    answer:
      "It indexes DevVerse articles and returns cited answers with links back to the sources.",
  },
  {
    question: "Is DevVerse free to use?",
    answer:
      "Yes. The library and chatbot are available at no cost for readers.",
  },
  {
    question: "How often is new content published?",
    answer:
      "New articles and updates are released weekly, with deeper refresh cycles for core topics.",
  },
  {
    question: "Can I contribute or suggest topics?",
    answer:
      "Absolutely. The GitHub repo is open for feedback, suggestions, and contributions.",
  },
];

export default function LandingPage({
  articleCount,
  bodyFontClassName,
  headingFontClassName,
}: LandingPageProps) {
  const year = new Date().getFullYear();

  return (
    <div className={`${bodyFontClassName} landing-shell`}>
      <div className="landing-atmosphere" aria-hidden="true">
        <span className="orb orb-one" />
        <span className="orb orb-two" />
        <span className="orb orb-three" />
        <span className="grid-sheen" />
      </div>
      <TranslateMenu variant="floating" />

      <div className="landing-container">
        <motion.section
          className="hero"
          variants={heroVariants}
          initial="hidden"
          animate="show"
        >
          <div className="hero-copy">
            <motion.p className="eyebrow" variants={fadeUp}>
              DevVerse CS Blog
            </motion.p>
            <motion.h1
              className={`${headingFontClassName} hero-title`}
              variants={fadeUp}
            >
              Computer science insights that ship real software.
            </motion.h1>
            <motion.p className="hero-lead" variants={fadeUp}>
              Architecture guides, system design playbooks, and AI retrieval
              workflows designed for engineers who build and scale real
              products.
            </motion.p>
            <motion.div className="hero-tags" variants={fadeUp}>
              {[
                "System design",
                "Distributed systems",
                "AI + retrieval",
                "Performance",
              ].map((tag) => (
                <span key={tag} className="hero-tag">
                  {tag}
                </span>
              ))}
            </motion.div>
            <motion.div className="cta-row" variants={fadeUp}>
              <Link className="primary-cta" href="/home">
                Explore the library
                <FiArrowUpRight />
              </Link>
              <Link className="secondary-cta" href="/chat">
                Ask the chatbot
              </Link>
            </motion.div>
            <motion.div className="hero-metrics" variants={fadeUp}>
              <div className="metric">
                <div className="metric-value">
                  {articleCount.toLocaleString("en-US")}
                </div>
                <div className="metric-label">Articles with citations</div>
              </div>
              <div className="metric">
                <div className="metric-value">Weekly</div>
                <div className="metric-label">Fresh insights and updates</div>
              </div>
              <div className="metric">
                <div className="metric-value">RAG</div>
                <div className="metric-label">Ask anything, get sources</div>
              </div>
              <div className="metric">
                <div className="metric-value">Open</div>
                <div className="metric-label">Built in public on GitHub</div>
              </div>
            </motion.div>
          </div>

          <motion.div className="hero-panel" variants={fadeUp}>
            <div className="panel-header">
              <span>Inside DevVerse</span>
              <span className="panel-chip">Updated weekly</span>
            </div>
            <div className="panel-stack">
              <div className="panel-card">
                <div className="panel-title">Latest briefing</div>
                <p className="panel-summary">
                  Scaling retrieval pipelines with vector indexes and cache
                  layers.
                </p>
                <div className="panel-meta">
                  <span>12 min read</span>
                  <span>AI Systems</span>
                </div>
              </div>
              <div className="panel-card accent">
                <div className="panel-title">RAG chatbot preview</div>
                <p className="panel-question">
                  Q: How do vector indexes improve retrieval?
                </p>
                <p className="panel-answer">
                  A: Vector indexes compress embeddings to speed similarity
                  search while preserving recall. See citations [1] [2].
                </p>
                <div className="panel-footer">Citations attached.</div>
              </div>
              <div className="panel-card">
                <div className="panel-title">Reading path</div>
                <ul>
                  <li>Designing reliable services</li>
                  <li>Observability and tracing</li>
                  <li>Latency and performance budgets</li>
                </ul>
              </div>
            </div>
            <Link className="panel-cta" href="/home">
              Browse the library
              <FiArrowUpRight />
            </Link>
          </motion.div>
        </motion.section>

        <motion.section
          className="signal-strip"
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          {[
            {
              title: "Library depth",
              value: `${articleCount.toLocaleString("en-US")} curated articles across core CS topics`,
              icon: <FiBookOpen />,
            },
            {
              title: "Built for teams",
              value: "Playbooks, labs, and decision notes you can share",
              icon: <FiGitBranch />,
            },
            {
              title: "Learning cadence",
              value: "Weekly refreshes for fast-moving technical domains",
              icon: <FiTrendingUp />,
            },
          ].map((item) => (
            <div className="signal-card" key={item.title}>
              <div className="signal-icon">{item.icon}</div>
              <div>
                <div className="signal-title">{item.title}</div>
                <div className="signal-value">{item.value}</div>
              </div>
            </div>
          ))}
        </motion.section>

        <motion.section
          className="section"
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          id="why"
        >
          <div className="section-header">
            <p className="section-eyebrow">Why DevVerse</p>
            <h2 className={`${headingFontClassName} section-title`}>
              A professional knowledge base for modern builders.
            </h2>
            <p className="section-subtitle">
              Everything is designed to reduce search time and increase
              confidence when you make technical decisions.
            </p>
          </div>
          <motion.div className="feature-grid" variants={listVariants}>
            {featureItems.map((item) => (
              <motion.article
                className="feature-card"
                key={item.title}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                variants={cardVariants}
              >
                <div className="feature-icon">{item.icon}</div>
                <h3 className={`${headingFontClassName} feature-title`}>
                  {item.title}
                </h3>
                <p className="feature-text">{item.text}</p>
              </motion.article>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          className="section format-section"
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="section-header">
            <p className="section-eyebrow">Formats</p>
            <h2 className={`${headingFontClassName} section-title`}>
              Multiple formats, one cohesive learning system.
            </h2>
            <p className="section-subtitle">
              Choose deep dives, labs, or quick playbooks depending on how much
              time you have.
            </p>
          </div>
          <motion.div className="format-grid" variants={listVariants}>
            {formatItems.map((item) => (
              <motion.article
                className="format-card"
                key={item.title}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <div className="format-icon">{item.icon}</div>
                <div className={`${headingFontClassName} format-title`}>
                  {item.title}
                </div>
                <p className="format-text">{item.text}</p>
                <span className="format-meta">{item.meta}</span>
              </motion.article>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          className="section coverage-section"
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="section-header">
            <p className="section-eyebrow">Coverage</p>
            <h2 className={`${headingFontClassName} section-title`}>
              Depth across the topics that matter most.
            </h2>
            <p className="section-subtitle">
              Each collection is scoped to deliver practical confidence, not
              surface-level summaries.
            </p>
          </div>
          <motion.div className="coverage-grid" variants={listVariants}>
            {coverageItems.map((item) => (
              <motion.article
                className="coverage-card"
                key={item.title}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <div className="coverage-header">
                  <div className="coverage-icon">{item.icon}</div>
                  <span className="coverage-label">{item.fill} coverage</span>
                </div>
                <h3 className={`${headingFontClassName} coverage-title`}>
                  {item.title}
                </h3>
                <p className="coverage-text">{item.description}</p>
                <div className="coverage-meter">
                  <span
                    className="coverage-fill"
                    style={{ width: item.fill }}
                  />
                </div>
                <div className="coverage-topics">
                  {item.topics.map((topic) => (
                    <span key={topic}>{topic}</span>
                  ))}
                </div>
              </motion.article>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          className="section split-section"
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="split-copy">
            <p className="section-eyebrow">Built for focused work</p>
            <h2 className={`${headingFontClassName} section-title`}>
              Move from questions to implementation with confidence.
            </h2>
            <p className="section-subtitle">
              We organize content so you can go deep quickly, whether you are
              debugging production systems or learning new foundations.
            </p>
            <div className="checklist">
              {[
                "Clear summaries with actionable takeaways",
                "Hands-on examples and visual breakdowns",
                "Citations and links to continue research",
              ].map((item) => (
                <div className="check-item" key={item}>
                  <span className="check-dot" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="split-card">
            <div className="split-card-header">
              <FiCpu />
              <span>RAG chatbot workflow</span>
            </div>
            <ol>
              <li>Ask a question across every article.</li>
              <li>Get a concise, cited response.</li>
              <li>Jump directly into the source.</li>
            </ol>
            <Link className="split-cta" href="/chat">
              Try the chatbot
              <FiArrowUpRight />
            </Link>
          </div>
        </motion.section>

        <motion.section
          className="section workflow-section"
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="section-header">
            <p className="section-eyebrow">Workflow</p>
            <h2 className={`${headingFontClassName} section-title`}>
              A research workflow built for speed.
            </h2>
            <p className="section-subtitle">
              DevVerse blends editorial guidance with fast RAG lookups so you
              can stay in flow.
            </p>
          </div>
          <motion.div className="workflow-grid" variants={listVariants}>
            {workflowItems.map((item) => (
              <motion.article
                className="workflow-card"
                key={item.title}
                variants={cardVariants}
              >
                <div className="workflow-icon">{item.icon}</div>
                <div className="workflow-step">{item.step}</div>
                <h3 className={`${headingFontClassName} workflow-title`}>
                  {item.title}
                </h3>
                <p className="workflow-text">{item.text}</p>
              </motion.article>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          className="section pulse-section"
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="section-header">
            <p className="section-eyebrow">Live pulse</p>
            <h2 className={`${headingFontClassName} section-title`}>
              What we are shipping right now.
            </h2>
            <p className="section-subtitle">
              Track the latest drops, refreshes, and work in progress across the
              DevVerse library.
            </p>
          </div>
          <motion.div className="pulse-grid" variants={listVariants}>
            {pulseItems.map((item) => (
              <motion.article
                className="pulse-card"
                key={item.title}
                variants={cardVariants}
              >
                <div className="pulse-top">
                  <div className="pulse-icon">{item.icon}</div>
                  <span className="pulse-status">{item.status}</span>
                </div>
                <h3 className={`${headingFontClassName} pulse-title`}>
                  {item.title}
                </h3>
                <p className="pulse-text">{item.text}</p>
                <div className="pulse-meta">
                  <span>{item.meta}</span>
                  <span className="pulse-chip">{item.tag}</span>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          className="section paths-section"
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="section-header">
            <p className="section-eyebrow">Reading paths</p>
            <h2 className={`${headingFontClassName} section-title`}>
              Structured paths for every stage of growth.
            </h2>
            <p className="section-subtitle">
              Choose a track and move step-by-step with clear milestones.
            </p>
          </div>
          <motion.div className="path-grid" variants={listVariants}>
            {pathItems.map((path) => (
              <motion.article
                className="path-card"
                key={path.title}
                variants={cardVariants}
              >
                <h3 className={`${headingFontClassName} path-title`}>
                  {path.title}
                </h3>
                <p className="path-description">{path.description}</p>
                <div className="path-topics">
                  {path.topics.map((topic) => (
                    <span key={topic}>{topic}</span>
                  ))}
                </div>
              </motion.article>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          className="section topics-section"
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          id="topics"
        >
          <div className="section-header">
            <p className="section-eyebrow">Topics</p>
            <h2 className={`${headingFontClassName} section-title`}>
              Explore the full spectrum of computer science.
            </h2>
            <p className="section-subtitle">
              From core algorithms to modern infrastructure, you will find
              curated learning paths and deep technical analysis.
            </p>
          </div>
          <div className="topic-grid">
            {[
              "Algorithms",
              "Data structures",
              "System design",
              "Distributed systems",
              "Cloud engineering",
              "AI and ML",
              "Web performance",
              "DevOps",
              "Security",
              "Databases",
              "Frontend architecture",
              "Backend engineering",
            ].map((topic) => (
              <span key={topic} className="topic-chip">
                {topic}
              </span>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="section community-section"
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          id="community"
        >
          <div className="section-header">
            <p className="section-eyebrow">Community</p>
            <h2 className={`${headingFontClassName} section-title`}>
              Trusted by teams building critical systems.
            </h2>
            <p className="section-subtitle">
              Engineers use DevVerse to speed up decisions and onboard faster.
            </p>
          </div>
          <motion.div className="testimonial-grid" variants={listVariants}>
            {testimonialItems.map((item) => (
              <motion.figure
                className="testimonial-card"
                key={item.name}
                variants={cardVariants}
              >
                <blockquote className="testimonial-quote">
                  &quot;{item.quote}&quot;
                </blockquote>
                <figcaption className="testimonial-caption">
                  <span className="testimonial-name">{item.name}</span>
                  <span className="testimonial-meta">{item.signal}</span>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          className="section faq-section"
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="section-header">
            <p className="section-eyebrow">FAQ</p>
            <h2 className={`${headingFontClassName} section-title`}>
              Questions you might have.
            </h2>
            <p className="section-subtitle">
              Quick answers to help you decide where to start.
            </p>
          </div>
          <motion.div className="faq-grid" variants={listVariants}>
            {faqItems.map((item) => (
              <motion.div
                className="faq-card"
                key={item.question}
                variants={cardVariants}
              >
                <h3 className={`${headingFontClassName} faq-question`}>
                  {item.question}
                </h3>
                <p className="faq-answer">{item.answer}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        <motion.section
          className="section resource-section"
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="resource-card">
            <div>
              <p className="section-eyebrow">Resources</p>
              <h2 className={`${headingFontClassName} section-title`}>
                Stay informed without the noise.
              </h2>
              <p className="section-subtitle">
                Subscribe to structured feeds, or jump straight into the
                archive.
              </p>
            </div>
            <div className="resource-links">
              <a href="/api/rss">RSS Feed</a>
              <a href="/api/atom">Atom Feed</a>
              <a href="/feed.json">JSON Feed</a>
              <a
                href="https://github.com/hoangsonww/DevVerse-SWE-Blog"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="section closing-section"
          variants={sectionVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="closing-card">
            <div>
              <p className="section-eyebrow">Start here</p>
              <h2 className={`${headingFontClassName} section-title`}>
                Ready to explore DevVerse?
              </h2>
              <p className="section-subtitle">
                Dive into the library, bookmark favorites, and let the chatbot
                connect the dots for you.
              </p>
            </div>
            <div className="cta-row">
              <Link className="primary-cta" href="/home">
                Enter the library
                <FiArrowUpRight />
              </Link>
              <Link className="secondary-cta" href="/chat">
                Ask a question
              </Link>
            </div>
          </div>
        </motion.section>

        <footer className="landing-footer">
          <div className="landing-footer-top">
            <div className="landing-footer-brand">
              <div className={`${headingFontClassName} landing-footer-title`}>
                DevVerse
              </div>
              <p className="landing-footer-tagline">
                Editorial-grade computer science briefings for engineers who
                ship production systems.
              </p>
              <div className="landing-footer-badges">
                <span>Updated weekly</span>
                <span>RAG powered</span>
                <span>Open source</span>
              </div>
            </div>

            <div className="landing-footer-links">
              <span className="landing-footer-label">Explore</span>
              <Link href="/home">Library</Link>
              <Link href="/chat">Chatbot</Link>
              <Link href="/favorites">Favorites</Link>
            </div>

            <div className="landing-footer-links">
              <span className="landing-footer-label">Resources</span>
              <a href="/api/rss">RSS Feed</a>
              <a href="/api/atom">Atom Feed</a>
              <a href="/feed.json">JSON Feed</a>
              <a
                href="https://github.com/hoangsonww/DevVerse-SWE-Blog"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>

            <div className="landing-footer-cta">
              <span className="landing-footer-label">Start learning</span>
              <Link className="footer-cta primary" href="/home">
                Enter the library
              </Link>
              <Link className="footer-cta secondary" href="/chat">
                Ask a question
              </Link>
            </div>
          </div>

          <div className="landing-footer-bottom">
            <span>Copyright {year} DevVerse CS Blog.</span>
            <span className="landing-footer-meta">
              Built in public by Son (David) Nguyen.
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
