import { CheatSheet } from "./cheatsheet-manager";
import { Problem } from "./problem-manager"

export const mockProblems: Problem[] = [
  {
    id: "1",
    number: 1,
    title: "Two Sum",
    link: "https://leetcode.com/problems/two-sum/",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    status: "Solved",
    dateSolved: "2024-01-15",
    approaches: [
      {
        title: "Hash Map Approach",
        description: "Use a hash map to store seen numbers and find complements in O(n).",
        code: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i`,
        language: "python",
      },
    ],
    notes: "Classic problem, good for understanding hash tables",
  },
  {
    id: "2",
    number: 121,
    title: "Best Time to Buy and Sell Stock",
    link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    difficulty: "Easy",
    tags: ["Array", "Dynamic Programming"],
    status: "Solved",
    dateSolved: "2024-01-16",
    approaches: [
      {
        title: "Single Pass with Min Tracking",
        "description": "- Track minimum price seen so far\n- Calculate max profit in one pass\n- Time complexity: O(n)",
        code: `def maxProfit(prices):
    min_price = float('inf')
    max_profit = 0
    for price in prices:
        min_price = min(min_price, price)
        max_profit = max(max_profit, price - min_price)
    return max_profit`,
        language: "python",
      },
    ],
    notes: "Important DP concept",
  },
  {
    id: "3",
    number: 200,
    title: "Number of Islands",
    link: "https://leetcode.com/problems/number-of-islands/",
    difficulty: "Medium",
    tags: ["Array", "DFS", "BFS", "Matrix"],
    status: "Solved",
    dateSolved: "2024-01-17",
    approaches: [
      {
        title: "DFS Traversal",
        description: "Perform DFS to mark connected land cells as visited and count islands.",
        code: `def numIslands(grid):
    if not grid:
        return 0
    
    def dfs(i, j):
        if i < 0 or i >= len(grid) or j < 0 or j >= len(grid[0]) or grid[i][j] != '1':
            return
        grid[i][j] = '0'
        dfs(i+1, j)
        dfs(i-1, j)
        dfs(i, j+1)
        dfs(i, j-1)
    
    count = 0
    for i in range(len(grid)):
        for j in range(len(grid[0])):
            if grid[i][j] == '1':
                dfs(i, j)
                count += 1
    return count`,
        language: "python",
      },
    ],
    notes: "Classic graph traversal problem",
  },
  {
    id: "4",
    number: 42,
    title: "Trapping Rain Water",
    link: "https://leetcode.com/problems/trapping-rain-water/",
    difficulty: "Hard",
    tags: ["Array", "Two Pointers", "Dynamic Programming"],
    status: "Reviewing",
    dateSolved: "2024-01-18",
    approaches: [
      {
        title: "Two Pointer Technique",
        description: "Use left and right pointers while tracking max heights to calculate trapped water.",
        code: `def trap(height):
    left, right = 0, len(height) - 1
    left_max = right_max = water = 0
    
    while left < right:
        if height[left] < height[right]:
            if height[left] >= left_max:
                left_max = height[left]
            else:
                water += left_max - height[left]
            left += 1
        else:
            if height[right] >= right_max:
                right_max = height[right]
            else:
                water += right_max - height[right]
            right -= 1
    return water`,
        language: "python",
      },
    ],
    notes: "Need to review the two-pointer technique",
  },
  {
    id: "5",
    number: 15,
    title: "3Sum",
    link: "https://leetcode.com/problems/3sum/",
    difficulty: "Medium",
    tags: ["Array", "Two Pointers", "Sorting"],
    status: "To Do",
    approaches: [],
    notes: "",
  },
  {
    id: "6",
    number: 146,
    title: "LRU Cache",
    link: "https://leetcode.com/problems/lru-cache/",
    difficulty: "Medium",
    tags: ["Hash Table", "Linked List", "Design"],
    status: "To Do",
    approaches: [],
    notes: "",
  },
]

export const mockCheatsheet: CheatSheet[] = [
  {
    _id: "1",
    title: "Two Pointers Pattern",
    type: "note",
    content: `- Initialize left & right pointers
- Move them based on condition
- Useful for: sorted arrays, palindrome checks, sliding windows`,
    favourite: false,
  },
  {
    _id: "2",
    title: "Binary Search Template",
    type: "snippet",
    content: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
    favourite: true,
  },
  {
    _id: "3",
    title: "Dynamic Programming Reminder",
    type: "note",
    content: `- Define subproblem
- Write recurrence relation
- Identify base cases
- Optimize with memoization/tabulation`,
    favourite: false,
  },
];
