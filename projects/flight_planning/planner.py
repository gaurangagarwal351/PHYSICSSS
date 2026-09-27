"""Reference route planner on a directed, nonnegative-cost graph (no timetable)."""
import argparse
import heapq
import itertools
import json
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Flight:
    id: str
    origin: str
    destination: str
    cost: int


def route(flights, origin, destination, objective='cost'):
    if objective not in ('cost', 'flights', 'flights_then_cost'):
        raise ValueError('Unknown objective')
    if not origin or not destination:
        raise ValueError('Origin and destination are required')
    graph, ids = {}, set()
    for f in flights:
        if not f.id or f.id in ids or not f.origin or not f.destination:
            raise ValueError('Flight IDs must be unique; endpoints must be nonempty')
        if type(f.cost) is not int or f.cost < 0:
            raise ValueError('Cost must be a nonnegative integer in a fixed minor currency unit')
        ids.add(f.id)
        graph.setdefault(f.origin, []).append(f)
    serial = itertools.count()
    initial = (0, 0) if objective == 'flights_then_cost' else (0,)
    best, previous = {origin: initial}, {}
    queue = [(initial, next(serial), origin)]
    while queue:
        priority, _, city = heapq.heappop(queue)
        if priority != best[city]:
            continue
        if city == destination:
            path = []
            while city != origin:
                f = previous[city]
                path.append(f)
                city = f.origin
            path.reverse()
            return {'flight_ids': [f.id for f in path], 'number_of_flights': len(path),
                    'total_cost_minor_units': sum(f.cost for f in path)}
        for f in graph.get(city, []):
            increment = ((1, f.cost) if objective == 'flights_then_cost'
                         else (f.cost,) if objective == 'cost' else (1,))
            candidate = tuple(a + b for a, b in zip(priority, increment))
            if f.destination not in best or candidate < best[f.destination]:
                best[f.destination] = candidate
                previous[f.destination] = f
                heapq.heappush(queue, (candidate, next(serial), f.destination))
    return None


if __name__ == '__main__':
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('json', type=Path)
    p.add_argument('origin')
    p.add_argument('destination')
    p.add_argument('--objective', choices=['cost', 'flights', 'flights_then_cost'], default='cost')
    a = p.parse_args()
    flights = [Flight(**row) for row in json.loads(a.json.read_text())]
    print(json.dumps(route(flights, a.origin, a.destination, a.objective), indent=2))
