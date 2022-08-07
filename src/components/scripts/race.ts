import { NEW_CARS } from './cars';
import { NEW_ENGINE } from './start-stop-car';
import { RENDER_PAGE } from './render-page';
//import { STORE_SAVE } from './local-storage';
import { WINNERS } from './winners';

export class Race {
    addListenerStartRace() {
        (<HTMLButtonElement>document.querySelector('.buttons-interface__race')).addEventListener('click', () => {
            this.startRace();
        });
    }
    addListenerResetRace() {
        (<HTMLButtonElement>document.querySelector('.buttons-interface__reset')).addEventListener('click', () => {
            this.unLockInterface();
            RENDER_PAGE.getTrack();
        });
    }
    async startRace() {
        this.lockInterface();
        NEW_CARS.getCars().then(async (data) => {
            let win = true; // прости господи за этот костыль, я не знаю как по другому ;(

            await data.car.forEach(async (e: { name: string; color: string; id: number }) => {
                const RACER_CAR_START = await NEW_ENGINE.requestsCarStart(String(e.id));
                NEW_ENGINE.moveCar(String(e.id), RACER_CAR_START.velocity, RACER_CAR_START.distance);
                const RACE_CAR_DRIVE = await NEW_ENGINE.requestsCarDrive(String(e.id));

                if (RACE_CAR_DRIVE.status === 500) {
                    console.log('Поддон пробила машина №', e.id);
                    NEW_ENGINE.breackCar(String(e.id));
                } else if (win === true && RACE_CAR_DRIVE.status == 200) {
                    RENDER_PAGE.renderWinerLighBox(e.name, RACER_CAR_START);
                    WINNERS.doesThisExistWiner(e.id, RACER_CAR_START, e.name, e.color);
                    win = false;
                }
            });
        });
    }

    lockInterface() {
        (<HTMLElement>document.querySelector('.buttons-interface__reset')).classList.remove('_race__lock');
        document.querySelectorAll('.track-car__label-drive').forEach((e) => {
            e.classList.add('_race__lock');
        });
        document.querySelectorAll('.track-car__label-car-select').forEach((e) => {
            e.classList.add('_race__lock');
        });
        document.querySelectorAll('.track-car__remove-button').forEach((e) => {
            e.classList.add('_race__lock');
        });
        (<HTMLElement>document.querySelector('.buttons-interface__race')).classList.add('_race__lock');
        (<HTMLElement>document.querySelector('.car-create__button')).classList.add('_race__lock');
        (<HTMLElement>document.querySelector('.car-update__button')).classList.add('_race__lock');
        (<HTMLElement>document.querySelector('.buttons-interface__generate-cards')).classList.add('_race__lock');
        (<HTMLElement>document.querySelector('.pagination__next-garage')).classList.add('_race__lock');
        (<HTMLElement>document.querySelector('.pagination__prev-garage')).classList.add('_race__lock');
    }

    unLockInterface() {
        document.querySelectorAll('._race__lock').forEach((e) => {
            (<HTMLElement>e).classList.remove('_race__lock');
            (<HTMLElement>document.querySelector('.buttons-interface__reset')).classList.add('_race__lock');
        });
    }
}

export const NEW_RACE = new Race();
