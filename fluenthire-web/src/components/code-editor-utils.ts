const LANGUAGES = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "ruby", label: "Ruby" },
  { value: "php", label: "PHP" },
] as const;

const LANGUAGE_MAP: Record<string, string> = {
  JAVA: "java",
  PYTHON: "python",
  JAVASCRIPT: "javascript",
  TYPESCRIPT: "typescript",
  CSHARP: "csharp",
  GO: "go",
  RUST: "rust",
  CPP: "cpp",
  RUBY: "ruby",
  PHP: "php",
  REACT: "typescript",
  NODE_JS: "javascript",
  AWS: "python",
  SQL: "python",
};

export function getDefaultLanguage(mainLanguage: string | null): string {
  if (!mainLanguage) return "python";
  return LANGUAGE_MAP[mainLanguage] ?? "python";
}

export function getLanguageLabel(langId: string): string {
  return LANGUAGES.find((l) => l.value === langId)?.label ?? langId;
}

const HINT =
  "Your code won't be executed — pseudocode is fine, focus on your logic.";

const TYPE_MAP: Record<string, Record<string, string>> = {
  java: {
    int: "int",
    "int[]": "int[]",
    "int[][]": "int[][]",
    string: "String",
    "string[]": "String[]",
    "char[]": "char[]",
    "char[][]": "char[][]",
    boolean: "boolean",
    double: "double",
    "List<int>": "List<Integer>",
    "List<string>": "List<String>",
    "List<List<int>>": "List<List<Integer>>",
    "List<List<string>>": "List<List<String>>",
    ListNode: "ListNode",
    "ListNode[]": "ListNode[]",
    TreeNode: "TreeNode",
    Node: "Node",
    void: "void",
  },
  python: {
    int: "int",
    "int[]": "list[int]",
    "int[][]": "list[list[int]]",
    string: "str",
    "string[]": "list[str]",
    "char[]": "list[str]",
    "char[][]": "list[list[str]]",
    boolean: "bool",
    double: "float",
    "List<int>": "list[int]",
    "List<string>": "list[str]",
    "List<List<int>>": "list[list[int]]",
    "List<List<string>>": "list[list[str]]",
    ListNode: "ListNode",
    "ListNode[]": "list[ListNode]",
    TreeNode: "TreeNode",
    Node: "Node",
    void: "None",
  },
  typescript: {
    int: "number",
    "int[]": "number[]",
    "int[][]": "number[][]",
    string: "string",
    "string[]": "string[]",
    "char[]": "string[]",
    "char[][]": "string[][]",
    boolean: "boolean",
    double: "number",
    "List<int>": "number[]",
    "List<string>": "string[]",
    "List<List<int>>": "number[][]",
    "List<List<string>>": "string[][]",
    ListNode: "ListNode | null",
    "ListNode[]": "(ListNode | null)[]",
    TreeNode: "TreeNode | null",
    Node: "Node | null",
    void: "void",
  },
  javascript: {},
  cpp: {
    int: "int",
    "int[]": "vector<int>",
    "int[][]": "vector<vector<int>>",
    string: "string",
    "string[]": "vector<string>",
    "char[]": "vector<char>",
    "char[][]": "vector<vector<char>>",
    boolean: "bool",
    double: "double",
    "List<int>": "vector<int>",
    "List<string>": "vector<string>",
    "List<List<int>>": "vector<vector<int>>",
    "List<List<string>>": "vector<vector<string>>",
    ListNode: "ListNode*",
    "ListNode[]": "vector<ListNode*>",
    TreeNode: "TreeNode*",
    Node: "Node*",
    void: "void",
  },
  csharp: {
    int: "int",
    "int[]": "int[]",
    "int[][]": "int[][]",
    string: "string",
    "string[]": "string[]",
    "char[]": "char[]",
    "char[][]": "char[][]",
    boolean: "bool",
    double: "double",
    "List<int>": "IList<int>",
    "List<string>": "IList<string>",
    "List<List<int>>": "IList<IList<int>>",
    "List<List<string>>": "IList<IList<string>>",
    ListNode: "ListNode",
    "ListNode[]": "ListNode[]",
    TreeNode: "TreeNode",
    Node: "Node",
    void: "void",
  },
  go: {
    int: "int",
    "int[]": "[]int",
    "int[][]": "[][]int",
    string: "string",
    "string[]": "[]string",
    "char[]": "[]byte",
    "char[][]": "[][]byte",
    boolean: "bool",
    double: "float64",
    "List<int>": "[]int",
    "List<string>": "[]string",
    "List<List<int>>": "[][]int",
    "List<List<string>>": "[][]string",
    ListNode: "*ListNode",
    "ListNode[]": "[]*ListNode",
    TreeNode: "*TreeNode",
    Node: "*Node",
    void: "",
  },
  rust: {
    int: "i32",
    "int[]": "Vec<i32>",
    "int[][]": "Vec<Vec<i32>>",
    string: "String",
    "string[]": "Vec<String>",
    "char[]": "Vec<char>",
    "char[][]": "Vec<Vec<char>>",
    boolean: "bool",
    double: "f64",
    "List<int>": "Vec<i32>",
    "List<string>": "Vec<String>",
    "List<List<int>>": "Vec<Vec<i32>>",
    "List<List<string>>": "Vec<Vec<String>>",
    ListNode: "Option<Box<ListNode>>",
    "ListNode[]": "Vec<Option<Box<ListNode>>>",
    TreeNode: "Option<Rc<RefCell<TreeNode>>>",
    Node: "Node",
    void: "",
  },
  ruby: {},
  php: {
    int: "int",
    "int[]": "array",
    "int[][]": "array",
    string: "string",
    "string[]": "array",
    "char[]": "array",
    "char[][]": "array",
    boolean: "bool",
    double: "float",
    "List<int>": "array",
    "List<string>": "array",
    "List<List<int>>": "array",
    "List<List<string>>": "array",
    ListNode: "?ListNode",
    "ListNode[]": "array",
    TreeNode: "?TreeNode",
    Node: "?Node",
    void: "void",
  },
};

