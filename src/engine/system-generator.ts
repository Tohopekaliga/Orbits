import { PointMass, StellarBody, CelestialBody, OrbitalGroup } from './physics';
import { StarSystem } from './space';
import { Convert } from './math3d';

var groupSpec = [
  {
    name: "planets",
    color: "green",
    size: 4,
    paths: true
  },
  {
    name: "dwarfs",
    color: "olive",
    orbitColor: "#222222",
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

  static loadFromJson(data: any): StarSystem {

    var system = new StarSystem();

    system.star = new StellarBody(data.star.name, data.star.mass, data.star.radius * 1000);


    for (let g = 0; g < groupSpec.length; g++) {
      let groupName = groupSpec[g].name;

      let groupData = data[groupName];

      let orbitColor = "grey";
      if (groupSpec[g].orbitColor) {
        orbitColor = groupSpec[g].orbitColor;
      }

      var group = new OrbitalGroup(groupName, groupSpec[g].color, groupSpec[g].size, groupSpec[g].paths, orbitColor);


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
          groupData[c].radius ? groupData[c].radius * 1000 : 0
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
              moon.mass ? moon.mass : 0,
              moon.radius ? moon.radius : 0
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

    system.searchList.sort((a: PointMass, b: PointMass) => { return a.name < b.name ? -1 : 1; });

    return system;
  }
}
