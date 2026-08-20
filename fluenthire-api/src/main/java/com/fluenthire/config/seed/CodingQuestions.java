package com.fluenthire.config.seed;

import com.fluenthire.entity.AlgorithmCategory;
import com.fluenthire.entity.DifficultyLevel;
import com.fluenthire.entity.Example;
import com.fluenthire.entity.Question;
import com.fluenthire.entity.QuestionCategory;

import java.util.ArrayList;
import java.util.List;

/**
 * 81 coding interview problems covering 19 patterns.
 * Sourced from NeetCode 75/150, Blind 75, Grind 75, LeetCode Top 150,
 * FAANG/consulting frequency lists, and remote-platform screenings
 * (Toptal, Turing, Arc.dev, HackerRank, Codility).
 *
 * Distribution: 23 JUNIOR · 46 MID · 12 SENIOR
 */
public final class CodingQuestions {

    private CodingQuestions() {}

    public static List<Question> getAll() {
        List<Question> questions = new ArrayList<>();
        addArraysAndHashMaps(questions);
        addStrings(questions);
        addTwoPointersAndSorting(questions);
        addStacksAndQueues(questions);
        addBinarySearch(questions);
        addLinkedLists(questions);
        addTrees(questions);
        addGraphsAndMatrix(questions);
        addDynamicProgramming(questions);
        addBacktracking(questions);
        addHeaps(questions);
        addTries(questions);
        addIntervals(questions);
        addBitManipulation(questions);
        addUnionFindAndAdvancedGraph(questions);
        addMonotonicStack(questions);
        addGreedy(questions);
        return questions;
    }

    // ── Arrays and Hash Maps (12) ──────────────────────────────────────

    private static void addArraysAndHashMaps(List<Question> list) {
        list.add(q("Finding a pair that sums to a target",
                "Given an array of integers and a target sum, walk me through how you'd find two distinct numbers that add up to the target. How would you optimize for time complexity and handle edge cases like duplicates or negative numbers?",
                DifficultyLevel.JUNIOR,
                "twoSum", "nums:int[],target:int", "int[]",
                AlgorithmCategory.ARRAYS_AND_HASH_MAPS,
                List.of(
                        new Example("nums = [2, 7, 11, 15], target = 9", "[0, 1]"),
                        new Example("nums = [3, 2, 4], target = 6", "[1, 2]")
                ),
                "arrays", "hash-map", "optimization"));

        list.add(q("Checking for duplicates in an array",
                "How would you efficiently determine if an array contains any duplicate values? Walk me through your approach and discuss trade-offs in time and space.",
                DifficultyLevel.JUNIOR,
                "containsDuplicate", "nums:int[]", "boolean",
                AlgorithmCategory.ARRAYS_AND_HASH_MAPS,
                List.of(
                        new Example("nums = [1, 2, 3, 1]", "true"),
                        new Example("nums = [1, 2, 3, 4]", "false")
                ),
                "arrays", "hash-set"));

        list.add(q("Validating two strings as anagrams",
                "Given two strings, walk me through how you'd check if one is a rearrangement of the other.",
                DifficultyLevel.JUNIOR,
                "isAnagram", "s:string,t:string", "boolean",
                AlgorithmCategory.ARRAYS_AND_HASH_MAPS,
                List.of(
                        new Example("s = \"anagram\", t = \"nagaram\"", "true"),
                        new Example("s = \"rat\", t = \"car\"", "false")
                ),
                "strings", "hash-map", "sorting"));

        list.add(q("Finding the majority element in an array",
                "Given an array where one element appears more than half the time, how would you find it efficiently?",
                DifficultyLevel.JUNIOR,
                "majorityElement", "nums:int[]", "int",
                AlgorithmCategory.ARRAYS_AND_HASH_MAPS,
                List.of(
                        new Example("nums = [3, 2, 3]", "3"),
                        new Example("nums = [2, 2, 1, 1, 1, 2, 2]", "2")
                ),
                "arrays", "hash-map", "boyer-moore"));

        list.add(q("Rotating an array to the right by k steps",
                "Given an array and an integer k, how would you rotate the array to the right by k positions in place?",
                DifficultyLevel.JUNIOR,
                "rotate", "nums:int[],k:int", "void",
                AlgorithmCategory.ARRAYS_AND_HASH_MAPS,
                List.of(
                        new Example("nums = [1, 2, 3, 4, 5, 6, 7], k = 3", "[5, 6, 7, 1, 2, 3, 4]"),
                        new Example("nums = [-1, -100, 3, 99], k = 2", "[3, 99, -1, -100]")
                ),
                "arrays", "in-place", "modulo"));

        list.add(q("Merging two sorted arrays in place",
                "Given two sorted arrays, walk me through merging the second into the first in place without extra space.",
                DifficultyLevel.JUNIOR,
                "merge", "nums1:int[],m:int,nums2:int[],n:int", "void",
                AlgorithmCategory.ARRAYS_AND_HASH_MAPS,
                List.of(
                        new Example("nums1 = [1, 2, 3, 0, 0, 0], m = 3, nums2 = [2, 5, 6], n = 3", "[1, 2, 2, 3, 5, 6]"),
                        new Example("nums1 = [0], m = 0, nums2 = [1], n = 1", "[1]")
                ),
                "arrays", "two-pointers", "sorting"));

        list.add(q("Calculating product of array except self",
                "Given an array of integers, how would you return a new array where each element is the product of all the others without using division and in linear time?",
                DifficultyLevel.MID,
                "productExceptSelf", "nums:int[]", "int[]",
                AlgorithmCategory.ARRAYS_AND_HASH_MAPS,
                List.of(
                        new Example("nums = [1, 2, 3, 4]", "[24, 12, 8, 6]"),
                        new Example("nums = [-1, 1, 0, -3, 3]", "[0, 0, 9, 0, 0]")
                ),
                "arrays", "prefix-suffix"));

        list.add(q("Finding the longest consecutive sequence",
                "How would you find the length of the longest set of consecutive numbers in an unsorted array?",
                DifficultyLevel.MID,
                "longestConsecutive", "nums:int[]", "int",
                AlgorithmCategory.ARRAYS_AND_HASH_MAPS,
                List.of(
                        new Example("nums = [100, 4, 200, 1, 3, 2]", "4"),
                        new Example("nums = [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]", "9")
                ),
                "arrays", "hash-set"));

        list.add(q("Finding top k most frequent elements",
                "Given an array and k, walk me through returning the k most frequent elements.",
                DifficultyLevel.MID,
                "topKFrequent", "nums:int[],k:int", "int[]",
                AlgorithmCategory.ARRAYS_AND_HASH_MAPS,
                List.of(
                        new Example("nums = [1, 1, 1, 2, 2, 3], k = 2", "[1, 2]"),
                        new Example("nums = [1], k = 1", "[1]")
                ),
                "arrays", "hash-map", "heap"));

        list.add(q("Maximum subarray sum",
                "Given an array of integers, how would you find the contiguous subarray with the largest sum?",
                DifficultyLevel.JUNIOR,
                "maxSubArray", "nums:int[]", "int",
                AlgorithmCategory.ARRAYS_AND_HASH_MAPS,
                List.of(
                        new Example("nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]", "6"),
                        new Example("nums = [5, 4, -1, 7, 8]", "23")
                ),
                "arrays", "dynamic-programming", "kadane"));

        list.add(q("Finding the best time to buy and sell a stock",
                "Given an array of stock prices where each element is the price on a given day, walk me through how you'd find the maximum profit from a single buy and sell. You must buy before you sell.",
                DifficultyLevel.JUNIOR,
                "maxProfit", "prices:int[]", "int",
                AlgorithmCategory.ARRAYS_AND_HASH_MAPS,
                List.of(
                        new Example("prices = [7, 1, 5, 3, 6, 4]", "5"),
                        new Example("prices = [7, 6, 4, 3, 1]", "0")
                ),
                "arrays", "greedy", "sliding-window"));

        list.add(q("Grouping anagrams together",
                "Given an array of strings, how would you group the strings that are anagrams of each other?",
                DifficultyLevel.MID,
                "groupAnagrams", "strs:string[]", "List<List<string>>",
                AlgorithmCategory.ARRAYS_AND_HASH_MAPS,
                List.of(
                        new Example("strs = [\"eat\", \"tea\", \"tan\", \"ate\", \"nat\", \"bat\"]", "[[\"bat\"], [\"nat\", \"tan\"], [\"ate\", \"eat\", \"tea\"]]"),
                        new Example("strs = [\"\"]", "[[\"\"]]")
                ),
                "strings", "hash-map", "sorting"));
    }

