import { useState } from 'react';
import useReactWASMGrid from './lib/useReactWASMGrid';

interface Person {
	id: number;
	name: string;
	age: number;
	email: string;
}

const generateMockData = (count: number): Person[] => {
	const names = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Brown'];
	const emails = [
		'john.doe@example.com',
		'jane.smith@example.com',
		'bob.johnson@example.com',
		'alice.brown@example.com',
	];

	const data: Person[] = [];
	for (let i = 0; i < count; i++) {
		const nameIndex = i % names.length;
		const age = 20 + (i % 50); // Generate age between 20 and 70
		data.push({
			id: i + 1,
			name: names[nameIndex],
			age: age,
			email: emails[nameIndex],
		});
	}
	return data;
};

const App = () => {
	const [startTime, setStartTime] = useState<number>(0);
	const [endTime, setEndTime] = useState<number>(0);

	const dummyData: Person[] = generateMockData(1000);

	const [tableData, setTableData] = useState<Person[]>(dummyData);

	const { process_data, sortDirection } = useReactWASMGrid();

	const handleProcessData = async () => {
		if (process_data && tableData) {
			setStartTime(Date.now());
			try {
				const result = await process_data(
					JSON.stringify(tableData),
					'name',
					sortDirection.Ascending
				); // Call the WASM function
				setTableData(JSON.parse(result));
				setEndTime(Date.now());
			} catch (error) {
				console.error('Error processing data:', error);
			}
		}
	};

	const handleClearData = () => setTableData(dummyData);

	return (
		<div className="container">
			<h1>React Rust Grid Demo</h1>
			<p>Start Time (ms): {startTime.toLocaleString()}</p>
			<p>End Time (ms): {endTime.toLocaleString()}</p>
			<p>Duration (ms): {endTime - startTime}</p>
			<button onClick={handleProcessData}>Process Data</button>
			<button onClick={handleClearData}>Clear Data</button>
			<table className="table">
				<thead>
					<tr>
						<th scope="col">#</th>
						<th scope="col">name</th>
						<th scope="col">age</th>
						<th scope="col">email</th>
					</tr>
				</thead>
				<tbody>
					{tableData &&
						tableData.map((row, index) => (
							<tr key={index}>
								<th scope="row">{row.id}</th>
								<td>{row.name}</td>
								<td>{row.age}</td>
								<td>{row.email}</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
};

export default App;
