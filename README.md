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
  services/identify.ts      Recognizer seam (mock now; Vision-ready)
  hooks/useImageCapture.ts  Camera / gallery pickers + permissions
  components/               ModeToggle, AppButton, ConfidenceBar
  screens/                  CaptureScreen, ResultScreen
```

## Connecting a real recognition API (Google Cloud Vision)

All recognition goes through `identifySpecies` in `src/services/identify.ts`.
To go live:

1. Implement a `SpeciesRecognizer` that sends the image to Google Cloud Vision
   (`labelDetection` / `webDetection`) via a backend proxy or API key.
2. Map the returned labels to entries in `src/data/species.ts`, or fetch richer
   details from a species database keyed by the label.
3. Return an `Identification` (same shape as the mock).
4. Swap the export at the bottom of the file:

   ```ts
   export const identifySpecies: SpeciesRecognizer = googleVisionRecognizer;
   ```

Nothing in the UI needs to change.

> Tip: don't ship a Vision API key inside the app. Call Vision from a small
> backend/serverless function and have the app talk to that.
