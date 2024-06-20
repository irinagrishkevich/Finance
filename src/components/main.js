export class Main {
    constructor() {
        this.incomeChartElement = document.getElementById('incomeChart')
        this.expenseChartElement = document.getElementById('expenseChart')
        this.myChart()
    }

    myChart() {
        new Chart(this.incomeChartElement, {
            type: 'pie',
            data: {
                labels: [
                    'Red',
                    'Orange',
                    'Yellow',
                    'Green',
                    'Blue',
                ],
                datasets: [{
                    label: 'My First Dataset',
                    data: [100, 40, 30, 400, 120],
                    backgroundColor: [
                        'rgb(220,53,69)',
                        'rgb(253,126,20)',
                        'rgb(255,193,7)',
                        'rgb(32,201,151)',
                        'rgb(13,110,253)',
                    ],
                    hoverOffset: 4
                }]
            },
        })

        new Chart(this.expenseChartElement, {
            type: 'pie',
            data: {
                labels: [
                    'Red',
                    'Orange',
                    'Yellow',
                    'Green',
                    'Blue',
                ],
                datasets: [{
                    label: 'My First Dataset',
                    data: [300, 50, 100, 40, 120],
                    backgroundColor: [
                        'rgb(220,53,69)',
                        'rgb(253,126,20)',
                        'rgb(255,193,7)',
                        'rgb(32,201,151)',
                        'rgb(13,110,253)',
                    ],
                    hoverOffset: 4
                }]
            },
        })





    }


}








