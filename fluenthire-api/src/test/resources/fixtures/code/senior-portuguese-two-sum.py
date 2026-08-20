from typing import List, Optional, Tuple


def two_sum(nums: List[int], target: int) -> Optional[Tuple[int, int]]:
    """Find two indices whose values sum to target. O(n) time, O(n) space."""
    if not nums or len(nums) < 2:
        return None

    complement_map: dict[int, int] = {}
    for idx, value in enumerate(nums):
        complement = target - value
        if complement in complement_map:
            return (complement_map[complement], idx)
        complement_map[value] = idx

    return None
