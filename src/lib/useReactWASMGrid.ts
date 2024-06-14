import { useEffect, useState } from 'react';
import init, { process_data } from '../../public/pkg/react_wasm_grid';

const useReactWASMGrid = () => {
	const [wasmReady, setWasmReady] = useState(false);

	useEffect(() => {
		const loadWasm = async () => {
			try {
				await init(); // Initialize the WASM module
				setWasmReady(true);
			} catch (error) {
				console.error('Error loading WebAssembly module:', error);
			}
		};

		loadWasm();
	}, []);

	return wasmReady ? process_data : null;
};

export default useReactWASMGrid;
