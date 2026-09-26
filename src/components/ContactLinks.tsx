import { instagramUrl, whatsappUrl } from '../lib/format'
import { useShop } from '../lib/shop'
import { Pending } from './Pending'

export function ContactLinks() {
  const { contact } = useShop().config
  const items = [
    contact.whatsapp && { href: whatsappUrl(contact.whatsapp), label: `WhatsApp ${contact.phone ?? ''}`.trim() },
    !contact.whatsapp &&
      contact.phone && { href: `tel:+55${contact.phone.replace(/\D/g, '')}`, label: `Telefone ${contact.phone}` },
    contact.email && { href: `mailto:${contact.email}`, label: contact.email },
    contact.instagram && { href: instagramUrl(contact.instagram), label: `Instagram ${contact.instagram}` },
  ].filter(Boolean) as Array<{ href: string; label: string }>

  if (items.length === 0) return <Pending field="CONTATO">canais de atendimento</Pending>
  return (
    <ul className="contact-list">
      {items.map((i) => (
        <li key={i.href}>
          <a href={i.href} rel="noopener" target={i.href.startsWith('mailto:') ? undefined : '_blank'}>
            {i.label}
          </a>
        </li>
      ))}
    </ul>
  )
}
