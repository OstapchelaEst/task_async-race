export class Engine {
    addEngineListener() {
        document.querySelectorAll('.track-car__label-engine').forEach((e) => {
            (<HTMLLabelElement>e).addEventListener('mousedown', (event) => {
                this.startEngine(event);
            });
        });
    }

    addStopListener() {
        document.querySelectorAll('.track-car__label-drive').forEach((e) => {
            e.addEventListener('click', (e) => {
                const GET_FOR = (<HTMLLabelElement>e.target).getAttribute('for') || '';
                const ID = GET_FOR.slice(GET_FOR.lastIndexOf('-') + 1) || '';
                this.returnCar(ID);
            });
        });
    }

    async startEngine(item: Event) {
        const LABEL_VALUE = (<HTMLLabelElement>item.target).getAttribute('for');
        const ID = LABEL_VALUE ? LABEL_VALUE.slice(LABEL_VALUE.lastIndexOf('-') + 1) : '';
        const STAR_ENGINE = await this.requestsCarStart(ID);
        this.moveCar(ID, STAR_ENGINE.velocity, STAR_ENGINE.distance);
        await this.requestsCarDrive(ID).then((data) => {
            if (!data.ok) {
                if ((<HTMLElement>document.querySelector(`.track-car__pictyre-${ID}`)).style.animationName !== '') {
                    console.log('Поддон пробила машина №', ID);
                    this.breackCar(ID);
                }
            }
        });
    }

    async requestsCarStart(id: string) {
        (<HTMLLabelElement>document.querySelector(`.track-car__label-engine[for="engine-car-${id}"]`)).classList.add(
            '_lock'
        );
        (<HTMLLabelElement>document.querySelector(`.track-car__label-drive[for="drive-car-${id}"]`)).classList.remove(
            '_lock'
        );

        return (
            await fetch(`http://127.0.0.1:3000/engine?id=${id}&status=started`, {
                method: 'PATCH',
            })
        ).json();
    }

    async requestsCarDrive(id: string) {
        return await fetch(`http://127.0.0.1:3000/engine?id=${id}&status=drive`, {
            method: 'PATCH',
        });
    }

    moveCar(id: string, speed: number, distance: number) {
        const PICTURE = document.querySelector(`.track-car__pictyre-${id}`);
        (<HTMLElement>PICTURE).style.animationDuration = distance / speed / 1000 + 's';
        (<HTMLElement>PICTURE).style.animationName = 'car-race';
    }

    breackCar(id: string) {
        const PICTURE = document.querySelector(`.track-car__pictyre-${id}`);
        (<HTMLElement>PICTURE).style.animationPlayState = 'paused';
    }

    async returnCar(id: string) {
        (<HTMLLabelElement>document.querySelector(`.track-car__label-engine[for="engine-car-${id}"]`)).classList.remove(
            '_lock'
        );
        (<HTMLLabelElement>document.querySelector(`.track-car__label-drive[for="drive-car-${id}"]`)).classList.add(
            '_lock'
        );

        (
            await fetch(`http://127.0.0.1:3000/engine?id=${id}&status=stopped`, {
                method: 'PATCH',
            })
        )
            .json()
            .then(() => {
                (<HTMLElement>document.querySelector(`.track-car__pictyre-${id}`)).style.animationName = '';
                (<HTMLElement>document.querySelector(`.track-car__pictyre-${id}`)).style.animationPlayState = 'running';
            });
    }
}

export const NEW_ENGINE = new Engine();
