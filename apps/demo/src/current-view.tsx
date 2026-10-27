import { useState } from 'react';
import { Radio, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';
import {
  createCurrentTestnet,
  CURRENT_TESTNET,
  CURRENT_ADDRESSES,
  stringify,
  publicError,
  formatAmount,
} from '@squeekkit/sdk';
import recorded from './current-reference.json';
// The app API restricts browser origins. The loopback dev/preview server proxies
// only two public GET routes; Node SDK/MCP clients call the upstream directly.
const kit = createCurrentTestnet({ api: { baseUrl: window.location.origin } });
function Json({ value }: { value: unknown }) {
  return (
    <details className="evidence">
      <summary>Inspect JSON evidence</summary>
      <pre>{stringify(value)}</pre>
    </details>
  );
}
export function CurrentTestnetView() {
  const [protocol, setProtocol] = useState(recorded.protocol),
    [live, setLive] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState<ReturnType<typeof publicError> | null>(null);
  const [owner, setOwner] = useState(CURRENT_TESTNET.links['nft.protocolRecipient']),
    [ids, setIds] = useState('8889,8890'),
    [result, setResult] = useState<unknown>(null),
    [portfolio, setPortfolio] = useState<Awaited<ReturnType<typeof kit.api.portfolio>> | null>(
      null,
    ),
    [label, setLabel] = useState('');
  async function readProtocol() {
    setBusy(true);
    setError(null);
    try {
      setProtocol(JSON.parse(stringify(await kit.chain.protocol())));
      setLive(true);
    } catch (e) {
      setError(publicError(e));
    } finally {
      setBusy(false);
    }
  }
  async function run(kind: 'portfolio' | 'account' | 'inspect' | 'claim' | 'merge') {
    setBusy(true);
    setError(null);
    setResult(null);
    setPortfolio(null);
    setLabel(
      kind === 'portfolio'
        ? 'API display data'
        : kind === 'claim' || kind === 'merge'
          ? 'Unsigned simulation · nothing sent'
          : 'Verified onchain read',
    );
    try {
      let value: unknown;
      if (kind === 'portfolio') {
        const p = await kit.api.portfolio(owner);
        setPortfolio(p);
        value = p;
      } else if (kind === 'account') value = await kit.chain.account(owner);
      else if (kind === 'claim') value = await kit.chain.prepareClaim(owner);
      else {
        const selected = ids.split(',').map((x) => x.trim());
        if (kind === 'inspect') value = await kit.chain.inspectSqueeks(owner, selected);
        else {
          if (selected.length !== 2) throw new Error('Select exactly two IDs');
          value = await kit.chain.prepareMerge(owner, selected[0]!, selected[1]!);
        }
      }
      setResult(value);
    } catch (e) {
      setError(publicError(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="intro">
        <span className="eyebrow">CURRENT APP / SEPOLIA</span>
        <h1>
          Your Squeeks.
          <br />
          Right here.
        </h1>
        <p>
          Read the same testnet used by Squeekchain’s live app. Explore account rewards, wallet NFTs
          and deposited Squeeks.
        </p>
      </div>
      <div className="notice current-success">
        <ShieldCheck size={22} />
        <div>
          <b>A separate, checked testnet profile.</b>
          <p>
            Core v3 · Mining v8 · Staking v1. Interfaces from the official app, code identities
            pinned from public chain evidence. Community reviewed; not an official deployment
            manifest or a security audit.
          </p>
        </div>
      </div>
      <div className="section-heading">
        <div>
          <h2>The current burrow</h2>
          <p>
            {live ? 'Live verified RPC read' : 'Recorded verified testnet snapshot'} · block{' '}
            {protocol.snapshot.blockNumber} ·{' '}
            {new Date(Number(protocol.snapshot.timestamp) * 1000).toLocaleString()}
          </p>
        </div>
        <button className="button primary" onClick={readProtocol} disabled={busy}>
          {busy ? <Loader2 className="spin" size={16} /> : <Radio size={16} />} Read live testnet
        </button>
      </div>
      <div className="current-metrics">
        <article>
          <small>SQUEEK BLOCKS</small>
          <strong>{BigInt(protocol.core.blockHeight).toLocaleString()}</strong>
          <span>Settled hamster work</span>
        </article>
        <article>
          <small>SQK SUPPLY</small>
          <strong>{formatAmount(BigInt(protocol.supply), 18, 0)}</strong>
          <span>Testnet tokens · no cash value</span>
        </article>
        <article>
          <small>PROFILE</small>
          <strong>Mining v8</strong>
          <span>Account rewards + NFT deposits</span>
        </article>
      </div>
      <Json
        value={{
          snapshot: protocol.snapshot,
          contracts: CURRENT_ADDRESSES,
          provenance: CURRENT_TESTNET.provenance,
        }}
      />
      <section className="live-form current-form">
        <div className="section-heading">
          <div>
            <h2>A wallet, without connecting it.</h2>
            <p>
              The prefilled example is the public protocol reserve. Enter any full wallet address to
              inspect its testnet account.
            </p>
          </div>
        </div>
        <label htmlFor="current-owner">Current testnet owner</label>
        <input
          id="current-owner"
          value={owner}
          onChange={(e) => {
            setOwner(e.target.value);
            setResult(null);
            setPortfolio(null);
          }}
          spellCheck={false}
        />
        <div className="hero-actions">
          <button className="button primary" onClick={() => run('portfolio')} disabled={busy}>
            Read portfolio <ArrowRight size={16} />
          </button>
          <button className="button" onClick={() => run('account')} disabled={busy}>
            Read account onchain
          </button>
          <button className="button" onClick={() => run('claim')} disabled={busy}>
            Simulate account claim
          </button>
        </div>
        <label htmlFor="current-ids">
          Selected NFT IDs · survivor first, donor second for a merge
        </label>
        <input
          id="current-ids"
          value={ids}
          onChange={(e) => {
            setIds(e.target.value);
            setResult(null);
            setPortfolio(null);
          }}
          spellCheck={false}
        />
        <div className="hero-actions">
          <button className="button" onClick={() => run('inspect')} disabled={busy}>
            Inspect selected NFTs
          </button>
          <button className="button" onClick={() => run('merge')} disabled={busy}>
            Simulate selected merge
          </button>
        </div>
        <p className="fine">
          Simulations never sign or send. A real merge permanently burns the second NFT. Current-app
          rewards belong to the account, not each NFT. Deposits and withdrawals are also available
          in the SDK and MCP.
        </p>
        {busy && <p role="status">Reading and verifying the current testnet…</p>}
        {error && (
          <div className="error-box" role="alert">
            <div>
              <b>{error.code}</b>
              <p>{error.message}</p>
              <Json value={error.details} />
            </div>
          </div>
        )}
        {portfolio && (
          <div className="current-portfolio">
            <h3>Wallet and deposited Squeeks</h3>
            <div className="current-metrics">
              <article>
                <small>IN WALLET</small>
                <strong>{portfolio.tokenCounts.wallet}</strong>
              </article>
              <article>
                <small>DEPOSITED</small>
                <strong>{portfolio.tokenCounts.staking}</strong>
              </article>
              <article>
                <small>CLAIMABLE SQK</small>
                <strong>{formatAmount(BigInt(portfolio.claim.claimableBaseUnits), 18, 3)}</strong>
                <span>
                  {portfolio.claim.complete
                    ? 'Account settlement complete'
                    : 'Partial settlement · more processing required'}
                </span>
              </article>
            </div>
            <p className="fine">
              Complete portfolio: {portfolio.tokens.length} NFTs · API display data at block{' '}
              {portfolio.source.chain.safeThroughBlock}. Actions independently re-read the chain.
            </p>
            <div className="current-token-list">
              {portfolio.tokens.slice(0, 40).map((t) => (
                <div key={t.tokenId}>
                  <b>#{t.tokenId}</b>
                  <span>Level {t.level}</span>
                  <span className={'badge ' + (t.custody === 'staking' ? 'green' : 'neutral')}>
                    {t.custody === 'staking' ? 'Deposited' : 'In wallet'}
                  </span>
                </div>
              ))}
            </div>
            {portfolio.tokens.length > 40 && (
              <p className="fine">
                Showing the first 40; JSON evidence contains all {portfolio.tokens.length}.
              </p>
            )}
          </div>
        )}
        {result !== null && (
          <div className="current-result" role="status">
            <b>{label}</b>
            {typeof result === 'object' && result !== null && 'warning' in result && (
              <p className="notice amber">{String(result.warning)}</p>
            )}
            {typeof result === 'object' &&
              result !== null &&
              'simulatedPayoutBaseUnits' in result && (
                <p>
                  Simulated payout:{' '}
                  <b>
                    {formatAmount(BigInt(String(result.simulatedPayoutBaseUnits)), 18, 6)} testnet
                    SQK
                  </b>
                  . Recipient:{' '}
                  <span style={{ overflowWrap: 'anywhere' }}>
                    {'recipient' in result ? String(result.recipient) : ''}
                  </span>
                </p>
              )}
            <Json value={result} />
          </div>
        )}
      </section>
      <p className="fine">
        Profile {CURRENT_TESTNET.id}. The legacy documented deployment remains separately available
        under Overview and the original SDK methods. No mainnet support.
      </p>
    </>
  );
}
