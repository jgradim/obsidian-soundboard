# Contributing to Obsidian Soundboard

First off, thank you for considering contributing to the Obsidian Soundboard plugin! It's people like you that make this tool better for everyone.

Following these guidelines helps us communicate and work together efficiently. In return, we promise to respect your time by addressing your issues and assessing your changes as quickly as possible.

## What kinds of contributions are we looking for?

We welcome all types of contributions! These include:
- **Bug reports**: Finding and reporting bugs is incredibly helpful.
- **Bug fixes**: Fixing existing issues in the codebase.
- **New features**: Adding new functionality to make the soundboard more powerful.
- **Documentation**: Improving the README or adding guides for users and contributors.
- **UI/UX Improvements**: Making the plugin easier and more pleasant to use within Obsidian.

## Ground Rules

To keep the project maintainable and healthy, we ask that all contributors:
- **Be respectful**: Maintain a polite and constructive tone in all communications.
- **Follow coding standards**: Write idiomatic TypeScript and adhere to the project's structure.
- **Ensure compatibility**: Ensure your changes work across supported platforms. Please ensure it works on mobile.
- **Small PRs**: Keep Pull Requests focused and small. One feature or fix per PR makes the review process much faster.
- **No external runtime dependencies**: The only allowed 3rd-party runtime dependencies are [`obsidian`](https://github.com/obsidianmd/obsidian-api) and [`zod`](https://github.com/colinhacks/zod)

## Getting Started

If you're new to contributing to this project, here is a quick walkthrough:

### 1. Set up your environment
1. Fork the repository on GitHub.
2. Clone your fork locally.
3. Install dependencies:
   ```bash
   npm install
   ```

### 2. Development workflow
- **Development mode (watch)**: Run the development script to compile changes in real-time:
  ```bash
  npm run dev
  ```

- **Lint**: Ensure that changes conform to obsidian's and the project's eslint guidelines:
  ```bash
  npm run lint
  ```

  ```bash
  npm run svelte-check
  ```

- **Test**: Ensure that changes pass all unit tests. Add more tests if necessary, following established patterns.
  ```bash
  npm run test

### 3. Project Structure
- Focus your logic in the `src/` directory.
- Keep `main.ts` minimal; it should primarily handle plugin lifecycle and registration.
- Delegate feature logic to separate modules (e.g., `src/commands/`, `src/ui/`, `src/utils/`).

### 4. Submitting changes
1. Create a new branch for your feature or fix.
2. Implement your changes and verify them in Obsidian.
3. Commit your changes with clear, descriptive commit messages.
4. Push to your fork and open a Pull Request against the `main` branch of the original repository.

## How to report a bug

If you find a bug, please open an issue on GitHub. To help us resolve it faster, please include:
- **Obsidian Version**: Which version of Obsidian are you using?
- **OS**: Windows, macOS, Linux, iOS, or Android?
- **Steps to reproduce**: A clear list of steps that consistently trigger the bug.
- **Expected behavior**: What should have happened?
- **Actual behavior**: What actually happened? (Include screenshots or logs if applicable).

## How to suggest a feature

If you have a suggestion for an enhancement:
1. Open an issue on GitHub.
2. Describe the feature and why it would be useful.
3. Explain how you envision it working within the current plugin interface.

## Code Review Process

Once you submit a Pull Request:
1. A maintainer will review your code for quality, security, and alignment with project goals.
2. You may be asked to make some changes or provide more information.
3. Once approved, the PR will be merged into the main branch.

## Community

The primary place for discussion is the GitHub Issues and Pull Requests sections. Feel free to reach out there!
