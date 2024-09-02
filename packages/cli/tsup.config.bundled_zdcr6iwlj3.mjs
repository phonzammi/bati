// tsup.config.ts
import { defineConfig } from "tsup";

// esbuild-bundle-all.ts
import { existsSync } from "node:fs";
import { cp, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { which } from "@batijs/core";
import { bold, cyan, green, yellow } from "colorette";
import { $ } from "execa";
var __injected_import_meta_url__ = "file:///home/magne/workspace/bati/packages/cli/esbuild-bundle-all.ts";
var __filename = fileURLToPath(__injected_import_meta_url__);
var __dirname = dirname(__filename);
async function getRecursivePackages() {
  const pnpmPath = await which("pnpm");
  const { stdout } = await $`${pnpmPath} m ls --json --depth=-1`;
  return JSON.parse(stdout);
}
async function getBatiPackages() {
  const batiPackages = (await getRecursivePackages()).filter(
    (pkg) => pkg.name.startsWith("@batijs/") && pkg.path.includes("boilerplates")
  );
  return batiPackages.map((pkg) => pkg.path);
}
async function* getBatiPackageJson() {
  for (const path of await getBatiPackages()) {
    const currentPath = join(path, "package.json");
    const content = JSON.parse(await readFile(currentPath, "utf-8"));
    yield [currentPath, content];
  }
}
async function boilerplateFilesToCopy() {
  const arr = [];
  for await (const [filepath, packageJson] of getBatiPackageJson()) {
    assertBatiConfig(packageJson, filepath);
    const subfolders = [];
    const distFolder = existsSync(join(dirname(filepath), "dist"));
    const hooksFolder = existsSync(join(dirname(filepath), "dist", "hooks"));
    const filesFolder = existsSync(join(dirname(filepath), "dist", "files"));
    if (filesFolder) {
      subfolders.push("files");
    }
    if (hooksFolder) {
      subfolders.push("hooks");
    }
    arr.push({
      folder: packageJson.name,
      source: distFolder ? join(dirname(filepath), "dist") : void 0,
      config: packageJson.bati,
      subfolders
    });
  }
  return arr;
}
function assertBatiConfig(packageJson, filepath) {
  if (packageJson.bati === false) return;
  if (!packageJson.bati) {
    console.warn(`${yellow("WARN")}: Missing '${bold("bati")}' property in ${cyan(filepath)}`);
    return;
  }
}
function formatCopiedToDef(boilerplates) {
  return boilerplates.map((bl) => ({
    config: bl.config,
    folder: bl.folder,
    subfolders: bl.subfolders
  }));
}
async function createBoilerplatesJson(boilerplates) {
  const f = join(__dirname, "dist", "boilerplates", "boilerplates.json");
  await writeFile(f, JSON.stringify(formatCopiedToDef(boilerplates), void 0, 2), {
    encoding: "utf-8"
  });
  return stat(f);
}
function readableFileSize(size) {
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let i = 0;
  while (size >= 1024) {
    size /= 1024;
    ++i;
  }
  return size.toFixed(2) + " " + units[i];
}
var esbuildPlugin = {
  name: "BLP",
  setup(build) {
    build.onEnd(async () => {
      const boilerplates = await boilerplateFilesToCopy();
      const folderCreated = /* @__PURE__ */ new Set();
      for (const bl of boilerplates) {
        const dest = join(__dirname, "dist", "boilerplates", bl.folder);
        if (!folderCreated.has(dest)) {
          folderCreated.add(dest);
          await mkdir(dest, { recursive: true });
        }
        if (bl.source) {
          await cp(bl.source, dest, {
            dereference: true,
            force: true,
            recursive: true
          });
        }
        console.log(`${yellow("BLP")} ${join("dist", "boilerplates")}/${cyan(bl.folder)}`);
      }
      const stats = await createBoilerplatesJson(boilerplates);
      console.log(
        `${yellow("BLP")} ${join("dist", "boilerplates", "boilerplates.json")} ${green(readableFileSize(stats.size))}`
      );
    });
  }
};
var esbuild_bundle_all_default = esbuildPlugin;

// tsup.config.ts
import { purgePolyfills } from "unplugin-purge-polyfills";
var tsup_config_default = defineConfig({
  entry: ["index.ts"],
  format: ["esm"],
  outDir: "./dist",
  clean: true,
  bundle: true,
  esbuildPlugins: [esbuild_bundle_all_default, purgePolyfills.esbuild({})],
  platform: "node",
  banner: {
    js: "#!/usr/bin/env node"
  }
});
export {
  tsup_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidHN1cC5jb25maWcudHMiLCAiZXNidWlsZC1idW5kbGUtYWxsLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX2luamVjdGVkX2ZpbGVuYW1lX18gPSBcIi9ob21lL21hZ25lL3dvcmtzcGFjZS9iYXRpL3BhY2thZ2VzL2NsaS90c3VwLmNvbmZpZy50c1wiO2NvbnN0IF9faW5qZWN0ZWRfZGlybmFtZV9fID0gXCIvaG9tZS9tYWduZS93b3Jrc3BhY2UvYmF0aS9wYWNrYWdlcy9jbGlcIjtjb25zdCBfX2luamVjdGVkX2ltcG9ydF9tZXRhX3VybF9fID0gXCJmaWxlOi8vL2hvbWUvbWFnbmUvd29ya3NwYWNlL2JhdGkvcGFja2FnZXMvY2xpL3RzdXAuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInRzdXBcIjtcbmltcG9ydCBlc2J1aWxkQnVuZGxlQWxsUGx1Z2luIGZyb20gXCIuL2VzYnVpbGQtYnVuZGxlLWFsbC5qc1wiO1xuaW1wb3J0IHsgcHVyZ2VQb2x5ZmlsbHMgfSBmcm9tIFwidW5wbHVnaW4tcHVyZ2UtcG9seWZpbGxzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGVudHJ5OiBbXCJpbmRleC50c1wiXSxcbiAgZm9ybWF0OiBbXCJlc21cIl0sXG4gIG91dERpcjogXCIuL2Rpc3RcIixcbiAgY2xlYW46IHRydWUsXG4gIGJ1bmRsZTogdHJ1ZSxcbiAgZXNidWlsZFBsdWdpbnM6IFtlc2J1aWxkQnVuZGxlQWxsUGx1Z2luLCBwdXJnZVBvbHlmaWxscy5lc2J1aWxkKHt9KV0sXG4gIHBsYXRmb3JtOiBcIm5vZGVcIixcbiAgYmFubmVyOiB7XG4gICAganM6IFwiIyEvdXNyL2Jpbi9lbnYgbm9kZVwiLFxuICB9LFxufSk7XG4iLCAiY29uc3QgX19pbmplY3RlZF9maWxlbmFtZV9fID0gXCIvaG9tZS9tYWduZS93b3Jrc3BhY2UvYmF0aS9wYWNrYWdlcy9jbGkvZXNidWlsZC1idW5kbGUtYWxsLnRzXCI7Y29uc3QgX19pbmplY3RlZF9kaXJuYW1lX18gPSBcIi9ob21lL21hZ25lL3dvcmtzcGFjZS9iYXRpL3BhY2thZ2VzL2NsaVwiO2NvbnN0IF9faW5qZWN0ZWRfaW1wb3J0X21ldGFfdXJsX18gPSBcImZpbGU6Ly8vaG9tZS9tYWduZS93b3Jrc3BhY2UvYmF0aS9wYWNrYWdlcy9jbGkvZXNidWlsZC1idW5kbGUtYWxsLnRzXCI7aW1wb3J0IHsgZXhpc3RzU3luYyB9IGZyb20gXCJub2RlOmZzXCI7XG5pbXBvcnQgeyBjcCwgbWtkaXIsIHJlYWRGaWxlLCBzdGF0LCB3cml0ZUZpbGUgfSBmcm9tIFwibm9kZTpmcy9wcm9taXNlc1wiO1xuaW1wb3J0IHsgZGlybmFtZSwgam9pbiB9IGZyb20gXCJub2RlOnBhdGhcIjtcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tIFwibm9kZTp1cmxcIjtcbmltcG9ydCB7IHdoaWNoIH0gZnJvbSBcIkBiYXRpanMvY29yZVwiO1xuaW1wb3J0IHsgYm9sZCwgY3lhbiwgZ3JlZW4sIHllbGxvdyB9IGZyb20gXCJjb2xvcmV0dGVcIjtcbmltcG9ydCB0eXBlIHsgUGx1Z2luIH0gZnJvbSBcImVzYnVpbGRcIjtcbmltcG9ydCB7ICQgfSBmcm9tIFwiZXhlY2FcIjtcbmltcG9ydCB0eXBlIHsgQmF0aUNvbmZpZywgQm9pbGVycGxhdGVEZWYsIFRvQmVDb3BpZWQgfSBmcm9tIFwiLi90eXBlcy5qc1wiO1xuXG5jb25zdCBfX2ZpbGVuYW1lID0gZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpO1xuY29uc3QgX19kaXJuYW1lID0gZGlybmFtZShfX2ZpbGVuYW1lKTtcblxuaW50ZXJmYWNlIFBucG1QYWNrYWdlSW5mbyB7XG4gIG5hbWU6IHN0cmluZztcbiAgdmVyc2lvbjogc3RyaW5nO1xuICBwYXRoOiBzdHJpbmc7XG4gIHByaXZhdGU6IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBTaW1wbGVQYWNrYWdlSnNvbiB7XG4gIGJhdGk/OiBCYXRpQ29uZmlnIHwgZmFsc2U7XG4gIG5hbWU6IHN0cmluZztcbn1cblxuYXN5bmMgZnVuY3Rpb24gZ2V0UmVjdXJzaXZlUGFja2FnZXMoKSB7XG4gIGNvbnN0IHBucG1QYXRoID0gYXdhaXQgd2hpY2goXCJwbnBtXCIpO1xuICBjb25zdCB7IHN0ZG91dCB9ID0gYXdhaXQgJGAke3BucG1QYXRofSBtIGxzIC0tanNvbiAtLWRlcHRoPS0xYDtcblxuICByZXR1cm4gSlNPTi5wYXJzZShzdGRvdXQpIGFzIFBucG1QYWNrYWdlSW5mb1tdO1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRCYXRpUGFja2FnZXMoKSB7XG4gIGNvbnN0IGJhdGlQYWNrYWdlcyA9IChhd2FpdCBnZXRSZWN1cnNpdmVQYWNrYWdlcygpKS5maWx0ZXIoXG4gICAgKHBrZykgPT4gcGtnLm5hbWUuc3RhcnRzV2l0aChcIkBiYXRpanMvXCIpICYmIHBrZy5wYXRoLmluY2x1ZGVzKFwiYm9pbGVycGxhdGVzXCIpLFxuICApO1xuXG4gIHJldHVybiBiYXRpUGFja2FnZXMubWFwKChwa2cpID0+IHBrZy5wYXRoKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24qIGdldEJhdGlQYWNrYWdlSnNvbigpIHtcbiAgZm9yIChjb25zdCBwYXRoIG9mIGF3YWl0IGdldEJhdGlQYWNrYWdlcygpKSB7XG4gICAgY29uc3QgY3VycmVudFBhdGggPSBqb2luKHBhdGgsIFwicGFja2FnZS5qc29uXCIpO1xuXG4gICAgY29uc3QgY29udGVudCA9IEpTT04ucGFyc2UoYXdhaXQgcmVhZEZpbGUoY3VycmVudFBhdGgsIFwidXRmLThcIikpO1xuICAgIHlpZWxkIFtjdXJyZW50UGF0aCwgY29udGVudF0gYXMgY29uc3Q7XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gYm9pbGVycGxhdGVGaWxlc1RvQ29weSgpIHtcbiAgY29uc3QgYXJyOiBUb0JlQ29waWVkW10gPSBbXTtcbiAgZm9yIGF3YWl0IChjb25zdCBbZmlsZXBhdGgsIHBhY2thZ2VKc29uXSBvZiBnZXRCYXRpUGFja2FnZUpzb24oKSkge1xuICAgIGFzc2VydEJhdGlDb25maWcocGFja2FnZUpzb24sIGZpbGVwYXRoKTtcblxuICAgIGNvbnN0IHN1YmZvbGRlcnM6IHN0cmluZ1tdID0gW107XG4gICAgY29uc3QgZGlzdEZvbGRlciA9IGV4aXN0c1N5bmMoam9pbihkaXJuYW1lKGZpbGVwYXRoKSwgXCJkaXN0XCIpKTtcbiAgICBjb25zdCBob29rc0ZvbGRlciA9IGV4aXN0c1N5bmMoam9pbihkaXJuYW1lKGZpbGVwYXRoKSwgXCJkaXN0XCIsIFwiaG9va3NcIikpO1xuICAgIGNvbnN0IGZpbGVzRm9sZGVyID0gZXhpc3RzU3luYyhqb2luKGRpcm5hbWUoZmlsZXBhdGgpLCBcImRpc3RcIiwgXCJmaWxlc1wiKSk7XG5cbiAgICBpZiAoZmlsZXNGb2xkZXIpIHtcbiAgICAgIHN1YmZvbGRlcnMucHVzaChcImZpbGVzXCIpO1xuICAgIH1cblxuICAgIGlmIChob29rc0ZvbGRlcikge1xuICAgICAgc3ViZm9sZGVycy5wdXNoKFwiaG9va3NcIik7XG4gICAgfVxuXG4gICAgYXJyLnB1c2goe1xuICAgICAgZm9sZGVyOiBwYWNrYWdlSnNvbi5uYW1lLFxuICAgICAgc291cmNlOiBkaXN0Rm9sZGVyID8gam9pbihkaXJuYW1lKGZpbGVwYXRoKSwgXCJkaXN0XCIpIDogdW5kZWZpbmVkLFxuICAgICAgY29uZmlnOiBwYWNrYWdlSnNvbi5iYXRpLFxuICAgICAgc3ViZm9sZGVycyxcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gYXJyO1xufVxuXG5mdW5jdGlvbiBhc3NlcnRCYXRpQ29uZmlnKHBhY2thZ2VKc29uOiBTaW1wbGVQYWNrYWdlSnNvbiwgZmlsZXBhdGg6IHN0cmluZykge1xuICBpZiAocGFja2FnZUpzb24uYmF0aSA9PT0gZmFsc2UpIHJldHVybjtcbiAgaWYgKCFwYWNrYWdlSnNvbi5iYXRpKSB7XG4gICAgY29uc29sZS53YXJuKGAke3llbGxvdyhcIldBUk5cIil9OiBNaXNzaW5nICcke2JvbGQoXCJiYXRpXCIpfScgcHJvcGVydHkgaW4gJHtjeWFuKGZpbGVwYXRoKX1gKTtcbiAgICByZXR1cm47XG4gIH1cbn1cblxuZnVuY3Rpb24gZm9ybWF0Q29waWVkVG9EZWYoYm9pbGVycGxhdGVzOiBUb0JlQ29waWVkW10pOiBCb2lsZXJwbGF0ZURlZltdIHtcbiAgcmV0dXJuIGJvaWxlcnBsYXRlcy5tYXAoKGJsKSA9PiAoe1xuICAgIGNvbmZpZzogYmwuY29uZmlnLFxuICAgIGZvbGRlcjogYmwuZm9sZGVyLFxuICAgIHN1YmZvbGRlcnM6IGJsLnN1YmZvbGRlcnMsXG4gIH0pKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlQm9pbGVycGxhdGVzSnNvbihib2lsZXJwbGF0ZXM6IFRvQmVDb3BpZWRbXSkge1xuICBjb25zdCBmID0gam9pbihfX2Rpcm5hbWUsIFwiZGlzdFwiLCBcImJvaWxlcnBsYXRlc1wiLCBcImJvaWxlcnBsYXRlcy5qc29uXCIpO1xuXG4gIGF3YWl0IHdyaXRlRmlsZShmLCBKU09OLnN0cmluZ2lmeShmb3JtYXRDb3BpZWRUb0RlZihib2lsZXJwbGF0ZXMpLCB1bmRlZmluZWQsIDIpLCB7XG4gICAgZW5jb2Rpbmc6IFwidXRmLThcIixcbiAgfSk7XG5cbiAgcmV0dXJuIHN0YXQoZik7XG59XG5cbmZ1bmN0aW9uIHJlYWRhYmxlRmlsZVNpemUoc2l6ZTogbnVtYmVyKSB7XG4gIGNvbnN0IHVuaXRzID0gW1wiQlwiLCBcIktCXCIsIFwiTUJcIiwgXCJHQlwiLCBcIlRCXCIsIFwiUEJcIiwgXCJFQlwiLCBcIlpCXCIsIFwiWUJcIl07XG4gIGxldCBpID0gMDtcbiAgd2hpbGUgKHNpemUgPj0gMTAyNCkge1xuICAgIHNpemUgLz0gMTAyNDtcbiAgICArK2k7XG4gIH1cbiAgcmV0dXJuIHNpemUudG9GaXhlZCgyKSArIFwiIFwiICsgdW5pdHNbaV07XG59XG5cbi8vIFRPRE86IGFzc2VydCBhbGwgcnVsZXMgbWVzc2FnZXMgYXJlIGltcGxlbWVudGVkXG5jb25zdCBlc2J1aWxkUGx1Z2luOiBQbHVnaW4gPSB7XG4gIG5hbWU6IFwiQkxQXCIsXG4gIHNldHVwKGJ1aWxkKSB7XG4gICAgYnVpbGQub25FbmQoYXN5bmMgKCkgPT4ge1xuICAgICAgY29uc3QgYm9pbGVycGxhdGVzID0gYXdhaXQgYm9pbGVycGxhdGVGaWxlc1RvQ29weSgpO1xuICAgICAgY29uc3QgZm9sZGVyQ3JlYXRlZCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXG4gICAgICBmb3IgKGNvbnN0IGJsIG9mIGJvaWxlcnBsYXRlcykge1xuICAgICAgICBjb25zdCBkZXN0ID0gam9pbihfX2Rpcm5hbWUsIFwiZGlzdFwiLCBcImJvaWxlcnBsYXRlc1wiLCBibC5mb2xkZXIpO1xuXG4gICAgICAgIGlmICghZm9sZGVyQ3JlYXRlZC5oYXMoZGVzdCkpIHtcbiAgICAgICAgICBmb2xkZXJDcmVhdGVkLmFkZChkZXN0KTtcbiAgICAgICAgICBhd2FpdCBta2RpcihkZXN0LCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChibC5zb3VyY2UpIHtcbiAgICAgICAgICBhd2FpdCBjcChibC5zb3VyY2UsIGRlc3QsIHtcbiAgICAgICAgICAgIGRlcmVmZXJlbmNlOiB0cnVlLFxuICAgICAgICAgICAgZm9yY2U6IHRydWUsXG4gICAgICAgICAgICByZWN1cnNpdmU6IHRydWUsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyhgJHt5ZWxsb3coXCJCTFBcIil9ICR7am9pbihcImRpc3RcIiwgXCJib2lsZXJwbGF0ZXNcIil9LyR7Y3lhbihibC5mb2xkZXIpfWApO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzdGF0cyA9IGF3YWl0IGNyZWF0ZUJvaWxlcnBsYXRlc0pzb24oYm9pbGVycGxhdGVzKTtcbiAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICBgJHt5ZWxsb3coXCJCTFBcIil9ICR7am9pbihcImRpc3RcIiwgXCJib2lsZXJwbGF0ZXNcIiwgXCJib2lsZXJwbGF0ZXMuanNvblwiKX0gJHtncmVlbihyZWFkYWJsZUZpbGVTaXplKHN0YXRzLnNpemUpKX1gLFxuICAgICAgKTtcbiAgICB9KTtcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGVzYnVpbGRQbHVnaW47XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW1RLFNBQVMsb0JBQW9COzs7QUNBZixTQUFTLGtCQUFrQjtBQUM1UyxTQUFTLElBQUksT0FBTyxVQUFVLE1BQU0saUJBQWlCO0FBQ3JELFNBQVMsU0FBUyxZQUFZO0FBQzlCLFNBQVMscUJBQXFCO0FBQzlCLFNBQVMsYUFBYTtBQUN0QixTQUFTLE1BQU0sTUFBTSxPQUFPLGNBQWM7QUFFMUMsU0FBUyxTQUFTO0FBUG1KLElBQU0sK0JBQStCO0FBVTFNLElBQU0sYUFBYSxjQUFjLDRCQUFlO0FBQ2hELElBQU0sWUFBWSxRQUFRLFVBQVU7QUFjcEMsZUFBZSx1QkFBdUI7QUFDcEMsUUFBTSxXQUFXLE1BQU0sTUFBTSxNQUFNO0FBQ25DLFFBQU0sRUFBRSxPQUFPLElBQUksTUFBTSxJQUFJLFFBQVE7QUFFckMsU0FBTyxLQUFLLE1BQU0sTUFBTTtBQUMxQjtBQUVBLGVBQWUsa0JBQWtCO0FBQy9CLFFBQU0sZ0JBQWdCLE1BQU0scUJBQXFCLEdBQUc7QUFBQSxJQUNsRCxDQUFDLFFBQVEsSUFBSSxLQUFLLFdBQVcsVUFBVSxLQUFLLElBQUksS0FBSyxTQUFTLGNBQWM7QUFBQSxFQUM5RTtBQUVBLFNBQU8sYUFBYSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUk7QUFDM0M7QUFFQSxnQkFBZ0IscUJBQXFCO0FBQ25DLGFBQVcsUUFBUSxNQUFNLGdCQUFnQixHQUFHO0FBQzFDLFVBQU0sY0FBYyxLQUFLLE1BQU0sY0FBYztBQUU3QyxVQUFNLFVBQVUsS0FBSyxNQUFNLE1BQU0sU0FBUyxhQUFhLE9BQU8sQ0FBQztBQUMvRCxVQUFNLENBQUMsYUFBYSxPQUFPO0FBQUEsRUFDN0I7QUFDRjtBQUVBLGVBQWUseUJBQXlCO0FBQ3RDLFFBQU0sTUFBb0IsQ0FB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
