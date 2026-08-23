# Family Play

Family Play is an Expo Router app for screen-free family games. It includes a browsable game library, filters, favorites, recently played games, and custom games stored locally on device.

## Development

```bash
npm install
npm run start
```

Other useful commands:

```bash
npm run lint
npx --no-install tsc --noEmit
```

## Project Structure

- `app/` contains Expo Router routes and screens.
- `components/` contains shared UI components.
- `data/games.json` contains the built-in game library.
- `theme/` contains shared colors, typography, spacing, radii, and shadows.
- `utils/` contains filtering, storage, favorites, recents, and custom-game helpers.
