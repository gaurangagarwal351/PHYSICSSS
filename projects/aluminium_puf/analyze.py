"""Analyze binary PUF responses; input rows are device,challenge,trial,response.

This is a new analysis utility, not the original fabrication or imaging pipeline.
No NIST test suite is implemented here.
"""
import argparse
import csv
import json
from collections import defaultdict
from itertools import combinations
from statistics import mean
from pathlib import Path


def hamming(a, b):
    if not a or len(a) != len(b) or set(a + b) - {'0', '1'}:
        raise ValueError('Responses must be nonempty binary strings of equal length')
    return sum(x != y for x, y in zip(a, b)) / len(a)


def analyze(rows):
    groups = defaultdict(dict)
    length = None
    for row in rows:
        device, challenge, trial = (row[k].strip() for k in ('device', 'challenge', 'trial'))
        bits = row['response'].strip()
        if not all((device, challenge, trial)):
            raise ValueError('Device, challenge, and trial must be nonempty')
        hamming(bits, bits)
        if length is not None and len(bits) != length:
            raise ValueError('All responses must have the same bit length')
        length = len(bits)
        key = (device, challenge)
        if trial in groups[key]:
            raise ValueError('Duplicate device/challenge/trial')
        groups[key][trial] = bits
    if not groups:
        raise ValueError('No responses supplied')
    # Choose trial labels in lexical order, independently of CSV row order.
    refs = {key: trials[sorted(trials)[0]] for key, trials in groups.items()}
    by_challenge = defaultdict(list)
    intra = []
    for key, trials in groups.items():
        by_challenge[key[1]].append(refs[key])
        intra.extend(hamming(refs[key], trials[t]) for t in sorted(trials)[1:])
    inter = [hamming(a, b) for refs_c in by_challenge.values()
             for a, b in combinations(refs_c, 2)]
    return {
        'bit_length': length,
        'device_challenge_groups': len(groups),
        'reference_policy': 'lexicographically first trial for each device/challenge',
        'reference_uniformity_fraction': mean(bits.count('1') / length for bits in refs.values()),
        'inter_device_pairs_same_challenge': len(inter),
        'mean_inter_device_hamming_fraction': mean(inter) if inter else None,
        'repeat_comparisons': len(intra),
        'mean_repeat_bit_error_fraction': mean(intra) if intra else None,
        'repeat_reliability_fraction': 1 - mean(intra) if intra else None,
        'note': 'Descriptive metrics only; not a security certification or NIST test.'
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('csv', type=Path)
    args = parser.parse_args()
    with args.csv.open(newline='') as handle:
        result = analyze(csv.DictReader(handle))
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    main()
