import React, { useState } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Code2,
  Copy,
  ExternalLink,
  FlaskConical,
  Github,
  Layers3,
  Loader2,
  Radio,
  RefreshCw,
  ShieldCheck,
  Terminal,
  Wallet,
  X,
  AlertTriangle,
  BookOpen,
  CircleDot,
  Plug,
  ArrowLeftRight,
} from 'lucide-react';
import {
  createSqueekKit,
  DEPLOYMENT,
  evaluateMerge,
  stringify,
  formatAmount,
  publicError,
  type Position,
} from '@squeekkit/sdk';
import reference from './reference.json';
import '@fontsource-variable/dm-sans';
import '@fontsource-variable/space-grotesk';
import './style.css';

const kit = createSqueekKit();
const repo = 'https://github.com/formless0/squeekkit';
const owner = '0x828CB04Dbf0BDd8eB35d19045638a1af6E3D17E8';
type Tab = 'Overview' | 'Wallet lab' | 'MCP tools' | 'Quickstart';
type Protocol = typeof reference.protocol;
const nav = [
  { name: 'Overview', icon: Layers3 },
  { name: 'Wallet lab', icon: Wallet },
  { name: 'MCP tools', icon: Plug },
  { name: 'Quickstart', icon: BookOpen },
] as const;

function Hamster({ className = '', small = false }: { className?: string; small?: boolean }) {
  return (
    <svg
      className={className}
      width={small ? 32 : 220}
      height={small ? 32 : 220}
      viewBox="0 0 160 160"
      fill="none"
      aria-hidden="true"
    >
      <g shapeRendering="crispEdges">
        <path d="M40 30h25v25h30V30h25v70h-10v20H50v-20H40z" fill="currentColor" />
        <path d="M50 40h10v15H50zm50 0h10v15h-10z" fill="#e9a595" />
        <path d="M55 72h12v13H55zm38 0h12v13H93z" fill="#132b47" />
        <path d="M55 72h4v4h-4zm38 0h4v4h-4z" fill="white" />
        <path d="M73 90h14v8H73z" fill="#e7a38c" />
        <path d="M70 105h20v13H70z" fill="#fffdf4" />
        <path d="M45 120h25v10H45zm45 0h25v10H90z" fill="currentColor" />
      </g>
    </svg>
  );
}
function CopyButton({ text }: { text: string }) {
  const [status, setStatus] = useState('Copy');
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('Copied');
    } catch {
      setStatus('Select text to copy');
    }
  }
  return (
    <button className="copy" onClick={copy} aria-label={status}>
      {status === 'Copied' ? <Check size={15} /> : <Copy size={15} />}
      <span>{status}</span>
    </button>
  );
}
function Code({ children, label = 'TypeScript' }: { children: string; label?: string }) {
  return (
    <div className="code">
      <div className="code-head">
        <span>
          <CircleDot size={12} /> {label}
        </span>
        <CopyButton text={children} />
      </div>
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  );
}
function ErrorBox({ error }: { error: ReturnType<typeof publicError> }) {
  return (
    <div className="error-box" role="alert">
      <AlertTriangle size={18} />
      <div>
        <b>{error.code.replaceAll('_', ' ').toLowerCase()}</b>
        <p>{error.message}</p>
        <details>
          <summary>Technical details</summary>
          <pre>{stringify(error.details)}</pre>
        </details>
      </div>
    </div>
  );
}

