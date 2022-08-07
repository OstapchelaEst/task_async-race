import './global.scss';
import './components/style/main.scss';
import './components/style/footer.scss';
import './components/style/race-interface.scss';
import './components/style/garage.scss';
import './components/style/animation-race.scss';
import './components/style/light-box.scss';
import './components/style/winners.scss';
import './components/style/select-page.scss';

import { Cars } from './components/scripts/cars';
import { NEW_RANDOM_CARS } from './components/scripts/random-cars';
import { RENDER_PAGE } from './components/scripts/render-page';
import { NEW_RACE } from './components/scripts/race';
import { NEW_PAGINATION } from './components/scripts/pagination';
import { STORE_SAVE } from './components/scripts/local-storage';
import { SELECT_PAGE } from './components/scripts/select-page';
import { WINNERS } from './components/scripts/winners';

export const NEW_CARS = new Cars();

async function start() {
    RENDER_PAGE.renderBaseBlock();
    RENDER_PAGE.renderwinners();
    RENDER_PAGE.renderInterface();
    RENDER_PAGE.getTrack();
    await SELECT_PAGE.addSelectPageListeners();
    NEW_PAGINATION.setNumPage(STORE_SAVE.page);
    await NEW_PAGINATION.addListenersPaginationGarage();
    await NEW_PAGINATION.addListenersPaginationWinners();
    NEW_RACE.addListenerStartRace();
    NEW_RACE.addListenerResetRace();
    NEW_CARS.addListenerCreateCar();
    NEW_CARS.addListenerUppdateCarButton();
    NEW_RANDOM_CARS.addListenerCreateRandomCasrds();
    WINNERS.showWinners();
}

start();
