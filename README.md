# PHYSICSSS and project reports

I am Gaurang Agarwal, an undergraduate in Materials Engineering at IIT Delhi. This repository contains the source for [PHYSICSSS](https://gaurangagarwal351.github.io/PHYSICSSS/), a browser game I worked on, and technical reports on five other projects from my CV.

| Project | What is here |
| --- | --- |
| [PHYSICSSS](projects/physicsss/README.md) | The game source is at the repository root. |
| [Aluminium-mesh PUF](projects/aluminium_puf/README.md) | Fabrication, authentication question, and response evaluation. |
| [Sun-tracking solar panel](projects/solar_tracker/README.md) | Sensor-controlled tracking and a fair performance comparison. |
| [Motor speed controller](projects/motor_controller/README.md) | 555-timer pulse control and measurement plan. |
| [Stock order matching engine](projects/order_matching/README.md) | Price-time matching and order-book edge cases. |
| [Flight planning](projects/flight_planning/README.md) | Graph objectives and route-validation cases. |

Only PHYSICSSS has its project source here. I have not uploaded original lab records, firmware, or source files for the other projects. Each report separates the known project scope from background reading and suggested evaluation; the reports do not provide independent evidence for numerical performance claims.

Earlier versions of this repository included a portfolio site, synthetic data, and AI-assisted example code created after the projects. I removed those files because they were not original project artifacts. The [provenance note](docs/PROVENANCE.md) records what was removed and what remains.

To run PHYSICSSS locally, open `index.html` in a browser or serve the repository with `python3 -m http.server 8000` and visit `http://localhost:8000/`. The multiplayer feature uses Firebase and needs network access and a working database configuration.