function App() {
  const [tab, setTab] = useState<Tab>('Overview');
  const [protocol, setProtocol] = useState<Protocol>(reference.protocol);
  const [source, setSource] = useState('Recorded audit');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ReturnType<typeof publicError> | null>(null);
  const [compatibility, setCompatibility] = useState<Record<string, unknown> | null>(null);
  async function refresh() {
    setLoading(true);
    setError(null);
    const [audit, api] = await Promise.allSettled([
      kit.chain.auditProtocol(),
      kit.api.compatibility(),
    ]);
    if (audit.status === 'fulfilled') {
      setProtocol(JSON.parse(stringify(audit.value)) as Protocol);
      setSource('Live RPC audit');
    } else setError(publicError(audit.reason));
    if (api.status === 'fulfilled') setCompatibility(api.value);
    else setCompatibility({ compatible: false, reason: publicError(api.reason).message });
    setLoading(false);
  }
  return (
    <div className="shell">
      <aside className="sidebar">
        <a
          className="brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setTab('Overview');
          }}
        >
          <span className="brand-icon">
            <Hamster small />
          </span>
          <span>
            Squeek<span className="brand-light">Kit</span>
            <small>THE BUILDER'S BURROW</small>
          </span>
        </a>
        <div className="sidebar-label">WORKSPACE</div>
        <nav aria-label="Main navigation">
          {nav.map(({ name, icon: Icon }) => (
            <button
              key={name}
              onClick={() => setTab(name)}
              className={tab === name ? 'nav active' : 'nav'}
              aria-current={tab === name ? 'page' : undefined}
            >
              <Icon size={18} />
              {name}
              {name === 'MCP tools' && <span className="count">10</span>}
              {tab === name && name !== 'MCP tools' && (
                <ChevronRight size={16} className="nav-arrow" />
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="dot blue" /> Small tools.
          <br />
          <strong>More room to build.</strong>
          <p>One shared SDK for your app and your AI assistant.</p>
          <a href="https://docs.squeekchain.com/developers/" target="_blank" rel="noreferrer">
            Protocol documentation <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="sidebar-bottom">
          <a href={repo} target="_blank" rel="noreferrer">
            <Github size={17} /> View source <ArrowUpRight size={14} />
          </a>
          <span>Community built · v0.1.0</span>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            SqueekKit <ChevronRight size={13} />
            <b>{tab}</b>
          </div>
          <div className="topbar-right">
            <span className="network">
              <span className="dot" /> Sepolia testnet
            </span>
            <a href={repo} className="button small-button" target="_blank" rel="noreferrer">
              <Github size={15} /> GitHub <ArrowUpRight size={14} />
            </a>
          </div>
        </header>
        <main>
          {tab === 'Overview' ? (
            <>
              <div className="page-heading">
                <div>
                  <span className="eyebrow">DEVELOPER TOOLKIT / 001</span>
                  <h1>
                    A little hamster.
                    <br />A whole lot to build.
                  </h1>
                  <p>
                    Read the chain. Understand your Squeeks.
                    <br className="desktop-break" /> Give your AI assistant the right tools.
                  </p>
                  <div className="hero-actions">
                    <button className="button primary" onClick={() => setTab('Quickstart')}>
                      Start building <ArrowRight size={16} />
                    </button>
                    <button className="text-button" onClick={() => setTab('Wallet lab')}>
                      Explore the wallet lab <ArrowUpRight size={16} />
                    </button>
                  </div>
                </div>
                <div className="hero-art">
                  <div className="orbital one" />
                  <div className="orbital two" />
                  <span className="art-label top">POWERED BY CURIOSITY</span>
                  <div className="pixel-spark a">+</div>
                  <div className="pixel-spark b">+</div>
                  <Hamster className="hero-hamster" />
                  <div className="art-chip">
                    <span className="dot" /> hello, builders.
                  </div>
                  <span className="art-label bottom">SDK + MCP + YOU</span>
                </div>
              </div>
              <div className="section-heading">
                <div>
                  <h2>Under the wheel</h2>
                  <p>The documented contract graph, read at one Ethereum block.</p>
                </div>
                <button className="button" onClick={refresh} disabled={loading}>
                  {loading ? <Loader2 className="spin" size={15} /> : <RefreshCw size={15} />}{' '}
                  {loading ? 'Reading Sepolia…' : 'Check live'}
                </button>
              </div>
              <div className="source-line">
                <span className="pill">
                  <Radio size={12} /> {source}
                </span>
                <span>{new Date(Number(protocol.snapshot.timestamp) * 1000).toLocaleString()}</span>
                <span className="source-note">
                  {source === 'Recorded audit'
                    ? 'Saved public evidence, not live activity'
                    : 'Fetched from the public RPC'}
                </span>
              </div>
              {error && <ErrorBox error={error} />}
              <div className="metrics">
                <Metric
                  label="SQUEEK BLOCKS"
                  value={BigInt(protocol.core.blockHeight).toLocaleString('en-US')}
                  foot="Completed by settled wheel work"
                  icon={<Layers3 size={18} />}
                />
                <Metric
                  label="ACTIVE POWER"
                  value={formatAmount(BigInt(protocol.mining.totalWeight), 0, 0)}
                  foot="Current power in this deployment"
                  icon={<CircleDot size={18} />}
                />
                <Metric
                  label="SQK ISSUED"
                  value={formatAmount(BigInt(protocol.supply), 18, 0)}
                  foot="Sepolia test tokens · no cash value"
                  icon={<Code2 size={18} />}
                />
                <Metric
                  label="UNPROCESSED ROUNDS"
                  value={protocol.unprocessedRounds}
                  foot={
                    protocol.core.paused ? 'Core is paused' : 'Settled work awaiting a checkpoint'
                  }
                  icon={<RefreshCw size={18} />}
                />
              </div>
              <div className="compatibility-card">
                <div className="compat-icon">
                  <ShieldCheck size={23} />
                </div>
                <div>
                  <div className="inline-heading">
                    <h3>Trust what you read.</h3>
                    <span className={protocol.snapshot.verified ? 'badge green' : 'badge amber'}>
                      {protocol.snapshot.verified ? 'Manifest matched' : 'Configuration changed'}
                    </span>
                  </div>
                  <p>
                    {protocol.snapshot.verified
                      ? 'The contract identities and configuration match the bundled manifest.'
                      : 'The code identities match, but the runtime configuration differs from the published manifest. This diagnostic view remains readable. Transaction preparation stays blocked.'}
                  </p>
                  <details>
                    <summary>
                      Inspect deployment evidence <ChevronRight size={14} />
                    </summary>
                    <div className="evidence-lines">
                      <p>
                        <b>Release</b>
                        <code>{DEPLOYMENT.release}</code>
                      </p>
                      <p>
                        <b>Ethereum block</b>
                        <a
                          href={`https://eth-sepolia.blockscout.com/block/${protocol.snapshot.blockNumber}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {protocol.snapshot.blockNumber} <ExternalLink size={12} />
                        </a>
                      </p>
                      <p>
                        <b>Block hash</b>
                        <code>{protocol.snapshot.blockHash}</code>
                      </p>
                      {protocol.snapshot.configurationDrift.map((d) => (
                        <p key={d.field}>
                          <b>{d.field}</b>
                          <code>
                            Expected: {String(d.expected)}
                            <br />
                            Observed: {String(d.actual)}
                          </code>
                        </p>
                      ))}
                    </div>
                  </details>
                  {compatibility && (
                    <p className="api-result">
                      <b>API compatibility:</b>{' '}
                      {compatibility.compatible
                        ? 'Matches the documented deployment.'
                        : String(compatibility.reason)}
                    </p>
                  )}
                </div>
              </div>
              <div className="feature-row">
                <div className="feature-copy">
                  <span className="eyebrow">ONE SDK. TWO WAYS IN.</span>
                  <h2>
                    Less plumbing.
                    <br />
                    More possibilities.
                  </h2>
                  <p>
                    Your application and your assistant use the same typed reads, eligibility checks
                    and transaction preparation.
                  </p>
                  <button className="text-button" onClick={() => setTab('MCP tools')}>
                    Meet the MCP tools <ArrowRight size={16} />
                  </button>
                </div>
                <Code>{`import { createSqueekKit } from '@squeekkit/sdk';\n\nconst squeek = createSqueekKit();\n\n// Identity checks + an explicit drift report.\nconst audit = await squeek.chain.auditProtocol();\n\nconsole.log(audit.core.blockHeight);\nconsole.log(audit.snapshot.configurationDrift);`}</Code>
              </div>
              <div className="bottom-strip">
                <span>
                  <ShieldCheck size={16} /> No keys. No broadcasts.
                </span>
                <span>
                  <Code2 size={16} /> TypeScript + viem
                </span>
                <span>
                  <Plug size={16} /> 10 MCP tools
                </span>
                <span>
                  <FlaskConical size={16} /> Reproducible tests
                </span>
              </div>
            </>
          ) : tab === 'Wallet lab' ? (
            <WalletLab />
          ) : tab === 'MCP tools' ? (
            <McpTools />
          ) : (
            <Quickstart />
          )}
        </main>
        <footer>
          <span>
            <Hamster small /> Built for the curious.
          </span>
          <span>
            Independent community project. Not affiliated with or endorsed by Squeekchain.
          </span>
          <a href="https://docs.squeekchain.com/developers/" target="_blank" rel="noreferrer">
            Protocol docs <ArrowUpRight size={13} />
          </a>
        </footer>
      </div>
    </div>
  );
}
function Metric({
  label,
  value,
  foot,
  icon,
}: {
  label: string;
  value: string;
  foot: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="metric">
      <div className="metric-label">
        {label}
        {icon}
      </div>
      <strong>{value}</strong>
      <p>{foot}</p>
    </div>
  );
}
function WalletLab() {
  const [mode, setMode] = useState<'sandbox' | 'live'>('sandbox'),
    [scenario, setScenario] = useState('ready'),
    [swapped, setSwapped] = useState(false),
    [preview, setPreview] = useState(false);
  const [wallet, setWallet] = useState(owner),
    [tokens, setTokens] = useState('8889, 8890'),
    [output, setOutput] = useState<unknown>(null),
    [error, setError] = useState<ReturnType<typeof publicError> | null>(null),
    [busy, setBusy] = useState(false);
  const a = swapped ? 256n : 128n,
    b = swapped ? 128n : 256n;
  const base: Position = {
    activeWeight: 1000n,
    pendingWeight: 0n,
    pendingRound: 0,
    nextMergeBlock: 100,
    level: 1,
    lastIndex: 0n,
    accruedScaled: 0n,
  };
  const donor = {
    ...base,
    pendingRound: scenario === 'pending' ? 12 : 0,
    nextMergeBlock: scenario === 'cooldown' ? 104 : 100,
  };
  const result = evaluateMerge({
    survivorId: a,
    donorId: b,
    survivor: base,
    donor,
    height: 100n,
    maximumLevel: 10,
  });
  async function inspect(action: 'read' | 'claim') {
    setBusy(true);
    setError(null);
    setOutput(null);
    try {
      const ids = tokens.split(',').map((x) => x.trim());
      setOutput(
        action === 'read'
          ? await kit.chain.inspectSqueeks(wallet, ids)
          : await kit.chain.prepareClaim(wallet, ids),
      );
    } catch (e) {
      setError(publicError(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="intro">
        <span className="eyebrow">WALLET LAB</span>
        <h1>Know your Squeeks.</h1>
        <p>Explore the rules. Inspect real positions. Keep control in your wallet.</p>
      </div>
      <div className="segmented" role="group" aria-label="Wallet data mode">
        <button aria-pressed={mode === 'sandbox'} onClick={() => setMode('sandbox')}>
          Simulated example
        </button>
        <button aria-pressed={mode === 'live'} onClick={() => setMode('live')}>
          Onchain inspection
        </button>
      </div>
      {mode === 'sandbox' ? (
        <>
          <div className="notice">
            <FlaskConical size={18} />
            <p>
              <b>Simulated example.</b> These two invented Squeeks demonstrate the SDK's merge
              rules. No wallet, live balances or real transaction simulation is involved.
            </p>
          </div>
          <div className="lab-grid">
            <div>
              <div className="section-heading">
                <h2>Two Squeeks. One next chapter.</h2>
                <button
                  className="button"
                  onClick={() => {
                    setSwapped(!swapped);
                    setPreview(false);
                  }}
                >
                  <ArrowLeftRight size={15} /> Swap roles
                </button>
              </div>
              <div className="squeek-cards">
                <SqueekCard id={a.toString()} role="Survivor" color="peach" />
                <div className="merge-symbol">+</div>
                <SqueekCard id={b.toString()} role="Donor" color="blue" />
              </div>
              <div className="scenario-controls">
                <span>TRY A CONDITION</span>
                {['ready', 'cooldown', 'pending'].map((s) => (
                  <button
                    key={s}
                    aria-pressed={scenario === s}
                    onClick={() => {
                      setScenario(s);
                      setPreview(false);
                    }}
                  >
                    {s === 'ready'
                      ? 'Ready to merge'
                      : s === 'cooldown'
                        ? 'Cooling down'
                        : 'Pending power'}
                  </button>
                ))}
              </div>
            </div>
            <div className="eligibility">
              <span className="eyebrow">MERGE CHECK</span>
              <h3>{result.eligible ? 'A perfect pair.' : 'A little more patience.'}</h3>
              <p>
                At completed Squeek block <b>100</b>
              </p>
              <ul>
                <li>
                  <CheckCircle2 size={17} /> Both selected NFTs are level 1
                </li>
                <li>
                  <CheckCircle2 size={17} /> Below the maximum level
                </li>
                <li>
                  {scenario === 'pending' ? (
                    <AlertTriangle size={17} />
                  ) : (
                    <CheckCircle2 size={17} />
                  )}{' '}
                  {scenario === 'pending' ? 'Donor power is pending' : 'No pending power'}
                </li>
                <li>
                  {scenario === 'cooldown' ? (
                    <AlertTriangle size={17} />
                  ) : (
                    <CheckCircle2 size={17} />
                  )}{' '}
                  {scenario === 'cooldown'
                    ? '4 more completed blocks needed'
                    : 'Both cooldowns reached'}
                </li>
              </ul>
              <button
                className="button primary full"
                disabled={!result.eligible}
                onClick={() => setPreview(true)}
              >
                Preview outcome <ArrowRight size={16} />
              </button>
            </div>
          </div>
          {preview && (
            <div className="outcome" role="status">
              <div>
                <CheckCircle2 size={22} />
                <h3>Squeek #{a.toString()} becomes level 2.</h3>
              </div>
              <p>{result.warning}</p>
              <small>
                Eligibility preview only. In a real flow, SqueekKit re-reads the verified chain,
                simulates, and returns an unsigned call for the owner to review.
              </small>
            </div>
          )}
          {!result.eligible && (
            <div className="notice amber">
              <AlertTriangle size={18} />
              <p>{result.reasons.join(' ')}</p>
            </div>
          )}
        </>
      ) : (
        <div className="panel">
          <h2>Read directly from Sepolia</h2>
          <p>
            Enter a full owner address and the IDs you want to inspect. This release targets the
            published October 12 deployment; configuration drift blocks strict reads and
            preparation.
          </p>
          <label htmlFor="owner">Owner address</label>
          <input
            id="owner"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            spellCheck={false}
          />
          <label htmlFor="ids">Explicit token IDs, separated by commas</label>
          <input
            id="ids"
            value={tokens}
            onChange={(e) => setTokens(e.target.value)}
            spellCheck={false}
          />
          <div className="hero-actions">
            <button className="button primary" disabled={busy} onClick={() => inspect('read')}>
              {busy ? <Loader2 className="spin" size={16} /> : <Radio size={16} />} Inspect IDs
            </button>
            <button className="button" disabled={busy} onClick={() => inspect('claim')}>
              Prepare unsigned claim
            </button>
          </div>
          <p className="fine">
            Nothing is signed or sent. An address alone does not prove wallet ownership.
          </p>
          {error && <ErrorBox error={error} />}{' '}
          {output !== null && <Code label="SDK response">{stringify(output)}</Code>}
        </div>
      )}
      <div className="two-notes">
        <article>
          <h3>Blocks, not a stopwatch.</h3>
          <p>
            A merge cooldown advances when the hamster's settled work completes Squeek blocks.
            Waiting a fixed number of minutes is not enough.
          </p>
        </article>
        <article>
          <h3>The survivor keeps its story.</h3>
          <p>
            The donor is permanently burned. The survivor keeps its ID and image, gains a level, and
            receives both positions' unclaimed rewards.
          </p>
        </article>
      </div>
    </>
  );
}
function SqueekCard({ id, role, color }: { id: string; role: string; color: string }) {
  return (
    <div className="squeek-card">
      <div className={'squeek-portrait ' + color}>
        <Hamster />
        <span className="level">LVL 01</span>
      </div>
      <div className="squeek-info">
        <div>
          <strong>Squeek #{id}</strong>
          <span>1,000 active power</span>
        </div>
        <span className={'badge ' + (role === 'Survivor' ? 'green' : 'neutral')}>{role}</span>
      </div>
    </div>
  );
}
const tools = [
  ['audit_protocol', 'Observe the documented chain and report configuration drift.'],
  ['verify_deployment', 'Check the full deployment against the pinned manifest.'],
  ['get_protocol_status', 'Strictly verified core, supply and checkpoint reads.'],
  ['check_api_compatibility', 'Detect an API connected to a different release.'],
  ['get_wallet_portfolio', 'Read a bounded, complete API portfolio.'],
  ['get_settlements', 'Explore settlement history from a matching API.'],
  ['inspect_squeeks', 'Check explicit IDs directly against the chain.'],
  ['check_merge', 'Explain levels, pending power and block cooldowns.'],
  ['prepare_claim', 'Simulate and return an unsigned claim.'],
  ['prepare_merge', 'Simulate and explain the permanent donor burn.'],
];
function McpTools() {
  const [selected, setSelected] = useState('audit_protocol'),
    [result, setResult] = useState<unknown>(null),
    [busy, setBusy] = useState(false);
  async function run() {
    setBusy(true);
    try {
      setResult(
        await (selected === 'audit_protocol' ? kit.chain.auditProtocol() : kit.api.compatibility()),
      );
    } catch (e) {
      setResult(publicError(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="intro">
        <span className="eyebrow">MODEL CONTEXT PROTOCOL</span>
        <h1>
          Give your assistant
          <br />a way into the burrow.
        </h1>
        <p>Ten focused tools. One shared SDK. Structured answers with provenance.</p>
      </div>
      <div className="mcp-hero">
        <div className="flow-node">
          <Terminal />
          <b>Your assistant</b>
          <span>MCP-compatible client</span>
        </div>
        <ArrowRight className="flow-arrow" />
        <div className="flow-node highlighted">
          <Plug />
          <b>SqueekKit MCP</b>
          <span>Typed tools · resources · prompt</span>
        </div>
        <ArrowRight className="flow-arrow" />
        <div className="flow-node">
          <Layers3 />
          <b>SqueekKit SDK</b>
          <span>Verified RPC + display API</span>
        </div>
      </div>
      <div className="section-heading">
        <div>
          <h2>Try the tool interface</h2>
          <p>This browser preview calls the shared SDK. The installable MCP server uses stdio.</p>
        </div>
      </div>
      <div className="tool-playground">
        <div className="tool-selector">
          <label htmlFor="tool">Operation</label>
          <select
            id="tool"
            value={selected}
            onChange={(e) => {
              setSelected(e.target.value);
              setResult(null);
            }}
          >
            <option value="audit_protocol">audit_protocol</option>
            <option value="check_api_compatibility">check_api_compatibility</option>
          </select>
          <p>A real public network request. No model API, wallet or signing required.</p>
          <button className="button primary" disabled={busy} onClick={run}>
            {busy ? <Loader2 className="spin" size={16} /> : <ArrowRight size={16} />}{' '}
            {busy ? 'Running…' : 'Run SDK preview'}
          </button>
        </div>
        <Code label="MCP tools/call request">
          {stringify({ method: 'tools/call', params: { name: selected, arguments: {} } })}
        </Code>
      </div>
      {result !== null && <Code label="Actual SDK response">{stringify(result)}</Code>}
      <div className="tool-list">
        {tools.map(([name, description], i) => (
          <div className="tool-row" key={name}>
            <span className="tool-num">{String(i + 1).padStart(2, '0')}</span>
            <code>{name}</code>
            <p>{description}</p>
            <span className="badge neutral">Read / prepare</span>
          </div>
        ))}
      </div>
    </>
  );
}
function Quickstart() {
  return (
    <>
      <div className="intro">
        <span className="eyebrow">QUICKSTART</span>
        <h1>From clone to curiosity.</h1>
        <p>Node.js 22.12 or newer. npm. A few commands. No private keys.</p>
      </div>
      <div className="steps">
        <section>
          <div className="step-number">01</div>
          <div>
            <h2>Get the toolkit</h2>
            <p>
              The repository includes the SDK, MCP server, demo and regression tests. The packages
              are not yet published to npm.
            </p>
            <Code label="Terminal">{`git clone ${repo}.git\ncd squeekkit\nnpm ci\nnpm run check\nnpm run dev`}</Code>
          </div>
        </section>
        <section>
          <div className="step-number">02</div>
          <div>
            <h2>Connect an MCP client</h2>
            <p>
              After building, add the server to your client's MCP configuration. Replace the path
              with your absolute checkout path.
            </p>
            <Code label="MCP client configuration">
              {stringify({
                mcpServers: {
                  squeekkit: {
                    command: 'node',
                    args: ['/absolute/path/to/squeekkit/packages/mcp/dist/cli.js'],
                  },
                },
              })}
            </Code>
            <p className="fine">
              The stdio server keeps stdout reserved for protocol messages. A custom RPC can be
              configured with SQUEEKKIT_RPC_URL.
            </p>
          </div>
        </section>
        <section>
          <div className="step-number">03</div>
          <div>
            <h2>Ask a useful question</h2>
            <div className="prompt-card">
              “Audit the documented Squeekchain deployment. Tell me which checks pass and whether
              any configuration has changed.”
            </div>
            <p>
              Then inspect explicitly selected NFT IDs, explain eligibility, or prepare an
              owner-reviewed unsigned claim.
            </p>
            <a
              className="button"
              href={repo + '/blob/main/README.md'}
              target="_blank"
              rel="noreferrer"
            >
              Read the full guide <ArrowUpRight size={16} />
            </a>
          </div>
        </section>
      </div>
      <div className="notice amber">
        <AlertTriangle size={18} />
        <p>
          <b>Compatibility is explicit.</b> This release pins Core v3 / Mining v6 from the official
          developer manifest. It does not silently adopt new addresses from an API or scan other
          deployments. See the repository's compatibility report for the current findings.
        </p>
      </div>
    </>
  );
}

const root: Root = import.meta.hot?.data.root ?? createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
if (import.meta.hot) {
  import.meta.hot.data.root = root;
  import.meta.hot.accept();
}