    // ── Strings (6) ────────────────────────────────────────────────────

    private static void addStrings(List<Question> list) {
        list.add(q("Validating a palindrome (ignoring non-alphanumeric)",
                "Given a string, how would you check if it reads the same forwards and backwards while ignoring non-alphanumeric characters and case?",
                DifficultyLevel.JUNIOR,
                "isPalindrome", "s:string", "boolean",
                AlgorithmCategory.STRINGS,
                List.of(
                        new Example("s = \"A man, a plan, a canal: Panama\"", "true"),
                        new Example("s = \"race a car\"", "false")
                ),
                "strings", "two-pointers"));

        list.add(q("Finding the longest substring without repeating characters",
                "Given a string, walk me through finding the length of the longest substring without repeating characters.",
                DifficultyLevel.MID,
                "lengthOfLongestSubstring", "s:string", "int",
                AlgorithmCategory.STRINGS,
                List.of(
                        new Example("s = \"abcabcbb\"", "3"),
                        new Example("s = \"bbbbb\"", "1")
                ),
                "strings", "sliding-window", "hash-map"));

        list.add(q("Finding the longest palindromic substring",
                "How would you find the longest palindromic substring in a given string?",
                DifficultyLevel.MID,
                "longestPalindrome", "s:string", "string",
                AlgorithmCategory.STRINGS,
                List.of(
                        new Example("s = \"babad\"", "\"bab\""),
                        new Example("s = \"cbbd\"", "\"bb\"")
                ),
                "strings", "expand-around-center", "dynamic-programming"));

        list.add(q("Converting a string to integer (handling edge cases)",
                "Given a string representing a number, walk me through converting it to an integer while handling signs, whitespace, and overflow.",
                DifficultyLevel.JUNIOR,
                "myAtoi", "s:string", "int",
                AlgorithmCategory.STRINGS,
                List.of(
                        new Example("s = \"42\"", "42"),
                        new Example("s = \"   -42\"", "-42"),
                        new Example("s = \"4193 with words\"", "4193")
                ),
                "strings", "parsing", "edge-cases"));

        list.add(q("Finding all anagrams in a string",
                "Given a string and a pattern, how would you find all starting indices of anagrams of the pattern in the string?",
                DifficultyLevel.MID,
                "findAnagrams", "s:string,p:string", "List<int>",
                AlgorithmCategory.STRINGS,
                List.of(
                        new Example("s = \"cbaebabacd\", p = \"abc\"", "[0, 6]"),
                        new Example("s = \"abab\", p = \"ab\"", "[0, 1, 2]")
                ),
                "strings", "sliding-window", "hash-map"));

        list.add(q("Finding the minimum window containing all characters",
                "Given two strings s and t, how would you find the minimum window substring in s that contains all characters of t, including duplicates?",
                DifficultyLevel.SENIOR,
                "minWindow", "s:string,t:string", "string",
                AlgorithmCategory.STRINGS,
                List.of(
                        new Example("s = \"ADOBECODEBANC\", t = \"ABC\"", "\"BANC\""),
                        new Example("s = \"a\", t = \"a\"", "\"a\""),
                        new Example("s = \"a\", t = \"aa\"", "\"\"")
                ),
                "strings", "sliding-window", "hash-map"));
    }

    // ── Two Pointers and Sorting (5) ───────────────────────────────────

