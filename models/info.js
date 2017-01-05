var info = [
        {
        mediumName: "Bangla Medium",
        levels: [
            { name: "Play", year: 0},
            { name: "Nursery", year: 1},
            { name: "Class 1", year: 2},
            { name: "Class 2", year: 3},
            { name: "Class 3", year: 4},
            { name: "Class 4", year: 5},
            { name: "Class 5", year: 6}
        ]
    },
    {
        mediumName: "English Medium",
        levels: [
            { name: "Standard Play", year: 0},
            { name: "StandardNursery", year: 1},
            { name: "Standard 1", year: 2},
            { name: "Standard 2", year: 3},
            { name: "Standard 3", year: 4},
            { name: "Standard 4", year: 5},
            { name: "Standard 5", year: 6}
        ]
    }
];
class Info{
    constructor(inf){
        this.info = inf;
    }

    getMediums(){
        var mList = [];
        for(var i =0; i< info.length; i++){
            mList.push(this.info[i]['mediumName']);
        }
        return mList;
    }
    
    getLevels(mediumName){
        var Llist = [];
        this.info.forEach(function(medium){
            if(medium["mediumName"]==mediumName){
                medium["levels"].forEach(function(level){
                    Llist.push(level.name);
                });
            }
        });
        return Llist;
    }

};

module.exports = new Info(info);