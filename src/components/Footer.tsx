import { useEffect } from 'react'
import { allPending } from '../lib/pending'
import { useShop } from '../lib/shop'
import { Wordmark } from './Header'
import { Pending, useShowPending } from './Pending'
import { ContactLinks } from './ContactLinks'

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
  const { store, policies } = config
  useOpenDetailsOnHash()

  return (
    <footer className="site-footer" id="site-footer">
      <div className="container">
        <div className="site-footer__grid">
          <div>
            <p className="site-footer__brand">
              <Wordmark /> {store.name ?? <Pending field="NOME_DA_LOJA">nome da loja</Pending>}
            </p>
            {(store.independence.confirmed || showPending) && (
              <p className="site-footer__independence">
                {store.independence.statement}{' '}
                {!store.independence.confirmed && <Pending field="IDENTIFICACAO_DO_VENDEDOR">confirmar</Pending>}
              </p>
            )}
            <p className="site-footer__legal">
              {store.legalName && store.documentId && (
                <>
                  {store.legalName} · {store.documentId}
                  <br />
                </>
              )}
              {store.address && (
                <>
                  {store.address}
                  <br />
                </>
              )}
              {store.addressUrl && (
                <a className="site-footer__map" href={store.addressUrl} target="_blank" rel="noopener">
                  Ver no Google Maps
                </a>
              )}
            </p>
          </div>

          <div>
            <h2 className="site-footer__heading">Atendimento</h2>
            <ContactLinks />
            {config.contact.hours && <p>{config.contact.hours}</p>}
          </div>

          <div>
            <h2 className="site-footer__heading">Políticas</h2>
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
            <p className="site-footer__note">Esta página não usa cookies nem pixels de publicidade. A escolha do modelo não é salva nem enviada.</p>
          </div>
        </div>

        {showPending && <PendingList />}

        <p className="site-footer__copy">
          © {new Date().getFullYear()} {store.name ?? 'Bonés e camisas 13 e 22'}
        </p>
      </div>
    </footer>
  )
}
