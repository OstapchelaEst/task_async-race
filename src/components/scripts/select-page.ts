class SelectPage {
    async addSelectPageListeners() {
        this.addListenerShowGarage();
        this.addListenerShowwinners();
    }
    addListenerShowGarage() {
        (<HTMLButtonElement>document.querySelector('.select-page__race')).addEventListener('click', () => {
            this.showPage('race', 'winners');
        });
    }

    addListenerShowwinners() {
        (<HTMLButtonElement>document.querySelector('.select-page__winners')).addEventListener('click', () => {
            this.showPage('winners', 'race');
        });
    }

    showPage(showBlock: string, hiddenBlock: string) {
        (<HTMLElement>document.querySelector(`.${showBlock}`)).classList.remove('hidden');
        (<HTMLElement>document.querySelector(`.${hiddenBlock}`)).classList.add('hidden');
        (<HTMLButtonElement>document.querySelector(`.select-page__${showBlock}`)).classList.add('_lock');
        (<HTMLButtonElement>document.querySelector(`.select-page__${hiddenBlock}`)).classList.remove('_lock');
    }
}

export const SELECT_PAGE = new SelectPage();
