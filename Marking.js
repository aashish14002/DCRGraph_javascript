
export default class Marking {
  constructor(isExecuted, isIncluded, isPending) {
    this.isExecuted = isExecuted;
    this.isIncluded = isIncluded;
    this.isPending = isPending;
  }
}

exports.Marking = Marking;