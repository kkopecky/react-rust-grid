import { useEffect, useState } from 'react';
import init, {
	process_data,
	SortDirection,
} from '../../public/pkg/react_wasm_grid';

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

	return {
		process_data: wasmReady ? process_data : null,
		sortDirection: SortDirection,
	};
};

export default useReactWASMGrid;
