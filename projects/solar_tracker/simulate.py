"""Idealized one-axis tracking model. Outputs are synthetic, not measured energy."""
import argparse
import csv
import math
import sys


def sensor_step(angle, left, right, deadband=0.04, step=1.0, limits=(0.0, 180.0)):
    values = (angle, left, right, deadband, step, *limits)
    if not all(math.isfinite(v) for v in values):
        raise ValueError('Inputs must be finite')
    low, high = limits
    if low >= high or not low <= angle <= high or min(left, right) < 0:
        raise ValueError('Invalid angle, bounds, or sensor readings')
    if deadband < 0 or step <= 0:
        raise ValueError('Invalid controller parameters')
    total = left + right
    if total == 0:
        return angle
    error = (right - left) / total
    change = step if error > deadband else -step if error < -deadband else 0
    return max(low, min(high, angle + change))


def incidence_proxy(panel_deg, sun_deg):
    """Cosine of incidence only; excludes irradiance, efficiency and motor consumption."""
    if not all(math.isfinite(v) for v in (panel_deg, sun_deg)):
        raise ValueError('Angles must be finite')
    return max(0.0, math.cos(math.radians(panel_deg - sun_deg)))


def simulate():
    angle = 90.0
    rows = []
    for i in range(121):
        sun = 30 + i
        for _ in range(12):
            # Toy sensor imbalance: positive error means sun lies to the right.
            error = math.sin(math.radians(sun - angle))
            angle = sensor_step(angle, 1 - error, 1 + error)
        rows.append({'sample': i, 'sun_deg': sun, 'tracked_deg': angle,
                     'fixed_incidence_proxy': round(incidence_proxy(90, sun), 6),
                     'tracked_incidence_proxy': round(incidence_proxy(angle, sun), 6)})
    return rows


if __name__ == '__main__':
    argparse.ArgumentParser(description=__doc__).parse_args()
    rows = simulate()
    writer = csv.DictWriter(sys.stdout, fieldnames=list(rows[0]))
    writer.writeheader()
    writer.writerows(rows)
