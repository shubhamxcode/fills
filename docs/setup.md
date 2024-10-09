# Fills Project Setup

This repository contains a SvelteKit project created using the `create-svelte` tool. Below are the steps taken to set up this project and an overview of its contents.

## Project Creation Steps

1. Run the following command to create a new SvelteKit project:
   ```
   pnpm create svelte@latest
   ```

2. Follow the prompts to configure your project:
   - Choose the current directory for project creation
   - Select "Skeleton project" as the Svelte app template
   - Enable TypeScript with TypeScript syntax
   - Add the following additional options:
     - ESLint for code linting
     - Prettier for code formatting
     - Playwright for browser testing
     - Vitest for unit testing

3. After the project is created, install dependencies:
   ```
   pnpm install
   ```

4. Initialize git repository (optional):
   ```
   git init && git add -A && git commit -m "Initial commit"
   ```

5. Start the development server:
   ```
   pnpm run dev -- --open
   ```

## Project Structure

The project structure after creation is as follows:

```
.
├── eslint.config.js
├── package.json
├── playwright.config.ts
├── README.md
├── src/
├── static/
├── svelte.config.js
├── tests/
├── tsconfig.json
└── vite.config.ts
```

- `eslint.config.js`: Configuration file for ESLint
- `package.json`: Project dependencies and scripts
- `playwright.config.ts`: Configuration for Playwright browser testing
- `README.md`: This file
- `src/`: Source code directory
- `static/`: Static assets directory
- `svelte.config.js`: SvelteKit configuration file
- `tests/`: Directory for test files
- `tsconfig.json`: TypeScript configuration
- `vite.config.ts`: Vite configuration file

## Getting Started

To get started with development:

1. Clone this repository
2. Install dependencies: `pnpm install`
3. Start the development server: `pnpm run dev -- --open`

## Available Scripts

- `pnpm run dev`: Start the development server
- `pnpm run build`: Build the project for production
- `pnpm run preview`: Preview the production build
- `pnpm run test`: Run the test suite
- `pnpm run lint`: Run ESLint
- `pnpm run format`: Run Prettier to format code

## Additional Resources

- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Svelte Documentation](https://svelte.dev/docs)
- [Svelte Community Chat](https://svelte.dev/chat)

For any issues or questions, please refer to the official documentation or join the Svelte community chat.