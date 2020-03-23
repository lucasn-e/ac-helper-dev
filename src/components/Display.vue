<template>
    <div class="display-container">
        <div class="menu" v-if="!!data">
            <h3>{{ data | capitalize }} Guide</h3>
            <div class="filter">
                Search:
                <input type="text" v-model="filterValue" />
            </div>
            <div class="sortby">
                Sort by:
                <div class="mini-button" @click="sortby('month')" :class="sort === 'month' ? 'active' : ''">
                    Month
                </div>
                <div class="mini-button" @click="sortby('name')" :class="sort !== 'month' ? 'active' : ''">
                    Name
                </div>
            </div>
            <div v-if="sort === 'month'" class="jumpto-bar">
                Display data for:
                <div v-for="(month, index) in months" :key="month" @click="setActiveMonth(index)" :class="activeMonth == index ? 'jumpto-link active' : 'jumpto-link'">
                    {{ month }}
                </div>
            </div>
        </div>
        <div v-if="!!data" class="table-container">
            <table class="data-table">
                <thead>
                    <tr class="month-row">
                        <th class="monthname" colspan="6">
                            {{ activeMonthData.month }}
                        </th>
                    </tr>
                    <tr class="header-row">
                        <th>
                            Captured
                        </th>
                        <th>
                            Name
                        </th>
                        <th>
                            Season
                        </th>
                        <th>
                            Location
                        </th>
                        <th>
                            Time
                        </th>
                        <th>
                            Value
                        </th>
                    </tr>
                </thead>
                <tbody v-if="sort !== 'month'">
                    <tr v-for="fish in sortedData" :key="`fish-${fish.name}`" :class="myfishies.includes(fish.name) ? 'content-row caught' : 'content-row'" @click="pep(fish)">
                        <td class="caught">
                                <div :class="myfishies.includes(fish.name) ? 'x active' : 'x inactive'">
                                    X
                                </div>
                            </td>
                        <td>
                            {{ fish.name }}
                        </td>
                        <td>
                            {{ fish.season }}
                        </td>
                        <td>
                            {{ fish.location }}
                        </td>
                        <td>
                            {{ fish.time }}
                        </td>
                        <td>
                            {{ fish.value }}
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                        <tr v-for="fish in activeMonthData.fish" :key="`fish-${fish.name}-${index}`" :class="myfishies.includes(fish.name) ? 'content-row caught' : 'content-row'" @click="pep(fish)">
                            <td class="caught">
                                <div :class="myfishies.includes(fish.name) ? 'x active' : 'x inactive'">
                                    X
                                </div>
                            </td>
                            <td>
                                {{ fish.name }}
                            </td>
                            <td>
                                {{ fish.season }}
                            </td>
                            <td>
                                {{ fish.location }}
                            </td>
                            <td>
                                {{ fish.time }}
                            </td>
                            <td>
                                {{ fish.value }}
                            </td>
                        </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>

import Fish from '../data/fish.json';

export default {
    data() {
        return {
            filterValue: '',
            sort: 'month',
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
            fish: Fish,
            activeMonth: 0,
            myfishies: localStorage.getItem('myfishies') ||''
        }
    },
    props: {
        data: {
            type: String
        }
    },
    filters: {
        capitalize: function (value) {
            if (!value) return ''
            value = value.toString()
            return value.charAt(0).toUpperCase() + value.slice(1)
        }
    },
    computed: {
        activeMonthData() {
            return this.sortedData[this.activeMonth];
        },
        cleanedFish() {
            return this.fish.map(fish => {
                const pattern = /<p>|<\/p>/g;
                return {
                    name: fish.name.replace(pattern, ''),
                    season: fish.season.replace(pattern, ''),
                    location: fish.location.replace(pattern, ''),
                    time: fish.time.replace(pattern, '').replace(/(\d) /, '$1 '),
                    value: fish.value.replace(pattern, '')
                }
            })
        },
        filteredData() {
            if (this.data === 'fish') {
                return this.cleanedFish.filter(fish => fish.name.toUpperCase().includes(this.filterValue.toUpperCase()));
            } else {
                return [];
            }
        },
        sortedData() {
            if (this.sort === 'month') {
                return this.months.map((element, i) => {
                    return {
                        month: element,
                        fish: this.filteredData.filter(elem => {
                            const current = i;
                            let from, to;
                            let myFish = { ...elem };
                            const filterValue = /-/.test(elem.season) ? elem.season.split('-') : elem.season;
                            if (typeof filterValue === 'object') {
                                this.months.some((month, index) => {
                                    if (filterValue[0].includes(month)) {
                                        from = index;
                                        return true;
                                    }
                                });
                                this.months.some((month, index) => {
                                    if (filterValue[1].includes(month)) {
                                        to = index;
                                        return true;
                                    }
                                });
                                if (from >= current && to >= current && to < from) {
                                    return myFish;
                                } else if (current >= from && current <= to) {
                                    return myFish;
                                }
                            } else if (filterValue === 'All year' || filterValue == element) {
                                return myFish;
                            }
                        })
                    }
                });
            } else {
                return this.filteredData
            }
        }
    },
    methods: {
        sortby(value) {
            this.sort = value;
        },
        pep(val) {
            if (this.myfishies.includes(val.name)) {
                this.myfishies = this.myfishies.replace(val.name, '');
            } else {
                this.myfishies = this.myfishies+val.name;
            }
            localStorage.setItem('myfishies', this.myfishies);
        },
        setActiveMonth(month) {
            this.activeMonth = month;
        }
    }
}
</script>
<style>
.display-container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}
.table-container {
    min-width: 55%;
}
.data-table {
    min-width: 100%;
}
.menu {
    width: 100%;
}
tr {
    height: 35px;
}
.header-row {
    background-color: #FFE46A;
    color: #C4161C;
}
.content-row {
    transition: .25s;
}
.content-row:nth-child(even) {
    background-color: #dcdcdc;
}
.content-row.caught {
    background-color: #b5ff9e;
}

.sortby {
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    margin: 15px 0;
}
.mini-button {
    padding: 0 15px;
    cursor: pointer;
    user-select: none;
}
.mini-button:hover {
    color: #C4161C;
}
.month-row {
    margin-top: 15px;
}
.monthname {
    height: 100px;
    background-color: 	#c5a5b8;
    font-size: 2em;
}
.active {
    color: #C4161C;
}
.jumpto-bar {
    position: fixed;
    height: 75px;
    filter: drop-shadow(0 0 0.75rem #000);
    background-color: #fff;
    top:0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.jumpto-link {
    padding: 25px;
    transition: .25s;
    cursor: pointer;
    user-select: none;
}
.caught {
    cursor: pointer;
}
.x {
    transition: .25s;
}
.active {
    opacity: 1;
}
.inactive {
    opacity: 0;
}

@media screen and (max-width:767px) {
    .jumpto-bar {
        position: initial;
        flex-wrap: wrap;
        height: auto;
        filter: none;
    }
    td, th {
        font-size: .8em;
    }
    .table-container {
        min-width: 55%;
        max-width: 100%;
    }
}
</style>