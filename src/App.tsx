/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')

  // Monitorar o evento 'copy' para capturar o conteúdo copiado
  // Lê o clipboard a cada 500ms
  function isOTP(clipboardText: string): boolean {
    // Remove espaços em branco do texto do clipboard
    const trimmedText = clipboardText.trim()

    // Verifica se é um número válido composto por 4 a 6 dígitos
    const otpRegex = /^\d{4,6}$/

    // Verifica se o texto é um número e segue o padrão OTP
    return otpRegex.test(trimmedText) && !isNaN(Number(trimmedText))
  }
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const clipboardText = await navigator.clipboard.readText()
        if (clipboardText && clipboardText !== message) {
          if (isOTP(clipboardText)) {
            console.log('OTP detected:', clipboardText)
            setMessage(clipboardText)
          } else {
            console.log('Non-OTP content:', clipboardText)
          }
        }
      } catch (err) {
        console.error('Failed to read clipboard contents:', err)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [message])
  // Lógica para capturar OTP via Credential Management API
  useEffect(() => {
    if ('OTPCredential' in window) {
      const input = document.querySelector(
        'input[autocomplete="one-time-code"]'
      )
      if (!input) return

      const ac = new AbortController()
      const form = input.closest('form')

      if (form) {
        form.addEventListener('submit', () => ac.abort())
      }

      navigator.credentials
        .get({
          // @ts-ignore: A API OTPCredential não é completamente tipada no TypeScript
          otp: { transport: ['sms'] },
          signal: ac.signal,
        })
        .then((otp: any) => {
          if (otp && otp.code) {
            setMessage(otp.code)
            console.log('Received OTP:', otp.code)
          }
        })
        .catch((err) => {
          console.log('Error fetching OTP:', err)
        })
    }
  }, [])

  return (
    <>
      <div className="card">
        <form action="">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            autoComplete="one-time-code"
            placeholder="Enter OTP or copy something..."
          />
        </form>
        <h3>Clipboard Monitor</h3>
        <p>Copied content: {message || 'Nothing copied yet.'}</p>
      </div>
    </>
  )
}

export default App
