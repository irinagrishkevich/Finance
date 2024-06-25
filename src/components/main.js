import config from "../config/config";
import {HttpUtils} from "../utils/http-utils";


export class Main {
    constructor() {
        this.incomeChartElement = document.getElementById('incomeChart');
        this.expenseChartElement = document.getElementById('expenseChart');
        this.filterButtons = document.querySelectorAll('.btn-outline-secondary');
        this.startDateElement = document.getElementById('start-date');
        this.endDateElement = document.getElementById('end-date');
        this.intervalButtonElement = document.getElementById('interval-button');

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
        this.loadBalancingData('today');
    }

     addFilterEventListener() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                this.activateButton(event.target);

                const filter = event.target.textContent.toLowerCase()
                const period = Object.keys(config.filterMapping).find(key => config.filterMapping[key] === filter)
                if (filter !== 'interval') {
                    await this.loadBalancingData(period);
                }
            });
        });

        this.startDateElement.addEventListener('focus', () => this.activateIntervalButton());
        this.endDateElement.addEventListener('focus', () => this.activateIntervalButton());

        this.startDateElement.addEventListener('change', async(event) => {
            if (this.startDateElement.value && this.endDateElement.value) {
               await this.loadBalancingData('interval', this.startDateElement.value, this.endDateElement.value);
            }
        });
        this.endDateElement.addEventListener('change', async(event) => {
            if (this.startDateElement.value && this.endDateElement.value) {
                await this.loadBalancingData('interval', this.startDateElement.value, this.endDateElement.value);
            }
        });
    }

    activateButton(button) {
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    }

    activateIntervalButton() {
        this.activateButton(this.intervalButtonElement);
    }

    async loadBalancingData(period, startDate, endDate) {
        let url = `/operations?period=${period}`;
        if (period === 'interval') {
            url += `&dateFrom=${startDate}&dateTo=${endDate}`;
        }

        const balancingAll = await HttpUtils.request(url);

        this.updateChartData(this.dataExpense, balancingAll.response, 'expense');
        this.updateChartData(this.dataIncome, balancingAll.response, 'income');
    }

    updateChartData(chartData, data, type) {
        const map = new Map();

        data.forEach(item => {
            if (item.type === type) {
                const category = item.category;
                const amount = item.amount;

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

        map.forEach((amount, category) => {
            chartData.labels.push(category);
            chartData.datasets[0].data.push(amount);
            chartData.datasets[0].backgroundColor.push(this.getRandomColor());
        });

        this.updateCharts();
    }

    updateCharts() {
        this.incomeChart.update();
        this.expenseChart.update();
    }

    myChart() {
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

    getRandomColor() {
        const o = Math.round, r = Math.random, s = 255;
        return `rgb(${o(r()*s)},${o(r()*s)},${o(r()*s)})`;
    }
}
