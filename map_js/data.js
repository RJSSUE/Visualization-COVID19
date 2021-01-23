var dat = null;
var country_capital = null;
var selected_country = [];
var cladeArr = ["19A", "19B", "20A", "20B", "20C", "20D", "20E (EU1)", "20F", "20G", "20H/501Y.V2", "20I/501Y.V1", "20J/501Y.V3"]
var color = ["#3A79AD","#EE8843","#549942","#C4433A","#8C85B6","#85594F", "#D486BF", "#7F7F7F", "#BDB84E", "#59BBCA", "#FFFF00",  "#7FFFAA"]
let capitalInfoMap = new Map();
let capitalStat = []
let filteredData = null;
let strainInfoMap = new Map();
let weekDateMap = []
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


function collection_data(s){
    s = s.toString();
    let m_d = [31,29,31,30,31,30,31,31,30,31,30,31];
    let year = parseInt(s.substring(0,4));
    let month = parseInt(s.substring(5,7));
    let day = parseInt(s.substring(8,10));
    if(year == 2019)
        return day-26+1;
    if(year == 2020) {
        let da = 6;
        for(let i = 0; i < month-1; i++){
            da += m_d[i];
        }
        da += day;
        return da;
    }
    else{
        return 6+366+day;
    }
}

function InitializeData() {
    for (i in country_capital.countries) {
        capitalinfo = country_capital.countries[i]
        capitalInfoMap.set(capitalinfo.country, capitalinfo)
        selected_country[capitalinfo.country] = 0
    }

    for (i in dat) {
        strainInfoMap.set(dat[i]['Strain'], dat[i]);
    }

    m_d = [31,29,31,30,31,30,31,31,30,31,30,31];
    // 2019 31
    year = 2019
    month = 12
    day = 22

    for(var i = 0; ; ++ i) {
        if(day + 7 <= m_d[month-1]) {
            day += 7;
        } else {
            day = day + 7 - m_d[month-1];
            month ++;
            if(month == 13) {
                month = 1;
                year ++;
            }
        }
        weekDateMap[i] = new Date(year+"-"+month+"-"+day);
        // console.log(weekDateMap[i], i, year, month, day, year+"-"+month+"-"+day)
        if(year == 2021 && day > 10) {
            break;
        }
    }

}