    private static void addTwoPointersAndSorting(List<Question> list) {
        list.add(q("Sorting colors in an array (0s, 1s, 2s)",
                "Given an array with only 0s, 1s, and 2s, how would you sort it in place in one pass?",
                DifficultyLevel.JUNIOR,
                "sortColors", "nums:int[]", "void",
                AlgorithmCategory.TWO_POINTERS_AND_SORTING,
                List.of(
                        new Example("nums = [2, 0, 2, 1, 1, 0]", "[0, 0, 1, 1, 2, 2]"),
                        new Example("nums = [2, 0, 1]", "[0, 1, 2]")
                ),
                "arrays", "two-pointers", "sorting"));

        list.add(q("Finding three numbers that sum to zero",
                "Given an array of integers, walk me through finding all unique triplets that sum to zero.",
                DifficultyLevel.MID,
                "threeSum", "nums:int[]", "List<List<int>>",
                AlgorithmCategory.TWO_POINTERS_AND_SORTING,
                List.of(
                        new Example("nums = [-1, 0, 1, 2, -1, -4]", "[[-1, -1, 2], [-1, 0, 1]]"),
                        new Example("nums = [0, 1, 1]", "[]")
                ),
                "arrays", "two-pointers", "sorting"));

        list.add(q("Finding the container with most water",
                "Given an array of heights representing vertical lines, how would you find two lines that form a container with the most water?",
                DifficultyLevel.MID,
                "maxArea", "height:int[]", "int",
                AlgorithmCategory.TWO_POINTERS_AND_SORTING,
                List.of(
                        new Example("height = [1, 8, 6, 2, 5, 4, 8, 3, 7]", "49"),
                        new Example("height = [1, 1]", "1")
                ),
                "arrays", "two-pointers", "greedy"));

        list.add(q("Removing duplicates from a sorted array",
                "Given a sorted array, how would you remove duplicates in place and return the new length?",
                DifficultyLevel.JUNIOR,
                "removeDuplicates", "nums:int[]", "int",
                AlgorithmCategory.TWO_POINTERS_AND_SORTING,
                List.of(
                        new Example("nums = [1, 1, 2]", "2"),
                        new Example("nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]", "5")
                ),
                "arrays", "two-pointers", "in-place"));

        list.add(q("Finding the first bad version in a sequence",
                "Given a sequence of versions where one is bad and all after it are bad, how would you find the first bad version with minimal calls?",
                DifficultyLevel.JUNIOR,
                "firstBadVersion", "n:int", "int",
                AlgorithmCategory.TWO_POINTERS_AND_SORTING,
                List.of(
                        new Example("n = 5, bad = 4", "4"),
                        new Example("n = 1, bad = 1", "1")
                ),
                "binary-search", "optimization"));
    }

    // ── Stacks and Queues (5) ──────────────────────────────────────────

    private static void addStacksAndQueues(List<Question> list) {
        list.add(q("Validating parentheses in a string",
                "Given a string containing parentheses, how would you check if they are valid and properly nested?",
                DifficultyLevel.JUNIOR,
                "isValid", "s:string", "boolean",
                AlgorithmCategory.STACKS_AND_QUEUES,
                List.of(
                        new Example("s = \"()[]{}\"", "true"),
                        new Example("s = \"(]\"", "false")
                ),
                "stack", "strings"));

        list.add(q("Implementing a min stack",
                "How would you design a stack that supports push, pop, top, and retrieving the minimum element in constant time?",
                DifficultyLevel.MID,
                "MinStack", "", "class",
                AlgorithmCategory.STACKS_AND_QUEUES,
                List.of(
                        new Example("push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()", "getMin() → -3, pop() → -3, top() → 0, getMin() → -2"),
                        new Example("push(0), push(1), push(0), getMin(), pop(), getMin()", "getMin() → 0, pop() → 0, getMin() → 0")
                ),
                "stack", "design"));

        list.add(q("Evaluating reverse Polish notation",
                "Given tokens in reverse Polish notation, walk me through evaluating the expression.",
                DifficultyLevel.MID,
                "evalRPN", "tokens:string[]", "int",
                AlgorithmCategory.STACKS_AND_QUEUES,
                List.of(
                        new Example("tokens = [\"2\", \"1\", \"+\", \"3\", \"*\"]", "9"),
                        new Example("tokens = [\"4\", \"13\", \"5\", \"/\", \"+\"]", "6")
                ),
                "stack", "parsing"));

        list.add(q("Implementing a queue using stacks",
                "How would you implement a queue using only stacks?",
                DifficultyLevel.JUNIOR,
                "MyQueue", "", "class",
                AlgorithmCategory.STACKS_AND_QUEUES,
                List.of(
                        new Example("push(1), push(2), peek(), pop(), empty()", "peek() → 1, pop() → 1, empty() → false"),
                        new Example("push(1), pop(), empty()", "pop() → 1, empty() → true")
                ),
                "stack", "queue", "design"));

        list.add(q("Basic calculator for expressions",
                "How would you evaluate a basic arithmetic expression string with parentheses?",
                DifficultyLevel.SENIOR,
                "calculate", "s:string", "int",
                AlgorithmCategory.STACKS_AND_QUEUES,
                List.of(
                        new Example("s = \"1 + 1\"", "2"),
                        new Example("s = \"(1 + (4 + 5 + 2) - 3) + (6 + 8)\"", "23")
                ),
                "stack", "parsing", "recursion"));
    }

    // ── Binary Search (4) ──────────────────────────────────────────────

