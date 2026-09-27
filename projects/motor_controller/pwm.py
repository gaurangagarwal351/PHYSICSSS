"""Conventional 555 astable timing calculator, not a reconstruction of the original circuit."""
import argparse
import json
import math


def astable(r_a_ohm, r_b_ohm, c_farad, supply_volts=12):
    if not all(math.isfinite(x) and x > 0 for x in (r_a_ohm, r_b_ohm, c_farad, supply_volts)):
        raise ValueError('Resistances, capacitance and supply must be positive and finite')
    high = math.log(2) * (r_a_ohm + r_b_ohm) * c_farad
    low = math.log(2) * r_b_ohm * c_farad
    duty = high / (high + low)
    return {'high_seconds': high, 'low_seconds': low,
            'frequency_hz': 1 / (high + low), 'duty_fraction': duty,
            'ideal_average_switch_voltage': supply_volts * duty,
            'note': 'Ideal astable timing; does not predict RPM, torque, or validate driver ratings.'}


if __name__ == '__main__':
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--ra', type=float, default=1000, help='Ohms')
    p.add_argument('--rb', type=float, default=10000, help='Ohms')
    p.add_argument('--capacitance', type=float, default=1e-8, help='Farads')
    p.add_argument('--supply', type=float, default=12, help='Volts')
    a = p.parse_args()
    print(json.dumps(astable(a.ra, a.rb, a.capacitance, a.supply), indent=2))
