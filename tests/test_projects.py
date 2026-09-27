import unittest
from projects.aluminium_puf.analyze import analyze, hamming
from projects.solar_tracker.simulate import sensor_step, incidence_proxy, simulate
from projects.motor_controller.pwm import astable
from projects.flight_planning.planner import Flight, route


class PUFTests(unittest.TestCase):
    def test_known_distances(self):
        self.assertEqual(hamming('0011', '0101'), 0.5)
        self.assertEqual(hamming('0011', '1100'), 1)

    def test_invalid_bits(self):
        for a, b in [('', ''), ('1', '00'), ('12', '11')]:
            with self.assertRaises(ValueError): hamming(a, b)

    def test_metrics_and_order_independence(self):
        rows = [dict(device=d, challenge='c', trial=t, response=r) for d, t, r in
                [('a', '01', '0011'), ('a', '02', '0010'), ('b', '01', '0101')]]
        result = analyze(rows)
        self.assertEqual(result['mean_inter_device_hamming_fraction'], .5)
        self.assertEqual(result['repeat_reliability_fraction'], .75)
        self.assertEqual(result, analyze(list(reversed(rows))))
        with self.assertRaises(ValueError): analyze(rows + [rows[0]])

    def test_challenge_isolation(self):
        rows = [dict(device=d, challenge=c, trial='01', response=r)
                for d, c, r in [('a', 'x', '00'), ('b', 'y', '11')]]
        result = analyze(rows)
        self.assertIsNone(result['mean_inter_device_hamming_fraction'])
        self.assertIsNone(result['repeat_reliability_fraction'])

    def test_invalid_dataset(self):
        with self.assertRaises(ValueError): analyze([])
        with self.assertRaises(ValueError):
            analyze([dict(device='', challenge='a', trial='1', response='01')])


class SolarTests(unittest.TestCase):
    def test_feedback_and_limits(self):
        self.assertEqual(sensor_step(90, 1, 2), 91)
        self.assertEqual(sensor_step(90, 2, 1), 89)
        self.assertEqual(sensor_step(180, 1, 2), 180)
        self.assertEqual(sensor_step(0, 2, 1), 0)
        self.assertEqual(sensor_step(90, 1, 1.01), 90)
        self.assertEqual(sensor_step(90, 0, 0), 90)

    def test_model(self):
        self.assertEqual(incidence_proxy(90, 90), 1)
        self.assertEqual(incidence_proxy(0, 180), 0)
        rows = simulate()
        self.assertEqual(len(rows), 121)
        self.assertTrue(all(0 <= r['tracked_deg'] <= 180 for r in rows))
        self.assertTrue(all(0 <= r['tracked_incidence_proxy'] <= 1 for r in rows))

    def test_invalid_input(self):
        with self.assertRaises(ValueError): sensor_step(90, -1, 0)
        with self.assertRaises(ValueError): sensor_step(float('nan'), 1, 1)


class MotorTests(unittest.TestCase):
    def test_timing(self):
        r = astable(1000, 1000, 1e-6)
        self.assertAlmostEqual(r['duty_fraction'], 2/3)
        self.assertAlmostEqual(r['frequency_hz'], 480.898346963, places=6)
        self.assertAlmostEqual(r['ideal_average_switch_voltage'], 8)
        self.assertAlmostEqual(astable(1000, 1000, 2e-6)['frequency_hz'], r['frequency_hz']/2)

    def test_validation(self):
        for x in [0, -1, float('nan'), float('inf')]:
            with self.assertRaises(ValueError): astable(x, 1, 1)


class FlightTests(unittest.TestCase):
    def setUp(self):
        self.f = [Flight('direct', 'A', 'D', 50), Flight('ab', 'A', 'B', 8),
                  Flight('bd', 'B', 'D', 9), Flight('ac', 'A', 'C', 10),
                  Flight('cd', 'C', 'D', 11)]

    def test_objectives(self):
        self.assertEqual(route(self.f, 'A', 'D')['flight_ids'], ['ab', 'bd'])
        self.assertEqual(route(self.f, 'A', 'D', 'flights')['flight_ids'], ['direct'])
        self.assertEqual(route(self.f[1:], 'A', 'D', 'flights_then_cost')['flight_ids'], ['ab', 'bd'])

    def test_unreachable_and_identity(self):
        self.assertIsNone(route(self.f, 'D', 'A'))
        self.assertEqual(route(self.f, 'A', 'A')['total_cost_minor_units'], 0)

    def test_cycles_and_parallel_edges(self):
        f = [Flight('ab1', 'A', 'B', 9), Flight('ab2', 'A', 'B', 1),
             Flight('ba', 'B', 'A', 0), Flight('bd', 'B', 'D', 1)]
        self.assertEqual(route(f, 'A', 'D')['flight_ids'], ['ab2', 'bd'])

    def test_invalid(self):
        for f in [self.f + [self.f[0]], [Flight('x', 'A', 'B', -1)], [Flight('x', 'A', 'B', .5)]]:
            with self.assertRaises(ValueError): route(f, 'A', 'D')
        with self.assertRaises(ValueError): route(self.f, 'A', 'D', 'unknown')


if __name__ == '__main__':
    unittest.main()