    private static void addBinarySearch(List<Question> list) {
        list.add(q("Searching in a rotated sorted array",
                "Given a rotated sorted array and a target, how would you search for the target efficiently?",
                DifficultyLevel.MID,
                "search", "nums:int[],target:int", "int",
                AlgorithmCategory.BINARY_SEARCH,
                List.of(
                        new Example("nums = [4, 5, 6, 7, 0, 1, 2], target = 0", "4"),
                        new Example("nums = [4, 5, 6, 7, 0, 1, 2], target = 3", "-1")
                ),
                "binary-search", "arrays"));

        list.add(q("Finding the minimum in a rotated sorted array",
                "How would you find the minimum element in a rotated sorted array?",
                DifficultyLevel.MID,
                "findMin", "nums:int[]", "int",
                AlgorithmCategory.BINARY_SEARCH,
                List.of(
                        new Example("nums = [3, 4, 5, 1, 2]", "1"),
                        new Example("nums = [4, 5, 6, 7, 0, 1, 2]", "0")
                ),
                "binary-search", "arrays"));

        list.add(q("Searching a 2D matrix",
                "Given a sorted 2D matrix, how would you search for a target value efficiently?",
                DifficultyLevel.MID,
                "searchMatrix", "matrix:int[][],target:int", "boolean",
                AlgorithmCategory.BINARY_SEARCH,
                List.of(
                        new Example("matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3", "true"),
                        new Example("matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13", "false")
                ),
                "binary-search", "matrix"));

        list.add(q("Finding the kth smallest element in a BST",
                "Given a BST, how would you find the kth smallest element?",
                DifficultyLevel.MID,
                "kthSmallest", "root:TreeNode,k:int", "int",
                AlgorithmCategory.BINARY_SEARCH,
                List.of(
                        new Example("root = [3, 1, 4, null, 2], k = 1", "1"),
                        new Example("root = [5, 3, 6, 2, 4, null, null, 1], k = 3", "3")
                ),
                "binary-search", "trees", "in-order"));
    }

    // ── Linked Lists (5) ──────────────────────────────────────────────

    private static void addLinkedLists(List<Question> list) {
        list.add(q("Detecting a cycle in a linked list",
                "Given a linked list, how would you determine if it has a cycle?",
                DifficultyLevel.JUNIOR,
                "hasCycle", "head:ListNode", "boolean",
                AlgorithmCategory.LINKED_LISTS,
                List.of(
                        new Example("head = [3, 2, 0, -4], pos = 1 (tail connects to index 1)", "true"),
                        new Example("head = [1, 2], pos = -1 (no cycle)", "false")
                ),
                "linked-list", "fast-slow-pointers"));

        list.add(q("Reversing a linked list",
                "How would you reverse a linked list iteratively or recursively?",
                DifficultyLevel.JUNIOR,
                "reverseList", "head:ListNode", "ListNode",
                AlgorithmCategory.LINKED_LISTS,
                List.of(
                        new Example("head = [1, 2, 3, 4, 5]", "[5, 4, 3, 2, 1]"),
                        new Example("head = [1, 2]", "[2, 1]")
                ),
                "linked-list", "pointers"));

        list.add(q("Merging two sorted linked lists",
                "Given two sorted linked lists, walk me through merging them into one sorted list.",
                DifficultyLevel.JUNIOR,
                "mergeTwoLists", "list1:ListNode,list2:ListNode", "ListNode",
                AlgorithmCategory.LINKED_LISTS,
                List.of(
                        new Example("list1 = [1, 2, 4], list2 = [1, 3, 4]", "[1, 1, 2, 3, 4, 4]"),
                        new Example("list1 = [], list2 = [0]", "[0]")
                ),
                "linked-list", "two-pointers"));

        list.add(q("Removing the nth node from the end",
                "Given a linked list, how would you remove the nth node from the end in one pass?",
                DifficultyLevel.MID,
                "removeNthFromEnd", "head:ListNode,n:int", "ListNode",
                AlgorithmCategory.LINKED_LISTS,
                List.of(
                        new Example("head = [1, 2, 3, 4, 5], n = 2", "[1, 2, 3, 5]"),
                        new Example("head = [1], n = 1", "[]")
                ),
                "linked-list", "two-pointers"));

        list.add(q("Copying a linked list with random pointers",
                "How would you create a deep copy of a linked list where each node has a random pointer?",
                DifficultyLevel.MID,
                "copyRandomList", "head:Node", "Node",
                AlgorithmCategory.LINKED_LISTS,
                List.of(
                        new Example("head = [[7,null],[13,0],[11,4],[10,2],[1,0]]", "[[7,null],[13,0],[11,4],[10,2],[1,0]]"),
                        new Example("head = [[1,1],[2,1]]", "[[1,1],[2,1]]")
                ),
                "linked-list", "hash-map"));
    }

    // ── Trees (8) ──────────────────────────────────────────────────────

