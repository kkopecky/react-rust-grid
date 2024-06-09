import { useEffect, useState } from 'react';
import {
	InitOutput,
	process_data as ProcessDataFunction,
} from '../../dist/pkg/react_rust_grid_lib';

// Define the type for the function to process the data

export function useReactWASMGrid(): typeof ProcessDataFunction | null {
	const [wasm, setWasm] = useState<InitOutput | null>(null);

	useEffect(() => {
		const loadWasm = async () => {
			try {
				// Load the wasm module
				const wasmModule = await import(
					'../../public/pkg/react_rust_grid_lib_bg.wasm'
				);
				// Check if the module has a default export
				if (wasmModule.default) {
					// Set the wasm module to the state
					setWasm(wasmModule.default);
				} else {
					console.error('Error: No default export found in WebAssembly module');
				}
			} catch (err) {
				console.error('Error loading Wasm module:', err);
			}
		};

		loadWasm();
	}, []);

	// Function to process data using wasm
	const processDataWithWasm = (data: string): string => {
		if (!wasm) {
			console.error('Wasm module not loaded yet');
			return '';
		}
		// Call the process_data function from wasm
		return wasm.process_data(data); // Adjust the arguments as per your wasm function signature
	};

	return wasm ? processDataWithWasm : null;
}
