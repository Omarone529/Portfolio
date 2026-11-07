/**
 * Link che apre direttamente un nuovo messaggio in Gmail, invece dell'app di
 * posta predefinita del dispositivo. `subject` e `body` sono facoltativi.
 */
export function gmailCompose(to, { subject = '', body = '' } = {}) {
  const params = new URLSearchParams({ view: 'cm', fs: '1', to })
  if (subject) params.set('su', subject)
  if (body) params.set('body', body)
  return `https://mail.google.com/mail/?${params}`
}