    private static void addTrees(List<Question> list) {
        list.add(q("Finding the maximum depth of a binary tree",
                "Given a binary tree, how would you find its maximum depth?",
                DifficultyLevel.JUNIOR,
                "maxDepth", "root:TreeNode", "int",
                AlgorithmCategory.TREES,
                List.of(
                        new Example("root = [3, 9, 20, null, null, 15, 7]", "3"),
                        new Example("root = [1, null, 2]", "2")
                ),
                "trees", "dfs", "recursion"));

        list.add(q("Inverting a binary tree",
                "How would you invert a binary tree (swap left and right children)?",
                DifficultyLevel.JUNIOR,
                "invertTree", "root:TreeNode", "TreeNode",
                AlgorithmCategory.TREES,
                List.of(
                        new Example("root = [4, 2, 7, 1, 3, 6, 9]", "[4, 7, 2, 9, 6, 3, 1]"),
                        new Example("root = [2, 1, 3]", "[2, 3, 1]")
                ),
                "trees", "dfs", "recursion"));

        list.add(q("Validating a binary search tree",
                "Given a binary tree, walk me through checking if it is a valid BST.",
                DifficultyLevel.MID,
                "isValidBST", "root:TreeNode", "boolean",
                AlgorithmCategory.TREES,
                List.of(
                        new Example("root = [2, 1, 3]", "true"),
                        new Example("root = [5, 1, 4, null, null, 3, 6]", "false")
                ),
                "trees", "dfs", "in-order"));

        list.add(q("Performing level order traversal of a binary tree",
                "How would you return the level-order traversal of a binary tree?",
                DifficultyLevel.MID,
                "levelOrder", "root:TreeNode", "List<List<int>>",
                AlgorithmCategory.TREES,
                List.of(
                        new Example("root = [3, 9, 20, null, null, 15, 7]", "[[3], [9, 20], [15, 7]]"),
                        new Example("root = [1]", "[[1]]")
                ),
                "trees", "bfs", "queue"));

        list.add(q("Finding the lowest common ancestor in a binary tree",
                "Given a binary tree and two nodes, how would you find their lowest common ancestor?",
                DifficultyLevel.MID,
                "lowestCommonAncestor", "root:TreeNode,p:TreeNode,q:TreeNode", "TreeNode",
                AlgorithmCategory.TREES,
                List.of(
                        new Example("root = [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], p = 5, q = 1", "3"),
                        new Example("root = [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], p = 5, q = 4", "5")
                ),
                "trees", "dfs", "recursion"));

        list.add(q("Serializing and deserializing a binary tree",
                "How would you serialize and deserialize a binary tree into a string?",
                DifficultyLevel.MID,
                "serialize", "root:TreeNode", "string",
                AlgorithmCategory.TREES,
                List.of(
                        new Example("root = [1, 2, 3, null, null, 4, 5]", "[1, 2, 3, null, null, 4, 5]"),
                        new Example("root = []", "[]")
                ),
                "trees", "dfs", "design"));

        list.add(q("Constructing a binary tree from preorder and inorder traversals",
                "Given preorder and inorder traversals, how would you reconstruct the binary tree?",
                DifficultyLevel.MID,
                "buildTree", "preorder:int[],inorder:int[]", "TreeNode",
                AlgorithmCategory.TREES,
                List.of(
                        new Example("preorder = [3, 9, 20, 15, 7], inorder = [9, 3, 15, 20, 7]", "[3, 9, 20, null, null, 15, 7]"),
                        new Example("preorder = [-1], inorder = [-1]", "[-1]")
                ),
                "trees", "hash-map", "recursion"));

        list.add(q("Finding the diameter of a binary tree",
                "How would you compute the diameter (longest path) of a binary tree?",
                DifficultyLevel.MID,
                "diameterOfBinaryTree", "root:TreeNode", "int",
                AlgorithmCategory.TREES,
                List.of(
                        new Example("root = [1, 2, 3, 4, 5]", "3"),
                        new Example("root = [1, 2]", "1")
                ),
                "trees", "dfs", "height-tracking"));
    }

    // ── Graphs and Matrix (7) ──────────────────────────────────────────

    private static void addGraphsAndMatrix(List<Question> list) {
        list.add(q("Counting the number of islands in a grid",
                "Given a 2D grid of land and water, how would you count the number of islands?",
                DifficultyLevel.MID,
                "numIslands", "grid:char[][]", "int",
                AlgorithmCategory.GRAPHS_AND_MATRIX,
                List.of(
                        new Example("grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]", "3"),
                        new Example("grid = [[\"1\",\"1\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"1\",\"1\"]]", "1")
                ),
                "graph", "dfs", "bfs", "matrix"));

        list.add(q("Cloning a graph",
                "Given a graph node, how would you create a deep copy of the entire graph?",
                DifficultyLevel.MID,
                "cloneGraph", "node:Node", "Node",
                AlgorithmCategory.GRAPHS_AND_MATRIX,
                List.of(
                        new Example("adjList = [[2,4],[1,3],[2,4],[1,3]]", "[[2,4],[1,3],[2,4],[1,3]]"),
                        new Example("adjList = [[]]", "[[]]")
                ),
                "graph", "dfs", "hash-map"));

        list.add(q("Determining if a course schedule is possible",
                "Given courses with prerequisites, how would you check if you can finish all courses?",
                DifficultyLevel.MID,
                "canFinish", "numCourses:int,prerequisites:int[][]", "boolean",
                AlgorithmCategory.GRAPHS_AND_MATRIX,
                List.of(
                        new Example("numCourses = 2, prerequisites = [[1, 0]]", "true"),
                        new Example("numCourses = 2, prerequisites = [[1, 0], [0, 1]]", "false")
                ),
                "graph", "topological-sort", "cycle-detection"));

        list.add(q("Rotting oranges in a grid",
                "Given a grid of fresh and rotten oranges, how would you find the minimum time until all are rotten?",
                DifficultyLevel.MID,
                "orangesRotting", "grid:int[][]", "int",
                AlgorithmCategory.GRAPHS_AND_MATRIX,
                List.of(
                        new Example("grid = [[2,1,1],[1,1,0],[0,1,1]]", "4"),
                        new Example("grid = [[2,1,1],[0,1,1],[1,0,1]]", "-1")
                ),
                "graph", "bfs", "matrix"));

        list.add(q("Finding the shortest path in a binary matrix",
                "Given a binary matrix, how would you find the shortest path from top-left to bottom-right?",
                DifficultyLevel.MID,
                "shortestPathBinaryMatrix", "grid:int[][]", "int",
                AlgorithmCategory.GRAPHS_AND_MATRIX,
                List.of(
                        new Example("grid = [[0,1],[1,0]]", "2"),
                        new Example("grid = [[0,0,0],[1,1,0],[1,1,0]]", "4")
                ),
                "graph", "bfs", "matrix"));

        list.add(q("Setting matrix zeroes in place",
                "Given a matrix, how would you set entire rows and columns to zero if any element is zero, in place?",
                DifficultyLevel.MID,
                "setZeroes", "matrix:int[][]", "void",
                AlgorithmCategory.GRAPHS_AND_MATRIX,
                List.of(
                        new Example("matrix = [[1,1,1],[1,0,1],[1,1,1]]", "[[1,0,1],[0,0,0],[1,0,1]]"),
                        new Example("matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]", "[[0,0,0,0],[0,4,5,0],[0,3,1,0]]")
                ),
                "matrix", "in-place"));

        list.add(q("Spiral traversal of a matrix",
                "How would you return all elements of a matrix in spiral order?",
                DifficultyLevel.MID,
                "spiralOrder", "matrix:int[][]", "List<int>",
                AlgorithmCategory.GRAPHS_AND_MATRIX,
                List.of(
                        new Example("matrix = [[1,2,3],[4,5,6],[7,8,9]]", "[1, 2, 3, 6, 9, 8, 7, 4, 5]"),
                        new Example("matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]", "[1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]")
                ),
                "matrix", "boundary-traversal"));
    }

