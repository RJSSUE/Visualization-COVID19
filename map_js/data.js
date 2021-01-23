var dat = null;
var country_capital = null;
var selected_country = [];
var cladeArr = ["19A", "19B", "20A", "20B", "20C", "20D", "20E (EU1)", "20F", "20G", "20H/501Y.V2", "20I/501Y.V1", "20J/501Y.V3"]
var color = ["#3A79AD","#EE8843","#549942","#C4433A","#8C85B6","#85594F", "#D486BF", "#7F7F7F", "#BDB84E", "#59BBCA", "#FFFF00",  "#7FFFAA"]
let capitalInfoMap = new Map();
let capitalStat = []
let filteredData = null;
let strainInfoMap = new Map();
//global variable
var data_legend = [
    {
        "name":"19A",
        "color":"#3A79AD"
    },
    {
        "name":"19B",
        "color":"#EE8843"
    },
    {
        "name":"20A",
        "color":"#549942"
    },
    {
        "name":"20B",
        "color":"#C4433A"
    },
    {
        "name":"20C",
        "color":"#8C85B6"
    },
    {
        "name":"20D",
        "color":"#85594F"
    },
    {
        "name":"20E (EU1)",
        "color":"#D486BF"
    },
    {
        "name":"20F",
        "color":"#7F7F7F"
    },
    {
        "name":"20G",
        "color":"#BDB84E"
    },
    {
        "name":"20H/501Y.V2",
        "color":"#59BBCA"
    },
    {
        "name":"20I/501Y.V1",
        "color":"#FFFF00"
    },
    {
        "name":"20J/501Y.V3",
        "color":"#7FFFAA"
    }
];

function InitializeData() {
    for (i in country_capital.countries) {
        capitalinfo = country_capital.countries[i]
        capitalInfoMap.set(capitalinfo.country, capitalinfo)
        selected_country[capitalinfo.country] = 0
    }

    for (i in dat) {
        strainInfoMap.set(dat[i]['Strain'], dat[i]);
    }
}