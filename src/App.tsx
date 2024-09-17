/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    if ('OTPCredential' in window) {
      window.addEventListener('DOMContentLoaded', () => {
        const input = document.querySelector(
          'input[autocomplete="one-time-code"]'
        )
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
            setMessage(otp?.code)
          })
          .catch((err) => {
            console.log(err)
          })
      })
    }
  }, [])

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <form action="">
          <input type="text" value={message} />
        </form>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