    // ── Dynamic Programming (9) ────────────────────────────────────────

    private static void addDynamicProgramming(List<Question> list) {
        list.add(q("Climbing stairs (number of ways)",
                "Given n stairs, how would you find the number of distinct ways to climb them taking 1 or 2 steps?",
                DifficultyLevel.JUNIOR,
                "climbStairs", "n:int", "int",
                AlgorithmCategory.DYNAMIC_PROGRAMMING,
                List.of(
                        new Example("n = 2", "2"),
                        new Example("n = 3", "3")
                ),
                "dynamic-programming", "fibonacci"));

        list.add(q("House robber (maximum loot without adjacent)",
                "Given houses with loot amounts, how would you rob the maximum without alerting neighbors?",
                DifficultyLevel.MID,
                "rob", "nums:int[]", "int",
                AlgorithmCategory.DYNAMIC_PROGRAMMING,
                List.of(
                        new Example("nums = [1, 2, 3, 1]", "4"),
                        new Example("nums = [2, 7, 9, 3, 1]", "12")
                ),
                "dynamic-programming", "1d-dp"));

        list.add(q("Coin change (minimum coins for amount)",
                "Given coins and an amount, how would you find the fewest coins needed?",
                DifficultyLevel.MID,
                "coinChange", "coins:int[],amount:int", "int",
                AlgorithmCategory.DYNAMIC_PROGRAMMING,
                List.of(
                        new Example("coins = [1, 2, 5], amount = 11", "3"),
                        new Example("coins = [2], amount = 3", "-1")
                ),
                "dynamic-programming", "1d-dp"));

        list.add(q("Longest increasing subsequence",
                "Given an array, how would you find the length of the longest increasing subsequence?",
                DifficultyLevel.MID,
                "lengthOfLIS", "nums:int[]", "int",
                AlgorithmCategory.DYNAMIC_PROGRAMMING,
                List.of(
                        new Example("nums = [10, 9, 2, 5, 3, 7, 101, 18]", "4"),
                        new Example("nums = [0, 1, 0, 3, 2, 3]", "4")
                ),
                "dynamic-programming", "binary-search"));

        list.add(q("Word break (can string be segmented)",
                "Given a string and a dictionary, how would you check if the string can be segmented into dictionary words?",
                DifficultyLevel.MID,
                "wordBreak", "s:string,wordDict:List<string>", "boolean",
                AlgorithmCategory.DYNAMIC_PROGRAMMING,
                List.of(
                        new Example("s = \"applepenapple\", wordDict = [\"apple\", \"pen\"]", "true"),
                        new Example("s = \"catsandog\", wordDict = [\"cats\", \"dog\", \"sand\", \"and\", \"cat\"]", "false")
                ),
                "dynamic-programming", "strings"));

        list.add(q("Unique paths in a grid",
                "Given a grid with obstacles, how would you find the number of unique paths from top-left to bottom-right?",
                DifficultyLevel.MID,
                "uniquePaths", "m:int,n:int", "int",
                AlgorithmCategory.DYNAMIC_PROGRAMMING,
                List.of(
                        new Example("grid = [[0,0,0],[0,1,0],[0,0,0]]", "2"),
                        new Example("grid = [[0,1],[0,0]]", "1")
                ),
                "dynamic-programming", "2d-dp", "matrix"));

        list.add(q("Edit distance between two strings",
                "Given two words, how would you find the minimum edits (insert/delete/replace) to convert one to the other?",
                DifficultyLevel.SENIOR,
                "minDistance", "word1:string,word2:string", "int",
                AlgorithmCategory.DYNAMIC_PROGRAMMING,
                List.of(
                        new Example("word1 = \"horse\", word2 = \"ros\"", "3"),
                        new Example("word1 = \"intention\", word2 = \"execution\"", "5")
                ),
                "dynamic-programming", "2d-dp", "strings"));

        list.add(q("Longest common subsequence",
                "Given two strings, how would you find the length of their longest common subsequence?",
                DifficultyLevel.SENIOR,
                "longestCommonSubsequence", "text1:string,text2:string", "int",
                AlgorithmCategory.DYNAMIC_PROGRAMMING,
                List.of(
                        new Example("text1 = \"abcde\", text2 = \"ace\"", "3"),
                        new Example("text1 = \"abc\", text2 = \"def\"", "0")
                ),
                "dynamic-programming", "2d-dp", "strings"));

        list.add(q("Finding the maximum product subarray",
                "Given an integer array, how would you find the contiguous subarray that has the largest product? Consider how negative numbers and zeros affect the result.",
                DifficultyLevel.MID,
                "maxProduct", "nums:int[]", "int",
                AlgorithmCategory.DYNAMIC_PROGRAMMING,
                List.of(
                        new Example("nums = [2, 3, -2, 4]", "6"),
                        new Example("nums = [-2, 0, -1]", "0")
                ),
                "dynamic-programming", "arrays"));
    }

    // ── Backtracking (4) ──────────────────────────────────────────────

