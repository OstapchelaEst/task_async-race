import { CARS_NAMES } from './data/cars-names';
import { NEW_CARS } from './cars';
import { RENDER_PAGE } from './render-page';

export class RandomCars {
    getRandomInt(max: number) {
        return Math.floor(Math.random() * max);
    }
    getRandomCars() {
        for (let i = 0; i < 100; i++) {
            NEW_CARS.addCar({
                name: `${CARS_NAMES[0][this.getRandomInt(18)]} ${CARS_NAMES[1][this.getRandomInt(11)]}`,
                color: `${this.getRandomColor()}`,
            });
        }
    }
    getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[this.getRandomInt(letters.length)];
        }
        return color;
    }
    addListenerCreateRandomCasrds() {
        (<HTMLButtonElement>document.querySelector('.buttons-interface__generate-cards')).addEventListener(
            'click',
            async () => {
                await this.getRandomCars();
                await RENDER_PAGE.getTrack();
            }
        );
    }
}

export const NEW_RANDOM_CARS = new RandomCars();
