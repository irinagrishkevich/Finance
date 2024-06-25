import { HttpUtils } from "../../utils/http-utils";

export class Balancing {
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.balancingRowElements = document.getElementById('balancing-row');
        this.loadBalancingTable().then();
    }

    async loadBalancingTable() {
        const balancingAll = await HttpUtils.request('/operations?period=all');

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
            editCell.innerHTML = `<a type="button" data-bs-toggle="modal" data-bs-target="#exampleModal"><i class="bi bi-trash me-1 "></i></a><a href="edit-income-table"><i class="bi bi-pencil text-black"></i></a>`
            row.appendChild(editCell);

            this.balancingRowElements.appendChild(row);
        });
    }

    
}
