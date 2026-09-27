# Gaurang Agarwal · Research & Engineering Portfolio

**Materials Engineering · Indian Institute of Technology Delhi**

Materials fabrication, physical systems, and computational tools. This repository brings together six projects, with the aluminium-mesh PUF first for materials research readers.

**[Browse the portfolio](https://gaurangagarwal351.github.io/PHYSICSSS/portfolio/)** · **[Play PHYSICSSS](https://gaurangagarwal351.github.io/PHYSICSSS/)** · **[Email](mailto:ms1251072@mse.iitd.ac.in)**

> The portfolio URL is served at `/portfolio/` when GitHub Pages publishes this repository's root. Project pages below work directly on GitHub regardless of Pages settings.

## Project index

| Project | Focus | What you can inspect here |
| --- | --- | --- |
| [Aluminium-mesh PUF](projects/aluminium_puf/README.md) | Fabrication, physical authentication | Fabrication summary; new binary-response analysis utility and labelled synthetic data |
| [Sun-tracking solar panels](projects/solar_tracker/README.md) | Sensors, feedback, solar instrumentation | Project summary; new one-axis feedback model |
| [Motor speed controller](projects/motor_controller/README.md) | 555-timer timing, motor electronics | Project summary; new astable timing calculator |
| [PHYSICSSS](projects/physicsss/README.md) | Interactive physics, JavaScript, Canvas | Existing game source and implementation notes |
| [Stock order matching engine](projects/order_matching/README.md) | C++, data structures, deterministic systems | New reference implementation of price-time matching, cancellation, and partial fills |
| [Intelligent flight planning](projects/flight_planning/README.md) | Python, graph algorithms | New reference implementation with three routing objectives |

## Start with the evidence

The original PHYSICSSS game was already present in this repository. The three hardware-project descriptions come from my project summaries; their original lab records, images, schematics, and firmware are not included yet. The order-book and route-planner code here are newly written reference implementations of the described projects, not recovered original submissions.

The supporting utilities were prepared with AI assistance for this portfolio. Their tests exercise the new implementations. Example data are synthetic and do not demonstrate experimental performance. See [artifact provenance](docs/PROVENANCE.md) for the distinction between reported project work and supplied artifacts.

## Run locally

Python 3.10+ and a C++17 compiler are sufficient. The Python tools use only the standard library.

```sh
# From the repository root:
python3 -m http.server 8000
# Open http://localhost:8000/portfolio/ for the portfolio.
# Open http://localhost:8000/ for the original game.
```

Run the numerical examples, Python tests, C++ tests, and link checks:

```sh
bash scripts/check.sh
# Optional UI logic check if Node.js is installed:
node tests/portfolio_test.js
```

Individual commands and assumptions are documented in each project's README. Outputs written by the check script go to `build/` and are excluded from version control.

## Repository map

```text
index.html                   Existing PHYSICSSS game entry point
input.js / levels.js / ...   Existing companion game files
portfolio/                   Responsive research portfolio landing page
projects/                    Six project pages and supporting implementations
docs/                        Evidence guide and artifact provenance
scripts/                     Reproducibility and local-link checks
tests/                       Python and C++ correctness tests
.github/workflows/verify.yml Automated checks on pushes and pull requests
```

## Research context

My most directly relevant materials experience is aluminium-mesh/glass device fabrication using spin coating, aluminium deposition, and photolithography. I am interested in building on this experience through research involving materials processing, device fabrication, and quantitative analysis.

Contact: **Gaurang Agarwal** · [ms1251072@mse.iitd.ac.in](mailto:ms1251072@mse.iitd.ac.in)

The existing game uses externally hosted Firebase libraries and a configured Realtime Database for multiplayer. The portfolio and command-line examples work independently of that service.
