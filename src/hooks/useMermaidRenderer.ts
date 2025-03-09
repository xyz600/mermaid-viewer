import { useState, useEffect } from 'react';
import mermaid from 'mermaid';

// Initialize mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
});

export const useMermaidRenderer = (code: string) => {
  const [svgOutput, setSvgOutput] = useState<string>('');

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        const { svg } = await mermaid.render('mermaid-diagram', code);
        
        // Modify SVG to prevent text selection and interaction
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svg, 'image/svg+xml');
        const svgElement = svgDoc.documentElement;
        
        // Add style to prevent text selection but allow container interaction
        const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
        style.textContent = `
          text, path, circle, rect, polygon, ellipse, line, polyline {
            user-select: none;
          }
        `;
        svgElement.appendChild(style);
        
        // Convert back to string
        const serializer = new XMLSerializer();
        const modifiedSvg = serializer.serializeToString(svgDoc);
        
        setSvgOutput(modifiedSvg);
      } catch (error) {
        console.error('Failed to render mermaid diagram:', error);
        setSvgOutput('<div style="color: red; padding: 1rem;">Error rendering diagram</div>');
      }
    };

    renderDiagram();
  }, [code]);

  return svgOutput;
};
