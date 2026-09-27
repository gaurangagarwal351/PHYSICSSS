# Stock Order Matching Engine

**C++17 · Price-time priority · Data structures**

## Project and artifact status

The original CV describes a C++ limit order book with placements, cancellations and linked-list-based order management. The original submission was not supplied. The implementation in this folder is a **new, AI-assisted reference implementation** prepared for the portfolio.

It demonstrates deterministic order processing. It is supplementary software work, not a materials experiment or an ML model.

## Build and run

```sh
mkdir -p build
c++ -std=c++17 -Wall -Wextra -pedantic projects/order_matching/main.cpp -o build/order_book
./build/order_book < projects/order_matching/example_orders.txt
```

Expected sample output:

```text
ACCEPTED s1
ACCEPTED s2
ACCEPTED b1
TRADE s1 b1 100 5
TRADE s2 b1 100 2
RESTING 1
CANCELLED s2
RESTING 0
```

## Design

- Ordered bid/ask maps select the best available crossing price.
- A doubly linked list at each price level preserves FIFO arrival order.
- An ID index points to resting orders for cancellation.
- Matching executes at the resting maker's price and supports partial fills.
- Integer price ticks and quantities avoid floating-point price comparisons.
- Invalid orders are rejected before registration. IDs cannot be reused after cancellation or fill.

Commands: `ADD id BUY|SELL price quantity`, `CANCEL id`, `COUNT`. All quantities and prices must be positive signed 64-bit integers. Unknown cancellations print `NOT_FOUND`. Input is processed sequentially.

## Complexity and limits

If `L` is the number of price levels, lookup or creation uses `O(log L)`. Removing a located list node is constant time, but this implementation's overall cancellation also looks up its price level (`O(log L)`). Matching work additionally scales with the number of fills. Hash-index operations have expected constant lookup time, not a worst-case guarantee.

No latency benchmarks, high-frequency production suitability or the original CV's strict constant-time total-cancellation claim are asserted. There is no persistence, networking, concurrency, market-order interface, tick-size enforcement or exchange-specific matching policy. The historical ID set grows for the life of the process.

## Tests

`tests/order_book_test.cpp` checks price priority, FIFO, partial fills, maker prices, cancellation, duplicate IDs, invalid inputs and both trade directions. Run `bash scripts/check.sh` from the repository root.

[All projects](../../README.md)
