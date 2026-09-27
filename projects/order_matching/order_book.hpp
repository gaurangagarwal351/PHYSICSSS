#pragma once
#include <algorithm>
#include <iterator>
#include <cstdint>
#include <functional>
#include <list>
#include <map>
#include <stdexcept>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <vector>

namespace portfolio {
using Amount = std::int64_t;
struct Order { std::string id; Amount price, quantity; };
struct Trade { std::string maker, taker; Amount price, quantity; };
class OrderBook {
    using Queue = std::list<Order>;
    std::map<Amount, Queue, std::greater<Amount>> bids;
    std::map<Amount, Queue> asks;
    struct Location { bool buy; Amount price; Queue::iterator order; };
    std::unordered_map<std::string, Location> active;
    std::unordered_set<std::string> seen;

    template<class Levels>
    void match(Levels& levels, bool buy, Order& incoming, std::vector<Trade>& trades) {
        while (incoming.quantity && !levels.empty()) {
            auto level = levels.begin();
            if (buy ? level->first > incoming.price : level->first < incoming.price) break;
            auto& queue = level->second;
            auto& maker = queue.front();
            Amount quantity = std::min(incoming.quantity, maker.quantity);
            trades.push_back({maker.id, incoming.id, maker.price, quantity});
            maker.quantity -= quantity;
            incoming.quantity -= quantity;
            if (!maker.quantity) {
                active.erase(maker.id);
                queue.pop_front();
            }
            if (queue.empty()) levels.erase(level);
        }
    }
    template<class Levels>
    void rest(Levels& levels, bool buy, const Order& order) {
        auto& queue = levels[order.price];
        queue.push_back(order);
        active.emplace(order.id, Location{buy, order.price, std::prev(queue.end())});
    }
    template<class Levels>
    void erase(Levels& levels, const Location& location) {
        auto level = levels.find(location.price);
        level->second.erase(location.order);
        if (level->second.empty()) levels.erase(level);
    }
public:
    OrderBook() = default;
    OrderBook(const OrderBook&) = delete;
    OrderBook& operator=(const OrderBook&) = delete;
    std::vector<Trade> add(const std::string& id, const std::string& side,
                           Amount price, Amount quantity) {
        if (id.empty() || (side != "BUY" && side != "SELL") || price <= 0 || quantity <= 0)
            throw std::invalid_argument("Expected ID, BUY/SELL, positive integer price and quantity");
        if (seen.count(id)) throw std::invalid_argument("Duplicate order ID (IDs cannot be reused)");
        seen.insert(id);
        Order incoming{id, price, quantity};
        bool buy = side == "BUY";
        std::vector<Trade> trades;
        if (buy) match(asks, buy, incoming, trades);
        else match(bids, buy, incoming, trades);
        if (incoming.quantity) {
            if (buy) rest(bids, buy, incoming);
            else rest(asks, buy, incoming);
        }
        return trades;
    }
    bool cancel(const std::string& id) {
        auto found = active.find(id);
        if (found == active.end()) return false;
        if (found->second.buy) erase(bids, found->second);
        else erase(asks, found->second);
        active.erase(found);
        return true;
    }
    std::size_t resting_orders() const { return active.size(); }
};
}
