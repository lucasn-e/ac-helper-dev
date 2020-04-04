export const queryForIndexes = (arr1, arr2) => {
  return arr1.map(elem => {
    let id;
    arr2.some((element, index) => {
      if (elem == element.name) {
        id = index;
        return elem == element.name;
      }
    });
    return id;
  });
}

export const queryByIndex = (arr1, arr2) => {
  return arr1.map(elem => {
    let name;
    arr2.some((element, index) => {
      if (elem == index) {
        name = element.name;
        return elem == index;
      }
    });
    return name;
  });
}