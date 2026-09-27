# Aluminium-Mesh Physical Unclonable Device

**Materials fabrication · Physical authentication · Response analysis**  
Reported supervisor: **Prof. Nirat Ray, IIT Delhi**

## Project

The reported project involved fabricating a PUF device using aluminium mesh and glass through spin coating, aluminium deposition, and photolithography. It also explored an authentication protocol and random-number generation using computer vision and statistical analysis.

The materials connection is the fabrication of a physical device and interpretation of its response. The exact fabrication recipe, image-to-bit encoding, original authentication implementation, and measurements have not yet been supplied in this repository.

## Runnable artifact

[`analyze.py`](analyze.py) is a **new supporting analysis utility** for already-encoded binary responses. It does not fabricate a device, extract bits from an image, or implement the original authentication protocol.

```sh
python3 projects/aluminium_puf/analyze.py projects/aluminium_puf/data/synthetic_responses.csv
```

The bundled eight-bit responses are **synthetic teaching data**, not device measurements or cryptographic keys.

### Input

A CSV with `device,challenge,trial,response`. Each response must be a nonempty binary string of the same length. Device/challenge/trial identifiers must be unique as a tuple. Trial labels are sorted lexically, so use zero-padded labels such as `01`, `02`, `10`. The first trial per device/challenge is the reference; enrollment-quality selection is not implemented.

### Metrics

- **Uniformity:** mean fraction of one bits in the reference responses.
- **Inter-device Hamming distance:** differing-bit fraction between reference responses from distinct devices under the same challenge. All available pairs are pooled with equal weight.
- **Repeat bit-error fraction:** differing-bit fraction between a reference response and each repeat for that device/challenge.
- **Repeat reliability:** one minus the mean repeat bit-error fraction.

Missing inter-device or repeat comparisons return `null`, rather than inventing a score. Uneven sampling affects pooled averages. A large study should additionally report distributions, uncertainty, and environmental conditions.

A balanced inter-device difference is commonly assessed around 50%, rather than by assuming a larger percentage is always better. See the research paper [Uniqueness Enhancement of PUF Responses](https://www.iacr.org/archive/ches2011/69170391/69170391.pdf). These metrics do not establish resistance to modeling attacks, entropy, or cryptographic security, and this utility does not run NIST randomness tests.

## Evidence to add

Add real device images, your own fabrication notes, encoding rules, repeated responses, and environmental conditions. Record your personal contribution and explain any processing decisions. The previously reported “80% uniqueness on the NIST test” is not reproduced here because its metric and test procedure have not been established.

[All projects](../../README.md)
