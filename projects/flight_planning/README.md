# Intelligent Flight Planning

**Python · Directed graphs · Shortest paths**

## Project and artifact status

The original CV describes minimizing flight count, cost, or both using graph algorithms. The original source was not supplied. [`planner.py`](planner.py) is a **new, AI-assisted reference implementation** prepared for the portfolio, not an ML model or a recovered original submission.

## Run

```sh
python3 projects/flight_planning/planner.py projects/flight_planning/data/synthetic_flights.json A D --objective cost
python3 projects/flight_planning/planner.py projects/flight_planning/data/synthetic_flights.json A D --objective flights
python3 projects/flight_planning/planner.py projects/flight_planning/data/synthetic_flights.json A D --objective flights_then_cost
```

For the synthetic graph, the cheapest path is `ab → bd` with cost `17000` minor units. The fewest-flights solution is `direct`, costing `50000` minor units. These are fictional routes and prices.

## Objectives

| Objective | Priority |
| --- | --- |
| `cost` | Minimize total cost |
| `flights` | Minimize number of edges; equal-flight paths may have different costs |
| `flights_then_cost` | Minimize flights first, then cost among those paths |

The implementation uses a heap-based label-setting shortest-path algorithm. Priorities are nonnegative scalar or lexicographic tuple costs. Strict improvement prevents zero-cost cycles from creating endless updates. Predecessors reconstruct the route; heap serial numbers provide deterministic tie handling for a fixed input order.

For this lazy-heap implementation on a general multigraph, time is `O((V + E) log(E + 1))`, with `O(V + E)` storage. A specialized BFS could improve the unweighted objective, but is not what this reference implementation uses.

## Inputs and limits

JSON rows contain `id`, `origin`, `destination`, `cost`. Flight IDs must be unique and costs must be nonnegative integers in one consistent minor currency unit. The graph is directed and may have parallel edges.

The planner does not model departure times, connection feasibility, visa constraints or fare availability. An unreachable destination returns `null`; identical origin and destination returns an empty path with zero cost.

Tests cover competing objectives, cycles, parallel edges, invalid weights, identity routes and unreachable destinations.

[All projects](../../README.md)
