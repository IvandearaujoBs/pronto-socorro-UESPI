import React from 'react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const user = localStorage.getItem('user');
    // Se não está logado e não está na página de login, redireciona para login
    if (!user && router.pathname !== '/login') {
      router.replace('/login');
      setIsReady(false);
      return;
    }
    // Se está logado e está na página de login, redireciona para a área correta
    if (user && router.pathname === '/login') {
      const { funcao } = JSON.parse(user);
      if (funcao === 'administrador') router.replace('/admin');
      else if (funcao === 'atendente') router.replace('/recepcao');
      else if (funcao === 'triador') router.replace('/triagem');
      else if (funcao === 'medico') router.replace('/medico');
      setIsReady(false);
      return;
    }
    // Pronto para renderizar
    setIsReady(true);
  }, [router.pathname]);

  // Só renderiza quando estiver pronto
  if (!isReady) {
    return null;
  }

  return <Component {...pageProps} />
} 

export default MyApp 