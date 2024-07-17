import config from "../config/config";
import {HttpUtils} from "../utils/http-utils";
import {ChartData} from "../types/chart-data.type";
import {ErrorRes} from "../types/error-res.type";
import {Chart} from "chart.js";


export class Main {
    readonly incomeChartElement: HTMLCanvasElement | null
    readonly expenseChartElement: HTMLCanvasElement | null
    readonly filterButtons: NodeListOf<HTMLButtonElement> | null
    readonly startDateElement: HTMLInputElement | null
    readonly endDateElement: HTMLInputElement | null
    readonly intervalButtonElement: HTMLButtonElement | null
    readonly dataExpense: ChartData
    readonly dataIncome: ChartData
    private incomeChart: Chart<"pie", number[], string> | null
    private expenseChart: Chart<"pie", number[], string> | null

    constructor() {
        this.incomeChartElement = document.getElementById('incomeChart') as HTMLCanvasElement;
        this.expenseChartElement = document.getElementById('expenseChart') as HTMLCanvasElement;
        this.filterButtons = document.querySelectorAll('.btn-outline-secondary');
        this.startDateElement = document.getElementById('start-date') as HTMLInputElement;
        this.endDateElement = document.getElementById('end-date') as HTMLInputElement;
        this.intervalButtonElement = document.getElementById('interval-button') as HTMLButtonElement;

        this.dataExpense = {
            labels: [],
            datasets: [{
                label: 'Расходы',
                data: [],
                backgroundColor: [],
                hoverOffset: 5
            }]
        };

        this.dataIncome = {
            labels: [],
            datasets: [{
                label: 'Доходы',
                data: [],
                backgroundColor: [],
                hoverOffset: 5
            }]
        };

        this.myChart();
        this.addFilterEventListener();
        this.loadBalancingData('today', null, null).then();
    }

     private addFilterEventListener():void {
        if (this.filterButtons) {
            this.filterButtons.forEach(button => {
                button.addEventListener('click', async (event:MouseEvent):Promise<void> => {
                    this.activateButton(event.target);

                    const filter: string = (event.target as HTMLElement).textContent?.toLowerCase() || '';
                    const period: string | undefined = Object.keys(config.filterMapping).find(key => config.filterMapping[key] === filter)
                    if (filter !== 'interval') {
                        if(this.startDateElement && this.endDateElement){
                            await this.loadBalancingData(period, null,null); //? because !== 'interval'
                        }
                    }
                });
            })
        }
        if (this.startDateElement && this.endDateElement){
            this.startDateElement.addEventListener('focus', () => this.activateIntervalButton());
            this.endDateElement.addEventListener('focus', () => this.activateIntervalButton());

            this.startDateElement.addEventListener('change', async(): Promise<void> => {
                if(this.startDateElement && this.endDateElement){
                    if (this.startDateElement.value && this.endDateElement.value) {
                        await this.loadBalancingData('interval', this.startDateElement.value, this.endDateElement.value);
                    }
                }
            });
            this.endDateElement.addEventListener('change', async(): Promise<void> => {
                if(this.startDateElement && this.endDateElement){
                    if (this.startDateElement.value && this.endDateElement.value) {
                        await this.loadBalancingData('interval', this.startDateElement.value, this.endDateElement.value);
                    }
                }
            });
        }

    }

    private activateButton(button): void {
        if(this.filterButtons){
            this.filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        }
    }

    private activateIntervalButton(): void {
        this.activateButton(this.intervalButtonElement);
    }

    private async loadBalancingData(period, startDate, endDate): Promise<void> { // \startDate, \endDate
        let url:string = `/operations?period=${period}`;
        if (period === 'interval') {
            url += `&dateFrom=${startDate}&dateTo=${endDate}`;
        }

        const balancingAll: ErrorRes | null = await HttpUtils.request(url);

        this.updateChartData(this.dataExpense, balancingAll.response, 'expense');
        this.updateChartData(this.dataIncome, balancingAll.response, 'income');
    }

    private updateChartData(chartData: ChartData, data, type: string): void { //data??
        const map: Map<string, number> = new Map();

        data.forEach(item => {
            if (item.type === type) {
                const category: string = item.category;
                const amount: number = item.amount;


                if (map.has(category)) {
                    map.set(category, map.get(category) + amount);
                } else {
                    map.set(category, amount);
                }
            }
        });

        chartData.labels = [];
        chartData.datasets[0].data = [];
        chartData.datasets[0].backgroundColor = [];

        map.forEach((amount: number, category: string):void => {
            chartData.labels.push(category);
            chartData.datasets[0].data.push(amount);
            chartData.datasets[0].backgroundColor.push(this.getRandomColor());
        });

        this.updateCharts();
    }

    private updateCharts(): void {
        if(this.incomeChart){
            this.incomeChart.update();
        }
        if(this.expenseChart){
            this.expenseChart.update();
        }
    }

    private myChart():void {
        if (this.incomeChartElement) {
            this.incomeChart = new Chart(this.incomeChartElement, {
                type: 'pie',
                data: this.dataIncome,
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Доходы'
                        }
                    }
                }
            });
        }

        if (this.expenseChartElement) {
            this.expenseChart = new Chart(this.expenseChartElement, {
                type: 'pie',
                data: this.dataExpense,
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Расходы'
                        }
                    }
                }
            });
        }
    }

    private getRandomColor(): string {
        const o: Function = Math.round, r: Function = Math.random, s: number = 255;
        return `rgb(${o(r()*s)},${o(r()*s)},${o(r()*s)})`;
    }
}
