/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleCopy = (event: ClipboardEvent) => {
      try {
        // @ts-ignore
        const clipboardData = event.clipboardData || window.clipboardData
        const copiedText = clipboardData?.getData('text') || ''
        console.log('Copied content:', copiedText)
        setMessage(copiedText)
      } catch (err) {
        console.error('Failed to read clipboard contents:', err)
      }
    }

    // Adiciona o listener para o evento 'copy'
    document.addEventListener('copy', handleCopy)

    // Limpa o event listener ao desmontar o componente
    return () => {
      document.removeEventListener('copy', handleCopy)
    }
  }, [])

  useEffect(() => {
    if ('OTPCredential' in window) {
      const input = document.querySelector(
        'input[autocomplete="one-time-code"]'
      )
      console.log(input)
      if (!input) return
      const ac = new AbortController()
      const form = input.closest('form')
      if (form) {
        form.addEventListener('submit', () => {
          ac.abort()
        })
      }
      navigator.credentials
        .get({
          // @ts-ignore
          otp: { transport: ['sms'] },
          signal: ac.signal,
        })
        .then((otp) => {
          // @ts-ignore
          alert(otp?.code)
          // @ts-ignore
          setMessage(otp?.code)
        })
        .catch((err) => {
          console.log(err)
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
            onChange={(e) => {
              setMessage(e.target.value)
            }}
            autoComplete="one-time-code"
          />
        </form>
        <h3>Clipboard Monitor</h3>
        <p>Copied content: {message || 'Nothing copied yet.'}</p>
      </div>
    </>
  )
}

export default App
