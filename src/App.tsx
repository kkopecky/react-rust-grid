import React, { useState } from 'react';
import { useReactWASMGrid } from './lib/useReactWASMGrid';

const App: React.FC = () => {
	const [inputData, setInputData] = useState<JSON>();
	const [outputData, setOutputData] = useState<JSON>();

	const reactWasmGrid = useReactWASMGrid();
	const process_data = reactWasmGrid?.process_data;

	const handleProcessData = () => {
		if (process_data && inputData) {
			const result = process_data(0, 0, 0); // Update the arguments as per the function signature
			setOutputData(JSON.parse(result));
		}
	};

	return (
		<div>
			<h1>React Rust Grid Demo</h1>
			<textarea
				value={JSON.stringify(inputData)}
				onChange={(e) => setInputData(JSON.parse(e.target.value))}
			/>
			<button onClick={handleProcessData}>Process Data</button>
			<pre>{JSON.stringify(outputData)}</pre>
		</div>
	);
};

export default App;
