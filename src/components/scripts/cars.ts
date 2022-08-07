import { RENDER_PAGE } from './render-page';
import { STORE_SAVE } from './local-storage';
import { NEW_PAGINATION } from './pagination';
import { WINNERS } from './winners';
import { Iwinners } from './interface/winners';
export class Cars {
    async getCars(page = STORE_SAVE.page) {
        const response = await fetch(`http://127.0.0.1:3000/garage?_page=${page}&_limit=7`, { method: 'GET' });
        const temp = response.json();
        STORE_SAVE.page = Number(page);
        STORE_SAVE.count = Number(response.headers.get('X-Total-Count'));
        NEW_PAGINATION.setNumPage(page);
        return {
            page: page,
            car: await temp,
            count: response.headers.get('X-Total-Count'),
        };
    }

    async getCar(id: number) {
        return (await fetch(`http://127.0.0.1:3000/garage/${id}`, { method: 'GET' })).json();
    }

    async addCar(obj: { name: string; color: string }) {
        await fetch('http://127.0.0.1:3000/garage', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: obj.name, color: obj.color }),
        });
    }

    async deleteCarInServer(id: string) {
        return (await fetch(`http://127.0.0.1:3000/garage/${id}`, { method: 'DELETE' })).json();
    }

    async deleteCar(item: Event) {
        const GET_ID: string = (<HTMLButtonElement>item.target).getAttribute('data-car') || '';
        const ALL_winners = await WINNERS.getWinners();
        ALL_winners.forEach(async (e: Iwinners) => {
            if (e.id === Number(GET_ID)) {
                await WINNERS.deleteWiner(Number(GET_ID));
                await WINNERS.showWinners();
            }
        });

        await this.deleteCarInServer(GET_ID);
        RENDER_PAGE.renderCountCars();
        RENDER_PAGE.getTrack();
    }

    uppdateSelectCar(item: Event) {
        const itemID: string = (<HTMLLabelElement>item.target).getAttribute('for') || '';
        const SELECT_CAR_ID = (<HTMLElement>document.getElementById(itemID)).id;
        document.querySelectorAll('.track-car__select-car').forEach((e) => {
            if (e.id !== SELECT_CAR_ID) {
                (<HTMLInputElement>e).checked = false;
            }
        });
    }

    async uppdateCar(id: string, nameVal: string, colorVal: string) {
        const ID = Number(id.slice(id.indexOf('-') + 1));
        (
            await fetch(`http://127.0.0.1:3000/garage/${ID}`, {
                method: 'PUT',
                body: JSON.stringify({
                    name: nameVal,
                    color: colorVal,
                }),
                headers: { 'Content-Type': 'application/json' },
            })
        ).json();
        await RENDER_PAGE.getTrack();
    }

    addListenerCreateCar() {
        (<HTMLButtonElement>document.querySelector('.car-create__button')).addEventListener('click', async () => {
            await this.addCar(this.getCreateCarValues());
            RENDER_PAGE.getTrack();
        });
    }

    addListenerDeleteCar() {
        document.querySelectorAll('.track-car__remove-button').forEach((e) => {
            (<HTMLButtonElement>e).addEventListener('click', (e) => {
                this.deleteCar(e);
            });
        });
    }

    addListenerUppdateCarSelect() {
        document.querySelectorAll('.track-car__label-car-select').forEach((e) => {
            (<HTMLLabelElement>e).addEventListener('click', (e) => {
                this.uppdateSelectCar(e);
            });
        });
    }

    addListenerUppdateCarButton() {
        (<HTMLButtonElement>document.querySelector('.car-update__button')).addEventListener('click', () => {
            document.querySelectorAll('.track-car__select-car').forEach((e) => {
                if ((<HTMLInputElement>e).checked === true) {
                    const NEW_NAME = (<HTMLInputElement>document.querySelector('.car-update__name')).value;
                    const NEW_COLOR = (<HTMLInputElement>document.querySelector('.car-update__color')).value;
                    this.uppdateCar(e.id, NEW_NAME, NEW_COLOR);
                }
            });
        });
    }

    getCreateCarValues() {
        const carName = (<HTMLInputElement>document.querySelector('.car-create__name')).value;
        const carColor = (<HTMLInputElement>document.querySelector('.car-create__color')).value;
        (<HTMLInputElement>document.querySelector('.car-create__name')).value = '';
        (<HTMLInputElement>document.querySelector('.car-create__color')).value = '#000000';
        return {
            name: carName,
            color: carColor,
        };
    }
}

export const NEW_CARS = new Cars();