    private static void addBacktracking(List<Question> list) {
        list.add(q("Generating letter combinations from phone digits",
                "Given a string of digits, how would you return all possible letter combinations?",
                DifficultyLevel.MID,
                "letterCombinations", "digits:string", "List<string>",
                AlgorithmCategory.BACKTRACKING,
                List.of(
                        new Example("digits = \"23\"", "[\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]"),
                        new Example("digits = \"\"", "[]")
                ),
                "backtracking", "recursion"));

        list.add(q("Generating all subsets of an array",
                "Given an array of distinct integers, how would you return all possible subsets?",
                DifficultyLevel.MID,
                "subsets", "nums:int[]", "List<List<int>>",
                AlgorithmCategory.BACKTRACKING,
                List.of(
                        new Example("nums = [1, 2, 3]", "[[], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]]"),
                        new Example("nums = [0]", "[[], [0]]")
                ),
                "backtracking", "recursion"));

        list.add(q("Solving N-Queens placement",
                "How would you place N queens on an N×N chessboard so no two attack each other?",
                DifficultyLevel.SENIOR,
                "solveNQueens", "n:int", "List<List<string>>",
                AlgorithmCategory.BACKTRACKING,
                List.of(
                        new Example("n = 4", "2 solutions"),
                        new Example("n = 1", "1 solution")
                ),
                "backtracking", "recursion", "constraint-satisfaction"));

        list.add(q("Finding a word in a grid (Word Search)",
                "Given a grid of letters and a word, how would you check if the word exists in the grid?",
                DifficultyLevel.MID,
                "exist", "board:char[][],word:string", "boolean",
                AlgorithmCategory.BACKTRACKING,
                List.of(
                        new Example("board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCCED\"", "true"),
                        new Example("board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"SEE\"", "true")
                ),
                "backtracking", "dfs", "matrix"));
    }

    // ── Heaps and Priority Queues (4) ──────────────────────────────────

    private static void addHeaps(List<Question> list) {
        list.add(q("Merging k sorted linked lists",
                "Given k sorted linked lists, how would you merge them into one sorted list?",
                DifficultyLevel.SENIOR,
                "mergeKLists", "lists:ListNode[]", "ListNode",
                AlgorithmCategory.HEAPS_AND_PRIORITY_QUEUES,
                List.of(
                        new Example("lists = [[1,4,5],[1,3,4],[2,6]]", "[1, 1, 2, 3, 4, 4, 5, 6]"),
                        new Example("lists = []", "[]")
                ),
                "heap", "linked-list", "divide-and-conquer"));

        list.add(q("Finding k closest points to origin",
                "Given points in 2D space and k, how would you return the k closest points to the origin?",
                DifficultyLevel.MID,
                "kClosest", "points:int[][],k:int", "int[][]",
                AlgorithmCategory.HEAPS_AND_PRIORITY_QUEUES,
                List.of(
                        new Example("points = [[1,3],[-2,2]], k = 1", "[[-2, 2]]"),
                        new Example("points = [[3,3],[5,-1],[-2,4]], k = 2", "[[3, 3], [-2, 4]]")
                ),
                "heap", "quickselect", "sorting"));

        list.add(q("Task scheduler with cooldown",
                "Given tasks and a cooldown period, how would you find the minimum time to complete all tasks?",
                DifficultyLevel.SENIOR,
                "leastInterval", "tasks:char[],n:int", "int",
                AlgorithmCategory.HEAPS_AND_PRIORITY_QUEUES,
                List.of(
                        new Example("tasks = [\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"], n = 2", "8"),
                        new Example("tasks = [\"A\",\"A\",\"A\",\"B\",\"B\",\"B\"], n = 0", "6")
                ),
                "heap", "greedy", "scheduling"));

        list.add(q("Finding the median from a data stream",
                "How would you design a data structure that finds the median from a stream of integers in constant time?",
                DifficultyLevel.SENIOR,
                "MedianFinder", "", "class",
                AlgorithmCategory.HEAPS_AND_PRIORITY_QUEUES,
                List.of(
                        new Example("addNum(1), addNum(2), findMedian(), addNum(3), findMedian()", "findMedian() → 1.5, findMedian() → 2.0"),
                        new Example("addNum(6), findMedian(), addNum(10), findMedian()", "findMedian() → 6.0, findMedian() → 8.0")
                ),
                "heap", "design", "two-heaps"));
    }

    // ── Tries (2) ─────────────────────────────────────────────────────

    private static void addTries(List<Question> list) {
        list.add(q("Implementing a trie (prefix tree)",
                "How would you design a trie that supports insert, search, and prefix search?",
                DifficultyLevel.MID,
                "Trie", "", "class",
                AlgorithmCategory.TRIES,
                List.of(
                        new Example("insert(\"apple\"), search(\"apple\"), search(\"app\"), startsWith(\"app\")", "search → true, search → false, startsWith → true"),
                        new Example("insert(\"app\"), search(\"app\")", "search → true")
                ),
                "trie", "design", "strings"));

        list.add(q("Designing a word search II with trie",
                "Given a board and list of words, how would you find all words on the board using efficient prefix checks?",
                DifficultyLevel.SENIOR,
                "findWords", "board:char[][],words:string[]", "List<string>",
                AlgorithmCategory.TRIES,
                List.of(
                        new Example("board = [[\"o\",\"a\",\"a\",\"n\"],[\"e\",\"t\",\"a\",\"e\"],[\"i\",\"h\",\"k\",\"r\"],[\"i\",\"f\",\"l\",\"v\"]], words = [\"oath\",\"pea\",\"eat\",\"rain\"]", "[\"oath\", \"eat\"]"),
                        new Example("board = [[\"a\",\"b\"],[\"c\",\"d\"]], words = [\"abcb\"]", "[]")
                ),
                "trie", "backtracking", "matrix"));
    }

    // ── Intervals (3) ─────────────────────────────────────────────────

    private static void addIntervals(List<Question> list) {
        list.add(q("Merging overlapping intervals",
                "Given a list of intervals, how would you merge all overlapping ones?",
                DifficultyLevel.MID,
                "merge", "intervals:int[][]", "int[][]",
                AlgorithmCategory.INTERVALS,
                List.of(
                        new Example("intervals = [[1,3],[2,6],[8,10],[15,18]]", "[[1,6],[8,10],[15,18]]"),
                        new Example("intervals = [[1,4],[4,5]]", "[[1,5]]")
                ),
                "intervals", "sorting"));

        list.add(q("Inserting an interval into a list",
                "Given a list of non-overlapping intervals and a new interval, how would you insert and merge?",
                DifficultyLevel.MID,
                "insert", "intervals:int[][],newInterval:int[]", "int[][]",
                AlgorithmCategory.INTERVALS,
                List.of(
                        new Example("intervals = [[1,3],[6,9]], newInterval = [2,5]", "[[1,5],[6,9]]"),
                        new Example("intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]", "[[1,2],[3,10],[12,16]]")
                ),
                "intervals", "sorting"));

        list.add(q("Minimum arrows to burst balloons",
                "Given balloons with start and end points, how would you find the minimum arrows to burst all?",
                DifficultyLevel.MID,
                "findMinArrowShots", "points:int[][]", "int",
                AlgorithmCategory.INTERVALS,
                List.of(
                        new Example("points = [[10,16],[2,8],[1,6],[7,12]]", "2"),
                        new Example("points = [[1,2],[3,4],[5,6],[7,8]]", "4")
                ),
                "intervals", "greedy", "sorting"));
    }

