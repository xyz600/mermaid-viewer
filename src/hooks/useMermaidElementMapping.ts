import { useState, useEffect } from 'react';

// This hook creates a mapping between Mermaid SVG element IDs and source code lines
export const useMermaidElementMapping = (code: string) => {
  const [elementToLineMap, setElementToLineMap] = useState<Record<string, number>>({});

  useEffect(() => {
    // Parse the Mermaid code to create a mapping
    const lines = code.split('\n');
    const mapping: Record<string, number> = {};
    
    console.log('Parsing Mermaid code for mapping:');
    console.log(code);
    
    // Process each line to find node definitions and relationships
    lines.forEach((line, index) => {
      // Remove leading/trailing whitespace
      const trimmedLine = line.trim();
      
      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith('%%')) {
        return;
      }
      
      // Match node definitions like "A[Start]" or "B{Is it?}"
      const nodeMatch = trimmedLine.match(/^\s*([A-Za-z0-9_-]+)(\[|\{|\(|>|\[\/|\[\(|\[\\\])/);
      if (nodeMatch) {
        const nodeId = nodeMatch[1];
        mapping[nodeId] = index + 1; // Line numbers are 1-based
        console.log(`Mapped node ${nodeId} to line ${index + 1}`);
        return;
      }
      
      // Match relationships like "A --> B" or "B -->|Yes| C"
      const relationMatch = trimmedLine.match(/^\s*([A-Za-z0-9_-]+)\s*(-+>|==+>|--+|==+|\.\.-+>|\.\.-+)/);
      if (relationMatch) {
        const sourceId = relationMatch[1];
        mapping[sourceId] = index + 1;
        console.log(`Mapped source ${sourceId} to line ${index + 1}`);
        
        // Try to extract the target node as well
        const targetMatch = trimmedLine.match(/(-+>|==+>|--+|==+|\.\.-+>|\.\.-+)\s*([A-Za-z0-9_-]+)/);
        if (targetMatch) {
          const targetId = targetMatch[2];
          mapping[targetId] = index + 1;
          console.log(`Mapped target ${targetId} to line ${index + 1}`);
        }
        
        return;
      }
      
      // For other types of diagrams like sequence diagrams, class diagrams, etc.
      // We would need more specific parsing logic
    });
    
    setElementToLineMap(mapping);
    console.log('Final mapping:', mapping);
  }, [code]);

  // Function to find the line number for a given element ID
  const getLineForElement = (elementId: string): number | undefined => {
    console.log('Looking up line for element ID:', elementId);
    console.log('Current mapping:', elementToLineMap);
    
    // Try different patterns to extract the node ID from the element ID
    
    // Pattern 1: Extract from common Mermaid ID formats like "flowchart-A-123"
    let nodeIdMatch = elementId.match(/(?:flowchart-|graph-|diagram-)?([A-Za-z0-9_-]+)(?:-\d+)?$/);
    if (nodeIdMatch) {
      const nodeId = nodeIdMatch[1];
      console.log('Extracted node ID (pattern 1):', nodeId);
      if (elementToLineMap[nodeId]) {
        return elementToLineMap[nodeId];
      }
    }
    
    // Pattern 2: Look for node IDs within the element ID
    for (const nodeId in elementToLineMap) {
      if (elementId.includes(nodeId)) {
        console.log('Found node ID in element ID:', nodeId);
        return elementToLineMap[nodeId];
      }
    }
    
    // Pattern 3: Try to extract from node- prefix (our custom added IDs)
    nodeIdMatch = elementId.match(/node-([A-Za-z0-9_-]+)/);
    if (nodeIdMatch) {
      const nodeId = nodeIdMatch[1];
      console.log('Extracted node ID from node- prefix:', nodeId);
      if (elementToLineMap[nodeId]) {
        return elementToLineMap[nodeId];
      }
    }
    
    // Pattern 4: Try to extract from edge- prefix (our custom added IDs)
    const edgeMatch = elementId.match(/edge-([A-Za-z0-9_-]+)-([A-Za-z0-9_-]+)/);
    if (edgeMatch) {
      const sourceId = edgeMatch[1];
      const targetId = edgeMatch[2];
      console.log('Extracted source and target from edge:', sourceId, targetId);
      
      // Try source first, then target
      if (elementToLineMap[sourceId]) {
        return elementToLineMap[sourceId];
      }
      if (elementToLineMap[targetId]) {
        return elementToLineMap[targetId];
      }
    }
    
    // Pattern 5: Try to extract from any element with an ID that contains a letter
    // This is a fallback for any other ID format
    for (const nodeId in elementToLineMap) {
      const regex = new RegExp(`\\b${nodeId}\\b`);
      if (regex.test(elementId)) {
        console.log('Found node ID with word boundary match:', nodeId);
        return elementToLineMap[nodeId];
      }
    }
    
    // If we get here, we couldn't find a mapping
    console.log('No mapping found for element ID:', elementId);
    return undefined;
  };

  return { getLineForElement };
};
