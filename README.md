# Mermaid Viewer

A web-based editor and viewer for [Mermaid](https://mermaid.js.org/) diagrams. Create, edit, and preview Mermaid diagrams in real-time.

## Features

- Real-time preview of Mermaid diagrams
- Editor with syntax highlighting
- Zoom and pan functionality for diagrams
- Fullscreen mode
- Responsive design

## Live Demo

Visit the live demo at: [https://xyz600.github.io/mermaid-viewer/](https://xyz600.github.io/mermaid-viewer/)

## Development

This project is built with:

- React
- TypeScript
- Vite
- Tailwind CSS
- Mermaid.js

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/xyz600/mermaid-viewer.git
   cd mermaid-viewer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

### Deployment

This project is configured to deploy to GitHub Pages automatically when changes are pushed to the main branch. The deployment is handled by GitHub Actions.

To manually deploy:

1. Push your changes to the main branch:
   ```bash
   git push origin main
   ```

2. GitHub Actions will automatically build and deploy the site to GitHub Pages.

3. You can also trigger a deployment manually from the GitHub Actions tab in the repository.

## License

[MIT](LICENSE)
