# Flight route planning

**Project report · graph search and route objectives**

**Evidence available:** project description. Original program, flight data, and test cases are not uploaded.

## My work

I worked on a Python route-planning project comparing possible routes by number of flights and total cost. My supplied CV describes BFS traversal and a modified Dijkstra algorithm. The original program and dataset are not available here, so implementation and performance claims cannot be independently checked from this repository.

## Problem

Flight connections can be represented as a graph: airports are vertices, and available flights are edges. The CV names the algorithm families but does not specify the graph representation, data source, or all route constraints.

## Why the objective matters

“Fewest flights” and “lowest cost” are different questions. If each flight contributes one edge, breadth-first search can find a route with the fewest edges in an unweighted graph. If each flight has a non-negative fare, a weighted shortest-path method such as Dijkstra's algorithm can find a minimum-total-cost route. A route with fewer connections can still cost more. [MIT's algorithms notes](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2008/resources/lecture-notes/) provide background for the BFS/Dijkstra approach described in the CV; the specific modifications need the original source to establish.

A practical itinerary planner also needs constraints that a simple graph leaves out: departure and arrival times, minimum connection time, airport changes, fare availability, and ties between routes. None of those features is claimed here because the original specification is unavailable.

## How a route planner could be checked

A small test graph should include a direct expensive flight, a cheaper two-leg route, an unreachable destination, and two equal-cost alternatives. The expected answer should be stated separately for each objective. This is a proposed validation set, not a claim that these tests were run on the original project.

## Evidence to add

- Original source code, graph input format, and one representative dataset.
- The exact route objective and tie-breaking rule.
- Reproducible test cases for connected, disconnected, and equal-cost routes.
- A note on whether schedules or connection constraints were included.

The original submission is not available in this repository. The [provenance note](../../docs/PROVENANCE.md) explains the repository history.

**Background reading:** [MIT Introduction to Algorithms lecture notes](https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2008/resources/lecture-notes/)

[Back to project index](../../README.md)
