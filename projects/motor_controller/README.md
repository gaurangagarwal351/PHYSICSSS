# Motor Speed Controller

**555 timer · Pulsed supply · Motor electronics**  
Reported supervisor: **Prof. Gourab Ghatak, IIT Delhi**

## Project

The reported circuit controlled a 12 V, 0.5 A permanent-magnet DC motor with pulses from a 555 timer, using a 2N2222 transistor and a diode in the power circuit. The original schematic, component values and measurement records have not been supplied.

## Runnable artifact

[`pwm.py`](pwm.py) is a **new conventional 555 astable timing calculator**. This topology is an illustrative choice, not a claim about the original circuit.

```sh
python3 projects/motor_controller/pwm.py --ra 1000 --rb 10000 --capacitance 1e-8 --supply 12
```

For positive resistances `RA`, `RB` and capacitance `C`:

```text
t_high = ln(2) × (RA + RB) × C
t_low  = ln(2) × RB × C
f      = 1 / (t_high + t_low)
duty   = t_high / (t_high + t_low)
```

These ideal relations follow the conventional astable configuration described in the [Texas Instruments xx555 datasheet](https://www.ti.com/lit/ds/symlink/ne555.pdf). They assume the nominal one-third and two-thirds supply thresholds. This basic topology has a high-state duty above 50%; alternative diode-steered circuits require different equations.

The displayed supply × duty is an **ideal switched-voltage average**, not predicted motor speed. The tool does not select a transistor or validate current limits, stall current, diode ratings, thermal behavior or wiring.

## Evidence to add

Original circuit diagram and values, oscilloscope captures of pulse timing, and measured speed/current versus duty cycle. Hardware component selection must be based on the actual schematic and device ratings; the reported parts list is not a construction guide.

[All projects](../../README.md)
