import {HttpUtils} from "../../utils/http-utils";
import config from "../../config/config";

export class Balancing {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.balancingRowElements = document.getElementById('balancing-row');
        this.filterButtons = document.querySelectorAll('.btn-outline-secondary');
        this.startDateElement = document.getElementById('start-date');
        this.endDateElement = document.getElementById('end-date');
        this.intervalButtonElement = document.getElementById('interval-button');

        this.addFilterEventListener()
        this.loadBalancingTable('today').then();
    }

    addFilterEventListener() {
        this.filterButtons.forEach(button => {
            button.addEventListener('click', async (event) => {
                this.activateButton(event.target)

                const filter = event.target.textContent.toLowerCase()
                const period = Object.keys(config.filterMapping).find(key => config.filterMapping[key] === filter)

                if (filter !== 'interval') {
                    await this.loadBalancingTable(period);
                }
            })
        })

        this.startDateElement.addEventListener('focus', () => this.activateIntervalButton())
        this.endDateElement.addEventListener('focus', () => this.activateIntervalButton())

        this.startDateElement.addEventListener('change', (event) => {
            if (this.startDateElement.value && this.endDateElement.value) {
                this.intervalButtonElement.classList.add('active')
                this.loadBalancingTable('interval', this.startDateElement.value, this.endDateElement.value).then();
            }
        })
        this.endDateElement.addEventListener('change', (event) => {
            if (this.startDateElement.value && this.endDateElement.value) {
                console.log(`Date range: ${this.startDateElement.value} - ${this.endDateElement.value}`);
                this.loadBalancingTable('interval', this.startDateElement.value, this.endDateElement.value).then();
            }
        })
    }

    activateButton(button) {
        this.filterButtons.forEach(btn => {
            btn.classList.remove('active')
        })
        button.classList.add('active')
    }

    activateIntervalButton() {
        this.activateButton(this.intervalButtonElement)
    }

    async loadBalancingTable(period, startDate, endDate) {

        let url = `/operations?period=${period}`
        if (period === 'interval') {
            url += `&dateFrom=${startDate}&dateTo=${endDate}`
        }
        const balancingAll = await HttpUtils.request(url);

        this.balancingRowElements.innerHTML = ''

        balancingAll.response.forEach((balancing, index) => {
            const row = document.createElement('tr');
            const numberCell = document.createElement('td');
            numberCell.textContent = index + 1;
            row.appendChild(numberCell);
            const typeCell = document.createElement('td');
            typeCell.textContent = balancing.type === 'expense' ? 'расход' : 'доход';
            typeCell.classList.add(balancing.type === 'expense' ? 'text-danger' : 'text-success');
            row.appendChild(typeCell);
            const categoryCell = document.createElement('td');
            categoryCell.textContent = balancing.category;
            row.appendChild(categoryCell);
            const amountCell = document.createElement('td');
            amountCell.textContent = balancing.amount + '$';
            row.appendChild(amountCell);
            const dateCell = document.createElement('td');
            dateCell.textContent = balancing.date;
            row.appendChild(dateCell);
            const commentCell = document.createElement('td');
            commentCell.textContent = balancing.comment || '';
            row.appendChild(commentCell);
            const editCell = document.createElement('td');
            editCell.innerHTML = `<a type="button" data-id="${balancing.id}" data-bs-toggle="modal" data-bs-target="#exampleModal" id="deleteCategory">
            <i class="bi bi-trash me-1 "></i></a>
            <a type="button"  id="editCategory" data-id="${balancing.id}" data-type="${balancing.type}"><i class="bi bi-pencil text-black"></i></a>`
            row.appendChild(editCell);

            this.balancingRowElements.appendChild(row);
        });

        this.addEditEventListeners()
        this.addDeleteEventListeners()
    }
    addEditEventListeners() {
        const editButtons = document.querySelectorAll('#editCategory');
        editButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const id = event.target.closest('a').getAttribute('data-id');
                const type = event.target.closest('a').getAttribute('data-type');

                if (type === 'income') {
                    this.openNewRoute(`/balancing/edit-income?id=${id}`);
                } else {
                    this.openNewRoute(`/balancing/edit-expense?id=${id}`);
                }
            });
        });
    }
    addDeleteEventListeners() {
        const deleteButtons = document.querySelectorAll('#deleteCategory');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const id = event.target.closest('a').getAttribute('data-id');
                this.openNewRoute(`/balancing/delete?id=${id}`);
            });
        });


    }


}
