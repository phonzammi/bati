import { print, types } from "recast";
import { readFile } from "node:fs/promises";
import ts from "typescript";
import { parse } from "@typescript-eslint/typescript-estree";
import tsconfig from "./tsconfig.json" assert { type: "json" };

const ast = parse(
  await readFile("./files/tsconfig.json.ts", { encoding: "utf8" }),
  {
    loc: true,
    range: true,
  }
);

const refVikeFramework = parse("import.meta.VIKE_FRAMEWORK", {
  loc: true,
  range: true,
});

function looseJsonParse(obj, meta = {}) {
  obj = obj.replaceAll("import.meta", "VIKE_META");
  obj = `var VIKE_META = ${JSON.stringify(meta)};(${obj})`;

  obj = ts.transpile(obj, {
    ...tsconfig.compilerOptions,
    sourceMap: false,
  });

  return (0, eval)(obj);
}

types.visit(ast, {
  visitIfStatement(path) {
    let found = false;

    this.traverse(path.get("test"), {
      visitMemberExpression(path2) {
        if (
          types.astNodesAreEquivalent(
            path2.value,
            refVikeFramework.body[0].expression
          )
        ) {
          console.log("Found import.meta.VIKE_FRAMEWORK");
          found = true;
        }

        this.traverse(path2);
      },
    });

    if (found) {
      if (
        !looseJsonParse(print(path.value.test).code, {
          VIKE_FRAMEWORK: "solid",
        })
      ) {
        console.log("Deleting block");
        // remove the whole `if` block
        path.replace();
      } else {
        // remove the condition and keep the block
      }
    }

    this.traverse(path.get("consequent"));
  },
});

console.log(print(ast).code);