# Aluminium-mesh physical unclonable function

**Project report · materials fabrication and image-based authentication**

**Evidence available:** project description. Original device images, process logs, response data, and analysis code are not uploaded.

## Research question

Can fabrication variation in an aluminium-mesh structure on glass produce a repeatable optical pattern that distinguishes one device from another? A physical unclonable function (PUF) uses a physical response as a device identity. This project combined an aluminium-mesh/glass device with an image-based authentication protocol and explored random-bit generation.

## Work described in the project record

The project summary records spin coating, aluminium deposition, and photolithography as fabrication steps. It also records image analysis of the device response and statistical analysis of randomness. The substrate preparation, coating recipe, mask design, deposition conditions, imaging geometry, and software pipeline are not documented in this repository.

## How the device would be evaluated

The two important comparisons are **repeatability** (images of the *same* device under repeated measurements) and **uniqueness** (responses from *different* devices). An analysis would first fix illumination, camera distance, exposure, image registration, and bit extraction. It would then report within-device and between-device response distances separately. Inter-device Hamming distance is a common uniqueness metric, but correlation between response bits can make a single number misleading; this [PUF metrics paper](https://eprint.iacr.org/2016/320) explains why.

Randomness testing asks a different question from device uniqueness. The [NIST SP 800-22 test suite](https://csrc.nist.gov/pubs/sp/800/22/r1/upd1/final) examines statistical properties of bit sequences; passing tests alone does not establish unclonability or cryptographic security. The earlier “80% uniqueness on the NIST test” wording is therefore omitted: the raw responses and exact metric would be needed to interpret it.

## Evidence to add

- Device and fabrication photographs, plus a process log and material stack.
- Repeated images per device with documented lighting and camera settings.
- Image-to-bit conversion code and any filtering or alignment steps.
- Separate repeatability, uniqueness, and randomness results, including sample counts.

**Background reading:** [PUF uniqueness metrics](https://eprint.iacr.org/2016/320) · [NIST statistical test suite](https://csrc.nist.gov/pubs/sp/800/22/r1/upd1/final)

[Back to project index](../../README.md)
