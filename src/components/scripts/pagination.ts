import { RENDER_PAGE } from './render-page';
import { STORE_SAVE } from './local-storage';
import { NEW_CARS } from './cars';
import { WINNERS } from './winners';

type ObjKey = keyof typeof STORE_SAVE;

export class Pagination {
    async addListenersPaginationGarage() {
        this.addListenerNext('garage', 7, 'page');
        this.addListenerPrev('garage', 'page');
    }

    async addListenersPaginationWinners() {
        this.addListenerNext('winners', 10, 'pageWinners');
        this.addListenerPrev('winners', 'pageWinners');
        WINNERS.showPageListWinners();
    }

    setNumPage(count: number) {
        (<HTMLElement>document.querySelector('.garage-page')).innerHTML = `PAGE#${count}`;
    }

    addListenerNext(place: string, limit: number, item: ObjKey) {
        (<HTMLElement>document.querySelector(`.pagination__next-${place}`)).addEventListener('click', async () => {
            this.deleteLock(`prev-${place}`);
            ++STORE_SAVE[item];

            const COUNT = place === 'garage' ? STORE_SAVE.count : (await WINNERS.getWinners('10000')).length;
            if (Math.ceil(COUNT / limit) <= STORE_SAVE[item])
                (<HTMLElement>document.querySelector(`.pagination__next-${place}`)).classList.add('_lock');
            if (place === 'garage') {
                RENDER_PAGE.getTrack();
            } else {
                WINNERS.showWinners();
                WINNERS.showPageListWinners();
            }
        });
    }

    addListenerPrev(place: string, item: ObjKey) {
        (<HTMLElement>document.querySelector(`.pagination__prev-${place}`)).addEventListener('click', () => {
            this.deleteLock(`next-${place}`);
            --STORE_SAVE[item];
            if (STORE_SAVE[item] === 1)
                (<HTMLElement>document.querySelector(`.pagination__prev-${place}`)).classList.add('_lock');
            if (place === 'garage') {
                RENDER_PAGE.getTrack();
            } else {
                WINNERS.showWinners();
                WINNERS.showPageListWinners();
            }
        });
    }

    deleteLock(item: string) {
        if ((<HTMLElement>document.querySelector(`.pagination__${item}`)).classList.contains('_lock')) {
            (<HTMLElement>document.querySelector(`.pagination__${item}`)).classList.remove('_lock');
        }
    }

    async examinationNextBUtton(page: number, place: string, count: number) {
        const COUNT_CARS =
            place === 'garage' ? (await NEW_CARS.getCars()).count : (await WINNERS.getWinners('10000')).length;
        if (page === 1) {
            if (Number(COUNT_CARS) < count) {
                if (!(<HTMLElement>document.querySelector(`.pagination__next-${place}`)).classList.contains('_lock'))
                    (<HTMLElement>document.querySelector(`.pagination__next-${place}`)).classList.add('_lock');
            } else {
                (<HTMLElement>document.querySelector(`.pagination__next-${place}`)).classList.remove('_lock');
            }
        }
    }
}
export const NEW_PAGINATION = new Pagination();
