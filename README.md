# KEAM Compass

KEAM Compass is a single-page React application for estimating a KEAM candidate's standardized score, expected engineering rank, and likely college options using client-side calculations.

The app is built for quick exploration, not as an official result system. It combines a normalized entrance score calculator, board-mark standardization, rank prediction ranges, and a college predictor based on published trend-style cutoff data.

## Features

- KEAM entrance score calculator with direct-score and advanced answer-entry modes
- Class 12 board mark standardization using subject-wise topper-based normalization
- Final index mark calculation out of 600
- Expected rank estimation using mark-to-rank bands configured in the app
- College prediction cards based on closing-rank style cutoffs
- Responsive single-page React UI with reusable components

## How It Works

The predictor combines two components:

- Normalized Entrance Score: converted to a score out of 300
- Standardized Plus Two Marks: standardized subject scores combined to a score out of 300

These are added together to produce the final index mark out of 600.

The app then maps that index mark to an expected rank range using the configured cutoff table inside the project. College suggestions are derived from the estimated rank and the included closing-rank dataset.

## Tech Stack

- React
- Vite
- Tailwind CSS
- Plain client-side JavaScript

## Project Structure

```text
src/
  components/
    common/
    layout/
    steps/
  data/
  utils/
```

- `src/components/steps` contains the three main app stages
- `src/data` contains rank-band and college cutoff data
- `src/utils/calculations.js` contains the scoring and prediction logic

## Local Development

Requirements:

- Node.js 18+ recommended
- npm

Run locally:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Disclaimer

This project is an unofficial estimator.

Rank predictions and admission suggestions are based on trend data, configured cutoffs, and approximation logic inside the app. Actual KEAM ranks and allotments depend on the final normalization process, candidate volume, reservation rules, difficulty variation, and official CEE Kerala procedures.

Always verify official information through `https://cee.kerala.gov.in/`.

## Copyright and Attribution

This project is open source and may be used, modified, forked, and redistributed under the terms of the MIT License.

Attribution requested in the project plan:

- `kubo` - `https://github.com/Kubodev`

If you publish a modified version, keep the original attribution and license notice in place.

## License

This repository is licensed under the MIT License.

See [LICENSE](./LICENSE) for the full text.
