# Sun-Tracking Solar Panels

**Solar instrumentation · Sensor feedback · Control**  
Reported supervisor: **Prof. Kusum Meena, IIT Delhi**

## Project

The reported project designed and developed a solar-tracking panel system using photoresistors, motors, and a microcontroller to adjust panel orientation with sunlight. This is instrumentation/control experience; it is not evidence of photovoltaic material synthesis or conversion-efficiency characterization.

## Runnable artifact

[`simulate.py`](simulate.py) is a **new idealized one-axis model**, not the original firmware or a validated model of the original apparatus.

```sh
mkdir -p build
python3 projects/solar_tracker/simulate.py > build/synthetic_tracking.csv
```

At each sample, a toy sensor pair generates a normalized left/right imbalance. The controller moves through bounded one-degree steps until the imbalance is within a deadband (or the fixed number of updates ends). This illustrates feedback direction, saturation and deadband behavior.

The CSV contains sun angle, panel angle and a cosine-of-incidence proxy for fixed and tracked orientations. The sun trajectory and sensor law are synthetic. Irradiance, weather, cell temperature, electrical load, mechanical dynamics, hysteresis and motor consumption are excluded. The proxy is **not measured energy or panel efficiency**.

## Evidence to add

- Annotated photographs and the actual sensor/motor configuration.
- Original firmware, wiring diagram and component specifications.
- Synchronized fixed-panel and tracking-panel voltage/current measurements, conditions and sampling interval.
- An explicit definition of any improvement claim, including the baseline and motor energy consumption.

The previously reported 40% improvement is not asserted by this model.

[All projects](../../README.md)
