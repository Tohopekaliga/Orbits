
export class Convert {

  //AU per Light Year
  static au_ly: number = 63241.077;

  //KM per AU
  static km_au: number = 149597870.7;

  //Degrees-Radians ratio
  static deg_rad: number = Math.PI / 180;

  //seconds per day
  static seconds_day: number = 60 * 60 * 24;

  static DaystoSec(d: number) {
    return d * Convert.seconds_day;
  }

  //Universal Gravitation Constant
  static G: number = 6.67408e-11;

  //Small number
  static Epsilon: number = 1e-10;

  //Light Years to AU
  static LYtoAU(ly: number) {
    return ly * Convert.au_ly;
  }

  static AUtoLY(au: number) {
    return au / Convert.au_ly;
  }

  static KMtoAU(km: number) {
    return km / Convert.km_au;
  }

  static AUtoKM(au: number) {
    return au * Convert.km_au;
  }

  static DegreesToRad(d: number) {
    return d * Convert.deg_rad;
  }

  static RadToDegrees(r: number) {
    return r / Convert.deg_rad;
  }

  static DaysToSeconds(d: number) {
    return d * 24 * 60 * 60;
  }
}