    // ── Bit Manipulation (2) ──────────────────────────────────────────

    private static void addBitManipulation(List<Question> list) {
        list.add(q("Finding the single number (XOR trick)",
                "Given an array where every element appears twice except one, how would you find the single one?",
                DifficultyLevel.JUNIOR,
                "singleNumber", "nums:int[]", "int",
                AlgorithmCategory.BIT_MANIPULATION,
                List.of(
                        new Example("nums = [2, 2, 1]", "1"),
                        new Example("nums = [4, 1, 2, 1, 2]", "4")
                ),
                "bit-manipulation", "xor"));

        list.add(q("Counting number of 1 bits",
                "Given an integer, how would you count the number of 1 bits in its binary representation?",
                DifficultyLevel.JUNIOR,
                "hammingWeight", "n:int", "int",
                AlgorithmCategory.BIT_MANIPULATION,
                List.of(
                        new Example("n = 11 (binary: 1011)", "3"),
                        new Example("n = 128 (binary: 10000000)", "1")
                ),
                "bit-manipulation"));
    }

    // ── Union Find and Advanced Graph (2) ─────────────────────────────

    private static void addUnionFindAndAdvancedGraph(List<Question> list) {
        list.add(q("Implementing union find for connected components",
                "How would you use union-find to efficiently handle dynamic connectivity queries in a graph?",
                DifficultyLevel.SENIOR,
                "countComponents", "n:int,edges:int[][]", "int",
                AlgorithmCategory.GRAPHS_AND_MATRIX,
                List.of(
                        new Example("n = 5, edges = [[0,1],[1,2],[3,4]]", "2 components"),
                        new Example("n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]", "1 component")
                ),
                "union-find", "graph", "disjoint-set"));

        list.add(q("Finding minimum height trees in a graph",
                "Given an undirected tree, how would you find all minimum height trees by choosing different roots?",
                DifficultyLevel.SENIOR,
                "findMinHeightTrees", "n:int,edges:int[][]", "List<int>",
                AlgorithmCategory.GRAPHS_AND_MATRIX,
                List.of(
                        new Example("n = 4, edges = [[1,0],[1,2],[1,3]]", "[1]"),
                        new Example("n = 6, edges = [[3,0],[3,1],[3,2],[3,4],[5,4]]", "[3, 4]")
                ),
                "graph", "topological-sort", "bfs"));
    }

    // ── Monotonic Stack (1) ───────────────────────────────────────────

    private static void addMonotonicStack(List<Question> list) {
        list.add(q("Trapping rain water",
                "Given an array of heights representing bars, how would you compute how much water it can trap after raining?",
                DifficultyLevel.SENIOR,
                "trap", "height:int[]", "int",
                AlgorithmCategory.STACKS_AND_QUEUES,
                List.of(
                        new Example("height = [0,1,0,2,1,0,1,3,2,1,2,1]", "6"),
                        new Example("height = [4,2,0,3,2,5]", "9")
                ),
                "monotonic-stack", "two-pointers", "arrays"));
    }

    // ── Greedy (2) ─────────────────────────────────────────────────────

    private static void addGreedy(List<Question> list) {
        list.add(q("Determining if you can reach the last index",
                "Given an array where each element represents your maximum jump length from that position, walk me through how you'd determine if you can reach the last index starting from the first.",
                DifficultyLevel.MID,
                "canJump", "nums:int[]", "boolean",
                AlgorithmCategory.GREEDY,
                List.of(
                        new Example("nums = [2, 3, 1, 1, 4]", "true"),
                        new Example("nums = [3, 2, 1, 0, 4]", "false")
                ),
                "greedy", "dynamic-programming", "arrays"));

        list.add(q("Finding the starting gas station for a circular trip",
                "Given n gas stations in a circle with gas[i] fuel available and cost[i] fuel needed to reach the next station, how would you find the starting station index to complete the circuit, or determine it's impossible?",
                DifficultyLevel.MID,
                "canCompleteCircuit", "gas:int[],cost:int[]", "int",
                AlgorithmCategory.GREEDY,
                List.of(
                        new Example("gas = [1, 2, 3, 4, 5], cost = [3, 4, 5, 1, 2]", "3"),
                        new Example("gas = [2, 3, 4], cost = [3, 4, 3]", "-1")
                ),
                "greedy", "arrays"));
    }

    // ── Helper ────────────────────────────────────────────────────────

    private static Question q(String title, String content, DifficultyLevel difficulty,
                              List<Example> examples, String... tags) {
        return Question.builder()
                .title(title)
                .content(content)
                .category(QuestionCategory.CODING)
                .difficulty(difficulty)
                .examples(examples)
                .tags(List.of(tags))
                .build();
    }

    private static Question q(String title, String content, DifficultyLevel difficulty,
                              String methodName, String methodParams, String returnType,
                              AlgorithmCategory algorithmCategory,
                              List<Example> examples, String... tags) {
        return Question.builder()
                .title(title)
                .content(content)
                .category(QuestionCategory.CODING)
                .difficulty(difficulty)
                .methodName(methodName)
                .methodParams(methodParams)
                .returnType(returnType)
                .algorithmCategory(algorithmCategory)
                .examples(examples)
                .tags(List.of(tags))
                .build();
    }
}
