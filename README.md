# Project Geo Discord Bot

## Overview
Project Geo is a modular Discord bot with feature-rich commands, event handling, and a well-structured codebase to support multiple subsystems like clans, mercy, moderation, and more. The project focuses on maintainability and scalability through clear separation of concerns.

---

## Project Structure

```
├── env/
│   ├── constant/          # Global constants (e.g. global.js)
│   ├── directory/         # Directory info and loader
│   ├── package/           # Package configs (package.json, jsconfig.json)
│   ├── secret/            # Credentials and secret config files
│   └── config.json        # General environment config
├── source/
│   ├── bot.js             # Main bot initialization and core logic
│   ├── commands/          # Command handlers, categorized by feature
│   │   ├── autocomplete/
│   │   ├── clan/
│   │   ├── mercy/
│   │   └── moderator/
│   ├── database/          # Database models and files
│   ├── elements/          # UI elements: buttons, menus, modals, embeds
│   ├── events/            # Event handlers and dispatcher
│   ├── filters/           # Filter logic modules
│   ├── registry/          # Registry management
│   ├── resources/         # Static resources: templates, mappings, env dependent
│   ├── tasks/             # Scheduled tasks and maintenance scripts
│   └── utils/             # Utility libraries and helpers
├── Αrchive/               # Old versions, backups, experimental code
├── main.js                # Bot entry point launcher
├── .gitignore             # Git ignore settings
```

---

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment:**

   - Place sensitive credentials in `env/secret/credentials.json`

3. **Run the bot:**

   ```bash
   node main.js
   ```

---

## Development

- **Commands** are split by feature and live in `source/commands`.  
- **Events** are organized under `source/events` with subfolders for interaction and message events.  
- **Database models** are in `source/database/models`.  
- **UI components** (buttons, menus, modals, embeds) live in `source/elements`.  
- **Utility functions** and helpers are in `source/utils`.  
- **Tasks** are scheduled background jobs in `source/tasks`.

---

## Notes

- The `Αrchive` folder contains old code versions and experimental features. Consider removing or migrating relevant code when stable.  
- For secrets, never commit `env/secret/credentials.json` to source control.

---

