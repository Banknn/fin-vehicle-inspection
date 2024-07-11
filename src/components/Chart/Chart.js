import React from 'react'
import {
	Chart as ChartJS,
	LinearScale,
	CategoryScale,
	BarElement,
	PointElement,
	LineElement,
	Legend,
	Tooltip,
	LineController,
	BarController,
} from 'chart.js'
import { Chart as Charts } from 'react-chartjs-2'

ChartJS.register(
	LinearScale,
	CategoryScale,
	BarElement,
	PointElement,
	LineElement,
	Legend,
	Tooltip,
	LineController,
	BarController
)

const Chart = ({ data, options, style }) => {
	return <Charts type='bar' style={style} data={data} options={options} />
}

export { Chart }
