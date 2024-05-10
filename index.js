/**
 * @param {Object[]} counts Array of objects containing counts information
 * @param {Object[]} counts[].number The number for which we have count
 * @param {Object[]} counts[].count Amount of occurrences of number
 * @return {Object[]} 
 */
function generate_count_gropus(counts){

    const bins = Array.from(new Set(counts.map((x)=>x.count))).map((x)=>{
        return {
            group:x,
            members: counts.filter((c)=>c.count==x).map((c)=>parseInt(c.number))
        }
    }).sort((a, b)=>b.group - a.group);
    return bins;

}
/**
 * 
 * @param {Number} min Start of random number generation range 
 * @param {Number} max End of random number generation range 
 * @returns {Number}
 */
function get_random_number(min, max) {

    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @param {Set|Number[]} numbers Iterable of non-negative integers
 * @return {Object} 
 */
function generate_size_groups(numbers){

    let groups = {
        one_symbol:[],
        two_symbols:[],
        three_symbols:[]
    };
    numbers.sort();
    
    for (number of numbers){
        if (number < 2**7){
            groups.one_symbol.push(number);
        }else if (number < 2**8){
            groups.two_symbols.push(number);
        }else{
            groups.three_symbols.push(number);
        }
    }

    groups.one_symbol = Array.from(new Set(groups.one_symbol));
    groups.two_symbols = Array.from(new Set(groups.two_symbols));
    groups.three_symbols = Array.from(new Set(groups.three_symbols));

    return groups;
}

/**
 * @param {Set|Number[]} numbers Iterable of non-negative integers
 * @return {String} 
 */
function serialize(numbers){

    // Safety checks
    if (!numbers.length){
        throw "Empty or invalid input";
    }else if (Math.min(numbers) < 0){
        throw "The array must contain non-negative values"
    }

    // Count the occurrences of each number
    const counts = {};
    for (let number of numbers){
        counts[number] = counts[number] ? counts[number] + 1 : 1;
    }
    const number_counts = Object.keys(counts).map((x)=>{return {number: x, count: counts[x]}});


    const groups = generate_size_groups(numbers);
    const bins = generate_count_gropus(number_counts);

    let result = "";


    let encode_amount = (amount)=>{
        let encoded_amount = String.fromCharCode(Math.floor(amount/2**7))+String.fromCharCode(amount%(2**7));
        return encoded_amount;
    };

    for (let bin of bins){
        let size_group_1 = groups.one_symbol.filter((x)=>bin.members.includes(x));
        let size_group_2 = groups.two_symbols.filter((x)=>bin.members.includes(x));
        let size_group_3 = groups.three_symbols.filter((x)=>bin.members.includes(x));

        result += encode_amount(bin.group) + String.fromCharCode(size_group_1.length)+size_group_1.map(
            (x)=>String.fromCharCode(x)
        ).join("")

        result += String.fromCharCode(size_group_2.length)+size_group_2.map(
            (x)=>String.fromCharCode(x-(2**7))
        ).join("")

        result += String.fromCharCode(size_group_3.length)+size_group_3.map(
            (x)=>String.fromCharCode(x-(2**8))
        ).join("")

    }
    return result;

}
/**
 * @param {String} group Representation of number sequence size group
 * @param {Number} group_size Size of the group
 * @param {Number} group_order Order of the group. Must be 1, 2 or 3
 * @return {Set|Number[]} Iterable of non-negative integers
 */
function parse_size_group(group, group_size, group_order){

    let index = 0;
    let result = [];

    while (index < group_size){
        result.push(group_order == 0 ? group.charCodeAt(index++) : 
        (2**(7+group_order-1))+group.charCodeAt(index++));
    }

    return result;
}
/**
 * @param {String} group Representation of number sequence count group
 * @param {Number} group_size Size of the group
 * @return {Set|Number[]} Iterable of non-negative integers
 */
function parse_count_group(group, group_size){

    let index = 0;
    let result = [];

    for (let group_order of [0, 1, 2]){
        let size_group_length = group.charCodeAt(index++);
        let size_group_result = parse_size_group(group.slice(index, index + size_group_length), size_group_length, group_order);
        index += size_group_length;
        result = result.concat(size_group_result);
    }
    
    return [result, index];

}

/**
 * @param {String} serialized Representation of number sequence 
 * @return {Set|Number[]} Iterable of non-negative integers
 */
function deserialize(serialized){

    // Safety checks
    if (!serialized || !serialized.length){
        throw "Empty or invalid input";
    }

    // Decode string
    let decoded_set = [];
    let index = 0;

    while (index < serialized.length){

        let group_size = serialized.charCodeAt(index++)*(2**7) +  serialized.charCodeAt(index++);
        let [group_result, forward_index] = parse_count_group(serialized.slice(index), group_size);
        index += forward_index;
        decoded_set = decoded_set.concat(Array(group_size).fill(group_result).flat());

    }

    return decoded_set;

}

module.exports = {serialize, deserialize, get_random_number};