#include "../projects/order_matching/order_book.hpp"
#include <cassert>
int main() {
    using portfolio::OrderBook;
    OrderBook b;
    b.add("s1", "SELL", 100, 5);
    b.add("s2", "SELL", 100, 4);
    b.add("s3", "SELL", 99, 2);
    auto t = b.add("b1", "BUY", 101, 9);
    assert(t.size() == 3);
    assert(t[0].maker == "s3" && t[0].price == 99 && t[0].quantity == 2);
    assert(t[1].maker == "s1" && t[1].quantity == 5);
    assert(t[2].maker == "s2" && t[2].quantity == 2);
    assert(b.resting_orders() == 1);
    assert(b.cancel("s2") && !b.cancel("s2"));
    assert(!b.cancel("s1") && b.resting_orders() == 0);
    bool duplicate = false;
    try { b.add("s1", "BUY", 1, 1); } catch (const std::invalid_argument&) { duplicate = true; }
    assert(duplicate);
    for (auto side : {"WRONG", ""}) {
        bool invalid = false;
        try { b.add("bad", side, 1, 1); } catch (const std::invalid_argument&) { invalid = true; }
        assert(invalid);
    }
    b.add("buy1", "BUY", 90, 3);
    b.add("buy2", "BUY", 100, 2);
    auto sell = b.add("sell", "SELL", 95, 4);
    assert(sell.size() == 1 && sell[0].maker == "buy2" && sell[0].price == 100);
    assert(b.resting_orders() == 2);
    assert(b.cancel("buy1") && b.cancel("sell"));
    bool invalid = false;
    try { b.add("z", "BUY", -1, 1); } catch (const std::invalid_argument&) { invalid = true; }
    assert(invalid);
}
