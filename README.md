# PHYSICSSS and project notes

I am Gaurang Agarwal, an undergraduate in Materials Engineering at IIT Delhi. This repository contains the source for [PHYSICSSS](https://gaurangagarwal351.github.io/PHYSICSSS/), a browser game I worked on, and short notes on five other projects from my CV.

| Project | What is here |
| --- | --- |
| [PHYSICSSS](projects/physicsss/README.md) | The game source is at the repository root. |
| [Aluminium-mesh PUF](projects/aluminium_puf/README.md) | A summary of the fabrication and authentication project. |
| [Sun-tracking solar panel](projects/solar_tracker/README.md) | A summary of the sensor and motor setup. |
| [Motor speed controller](projects/motor_controller/README.md) | A summary of the 555-timer circuit. |
| [Stock order matching engine](projects/order_matching/README.md) | A description of the C++ project. |
| [Flight planning](projects/flight_planning/README.md) | A description of the graph-algorithm project. |

Only PHYSICSSS has its project source here. I have not uploaded original lab records, firmware, or source files for the other projects. The notes explain what I worked on; they do not provide independent evidence for numerical performance claims.

Earlier versions of this repository included a portfolio site, synthetic data, and AI-assisted example code created after the projects. I removed those files because they were not original project artifacts. The [provenance note](docs/PROVENANCE.md) records what was removed and what remains.

To run PHYSICSSS locally, open `index.html` in a browser or serve the repository with `python3 -m http.server 8000` and visit `http://localhost:8000/`. The multiplayer feature uses Firebase and needs network access and a working database configuration.
