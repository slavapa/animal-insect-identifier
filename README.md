# Species Identifier

A React Native (Expo SDK 57) app for **Android and iOS** that lets you photograph or
upload an image of an **animal** or **insect** and see rich information about the
identified species.

Recognition is currently **mocked** with a local catalog so the full flow works
end-to-end. The recognition backend is isolated behind a single function so a real
service (e.g. Google Cloud Vision) can be dropped in without touching the UI.

## Features

- Animal / Insect mode toggle
- Capture from **camera** or pick from the **gallery** (`expo-image-picker`)
- Loading state while "identifying"
- Result screen with confidence, taxonomy facts, conservation status, a fun fact,
  and alternative matches

## Requirements

- Node.js >= 22.13
- The Expo Go app (SDK 57) on your device, or an Android/iOS emulator

## Run

```sh
npm install
npm run android   # or: npm run ios / npm run web / npm start
```

Then open the app in Expo Go (scan the QR code) or on an emulator.

## Project structure

```
App.tsx                     Root screen-flow state (capture <-> result)
src/
  types.ts                  Shared types (Mode, SpeciesInfo, Identification)
  theme.ts                  Colors, spacing, per-mode accent themes
  data/species.ts           Offline species catalog used by the mock recognizer
  services/identify.ts      Recognizer seam; picks Gemini or the mock
  services/gemini.ts        Google Gemini recognizer (multimodal + JSON schema)
  hooks/useImageCapture.ts  Camera / gallery pickers + permissions (returns base64)
  components/               ModeToggle, AppButton, ConfidenceBar
  screens/                  CaptureScreen, ResultScreen
```

## Recognition (Google Gemini)

Real identification is powered by the **Google Gemini API**. The image is sent
(as base64) with a mode-specific prompt, and Gemini returns structured JSON that
is mapped onto the app's `Identification` type in `src/services/gemini.ts`.

`identifySpecies` in `src/services/identify.ts` automatically uses Gemini when an
API key is configured, and falls back to the offline mock catalog otherwise — so
the app always runs, even with no key.

### Setup

1. Get a Gemini API key from https://aistudio.google.com/apikey.
2. Copy `.env.example` to `.env` and set your key:

   ```sh
   EXPO_PUBLIC_GEMINI_API_KEY=your-gemini-api-key-here
   ```

3. Restart the dev server (env vars are read at start): `npm start -- --clear`.

`.env` is gitignored — never commit your key.

### ⚠️ Security

`EXPO_PUBLIC_*` variables are **embedded in the app bundle**, so a key shipped
this way can be extracted from a built app. This is fine for local development
and learning, but for a production/public app you should:

- Call Gemini from a small backend/serverless proxy and have the app talk to that, and/or
- Restrict the key (API + application restrictions) in Google Cloud, and rotate
  any key that has been exposed.
