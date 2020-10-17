const app = new Vue({
    el: "#app",
    data(){
        return{
            viz: new Spacekit.Simulation(document.getElementById('space'), {
                basePath: 'https://typpo.github.io/spacekit/src',
            }),
            objects: ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'],
            selectedObjs: [],
            name: '',
            universeCreated: false
        }
    },
    methods: {
        addToSelected(e) {
            this.selectedObjs.push(e.target.value)
        },
        makeSpace() {
            // Create a background using Yale Bright Star Catalog data.
            this.universeCreated = true
            this.viz.createStars();
            this.createSun();
            if (this.selectedObjs)
                this.createPlanets();
        },
        createPlanets() {
            for (const obj of this.selectedObjs) {
                switch (obj) {
                    case 'mercury':
                        this.viz.createObject('mercury', Spacekit.SpaceObjectPresets.MERCURY);
                        break;
                    case 'venus':
                        this.viz.createObject('venus', Spacekit.SpaceObjectPresets.VENUS);
                        break;
                    case 'earth':
                        this.viz.createObject('earth', Spacekit.SpaceObjectPresets.EARTH);
                        break;
                    case 'mars':
                        this.viz.createObject('mars', Spacekit.SpaceObjectPresets.MARS);
                        break;
                    case 'jupiter':
                        this.viz.createObject('jupiter', Spacekit.SpaceObjectPresets.JUPITER);
                        break;
                    case 'saturn':
                        this.viz.createObject('saturn', Spacekit.SpaceObjectPresets.SATURN);
                        break;
                    case 'uranus':
                        this.viz.createObject('uranus', Spacekit.SpaceObjectPresets.URANUS);
                        break;
                    case 'neptune':
                        this.viz.createObject('neptune', Spacekit.SpaceObjectPresets.NEPTUNE);
                        break;
                    default:
                        console.error('No Planets Yet')
                        break;
                }
            }
        },
        createSun() {
            this.viz.createObject('sun', Spacekit.SpaceObjectPresets.SUN);
        },
        createObject() {
            const roadster = this.viz.createObject('spaceman', {
                labelText: this.name,
                ephem: new Spacekit.Ephem({
                    // These parameters define orbit shape.
                    a: 1.324870564730606E+00,
                    e: 2.557785995665682E-01,
                    i: 1.077550722804860E+00,

                    // These parameters define the orientation of the orbit.
                    om: 3.170946964325638E+02,
                    w: 1.774865822248395E+02,
                    ma: 1.764302192487955E+02,

                    // Where the object is in its orbit.
                    epoch: 2458426.500000000,
                }, 'deg'),
            });
        },
        resetUniverse() {
            window.location.reload()
        }
    },
})