import { PointMass } from './physics/point-mass';
import { StarSystem } from './star-system';
import { StellarBody } from './physics/stellar-body';
import { CelestialBody } from './physics/celestial-body';
import { OrbitalGroup } from './physics/orbital-group';
import { Convert } from './physics/math3d';

var groupSpec = [
    {
        name: "planets",
        color: "green",
        size: 4,
        paths: true
    },
    {
        name: "mainBelt",
        color: "grey",
        size: 3,
        paths: false
    },
    {
        name: "comets",
        color: "blue",
        size: 3,
        paths: false
    },
    {
        name: "tno",
        color: "silver",
        size: 2,
        paths: false
    }
]


export class SystemGenerator {

    static loadFromJson(data:any):StarSystem {
        
        var system = new StarSystem();

        system.star = new StellarBody(data.star.name, data.star.mass, data.star.radius);


        for (let g = 0; g < groupSpec.length; g++) {
            let groupName = groupSpec[g].name;
            
            let groupData = data[groupName];

            var group = new OrbitalGroup(groupName, groupSpec[g].color, groupSpec[g].size, groupSpec[g].paths);
        
        
            for (let c = 0; c < groupData.length; c++) {
        
                //JPL data defines mass as x * 10e24 kg, and only provides GM (mass * g) for most bodies.
                let mass = groupData[c].mass ? groupData[c].mass * 1e24 : groupData[c].GM / Convert.G;
        
                var body = new CelestialBody(
                groupData[c].name ? groupData[c].name : groupData[c].full_name, //some TNOs don't have proper names, but do have designators in the full name.
                groupData[c].e,
                Convert.AUtoKM(groupData[c].a) * 1000,
                groupData[c].w,
                groupData[c].ma,
                groupData[c].i,
                groupData[c].l,
                system.star,
                mass,
                groupData[c].radius
                );
        
                if (groupData[c].satellites != null) {
                for (let moon of groupData[c].satellites) {
                    let moonEntity = new CelestialBody(
                    moon.name,
                    moon.e,
                    moon.a * 1000, //JPL reports these as km rather than AU
                    moon.w,
                    moon.ma,
                    moon.i,
                    moon.l,
                    body,
                    moon.mass ? moon.mass : 0
                    );
        
                    system.searchList.push(moonEntity);
                    body.addMoon(moonEntity);
                }
        
                }
        
                system.searchList.push(body);
                group.addEntity(body);
            }

            system.bodies.push(group);
            
        }

        system.searchList.sort((a: PointMass, b: PointMass) => { return a.name < b.name ? -1 : 1;});

        return system;
    }
}