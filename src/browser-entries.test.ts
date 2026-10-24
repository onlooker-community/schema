import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// The package root re-exports validate.js, which reads the schema files with
// node:fs and imports ajv at load time. A browser bundle that imports
// anything from the root - roleOf included - therefore pulls in modules it
// cannot run. These subpaths are the entries a browser can use, and this
// file is what keeps them that way.
const BROWSER_ENTRIES = ["event-roles", "event-types"] as const;

const pkg = JSON.parse(
	readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as { exports: Record<string, { import?: string; types?: string }> };

// Every specifier a module loads at runtime. `import type` and
// `export type` are erased by tsc, so they are not followed.
function runtimeSpecifiers(source: string): string[] {
	const pattern =
		/^\s*(?:import|export)\s+(?!type\b)(?:[^"';]*?\s+from\s+)?["']([^"']+)["']/gm;
	return [...source.matchAll(pattern)].map((match) => match[1] as string);
}

// The non-relative specifiers reachable from one source file, following
// relative imports the way tsc's NodeNext output resolves them (.js -> .ts).
function reachableBareImports(entry: URL): string[] {
	const seen = new Set<string>();
	const bare = new Set<string>();
	const queue = [entry];
	while (queue.length > 0) {
		const file = queue.pop() as URL;
		if (seen.has(file.href)) continue;
		seen.add(file.href);
		for (const specifier of runtimeSpecifiers(readFileSync(file, "utf8"))) {
			if (specifier.startsWith(".")) {
				queue.push(new URL(specifier.replace(/\.js$/, ".ts"), file));
			} else {
				bare.add(specifier);
			}
		}
	}
	return [...bare];
}

describe("browser entries", () => {
	it.each(BROWSER_ENTRIES)("exports ./%s from its own built file", (name) => {
		expect(pkg.exports[`./${name}`]).toEqual({
			types: `./dist/${name}.d.ts`,
			import: `./dist/${name}.js`,
		});
		expect(existsSync(new URL(`./${name}.ts`, import.meta.url))).toBe(true);
	});

	it.each(BROWSER_ENTRIES)("./%s loads nothing outside the package", (name) => {
		expect(
			reachableBareImports(new URL(`./${name}.ts`, import.meta.url)),
		).toEqual([]);
	});

	// Proves the walk can see the problem at all: the root entry is the one
	// that reaches node built-ins, and if this ever passes empty the check
	// above is vacuous.
	it("finds the node built-ins the root entry reaches", () => {
		expect(
			reachableBareImports(new URL("./index.ts", import.meta.url)),
		).toEqual(expect.arrayContaining(["node:fs", "ajv/dist/2020.js"]));
	});
});
