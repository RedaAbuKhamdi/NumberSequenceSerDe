const {serialize, deserialize, get_random_number} = require('./index');

function run_serde(size, a, b){
  const numbers = Array.apply(null, Array(size)).map(function (x, i) { return get_random_number(1, 300); });
  let serialized  = serialize(numbers);
  let basic = numbers.join("");

  let deserialized = deserialize(serialized);
  let compression = serialized.length / basic.length;

  return [compression, serialized, numbers, deserialized];
}

test(
  'Serialize an array with random numbers from 1 to 300 with 50, 100, 500 and 1000 elements 10 times each. The average compression should be <= 50% and the deserialized set should equal the initial set', 
  () => {

  
  let n = 10;
  let sizes = [50, 100, 500, 1000];

  for (let size of sizes){
    
    let compression = 0;

    for (let i = 0; i < n; ++i){
  
      let [compression_i, serialized, numbers, deserialized] = run_serde(size, 1, 300);
      compression += compression_i;
      expect(deserialized.sort().join("")).toEqual(numbers.sort().join(""));
  
    }
  
    expect(compression/n).toBeLessThanOrEqual(0.5);

  }

});

test(
  'Serialize an array with random one digit numbers with 50, 100, 500 and 1000 elements 10 times each. The average compression should be <= 50% and the deserialized set should equal the initial set', 
  () => {

  
  let n = 10;
  let sizes = [50, 100, 500, 1000];

  for (let size of sizes){
    
    let compression = 0;

    for (let i = 0; i < n; ++i){
  
      let [compression_i, serialized, numbers, deserialized] = run_serde(size, 1, 9);
      compression += compression_i;
      expect(deserialized.sort().join("")).toEqual(numbers.sort().join(""));
  
    }
  
    expect(compression/n).toBeLessThanOrEqual(0.5);
    
  }

});


test(
  'Serialize an array with random two digit numbers with 50, 100, 500 and 1000 elements 10 times each. The average compression should be <= 50% and the deserialized set should equal the initial set', 
  () => {

  
  let n = 10;
  let sizes = [50, 100, 500, 1000];

  for (let size of sizes){
    
    let compression = 0;

    for (let i = 0; i < n; ++i){
  
      let [compression_i, serialized, numbers, deserialized] = run_serde(size, 10, 99);
      compression += compression_i;
      expect(deserialized.sort().join("")).toEqual(numbers.sort().join(""));
  
    }
  
    expect(compression/n).toBeLessThanOrEqual(0.5);
    
  }

});

test(
  'Serialize an array with random three digit numbers with 50, 100, 500 and 1000 elements 10 times each. The average compression should be <= 50% and the deserialized set should equal the initial set', 
  () => {

  
  let n = 10;
  let sizes = [50, 100, 500, 1000];

  for (let size of sizes){
    
    let compression = 0;

    for (let i = 0; i < n; ++i){
  
      let [compression_i, serialized, numbers, deserialized] = run_serde(size, 100, 300);
      compression += compression_i;
      expect(deserialized.sort().join("")).toEqual(numbers.sort().join(""));
  
    }
  
    expect(compression/n).toBeLessThanOrEqual(0.5);
    
  }

});

test(
  'Serialize an array with random 3 copies of each number. The compression should be <= 50% and the deserialized set should equal the initial set', 
  () => {

    let numbers = Array.apply(null, Array(300)).map(function (x, i) { return get_random_number(i+1, i+1); });
    numbers = numbers.concat(numbers).concat(numbers);

    let serialized  = serialize(numbers);
    let basic = numbers.join("");
  
    let deserialized = deserialize(serialized);
    let compression = serialized.length / basic.length;
    
    expect(deserialized.sort().join("")).toEqual(numbers.sort().join(""));

    expect(compression).toBeLessThanOrEqual(0.5);

});

test(
  'serialize function should throw exception if the array is empty', 
  () => {

  
  expect(()=>serialize([])).toThrow("Empty or invalid input");

});

test(
  'serialize function should throw exception if tarray contains negative values', 
  () => {

  
  expect(()=>serialize([-1])).toThrow("The array must contain non-negative values");

});

test(
  'deserialize function should throw exception if the input is empty', 
  () => {

  
  expect(()=>deserialize("")).toThrow("Empty or invalid input");

});

