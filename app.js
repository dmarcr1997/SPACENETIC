Vue.component('solarsystem',
    {
        props: {
            viz: Object
        },
        template: `
            <div>    
                <div v-if="!universeCreated" id="control">
                    <h3>Craft</h3>
                    <div id="numberInputs">
                        <label for='craft'>Craft Name</label>
                        <input id='craft' type="text" v-model='name' :placeholder='name'/>
                        <br>
                        <label for='axis'>Semi Major Axis</label>
                        <input id='axis' type="number" v-model='semiMajorAxis' :placeholder='semiMajorAxis'/>
                        <br>
                        <label for='ecc'>Eccentricity</label>
                        <input id='ecc' type="number" v-model='Eccentricity' :placeholder='Eccentricity'/>
                        <br>
                        <label for='inc'>Inclination</label>
                        <input id='inc' type="number" v-model='Inclination' :placeholder='Inclination'/>
                        <br>
                        <label for='node'>Longitude Of Ascending Node</label>
                        <input id='node' type="number" v-model='longitudeOfAscendingNode' :placeholder='longitudeOfAscendingNode'/>
                        <br>
                        <label for='perihelion'>Argument of Perihelion</label>
                        <input id='perihelion' type="number" v-model='argumentOfPerihelion' :placeholder='argumentOfPerihelion'/>
                        <br>
                        <label for='anomaly'>Mean Anomaly</label>
                        <input id='anomaly' type="number" v-model='meanAnomaly' :placeholder='meanAnomaly'/>
                        <br>
                        <label for='epoch'>epochInJD</label>
                        <input id='epoch' type="number" v-model='epochInJD' :placeholder='epochInJD'/>
                        <br>
                    </div>
                    <br>
                    <h3>Planets</h3>
                    <div id="radioContainers">
                        <div class="planetRadios" v-for="object in objects">
                            <label>{{object}}</label>
                            <input type="radio" :value="object" @click="addToSelected">
                        </div>
                    </div><br>
                    <button @click='makeSpace'>Create A Universe</button>
                </div>
                <div v-else id="control">
                    <button @click='resetUniverse'>Destroy Your Universe</button>
                </div>
            </div>
           
        `,
        data() {
            return {
                objects: ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'],
                selectedObjs: [],
                name: 'Tesla Roadster',
                semiMajorAxis: 1.324870564730606E+00,
                Eccentricity: 2.557785995665682E-01,
                Inclination: 1.077550722804860E+00,
                longitudeOfAscendingNode: 3.170946964325638E+02,
                argumentOfPerihelion: 1.774865822248395E+02,
                meanAnomaly: 1.764302192487955E+02,
                epochInJD: 2458426.500000000,
                universeCreated: false
            }
        },
        methods: {
            addToSelected(e) {
                this.selectedObjs.push(e.target.value)
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
            createObject() {
                const craft = this.viz.createObject('spaceman', {
                    labelText: this.name,
                    ephem: new Spacekit.Ephem({
                        // These parameters define orbit shape.
                        a: this.semiMajorAxis,
                        e: this.Eccentricity,
                        i: this.Inclination,

                        // These parameters define the orientation of the orbit.
                        om: this.longitudeOfAscendingNode,
                        w: this.argumentOfPerihelion,
                        ma: this.meanAnomaly,

                        // Where the object is in its orbit.
                        epoch: this.epochInJD,
                    }, 'deg'),
                });
            },
            createSun() {
                this.viz.createObject('sun', Spacekit.SpaceObjectPresets.SUN);
            },
            makeSpace() {
                // Create a background using Yale Bright Star Catalog data.
                this.universeCreated = true
                this.viz.createStars();
                this.createSun();
                if (this.selectedObjs)
                    this.createPlanets();
                    this.createObject();
            },
            resetUniverse() {
                window.location.reload()
            }

        }
    })


const app = new Vue({
    el: "#app",
    data() {
        return {
            viz: new Spacekit.Simulation(document.getElementById('space'), {
                basePath: 'https://typpo.github.io/spacekit/src',
            }),
        }
    }
})

