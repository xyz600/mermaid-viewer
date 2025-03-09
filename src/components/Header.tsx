import React from 'react';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header style={{ 
      backgroundColor: '#3b82f6', 
      color: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1rem',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    }}>
      <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>{title}</h1>
    </header>
  );
};
