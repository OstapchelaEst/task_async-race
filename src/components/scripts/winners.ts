import { Iwinners } from './interface/winners';
import { IStart } from './interface/start';
import { STORE_SAVE } from './local-storage';
import { RENDER_PAGE } from './render-page';
import { NEW_CARS } from './cars';
import { NEW_PAGINATION } from './pagination';

class Winners {
    async getWinners(limit = '10', page: number = STORE_SAVE.pageWinners) {
        return (
            await fetch(
                `http://127.0.0.1:3000/winners?_page=${page}&_limit=${limit}&_sort=${STORE_SAVE.sort}&_order=${STORE_SAVE.order}`,
                {
                    method: 'GET',
                }
            )
        ).json();
    }

    async getWiner(id: number) {
        return (
            await fetch(`http://127.0.0.1:3000/winners/${id}`, {
                method: 'GET',
            })
        ).json();
    }

    async addWiner(id: number, wins: number, time: number) {
        await fetch('http://127.0.0.1:3000/winners', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                wins: wins,
                time: time,
                id: id,
            }),
        });
    }

    async deleteWiner(id: number) {
        return (await fetch(`http://127.0.0.1:3000/winners/${id}`, { method: 'DELETE' })).json();
    }

    async uppdateWiner(id: number, time: number, wins: number) {
        await fetch(`http://127.0.0.1:3000/winners/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wins: ++wins, time: time }),
        });
    }

    async doesThisExistWiner(id: number, data: IStart, name: string, color: string) {
        const NEW_TIME = Number((data.distance / data.velocity / 1000).toFixed(2));
        const ALL_winners_IDS = (await this.getWinners()).map((e: Iwinners) => e.id);
        if (ALL_winners_IDS.includes(id)) {
            const GET_OLD_INFO = await this.getWiner(id);
            const BEST_TIME = NEW_TIME > GET_OLD_INFO.time ? GET_OLD_INFO.time : NEW_TIME;
            await this.uppdateWiner(id, BEST_TIME, GET_OLD_INFO.wins);
        } else {
            STORE_SAVE.winners.push(id);
            await this.addWiner(id, 1, NEW_TIME);
            RENDER_PAGE.renderWiner(id, color, name, 1, NEW_TIME);
        }
        this.showWinners();
    }
    async showWinners() {
        this.showCountWinners();
        (<HTMLElement>document.querySelector('.table-winners__body')).innerHTML = ``;
        const ALL_winners = await this.getWinners();
        NEW_PAGINATION.examinationNextBUtton(STORE_SAVE.pageWinners, 'winners', 11);
        ALL_winners.forEach(async (e: Iwinners) => {
            const CAR_INFO = await NEW_CARS.getCar(e.id);
            RENDER_PAGE.renderWiner(e.id, CAR_INFO.color, CAR_INFO.name, e.wins, e.time);
        });
    }

    async showPageListWinners() {
        (<HTMLElement>document.querySelector('.winners__page')).innerHTML = `PAGE#(${STORE_SAVE.pageWinners})`;
    }

    async showCountWinners() {
        const COUNT_WINNERS = (await this.getWinners('1000000', 1)).length;
        (<HTMLElement>document.querySelector('.winners__count')).innerHTML = `Winers(${COUNT_WINNERS})`;
    }

    addListenersSortWinners() {
        (<HTMLElement>document.querySelector('.table-winners__wins')).addEventListener('click', async (e) => {
            STORE_SAVE.sort = 'wins';
            this.setOrderWinners();
            this.showWinners();
            this.setRotateArrow(e);
        });

        (<HTMLElement>document.querySelector('.table-winners__best-time')).addEventListener('click', async (e) => {
            STORE_SAVE.sort = 'time';
            this.setOrderWinners();
            this.showWinners();
            this.setRotateArrow(e);
        });

        (<HTMLElement>document.querySelector('.table-winners__number')).addEventListener('click', async (e) => {
            STORE_SAVE.sort = 'id';
            this.setOrderWinners();
            this.showWinners();
            this.setRotateArrow(e);
        });
    }

    setOrderWinners() {
        STORE_SAVE.order === 'DESC' ? (STORE_SAVE.order = 'ASC') : (STORE_SAVE.order = 'DESC');
    }
    setRotateArrow(e: Event) {
        const DELETE_CLASS = document.querySelector('._arrow-down') || document.querySelector('._arrow-up');
        if (DELETE_CLASS) {
            (<HTMLElement>DELETE_CLASS).classList.remove(`${(<HTMLElement>DELETE_CLASS).classList[1]}`);
        }

        if (STORE_SAVE.order === 'DESC') {
            (<HTMLElement>e.target).classList.add('_arrow-up');
        } else {
            (<HTMLElement>e.target).classList.add('_arrow-down');
        }
    }
}

export const WINNERS = new Winners();
