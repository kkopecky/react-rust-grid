import React, { useState } from 'react';
import useReactWASMGrid from './lib/useReactWASMGrid';

const App = () => {
	const mockGridData = JSON.stringify({ array: [1, 2, 3, 4, 5] });
	console.log(mockGridData);

	const [inputData, setInputData] = useState<string>(mockGridData);
	const [outputData, setOutputData] = useState<string>('');

	const processDataWithWasm = useReactWASMGrid();

	const handleProcessData = () => {
		if (processDataWithWasm && inputData) {
			try {
				const result = processDataWithWasm(inputData); // Call the WASM function
				setOutputData(result);
			} catch (error) {
				console.error('Error processing data:', error);
			}
		}
	};

	return (
		<div>
			<h1>React Rust Grid Demo</h1>
			<textarea
				value={inputData}
				onChange={(e) => setInputData(e.target.value)}
			/>
			<button onClick={handleProcessData}>Process Data</button>
			<pre>{outputData}</pre>
		</div>
	);
};

export default App;
