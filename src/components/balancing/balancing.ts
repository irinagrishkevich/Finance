import {HttpUtils} from "../../utils/http-utils";
import config from "../../config/config";
import {BalancingType} from "../../types/balancing.type";
import {DefaultResponseType} from "../../types/default-response.type";

export class Balancing {
    readonly openNewRoute: (url: string | null) => Promise<void>
    readonly balancingRowElements: HTMLElement | null
    readonly filterButtons: NodeListOf<HTMLButtonElement> | null
    readonly startDateElement: HTMLInputElement | null
    readonly endDateElement: HTMLInputElement | null
    readonly intervalButtonElement: HTMLButtonElement | null

    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;
        this.balancingRowElements = document.getElementById('balancing-row');
        this.filterButtons = document.querySelectorAll('.btn-outline-secondary');
        this.startDateElement = document.getElementById('start-date') as HTMLInputElement;
        this.endDateElement = document.getElementById('end-date') as HTMLInputElement;
        this.intervalButtonElement = document.getElementById('interval-button') as HTMLButtonElement;

        this.addFilterEventListener()
        this.loadBalancingTable('today', null, null).then();
    }

    private addFilterEventListener(): void {
        if (this.filterButtons) {
            this.filterButtons.forEach(button => {
                button.addEventListener('click', async (event: MouseEvent): Promise<void> => {
                    this.activateButton(event.target)

                    const filter: string = (event.target as HTMLElement).textContent?.toLowerCase() || '';
                    const period: string | undefined = Object.keys(config.filterMapping).find(key => config.filterMapping[key] === filter)

                    if (filter !== 'interval') {
                        await this.loadBalancingTable(period, null, null); //? because !== 'interval'
                    }
                })
            })
        }

        if (this.startDateElement && this.endDateElement) {
            this.startDateElement.addEventListener('focus', () => this.activateIntervalButton())
            this.endDateElement.addEventListener('focus', () => this.activateIntervalButton())

            this.startDateElement.addEventListener('change', () => {
                if (this.startDateElement && this.endDateElement) {
                    if (this.startDateElement.value && this.endDateElement.value) {
                        if (this.intervalButtonElement) {
                            this.intervalButtonElement.classList.add('active')
                        }
                        this.loadBalancingTable('interval', this.startDateElement.value, this.endDateElement.value).then();
                    }

                }
            })
            this.endDateElement.addEventListener('change', () => {
                if (this.startDateElement && this.endDateElement) {
                    if (this.startDateElement.value && this.endDateElement.value) {
                        console.log(`Date range: ${this.startDateElement.value} - ${this.endDateElement.value}`);
                        this.loadBalancingTable('interval', this.startDateElement.value, this.endDateElement.value).then();
                    }
                }
            })


        }

    }

    private activateButton(button): void {
        if (this.filterButtons) {
            this.filterButtons.forEach(btn => {
                btn.classList.remove('active')
            })
            button.classList.add('active')
        }
    }

    private activateIntervalButton(): void {
        this.activateButton(this.intervalButtonElement)
    }

    private async loadBalancingTable(period, startDate, endDate): Promise<void> {

        let url: string = `/operations?period=${period}`
        if (period === 'interval') {
            url += `&dateFrom=${startDate}&dateTo=${endDate}`
        }
        const balancingAll: BalancingType | DefaultResponseType = await HttpUtils.request(url);
        if ((balancingAll as DefaultResponseType).redirect) {
            return this.openNewRoute((balancingAll as DefaultResponseType).redirect)
        }
        if ((balancingAll as DefaultResponseType).error || !((balancingAll as BalancingType).response || (balancingAll as BalancingType).response)) {
            console.log("Ошибка при запросе данных все расходов и доходов")
            return
        }
        if (this.balancingRowElements) {
            this.balancingRowElements.innerHTML = ''
        }

        (balancingAll as BalancingType).response.forEach((balancing, index: number) => {
            const row: HTMLTableRowElement = document.createElement('tr');
            const numberCell: HTMLTableCellElement = document.createElement('td');
            numberCell.textContent = Number(index + 1).toString();
            row.appendChild(numberCell);
            const typeCell: HTMLTableCellElement = document.createElement('td');
            typeCell.textContent = balancing.type === 'expense' ? 'расход' : 'доход';
            typeCell.classList.add(balancing.type === 'expense' ? 'text-danger' : 'text-success');
            row.appendChild(typeCell);
            const categoryCell: HTMLTableCellElement = document.createElement('td');
            categoryCell.textContent = balancing.category;
            row.appendChild(categoryCell);
            const amountCell: HTMLTableCellElement = document.createElement('td');
            amountCell.textContent = balancing.amount + '$';
            row.appendChild(amountCell);
            const dateCell: HTMLTableCellElement = document.createElement('td');
            dateCell.textContent = balancing.date;
            row.appendChild(dateCell);
            const commentCell: HTMLTableCellElement = document.createElement('td');
            commentCell.textContent = balancing.comment || '';
            row.appendChild(commentCell);
            const editCell: HTMLTableCellElement = document.createElement('td');
            editCell.innerHTML = `<a type="button" data-id="${balancing.id}" data-bs-toggle="modal" data-bs-target="#exampleModal" id="deleteCategory">
            <i class="bi bi-trash me-1 "></i></a>
            <a type="button"  id="editCategory" data-id="${balancing.id}" data-type="${balancing.type}"><i class="bi bi-pencil text-black"></i></a>`
            row.appendChild(editCell);
            if (this.balancingRowElements) {
                this.balancingRowElements.appendChild(row);

            }
        });

        this.addEditEventListeners()
        this.addDeleteEventListeners()
    }

    private addEditEventListeners(): void {
        const editButtons: NodeListOf<HTMLAnchorElement> | null = document.querySelectorAll('#editCategory');
        editButtons.forEach((button: HTMLAnchorElement) => {
            button.addEventListener('click', async (event: MouseEvent): Promise<void> => {
                const id:string = (event.target as HTMLAnchorElement).closest('a').getAttribute('data-id');
                const type: string = (event.target as HTMLAnchorElement).closest('a').getAttribute('data-type');

                if (type === 'income') {
                    await this.openNewRoute(`/balancing/edit-income?id=${id}`);
                } else {
                    await this.openNewRoute(`/balancing/edit-expense?id=${id}`);
                }
            });
        });
    }

    private addDeleteEventListeners(): void {
        const deleteButtons: NodeListOf<HTMLAnchorElement> | null = document.querySelectorAll('#deleteCategory');
            deleteButtons.forEach((button: HTMLAnchorElement) => {
            button.addEventListener('click', async (event: MouseEvent): Promise<void> => {
                const id:string = (event.target as HTMLAnchorElement).closest('a').getAttribute('data-id');
                await this.openNewRoute(`/balancing/delete?id=${id}`);
            });
        });


    }


}
