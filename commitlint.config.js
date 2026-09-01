module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "refactor", "docs", "test", "chore", "ci", "build", "perf", "style", "revert"],
    ],
    "subject-case": [2, "never", ["upper-case", "pascal-case"]],
    "header-max-length": [2, "always", 100],
  },
};
