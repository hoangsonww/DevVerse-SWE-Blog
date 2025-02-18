# DevVerse Computer Science & Software Engineering Blog

A modern, high-performance blog built with [Next.js](https://nextjs.org/), leveraging MDX for content, PWA capabilities, and a rich ecosystem of libraries including Framer Motion, KaTeX, and more. This project is designed for scalability, maintainability, and an excellent developer experience.

![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![MDX](https://img.shields.io/badge/-MDX-000000?style=flat-square&logo=mdx&logoColor=white)
![Next.js](https://img.shields.io/badge/-Next.js-000000?style=flat-square&logo=next.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=white)
![Prettier](https://img.shields.io/badge/-Prettier-F7B93E?style=flat-square&logo=prettier&logoColor=white)
![ESLint](https://img.shields.io/badge/-ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white)
![Framer Motion](https://img.shields.io/badge/-Framer%20Motion-0055FF?style=flat-square&logo=framer&logoColor=white)
![Progressive Web App](https://img.shields.io/badge/-PWA-311C87?style=flat-square&logo=googlechrome&logoColor=white)

## Table of Contents

- [Overview](#overview)
- [Live Application](#live-application)
  - [Home Page](#home-page)
  - [Article Page](#article-page)
  - [Dark Mode](#dark-mode)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Local Development](#local-development)
  - [Docker & Docker Compose](#docker--docker-compose)
  - [Using VS Code Dev Containers](#using-vs-code-dev-containers)
- [Available Scripts](#available-scripts)
- [Dependencies](#dependencies)
- [Dev Dependencies](#dev-dependencies)
- [Docker & Dev Container Configuration](#docker--dev-container-configuration)
- [Contributing](#contributing)
  - [Add more MDX content](#add-more-mdx-content)
- [License](#license)
- [Further Reading](#further-reading)

## Overview

This repository hosts a Next.js-based blog that uses MDX to write rich, interactive content. The app combines server-side rendering, static site generation, and client-side rendering to deliver fast and SEO-friendly pages. It also includes modern features such as PWA support, image optimization, and seamless animations using Framer Motion.

The blog covers a wide range of topics in computer science and software engineering, providing educational content, tutorials, and insights for developers of all levels. The content is written in MDX, allowing for a mix of Markdown and React components to create engaging posts. Additionally, this architecture also allows for easy addition or modification of content without compromising performance or modifying any code.

To add more content, we can simply create new MDX files in the `content` directory, following the existing structure. The blog is designed to be scalable, maintainable, and extensible, making it a great platform for sharing knowledge and insights within the tech community.

Feel free to contribute your own articles, improve the existing content, or customize the blog to suit your needs. Let's build a vibrant community around computer science and software engineering! Refer to the [Contributing](#contributing) section for guidelines on how to contribute to this project.

## Live Application

The blog is deployed on Vercel and can be accessed at [https://devverse-cs-swe-blog.vercel.app/](https://devverse-cs-swe-blog.vercel.app/).

The backup deployment is available on Netlify at [https://devverse-cs-swe-blog.netlify.app/](https://devverse-cs-swe-blog.netlify.app/).

Feel free to explore the content and features of the blog! 🚀

### Home Page

<p align="center">
  <img src="images/home-page.png" alt="Home Page" width="100%">
</p>

### Article Page

<p align="center">
  <img src="images/article-page.png" alt="Article Page" width="100%">
</p>

### Dark Mode

<p align="center">
  <img src="images/dark-mode.png" alt="Dark Mode" width="100%">
</p>

## Features

- **Next.js Framework:** Built with Next.js for robust SSR, SSG, and CSR.
- **MDX Integration:** Write content in MDX, mixing Markdown with React components.
- **Progressive Web App (PWA):** Enhanced offline capabilities with [next-pwa](https://github.com/shadowwalker/next-pwa).
- **Animation:** Smooth animations with [Framer Motion](https://www.framer.com/motion/).
- **Mathematics Rendering:** Render mathematical equations using [KaTeX](https://katex.org/), [rehype-katex](https://github.com/remarkjs/rehype-katex), and [remark-math](https://github.com/remarkjs/remark-math).
- **Code Splitting & Performance:** Automatic code splitting and image optimization for improved performance.
- **Containerized Development:** Docker and Docker Compose configurations for an isolated development environment.
- **Dev Containers:** VS Code Dev Container configuration for a seamless setup.

## Project Structure

```
devverse-cs-swe-blog/
├── app/
│   ├── globals.css         # Global CSS styles
│   ├── page.tsx            # Main page component
│   ├── layout.tsx          # Layout component
│   └── topics/[slug]
│       └── page.tsx        # Dynamic topic pages
├── components/             # Reusable React components
│   ├── ArticleList.tsx     # Component for displaying a list of articles
│   ├── Footer.tsx          # Footer component
│   ├── HomePageContent.tsx # Home page content component
│   ├── Navbar.tsx          # Navbar component
│   ├── InteractiveCard.tsx # Interactive card component
│   ├── Loading.tsx         # Loading spinner component
│   ├── MdxLayout.tsx       # Layout component for MDX content
│   └── RouteProgress.tsx   # Route progress bar component
├── public/                 # Static files (images, fonts, etc.)
├── content/                # MDX content for blog posts
├── .devcontainer/          # VS Code Dev Container configuration
│   └── devcontainer.json
├── images/                 # Images for README
├── Dockerfile              # Docker image configuration for the app
├── docker-compose.yml      # Docker Compose file for containerized development
├── package.json            # Project manifest with scripts and dependencies
├── tsconfig.json           # TypeScript configuration
├── next.config.js          # Next.js configuration
├── mdx-components.tsx      # Custom MDX components
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md               # This documentation file
```

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) (for containerized development)
- [Visual Studio Code](https://code.visualstudio.com/) (optional, for using Dev Containers)

## Getting Started

### Local Development

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/hoangsonww/DevVerse-CS-SWE-Blog.git
   cd DevVerse-CS-SWE-Blog
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Run the Development Server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

### Docker & Docker Compose

A `docker-compose.yml` file is provided to facilitate containerized development.

1. **Build and Start the Container:**

   ```bash
   docker-compose up
   ```

2. **Access the App:**

   The application will be available at [http://localhost:3000](http://localhost:3000).

### Using VS Code Dev Containers

If you use Visual Studio Code, you can open the project in a Dev Container:

1. Install the [Remote - Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers).
2. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS) and select **"Remote-Containers: Reopen in Container"**.
3. VS Code will build and attach to the container using the configuration in `.devcontainer/devcontainer.json`.

## Available Scripts

- **`npm run dev`**  
  Runs the Next.js development server.

- **`npm run build`**  
  Builds the application for production.

- **`npm run start`**  
  Starts the production server.

## Dependencies

- **Next.js:** The core framework powering the application.
- **React & React-Dom:** Essential libraries for building user interfaces.
- **@mdx-js/loader & @mdx-js/react:** Tools for integrating MDX content with React.
- **next-pwa:** Adds progressive web app capabilities.
- **Framer Motion:** Provides smooth animations.
- **KaTeX, rehype-katex, remark-math:** Enable mathematical rendering within MDX content.
- **nprogress:** A progress bar for route transitions.
- **remark-gfm:** Adds support for GitHub Flavored Markdown.

## Dev Dependencies

- **TypeScript & @types/node:** Enable static typing for robust development.
- **@types/nprogress:** Provides type definitions for nprogress.

## Docker & Dev Container Configuration

### Dockerfile

```Dockerfile
FROM node:18-bullseye-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - .:/app:cached
    command: npm run dev
    environment:
      - NODE_ENV=development
```

### .devcontainer/devcontainer.json

```json
{
  "name": "devverse-cs-swe-blog",
  "build": {
    "dockerfile": "Dockerfile",
    "context": ".."
  },
  "settings": {
    "terminal.integrated.shell.linux": "/bin/bash",
    "editor.formatOnSave": true
  },
  "extensions": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "eamodio.gitlens"
  ],
  "postCreateCommand": "npm install",
  "remoteUser": "node",
  "forwardPorts": [3000]
}
```

## Contributing

Contributions are welcome! Please follow these guidelines when contributing:

1. Fork the repository and create your feature branch (`git checkout -b feature/your-feature`).
2. Commit your changes (`git commit -m 'Add some feature'`).
3. Push your branch (`git push origin feature/your-feature`).
4. Open a pull request with a detailed description of your changes.

Ensure that your code adheres to our coding standards and includes tests where applicable.

### Add more MDX content

To add more MDX content, create a new `.mdx` file in the `content` directory. You can use the existing files as a template.

We welcome contributions that expand the content and cover a wide range of topics in computer science and software engineering! I hope this project can serve as a platform for sharing knowledge and insights within the tech community.

## License

This project is licensed under the [MIT License](LICENSE).

## Further Reading and Resources

- **Next.js Documentation:** [https://nextjs.org/docs](https://nextjs.org/docs)
- **MDX Documentation:** [https://mdxjs.com/](https://mdxjs.com/)
- **Next.js Blog:** Explore real-world examples and case studies on the official Next.js blog.
- **Docker Documentation:** [https://docs.docker.com/](https://docs.docker.com/)
- **VS Code Dev Containers:** [https://code.visualstudio.com/docs/remote/containers](https://code.visualstudio.com/docs/remote/containers)

Reach out to me at [@hoangsonww](https://github.com/hoangsonww) for any questions or feedback. I'd love to hear from you!

---

*This project is powered by Next.js and serves as a testament to the framework's capabilities in building modern, scalable, and high-performance web applications. Happy coding!* 🚀
