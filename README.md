# Briose - A Card Game

Briose is a web-based card game built with Angular and Phaser. This project serves as a demonstration of integrating a Phaser game within an Angular application.

## Features

* **Angular Frontend:** Provides the main application structure and UI.
* **Phaser Game Engine:** Powers the interactive card game experience.
* **TypeScript:** Ensures type safety and better code organization.

## Current Status

This project is currently under active development. It features a playable card game with basic mechanics. Further enhancements and features are planned.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (LTS version recommended)
* npm (comes with Node.js)
* Angular CLI (`npm install -g @angular/cli`)

### Installation

1. Clone the repository:

    ```bash
    git clone <repository-url> # Please replace <repository-url> with the actual URL
    ```

2. Navigate to the project directory:

    ```bash
    cd briose
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

### Running the Application

#### Local Development

To run the development server:

```bash
ng serve
```

Open your browser and navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

#### Using Dev Containers

This project includes a Dev Container configuration for a consistent development environment.

1. **Open in Dev Container:** If you are using VS Code, you can open the project in a Dev Container. Look for the "Reopen in Container" prompt or use the "Remote-Containers: Reopen in Container" command from the Command Palette (Ctrl+Shift+P).
2. **Build and Run:** Once the Dev Container is built and running, the application dependencies will be installed automatically. You can then run the development server from the integrated terminal:

    ```bash
    ng serve
    ```

    The application will be accessible at `http://localhost:4200/` (port forwarding is typically handled automatically by the Dev Container).

## Project Structure

* `src/app/`: Angular application components.
* `src/game/`: Phaser game logic and scenes.
* `public/assets/`: Game assets like card images.

## Built With

* [Angular](https://angular.io/) - The web framework used
* [Phaser](https://phaser.io/) - The HTML5 game framework
* [TypeScript](https://www.typescriptlang.org/) - Programming language

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
