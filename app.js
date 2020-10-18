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
                        <input step=0.00000000000001 id='craft' type="text" v-model='name' :placeholder='name'/>
                        <br>
                        <label for='axis'>Semi Major Axis</label>
                        <input step=0.00000000000001 id='axis' type="number" v-model='semiMajorAxis' :placeholder='semiMajorAxis'/>
                        <br>
                        <label for='ecc'>Eccentricity</label>
                        <input step=0.00000000000001 id='ecc' type="number" v-model='Eccentricity' :placeholder='Eccentricity'/>
                        <br>
                        <label for='inc'>Inclination</label>
                        <input step=0.00000000000001 id='inc' type="number" v-model='Inclination' :placeholder='Inclination'/>
                        <br>
                        <label for='node'>Longitude Of Ascending Node</label>
                        <input step=0.00000000000001 id='node' type="number" v-model='longitudeOfAscendingNode' :placeholder='longitudeOfAscendingNode'/>
                        <br>
                        <label for='perihelion'>Argument of Perihelion</label>
                        <input step=0.00000000000001 id='perihelion' type="number" v-model='argumentOfPerihelion' :placeholder='argumentOfPerihelion'/>
                        <br>
                        <label for='anomaly'>Mean Anomaly</label>
                        <input step=0.00000000000001 id='anomaly' type="number" v-model='meanAnomaly' :placeholder='meanAnomaly'/>
                        <br>
                        <label for='epoch'>Epoch In JD</label>
                        <input step=0.00000000000001 id='epoch' type="number" v-model='epochInJD' :placeholder='epochInJD'/>
                        <br>
                    </div>
                    <br>
                    <h3>Planets</h3>
                    <div id="radioContainers">
                        <div class="planetRadios" v-for="object in objects">
                            <input type="radio" :value="object" @click="addToSelected">
                            <label>{{object}}</label>
                        </div>
                    </div>
                    <br>
                    <input type="radio" @click="addPerseids"/>
                    <label>Perseids</label>
                    <input type="radio" @click="selectAll"/>
                    <label>Select All</label>
                    <br>
                    <button @click="toggleAbout">What Does All of this Mean?</button>
                    <about v-if="about"></about>
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
                meteors: false,
                name: 'Space Craft',
                semiMajorAxis: 1.324870564730606E+00,
                Eccentricity: 2.557785995665682E-01,
                Inclination: 1.077550722804860E+00,
                longitudeOfAscendingNode: 3.170946964325638E+02,
                argumentOfPerihelion: 1.774865822248395E+02,
                meanAnomaly: 1.764302192487955E+02,
                epochInJD: 2458400.500000000,
                universeCreated: false,
                about: false
            }
        },
        methods: {
            toggleAbout() {
                this.about = !this.about
            },
            selectAll() {
                this.meteors = true;
                this.selectedObjs = this.objects;
            },
            addPerseids() {
                this.meteors = true;
            },
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
                            this.viz.createObject('earth',Spacekit.SpaceObjectPresets.EARTH);
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
                       
                        a: this.semiMajorAxis,
                        e: this.Eccentricity,
                        i: this.Inclination,

                      
                        om: this.longitudeOfAscendingNode,
                        w: this.argumentOfPerihelion,
                        ma: this.meanAnomaly,

                       
                        epoch: this.epochInJD,
                    }, 'deg')
                });
            },
            createSun() {
                this.sun = this.viz.createObject('sun', Spacekit.SpaceObjectPresets.SUN);
            },
            makeSpace() {
                // Create a background using Yale Bright Star Catalog data.
                this.universeCreated = true
                this.viz.createStars();
                this.createSun();
                if (this.selectedObjs) {
                    this.createPlanets();
                    this.createObject();
                    if (this.meteors) {
                        this.createPerseids();
                    }
                }

            },
            resetUniverse() {
                window.location.reload()
            },
            createPerseids() {
                window.PERSEIDS_EPHEM.forEach((rawEphem, idx) => {
                    const ephem = new Spacekit.Ephem({
                        a: rawEphem.a,
                        e: rawEphem.e,
                        i: (rawEphem.i * Math.PI) / 180,
                        om: (rawEphem.om * Math.PI) / 180,
                        w: (rawEphem.w * Math.PI) / 180,
                        ma: 0,
                        epoch: Math.random() * 2500000,
                    });

                    this.viz.createObject(`perseids_${idx}`, {
                        hideOrbit: true,
                        particleSize: 10,
                        textureUrl: '{{assets}}/sprites/fuzzyparticle.png',
                        ephem,
                    });
                });
            }

        }
    })

