import {Color} from "chart.js";

export type ChartData = {
    labels: string[],
    datasets: {
        label: string,
        data: number[],
        backgroundColor: Color[],
        hoverOffset: number
    }[]
}