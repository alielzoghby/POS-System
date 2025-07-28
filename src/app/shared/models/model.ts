export abstract class Model {
  toJson?() {
    return JSON.stringify(this);
  }
}
