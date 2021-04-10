/** @format */

const compile = require('near-sdk-as/compiler').compile

compile(
    'assembly/main.ts', // input file
    'out/main.wasm', // output file
    [
        '--debug',
        '--measure', // Shows compiler runtime
        '--validate', // Validate the generated wasm module
    ],
    {
        verbose: true, // Output the cli args passed to asc
    }
)