function toSnakeCase(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    .toLowerCase();
}

function toPascalCase(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

interface ParsedParam {
  name: string;
  type: string;
}

function parseParams(methodParams: string): ParsedParam[] {
  if (!methodParams) return [];
  return methodParams.split(",").map((p) => {
    const [name, type] = p.split(":");
    return { name: name.trim(), type: type.trim() };
  });
}

function mapType(langId: string, genericType: string): string {
  return TYPE_MAP[langId]?.[genericType] ?? genericType;
}

function formatMethodName(langId: string, name: string): string {
  if (langId === "rust" || langId === "ruby") return toSnakeCase(name);
  if (langId === "csharp") return toPascalCase(name);
  return name;
}

const CPP_REF_TYPES = new Set([
  "vector<int>",
  "vector<vector<int>>",
  "vector<string>",
  "vector<vector<string>>",
  "vector<char>",
  "vector<vector<char>>",
  "vector<ListNode*>",
  "vector<Option<Box<ListNode>>>",
  "string",
]);

function buildParams(
  langId: string,
  parsed: ParsedParam[]
): string {
  return parsed
    .map((p) => {
      const mapped = mapType(langId, p.type);

      switch (langId) {
        case "java":
        case "csharp":
          return `${mapped} ${p.name}`;
        case "python":
          return `${p.name}: ${mapped}`;
        case "typescript":
          return `${p.name}: ${mapped}`;
        case "javascript":
        case "ruby":
          return p.name;
        case "cpp":
          if (CPP_REF_TYPES.has(mapped)) return `${mapped}& ${p.name}`;
          return `${mapped} ${p.name}`;
        case "go":
          return `${p.name} ${mapped}`;
        case "rust":
          return `${p.name}: ${mapped}`;
        case "php":
          return `${mapped} $${p.name}`;
        default:
          return p.name;
      }
    })
    .join(", ");
}

function buildClassTemplate(langId: string, className: string): string {
  switch (langId) {
    case "java":
      return `// ${HINT}

class ${className} {
    public ${className}() {
        // Write your solution here

    }
}`;
    case "python":
      return `# ${HINT}

class ${className}:
    def __init__(self):
        # Write your solution here
        pass`;
    case "javascript":
      return `// ${HINT}

class ${className} {
    constructor() {
        // Write your solution here

    }
}`;
    case "typescript":
      return `// ${HINT}

class ${className} {
    constructor() {
        // Write your solution here

    }
}`;
    case "cpp":
      return `// ${HINT}

class ${className} {
public:
    ${className}() {
        // Write your solution here

    }
};`;
    case "csharp":
      return `// ${HINT}

public class ${className} {
    public ${className}() {
        // Write your solution here

    }
}`;
    case "go":
      return `// ${HINT}

package main

type ${className} struct {

}

func Constructor() ${className} {
    // Write your solution here

}`;
    case "rust":
      return `// ${HINT}

struct ${className} {

}

impl ${className} {
    fn new() -> Self {
        // Write your solution here

    }
}`;
    case "ruby":
      return `# ${HINT}

class ${className}
    def initialize
        # Write your solution here

    end
end`;
    case "php":
      return `// ${HINT}

<?php

class ${className} {
    public function __construct() {
        // Write your solution here

    }
}`;
    default:
      return "";
  }
}

function buildFunctionTemplate(
  langId: string,
  methodName: string,
  params: string,
  returnType: string
): string {
  const name = formatMethodName(langId, methodName);
  const mapped = mapType(langId, returnType);

  switch (langId) {
    case "java":
      return `// ${HINT}

class Solution {
    public ${mapped} ${name}(${params}) {
        // Write your solution here

    }
}`;
    case "python":
      return `# ${HINT}

class Solution:
    def ${name}(self${params ? ", " + params : ""}) -> ${mapped}:
        # Write your solution here
        pass`;
    case "javascript":
      return `// ${HINT}

function ${name}(${params}) {
    // Write your solution here

}`;
    case "typescript":
      return `// ${HINT}

function ${name}(${params}): ${mapped} {
    // Write your solution here

}`;
    case "cpp":
      return `// ${HINT}

#include <vector>
using namespace std;

class Solution {
public:
    ${mapped} ${name}(${params}) {
        // Write your solution here

    }
};`;
    case "csharp":
      return `// ${HINT}

public class Solution {
    public ${mapped} ${name}(${params}) {
        // Write your solution here

    }
}`;
    case "go": {
      const retPart = mapped ? ` ${mapped}` : "";
      return `// ${HINT}

package main

func ${name}(${params})${retPart} {
    // Write your solution here

}`;
    }
    case "rust": {
      const retPart = mapped ? ` -> ${mapped}` : "";
      return `// ${HINT}

impl Solution {
    pub fn ${name}(${params})${retPart} {
        // Write your solution here

    }
}`;
    }
    case "ruby":
      return `# ${HINT}

def ${name}(${params})
    # Write your solution here

end`;
    case "php":
      return `// ${HINT}

<?php

function ${name}(${params}): ${mapped} {
    // Write your solution here

}`;
    default:
      return "";
  }
}

const LANGUAGE_TEMPLATES: Record<string, string> = {
  java: `// ${HINT}

class Solution {
    public int[] solve(int[] nums, int target) {
        // Write your solution here

    }
}`,
  python: `# ${HINT}

class Solution:
    def solve(self, nums: list[int], target: int) -> list[int]:
        # Write your solution here
        pass`,
  javascript: `// ${HINT}

function solve(nums, target) {
    // Write your solution here

}`,
  typescript: `// ${HINT}

function solve(nums: number[], target: number): number[] {
    // Write your solution here

}`,
  cpp: `// ${HINT}

#include <vector>
using namespace std;

class Solution {
public:
    vector<int> solve(vector<int>& nums, int target) {
        // Write your solution here

    }
};`,
  csharp: `// ${HINT}

public class Solution {
    public int[] Solve(int[] nums, int target) {
        // Write your solution here

    }
}`,
  go: `// ${HINT}

package main

func solve(nums []int, target int) []int {
    // Write your solution here

}`,
  rust: `// ${HINT}

impl Solution {
    pub fn solve(nums: Vec<i32>, target: i32) -> Vec<i32> {
        // Write your solution here

    }
}`,
  ruby: `# ${HINT}

def solve(nums, target)
    # Write your solution here

end`,
  php: `// ${HINT}

<?php

function solve(array $nums, int $target): array {
    // Write your solution here

}`,
};

export function getQuestionTemplate(
  langId: string,
  meta?: {
    methodName: string | null;
    methodParams: string | null;
    returnType: string | null;
  } | null
): string {
  if (!meta || !meta.methodName) {
    return LANGUAGE_TEMPLATES[langId] ?? "";
  }

  if (meta.returnType === "class") {
    return buildClassTemplate(langId, meta.methodName);
  }

  const parsed = parseParams(meta.methodParams ?? "");
  const params = buildParams(langId, parsed);
  const returnType = meta.returnType ?? "void";

  return buildFunctionTemplate(langId, meta.methodName, params, returnType);
}

export function getLanguageTemplate(langId: string): string {
  return getQuestionTemplate(langId);
}

export { LANGUAGES };
