var dat = null;
var country_capital = null;
var selected_country = [];
var cladeArr = ["19A", "19B", "20A", "20B", "20C", "20D", "20E (EU1)", "20F", "20G", "20H/501Y.V2", "20I/501Y.V1", "20J/501Y.V3"]
var color = ["blueviolet","slateblue","royalblue","cornflowerblue","darkcyan","aquamarine", "lightgreen", "yellowgreen", "goldenrod", "orange", "orangered",  "red"]
let capitalInfoMap = new Map();
let capitalStat = []
//global variable
var data_legend = [
    {
        "name":"19A",
        "color":"blueviolet"
    },
    {
        "name":"19B",
        "color":"slateblue"
    },
    {
        "name":"20A",
        "color":"royalblue"
    },
    {
        "name":"20B",
        "color":"cornflowerblue"
    },
    {
        "name":"20C",
        "color":"darkcyan"
    },
    {
        "name":"20D",
        "color":"aquamarine"
    },
    {
        "name":"20E (EU1)",
        "color":"lightgreen"
    },
    {
        "name":"20F",
        "color":"yellowgreen"
    },
    {
        "name":"20G",
        "color":"goldenrod"
    },
    {
        "name":"20H/501Y.V2",
        "color":"orange"
    },
    {
        "name":"20I/501Y.V1",
        "color":"orangered"
    },
    {
        "name":"20J/501Y.V3",
        "color":"red"
    }
];

function InitializeData() {
    for (i in country_capital.countries) {
        capitalinfo = country_capital.countries[i]
        capitalInfoMap.set(capitalinfo.country, capitalinfo)
        selected_country[capitalinfo.country] = 0
    }
}