<template>
    <div id="satellite-panel">
        <div class="row satellite-panel-top">
            <span id="satellite-name">{{ satelliteName }}</span>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            satelliteName: ''
        }
    }
};
</script>