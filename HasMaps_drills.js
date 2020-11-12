const HashMap = require('./HashMap');

function main() {
    const lotr = new HashMap;
    lotr.MAX_LOAD_RATIO = 0.5;
    lotr.SIZE_RATIO = 3;
    lotr.set('Hobbit', 'Bilbo');
    lotr.set('Hobbit', 'Frodo');
    lotr.set('Wizard', 'Gandalf');
    lotr.set('Human', 'Aragorn');
    lotr.set('Elf', 'Legolas');
    lotr.set('Maiar', 'The Necromancer');
    lotr.set('Maiar', 'Sauron');
    lotr.set('RingBearer', 'Gollum');
    lotr.set('LadyOfLight', 'Galadriel');
    lotr.set('HalfElven', 'Arwen');
    lotr.set('Ent', 'Treebeard');
    console.log(lotr._hashTable);
    //last item 'Ent' is stated to be undefined
    //Bilbo and Necromancer were replaced with Sauron and Frodo
    console.log(lotr.get('Maiar'));
    console.log(lotr.get('Hobbit'));
    //retrieves Sauron and Frodo but not Bilbo and The Necromancer
    //Bilbo and The Necromancer were added first, so their values were
    //replaced when we added Sauron and Frodo
    console.log(lotr._capacity);
    //capacity is 8 even though we've added nine values
    //(not counting the double hobbit/maiar)
    //8 is the initial capacity so it seems like MAX_LOAD_RATIO and SIZE_RATIO arent working
}

main()


//2. WhatDoesThisDo
// const WhatDoesThisDo = function(){
//     let str1 = 'Hello World.';
//     let str2 = 'Hello World.';
//     let map1 = new HashMap();
//     map1.set(str1,10);
//     map1.set(str2,20);
//     let map2 = new HashMap();
//     let str3 = str1;
//     let str4 = str2;
//     map2.set(str3,20);
//     map2.set(str4,10);

//     console.log(map1.get(str1));
//     console.log(map2.get(str3));
// } 


//I believe this will print 20 and then print 10.
//map1 sets the value of Hello World to 10 and then to 20
//map2 sets teh value of Hello World to 20 and then to 10
//the strings are all the same value, so regardless of which
//'string' you get, it will return the same value
// 20 in map1, and 10 in

//3. Demonstrate understanding of Hash maps
// 10 = 10
// 22 = 0
// 31 = 9
// 4 = 4
// 15 = 4
// 28 = 6
// 17 = 6
// 88 = 0
// 59 = 4

const TestHashMap = [
    {22: null},
    {88: null},
    {},
    {},
    {4: null},
    {15: null},
    {28: null},
    {17: null},
    {59: null},
    {31: null},
    {10: null},
]

// 5 = 5
// 28 = 1
// 19 = 1
// 15 = 6
// 20 = 2
// 33 = 6
// 12 = 3
// 17 = 8
// 10 = 1

const AnotherTestHashMap = [
    {},
    [{28: null},
    {19: null},
    {10: null}],
    {20: null},
    {12: null},
    {},
    {5: null},
    [{15: null},
    {33: null}
    ],
    {},
    {17: null}
]

// not working
function removeDuplicates(string) {
    const stringMap = new HashMap;
    for (let i = 0; i < string.length; i++) {
        if(!stringMap.get(string[i])) {
            stringMap.set(string[i], string[i])
        }
    }

    let newString = '';
    for (const hash in stringMap) {
        if (hash !== undefined && !hash.DELETED)
        newString += hash.value
    }
    return newString;
}

console.log(removeDuplicates('google'));

//5. Any permuation of a palindrom

//6. Anagram grouping

//7. Separate Chaining
class SeparateChainingHashMap {
    constructor(initialCapacity = 8) {
        this.length = 0;
        this._hashTable = [];
        this._capacity = initialCapacity;
        this._deleted = 0;
    }

    get(key) {
        const index = this._findSlot(key);
        if (this._hashTable[index] === undefined) {
            throw new Error('Key error');
        }
        return this._hashTable[index].value;
    }

    set(key, value) {
        const loadRatio = (this.length + this._deleted + 1) / this._capacity;
        if (loadRatio > HashMap.MAX_LOAD_RATIO) {
            this._resize(this._capacity * HashMap.SIZE_RATIO);
        }

        const index = this._findSlot(key);

        if (!this._hashTable[index]) {
            this.length++;
            this._hashTable[index] = [];
        }
        this._hashTable[index].push([key, value]);
    }


    delete(key) {
        const index = this._findSlot(key);
        const slot = this._hashTable[index];
        if (slot === undefined) {
            throw new Error('Key error');
        }
        slot.DELETED = true;
        this.length--;
        this._deleted++;
    }

    //ask jeremy what's going on here, specifically the % stuff
    _findSlot(key) {
        const hash = HashMap._hashString(key);
        const start = hash % this._capacity;
        for (let i = start; i < start + this._capacity; i++) {
            const index = i % this._capacity;
            const slot = this._hashTable[index];
            if (slot === undefined || (slot.key === key && !slot.DELETED)) {
                return index;
            }
        }   
    }

    _resize(size) {
        const oldSlots = this._hashTable;
        this._capacity = size;
        this.length = 0;
        this._deleted = 0;
        this._hashTable = [];

        for (const slot of oldSlots) {
            if (slot !== undefined && !slot.DELETED) {
                this.set(slot.key, slot.value);
            }
        }
    }

    static _hashString(string) {
        let hash = 5381;
        for (let i = 0; i < string.length; i++) {
            hash = (hash << 5) + hash + string.charCodeAt(i);
            hash = hash & hash;
        }
        return hash >>> 0;
    }
}

SeparateChainingHashMap.SIZE_RATIO = 3;
SeparateChainingHashMap.MAX_LOAD_RATIO = .5; 