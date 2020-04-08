module.exports = {
  root: true,
  env: {
    "node": true
  },
  env: {
    node: true
  },
  extends: ["plugin:vue/essential", "eslint:recommended"],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "indent": [0, 2],
    "quotes": [1, "double"],
    "linebreak-style": [2, "unix"],
    "semi": [2, "always"],
    "no-irregular-whitespace": [0],
    "no-console": [1],
    "no-unused-vars": ["error", {
      "ignoreRestSiblings": true
    }],
    "space-unary-ops": [1, {
      "words": true,
      "nonwords": false
    }],
    "brace-style": [2, "1tbs", {
      "allowSingleLine": false
    }],
    "comma-spacing": [2, {
      "before": false,
      "after": true
    }],
    "comma-style": [2, "last"],
    "key-spacing": [2, {
      "beforeColon": false,
      "afterColon": true
    }],
    "lines-around-comment": [2, {
      "beforeBlockComment": true,
      "beforeLineComment": false,
      "afterBlockComment": false,
      "afterLineComment": false,
      "allowBlockStart": true,
      "allowObjectStart": true,
      "allowArrayStart": true
    }],
    "max-depth": [2, 4],
    "max-len": [1, 160, 2],
    "max-nested-callbacks": [2, 3],
    "max-params": [2, 8],
    "max-statements": [1, 30],
    "no-array-constructor": [2],
    "no-lonely-if": 2,
    "no-multiple-empty-lines": [2, {
      "max": 3,
      "maxEOF": 1
    }],
    "no-nested-ternary": 2,
    "no-spaced-func": 2,
    "no-trailing-spaces": 2,
    "no-unneeded-ternary": 2,
    "object-curly-spacing": [1, "always", {
      "objectsInObjects": true,
      "arraysInObjects": false
    }],
    "arrow-spacing": 2,
    "block-scoped-var": 2,
    "no-dupe-class-members": 2,
    "object-shorthand": [2, "always"],
    "array-bracket-spacing": [2, "never"],
    "operator-linebreak": [0, "after"],
    "semi-spacing": [2, {
      "before": false,
      "after": true
    }],
    "keyword-spacing": ["error"],
    "space-before-blocks": 2,
    "block-spacing": [2, "always"],
    "space-before-function-paren": [2, "never"],
    "space-in-parens": [2, "never"],
    "spaced-comment": [1, "always", {
      "exceptions": ["-", "*", "+"]
    }],
    "class-methods-use-this": 0
  },
  globals: {
    $vm: false
  },
  parserOptions: {
    parser: "babel-eslint",
    sourceType: "module",
    allowImportExportEverywhere: true,
    ecmaVersion: 6,
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  }
};