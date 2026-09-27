# PHYSICSSS

**JavaScript · HTML5 Canvas · Interactive simulation**

[Play the game](https://gaurangagarwal351.github.io/PHYSICSSS/) · [Read the game source](../../index.html)

## Existing implementation

PHYSICSSS is a 2D platform game with varying gravity and friction, a ten-level story mode, avatars, synthesized audio, touch controls and Firebase-backed multiplayer. The existing application remains at the repository root to preserve its entry point.

The code currently in this repository is **JavaScript and HTML5 Canvas**, not Python. Its collision system is based on axis-aligned rectangular overlap and response; it is not a general scientific rigid-body solver.

## Inspect the mechanics

In [`index.html`](../../index.html), search for:

| Symbol | Role |
| --- | --- |
| `MODES` | Gravity, friction and jump parameters |
| `resolveAABB` | Platform-overlap resolution and velocity adjustment |
| `update` | Input, acceleration, damping, limits and three collision substeps |
| `resizeCanvas` | Fixed internal canvas dimensions and responsive display |
| `createRoom` / `attachRoomListener` | Multiplayer room lifecycle |

The game updates velocity and position in frame-based units while several timers use elapsed milliseconds. Consequently, the mechanics should not be described as calibrated physical measurements or frame-rate-independent numerical integration.

## Run

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/`. Firebase script loading requires internet access. Multiplayer depends on the external project's configuration and database rules; availability is not guaranteed by the portfolio tests.

The root `input.js`, `levels.js`, `powerups.js`, `renderer.js` and alternate HTML file are existing companion artifacts. The current root entry point embeds its own main game logic. They have not been rearranged or represented as newly authored code.

## Useful research-facing extension

A future extension could separate the update loop, establish a fixed timestep and compare known trajectories across frame rates. Such validation is not claimed as completed here.

[All projects](../../README.md)
