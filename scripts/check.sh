#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
python3 -m unittest discover -s tests -v
python3 scripts/check_links.py
mkdir -p build
"${CXX:-c++}" -std=c++17 -Wall -Wextra -Werror -pedantic tests/order_book_test.cpp -o build/order_book_test
./build/order_book_test
"${CXX:-c++}" -std=c++17 -Wall -Wextra -Werror -pedantic projects/order_matching/main.cpp -o build/order_book
./build/order_book < projects/order_matching/example_orders.txt
python3 projects/aluminium_puf/analyze.py projects/aluminium_puf/data/synthetic_responses.csv
python3 projects/motor_controller/pwm.py
python3 projects/solar_tracker/simulate.py > build/synthetic_tracking.csv
python3 projects/flight_planning/planner.py projects/flight_planning/data/synthetic_flights.json A D
