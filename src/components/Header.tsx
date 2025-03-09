import React, { useState } from 'react';

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  const [showHelp, setShowHelp] = useState(false);

  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

  return (
    <header style={{ 
      backgroundColor: '#3b82f6', 
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      position: 'relative'
    }}>
      <div style={{ width: '40px' }}></div> {/* Spacer for balance */}
      <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>{title}</h1>
      <button 
        onClick={toggleHelp}
        style={{
          background: 'none',
          border: '1px solid white',
          borderRadius: '50%',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
        aria-label="Help"
        title="Help"
      >
        ?
      </button>

      {showHelp && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: '16px',
          backgroundColor: 'white',
          color: '#333',
          padding: '16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          width: '320px',
          maxWidth: '90vw'
        }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#3b82f6' }}>Mermaid Viewer</h3>
          <p style={{ margin: '8px 0', lineHeight: '1.5' }}>
            mermaidの内容をリアルタイムプレビューするアプリケーションです。
          </p>
          <p style={{ margin: '8px 0', lineHeight: '1.5' }}>
            <a 
              href="https://mermaid.js.org/intro/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#3b82f6', textDecoration: 'none' }}
            >
              mermaidのドキュメントを見る
            </a>
          </p>
          
          <h4 style={{ margin: '16px 0 8px 0', fontSize: '14px' }}>操作方法:</h4>
          <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '14px' }}>
            <li style={{ margin: '4px 0' }}>
              <strong>拡大表示:</strong> プレビュー右上の拡大ボタンをクリックするか、<kbd style={{ backgroundColor: '#f1f5f9', padding: '2px 4px', borderRadius: '4px' }}>Ctrl+F</kbd>を押す
            </li>
            <li style={{ margin: '4px 0' }}>
              <strong>拡大表示を終了:</strong> 閉じるボタンをクリックするか、<kbd style={{ backgroundColor: '#f1f5f9', padding: '2px 4px', borderRadius: '4px' }}>Escape</kbd>キーを押す
            </li>
            <li style={{ margin: '4px 0' }}>
              <strong>移動 (パン):</strong> 図をクリックしてドラッグする
            </li>
            <li style={{ margin: '4px 0' }}>
              <strong>ズーム:</strong> マウスホイールを使用して拡大・縮小する
            </li>
          </ul>
          
          <button 
            onClick={toggleHelp}
            style={{
              display: 'block',
              margin: '16px 0 0 auto',
              padding: '6px 12px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            閉じる
          </button>
        </div>
      )}
    </header>
  );
};
