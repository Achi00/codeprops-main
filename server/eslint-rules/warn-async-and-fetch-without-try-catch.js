// warn-async-and-fetch-without-try-catch.js

function isInsideTryCatch(node) {
  let parent = node.parent;
  while (parent) {
    if (parent.type === 'TryStatement') {
      return true;
    }
    parent = parent.parent;
  }
  return false;
}

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "suggest using try-catch when using async functions or fetch",
      category: "Best Practices",
    },
    fixable: null,
    schema: []
  },

  create: function(context) {
    return {
      FunctionDeclaration(node) {
        if (node.async && !isInsideTryCatch(node)) {
          context.report({
            node,
            message: "Async functions should be wrapped in a try-catch block."
          });
        }
      },
      CallExpression(node) {
        if (node.callee.name === 'fetch' && !isInsideTryCatch(node)) {
          context.report({
            node,
            message: "Fetch calls should be wrapped in a try-catch block."
          });
        }
      }
    };
  }
};
