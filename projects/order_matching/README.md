# Stock order matching engine

**Project report · C++ data structures and event processing**

**Evidence available:** project description. Original C++ source, tests, and benchmark results are not uploaded.

## My work

I worked on a C++ limit-order-book project covering order placement, cancellation, and matching by price and arrival time. The original program is not available in this repository, so this report does not claim a specific data structure, input format, or measured throughput.

## Problem

A limit-order book stores buy and sell instructions and decides which orders can trade when a new order arrives. The available summary does not preserve the exact exchange-rule choices.

## Matching rule in context

Under **price-time priority**, a better price is considered first; among orders at the same price, the earlier order has priority. For example, a sell order at 101 is eligible before a sell order at 102, and two sell orders at 101 are considered in arrival order. This is an illustrative explanation, not a trace from the original program. [Nasdaq's equities overview](https://www.nasdaq.com/products/north-american-markets/nasdaq-stock-market) describes price-time priority for displayed limit orders. The project summary does not establish which real exchange's full rules it followed.

An implementation needs to maintain the best available bid and ask, preserve arrival order within a price level, reduce remaining quantities after partial fills, and remove a cancelled order so that it cannot trade later. Repeated order IDs, invalid quantities, and attempts to cancel unknown IDs are useful edge cases to specify and test. These are design questions, not claims about undocumented features of the original code.

## Evidence to add

- The original C++ source and build command.
- A documented input/output format and original test cases.
- A trace showing placement, a partial fill, and a cancellation.
- Any performance results with hardware, compiler, workload, and timing method stated.

The original submission is not available in this repository. The [provenance note](../../docs/PROVENANCE.md) explains the repository history.

**Background reading:** [Nasdaq stock-market order priority](https://www.nasdaq.com/products/north-american-markets/nasdaq-stock-market)

[Back to project index](../../README.md)
