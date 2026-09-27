#include "order_book.hpp"
#include <iostream>
#include <sstream>

int main() {
    portfolio::OrderBook book;
    std::string line;
    while (std::getline(std::cin, line)) {
        if (line.empty() || line[0] == '#') continue;
        std::istringstream input(line);
        std::string command, id, side, extra;
        portfolio::Amount price, quantity;
        input >> command;
        try {
            if (command == "ADD") {
                if (!(input >> id >> side >> price >> quantity) || (input >> extra))
                    throw std::invalid_argument("Usage: ADD id BUY|SELL price quantity");
                auto trades = book.add(id, side, price, quantity);
                std::cout << "ACCEPTED " << id << '\n';
                for (const auto& t : trades)
                    std::cout << "TRADE " << t.maker << ' ' << t.taker << ' '
                              << t.price << ' ' << t.quantity << '\n';
            } else if (command == "CANCEL") {
                if (!(input >> id) || (input >> extra))
                    throw std::invalid_argument("Usage: CANCEL id");
                std::cout << (book.cancel(id) ? "CANCELLED " : "NOT_FOUND ") << id << '\n';
            } else if (command == "COUNT" && !(input >> extra)) {
                std::cout << "RESTING " << book.resting_orders() << '\n';
            } else throw std::invalid_argument("Unknown or malformed command");
        } catch (const std::invalid_argument& e) {
            std::cout << "ERROR " << e.what() << '\n';
        }
    }
}
