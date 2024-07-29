import { NodePackageManager } from "projen/lib/javascript";
import { TypeScriptAppProject } from "projen/lib/typescript";

const project = new TypeScriptAppProject({
  defaultReleaseBranch: "main",
  name: "my-bmw-api",
  projenrcTs: true,
  packageManager: NodePackageManager.PNPM,
  jest: false,
  eslint: false,
  prettier: true,
  autoMerge: false,
  clobber: false,
  release: false,
  licensed: false,
  depsUpgrade: false,
  package: false,
  github: false,
  deps: [
    "effect",
    "@effect/cli",
    "@effect/schema",
    "@effect/platform",
    "@effect/platform-node",
  ],
});

project.addDevDeps("only-allow");
project.addScripts({
  preinstall: `only-allow ${project.package.packageManager}`,
});

project.addDevDeps("vitest@^1", "@vitest/coverage-v8@^1", "@effect/vitest");
project.testTask.reset("vitest --passWithNoTests --reporter verbose", {
  receiveArgs: true,
});

project.synth();
