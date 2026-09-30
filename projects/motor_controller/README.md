# DC motor speed controller

**Project report · 555-timer pulse control**

**Evidence available:** project description. Original schematic, component values, oscilloscope traces, and speed measurements are not uploaded.

## My work

I used a 555 timer to generate pulses for controlling a 12 V, 0.5 A permanent-magnet DC motor. My project summary also lists a 2N2222 transistor and a diode in the power circuit. It does not preserve the circuit diagram or component values.

## Engineering question

How can a pulsed electrical supply vary the speed of a small permanent-magnet DC motor? This project investigated that question with a timer-based pulse circuit.

## Operating principle

A 555 timer can generate a repeating output in astable mode. Its resistor-capacitor network sets the timing; the [Texas Instruments 555 documentation](https://www.ti.com/product/NE555) explains the mode and its external components. In a pulsed motor controller, the fraction of each period for which the motor is powered is the duty cycle. Changing that fraction can change the motor's average applied voltage and operating speed under a given load.

The original schematic is unavailable, so the exact 555 configuration, transistor connection, diode placement, pulse frequency, and component ratings cannot be reconstructed from the summary alone. This page is not a build schematic.

## How performance could be checked

A useful test would record pulse frequency and duty cycle on an oscilloscope, motor supply voltage/current, and motor speed at several settings. The load and measurement method would need to remain fixed. Plotting speed against duty cycle would show the usable control range; recording current would help explain heating and load effects. These are suggested measurements, not results claimed for the original project.

## Evidence to add

- The original labelled circuit diagram and resistor/capacitor values.
- Photographs of the breadboard or PCB with component markings visible.
- Oscilloscope captures and a speed-versus-duty-cycle table.
- A note on how speed was measured and what mechanical load was used.

**Background reading:** [Texas Instruments NE555 documentation](https://www.ti.com/product/NE555) · [NE555 datasheet](https://www.ti.com/lit/ds/symlink/ne555.pdf)

[Back to project index](../../README.md)
