import React, { useEffect, useState } from 'react';

interface TempoRestanteProps {
  dataTriagem: string; // Ex: "2024-06-07T14:30:00.000Z"
  risco: string;
}

const TempoRestante: React.FC<TempoRestanteProps> = ({ dataTriagem }) => {
  const [tempo, setTempo] = useState('');

  useEffect(() => {
    const atualizarTempo = () => {
      try {
        const inicio = new Date(dataTriagem).getTime();
        if (isNaN(inicio)) {
          setTempo('');
          return;
        }
        const agora = Date.now();
        const diff = agora - inicio;
        const minutos = Math.floor(diff / 60000);
        const segundos = Math.floor((diff % 60000) / 1000);
        setTempo(`${minutos}m ${segundos < 10 ? '0' : ''}${segundos}s`);
      } catch (error) {
        setTempo('');
      }
    };
    atualizarTempo();
    const interval = setInterval(atualizarTempo, 10000);
    return () => clearInterval(interval);
  }, [dataTriagem]);

  if (!tempo) return null;
  return <span className="ml-2 text-xs text-gray-500">⏱️ {tempo}</span>;
};

export default TempoRestante; 