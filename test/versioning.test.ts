import {expect, test} from 'vitest';
import {readFileSync} from 'fs';

test('version of package.json is the same as in Cargo.toml', () => {
    const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));
    const cargoToml = readFileSync('./src-tauri/Cargo.toml', 'utf-8');

    const packageJsonVersion = packageJson.version;
    // @ts-ignore
    const cargoTomlVersion = cargoToml.match(/version = "([0-9.]+)"/)[1];

    expect(packageJsonVersion).toEqual(cargoTomlVersion);
});
