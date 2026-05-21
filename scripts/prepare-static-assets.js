#!/usr/bin/env node
import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");
const SCHEMAS_SRC = join(ROOT, "schemas");
const SCHEMAS_DEST = join(PUBLIC, "schemas");

rmSync(SCHEMAS_DEST, { recursive: true, force: true });
mkdirSync(SCHEMAS_DEST, { recursive: true });
cpSync(SCHEMAS_SRC, SCHEMAS_DEST, { recursive: true });

console.log(`prepared static assets: ${SCHEMAS_DEST}`);