Vue.component('earthparticles', {
    props: {
        viz: {
            type: Object,
            required: true
        }
    },
    template: `
        <div>
            <div v-if="!planetCreated" id="control" >
                <div id="numberInputs">
                            <label for='ParticlesCount'>Surface Particles Count</label>
                            <input id='ParticlesCount' type="text" v-model='surfaceParticlesCount' :placeholder='surfaceParticlesCount'/>
                            <br>
                            <label for='particleSize'>Particle Size</label>
                            <input id='particleSize' type="number" v-model='particleSize' :placeholder='particleSize'/>
                            <br>
                            <label for='surfaceColor'>Surface Particle Color </label>
                            <input id='surfaceColor' type="color" v-model='surfaceColor' :placeholder='surfaceColor'/>
                            <br>
                            <label for='nearColor'>Near Particle Color</label>
                            <input id='nearColor' type="color" v-model='nearColor' :placeholder='nearColor'/>
                            <br>
                            
                </div>
                <br>
                <h3>Planets</h3>
                <div class="planetRadios">
                    
                    <input type="radio" value="earth" v-model="planet">
                    <label>Earth</label>

                    <input type="radio" value="venus" v-model="planet">
                    <label>Venus</label>  
                </div><br>
                <button @click="makeSpace">Submit</button>
            </div>
            <div v-else id="control">
                <button @click='resetUniverse'>Destroy</button>
            </div>
        </div>
    `,
    data(){
        return{
            pictures: {
                'earth': 'https://typpo.github.io/spacekit/examples/static-particle-field/earth.jpg',
                'venus': 'https://upload.wikimedia.org/wikipedia/commons/1/19/Cylindrical_Map_of_Venus.jpg'
            },
            surfacePositions: [],
            nearPositions: [],
            farPositions: [],
            surfaceParticlesCount: 10,
            particleSize: 8,
            surfaceColor: 'yellow',
            nearColor: 0x0099ff,
            planet: 'earth',
            planetCreated: false
        }
    },
    methods: {
        makeSpace() {
            this.planetCreated = true
            this.viz.createStars()
            const nearParticlesCount = this.surfaceParticlesCount * 10;
            const farParticlesCount = this.surfaceParticlesCount * 100;
            this.fillParticles(this.surfaceParticlesCount, 1, 1, this.surfacePositions);
            this.fillParticles(nearParticlesCount, 1.5, 2.5, this.nearPositions);
            this.fillParticles(farParticlesCount, 2.5, 5, this.farPositions);
            this.viz.createStaticParticles('surface', this.surfacePositions, {
                defaultColor: this.surfaceColor,
                size: this.particleSize,
            });
            this.viz.createStaticParticles('near', this.nearPositions, {
                defaultColor: this.nearColor,
                size: this.particleSize,
            });
            this.viz.createStaticParticles('far', this.farPositions, {});
            console.log(this.pictures.mars)
            this.createPlanet()
        },
        createPlanet(){
            this.viz.createSphere(this.planet, {
                textureUrl: this.pictures[`${this.planet}`],
                debug: {
                    showAxes: true,
                },
            });
        },
        fillParticles(count, minRange, maxRange, particles) {
            for (let i = 0; i < count; i++) {
                const newParticle = this.randomPosition(minRange, maxRange);
                particles.push(newParticle);
            }
        },
        randomPosition(minRange, maxRange) {
            const delta = maxRange - minRange;
            let mag = 1;

            if (delta > 0) {
                mag = delta * Math.random() + minRange;
            }

            const ra = this.randomAngle(0, 2 * Math.PI);
            const dec = this.randomAngle(-Math.PI / 2, Math.PI / 2);
            const z = mag * Math.sin(dec);
            const x = mag * Math.cos(dec) * Math.cos(ra);
            const y = mag * Math.cos(dec) * Math.sin(ra);

            return [x, y, z];
        },
        randomAngle(min, max) {
            const delta = max - min;
            return min + Math.random() * delta;
        },

        resetUniverse() {
            window.location.reload()
        }
    }
}
)

Vue.component('about', {
    template: `
    <div id='control'>
        <div id='about'>
            <h3>Orbital Mechanic Variables</h3>
            <h4>Orbit Shape</h4>
            <p>Semi Major Axis: The semi-major axis is one half of the major axis<a href='https://en.wikipedia.org/wiki/Semi-major_and_semi-minor_axes#:~:text=The%20semi%2Dmajor%20axis%20is,center%20of%20the%20conic%20section.'>...</a></p>
            <p>Eccentricity: The orbital eccentricity of an astronomical object is a dimensionless parameter that determines the amount by which its orbit around another body deviates from a perfect circle<a href='https://en.wikipedia.org/wiki/Orbital_eccentricity'>...</a></p> 
            <p>Inclination: Measures the tilt of an object's orbit around a celestial body<a href='https://en.wikipedia.org/wiki/Orbital_inclination'>...</a></p>
            <h4>Orientation of Orbit</h4>
            <p>Longitude of Ascending Node: The angle from a specified reference direction, called the origin of longitude<a href='https://en.wikipedia.org/wiki/Longitude_of_the_ascending_node#:~:text=The%20longitude%20of%20the%20ascending%20node%20(%E2%98%8A%20or%20%CE%A9)%20is,of%20an%20object%20in%20space.&text=The%20ascending%20node%20is%20the,seen%20in%20the%20adjacent%20image.'>...</a></p>
            <p>Argument of Perihelion: The point of closest approach between the orbiting body (e.g. a planet) and the focus<a href='https://astronomy.swin.edu.au/cosmos/A/Argument+Of+Perihelion#:~:text=The%20perihelion%20is%20the%20point,argument%20of%20perihelion%20(%CF%89).'>...</a></p>
            <p>Mean Anomaly: The fraction of an elliptical orbit's period that has elapsed since the orbiting body passed periapsis<a href='https://en.wikipedia.org/wiki/Mean_anomaly'>...</a></p>  
            <h4>Location In Orbit</h4>
            <p>Epoch: Moment in time used as a reference point for some time-varying astronomical quantity<a href='https://en.wikipedia.org/wiki/Epoch_(astronomy)'>...</a></p>
        </div>
    </div>
    `
})
const app = new Vue({
    el: "#app",
    data() {
        return {
            sPage: false,
            selectPage: 0,
            viz: new Spacekit.Simulation(document.getElementById('space'), {
                basePath: 'https://typpo.github.io/spacekit/src',
                maxNumParticles: 2 ** 16,
                jd: 0.0,
                jdDelta: 2,
            })
        }
    },
    methods: {
        selectP(value) {
            this.sPage = true;
            this.selectPage = value;
            window.scrollTo(0,0);
        }
    },
    computed: {
        solarSystem() {
            if (this.selectPage === 1) {
                return true
            }
            return false
        },
        earth() {
            console.log(this.selectPage)
            if (this.selectPage === 2) {
                return true
            }
            return false
        }
    }
})

