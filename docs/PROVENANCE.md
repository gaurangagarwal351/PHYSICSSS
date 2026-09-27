# Artifact provenance

This repository is intended to make the boundary between project descriptions and inspectable evidence clear.

| Artifact | Origin | What it establishes |
| --- | --- | --- |
| Root game HTML and JavaScript | Existing repository, baseline commit `8277a10` | Inspectable JavaScript/Canvas game implementation |
| Aluminium-mesh, solar-tracker and motor-controller descriptions | Project summaries provided by Gaurang | Reported project scope and supervisors; not independent verification of experimental results |
| PUF analyzer, solar model and 555 calculator | Newly prepared with AI assistance | Runnable supporting examples and tested numerical logic |
| Order book and route planner | Newly prepared with AI assistance from CV descriptions | Reference implementations; not original course submissions |
| CSV/JSON examples | Manually constructed synthetic data | Reproducibility and edge-case demonstration only |
| Portfolio website and documentation | Newly prepared with AI assistance | Organization and explanation of the artifacts above |

No laboratory photos, microscopy, fabrication recipes, original hardware firmware, original order-book/flight-planner code or experimental datasets were supplied. No substitute results are presented as measurements. No ML project is claimed solely from a machine-learning course certificate or the use of computer vision.

## CV consistency notes

- PHYSICSSS in this repository uses JavaScript, not Python. Update its language in future CV versions unless a separate original Python implementation can be supplied.
- Describe collision handling as AABB platform collisions; this is not a general rigid-body engine.
- The new order-book cancellation is not strictly `O(1)` overall.
- The PUF “80% uniqueness on the NIST test” and solar “40% efficiency improvement” statements require original metric definitions and evidence before reuse.

Do not label the new reference implementations as the historical project source. When original materials become available, preserve their origin and explain how they relate to these examples.
