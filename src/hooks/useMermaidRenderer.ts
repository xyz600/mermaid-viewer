import { useState, useEffect } from 'react';
import mermaid from 'mermaid';

// Initialize mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: 'default',
  securityLevel: 'loose',
  flowchart: {
    htmlLabels: true,
    useMaxWidth: true
  }
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
        // Also add cursor style for interactive elements
        const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
        style.textContent = `
          text, path, circle, rect, polygon, ellipse, line, polyline {
            user-select: none;
          }
          g[id]:hover {
            cursor: pointer;
          }
          .node:hover, .cluster:hover, .edgePath:hover {
            filter: brightness(0.95);
          }
          .clickable-element {
            cursor: pointer;
          }
          .clickable-element:hover {
            filter: brightness(0.9);
            stroke-width: 1.2;
          }
        `;
        svgElement.appendChild(style);
        
        // Enhance SVG elements with better IDs, classes and data attributes
        // This makes them more interactive and easier to identify
        
        // Process nodes (boxes, circles, etc.)
        const nodeElements = svgElement.querySelectorAll('.node, .cluster');
        nodeElements.forEach(node => {
          // Make sure all node elements have the node class for styling
          node.classList.add('node');
          node.classList.add('clickable-element');
          
          // Try to extract node ID from text content if no ID exists
          if (!node.id) {
            // Find text element inside the node
            const textElement = node.querySelector('text');
            if (textElement && textElement.textContent) {
              // Extract potential node ID from text content
              const match = textElement.textContent.match(/^([A-Za-z0-9_-]+)$/);
              if (match) {
                node.id = `node-${match[1]}`;
                console.log('Added ID to node:', node.id);
              }
            }
          }
          
          // Add data attribute for debugging
          node.setAttribute('data-clickable', 'true');
          
          // Add title for better accessibility
          const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
          title.textContent = 'Click to highlight source code';
          node.appendChild(title);
        });
        
        // Process edges (lines, arrows)
        const edgeElements = svgElement.querySelectorAll('.edgePath');
        edgeElements.forEach(edge => {
          edge.classList.add('clickable-element');
          
          // Add data attribute for debugging
          edge.setAttribute('data-clickable', 'true');
          
          // Try to extract edge IDs from the path
          if (!edge.id) {
            const pathElement = edge.querySelector('path');
            if (pathElement && pathElement.id) {
              const match = pathElement.id.match(/([A-Za-z0-9_-]+)-([A-Za-z0-9_-]+)/);
              if (match) {
                edge.id = `edge-${match[1]}-${match[2]}`;
                console.log('Added ID to edge:', edge.id);
              }
            }
          }
          
          // Add title for better accessibility
          const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
          title.textContent = 'Click to highlight source code';
          edge.appendChild(title);
        });
        
        // Process labels
        const labelElements = svgElement.querySelectorAll('.edgeLabel, .nodeLabel');
        labelElements.forEach(label => {
          label.classList.add('clickable-element');
        });
        
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
