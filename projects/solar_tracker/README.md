# Sun-tracking solar panel

**Project report · sensing and electromechanical control**

**Evidence available:** project description. Original wiring, firmware, photographs, and power measurements are not uploaded.

## Engineering question

Can a sensor-controlled mount keep a photovoltaic panel oriented toward brighter sunlight? The recorded project used photoresistors, a microcontroller, and motors to adjust panel position. It was a controls and instrumentation project; the photovoltaic material itself was not synthesised or characterised.

## System concept

Photoresistors provide light-dependent signals. Comparing signals from differently oriented sensors can indicate which direction is brighter; a controller can then command a motor to rotate the panel. The exact sensor layout, controller model, motor driver, control rule, and number of axes are not preserved in the available record, so this report does not claim a particular circuit or algorithm.

The [US Department of Energy's PV design guide](https://www.energy.gov/cmei/systems/solar-photovoltaic-system-design-basics) explains why tracking is used: moving a panel can improve its orientation to the sun, while adding mechanical complexity and maintenance needs. Those are general design considerations, not measured results from this prototype.

## Evaluating a tracker

A fair test would compare the same type of panel in tracked and fixed orientations over matched periods, with the same electrical load. It would log panel voltage and current, incident light, time, and ideally panel temperature. Energy is the integral of electrical power over time; a momentary voltage increase is not itself an efficiency result. The [DOE monitoring guide](https://www.energy.gov/cmei/femp/monitoring-platforms-solar-photovoltaic-systems) identifies electrical and environmental measurements relevant to PV performance.

The original summary mentioned a 40% improvement, but this repository has no measurement log or definition of the baseline. No quantitative performance claim is made here. Motor energy use would also matter when comparing *net* energy benefit.

## Evidence to add

- A labelled photograph and wiring diagram of the actual tracker.
- The original microcontroller program and sensor-to-motor control rule.
- Time-stamped fixed-panel and tracked-panel voltage/current data.
- The calculation used for energy gain, including uncertainty and motor consumption.

**Background reading:** [DOE solar PV system design](https://www.energy.gov/cmei/systems/solar-photovoltaic-system-design-basics) · [DOE PV monitoring](https://www.energy.gov/cmei/femp/monitoring-platforms-solar-photovoltaic-systems)

[Back to project index](../../README.md)
