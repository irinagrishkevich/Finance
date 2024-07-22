import config from "../config/config";
import {HttpUtils} from "../utils/http-utils";
import {ChartData} from "../types/chart-data.type";
import {ErrorRes} from "../types/error-res.type";
import {Chart, ArcElement, PieController, Tooltip, Legend, plugins} from 'chart.js';

// Регистрация компонентов
Chart.register(ArcElement, PieController, Tooltip, Legend);
import {BalancingType} from "../types/balancing.type";
import {AuthUtils} from "../utils/auth-utils";
import {OpenNewRouteFunction} from "../types/open-new-route.type";



export class Main {
    readonly openNewRoute: OpenNewRouteFunction
    readonly incomeChartElement: HTMLCanvasElement | null
    readonly expenseChartElement: HTMLCanvasElement | null
    readonly filterButtons: NodeListOf<HTMLButtonElement> | null
    readonly startDateElement: HTMLInputElement | null
    readonly endDateElement: HTMLInputElement | null
    readonly intervalButtonElement: HTMLInputElement | null
    readonly dataExpense: ChartData
    readonly dataIncome: ChartData
    private incomeChart: Chart<"pie"> | null
    private expenseChart: Chart<"pie"> | null
    private noData: any;

    constructor(openNewRoute: OpenNewRouteFunction) {
        this.openNewRoute = openNewRoute
        this.incomeChartElement = document.getElementById('incomeChart') as HTMLCanvasElement;
        this.expenseChartElement = document.getElementById('expenseChart') as HTMLCanvasElement;
        this.filterButtons = document.querySelectorAll('.btn-outline-secondary');
        this.startDateElement = document.getElementById('start-date') as HTMLInputElement;
        this.endDateElement = document.getElementById('end-date') as HTMLInputElement;
        this.intervalButtonElement = document.getElementById('interval-button') as HTMLInputElement;

        this.expenseChart = null
        this.incomeChart = null




        this.dataExpense = {
            labels: [],
            datasets: [{
                label: 'Расходы',
                data: [],
                backgroundColor: [],
                hoverOffset: 5,

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
        if (!AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
            this.openNewRoute('/login').then()
            return
        }

        this.myChart();
        this.addFilterEventListener();
        this.loadBalancingData('today', null, null).then();
    }

    private addFilterEventListener(): void {
        if (this.filterButtons) {
            this.filterButtons.forEach(button => {
                button.addEventListener('click', async (event: MouseEvent): Promise<void> => {
                    this.activateButton(event.target as HTMLInputElement);

                    const filter: string = (event.target as HTMLElement).textContent?.toLowerCase() || '';
                    const period: string | undefined = Object.keys(config.filterMapping).find(key => config.filterMapping[key] === filter)
                    if (filter !== 'interval') {
                        if (this.startDateElement && this.endDateElement) {
                            await this.loadBalancingData(period as string, null, null); //? because !== 'interval'
                        }
                    }
                });
            })
        }
        if (this.startDateElement && this.endDateElement) {
            this.startDateElement?.addEventListener('focus', () => this.activateIntervalButton());
            this.endDateElement?.addEventListener('focus', () => this.activateIntervalButton());

            this.startDateElement?.addEventListener('change', async (): Promise<void> => {
                if (this.startDateElement && this.endDateElement) {
                    if (this.startDateElement?.value && this.endDateElement?.value) {
                        await this.loadBalancingData('interval', this.startDateElement.value, this.endDateElement.value);
                    }
                }
            });
            this.endDateElement?.addEventListener('change', async (): Promise<void> => {
                if (this.startDateElement && this.endDateElement) {
                    if (this.startDateElement?.value && this.endDateElement?.value) {
                        await this.loadBalancingData('interval', this.startDateElement.value, this.endDateElement.value);
                    }
                }
            });
        }

    }

    private activateButton(button: HTMLInputElement): void {
        if (this.filterButtons) {
            this.filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        }
    }

    private activateIntervalButton(): void {
        if (this.intervalButtonElement) {
            this.activateButton(this.intervalButtonElement);
        }
    }

    private async loadBalancingData(period: string | null, startDate: string | null, endDate: string | null): Promise<void> { // \startDate, \endDate
        let url: string = `/operations?period=${period}`;
        if (period === 'interval') {
            url += `&dateFrom=${startDate}&dateTo=${endDate}`;
        }

        const balancingAll: ErrorRes | BalancingType[] = await HttpUtils.request(url);


        if (balancingAll) {
            this.updateChartData(this.dataExpense, (balancingAll as BalancingType[]), 'expense');
            this.updateChartData(this.dataIncome, (balancingAll as BalancingType[]), 'income');
        }

    }

    private updateChartData(chartData: ChartData, data: any, type: string): void {//data??



        const map: Map<string, number> = new Map();

        data.forEach((item: BalancingType): void => {
            if (item.type === type) {
                const category: string = item.category;
                const amount: number = item.amount;

                const currentAmount: number = map.get(category) ?? 0;
                map.set(category, currentAmount + amount);


            }
        });


        chartData.labels = [];
        chartData.datasets[0].data = [];
        chartData.datasets[0].backgroundColor = [];

        map.forEach((amount: number, category: string): void => {
            chartData.labels.push(category);
            chartData.datasets[0].data.push(amount);
            chartData.datasets[0].backgroundColor.push(this.getRandomColor());
        });

        this.updateCharts();

    }

    private updateCharts(): void {
        if (this.incomeChart) {
            this.incomeChart.update();
        }
        if (this.expenseChart) {
            this.expenseChart.update();
        }
    }

    private myChart(): void {

        if (this.incomeChartElement) {
            this.incomeChart = new Chart(this.incomeChartElement, {
                type: 'pie',
                data: this.dataIncome,
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Доходы'
                        },
                    },

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
        return `rgb(${o(r() * s)},${o(r() * s)},${o(r() * s)})`;
    }
}
