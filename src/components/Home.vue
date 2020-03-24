<template>
    <div class="stuff">
        <div class="header">
            <h1>
                Animal Crossing: New Horizon Helper
            </h1>
        </div>

        <div class="main-content-wrapper">
            <div class="main-content">
                <h3>
                    Choose your topic:
                </h3>
                <div class="select-container">
                    <div class="custom-button" @click="choose('fish')">
                        Fish
                    </div>
                    <div class="custom-button" @click="choose('insects')">
                        Insects
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
export default {
    data() {
        return {
            choice: null
        }
    },
    methods: {
        choose(stuff) {
            this.choice = stuff;
            localStorage.setItem('last', stuff);
            this.$emit('choice', this.choice);
        }
    }
}
</script>
<style>
.stuff {
    background-image: url(../assets/hero-bg-desktop.jpg);
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: top;
    height: auto;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    min-height: 720px;
}

.main-content-wrapper {
    display: flex;
    justify-content: center;
    padding: 25px;
    width: 100%;
    flex-wrap: wrap;
}
.main-content {
    padding: 25px;
    background-color: rgba(255,255,255,.7);
    border-radius: 22px;
}

.header {
    position: relative;
    width: 60%;
    background-color: rgba(255,255,255,.8);
    border-radius: 22px;
}

h1, h3 {
    width: 100%;
}

.select-container {
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
}

.custom-button {
    border-radius:22px;
    padding: 20px 25px;
    min-width: 150px;
    margin: 5px;
    background-color: #C4161C;
    color: #FFE46A;
    cursor: pointer;
    font-size: 1.5em;
    transition: .25s;
    position: relative;
}
.wip {
    pointer-events: none;
}
.WIP {
    position: absolute;
    background-color: #222;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%) rotateZ(-17deg);
    width: 200px;
}
.custom-button:hover {
    background-color:  #FFE46A;
    color: #C4161C;
    user-select: none;
}
@media screen and (max-width:767px) {
    .select-container {
        flex-wrap: wrap;
    }
}
</style>