const { query } = require('../db/index');
require('dotenv').config();

const problems = [
  // Arrays (30 problems)
  { title: 'Two Sum', topic: 'Arrays', difficulty: 'Easy', link: 'https://leetcode.com/problems/two-sum/', platform: 'LeetCode', order_index: 1 },
  { title: 'Best Time to Buy and Sell Stock', topic: 'Arrays', difficulty: 'Easy', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', platform: 'LeetCode', order_index: 2 },
  { title: 'Contains Duplicate', topic: 'Arrays', difficulty: 'Easy', link: 'https://leetcode.com/problems/contains-duplicate/', platform: 'LeetCode', order_index: 3 },
  { title: 'Product of Array Except Self', topic: 'Arrays', difficulty: 'Medium', link: 'https://leetcode.com/problems/product-of-array-except-self/', platform: 'LeetCode', order_index: 4 },
  { title: 'Maximum Subarray', topic: 'Arrays', difficulty: 'Medium', link: 'https://leetcode.com/problems/maximum-subarray/', platform: 'LeetCode', order_index: 5 },
  { title: 'Maximum Product Subarray', topic: 'Arrays', difficulty: 'Medium', link: 'https://leetcode.com/problems/maximum-product-subarray/', platform: 'LeetCode', order_index: 6 },
  { title: 'Find Minimum in Rotated Sorted Array', topic: 'Arrays', difficulty: 'Medium', link: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/', platform: 'LeetCode', order_index: 7 },
  { title: 'Search in Rotated Sorted Array', topic: 'Arrays', difficulty: 'Medium', link: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', platform: 'LeetCode', order_index: 8 },
  { title: '3Sum', topic: 'Arrays', difficulty: 'Medium', link: 'https://leetcode.com/problems/3sum/', platform: 'LeetCode', order_index: 9 },
  { title: 'Container With Most Water', topic: 'Arrays', difficulty: 'Medium', link: 'https://leetcode.com/problems/container-with-most-water/', platform: 'LeetCode', order_index: 10 },
  { title: 'Merge Intervals', topic: 'Arrays', difficulty: 'Medium', link: 'https://leetcode.com/problems/merge-intervals/', platform: 'LeetCode', order_index: 11 },
  { title: 'Insert Interval', topic: 'Arrays', difficulty: 'Medium', link: 'https://leetcode.com/problems/insert-interval/', platform: 'LeetCode', order_index: 12 },
  { title: 'Spiral Matrix', topic: 'Arrays', difficulty: 'Medium', link: 'https://leetcode.com/problems/spiral-matrix/', platform: 'LeetCode', order_index: 13 },
  { title: 'Set Matrix Zeroes', topic: 'Arrays', difficulty: 'Medium', link: 'https://leetcode.com/problems/set-matrix-zeroes/', platform: 'LeetCode', order_index: 14 },
  { title: 'Rotate Image', topic: 'Arrays', difficulty: 'Medium', link: 'https://leetcode.com/problems/rotate-image/', platform: 'LeetCode', order_index: 15 },
  { title: 'Word Search', topic: 'Arrays', difficulty: 'Medium', link: 'https://leetcode.com/problems/word-search/', platform: 'LeetCode', order_index: 16 },
  { title: 'Jump Game', topic: 'Arrays', difficulty: 'Medium', link: 'https://leetcode.com/problems/jump-game/', platform: 'LeetCode', order_index: 17 },
  { title: 'Jump Game II', topic: 'Arrays', difficulty: 'Medium', link: 'https://leetcode.com/problems/jump-game-ii/', platform: 'LeetCode', order_index: 18 },
  { title: 'Gas Station', topic: 'Arrays', difficulty: 'Medium', link: 'https://leetcode.com/problems/gas-station/', platform: 'LeetCode', order_index: 19 },
  { title: 'Candy', topic: 'Arrays', difficulty: 'Hard', link: 'https://leetcode.com/problems/candy/', platform: 'LeetCode', order_index: 20 },
  { title: 'Trapping Rain Water', topic: 'Arrays', difficulty: 'Hard', link: 'https://leetcode.com/problems/trapping-rain-water/', platform: 'LeetCode', order_index: 21 },
  { title: 'Sliding Window Maximum', topic: 'Arrays', difficulty: 'Hard', link: 'https://leetcode.com/problems/sliding-window-maximum/', platform: 'LeetCode', order_index: 22 },
  { title: 'First Missing Positive', topic: 'Arrays', difficulty: 'Hard', link: 'https://leetcode.com/problems/first-missing-positive/', platform: 'LeetCode', order_index: 23 },
  { title: 'Largest Rectangle in Histogram', topic: 'Arrays', difficulty: 'Hard', link: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', platform: 'LeetCode', order_index: 24 },
  { title: 'Sort Colors', topic: 'Arrays', difficulty: 'Medium', link: 'https://leetcode.com/problems/sort-colors/', platform: 'LeetCode', order_index: 25 },
  { title: 'Next Permutation', topic: 'Arrays', difficulty: 'Medium', link: 'https://leetcode.com/problems/next-permutation/', platform: 'LeetCode', order_index: 26 },
  { title: 'Subarray Sum Equals K', topic: 'Arrays', difficulty: 'Medium', link: 'https://leetcode.com/problems/subarray-sum-equals-k/', platform: 'LeetCode', order_index: 27 },
  { title: 'Longest Consecutive Sequence', topic: 'Arrays', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-consecutive-sequence/', platform: 'LeetCode', order_index: 28 },
  { title: 'Count Inversions', topic: 'Arrays', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/counting-inversions/', platform: 'GeeksForGeeks', order_index: 29 },
  { title: 'Majority Element', topic: 'Arrays', difficulty: 'Easy', link: 'https://leetcode.com/problems/majority-element/', platform: 'LeetCode', order_index: 30 },

  // Strings (15 problems)
  { title: 'Longest Substring Without Repeating Characters', topic: 'Strings', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', platform: 'LeetCode', order_index: 31 },
  { title: 'Longest Repeating Character Replacement', topic: 'Strings', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-repeating-character-replacement/', platform: 'LeetCode', order_index: 32 },
  { title: 'Minimum Window Substring', topic: 'Strings', difficulty: 'Hard', link: 'https://leetcode.com/problems/minimum-window-substring/', platform: 'LeetCode', order_index: 33 },
  { title: 'Valid Anagram', topic: 'Strings', difficulty: 'Easy', link: 'https://leetcode.com/problems/valid-anagram/', platform: 'LeetCode', order_index: 34 },
  { title: 'Group Anagrams', topic: 'Strings', difficulty: 'Medium', link: 'https://leetcode.com/problems/group-anagrams/', platform: 'LeetCode', order_index: 35 },
  { title: 'Valid Parentheses', topic: 'Strings', difficulty: 'Easy', link: 'https://leetcode.com/problems/valid-parentheses/', platform: 'LeetCode', order_index: 36 },
  { title: 'Palindromic Substrings', topic: 'Strings', difficulty: 'Medium', link: 'https://leetcode.com/problems/palindromic-substrings/', platform: 'LeetCode', order_index: 37 },
  { title: 'Longest Palindromic Substring', topic: 'Strings', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-palindromic-substring/', platform: 'LeetCode', order_index: 38 },
  { title: 'Encode and Decode Strings', topic: 'Strings', difficulty: 'Medium', link: 'https://leetcode.com/problems/encode-and-decode-strings/', platform: 'LeetCode', order_index: 39 },
  { title: 'Find All Anagrams in a String', topic: 'Strings', difficulty: 'Medium', link: 'https://leetcode.com/problems/find-all-anagrams-in-a-string/', platform: 'LeetCode', order_index: 40 },
  { title: 'Zigzag Conversion', topic: 'Strings', difficulty: 'Medium', link: 'https://leetcode.com/problems/zigzag-conversion/', platform: 'LeetCode', order_index: 41 },
  { title: 'String to Integer (atoi)', topic: 'Strings', difficulty: 'Medium', link: 'https://leetcode.com/problems/string-to-integer-atoi/', platform: 'LeetCode', order_index: 42 },
  { title: 'Count and Say', topic: 'Strings', difficulty: 'Medium', link: 'https://leetcode.com/problems/count-and-say/', platform: 'LeetCode', order_index: 43 },
  { title: 'Wildcard Matching', topic: 'Strings', difficulty: 'Hard', link: 'https://leetcode.com/problems/wildcard-matching/', platform: 'LeetCode', order_index: 44 },
  { title: 'Regular Expression Matching', topic: 'Strings', difficulty: 'Hard', link: 'https://leetcode.com/problems/regular-expression-matching/', platform: 'LeetCode', order_index: 45 },

  // Linked Lists (15 problems)
  { title: 'Reverse Linked List', topic: 'Linked List', difficulty: 'Easy', link: 'https://leetcode.com/problems/reverse-linked-list/', platform: 'LeetCode', order_index: 46 },
  { title: 'Merge Two Sorted Lists', topic: 'Linked List', difficulty: 'Easy', link: 'https://leetcode.com/problems/merge-two-sorted-lists/', platform: 'LeetCode', order_index: 47 },
  { title: 'Reorder List', topic: 'Linked List', difficulty: 'Medium', link: 'https://leetcode.com/problems/reorder-list/', platform: 'LeetCode', order_index: 48 },
  { title: 'Remove Nth Node From End of List', topic: 'Linked List', difficulty: 'Medium', link: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', platform: 'LeetCode', order_index: 49 },
  { title: 'Copy List with Random Pointer', topic: 'Linked List', difficulty: 'Medium', link: 'https://leetcode.com/problems/copy-list-with-random-pointer/', platform: 'LeetCode', order_index: 50 },
  { title: 'Add Two Numbers', topic: 'Linked List', difficulty: 'Medium', link: 'https://leetcode.com/problems/add-two-numbers/', platform: 'LeetCode', order_index: 51 },
  { title: 'Linked List Cycle', topic: 'Linked List', difficulty: 'Easy', link: 'https://leetcode.com/problems/linked-list-cycle/', platform: 'LeetCode', order_index: 52 },
  { title: 'Find the Duplicate Number', topic: 'Linked List', difficulty: 'Medium', link: 'https://leetcode.com/problems/find-the-duplicate-number/', platform: 'LeetCode', order_index: 53 },
  { title: 'LRU Cache', topic: 'Linked List', difficulty: 'Medium', link: 'https://leetcode.com/problems/lru-cache/', platform: 'LeetCode', order_index: 54 },
  { title: 'Merge K Sorted Lists', topic: 'Linked List', difficulty: 'Hard', link: 'https://leetcode.com/problems/merge-k-sorted-lists/', platform: 'LeetCode', order_index: 55 },
  { title: 'Reverse Nodes in k-Group', topic: 'Linked List', difficulty: 'Hard', link: 'https://leetcode.com/problems/reverse-nodes-in-k-group/', platform: 'LeetCode', order_index: 56 },
  { title: 'Middle of the Linked List', topic: 'Linked List', difficulty: 'Easy', link: 'https://leetcode.com/problems/middle-of-the-linked-list/', platform: 'LeetCode', order_index: 57 },
  { title: 'Palindrome Linked List', topic: 'Linked List', difficulty: 'Easy', link: 'https://leetcode.com/problems/palindrome-linked-list/', platform: 'LeetCode', order_index: 58 },
  { title: 'Intersection of Two Linked Lists', topic: 'Linked List', difficulty: 'Easy', link: 'https://leetcode.com/problems/intersection-of-two-linked-lists/', platform: 'LeetCode', order_index: 59 },
  { title: 'Sort List', topic: 'Linked List', difficulty: 'Medium', link: 'https://leetcode.com/problems/sort-list/', platform: 'LeetCode', order_index: 60 },

  // Binary Search (10 problems)
  { title: 'Binary Search', topic: 'Binary Search', difficulty: 'Easy', link: 'https://leetcode.com/problems/binary-search/', platform: 'LeetCode', order_index: 61 },
  { title: 'Search a 2D Matrix', topic: 'Binary Search', difficulty: 'Medium', link: 'https://leetcode.com/problems/search-a-2d-matrix/', platform: 'LeetCode', order_index: 62 },
  { title: 'Koko Eating Bananas', topic: 'Binary Search', difficulty: 'Medium', link: 'https://leetcode.com/problems/koko-eating-bananas/', platform: 'LeetCode', order_index: 63 },
  { title: 'Median of Two Sorted Arrays', topic: 'Binary Search', difficulty: 'Hard', link: 'https://leetcode.com/problems/median-of-two-sorted-arrays/', platform: 'LeetCode', order_index: 64 },
  { title: 'Time Based Key-Value Store', topic: 'Binary Search', difficulty: 'Medium', link: 'https://leetcode.com/problems/time-based-key-value-store/', platform: 'LeetCode', order_index: 65 },
  { title: 'Find Peak Element', topic: 'Binary Search', difficulty: 'Medium', link: 'https://leetcode.com/problems/find-peak-element/', platform: 'LeetCode', order_index: 66 },
  { title: 'Single Element in a Sorted Array', topic: 'Binary Search', difficulty: 'Medium', link: 'https://leetcode.com/problems/single-element-in-a-sorted-array/', platform: 'LeetCode', order_index: 67 },
  { title: 'Aggressive Cows', topic: 'Binary Search', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/aggressive-cows/', platform: 'GeeksForGeeks', order_index: 68 },
  { title: 'Book Allocation Problem', topic: 'Binary Search', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/allocate-minimum-number-pages/', platform: 'GeeksForGeeks', order_index: 69 },
  { title: 'Capacity To Ship Packages Within D Days', topic: 'Binary Search', difficulty: 'Medium', link: 'https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/', platform: 'LeetCode', order_index: 70 },

  // Trees (20 problems)
  { title: 'Invert Binary Tree', topic: 'Trees', difficulty: 'Easy', link: 'https://leetcode.com/problems/invert-binary-tree/', platform: 'LeetCode', order_index: 71 },
  { title: 'Maximum Depth of Binary Tree', topic: 'Trees', difficulty: 'Easy', link: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', platform: 'LeetCode', order_index: 72 },
  { title: 'Same Tree', topic: 'Trees', difficulty: 'Easy', link: 'https://leetcode.com/problems/same-tree/', platform: 'LeetCode', order_index: 73 },
  { title: 'Subtree of Another Tree', topic: 'Trees', difficulty: 'Easy', link: 'https://leetcode.com/problems/subtree-of-another-tree/', platform: 'LeetCode', order_index: 74 },
  { title: 'Lowest Common Ancestor of BST', topic: 'Trees', difficulty: 'Medium', link: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/', platform: 'LeetCode', order_index: 75 },
  { title: 'Binary Tree Level Order Traversal', topic: 'Trees', difficulty: 'Medium', link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', platform: 'LeetCode', order_index: 76 },
  { title: 'Binary Tree Right Side View', topic: 'Trees', difficulty: 'Medium', link: 'https://leetcode.com/problems/binary-tree-right-side-view/', platform: 'LeetCode', order_index: 77 },
  { title: 'Count Good Nodes in Binary Tree', topic: 'Trees', difficulty: 'Medium', link: 'https://leetcode.com/problems/count-good-nodes-in-binary-tree/', platform: 'LeetCode', order_index: 78 },
  { title: 'Validate Binary Search Tree', topic: 'Trees', difficulty: 'Medium', link: 'https://leetcode.com/problems/validate-binary-search-tree/', platform: 'LeetCode', order_index: 79 },
  { title: 'Kth Smallest Element in BST', topic: 'Trees', difficulty: 'Medium', link: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/', platform: 'LeetCode', order_index: 80 },
  { title: 'Construct Binary Tree from Preorder and Inorder', topic: 'Trees', difficulty: 'Medium', link: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/', platform: 'LeetCode', order_index: 81 },
  { title: 'Binary Tree Maximum Path Sum', topic: 'Trees', difficulty: 'Hard', link: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', platform: 'LeetCode', order_index: 82 },
  { title: 'Serialize and Deserialize Binary Tree', topic: 'Trees', difficulty: 'Hard', link: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/', platform: 'LeetCode', order_index: 83 },
  { title: 'Diameter of Binary Tree', topic: 'Trees', difficulty: 'Easy', link: 'https://leetcode.com/problems/diameter-of-binary-tree/', platform: 'LeetCode', order_index: 84 },
  { title: 'Balanced Binary Tree', topic: 'Trees', difficulty: 'Easy', link: 'https://leetcode.com/problems/balanced-binary-tree/', platform: 'LeetCode', order_index: 85 },
  { title: 'Path Sum II', topic: 'Trees', difficulty: 'Medium', link: 'https://leetcode.com/problems/path-sum-ii/', platform: 'LeetCode', order_index: 86 },
  { title: 'Flatten Binary Tree to Linked List', topic: 'Trees', difficulty: 'Medium', link: 'https://leetcode.com/problems/flatten-binary-tree-to-linked-list/', platform: 'LeetCode', order_index: 87 },
  { title: 'Maximum Width of Binary Tree', topic: 'Trees', difficulty: 'Medium', link: 'https://leetcode.com/problems/maximum-width-of-binary-tree/', platform: 'LeetCode', order_index: 88 },
  { title: 'Vertical Order Traversal of Binary Tree', topic: 'Trees', difficulty: 'Hard', link: 'https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/', platform: 'LeetCode', order_index: 89 },
  { title: 'Morris Traversal', topic: 'Trees', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/morris-traversal-for-preorder/', platform: 'GeeksForGeeks', order_index: 90 },

  // Dynamic Programming (25 problems)
  { title: 'Climbing Stairs', topic: 'Dynamic Programming', difficulty: 'Easy', link: 'https://leetcode.com/problems/climbing-stairs/', platform: 'LeetCode', order_index: 91 },
  { title: 'House Robber', topic: 'Dynamic Programming', difficulty: 'Medium', link: 'https://leetcode.com/problems/house-robber/', platform: 'LeetCode', order_index: 92 },
  { title: 'House Robber II', topic: 'Dynamic Programming', difficulty: 'Medium', link: 'https://leetcode.com/problems/house-robber-ii/', platform: 'LeetCode', order_index: 93 },
  { title: 'Longest Palindromic Substring (DP)', topic: 'Dynamic Programming', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-palindromic-substring/', platform: 'LeetCode', order_index: 94 },
  { title: 'Palindromic Substrings (DP)', topic: 'Dynamic Programming', difficulty: 'Medium', link: 'https://leetcode.com/problems/palindromic-substrings/', platform: 'LeetCode', order_index: 95 },
  { title: 'Decode Ways', topic: 'Dynamic Programming', difficulty: 'Medium', link: 'https://leetcode.com/problems/decode-ways/', platform: 'LeetCode', order_index: 96 },
  { title: 'Coin Change', topic: 'Dynamic Programming', difficulty: 'Medium', link: 'https://leetcode.com/problems/coin-change/', platform: 'LeetCode', order_index: 97 },
  { title: 'Maximum Product Subarray (DP)', topic: 'Dynamic Programming', difficulty: 'Medium', link: 'https://leetcode.com/problems/maximum-product-subarray/', platform: 'LeetCode', order_index: 98 },
  { title: 'Word Break', topic: 'Dynamic Programming', difficulty: 'Medium', link: 'https://leetcode.com/problems/word-break/', platform: 'LeetCode', order_index: 99 },
  { title: 'Combination Sum IV', topic: 'Dynamic Programming', difficulty: 'Medium', link: 'https://leetcode.com/problems/combination-sum-iv/', platform: 'LeetCode', order_index: 100 },
  { title: 'Unique Paths', topic: 'Dynamic Programming', difficulty: 'Medium', link: 'https://leetcode.com/problems/unique-paths/', platform: 'LeetCode', order_index: 101 },
  { title: 'Longest Common Subsequence', topic: 'Dynamic Programming', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-common-subsequence/', platform: 'LeetCode', order_index: 102 },
  { title: 'Best Time to Buy and Sell Stock with Cooldown', topic: 'Dynamic Programming', difficulty: 'Medium', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/', platform: 'LeetCode', order_index: 103 },
  { title: 'Coin Change II', topic: 'Dynamic Programming', difficulty: 'Medium', link: 'https://leetcode.com/problems/coin-change-ii/', platform: 'LeetCode', order_index: 104 },
  { title: 'Target Sum', topic: 'Dynamic Programming', difficulty: 'Medium', link: 'https://leetcode.com/problems/target-sum/', platform: 'LeetCode', order_index: 105 },
  { title: 'Interleaving String', topic: 'Dynamic Programming', difficulty: 'Medium', link: 'https://leetcode.com/problems/interleaving-string/', platform: 'LeetCode', order_index: 106 },
  { title: 'Longest Increasing Subsequence', topic: 'Dynamic Programming', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-increasing-subsequence/', platform: 'LeetCode', order_index: 107 },
  { title: 'Edit Distance', topic: 'Dynamic Programming', difficulty: 'Hard', link: 'https://leetcode.com/problems/edit-distance/', platform: 'LeetCode', order_index: 108 },
  { title: 'Burst Balloons', topic: 'Dynamic Programming', difficulty: 'Hard', link: 'https://leetcode.com/problems/burst-balloons/', platform: 'LeetCode', order_index: 109 },
  { title: 'Regular Expression Matching (DP)', topic: 'Dynamic Programming', difficulty: 'Hard', link: 'https://leetcode.com/problems/regular-expression-matching/', platform: 'LeetCode', order_index: 110 },
  { title: '0/1 Knapsack Problem', topic: 'Dynamic Programming', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/', platform: 'GeeksForGeeks', order_index: 111 },
  { title: 'Partition Equal Subset Sum', topic: 'Dynamic Programming', difficulty: 'Medium', link: 'https://leetcode.com/problems/partition-equal-subset-sum/', platform: 'LeetCode', order_index: 112 },
  { title: 'Egg Drop Problem', topic: 'Dynamic Programming', difficulty: 'Hard', link: 'https://leetcode.com/problems/super-egg-drop/', platform: 'LeetCode', order_index: 113 },
  { title: 'Maximum Rectangle in Histogram', topic: 'Dynamic Programming', difficulty: 'Hard', link: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', platform: 'LeetCode', order_index: 114 },
  { title: 'Matrix Chain Multiplication', topic: 'Dynamic Programming', difficulty: 'Hard', link: 'https://www.geeksforgeeks.org/matrix-chain-multiplication-dp-8/', platform: 'GeeksForGeeks', order_index: 115 },

  // Graphs (20 problems)
  { title: 'Number of Islands', topic: 'Graphs', difficulty: 'Medium', link: 'https://leetcode.com/problems/number-of-islands/', platform: 'LeetCode', order_index: 116 },
  { title: 'Clone Graph', topic: 'Graphs', difficulty: 'Medium', link: 'https://leetcode.com/problems/clone-graph/', platform: 'LeetCode', order_index: 117 },
  { title: 'Max Area of Island', topic: 'Graphs', difficulty: 'Medium', link: 'https://leetcode.com/problems/max-area-of-island/', platform: 'LeetCode', order_index: 118 },
  { title: 'Pacific Atlantic Water Flow', topic: 'Graphs', difficulty: 'Medium', link: 'https://leetcode.com/problems/pacific-atlantic-water-flow/', platform: 'LeetCode', order_index: 119 },
  { title: 'Surrounded Regions', topic: 'Graphs', difficulty: 'Medium', link: 'https://leetcode.com/problems/surrounded-regions/', platform: 'LeetCode', order_index: 120 },
  { title: 'Rotting Oranges', topic: 'Graphs', difficulty: 'Medium', link: 'https://leetcode.com/problems/rotting-oranges/', platform: 'LeetCode', order_index: 121 },
  { title: 'Walls and Gates', topic: 'Graphs', difficulty: 'Medium', link: 'https://leetcode.com/problems/walls-and-gates/', platform: 'LeetCode', order_index: 122 },
  { title: 'Course Schedule', topic: 'Graphs', difficulty: 'Medium', link: 'https://leetcode.com/problems/course-schedule/', platform: 'LeetCode', order_index: 123 },
  { title: 'Course Schedule II', topic: 'Graphs', difficulty: 'Medium', link: 'https://leetcode.com/problems/course-schedule-ii/', platform: 'LeetCode', order_index: 124 },
  { title: 'Redundant Connection', topic: 'Graphs', difficulty: 'Medium', link: 'https://leetcode.com/problems/redundant-connection/', platform: 'LeetCode', order_index: 125 },
  { title: 'Number of Connected Components in Undirected Graph', topic: 'Graphs', difficulty: 'Medium', link: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/', platform: 'LeetCode', order_index: 126 },
  { title: 'Graph Valid Tree', topic: 'Graphs', difficulty: 'Medium', link: 'https://leetcode.com/problems/graph-valid-tree/', platform: 'LeetCode', order_index: 127 },
  { title: 'Word Ladder', topic: 'Graphs', difficulty: 'Hard', link: 'https://leetcode.com/problems/word-ladder/', platform: 'LeetCode', order_index: 128 },
  { title: 'Dijkstra\'s Algorithm', topic: 'Graphs', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/', platform: 'GeeksForGeeks', order_index: 129 },
  { title: 'Bellman Ford Algorithm', topic: 'Graphs', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/bellman-ford-algorithm-dp-23/', platform: 'GeeksForGeeks', order_index: 130 },
  { title: 'Floyd Warshall Algorithm', topic: 'Graphs', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/floyd-warshall-algorithm-dp-16/', platform: 'GeeksForGeeks', order_index: 131 },
  { title: 'Minimum Spanning Tree (Prim\'s)', topic: 'Graphs', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/prims-minimum-spanning-tree-mst-greedy-algo-5/', platform: 'GeeksForGeeks', order_index: 132 },
  { title: "Kruskal's Algorithm", topic: 'Graphs', difficulty: 'Medium', link: "https://www.geeksforgeeks.org/kruskals-minimum-spanning-tree-algorithm-greedy-algo-2/", platform: 'GeeksForGeeks', order_index: 133 },
  { title: 'Alien Dictionary', topic: 'Graphs', difficulty: 'Hard', link: 'https://leetcode.com/problems/alien-dictionary/', platform: 'LeetCode', order_index: 134 },
  { title: 'Critical Connections in a Network', topic: 'Graphs', difficulty: 'Hard', link: 'https://leetcode.com/problems/critical-connections-in-a-network/', platform: 'LeetCode', order_index: 135 },

  // Stack & Queue (10 problems)
  { title: 'Valid Parentheses', topic: 'Stack & Queue', difficulty: 'Easy', link: 'https://leetcode.com/problems/valid-parentheses/', platform: 'LeetCode', order_index: 136 },
  { title: 'Min Stack', topic: 'Stack & Queue', difficulty: 'Medium', link: 'https://leetcode.com/problems/min-stack/', platform: 'LeetCode', order_index: 137 },
  { title: 'Evaluate Reverse Polish Notation', topic: 'Stack & Queue', difficulty: 'Medium', link: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/', platform: 'LeetCode', order_index: 138 },
  { title: 'Generate Parentheses', topic: 'Stack & Queue', difficulty: 'Medium', link: 'https://leetcode.com/problems/generate-parentheses/', platform: 'LeetCode', order_index: 139 },
  { title: 'Daily Temperatures', topic: 'Stack & Queue', difficulty: 'Medium', link: 'https://leetcode.com/problems/daily-temperatures/', platform: 'LeetCode', order_index: 140 },
  { title: 'Car Fleet', topic: 'Stack & Queue', difficulty: 'Medium', link: 'https://leetcode.com/problems/car-fleet/', platform: 'LeetCode', order_index: 141 },
  { title: 'Largest Rectangle in Histogram (Stack)', topic: 'Stack & Queue', difficulty: 'Hard', link: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', platform: 'LeetCode', order_index: 142 },
  { title: 'Next Greater Element', topic: 'Stack & Queue', difficulty: 'Easy', link: 'https://leetcode.com/problems/next-greater-element-i/', platform: 'LeetCode', order_index: 143 },
  { title: 'Online Stock Span', topic: 'Stack & Queue', difficulty: 'Medium', link: 'https://leetcode.com/problems/online-stock-span/', platform: 'LeetCode', order_index: 144 },
  { title: 'Sliding Window Maximum (Stack)', topic: 'Stack & Queue', difficulty: 'Hard', link: 'https://leetcode.com/problems/sliding-window-maximum/', platform: 'LeetCode', order_index: 145 },

  // Heap / Priority Queue (10 problems)
  { title: 'Kth Largest Element in a Stream', topic: 'Heap', difficulty: 'Easy', link: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/', platform: 'LeetCode', order_index: 146 },
  { title: 'Last Stone Weight', topic: 'Heap', difficulty: 'Easy', link: 'https://leetcode.com/problems/last-stone-weight/', platform: 'LeetCode', order_index: 147 },
  { title: 'K Closest Points to Origin', topic: 'Heap', difficulty: 'Medium', link: 'https://leetcode.com/problems/k-closest-points-to-origin/', platform: 'LeetCode', order_index: 148 },
  { title: 'Kth Largest Element in an Array', topic: 'Heap', difficulty: 'Medium', link: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', platform: 'LeetCode', order_index: 149 },
  { title: 'Task Scheduler', topic: 'Heap', difficulty: 'Medium', link: 'https://leetcode.com/problems/task-scheduler/', platform: 'LeetCode', order_index: 150 },
  { title: 'Design Twitter', topic: 'Heap', difficulty: 'Medium', link: 'https://leetcode.com/problems/design-twitter/', platform: 'LeetCode', order_index: 151 },
  { title: 'Find Median from Data Stream', topic: 'Heap', difficulty: 'Hard', link: 'https://leetcode.com/problems/find-median-from-data-stream/', platform: 'LeetCode', order_index: 152 },
  { title: 'Merge K Sorted Lists (Heap)', topic: 'Heap', difficulty: 'Hard', link: 'https://leetcode.com/problems/merge-k-sorted-lists/', platform: 'LeetCode', order_index: 153 },
  { title: 'Top K Frequent Elements', topic: 'Heap', difficulty: 'Medium', link: 'https://leetcode.com/problems/top-k-frequent-elements/', platform: 'LeetCode', order_index: 154 },
  { title: 'Reorganize String', topic: 'Heap', difficulty: 'Medium', link: 'https://leetcode.com/problems/reorganize-string/', platform: 'LeetCode', order_index: 155 },

  // Backtracking (10 problems)
  { title: 'Subsets', topic: 'Backtracking', difficulty: 'Medium', link: 'https://leetcode.com/problems/subsets/', platform: 'LeetCode', order_index: 156 },
  { title: 'Combination Sum', topic: 'Backtracking', difficulty: 'Medium', link: 'https://leetcode.com/problems/combination-sum/', platform: 'LeetCode', order_index: 157 },
  { title: 'Permutations', topic: 'Backtracking', difficulty: 'Medium', link: 'https://leetcode.com/problems/permutations/', platform: 'LeetCode', order_index: 158 },
  { title: 'Subsets II', topic: 'Backtracking', difficulty: 'Medium', link: 'https://leetcode.com/problems/subsets-ii/', platform: 'LeetCode', order_index: 159 },
  { title: 'Combination Sum II', topic: 'Backtracking', difficulty: 'Medium', link: 'https://leetcode.com/problems/combination-sum-ii/', platform: 'LeetCode', order_index: 160 },
  { title: 'Word Search (Backtracking)', topic: 'Backtracking', difficulty: 'Medium', link: 'https://leetcode.com/problems/word-search/', platform: 'LeetCode', order_index: 161 },
  { title: 'Palindrome Partitioning', topic: 'Backtracking', difficulty: 'Medium', link: 'https://leetcode.com/problems/palindrome-partitioning/', platform: 'LeetCode', order_index: 162 },
  { title: 'Letter Combinations of a Phone Number', topic: 'Backtracking', difficulty: 'Medium', link: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/', platform: 'LeetCode', order_index: 163 },
  { title: 'N-Queens', topic: 'Backtracking', difficulty: 'Hard', link: 'https://leetcode.com/problems/n-queens/', platform: 'LeetCode', order_index: 164 },
  { title: 'Sudoku Solver', topic: 'Backtracking', difficulty: 'Hard', link: 'https://leetcode.com/problems/sudoku-solver/', platform: 'LeetCode', order_index: 165 },

  // Tries (5 problems)
  { title: 'Implement Trie (Prefix Tree)', topic: 'Tries', difficulty: 'Medium', link: 'https://leetcode.com/problems/implement-trie-prefix-tree/', platform: 'LeetCode', order_index: 166 },
  { title: 'Design Add and Search Words Data Structure', topic: 'Tries', difficulty: 'Medium', link: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/', platform: 'LeetCode', order_index: 167 },
  { title: 'Word Search II', topic: 'Tries', difficulty: 'Hard', link: 'https://leetcode.com/problems/word-search-ii/', platform: 'LeetCode', order_index: 168 },
  { title: 'Longest Word in Dictionary', topic: 'Tries', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-word-in-dictionary/', platform: 'LeetCode', order_index: 169 },
  { title: 'Maximum XOR of Two Numbers in an Array', topic: 'Tries', difficulty: 'Medium', link: 'https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/', platform: 'LeetCode', order_index: 170 },

  // Bit Manipulation (5 problems)
  { title: 'Single Number', topic: 'Bit Manipulation', difficulty: 'Easy', link: 'https://leetcode.com/problems/single-number/', platform: 'LeetCode', order_index: 171 },
  { title: 'Number of 1 Bits', topic: 'Bit Manipulation', difficulty: 'Easy', link: 'https://leetcode.com/problems/number-of-1-bits/', platform: 'LeetCode', order_index: 172 },
  { title: 'Counting Bits', topic: 'Bit Manipulation', difficulty: 'Easy', link: 'https://leetcode.com/problems/counting-bits/', platform: 'LeetCode', order_index: 173 },
  { title: 'Reverse Bits', topic: 'Bit Manipulation', difficulty: 'Easy', link: 'https://leetcode.com/problems/reverse-bits/', platform: 'LeetCode', order_index: 174 },
  { title: 'Missing Number', topic: 'Bit Manipulation', difficulty: 'Easy', link: 'https://leetcode.com/problems/missing-number/', platform: 'LeetCode', order_index: 175 },

  // Greedy (5 problems)
  { title: "Fractional Knapsack", topic: 'Greedy', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/fractional-knapsack-problem/', platform: 'GeeksForGeeks', order_index: 176 },
  { title: 'Activity Selection Problem', topic: 'Greedy', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/activity-selection-problem-greedy-algo-1/', platform: 'GeeksForGeeks', order_index: 177 },
  { title: 'N Meetings in One Room', topic: 'Greedy', difficulty: 'Easy', link: 'https://www.geeksforgeeks.org/n-meetings-in-one-room/', platform: 'GeeksForGeeks', order_index: 178 },
  { title: 'Minimum Platforms', topic: 'Greedy', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/minimum-number-platforms-required-railwaybus-station/', platform: 'GeeksForGeeks', order_index: 179 },
  { title: 'Job Sequencing Problem', topic: 'Greedy', difficulty: 'Medium', link: 'https://www.geeksforgeeks.org/job-sequencing-problem/', platform: 'GeeksForGeeks', order_index: 180 },
];

const seed = async () => {
  console.log('🌱 Seeding problems...');
  try {
    // Clear existing problems
    await query('DELETE FROM user_problem_status');
    await query('DELETE FROM problems');
    await query('ALTER SEQUENCE problems_id_seq RESTART WITH 1');

    for (const problem of problems) {
      await query(
        `INSERT INTO problems (title, topic, difficulty, link, platform, sheet_name, order_index)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [problem.title, problem.topic, problem.difficulty, problem.link, problem.platform, 'Top 180 DSA', problem.order_index]
      );
    }

    console.log(`✅ Seeded ${problems.length} problems successfully!`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seed();
