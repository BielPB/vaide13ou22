import { useEffect } from 'react'
import { allPending } from '../lib/pending'
import { useShop } from '../lib/shop'
import { BrandLogo } from './Header'
import { Pending, useShowPending } from './Pending'
import { whatsappUrl } from '../lib/format'
import { Link } from '../lib/router'
import { Icon } from './Icon'

/** Abre o <details> de destino quando um link interno aponta para ele. */
function useOpenDetailsOnHash() {
  useEffect(() => {
    const open = () => {
      const el = window.location.hash && document.getElementById(window.location.hash.slice(1))
      if (el instanceof HTMLDetailsElement) el.open = true
    }
    open()
    window.addEventListener('hashchange', open)
    return () => window.removeEventListener('hashchange', open)
  }, [])
}

function PendingList() {
  const { config } = useShop()
  const items = allPending(config)
  const essential = items.filter((i) => i.level === 'essential')
  const recommended = items.filter((i) => i.level === 'recommended')
  return (
    <details className="pending-list" id="pendencias">
      <summary>
        Pendências para publicação: {essential.length} essenciais, {recommended.length} recomendadas
      </summary>
      <div className="pending-list__cols">
        <div>
          <h3>Essenciais (bloqueiam a venda)</h3>
          <ul>
            {essential.map((i) => (
              <li key={i.key + i.label}>
                <code>{i.key}</code> {i.label}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Recomendadas</h3>
          <ul>
            {recommended.map((i) => (
              <li key={i.key + i.label}>
                <code>{i.key}</code> {i.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p>Edite <code>src/config/store.ts</code>. Detalhes em README.md e PENDENCIAS.md.</p>
    </details>
  )
}

export function Footer() {
  const { config } = useShop()
  const showPending = useShowPending()
  const { store, policies, contact, commerce } = config
  useOpenDetailsOnHash()

  return (
    <footer className="site-footer" id="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div className="site-footer__about">
            <p className="site-footer__brand">
              <BrandLogo className="site-footer__logo" /> {store.name ?? <Pending field="NOME_DA_LOJA">nome da loja</Pending>}
            </p>
            <p className="site-footer__tagline">Bonés e camisas 13 e 22. Escolha o seu modelo.</p>
            {(store.independence.confirmed || showPending) && (
              <p className="site-footer__independence">
                {store.independence.statement}{' '}
                {!store.independence.confirmed && <Pending field="IDENTIFICACAO_DO_VENDEDOR">confirmar</Pending>}
              </p>
            )}
            {store.legalName && store.documentId && (
              <p className="site-footer__legal">
                {store.legalName} · {store.documentId}
              </p>
            )}
          </div>

          <nav className="site-footer__info" aria-labelledby="footer-info-title">
            <h2 id="footer-info-title" className="site-footer__heading">
              Informações
            </h2>
            <ul className="site-footer__links">
              {contact.whatsapp && (
                <li>
                  <a href={whatsappUrl(contact.whatsapp)} target="_blank" rel="noopener">
                    Fale conosco{contact.phone && <span className="site-footer__phone">{` · WhatsApp ${contact.phone}`}</span>}
                  </a>
                </li>
              )}
              <li>
                <Link href="/#duvidas">Perguntas frequentes</Link>
              </li>
            </ul>
            {policies
              .filter((p) => p.body || showPending)
              .map((p) => (
                <details key={p.id} id={`politica-${p.id}`} className="policy">
                  <summary>{p.title}</summary>
                  <div className="policy__body">
                    {p.body ? p.body.split('\n\n').map((para, i) => <p key={i}>{para}</p>) : <Pending field="POLITICAS" />}
                  </div>
                </details>
              ))}
          </nav>
        </div>

        {commerce.payments && (
          <div className="site-footer__trust">
            <ul className="paychips" aria-label="Formas de pagamento">
              {['Visa', 'Mastercard', 'Elo', 'Pix'].map((b) => (
                <li key={b} className="paychip">
                  {b}
                </li>
              ))}
            </ul>
            <p className="safe-badge">
              <Icon name="shield" size={18} />
              <span>
                <strong>Loja protegida</strong> Compra 100% segura
              </span>
            </p>
          </div>
        )}

        {showPending && <PendingList />}

        <p className="site-footer__copy">
          © {new Date().getFullYear()} {store.name ?? 'Bonés e camisas 13 e 22'}
        </p>
      </div>
    </footer>
  )
}
